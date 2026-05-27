import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";
import { validateSkillLifecycleContracts } from "./skill-lifecycle-contracts.js";

export type AgentEvaluationValidationReport = {
  status: "pass";
  policy: typeof AGENT_EVALUATION_POLICY_DISPLAY_PATH;
  packet_sets: PacketSetSummary[];
  reviewer_packets: string[];
  benchmark_subjects: string[];
  promotion_thresholds: string[];
};

type PacketSetSummary = {
  packet_set_id: string;
  evidence_class: string;
  version: string;
};

type RawRecord = Record<string, unknown>;
type ParsedPolicy = {
  benchmarkRegistry: {
    packet_sets: RawRecord[];
    benchmark_subjects: RawRecord[];
    run_definitions: RawRecord[];
    reviewer_packets: RawRecord[];
  };
  scorecard: RawRecord;
  paidReviewerPolicy: PaidReviewerPolicy;
};
type PaidReviewerPolicy = {
  one_off_benchmark_calls: RawRecord[];
  recurring_promotion_thresholds: RawRecord[];
  provider_pricing_evidence: RawRecord[];
};

const AGENT_EVALUATION_POLICY_DISPLAY_PATH =
  ".bandit/policy/agent-evaluation-harness.json";
const AGENT_EVALUATION_PACKET_TEMPLATE_DISPLAY_PATH =
  "docs/templates/agent-evaluation-packet.md";
const AGENT_EVALUATION_RESULT_TEMPLATE_DISPLAY_PATH =
  "docs/templates/agent-evaluation-result.md";

const SUPPORTED_POLICY_FIELDS = new Set([
  "contract_version",
  "policy_id",
  "replay_only",
  "automatic_policy_changes",
  "benchmark_registry",
  "scorecard",
  "paid_reviewer_policy"
]);

const REQUIRED_PACKET_TEMPLATE_FIELDS = [
  "packet_id",
  "packet_source",
  "benchmark_mode",
  "benchmark_subject",
  "expected_observations",
  "gold_labels",
  "seeded_blockers",
  "seeded_non_issues",
  "scoring_labels",
  "result_artifact_path"
];

const REQUIRED_RESULT_TEMPLATE_FIELDS = [
  "run_id",
  "packet_set_id",
  "subject_id",
  "scorecard",
  "blocker_recall",
  "missed_blockers",
  "actionable_precision",
  "useful_finding_yield",
  "false_positive_rate",
  "tool_friction",
  "latency",
  "provider_pricing_backed_expected_cost",
  "pricing_freshness_or_expiry",
  "spend_approval_state"
];

const REQUIRED_SCORECARD_METRICS = [
  "blocker_recall",
  "missed_blockers",
  "actionable_precision",
  "useful_finding_yield",
  "false_positive_rate",
  "tool_friction",
  "latency",
  "provider_pricing_backed_expected_cost",
  "pricing_freshness_or_expiry",
  "spend_approval_state"
];

const FORBIDDEN_LIVE_EFFECTS = [
  "live_work",
  "reviewer_routing",
  "model_routing",
  "skill_policy",
  "cost_policy",
  "paid_reviewer_policy",
  "workflow_policy"
];

export async function writeDefaultAgentEvaluationPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "agent-evaluation-harness",
    replay_only: true,
    automatic_policy_changes: false,
    benchmark_registry: {
      packet_sets: [],
      benchmark_subjects: [],
      run_definitions: [],
      reviewer_packets: []
    },
    scorecard: {
      primary_metric: "blocker_recall",
      required_metrics: REQUIRED_SCORECARD_METRICS
    },
    paid_reviewer_policy: {
      one_off_benchmark_calls: [],
      recurring_promotion_thresholds: [],
      provider_pricing_evidence: []
    }
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateAgentEvaluationHarness(
  repoRoot: string
): Promise<AgentEvaluationValidationReport> {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.agentEvaluationPolicy,
    AGENT_EVALUATION_POLICY_DISPLAY_PATH
  );
  const policy = parsePolicyEnvelope(content);
  if (hasConfiguredAgentEvaluationHarness(policy)) {
    await validateAgentEvaluationTemplates(repoRoot);
  }

  const pricingEvidence = validateProviderPricingEvidence(
    policy.paidReviewerPolicy
  );
  const packetSets = await validatePacketSets(
    repoRoot,
    policy.benchmarkRegistry.packet_sets
  );
  const benchmarkSubjects = await validateBenchmarkSubjects(
    repoRoot,
    policy.benchmarkRegistry.benchmark_subjects
  );
  await validateRunDefinitions(
    repoRoot,
    policy.benchmarkRegistry.run_definitions,
    policy.benchmarkRegistry.packet_sets,
    policy.benchmarkRegistry.benchmark_subjects
  );
  const reviewerPackets = await validateReviewerPackets(
    repoRoot,
    policy.benchmarkRegistry.reviewer_packets
  );
  validateScorecard(policy.scorecard);
  validateOneOffPaidReviewerCalls(
    policy.paidReviewerPolicy,
    pricingEvidence
  );
  const promotionThresholds = validateRecurringPromotionThresholds(
    policy.paidReviewerPolicy,
    pricingEvidence
  );

  return {
    status: "pass",
    policy: AGENT_EVALUATION_POLICY_DISPLAY_PATH,
    packet_sets: packetSets,
    reviewer_packets: reviewerPackets,
    benchmark_subjects: benchmarkSubjects,
    promotion_thresholds: promotionThresholds
  };
}

