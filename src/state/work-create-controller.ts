import { appendFile, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createWorkItem } from "../commands/work-item-create.js";
import {
  type ResolveResult,
  type WorkTarget,
  resolveRoadmapWorkTarget
} from "./roadmap-work-targets.js";
import { readLocalQwenProfile } from "./reviewer-profiles.js";

const CURRENT_CONTEXT_PATH = "docs/roadmap/CURRENT_CONTEXT.md";

export type RepoPmCreateControllerStatus = "brief_created" | "already_formed";

export type RepoPmCreateControllerResult = {
  kind: "repo_pm_create_controller_result";
  status: RepoPmCreateControllerStatus;
  work_item: string;
  target: WorkTarget;
  stage2_started: false;
  next_action: string;
};

export type RepoPmCreateControllerError = {
  kind: "repo_pm_create_controller_error";
  diagnostic: string;
  stage2_started: false;
};

export type RepoPmCreateControllerOutcome =
  | { ok: true; result: RepoPmCreateControllerResult }
  | { ok: false; error: RepoPmCreateControllerError };

export async function runRepoPmCreateController(
  repoRoot: string
): Promise<RepoPmCreateControllerOutcome> {
  const resolution = await resolveRoadmapWorkTarget(repoRoot);
  if (!resolution.ok) {
    return {
      ok: false,
      error: {
        kind: "repo_pm_create_controller_error",
        diagnostic: resolution.diagnostic,
        stage2_started: false
      }
    };
  }

  const target = resolution.resolution.target;
  const closedAnchor = resolution.resolution.closed_anchor ?? null;

  if (target.relationship === "current") {
    return handleCurrentTarget(repoRoot, target);
  }

  return handleNextTarget(repoRoot, target, closedAnchor);
}

async function handleCurrentTarget(
  repoRoot: string,
  target: WorkTarget
): Promise<RepoPmCreateControllerOutcome> {
  const formedApproved = await isCoordinationLogFormationApproved(
    repoRoot,
    target.id
  );

  if (formedApproved) {
    const nextAction =
      (await extractCurrentContextNextAction(repoRoot)) ??
      `Work Item PM should record plan-mode orchestration for ${target.id} before RED evidence.`;

    return {
      ok: true,
      result: {
        kind: "repo_pm_create_controller_result",
        status: "already_formed",
        work_item: target.id,
        target,
        stage2_started: false,
        next_action: nextAction
      }
    };
  }

  return {
    ok: false,
    error: {
      kind: "repo_pm_create_controller_error",
      diagnostic:
        `Current work item ${target.id} is not formation_approved; ` +
        `refusing to re-allocate or skip formation review.`,
      stage2_started: false
    }
  };
}

async function handleNextTarget(
  repoRoot: string,
  target: WorkTarget,
  closedAnchor: { id: string } | null = null
): Promise<RepoPmCreateControllerOutcome> {
  if (closedAnchor !== null) {
    const boundaryError = await checkClosedAnchorSliceBoundary(repoRoot, closedAnchor.id);
    if (boundaryError !== null) {
      return {
        ok: false,
        error: {
          kind: "repo_pm_create_controller_error",
          diagnostic: boundaryError,
          stage2_started: false
        }
      };
    }
  }

  const explicitSource = await findExplicitSourceSpec(repoRoot, target);

  if (!explicitSource) {
    const prdSubId = extractPrdSubId(target.title);
    const targetDescriptor = prdSubId
      ? `BANDIT-PRD-${prdSubId} ${target.title.replace(/^PRD-\S+\s+/, "")}`.trim()
      : target.title;

    return {
      ok: false,
      error: {
        kind: "repo_pm_create_controller_error",
        diagnostic:
          `Roadmap target refused: missing explicit source spec for ` +
          `${targetDescriptor || target.title}. ` +
          `Provide a matching docs/specs/<WORK_ITEM_ID>-<slug>.json whose title resolves the target.`,
        stage2_started: false
      }
    };
  }

  const operatorInput = await readOperatorInputStatus(repoRoot);
  if (!isOperatorInputNoneRequired(operatorInput.status)) {
    return {
      ok: false,
      error: {
        kind: "repo_pm_create_controller_error",
        diagnostic:
          `Refused to create controller: operator-owned input required.\n` +
          `${operatorInput.status}`,
        stage2_started: false
      }
    };
  }

  try {
    await readLocalQwenProfile(repoRoot);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      error: {
        kind: "repo_pm_create_controller_error",
        diagnostic:
          `Local Qwen authorized route is missing or invalid: ${detail}. ` +
          `Refused to create controller without .bandit/reviewers/local-qwen.json ` +
          `pointing at node bin/omlx-chat-completions.mjs.`,
        stage2_started: false
      }
    };
  }

  const createOutput = await createWorkItem(repoRoot, [
    "create",
    explicitSource.specPath
  ], { explicitId: explicitSource.workItemId });
  const workItemId = parseCreatedWorkItemId(createOutput.output);

  if (!workItemId) {
    return {
      ok: false,
      error: {
        kind: "repo_pm_create_controller_error",
        diagnostic:
          `Refused to create controller: could not determine allocated work item id ` +
          `from create-work-item output: ${createOutput.output}`,
        stage2_started: false
      }
    };
  }

  if (workItemId !== explicitSource.workItemId) {
    return {
      ok: false,
      error: {
        kind: "repo_pm_create_controller_error",
        diagnostic:
          `Refused to create controller: allocated work item id ${workItemId} ` +
          `does not match source spec work item id ${explicitSource.workItemId}.`,
        stage2_started: false
      }
    };
  }

  await appendBriefCreatedStepTransition(repoRoot, workItemId, {
    specPath: explicitSource.specPath,
    sourceTitle: explicitSource.sourceTitle
  });

  return {
    ok: true,
    result: {
      kind: "repo_pm_create_controller_result",
      status: "brief_created",
      work_item: workItemId,
      target,
      stage2_started: false,
      next_action: `Run formation review and approve formation for ${workItemId} before Work Item PM execution.`
    }
  };
}

