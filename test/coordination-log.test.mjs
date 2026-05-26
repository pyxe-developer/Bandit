import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit
} from "./helpers/bandit-cli.mjs";

test("coordination validate accepts append-only step transitions with evidence references", async () => {
  const repo = await createCoordinationRepo();
  await writeEvidence(repo, "BANDIT-001", "red-evidence.md");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"],
      safe_triggers: ["red_evidence_required"]
    }),
    stepTransition({
      sequence: 2,
      state: "red_recorded",
      evidence: ["docs/work/BANDIT-001/red-evidence.md"],
      safe_triggers: ["implementation_allowed"]
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Coordination log is valid: BANDIT-001/);
});

test("coordination validate accepts feature UAT typed extension with current CLI evidence", async () => {
  const repo = await createCoordinationRepo("slice");
  for (const evidence of [
    "red-evidence.md",
    "implementation-evidence.md",
    "review-evidence.md",
    "landing-verdict.md"
  ]) {
    await writeEvidence(repo, "BANDIT-001", evidence);
  }
  await writeUatApproval(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({ sequence: 2, state: "red_recorded", evidence: ["docs/work/BANDIT-001/red-evidence.md"] }),
    stepTransition({ sequence: 3, state: "implementation_recorded", evidence: ["docs/work/BANDIT-001/implementation-evidence.md"] }),
    stepTransition({ sequence: 4, state: "review_recorded", evidence: ["docs/work/BANDIT-001/review-evidence.md"] }),
    stepTransition({
      sequence: 5,
      state: "feature_uat_approved",
      accountable_actor: "Landing Agent",
      next_action: "Record landing verdict",
      evidence: ["docs/work/BANDIT-001/uat-approval.md"],
      safe_triggers: ["landing_verdict_allowed"]
    }),
    stepTransition({
      sequence: 6,
      state: "landing_verdict_recorded",
      evidence: ["docs/work/BANDIT-001/landing-verdict.md"]
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 0, result.stderr);
});

test("coordination validate fails closed for missing, stale, or wrong-kind feature UAT extension evidence", async () => {
  const missingEvidenceRepo = await createCoordinationRepo("slice");
  await writeEvidence(missingEvidenceRepo, "BANDIT-001", "review-evidence.md");
  await writeCoordinationLog(missingEvidenceRepo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({ sequence: 2, state: "review_recorded", evidence: ["docs/work/BANDIT-001/review-evidence.md"] }),
    stepTransition({
      sequence: 3,
      state: "feature_uat_approved",
      evidence: ["docs/work/BANDIT-001/review-evidence.md"]
    })
  ]);

  const missingEvidenceResult = await runBandit(missingEvidenceRepo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(missingEvidenceResult.code, 1);
  assert.match(
    missingEvidenceResult.stderr,
    /feature_uat_approved requires current UAT evidence: docs\/work\/BANDIT-001\/uat-approval\.md/
  );

  const staleEvidenceRepo = await createCoordinationRepo("slice");
  await writeEvidence(staleEvidenceRepo, "BANDIT-001", "review-evidence.md");
  await writeUatApproval(staleEvidenceRepo, "BANDIT-001", {
    source_drift_status: "stale"
  });
  await writeCoordinationLog(staleEvidenceRepo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({ sequence: 2, state: "review_recorded", evidence: ["docs/work/BANDIT-001/review-evidence.md"] }),
    stepTransition({
      sequence: 3,
      state: "feature_uat_approved",
      evidence: ["docs/work/BANDIT-001/uat-approval.md"]
    })
  ]);

  const staleEvidenceResult = await runBandit(staleEvidenceRepo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(staleEvidenceResult.code, 1);
  assert.match(staleEvidenceResult.stderr, /feature_uat_approved requires current UAT evidence/);

  const wrongKindRepo = await createCoordinationRepo("chore");
  await writeUatApproval(wrongKindRepo, "BANDIT-001");
  await writeCoordinationLog(wrongKindRepo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({
      sequence: 2,
      state: "feature_uat_approved",
      evidence: ["docs/work/BANDIT-001/uat-approval.md"]
    })
  ]);

  const wrongKindResult = await runBandit(wrongKindRepo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(wrongKindResult.code, 1);
  assert.match(wrongKindResult.stderr, /feature_uat_approved requires work_type slice/);
});

test("coordination validate accepts chore disposition typed extension after landing", async () => {
  const repo = await createCoordinationRepo("improvement_chore");
  for (const evidence of [
    "red-evidence.md",
    "implementation-evidence.md",
    "review-evidence.md",
    "landing-verdict.md",
    "landing-action.md",
    "retrospective.md"
  ]) {
    await writeEvidence(repo, "BANDIT-001", evidence);
  }
  await writeChoreDisposition(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({ sequence: 2, state: "red_recorded", evidence: ["docs/work/BANDIT-001/red-evidence.md"] }),
    stepTransition({ sequence: 3, state: "implementation_recorded", evidence: ["docs/work/BANDIT-001/implementation-evidence.md"] }),
    stepTransition({ sequence: 4, state: "review_recorded", evidence: ["docs/work/BANDIT-001/review-evidence.md"] }),
    stepTransition({ sequence: 5, state: "landing_verdict_recorded", evidence: ["docs/work/BANDIT-001/landing-verdict.md"] }),
    stepTransition({ sequence: 6, state: "landed", evidence: ["docs/work/BANDIT-001/landing-action.md"] }),
    stepTransition({
      sequence: 7,
      state: "chore_disposition_recorded",
      accountable_actor: "Codex PM",
      next_action: "Record retrospective",
      evidence: ["docs/work/BANDIT-001/chore-disposition.md"],
      safe_triggers: ["retrospective_allowed"]
    }),
    stepTransition({ sequence: 8, state: "retrospective_recorded", evidence: ["docs/work/BANDIT-001/retrospective.md"] })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 0, result.stderr);
});

test("coordination validate fails closed for out-of-order or wrong-kind chore disposition extensions", async () => {
  const outOfOrderRepo = await createCoordinationRepo("chore");
  await writeChoreDisposition(outOfOrderRepo, "BANDIT-001");
  await writeCoordinationLog(outOfOrderRepo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({
      sequence: 2,
      state: "chore_disposition_recorded",
      evidence: ["docs/work/BANDIT-001/chore-disposition.md"]
    })
  ]);

  const outOfOrderResult = await runBandit(outOfOrderRepo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(outOfOrderResult.code, 1);
  assert.match(outOfOrderResult.stderr, /chore_disposition_recorded must follow landed/);

  const wrongKindRepo = await createCoordinationRepo("slice");
  await writeChoreDisposition(wrongKindRepo, "BANDIT-001");
  await writeCoordinationLog(wrongKindRepo, "BANDIT-001", [
    stepTransition({ state: "brief_created", evidence: ["docs/work/BANDIT-001/brief.md"] }),
    stepTransition({
      sequence: 2,
      state: "chore_disposition_recorded",
      evidence: ["docs/work/BANDIT-001/chore-disposition.md"]
    })
  ]);

  const wrongKindResult = await runBandit(wrongKindRepo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(wrongKindResult.code, 1);
  assert.match(
    wrongKindResult.stderr,
    /chore_disposition_recorded requires work_type chore or improvement_chore/
  );
});

test("coordination validate fails closed for malformed JSONL", async () => {
  const repo = await createCoordinationRepo();
  await writeRawCoordinationLog(repo, "BANDIT-001", "{not-json}\n");

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed coordination log at line 1/);
});

test("coordination validate fails closed for unknown event types", async () => {
  const repo = await createCoordinationRepo();
  await writeCoordinationLog(repo, "BANDIT-001", [
    {
      version: 1,
      event_type: "automation_trigger",
      work_item: "BANDIT-001",
      sequence: 1,
      timestamp: "2026-05-25T12:00:00.000Z",
      actor: "codex_pm",
      source: "test"
    }
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unknown coordination event type: automation_trigger/);
});

test("coordination validate fails closed for invalid states and illegal regressions", async () => {
  const repo = await createCoordinationRepo();
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({ state: "brief_created" }),
    stepTransition({ sequence: 2, state: "implementation_recorded" }),
    stepTransition({ sequence: 3, state: "red_recorded" })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Illegal coordination state regression: implementation_recorded -> red_recorded/);
});

test("coordination validate fails closed when step transition evidence is missing", async () => {
  const repo = await createCoordinationRepo();
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/missing-brief.md"]
    })
  ]);

  const result = await runBandit(repo, [
    "coordination",
    "validate",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing coordination evidence reference: docs\/work\/BANDIT-001\/missing-brief\.md/);
});

