import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const ledgerPath = ".bandit/work-intake-ledger.json";

test("work-intake validate accepts a source-preserving non-claimable ledger", async () => {
  const repo = await createWorkIntakeRepo();
  await writeCompleteLedger(repo);
  await writeLiveStateSentinels(repo);
  const before = await readLiveStateSentinels(repo);

  const first = await runBandit(repo, ["work-intake", "validate", "--json"]);
  const second = await runBandit(repo, ["work-intake", "validate", "--json"]);
  const after = await readLiveStateSentinels(repo);

  assert.equal(first.code, 0, first.stderr);
  assert.equal(second.code, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);
  assert.deepEqual(after, before);

  const report = JSON.parse(first.stdout);
  assert.equal(report.status, "pass");
  assert.equal(report.ledger, ledgerPath);
  assert.equal(report.entries.length, 9);
  assert.equal(report.read_only.no_claim_authority, true);
  assert.equal(report.read_only.no_work_item_allocation, true);
  assert.equal(report.read_only.no_scheduler_authority, true);
  assert.equal(report.read_only.no_browser_mutation_authority, true);
  assert.equal(report.policy_versions["work-intake-ledger"], 1);

  const uiPolish = report.entries.find(
    (entry) => entry.id === "WIL-UI-POLISH"
  );
  assert.equal(uiPolish.title, "Bandit Cockpit UI Polish From Attached Design");
  assert.equal(uiPolish.intake_outcome, "accepted_to_queue");
  assert.equal(uiPolish.suggested_work_item_type, "slice");
  assert.equal(uiPolish.claimable, false);
  assert.deepEqual(uiPolish.source_artifacts, [
    "FOLLOWUPS.md",
    "docs/design/workflow-cockpit/bandit-ui-polish-source.md"
  ]);

  const v0Trial = report.entries.find((entry) => entry.id === "WIL-V0-TRIAL");
  assert.equal(v0Trial.intake_outcome, "deferred");
  assert.equal(v0Trial.claimable, false);
  assert.deepEqual(v0Trial.depends_on, [
    "WIL-UI-POLISH",
    "WIL-CLAIM-FIRST",
    "WIL-REPO-WIDE-TRANSITION-INDEX",
    "WIL-COORDINATION-PRIMITIVE",
    "WIL-PR-CICD-LANDING",
    "WIL-INSTALLED-COPY-UPDATE"
  ]);
});

