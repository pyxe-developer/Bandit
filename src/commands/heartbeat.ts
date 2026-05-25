import { readBootstrapGaps } from "../state/bootstrap-gaps.js";
import { readGitStatusShortIncludingUntrackedFiles } from "../state/git.js";
import { readHeartbeatPolicy } from "../state/heartbeat-policy.js";
import { readWorkItems, type WorkItem } from "../state/work-items.js";

type HeartbeatCandidate = {
  work_item: string;
  status: "eligible" | "ineligible" | "operator_input_blocked";
  reason: string;
  allowed_next_action: string | null;
  evidence: string[];
  required_input?: string;
};

const POLICY_DISPLAY_PATH = ".bandit/policy/heartbeat-chore-agent.json";
const BOOTSTRAP_GAPS_DISPLAY_PATH = ".bandit/bootstrap-gaps.json";
const GAP_NEXT_ACTION_PATTERNS = [
  { pattern: /\bcreate red evidence\b/, action: "create_red_evidence" },
  { pattern: /\brecord red evidence\b/, action: "create_red_evidence" },
  { pattern: /\bimplement\b/, action: "implement" }
];

export async function heartbeat(repoRoot: string, args: string[]) {
  const [action, ...actionArgs] = args;

  if (action !== "inspect") {
    const unsupportedAction = action || "";
    throw new Error(
      `Heartbeat chore agent cannot perform unsupported action: ${unsupportedAction}`
    );
  }

  const options = parseInspectOptions(actionArgs);
  await readHeartbeatPolicy(repoRoot);
  await assertCleanWorktree(repoRoot);

  const workItems = await readWorkItems(repoRoot);
  const gapLedger = await readBootstrapGaps(repoRoot);
  const candidates = buildHeartbeatCandidates(
    workItems,
    gapLedger.gaps,
    options.asOf
  );

  const payload = {
    action: "inspect",
    policy: POLICY_DISPLAY_PATH,
    candidates
  };

  if (options.json) {
    return { output: `${JSON.stringify(payload, null, 2)}\n` };
  }

  return {
    output: candidates.length === 0
      ? "No heartbeat candidates found.\n"
      : candidates.map(formatCandidate).join("\n").concat("\n")
  };
}

function parseInspectOptions(args: string[]) {
  let json = false;
  let asOf = currentDate();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--json") {
      json = true;
      continue;
    }

    if (arg === "--as-of") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("Usage: bandit heartbeat inspect [--as-of <date>] [--json]");
      }
      asOf = value;
      index += 1;
      continue;
    }

    throw new Error("Usage: bandit heartbeat inspect [--as-of <date>] [--json]");
  }

  return { json, asOf };
}

function buildHeartbeatCandidates(
  workItems: WorkItem[],
  gaps: Awaited<ReturnType<typeof readBootstrapGaps>>["gaps"],
  asOf: string
) {
  const candidates: HeartbeatCandidate[] = [];

  for (const item of workItems) {
    const linkedGap = gaps.find((gap) => gap.linkedWorkItem === item.id);

    if (
      linkedGap?.status === "operator_input_blocked" ||
      linkedGap?.disposition === "operator_input_blocker"
    ) {
      candidates.push({
        work_item: item.id,
        status: "operator_input_blocked",
        reason: linkedGap.rationale,
        required_input: linkedGap.nextAction,
        allowed_next_action: null,
        evidence: [
          briefDisplayPath(item.id),
          BOOTSTRAP_GAPS_DISPLAY_PATH
        ]
      });
      continue;
    }

    if (
      linkedGap?.status === "active" &&
      linkedGap.disposition === "active_chore" &&
      isChore(item)
    ) {
      candidates.push({
        work_item: item.id,
        status: "eligible",
        reason: "active bootstrap-gap chore",
        allowed_next_action: normalizeGapNextAction(linkedGap.nextAction),
        evidence: [
          briefDisplayPath(item.id),
          BOOTSTRAP_GAPS_DISPLAY_PATH,
          POLICY_DISPLAY_PATH
        ]
      });
      continue;
    }

    if (isDueImprovementEvaluation(item, asOf)) {
      candidates.push({
        work_item: item.id,
        status: "eligible",
        reason: "due improvement evaluation",
        allowed_next_action: "record_improvement_evaluation",
        evidence: [briefDisplayPath(item.id), POLICY_DISPLAY_PATH]
      });
      continue;
    }

    if (isFeatureSliceRequiringUat(item)) {
      candidates.push({
        work_item: item.id,
        status: "ineligible",
        reason: "feature slice requires operator-owned UAT",
        allowed_next_action: null,
        evidence: [briefDisplayPath(item.id)]
      });
    }
  }

  return candidates;
}

function isChore(item: WorkItem) {
  return item.content.includes("## Non-Product Work") || isImprovementChore(item);
}

function isImprovementChore(item: WorkItem) {
  return /^origin:\s*retrospective\s*$/m.test(item.content);
}

function isDueImprovementEvaluation(item: WorkItem, asOf: string) {
  if (!isImprovementChore(item)) {
    return false;
  }

  const outcome = readMetadataValue(item.content, "outcome");
  if (outcome !== "pending") {
    return false;
  }

  const dueOn = item.content.match(/^evaluation_window:\s*due_on:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1];
  return Boolean(dueOn && dueOn <= asOf);
}

function isFeatureSliceRequiringUat(item: WorkItem) {
  const uatStatus = readMarkdownSection(item.content, "UAT Status")?.toLowerCase();
  return Boolean(
    uatStatus &&
      (uatStatus.includes("not approved") || !uatStatus.includes("approved"))
  );
}

function readMetadataValue(content: string, field: string) {
  return content.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, "m"))?.[1]?.trim();
}

function normalizeGapNextAction(nextAction: string) {
  const normalized = normalizeActionText(nextAction);
  const matches = GAP_NEXT_ACTION_PATTERNS.flatMap(({ pattern, action }) =>
    pattern.test(normalized) ? [action] : []
  );

  const uniqueMatches = new Set(matches);
  if (uniqueMatches.size === 1) {
    return Array.from(uniqueMatches)[0] ?? "inspect";
  }

  return "inspect";
}

async function assertCleanWorktree(repoRoot: string) {
  const status = await readGitStatusShortIncludingUntrackedFiles(repoRoot);
  if (status === null) {
    throw new Error("Heartbeat inspect blocked: unable to inspect git worktree");
  }

  if (status.length > 0) {
    throw new Error("Heartbeat inspect blocked: worktree is dirty");
  }
}

function readMarkdownSection(content: string, heading: string) {
  const lines = content.split(/\r?\n/);
  const targetHeading = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === targetHeading);
  if (startIndex === -1) {
    return null;
  }

  const sectionLines: string[] = [];
  for (const line of lines.slice(startIndex + 1)) {
    if (/^##\s+\S/.test(line)) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines.join("\n").trim();
}

function normalizeActionText(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function briefDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/brief.md`;
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatCandidate(candidate: HeartbeatCandidate) {
  return [
    `Work item: ${candidate.work_item}`,
    `Status: ${candidate.status}`,
    `Reason: ${candidate.reason}`,
    `Allowed next action: ${candidate.allowed_next_action ?? "none"}`,
    candidate.required_input ? `Required input: ${candidate.required_input}` : null,
    `Evidence: ${candidate.evidence.join(", ")}`
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
