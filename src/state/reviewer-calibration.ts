import { readFile } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH = ".bandit/policy/reviewer-calibration.json" as const;
const REPO_DERIVED_PACKET_SOURCE = "repo_derived_bandit_failure_mode";
const FORBIDDEN_DIRECT_QWEN_ROUTE = "direct_qwen_cli";
const DIRECT_QWEN_COMMAND = "qwen";
const PRIMARY_METRIC = "blocker_recall";
const COMPLETED_STATUS = "completed";

export type ReviewerCalibrationReport = {
  status: "pass";
  policy: typeof POLICY_DISPLAY_PATH;
  packets: string[];
  scorecard: ReviewerCalibrationScorecard;
  provider_evidence_statuses: string[];
  boundaries: {
    replay_only: boolean;
    no_live_routing: boolean;
  };
};

type ReviewerCalibrationScorecard = {
  primary_metric: typeof PRIMARY_METRIC;
  blocker_recall: number;
  actionable_precision: number;
  useful_finding_yield: number;
  false_positive_rate: number;
  tool_friction: string[];
  latency_ms: number;
  cost_usd: number;
};

type RawRecord = Record<string, unknown>;

type ReviewerFinding = {
  caseId: string;
  actionable: boolean;
};

type ReviewerOutput = {
  route: string;
  status: string;
  toolFriction: string;
  latencyMs: number;
  costUsd: number;
  findings: ReviewerFinding[];
};

type SeededCase = {
  caseId: string;
  label: string;
  fields: RawRecord;
};

type ParsedPacket = {
  packetId: string;
  packetSource: string;
  failureModeCategory: string;
  sourceArtifacts: string[];
  seededCases: SeededCase[];
  reviewerOutputs: ReviewerOutput[];
};

type ParsedPolicy = {
  replayOnly: boolean;
  noLiveRouting: boolean;
  automaticReviewerRoutingChanges: boolean;
  canMutateLiveReviewerRouting: boolean;
  canMutateLandingAuthority: boolean;
  primaryMetric: string;
  rawFindingCountPrimary: boolean;
  allowedRoutes: { route: string; command: string }[];
  requireRepoDerivedFailureModes: boolean;
  genericOnlyFirstHarnessAcceptance: boolean;
  requiredSeededCaseFields: string[];
  packetPaths: string[];
};

export async function validateReviewerCalibration(
  repoRoot: string
): Promise<ReviewerCalibrationReport> {
  const policy = await readPolicy(repoRoot);

  assertReplayOnlyBoundaries(policy);
  assertScorecardPolicy(policy);
  assertReviewerEligibility(policy);
  assertPacketSourcePolicy(policy);
  assertNamedPackets(policy);

  const packets: string[] = [];
  const scoreInputs: ScoreInput[] = [];
  for (const packetPath of policy.packetPaths) {
    const packet = await readPacket(repoRoot, packetPath);
    assertRepoDerivedPacket(packet);
    assertFailureModeProvenance(packet);
    assertSeededCaseFields(packet, policy.requiredSeededCaseFields);
    assertGoldLabeledSeededCases(packet);
    packets.push(packet.packetId);
    scoreInputs.push(collectScoreInput(packet));
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    packets,
    scorecard: scoreCalibration(scoreInputs),
    provider_evidence_statuses: collectProviderEvidenceStatuses(scoreInputs),
    boundaries: {
      replay_only: policy.replayOnly,
      no_live_routing: policy.noLiveRouting
    }
  };
}

function assertReplayOnlyBoundaries(policy: ParsedPolicy): void {
  const replayOnly =
    policy.replayOnly &&
    policy.noLiveRouting &&
    !policy.automaticReviewerRoutingChanges &&
    !policy.canMutateLiveReviewerRouting &&
    !policy.canMutateLandingAuthority;

  if (!replayOnly) {
    throw new Error(
      "reviewer calibration must be replay-only and cannot mutate live reviewer routing or landing authority"
    );
  }
}

function assertScorecardPolicy(policy: ParsedPolicy): void {
  if (policy.primaryMetric !== PRIMARY_METRIC || policy.rawFindingCountPrimary) {
    throw new Error(
      "reviewer calibration scorecard must prioritize blocker_recall and cannot use raw finding count as the primary score"
    );
  }
}

function assertReviewerEligibility(policy: ParsedPolicy): void {
  const hasDirectQwen = policy.allowedRoutes.some(
    (route) =>
      route.route === FORBIDDEN_DIRECT_QWEN_ROUTE ||
      route.command === DIRECT_QWEN_COMMAND
  );

  if (hasDirectQwen) {
    throw new Error(
      "direct qwen CLI is not an authorized Bandit reviewer route"
    );
  }
}

