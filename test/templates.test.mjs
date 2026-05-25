import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

const templateContracts = [
  {
    path: "docs/templates/feature-prd.md",
    requirements: [
      ["problem", /^## Problem$/im],
      ["user", /^## User$/im],
      ["goals", /^## Goals$/im],
      ["non-goals", /^## Non-Goals$/im],
      ["stories or workflows", /^## Stories Or Workflows$/im],
      ["acceptance criteria", /^## Acceptance Criteria$/im],
      ["out-of-scope boundaries", /^## Out Of Scope$/im],
      ["test or verification strategy", /^## Test Or Verification Strategy$/im],
      ["decomposition notes", /^## Decomposition Notes$/im]
    ]
  },
  {
    path: "docs/templates/slice.md",
    requirements: [
      ["goal", /^## Goal$/im],
      ["scope", /^## Scope$/im],
      ["out of scope", /^## Out Of Scope$/im],
      ["acceptance criteria", /^## Acceptance Criteria$/im],
      ["test plan", /^## Test Plan$/im],
      ["CLEAN_CODE.md read evidence", /^## CLEAN_CODE\.md Read Evidence$/im],
      ["stage-rubric checklist", /^## Stage-Rubric Checklist$/im],
      ["bootstrap gaps", /^## Bootstrap Gaps$/im],
      ["expected files", /^## Expected Files$/im],
      ["implementation order", /^## First Implementation Order$/im],
      ["smell triggers", /^## Smell Triggers$/im],
      ["required evidence", /^## Required Evidence$/im],
      ["operator input status", /^## Operator Input Status$/im]
    ]
  },
  {
    path: "docs/templates/chore.md",
    requirements: [
      ["non-product work", /^## Non-Product Work$/im],
      ["origin", /^## Origin$/im],
      ["scope", /^## Scope$/im],
      ["acceptance criteria", /^## Acceptance Criteria$/im],
      ["verification plan", /^## Verification Plan$/im],
      ["expected files", /^## Expected Files$/im],
      ["required evidence", /^## Required Evidence$/im],
      ["operator input status", /^## Operator Input Status$/im]
    ]
  },
  {
    path: "docs/templates/improvement-chore.md",
    requirements: [
      ["source metadata", /source_(work_item|artifacts):/i],
      ["lesson", /^lesson:/im],
      ["hypothesis", /^hypothesis:/im],
      ["metric", /^metric:/im],
      ["baseline", /^baseline:/im],
      ["expected direction", /^expected_direction:/im],
      ["evaluation window", /^evaluation_window:/im],
      ["status", /^status:/im],
      ["outcome", /^outcome:/im]
    ]
  },
  {
    path: "docs/templates/review-evidence.md",
    requirements: [
      ["contract version", /^contract_version:/im],
      ["work item", /^work_item:/im],
      ["source head", /^source_head:/im],
      ["verification state", /^verification_state:/im],
      ["verification evidence", /^verification_evidence:/im],
      ["CodeRabbit state", /^coderabbit_state:/im],
      ["CodeRabbit replacement evidence", /^coderabbit_replacement_evidence:/im],
      ["local Qwen state", /^local_qwen_state:/im],
      ["local Qwen replacement evidence", /^local_qwen_replacement_evidence:/im],
      ["escalated review required", /^escalated_review_required:/im],
      ["escalated review state", /^escalated_review_state:/im],
      ["escalated review rationale", /^escalated_review_rationale:/im],
      ["PM disposition", /^pm_disposition:/im],
      ["PM disposition rationale", /^pm_disposition_rationale:/im],
      ["non-blocking findings routing", /^non_blocking_findings_routing:/im],
      ["operator input status", /^operator_input_status:/im],
      ["UAT status", /^uat_status:/im],
      ["clean-code status", /^clean_code_status:/im],
      ["source drift status", /^source_drift_status:/im],
      ["bootstrap gaps", /^bootstrap_gaps:/im]
    ]
  },
  {
    path: "docs/templates/landing-verdict.md",
    requirements: [
      ["contract version", /^contract_version:/im],
      ["work item", /^work_item:/im],
      ["source head", /^source_head:/im],
      ["review evidence", /^review_evidence:/im],
      ["tests status", /^tests_status:/im],
      ["clean-code status", /^clean_code_status:/im],
      ["CodeRabbit state", /^coderabbit_state:/im],
      ["local Qwen state", /^local_qwen_state:/im],
      ["escalated review state", /^escalated_review_state:/im],
      ["UAT status", /^uat_status:/im],
      ["source drift status", /^source_drift_status:/im],
      ["operator input status", /^operator_input_status:/im],
      ["Landing Agent state", /^landing_agent_state:/im],
      ["Landing Agent replacement evidence", /^landing_agent_replacement_evidence:/im],
      ["final verdict", /^final_verdict:/im],
      ["rationale", /^rationale:/im]
    ]
  },
  {
    path: "docs/templates/coderabbit-review.md",
    requirements: [
      ["contract version", /^contract_version:/im],
      ["work item", /^work_item:/im],
      ["source head", /^source_head:/im],
      ["provider", /^provider:/im],
      ["review target", /^review_target:/im],
      ["review state", /^review_state:/im],
      ["CodeRabbit verdict", /^coderabbit_verdict:/im],
      ["findings status", /^findings_status:/im],
      ["findings disposition", /^findings_disposition:/im],
      ["operator input status", /^operator_input_status:/im],
      ["source drift status", /^source_drift_status:/im],
      ["executable evidence", /^executable_evidence:/im],
      ["bootstrap gaps", /^bootstrap_gaps:/im]
    ]
  }
];

test("committed work artifact templates satisfy required contracts", async () => {
  for (const contract of templateContracts) {
    const content = await readTemplate(contract.path);

    for (const [label, pattern] of contract.requirements) {
      assert.match(
        content,
        pattern,
        `${contract.path} is missing required field: ${label}`
      );
    }
  }
});

async function readTemplate(templatePath) {
  try {
    return await readFile(path.join(repoRoot, templatePath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      assert.fail(`Missing required template: ${templatePath}`);
    }
    throw error;
  }
}

function isMissingPathError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
