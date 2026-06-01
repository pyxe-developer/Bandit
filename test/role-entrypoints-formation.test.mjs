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
const committedReviewersRoot = path.join(repoRoot, ".bandit/reviewers");

test("bootstrap gap validation accepts replaced disposition with replacement evidence", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-056", "Evidence Freshness SLOs", "Closed");
  await writeWorkBrief(
    repo,
    "BANDIT-057",
    "Role Entry Points And Formation Gate",
    "Brief Created"
  );
  await writeFileAt(
    repo,
    "docs/design/role-scoped-workflow-orchestration.md",
    "# Role-Scoped Workflow Orchestration\n\nReplacement umbrella evidence.\n"
  );
  await writeFileAt(
    repo,
    "docs/work/BANDIT-057/landing-action.md",
    "# Landing Action\n\ncommit_sha: fixture\n"
  );
  await writeFileAt(
    repo,
    "docs/work/BANDIT-057/retrospective.md",
    "# Retrospective\n\nReplacement closeout evidence.\n"
  );
  await writeBootstrapGapLedger(repo, [
    {
      id: "BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT",
      title: "Stage 4 repair can violate ownership boundaries",
      status: "resolved",
      disposition: "replaced",
      source_work_item: "BANDIT-056",
      source_artifacts: [
        "docs/work/BANDIT-056/brief.md",
        "docs/design/role-scoped-workflow-orchestration.md"
      ],
      linked_work_item: "BANDIT-057",
      replacement_gap: "BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION",
      replacement_work_item: "BANDIT-057",
      replacement_evidence: ["docs/work/BANDIT-057/brief.md"],
      rationale:
        "The narrow Stage 4 repair ownership symptom is replaced by the role-scoped workflow orchestration umbrella.",
      verification_target: "docs/work/BANDIT-057/landing-action.md",
      next_action: "Track the replacement through BANDIT-057 closeout."
    },
    {
      id: "BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION",
      title: "Role-scoped workflow orchestration",
      status: "active",
      disposition: "active_chore",
      source_work_item: "BANDIT-057",
      source_artifacts: ["docs/work/BANDIT-057/brief.md"],
      linked_work_item: "BANDIT-057",
      rationale:
        "BANDIT-057 is the active replacement chore for explicit role entrypoints and formation approval.",
      verification_target: "docs/work/BANDIT-057/brief.md",
      next_action: "Complete active chore BANDIT-057."
    }
  ]);

  const validate = await runBandit(repo, ["validate"]);
  assert.equal(validate.code, 0, validate.stderr);

  const gaps = await runBandit(repo, ["gaps", "list"]);
  assert.equal(gaps.code, 0, gaps.stderr);
  assert.match(gaps.stdout, /BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT/);
  assert.match(gaps.stdout, /replaced/);
  assert.match(gaps.stdout, /BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION/);
});

test("bare workflow invocation fails closed with role-required refusal before context hydration", async () => {
  const repo = await createInitializedRepo();
  await writeFileAt(repo, ".bandit/bootstrap-gaps.json", "{not-json}\n");
  await writeFileAt(
    repo,
    "docs/roadmap/CURRENT_CONTEXT.md",
    "This fixture must not be read by bare workflow invocation.\n"
  );

  const result = await runBandit(repo, []);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /role[- ]required/i);
  assert.match(result.stderr, /repo-pm/);
  assert.match(result.stderr, /work-item-pm/);
  assert.doesNotMatch(result.stderr, /Malformed bootstrap gap ledger/);
  assert.doesNotMatch(result.stderr, /CURRENT_CONTEXT/);
});

test("repo-pm create-work-item preserves work-item creation safety and artifacts", async () => {
  const repo = await createInitializedRepo();
  await writeSpec(repo, "docs/specs/create-gap-chore.json", validChoreSpec());

  const result = await runBandit(repo, [
    "repo-pm",
    "create-work-item",
    "docs/specs/create-gap-chore.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Created work item: BANDIT-001/);
  assert.equal(
    await pathExists(path.join(repo, "docs/work/BANDIT-001/brief.md")),
    true
  );
  const events = await readEvents(repo);
  assert.deepEqual(events.slice(-1), [
    {
      type: "work_item_created",
      work_item: "BANDIT-001",
      message: "Created work item BANDIT-001 from docs/specs/create-gap-chore.json"
    }
  ]);
});

test("repo-pm approve-formation refuses malformed formation before review artifacts", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(
    repo,
    "BANDIT-001",
    "Malformed Formation",
    "Brief Created"
  );
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    })
  ]);

  const before = await readFile(
    path.join(repo, "docs/work/BANDIT-001/coordination-log.jsonl"),
    "utf8"
  );
  const result = await runBandit(repo, [
    "repo-pm",
    "approve-formation",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /formation validation/i);
  assert.match(result.stderr, /acceptance criteria/i);
  assert.equal(
    await readFile(
      path.join(repo, "docs/work/BANDIT-001/coordination-log.jsonl"),
      "utf8"
    ),
    before
  );
});