function assertPacketSourcePolicy(policy: ParsedPolicy): void {
  if (
    !policy.requireRepoDerivedFailureModes ||
    policy.genericOnlyFirstHarnessAcceptance
  ) {
    throw repoDerivedPacketError();
  }
}

function assertNamedPackets(policy: ParsedPolicy): void {
  if (policy.packetPaths.length === 0) {
    throw new Error(
      "reviewer calibration policy must name at least one packet"
    );
  }
}

function assertRepoDerivedPacket(packet: ParsedPacket): void {
  if (packet.packetSource !== REPO_DERIVED_PACKET_SOURCE) {
    throw repoDerivedPacketError();
  }
}

function assertFailureModeProvenance(packet: ParsedPacket): void {
  if (
    packet.failureModeCategory.length === 0 ||
    packet.sourceArtifacts.length === 0
  ) {
    throw new Error(
      `reviewer calibration packet ${packet.packetId} must include failure_mode_category and source_artifacts`
    );
  }
}

function assertSeededCaseFields(
  packet: ParsedPacket,
  requiredFields: string[]
): void {
  for (const seededCase of packet.seededCases) {
    for (const field of requiredFields) {
      if (asString(seededCase.fields[field]).length === 0) {
        throw new Error(
          `reviewer calibration packet ${packet.packetId} seeded case ${seededCase.caseId} missing required field: ${field}`
        );
      }
    }
  }
}

function repoDerivedPacketError(): Error {
  return new Error(
    "reviewer calibration requires repo-derived Bandit workflow failure-mode packets before generic benchmark tasks can satisfy first-harness acceptance"
  );
}

function assertGoldLabeledSeededCases(packet: ParsedPacket): void {
  const hasBlocker = packet.seededCases.some((c) => c.label === "blocker");
  const hasNonIssue = packet.seededCases.some((c) => c.label === "non_issue");

  if (!hasBlocker || !hasNonIssue) {
    throw new Error(
      `reviewer calibration packet ${packet.packetId} must include gold-labeled seeded blockers and seeded non-issues`
    );
  }
}

type ScoreInput = {
  seededBlockerIds: Set<string>;
  completedOutputs: ReviewerOutput[];
  providerEvidenceStatuses: string[];
};

function collectScoreInput(packet: ParsedPacket): ScoreInput {
  const seededBlockerIds = new Set(
    packet.seededCases.filter((c) => c.label === "blocker").map((c) => c.caseId)
  );
  const completedOutputs = packet.reviewerOutputs.filter(
    (output) => output.status === COMPLETED_STATUS
  );
  const providerEvidenceStatuses = packet.reviewerOutputs
    .filter((output) => output.status !== COMPLETED_STATUS)
    .map((output) => output.status);

  return { seededBlockerIds, completedOutputs, providerEvidenceStatuses };
}

// Calibration scores only completed reviewer outputs. Provider timeout, refusal,
// and inconclusive statuses are recorded as evidence by
// collectProviderEvidenceStatuses and never counted as a detection or a pass.
function scoreCalibration(
  scoreInputs: ScoreInput[]
): ReviewerCalibrationScorecard {
  const seededBlockerIds = unionSets(scoreInputs.map((i) => i.seededBlockerIds));
  const completedOutputs = scoreInputs.flatMap((i) => i.completedOutputs);
  const findings = completedOutputs.flatMap((output) => output.findings);

  const detectedBlockerIds = new Set(
    findings.map((f) => f.caseId).filter((id) => seededBlockerIds.has(id))
  );
  const truePositiveFindings = findings.filter((f) =>
    seededBlockerIds.has(f.caseId)
  );
  const falsePositiveFindings = findings.filter(
    (f) => !seededBlockerIds.has(f.caseId)
  );
  const actionableFindings = findings.filter((f) => f.actionable);
  const actionableTruePositives = actionableFindings.filter((f) =>
    seededBlockerIds.has(f.caseId)
  );

  return {
    primary_metric: PRIMARY_METRIC,
    blocker_recall: ratio(detectedBlockerIds.size, seededBlockerIds.size, 1),
    actionable_precision: ratio(
      actionableTruePositives.length,
      actionableFindings.length,
      1
    ),
    useful_finding_yield: ratio(
      truePositiveFindings.length,
      findings.length,
      0
    ),
    false_positive_rate: ratio(falsePositiveFindings.length, findings.length, 0),
    tool_friction: distinct(completedOutputs.map((o) => o.toolFriction)),
    latency_ms: sum(completedOutputs.map((o) => o.latencyMs)),
    cost_usd: sum(completedOutputs.map((o) => o.costUsd))
  };
}

function collectProviderEvidenceStatuses(scoreInputs: ScoreInput[]): string[] {
  return distinct(scoreInputs.flatMap((i) => i.providerEvidenceStatuses));
}

