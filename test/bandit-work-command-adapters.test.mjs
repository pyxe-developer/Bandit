import assert from "node:assert/strict";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile
} from "./helpers/bandit-cli.mjs";

test("work-create adapter delegates to Repo PM create controller and stops before Stage 2", async () => {
  const repo = await createAdapterRepo();
  await writeSourceSpec(repo, "BANDIT-097-operator-command-adapters");
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, ["work-create", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.kind, "bandit_work_create_result");
  assert.equal(payload.delegate, "repo_pm_create_controller");
  assert.equal(payload.status, "brief_created");
  assert.equal(payload.work_item, "BANDIT-097");
  assert.equal(payload.stage_reached, "Stage 1: brief_created");
  assert.equal(payload.required_operator_input, "none_required");
  assert.equal(payload.blocker, null);
  assert.equal(payload.stage2_started, false);
  assert.equal(payload.next_safe_command, "bandit work-create");
  assert.deepEqual(payload.evidence_written, [
    "docs/work/BANDIT-097/brief.md",
    "docs/work/BANDIT-097/coordination-log.jsonl"
  ]);

  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/brief.md"), true);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/coordination-log.jsonl"), true);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/orchestration-plan.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/red-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/implementation-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/review-evidence.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/landing-verdict.md"), false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/retrospective.md"), false);
});

test("work-create adapter reports already formed work idempotently", async () => {
  const repo = await createAdapterRepo({
    currentContext: currentContextActive097(),
    roadmap: roadmapActive097()
  });
  await writeSourceSpec(repo, "BANDIT-097-operator-command-adapters");
  await writeLocalQwenProfile(repo);
  await writeFormedWorkItem(repo, "BANDIT-097");

  const result = await runBandit(repo, ["work-create", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.kind, "bandit_work_create_result");
  assert.equal(payload.status, "already_formed");
  assert.equal(payload.work_item, "BANDIT-097");
  assert.equal(payload.stage_reached, "Stage 1: formation_approved");
  assert.equal(payload.next_safe_command, "bandit work-execute");
  assert.equal(payload.stage2_started, false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-098/brief.md"), false);
});

test("work-create adapter preserves controller refusal for missing source authority", async () => {
  const repo = await createAdapterRepo();
  await writeLocalQwenProfile(repo);

  const result = await runBandit(repo, ["work-create", "--json"]);

  assert.equal(result.code, 1);
  const payload = JSON.parse(result.stderr);
  assert.equal(payload.kind, "bandit_work_create_result");
  assert.equal(payload.delegate, "repo_pm_create_controller");
  assert.equal(payload.status, "blocked");
  assert.equal(payload.work_item, null);
  assert.match(payload.blocker, /missing explicit source spec/i);
  assert.equal(payload.required_operator_input, "none_required");
  assert.equal(payload.stage2_started, false);
  assert.equal(await pathExists(repo, "docs/work/BANDIT-097/brief.md"), false);
});

test("work-execute adapter refuses before formation_approved and never creates new work", async () => {
  const repo = await createAdapterRepo({
    currentContext: currentContextBriefCreated097(),
    roadmap: roadmapActive097("Stage 1: brief_created")
  });
  await writeBriefCreatedWorkItem(repo, "BANDIT-097");

  const result = await runBandit(repo, ["work-execute", "--json"]);

  assert.equal(result.code, 1);
  const payload = JSON.parse(result.stderr);
  assert.equal(payload.kind, "bandit_work_execute_result");
  assert.equal(payload.delegate, "work_item_pm_execute_controller");
  assert.equal(payload.status, "blocked");
  assert.equal(payload.work_item, "BANDIT-097");
  assert.match(payload.blocker, /formation_approved/i);
  assert.equal(payload.required_operator_input, "none_required");
  assert.equal(payload.next_safe_command, "bandit work-create");
  assert.equal(await pathExists(repo, "docs/work/BANDIT-098/brief.md"), false);
});

test("work-execute adapter reports the plan-mode gate before RED evidence", async () => {
  const repo = await createAdapterRepo({
    currentContext: currentContextActive097(),
    roadmap: roadmapActive097()
  });
  await writeFormedWorkItem(repo, "BANDIT-097");

  const result = await runBandit(repo, ["work-execute", "--json"]);

  assert.equal(result.code, 1);
  const payload = JSON.parse(result.stderr);
  assert.equal(payload.kind, "bandit_work_execute_result");
  assert.equal(payload.delegate, "work_item_pm_execute_controller");
  assert.equal(payload.status, "blocked");
  assert.equal(payload.work_item, "BANDIT-097");
  assert.equal(payload.stage_reached, "Stage 1: formation_approved");
  assert.equal(payload.blocker, "missing_plan_mode");
  assert.deepEqual(payload.evidence_required, [
    "docs/work/BANDIT-097/orchestration-plan.md",
    "docs/work/BANDIT-097/coordination-log.jsonl"
  ]);
  assert.equal(payload.next_safe_command, "node ./bin/bandit.mjs work-item-pm start BANDIT-097");
  assert.equal(await pathExists(repo, "docs/work/BANDIT-098/brief.md"), false);
});

test("work-execute adapter delegates to the Stage 2 route after plan-mode evidence", async () => {
  const repo = await createAdapterRepo({
    currentContext: currentContextOrchestrationRecorded097(),
    roadmap: roadmapActive097("Stage 1: orchestration_plan_recorded")
  });
  await writeFormedWorkItem(repo, "BANDIT-097", {
    orchestrationPlan: true,
    orchestrationRecorded: true
  });

  const result = await runBandit(repo, ["work-execute", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.kind, "bandit_work_execute_result");
  assert.equal(payload.delegate, "work_item_pm_execute_controller");
  assert.equal(payload.status, "ready");
  assert.equal(payload.work_item, "BANDIT-097");
  assert.equal(payload.stage_reached, "Stage 2: ready_for_red");
  assert.equal(payload.required_operator_input, "none_required");
  assert.equal(payload.route.stage, "stage_2_red");
  assert.equal(payload.route.authority_role, "test_writer");
  assert.equal(payload.canonical_state_owner, "repo_native_artifacts");
  assert.equal(payload.role_input_packet.authority, "derived_non_canonical");
  assert.equal(payload.next_safe_command, "bandit work-execute");
});

test("operator adapters keep command separation and do not expose public context command", async () => {
  const repo = await createAdapterRepo();

  const nested = await runBandit(repo, ["work", "create"]);
  assert.equal(nested.code, 1);
  assert.match(nested.stderr, /Unknown command: work/i);

  const context = await runBandit(repo, ["context", "stage_2_red"]);
  assert.equal(context.code, 1);
  assert.match(context.stderr, /Unknown command: context/i);
});

async function createAdapterRepo(options = {}) {
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
    "# Decomposition\n\nPRD-005.4 - Operator Command Adapters.\n"
  );
  await writeJson(repo, ".bandit/work-intake-ledger.json", { version: 1, entries: [] });
  await writeClosedWorkItem(repo, "BANDIT-096", "Work Item PM Execute Controller And Route Registry");

  return repo;
}

async function writeClosedWorkItem(repo, id, title) {
  await writeArtifact(repo, `docs/work/${id}/brief.md`, `# ${id}: ${title}\n\nwork_type: slice\n`);
  await writeArtifact(repo, `docs/work/${id}/landing-action.md`, "# Landing Action\n\ncommit_sha: fixture\n");
  await writeArtifact(repo, `docs/work/${id}/retrospective.md`, "# Retrospective\n\nClosed.\n");
  await writeArtifact(repo, `docs/work/${id}/improvement-disposition.md`, "# Improvement Disposition\n\nNo action.\n");
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
      next_action: "Repo PM should create PRD-005.4 Operator Command Adapters.",
      accountable_actor: "repo_pm",
      accepted_block: null
    })}\n`
  );
}

async function writeBriefCreatedWorkItem(repo, id) {
  await writeArtifact(repo, `docs/work/${id}/brief.md`, formationReadyBrief(id));
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
    })}\n`
  );
}