test("repo-pm approve-formation requires Qwen, CodeRabbit, and aggregate formation review artifacts", async () => {
  const repo = await createInitializedRepo();
  await writeFormationReadyBrief(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    })
  ]);

  const result = await runBandit(repo, [
    "repo-pm",
    "approve-formation",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /docs\/work\/BANDIT-001\/qwen-formation-review\.md/);
  assert.match(
    result.stderr,
    /docs\/work\/BANDIT-001\/coderabbit-formation-review\.md/
  );
  assert.match(result.stderr, /docs\/work\/BANDIT-001\/formation-review\.md/);
});

test("coordination validate accepts formation_approved between brief and RED evidence", async () => {
  const repo = await createInitializedRepo();
  await writeFormationReadyBrief(repo, "BANDIT-001");
  for (const artifact of [
    "qwen-formation-review.md",
    "coderabbit-formation-review.md",
    "formation-review.md",
    "red-evidence.md"
  ]) {
    await writeFileAt(
      repo,
      `docs/work/BANDIT-001/${artifact}`,
      `# ${artifact}\n\nFixture evidence.\n`
    );
  }
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"],
      safe_triggers: ["formation_required"]
    }),
    stepTransition({
      sequence: 2,
      state: "formation_approved",
      actor: "repo_pm",
      evidence: [
        "docs/work/BANDIT-001/qwen-formation-review.md",
        "docs/work/BANDIT-001/coderabbit-formation-review.md",
        "docs/work/BANDIT-001/formation-review.md"
      ],
      safe_triggers: ["red_evidence_required"]
    }),
    stepTransition({
      sequence: 3,
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
});

test("work-item-pm start refuses work before formation approval", async () => {
  const repo = await createInitializedRepo();
  await writeFormationReadyBrief(repo, "BANDIT-001");
  await writeCoordinationLog(repo, "BANDIT-001", [
    stepTransition({
      state: "brief_created",
      evidence: ["docs/work/BANDIT-001/brief.md"]
    })
  ]);

  const result = await runBandit(repo, [
    "work-item-pm",
    "start",
    "BANDIT-001"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /formation_approved/);
  assert.match(result.stderr, /docs\/work\/BANDIT-001\/formation-review\.md/);
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
  await cp(committedReviewersRoot, path.join(repo, ".bandit/reviewers"), {
    recursive: true
  });
  await writeLocalQwenProfile(repo);
  return repo;
}

async function writeSpec(repo, relativePath, spec) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(spec, null, 2)}\n`);
}

async function writeBootstrapGapLedger(repo, gaps) {
  await writeFileAt(
    repo,
    ".bandit/bootstrap-gaps.json",
    `${JSON.stringify({ version: 1, gaps }, null, 2)}\n`
  );
}

async function writeFormationReadyBrief(repo, workItem) {
  await writeFileAt(
    repo,
    `docs/work/${workItem}/brief.md`,
    `# ${workItem}: Formation Ready Fixture

work_type: chore

## Status

Brief Created

## Non-Product Work

Validate a role-scoped workflow orchestration fixture.

## Origin

The fixture comes from an accepted bootstrap-gap replacement design.

## Scope

- Create exactly one bounded formation gate.

## Out Of Scope

- Do not implement scheduler, worktree, claim, merge, push, deploy, or product UAT behavior.

## Acceptance Criteria

- Formation validation passes only when role and ownership boundaries are explicit.

## Verification Plan

- Run focused formation tests.

## Operator Input Status

No operator-owned input is required.

## Role Boundary Evidence

- Repo PM owns formation approval.
- Work Item PM starts only after formation_approved.
- Test Writer owns RED evidence and tests.
- Implementation Writer owns implementation only.

## Write-Surface Families

- docs/work/<ID>/
- docs/specs/
- test/
- src/
`
  );
}

async function writeCoordinationLog(repo, workItem, events) {
  await writeFileAt(
    repo,
    `docs/work/${workItem}/coordination-log.jsonl`,
    events.map((event) => JSON.stringify(event)).join("\n") + "\n"
  );
}

async function writeFileAt(repo, relativePath, contents) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
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

function validChoreSpec(overrides = {}) {
  return {
    kind: "chore",
    title: "Role Entry Point Fixture",
    status: "Brief Created",
    non_product_work:
      "Create one workflow maintenance chore from explicit Repo PM input.",
    origin: "Role-scoped workflow orchestration requires Repo PM formation.",
    scope: ["Create exactly one chore brief."],
    acceptance_criteria: ["The chore brief is valid Bandit work-item evidence."],
    verification_plan: ["Run focused CLI tests and bandit validate."],
    expected_files: ["docs/work/<ID>/brief.md"],
    required_evidence: ["docs/work/<ID>/implementation-evidence.md"],
    operator_input_status: "No operator input is required.",
    ...overrides
  };
}

function stepTransition(overrides = {}) {
  return {
    version: 1,
    event_type: "step_transition",
    work_item: "BANDIT-001",
    sequence: 1,
    timestamp: "2026-06-01T12:00:00.000Z",
    actor: "codex_pm",
    source: "test",
    state: "brief_created",
    evidence: ["docs/work/BANDIT-001/brief.md"],
    safe_triggers: [],
    ...overrides
  };
}
