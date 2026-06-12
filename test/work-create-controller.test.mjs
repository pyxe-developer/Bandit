import assert from "node:assert/strict";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile
} from "./helpers/bandit-cli.mjs";

test("Repo PM create controller creates the next roadmap-authorized source spec and stops before Stage 2", async () => {
  const repo = await createControllerRepo();
  await writeSourceSpec(repo, "BANDIT-094-repo-pm-create-controller-and-prompt-contract");
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.kind, "repo_pm_create_controller_result");
  assert.equal(payload.status, "brief_created");
  assert.equal(payload.work_item, "BANDIT-094");
  assert.equal(payload.target.relationship, "next");
  assert.equal(payload.target.title, "PRD-005.2 Repo PM Create Controller And Prompt Contract");
  assert.equal(payload.stage2_started, false);
  assert.match(payload.next_action, /formation review/i);

  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/brief.md"), true);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/coordination-log.jsonl"), true);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/orchestration-plan.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/red-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/implementation-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/review-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/landing-verdict.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/retrospective.md"), false);

  const coordinationLog = await readFile(
    path.join(repo, "docs/work/BANDIT-094/coordination-log.jsonl"),
    "utf8"
  );
  assert.match(coordinationLog, /"state":"brief_created"/);
  assert.doesNotMatch(coordinationLog, /red_recorded|implementation_recorded|review_recorded|landed|closed/);
});

test("Repo PM create controller reports already formed work idempotently", async () => {
  const repo = await createControllerRepo({
    currentContext: currentContextActive094(),
    roadmap: roadmapActive094()
  });
  await writeSourceSpec(repo, "BANDIT-094-repo-pm-create-controller-and-prompt-contract");
  await writeLocalQwenProfile(repo);
  await writeFormedWorkItem(repo, "BANDIT-094");

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "already_formed");
  assert.equal(payload.work_item, "BANDIT-094");
  assert.match(payload.next_action, /Work Item PM should record plan-mode orchestration for BANDIT-094 before RED evidence/);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-095/brief.md"), false);
});

test("Repo PM create controller creates next target from a closed current-work anchor", async () => {
  const repo = await createControllerRepo({
    currentContext: closedAnchorCurrentContextFixture(),
    roadmap: closedAnchorRoadmapFixture()
  });
  await writeClosedWorkItem(repo, "BANDIT-094", "Repo PM Create Controller And Prompt Contract");
  await writeSourceSpec(
    repo,
    "BANDIT-095-work-item-pm-execute-controller-and-route-registry",
    validSliceSpec({
      title: "Work Item PM Execute Controller And Route Registry",
      goal: "Implement PRD-005.3 Work Item PM execute-controller routing.",
      scope: ["BANDIT-PRD-005.3 Work Item PM Execute Controller And Route Registry."]
    })
  );
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "brief_created");
  assert.equal(payload.work_item, "BANDIT-095");
  assert.equal(payload.target.relationship, "next");
  assert.equal(payload.target.title, "PRD-005.3 Work Item PM Execute Controller And Route Registry");
  assert.equal(payload.stage2_started, false);
  assert.match(payload.next_action, /formation review/i);

  assert.equal(await pathExists(repo, "docs/work/BANDIT-095/brief.md"), true);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-095/coordination-log.jsonl"), true);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-095/red-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-095/implementation-evidence.md"), false);
});

test("Repo PM create controller refuses closed-anchor routing without landing action evidence", async () => {
  const repo = await createControllerRepo({
    currentContext: closedAnchorCurrentContextFixture(),
    roadmap: closedAnchorRoadmapFixture()
  });
  await writeIncompleteClosedWorkItem(repo, "BANDIT-094", "Repo PM Create Controller And Prompt Contract");
  await writeSourceSpec(
    repo,
    "BANDIT-095-work-item-pm-execute-controller-and-route-registry",
    validSliceSpec({
      title: "Work Item PM Execute Controller And Route Registry",
      goal: "Implement PRD-005.3 Work Item PM execute-controller routing.",
      scope: ["BANDIT-PRD-005.3 Work Item PM Execute Controller And Route Registry."]
    })
  );
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /closed current work item BANDIT-094/i);
  assert.match(result.stderr, /landing-action\.md/i);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-095/brief.md"), false);
});

