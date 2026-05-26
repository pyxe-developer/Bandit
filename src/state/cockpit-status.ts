import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export type SourceValue<T> = {
  value: T;
  source: string;
};

export type BootstrapGapSummary = {
  status: "none" | "open";
  source: string;
  gaps: Array<{
    id: string;
    status: string;
    next_action: string;
    source_artifacts: string[];
  }>;
};

export type CockpitBlocker = {
  kind: "operator_input_required" | "bootstrap_gap";
  status: "blocked";
  summary: string;
  source: string;
  source_artifacts?: string[];
};

export type GateStatus = {
  status: "pass" | "missing";
  source: string;
};

export type StaleEvidence = {
  kind: "review_evidence" | "review_subject_hash" | "landing_verdict";
  status: "stale";
  source: string;
  basis: "source_drift_status" | "review_subject_hash_status";
};

export type CockpitStatus = {
  kind: "workflow_cockpit_status";
  authority: "derived_non_canonical";
  current_phase: SourceValue<string>;
  active_work_item: {
    id: string;
    source: string;
  };
  next_action: SourceValue<string> & {
    agreement: {
      status: "pass";
      compared_with: string;
      basis: "normalized_text" | "work_item_and_stage" | "topic_match";
    };
  };
  required_operator_input: SourceValue<"none_required" | "required">;
  blockers: CockpitBlocker[];
  bootstrap_gaps: BootstrapGapSummary;
  gates: {
    stage_0_context_readiness: {
      status: "pass";
      sources: string[];
    };
    stage_1_brief: GateStatus;
    stage_2_red_evidence: GateStatus;
    stage_3_implementation: GateStatus;
    stage_4_review: GateStatus;
    stage_5_landing: GateStatus;
    stage_6_retrospective: GateStatus;
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
  stale_evidence: StaleEvidence[];
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

  const nextActionAgreement = nextActionsAgree(
    nextAction,
    roadmapNextAction,
    activeWorkItemId
  );
  if (!nextActionAgreement) {
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
  const reviewEvidencePath = `docs/work/${activeWorkItemId}/review-evidence.md`;
  const landingVerdictPath = `docs/work/${activeWorkItemId}/landing-verdict.md`;
  const retrospectivePath = `docs/work/${activeWorkItemId}/retrospective.md`;
  const bootstrapGaps = await readBootstrapGapSummary(repoRoot);

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
      source: CURRENT_CONTEXT_PATH,
      agreement: {
        status: "pass",
        compared_with: ROADMAP_PATH,
        basis: nextActionAgreement
      }
    },
    required_operator_input: {
      value: readRequiredOperatorInput(currentContext.content),
      source: CURRENT_CONTEXT_PATH
    },
    blockers: readBlockers(currentContext.content, bootstrapGaps),
    bootstrap_gaps: bootstrapGaps,
    gates: await readGateMatrix(repoRoot, {
      briefPath,
      redEvidencePath,
      implementationEvidencePath,
      reviewEvidencePath,
      landingVerdictPath,
      retrospectivePath
    }),
    landing_readiness: await readLandingReadiness(
      repoRoot,
      implementationEvidencePath
    ),
    uat: {
      status: "not_applicable",
      source: briefPath
    },
    improvement_health: await readImprovementHealth(repoRoot),
    coordination: await readCoordinationSummary(repoRoot, activeWorkItemId),
    stale_evidence: await readStaleEvidence(repoRoot, {
      reviewEvidencePath,
      landingVerdictPath
    })
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
    return "normalized_text";
  }

  if (
    normalizedFirst.includes(workItem) &&
    normalizedSecond.includes(workItem) &&
    matchingStage(normalizedFirst, normalizedSecond)
  ) {
    return "work_item_and_stage";
  }

  if (
    normalizedFirst.includes(workItem) &&
    normalizedSecond.includes(workItem) &&
    matchingActionTopic(normalizedFirst, normalizedSecond)
  ) {
    return "topic_match";
  }

  return null;
}

