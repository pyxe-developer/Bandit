import assert from "node:assert/strict";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

test("cockpit status derives a non-canonical workflow snapshot with source links", async () => {
  const repo = await createCockpitRepo();

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.equal(status.kind, "workflow_cockpit_status");
  assert.equal(status.authority, "derived_non_canonical");
  assert.equal(status.current_phase.value, "Phase 8 - Workflow Cockpit kickoff");
  assert.equal(status.current_phase.source, "docs/roadmap/CURRENT_CONTEXT.md");
  assert.equal(status.active_work_item.id, "BANDIT-031");
  assert.equal(status.active_work_item.source, "docs/work/BANDIT-031/brief.md");
  assert.equal(status.next_action.value, "Implement the read-only cockpit status foundation.");
  assert.equal(status.next_action.source, "docs/roadmap/CURRENT_CONTEXT.md");
  assert.equal(status.required_operator_input.value, "none_required");
  assert.deepEqual(status.blockers, []);
  await assertNoHiddenCockpitState(repo);
});

test("cockpit status reports bootstrap gaps, gates, improvements, and coordination with sources", async () => {
  const repo = await createCockpitRepo({
    bootstrapGaps: [
      {
        id: "BANDIT-GAP-ACTOR-IDENTITY-POLICY",
        status: "open",
        disposition: "queued",
        linked_work_item: null,
        source_artifacts: ["docs/work/BANDIT-028/qwen-finding-disposition.md"],
        rationale: "Actor identity policy is a queued hardening candidate.",
        next_action: "Create a future policy work item when scoped."
      }
    ]
  });

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.deepEqual(status.bootstrap_gaps, {
    status: "open",
    source: ".bandit/bootstrap-gaps.json",
    gaps: [
      {
        id: "BANDIT-GAP-ACTOR-IDENTITY-POLICY",
        status: "open",
        next_action: "Create a future policy work item when scoped.",
        source_artifacts: ["docs/work/BANDIT-028/qwen-finding-disposition.md"]
      }
    ]
  });
  assert.deepEqual(status.gates.stage_2_red_evidence, {
    status: "pass",
    source: "docs/work/BANDIT-031/red-evidence.md"
  });
  assert.deepEqual(status.landing_readiness, {
    status: "not_ready",
    reason: "implementation evidence is not recorded",
    source: "docs/work/BANDIT-031/implementation-evidence.md"
  });
  assert.deepEqual(status.uat, {
    status: "not_applicable",
    source: "docs/work/BANDIT-031/brief.md"
  });
  assert.deepEqual(status.improvement_health, {
    status: "pending_candidates",
    source: "docs/work/BANDIT-028/qwen-finding-disposition.md",
    sources: ["docs/work/BANDIT-028/qwen-finding-disposition.md"],
    candidates: ["BANDIT-028-ACTOR-IDENTITY-VALIDATION"]
  });
  assert.deepEqual(status.coordination, {
    current_state: "red_evidence_recorded",
    next_action: "Implement the read-only cockpit status foundation",
    source: "docs/work/BANDIT-031/coordination-log.jsonl"
  });
});

test("cockpit status aggregates improvement candidates from disposition artifacts", async () => {
  const repo = await createCockpitRepo();
  await writeArtifact(
    repo,
    "docs/work/BANDIT-029/qwen-finding-disposition.md",
    improvementFixture({
      title: "BANDIT-029 Local Qwen Finding Disposition",
      candidate: "BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING"
    })
  );

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.deepEqual(status.improvement_health, {
    status: "pending_candidates",
    source: "docs/work/BANDIT-028/qwen-finding-disposition.md, docs/work/BANDIT-029/qwen-finding-disposition.md",
    sources: [
      "docs/work/BANDIT-028/qwen-finding-disposition.md",
      "docs/work/BANDIT-029/qwen-finding-disposition.md"
    ],
    candidates: [
      "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
      "BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING"
    ]
  });
});

test("cockpit status fails closed when required current context is missing", async () => {
  const repo = await createCockpitRepo({ omitCurrentContext: true });

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing cockpit source artifact: docs\/roadmap\/CURRENT_CONTEXT\.md/);
});

