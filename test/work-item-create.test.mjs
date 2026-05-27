import assert from "node:assert/strict";
import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const committedTemplateRoot = path.join(repoRoot, "docs/templates");
const committedPolicyRoot = path.join(repoRoot, ".bandit/policy");
const committedEvaluationRoot = path.join(repoRoot, "docs/evaluation");

test("work-item create creates a slice brief from explicit structured input", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Existing Baseline", "Landed");
  const specPath = "docs/specs/create-slice.json";
  await writeSpec(
    repo,
    specPath,
    validSliceSpec({ title: "Create Slice Brief" })
  );

  const result = await runBandit(repo, ["work-item", "create", specPath]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Created work item: BANDIT-002/);
  assert.match(result.stdout, /docs\/work\/BANDIT-002\/brief\.md/);

  const brief = await readFile(
    path.join(repo, "docs/work/BANDIT-002/brief.md"),
    "utf8"
  );
  assert.match(brief, /^# BANDIT-002: Create Slice Brief$/m);
  assertRequiredHeadings(brief, [
    "Goal",
    "Scope",
    "Out Of Scope",
    "Acceptance Criteria",
    "Test Plan",
    "CLEAN_CODE.md Read Evidence",
    "Stage-Rubric Checklist",
    "Bootstrap Gaps",
    "Expected Files",
    "First Implementation Order",
    "Smell Triggers",
    "Required Evidence",
    "Operator Input Status"
  ]);

  const list = await runBandit(repo, ["list"]);
  assert.equal(list.code, 0, list.stderr);
  assert.match(list.stdout, /BANDIT-002 \| Brief Created \| Create Slice Brief/);

  const show = await runBandit(repo, ["show", "BANDIT-002"]);
  assert.equal(show.code, 0, show.stderr);
  assert.match(show.stdout, /^# BANDIT-002: Create Slice Brief$/m);

  const validate = await runBandit(repo, ["validate"]);
  assert.equal(validate.code, 0, validate.stderr);
});

test("work-item create creates chore and improvement-chore briefs", async () => {
  const repo = await createInitializedRepo();
  await writeSpec(repo, "docs/specs/create-chore.json", validChoreSpec());
  await writeSpec(
    repo,
    "docs/specs/create-improvement.json",
    validImprovementChoreSpec()
  );

  const chore = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/create-chore.json"
  ]);
  const improvement = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/create-improvement.json"
  ]);

  assert.equal(chore.code, 0, chore.stderr);
  assert.equal(improvement.code, 0, improvement.stderr);

  const choreBrief = await readFile(
    path.join(repo, "docs/work/BANDIT-001/brief.md"),
    "utf8"
  );
  assert.match(choreBrief, /^# BANDIT-001: Create Chore Brief$/m);
  assertRequiredHeadings(choreBrief, [
    "Non-Product Work",
    "Origin",
    "Scope",
    "Acceptance Criteria",
    "Verification Plan",
    "Expected Files",
    "Required Evidence",
    "Operator Input Status"
  ]);

  const improvementBrief = await readFile(
    path.join(repo, "docs/work/BANDIT-002/brief.md"),
    "utf8"
  );
  assert.match(improvementBrief, /^# BANDIT-002: Create Improvement Chore$/m);
  assert.match(improvementBrief, /source_work_item:/);
  assert.match(improvementBrief, /hypothesis:/);
  assert.match(improvementBrief, /evaluation_window:/);
});

test("work-item create appends lifecycle evidence for the created work item", async () => {
  const repo = await createInitializedRepo();
  await writeSpec(repo, "docs/specs/create-chore.json", validChoreSpec());

  const result = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/create-chore.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual((await readEvents(repo)).slice(-1), [
    {
      type: "work_item_created",
      work_item: "BANDIT-001",
      message: "Created work item BANDIT-001 from docs/specs/create-chore.json"
    }
  ]);
});