test("coordination event appends one validated actor event for each supported action", async () => {
  const repo = await createCoordinationRepo();
  await writeEvidence(repo, "BANDIT-001", "red-evidence.md");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      accountable_actor: "Test Writer",
      next_action: "Write RED evidence"
    })
  ]);

  const commands = [
    [
      "claim",
      "--actor",
      "codex_pm",
      "--source",
      "codex automation",
      "--summary",
      "Claim Stage 2 RED evidence"
    ],
    [
      "handoff",
      "--actor",
      "codex_pm",
      "--source",
      "codex automation",
      "--summary",
      "RED tests are ready for Writer",
      "--target-actor",
      "Writer"
    ],
    [
      "block",
      "--actor",
      "codex_pm",
      "--source",
      "codex automation",
      "--summary",
      "Waiting for operator budget approval",
      "--blocked-owner",
      "operator",
      "--resume-condition",
      "Budget approval recorded in work item evidence"
    ],
    [
      "complete",
      "--actor",
      "Writer",
      "--source",
      "codex automation",
      "--summary",
      "RED evidence recorded",
      "--evidence",
      "docs/work/BANDIT-001/red-evidence.md"
    ],
    [
      "repair-request",
      "--actor",
      "Reviewer",
      "--source",
      "codex automation",
      "--summary",
      "Repair missing refusal path",
      "--repair-scope",
      "coordination event validation"
    ],
    [
      "resume",
      "--actor",
      "codex_pm",
      "--source",
      "codex automation",
      "--summary",
      "Operator budget approval recorded"
    ]
  ];

  for (const [eventType, ...options] of commands) {
    const result = await runBandit(repo, [
      "coordination",
      "event",
      "BANDIT-001",
      eventType,
      ...options
    ]);
    assert.equal(result.code, 0, result.stderr);
    assert.match(
      result.stdout,
      new RegExp(`Recorded actor coordination event: ${eventType} for BANDIT-001`)
    );
  }

  const events = await readCoordinationEvents(repo, "BANDIT-001");
  assert.equal(events.length, 7);
  assert.deepEqual(events.map((event) => event.sequence), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(
    events.slice(1).map((event) => event.actor_event_type),
    ["claim", "handoff", "block", "complete", "repair-request", "resume"]
  );
  assert.equal(events[2].target_actor, "Writer");
  assert.equal(events[3].blocked_owner, "operator");
  assert.equal(
    events[3].resume_condition,
    "Budget approval recorded in work item evidence"
  );
  assert.deepEqual(events[4].evidence, ["docs/work/BANDIT-001/red-evidence.md"]);
  assert.equal(events[5].repair_scope, "coordination event validation");
});

