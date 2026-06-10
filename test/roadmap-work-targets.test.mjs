import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("roadmap work target resolver returns the active formed work item", async () => {
  const repo = await createResolverRepo();

  const result = await runBandit(repo, [
    "roadmap-work-targets",
    "resolve",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.kind, "roadmap_work_target_resolution");
  assert.equal(report.authority, "derived_non_canonical");
  assert.equal(report.target.id, "BANDIT-093");
  assert.equal(report.target.title, "Roadmap Work Target Resolver");
  assert.equal(report.target.work_type, "slice");
  assert.equal(report.target.status, "formation_approved");
  assert.equal(report.target.relationship, "current");
  assert.deepEqual(report.target.source_artifacts, [
    "docs/work/BANDIT-093/brief.md",
    "docs/roadmap/CURRENT_CONTEXT.md",
    "docs/roadmap/ROADMAP.md"
  ]);
  assert.deepEqual(report.target.provenance_pointers, [
    {
      class: "spec",
      id: "BANDIT-093-roadmap-work-target-resolver",
      path: "docs/specs/BANDIT-093-roadmap-work-target-resolver.json"
    },
    {
      class: "prd",
      id: "BANDIT-PRD-005",
      path: "docs/prds/BANDIT-PRD-005-bandit-work-commands.md"
    }
  ]);
  assert.equal(report.reconciliation.status, "pass");
  assert.equal(report.hidden_scheduler_used, false);
});

test("roadmap work target resolver returns a not-yet-formed interstitial target", async () => {
  const repo = await createResolverRepo({
    activeWorkItemId: null,
    currentContext: interstitialCurrentContextFixture(),
    roadmap: interstitialRoadmapFixture()
  });

  const result = await runBandit(repo, [
    "roadmap-work-targets",
    "resolve",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.target.id, "TBD");
  assert.equal(report.target.title, "PRD-005.2 Repo PM Create Controller And Prompt Contract");
  assert.equal(report.target.status, "not_yet_formed");
  assert.equal(report.target.relationship, "next");
  assert.deepEqual(report.target.source_artifacts, ["docs/roadmap/ROADMAP.md"]);
  assert.deepEqual(report.target.provenance_pointers, [
    {
      class: "prd",
      id: "BANDIT-PRD-005.2",
      path: "docs/prds/BANDIT-PRD-005-bandit-work-commands.md"
    }
  ]);
});

test("roadmap work target resolver fails closed on roadmap and current-context disagreement", async () => {
  const repo = await createResolverRepo({
    roadmap: currentRoadmapFixture({
      currentId: "BANDIT-094",
      currentTitle: "Conflicting Target",
      nextAction: "Work Item PM should record plan-mode orchestration for BANDIT-094 before RED evidence."
    })
  });

  const result = await runBandit(repo, [
    "roadmap-work-targets",
    "resolve",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Roadmap work target blocked: CURRENT_CONTEXT\.md and ROADMAP\.md disagree on authorized work target/
  );
});

test("roadmap work target resolver ignores stale historical tail text", async () => {
  const repo = await createResolverRepo({
    currentContext: `${currentContextFixture()}

## Historical Tail

Earlier text said Work Item PM should run Stage 4 review for BANDIT-092. This
historical note must not route execution for closed work.
`
  });

  const result = await runBandit(repo, [
    "roadmap-work-targets",
    "resolve",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.target.id, "BANDIT-093");
  assert.equal(report.target.relationship, "current");
  assert.equal(report.stale_tail_status, "ignored");
});

test("roadmap work target resolver does not use work intake as a hidden scheduler", async () => {
  const repo = await createResolverRepo({
    activeWorkItemId: null,
    currentContext: interstitialCurrentContextFixture({
      nextAction: "Repo PM should inspect the roadmap before selecting future work."
    }),
    roadmap: roadmapWithoutQueueFixture()
  });
  await writeJson(repo, ".bandit/work-intake-ledger.json", workIntakeLedgerFixture());

  const result = await runBandit(repo, [
    "roadmap-work-targets",
    "resolve",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Roadmap work target blocked: ROADMAP\.md does not identify an authorized current or next work target/
  );
  assert.doesNotMatch(result.stderr, /WIL-V0-TRIAL/);
});

test("roadmap work target resolver dereferences WIL provenance only after roadmap authorization", async () => {
  const repo = await createResolverRepo({
    activeWorkItemId: null,
    currentContext: interstitialCurrentContextFixture({
      nextAction: "Repo PM should form the V0 Closeout Claude Code A/B Product-Value Trial after PRD-005 closes."
    }),
    roadmap: interstitialRoadmapFixture({
      title: "V0 Closeout Claude Code A/B Product-Value Trial",
      nextAction: "Repo PM should form the V0 Closeout Claude Code A/B Product-Value Trial after PRD-005 closes."
    })
  });
  await writeJson(repo, ".bandit/work-intake-ledger.json", workIntakeLedgerFixture());

  const result = await runBandit(repo, [
    "roadmap-work-targets",
    "resolve",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.target.id, "TBD");
  assert.equal(report.target.title, "V0 Closeout Claude Code A/B Product-Value Trial");
  assert.equal(report.target.relationship, "next");
  assert.deepEqual(report.target.provenance_pointers, [
    {
      class: "wil",
      id: "WIL-V0-TRIAL",
      path: ".bandit/work-intake-ledger.json"
    }
  ]);
  assert.equal(report.hidden_scheduler_used, false);
});

async function createResolverRepo(options = {}) {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, "docs/roadmap"), { recursive: true });
  await mkdir(path.join(repo, "docs/prds"), { recursive: true });
  await mkdir(path.join(repo, "docs/specs"), { recursive: true });
  await mkdir(path.join(repo, ".bandit"), { recursive: true });

  await writeArtifact(
    repo,
    "docs/roadmap/CURRENT_CONTEXT.md",
    options.currentContext ?? currentContextFixture()
  );
  await writeArtifact(
    repo,
    "docs/roadmap/ROADMAP.md",
    options.roadmap ?? currentRoadmapFixture()
  );
  await writeArtifact(
    repo,
    "docs/prds/BANDIT-PRD-005-bandit-work-commands.md",
    "# BANDIT-PRD-005\n\nRoadmap work commands source PRD.\n"
  );
  await writeJson(
    repo,
    "docs/specs/BANDIT-093-roadmap-work-target-resolver.json",
    {
      id: "BANDIT-093-roadmap-work-target-resolver",
      prd: "BANDIT-PRD-005",
      title: "Roadmap Work Target Resolver"
    }
  );
  await writeJson(repo, ".bandit/work-intake-ledger.json", { version: 1, entries: [] });

  if (options.activeWorkItemId !== null) {
    await writeWorkItem(
      repo,
      options.activeWorkItemId ?? "BANDIT-093",
      options.activeWorkTitle ?? "Roadmap Work Target Resolver"
    );
  }

  return repo;
}

async function writeWorkItem(repo, id, title) {
  await writeArtifact(
    repo,
    `docs/work/${id}/brief.md`,
    `# ${id}: ${title}

## Status

Brief Created

work_type: slice
`
  );
}

function currentContextFixture(options = {}) {
  const nextAction =
    options.nextAction ??
    "Work Item PM should record plan-mode orchestration for BANDIT-093 before RED evidence.";
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

\`BANDIT-092\` is the last closed work item.

**Active work item:** \`BANDIT-093\` - Roadmap Work Target Resolver.

The current stage is Stage 1: formation_approved.

**Current next action:** ${nextAction}
`;
}

function currentRoadmapFixture(options = {}) {
  const currentId = options.currentId ?? "BANDIT-093";
  const currentTitle = options.currentTitle ?? "Roadmap Work Target Resolver";
  const nextAction =
    options.nextAction ??
    "Work Item PM should record plan-mode orchestration for BANDIT-093 before RED evidence.";
  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- \`[Slice]\` \`BANDIT-092\` - Boundary Cell Movement Gate (closed)

## Current Work Item

- \`[Slice]\` \`${currentId}\` - ${currentTitle}
  (Stage 1: formation_approved)

**Current next step:** ${nextAction}

## Next Work Item

- \`[Slice]\` \`TBD\` - PRD-005.2 Repo PM Create Controller And Prompt Contract,
  pending \`BANDIT-093\` landing and closeout.
`;
}

function interstitialCurrentContextFixture(options = {}) {
  const nextAction =
    options.nextAction ??
    "Repo PM should create PRD-005.2 Repo PM Create Controller And Prompt Contract after BANDIT-093 closeout.";
  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

\`BANDIT-093\` is the last closed work item.

No active work item is currently formed.

The current stage is Stage 6: closed.

**Current next action:** ${nextAction}
`;
}

function interstitialRoadmapFixture(options = {}) {
  const title = options.title ?? "PRD-005.2 Repo PM Create Controller And Prompt Contract";
  const nextAction =
    options.nextAction ??
    "Repo PM should create PRD-005.2 Repo PM Create Controller And Prompt Contract after BANDIT-093 closeout.";
  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- \`[Slice]\` \`BANDIT-093\` - Roadmap Work Target Resolver (closed)

**Current next step:** ${nextAction}

## Next Work Item

- \`[Slice]\` \`TBD\` - ${title}
  pending \`BANDIT-093\` landing and closeout.
`;
}

function roadmapWithoutQueueFixture() {
  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

## Last Closed Work Item

- \`[Slice]\` \`BANDIT-093\` - Roadmap Work Target Resolver (closed)

**Current next step:** Repo PM should inspect the roadmap before selecting future work.
`;
}

function workIntakeLedgerFixture() {
  return {
    version: 1,
    entries: [
      {
        id: "WIL-V0-TRIAL",
        title: "V0 Closeout Claude Code A/B Product-Value Trial",
        source_artifacts: ["docs/roadmap/ROADMAP.md"],
        suggested_work_item_type: "slice",
        risk_product_scope_status: "deferred product trial",
        intake_outcome: "deferred",
        claimable: false,
        transition_history: [
          {
            at: "2026-06-10T00:00:00Z",
            actor: "repo_pm",
            from: "source_metadata",
            to: "deferred",
            source: "fixture"
          }
        ]
      }
    ]
  };
}

async function writeArtifact(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function writeJson(repo, relativePath, value) {
  await writeArtifact(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}
