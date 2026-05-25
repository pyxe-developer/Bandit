import type { GitChangedPathsResult } from "./git.js";
import type { Stage4EvidenceHeadPolicy } from "./stage4-evidence-head-policy.js";

export type GitChangedPathsReader = (
  repoRoot: string,
  baseRevision: string,
  headRevision: string
) => Promise<GitChangedPathsResult>;

export type ReviewSourceStalenessInput = {
  repoRoot: string;
  workItemId: string;
  recordedHead: string;
  currentHead: string | null;
  stage4EvidenceHeadPolicy: Stage4EvidenceHeadPolicy;
  evidenceLabel: string;
  readGitChangedPaths: GitChangedPathsReader;
};

export type ReviewSourceStaleness = {
  isStale: boolean;
  problem: string | null;
};

export async function evaluateReviewSourceStaleness(
  input: ReviewSourceStalenessInput
): Promise<ReviewSourceStaleness> {
  if (!isRecordedHeadStale(input.recordedHead, input.currentHead)) {
    return { isStale: false, problem: null };
  }

  if (!input.currentHead) {
    return { isStale: false, problem: null };
  }

  const changedPaths = await input.readGitChangedPaths(
    input.repoRoot,
    input.recordedHead,
    input.currentHead
  );
  if (changedPaths.status === "error") {
    return {
      isStale: true,
      problem: `${input.evidenceLabel} changed-path check failed: ${changedPaths.reason}`
    };
  }

  return {
    isStale: changedPaths.paths.some(
      (changedPath) =>
        !isTerminalDispositionOnlyPath(
          changedPath,
          input.workItemId,
          input.stage4EvidenceHeadPolicy
        )
    ),
    problem: null
  };
}

export function isRecordedHeadStale(
  recordedHead: string,
  currentHead: string | null
) {
  return Boolean(
    currentHead && recordedHead !== "unknown" && recordedHead !== currentHead
  );
}

export function hasConcretePmRationaleForLocalQwenFindings(
  structuredRationale: string,
  legacyDisposition: string
) {
  if (structuredRationale) {
    return hasSpecificPmReasonText(structuredRationale);
  }

  return hasConcretePmRationale(legacyDisposition);
}

export function hasDurableNonBlockingFindingRouting(routing: string[]) {
  return routing.some((entry) => {
    const route = parseNonBlockingFindingRoute(entry);
    return Boolean(route && hasSpecificPmReasonText(route.detail));
  });
}

function isTerminalDispositionOnlyPath(
  changedPath: string,
  workItemId: string,
  stage4EvidenceHeadPolicy: Stage4EvidenceHeadPolicy
) {
  return stage4EvidenceHeadPolicy.terminalDispositionOnlyPathPatterns.some(
    (pattern) => matchesPolicyPathPattern(changedPath, pattern, workItemId)
  );
}

function matchesPolicyPathPattern(
  changedPath: string,
  pattern: string,
  workItemId: string
) {
  const resolvedPattern = pattern.replaceAll("<work_item_id>", workItemId);
  if (resolvedPattern.startsWith("exact:")) {
    return changedPath === resolvedPattern.slice("exact:".length);
  }

  if (resolvedPattern.startsWith("prefix:")) {
    return changedPath.startsWith(resolvedPattern.slice("prefix:".length));
  }

  if (resolvedPattern.startsWith("glob:")) {
    return globPatternToRegExp(resolvedPattern.slice("glob:".length)).test(
      changedPath
    );
  }

  if (resolvedPattern.startsWith("regex:")) {
    try {
      return new RegExp(resolvedPattern.slice("regex:".length)).test(changedPath);
    } catch {
      return false;
    }
  }

  if (resolvedPattern.endsWith("/")) {
    return changedPath.startsWith(resolvedPattern);
  }

  return changedPath === resolvedPattern;
}

function globPatternToRegExp(pattern: string) {
  let source = "^";

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    const nextCharacter = pattern[index + 1];

    if (character === "*" && nextCharacter === "*") {
      source += ".*";
      index += 1;
      continue;
    }

    if (character === "*") {
      source += "[^/]*";
      continue;
    }

    source += escapeRegExp(character ?? "");
  }

  return new RegExp(`${source}$`);
}

function hasConcretePmRationale(disposition: string) {
  if (/without recorded rationale/i.test(disposition)) {
    return false;
  }

  return (
    hasConcreteReasonAfterMarker(disposition, /\bbecause\b/i) ||
    hasConcreteReasonAfterMarker(disposition, /\b(?:pm\s+)?rationale\s*:/i) ||
    hasConcreteReasonAfterMarker(disposition, /\breason\s*:/i)
  );
}

function hasConcreteReasonAfterMarker(disposition: string, marker: RegExp) {
  const match = marker.exec(disposition);
  if (!match) {
    return false;
  }

  const reason = disposition.slice(match.index + match[0].length).trim();
  return hasSpecificPmReasonText(reason);
}

function parseNonBlockingFindingRoute(entry: string) {
  const match = entry.match(
    /^(follow_up_chore_candidate|improvement_chore|no_action):\s*(.+)$/i
  );
  if (!match) {
    return null;
  }

  return {
    kind: match[1],
    detail: match[2]?.trim() ?? ""
  };
}

function hasSpecificPmReasonText(reason: string) {
  const normalizedReason = reason.replace(/[.!:;,\s]+$/g, "").trim();
  if (normalizedReason.length === 0) {
    return false;
  }

  return !/^(tbd|todo|pending|none|n\/a|na|later|unknown|unclear|ok|okay|fine|accepted|safe|valid)$/i.test(
    normalizedReason
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
