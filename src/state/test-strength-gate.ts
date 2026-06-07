import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseMetadataFields, readList, readScalar } from "./metadata.js";
import { getBanditPaths } from "./paths.js";
import { readWorkItem, readWorkItems, type WorkItem } from "./work-items.js";

export type TestStrengthGateReport = {
  status: "pass";
  policy: typeof TEST_STRENGTH_POLICY_DISPLAY_PATH;
  checked_work_items: string[];
};

type TestStrengthPolicy = {
  coveredSurfaces: string[];
  acceptableEvidenceModes: string[];
  highRiskRequiresEvidence: boolean;
};

type CoveredSurfaceContext = {
  workItemId: string;
  riskTier: string;
  strategy: string;
  coveredSurfaces: string[];
};

type RawRecord = Record<string, unknown>;

const TEST_STRENGTH_POLICY_DISPLAY_PATH =
  ".bandit/policy/test-strength-gate.json";

const DEFAULT_COVERED_SURFACES = [
  "landing-gate",
  "review-routing",
  "claim-authority",
  "state-transition",
  "artifact-validator",
  "evidence-freshness",
  "role-coordination",
  "serializer",
  "guarded-authority-boundary"
];

const ACCEPTABLE_EVIDENCE_MODES = [
  "mutation",
  "property_fault_injection",
  "table_driven_adversarial",
  "explicit_disposition"
];

const EVIDENCE_MODE_REQUIRED_SCALARS: Record<string, string[]> = {
  mutation: [
    "target_surface",
    "command",
    "score",
    "threshold",
    "surviving_mutant_disposition",
    "excluded_mutants",
    "freshness_source"
  ],
  property_fault_injection: [
    "target_surface",
    "command",
    "invariants",
    "generated_state_space",
    "injected_failures",
    "replay_determinism",
    "freshness_source"
  ],
  table_driven_adversarial: [
    "target_surface",
    "command",
    "sufficiency_rationale",
    "freshness_source"
  ],
  explicit_disposition: ["target_surface", "disposition_rationale"]
};

const EVIDENCE_MODE_REQUIRED_LISTS: Record<string, string[]> = {
  mutation: ["wrong_behaviors_rejected"],
  property_fault_injection: ["wrong_behavior_classes_rejected"],
  table_driven_adversarial: [
    "adversarial_cases",
    "targeted_wrong_implementations"
  ],
  explicit_disposition: []
};

