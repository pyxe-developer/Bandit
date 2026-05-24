import assert from "node:assert/strict";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
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

test("draft-work creates slice and chore briefs from explicit PRD decomposition", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Existing Baseline", "Landed");

  const prdPath = "docs/prds/BANDIT-PRD-900-draft-source.md";
  await writeFeaturePrd(repo, prdPath, {
    items: [
      validSliceDraft({
        title: "Routing Decision Command",
        goal: "Record manager-owned routing decisions from explicit policy."
      }),
      validChoreDraft({
        title: "Refresh Review Evidence",
        non_product_work:
          "Refresh stale bootstrap review evidence after routing policy changes."
      })
    ]
  });

  const result = await runBandit(repo, ["draft-work", prdPath]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Created work item draft: BANDIT-002/);
  assert.match(result.stdout, /Created work item draft: BANDIT-003/);
  assert.match(result.stdout, /docs\/work\/BANDIT-002\/brief\.md/);
  assert.match(result.stdout, /docs\/work\/BANDIT-003\/brief\.md/);

  const sliceBrief = await readFile(
    path.join(repo, "docs/work/BANDIT-002/brief.md"),
    "utf8"
  );
  assert.match(sliceBrief, /^# BANDIT-002: Routing Decision Command$/m);
  assertRequiredHeadings(sliceBrief, [
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
  assert.match(sliceBrief, /Source PRD.*BANDIT-PRD-900/);
  assert.match(sliceBrief, /docs\/prds\/BANDIT-PRD-900-draft-source\.md/);

  const choreBrief = await readFile(
    path.join(repo, "docs/work/BANDIT-003/brief.md"),
    "utf8"
  );
  assert.match(choreBrief, /^# BANDIT-003: Refresh Review Evidence$/m);
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
  assert.match(choreBrief, /Source PRD.*BANDIT-PRD-900/);
  assert.match(choreBrief, /docs\/prds\/BANDIT-PRD-900-draft-source\.md/);

  const events = await readEvents(repo);
  assert.deepEqual(events.slice(-2), [
    {
      type: "work_item_drafted",
      work_item: "BANDIT-002",
      message: "Drafted work item BANDIT-002 from BANDIT-PRD-900"
    },
    {
      type: "work_item_drafted",
      work_item: "BANDIT-003",
      message: "Drafted work item BANDIT-003 from BANDIT-PRD-900"
    }
  ]);

  const validate = await runBandit(repo, ["validate"]);
  assert.equal(validate.code, 0, validate.stderr);
  assert.match(validate.stdout, /Bandit state is valid/);
});

test("draft-work creates improvement chores with retrospective-derived metadata", async () => {
  const repo = await createInitializedRepo();

  const prdPath = "docs/prds/BANDIT-PRD-901-improvement-source.md";
  await writeFeaturePrd(repo, prdPath, {
    items: [
      validImprovementChoreDraft({
        title: "Evaluate Review Latency Trial",
        improvement: {
          lesson:
            "Review latency should be measured before adding stronger default reviewers."
        }
      })
    ]
  });

  const result = await runBandit(repo, ["draft-work", prdPath]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Created work item draft: BANDIT-001/);

  const brief = await readFile(
    path.join(repo, "docs/work/BANDIT-001/brief.md"),
    "utf8"
  );
  assert.match(brief, /^# BANDIT-001: Evaluate Review Latency Trial$/m);
  assertRequiredHeadings(brief, [
    "Non-Product Work",
    "Origin",
    "Scope",
    "Acceptance Criteria",
    "Verification Plan",
    "Expected Files",
    "Required Evidence",
    "Operator Input Status"
  ]);
  assert.match(brief, /origin:/);
  assert.match(brief, /source_work_item:/);
  assert.match(brief, /source_artifacts:/);
  assert.match(brief, /lesson:/);
  assert.match(brief, /hypothesis:/);
  assert.match(brief, /metric:/);
  assert.match(brief, /baseline:/);
  assert.match(brief, /expected_direction:/);
  assert.match(brief, /evaluation_window:/);
  assert.match(brief, /status:/);
  assert.match(brief, /outcome:/);
  assert.match(brief, /Review latency should be measured/);
  assert.match(brief, /Source PRD.*BANDIT-PRD-901/);
});

test("draft-work creates valid work items when the configured prefix includes digits", async () => {
  const repo = await createInitializedRepo();
  await writeFile(
    path.join(repo, ".bandit/config.toml"),
    'state_version = 1\nwork_item_prefix = "BD2"\n',
    "utf8"
  );

  const prdPath = "docs/prds/BANDIT-PRD-911-custom-prefix.md";
  await writeFeaturePrd(repo, prdPath, {
    items: [validSliceDraft({ title: "Custom Prefix Slice" })]
  });

  const result = await runBandit(repo, ["draft-work", prdPath]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Created work item draft: BD2-001/);

  const validate = await runBandit(repo, ["validate"]);
  assert.equal(validate.code, 0, validate.stderr);
});

test("draft-work fails closed when the PRD path is omitted", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, ["draft-work"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Usage: bandit draft-work <feature-prd-path>/);
});

test("draft-work fails closed when the PRD file is missing", async () => {
  const repo = await createInitializedRepo();

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/missing-prd.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Feature PRD not found: docs\/prds\/missing-prd\.md/);
});

test("draft-work fails closed when required Feature PRD sections are missing", async () => {
  const repo = await createInitializedRepo();
  await writeRawPrd(
    repo,
    "docs/prds/BANDIT-PRD-902-missing-section.md",
    `# BANDIT-PRD-902: Missing Section

## Problem

Problem statement.

## Decomposition Notes

\`\`\`bandit-work-draft
{"items":[]}
\`\`\`
`
  );

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-902-missing-section.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed Feature PRD/);
  assert.match(result.stderr, /missing required section: User/);
});

test("draft-work fails closed when the decomposition block is missing", async () => {
  const repo = await createInitializedRepo();
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-903-no-block.md", null);

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-903-no-block.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required decomposition block: bandit-work-draft/);
});