test("Repo PM create controller refuses when roadmap target has no explicit source spec", async () => {
  const repo = await createControllerRepo();
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing explicit source spec/i);
  assert.match(result.stderr, /BANDIT-PRD-005\.2|Repo PM Create Controller/i);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/brief.md"), false);
});

test("Repo PM create controller refuses operator-owned input instead of guessing", async () => {
  const repo = await createControllerRepo({
    currentContext: `${interstitialCurrentContextFixture()}

## Required Operator Input

Product direction required before creating this target.
`
  });
  await writeSourceSpec(repo, "BANDIT-094-repo-pm-create-controller-and-prompt-contract");
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /operator-owned input required/i);
  assert.match(result.stderr, /Product direction required/i);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/brief.md"), false);
});

test("Repo PM create controller refuses missing authorized Local Qwen route", async () => {
  const repo = await createControllerRepo();
  await rm(path.join(repo, ".bandit/reviewers/local-qwen.json"), {
    force: true
  });
  await writeSourceSpec(repo, "BANDIT-094-repo-pm-create-controller-and-prompt-contract");

  const result = await runBandit(repo, [
    "repo-pm",
    "create-controller",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Local Qwen.*authorized route/i);
  assert.match(result.stderr, /\.bandit\/reviewers\/local-qwen\.json/);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-094/brief.md"), false);
});

async function createControllerRepo(options = {}) {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);

  await writeArtifact(
    repo,
    "docs/roadmap/CURRENT_CONTEXT.md",
    options.currentContext ?? interstitialCurrentContextFixture()
  );
  await writeArtifact(
    repo,
    "docs/roadmap/ROADMAP.md",
    options.roadmap ?? interstitialRoadmapFixture()
  );
  await writeArtifact(
    repo,
    "docs/prds/BANDIT-PRD-005-bandit-work-commands.md",
    "# BANDIT-PRD-005\n\nApproved source PRD.\n"
  );
  await writeArtifact(
    repo,
    "docs/prds/BANDIT-PRD-004-005-decomposition.md",
    "# Decomposition\n\nPRD-005.2 - Repo PM Create Controller And Prompt Contract.\n"
  );
  await writeJson(repo, ".bandit/work-intake-ledger.json", { version: 1, entries: [] });
  await writeClosedWorkItem(repo, "BANDIT-093", "Roadmap Work Target Resolver");

  return repo;
}

async function writeClosedWorkItem(repo, id, title) {
  await writeArtifact(
    repo,
    `docs/work/${id}/brief.md`,
    `# ${id}: ${title}

work_type: slice
`
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/landing-action.md`,
    "# Landing Action\n\ncommit_sha: fixture\n"
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/retrospective.md`,
    "# Retrospective\n\nClosed.\n"
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/improvement-disposition.md`,
    "# Improvement Disposition\n\nNo action.\n"
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/coordination-log.jsonl`,
    `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: id,
      sequence: 1,
      timestamp: "2026-06-10T00:00:00Z",
      actor: "closeout_agent",
      source: "fixture",
      state: "closed",
      evidence: [`docs/work/${id}/retrospective.md`],
      safe_triggers: ["next_work_item_formation_allowed"],
      next_action: "Repo PM should create PRD-005.2 Repo PM Create Controller And Prompt Contract.",
      accountable_actor: "repo_pm",
      accepted_block: null
    })}\n`
  );
}