function hasConfiguredAgentEvaluationHarness(
  policy: ParsedPolicy
) {
  return (
    policy.benchmarkRegistry.packet_sets.length > 0 ||
    policy.benchmarkRegistry.benchmark_subjects.length > 0 ||
    policy.benchmarkRegistry.run_definitions.length > 0 ||
    policy.benchmarkRegistry.reviewer_packets.length > 0 ||
    policy.paidReviewerPolicy.one_off_benchmark_calls.length > 0 ||
    policy.paidReviewerPolicy.recurring_promotion_thresholds.length > 0 ||
    policy.paidReviewerPolicy.provider_pricing_evidence.length > 0
  );
}

async function validateAgentEvaluationTemplates(repoRoot: string) {
  await validateTemplate(
    repoRoot,
    AGENT_EVALUATION_PACKET_TEMPLATE_DISPLAY_PATH,
    REQUIRED_PACKET_TEMPLATE_FIELDS
  );
  await validateTemplate(
    repoRoot,
    AGENT_EVALUATION_RESULT_TEMPLATE_DISPLAY_PATH,
    REQUIRED_RESULT_TEMPLATE_FIELDS
  );
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

function parsePolicyEnvelope(content: string): ParsedPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed agent evaluation policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error("Malformed agent evaluation policy: missing contract_version 1");
  }

  for (const field of Object.keys(parsed)) {
    if (!SUPPORTED_POLICY_FIELDS.has(field)) {
      throw new Error(
        `Malformed agent evaluation policy: unsupported field ${field}`
      );
    }
  }

  if (parsed.policy_id !== "agent-evaluation-harness") {
    throw new Error(
      "Malformed agent evaluation policy: policy_id must be agent-evaluation-harness"
    );
  }

  if (parsed.replay_only !== true || parsed.automatic_policy_changes !== false) {
    throw new Error(
      "agent evaluation harness must be replay_only and must not allow automatic policy changes"
    );
  }

  const benchmarkRegistry = requireObject(
    parsed,
    "benchmark_registry",
    "agent evaluation policy"
  );
  const scorecard = requireObject(parsed, "scorecard", "agent evaluation policy");
  const paidReviewerPolicy = requireObject(
    parsed,
    "paid_reviewer_policy",
    "agent evaluation policy"
  );

  return {
    benchmarkRegistry: {
      packet_sets: requireRecordList(
        benchmarkRegistry,
        "packet_sets",
        "benchmark_registry"
      ),
      benchmark_subjects: requireRecordList(
        benchmarkRegistry,
        "benchmark_subjects",
        "benchmark_registry"
      ),
      run_definitions: requireRecordList(
        benchmarkRegistry,
        "run_definitions",
        "benchmark_registry"
      ),
      reviewer_packets: requireRecordList(
        benchmarkRegistry,
        "reviewer_packets",
        "benchmark_registry"
      )
    },
    scorecard,
    paidReviewerPolicy: {
      one_off_benchmark_calls: requireRecordList(
        paidReviewerPolicy,
        "one_off_benchmark_calls",
        "paid_reviewer_policy"
      ),
      recurring_promotion_thresholds: requireRecordList(
        paidReviewerPolicy,
        "recurring_promotion_thresholds",
        "paid_reviewer_policy"
      ),
      provider_pricing_evidence: requireRecordList(
        paidReviewerPolicy,
        "provider_pricing_evidence",
        "paid_reviewer_policy"
      )
    }
  };
}

