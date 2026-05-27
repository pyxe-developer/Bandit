import assert from "node:assert/strict";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createTempRepo, runBandit, writeWorkBrief } from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

test("validate fails closed for an undispositioned blocking bootstrap gap", async () => {
  const repo = await createValidRepo();
  await writeBootstrapGaps(repo, {
    version: 1,
    gaps: [
      {
        id: "BANDIT-GAP-TEST",
        title: "Test blocking gap",
        status: "blocking",
        source_work_item: "BANDIT-011",
        source_artifacts: ["docs/work/BANDIT-011/brief.md"],
        next_action: "Route this gap before unrelated work starts."
      }
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /bootstrap gap/i);
  assert.match(result.stderr, /BANDIT-GAP-TEST/);
  assert.match(result.stderr, /disposition/i);
});

test("validate fails closed when the bootstrap gap ledger is missing", async () => {
  const repo = await createValidRepo();
  await rm(path.join(repo, ".bandit/bootstrap-gaps.json"));

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /bootstrap gap ledger/i);
  assert.match(result.stderr, /\.bandit\/bootstrap-gaps\.json/);
});

test("validate fails closed when a bootstrap gap links to a missing work item", async () => {
  const repo = await createValidRepo();
  await writeBootstrapGaps(repo, {
    version: 1,
    gaps: [
      {
        id: "BANDIT-GAP-MISSING-WORK",
        title: "Missing linked work",
        status: "open",
        disposition: "queued_chore",
        source_work_item: "BANDIT-011",
        source_artifacts: ["docs/work/BANDIT-011/brief.md"],
        linked_work_item: "BANDIT-999",
        rationale: "The gap needs a follow-up chore.",
        verification_target: "docs/work/BANDIT-999/brief.md",
        next_action: "Create the linked chore before continuing unrelated work."
      }
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /BANDIT-GAP-MISSING-WORK/);
  assert.match(result.stderr, /BANDIT-999/);
  assert.match(result.stderr, /brief\.md/);
});

test("validate fails closed when no-action bootstrap gap lacks rationale", async () => {
  const repo = await createValidRepo();
  await writeBootstrapGaps(repo, {
    version: 1,
    gaps: [
      {
        id: "BANDIT-GAP-NO-ACTION",
        title: "No action without rationale",
        status: "open",
        disposition: "no_action",
        source_work_item: "BANDIT-011",
        source_artifacts: ["docs/work/BANDIT-011/brief.md"],
        next_action: "No action proposed."
      }
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /BANDIT-GAP-NO-ACTION/);
  assert.match(result.stderr, /rationale/i);
});

test("gaps list reports tracked bootstrap gaps and next actions", async () => {
  const repo = await createValidRepo();
  await writeWorkBrief(repo, "BANDIT-012", "Gap follow-up chore");
  await writeBootstrapGaps(repo, {
    version: 1,
    gaps: [
      {
        id: "BANDIT-GAP-LIVE-CODERABBIT",
        title: "Live CodeRabbit polling unavailable",
        status: "open",
        disposition: "queued_chore",
        source_work_item: "BANDIT-007",
        source_artifacts: ["docs/work/BANDIT-007/retrospective.md"],
        linked_work_item: "BANDIT-012",
        rationale: "Live polling needs a later integration chore.",
        verification_target: "docs/work/BANDIT-012/brief.md",
        next_action: "Keep queued until the review integration phase."
      }
    ]
  });

  const result = await runBandit(repo, ["gaps", "list"]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /BANDIT-GAP-LIVE-CODERABBIT/);
  assert.match(result.stdout, /queued_chore/);
  assert.match(result.stdout, /BANDIT-012/);
  assert.match(result.stdout, /Keep queued until the review integration phase/);
});

test("gaps list fails closed when the bootstrap gap ledger is missing", async () => {
  const repo = await createValidRepo();
  await rm(path.join(repo, ".bandit/bootstrap-gaps.json"));

  const result = await runBandit(repo, ["gaps", "list"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /bootstrap gap ledger/i);
  assert.match(result.stderr, /\.bandit\/bootstrap-gaps\.json/);
});

async function createValidRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await cp(path.join(repoRoot, "docs/templates"), path.join(repo, "docs/templates"), {
    recursive: true
  });
  await cp(path.join(repoRoot, ".bandit/policy"), path.join(repo, ".bandit/policy"), {
    recursive: true
  });
  await cp(path.join(repoRoot, "docs/evaluation"), path.join(repo, "docs/evaluation"), {
    recursive: true
  });
  await cp(path.join(repoRoot, ".bandit/reviewers"), path.join(repo, ".bandit/reviewers"), {
    recursive: true
  });
  await writeWorkBrief(repo, "BANDIT-011", "Bootstrap Gap Chore Tracking And Routing");
  return repo;
}

async function writeBootstrapGaps(repo, content) {
  const destination = path.join(repo, ".bandit/bootstrap-gaps.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
