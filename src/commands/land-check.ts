import {
  createCachedGitChangedPathsReader,
  readCurrentGitHead
} from "../state/git.js";
import {
  codeRabbitReviewHasBlockingFindings,
  type CodeRabbitReviewEvidence,
  readOptionalParsedCodeRabbitReview
} from "../state/coderabbit-review.js";
import type { EscalatedReviewEvidence } from "../state/escalated-review.js";
import { readOptionalParsedEscalatedReview } from "../state/escalated-review.js";
import type { LandingVerdict } from "../state/landing-verdicts.js";
import { readLandingVerdict } from "../state/landing-verdicts.js";
import {
  evaluateReviewSourceStaleness,
  hasDurableNonBlockingFindingRouting,
  hasConcretePmRationaleForLocalQwenFindings,
  isRecordedHeadStale
} from "../state/landing-stage4.js";
import type { LocalQwenReviewEvidence } from "../state/local-qwen-review.js";
import { readLocalQwenReview } from "../state/local-qwen-review.js";
import type { ReviewEvidence } from "../state/review-evidence.js";
import { readReviewEvidence } from "../state/review-evidence.js";
import { readOptionalParsedRoutingDecision } from "../state/routing-decisions.js";
import type { SmellCatalog } from "../state/smell-triggers.js";
import { readSmellCatalog } from "../state/smell-triggers.js";
import type { Stage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
import { readStage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
import { computeReviewSubjectHash } from "../state/review-subject-hash.js";
import type { UatApproval } from "../state/uat-approval.js";
import { readUatApproval } from "../state/uat-approval.js";
import { readWorkItem } from "../state/work-items.js";

export async function landCheck(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit land-check <work-item-id>");
  }

  const result = await readLandingReadiness(repoRoot, workItemId);

  if (result.readiness.problems.length > 0) {
    throw new Error(result.readiness.problems.join("\n"));
  }

  return {
    output: formatLandingCheck(
      result.reviewEvidence,
      result.landingVerdict,
      result.readiness
    )
  };
}

export type LandingReadinessResult = {
  reviewEvidence: ReviewEvidence;
  landingVerdict: LandingVerdict;
  readiness: LandingReadiness;
};

export async function readLandingReadiness(
  repoRoot: string,
  workItemId: string
): Promise<LandingReadinessResult> {
  await readWorkItem(repoRoot, workItemId);

  const reviewEvidence = await readReviewEvidence(repoRoot, workItemId);
  const landingVerdict = await readLandingVerdict(repoRoot, workItemId);
  const currentHead = await readCurrentGitHead(repoRoot);
  const stage4EvidenceHeadPolicy = await readStage4EvidenceHeadPolicy(repoRoot);
  const smellCatalog = await readSmellCatalog(repoRoot);
  const routingDecision = await readOptionalParsedRoutingDecision(
    repoRoot,
    workItemId,
    smellCatalog.smellIds
  );
  const codeRabbitReview = await readRequiredCodeRabbitReviewWhenClaimed(
    repoRoot,
    reviewEvidence,
    landingVerdict
  );
  const localQwenReview = await readRequiredLocalQwenReviewWhenClaimed(
    repoRoot,
    reviewEvidence,
    landingVerdict
  );
  const escalatedReviewRequired = isEscalatedReviewRequired(
    reviewEvidence,
    routingDecision,
    smellCatalog
  );
  const escalatedReview = await readRequiredEscalatedReviewWhenClaimed(
    repoRoot,
    reviewEvidence,
    landingVerdict,
    escalatedReviewRequired
  );
  const uatApproval = await readRequiredUatApprovalWhenClaimed(
    repoRoot,
    reviewEvidence,
    landingVerdict
  );
  const readiness = await evaluateLandingReadiness(
    repoRoot,
    reviewEvidence,
    landingVerdict,
    currentHead,
    stage4EvidenceHeadPolicy,
    codeRabbitReview,
    localQwenReview,
    escalatedReviewRequired,
    routingDecision?.selectedRoute ?? null,
    escalatedReview,
    uatApproval
  );

  return {
    reviewEvidence,
    landingVerdict,
    readiness
  };
}

export type LandingReadiness = {
  currentHead: string | null;
  sourceDriftStatus: string;
  reviewEvidenceIsStale: boolean;
  landingVerdictIsStale: boolean;
  codeRabbitReview: CodeRabbitReviewEvidence | null;
  localQwenReview: LocalQwenReviewEvidence | null;
  escalatedReviewRequired: boolean;
  escalatedReview: EscalatedReviewEvidence | null;
  uatApproval: UatApproval | null;
  problems: string[];
};

async function evaluateLandingReadiness(
  repoRoot: string,
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  currentHead: string | null,
  stage4EvidenceHeadPolicy: Stage4EvidenceHeadPolicy,
  codeRabbitReview: CodeRabbitReviewEvidence | null,
  localQwenReview: LocalQwenReviewEvidence | null,
  escalatedReviewRequired: boolean,
  selectedEscalatedReviewRoute: string | null,
  escalatedReview: EscalatedReviewEvidence | null,
  uatApproval: UatApproval | null
): Promise<LandingReadiness> {
  const problems: string[] = [];
  const readGitChangedPaths = createCachedGitChangedPathsReader();
  const reviewSubjectIsStale = await isReviewSubjectStale(
    repoRoot,
    reviewEvidence
  );
  const reviewSubjectHashIsCurrent = Boolean(
    reviewEvidence.reviewSubjectHash && !reviewSubjectIsStale
  );
  const reviewEvidenceIsStale = reviewSubjectIsStale
    ? true
    : isRawEvidenceHeadStale(reviewEvidence.sourceHead, currentHead, reviewEvidence);
  const landingVerdictIsStale = reviewSubjectIsStale
    ? true
    : isRawEvidenceHeadStale(landingVerdict.sourceHead, currentHead, reviewEvidence);
  const codeRabbitReviewIsStale = codeRabbitReview && !reviewSubjectHashIsCurrent
    ? await isReviewSourceStale(
        repoRoot,
        reviewEvidence.workItem,
        codeRabbitReview.sourceHead,
        currentHead,
        stage4EvidenceHeadPolicy,
        "CodeRabbit review",
        problems,
        readGitChangedPaths
      )
    : false;
  const localQwenReviewIsStale = localQwenReview && !reviewSubjectHashIsCurrent
    ? await isReviewSourceStale(
        repoRoot,
        reviewEvidence.workItem,
        localQwenReview.sourceHead,
        currentHead,
        stage4EvidenceHeadPolicy,
        "Local Qwen review",
        problems,
        readGitChangedPaths
      )
    : false;
  const escalatedReviewIsStale = escalatedReview && !reviewSubjectHashIsCurrent
    ? await isReviewSourceStale(
        repoRoot,
        reviewEvidence.workItem,
        escalatedReview.sourceHead,
        currentHead,
        stage4EvidenceHeadPolicy,
        "Escalated review",
        problems,
        readGitChangedPaths
      )
    : false;
  const uatApprovalIsStale = uatApproval
    ? isRecordedHeadStale(uatApproval.sourceHead, currentHead)
    : false;
  const sourceDriftStatus =
    reviewEvidenceIsStale ||
    landingVerdictIsStale ||
    codeRabbitReviewIsStale ||
    localQwenReviewIsStale ||
    escalatedReviewIsStale ||
    uatApprovalIsStale
      ? "stale"
      : reviewEvidence.sourceDriftStatus;

  if (reviewSubjectIsStale) {
    problems.push("Review subject hash is stale");
  }

  if (reviewEvidenceIsStale && !reviewSubjectIsStale) {
    problems.push("Review evidence is stale");
  }

  if (landingVerdictIsStale && !reviewSubjectIsStale) {
    problems.push("Landing verdict evidence is stale");
  }

  if (codeRabbitReviewIsStale) {
    problems.push("CodeRabbit review evidence is stale");
  }

  if (localQwenReviewIsStale) {
    problems.push("Local Qwen review evidence is stale");
  }

  if (escalatedReviewIsStale) {
    problems.push("Escalated review evidence is stale");
  }

  if (uatApprovalIsStale) {
    problems.push("UAT approval evidence is stale");
  }

  if (landingVerdict.finalVerdict === "safe-to-land") {
    problems.push(
      ...safeToLandProblems(
        reviewEvidence,
        landingVerdict,
        reviewEvidenceIsStale ||
          landingVerdictIsStale ||
          codeRabbitReviewIsStale ||
          localQwenReviewIsStale ||
          escalatedReviewIsStale ||
          uatApprovalIsStale,
        codeRabbitReview,
        localQwenReview,
        escalatedReviewRequired,
        selectedEscalatedReviewRoute,
        escalatedReview,
        uatApproval
      )
    );
  }

  return {
    currentHead,
    sourceDriftStatus,
    reviewEvidenceIsStale,
    landingVerdictIsStale,
    codeRabbitReview,
    localQwenReview,
    escalatedReviewRequired,
    escalatedReview,
    uatApproval,
    problems
  };
}

async function isReviewSubjectStale(
  repoRoot: string,
  reviewEvidence: ReviewEvidence
) {
  if (!reviewEvidence.reviewSubjectHash) {
    return false;
  }

  const currentSubject = await computeReviewSubjectHash(
    repoRoot,
    reviewEvidence.workItem
  );

  return currentSubject.hash !== reviewEvidence.reviewSubjectHash;
}

function isRawEvidenceHeadStale(
  recordedHead: string,
  currentHead: string | null,
  reviewEvidence: ReviewEvidence
) {
  if (reviewEvidence.reviewSubjectHash) {
    return false;
  }

  return isRecordedHeadStale(recordedHead, currentHead);
}

function safeToLandProblems(
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  staleEvidence: boolean,
  codeRabbitReview: CodeRabbitReviewEvidence | null,
  localQwenReview: LocalQwenReviewEvidence | null,
  escalatedReviewRequired: boolean,
  selectedEscalatedReviewRoute: string | null,
  escalatedReview: EscalatedReviewEvidence | null,
  uatApproval: UatApproval | null
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
    !isLocalQwenCurrentOrBootstrapGap(
      landingVerdict.localQwenState,
      reviewEvidence.localQwenReplacementEvidence
    ) ||
    !isLocalQwenCurrentOrBootstrapGap(
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
    reviewEvidence.localQwenState === "non_blocking" ||
    reviewEvidence.localQwenState === "blocker" ||
    landingVerdict.localQwenState === "pass" ||
    landingVerdict.localQwenState === "non_blocking" ||
    landingVerdict.localQwenState === "blocker"
  ) {
    problems.push(...localQwenProblems(localQwenReview, reviewEvidence));
  }

  if (
    reviewEvidence.coderabbitState === "pass" ||
    landingVerdict.coderabbitState === "pass"
  ) {
    problems.push(...codeRabbitProblems(codeRabbitReview));
  }

  if (
    escalatedReviewRequired &&
    (!isPassingOrBootstrapGap(landingVerdict.escalatedReviewState) ||
      !isPassingOrBootstrapGap(reviewEvidence.escalatedReviewState))
  ) {
    problems.push(
      "safe-to-land requires escalated review pass or explicit bootstrap_gap evidence"
    );
  }

  if (escalatedReviewRequired) {
    problems.push(
      ...escalatedReviewProblems(escalatedReview, selectedEscalatedReviewRoute)
    );
  }

  if (reviewEvidence.uatStatus === "pass" || landingVerdict.uatStatus === "pass") {
    problems.push(...uatApprovalProblems(uatApproval));
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
    ...formatCodeRabbitReviewLines(readiness.codeRabbitReview),
    `Local Qwen: ${reviewEvidence.localQwenState}`,
    ...formatLocalQwenReviewLines(readiness.localQwenReview),
    `Escalated review: ${reviewEvidence.escalatedReviewState}`,
    ...formatEscalatedReviewLines(readiness.escalatedReview),
    `UAT: ${landingVerdict.uatStatus}`,
    ...formatUatApprovalLines(readiness.uatApproval),
    `Clean code: ${landingVerdict.cleanCodeStatus}`,
    `Landing agent: ${landingVerdict.landingAgentState}`,
    "Bootstrap gaps:",
    ...reviewEvidence.bootstrapGaps.map((gap) => `  - ${gap}`),
    `Final verdict: ${landingVerdict.finalVerdict}`
  ].join("\n").concat("\n");
}

async function readRequiredUatApprovalWhenClaimed(
  repoRoot: string,
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict
) {
  if (reviewEvidence.uatStatus !== "pass" && landingVerdict.uatStatus !== "pass") {
    return null;
  }

  return readUatApproval(repoRoot, reviewEvidence.workItem);
}

type OptionalRoutingDecision = Awaited<
  ReturnType<typeof readOptionalParsedRoutingDecision>
>;

async function readRequiredCodeRabbitReviewWhenClaimed(
  repoRoot: string,
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict
) {
  if (
    reviewEvidence.coderabbitState !== "pass" &&
    landingVerdict.coderabbitState !== "pass"
  ) {
    return null;
  }

  return readOptionalParsedCodeRabbitReview(repoRoot, reviewEvidence.workItem);
}

async function readRequiredLocalQwenReviewWhenClaimed(
  repoRoot: string,
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict
) {
  if (
    reviewEvidence.localQwenState !== "pass" &&
    reviewEvidence.localQwenState !== "non_blocking" &&
    reviewEvidence.localQwenState !== "blocker" &&
    landingVerdict.localQwenState !== "pass" &&
    landingVerdict.localQwenState !== "non_blocking" &&
    landingVerdict.localQwenState !== "blocker"
  ) {
    return null;
  }

  return readLocalQwenReview(repoRoot, reviewEvidence.workItem);
}

async function readRequiredEscalatedReviewWhenClaimed(
  repoRoot: string,
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  escalatedReviewRequired: boolean
) {
  if (
    !escalatedReviewRequired &&
    reviewEvidence.escalatedReviewState !== "pass" &&
    landingVerdict.escalatedReviewState !== "pass" &&
    reviewEvidence.escalatedReviewState !== "bootstrap_gap" &&
    landingVerdict.escalatedReviewState !== "bootstrap_gap"
  ) {
    return null;
  }

  return readOptionalParsedEscalatedReview(repoRoot, reviewEvidence.workItem);
}

function codeRabbitProblems(codeRabbitReview: CodeRabbitReviewEvidence | null) {
  if (!codeRabbitReview) {
    return ["safe-to-land requires current CodeRabbit review evidence"];
  }

  const problems: string[] = [];

  if (codeRabbitReview.reviewState !== "completed") {
    problems.push(
      `CodeRabbit review state blocks landing: ${codeRabbitReview.reviewState}`
    );
  }

  if (codeRabbitReview.coderabbitVerdict !== "pass") {
    problems.push(
      `CodeRabbit reviewer verdict blocks landing: ${codeRabbitReview.coderabbitVerdict}`
    );
  }

  if (codeRabbitReviewHasBlockingFindings(codeRabbitReview)) {
    problems.push(
      `CodeRabbit findings are unresolved: ${codeRabbitReview.findingsStatus}`
    );
  }

  if (codeRabbitReview.sourceDriftStatus !== "current") {
    problems.push("safe-to-land requires CodeRabbit source_drift_status current");
  }

  return problems;
}

function localQwenProblems(
  localQwenReview: LocalQwenReviewEvidence | null,
  reviewEvidence: ReviewEvidence
) {
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

  if (
    localQwenReview.reviewerVerdict !== "pass" &&
    localQwenReview.reviewerVerdict !== "non_blocking"
  ) {
    problems.push(
      `Local Qwen reviewer verdict blocks landing: ${localQwenReview.reviewerVerdict}`
    );
  }

  if (
    localQwenReview.findingsStatus !== "none" &&
    !hasConcretePmRationaleForLocalQwenFindings(
      reviewEvidence.pmDispositionRationale,
      localQwenReview.findingsDisposition
    )
  ) {
    problems.push("PM disposition rationale is required for Local Qwen findings");
  }

  if (
    (localQwenReview.reviewerVerdict === "non_blocking" ||
      reviewEvidence.localQwenState === "non_blocking") &&
    !hasDurableNonBlockingFindingRouting(
      reviewEvidence.nonBlockingFindingsRouting
    )
  ) {
    problems.push(
      "non-blocking review findings require durable follow-up routing"
    );
  }

  if (localQwenReview.sourceDriftStatus !== "current") {
    problems.push("safe-to-land requires local Qwen source_drift_status current");
  }

  return problems;
}

function escalatedReviewProblems(
  escalatedReview: EscalatedReviewEvidence | null,
  selectedEscalatedReviewRoute: string | null
) {
  if (!escalatedReview) {
    return ["safe-to-land requires current escalated review placeholder evidence"];
  }

  const problems: string[] = [];
  const requiresLivePass =
    selectedEscalatedReviewRoute !== null &&
    selectedEscalatedReviewRoute !== "escalated-adversarial-placeholder";

  if (requiresLivePass) {
    if (
      escalatedReview.profileId !== selectedEscalatedReviewRoute ||
      escalatedReview.reviewerVerdict !== "pass"
    ) {
      problems.push(
        `safe-to-land requires live escalated review pass for configured reviewer ${selectedEscalatedReviewRoute}`
      );
    }
  }

  if (!isPassingOrBootstrapGap(escalatedReview.reviewerVerdict)) {
    problems.push(
      `Escalated reviewer verdict blocks landing: ${escalatedReview.reviewerVerdict}`
    );
  }

  if (escalatedReview.sourceDriftStatus !== "current") {
    problems.push("safe-to-land requires escalated review source_drift_status current");
  }

  return problems;
}

function uatApprovalProblems(uatApproval: UatApproval | null) {
  if (!uatApproval) {
    return ["safe-to-land requires current UAT approval evidence"];
  }

  const problems: string[] = [];

  if (uatApproval.approvalStatus !== "pass") {
    problems.push(`UAT approval status blocks landing: ${uatApproval.approvalStatus}`);
  }

  if (uatApproval.sourceDriftStatus !== "current") {
    problems.push("safe-to-land requires UAT source_drift_status current");
  }

  return problems;
}

function formatCodeRabbitReviewLines(
  codeRabbitReview: CodeRabbitReviewEvidence | null
) {
  if (!codeRabbitReview) {
    return [];
  }

  return [
    `CodeRabbit evidence: ${codeRabbitReview.displayPath}`,
    `CodeRabbit provider: ${codeRabbitReview.provider}`
  ];
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

function formatEscalatedReviewLines(
  escalatedReview: EscalatedReviewEvidence | null
) {
  if (!escalatedReview) {
    return [];
  }

  return [
    `Escalated review evidence: ${escalatedReview.displayPath}`,
    `Escalated review profile: ${escalatedReview.profileId}`
  ];
}

function formatUatApprovalLines(uatApproval: UatApproval | null) {
  if (!uatApproval) {
    return [];
  }

  return [
    `UAT evidence: ${uatApproval.displayPath}`,
    `UAT environment: ${uatApproval.environment}`
  ];
}

function isEscalatedReviewRequired(
  reviewEvidence: ReviewEvidence,
  routingDecision: OptionalRoutingDecision,
  smellCatalog: SmellCatalog
) {
  if (reviewEvidence.escalatedReviewRequired) {
    return true;
  }

  if (!routingDecision) {
    return false;
  }

  const smellById = new Map(
    smellCatalog.smells.map((smell) => [smell.id, smell])
  );

  return routingDecision.applicableSmellIds.some((smellId) => {
    const smell = smellById.get(smellId);
    return smell?.defaultAction === "require_escalated_review";
  });
}

async function isReviewSourceStale(
  repoRoot: string,
  workItemId: string,
  recordedHead: string,
  currentHead: string | null,
  stage4EvidenceHeadPolicy: Stage4EvidenceHeadPolicy,
  evidenceLabel: string,
  problems: string[],
  readGitChangedPaths: ReturnType<typeof createCachedGitChangedPathsReader>
) {
  const result = await evaluateReviewSourceStaleness({
    repoRoot,
    workItemId,
    recordedHead,
    currentHead,
    stage4EvidenceHeadPolicy,
    evidenceLabel,
    readGitChangedPaths
  });
  if (result.problem) {
    problems.push(result.problem);
  }

  return result.isStale;
}

function isPassingOrBootstrapGap(value: string) {
  return value === "pass" || value === "bootstrap_gap";
}

function isGateCurrentOrBootstrapGap(value: string, replacementEvidence: string[]) {
  return value === "pass" || (value === "bootstrap_gap" && replacementEvidence.length > 0);
}

function isLocalQwenCurrentOrBootstrapGap(
  value: string,
  replacementEvidence: string[]
) {
  return (
    value === "pass" ||
    value === "non_blocking" ||
    (value === "bootstrap_gap" && replacementEvidence.length > 0)
  );
}
