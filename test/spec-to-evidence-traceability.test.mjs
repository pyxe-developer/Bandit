import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const workItemId = "BANDIT-999";
const policyPath = ".bandit/policy/spec-to-evidence-traceability.json";

test("spec-to-evidence validate emits deterministic read-only traceability output", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteTraceabilityEvidence(repo);
  await writeLiveStateSentinels(repo);
  const before = await readLiveStateSentinels(repo);

  const first = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId,
    "--json"
  ]);
  const second = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId,
    "--json"
  ]);
  const after = await readLiveStateSentinels(repo);

  assert.equal(first.code, 0, first.stderr);
  assert.equal(second.code, 0, second.stderr);
  assert.deepEqual(after, before);
  assert.equal(first.stdout, second.stdout);

  const report = JSON.parse(first.stdout);
  assert.equal(report.status, "pass");
  assert.equal(report.work_item, workItemId);
  assert.equal(report.policy, policyPath);
  assert.equal(report.covered_risk_tier, "bootstrap_chore");
  assert.deepEqual(report.acceptance_criteria.map((entry) => entry.id), [
    "AC1",
    "AC2",
    "AC3"
  ]);
  assert.equal(report.acceptance_criteria[0].evidence_type, "behavior_test");
  assert.equal(report.acceptance_criteria[1].evidence_type, "command");
  assert.equal(report.acceptance_criteria[2].disposition, "bootstrap_gap");
  assert.equal(report.read_only.no_landing_authority, true);
  assert.equal(report.read_only.no_trust_verifier_cutover, true);
  assert.equal(report.read_only.no_acceptance_criteria_mutation, true);
  assert.equal(report.policy_versions["spec-to-evidence-traceability"], 1);
});

test("spec-to-evidence validate rejects acceptance criteria without concrete mappings", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteTraceabilityEvidence(repo, {
    matrix: {
      traceability: [
        behaviorEvidence("AC1", {
          criterion: "Covered work items cannot land without mappings."
        })
      ]
    }
  });

  const result = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId,
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing traceability mapping: AC2/);
  assert.match(result.stderr, /missing traceability mapping: AC3/);
});

test("spec-to-evidence validate rejects vague or unsupported evidence mappings", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteTraceabilityEvidence(repo, {
    matrix: {
      traceability: [
        behaviorEvidence("AC1", {
          criterion: "Covered work items cannot land without mappings.",
          source_artifacts: ["test/spec-to-evidence-traceability.test.mjs"],
          evidence_summary: "tests exist"
        }),
        {
          criterion_id: "AC2",
          criterion:
            "Review evidence asks whether mapped artifacts prove behavior.",
          evidence_type: "line_coverage",
          source_artifacts: ["coverage/lcov.info"],
          evidence_summary: "coverage is high"
        },
        bootstrapGapDisposition("AC3")
      ]
    }
  });

  const result = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /vague traceability evidence: AC1/);
  assert.match(result.stderr, /unsupported evidence type: line_coverage/);
});

test("spec-to-evidence validate refuses implementation detail as behavior proof without rationale", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteTraceabilityEvidence(repo, {
    matrix: {
      traceability: [
        {
          criterion_id: "AC1",
          criterion: "Covered work items cannot land without mappings.",
          evidence_type: "implementation_detail",
          source_artifacts: ["src/state/spec-to-evidence-traceability.ts"],
          evidence_summary:
            "Implementation checks traceability before landing."
        },
        commandEvidence("AC2"),
        bootstrapGapDisposition("AC3")
      ]
    }
  });

  const result = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /implementation-detail evidence cannot prove behavior without explicit rationale: AC1/
  );
});

test("spec-to-evidence validate accepts explicit dispositions only with concrete rationale", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteTraceabilityEvidence(repo, {
    matrix: {
      traceability: [
        behaviorEvidence("AC1", {
          criterion: "Covered work items cannot land without mappings."
        }),
        commandEvidence("AC2"),
        {
          criterion_id: "AC3",
          criterion:
            "Traceability output distinguishes explicit no-action/bootstrap dispositions.",
          disposition: "no_action",
          rationale: "n/a",
          source_artifacts: ["docs/work/BANDIT-999/brief.md"]
        }
      ]
    }
  });

  const result = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /disposition rationale is too vague: AC3/);
});

test("review evidence template requires traceability-quality inspection", async () => {
  const template = await readFile(
    path.resolve("docs/templates/review-evidence.md"),
    "utf8"
  );

  assert.match(template, /^traceability_state:/im);
  assert.match(template, /^traceability_quality:/im);
  assert.match(template, /^traceability_disposition:/im);
});