test("cockpit status fails closed when current context and roadmap disagree", async () => {
  const repo = await createCockpitRepo({
    roadmapNextAction: "Record Stage 2 RED evidence for BANDIT-031."
  });

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Cockpit status blocked: CURRENT_CONTEXT\.md and ROADMAP\.md disagree on next action/
  );
});

test("cockpit status fails closed when active work evidence is contradictory", async () => {
  const repo = await createCockpitRepo({ workStatus: "Closed" });

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Cockpit status blocked: active work item BANDIT-031 is marked closed/
  );
});

test("cockpit status does not create hidden cockpit authority state", async () => {
  const repo = await createCockpitRepo();
  const eventsBefore = await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8");

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  assert.equal(
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8"),
    eventsBefore
  );
  await assertNoHiddenCockpitState(repo);
});

async function createCockpitRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  if (!options.omitCurrentContext) {
    await writeArtifact(repo, "docs/roadmap/CURRENT_CONTEXT.md", currentContextFixture());
  }
  await writeArtifact(
    repo,
    "docs/roadmap/ROADMAP.md",
    roadmapFixture({
      nextAction:
        options.roadmapNextAction ?? "Implement the read-only cockpit status foundation."
    })
  );
  await writeWorkBrief(
    repo,
    "BANDIT-031",
    "Workflow Cockpit Status Foundation",
    options.workStatus ?? "RED Evidence Recorded"
  );
  await writeArtifact(repo, "docs/work/BANDIT-031/red-evidence.md", "# RED Evidence\n");
  await writeArtifact(repo, "docs/work/BANDIT-028/qwen-finding-disposition.md", improvementFixture());
  await writeArtifact(
    repo,
    "docs/work/BANDIT-031/coordination-log.jsonl",
    `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: "BANDIT-031",
      sequence: 1,
      timestamp: "2026-05-26T07:00:00.000Z",
      actor: "codex_pm",
      source: "test",
      state: "red_evidence_recorded",
      accountable_actor: "Writer",
      next_action: "Implement the read-only cockpit status foundation",
      evidence: ["docs/work/BANDIT-031/red-evidence.md"],
      safe_triggers: ["implementation_allowed"]
    })}\n`
  );
  await writeArtifact(
    repo,
    ".bandit/bootstrap-gaps.json",
    `${JSON.stringify({ gaps: options.bootstrapGaps ?? [] }, null, 2)}\n`
  );
  return repo;
}

function currentContextFixture() {
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

**Current next action:** Implement the read-only cockpit status foundation.

## Active Work

**Active work item:** \`BANDIT-031\` - Workflow Cockpit Status Foundation.
Current stage: Stage 3 implementation.

## Required Operator Input

No operator-owned input is required to implement the read-only cockpit status foundation.
`;
}

function roadmapFixture({ nextAction }) {
  return `# Bandit Roadmap

## Current Position

**Current phase:** Phase 8 - Workflow Cockpit kickoff.

**Current next step:** ${nextAction}
`;
}

function improvementFixture({
  title = "BANDIT-028 Local Qwen Finding Disposition",
  candidate = "BANDIT-028-ACTOR-IDENTITY-VALIDATION"
} = {}) {
  return `# ${title}

## Durable Chore Candidate

### Chore Candidate: \`${candidate}\`

source_work_item: BANDIT-028
source_artifacts:
  - docs/work/BANDIT-028/local-qwen-review.md
  - docs/work/BANDIT-028/qwen-finding-disposition.md
hypothesis: Defining actor identity syntax will reduce ambiguous coordination-event authorship.
metric: future_stage4_review_repeats_invalid_actor_validation
baseline: BANDIT-028 accepts non-empty actor strings without a canonical actor identity policy.
expected_direction: decrease
evaluation_window: when actor identity policy work is next touched
status: queued_candidate
outcome: pending
`;
}

async function writeArtifact(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function assertNoHiddenCockpitState(repo) {
  const hiddenStateFiles = [
    ".bandit/cockpit-status.json",
    ".bandit/cockpit-index.sqlite",
    ".bandit/cockpit-cache.json",
    "docs/workflow-cockpit-status.json"
  ];

  for (const hiddenState of hiddenStateFiles) {
    await assert.rejects(access(path.join(repo, hiddenState)));
  }
}
