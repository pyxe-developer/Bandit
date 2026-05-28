import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type InputQuarantineValidationReport = {
  status: "pass";
  policy: typeof INPUT_QUARANTINE_POLICY_DISPLAY_PATH;
  source_classes: string[];
  release_authorized_paths: string[];
  trusted_source_gates: string[];
  trusted_local_repo_mode: string;
};

type RawRecord = Record<string, unknown>;

const INPUT_QUARANTINE_POLICY_DISPLAY_PATH =
  ".bandit/policy/input-quarantine.json";
const INPUT_QUARANTINE_TEMPLATE_DISPLAY_PATH =
  "docs/templates/input-quarantine-gate.md";
const TRUSTED_SOURCE_GATE_TEMPLATE_DISPLAY_PATH =
  "docs/templates/trusted-source-gate.md";

const SOURCE_CLASSES = [
  "trusted_local_repo",
  "external_contributor_text",
  "issue_or_pr_metadata",
  "review_comment",
  "dependency_documentation",
  "fetched_third_party_content",
  "generated_instruction",
  "fetched_prompt"
];
const EXTERNAL_SOURCE_CLASSES = SOURCE_CLASSES.filter(
  (sourceClass) => sourceClass !== "trusted_local_repo"
);
const REQUIRED_INPUT_QUARANTINE_TEMPLATE_FIELDS = [
  "source_identity",
  "source_class",
  "data_only_handling",
  "quarantine_boundary_evidence",
  "admitted_fields",
  "stripped_or_ignored_fields",
  "allowed_extraction_uses",
  "forbidden_instruction_bearing_uses",
  "owning_stage",
  "trusted_source_gate_refs",
  "freshness_or_expiry",
  "owner",
  "revocation_path"
];
const REQUIRED_TRUSTED_SOURCE_GATE_TEMPLATE_FIELDS = [
  "source_identity",
  "scope",
  "allowed_uses",
  "owner",
  "freshness_or_expiry_rule",
  "revocation_path",
  "trust_rationale",
  "evidence_artifact"
];
const REQUIRED_FORBIDDEN_INSTRUCTION_USES = [
  "agent_instructions",
  "tool_permissions",
  "routing_decisions",
  "landing_authority",
  "auto_landing_eligibility",
  "policy_authority",
  "gate_satisfaction"
];

export async function writeDefaultInputQuarantinePolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "input-quarantine",
    source_classes: SOURCE_CLASSES,
    trusted_local_repo_mode: {
      mode: "scoped_until_external_input_enters_release_authorized_path",
      applies_to_source_classes: ["trusted_local_repo"],
      terminates_when_source_classes_enter_context: EXTERNAL_SOURCE_CLASSES
    },
    release_authorized_paths: [],
    trusted_source_gates: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateInputQuarantineGate(
  repoRoot: string
): Promise<InputQuarantineValidationReport> {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.inputQuarantinePolicy,
    INPUT_QUARANTINE_POLICY_DISPLAY_PATH
  );
  const policy = parsePolicy(content);
  if (hasConfiguredInputQuarantineGate(policy)) {
    await validateTemplate(
      repoRoot,
      INPUT_QUARANTINE_TEMPLATE_DISPLAY_PATH,
      REQUIRED_INPUT_QUARANTINE_TEMPLATE_FIELDS
    );
    await validateTemplate(
      repoRoot,
      TRUSTED_SOURCE_GATE_TEMPLATE_DISPLAY_PATH,
      REQUIRED_TRUSTED_SOURCE_GATE_TEMPLATE_FIELDS
    );
  }
  const trustedLocalRepoMode = validateTrustedLocalRepoMode(
    policy.trusted_local_repo_mode
  );
  const trustedSourceGates = await validateTrustedSourceGates(
    repoRoot,
    policy.trusted_source_gates
  );
  const releaseAuthorizedPaths = await validateReleaseAuthorizedPaths(
    repoRoot,
    policy.release_authorized_paths,
    trustedSourceGates
  );

  return {
    status: "pass",
    policy: INPUT_QUARANTINE_POLICY_DISPLAY_PATH,
    source_classes: policy.source_classes,
    release_authorized_paths: releaseAuthorizedPaths,
    trusted_source_gates: [...trustedSourceGates.keys()],
    trusted_local_repo_mode: trustedLocalRepoMode
  };
}

