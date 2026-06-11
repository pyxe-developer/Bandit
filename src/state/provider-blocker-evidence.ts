const AUTHORIZED_LOCAL_QWEN_COMMAND = "node bin/omlx-chat-completions.mjs";

type Verdict = "pass" | "blocker" | "blocked" | "bootstrap_gap";

export type ProviderBlockerEvidenceRecord = {
  kind: "provider_blocker_evidence";
  work_item: string;
  stage: string;
  provider: string;
  outcome: string;
  verdict: Verdict;
  pass_claimed: boolean;
  findings_status: string;
  findings_disposition: string;
  stop_condition: string | null;
  summary: string;
  command: string;
  elapsed_ms: number;
};

type BuildParams = {
  workItemId: string;
  stage: string;
  provider: string;
  outcome: string;
  command: string;
  elapsedMs: number;
  terminalEvidence: boolean;
};

type ValidateInput = {
  work_item: string;
  stage: string;
  provider: string;
  outcome: string;
  verdict: string;
  pass_claimed: boolean;
  terminal_evidence?: boolean;
  route?: string;
};

function verdictForOutcome(outcome: string): Verdict {
  switch (outcome) {
    case "provider_timeout":
      return "bootstrap_gap";
    case "successful_stage_transition":
      return "pass";
    case "missing_operator_owned_input":
    case "stale_evidence":
      return "blocked";
    default:
      return "blocker";
  }
}

function stopConditionForOutcome(outcome: string): string | null {
  switch (outcome) {
    case "malformed_output":
      return "malformed_provider_output";
    case "successful_stage_transition":
      return null;
    default:
      return outcome;
  }
}

function summaryForOutcome(
  outcome: string,
  provider: string,
  terminalEvidence: boolean
): string {
  if (outcome === "provider_timeout") {
    return (
      `Provider ${provider} timed out. No CodeRabbit pass is claimed. ` +
        `Record as bootstrap_gap replacement evidence only after ` +
        `the full required timeout window.`
    );
  }
  if (outcome === "malformed_output") {
    return (
      `Provider ${provider} returned malformed output. ` +
        `Partial completion must not be reported as success. ` +
        `Terminal evidence: ${terminalEvidence}.`
    );
  }
  return `Provider ${provider} outcome: ${outcome}. Terminal evidence: ${terminalEvidence}.`;
}

export function buildProviderBlockerEvidence(
  params: BuildParams
): ProviderBlockerEvidenceRecord {
  const verdict = verdictForOutcome(params.outcome);
  const stopCondition = stopConditionForOutcome(params.outcome);
  const passClaimed = verdict === "pass" && params.terminalEvidence;

  const findingsStatus = verdict === "bootstrap_gap" ? "resolved" : "recorded";
  const findingsDisposition =
    verdict === "bootstrap_gap"
      ? "provider_timeout_replacement_evidence"
      : `${params.outcome}_recorded`;

  return {
    kind: "provider_blocker_evidence",
    work_item: params.workItemId,
    stage: params.stage,
    provider: params.provider,
    outcome: params.outcome,
    verdict,
    pass_claimed: passClaimed,
    findings_status: findingsStatus,
    findings_disposition: findingsDisposition,
    stop_condition: stopCondition,
    summary: summaryForOutcome(
      params.outcome,
      params.provider,
      params.terminalEvidence
    ),
    command: params.command,
    elapsed_ms: params.elapsedMs
  };
}

export function validateProviderBlockerEvidence(
  evidence: ValidateInput
): void {
  if (
    evidence.verdict === "pass" &&
    evidence.pass_claimed === true &&
    !evidence.terminal_evidence
  ) {
    throw new Error(
      `partial completion as success is forbidden: ` +
        `pass may not be claimed without terminal evidence from the provider`
    );
  }

  if (evidence.provider === "local_qwen") {
    if (!evidence.route || evidence.route !== AUTHORIZED_LOCAL_QWEN_COMMAND) {
      throw new Error(
        `Local Qwen evidence must use the authorized route only: ` +
          `"${AUTHORIZED_LOCAL_QWEN_COMMAND}"; ` +
          `found: "${evidence.route ?? "none"}"`
      );
    }
  }
}
