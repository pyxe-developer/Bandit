import assert from "node:assert/strict";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const currentNextAction =
  "Write Stage 2 RED evidence for BANDIT-048 - Focused Session Context Packets.";
const interstitialNextAction =
  "Create the queued bootstrap-gap work item for " +
  "BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY before Worktree " +
  "Bootstrap Contract work or unrelated Phase 8 work.";
const historyMarker = "OLD-CLOSEOUT-DETAIL-SHOULD-STAY-BEHIND-POINTER";

test("session-context current --json emits a focused non-canonical packet with source links", async () => {
  const repo = await createFocusedSessionRepo();
  const eventsBefore = await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8");

  const result = await runBandit(repo, ["session-context", "current", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const packet = JSON.parse(result.stdout);
  assert.equal(packet.kind, "focused_session_context_packet");
  assert.equal(packet.authority, "derived_non_canonical");
  assert.equal(packet.current_phase.value, "Phase 8 - Workflow Cockpit kickoff");
  assert.equal(packet.current_phase.source, "docs/roadmap/CURRENT_CONTEXT.md");
  assert.equal(packet.active_work_item.id, "BANDIT-048");
  assert.equal(packet.active_bootstrap_gap.id, "BANDIT-GAP-FOCUSED-SESSION-CONTEXT");
  assert.equal(packet.current_stage.value, "Stage 2: Test Design And RED Evidence");
  assert.equal(packet.exact_next_action.value, currentNextAction);
  assert.equal(packet.required_operator_input.value, "none_required");
  assert.deepEqual(packet.stale_or_missing_evidence, []);

  const sourcePaths = packet.source_artifacts.map((entry) => entry.path);
  for (const sourcePath of [
    "AGENTS.md",
    "CLEAN_CODE.md",
    "docs/roadmap/CURRENT_CONTEXT.md",
    "docs/roadmap/ROADMAP.md",
    "docs/verification/STAGE_RUBRICS.md",
    ".bandit/bootstrap-gaps.json",
    ".bandit/policy/smell-triggers.json",
    "docs/evaluation/skills/bandit-cold-start.md"
  ]) {
    assert.ok(sourcePaths.includes(sourcePath), `missing source ${sourcePath}`);
  }

  assert.deepEqual(
    packet.source_hierarchy.slice(0, 4).map((entry) => entry.source),
    [
      "AGENTS.md",
      "docs/roadmap/CURRENT_CONTEXT.md",
      "docs/roadmap/ROADMAP.md",
      ".bandit/bootstrap-gaps.json"
    ]
  );

  const evidencePaths = packet.required_evidence_paths.map((entry) => entry.path);
  assert.ok(evidencePaths.includes("docs/work/BANDIT-048/brief.md"));
  assert.ok(evidencePaths.includes("docs/work/BANDIT-048/red-evidence.md"));
  assert.ok(!evidencePaths.includes("docs/work/BANDIT-049/brief.md"));

  assert.match(packet.allowed_actions.join("\n"), /write Stage 2 RED evidence/i);
  assert.match(packet.forbidden_actions.join("\n"), /Stage 3 implementation/i);
  assert.match(packet.forbidden_actions.join("\n"), /Worktree Bootstrap Contract/i);
  assert.match(packet.forbidden_actions.join("\n"), /cockpit UI\/server\/API/i);

  const activeGap = packet.blockers.find(
    (blocker) => blocker.id === "BANDIT-GAP-FOCUSED-SESSION-CONTEXT"
  );
  assert.equal(activeGap.status, "active_chore");
  assert.equal(activeGap.source, ".bandit/bootstrap-gaps.json");

  assert.equal(
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8"),
    eventsBefore
  );
  await assertMissing(repo, ".bandit/session-context/current.json");
  await assertMissing(repo, "docs/session-context/current.md");
});

test("session-context current --markdown renders from the same focused packet model", async () => {
  const repo = await createFocusedSessionRepo();

  const jsonResult = await runBandit(repo, ["session-context", "current", "--json"]);
  const markdownResult = await runBandit(repo, [
    "session-context",
    "current",
    "--markdown"
  ]);

  assert.equal(jsonResult.code, 0, jsonResult.stderr);
  assert.equal(markdownResult.code, 0, markdownResult.stderr);
  const packet = JSON.parse(jsonResult.stdout);
  assert.match(markdownResult.stdout, /^# Focused Session Context Packet$/m);
  assert.match(markdownResult.stdout, /derived_non_canonical/);
  assert.match(markdownResult.stdout, new RegExp(packet.active_work_item.id));
  assert.match(markdownResult.stdout, /docs\/roadmap\/CURRENT_CONTEXT\.md/);
  assert.match(markdownResult.stdout, /docs\/work\/BANDIT-048\/red-evidence\.md/);
  assert.doesNotMatch(markdownResult.stdout, new RegExp(historyMarker));
});

test("session-context keeps historical roadmap narrative behind deep-read pointers", async () => {
  const repo = await createFocusedSessionRepo();

  const result = await runBandit(repo, ["session-context", "current", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const packet = JSON.parse(result.stdout);
  const packetText = JSON.stringify(packet);
  assert.doesNotMatch(packetText, new RegExp(historyMarker));

  const deepReadSources = packet.deep_read_pointers.map((pointer) => pointer.source);
  assert.ok(deepReadSources.includes("CONTEXT.md"));
  assert.ok(deepReadSources.includes("docs/roadmap/ROADMAP.md"));
  assert.ok(deepReadSources.includes("docs/roadmap/CURRENT_CONTEXT.md"));
  assert.match(
    packet.deep_read_pointers.map((pointer) => pointer.reason).join("\n"),
    /historical roadmap narrative|full glossary text|old closeout details/
  );
});

test("session-context recovers closed-work/no-active-gap interstitial state", async () => {
  const repo = await createInterstitialSessionRepo();

  const result = await runBandit(repo, ["session-context", "current", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const packet = JSON.parse(result.stdout);
  assert.equal(packet.kind, "focused_session_context_packet");
  assert.equal(packet.authority, "derived_non_canonical");
  assert.equal(packet.current_phase.value, "Phase 8 - Workflow Cockpit kickoff");
  assert.equal(packet.active_work_item, null);
  assert.equal(packet.active_bootstrap_gap, null);
  assert.equal(packet.last_closed_work_item.id, "BANDIT-048");
  assert.equal(
    packet.last_closed_work_item.source,
    "docs/work/BANDIT-048/retrospective.md"
  );
  assert.equal(
    packet.next_queued_bootstrap_gap.id,
    "BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY"
  );
  assert.equal(packet.next_queued_bootstrap_gap.status, "open");
  assert.equal(packet.next_queued_bootstrap_gap.disposition, "queued_chore");
  assert.equal(
    packet.current_stage.value,
    "Interstitial: Work-item creation required"
  );
  assert.equal(packet.exact_next_action.value, interstitialNextAction);
  assert.equal(packet.required_operator_input.value, "none_required");

  const evidencePaths = packet.required_evidence_paths.map((entry) => entry.path);
  assert.ok(evidencePaths.includes("docs/work/BANDIT-049/brief.md"));
  assert.ok(evidencePaths.includes("docs/work/BANDIT-049/red-evidence.md"));
  assert.ok(evidencePaths.includes("docs/work/BANDIT-049/retrospective.md"));

  assert.match(
    packet.allowed_actions.join("\n"),
    /Create the queued bootstrap-gap work item/i
  );
  assert.match(packet.forbidden_actions.join("\n"), /Worktree Bootstrap Contract/i);
  assert.match(packet.forbidden_actions.join("\n"), /unrelated Phase 8 work/i);
});

test("session-context fails closed for missing or contradictory current-state authority", async (t) => {
  await t.test("missing AGENTS authority source", async () => {
    const repo = await createFocusedSessionRepo({ omitAgents: true });

    const result = await runBandit(repo, ["session-context", "current", "--json"]);

    assert.equal(result.code, 1);
    assert.match(
      result.stderr,
      /Missing session context source artifact: AGENTS\.md/
    );
  });

  await t.test("CURRENT_CONTEXT and ROADMAP next-action disagreement", async () => {
    const repo = await createFocusedSessionRepo({
      roadmapNextAction: "Start the Worktree Bootstrap Contract chore."
    });

    const result = await runBandit(repo, ["session-context", "current", "--json"]);

    assert.equal(result.code, 1);
    assert.match(
      result.stderr,
      /Session context blocked: CURRENT_CONTEXT\.md and ROADMAP\.md disagree on next action/
    );
  });

  await t.test("interstitial next-action disagreement", async () => {
    const repo = await createInterstitialSessionRepo({
      roadmapNextAction: "Start the Worktree Bootstrap Contract chore."
    });

    const result = await runBandit(repo, ["session-context", "current", "--json"]);

    assert.equal(result.code, 1);
    assert.match(
      result.stderr,
      /Session context blocked: CURRENT_CONTEXT\.md and ROADMAP\.md disagree on next action/
    );
  });
});

test("cold-start evaluation packet exercises focused session context recovery", async () => {
  const evaluationPacket = await readFile(
    path.join(repoRoot, "docs/evaluation/skills/bandit-cold-start.md"),
    "utf8"
  );

  assert.match(evaluationPacket, /Focused Session Context Packet/);
  assert.match(evaluationPacket, /bandit session-context current --json/);
  assert.match(evaluationPacket, /source-pointer deep reads/);
  assert.match(evaluationPacket, /without reading full roadmap history/);
});

async function createFocusedSessionRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeFocusedSessionSources(repo, options);
  await writeWorkBrief(repo, "BANDIT-048", "Focused Session Context Packets", "Brief Created");

  if (options.omitAgents) {
    await rm(path.join(repo, "AGENTS.md"), { force: true });
  }

  return repo;
}

async function createInterstitialSessionRepo(options = {}) {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeInterstitialSessionSources(repo, options);
  await writeWorkBrief(
    repo,
    "BANDIT-048",
    "Focused Session Context Packets",
    "Closed"
  );
  await writeArtifact(
    repo,
    "docs/work/BANDIT-048/landing-action.md",
    "# BANDIT-048 Landing Action\n\ncommit_sha: abc123\n"
  );
  await writeArtifact(
    repo,
    "docs/work/BANDIT-048/retrospective.md",
    "# BANDIT-048 Retrospective\n\nClosed out focused session context.\n"
  );

  return repo;
}

async function writeFocusedSessionSources(repo, options) {
  await writeArtifact(
    repo,
    "AGENTS.md",
    `# AGENTS.md

Codex is the PM and engineering manager.
Ask the operator only for product direction, UAT, policy, business tradeoffs,
explicit cost or risk overrides, and genuinely ambiguous scope.
`
  );
  await writeArtifact(
    repo,
    "CONTEXT.md",
    `# Context

Focused Session Context Packet:
A CLI-derived task-scoped working packet with role rules, active work, current
stage, exact next action, allowed and forbidden actions, blocker state,
required evidence paths, and source hierarchy for one activation.

Full glossary text stays here for deep reads.
`
  );
  await writeArtifact(repo, "CLEAN_CODE.md", "# Clean Code\n\nRead before every slice.\n");
  await writeArtifact(
    repo,
    "docs/plans/BOOTSTRAP_METHODOLOGY.md",
    "# Bootstrap Methodology\n\nEvery slice must land before the next begins.\n"
  );
  await writeArtifact(
    repo,
    "docs/verification/STAGE_RUBRICS.md",
    "# Stage Rubrics\n\n## Stage 2: Test Design And RED Evidence\n\nTests express the spec before production implementation.\n"
  );
  await writeArtifact(
    repo,
    "docs/evaluation/skills/bandit-cold-start.md",
    "# Bandit Skill Cold-Start Evaluation Packet\n\nUse the focused packet and source pointers.\n"
  );
  await writeArtifact(
    repo,
    ".bandit/policy/smell-triggers.json",
    `${JSON.stringify({ version: 1, triggers: [] }, null, 2)}\n`
  );
  await writeArtifact(
    repo,
    ".bandit/bootstrap-gaps.json",
    `${JSON.stringify(
      {
        version: 1,
        gaps: [
          {
            id: "BANDIT-GAP-FOCUSED-SESSION-CONTEXT",
            title: "Cold starts lack focused session context packets",
            status: "active",
            disposition: "active_chore",
            source_work_item: "GRILL-WITH-DOCS-2026-05-28",
            linked_work_item: "BANDIT-048",
            source_artifacts: [
              "CONTEXT.md",
              "docs/evaluation/skills/bandit-cold-start.md",
              "docs/roadmap/CURRENT_CONTEXT.md",
              "docs/roadmap/ROADMAP.md",
              ".bandit/policy/smell-triggers.json"
            ],
            rationale: "Cold starts need compact current-session packets.",
            next_action: "Complete active chore BANDIT-048."
          },
          {
            id: "BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT",
            title: "Worktree bootstrap contract missing",
            status: "open",
            disposition: "queued_chore",
            source_work_item: "STRATEGIC-REVIEW-2026-05-26",
            linked_work_item: null,
            source_artifacts: ["CONTEXT.md"],
            rationale: "Queued behind focused session context.",
            next_action:
              "After BANDIT-GAP-FOCUSED-SESSION-CONTEXT is resolved, create a bootstrap-gap chore."
          }
        ]
      },
      null,
      2
    )}\n`
  );

  const roadmapNextAction = options.roadmapNextAction ?? currentNextAction;
  await writeArtifact(repo, "docs/roadmap/CURRENT_CONTEXT.md", currentContextFixture());
  await writeArtifact(repo, "docs/roadmap/ROADMAP.md", roadmapFixture(roadmapNextAction));
}

async function writeInterstitialSessionSources(repo, options) {
  await writeArtifact(
    repo,
    "AGENTS.md",
    `# AGENTS.md

Codex is the PM and engineering manager.
Ask the operator only for product direction, UAT, policy, business tradeoffs,
explicit cost or risk overrides, and genuinely ambiguous scope.
`
  );
  await writeArtifact(
    repo,
    "CONTEXT.md",
    `# Context

Focused Session Context Packet:
A CLI-derived task-scoped working packet with role rules, current or last-closed
work, next queued bootstrap gap, exact next action, allowed and forbidden
actions, blocker state, required evidence paths, and source hierarchy.
`
  );
  await writeArtifact(repo, "CLEAN_CODE.md", "# Clean Code\n\nRead before every slice.\n");
  await writeArtifact(
    repo,
    "docs/plans/BOOTSTRAP_METHODOLOGY.md",
    "# Bootstrap Methodology\n\nEvery slice must land before the next begins.\n"
  );
  await writeArtifact(
    repo,
    "docs/verification/STAGE_RUBRICS.md",
    "# Stage Rubrics\n\n## Stage 0: Context Readiness\n\nRepo artifacts answer what is next.\n"
  );
  await writeArtifact(
    repo,
    "docs/evaluation/skills/bandit-cold-start.md",
    "# Bandit Skill Cold-Start Evaluation Packet\n\nUse the Focused Session Context Packet and source-pointer deep reads.\n"
  );
  await writeArtifact(
    repo,
    ".bandit/policy/smell-triggers.json",
    `${JSON.stringify({ version: 1, triggers: [] }, null, 2)}\n`
  );
  await writeArtifact(
    repo,
    ".bandit/bootstrap-gaps.json",
    `${JSON.stringify(
      {
        version: 1,
        gaps: [
          {
            id: "BANDIT-GAP-FOCUSED-SESSION-CONTEXT",
            title: "Cold starts lack focused session context packets",
            status: "resolved",
            disposition: "resolved",
            source_work_item: "GRILL-WITH-DOCS-2026-05-28",
            linked_work_item: "BANDIT-048",
            source_artifacts: ["CONTEXT.md"],
            rationale: "BANDIT-048 resolved focused session context.",
            verification_target: "docs/work/BANDIT-048/retrospective.md",
            next_action: "Use bandit session-context current --json for cold starts."
          },
          {
            id: "BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY",
            title: "Focused session context fails between closed work item and next active gap",
            status: "open",
            disposition: "queued_chore",
            source_work_item: "BANDIT-048",
            linked_work_item: null,
            source_artifacts: [
              "docs/work/BANDIT-048/retrospective.md",
              "docs/roadmap/CURRENT_CONTEXT.md",
              "docs/roadmap/ROADMAP.md",
              ".bandit/bootstrap-gaps.json"
            ],
            rationale: "Closed-work interstitial state needs focused recovery.",
            verification_target: null,
            next_action: "Create a bootstrap-gap chore for interstitial recovery."
          },
          {
            id: "BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT",
            title: "Bandit-created worktrees lack a runnable environment bootstrap contract",
            status: "open",
            disposition: "queued_chore",
            source_work_item: "STRATEGIC-REVIEW-2026-05-26",
            linked_work_item: null,
            source_artifacts: ["CONTEXT.md"],
            rationale: "Queued behind session-context interstitial recovery.",
            verification_target: null,
            next_action:
              "After BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY is resolved, create the Worktree Bootstrap Contract chore."
          }
        ]
      },
      null,
      2
    )}\n`
  );

  const roadmapNextAction = options.roadmapNextAction ?? interstitialNextAction;
  await writeArtifact(
    repo,
    "docs/roadmap/CURRENT_CONTEXT.md",
    interstitialCurrentContextFixture()
  );
  await writeArtifact(
    repo,
    "docs/roadmap/ROADMAP.md",
    interstitialRoadmapFixture(roadmapNextAction)
  );
}

function currentContextFixture() {
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

**Current next action:** ${currentNextAction}

\`BANDIT-048\` - Focused Session Context Packets is active as the bootstrap-gap
chore for \`BANDIT-GAP-FOCUSED-SESSION-CONTEXT\`. Stage 2 RED evidence is the
next required gate.

${historyMarker}

## Active Work

**Active work item:** \`BANDIT-048\` - Focused Session Context Packets.

The current stage is Stage 2: Test Design And RED Evidence. Do not start Stage
3 implementation, Worktree Bootstrap Contract work, cockpit UI/server/API work,
or unrelated Phase 8 work before RED evidence is recorded.

## Required Operator Input

No operator-owned input is required for the next recorded action.
`;
}

function interstitialCurrentContextFixture() {
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

**Current next action:** ${interstitialNextAction}

\`BANDIT-048\` - Focused Session Context Packets is landed and closed out.
\`BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY\` is the next queued
bootstrap gap and has no active work item yet.

## Last Closed Work

**Last closed work item:** \`BANDIT-048\` - Focused Session Context Packets.

The current stage is Interstitial: Work-item creation required. The focused
packet must not report \`BANDIT-048\` as active or runnable.

## Active Work

**Active work item:** none.

No active work item is currently open. Do not start Worktree Bootstrap Contract
work, scheduler execution, worktree lifecycle implementation, cockpit
UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior,
product UAT scope, or unrelated Phase 8 work before the interstitial recovery
work item is created and its Stage 2 RED evidence is recorded.

## Required Operator Input

No operator-owned input is required for the next recorded action.
`;
}

function roadmapFixture(nextAction) {
  return `# Bandit Roadmap

## Current Position

**Current phase:** Phase 8 - Workflow Cockpit kickoff.

**Current next step:** ${nextAction}

\`BANDIT-048\` - Focused Session Context Packets is active as the bootstrap-gap
chore for \`BANDIT-GAP-FOCUSED-SESSION-CONTEXT\`. Stage 2 RED evidence is the
next required gate.
`;
}

function interstitialRoadmapFixture(nextAction) {
  return `# Bandit Roadmap

## Current Position

**Current phase:** Phase 8 - Workflow Cockpit kickoff.

**Current next step:** ${nextAction}

\`BANDIT-048\` - Focused Session Context Packets is landed and closed out.
\`BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY\` is the next queued
bootstrap gap and has no active work item yet.
`;
}

async function writeArtifact(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function assertMissing(repo, relativePath) {
  try {
    await access(path.join(repo, relativePath));
    assert.fail(`expected ${relativePath} to be absent`);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}
