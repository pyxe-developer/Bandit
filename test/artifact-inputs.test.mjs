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

test("artifact-inputs validation accepts explicit taxonomy classes", async () => {
  const repo = await createInitializedRepo();
  await writeJson(
    repo,
    ".bandit/policy/artifact-inputs.json",
    artifactInputTaxonomyPolicy()
  );

  const result = await runBandit(repo, ["artifact-inputs", "validate", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "pass");
  assert.deepEqual(
    payload.supported_classes.map((entry) => entry.class_id),
    [
      "work_or_gap_spec",
      "artifact_renderer_input",
      "reviewer_capture",
      "trust_snapshot_fixture"
    ]
  );
  assert.deepEqual(payload.preferred_directories, {
    work_or_gap_spec: "docs/specs",
    artifact_renderer_input: "docs/artifact-inputs",
    reviewer_capture: "docs/reviewer-captures",
    trust_snapshot_fixture: "docs/trust-snapshot-fixtures"
  });
});

test("artifact-inputs validation refuses ambiguous future docs/specs artifact renderer inputs", async () => {
  const repo = await createInitializedRepo();
  await writeJson(
    repo,
    ".bandit/policy/artifact-inputs.json",
    artifactInputTaxonomyPolicy({
      observed_inputs: [
        observedInput({
          path: "docs/specs/BANDIT-061-red-evidence.json",
          declared_class: "artifact_renderer_input",
          consumer: "bandit artifact create",
          legacy: false
        })
      ]
    })
  );

  const result = await runBandit(repo, ["artifact-inputs", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Ambiguous artifact input path: docs\/specs\/BANDIT-061-red-evidence\.json/
  );
  assert.match(result.stderr, /artifact_renderer_input inputs must use docs\/artifact-inputs/);
});

test("artifact create refuses future artifact-renderer inputs under docs/specs and accepts docs/artifact-inputs", async () => {
  const repo = await createInitializedRepo();
  await writeWorkBrief(repo, "BANDIT-001", "Artifact Inputs", "Brief Created");
  await writeJson(
    repo,
    ".bandit/policy/artifact-inputs.json",
    artifactInputTaxonomyPolicy()
  );
  await writeJson(
    repo,
    "docs/specs/BANDIT-001-red-evidence.json",
    redEvidenceSpec()
  );

  const ambiguousResult = await runBandit(repo, [
    "artifact",
    "create",
    "docs/specs/BANDIT-001-red-evidence.json"
  ]);

  assert.equal(ambiguousResult.code, 1);
  assert.match(
    ambiguousResult.stderr,
    /artifact_renderer_input inputs must use docs\/artifact-inputs/
  );
  assert.equal(
    await pathExists(path.join(repo, "docs/work/BANDIT-001/red-evidence.md")),
    false
  );

  await writeJson(
    repo,
    "docs/artifact-inputs/BANDIT-001-red-evidence.json",
    redEvidenceSpec()
  );

  const dedicatedResult = await runBandit(repo, [
    "artifact",
    "create",
    "docs/artifact-inputs/BANDIT-001-red-evidence.json"
  ]);

  assert.equal(dedicatedResult.code, 0, dedicatedResult.stderr);
  assert.match(
    dedicatedResult.stdout,
    /Created artifact: docs\/work\/BANDIT-001\/red-evidence\.md/
  );
  const rendered = await readFile(
    path.join(repo, "docs/work/BANDIT-001/red-evidence.md"),
    "utf8"
  );
  assert.match(rendered, /^# BANDIT-001 RED Evidence$/m);
});

test("artifact-inputs validation keeps historical docs/specs inputs readable without making them future defaults", async () => {
  const repo = await createInitializedRepo();
  await writeJson(
    repo,
    ".bandit/policy/artifact-inputs.json",
    artifactInputTaxonomyPolicy({
      observed_inputs: [
        observedInput({
          path: "docs/specs/BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT.json",
          declared_class: "work_or_gap_spec",
          consumer: "bandit repo-pm create-work-item",
          legacy: false
        }),
        observedInput({
          path: "docs/specs/BANDIT-059-red-evidence.json",
          declared_class: "artifact_renderer_input",
          consumer: "bandit artifact create",
          legacy: true
        }),
        observedInput({
          path: "docs/specs/BANDIT-059-coderabbit-review-output.json",
          declared_class: "reviewer_capture",
          consumer: "bandit coderabbit-review pre-pr",
          legacy: true
        }),
        observedInput({
          path: "docs/specs/snapshots/stage-transition.json",
          declared_class: "trust_snapshot_fixture",
          consumer: "bandit trust verify",
          legacy: true
        }),
        observedInput({
          path: "docs/reviewer-captures/BANDIT-061-coderabbit-review-output.json",
          declared_class: "reviewer_capture",
          consumer: "bandit coderabbit-review pre-pr",
          legacy: false
        }),
        observedInput({
          path: "docs/trust-snapshot-fixtures/stage-transition.json",
          declared_class: "trust_snapshot_fixture",
          consumer: "bandit trust verify",
          legacy: false
        })
      ]
    })
  );

  const result = await runBandit(repo, ["artifact-inputs", "validate", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "pass");
  assert.deepEqual(payload.legacy_readable_paths.sort(), [
    "docs/specs/BANDIT-059-coderabbit-review-output.json",
    "docs/specs/BANDIT-059-red-evidence.json",
    "docs/specs/snapshots/stage-transition.json"
  ]);
});

test("artifact-inputs validation fails closed for unsafe paths and class/name mismatches", async () => {
  const repo = await createInitializedRepo();
  await writeJson(
    repo,
    ".bandit/policy/artifact-inputs.json",
    artifactInputTaxonomyPolicy({
      observed_inputs: [
        observedInput({
          path: "../outside.json",
          declared_class: "artifact_renderer_input",
          consumer: "bandit artifact create",
          legacy: false
        }),
        observedInput({
          path: "docs/reviewer-captures/BANDIT-061-red-evidence.json",
          declared_class: "artifact_renderer_input",
          consumer: "bandit artifact create",
          legacy: false
        })
      ]
    })
  );

  const result = await runBandit(repo, ["artifact-inputs", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsafe artifact input path: \.\.\/outside\.json/);
  assert.match(
    result.stderr,
    /Artifact input class mismatch: docs\/reviewer-captures\/BANDIT-061-red-evidence\.json/
  );
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

function artifactInputTaxonomyPolicy(overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "artifact-input-directory-taxonomy",
    supported_classes: [
      artifactInputClass({
        class_id: "work_or_gap_spec",
        preferred_directory: "docs/specs",
        path_patterns: ["docs/specs/*.json"],
        owner_authority_role: "repo_pm",
        allowed_writer_stages: ["stage1_brief"],
        expected_consumers: [
          "bandit work-item create",
          "bandit repo-pm create-work-item"
        ],
        refusal_behavior:
          "docs/specs accepts only work-item and bootstrap-gap creation specs for future inputs."
      }),
      artifactInputClass({
        class_id: "artifact_renderer_input",
        preferred_directory: "docs/artifact-inputs",
        path_patterns: ["docs/artifact-inputs/*.json"],
        owner_authority_role: "test_writer",
        allowed_writer_stages: [
          "stage2_red_evidence",
          "stage3_implementation",
          "stage5_landing",
          "stage6_retrospective"
        ],
        expected_consumers: ["bandit artifact create"],
        refusal_behavior:
          "Future artifact-renderer inputs under docs/specs fail closed except legacy readable files."
      }),
      artifactInputClass({
        class_id: "reviewer_capture",
        preferred_directory: "docs/reviewer-captures",
        path_patterns: ["docs/reviewer-captures/*.json"],
        owner_authority_role: "reviewer",
        allowed_writer_stages: ["stage4_review"],
        expected_consumers: [
          "bandit coderabbit-review pre-pr",
          "bandit qwen-review"
        ],
        refusal_behavior:
          "Reviewer/provider captures must not be treated as artifact-renderer command inputs."
      }),
      artifactInputClass({
        class_id: "trust_snapshot_fixture",
        preferred_directory: "docs/trust-snapshot-fixtures",
        path_patterns: ["docs/trust-snapshot-fixtures/*.json"],
        owner_authority_role: "codex_pm",
        allowed_writer_stages: ["stage2_red_evidence"],
        expected_consumers: ["bandit trust verify"],
        refusal_behavior:
          "Trust snapshot fixtures must not be treated as work-item specs or generated artifact inputs."
      })
    ],
    legacy_compatibility: [
      {
        class_id: "artifact_renderer_input",
        path_patterns: [
          "docs/specs/*-red-evidence.json",
          "docs/specs/*-implementation-evidence.json",
          "docs/specs/*-landing-verdict.json",
          "docs/specs/*-retrospective.json"
        ],
        status: "legacy_readable_only"
      },
      {
        class_id: "reviewer_capture",
        path_patterns: ["docs/specs/*coderabbit-review-output*.json"],
        status: "legacy_readable_only"
      },
      {
        class_id: "trust_snapshot_fixture",
        path_patterns: ["docs/specs/snapshots/*.json"],
        status: "legacy_readable_only"
      }
    ],
    observed_inputs: [],
    refusal_behavior: {
      ambiguous_future_docs_specs: "blocker",
      unsafe_path: "blocker",
      class_name_mismatch: "blocker",
      unsupported_directory: "blocker"
    },
    ...overrides
  };
}

function artifactInputClass(overrides) {
  return {
    description: `${overrides.class_id} input class`,
    ...overrides
  };
}

function observedInput(overrides) {
  return {
    path: "",
    declared_class: "",
    consumer: "",
    legacy: false,
    ...overrides
  };
}

function redEvidenceSpec() {
  return {
    kind: "red_evidence",
    work_item: "BANDIT-001",
    status: "pass",
    stage: "Stage 2: Test Design And RED Evidence",
    summary:
      "Focused RED tests define artifact-input path semantics before implementation.",
    test_command: "node --test test/artifact-inputs.test.mjs",
    observed_output: ["tests 5", "pass 0", "fail 5"],
    acceptance_criteria_mapping: [
      {
        criterion: "Artifact renderer inputs use a dedicated path.",
        evidence:
          "The RED test refuses future artifact renderer inputs under docs/specs."
      }
    ],
    next_action: "Implement artifact-input taxonomy enforcement."
  };
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
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
