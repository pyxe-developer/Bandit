import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
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

async function createCoordinationRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeWorkBrief(repo, "BANDIT-001", "Coordination Fixture", "Brief Created");
  return repo;
}

async function writeEvidence(repo, workItem, fileName) {
  await writeFile(
    path.join(repo, "docs/work", workItem, fileName),
    `# ${workItem} ${fileName}\n\nFixture evidence.\n`,
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