test("work-item create links an eligible bootstrap gap to the active chore", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-011", "Bootstrap Gap Tracking", "Landed");
  await writeBootstrapGapLedger(repo, [
    openGap("BANDIT-GAP-WORK-ITEM-CREATE-COMMAND"),
    openGap("BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND")
  ]);
  await writeSpec(
    repo,
    "docs/specs/create-gap-chore.json",
    validChoreSpec({
      title: "Resolve Work Item Create Gap",
      bootstrap_gap: "BANDIT-GAP-WORK-ITEM-CREATE-COMMAND"
    })
  );

  const result = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/create-gap-chore.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const ledger = JSON.parse(
    await readFile(path.join(repo, ".bandit/bootstrap-gaps.json"), "utf8")
  );
  assert.equal(ledger.gaps[0].status, "active");
  assert.equal(ledger.gaps[0].disposition, "active_chore");
  assert.equal(ledger.gaps[0].linked_work_item, "BANDIT-001");
  assert.equal(ledger.gaps[1].status, "open");
  assert.equal(ledger.gaps[1].linked_work_item, null);

  const gaps = await runBandit(repo, ["gaps", "list"]);
  assert.equal(gaps.code, 0, gaps.stderr);
  assert.match(
    gaps.stdout,
    /BANDIT-GAP-WORK-ITEM-CREATE-COMMAND \| active \| active_chore/
  );
});

test("work-item create fails closed for malformed specs before writing files", async () => {
  const repo = await createInitializedRepo();
  await writeSpec(repo, "docs/specs/malformed.json", {
    ...validChoreSpec(),
    acceptance_criteria: []
  });

  const result = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/malformed.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Work item spec missing required field: acceptance_criteria/
  );
  assert.equal(await pathExists(path.join(repo, "docs/work/BANDIT-001")), false);
});

test("work-item create refuses occupied output paths before writing files", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Existing Work", "Ready");
  await writeFile(path.join(repo, "docs/work/BANDIT-002"), "occupied", "utf8");
  await writeSpec(repo, "docs/specs/create-chore.json", validChoreSpec());

  const result = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/create-chore.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Refusing to overwrite existing work item path: docs\/work\/BANDIT-002/
  );
  assert.equal(
    await pathExists(path.join(repo, "docs/work/BANDIT-002/brief.md")),
    false
  );
});

test("work-item create refuses specs outside the repository", async () => {
  const repo = await createInitializedRepo();
  const outsideSpec = path.join(path.dirname(repo), "outside-work-item.json");
  await writeFile(
    outsideSpec,
    `${JSON.stringify(validChoreSpec(), null, 2)}\n`,
    "utf8"
  );

  const result = await runBandit(repo, ["work-item", "create", outsideSpec]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Work item spec path must stay within repository:/
  );
});

test("work-item create refuses ineligible bootstrap gaps before writing files", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-011", "Bootstrap Gap Tracking", "Landed");
  await writeBootstrapGapLedger(repo, [
    {
      ...openGap("BANDIT-GAP-WORK-ITEM-CREATE-COMMAND"),
      status: "resolved",
      disposition: "resolved",
      linked_work_item: "BANDIT-011"
    }
  ]);
  await writeSpec(
    repo,
    "docs/specs/create-gap-chore.json",
    validChoreSpec({
      bootstrap_gap: "BANDIT-GAP-WORK-ITEM-CREATE-COMMAND"
    })
  );

  const result = await runBandit(repo, [
    "work-item",
    "create",
    "docs/specs/create-gap-chore.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Bootstrap gap BANDIT-GAP-WORK-ITEM-CREATE-COMMAND is not eligible for work-item creation/
  );
  assert.equal(await pathExists(path.join(repo, "docs/work/BANDIT-001")), false);
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });
  await cp(committedPolicyRoot, path.join(repo, ".bandit/policy"), {
    recursive: true
  });
  await cp(committedEvaluationRoot, path.join(repo, "docs/evaluation"), {
    recursive: true
  });
  await writeLocalQwenProfile(repo);
  return repo;
}

