import assert from "node:assert/strict";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("init creates repo-native config and lifecycle event log", async () => {
  const repo = await createTempRepo();

  const result = await runBandit(repo, ["init"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Initialized Bandit state/);

  const config = await readFile(path.join(repo, ".bandit/config.toml"), "utf8");
  assert.match(config, /state_version = 1/);
  assert.match(config, /work_item_prefix = "BANDIT"/);

  const eventLines = (
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8")
  ).trim().split("\n");
  assert.equal(eventLines.length, 1);
  assert.deepEqual(JSON.parse(eventLines[0]), {
    type: "repo_initialized",
    work_item: null,
    message: "Initialized Bandit repo-native state"
  });
});

test("init creates starter governance artifacts for day-1 cockpit and session context", async () => {
  const repo = await createTempRepo();

  const init = await runBandit(repo, ["init"]);

  assert.equal(init.code, 0, init.stderr);
  for (const artifact of [
    "AGENTS.md",
    "CONTEXT.md",
    "CLEAN_CODE.md",
    "docs/plans/BOOTSTRAP_METHODOLOGY.md",
    "docs/verification/STAGE_RUBRICS.md",
    "docs/roadmap/CURRENT_CONTEXT.md",
    "docs/roadmap/ROADMAP.md",
    "STATUS.md"
  ]) {
    await assertExists(repo, artifact);
  }

  const validate = await runBandit(repo, ["validate"]);
  assert.equal(validate.code, 0, validate.stderr);

  const cockpit = await runBandit(repo, ["cockpit", "status", "--json"]);
  assert.equal(cockpit.code, 0, cockpit.stderr);
  const cockpitPayload = JSON.parse(cockpit.stdout);
  assert.equal(cockpitPayload.kind, "workflow_cockpit_status");
  assert.equal(cockpitPayload.required_operator_input.value, "none_required");

  const session = await runBandit(repo, [
    "session-context",
    "current",
    "--json"
  ]);
  assert.equal(session.code, 0, session.stderr);
  const sessionPayload = JSON.parse(session.stdout);
  assert.equal(sessionPayload.kind, "focused_session_context_packet");
  assert.equal(sessionPayload.required_operator_input.value, "none_required");
});

test("init preserves existing starter governance artifacts", async () => {
  const repo = await createTempRepo();
  const sentinels = {
    "AGENTS.md": "# Custom Agents\n\nDo not replace.\n",
    "CLEAN_CODE.md": "# Custom Clean Code\n\nDo not replace.\n",
    "docs/roadmap/CURRENT_CONTEXT.md": "# Custom Current Context\n\nDo not replace.\n",
    "STATUS.md": "# Custom Status\n\nDo not replace.\n"
  };

  for (const [relativePath, contents] of Object.entries(sentinels)) {
    await writeRepoFile(repo, relativePath, contents);
  }

  const init = await runBandit(repo, ["init"]);

  assert.equal(init.code, 0, init.stderr);
  for (const [relativePath, contents] of Object.entries(sentinels)) {
    assert.equal(await readFile(path.join(repo, relativePath), "utf8"), contents);
  }
});

test("init is idempotent and appends lifecycle events without overwriting existing events", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);

  const eventsPath = path.join(repo, ".bandit/events.jsonl");
  const sentinelEvent = {
    type: "manual_sentinel",
    work_item: "BANDIT-001",
    message: "keep this event"
  };
  await writeFile(eventsPath, `${JSON.stringify(sentinelEvent)}\n`, {
    flag: "a"
  });

  const result = await runBandit(repo, ["init"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Bandit state already initialized/);

  const eventLines = (await readFile(eventsPath, "utf8")).trim().split("\n");
  assert.equal(eventLines.length, 3);
  assert.deepEqual(JSON.parse(eventLines[1]), sentinelEvent);
  assert.deepEqual(JSON.parse(eventLines[2]), {
    type: "repo_init_skipped",
    work_item: null,
    message: "Bandit repo-native state already existed"
  });
});

async function assertExists(repo, relativePath) {
  await access(path.join(repo, relativePath));
}

async function writeRepoFile(repo, relativePath, contents) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
}
