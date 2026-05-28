import { readFile } from "node:fs/promises";
import path from "node:path";

type TemplateContract = {
  displayPath: string;
  requirements: TemplateRequirement[];
};

type TemplateRequirement = {
  label: string;
  pattern: RegExp;
};

const TEMPLATE_CONTRACTS: TemplateContract[] = [
  {
    displayPath: "docs/templates/feature-prd.md",
    requirements: [
      heading("problem", "Problem"),
      heading("user", "User"),
      heading("goals", "Goals"),
      heading("non-goals", "Non-Goals"),
      heading("stories or workflows", "Stories Or Workflows"),
      heading("acceptance criteria", "Acceptance Criteria"),
      heading("out-of-scope boundaries", "Out Of Scope"),
      heading("test or verification strategy", "Test Or Verification Strategy"),
      heading("decomposition notes", "Decomposition Notes")
    ]
  },
  {
    displayPath: "docs/templates/slice.md",
    requirements: [
      heading("goal", "Goal"),
      heading("scope", "Scope"),
      heading("out of scope", "Out Of Scope"),
      heading("acceptance criteria", "Acceptance Criteria"),
      heading("test plan", "Test Plan"),
      heading("CLEAN_CODE.md read evidence", "CLEAN_CODE.md Read Evidence"),
      heading("stage-rubric checklist", "Stage-Rubric Checklist"),
      heading("bootstrap gaps", "Bootstrap Gaps"),
      heading("expected files", "Expected Files"),
      heading("implementation order", "First Implementation Order"),
      heading("smell triggers", "Smell Triggers"),
      heading("required evidence", "Required Evidence"),
      heading("operator input status", "Operator Input Status")
    ]
  },
  {
    displayPath: "docs/templates/chore.md",
    requirements: [
      heading("non-product work", "Non-Product Work"),
      heading("origin", "Origin"),
      heading("scope", "Scope"),
      heading("acceptance criteria", "Acceptance Criteria"),
      heading("verification plan", "Verification Plan"),
      heading("expected files", "Expected Files"),
      heading("required evidence", "Required Evidence"),
      heading("operator input status", "Operator Input Status")
    ]
  },
  {
    displayPath: "docs/templates/improvement-chore.md",
    requirements: [
      metadata("source metadata", /^source_(work_item|artifacts):/im),
      metadata("lesson", /^lesson:/im),
      metadata("hypothesis", /^hypothesis:/im),
      metadata("metric", /^metric:/im),
      metadata("baseline", /^baseline:/im),
      metadata("expected_direction", /^expected_direction:/im),
      metadata("decision_criteria", /^decision_criteria:/im),
      metadata("minimum_detectable_effect", /^minimum_detectable_effect:/im),
      metadata("uncertainty", /^uncertainty:/im),
      metadata("evaluation_window", /^evaluation_window:/im),
      metadata("reevaluation_window", /^reevaluation_window:/im),
      metadata("proxy_risk", /^proxy_risk:/im),
      metadata("status", /^status:/im),
      metadata("evaluation_result", /^evaluation_result:/im),
      metadata("outcome", /^outcome:/im)
    ]
  },
  {
    displayPath: "docs/templates/improvement-evaluation.md",
    requirements: [
      metadata("candidate ID", /^candidate_id:/im),
      metadata("source artifacts", /^source_artifacts:/im),
      metadata("metric", /^metric:/im),
      metadata("baseline", /^baseline:/im),
      metadata("observed metric evidence", /^observed_metric_evidence:/im),
      metadata("comparison to baseline", /^comparison_to_baseline:/im),
      metadata("result", /^result:/im),
      metadata("decision", /^decision:/im),
      metadata("decision criteria comparison", /^decision_criteria_comparison:/im),
      metadata("re-evaluation window", /^reevaluation_window:/im),
      metadata("proxy-risk disposition", /^proxy_risk_disposition:/im),
      metadata("rationale", /^rationale:/im),
      metadata("routing action", /^routing_action:/im)
    ]
  },
  {
    displayPath: "docs/templates/routing-decision.md",
    requirements: [
      metadata("work item", /^work_item:/im),
      metadata("decision kind", /^decision_kind:/im),
      metadata("selected route", /^selected_route:/im),
      metadata("applicable smell IDs", /^applicable_smell_ids:/im),
      metadata("evidence used", /^evidence_used:/im),
      metadata("operator input status", /^operator_input_status:/im),
      metadata("bootstrap gaps", /^bootstrap_gaps:/im),
      metadata("escalation outcome", /^escalation_outcome:/im),
      metadata("final decision", /^final_decision:/im)
    ]
  },
  {
    displayPath: "docs/templates/review-evidence.md",
    requirements: [
      metadata("contract version", /^contract_version:/im),
      metadata("work item", /^work_item:/im),
      metadata("source head", /^source_head:/im),
      metadata("verification state", /^verification_state:/im),
      metadata("verification evidence", /^verification_evidence:/im),
      metadata("CodeRabbit state", /^coderabbit_state:/im),
      metadata("CodeRabbit replacement evidence", /^coderabbit_replacement_evidence:/im),
      metadata("local Qwen state", /^local_qwen_state:/im),
      metadata("local Qwen replacement evidence", /^local_qwen_replacement_evidence:/im),
      metadata("escalated review required", /^escalated_review_required:/im),
      metadata("escalated review state", /^escalated_review_state:/im),
      metadata("escalated review rationale", /^escalated_review_rationale:/im),
      metadata("PM disposition", /^pm_disposition:/im),
      metadata("PM disposition rationale", /^pm_disposition_rationale:/im),
      metadata(
        "non-blocking findings routing",
        /^non_blocking_findings_routing:/im
      ),
      metadata("operator input status", /^operator_input_status:/im),
      metadata("UAT status", /^uat_status:/im),
      metadata("clean-code status", /^clean_code_status:/im),
      metadata("source drift status", /^source_drift_status:/im),
      metadata("bootstrap gaps", /^bootstrap_gaps:/im)
    ]
  },
  {
    displayPath: "docs/templates/landing-verdict.md",
    requirements: [
      metadata("contract version", /^contract_version:/im),
      metadata("work item", /^work_item:/im),
      metadata("source head", /^source_head:/im),
      metadata("review evidence", /^review_evidence:/im),
      metadata("tests status", /^tests_status:/im),
      metadata("clean-code status", /^clean_code_status:/im),
      metadata("CodeRabbit state", /^coderabbit_state:/im),
      metadata("local Qwen state", /^local_qwen_state:/im),
      metadata("escalated review state", /^escalated_review_state:/im),
      metadata("UAT status", /^uat_status:/im),
      metadata("source drift status", /^source_drift_status:/im),
      metadata("operator input status", /^operator_input_status:/im),
      metadata("Landing Agent state", /^landing_agent_state:/im),
      metadata("Landing Agent replacement evidence", /^landing_agent_replacement_evidence:/im),
      metadata("final verdict", /^final_verdict:/im),
      metadata("rationale", /^rationale:/im)
    ]
  },
  {
    displayPath: "docs/templates/local-qwen-review.md",
    requirements: [
      metadata("contract version", /^contract_version:/im),
      metadata("work item", /^work_item:/im),
      metadata("source head", /^source_head:/im),
      metadata("profile ID", /^profile_id:/im),
      metadata("runtime", /^runtime:/im),
      metadata("model", /^model:/im),
      metadata("run status", /^run_status:/im),
      metadata("reviewer verdict", /^reviewer_verdict:/im),
      metadata("findings status", /^findings_status:/im),
      metadata("findings disposition", /^findings_disposition:/im),
      metadata("operator input status", /^operator_input_status:/im),
      metadata("source drift status", /^source_drift_status:/im),
      metadata("executable evidence", /^executable_evidence:/im),
      metadata("bootstrap gaps", /^bootstrap_gaps:/im)
    ]
  },
  {
    displayPath: "docs/templates/coderabbit-review.md",
    requirements: [
      metadata("contract version", /^contract_version:/im),
      metadata("work item", /^work_item:/im),
      metadata("source head", /^source_head:/im),
      metadata("provider", /^provider:/im),
      metadata("review target", /^review_target:/im),
      metadata("review state", /^review_state:/im),
      metadata("CodeRabbit verdict", /^coderabbit_verdict:/im),
      metadata("findings status", /^findings_status:/im),
      metadata("findings disposition", /^findings_disposition:/im),
      metadata("operator input status", /^operator_input_status:/im),
      metadata("source drift status", /^source_drift_status:/im),
      metadata("executable evidence", /^executable_evidence:/im),
      metadata("bootstrap gaps", /^bootstrap_gaps:/im)
    ]
  },
  {
    displayPath: "docs/templates/skill-lifecycle-contract.md",
    requirements: [
      metadata("skill_id", /^skill_id:/im),
      metadata("owner", /^owner:/im),
      metadata("version", /^version:/im),
      metadata("changelog", /^changelog:/im),
      metadata("intended_stages", /^intended_stages:/im),
      metadata("required_tools", /^required_tools:/im),
      metadata("forbidden_actions", /^forbidden_actions:/im),
      metadata("evaluation_packets", /^evaluation_packets:/im),
      metadata("rollback_criteria", /^rollback_criteria:/im),
      metadata("stage_bindings", /^stage_bindings:/im),
      metadata("installed_skill_drift", /^installed_skill_drift:/im)
    ]
  },
  {
    displayPath: "docs/templates/coordination-authority.md",
    requirements: [
      metadata("work_item", /^work_item:/im),
      metadata("canonical_history", /^canonical_history:/im),
      metadata(
        "accepted workflow event families",
        /^accepted_workflow_event_families:/im
      ),
      metadata("actor event non-authority", /^actor_event_non_authority:/im),
      metadata("projection surfaces", /^projection_surfaces:/im),
      metadata("allowed mutation paths", /^allowed_mutation_paths:/im),
      metadata("history replay", /^history_replay:/im),
      metadata("projection reconciliation", /^projection_reconciliation:/im),
      metadata("claim authority exception", /^claim_authority_exception:/im),
      metadata("rationale", /^rationale:/im),
      metadata("evidence paths", /^evidence_paths:/im)
    ]
  },
  {
    displayPath: "docs/templates/operator-boundary.md",
    requirements: [
      metadata("work item", /^work_item:/im),
      metadata("operator blocking gates", /^operator_blocking_gates:/im),
      metadata(
        "Codex-owned technical decisions",
        /^codex_owned_technical_decisions:/im
      ),
      metadata("derivable operational drift", /^derivable_operational_drift:/im),
      metadata("CLI-owned mechanical repair", /^cli_owned_mechanical_repair:/im),
      metadata("repair overreach refusals", /^repair_overreach_refusals:/im),
      metadata(
        "operator escalation overuse smells",
        /^operator_escalation_overuse_smells:/im
      ),
      metadata("required evidence", /^required_evidence:/im),
      metadata("source artifacts", /^source_artifacts:/im),
      metadata("escalation targets", /^escalation_targets:/im),
      metadata("evidence paths", /^evidence_paths:/im)
    ]
  }
];

export async function validateTemplates(repoRoot: string) {
  for (const contract of TEMPLATE_CONTRACTS) {
    const content = await readTemplate(repoRoot, contract.displayPath);
    const missingRequirements = contract.requirements.filter(
      (requirement) => !requirement.pattern.test(content)
    );

    if (missingRequirements.length > 0) {
      throw new Error(formatMalformedTemplate(contract, missingRequirements));
    }
  }
}

async function readTemplate(repoRoot: string, displayPath: string) {
  try {
    return await readFile(path.join(repoRoot, displayPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${displayPath}`);
    }
    throw error;
  }
}

function formatMalformedTemplate(
  contract: TemplateContract,
  missingRequirements: TemplateRequirement[]
) {
  const missingFields = missingRequirements
    .map((requirement) => `missing required field: ${requirement.label}`)
    .join("; ");

  return `Malformed template: ${contract.displayPath}; ${missingFields}`;
}

function heading(label: string, headingText: string) {
  return metadata(label, new RegExp(`^## ${escapeRegExp(headingText)}$`, "im"));
}

function metadata(label: string, pattern: RegExp): TemplateRequirement {
  return { label, pattern };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
