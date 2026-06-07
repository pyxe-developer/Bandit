import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("orchestrator prompt validation accepts a harness-portable guidance contract", async () => {
  const repo = await createInitializedRepo();
  await writeOrchestratorPromptTemplate(repo);
  await writePromptPolicy(repo, validPromptPolicy());

  const result = await runBandit(repo, [
    "orchestrator-prompts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.verdict, "pass");
  assert.equal(payload.policy, ".bandit/policy/orchestrator-prompts.json");
  assert.deepEqual(payload.prompt_contracts, ["work-item-pm"]);
  assert.equal(payload.cli_authority_preserved, true);
});

test("orchestrator prompt validation fails closed when prompt sections are missing", async () => {
  const repo = await createInitializedRepo();
  await writeOrchestratorPromptTemplate(repo, "## Current Repo State\n");
  await writePromptPolicy(repo, validPromptPolicy());

  const result = await runBandit(repo, [
    "orchestrator-prompts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /template missing required section: Stage Sequence/);
  assert.match(result.stderr, /template missing required section: Forbidden Actions/);
});

test("orchestrator prompt validation rejects canonical authority and gate bypass claims", async () => {
  const repo = await createInitializedRepo();
  await writeOrchestratorPromptTemplate(repo);
  await writePromptPolicy(repo, {
    ...validPromptPolicy(),
    prompt_contracts: [
      {
        ...validPromptContract(),
        authority_boundary: {
          prompt_is_authoritative: true,
          canonical_sources_replaced: ["docs/work/<ID>/brief.md"],
          cli_state_mutation: "direct_file_write"
        },
        required_gates: [
          "stage2_red_recorded",
          "stage3_implementation_evidence",
          "stage4_review_evidence",
          "stage5_landing_verdict",
          "stage6_retrospective"
        ],
        role_boundaries: {
          ...validPromptContract().role_boundaries,
          stage3_writer_can_edit_tests: true,
          codex_red_requires_claude_stage3: false
        },
        forbidden_authority_claims: [
          "replace_old_gate",
          "trust_verifier_cutover"
        ]
      }
    ]
  });

  const result = await runBandit(repo, [
    "orchestrator-prompts",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /prompt contract work-item-pm claims canonical workflow authority/);
  assert.match(result.stderr, /prompt contract work-item-pm missing required gate formation_approved/);
  assert.match(result.stderr, /prompt contract work-item-pm allows Stage 3 Writer test edits/);
  assert.match(result.stderr, /prompt contract work-item-pm permits forbidden authority claim trust_verifier_cutover/);
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writePromptPolicy(repo, value) {
  await writeJsonAt(repo, ".bandit/policy/orchestrator-prompts.json", value);
}

async function writeJsonAt(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeOrchestratorPromptTemplate(repo, content = defaultPromptTemplate()) {
  const destination = path.join(
    repo,
    "docs/templates/work-item-pm-orchestrator-prompt.md"
  );
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

function validPromptPolicy() {
  return {
    contract_version: 1,
    policy_id: "orchestrator-prompts",
    prompt_contracts: [validPromptContract()]
  };
}

function validPromptContract() {
  return {
    id: "work-item-pm",
    prompt_path: "docs/templates/work-item-pm-orchestrator-prompt.md",
    role: "work_item_pm_orchestrator_guidance",
    trust_inputs: {
      allowed: [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/coordination-log.jsonl",
        "docs/work/<ID>/orchestration-plan.md",
        "docs/roadmap/CURRENT_CONTEXT.md",
        "docs/roadmap/ROADMAP.md",
        "STATUS.md",
        ".bandit/bootstrap-gaps.json"
      ],
      non_authoritative: [
        "chat_text",
        "model_memory",
        "live_harness_state",
        "provider_dashboard",
        "queue_state"
      ]
    },
    authority_boundary: {
      prompt_is_authoritative: false,
      canonical_sources_replaced: [],
      cli_state_mutation: "cli_only"
    },
    required_sections: [
      "Current Repo State",
      "Stage Sequence",
      "Required Evidence",
      "Role Boundaries",
      "Verification Commands",
      "Known Blockers",
      "Stop Conditions",
      "Forbidden Actions"
    ],
    required_gates: [
      "formation_approved",
      "orchestration_plan_recorded",
      "stage2_red_recorded",
      "stage3_implementation_evidence",
      "stage4_review_evidence",
      "stage5_landing_verdict",
      "stage5_landing_action",
      "stage6_retrospective"
    ],
    role_boundaries: {
      repo_pm_owns_formation: true,
      work_item_pm_owns_orchestration: true,
      test_writer_owns_red: true,
      implementation_writer_owns_source_only: true,
      stage3_writer_can_edit_tests: false,
      codex_red_requires_claude_stage3: true,
      reviewer_owns_review_evidence: true,
      landing_agent_owns_landing_verdict: true,
      closeout_agent_owns_retrospective: true
    },
    forbidden_authority_claims: []
  };
}

function defaultPromptTemplate() {
  return `# Work Item PM Orchestrator Prompt

## Current Repo State

## Stage Sequence

## Required Evidence

## Role Boundaries

## Verification Commands

## Known Blockers

## Stop Conditions

## Forbidden Actions
`;
}