async function validatePacketSets(
  repoRoot: string,
  packetSets: RawRecord[]
): Promise<PacketSetSummary[]> {
  if (packetSets.length > 0) {
    const evidenceClasses = new Set(
      packetSets.map((packetSet) =>
        optionalString(packetSet, "evidence_class")
      )
    );

    if (
      !evidenceClasses.has("calibration") ||
      !evidenceClasses.has("locked_holdout")
    ) {
      throw new Error(
        "agent evaluation packet sets must include distinct calibration and locked_holdout evidence classes"
      );
    }
  }

  const summaries: PacketSetSummary[] = [];
  for (const packetSet of packetSets) {
    const packetSetId = requireString(packetSet, "packet_set_id", "packet set");
    const evidenceClass = requireString(
      packetSet,
      "evidence_class",
      `packet set ${packetSetId}`
    );
    if (evidenceClass !== "calibration" && evidenceClass !== "locked_holdout") {
      throw new Error(
        `Malformed agent evaluation packet set ${packetSetId}: evidence_class must be calibration or locked_holdout`
      );
    }

    const version = requireString(packetSet, "version", `packet set ${packetSetId}`);
    requireString(packetSet, "visibility", `packet set ${packetSetId}`);
    const packetPaths = requireStringList(
      packetSet,
      "packet_paths",
      `packet set ${packetSetId}`
    );
    for (const packetPath of packetPaths) {
      const displayPath = requireRepoRelativePath(
        packetPath,
        `packet set ${packetSetId}`,
        "packet path"
      );
      await requireExistingFile(
        repoRoot,
        displayPath,
        `Malformed agent evaluation packet set ${packetSetId}: missing packet ${displayPath}`
      );
    }

    summaries.push({
      packet_set_id: packetSetId,
      evidence_class: evidenceClass,
      version
    });
  }

  return summaries;
}

async function validateBenchmarkSubjects(
  repoRoot: string,
  subjects: RawRecord[]
) {
  const skillSubjects = subjects.filter(
    (subject) => optionalString(subject, "subject_type") === "skill_variant"
  );
  const lifecycleReport =
    skillSubjects.length > 0
      ? await validateSkillLifecycleContracts(repoRoot)
      : null;
  const subjectIds: string[] = [];

  for (const subject of subjects) {
    const subjectId = requireString(subject, "subject_id", "benchmark subject");
    const subjectType = requireString(
      subject,
      "subject_type",
      `benchmark subject ${subjectId}`
    );

    if (subjectType === "reviewer_profile") {
      const profilePath = requireRepoRelativePath(
        requireString(subject, "profile_path", `benchmark subject ${subjectId}`),
        `benchmark subject ${subjectId}`,
        "profile path"
      );
      await requireExistingFile(
        repoRoot,
        profilePath,
        `Malformed benchmark subject ${subjectId}: missing reviewer profile ${profilePath}`
      );
    }

    if (subjectType === "skill_variant") {
      const skillId = requireString(
        subject,
        "skill_id",
        `benchmark subject ${subjectId}`
      );
      const version = requireString(
        subject,
        "version",
        `benchmark subject ${subjectId}`
      );
      const lifecycleContractPath = optionalString(
        subject,
        "lifecycle_contract_path"
      );

      if (!lifecycleContractPath || !lifecycleReport) {
        throw new Error(
          `skill variant ${subjectId} must reference stable Skill Lifecycle Contract identity and version evidence`
        );
      }

      const displayPath = requireRepoRelativePath(
        lifecycleContractPath,
        `benchmark subject ${subjectId}`,
        "lifecycle contract path"
      );
      await requireExistingFile(
        repoRoot,
        displayPath,
        `skill variant ${subjectId} must reference stable Skill Lifecycle Contract identity and version evidence`
      );

      const matchingContract = lifecycleReport.contracts.find(
        (contract) =>
          contract.skill_id === skillId && contract.version === version
      );
      if (!matchingContract) {
        throw new Error(
          `skill variant ${subjectId} must reference stable Skill Lifecycle Contract identity and version evidence`
        );
      }
    }

    subjectIds.push(subjectId);
  }

  return subjectIds;
}

