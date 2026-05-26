import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

type SourceValue<T> = {
  value: T;
  source: string;
};

type BootstrapGapSummary = {
  status: "none" | "open";
  source: string;
  gaps: Array<{
    id: string;
    status: string;
    next_action: string;
    source_artifacts: string[];
  }>;
};

type CockpitStatus = {
  kind: "workflow_cockpit_status";
  authority: "derived_non_canonical";
  current_phase: SourceValue<string>;
  active_work_item: {
    id: string;
    source: string;
  };
  next_action: SourceValue<string>;
  required_operator_input: SourceValue<"none_required" | "required">;
  blockers: string[];
  bootstrap_gaps: BootstrapGapSummary;
  gates: {
    stage_2_red_evidence: {
      status: "pass" | "missing";
      source: string;
    };
  };
  landing_readiness: {
    status: "ready" | "not_ready";
    reason: string;
    source: string;
  };
  uat: {
    status: "not_applicable";
    source: string;
  };
  improvement_health: {
    status: "pending_candidates" | "no_pending_candidates";
    source: string;
    sources: string[];
    candidates: string[];
  };
  coordination: {
    current_state: string;
    next_action: string | null;
    source: string;
  } | null;
};

const CURRENT_CONTEXT_PATH = "docs/roadmap/CURRENT_CONTEXT.md";
const ROADMAP_PATH = "docs/roadmap/ROADMAP.md";
const BOOTSTRAP_GAPS_PATH = ".bandit/bootstrap-gaps.json";

export async function readCockpitStatus(repoRoot: string): Promise<CockpitStatus> {
  const currentContext = await readRequiredArtifact(repoRoot, CURRENT_CONTEXT_PATH);
  const roadmap = await readRequiredArtifact(repoRoot, ROADMAP_PATH);
  const currentPhase = requireCurrentPhase(currentContext.content);
  const activeWorkItemId = requireActiveWorkItem(currentContext.content);
  const nextAction = requireLabeledText(
    currentContext.content,
    "Current next action",
    CURRENT_CONTEXT_PATH
  );
  const roadmapNextAction = requireLabeledText(
    roadmap.content,
    "Current next step",
    ROADMAP_PATH
  );

  if (!nextActionsAgree(nextAction, roadmapNextAction, activeWorkItemId)) {
    throw new Error(
      "Cockpit status blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action"
    );
  }

  const briefPath = `docs/work/${activeWorkItemId}/brief.md`;
  const brief = await readRequiredArtifact(repoRoot, briefPath);
  assertActiveBrief(activeWorkItemId, brief.content);

  const redEvidencePath = `docs/work/${activeWorkItemId}/red-evidence.md`;
  const implementationEvidencePath =
    `docs/work/${activeWorkItemId}/implementation-evidence.md`;

  return {
    kind: "workflow_cockpit_status",
    authority: "derived_non_canonical",
    current_phase: {
      value: normalizePhase(currentPhase),
      source: CURRENT_CONTEXT_PATH
    },
    active_work_item: {
      id: activeWorkItemId,
      source: briefPath
    },
    next_action: {
      value: nextAction,
      source: CURRENT_CONTEXT_PATH
    },
    required_operator_input: {
      value: readRequiredOperatorInput(currentContext.content),
      source: CURRENT_CONTEXT_PATH
    },
    blockers: [],
    bootstrap_gaps: await readBootstrapGapSummary(repoRoot),
    gates: {
      stage_2_red_evidence: {
        status: (await pathExists(repoRoot, redEvidencePath)) ? "pass" : "missing",
        source: redEvidencePath
      }
    },
    landing_readiness: await readLandingReadiness(
      repoRoot,
      implementationEvidencePath
    ),
    uat: {
      status: "not_applicable",
      source: briefPath
    },
    improvement_health: await readImprovementHealth(repoRoot),
    coordination: await readCoordinationSummary(repoRoot, activeWorkItemId)
  };
}