test("coordination event fails closed for action-specific missing fields before writing", async () => {
  const cases = [
    {
      command: [
        "handoff",
        "--actor",
        "codex_pm",
        "--source",
        "test",
        "--summary",
        "handoff"
      ],
      message: /handoff actor event requires --target-actor/
    },
    {
      command: [
        "block",
        "--actor",
        "codex_pm",
        "--source",
        "test",
        "--summary",
        "blocked",
        "--blocked-owner",
        "operator"
      ],
      message: /block actor event requires --blocked-owner and --resume-condition/
    },
    {
      command: [
        "complete",
        "--actor",
        "Writer",
        "--source",
        "test",
        "--summary",
        "complete"
      ],
      message: /complete actor event requires at least one --evidence reference/
    },
    {
      command: [
        "repair-request",
        "--actor",
        "Reviewer",
        "--source",
        "test",
        "--summary",
        "repair"
      ],
      message: /repair-request actor event requires --repair-scope/
    }
  ];

  for (const { command, message } of cases) {
    const repo = await createCoordinationRepo();
    await writeCoordinationLog(repo, "BANDIT-001", [stepTransition()]);
    const before = await readFile(
      path.join(repo, "docs/work/BANDIT-001/coordination-log.jsonl"),
      "utf8"
    );

    const result = await runBandit(repo, [
      "coordination",
      "event",
      "BANDIT-001",
      ...command
    ]);

    assert.equal(result.code, 1);
    assert.match(result.stderr, message);
    assert.equal(
      await readFile(
        path.join(repo, "docs/work/BANDIT-001/coordination-log.jsonl"),
        "utf8"
      ),
      before
    );
  }
});

