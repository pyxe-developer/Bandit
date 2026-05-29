import { readFile, stat } from "node:fs/promises";
import path from "node:path";

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
};

export type FocusedSessionContextPacket = {
  kind: "focused_session_context_packet";
  authority: "derived_non_canonical";
  current_phase: { value: string; source: string };
  active_work_item: { id: string; source: string };
  active_bootstrap_gap: { id: string; source: string };
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
};

export async function readFocusedSessionContext(
  repoRoot: string
): Promise<FocusedSessionContextPacket> {
  await requireSourceArtifact(repoRoot, AGENTS_PATH);

  const currentContext = await readRequiredArtifact(repoRoot, CURRENT_CONTEXT_PATH);
  const roadmap = await readRequiredArtifact(repoRoot, ROADMAP_PATH);

  const phase = requireCurrentPhase(currentContext);
  const activeWorkItemId = requireActiveWorkItem(currentContext);
  const nextAction = requireLabeledText(
    currentContext,
    "Current next action",
    CURRENT_CONTEXT_PATH
  );
  const roadmapNextStep = requireLabeledText(roadmap, "Current next step", ROADMAP_PATH);

  if (!nextActionsAgree(nextAction, roadmapNextStep, activeWorkItemId)) {
    throw new Error(
      "Session context blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action"
    );
  }

  const currentStage = requireCurrentStage(currentContext);
  const requiredOperatorInput = readRequiredOperatorInput(currentContext);
  const forbiddenActions = extractForbiddenActions(currentContext);
  const allowedActions = [nextAction];

  const bootstrapGapsContent = await readRequiredArtifact(repoRoot, BOOTSTRAP_GAPS_PATH);
  const rawGaps = parseBootstrapGapsRaw(bootstrapGapsContent);
  const activeBootstrapGap = findActiveGap(rawGaps, activeWorkItemId);
  const blockers = buildBlockers(rawGaps);

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
    allowed_actions: allowedActions,
    forbidden_actions: forbiddenActions,
    required_evidence_paths: buildRequiredEvidencePaths(activeWorkItemId),
    source_artifacts: [
      { path: AGENTS_PATH, role: "role rules and process boundaries" },
      { path: CLEAN_CODE_PATH, role: "code quality constraints" },
      { path: CURRENT_CONTEXT_PATH, role: "current phase and next action authority" },
      { path: ROADMAP_PATH, role: "roadmap position and phase history" },
      { path: STAGE_RUBRICS_PATH, role: "stage gate rubrics" },
      { path: BOOTSTRAP_GAPS_PATH, role: "bootstrap gap ledger" },
      { path: SMELL_TRIGGERS_PATH, role: "smell trigger routing policy" },
      { path: COLD_START_PATH, role: "cold-start evaluation packet" }
    ],
    source_hierarchy: [
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
        authority: "roadmap position and phase history"
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
    ],
    stale_or_missing_evidence: [],
    deep_read_pointers: [
      {
        source: CONTEXT_PATH,
        reason:
          "full glossary text and concept definitions — deep read when terminology is unclear"
      },
      {
        source: ROADMAP_PATH,
        reason:
          "historical roadmap narrative and old closeout details — deep read when full history is needed"
      },
      {
        source: CURRENT_CONTEXT_PATH,
        reason:
          "old closeout details in ## Status section — deep read when prior work item history is needed"
      }
    ]
  };
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
      linked_work_item: optionalGapString(gap, "linked_work_item") || null
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
  return [
    { path: `docs/work/${workItemId}/brief.md`, stage: "Stage 1" },
    { path: `docs/work/${workItemId}/red-evidence.md`, stage: "Stage 2" },
    { path: `docs/work/${workItemId}/implementation-evidence.md`, stage: "Stage 3" },
    { path: `docs/work/${workItemId}/review-evidence.md`, stage: "Stage 4" },
    { path: `docs/work/${workItemId}/landing-verdict.md`, stage: "Stage 5" },
    { path: `docs/work/${workItemId}/retrospective.md`, stage: "Stage 6" }
  ];
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

function nextActionsAgree(first: string, second: string, workItemId: string) {
  const normalizedFirst = normalizeForComparison(first);
  const normalizedSecond = normalizeForComparison(second);
  const workItem = workItemId.toLowerCase();

  if (
    normalizedFirst === normalizedSecond ||
    normalizedFirst.includes(normalizedSecond) ||
    normalizedSecond.includes(normalizedFirst)
  ) {
    return true;
  }

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