function ratio(numerator: number, denominator: number, emptyValue: number) {
  return denominator === 0 ? emptyValue : numerator / denominator;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function distinct(values: string[]): string[] {
  return [...new Set(values)];
}

function unionSets(sets: Set<string>[]): Set<string> {
  const union = new Set<string>();
  for (const set of sets) {
    for (const value of set) {
      union.add(value);
    }
  }
  return union;
}

async function readPolicy(repoRoot: string): Promise<ParsedPolicy> {
  const parsed = await readJsonObject(
    path.join(repoRoot, POLICY_DISPLAY_PATH),
    POLICY_DISPLAY_PATH,
    "policy"
  );

  if (parsed.contract_version !== 1) {
    throw new Error(
      "Malformed reviewer calibration policy: missing contract_version 1"
    );
  }

  const reviewerEligibility = asRecord(parsed.reviewer_eligibility);
  const scorecard = asRecord(parsed.scorecard);
  const boundaries = asRecord(parsed.boundaries);
  const packetSourcePolicy = asRecord(parsed.packet_source_policy);
  const packetSchema = asRecord(parsed.packet_schema);

  return {
    replayOnly: parsed.replay_only === true,
    noLiveRouting: parsed.no_live_routing === true,
    automaticReviewerRoutingChanges:
      parsed.automatic_reviewer_routing_changes === true,
    canMutateLiveReviewerRouting:
      boundaries.can_mutate_live_reviewer_routing === true,
    canMutateLandingAuthority: boundaries.can_mutate_landing_authority === true,
    primaryMetric: asString(scorecard.primary_metric),
    rawFindingCountPrimary: scorecard.raw_finding_count_primary === true,
    allowedRoutes: parseAllowedRoutes(reviewerEligibility.allowed_routes),
    requireRepoDerivedFailureModes:
      packetSourcePolicy.require_repo_derived_bandit_failure_modes === true,
    genericOnlyFirstHarnessAcceptance:
      packetSourcePolicy.generic_only_first_harness_acceptance === true,
    requiredSeededCaseFields: asStringArray(
      packetSchema.required_seeded_case_fields
    ),
    packetPaths: asStringArray(parsed.packets)
  };
}

function parseAllowedRoutes(
  value: unknown
): { route: string; command: string }[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((raw) => ({
    route: asString(raw.route),
    command: asString(raw.command)
  }));
}

async function readPacket(
  repoRoot: string,
  packetPath: string
): Promise<ParsedPacket> {
  const displayPath = requireRepoRelativePath(packetPath);
  const parsed = await readJsonObject(
    path.join(repoRoot, displayPath),
    displayPath,
    "packet"
  );

  return {
    packetId: asString(parsed.packet_id),
    packetSource: asString(parsed.packet_source),
    failureModeCategory: asString(parsed.failure_mode_category),
    sourceArtifacts: asStringArray(parsed.source_artifacts),
    seededCases: parseSeededCases(parsed.seeded_cases),
    reviewerOutputs: parseReviewerOutputs(parsed.reviewer_outputs)
  };
}

function parseSeededCases(value: unknown): SeededCase[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((raw) => ({
    caseId: asString(raw.case_id),
    label: asString(raw.label),
    fields: raw
  }));
}

function parseReviewerOutputs(value: unknown): ReviewerOutput[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((raw) => ({
    route: asString(raw.route),
    status: asString(raw.status),
    toolFriction: asString(raw.tool_friction),
    latencyMs: asNumber(raw.latency_ms),
    costUsd: asNumber(raw.cost_usd),
    findings: parseFindings(raw.findings)
  }));
}

function parseFindings(value: unknown): ReviewerFinding[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((raw) => ({
    caseId: asString(raw.case_id),
    actionable: raw.actionable === true
  }));
}

function requireRepoRelativePath(value: string): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    path.isAbsolute(value) ||
    value.includes("\0") ||
    value.split(/[\\/]+/).includes("..")
  ) {
    throw new Error(
      `Malformed reviewer calibration policy: packet path must be repo-addressable (${value})`
    );
  }
  return value;
}

async function readJsonObject(
  filePath: string,
  displayPath: string,
  kind: "policy" | "packet"
): Promise<RawRecord> {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(
        `Missing required reviewer calibration ${kind}: ${displayPath}`
      );
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      `Malformed reviewer calibration ${kind}: invalid JSON in ${displayPath}`
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      `Malformed reviewer calibration ${kind}: ${displayPath} must be an object`
    );
  }

  return parsed;
}

function asRecord(value: unknown): RawRecord {
  return isRecord(value) ? value : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export const REVIEWER_CALIBRATION_POLICY_DISPLAY_PATH = POLICY_DISPLAY_PATH;
