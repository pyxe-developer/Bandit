import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("orchestrator prompt validation accepts harness-portable guidance contracts", async () => {
  const repo = await createInitializedRepo();
  await writeOrchestratorPromptTemplate(repo);
  await writeRepoPmPromptTemplate(repo);
  await writePromptPolicy(repo, validPromptPolicy({
    prompt_contracts: [validPromptContract(), validRepoPmPromptContract()]
  }));

  const result = await runBandit(repo, [
    "orchestrator-prompts",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.verdict, "pass");
  assert.equal(payload.policy, ".bandit/policy/orchestrator-prompts.json");
  assert.deepEqual(payload.prompt_contracts, ["work-item-pm", "repo-pm"]);
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

test("orchestrator prompt validation rejects foreign Repo PM prompt leakage", async () => {
  const repo = await createInitializedRepo();
  await writeRepoPmPromptTemplate(
    repo,
    `${defaultRepoPmPromptTemplate()}

SeekWins path: /Users/matthewflebbe/seekwins
Reviewer fallback: run qwen directly or use Ollama.
Linux setup: continue WI-00 governance onboarding.
`
  );
  await writePromptPolicy(repo, validPromptPolicy({
    prompt_contracts: [validRepoPmPromptContract()]
  }));

  const result = await runBandit(repo, [
    "orchestrator-prompts",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /prompt contract repo-pm leaks foreign repository source/i);
  assert.match(result.stderr, /prompt contract repo-pm permits unauthorized Local Qwen routing/i);
  assert.match(result.stderr, /prompt contract repo-pm leaks foreign workflow policy/i);
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

async function writeRepoPmPromptTemplate(repo, content = defaultRepoPmPromptTemplate()) {
  const destination = path.join(
    repo,
    "docs/templates/repo-pm-formation-prompt.md"
  );
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

function validPromptPolicy(overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "orchestrator-prompts",
    prompt_contracts: [validPromptContract()],
    ...overrides
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

function validRepoPmPromptContract() {
  return {
    id: "repo-pm",
    prompt_path: "docs/templates/repo-pm-formation-prompt.md",
    role: "repo_pm_formation_guidance",
    trust_inputs: {
      allowed: [
        "AGENTS.md",
        "CONTEXT.md",
        "CLEAN_CODE.md",
        "docs/verification/STAGE_RUBRICS.md",
        "docs/roadmap/CURRENT_CONTEXT.md",
        "docs/roadmap/ROADMAP.md",
        "STATUS.md",
        "docs/prds/BANDIT-PRD-005-bandit-work-commands.md",
        "docs/specs/<ID>.json",
        ".bandit/bootstrap-gaps.json",
        ".bandit/reviewers/local-qwen.json"
      ],
      non_authoritative: [
        "chat_text",
        "model_memory",
        "live_harness_state",
        "provider_dashboard",
        "work_intake_ledger_priority",
        "slash_command_text"
      ]
    },
    authority_boundary: {
      prompt_is_authoritative: false,
      canonical_sources_replaced: [],
      cli_state_mutation: "cli_only"
    },
    required_sections: [
      "Required Reads",
      "Context And Boundary",
      "Target Resolution",
      "Formation Flow",
      "Review Evidence",
      "Operator Input Boundaries",
      "Stop Conditions",
      "Forbidden Actions"
    ],
    required_gates: [
      "stage0_context_readiness",
      "brief_created",
      "qwen_formation_review",
      "coderabbit_formation_review_or_timeout",
      "aggregate_formation_review",
      "formation_approved",
      "stage2_not_started"
    ],
    role_boundaries: {
      repo_pm_owns_formation: true,
      work_item_pm_owns_orchestration: false,
      test_writer_owns_red: false,
      implementation_writer_owns_source_only: false,
      stage3_writer_can_edit_tests: false,
      codex_red_requires_claude_stage3: true,
      reviewer_owns_review_evidence: true,
      landing_agent_owns_landing_verdict: false,
      closeout_agent_owns_retrospective: false
    },
    local_qwen_route: {
      profile: ".bandit/reviewers/local-qwen.json",
      adapter: "node bin/omlx-chat-completions.mjs",
      direct_qwen_cli_allowed: false,
      ollama_allowed: false
    },
    forbidden_foreign_sources: [
      "SeekWins",
      "/Users/matthewflebbe/seekwins",
      "WI-00",
      "Ollama"
    ],
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

function defaultRepoPmPromptTemplate() {
  return `# Repo PM Formation Prompt

This prompt is Bandit-native adapter guidance for Stage 1 work-item formation.
It is not canonical workflow authority and cannot replace Bandit CLI
validation, roadmap/current-context authority, work-item artifacts,
coordination logs, or formation review evidence.

## Required Reads

Read AGENTS.md, CONTEXT.md, docs/roadmap/CURRENT_CONTEXT.md,
docs/roadmap/ROADMAP.md, docs/plans/BOOTSTRAP_METHODOLOGY.md,
CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md, STATUS.md, and the selected
source spec before forming work.

## Context And Boundary

Use repository artifacts only. Treat prompt text, chat history, live harness
state, slash-command text, and Work Intake Ledger priority as non-authoritative
unless roadmap/current-context authority names them.

## Target Resolution

Resolve the current or next authorized target from ROADMAP.md and
CURRENT_CONTEXT.md. Dereference PRD, spec, or WIL provenance only after roadmap
authorization.

## Formation Flow

Create or repair the Stage 1 brief and coordination evidence only. Stop at
formation_approved and do not create Stage 2 or later evidence.

## Review Evidence

Use Local Qwen only through .bandit/reviewers/local-qwen.json and node
bin/omlx-chat-completions.mjs. Record CodeRabbit timeout evidence honestly
without claiming a pass.

## Operator Input Boundaries

Halt for product, UAT, policy, business, explicit cost/risk, Trust Verifier
cutover, merge, push, deploy, hosted services, telemetry, external mutation, or
genuinely ambiguous scope.

## Stop Conditions

Stop when roadmap/current-context disagree, source material is missing, Local
Qwen is unavailable through the authorized route, formation reviews block, or
operator-owned input is required.

## Forbidden Actions

Do not start Stage 2, create execution artifacts, use direct qwen CLI, use
Ollama as a reviewer route, scan WIL as a hidden scheduler, approve Trust
Verifier cutover, replace old gates, merge, push, deploy, or mutate state
outside Bandit CLI commands.
`;
}
