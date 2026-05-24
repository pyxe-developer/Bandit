import { readCurrentGitHead } from "../state/git.js";
import type { LandingVerdict } from "../state/landing-verdicts.js";
import { readLandingVerdict } from "../state/landing-verdicts.js";
import type { LocalQwenReviewEvidence } from "../state/local-qwen-review.js";
import { readLocalQwenReview } from "../state/local-qwen-review.js";
import type { ReviewEvidence } from "../state/review-evidence.js";
import { readReviewEvidence } from "../state/review-evidence.js";
import { readWorkItem } from "../state/work-items.js";

export async function landCheck(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit land-check <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);

  const reviewEvidence = await readReviewEvidence(repoRoot, workItemId);
  const landingVerdict = await readLandingVerdict(repoRoot, workItemId);
  const currentHead = await readCurrentGitHead(repoRoot);
  const localQwenReview = await readRequiredLocalQwenReviewWhenClaimed(
    repoRoot,
    reviewEvidence,
    landingVerdict
  );
  const readiness = evaluateLandingReadiness(
    reviewEvidence,
    landingVerdict,
    currentHead,
    localQwenReview
  );

  if (readiness.problems.length > 0) {
    throw new Error(readiness.problems.join("\n"));
  }

  return {
    output: formatLandingCheck(reviewEvidence, landingVerdict, readiness)
  };
}

type LandingReadiness = {
  currentHead: string | null;
  sourceDriftStatus: string;
  reviewEvidenceIsStale: boolean;
  landingVerdictIsStale: boolean;
  localQwenReview: LocalQwenReviewEvidence | null;
  problems: string[];
};

function evaluateLandingReadiness(
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  currentHead: string | null,
  localQwenReview: LocalQwenReviewEvidence | null
): LandingReadiness {
  const reviewEvidenceIsStale = isStale(reviewEvidence.sourceHead, currentHead);
  const landingVerdictIsStale = isStale(landingVerdict.sourceHead, currentHead);
  const localQwenReviewIsStale = localQwenReview
    ? isStale(localQwenReview.sourceHead, currentHead)
    : false;
  const sourceDriftStatus =
    reviewEvidenceIsStale || landingVerdictIsStale || localQwenReviewIsStale
      ? "stale"
      : reviewEvidence.sourceDriftStatus;
  const problems: string[] = [];

  if (reviewEvidenceIsStale) {
    problems.push("Review evidence is stale");
  }

  if (landingVerdictIsStale) {
    problems.push("Landing verdict evidence is stale");
  }

  if (localQwenReviewIsStale) {
    problems.push("Local Qwen review evidence is stale");
  }

  if (landingVerdict.finalVerdict === "safe-to-land") {
    problems.push(
      ...safeToLandProblems(
        reviewEvidence,
        landingVerdict,
        reviewEvidenceIsStale || landingVerdictIsStale || localQwenReviewIsStale,
        localQwenReview
      )
    );
  }

  return {
    currentHead,
    sourceDriftStatus,
    reviewEvidenceIsStale,
    landingVerdictIsStale,
    localQwenReview,
    problems
  };
}