test("coordination event refuses missing work items, missing logs, malformed logs, and missing evidence before writing", async () => {
  const unknownRepo = await createCoordinationRepo();
  const unknownResult = await runBandit(unknownRepo, [
    "coordination",
    "event",
    "BANDIT-999",
    "claim",
    "--actor",
    "codex_pm",
    "--source",
    "test",
    "--summary",
    "claim"
  ]);
  assert.equal(unknownResult.code, 1);
  assert.match(unknownResult.stderr, /Unknown work item: BANDIT-999/);

  const missingLogRepo = await createCoordinationRepo();
  const missingLogResult = await runBandit(missingLogRepo, [
    "coordination",
    "event",
    "BANDIT-001",
    "claim",
    "--actor",
    "codex_pm",
    "--source",
    "test",
    "--summary",
    "claim"
  ]);
  assert.equal(missingLogResult.code, 1);
  assert.match(
    missingLogResult.stderr,
    /Missing coordination log: docs\/work\/BANDIT-001\/coordination-log\.jsonl/
  );

  const malformedRepo = await createCoordinationRepo();
  await writeRawCoordinationLog(malformedRepo, "BANDIT-001", "{not-json}\n");
  const malformedBefore = await readFile(
    path.join(malformedRepo, "docs/work/BANDIT-001/coordination-log.jsonl"),
    "utf8"
  );
  const malformedResult = await runBandit(malformedRepo, [
    "coordination",
    "event",
    "BANDIT-001",
    "claim",
    "--actor",
    "codex_pm",
    "--source",
    "test",
    "--summary",
    "claim"
  ]);
  assert.equal(malformedResult.code, 1);
  assert.match(malformedResult.stderr, /Malformed coordination log at line 1/);
  assert.equal(
    await readFile(
      path.join(malformedRepo, "docs/work/BANDIT-001/coordination-log.jsonl"),
      "utf8"
    ),
    malformedBefore
  );

  const missingEvidenceRepo = await createCoordinationRepo();
  await writeCoordinationLog(missingEvidenceRepo, "BANDIT-001", [stepTransition()]);
  const evidenceResult = await runBandit(missingEvidenceRepo, [
    "coordination",
    "event",
    "BANDIT-001",
    "complete",
    "--actor",
    "Writer",
    "--source",
    "test",
    "--summary",
    "complete",
    "--evidence",
    "docs/work/BANDIT-001/missing-red-evidence.md"
  ]);
  assert.equal(evidenceResult.code, 1);
  assert.match(
    evidenceResult.stderr,
    /Missing coordination evidence reference: docs\/work\/BANDIT-001\/missing-red-evidence\.md/
  );
  const events = await readCoordinationEvents(missingEvidenceRepo, "BANDIT-001");
  assert.equal(events.length, 1);
});

async function createCoordinationRepo(workType = "slice") {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await mkdir(path.join(repo, "docs/work/BANDIT-001"), { recursive: true });
  await writeFile(
    path.join(repo, "docs/work/BANDIT-001/brief.md"),
    `# BANDIT-001: Coordination Fixture

work_type: ${workType}

## Status

Brief Created

## Goal

Test coordination state validation.
`,
    "utf8"
  );
  return repo;
}

async function writeEvidence(repo, workItem, fileName) {
  await writeFile(
    path.join(repo, "docs/work", workItem, fileName),
    `# ${workItem} ${fileName}\n\nFixture evidence.\n`,
    "utf8"
  );
}

async function writeUatApproval(repo, workItem, overrides = {}) {
  const fields = {
    contract_version: "1",
    work_item: workItem,
    source_head: "fixture-source-head",
    environment: "operator-cli",
    approval_status: "pass",
    approved_by: "operator",
    approved_at: "2026-05-25T12:00:00.000Z",
    source_drift_status: "current",
    notes: "Fixture UAT approval.",
    ...overrides
  };

  await writeFile(
    path.join(repo, "docs/work", workItem, "uat-approval.md"),
    `# UAT Approval: ${workItem}

${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n")}
`,
    "utf8"
  );
}

async function writeChoreDisposition(repo, workItem, overrides = {}) {
  const fields = {
    contract_version: "1",
    work_item: workItem,
    disposition_status: "pass",
    disposition_kind: "no_action",
    rationale: "Fixture disposition proves product UAT is not applicable.",
    improvement_metadata_status: "not_applicable",
    ...overrides
  };

  await writeFile(
    path.join(repo, "docs/work", workItem, "chore-disposition.md"),
    `# Chore Disposition: ${workItem}

${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n")}
`,
    "utf8"
  );
}

async function writeCoordinationLog(repo, workItem, events) {
  await writeRawCoordinationLog(
    repo,
    workItem,
    events.map((event) => JSON.stringify(event)).join("\n") + "\n"
  );
}

async function writeRawCoordinationLog(repo, workItem, contents) {
  const logDir = path.join(repo, "docs/work", workItem);
  await mkdir(logDir, { recursive: true });
  await writeFile(path.join(logDir, "coordination-log.jsonl"), contents, "utf8");
}

async function readCoordinationEvents(repo, workItem) {
  const content = await readFile(
    path.join(repo, "docs/work", workItem, "coordination-log.jsonl"),
    "utf8"
  );
  return content.trim().split("\n").map((line) => JSON.parse(line));
}

function stepTransition(overrides = {}) {
  return {
    version: 1,
    event_type: "step_transition",
    work_item: "BANDIT-001",
    sequence: 1,
    timestamp: "2026-05-25T12:00:00.000Z",
    actor: "codex_pm",
    source: "test",
    state: "brief_created",
    evidence: ["docs/work/BANDIT-001/brief.md"],
    safe_triggers: [],
    ...overrides
  };
}