test("work-intake validate fails closed for missing metadata and claimable proposals", async () => {
  const repo = await createWorkIntakeRepo({
    followupsDeprecated: true
  });
  const ledger = completeLedger();
  ledger.entries = [
    {
      ...ledger.entries.find((entry) => entry.id === "WIL-UI-POLISH"),
      source_artifacts: ["FOLLOWUPS.md"],
      risk_product_scope_status: "",
      transition_history: []
    },
    {
      ...ledger.entries.find((entry) => entry.id === "WIL-CLAIM-FIRST"),
      intake_outcome: "",
      claimable: true
    }
  ];
  await writeJson(repo, ledgerPath, ledger);

  const result = await runBandit(repo, ["work-intake", "validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing preserved source artifact: WIL-UI-POLISH/);
  assert.match(result.stderr, /missing risk product scope status: WIL-UI-POLISH/);
  assert.match(result.stderr, /missing transition history: WIL-UI-POLISH/);
  assert.match(result.stderr, /missing intake outcome: WIL-CLAIM-FIRST/);
  assert.match(result.stderr, /proposal must not be claimable: WIL-CLAIM-FIRST/);
  assert.match(
    result.stderr,
    /FOLLOWUPS\.md is deprecated but open entry is not valid in work intake ledger: Repo-Wide Transition Index Decision/
  );
});

async function createWorkIntakeRepo(options = {}) {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit"), { recursive: true });
  await mkdir(path.join(repo, "docs/design/workflow-cockpit"), {
    recursive: true
  });
  await mkdir(path.join(repo, "docs/work/BANDIT-022"), { recursive: true });
  await mkdir(path.join(repo, "docs/roadmap"), { recursive: true });

  await writeFile(
    path.join(repo, "FOLLOWUPS.md"),
    followupsFixture(options.followupsDeprecated === true),
    "utf8"
  );
  await writeFile(
    path.join(repo, "docs/design/workflow-cockpit/bandit-ui-polish-source.md"),
    `# Bandit Cockpit UI Polish Source

## Source

- Operator request date: 2026-06-09.
- Attached package: \`/Users/matthewflebbe/Downloads/Bandit Cockpit.zip\`.
`,
    "utf8"
  );
  await writeFile(
    path.join(repo, "docs/work/BANDIT-022/follow-up-chores.md"),
    bandit022FollowupsFixture(),
    "utf8"
  );
  await writeFile(
    path.join(repo, "docs/roadmap/ROADMAP.md"),
    `# Roadmap

## Planned Work

- \`[Slice]\` \`TBD\` - Bandit Cockpit UI Polish From Attached Design
- \`[Slice]\` \`TBD\` - V0 Closeout Claude Code A/B Product-Value Trial
`,
    "utf8"
  );

  return repo;
}

async function writeCompleteLedger(repo) {
  await writeJson(repo, ledgerPath, completeLedger());
}

function completeLedger() {
  const transition = {
    at: "2026-06-09T10:45:27Z",
    actor: "repo_pm",
    from: "source_metadata",
    to: "accepted_to_queue",
    source: "BANDIT-082 migration"
  };

  return {
    version: 1,
    authority: {
      source: "repo_native_work_intake_ledger",
      allowed_mutators: ["repo_pm", "future_work_intake_triage_skill"],
      read_only_consumers: [
        "work_item_pm",
        "implementation_writer",
        "reviewer",
        "retrospective",
        "browser_cockpit",
        "tests"
      ],
      no_claim_authority: true,
      no_work_item_allocation: true,
      no_scheduler_authority: true,
      no_browser_mutation_authority: true
    },
    entries: [
      followupEntry("WIL-UI-POLISH", {
        title: "Bandit Cockpit UI Polish From Attached Design",
        source_anchor: "Add Bandit UI Polish From Attached Design",
        suggested_work_item_type: "slice",
        source_artifacts: [
          "FOLLOWUPS.md",
          "docs/design/workflow-cockpit/bandit-ui-polish-source.md"
        ],
        transition_history: [transition]
      }),
      followupEntry("WIL-CLAIM-FIRST", {
        title: "Claim-First Transition Policy Triage",
        source_anchor: "Revisit Claim Requirement After Bootstrap",
        suggested_work_item_type: "gap",
        transition_history: [transition]
      }),
      followupEntry("WIL-REPO-WIDE-TRANSITION-INDEX", {
        title: "Repo-Wide Transition Index Decision",
        source_anchor: "Consider Repo-Wide Transition Index",
        suggested_work_item_type: "gap",
        transition_history: [transition]
      }),
      followupEntry("WIL-COORDINATION-PRIMITIVE", {
        title: "Coordination Primitive Completion Triage",
        source_anchor: "Schedule Coordination Primitive Implementation",
        suggested_work_item_type: "gap",
        transition_history: [transition]
      }),
      followupEntry("WIL-PR-CICD-LANDING", {
        title: "PR And CI/CD Landing Workflow Policy",
        source_anchor: "Move From Local Main Landing To PR And CI/CD Workflow",
        suggested_work_item_type: "gap",
        transition_history: [transition]
      }),
      followupEntry("WIL-INSTALLED-COPY-UPDATE", {
        title: "Installed-Copy Update Path",
        source_anchor: "Push Bandit Updates To Installed Copies",
        suggested_work_item_type: "gap",
        transition_history: [transition]
      }),
      legacyEntry("WIL-B022-HEARTBEAT-NEXT-ACTION-TOKENS", {
        title: "Heartbeat Next-Action Token Mapping",
        lesson:
          "Heartbeat bootstrap-gap next-action normalization should eventually use explicit action tokens instead of regex matching.",
        metric:
          "Future Local Qwen or aggregate Stage 4 reviews do not repeat the ambiguous next-action mapping finding for heartbeat inspection.",
        transition_history: [
          {
            ...transition,
            to: "queued_candidate",
            source: "BANDIT-022 follow-up migration"
          }
        ]
      }),
      legacyEntry("WIL-B022-UAT-APPROVAL-TOKENS", {
        title: "Explicit UAT Approval Tokens",
        lesson:
          "Heartbeat feature-slice UAT parsing can make approved states explicit instead of using a broad includes approved check.",
        metric:
          "Future Local Qwen or aggregate Stage 4 reviews do not repeat the broad UAT approval parsing finding for heartbeat inspection.",
        transition_history: [
          {
            ...transition,
            to: "queued_candidate",
            source: "BANDIT-022 follow-up migration"
          }
        ]
      }),
      {
        id: "WIL-V0-TRIAL",
        title: "V0 Closeout Claude Code A/B Product-Value Trial",
        source_artifacts: ["docs/roadmap/ROADMAP.md"],
        source_anchor: "V0 Closeout Claude Code A/B Product-Value Trial",
        origin_date: "2026-06-09",
        rationale:
          "Keep the product-value trial deferred behind the pre-Claude-bakeoff follow-up and UI-polish lane.",
        suggested_work_item_type: "slice",
        depends_on: [
          "WIL-UI-POLISH",
          "WIL-CLAIM-FIRST",
          "WIL-REPO-WIDE-TRANSITION-INDEX",
          "WIL-COORDINATION-PRIMITIVE",
          "WIL-PR-CICD-LANDING",
          "WIL-INSTALLED-COPY-UPDATE"
        ],
        scope_summary:
          "Compare the same PRD in Bandit and no-Bandit repos after pre-Claude-bakeoff intake is cleared.",
        risk_product_scope_status:
          "product slice deferred; requires normal future formation and operator-owned product scope if repo artifacts are insufficient",
        intake_outcome: "deferred",
        claimable: false,
        transition_history: [
          {
            ...transition,
            to: "deferred",
            source: "BANDIT-082 migration"
          }
        ]
      }
    ]
  };
}

function followupEntry(id, overrides) {
  return {
    id,
    title: overrides.title,
    source_artifacts: overrides.source_artifacts ?? ["FOLLOWUPS.md"],
    source_anchor: overrides.source_anchor,
    origin_date: "2026-06-09",
    rationale:
      "Migrate existing FOLLOWUPS.md source metadata into the repo-native intake lane before Claude bakeoff work.",
    suggested_work_item_type: overrides.suggested_work_item_type,
    depends_on: [],
    scope_summary: `${overrides.title} remains a proposal until Repo PM forms a work item.`,
    risk_product_scope_status:
      "proposal only; not claimable, not executable, and requires normal future formation",
    intake_outcome: "accepted_to_queue",
    claimable: false,
    transition_history: overrides.transition_history
  };
}

function legacyEntry(id, overrides) {
  return {
    id,
    title: overrides.title,
    source_work_item: "BANDIT-022",
    source_artifacts: [
      "docs/work/BANDIT-022/local-qwen-review.md",
      "docs/work/BANDIT-022/review-evidence.md",
      "docs/work/BANDIT-022/follow-up-chores.md"
    ],
    lesson: overrides.lesson,
    hypothesis:
      "Explicit token mapping will reduce future reviewer concern while preserving fail-closed behavior.",
    metric: overrides.metric,
    baseline:
      "BANDIT-022 landed with safe fallback behavior but Local Qwen requested stricter parsing as non-blocking hardening.",
    evaluation_window:
      "Evaluate when heartbeat parsing or UAT status parsing is next touched.",
    current_status: "queued_candidate",
    outcome: "pending",
    source_anchor: overrides.title,
    origin_date: "2026-05-25",
    rationale: "Preserve non-blocking legacy follow-up candidate metadata.",
    suggested_work_item_type: "gap",
    depends_on: [],
    scope_summary: `${overrides.title} remains a legacy follow-up candidate.`,
    risk_product_scope_status:
      "legacy hardening candidate; not claimable, not executable, and requires future triage",
    intake_outcome: "queued_candidate",
    claimable: false,
    transition_history: overrides.transition_history
  };
}

async function writeLiveStateSentinels(repo) {
  await writeFile(path.join(repo, ".bandit/live-state-sentinel"), "unchanged\n");
}

async function readLiveStateSentinels(repo) {
  return readFile(path.join(repo, ".bandit/live-state-sentinel"), "utf8");
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function followupsFixture(deprecated) {
  const status = deprecated
    ? "This file is deprecated source metadata after Work Intake Ledger migration."
    : "This file remains source metadata until the Work Intake Ledger migration validates that every entry has an intake outcome.";

  return `# Followups

## Triage Status

${status}

## Open

### Add Bandit UI Polish From Attached Design

- **Origin:** Operator request on 2026-06-09 with attached package \`/Users/matthewflebbe/Downloads/Bandit Cockpit.zip\`.
- **Source note:** \`docs/design/workflow-cockpit/bandit-ui-polish-source.md\`.

### Revisit Claim Requirement After Bootstrap

- **Origin:** Coordination primitive design discussion on 2026-05-24.

### Consider Repo-Wide Transition Index

- **Origin:** Coordination primitive design discussion on 2026-05-24.

### Schedule Coordination Primitive Implementation

- **Origin:** Coordination primitive design discussion on 2026-05-24.

### Move From Local Main Landing To PR And CI/CD Workflow

- **Origin:** GitHub remote setup and workflow discussion on 2026-05-24.

### Push Bandit Updates To Installed Copies

- **Origin:** Post-bootstrap parallel workstreams and global PM heartbeat skill discussion on 2026-05-25.
`;
}

function bandit022FollowupsFixture() {
  return `# BANDIT-022 Follow-Up Chore Candidates

## Chore Candidate: Heartbeat Next-Action Token Mapping

source_work_item: BANDIT-022
lesson: Heartbeat bootstrap-gap next-action normalization should eventually use explicit action tokens instead of regex matching.
hypothesis: Explicit action-token mapping will reduce repeated reviewer concern about ambiguous text parsing while preserving the current safe fallback to inspection.
metric: Future Local Qwen or aggregate Stage 4 reviews do not repeat the ambiguous next-action mapping finding for heartbeat inspection.
baseline: BANDIT-022 lands with safe ambiguous fallback behavior, but Local Qwen still requested stricter enum-style mapping as non-blocking hardening.
evaluation_window: Evaluate when heartbeat policy or bootstrap-gap next-action parsing is next touched.
status: queued_candidate
outcome: pending

## Chore Candidate: Explicit UAT Approval Tokens

source_work_item: BANDIT-022
lesson: Heartbeat feature-slice UAT parsing can make approved states explicit instead of using a broad includes approved check.
hypothesis: Explicit approved-state tokens will reduce future reviewer concern about status semantics while preserving fail-closed behavior for unknown or unapproved UAT states.
metric: Future Local Qwen or aggregate Stage 4 reviews do not repeat the broad UAT approval parsing finding for heartbeat inspection.
baseline: BANDIT-022 lands with fail-closed UAT behavior, but Local Qwen still requested explicit approved statuses as non-blocking hardening.
evaluation_window: Evaluate when heartbeat feature-slice eligibility or UAT status parsing is next touched.
status: queued_candidate
outcome: pending
`;
}