function hasConfiguredInputQuarantineGate(policy: {
  release_authorized_paths: RawRecord[];
  trusted_source_gates: RawRecord[];
}) {
  return (
    policy.release_authorized_paths.length > 0 ||
    policy.trusted_source_gates.length > 0
  );
}

function parsePolicy(content: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed input quarantine policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error("Malformed input quarantine policy: missing contract_version 1");
  }

  if (parsed.policy_id !== "input-quarantine") {
    throw new Error(
      "Malformed input quarantine policy: policy_id must be input-quarantine"
    );
  }

  const sourceClasses = requireStringList(
    parsed,
    "source_classes",
    "input quarantine policy"
  );
  for (const sourceClass of sourceClasses) {
    validateSourceClass(sourceClass);
  }
  for (const sourceClass of SOURCE_CLASSES) {
    if (!sourceClasses.includes(sourceClass)) {
      throw new Error(
        `Malformed input quarantine policy: source_classes must include ${sourceClass}`
      );
    }
  }

  return {
    source_classes: sourceClasses,
    trusted_local_repo_mode: requireObject(
      parsed,
      "trusted_local_repo_mode",
      "input quarantine policy"
    ),
    release_authorized_paths: requireRecordList(
      parsed,
      "release_authorized_paths",
      "input quarantine policy"
    ),
    trusted_source_gates: requireRecordList(
      parsed,
      "trusted_source_gates",
      "input quarantine policy"
    )
  };
}

function validateTrustedLocalRepoMode(mode: RawRecord) {
  const value = requireString(mode, "mode", "Trusted Local Repo Mode");
  if (value !== "scoped_until_external_input_enters_release_authorized_path") {
    throw new Error(
      "Trusted Local Repo Mode must be scoped_until_external_input_enters_release_authorized_path"
    );
  }

  const appliesToSourceClasses = requireStringList(
    mode,
    "applies_to_source_classes",
    "Trusted Local Repo Mode"
  );
  if (
    appliesToSourceClasses.some((sourceClass) =>
      EXTERNAL_SOURCE_CLASSES.includes(sourceClass)
    )
  ) {
    throw new Error(
      "Trusted Local Repo Mode must not trust external or third-party source classes"
    );
  }
  if (!appliesToSourceClasses.includes("trusted_local_repo")) {
    throw new Error("Trusted Local Repo Mode must include trusted_local_repo");
  }

  const terminators = requireStringList(
    mode,
    "terminates_when_source_classes_enter_context",
    "Trusted Local Repo Mode"
  );
  for (const sourceClass of EXTERNAL_SOURCE_CLASSES) {
    if (!terminators.includes(sourceClass)) {
      throw new Error(
        `Trusted Local Repo Mode must terminate when ${sourceClass} enters release-authorized context`
      );
    }
  }

  return value;
}

async function validateTrustedSourceGates(
  repoRoot: string,
  gates: RawRecord[]
) {
  const trustedSourceGates = new Map<string, RawRecord>();

  for (const gate of gates) {
    const gateId = requireString(gate, "gate_id", "Trusted Source Gate");
    for (const field of [
      "source_identity",
      "source_class",
      "scope",
      "owner",
      "freshness_or_expiry_rule",
      "revocation_path",
      "trust_rationale",
      "evidence_artifact"
    ]) {
      requireTrustedSourceGateString(gate, gateId, field);
    }

    validateSourceClass(String(gate.source_class));
    requireNonBlankStringList(gate, "allowed_uses", `Trusted Source Gate ${gateId}`);
    rejectBlanketTrust(gate, gateId);
    await requireExistingRepoFile(
      repoRoot,
      String(gate.evidence_artifact),
      `Trusted Source Gate ${gateId} missing evidence_artifact file`
    );
    await requireExistingRepoFile(
      repoRoot,
      String(gate.revocation_path),
      `Trusted Source Gate ${gateId} missing revocation_path file`
    );

    if (trustedSourceGates.has(gateId)) {
      throw new Error(`Trusted Source Gate ${gateId} is duplicated`);
    }
    trustedSourceGates.set(gateId, gate);
  }

  return trustedSourceGates;
}