test("spec-to-evidence validate supports existing chore briefs with prose acceptance bullets", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteTraceabilityEvidence(repo, {
    brief: `# ${workItemId}: Existing Brief Fixture

work_type: chore

## Acceptance Criteria

- Covered work items cannot land without mappings.
- Review evidence asks whether mapped artifacts prove behavior.
- Traceability output distinguishes explicit no-action/bootstrap dispositions.
`
  });

  const result = await runBandit(repo, [
    "spec-to-evidence",
    "validate",
    workItemId,
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.covered_risk_tier, "bootstrap_chore");
  assert.deepEqual(report.acceptance_criteria.map((entry) => entry.id), [
    "AC1",
    "AC2",
    "AC3"
  ]);
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit/policy"), { recursive: true });
  await mkdir(path.join(repo, "docs/work", workItemId), { recursive: true });
  await mkdir(path.join(repo, "docs/templates"), { recursive: true });
  await mkdir(path.join(repo, "src"), { recursive: true });
  return repo;
}

async function writeCompleteTraceabilityEvidence(repo, options = {}) {
  await writeJson(repo, policyPath, options.policy ?? completePolicy());
  await writeFile(
    path.join(repo, "docs/templates/spec-to-evidence-traceability.md"),
    `# Spec-To-Evidence Traceability Matrix

criterion_id:
criterion:
evidence_type:
source_artifacts:
evidence_summary:
disposition:
rationale:
`,
    "utf8"
  );
  await writeFile(
    path.join(repo, `docs/work/${workItemId}/brief.md`),
    options.brief ??
      `# ${workItemId}: Traceability Fixture

work_type: chore
risk_tier: bootstrap_chore

## Acceptance Criteria

- AC1: Covered work items cannot land without mappings.
- AC2: Review evidence asks whether mapped artifacts prove behavior.
- AC3: Traceability output distinguishes explicit no-action/bootstrap dispositions.
`,
    "utf8"
  );
  await writeJson(
    repo,
    `docs/work/${workItemId}/spec-to-evidence-traceability.json`,
    options.matrix ?? completeMatrix()
  );
  await writeFile(
    path.join(repo, "test-output.txt"),
    "node --test test/spec-to-evidence-traceability.test.mjs passed\n",
    "utf8"
  );
  await writeFile(
    path.join(repo, "src/source-subject.ts"),
    "export const value = 1;\n",
    "utf8"
  );
}

function completePolicy() {
  return {
    contract_version: 1,
    policy_id: "spec-to-evidence-traceability",
    version: 1,
    covered_risk_tiers: ["bootstrap_chore", "low", "material"],
    required_fields: [
      "criterion_id",
      "criterion",
      "source_artifacts",
      "evidence_summary"
    ],
    supported_evidence_types: [
      "behavior_test",
      "command",
      "invariant",
      "uat",
      "reviewer",
      "replay",
      "implementation_detail"
    ],
    disposition_values: ["none", "bootstrap_gap", "no_action"],
    authority: {
      read_only: true,
      can_mutate_acceptance_criteria: false,
      can_replace_landing_authority: false,
      can_approve_trust_verifier_cutover: false
    }
  };
}

function completeMatrix() {
  return {
    contract_version: 1,
    work_item: workItemId,
    traceability: [
      behaviorEvidence("AC1", {
        criterion: "Covered work items cannot land without mappings."
      }),
      commandEvidence("AC2"),
      bootstrapGapDisposition("AC3")
    ]
  };
}

function behaviorEvidence(criterionId, overrides = {}) {
  return {
    criterion_id: criterionId,
    criterion:
      "Covered acceptance criteria map to behavior tests before landing.",
    evidence_type: "behavior_test",
    source_artifacts: ["test/spec-to-evidence-traceability.test.mjs"],
    evidence_summary:
      "Focused behavior test exercises the public CLI refusal path for unmapped acceptance criteria.",
    disposition: "none",
    ...overrides
  };
}

function commandEvidence(criterionId) {
  return {
    criterion_id: criterionId,
    criterion: "Review evidence asks whether mapped artifacts prove behavior.",
    evidence_type: "command",
    source_artifacts: ["test-output.txt"],
    evidence_summary:
      "Command evidence records focused test execution for traceability validation.",
    disposition: "none"
  };
}

function bootstrapGapDisposition(criterionId) {
  return {
    criterion_id: criterionId,
    criterion:
      "Traceability output distinguishes explicit no-action/bootstrap dispositions.",
    disposition: "bootstrap_gap",
    rationale:
      "Bootstrap fixture records this criterion as accepted replacement evidence because the final landing gate integration is added by the implementation slice.",
    source_artifacts: [`docs/work/${workItemId}/brief.md`]
  };
}

async function writeLiveStateSentinels(repo) {
  await writeFile(path.join(repo, "src/source-subject.ts"), "export const value = 1;\n", "utf8");
  await writeFile(path.join(repo, "docs/work", workItemId, "brief.md"), await readFile(path.join(repo, "docs/work", workItemId, "brief.md"), "utf8"), "utf8");
}

async function readLiveStateSentinels(repo) {
  return {
    source: await readFile(path.join(repo, "src/source-subject.ts"), "utf8"),
    brief: await readFile(path.join(repo, "docs/work", workItemId, "brief.md"), "utf8")
  };
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
