import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit, writeWorkBrief } from "./helpers/bandit-cli.mjs";

test("event-driven-wake-scheduler validate accepts a complete policy fixture", async () => {
  const repo = await createInitializedEventDrivenWakeRepo();
  await writeCompleteEventDrivenWakeFixture(repo);

  const result = await runBandit(repo, [
    "event-driven-wake-scheduler",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
});

test("event-driven-wake-scheduler validate rejects unsupported options", async () => {
  const repo = await createInitializedEventDrivenWakeRepo();
  await writeCompleteEventDrivenWakeFixture(repo);

  const result = await runBandit(repo, [
    "event-driven-wake-scheduler",
    "validate",
    "--yaml"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Usage: bandit event-driven-wake-scheduler validate \[--json\]/
  );
});

test("event-driven-wake-scheduler validate requires deterministic sweeper contract", async () => {
  const repo = await createInitializedEventDrivenWakeRepo();
  await writeCompleteEventDrivenWakeFixture(repo, { includeSweeper: false });

  const result = await runBandit(repo, [
    "event-driven-wake-scheduler",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /deterministic sweeper contract is required/);
});

async function createInitializedEventDrivenWakeRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writeCompleteEventDrivenWakeFixture(
  repo,
  options = { includeSweeper: true }
) {
  await writeWorkBrief(repo, "BANDIT-052", "Event-Driven Wake Scheduler");
  await writeFileAt(repo, "docs/work/BANDIT-052/red-evidence.md", "# RED Evidence\n");
  await writeFileAt(
    repo,
    ".bandit/policy/event-driven-wake-scheduler.json",
    JSON.stringify(
      {
        contract_version: 1,
        policy_id: "event-driven-wake-scheduler",
        include_deterministic_sweeper: options.includeSweeper
      },
      null,
      2
    ) + "\n"
  );
}

async function writeFileAt(repo, relativePath, content) {
  const target = path.join(repo, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}
