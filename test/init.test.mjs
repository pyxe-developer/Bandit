import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
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
