import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  EvidenceTrustSignal,
  buildGateTrustSignal,
  evidenceFreshnessPolicyExists,
  pathExists,
  readScalarStatus,
  withEvidenceSlo
} from "./evidence-freshness-slos.js";

const AGENTS_PATH = "AGENTS.md";
const CONTEXT_PATH = "CONTEXT.md";
const CLEAN_CODE_PATH = "CLEAN_CODE.md";
const CURRENT_CONTEXT_PATH = "docs/roadmap/CURRENT_CONTEXT.md";
const ROADMAP_PATH = "docs/roadmap/ROADMAP.md";
const STAGE_RUBRICS_PATH = "docs/verification/STAGE_RUBRICS.md";
const BOOTSTRAP_GAPS_PATH = ".bandit/bootstrap-gaps.json";
const SMELL_TRIGGERS_PATH = ".bandit/policy/smell-triggers.json";
const COLD_START_PATH = "docs/evaluation/skills/bandit-cold-start.md";

type RawGap = {
  id: string;
  title: string;
  status: string;
  disposition: string;
  linked_work_item: string | null;
  verification_target: string | null;
  source_artifacts: string[];
};

export type FocusedSessionContextPacket = {
  kind: "focused_session_context_packet";
  authority: "derived_non_canonical";
  current_phase: { value: string; source: string };
  active_work_item: { id: string; source: string } | null;
  active_bootstrap_gap: { id: string; source: string } | null;
  last_closed_work_item?: { id: string; status: string; source: string };
  next_queued_bootstrap_gap?: { id: string; title: string; status: string; disposition: string; source_artifacts: string[] };
  current_stage: { value: string; source: string };
  exact_next_action: { value: string; source: string };
  required_operator_input: { value: "none_required" | "required"; source: string };
  blockers: Array<{ id: string; status: string; source: string; title: string }>;
  allowed_actions: string[];
  forbidden_actions: string[];
  required_evidence_paths: Array<{ path: string; stage: string }>;
  source_artifacts: Array<{ path: string; role: string }>;
  source_hierarchy: Array<{ source: string; authority: string }>;
  stale_or_missing_evidence: string[];
  deep_read_pointers: Array<{ source: string; reason: string }>;
  evidence_trust_signals?: {
    authority: "derived_non_canonical";
    dependencies: EvidenceTrustSignal[];
  };
};

const STAGE_EVIDENCE_INFOS = [
  {
    stageNum: 1,
    stageLabel: "Stage 1",
    artifact_type: "brief",
    owner: "codex_pm",
    filename: "brief.md"
  },
  {
    stageNum: 2,
    stageLabel: "Stage 2",
    artifact_type: "red_evidence",
    owner: "test_writer",
    filename: "red-evidence.md"
  },
  {
    stageNum: 3,
    stageLabel: "Stage 3",
    artifact_type: "implementation_evidence",
    owner: "writer",
    filename: "implementation-evidence.md"
  },
  {
    stageNum: 4,
    stageLabel: "Stage 4",
    artifact_type: "review_evidence",
    owner: "reviewer",
    filename: "review-evidence.md"
  },
  {
    stageNum: 5,
    stageLabel: "Stage 5",
    artifact_type: "landing_verdict",
    owner: "landing_agent",
    filename: "landing-verdict.md"
  },
  {
    stageNum: 6,
    stageLabel: "Stage 6",
    artifact_type: "retrospective",
    owner: "codex_pm",
    filename: "retrospective.md"
  }
] as const;

async function buildSessionContextTrustSignals(
  repoRoot: string,
  workItemId: string,
  currentStage: string
): Promise<{ authority: "derived_non_canonical"; dependencies: EvidenceTrustSignal[] }> {
  const stageNum = parseStageNumber(currentStage);
  if (stageNum === null) {
    return { authority: "derived_non_canonical", dependencies: [] };
  }

  const requiredStageEvidence = STAGE_EVIDENCE_INFOS.filter(
    (info) => info.stageNum <= stageNum
  );
  const existenceResults = await Promise.all(
    requiredStageEvidence.map(async (info) => {
      const source = buildEvidenceSource(workItemId, info.filename);
      return {
        info,
        source,
        fileExists: await pathExists(repoRoot, source)
      };
    })
  );

  const dependencies = (
    await Promise.all(
      existenceResults.map(({ info, source, fileExists }) =>
        buildDependencyTrustSignal(
          repoRoot,
          source,
          info.artifact_type,
          info.owner,
          fileExists
        )
      )
    )
  ).filter((signal): signal is EvidenceTrustSignal => signal !== null);

  return { authority: "derived_non_canonical", dependencies };
}

