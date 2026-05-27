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

test("artifact create creates RED evidence from explicit structured input", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Creation", "Brief Created");
  await writeSpec(repo, "docs/specs/red-evidence.json", {
    kind: "red_evidence",
    work_item: "BANDIT-001",
    status: "pass",
    stage: "Stage 2: Test Design And RED Evidence",
    summary:
      "Focused tests fail before implementation because the artifact command is missing.",
    test_command: "node --test test/artifact-create.test.mjs",
    observed_output: ["tests 4", "pass 0", "fail 4"],
    acceptance_criteria_mapping: [
      {
        criterion: "The command creates supported workflow artifacts.",
        evidence:
          "The RED evidence artifact is generated from explicit structured input."
      }
    ],
    next_action:
      "Implement the narrow artifact creation command without broadening scope."
  });

  const result = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/red-evidence.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Created artifact: docs\/work\/BANDIT-001\/red-evidence\.md/);

  const artifact = await readFile(
    path.join(repo, "docs/work/BANDIT-001/red-evidence.md"),
    "utf8"
  );
  assert.match(artifact, /^# BANDIT-001 RED Evidence$/m);
  assert.match(artifact, /^## Status$/m);
  assert.match(artifact, /`pass` for Stage 2: Test Design And RED Evidence\./);
  assert.match(artifact, /^## Acceptance Criteria Mapping$/m);
  assert.match(artifact, /^## Next Action$/m);

  assert.deepEqual((await readEvents(repo)).slice(-1), [
    {
      type: "artifact_created",
      work_item: "BANDIT-001",
      message: "Created red_evidence artifact at docs/work/BANDIT-001/red-evidence.md"
    }
  ]);
});

test("artifact create creates implementation evidence without taking hidden authority", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Creation", "RED Recorded");
  await writeSpec(repo, "docs/specs/implementation-evidence.json", {
    kind: "implementation_evidence",
    work_item: "BANDIT-001",
    status: "pass",
    summary:
      "The implementation creates one artifact from explicit input and keeps Markdown as canonical state.",
    implementation_summary: [
      "Added a narrow CLI-owned artifact creation path.",
      "Preserved repo-native artifacts as the source of truth."
    ],
    verification: [
      "node --test test/artifact-create.test.mjs",
      "npm run bandit -- validate"
    ],
    clean_code_check: [
      {
        rubric: "No hidden authority",
        verdict: "pass",
        evidence: "The command writes only named repo-native artifacts."
      }
    ],
    next_action: "Record Stage 4 review evidence."
  });

  const result = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/implementation-evidence.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(
    result.stdout,
    /Created artifact: docs\/work\/BANDIT-001\/implementation-evidence\.md/
  );

  const artifact = await readFile(
    path.join(repo, "docs/work/BANDIT-001/implementation-evidence.md"),
    "utf8"
  );
  assert.match(artifact, /^# BANDIT-001 Implementation Evidence$/m);
  assert.match(artifact, /^## Implementation Summary$/m);
  assert.match(artifact, /^## Clean-Code Self-Check$/m);
  assert.match(artifact, /No hidden authority/);
});

test("artifact create creates a landing verdict from explicit structured input", async () => {
  const repo = await createInitializedRepo();
  const artifact = await createLandingVerdictArtifact(repo);

  assert.match(artifact, /^# BANDIT-001 Landing Verdict$/m);
  assert.match(artifact, /^contract_version: 1$/m);
  assert.match(artifact, /^final_verdict: safe-to-land$/m);
  assert.match(artifact, /^rationale: All required gates passed/m);
});

test("artifact create renders landing verdict work_item metadata", async () => {
  const repo = await createInitializedRepo();
  const artifact = await createLandingVerdictArtifact(repo);

  assert.match(artifact, /^work_item: BANDIT-001$/m);
});

test("artifact create renders parser-compatible operator input status", async () => {
  const repo = await createInitializedRepo();
  const artifact = await createLandingVerdictArtifact(repo, {
    operator_input_status: "none_required",
    landing_agent_state: "pass",
  });

  assert.match(artifact, /^operator_input_status: none_required$/m);

  const validateResult = await runBandit(repo, ["validate"]);
  assert.equal(validateResult.code, 0, validateResult.stderr);
});

test("artifact create renders parser-compatible landing agent state", async () => {
  const repo = await createInitializedRepo();
  const artifact = await createLandingVerdictArtifact(repo, {
    operator_input_status: "none_required",
    landing_agent_state: "pass"
  });

  assert.match(artifact, /^landing_agent_state: pass$/m);
  assert.match(artifact, /^landing_agent_replacement_evidence: not_applicable$/m);
  assert.match(artifact, /^final_verdict: safe-to-land$/m);

  const validateResult = await runBandit(repo, ["validate"]);
  assert.equal(validateResult.code, 0, validateResult.stderr);
});

test("artifact create creates a retrospective with durable dispositions", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Creation", "Landed");
  await writeSpec(repo, "docs/specs/retrospective.json", {
    kind: "retrospective",
    work_item: "BANDIT-001",
    outcome: "Artifact creation landed as a workflow-infrastructure chore.",
    what_worked: [
      "Explicit structured input kept artifact authorship auditable."
    ],
    lessons_and_dispositions: [
      {
        lesson: "Artifact creation must stay narrower than workflow authority.",
        disposition: "No-action decision",
        rationale: "The command writes artifacts but does not advance stages."
      }
    ],
    improvement_chores: "None.",
    cross_model_tension: "None.",
    bootstrap_gaps_remaining: [
      "BANDIT-GAP-HEARTBEAT-CHORE-AGENT",
      "BANDIT-GAP-WORKFLOW-COCKPIT"
    ]
  });

  const result = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/retrospective.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(
    result.stdout,
    /Created artifact: docs\/work\/BANDIT-001\/retrospective\.md/
  );

  const artifact = await readFile(
    path.join(repo, "docs/work/BANDIT-001/retrospective.md"),
    "utf8"
  );
  assert.match(artifact, /^# BANDIT-001 Retrospective$/m);
  assert.match(artifact, /^## Lessons And Dispositions$/m);
  assert.match(artifact, /Artifact creation must stay narrower than workflow authority/);
  assert.match(artifact, /^## Bootstrap Gaps Remaining$/m);
});

test("artifact create fails closed for unsupported kinds before writing files", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Creation", "Brief Created");
  await writeSpec(repo, "docs/specs/unsupported.json", {
    kind: "broad_dashboard_artifact",
    work_item: "BANDIT-001"
  });

  const result = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/unsupported.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Unsupported artifact spec kind: broad_dashboard_artifact/
  );
  assert.equal(
    await pathExists(path.join(repo, "docs/work/BANDIT-001/red-evidence.md")),
    false
  );
});

test("artifact create refuses occupied output paths before writing files", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Creation", "Brief Created");
  await writeFile(
    path.join(repo, "docs/work/BANDIT-001/red-evidence.md"),
    "existing evidence\n",
    "utf8"
  );
  await writeSpec(repo, "docs/specs/red-evidence.json", {
    kind: "red_evidence",
    work_item: "BANDIT-001",
    status: "pass",
    stage: "Stage 2: Test Design And RED Evidence",
    summary: "Do not overwrite existing evidence.",
    test_command: "node --test test/artifact-create.test.mjs",
    observed_output: ["tests 1", "pass 0", "fail 1"],
    acceptance_criteria_mapping: [
      {
        criterion: "The command refuses occupied output paths.",
        evidence: "Existing evidence must remain intact."
      }
    ],
    next_action: "Repair the caller input."
  });

  const result = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/red-evidence.json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Refusing to overwrite existing artifact path: docs\/work\/BANDIT-001\/red-evidence\.md/
  );
  assert.equal(
    await readFile(path.join(repo, "docs/work/BANDIT-001/red-evidence.md"), "utf8"),
    "existing evidence\n"
  );
});

test("artifact create refuses specs outside the repository", async () => {
  const repo = await createInitializedRepo();
  const outsideSpec = path.join(path.dirname(repo), "outside-artifact.json");
  await writeFile(
    outsideSpec,
    `${JSON.stringify(
      {
        kind: "red_evidence",
        work_item: "BANDIT-001"
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = await runBandit(repo, ["artifact", "create", outsideSpec]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Artifact spec path must stay within repository:/);
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

async function createLandingVerdictArtifact(repo, overrides = {}) {
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Creation", "Review Recorded");
  await writeSpec(repo, "docs/specs/landing-verdict.json", {
    kind: "landing_verdict",
    work_item: "BANDIT-001",
    contract_version: "1",
    source_head: "abc123",
    review_evidence: "docs/work/BANDIT-001/review-evidence.md",
    tests_status: "pass",
    clean_code_status: "pass",
    coderabbit_state: "pass",
    local_qwen_state: "pass",
    escalated_review_state: "not_applicable",
    uat_status: "not_applicable",
    source_drift_status: "current",
    operator_input_status: "No operator input required.",
    landing_agent_state: "local_record_supported",
    landing_agent_replacement_evidence: "not_applicable",
    final_verdict: "safe-to-land",
    rationale: "All required gates passed for workflow infrastructure.",
    ...overrides
  });

  const result = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/landing-verdict.json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.match(
    result.stdout,
    /Created artifact: docs\/work\/BANDIT-001\/landing-verdict\.md/
  );

  return readFile(
    path.join(repo, "docs/work/BANDIT-001/landing-verdict.md"),
    "utf8"
  );
}

async function writeSpec(repo, relativePath, spec) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
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
