import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH =
  ".bandit/policy/gate-determinism-flake-gate.json" as const;
const PROVIDER_DEPENDENT_EVIDENCE_CLASS = "provider_dependent";
const LOCAL_QWEN_PROVIDER = "local_qwen";
const DIRECT_QWEN_CLI_ROUTE = "direct_qwen_cli";
const AUTHORIZED_LOCAL_QWEN_REVIEWER = ".bandit/reviewers/local-qwen.json";
const AUTHORIZED_LOCAL_QWEN_ADAPTER = "bin/omlx-chat-completions.mjs";

export type GateDeterminismFlakeGateReport = {
  status: "pass";
  policy: typeof POLICY_DISPLAY_PATH;
  covered_gate_count: number;
  covered_gates: CoveredGateReport[];
  external_evidence: ExternalEvidenceReport[];
  nondeterminism_dispositions: string[];
};

type CoveredGateReport = {
  id: string;
  command: string;
  output_hash: string;
  repeat_runs: number;
  status: "pass";
};

type ExternalEvidenceReport = {
  id: string;
  evidence_class: string;
  provider: string;
  availability_disposition: string;
  replaces_deterministic_local_proof: boolean;
  status: "pass";
};

type ParsedPolicy = {
  coveredGates: ParsedCoveredGate[];
  externalEvidence: ParsedExternalEvidence[];
  nondeterminismSources: ParsedNondeterminismSource[];
  nondeterminismDispositions: ParsedDisposition[];
};

type ParsedCoveredGate = {
  id: string;
  command: string;
  expectedHash: string;
  repeatRunOutputs: unknown[];
};

type ParsedExternalEvidence = {
  id: string;
  evidenceClass: string;
  provider: string;
  route: string;
  capturedAt: string;
  freshnessExpiresAt: string;
  availabilityDisposition: string;
  replacesDeterministicLocalProof: boolean;
};

type ParsedNondeterminismSource = {
  id: string;
  dispositionId: string;
};

type ParsedDisposition = {
  id: string;
};

type RawRecord = Record<string, unknown>;

// The validator reads recorded determinism attestations from the policy. It
// never executes the covered commands; the policy carries the repeat-run output
// snapshots so the gate stays deterministic and read-only against repo state.
export async function validateGateDeterminismFlakeGate(
  repoRoot: string
): Promise<GateDeterminismFlakeGateReport> {
  const policy = await readPolicy(path.join(repoRoot, POLICY_DISPLAY_PATH));
  const problems: string[] = [];

  const coveredGates = checkCoveredGates(policy.coveredGates, problems);
  const externalEvidence = checkExternalEvidence(
    policy.externalEvidence,
    problems
  );
  checkNondeterminismDispositions(
    policy.nondeterminismSources,
    policy.nondeterminismDispositions,
    problems
  );

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    covered_gate_count: coveredGates.length,
    covered_gates: coveredGates,
    external_evidence: externalEvidence,
    nondeterminism_dispositions: policy.nondeterminismDispositions
      .map((disposition) => disposition.id)
      .sort()
  };
}

function checkCoveredGates(
  gates: ParsedCoveredGate[],
  problems: string[]
): CoveredGateReport[] {
  const reports: CoveredGateReport[] = [];

  for (const gate of gates) {
    const runHashes = gate.repeatRunOutputs.map(stableHash);
    const stableAcrossRuns =
      runHashes.length > 0 &&
      runHashes.every((hash) => hash === gate.expectedHash);

    if (!stableAcrossRuns) {
      problems.push(
        `${gate.id}: unstable output across repeat runs (output hash drift)`
      );
      continue;
    }

    reports.push({
      id: gate.id,
      command: gate.command,
      output_hash: gate.expectedHash,
      repeat_runs: gate.repeatRunOutputs.length,
      status: "pass"
    });
  }

  reports.sort((a, b) => a.id.localeCompare(b.id));
  return reports;
}

function checkExternalEvidence(
  evidence: ParsedExternalEvidence[],
  problems: string[]
): ExternalEvidenceReport[] {
  const reports: ExternalEvidenceReport[] = [];

  for (const item of evidence) {
    if (item.evidenceClass === PROVIDER_DEPENDENT_EVIDENCE_CLASS) {
      collectProviderEvidenceProblems(item, problems);
    }

    reports.push({
      id: item.id,
      evidence_class: item.evidenceClass,
      provider: item.provider,
      availability_disposition: item.availabilityDisposition,
      replaces_deterministic_local_proof:
        item.replacesDeterministicLocalProof,
      status: "pass"
    });
  }

  reports.sort((a, b) => a.id.localeCompare(b.id));
  return reports;
}