type ExplicitSource = {
  workItemId: string;
  specPath: string;
  sourceTitle: string;
};

async function findExplicitSourceSpec(
  repoRoot: string,
  target: WorkTarget
): Promise<ExplicitSource | null> {
  const specsDir = path.join(repoRoot, "docs/specs");
  let files: string[];
  try {
    files = await readdir(specsDir);
  } catch {
    return null;
  }

  const normalizedTargetTitle = normalizeComparableTitle(target.title);
  const targetPrdSubId = extractPrdSubId(target.title);
  const targetPrdFull = targetPrdSubId ? `BANDIT-PRD-${targetPrdSubId}` : null;
  const targetPrdShort = targetPrdSubId ? `PRD-${targetPrdSubId}` : null;

  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  for (const file of jsonFiles) {
    const idMatch = file.match(/^(BANDIT-\d+)-.+\.json$/);
    if (!idMatch || !idMatch[1]) continue;
    const workItemId = idMatch[1];

    const specPath = `docs/specs/${file}`;
    let content: string;
    try {
      content = await readFile(path.join(repoRoot, specPath), "utf8");
    } catch {
      continue;
    }

    let spec: unknown;
    try {
      spec = JSON.parse(content);
    } catch {
      continue;
    }

    if (!isRecord(spec)) continue;

    const specTitle = typeof spec.title === "string" ? spec.title : null;
    const normalizedSpecTitle = specTitle ? specTitle.toLowerCase() : null;
    const specGoal =
      typeof spec.goal === "string" ? spec.goal.toLowerCase() : null;
    const specScope = Array.isArray(spec.scope)
      ? spec.scope
          .filter((entry): entry is string => typeof entry === "string")
          .join("\n")
          .toLowerCase()
      : null;

    if (
      specTitle &&
      normalizeComparableTitle(specTitle) === normalizedTargetTitle
    ) {
      return {
        workItemId,
        specPath,
        sourceTitle: specTitle
      };
    }

    if (
      targetPrdFull &&
      ((specGoal && specGoal.includes(targetPrdFull.toLowerCase())) ||
        (specScope && specScope.includes(targetPrdFull.toLowerCase())) ||
        (normalizedSpecTitle &&
          normalizedSpecTitle.includes(targetPrdFull.toLowerCase())))
    ) {
      return {
        workItemId,
        specPath,
        sourceTitle: specTitle ?? targetPrdFull
      };
    }

    if (
      targetPrdShort &&
      ((specGoal && specGoal.includes(targetPrdShort.toLowerCase())) ||
        (specScope && specScope.includes(targetPrdShort.toLowerCase())) ||
        (normalizedSpecTitle &&
          normalizedSpecTitle.includes(targetPrdShort.toLowerCase())))
    ) {
      return {
        workItemId,
        specPath,
        sourceTitle: specTitle ?? targetPrdShort
      };
    }
  }

  return null;
}

function normalizeComparableTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/^prd-\d+(?:\.\d+)?\s+/, "")
    .replace(/^\d+(?:\.\d+)?\s+/, "")
    .trim()
    .replace(/\s+/g, " ");
}

function extractPrdSubId(title: string): string | null {
  const match = title.match(/\bPRD-(\d+(?:\.\d+)?)\b/);
  return match && match[1] ? match[1] : null;
}

async function readOperatorInputStatus(
  repoRoot: string
): Promise<{ status: string }> {
  const content = await readFile(
    path.join(repoRoot, CURRENT_CONTEXT_PATH),
    "utf8"
  );
  const section = extractSectionContent(content, "Required Operator Input");
  return { status: section.trim() };
}

function isOperatorInputNoneRequired(status: string): boolean {
  const normalized = normalizeOperatorInputLine(status);
  if (normalized === "none_required") return true;
  if (normalized === "none required") return true;
  return status
    .split(/\r?\n/)
    .some((line) => {
      const normalizedLine = normalizeOperatorInputLine(line);
      return (
        normalizedLine === "none_required" ||
        normalizedLine === "none required"
      );
    });
}