test("draft-work fails closed when multiple decomposition blocks are present", async () => {
  const repo = await createInitializedRepo();
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-904-multiple-blocks.md", {
    items: [validSliceDraft()]
  }, {
    extraDraftBlocks: [{ items: [validChoreDraft()] }]
  });

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-904-multiple-blocks.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Expected exactly one bandit-work-draft block/);
});

test("draft-work fails closed when decomposition JSON is malformed", async () => {
  const repo = await createInitializedRepo();
  await writeFeaturePrd(
    repo,
    "docs/prds/BANDIT-PRD-905-malformed-json.md",
    "{not-json",
    { rawDraftBlock: true }
  );

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-905-malformed-json.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed bandit-work-draft JSON/);
});

test("draft-work fails closed for unsupported draft item kinds", async () => {
  const repo = await createInitializedRepo();
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-906-bad-kind.md", {
    items: [{ ...validSliceDraft(), kind: "epic" }]
  });

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-906-bad-kind.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported draft item kind: epic/);
});

test("draft-work fails closed when required draft item fields are missing", async () => {
  const repo = await createInitializedRepo();
  const incompleteDraft = validChoreDraft();
  delete incompleteDraft.acceptance_criteria;
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-907-missing-field.md", {
    items: [incompleteDraft]
  });

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-907-missing-field.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Draft item 1 missing required field: acceptance_criteria/
  );
});

test("draft-work fails closed when improvement metadata is incomplete", async () => {
  const repo = await createInitializedRepo();
  const incompleteDraft = validImprovementChoreDraft();
  delete incompleteDraft.improvement.metric;
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-908-bad-improvement.md", {
    items: [incompleteDraft]
  });

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-908-bad-improvement.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Draft item 1 missing required improvement metadata: metric/
  );
});

test("draft-work refuses occupied output paths before writing files", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Existing Baseline", "Landed");
  await writeFile(path.join(repo, "docs/work/BANDIT-002"), "occupied", "utf8");
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-909-occupied-path.md", {
    items: [validSliceDraft()]
  });

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-909-occupied-path.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Refusing to overwrite existing work item path: docs\/work\/BANDIT-002/
  );
});