async function validateReleaseAuthorizedPaths(
  repoRoot: string,
  releaseAuthorizedPaths: RawRecord[],
  trustedSourceGates: Map<string, RawRecord>
) {
  const pathIds: string[] = [];

  for (const releasePath of releaseAuthorizedPaths) {
    const pathId = requireString(
      releasePath,
      "path_id",
      "input quarantine path"
    );
    const sourceIdentity = requireString(
      releasePath,
      "source_identity",
      `input quarantine path ${pathId}`
    );
    const sourceClass = pathSourceClass(releasePath, pathId);
    requireString(releasePath, "owning_stage", `input quarantine path ${pathId}`);

    const inputHandling = requireObject(
      releasePath,
      "input_handling",
      `input quarantine path ${pathId}`
    );
    const inputHandlingMode = requireString(
      inputHandling,
      "mode",
      `input quarantine path ${pathId}`
    );
    if (
      EXTERNAL_SOURCE_CLASSES.includes(sourceClass) &&
      inputHandlingMode !== "data_only"
    ) {
      throw new Error(
        "external and third-party inputs must be data_only before release-authorized context"
      );
    }
    validateInputHandling(inputHandling, pathId);

    const quarantineBoundary = requireObject(
      releasePath,
      "quarantine_boundary",
      `input quarantine path ${pathId}`
    );
    const evidencePath = optionalString(quarantineBoundary, "evidence_path");
    if (!evidencePath) {
      throw new Error(
        `input quarantine path ${pathId} requires quarantine boundary evidence_path`
      );
    }
    requireString(
      quarantineBoundary,
      "owner",
      `input quarantine path ${pathId} quarantine boundary`
    );
    await requireExistingRepoFile(
      repoRoot,
      evidencePath,
      `input quarantine path ${pathId} missing quarantine boundary evidence_path`
    );

    validateInstructionBearingUse(
      releasePath,
      pathId,
      sourceIdentity,
      sourceClass,
      trustedSourceGates
    );
    pathIds.push(pathId);
  }

  return pathIds;
}

function pathSourceClass(releasePath: RawRecord, pathId: string) {
  const sourceClass = optionalString(releasePath, "source_class");
  if (!sourceClass) {
    throw new Error(
      `input quarantine path ${pathId} must classify source_class`
    );
  }
  validateSourceClass(sourceClass);
  return sourceClass;
}

function validateInputHandling(inputHandling: RawRecord, pathId: string) {
  requireNonBlankStringList(
    inputHandling,
    "admitted_fields",
    `input quarantine path ${pathId}`
  );
  requireNonBlankStringList(
    inputHandling,
    "stripped_or_ignored_fields",
    `input quarantine path ${pathId}`
  );
  requireNonBlankStringList(
    inputHandling,
    "allowed_extraction_uses",
    `input quarantine path ${pathId}`
  );
  const forbiddenUses = requireNonBlankStringList(
    inputHandling,
    "forbidden_instruction_bearing_uses",
    `input quarantine path ${pathId}`
  );
  for (const forbiddenUse of REQUIRED_FORBIDDEN_INSTRUCTION_USES) {
    if (!forbiddenUses.includes(forbiddenUse)) {
      throw new Error(
        `input quarantine path ${pathId} must forbid ${forbiddenUse}`
      );
    }
  }
}

