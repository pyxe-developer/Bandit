import type { CockpitStatus } from "./cockpit-status.js";

export type CockpitActionAffordance = {
  id:
    | "validate_repo"
    | "inspect_evidence"
    | "run_review_gate"
    | "check_landing_readiness"
    | "record_uat";
  label: string;
  command_family:
    | "bandit validate"
    | "bandit show"
    | "bandit qwen-review"
    | "bandit land-check"
    | "bandit uat";
  enabled: boolean;
  reason: string;
};

const RED_EVIDENCE_MISSING_REASON = "Stage 2 RED evidence is missing.";
const UAT_UNAVAILABLE_REASON =
  "UAT is unavailable until an operator-facing implementation exists.";

export function deriveCockpitActionAffordances(
  status: CockpitStatus
): CockpitActionAffordance[] {
  return [
    {
      id: "validate_repo",
      label: "Validate",
      command_family: "bandit validate",
      enabled: true,
      reason: "Read-only validation is available through CLI Authority."
    },
    {
      id: "inspect_evidence",
      label: "Evidence",
      command_family: "bandit show",
      enabled: true,
      reason: "Evidence inspection is read-only and source-linked."
    },
    {
      id: "run_review_gate",
      label: "Review Gate",
      command_family: "bandit qwen-review",
      enabled: reviewGateIsAvailable(status),
      reason: reviewGateReason(status)
    },
    {
      id: "check_landing_readiness",
      label: "Landing Check",
      command_family: "bandit land-check",
      enabled: status.landing_readiness.status === "ready",
      reason: landingReadinessReason(status)
    },
    {
      id: "record_uat",
      label: "Record UAT",
      command_family: "bandit uat",
      enabled: false,
      reason: UAT_UNAVAILABLE_REASON
    }
  ];
}

function reviewGateIsAvailable(status: CockpitStatus) {
  return status.gates.stage_2_red_evidence.status === "pass";
}

function reviewGateReason(status: CockpitStatus) {
  if (!reviewGateIsAvailable(status)) {
    return RED_EVIDENCE_MISSING_REASON;
  }

  return "Stage 4 review can be requested through CLI Authority.";
}

function landingReadinessReason(status: CockpitStatus) {
  if (status.landing_readiness.status === "ready") {
    return "Landing readiness can be checked through CLI Authority.";
  }

  return status.landing_readiness.reason;
}