async function writeSpec(repo, relativePath, spec) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
}

async function writeBootstrapGapLedger(repo, gaps) {
  const destination = path.join(repo, ".bandit/bootstrap-gaps.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(
    destination,
    `${JSON.stringify({ version: 1, gaps }, null, 2)}\n`,
    "utf8"
  );
}

function validSliceSpec(overrides = {}) {
  return {
    kind: "slice",
    title: "Create Slice Brief",
    goal: "Create one explicit slice brief from a structured spec.",
    status: "Brief Created",
    scope: ["Create exactly one slice brief."],
    out_of_scope: ["Do not infer work from chat context."],
    acceptance_criteria: ["The brief is readable by list, show, and validate."],
    test_plan: ["Run focused work-item creation tests."],
    clean_code_read_evidence:
      "CLEAN_CODE.md read before the slice; criteria are testable.",
    stage_rubric_checklist: [
      {
        stage: "Stage 2: Test Design And RED Evidence",
        verdict: "pass",
        evidence: "Tests define expected behavior before implementation."
      }
    ],
    bootstrap_gaps: [
      "Live CodeRabbit may be unavailable for local bootstrap work."
    ],
    expected_files: ["docs/work/<ID>/brief.md"],
    first_implementation_order: ["Write RED tests before production code."],
    smell_triggers: ["Hidden authority"],
    required_evidence: ["docs/work/<ID>/red-evidence.md"],
    operator_input_status: "No operator input is required.",
    ...overrides
  };
}

function validChoreSpec(overrides = {}) {
  return {
    kind: "chore",
    title: "Create Chore Brief",
    status: "Brief Created",
    non_product_work: "Create one workflow maintenance chore from explicit input.",
    origin: "Bootstrap gap routing requires CLI-owned work-item creation.",
    scope: ["Create exactly one chore brief."],
    acceptance_criteria: ["The chore brief is valid Bandit work-item evidence."],
    verification_plan: ["Run focused CLI tests and bandit validate."],
    expected_files: ["docs/work/<ID>/brief.md"],
    required_evidence: ["docs/work/<ID>/implementation-evidence.md"],
    operator_input_status: "No operator input is required.",
    ...overrides
  };
}

function validImprovementChoreSpec(overrides = {}) {
  return {
    ...validChoreSpec({
      title: "Create Improvement Chore",
      non_product_work:
        "Create one retrospective-derived improvement chore from explicit input.",
      origin: "Retrospective-derived improvement chore.",
      ...overrides
    }),
    kind: "improvement_chore",
    improvement: {
      origin: "retrospective",
      source_work_item: "BANDIT-019",
      source_artifacts: ["docs/work/BANDIT-019/retrospective.md"],
      lesson: "Manual work-item creation should become CLI-owned.",
      hypothesis: "CLI-owned creation reduces manual context drift.",
      metric: "manual_work_item_creation_steps",
      baseline: "Work items are manually created after bootstrap-gap routing.",
      expected_direction: "decrease",
      evaluation_window: "Evaluate during the next bootstrap-gap chore.",
      status: "planned",
      outcome: "pending",
      ...(overrides.improvement ?? {})
    }
  };
}

function openGap(id) {
  return {
    id,
    title: id.replaceAll("-", " "),
    status: "open",
    disposition: "queued_chore_candidate",
    source_work_item: "BANDIT-011",
    source_artifacts: ["docs/work/BANDIT-011/brief.md"],
    linked_work_item: null,
    rationale: "Gap is queued for bootstrap hardening.",
    verification_target: null,
    next_action: "Create a dedicated bootstrap-gap chore."
  };
}

function assertRequiredHeadings(content, headings) {
  for (const heading of headings) {
    assert.match(content, new RegExp(`^## ${escapeRegExp(heading)}$`, "m"));
  }
}

async function readEvents(repo) {
  const content = await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8");
  return content
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error.code === "ENOENT" || error.code === "ENOTDIR")
    ) {
      return false;
    }
    throw error;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
