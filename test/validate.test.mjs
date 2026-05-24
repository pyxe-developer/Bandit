import assert from "node:assert/strict";
import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const committedTemplateRoot = path.join(repoRoot, "docs/templates");

const requiredTemplateFiles = [
  "docs/templates/feature-prd.md",
  "docs/templates/slice.md",
  "docs/templates/chore.md",
  "docs/templates/improvement-chore.md",
  "docs/templates/routing-decision.md"
];

const validTemplates = {
  "docs/templates/feature-prd.md": `# Feature PRD Template

## Problem
## User
## Goals
## Non-Goals
## Stories Or Workflows
## Acceptance Criteria
## Out Of Scope
## Test Or Verification Strategy
## Decomposition Notes
`,
  "docs/templates/slice.md": `# Slice Template

## Goal
## Scope
## Out Of Scope
## Acceptance Criteria
## Test Plan
## CLEAN_CODE.md Read Evidence
## Stage-Rubric Checklist
## Bootstrap Gaps
## Expected Files
## First Implementation Order
## Smell Triggers
## Required Evidence
## Operator Input Status
`,
  "docs/templates/chore.md": `# Chore Template

## Non-Product Work
## Origin
## Scope
## Acceptance Criteria
## Verification Plan
## Expected Files
## Required Evidence
## Operator Input Status
`,
  "docs/templates/improvement-chore.md": `# Retrospective-Derived Improvement Chore Template

origin:
source_work_item:
source_artifacts:
lesson:
hypothesis:
metric:
baseline:
expected_direction:
evaluation_window:
status:
outcome:
`,
  "docs/templates/routing-decision.md": `# Routing Decision Template

work_item:
decision_kind:
selected_route:
applicable_smell_ids:
evidence_used:
operator_input_status:
bootstrap_gaps:
escalation_outcome:
final_decision:
`
};

const validSmellCatalog = {
  version: 1,
  smells: [
    {
      id: "BANDIT-SMELL-ADVERSARIAL-REVIEW",
      name: "Adversarial Review Required",
      category: "review_gate",
      trigger:
        "A PR or slice requires a baseline adversarial review before landing.",
      severity: "blocker",
      default_action: "require_qwen_review",
      escalation_target: "local-qwen-baseline",
      required_evidence: ["review-evidence.md"]
    }
  ]
};

test("validate passes for initialized repo-native state with committed work artifact templates", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedTemplates(repo);
  await writeSmellCatalog(repo, validSmellCatalog);

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

for (const templatePath of requiredTemplateFiles) {
  test(`validate fails closed when ${templatePath} is missing`, async () => {
    const repo = await createTempRepo();
    await runBandit(repo, ["init"]);
    await writeValidTemplates(repo, { omit: templatePath });

    const result = await runBandit(repo, ["validate"]);

    assert.equal(result.code, 1);
    assert.match(
      result.stderr,
      new RegExp(`Missing required template: ${escapeRegExp(templatePath)}`)
    );
  });
}

test("validate fails closed when the Feature PRD template omits required sections", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/feature-prd.md": `# Feature PRD Template

## Problem
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/feature-prd\.md/);
  assert.match(result.stderr, /missing required field: user/);
});

test("validate fails closed when the Slice template omits clean-code evidence", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/slice.md": `# Slice Template

## Goal
## Scope
## Acceptance Criteria
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/slice\.md/);
  assert.match(result.stderr, /missing required field: CLEAN_CODE\.md read evidence/);
});

test("validate fails closed when the Chore template does not distinguish non-product work", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/chore.md": `# Chore Template

## Origin
## Scope
## Acceptance Criteria
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/chore\.md/);
  assert.match(result.stderr, /missing required field: non-product work/);
});

test("validate fails closed when improvement chore metadata is incomplete", async () => {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await writeValidTemplates(repo, {
    override: {
      "docs/templates/improvement-chore.md": `# Retrospective-Derived Improvement Chore Template

origin:
lesson:
`
    }
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed template: docs\/templates\/improvement-chore\.md/);
  assert.match(result.stderr, /missing required field: hypothesis/);
  assert.match(result.stderr, /missing required field: metric/);
  assert.match(result.stderr, /missing required field: baseline/);
  assert.match(result.stderr, /missing required field: evaluation_window/);
});

async function copyCommittedTemplates(repo) {
  try {
    await access(committedTemplateRoot);
  } catch (error) {
    if (isMissingPathError(error)) {
      assert.fail("Missing required template directory: docs/templates");
    }
    throw error;
  }

  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });
}

async function writeValidTemplates(repo, options = {}) {
  for (const [templatePath, content] of Object.entries(validTemplates)) {
    if (templatePath === options.omit) {
      continue;
    }

    const finalContent = options.override?.[templatePath] ?? content;
    const destination = path.join(repo, templatePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, finalContent, "utf8");
  }
}

async function writeSmellCatalog(repo, catalog) {
  const destination = path.join(repo, ".bandit/policy/smell-triggers.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
