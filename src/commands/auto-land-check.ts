import { readAutoLandingPolicy } from "../state/auto-landing-policy.js";
import { autoLandingRiskClassificationProblems } from "../state/risk-classification.js";
import { readLandingReadiness } from "./land-check.js";

export async function autoLandCheck(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit auto-land-check <work-item-id>");
  }

  const policy = await readAutoLandingPolicy(repoRoot);
  const { reviewEvidence, landingVerdict, readiness } =
    await readLandingReadinessForAutoLanding(repoRoot, workItemId);
  const problems = [...readiness.problems];

  if (landingVerdict.finalVerdict !== "safe-to-land") {
    problems.push(
      `Auto-landing requires final_verdict safe-to-land, found ${landingVerdict.finalVerdict}`
    );
  }

  const classification = classifyAutoLandingCandidate(
    reviewEvidence.uatStatus,
    landingVerdict.uatStatus,
    Boolean(readiness.uatApproval)
  );
  problems.push(
    ...(await autoLandingRiskClassificationProblems(repoRoot, workItemId))
  );

  if (classification.autoLandingClass === "chore" && !policy.allowChores) {
    problems.push("Auto-landing policy blocks chores");
  }

  if (
    classification.autoLandingClass === "feature_slice" &&
    !policy.allowFeatureSlicesWithCurrentUat
  ) {
    problems.push("Auto-landing policy blocks UAT-approved feature slices");
  }

  if (problems.length > 0) {
    throw new Error(`Auto-landing blocked: ${problems.join("\n")}`);
  }

  return {
    output: [
      `Work item: ${reviewEvidence.workItem}`,
      "Auto-landing eligibility: eligible",
      `Auto-landing class: ${classification.autoLandingClass}`,
      `UAT requirement: ${classification.uatRequirement}`,
      "Policy artifact: .bandit/policy/auto-landing.json",
      "Blocking reasons: none"
    ].join("\n").concat("\n")
  };
}

async function readLandingReadinessForAutoLanding(
  repoRoot: string,
  workItemId: string
) {
  try {
    return await readLandingReadiness(repoRoot, workItemId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.startsWith("Missing UAT approval artifact:")) {
      throw new Error(
        "Auto-landing blocked: safe-to-land requires current UAT approval evidence"
      );
    }

    throw new Error(`Auto-landing blocked: ${message}`);
  }
}

function classifyAutoLandingCandidate(
  reviewUatStatus: string,
  landingUatStatus: string,
  hasCurrentUatApproval: boolean
) {
  if (reviewUatStatus === "pass" || landingUatStatus === "pass") {
    return {
      autoLandingClass: "feature_slice",
      uatRequirement: hasCurrentUatApproval ? "current_pass" : "missing_current_pass"
    };
  }

  return {
    autoLandingClass: "chore",
    uatRequirement: "not_applicable"
  };
}