async function buildDependencyTrustSignal(
  repoRoot: string,
  source: string,
  artifactType: string,
  owner: string,
  fileExists: boolean
): Promise<EvidenceTrustSignal | null> {
  if (!fileExists) {
    return withEvidenceSlo(buildGateTrustSignal(artifactType, source, owner, false));
  }

  const staleReason = await readStaleEvidenceReason(repoRoot, source, artifactType);
  if (!staleReason) return null;

  return withEvidenceSlo(
    buildGateTrustSignal(artifactType, source, owner, "stale", staleReason)
  );
}

async function readStaleEvidenceReason(
  repoRoot: string,
  source: string,
  artifactType: string
): Promise<string | null> {
  if (artifactType !== "review_evidence") return null;

  let content: string;
  try {
    content = await readFile(path.join(repoRoot, source), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return null;
    throw error;
  }

  if (readScalarStatus(content, "source_drift_status") === "stale") {
    return "source_drift";
  }
  if (readScalarStatus(content, "review_subject_hash_status") === "stale") {
    return "review_subject_hash_drift";
  }
  return null;
}

function parseStageNumber(stageStr: string): number | null {
  const match = stageStr.match(/^Stage\s+(\d+)/i);
  if (!match || !match[1]) return null;
  return parseInt(match[1], 10);
}

export async function readFocusedSessionContext(
  repoRoot: string
): Promise<FocusedSessionContextPacket> {
  await requireSourceArtifact(repoRoot, AGENTS_PATH);

  const currentContext = await readRequiredArtifact(repoRoot, CURRENT_CONTEXT_PATH);
  const roadmap = await readRequiredArtifact(repoRoot, ROADMAP_PATH);

  const phase = requireCurrentPhase(currentContext);
  const nextAction = requireLabeledText(
    currentContext,
    "Current next action",
    CURRENT_CONTEXT_PATH
  );
  const roadmapNextStep = requireLabeledText(roadmap, "Current next step", ROADMAP_PATH);

  const bootstrapGapsContent = await readRequiredArtifact(repoRoot, BOOTSTRAP_GAPS_PATH);
  const rawGaps = parseBootstrapGapsRaw(bootstrapGapsContent);

  if (isInterstitialState(currentContext)) {
    if (!nextActionsAgree(nextAction, roadmapNextStep, null)) {
      throw new Error(
        "Session context blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action"
      );
    }
    return buildInterstitialPacket(currentContext, phase, nextAction, rawGaps);
  }

  const activeWorkItemId = requireActiveWorkItem(currentContext);

  if (!nextActionsAgree(nextAction, roadmapNextStep, activeWorkItemId)) {
    throw new Error(
      "Session context blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action"
    );
  }

  const currentStage = requireCurrentStage(currentContext);
  const requiredOperatorInput = readRequiredOperatorInput(currentContext);
  const forbiddenActions = extractForbiddenActions(currentContext);
  const activeBootstrapGap = findActiveGap(rawGaps, activeWorkItemId);
  const blockers = buildBlockers(rawGaps);

  const hasFreshnessSlos = await evidenceFreshnessPolicyExists(repoRoot);
  const evidence_trust_signals = hasFreshnessSlos
    ? await buildSessionContextTrustSignals(repoRoot, activeWorkItemId, currentStage)
    : undefined;

  return {
    kind: "focused_session_context_packet",
    authority: "derived_non_canonical",
    current_phase: { value: normalizePhase(phase), source: CURRENT_CONTEXT_PATH },
    active_work_item: {
      id: activeWorkItemId,
      source: `docs/work/${activeWorkItemId}/brief.md`
    },
    active_bootstrap_gap: { id: activeBootstrapGap.id, source: BOOTSTRAP_GAPS_PATH },
    current_stage: { value: currentStage, source: CURRENT_CONTEXT_PATH },
    exact_next_action: { value: nextAction, source: CURRENT_CONTEXT_PATH },
    required_operator_input: { value: requiredOperatorInput, source: CURRENT_CONTEXT_PATH },
    blockers,
    allowed_actions: [nextAction],
    forbidden_actions: forbiddenActions,
    required_evidence_paths: buildRequiredEvidencePaths(activeWorkItemId),
    source_artifacts: buildSourceArtifacts(),
    source_hierarchy: buildSourceHierarchy(),
    stale_or_missing_evidence: [],
    deep_read_pointers: buildDeepReadPointers(),
    evidence_trust_signals
  };
}

function isInterstitialState(currentContext: string) {
  const match = currentContext.match(/^\*\*Active work item:\*\*\s*(.+)$/m);
  if (!match || !match[1]) return false;
  const value = normalizeText(match[1]);
  return value === "none" || value === "none.";
}

function buildInterstitialPacket(
  currentContext: string,
  phase: string,
  nextAction: string,
  rawGaps: RawGap[]
): FocusedSessionContextPacket {
  const lastClosedGap = findLastResolvedGapWithLinkedItem(rawGaps);
  if (!lastClosedGap || !lastClosedGap.linked_work_item) {
    throw new Error(
      "Session context blocked: interstitial state requires a resolved gap with a linked work item"
    );
  }

  const nextQueuedGap = findNextQueuedGap(rawGaps);
  if (!nextQueuedGap) {
    throw new Error(
      "Session context blocked: interstitial state requires a next queued bootstrap gap"
    );
  }

  const lastClosedWorkItemId = lastClosedGap.linked_work_item;
  const lastClosedSource =
    lastClosedGap.verification_target ?? `docs/work/${lastClosedWorkItemId}/retrospective.md`;

  const requiredOperatorInput = readRequiredOperatorInput(currentContext);
  const forbiddenActions = extractForbiddenActions(currentContext);
  const blockers = buildBlockers(rawGaps);

  const nextWorkItemId = deriveNextWorkItemId(lastClosedWorkItemId);

  return {
    kind: "focused_session_context_packet",
    authority: "derived_non_canonical",
    current_phase: { value: normalizePhase(phase), source: CURRENT_CONTEXT_PATH },
    active_work_item: null,
    active_bootstrap_gap: null,
    last_closed_work_item: {
      id: lastClosedWorkItemId,
      status: "closed",
      source: lastClosedSource
    },
    next_queued_bootstrap_gap: {
      id: nextQueuedGap.id,
      title: nextQueuedGap.title,
      status: nextQueuedGap.status,
      disposition: nextQueuedGap.disposition,
      source_artifacts: nextQueuedGap.source_artifacts
    },
    current_stage: {
      value: "Interstitial: Work-item creation required",
      source: CURRENT_CONTEXT_PATH
    },
    exact_next_action: { value: nextAction, source: CURRENT_CONTEXT_PATH },
    required_operator_input: { value: requiredOperatorInput, source: CURRENT_CONTEXT_PATH },
    blockers,
    allowed_actions: [nextAction],
    forbidden_actions: forbiddenActions,
    required_evidence_paths: buildRequiredEvidencePaths(nextWorkItemId),
    source_artifacts: buildSourceArtifacts(),
    source_hierarchy: buildSourceHierarchy(),
    stale_or_missing_evidence: [],
    deep_read_pointers: buildDeepReadPointers()
  };
}

function findLastResolvedGapWithLinkedItem(gaps: RawGap[]): RawGap | undefined {
  for (let i = gaps.length - 1; i >= 0; i--) {
    const gap = gaps[i];
    if (gap && gap.status === "resolved" && gap.linked_work_item) {
      return gap;
    }
  }
  return undefined;
}

function findNextQueuedGap(gaps: RawGap[]): RawGap | undefined {
  return gaps.find((gap) => gap.status !== "resolved" && gap.linked_work_item === null);
}

function deriveNextWorkItemId(lastClosedWorkItemId: string): string {
  const match = lastClosedWorkItemId.match(/^([A-Z][A-Z0-9]*)+-(\d+)$/);
  if (!match || !match[2]) return lastClosedWorkItemId;
  const prefix = lastClosedWorkItemId.slice(0, lastClosedWorkItemId.lastIndexOf("-"));
  const num = parseInt(match[2], 10) + 1;
  return `${prefix}-${String(num).padStart(3, "0")}`;
}

function buildSourceArtifacts() {
  return [
    { path: AGENTS_PATH, role: "role rules and process boundaries" },
    { path: CLEAN_CODE_PATH, role: "code quality constraints" },
    { path: CURRENT_CONTEXT_PATH, role: "current phase and next action authority" },
    { path: ROADMAP_PATH, role: "concise roadmap position" },
    { path: STAGE_RUBRICS_PATH, role: "stage gate rubrics" },
    { path: BOOTSTRAP_GAPS_PATH, role: "bootstrap gap ledger" },
    { path: SMELL_TRIGGERS_PATH, role: "smell trigger routing policy" },
    { path: COLD_START_PATH, role: "cold-start evaluation packet" }
  ];
}

function buildSourceHierarchy() {
  return [
    {
      source: AGENTS_PATH,
      authority: "highest — role rules, process policy, PM and writer boundaries"
    },
    {
      source: CURRENT_CONTEXT_PATH,
      authority: "current phase, active work item, and exact next action"
    },
    {
      source: ROADMAP_PATH,
      authority: "concise current, next, planned, and completed work list"
    },
    {
      source: BOOTSTRAP_GAPS_PATH,
      authority: "active and queued gap state"
    },
    {
      source: STAGE_RUBRICS_PATH,
      authority: "stage gate definitions"
    },
    {
      source: CLEAN_CODE_PATH,
      authority: "code quality constraints"
    },
    {
      source: SMELL_TRIGGERS_PATH,
      authority: "smell trigger routing policy"
    },
    {
      source: COLD_START_PATH,
      authority: "cold-start evaluation reference"
    }
  ];
}

function buildDeepReadPointers() {
  return [
    {
      source: CONTEXT_PATH,
      reason: "full glossary text and concept definitions — deep read when terminology is unclear"
    },
    {
      source: ROADMAP_PATH,
      reason:
        "concise roadmap list — use completed work-item packages for detailed history"
    },
    {
      source: CURRENT_CONTEXT_PATH,
      reason:
        "old closeout details in ## Status section — deep read when prior work item history is needed"
    }
  ];
}

async function requireSourceArtifact(repoRoot: string, displayPath: string) {
  try {
    await stat(path.join(repoRoot, displayPath));
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing session context source artifact: ${displayPath}`);
    }
    throw error;
  }
}

async function readRequiredArtifact(repoRoot: string, displayPath: string) {
  try {
    return await readFile(path.join(repoRoot, displayPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing session context source artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireCurrentPhase(content: string) {
  const phase = content.match(/^\*\*Phase:\*\*\s*(.+)$/m)?.[1];
  if (!phase) {
    throw new Error(
      "Session context blocked: CURRENT_CONTEXT.md is missing current phase"
    );
  }
  return normalizeText(phase);
}

function requireActiveWorkItem(content: string) {
  const activeWork = content.match(
    /^\*\*Active work item:\*\*\s*`?([A-Z][A-Z0-9]*-\d+)`?/m
  )?.[1];
  if (!activeWork) {
    throw new Error(
      "Session context blocked: CURRENT_CONTEXT.md is missing active work item"
    );
  }
  return activeWork;
}

function requireLabeledText(content: string, label: string, source: string) {
  const lines = content.split(/\r?\n/);
  const prefix = `**${label}:**`;
  const startIndex = lines.findIndex((line) => line.trim().startsWith(prefix));

  if (startIndex === -1) {
    throw new Error(`Session context blocked: ${source} is missing ${label}`);
  }

  const firstLine = lines[startIndex];
  if (!firstLine) {
    throw new Error(`Session context blocked: ${source} is missing ${label}`);
  }

  const parts = [firstLine.slice(firstLine.indexOf(prefix) + prefix.length)];
  for (const line of lines.slice(startIndex + 1)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("## ") || trimmed.startsWith("**")) {
      break;
    }
    parts.push(trimmed);
  }

  const text = normalizeText(parts.join(" "));
  if (!text) {
    throw new Error(`Session context blocked: ${source} has empty ${label}`);
  }
  return text;
}

function requireCurrentStage(content: string) {
  const match = content.match(/The current stage is (Stage [^.]+)\./);
  if (!match?.[1]) {
    throw new Error(
      "Session context blocked: CURRENT_CONTEXT.md is missing current stage"
    );
  }
  return normalizeText(match[1]);
}

function readRequiredOperatorInput(content: string) {
  const section =
    content.match(/## Required Operator Input\s+([\s\S]*?)(?:\n## |\s*$)/)?.[1] ?? "";
  return /No operator-owned input is required/i.test(section)
    ? ("none_required" as const)
    : ("required" as const);
}

function extractForbiddenActions(content: string) {
  const activeWorkSection =
    content.match(/## Active Work\s+([\s\S]*?)(?:\n## |\s*$)/)?.[1] ?? "";
  const normalizedSection = activeWorkSection.replace(/\r?\n/g, " ");
  const doNotMatch = normalizedSection.match(/Do not start ([^.]+)\./);
  if (!doNotMatch?.[1]) {
    return [];
  }
  return [`Do not start ${normalizeText(doNotMatch[1])}.`];
}

function parseBootstrapGapsRaw(content: string): RawGap[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Session context blocked: malformed bootstrap gap ledger");
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.gaps)) {
    throw new Error("Session context blocked: malformed bootstrap gap ledger");
  }
  return parsed.gaps.map((gap: unknown, index: number) => {
    if (!isRecord(gap)) {
      throw new Error(`Malformed bootstrap gap at index ${index + 1}`);
    }
    return {
      id: requireGapString(gap, "id"),
      title: optionalGapString(gap, "title"),
      status: requireGapString(gap, "status"),
      disposition: requireGapString(gap, "disposition"),
      linked_work_item: optionalGapString(gap, "linked_work_item") || null,
      verification_target: optionalGapString(gap, "verification_target") || null,
      source_artifacts: optionalGapStringList(gap, "source_artifacts")
    };
  });
}

function findActiveGap(gaps: RawGap[], activeWorkItemId: string): RawGap {
  const linked = gaps.find(
    (gap) => gap.linked_work_item === activeWorkItemId && gap.status !== "resolved"
  );
  if (!linked) {
    throw new Error(
      `Session context blocked: no active bootstrap gap linked to ${activeWorkItemId}`
    );
  }
  return linked;
}

function buildBlockers(gaps: RawGap[]) {
  return gaps
    .filter((gap) => gap.status !== "resolved")
    .map((gap) => ({
      id: gap.id,
      status: gap.disposition,
      source: BOOTSTRAP_GAPS_PATH,
      title: gap.title
    }));
}

function buildRequiredEvidencePaths(workItemId: string) {
  return STAGE_EVIDENCE_INFOS.map((info) => ({
    path: buildEvidenceSource(workItemId, info.filename),
    stage: info.stageLabel
  }));
}

function buildEvidenceSource(workItemId: string, filename: string) {
  return `docs/work/${workItemId}/${filename}`;
}

function normalizePhase(phase: string) {
  const normalized = phase.replace(/\.$/, "");
  return normalized.startsWith("Phase ") ? normalized : `Phase ${normalized}`;
}

function normalizeText(value: string) {
  return value
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForComparison(value: string) {
  return normalizeText(value)
    .replace(/[.;:]/g, "")
    .replace(/\s+-\s+/g, " ")
    .toLowerCase();
}

function nextActionsAgree(first: string, second: string, workItemId: string | null) {
  const normalizedFirst = normalizeForComparison(first);
  const normalizedSecond = normalizeForComparison(second);

  if (
    normalizedFirst === normalizedSecond ||
    normalizedFirst.includes(normalizedSecond) ||
    normalizedSecond.includes(normalizedFirst)
  ) {
    return true;
  }

  if (workItemId === null) return false;

  const workItem = workItemId.toLowerCase();
  if (
    normalizedFirst.includes(workItem) &&
    normalizedSecond.includes(workItem) &&
    matchingStage(normalizedFirst, normalizedSecond)
  ) {
    return true;
  }

  return false;
}

function matchingStage(first: string, second: string) {
  const firstStages = extractStageNumbers(first);
  const secondStages = extractStageNumbers(second);
  return firstStages.some((stage) => secondStages.includes(stage));
}

function extractStageNumbers(value: string) {
  return Array.from(value.matchAll(/\bstage\s+(\d+)\b/g)).map((match) =>
    String(match[1])
  );
}

function requireGapString(record: Record<string, unknown>, field: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Malformed bootstrap gap: missing required field: ${field}`);
  }
  return value.trim();
}

function optionalGapString(record: Record<string, unknown>, field: string) {
  const value = record[field];
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function optionalGapStringList(record: Record<string, unknown>, field: string): string[] {
  const value = record[field];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((s) => s.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
