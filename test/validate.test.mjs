import assert from "node:assert/strict";
import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("validate passes for freshly initialized repo-native state", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Bandit state is valid/);
});

test("validate fails closed when config is missing", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await rm(path.join(repo, ".bandit/config.toml"));

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required state: \.bandit\/config\.toml/);
});

test("validate fails closed when config is malformed", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeFile(path.join(repo, ".bandit/config.toml"), "not valid\n");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed config/);
  assert.match(result.stderr, /state_version = 1/);
  assert.match(result.stderr, /work_item_prefix = "BANDIT"/);
});

test("validate fails closed when event log is missing", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await rm(path.join(repo, ".bandit/events.jsonl"));

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required state: \.bandit\/events\.jsonl/);
});

test("validate fails closed when event log contains malformed JSONL", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeFile(path.join(repo, ".bandit/events.jsonl"), "{not-json}\n");

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed event log at line 1/);
});