async function writeFormedWorkItem(repo, id) {
  await writeArtifact(repo, `docs/work/${id}/brief.md`, formationReadyBrief(id));
  await writeFormationReview(repo, `docs/work/${id}/qwen-formation-review.md`, "pass", "no_findings");
  await writeFormationReview(repo, `docs/work/${id}/coderabbit-formation-review.md`, "bootstrap_gap", "resolved");
  await writeFormationReview(repo, `docs/work/${id}/formation-review.md`, "pass", "resolved");
  await writeArtifact(
    repo,
    `docs/work/${id}/coordination-log.jsonl`,
    `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: id,
      sequence: 1,
      timestamp: "2026-06-10T00:00:00Z",
      actor: "repo_pm",
      source: "fixture",
      state: "brief_created",
      evidence: [`docs/work/${id}/brief.md`],
      safe_triggers: ["formation_required"],
      next_action: "Run formation review.",
      accountable_actor: "repo_pm",
      accepted_block: null
    })}\n${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: id,
      sequence: 2,
      timestamp: "2026-06-10T00:01:00Z",
      actor: "repo_pm",
      source: "fixture",
      state: "formation_approved",
      evidence: [
        `docs/work/${id}/qwen-formation-review.md`,
        `docs/work/${id}/coderabbit-formation-review.md`,
        `docs/work/${id}/formation-review.md`
      ],
      safe_triggers: ["red_evidence_required"],
      next_action: null,
      accountable_actor: null,
      accepted_block: null
    })}\n`
  );
}

async function writeFormationReview(repo, relativePath, verdict, findingsStatus) {
  await writeArtifact(
    repo,
    relativePath,
    `# Formation Review

verdict: ${verdict}
findings_status: ${findingsStatus}
findings_disposition: no_action_required
`
  );
}

async function writeSourceSpec(repo, id, spec = validSliceSpec()) {
  await writeJson(repo, `docs/specs/${id}.json`, spec);
}

function validSliceSpec(overrides = {}) {
  return {
    kind: "slice",
    title: "Repo PM Create Controller And Prompt Contract",
    status: "Brief Created",
    goal: "Create a Bandit-native Repo PM create controller and prompt contract.",
    scope: ["Implement a Stage 1 create-controller foundation."],
    out_of_scope: ["Do not start Stage 2 or later evidence."],
    acceptance_criteria: ["The create controller forms work only from explicit source specs."],
    expected_files: ["docs/work/<ID>/brief.md", "docs/work/<ID>/coordination-log.jsonl"],
    required_evidence: ["docs/work/<ID>/brief.md", "docs/work/<ID>/coordination-log.jsonl"],
    operator_input_status: "none_required",
    test_plan: ["Run focused create-controller tests."],
    clean_code_read_evidence: "CLEAN_CODE.md read before slice formation.",
    stage_rubric_checklist: ["Stage 1: Work-Item Brief And Spec | pass | Fixture spec."],
    bootstrap_gaps: ["No bootstrap gap blocks this fixture."],
    first_implementation_order: ["Create or repair Stage 1 only."],
    smell_triggers: ["Hidden scheduler behavior is blocked."],
    stage_capability_scope: {
      policy: ".bandit/policy/stage-capability-scope.json",
      stages: ["Stage 1"],
      authority_roles: ["repo_pm"],
      required_skills: ["bandit"],
      forbidden_actions: ["red-evidence", "implementation", "landing"]
    },
    ...overrides
  };
}

function formationReadyBrief(id) {
  return `# ${id}: Repo PM Create Controller And Prompt Contract

work_type: slice

## Origin

Roadmap/current-context authorized PRD-005.2 source.

## Scope

Create a Stage 1 create-controller fixture.

## Out Of Scope

No Stage 2 execution.

## Acceptance Criteria

Idempotent already-formed behavior.

## Verification Plan

Run create-controller tests.

## Operator Input Status

none_required.

## Role Boundary Evidence

Test Writer owns RED. Implementation Writer owns source only.

## Expected Files

- docs/work/${id}/brief.md
`;
}