function validateInstructionBearingUse(
  releasePath: RawRecord,
  pathId: string,
  sourceIdentity: string,
  sourceClass: string,
  trustedSourceGates: Map<string, RawRecord>
) {
  if (releasePath.instruction_bearing_use !== true) {
    return;
  }

  const gateRef = optionalString(releasePath, "trusted_source_gate_ref");
  if (!gateRef) {
    throw new Error(
      "instruction-bearing use requires a bounded Trusted Source Gate"
    );
  }

  const gate = trustedSourceGates.get(gateRef);
  if (!gate) {
    throw new Error(
      "instruction-bearing use requires a bounded Trusted Source Gate"
    );
  }
  if (gate.source_identity !== sourceIdentity || gate.source_class !== sourceClass) {
    throw new Error(
      `Trusted Source Gate ${gateRef} must match path ${pathId} source identity and class`
    );
  }
}

function requireTrustedSourceGateString(
  gate: RawRecord,
  gateId: string,
  field: string
) {
  const value = gate[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Trusted Source Gate ${gateId} missing required field: ${field}`
    );
  }
  return value.trim();
}

function validateSourceClass(sourceClass: string) {
  if (!SOURCE_CLASSES.includes(sourceClass)) {
    throw new Error(`unknown input source class: ${sourceClass}`);
  }
}

function rejectBlanketTrust(gate: RawRecord, gateId: string) {
  const freshnessRule = String(gate.freshness_or_expiry_rule);
  const scope = String(gate.scope).toLowerCase();
  const rationale = String(gate.trust_rationale).toLowerCase();
  const allowedUses = requireNonBlankStringList(
    gate,
    "allowed_uses",
    `Trusted Source Gate ${gateId}`
  );

  if (
    freshnessRule === "permanent" ||
    scope.includes("blanket") ||
    scope.includes("raw context") ||
    rationale.includes("source reputation") ||
    allowedUses.some((use) => ["all", "any", "*"].includes(use))
  ) {
    throw new Error(`Trusted Source Gate ${gateId} is not bounded`);
  }
}

async function validateTemplate(
  repoRoot: string,
  displayPath: string,
  requiredFields: string[]
) {
  const content = await readRequiredTemplateFile(
    path.join(repoRoot, displayPath),
    displayPath
  );
  const missingFields = requiredFields.filter(
    (field) => !new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)
  );

  if (missingFields.length > 0) {
    const missing = missingFields
      .map((field) => `missing required field: ${field}`)
      .join("; ");
    throw new Error(`Malformed template: ${displayPath}; ${missing}`);
  }
}

function requireString(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context} missing required field: ${field}`);
  }
  return value.trim();
}

function optionalString(record: RawRecord, field: string) {
  const value = record[field];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function requireObject(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (!isRecord(value)) {
    throw new Error(`${context} missing required object: ${field}`);
  }
  return value;
}

function requireRecordList(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (!Array.isArray(value) || !value.every((item) => isRecord(item))) {
    throw new Error(`${context} ${field} must be an array of objects`);
  }
  return value;
}

function requireStringList(record: RawRecord, field: string, context: string) {
  const value = record[field];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`${context} ${field} must be a string list`);
  }
  return value.map((item) => item.trim());
}

function requireNonBlankStringList(
  record: RawRecord,
  field: string,
  context: string
) {
  const values = requireStringList(record, field, context);
  if (values.length === 0 || values.some((value) => value.length === 0)) {
    throw new Error(`${context} ${field} must be a non-empty string list`);
  }
  return values;
}

async function requireExistingRepoFile(
  repoRoot: string,
  displayPath: string,
  message: string
) {
  if (
    path.isAbsolute(displayPath) ||
    displayPath.includes("\0") ||
    displayPath.split(/[\\/]+/).includes("..")
  ) {
    throw new Error(`${message}: path must be repo-addressable`);
  }

  try {
    await stat(path.join(repoRoot, displayPath));
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(message);
    }
    throw error;
  }
}

async function readRequiredPolicyFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${displayPath}`);
    }
    throw error;
  }
}

async function readRequiredTemplateFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${displayPath}`);
    }
    throw error;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