function safeToLandProblems(
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  staleEvidence: boolean,
  localQwenReview: LocalQwenReviewEvidence | null
) {
  const problems: string[] = [];

  if (staleEvidence) {
    problems.push("safe-to-land cannot proceed with stale source evidence");
  }

  if (
    landingVerdict.testsStatus !== "pass" ||
    reviewEvidence.verificationState !== "pass"
  ) {
    problems.push("safe-to-land requires tests_status and verification_state pass");
  }

  if (
    landingVerdict.cleanCodeStatus !== "pass" ||
    reviewEvidence.cleanCodeStatus !== "pass"
  ) {
    problems.push("safe-to-land requires clean_code_status pass");
  }

  if (
    !isGateCurrentOrBootstrapGap(
      landingVerdict.coderabbitState,
      reviewEvidence.coderabbitReplacementEvidence
    ) ||
    !isGateCurrentOrBootstrapGap(
      reviewEvidence.coderabbitState,
      reviewEvidence.coderabbitReplacementEvidence
    )
  ) {
    problems.push(
      "safe-to-land requires CodeRabbit pass or explicit bootstrap_gap evidence"
    );
  }

  if (
    !isGateCurrentOrBootstrapGap(
      landingVerdict.localQwenState,
      reviewEvidence.localQwenReplacementEvidence
    ) ||
    !isGateCurrentOrBootstrapGap(
      reviewEvidence.localQwenState,
      reviewEvidence.localQwenReplacementEvidence
    )
  ) {
    problems.push(
      "safe-to-land requires local Qwen pass or explicit bootstrap_gap evidence"
    );
  }

  if (
    reviewEvidence.localQwenState === "pass" ||
    landingVerdict.localQwenState === "pass"
  ) {
    problems.push(...localQwenProblems(localQwenReview));
  }

  if (
    reviewEvidence.escalatedReviewRequired &&
    (!isPassingOrBootstrapGap(landingVerdict.escalatedReviewState) ||
      !isPassingOrBootstrapGap(reviewEvidence.escalatedReviewState))
  ) {
    problems.push(
      "safe-to-land requires escalated review pass or explicit bootstrap_gap evidence"
    );
  }

  if (reviewEvidence.pmDisposition !== "pass") {
    problems.push("safe-to-land requires PM disposition pass");
  }

  if (landingVerdict.landingAgentState !== "bootstrap_gap") {
    if (landingVerdict.landingAgentState !== "pass") {
      problems.push("safe-to-land requires Landing Agent pass or bootstrap_gap");
    }
  }

  if (
    landingVerdict.sourceDriftStatus !== "current" ||
    reviewEvidence.sourceDriftStatus !== "current"
  ) {
    problems.push("safe-to-land requires source_drift_status current");
  }

  return problems;
}

function formatLandingCheck(
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  readiness: LandingReadiness
) {
  return [
    `Work item: ${reviewEvidence.workItem}`,
    `Source head: ${reviewEvidence.sourceHead}`,
    `Current head: ${readiness.currentHead ?? "unavailable"}`,
    `Source drift: ${readiness.sourceDriftStatus}`,
    `Verification: ${reviewEvidence.verificationState}`,
    `CodeRabbit: ${reviewEvidence.coderabbitState}`,
    `Local Qwen: ${reviewEvidence.localQwenState}`,
    ...formatLocalQwenReviewLines(readiness.localQwenReview),
    `Escalated review: ${reviewEvidence.escalatedReviewState}`,
    `UAT: ${landingVerdict.uatStatus}`,
    `Clean code: ${landingVerdict.cleanCodeStatus}`,
    `Landing agent: ${landingVerdict.landingAgentState}`,
    "Bootstrap gaps:",
    ...reviewEvidence.bootstrapGaps.map((gap) => `  - ${gap}`),
    `Final verdict: ${landingVerdict.finalVerdict}`
  ].join("\n").concat("\n");
}

async function readRequiredLocalQwenReviewWhenClaimed(
  repoRoot: string,
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict
) {
  if (
    reviewEvidence.localQwenState !== "pass" &&
    landingVerdict.localQwenState !== "pass"
  ) {
    return null;
  }

  return readLocalQwenReview(repoRoot, reviewEvidence.workItem);
}

function localQwenProblems(localQwenReview: LocalQwenReviewEvidence | null) {
  if (!localQwenReview) {
    return ["safe-to-land requires current local Qwen review evidence"];
  }

  const problems: string[] = [];

  if (
    localQwenReview.runStatus === "inconclusive" ||
    localQwenReview.findingsStatus === "inconclusive"
  ) {
    problems.push("Local Qwen review is inconclusive");
  }

  if (localQwenReview.reviewerVerdict !== "pass") {
    problems.push(
      `Local Qwen reviewer verdict blocks landing: ${localQwenReview.reviewerVerdict}`
    );
  }

  if (localQwenReview.sourceDriftStatus !== "current") {
    problems.push("safe-to-land requires local Qwen source_drift_status current");
  }

  return problems;
}

function formatLocalQwenReviewLines(localQwenReview: LocalQwenReviewEvidence | null) {
  if (!localQwenReview) {
    return [];
  }

  return [
    `Local Qwen evidence: ${localQwenReview.displayPath}`,
    `Local Qwen profile: ${localQwenReview.profileId}`
  ];
}

function isStale(recordedHead: string, currentHead: string | null) {
  return Boolean(
    currentHead && recordedHead !== "unknown" && recordedHead !== currentHead
  );
}

function isPassingOrBootstrapGap(value: string) {
  return value === "pass" || value === "bootstrap_gap";
}

function isGateCurrentOrBootstrapGap(value: string, replacementEvidence: string[]) {
  return value === "pass" || (value === "bootstrap_gap" && replacementEvidence.length > 0);
}