function interstitialCurrentContextFixture() {
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

\`BANDIT-093\` is the last closed work item.

No active work item is currently formed.

The current stage is Stage 6: closed.

**Current next action:** Repo PM should create PRD-005.2 Repo PM Create Controller And Prompt Contract after BANDIT-093 closeout.

## Required Operator Input

none_required.
`;
}

function interstitialRoadmapFixture() {
  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- \`[Slice]\` \`BANDIT-093\` - Roadmap Work Target Resolver (closed)

**Current next step:** Repo PM should create PRD-005.2 Repo PM Create Controller And Prompt Contract after BANDIT-093 closeout.

## Next Work Item

- \`[Slice]\` \`TBD\` - PRD-005.2 Repo PM Create Controller And Prompt Contract,
  pending \`BANDIT-093\` landing and closeout.
`;
}

function currentContextActive094() {
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

\`BANDIT-093\` is the last closed work item.

**Active work item:** \`BANDIT-094\` - Repo PM Create Controller And Prompt Contract.

The current stage is Stage 1: formation_approved.

**Current next action:** Work Item PM should record plan-mode orchestration for BANDIT-094 before RED evidence.

## Required Operator Input

none_required.
`;
}

function roadmapActive094() {
  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- \`[Slice]\` \`BANDIT-093\` - Roadmap Work Target Resolver (closed)

## Current Work Item

- \`[Slice]\` \`BANDIT-094\` - Repo PM Create Controller And Prompt Contract
  (Stage 1: formation_approved)

**Current next step:** Work Item PM should record plan-mode orchestration for BANDIT-094 before RED evidence.

## Next Work Item

- \`[Slice]\` \`TBD\` - PRD-005.3 Work Item PM Execute Controller And Route Registry,
  pending \`BANDIT-094\` landing and closeout.
`;
}

function closedAnchorCurrentContextFixture() {
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

\`BANDIT-094\` is the last closed work item.

**Active work item:** \`BANDIT-094\` - Repo PM Create Controller And Prompt Contract.

The current stage is Stage 6: closed.

**Current next action:** Repo PM should form the next work item for PRD-005.3
Work Item PM Execute Controller And Route Registry.

## Required Operator Input

none_required.
`;
}

function closedAnchorRoadmapFixture() {
  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- \`[Slice]\` \`BANDIT-094\` - Repo PM Create Controller And Prompt Contract (closed)

## Current Work Item

- \`[Slice]\` \`BANDIT-094\` - Repo PM Create Controller And Prompt Contract
  (Stage 6: closed; retained as the derived-status anchor until the next work
  item is formed)

**Current next step:** Repo PM should form the next work item for PRD-005.3
Work Item PM Execute Controller And Route Registry.

## Next Work Item

- \`[Slice]\` \`TBD\` - PRD-005.3 Work Item PM Execute Controller And Route Registry
  (not yet formed)
`;
}

async function writeIncompleteClosedWorkItem(repo, id, title) {
  await writeArtifact(
    repo,
    `docs/work/${id}/brief.md`,
    `# ${id}: ${title}

work_type: slice
`
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/retrospective.md`,
    "# Retrospective\n\nClosed.\n"
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/improvement-disposition.md`,
    "# Improvement Disposition\n\nNo action.\n"
  );
  await writeArtifact(
    repo,
    `docs/work/${id}/coordination-log.jsonl`,
    `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: id,
      sequence: 1,
      timestamp: "2026-06-10T00:00:00Z",
      actor: "closeout_agent",
      source: "fixture",
      state: "closed",
      evidence: [`docs/work/${id}/retrospective.md`],
      safe_triggers: ["next_work_item_formation_allowed"],
      next_action: "Repo PM should create PRD-005.3 Work Item PM Execute Controller And Route Registry.",
      accountable_actor: "repo_pm",
      accepted_block: null
    })}\n`
  );
}

async function writeArtifact(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function writeJson(repo, relativePath, value) {
  await writeArtifact(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function pathExists(repo, relativePath) {
  try {
    await access(path.join(repo, relativePath));
    return true;
  } catch {
    return false;
  }
}