function normalizeOperatorInputLine(value: string): string {
  return value.toLowerCase().trim().replace(/[.,;:!\s]+$/, "");
}

function extractSectionContent(content: string, sectionTitle: string): string {
  const pattern = new RegExp(
    `##\\s+${escapeRegExp(sectionTitle)}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`,
    "gi"
  );
  let lastMatch: string | undefined;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    if (match[1] !== undefined) {
      lastMatch = match[1];
    }
    if (pattern.lastIndex === match.index) {
      pattern.lastIndex += 1;
    }
  }
  return lastMatch ?? "";
}

async function extractCurrentContextNextAction(
  repoRoot: string
): Promise<string | null> {
  const content = await readFile(
    path.join(repoRoot, CURRENT_CONTEXT_PATH),
    "utf8"
  );
  const match = content.match(/\*\*Current next action:\*\*\s*([^\n]+)/);
  return match && match[1] ? match[1].trim() : null;
}

async function readCoordinationLogLatestState(
  repoRoot: string,
  workItemId: string
): Promise<string | null> {
  const logPath = path.join(repoRoot, "docs/work", workItemId, "coordination-log.jsonl");
  let content: string;
  try {
    content = await readFile(logPath, "utf8");
  } catch {
    return null;
  }

  let latestSequence = -1;
  let latestState: string | null = null;
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (!isRecord(parsed)) continue;
    if (parsed.event_type !== "step_transition") continue;
    if (typeof parsed.sequence !== "number") continue;
    if (parsed.sequence <= latestSequence) continue;
    latestSequence = parsed.sequence;
    latestState = typeof parsed.state === "string" ? parsed.state : null;
  }

  return latestState;
}

async function isCoordinationLogFormationApproved(
  repoRoot: string,
  workItemId: string
): Promise<boolean> {
  return (await readCoordinationLogLatestState(repoRoot, workItemId)) === "formation_approved";
}

async function isCoordinationLogClosed(
  repoRoot: string,
  workItemId: string
): Promise<boolean> {
  return (await readCoordinationLogLatestState(repoRoot, workItemId)) === "closed";
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function checkClosedAnchorSliceBoundary(
  repoRoot: string,
  closedId: string
): Promise<string | null> {
  const requiredArtifacts = [
    `docs/work/${closedId}/landing-action.md`,
    `docs/work/${closedId}/retrospective.md`,
    `docs/work/${closedId}/improvement-disposition.md`
  ];

  const missing: string[] = [];
  for (const artifact of requiredArtifacts) {
    if (!(await fileExists(path.join(repoRoot, artifact)))) {
      missing.push(path.basename(artifact));
    }
  }

  if (!(await isCoordinationLogClosed(repoRoot, closedId))) {
    missing.push("coordination transition: closed");
  }

  if (missing.length === 0) return null;

  return (
    `Closed current work item ${closedId} is missing required slice-boundary evidence: ` +
    `${missing.join(", ")}. ` +
    `Ensure ${closedId} has complete closeout before routing to the next target.`
  );
}

function parseCreatedWorkItemId(output: string): string | null {
  const match = output.match(/^Created work item:\s*(BANDIT-\d+)/m);
  return match && match[1] ? match[1] : null;
}

type BriefCreatedEvidence = {
  specPath: string;
  sourceTitle: string;
};

async function appendBriefCreatedStepTransition(
  repoRoot: string,
  workItemId: string,
  evidence: BriefCreatedEvidence
): Promise<void> {
  const logPath = path.join(
    repoRoot,
    "docs/work",
    workItemId,
    "coordination-log.jsonl"
  );

  let existingContent = "";
  let lastSequence = 0;
  try {
    existingContent = await readFile(logPath, "utf8");
    for (const line of existingContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed) as { sequence?: unknown };
        if (
          isRecord(parsed) &&
          typeof parsed.sequence === "number" &&
          parsed.sequence > lastSequence
        ) {
          lastSequence = parsed.sequence;
        }
      } catch {
        continue;
      }
    }
  } catch {
    existingContent = "";
  }

  const evidenceList = [
    `docs/work/${workItemId}/brief.md`,
    evidence.specPath
  ];

  const transition = {
    version: 1,
    event_type: "step_transition",
    work_item: workItemId,
    sequence: lastSequence + 1,
    timestamp: new Date().toISOString(),
    actor: "repo_pm",
    source: "repo-pm create-controller",
    state: "brief_created",
    evidence: evidenceList,
    safe_triggers: ["formation_required"],
    next_action: `Run formation review and approve formation for ${workItemId} before Work Item PM execution.`,
    accountable_actor: "repo_pm",
    accepted_block: null
  };

  const separator = existingContent.endsWith("\n") || existingContent.length === 0
    ? ""
    : "\n";
  await appendFile(logPath, `${separator}${JSON.stringify(transition)}\n`, "utf8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type { ResolveResult };
