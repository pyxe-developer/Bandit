import { readCurrentGitHead, readGitChangedPaths } from "../state/git.js";
import {
  codeRabbitReviewHasBlockingFindings,
  type CodeRabbitReviewEvidence,
  readOptionalParsedCodeRabbitReview
} from "../state/coderabbit-review.js";
import type { EscalatedReviewEvidence } from "../state/escalated-review.js";
import { readOptionalParsedEscalatedReview } from "../state/escalated-review.js";
import type { LandingVerdict } from "../state/landing-verdicts.js";
import { readLandingVerdict } from "../state/landing-verdicts.js";
import type { LocalQwenReviewEvidence } from "../state/local-qwen-review.js";
import { readLocalQwenReview } from "../state/local-qwen-review.js";
import type { ReviewEvidence } from "../state/review-evidence.js";
import { readReviewEvidence } from "../state/review-evidence.js";
import { readOptionalParsedRoutingDecision } from "../state/routing-decisions.js";
import type { SmellCatalog } from "../state/smell-triggers.js";
import { readSmellCatalog } from "../state/smell-triggers.js";
import type { Stage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
import { readStage4EvidenceHeadPolicy } from "../state/stage4-evidence-head-policy.js";
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
  escalatedReview: EscalatedReviewEvidence | null,
  uatApproval: UatApproval | null
): Promise<LandingReadiness> {
  const problems: string[] = [];
  const reviewEvidenceIsStale = isStale(reviewEvidence.sourceHead, currentHead);
  const landingVerdictIsStale = isStale(landingVerdict.sourceHead, currentHead);
  const codeRabbitReviewIsStale = codeRabbitReview
    ? await isReviewSourceStale(
        repoRoot,
        reviewEvidence.workItem,
        codeRabbitReview.sourceHead,
        currentHead,
        stage4EvidenceHeadPolicy,
        "CodeRabbit review",
        problems
      )
    : false;
  const localQwenReviewIsStale = localQwenReview
    ? await isReviewSourceStale(
        repoRoot,
        reviewEvidence.workItem,
        localQwenReview.sourceHead,
        currentHead,
        stage4EvidenceHeadPolicy,
        "Local Qwen review",
        problems
      )
    : false;
  const escalatedReviewIsStale = escalatedReview
    ? await isReviewSourceStale(
        repoRoot,
        reviewEvidence.workItem,
        escalatedReview.sourceHead,
        currentHead,
        stage4EvidenceHeadPolicy,
        "Escalated review",
        problems
      )
    : false;
  const uatApprovalIsStale = uatApproval
    ? isStale(uatApproval.sourceHead, currentHead)
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

  if (reviewEvidenceIsStale) {
    problems.push("Review evidence is stale");
  }

  if (landingVerdictIsStale) {
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

function safeToLandProblems(
  reviewEvidence: ReviewEvidence,
  landingVerdict: LandingVerdict,
  staleEvidence: boolean,
  codeRabbitReview: CodeRabbitReviewEvidence | null,
  localQwenReview: LocalQwenReviewEvidence | null,
  escalatedReviewRequired: boolean,
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
    problems.push(...escalatedReviewProblems(escalatedReview));
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
    landingVerdict.localQwenState !== "pass"
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

  if (localQwenReview.reviewerVerdict !== "pass") {
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

  if (localQwenReview.sourceDriftStatus !== "current") {
    problems.push("safe-to-land requires local Qwen source_drift_status current");
  }

  return problems;
}

function escalatedReviewProblems(
  escalatedReview: EscalatedReviewEvidence | null
) {
  if (!escalatedReview) {
    return ["safe-to-land requires current escalated review placeholder evidence"];
  }

  const problems: string[] = [];

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

function isStale(recordedHead: string, currentHead: string | null) {
  return Boolean(
    currentHead && recordedHead !== "unknown" && recordedHead !== currentHead
  );
}

async function isReviewSourceStale(
  repoRoot: string,
  workItemId: string,
  recordedHead: string,
  currentHead: string | null,
  stage4EvidenceHeadPolicy: Stage4EvidenceHeadPolicy,
  evidenceLabel: string,
  problems: string[]
) {
  if (!isStale(recordedHead, currentHead)) {
    return false;
  }

  if (!currentHead) {
    return false;
  }

  const changedPaths = await readGitChangedPaths(repoRoot, recordedHead, currentHead);
  if (changedPaths.status === "error") {
    problems.push(
      `${evidenceLabel} changed-path check failed: ${changedPaths.reason}`
    );
    return true;
  }

  return changedPaths.paths.some(
    (changedPath) =>
      !isTerminalDispositionOnlyPath(
        changedPath,
        workItemId,
        stage4EvidenceHeadPolicy
      )
  );
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

function hasConcretePmRationaleForLocalQwenFindings(
  structuredRationale: string,
  legacyDisposition: string
) {
  if (structuredRationale) {
    return hasSpecificPmReasonText(structuredRationale);
  }

  return hasConcretePmRationale(legacyDisposition);
}

function hasConcreteReasonAfterMarker(disposition: string, marker: RegExp) {
  const match = marker.exec(disposition);
  if (!match) {
    return false;
  }

  const reason = disposition.slice(match.index + match[0].length).trim();
  if (!hasSpecificPmReasonText(reason)) {
    return false;
  }

  return true;
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

function isPassingOrBootstrapGap(value: string) {
  return value === "pass" || value === "bootstrap_gap";
}

function isGateCurrentOrBootstrapGap(value: string, replacementEvidence: string[]) {
  return value === "pass" || (value === "bootstrap_gap" && replacementEvidence.length > 0);
}
