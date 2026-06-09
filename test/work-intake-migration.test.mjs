import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("work-intake list reports deterministic queue order without claim authority", async () => {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit"), { recursive: true });
  await writeFile(
    path.join(repo, ".bandit/work-intake-ledger.json"),
    `${JSON.stringify(ledgerForListing(), null, 2)}\n`,
    "utf8"
  );

  const result = await runBandit(repo, ["work-intake", "list", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "pass");
  assert.deepEqual(
    report.entries.map((entry) => entry.id),
    [
      "WIL-UI-POLISH",
      "WIL-CLAIM-FIRST",
      "WIL-REPO-WIDE-TRANSITION-INDEX",
      "WIL-COORDINATION-PRIMITIVE",
      "WIL-PR-CICD-LANDING",
      "WIL-INSTALLED-COPY-UPDATE",
      "WIL-B022-HEARTBEAT-NEXT-ACTION-TOKENS",
      "WIL-B022-UAT-APPROVAL-TOKENS",
      "WIL-V0-TRIAL"
    ]
  );
  assert.deepEqual(
    report.entries.map((entry) => [
      entry.id,
      entry.suggested_work_item_type,
      entry.intake_outcome,
      entry.claimable
    ]),
    [
      ["WIL-UI-POLISH", "slice", "accepted_to_queue", false],
      ["WIL-CLAIM-FIRST", "gap", "accepted_to_queue", false],
      ["WIL-REPO-WIDE-TRANSITION-INDEX", "gap", "accepted_to_queue", false],
      ["WIL-COORDINATION-PRIMITIVE", "gap", "accepted_to_queue", false],
      ["WIL-PR-CICD-LANDING", "gap", "accepted_to_queue", false],
      ["WIL-INSTALLED-COPY-UPDATE", "gap", "accepted_to_queue", false],
      [
        "WIL-B022-HEARTBEAT-NEXT-ACTION-TOKENS",
        "gap",
        "queued_candidate",
        false
      ],
      ["WIL-B022-UAT-APPROVAL-TOKENS", "gap", "queued_candidate", false],
      ["WIL-V0-TRIAL", "slice", "deferred", false]
    ]
  );
  assert.equal(report.next_formation_candidate.id, "WIL-UI-POLISH");
  assert.equal(
    report.next_formation_candidate.title,
    "Bandit Cockpit UI Polish From Attached Design"
  );
  assert.equal(report.deferred_context[0].id, "WIL-V0-TRIAL");
  assert.equal(report.read_only.no_work_item_allocation, true);
});

test("work-intake rejects mutation actions outside Repo PM or triage authority", async () => {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit"), { recursive: true });
  await writeFile(
    path.join(repo, ".bandit/work-intake-ledger.json"),
    `${JSON.stringify(ledgerForListing(), null, 2)}\n`,
    "utf8"
  );

  const result = await runBandit(repo, [
    "work-intake",
    "accept",
    "WIL-UI-POLISH",
    "--actor",
    "work_item_pm"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /work-intake mutation is limited to Repo PM Coordinator or future Work Intake Triage Skill/
  );
  assert.match(result.stderr, /does not allocate Work Item IDs/);
});

function ledgerForListing() {
  const ids = [
    ["WIL-UI-POLISH", "Bandit Cockpit UI Polish From Attached Design", "slice"],
    ["WIL-CLAIM-FIRST", "Claim-First Transition Policy Triage", "gap"],
    [
      "WIL-REPO-WIDE-TRANSITION-INDEX",
      "Repo-Wide Transition Index Decision",
      "gap"
    ],
    [
      "WIL-COORDINATION-PRIMITIVE",
      "Coordination Primitive Completion Triage",
      "gap"
    ],
    ["WIL-PR-CICD-LANDING", "PR And CI/CD Landing Workflow Policy", "gap"],
    ["WIL-INSTALLED-COPY-UPDATE", "Installed-Copy Update Path", "gap"]
  ];
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
      no_claim_authority: true,
      no_work_item_allocation: true,
      no_scheduler_authority: true,
      no_browser_mutation_authority: true
    },
    entries: [
      ...ids.map(([id, title, kind]) => ({
        id,
        title,
        source_artifacts: [
          id === "WIL-UI-POLISH"
            ? "docs/design/workflow-cockpit/bandit-ui-polish-source.md"
            : "FOLLOWUPS.md"
        ],
        source_anchor: title,
        origin_date: "2026-06-09",
        rationale: "Imported from current follow-up source metadata.",
        suggested_work_item_type: kind,
        depends_on: [],
        scope_summary: `${title} remains a proposal until Repo PM formation.`,
        risk_product_scope_status: "proposal only",
        intake_outcome: "accepted_to_queue",
        claimable: false,
        transition_history: [transition]
      })),
      {
        id: "WIL-B022-HEARTBEAT-NEXT-ACTION-TOKENS",
        title: "Heartbeat Next-Action Token Mapping",
        source_work_item: "BANDIT-022",
        source_artifacts: ["docs/work/BANDIT-022/follow-up-chores.md"],
        lesson: "Use explicit action tokens for next-action normalization.",
        hypothesis: "Reviewer noise decreases.",
        metric: "No repeated ambiguous mapping finding.",
        baseline: "BANDIT-022 had a non-blocking finding.",
        evaluation_window: "Next heartbeat parser touch.",
        current_status: "queued_candidate",
        outcome: "pending",
        source_anchor: "Heartbeat Next-Action Token Mapping",
        origin_date: "2026-05-25",
        rationale: "Legacy follow-up candidate preserved.",
        suggested_work_item_type: "gap",
        depends_on: [],
        scope_summary: "Legacy follow-up candidate.",
        risk_product_scope_status: "candidate only",
        intake_outcome: "queued_candidate",
        claimable: false,
        transition_history: [{ ...transition, to: "queued_candidate" }]
      },
      {
        id: "WIL-B022-UAT-APPROVAL-TOKENS",
        title: "Explicit UAT Approval Tokens",
        source_work_item: "BANDIT-022",
        source_artifacts: ["docs/work/BANDIT-022/follow-up-chores.md"],
        lesson: "Use explicit UAT approval tokens.",
        hypothesis: "Reviewer noise decreases.",
        metric: "No repeated broad UAT parsing finding.",
        baseline: "BANDIT-022 had a non-blocking finding.",
        evaluation_window: "Next UAT parser touch.",
        current_status: "queued_candidate",
        outcome: "pending",
        source_anchor: "Explicit UAT Approval Tokens",
        origin_date: "2026-05-25",
        rationale: "Legacy follow-up candidate preserved.",
        suggested_work_item_type: "gap",
        depends_on: [],
        scope_summary: "Legacy follow-up candidate.",
        risk_product_scope_status: "candidate only",
        intake_outcome: "queued_candidate",
        claimable: false,
        transition_history: [{ ...transition, to: "queued_candidate" }]
      },
      {
        id: "WIL-V0-TRIAL",
        title: "V0 Closeout Claude Code A/B Product-Value Trial",
        source_artifacts: ["docs/roadmap/ROADMAP.md"],
        source_anchor: "V0 Closeout Claude Code A/B Product-Value Trial",
        origin_date: "2026-06-09",
        rationale: "Deferred behind pre-Claude-bakeoff intake.",
        suggested_work_item_type: "slice",
        depends_on: ids.map(([id]) => id),
        scope_summary: "Deferred trial context.",
        risk_product_scope_status: "deferred product slice",
        intake_outcome: "deferred",
        claimable: false,
        transition_history: [{ ...transition, to: "deferred" }]
      }
    ]
  };
}