async function validateRunDefinitions(
  repoRoot: string,
  runDefinitions: RawRecord[],
  packetSets: RawRecord[],
  subjects: RawRecord[]
) {
  const packetSetIds = new Set(
    packetSets.map((packetSet) => optionalString(packetSet, "packet_set_id"))
  );
  const subjectIds = new Set(
    subjects.map((subject) => optionalString(subject, "subject_id"))
  );

  for (const runDefinition of runDefinitions) {
    const runId = requireString(runDefinition, "run_id", "run definition");
    const mode = requireString(runDefinition, "mode", `run definition ${runId}`);
    if (mode !== "replay_only") {
      throw new Error(
        "agent evaluation harness must be replay_only and must not allow automatic policy changes"
      );
    }

    const subjectId = requireString(
      runDefinition,
      "subject_id",
      `run definition ${runId}`
    );
    if (!subjectIds.has(subjectId)) {
      throw new Error(
        `Malformed agent evaluation run ${runId}: unknown benchmark subject ${subjectId}`
      );
    }

    const runPacketSetIds = requireStringList(
      runDefinition,
      "packet_set_ids",
      `run definition ${runId}`
    );
    for (const packetSetId of runPacketSetIds) {
      if (!packetSetIds.has(packetSetId)) {
        throw new Error(
          `Malformed agent evaluation run ${runId}: unknown packet set ${packetSetId}`
        );
      }
    }

    requireRepoRelativePath(
      requireString(runDefinition, "result_path", `run definition ${runId}`),
      `run definition ${runId}`,
      "result path"
    );
    const allowedEffects = requireStringList(
      runDefinition,
      "allowed_effects",
      `run definition ${runId}`
    );
    const forbiddenEffects = requireStringList(
      runDefinition,
      "forbidden_effects",
      `run definition ${runId}`
    );

    if (
      allowedEffects.some((effect) => FORBIDDEN_LIVE_EFFECTS.includes(effect)) ||
      FORBIDDEN_LIVE_EFFECTS.some((effect) => !forbiddenEffects.includes(effect))
    ) {
      throw new Error(
        `Malformed agent evaluation run ${runId}: run definitions must stay replay-only and forbid live routing or policy effects`
      );
    }

    requireRepoRelativePath(
      requireString(runDefinition, "result_path", `run definition ${runId}`),
      `run definition ${runId}`,
      "result path"
    );
  }
}

async function validateReviewerPackets(repoRoot: string, packets: RawRecord[]) {
  const packetIds: string[] = [];
  for (const packet of packets) {
    const packetId = requireString(packet, "packet_id", "reviewer packet");
    const packetPath = requireRepoRelativePath(
      requireString(packet, "packet_path", `reviewer packet ${packetId}`),
      `reviewer packet ${packetId}`,
      "packet path"
    );
    await requireExistingFile(
      repoRoot,
      packetPath,
      `Malformed reviewer benchmark packet ${packetId}: missing packet ${packetPath}`
    );

    if (
      optionalString(packet, "derivation") !== "repo_derived" ||
      !optionalString(packet, "failure_mode") ||
      !hasNonEmptyStringArray(packet.gold_labels) ||
      !hasNonEmptyStringArray(packet.seeded_blockers) ||
      !hasNonEmptyStringArray(packet.seeded_non_issues) ||
      !hasNonEmptyStringArray(packet.expected_observations) ||
      !hasNonEmptyStringArray(packet.scoring_labels)
    ) {
      throw new Error(
        `reviewer benchmark packet ${packetId} must include gold labels, seeded blockers, seeded non-issues, expected observations, and scoring labels`
      );
    }

    packetIds.push(packetId);
  }

  return packetIds;
}

function validateScorecard(scorecard: RawRecord) {
  if (optionalString(scorecard, "primary_metric") !== "blocker_recall") {
    throw new Error(
      "Malformed agent evaluation scorecard: primary_metric must be blocker_recall"
    );
  }

  const requiredMetrics = requireStringList(
    scorecard,
    "required_metrics",
    "scorecard"
  );
  for (const metric of REQUIRED_SCORECARD_METRICS) {
    if (!requiredMetrics.includes(metric)) {
      throw new Error(`scorecard missing required metric: ${metric}`);
    }
  }
}

function validateProviderPricingEvidence(paidReviewerPolicy: PaidReviewerPolicy) {
  const evidenceRows = paidReviewerPolicy.provider_pricing_evidence;
  const evidenceIds = new Set<string>();

  for (const row of evidenceRows) {
    const evidenceId = requireString(
      row,
      "pricing_evidence_id",
      "provider pricing evidence"
    );
    requireString(row, "provider", `provider pricing evidence ${evidenceId}`);
    requireString(
      row,
      "model_or_profile",
      `provider pricing evidence ${evidenceId}`
    );
    requireString(
      row,
      "pricing_source",
      `provider pricing evidence ${evidenceId}`
    );
    requireString(
      row,
      "captured_date",
      `provider pricing evidence ${evidenceId}`
    );
    requireString(
      row,
      "effective_date",
      `provider pricing evidence ${evidenceId}`
    );
    requireString(
      row,
      "freshness_rule",
      `provider pricing evidence ${evidenceId}`
    );
    requireString(
      row,
      "expected_per_run_cost",
      `provider pricing evidence ${evidenceId}`
    );
    requireString(row, "spend_class", `provider pricing evidence ${evidenceId}`);
    requireString(
      row,
      "approval_owner",
      `provider pricing evidence ${evidenceId}`
    );
    evidenceIds.add(evidenceId);
  }

  return evidenceIds;
}