async function readRequiredArtifact(repoRoot: string, displayPath: string) {
  try {
    return {
      displayPath,
      content: await readFile(path.join(repoRoot, displayPath), "utf8")
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing cockpit source artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireCurrentPhase(content: string) {
  const phase = content.match(/^\*\*Phase:\*\*\s*(.+)$/m)?.[1];
  if (!phase) {
    throw new Error(
      "Cockpit status blocked: CURRENT_CONTEXT.md is missing current phase"
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
      "Cockpit status blocked: CURRENT_CONTEXT.md is missing active work item"
    );
  }
  return activeWork;
}

function requireLabeledText(content: string, label: string, source: string) {
  const lines = content.split(/\r?\n/);
  const prefix = `**${label}:**`;
  const startIndex = lines.findIndex((line) => line.trim().startsWith(prefix));

  if (startIndex === -1) {
    throw new Error(`Cockpit status blocked: ${source} is missing ${label}`);
  }

  const firstLine = lines[startIndex];
  if (!firstLine) {
    throw new Error(`Cockpit status blocked: ${source} is missing ${label}`);
  }

  const parts = [firstLine.slice(firstLine.indexOf(prefix) + prefix.length)];
  for (const line of lines.slice(startIndex + 1)) {
    const trimmed = line.trim();
    if (
      trimmed.length === 0 ||
      trimmed.startsWith("## ") ||
      trimmed.startsWith("**")
    ) {
      break;
    }
    parts.push(trimmed);
  }

  const text = normalizeText(parts.join(" "));
  if (!text) {
    throw new Error(`Cockpit status blocked: ${source} has empty ${label}`);
  }
  return text;
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

  return (
    normalizedFirst.includes(workItem) &&
    normalizedSecond.includes(workItem) &&
    matchingActionTopic(normalizedFirst, normalizedSecond)
  );
}

function matchingActionTopic(first: string, second: string) {
  return [
    ["cockpit status foundation", "implement"],
    ["stage 4 review", "review"]
  ].some((terms) =>
    terms.every((term) => first.includes(term) && second.includes(term))
  );
}

function assertActiveBrief(workItemId: string, content: string) {
  const status = content.match(/## Status\s+([\s\S]*?)(?:\n## |\s*$)/)?.[1];
  if (!status) {
    throw new Error(
      `Cockpit status blocked: active work item ${workItemId} has malformed brief status`
    );
  }

  if (/\bclosed\b/i.test(status)) {
    throw new Error(
      `Cockpit status blocked: active work item ${workItemId} is marked closed`
    );
  }
}

function readRequiredOperatorInput(content: string) {
  const section = content.match(
    /## Required Operator Input\s+([\s\S]*?)(?:\n## |\s*$)/
  )?.[1] ?? "";

  return /No operator-owned input is required/i.test(section)
    ? "none_required"
    : "required";
}

async function readBootstrapGapSummary(
  repoRoot: string
): Promise<BootstrapGapSummary> {
  const content = await readRequiredArtifact(repoRoot, BOOTSTRAP_GAPS_PATH);
  const parsed = parseJsonRecord(content.content, "Malformed cockpit bootstrap gap source");
  const rawGaps = parsed.gaps;
  if (!Array.isArray(rawGaps)) {
    throw new Error("Malformed cockpit bootstrap gap source: missing gaps list");
  }

  const gaps = rawGaps.map((rawGap, index) => {
    if (!isRecord(rawGap)) {
      throw new Error(`Malformed cockpit bootstrap gap at index ${index + 1}`);
    }

    return {
      id: requireJsonString(rawGap, "id", index + 1),
      status: requireJsonString(rawGap, "status", index + 1),
      next_action: requireJsonString(rawGap, "next_action", index + 1),
      source_artifacts: readJsonStringList(rawGap, "source_artifacts")
    };
  });
  const openGaps = gaps.filter((gap) => gap.status !== "resolved");

  return {
    status: openGaps.length > 0 ? "open" : "none",
    source: BOOTSTRAP_GAPS_PATH,
    gaps: openGaps
  };
}

async function readLandingReadiness(repoRoot: string, source: string) {
  if (await pathExists(repoRoot, source)) {
    return {
      status: "ready" as const,
      reason: "implementation evidence is recorded",
      source
    };
  }

  return {
    status: "not_ready" as const,
    reason: "implementation evidence is not recorded",
    source
  };
}

async function readImprovementHealth(repoRoot: string) {
  const candidateSources = await findImprovementCandidateSources(repoRoot);
  if (candidateSources.length === 0) {
    return {
      status: "no_pending_candidates" as const,
      source: "docs/work/*/*-finding-disposition.md",
      sources: [],
      candidates: []
    };
  }

  const candidateGroups = await Promise.all(
    candidateSources.map(async (source) => {
      const artifact = await readRequiredArtifact(repoRoot, source);
      return Array.from(
        artifact.content.matchAll(/^### Chore Candidate:\s+`([^`]+)`/gm)
      ).map((match) => String(match[1]));
    })
  );
  const candidates = candidateGroups.flat();

  return {
    status: candidates.length > 0
      ? ("pending_candidates" as const)
      : ("no_pending_candidates" as const),
    source: candidateSources.join(", "),
    sources: candidateSources,
    candidates
  };
}

async function findImprovementCandidateSources(repoRoot: string) {
  const workRoot = path.join(repoRoot, "docs/work");
  let workItems: string[];
  try {
    workItems = await readdir(workRoot);
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }

  const sources: string[] = [];
  for (const workItem of workItems.sort()) {
    const workItemPath = path.join(workRoot, workItem);
    let entries: string[];
    try {
      entries = await readdir(workItemPath);
    } catch (error) {
      if (isMissingPathError(error)) {
        continue;
      }
      throw error;
    }

    for (const entry of entries.sort()) {
      if (entry.endsWith("-finding-disposition.md")) {
        sources.push(`docs/work/${workItem}/${entry}`);
      }
    }
  }

  return sources;
}

async function readCoordinationSummary(repoRoot: string, workItemId: string) {
  const source = `docs/work/${workItemId}/coordination-log.jsonl`;
  if (!(await pathExists(repoRoot, source))) {
    return null;
  }

  const artifact = await readRequiredArtifact(repoRoot, source);
  const lines = artifact.content.split(/\r?\n/).filter((line) => line.trim());
  const latestLine = lines.at(-1);
  if (!latestLine) {
    throw new Error(`Cockpit status blocked: empty coordination log: ${source}`);
  }
  const latest = parseJsonRecord(
    latestLine,
    `Cockpit status blocked: malformed coordination log: ${source}`
  );

  return {
    current_state: requireJsonString(latest, "state", lines.length),
    next_action: optionalJsonString(latest, "next_action"),
    source
  };
}

async function pathExists(repoRoot: string, displayPath: string) {
  try {
    await stat(path.join(repoRoot, displayPath));
    return true;
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

function parseJsonRecord(content: string, message: string) {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed)) {
      throw new Error(message);
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error && error.message === message) {
      throw error;
    }
    throw new Error(message);
  }
}

function requireJsonString(
  record: Record<string, unknown>,
  field: string,
  index: number
) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Malformed cockpit JSON record at index ${index}: missing ${field}`
    );
  }
  return value.trim();
}

function optionalJsonString(record: Record<string, unknown>, field: string) {
  const value = record[field];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function readJsonStringList(record: Record<string, unknown>, field: string) {
  const value = record[field];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
