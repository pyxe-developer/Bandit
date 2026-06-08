import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH =
  ".bandit/policy/replay-regression-corpus.json" as const;
const SUPPORTED_SCHEMA_VERSION = 1;

export type ReplayRegressionCorpusReport = {
  status: "pass";
  policy: typeof POLICY_DISPLAY_PATH;
  packet_count: number;
  covered_failure_modes: string[];
  dispositioned_failure_modes: string[];
  packets: PacketSummary[];
  replay_only: {
    read_only: true;
    no_live_routing: true;
    no_policy_promotion: true;
  };
};

type PacketSummary = {
  id: string;
  failure_mode: string;
  source_artifacts: string[];
  expected_gate: string;
  expected_verdict: string;
  actual_verdict: string;
  diagnostics: string[];
};

type Policy = {
  required_failure_modes: string[];
  expected_gates: string[];
  expected_verdicts: string[];
  failure_mode_dispositions: Array<{ failure_mode: string }>;
};

type RawRecord = Record<string, unknown>;

const DEFAULT_DISPOSITIONS = [
  {
    failure_mode: "dropped_bootstrap_metadata",
    disposition: "explicit_no_action",
    source_artifact: "docs/work/BANDIT-072/brief.md",
    rationale:
      "dropped_bootstrap_metadata is acknowledged in this focused replay fixture set"
  },
  {
    failure_mode: "parser_wording_drift",
    disposition: "explicit_no_action",
    source_artifact: "docs/work/BANDIT-072/brief.md",
    rationale:
      "parser_wording_drift is acknowledged in this focused replay fixture set"
  },
  {
    failure_mode: "weak_reviewer_disposition",
    disposition: "explicit_no_action",
    source_artifact: "docs/work/BANDIT-072/brief.md",
    rationale:
      "weak_reviewer_disposition is acknowledged in this focused replay fixture set"
  },
  {
    failure_mode: "stale_routing_text",
    disposition: "explicit_no_action",
    source_artifact: "docs/work/BANDIT-072/brief.md",
    rationale:
      "stale_routing_text is acknowledged in this focused replay fixture set"
  }
];