function validateOneOffPaidReviewerCalls(
  paidReviewerPolicy: PaidReviewerPolicy,
  pricingEvidenceIds: Set<string>
) {
  const calls = paidReviewerPolicy.one_off_benchmark_calls;

  for (const call of calls) {
    requireString(call, "subject_id", "one-off paid reviewer benchmark call");
    requireString(call, "spend_class", "one-off paid reviewer benchmark call");
    const pricingEvidenceId = optionalString(
      call,
      "provider_pricing_evidence_id"
    );
    const approval = optionalString(call, "approval");
    if (
      !pricingEvidenceId ||
      !pricingEvidenceIds.has(pricingEvidenceId) ||
      (approval !== "per_run_approval_required" &&
        approval !== "active_spend_class_approval")
    ) {
      throw new Error(
        "one-off paid reviewer benchmark calls require current Provider Pricing Evidence and per-run approval or active spend-class approval"
      );
    }
  }
}

function validateRecurringPromotionThresholds(
  paidReviewerPolicy: PaidReviewerPolicy,
  pricingEvidenceIds: Set<string>
) {
  const thresholds = paidReviewerPolicy.recurring_promotion_thresholds;
  const thresholdIds: string[] = [];

  for (const threshold of thresholds) {
    const thresholdId = requireString(
      threshold,
      "threshold_id",
      "recurring promotion threshold"
    );
    const scopedRisk = optionalString(threshold, "applies_to_risk_class");
    const scopedStage = optionalString(
      threshold,
      "applies_to_stage_capability_profile"
    );
    const pricingEvidenceId = optionalString(
      threshold,
      "provider_pricing_evidence_id"
    );

    if (
      optionalString(threshold, "evidence_class") !== "locked_holdout" ||
      (typeof threshold.minimum_blocker_recall_improvement_over_qwen !==
        "number") ||
      typeof threshold.false_positive_rate_ceiling !== "number" ||
      !optionalString(threshold, "expected_cost_ceiling") ||
      !pricingEvidenceId ||
      !pricingEvidenceIds.has(pricingEvidenceId) ||
      optionalString(threshold, "spend_class_approval") !==
        "operator_supervised_required" ||
      (!scopedRisk && !scopedStage)
    ) {
      throw new Error(
        "recurring paid reviewer promotion thresholds require locked-holdout blocker-recall improvement over Qwen, false-positive ceiling, cost ceiling, spend-class approval, and scoped risk or stage capability profile"
      );
    }

    thresholdIds.push(thresholdId);
  }

  return thresholdIds;
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

async function readRequiredTemplateFile(
  filePath: string,
  displayPath: string
) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${displayPath}`);
    }
    throw error;
  }
}

function requireObject(container: RawRecord, field: string, context: string) {
  const value = container[field];
  if (!isRecord(value)) {
    throw new Error(
      `Malformed agent evaluation policy: ${context}.${field} must be an object`
    );
  }
  return value;
}

function requireRecordList(container: RawRecord, field: string, context: string) {
  const value = container[field];
  if (!Array.isArray(value) || !value.every((item) => isRecord(item))) {
    throw new Error(
      `Malformed agent evaluation policy: ${context}.${field} must be an array of objects`
    );
  }
  return value;
}

function requireString(container: RawRecord, field: string, context: string) {
  const value = container[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Malformed agent evaluation policy: ${context}.${field} must be a non-empty string`
    );
  }
  return value.trim();
}

function requireStringList(container: RawRecord, field: string, context: string) {
  const value = container[field];
  if (!hasNonEmptyStringArray(value)) {
    throw new Error(
      `Malformed agent evaluation policy: ${context}.${field} must be a non-empty string array`
    );
  }
  return value.map((item) => item.trim());
}

function optionalString(container: RawRecord, field: string) {
  const value = container[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    return "";
  }
  return value.trim();
}

function hasNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function requireRepoRelativePath(value: string, context: string, field: string) {
  if (
    path.isAbsolute(value) ||
    value.includes("\0") ||
    value.split(/[\\/]+/).includes("..")
  ) {
    throw new Error(
      `Malformed agent evaluation policy: ${context}.${field} must be repo-addressable`
    );
  }

  return value;
}

async function requireExistingFile(
  repoRoot: string,
  displayPath: string,
  missingMessage: string
) {
  try {
    await stat(path.join(repoRoot, displayPath));
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(missingMessage);
    }
    throw error;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