async function writeFormedWorkItem(repo, id, options = {}) {
  await writeBriefCreatedWorkItem(repo, id);
  await writeFormationReview(repo, `docs/work/${id}/qwen-formation-review.md`, "pass", "no_findings");
  await writeFormationReview(repo, `docs/work/${id}/coderabbit-formation-review.md`, "pass", "no_findings");
  await writeFormationReview(repo, `docs/work/${id}/formation-review.md`, "pass", "no_findings");

  let log = await readFile(path.join(repo, `docs/work/${id}/coordination-log.jsonl`), "utf8");
  log += `${JSON.stringify({
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
  })}\n`;

  if (options.orchestrationPlan) {
    await writeArtifact(
      repo,
      `docs/work/${id}/orchestration-plan.md`,
      `# ${id} Orchestration Plan\n\n## Current Repo State\n\nFixture.\n\n## Stage Sequence\n\nFixture.\n\n## Required Evidence\n\nFixture.\n\n## Role Boundaries\n\nFixture.\n\n## Verification Commands\n\nFixture.\n\n## Known Blockers\n\nNone.\n\n## Stop Conditions\n\nFixture.\n\n## Forbidden Actions\n\nFixture.\n`
    );
  }

  if (options.orchestrationRecorded) {
    log += `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: id,
      sequence: 3,
      timestamp: "2026-06-10T00:02:00Z",
      actor: "work_item_pm",
      source: "fixture",
      state: "orchestration_plan_recorded",
      evidence: [`docs/work/${id}/orchestration-plan.md`],
      safe_triggers: ["red_evidence_required"],
      next_action: null,
      accountable_actor: null,
      accepted_block: null
    })}\n`;
  }

  await writeArtifact(repo, `docs/work/${id}/coordination-log.jsonl`, log);
}