export async function writeDefaultTestStrengthGatePolicy(filePath: string) {
  const policy = {
    version: 1,
    covered_surfaces: DEFAULT_COVERED_SURFACES,
    acceptable_evidence_modes: ACCEPTABLE_EVIDENCE_MODES,
    risk_tiers: {
      high: {
        require_test_strength_evidence: true
      }
    }
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateTestStrengthGate(
  repoRoot: string,
  workItemId?: string
): Promise<TestStrengthGateReport> {
  const policy = await readTestStrengthPolicy(repoRoot);
  const workItems = workItemId
    ? [await readWorkItem(repoRoot, workItemId)]
    : await readWorkItems(repoRoot);

  const problems: string[] = [];
  const checked: string[] = [];

  for (const workItem of workItems) {
    const context = parseCoveredSurfaceContext(workItem);
    if (!gateApplies(context, policy)) {
      continue;
    }

    checked.push(context.workItemId);
    problems.push(...(await validateWorkItem(repoRoot, context, policy)));
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return {
    status: "pass",
    policy: TEST_STRENGTH_POLICY_DISPLAY_PATH,
    checked_work_items: checked
  };
}

export async function landingTestStrengthProblems(
  repoRoot: string,
  workItemId: string
): Promise<string[]> {
  const policy = await readTestStrengthPolicy(repoRoot);
  const workItem = await readWorkItem(repoRoot, workItemId);
  const context = parseCoveredSurfaceContext(workItem);

  if (!gateApplies(context, policy)) {
    return [];
  }

  const evidence = await readOptionalTestStrengthEvidence(repoRoot, workItemId);
  const problems: string[] = [];

  for (const surface of context.coveredSurfaces) {
    if (!hasCurrentEvidenceForSurface(evidence, surface, policy)) {
      problems.push(
        `safe-to-land requires current test-strength evidence for covered surface ${surface}`
      );
    }
  }

  return problems;
}

async function validateWorkItem(
  repoRoot: string,
  context: CoveredSurfaceContext,
  policy: TestStrengthPolicy
): Promise<string[]> {
  const problems: string[] = [];
  const coveredList = context.coveredSurfaces.join(", ");

  if (!context.strategy) {
    problems.push(
      `${context.workItemId}: covered high-risk surfaces (${coveredList}) are missing test-strength strategy or explicit disposition`
    );
    return problems;
  }

  if (!policy.acceptableEvidenceModes.includes(context.strategy)) {
    problems.push(
      `${context.workItemId}: unsupported test-strength strategy ${context.strategy}`
    );
  }

  const redEvidence = await readOptionalEvidenceFile(
    repoRoot,
    context.workItemId,
    "red-evidence.md"
  );
  if (redEvidence) {
    problems.push(...redEvidenceProblems(context.workItemId, redEvidence));
  }

  const strengthEvidence = await readOptionalEvidenceFile(
    repoRoot,
    context.workItemId,
    "test-strength-evidence.md"
  );
  if (strengthEvidence) {
    problems.push(
      ...strengthEvidenceProblems(context.workItemId, strengthEvidence, policy)
    );
  }

  return problems;
}

function redEvidenceProblems(workItemId: string, content: string): string[] {
  const fields = parseMetadataFields(content);
  const problems: string[] = [];

  for (const field of ["intended_failure_reason", "assertion_adequacy_mapping"]) {
    if (!hasFieldValue(fields, field)) {
      problems.push(`${workItemId} RED evidence missing ${field}`);
    }
  }

  return problems;
}

function strengthEvidenceProblems(
  workItemId: string,
  content: string,
  policy: TestStrengthPolicy
): string[] {
  const fields = parseMetadataFields(content);
  const mode = readScalar(fields, "mode");
  const problems: string[] = [];

  if (!mode) {
    problems.push(`${workItemId} test-strength evidence missing mode`);
    return problems;
  }

  if (!policy.acceptableEvidenceModes.includes(mode)) {
    problems.push(
      `${workItemId} test-strength evidence has unsupported mode ${mode}`
    );
    return problems;
  }

  for (const field of EVIDENCE_MODE_REQUIRED_SCALARS[mode] ?? []) {
    if (!readScalar(fields, field)) {
      problems.push(
        `${workItemId} ${mode} evidence missing ${field}`
      );
    }
  }

  for (const field of EVIDENCE_MODE_REQUIRED_LISTS[mode] ?? []) {
    if (readList(fields, field).length === 0) {
      problems.push(
        `${workItemId} ${mode} evidence missing ${field}`
      );
    }
  }

  return problems;
}

function hasCurrentEvidenceForSurface(
  content: string | null,
  surface: string,
  policy: TestStrengthPolicy
): boolean {
  if (!content) {
    return false;
  }

  const fields = parseMetadataFields(content);
  const mode = readScalar(fields, "mode");
  if (!policy.acceptableEvidenceModes.includes(mode)) {
    return false;
  }

  if (readScalar(fields, "target_surface") !== surface) {
    return false;
  }

  if (mode !== "explicit_disposition" && !readScalar(fields, "freshness_source")) {
    return false;
  }

  return true;
}

function gateApplies(
  context: CoveredSurfaceContext,
  policy: TestStrengthPolicy
): boolean {
  return (
    policy.highRiskRequiresEvidence &&
    context.riskTier === "high" &&
    context.coveredSurfaces.length > 0
  );
}

function parseCoveredSurfaceContext(workItem: WorkItem): CoveredSurfaceContext {
  const fields = parseMetadataFields(workItem.content);

  return {
    workItemId: workItem.id,
    riskTier: readScalar(fields, "risk_tier"),
    strategy: readScalar(fields, "test_strength_strategy"),
    coveredSurfaces: readList(fields, "covered_test_strength_surfaces")
  };
}

function hasFieldValue(
  fields: ReturnType<typeof parseMetadataFields>,
  field: string
): boolean {
  return readScalar(fields, field).length > 0 || readList(fields, field).length > 0;
}

async function readOptionalTestStrengthEvidence(
  repoRoot: string,
  workItemId: string
): Promise<string | null> {
  return readOptionalEvidenceFile(
    repoRoot,
    workItemId,
    "test-strength-evidence.md"
  );
}

async function readOptionalEvidenceFile(
  repoRoot: string,
  workItemId: string,
  fileName: string
): Promise<string | null> {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, fileName),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readTestStrengthPolicy(
  repoRoot: string
): Promise<TestStrengthPolicy> {
  const paths = getBanditPaths(repoRoot);
  let content: string;
  try {
    content = await readFile(paths.testStrengthGatePolicy, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(
        `Missing required policy: ${TEST_STRENGTH_POLICY_DISPLAY_PATH}`
      );
    }
    throw error;
  }

  return parseTestStrengthPolicy(content);
}

function parseTestStrengthPolicy(content: string): TestStrengthPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed test-strength gate policy: invalid JSON");
  }

  if (!isRecord(parsed)) {
    throw new Error("Malformed test-strength gate policy: expected object");
  }

  const riskTiers = isRecord(parsed.risk_tiers) ? parsed.risk_tiers : {};
  const highTier = isRecord(riskTiers.high) ? riskTiers.high : {};

  return {
    coveredSurfaces: readStringList(parsed.covered_surfaces),
    acceptableEvidenceModes: readStringList(parsed.acceptable_evidence_modes),
    highRiskRequiresEvidence: highTier.require_test_strength_evidence === true
  };
}

function readStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
