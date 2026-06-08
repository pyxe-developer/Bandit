import assert from "node:assert/strict";
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

test("validate --json reports pass when covered projections agree under harmless perturbations", async () => {
  const repo = await createInitializedRepo();
  await writeMetamorphicPolicy(repo, {
    covered_projections: [
      projection("cockpit-status", {
        active_work_item: "BANDIT-074",
        current_stage: "Stage 2: Test Design And RED Evidence",
        next_action:
          "Write Stage 2 RED evidence for BANDIT-074 before implementation.",
        required_operator_input: "none_required",
        queued_gaps: [
          "BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS",
          "BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION"
        ],
        gate_verdicts: {
          stage_1_brief: "pass",
          stage_2_red_evidence: "missing"
        }
      }),
      projection("session-context", {
        active_work_item: "BANDIT-074",
        current_stage: "Stage 2: Test Design And RED Evidence",
        next_action:
          "Write Stage 2 RED evidence for BANDIT-074 before implementation.",
        required_operator_input: "none_required",
        queued_gaps: [
          "BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS",
          "BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION"
        ],
        gate_verdicts: {
          stage_2_red_evidence: "missing",
          stage_1_brief: "pass"
        }
      })
    ],
    harmless_perturbations: [
      {
        id: "roadmap-whitespace-equivalence",
        source_projection: "cockpit-status",
        perturbation_type: "whitespace",
        claims: {
          active_work_item: " BANDIT-074 ",
          current_stage: "Stage 2:   Test Design And RED Evidence",
          next_action:
            "Write Stage 2 RED evidence for BANDIT-074 before implementation.",
          required_operator_input: "none_required",
          queued_gaps: [
            "BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS",
            "BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION"
          ],
          gate_verdicts: {
            stage_2_red_evidence: "missing",
            stage_1_brief: "pass"
          }
        }
      }
    ]
  });

  const result = await runBandit(repo, ["validate", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).metamorphic_cross_projection_checks, {
    status: "pass",
    policy: ".bandit/policy/metamorphic-cross-projection-checks.json",
    covered_projection_count: 2,
    harmless_perturbation_count: 1,
    trust_relevant_fields: [
      "active_work_item",
      "current_stage",
      "next_action",
      "required_operator_input",
      "queued_gaps",
      "gate_verdicts"
    ]
  });
});

test("validate fails closed when covered projections disagree on trust-relevant claims", async () => {
  const repo = await createInitializedRepo();
  await writeMetamorphicPolicy(repo, {
    covered_projections: [
      projection("cockpit-status", {
        active_work_item: "BANDIT-074",
        current_stage: "Stage 2: Test Design And RED Evidence",
        next_action:
          "Write Stage 2 RED evidence for BANDIT-074 before implementation.",
        required_operator_input: "none_required",
        queued_gaps: ["BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS"],
        gate_verdicts: {
          stage_1_brief: "pass",
          stage_2_red_evidence: "missing"
        }
      }),
      projection("session-context", {
        active_work_item: "BANDIT-074",
        current_stage: "Stage 2: Test Design And RED Evidence",
        next_action: "Dispatch Stage 3 implementation for BANDIT-074.",
        required_operator_input: "none_required",
        queued_gaps: ["BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS"],
        gate_verdicts: {
          stage_1_brief: "pass",
          stage_2_red_evidence: "missing"
        }
      })
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /metamorphic cross-projection checks/i);
  assert.match(result.stderr, /projection disagreement/i);
  assert.match(result.stderr, /session-context/);
  assert.match(result.stderr, /next_action/);
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const result = await runBandit(repo, ["init"]);
  assert.equal(result.code, 0, result.stderr);
  await copyTemplateFixtures(repo);
  await copyReviewerFixtures(repo);
  await copyPolicyFixtures(repo);
  return repo;
}

async function copyTemplateFixtures(repo) {
  const sourceDir = path.join(repoRoot, "docs/templates");
  const fileNames = await readdir(sourceDir);
  await mkdir(path.join(repo, "docs/templates"), { recursive: true });
  for (const fileName of fileNames.filter((name) => name.endsWith(".md"))) {
    await copyFile(
      path.join(sourceDir, fileName),
      path.join(repo, "docs/templates", fileName)
    );
  }
}

async function copyReviewerFixtures(repo) {
  await mkdir(path.join(repo, ".bandit/reviewers"), { recursive: true });
  await copyFile(
    path.join(repoRoot, ".bandit/reviewers/local-qwen.json"),
    path.join(repo, ".bandit/reviewers/local-qwen.json")
  );
}

async function copyPolicyFixtures(repo) {
  await mkdir(path.join(repo, ".bandit/policy"), { recursive: true });
  await copyFile(
    path.join(repoRoot, ".bandit/policy/smell-triggers.json"),
    path.join(repo, ".bandit/policy/smell-triggers.json")
  );
}

function projection(id, claims) {
  return {
    id,
    source_artifact: `docs/projections/${id}.json`,
    claims
  };
}

async function writeMetamorphicPolicy(repo, overrides = {}) {
  await writeJson(repo, ".bandit/policy/metamorphic-cross-projection-checks.json", {
    version: 1,
    command_version: 1,
    canonical_sources: [
      "docs/roadmap/CURRENT_CONTEXT.md",
      "docs/roadmap/ROADMAP.md",
      ".bandit/bootstrap-gaps.json",
      "docs/work/BANDIT-074/coordination-log.jsonl"
    ],
    covered_projection_ids: ["cockpit-status", "session-context"],
    trust_relevant_fields: [
      "active_work_item",
      "current_stage",
      "next_action",
      "required_operator_input",
      "queued_gaps",
      "gate_verdicts"
    ],
    acceptable_differences: [
      {
        field: "current_stage",
        difference: "whitespace",
        rationale: "Markdown wrapping may change whitespace without changing stage semantics."
      },
      {
        field: "gate_verdicts",
        difference: "json_object_key_order",
        rationale: "JSON object key order is not semantically meaningful."
      }
    ],
    covered_projections: overrides.covered_projections ?? [],
    harmless_perturbations: overrides.harmless_perturbations ?? []
  });
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