function collectProviderEvidenceProblems(
  item: ParsedExternalEvidence,
  problems: string[]
): void {
  if (item.capturedAt.length === 0) {
    problems.push(`${item.id}: missing captured_at`);
  }
  if (item.freshnessExpiresAt.length === 0) {
    problems.push(`${item.id}: missing freshness.expires_at`);
  }
  if (item.availabilityDisposition.length === 0) {
    problems.push(`${item.id}: missing availability_disposition`);
  }
  if (item.replacesDeterministicLocalProof) {
    problems.push(
      `${item.id}: provider-dependent evidence cannot replace deterministic local proof`
    );
  }
  if (
    item.provider === LOCAL_QWEN_PROVIDER &&
    item.route === DIRECT_QWEN_CLI_ROUTE
  ) {
    problems.push(
      `${item.id}: direct qwen CLI is not authorized; route Local Qwen evidence through ${AUTHORIZED_LOCAL_QWEN_REVIEWER} and ${AUTHORIZED_LOCAL_QWEN_ADAPTER}`
    );
  }
}

function checkNondeterminismDispositions(
  sources: ParsedNondeterminismSource[],
  dispositions: ParsedDisposition[],
  problems: string[]
): void {
  const dispositionIds = new Set(dispositions.map((d) => d.id));

  for (const source of sources) {
    if (!dispositionIds.has(source.dispositionId)) {
      problems.push(
        `${source.id}: missing nondeterminism disposition ${source.dispositionId}`
      );
    }
  }
}

async function readPolicy(policyPath: string): Promise<ParsedPolicy> {
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return emptyPolicy();
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed gate determinism flake gate policy: invalid JSON");
  }

  if (!isRecord(parsed)) {
    throw new Error("Malformed gate determinism flake gate policy: expected object");
  }

  return {
    coveredGates: parseCoveredGates(parsed.covered_gates),
    externalEvidence: parseExternalEvidence(parsed.external_evidence),
    nondeterminismSources: parseNondeterminismSources(
      parsed.nondeterminism_sources
    ),
    nondeterminismDispositions: parseDispositions(
      parsed.nondeterminism_dispositions
    )
  };
}

function parseCoveredGates(value: unknown): ParsedCoveredGate[] {
  return asRecordArray(value).map((raw) => ({
    id: asString(raw.id),
    command: asString(raw.command),
    expectedHash: asString(raw.expected_hash),
    repeatRunOutputs: asRecordArray(raw.repeat_runs).map(
      (run) => run.stdout_json
    )
  }));
}

function parseExternalEvidence(value: unknown): ParsedExternalEvidence[] {
  return asRecordArray(value).map((raw) => {
    const freshness = isRecord(raw.freshness) ? raw.freshness : {};
    return {
      id: asString(raw.id),
      evidenceClass: asString(raw.evidence_class),
      provider: asString(raw.provider),
      route: asString(raw.route),
      capturedAt: asString(raw.captured_at),
      freshnessExpiresAt: asString(freshness.expires_at),
      availabilityDisposition: asString(raw.availability_disposition),
      replacesDeterministicLocalProof:
        raw.replaces_deterministic_local_proof === true
    };
  });
}

function parseNondeterminismSources(
  value: unknown
): ParsedNondeterminismSource[] {
  return asRecordArray(value).map((raw) => ({
    id: asString(raw.id),
    dispositionId: asString(raw.disposition_id)
  }));
}

function parseDispositions(value: unknown): ParsedDisposition[] {
  return asRecordArray(value)
    .map((raw) => ({ id: asString(raw.id) }))
    .filter((disposition) => disposition.id.length > 0);
}

function emptyPolicy(): ParsedPolicy {
  return {
    coveredGates: [],
    externalEvidence: [],
    nondeterminismSources: [],
    nondeterminismDispositions: []
  };
}

export async function writeDefaultGateDeterminismFlakeGatePolicy(
  filePath: string
): Promise<void> {
  const policy = {
    version: 1,
    command_version: 1,
    determinism_critical_gates: ["cockpit-status", "session-context", "validate"],
    allowed_nondeterminism_sources: [
      "provider_dependent_evidence",
      "wall_clock_sensitive",
      "flaky_test",
      "unavailable_external_reviewer"
    ],
    covered_gates: [],
    nondeterminism_sources: [],
    nondeterminism_dispositions: [],
    external_evidence: []
  };
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

// Canonical JSON: sorted object keys with array order preserved, so identical
// repo state yields byte-identical machine-readable output across repeat runs.
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortObjectKeys(value), null, 2);
}

function stableHash(value: unknown): string {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(sortObjectKeys(value)))
    .digest("hex")}`;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortObjectKeys(value[key])])
    );
  }
  return value;
}

function asRecordArray(value: unknown): RawRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