async function writeFormationReview(repo, relativePath, verdict, findingsStatus) {
  await writeArtifact(
    repo,
    relativePath,
    `# Formation Review\n\nverdict: ${verdict}\nfindings_status: ${findingsStatus}\nfindings_disposition: no_action_required\n`
  );
}

async function writeSourceSpec(repo, id, spec = validSliceSpec()) {
  await writeJson(repo, `docs/specs/${id}.json`, spec);
}

function validSliceSpec() {
  return {
    kind: "slice",
    title: "Operator Command Adapters",
    status: "Brief Created",
    goal: "Create thin operator command adapters for Bandit work creation and execution.",
    scope: ["Implement PRD-005.4 Operator Command Adapters."],
    out_of_scope: ["Do not start Stage 2 or later evidence from the create adapter."],
    acceptance_criteria: ["Adapters delegate to existing controllers."],
    expected_files: ["docs/work/<ID>/brief.md", "docs/work/<ID>/coordination-log.jsonl"],
    required_evidence: ["docs/work/<ID>/brief.md", "docs/work/<ID>/coordination-log.jsonl"],
    operator_input_status: "none_required",
    test_plan: ["Run focused adapter tests."],
    clean_code_read_evidence: "CLEAN_CODE.md read before slice formation.",
    stage_rubric_checklist: ["Stage 1: Work-Item Brief And Spec | pass | Fixture spec."],
    bootstrap_gaps: ["No bootstrap gap blocks this fixture."],
    first_implementation_order: ["Create adapter wrappers."],
    smell_triggers: ["Hidden scheduler behavior is blocked."],
    stage_capability_scope: {
      policy: ".bandit/policy/stage-capability-scope.json",
      stages: ["Stage 1"],
      authority_roles: ["repo_pm"],
      required_skills: ["bandit"],
      forbidden_actions: ["red-evidence", "implementation", "landing"]
    }
  };
}

function formationReadyBrief(id) {
  return `# ${id}: Operator Command Adapters\n\nwork_type: slice\n\n## Operator Input Status\n\nnone_required.\n\n## Role Boundary Evidence\n\nTest Writer owns RED. Implementation Writer owns source only.\n`;
}

function interstitialCurrentContextFixture() {
  return `# Current Context\n\n## Status\n\n**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.\n\n\`BANDIT-096\` is the last closed work item.\n\nNo active work item is currently formed.\n\nThe current stage is Stage 6: closed.\n\n**Current next action:** Repo PM should create PRD-005.4 Operator Command Adapters after BANDIT-096 closeout.\n\n## Required Operator Input\n\nnone_required.\n`;
}

function interstitialRoadmapFixture() {
  return `# Roadmap\n\n**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.\n\n## Last Closed Work Item\n\n- \`[Slice]\` \`BANDIT-096\` - Work Item PM Execute Controller And Route Registry (closed)\n\n**Current next step:** Repo PM should create PRD-005.4 Operator Command Adapters after BANDIT-096 closeout.\n\n## Next Work Item\n\n- \`[Slice]\` \`TBD\` - PRD-005.4 Operator Command Adapters,\n  pending \`BANDIT-096\` landing and closeout.\n`;
}

function currentContextActive097() {
  return `# Current Context\n\n## Status\n\n**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.\n\n\`BANDIT-096\` is the last closed work item.\n\n**Active work item:** \`BANDIT-097\` - Operator Command Adapters.\n\nThe current stage is Stage 1: formation_approved.\n\n**Current next action:** Work Item PM should record plan-mode orchestration for BANDIT-097 before RED evidence.\n\n## Required Operator Input\n\nnone_required.\n`;
}

function currentContextBriefCreated097() {
  return currentContextActive097().replace("formation_approved", "brief_created");
}

function currentContextOrchestrationRecorded097() {
  return currentContextActive097().replace(
    "formation_approved",
    "orchestration_plan_recorded"
  );
}

function roadmapActive097(stage = "Stage 1: formation_approved") {
  return `# Roadmap\n\n**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.\n\n## Last Closed Work Item\n\n- \`[Slice]\` \`BANDIT-096\` - Work Item PM Execute Controller And Route Registry (closed)\n\n## Current Work Item\n\n- \`[Slice]\` \`BANDIT-097\` - Operator Command Adapters\n  (${stage})\n\n**Current next step:** Work Item PM should record plan-mode orchestration for BANDIT-097 before RED evidence.\n`;
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