function matchingActionTopic(first: string, second: string) {
  return [
    ["cockpit status foundation", "implement"],
    ["stage 4 review", "review"]
  ].some((terms) =>
    terms.every((term) => first.includes(term) && second.includes(term))
  );
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

function readOperatorInputSummary(content: string) {
  const section = content.match(
    /## Required Operator Input\s+([\s\S]*?)(?:\n## |\s*$)/
  )?.[1] ?? "";

  return section
    .split(/\r?\n/)
    .map((line) => normalizeText(line))
    .find((line) => line.length > 0) ?? "Operator input is required.";
}

function readBlockers(
  currentContext: string,
  bootstrapGaps: BootstrapGapSummary
): CockpitBlocker[] {
  const blockers: CockpitBlocker[] = [];

  if (readRequiredOperatorInput(currentContext) === "required") {
    blockers.push({
      kind: "operator_input_required",
      status: "blocked",
      summary: readOperatorInputSummary(currentContext),
      source: CURRENT_CONTEXT_PATH
    });
  }

  for (const gap of bootstrapGaps.gaps) {
    blockers.push({
      kind: "bootstrap_gap",
      status: "blocked",
      summary: `${gap.id}: ${gap.next_action}`,
      source: BOOTSTRAP_GAPS_PATH,
      source_artifacts: gap.source_artifacts
    });
  }

  return blockers;
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

async function readGateMatrix(
  repoRoot: string,
  paths: {
    briefPath: string;
    redEvidencePath: string;
    implementationEvidencePath: string;
    reviewEvidencePath: string;
    landingVerdictPath: string;
    retrospectivePath: string;
  }
) {
  return {
    stage_0_context_readiness: {
      status: "pass" as const,
      sources: [CURRENT_CONTEXT_PATH, ROADMAP_PATH]
    },
    stage_1_brief: await readGate(repoRoot, paths.briefPath),
    stage_2_red_evidence: await readGate(repoRoot, paths.redEvidencePath),
    stage_3_implementation: await readGate(
      repoRoot,
      paths.implementationEvidencePath
    ),
    stage_4_review: await readGate(repoRoot, paths.reviewEvidencePath),
    stage_5_landing: await readGate(repoRoot, paths.landingVerdictPath),
    stage_6_retrospective: await readGate(repoRoot, paths.retrospectivePath)
  };
}

async function readGate(repoRoot: string, source: string): Promise<GateStatus> {
  return {
    status: (await pathExists(repoRoot, source)) ? "pass" : "missing",
    source
  };
}

async function readStaleEvidence(
  repoRoot: string,
  paths: {
    reviewEvidencePath: string;
    landingVerdictPath: string;
  }
): Promise<StaleEvidence[]> {
  const staleEvidence: StaleEvidence[] = [];

  if (await pathExists(repoRoot, paths.reviewEvidencePath)) {
    const reviewEvidence = await readRequiredArtifact(
      repoRoot,
      paths.reviewEvidencePath
    );
    if (readScalarStatus(reviewEvidence.content, "source_drift_status") === "stale") {
      staleEvidence.push({
        kind: "review_evidence",
        status: "stale",
        source: paths.reviewEvidencePath,
        basis: "source_drift_status"
      });
    }
    if (
      readScalarStatus(reviewEvidence.content, "review_subject_hash_status") ===
      "stale"
    ) {
      staleEvidence.push({
        kind: "review_subject_hash",
        status: "stale",
        source: paths.reviewEvidencePath,
        basis: "review_subject_hash_status"
      });
    }
  }

  if (await pathExists(repoRoot, paths.landingVerdictPath)) {
    const landingVerdict = await readRequiredArtifact(
      repoRoot,
      paths.landingVerdictPath
    );
    if (readScalarStatus(landingVerdict.content, "source_drift_status") === "stale") {
      staleEvidence.push({
        kind: "landing_verdict",
        status: "stale",
        source: paths.landingVerdictPath,
        basis: "source_drift_status"
      });
    }
  }

  return staleEvidence;
}

function readScalarStatus(content: string, field: string) {
  const match = content.match(new RegExp(`^${field}:\\s*(.*?)\\s*$`, "m"));
  const value = match?.[1]?.trim();
  return value ? value : null;
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
