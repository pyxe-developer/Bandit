import assert from "node:assert/strict";
import test from "node:test";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

test("list prints work items in deterministic ID order", async () => {
  const repo = await createTempRepo();
  await writeWorkBrief(repo, "BANDIT-002", "Second Item", "Ready");
  await writeWorkBrief(repo, "BANDIT-001", "First Item", "In Progress");

  const result = await runBandit(repo, ["list"]);

  assert.equal(result.code, 0, result.stderr);
  assert.equal(
    result.stdout,
    "BANDIT-001 | In Progress | First Item\nBANDIT-002 | Ready | Second Item\n"
  );
});

test("list reports no work items without treating that as an error", async () => {
  const repo = await createTempRepo();

  const result = await runBandit(repo, ["list"]);

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, "No work items found.\n");
});

test("show prints a single work item brief", async () => {
  const repo = await createTempRepo();
  await writeWorkBrief(repo, "BANDIT-001", "First Item", "Ready");

  const result = await runBandit(repo, ["show", "BANDIT-001"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /^# BANDIT-001: First Item/);
  assert.match(result.stdout, /## Status\n\nReady/);
});

test("show fails closed when the work item is missing", async () => {
  const repo = await createTempRepo();

  const result = await runBandit(repo, ["show", "BANDIT-404"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Work item not found: BANDIT-404/);
});

test("show fails closed when the work item ID is omitted", async () => {
  const repo = await createTempRepo();

  const result = await runBandit(repo, ["show"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit show <work-item-id>/);
});