export async function writeDefaultReplayRegressionCorpusPolicy(
  filePath: string
) {
  const policy = {
    version: 1,
    packet_schema_version: 1,
    command_version: 1,
    required_failure_modes: [
      "stale_review_subject_hash",
      "provider_timeout_refusal",
      "dirty_worktree",
      "dropped_bootstrap_metadata",
      "parser_wording_drift",
      "weak_reviewer_disposition",
      "stale_routing_text"
    ],
    expected_verdicts: ["pass", "blocker", "non_blocking", "bootstrap_gap"],
    expected_gates: [
      "stage4_review",
      "stage5_landing",
      "coordination_validate",
      "session_context",
      "reviewer_runtime"
    ],
    replay_only: {
      read_only: true,
      no_live_routing: true,
      no_policy_promotion: true
    },
    failure_mode_dispositions: DEFAULT_DISPOSITIONS
  };
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateReplayRegressionCorpus(
  repoRoot: string
): Promise<ReplayRegressionCorpusReport> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  const policy = await readPolicy(policyPath);
  const rawPackets = await loadPackets(repoRoot);

  const problems: string[] = [];
  const packetSummaries: PacketSummary[] = [];
  const coveredModes = new Set<string>();

  for (const raw of rawPackets) {
    const id = typeof raw.id === "string" ? raw.id : "(unknown)";
    const structuralErrors = validatePacketStructure(raw, id);
    if (structuralErrors.length > 0) {
      problems.push(...structuralErrors);
      continue;
    }

    const failureMode = raw.failure_mode as string;
    const taxonomyErrors = validatePacketTaxonomy(raw, id, policy);
    if (taxonomyErrors.length > 0) {
      problems.push(...taxonomyErrors);
      continue;
    }
    const sourceArtifacts = raw.source_artifacts as string[];
    const expectedGate = raw.expected_gate as string;
    const expectedVerdict = raw.expected_verdict as string;
    const simGate = raw.simulated_gate as RawRecord;
    const actualVerdict = simGate.verdict as string;
    const diagnostics = simGate.diagnostics as string[];

    coveredModes.add(failureMode);

    if (expectedVerdict !== actualVerdict) {
      problems.push(
        `${id}: expected verdict ${expectedVerdict} but replay produced ${actualVerdict}`,
        `${id}: known failure mode would not fail closed`
      );
    }

    packetSummaries.push({
      id,
      failure_mode: failureMode,
      source_artifacts: sourceArtifacts,
      expected_gate: expectedGate,
      expected_verdict: expectedVerdict,
      actual_verdict: actualVerdict,
      diagnostics
    });
  }

  const dispositionedModes = new Set(
    policy.failure_mode_dispositions.map((d) => d.failure_mode)
  );

  for (const mode of policy.required_failure_modes) {
    if (!coveredModes.has(mode) && !dispositionedModes.has(mode)) {
      problems.push(
        `required failure mode ${mode} is missing a replay packet or explicit disposition`
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  packetSummaries.sort((a, b) => a.id.localeCompare(b.id));

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    packet_count: packetSummaries.length,
    covered_failure_modes: [...coveredModes].sort(),
    dispositioned_failure_modes: [...dispositionedModes].sort(),
    packets: packetSummaries,
    replay_only: {
      read_only: true,
      no_live_routing: true,
      no_policy_promotion: true
    }
  };
}

function validatePacketStructure(raw: RawRecord, id: string): string[] {
  const errors: string[] = [];

  if (raw.schema_version !== SUPPORTED_SCHEMA_VERSION) {
    errors.push(`${id}: unsupported schema_version ${raw.schema_version}`);
  }

  if (
    !Array.isArray(raw.source_artifacts) ||
    (raw.source_artifacts as unknown[]).length === 0
  ) {
    errors.push(`${id}: missing source_artifacts`);
  }

  if (raw.policy_version === undefined || raw.policy_version === null) {
    errors.push(`${id}: missing policy_version`);
  }

  if (
    typeof raw.failure_mode !== "string" ||
    raw.failure_mode.length === 0
  ) {
    errors.push(`${id}: missing failure_mode`);
  }

  if (
    typeof raw.expected_gate !== "string" ||
    raw.expected_gate.length === 0
  ) {
    errors.push(`${id}: missing expected_gate`);
  }

  if (
    typeof raw.expected_verdict !== "string" ||
    raw.expected_verdict.length === 0
  ) {
    errors.push(`${id}: missing expected_verdict`);
  }

  if (raw.command_version === undefined || raw.command_version === null) {
    errors.push(`${id}: missing command_version`);
  }

  const replayOnly = isRecord(raw.replay_only) ? raw.replay_only : {};
  if (replayOnly.read_only !== true) {
    errors.push(`${id}: replay_only.read_only must be true`);
  }
  if (replayOnly.no_live_routing !== true) {
    errors.push(`${id}: replay_only.no_live_routing must be true`);
  }
  if (replayOnly.no_policy_promotion !== true) {
    errors.push(`${id}: replay_only.no_policy_promotion must be true`);
  }

  const simGate = isRecord(raw.simulated_gate) ? raw.simulated_gate : {};
  const diagnostics = simGate.diagnostics;
  if (!Array.isArray(diagnostics) || diagnostics.length === 0) {
    errors.push(
      `${id}: simulated_gate.diagnostics must list at least one diagnostic`
    );
  }

  return errors;
}

function validatePacketTaxonomy(
  raw: RawRecord,
  id: string,
  policy: Policy
): string[] {
  const errors: string[] = [];
  const failureMode = raw.failure_mode as string;
  const expectedGate = raw.expected_gate as string;
  const expectedVerdict = raw.expected_verdict as string;

  if (!policy.required_failure_modes.includes(failureMode)) {
    errors.push(
      `${id}: failure_mode ${failureMode} is not in policy required_failure_modes`
    );
  }
  if (!policy.expected_gates.includes(expectedGate)) {
    errors.push(
      `${id}: expected_gate ${expectedGate} is not in policy expected_gates`
    );
  }
  if (!policy.expected_verdicts.includes(expectedVerdict)) {
    errors.push(
      `${id}: expected_verdict ${expectedVerdict} is not in policy expected_verdicts`
    );
  }
  return errors;
}

async function readPolicy(policyPath: string): Promise<Policy> {
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      "Malformed replay regression corpus policy: invalid JSON"
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      "Malformed replay regression corpus policy: expected object"
    );
  }

  return {
    required_failure_modes: readStringList(parsed.required_failure_modes),
    expected_gates: readStringList(parsed.expected_gates),
    expected_verdicts: readStringList(parsed.expected_verdicts),
    failure_mode_dispositions: readDispositions(
      parsed.failure_mode_dispositions
    )
  };
}

async function loadPackets(repoRoot: string): Promise<RawRecord[]> {
  const packetDir = path.join(repoRoot, "docs/replay-packets");
  let files: string[];
  try {
    files = await readdir(packetDir);
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }

  const packets: RawRecord[] = [];
  for (const file of files.filter((f) => f.endsWith(".json")).sort()) {
    const content = await readFile(path.join(packetDir, file), "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error(`Malformed replay packet ${file}: invalid JSON`);
    }
    if (isRecord(parsed)) {
      packets.push(parsed);
    }
  }
  return packets;
}

function readDispositions(
  value: unknown
): Array<{ failure_mode: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .filter(
      (d): d is RawRecord & { failure_mode: string } =>
        typeof d.failure_mode === "string" && d.failure_mode.length > 0
    )
    .map((d) => ({ failure_mode: d.failure_mode }));
}

function readStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(
    value && typeof value === "object" && !Array.isArray(value)
  );
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