test("draft-work validates every planned item before writing any draft", async () => {
  const repo = await createInitializedRepo();
  const invalidSecondDraft = validChoreDraft();
  delete invalidSecondDraft.scope;
  await writeFeaturePrd(repo, "docs/prds/BANDIT-PRD-910-no-partial.md", {
    items: [validSliceDraft(), invalidSecondDraft]
  });

  const result = await runBandit(repo, [
    "draft-work",
    "docs/prds/BANDIT-PRD-910-no-partial.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Draft item 2 missing required field: scope/);
  assert.equal(await pathExists(path.join(repo, "docs/work/BANDIT-001")), false);
  assert.equal(await pathExists(path.join(repo, "docs/work/BANDIT-002")), false);
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
  await writeLocalQwenProfile(repo);
  return repo;
}

async function writeFeaturePrd(repo, relativePath, draft, options = {}) {
  const draftBlocks = [];

  if (draft !== null) {
    const blockContent = options.rawDraftBlock
      ? draft
      : JSON.stringify(draft, null, 2);
    draftBlocks.push(formatDraftBlock(blockContent));
  }

  for (const extraDraft of options.extraDraftBlocks ?? []) {
    draftBlocks.push(formatDraftBlock(JSON.stringify(extraDraft, null, 2)));
  }

  await writeRawPrd(
    repo,
    relativePath,
    `# ${options.prdId ?? extractPrdId(relativePath)}: Draft Source

## Problem

The operator needs explicit PRD decomposition to become trackable Bandit work.

## User

Codex PM.

## Goals

- Draft work items from explicit decomposition data.

## Non-Goals

- Infer product direction from free text.

## Stories Or Workflows

- Codex PM runs \`bandit draft-work <feature-prd-path>\`.

## Acceptance Criteria

- Drafted work items preserve source PRD metadata.

## Out Of Scope

- Autonomous LLM decomposition.

## Test Or Verification Strategy

- Run focused CLI tests and \`bandit validate\`.

## Decomposition Notes

${draftBlocks.join("\n\n")}
`
  );
}

async function writeRawPrd(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

function formatDraftBlock(content) {
  return `\`\`\`bandit-work-draft
${content}
\`\`\``;
}

function extractPrdId(relativePath) {
  return path.basename(relativePath).match(/^(BANDIT-PRD-\d+)/)?.[1] ?? "BANDIT-PRD-900";
}

function validSliceDraft(overrides = {}) {
  return {
    kind: "slice",
    title: "Draft Slice",
    goal: "Add one bounded workflow behavior.",
    scope: ["Implement the bounded command behavior."],
    out_of_scope: ["Do not add cockpit state."],
    acceptance_criteria: ["The command succeeds for explicit input."],
    test_plan: ["Run focused command tests."],
    clean_code_read_evidence:
      "CLEAN_CODE.md read before the slice; criteria are testable.",
    stage_rubric_checklist: [
      {
        stage: "Stage 2: Test Design And RED Evidence",
        verdict: "pass",
        evidence: "Tests define expected behavior before implementation."
      }
    ],
    bootstrap_gaps: ["CodeRabbit automation is unavailable."],
    expected_files: ["src/commands/draft-work.ts"],
    first_implementation_order: ["Write tests, then implement the command."],
    smell_triggers: ["Generated work must not become hidden authority."],
    required_evidence: ["docs/work/<ID>/red-evidence.md"],
    operator_input_status: "No operator input is required.",
    ...overrides
  };
}

function validChoreDraft(overrides = {}) {
  return {
    kind: "chore",
    title: "Draft Chore",
    non_product_work: "Perform bounded maintenance on workflow evidence.",
    origin: "Retrospective follow-up from source PRD decomposition.",
    scope: ["Update the named evidence artifact."],
    acceptance_criteria: ["The artifact records the required evidence."],
    verification_plan: ["Run bandit validate."],
    expected_files: ["docs/work/<ID>/brief.md"],
    required_evidence: ["docs/work/<ID>/implementation-evidence.md"],
    operator_input_status: "No operator input is required.",
    ...overrides
  };
}

function validImprovementChoreDraft(overrides = {}) {
  return {
    ...validChoreDraft({
      title: "Draft Improvement Chore",
      non_product_work:
        "Evaluate whether a workflow lesson improved delivery outcomes.",
      origin: "Retrospective-derived improvement chore.",
      ...overrides
    }),
    kind: "improvement_chore",
    improvement: {
      origin: "retrospective",
      source_work_item: "BANDIT-002",
      source_artifacts: ["docs/work/BANDIT-002/retrospective.md"],
      lesson: "Measure the workflow lesson before making it permanent.",
      hypothesis: "A tagged improvement chore reduces repeated review delay.",
      metric: "review_delay_minutes",
      baseline: "No baseline captured before BANDIT-003.",
      expected_direction: "decrease",
      evaluation_window: "Evaluate after two comparable slices.",
      status: "planned",
      outcome: "pending",
      ...(overrides.improvement ?? {})
    }
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
    await readFile(filePath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    if (error instanceof Error && "code" in error && error.code === "EISDIR") {
      return true;
    }
    throw error;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
