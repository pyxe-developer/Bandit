import assert from "node:assert/strict";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

const evidencePolicyPath = ".bandit/policy/evidence-freshness-slos.json";
const evidenceTemplatePath = "docs/templates/evidence-freshness-slos.md";

test("evidence-freshness-slos validation accepts a complete SLO policy", async () => {
  const repo = await createInitializedEvidenceRepo();
  await writeCompleteEvidenceFixture(repo);

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: evidencePolicyPath,
    artifact_types: [
      "tests",
      "coderabbit_review",
      "local_qwen_review",
      "landing_verdict",
      "derived_projection"
    ],
    trust_signal_requirements: [
      "source_artifacts",
      "owner_or_authority_role",
      "freshness_state",
      "staleness_reason"
    ],
    derived_projections: ["cockpit_status", "session_context"]
  });
});

test("evidence-freshness-slos validation rejects trusted evidence without source or owner", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  delete policy.artifact_types[0].source_artifacts;
  delete policy.artifact_types[0].owner;
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /evidence freshness SLO tests requires source artifact and owner or authority role/
  );
});

test("evidence-freshness-slos validation rejects missing artifact type definitions", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  delete policy.artifact_types;
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /artifact_types must define required trusted evidence types/
  );
});

test("evidence-freshness-slos validation rejects incomplete trust signal requirements", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.trust_signal_requirements = [
    "source_artifacts",
    "freshness_state",
    "staleness_reason"
  ];
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /missing required trust_signal_requirements: owner_or_authority_role/
  );
});

test("evidence-freshness-slos validation rejects malformed trust signal requirements", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.trust_signal_requirements = [
    "source_artifacts",
    "owner_or_authority_role",
    42,
    "freshness_state",
    "staleness_reason"
  ];
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /trust_signal_requirements entries must be non-empty strings/
  );
});

test("evidence-freshness-slos validation normalizes artifact type ids", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.artifact_types[0].id = " tests ";
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.artifact_types[0], "tests");
});

test("evidence-freshness-slos validation reports invalid contract version distinctly", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.contract_version = 2;
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Malformed evidence freshness SLO policy: contract_version must be 1/
  );
});

test("evidence-freshness-slos validation accepts an indented template hierarchy", async () => {
  const repo = await createInitializedEvidenceRepo();
  await writeCompleteEvidenceFixture(repo, {
    template: `# Evidence Freshness SLOs

work_item:
  policy:
    artifact_types:
      - id:
        source_artifacts:
    trust_signal_requirements:
      - source_artifacts
    derived_projection_rules:
      - projection:
        source_artifacts:
        dependent_evidence:
        propagate_missing_or_stale_dependencies:
        cannot_upgrade_missing_dependency_to_trusted:
    source_artifacts:
      - docs/work/BANDIT-056/brief.md
`
  });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
});

test("evidence-freshness-slos validation rejects missing freshness states", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.artifact_types[1].allowed_freshness_states = ["current"];
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /freshness states must include current, stale, and missing for trusted evidence signals/
  );
});

test("evidence-freshness-slos validation rejects missing staleness reasons", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.artifact_types[2].staleness_reasons = [];
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /trusted evidence signals require explicit staleness reason behavior/
  );
});

test("evidence-freshness-slos validation rejects derived projections that hide stale dependencies", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.derived_projection_rules[0].propagate_missing_or_stale_dependencies = false;
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /derived projections must propagate missing or stale source dependencies and cannot upgrade them to trusted status/
  );
});

test("evidence-freshness-slos validation rejects derived projections that upgrade missing dependencies", async () => {
  const repo = await createInitializedEvidenceRepo();
  const policy = completeEvidenceFreshnessPolicy();
  policy.derived_projection_rules[0].cannot_upgrade_missing_dependency_to_trusted = false;
  await writeCompleteEvidenceFixture(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-freshness-slos",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /derived projections must propagate missing or stale source dependencies and cannot upgrade them to trusted status/
  );
});

test("cockpit status exposes evidence trust signals for gate dependencies", async () => {
  const repo = await createProjectionEvidenceRepo();

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.ok(status.evidence_trust_signals, "missing evidence trust signals");
  assert.equal(status.evidence_trust_signals.authority, "derived_non_canonical");
  assert.deepEqual(status.evidence_trust_signals.gates.stage_2_red_evidence, {
    artifact_type: "red_evidence",
    source: "docs/work/BANDIT-056/red-evidence.md",
    owner_or_authority_role: "test_writer",
    freshness_state: "current",
    staleness_reason: "none",
    evidence_slo: evidencePolicyPath
  });
});

test("cockpit status exposes stale review evidence in gate trust signals", async () => {
  const repo = await createProjectionEvidenceRepo();
  await writeFileAt(
    repo,
    "docs/work/BANDIT-056/review-evidence.md",
    [
      "# Review Evidence",
      "source_drift_status: current",
      "review_subject_hash_status: stale"
    ].join("\n")
  );

  const result = await runBandit(repo, ["cockpit", "status", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.deepEqual(status.evidence_trust_signals.gates.stage_4_review, {
    artifact_type: "review_evidence",
    source: "docs/work/BANDIT-056/review-evidence.md",
    owner_or_authority_role: "reviewer",
    freshness_state: "stale",
    staleness_reason: "review_subject_hash_drift",
    evidence_slo: evidencePolicyPath
  });
});

test("session-context exposes stale review evidence as a trust-signal dependency", async () => {
  const repo = await createProjectionEvidenceRepo({
    currentStage: "Stage 4: Review And Cross-Model Gates",
    nextAction: "Stage 4 review for BANDIT-056."
  });
  await writeFileAt(
    repo,
    "docs/work/BANDIT-056/implementation-evidence.md",
    "# Implementation Evidence\n"
  );
  await writeFileAt(
    repo,
    "docs/work/BANDIT-056/review-evidence.md",
    [
      "# Review Evidence",
      "source_drift_status: current",
      "review_subject_hash_status: stale"
    ].join("\n")
  );

  const result = await runBandit(repo, ["session-context", "current", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const packet = JSON.parse(result.stdout);
  assert.ok(packet.evidence_trust_signals, "missing evidence trust signals");
  assert.deepEqual(packet.evidence_trust_signals.dependencies, [
    {
      artifact_type: "review_evidence",
      source: "docs/work/BANDIT-056/review-evidence.md",
      owner_or_authority_role: "reviewer",
      freshness_state: "stale",
      staleness_reason: "review_subject_hash_drift",
      evidence_slo: evidencePolicyPath
    }
  ]);
});

test("session-context exposes stale or missing evidence as trust-signal dependencies", async () => {
  const repo = await createProjectionEvidenceRepo({ omitRedEvidence: true });

  const result = await runBandit(repo, ["session-context", "current", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const packet = JSON.parse(result.stdout);
  assert.ok(packet.evidence_trust_signals, "missing evidence trust signals");
  assert.equal(packet.evidence_trust_signals.authority, "derived_non_canonical");
  assert.deepEqual(packet.evidence_trust_signals.dependencies, [
    {
      artifact_type: "red_evidence",
      source: "docs/work/BANDIT-056/red-evidence.md",
      owner_or_authority_role: "test_writer",
      freshness_state: "missing",
      staleness_reason: "missing_required_stage_evidence",
      evidence_slo: evidencePolicyPath
    }
  ]);
});

async function createInitializedEvidenceRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  return repo;
}

async function createProjectionEvidenceRepo(options = {}) {
  const repo = await createInitializedEvidenceRepo();
  await writeCompleteEvidenceFixture(repo, options);
  await writeFileAt(repo, "AGENTS.md", "# AGENTS\n");
  await writeFileAt(repo, "CLEAN_CODE.md", "# CLEAN_CODE\n");
  await writeFileAt(repo, "docs/verification/STAGE_RUBRICS.md", "# Stage Rubrics\n");
  await writeWorkBrief(
    repo,
    "BANDIT-056",
    "Evidence Freshness SLOs",
    "RED Evidence Recorded"
  );
  if (!options.omitRedEvidence) {
    await writeFileAt(repo, "docs/work/BANDIT-056/red-evidence.md", "# RED Evidence\n");
  }
  await writeFileAt(repo, "docs/roadmap/CURRENT_CONTEXT.md", currentContextFixture(options));
  await writeFileAt(repo, "docs/roadmap/ROADMAP.md", roadmapFixture(options));
  await writeJson(repo, ".bandit/bootstrap-gaps.json", {
    gaps: [
      {
        id: "BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS",
        title: "Cockpit trust signals lack artifact-specific evidence freshness SLOs",
        status: "active",
        disposition: "active_chore",
        linked_work_item: "BANDIT-056",
        source_artifacts: ["docs/work/BANDIT-056/brief.md"],
        rationale: "Evidence trust signals need explicit SLOs.",
        next_action: "Complete active chore BANDIT-056."
      }
    ]
  });
  return repo;
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeCompleteEvidenceFixture(repo, options = {}) {
  await writeJson(
    repo,
    evidencePolicyPath,
    options.policy ?? completeEvidenceFreshnessPolicy()
  );
  await writeFileAt(
    repo,
    evidenceTemplatePath,
    options.template ?? `# Evidence Freshness SLOs

work_item:
  policy:
    artifact_types:
      - id:
        source_artifacts:
    trust_signal_requirements:
      - source_artifacts
    derived_projection_rules:
      - projection:
        source_artifacts:
        dependent_evidence:
        propagate_missing_or_stale_dependencies:
        cannot_upgrade_missing_dependency_to_trusted:
    source_artifacts:
      - docs/work/BANDIT-056/brief.md
`
  );
}

function completeEvidenceFreshnessPolicy() {
  return {
    contract_version: 1,
    policy_id: "evidence-freshness-slos",
    artifact_types: [
      artifactType({
        id: "tests",
        owner: "test_writer",
        source_artifacts: ["test/evidence-freshness-slos.test.mjs"],
        staleness_reasons: ["source_drift", "missing_required_stage_evidence"]
      }),
      artifactType({
        id: "coderabbit_review",
        authority_role: "reviewer",
        source_artifacts: ["docs/work/<ID>/coderabbit-review.md"],
        freshness_budget: {
          kind: "review_subject_hash",
          source_identity: "current_review_subject_hash"
        },
        staleness_reasons: ["review_subject_hash_drift", "provider_refusal"]
      }),
      artifactType({
        id: "local_qwen_review",
        authority_role: "reviewer",
        source_artifacts: ["docs/work/<ID>/local-qwen-review.md"],
        freshness_budget: {
          kind: "review_subject_hash",
          source_identity: "current_review_subject_hash"
        },
        staleness_reasons: ["review_subject_hash_drift", "missing_review"]
      }),
      artifactType({
        id: "landing_verdict",
        authority_role: "landing_agent",
        source_artifacts: ["docs/work/<ID>/landing-verdict.md"],
        staleness_reasons: ["source_drift", "missing_landing_action"]
      }),
      artifactType({
        id: "derived_projection",
        authority_role: "codex_pm",
        source_artifacts: [
          "docs/roadmap/CURRENT_CONTEXT.md",
          "docs/roadmap/ROADMAP.md"
        ],
        staleness_reasons: [
          "missing_dependency",
          "stale_dependency",
          "projection_source_disagreement"
        ]
      })
    ],
    trust_signal_requirements: [
      "source_artifacts",
      "owner_or_authority_role",
      "freshness_state",
      "staleness_reason"
    ],
    derived_projection_rules: [
      {
        projection: "cockpit_status",
        authority: "derived_non_canonical",
        source_artifacts: [
          "docs/roadmap/CURRENT_CONTEXT.md",
          "docs/roadmap/ROADMAP.md"
        ],
        dependent_evidence: ["docs/work/<ID>/red-evidence.md"],
        propagate_missing_or_stale_dependencies: true,
        cannot_upgrade_missing_dependency_to_trusted: true
      },
      {
        projection: "session_context",
        authority: "derived_non_canonical",
        source_artifacts: [
          "AGENTS.md",
          "docs/roadmap/CURRENT_CONTEXT.md",
          "docs/roadmap/ROADMAP.md"
        ],
        dependent_evidence: ["docs/work/<ID>/red-evidence.md"],
        propagate_missing_or_stale_dependencies: true,
        cannot_upgrade_missing_dependency_to_trusted: true
      }
    ]
  };
}

function artifactType(overrides) {
  return {
    id: overrides.id,
    owner: overrides.owner,
    authority_role: overrides.authority_role,
    source_artifacts: overrides.source_artifacts,
    freshness_budget: overrides.freshness_budget ?? {
      kind: "source_identity",
      source_identity: "current_head"
    },
    allowed_freshness_states: ["current", "stale", "missing"],
    staleness_reasons: overrides.staleness_reasons,
    missing_evidence_behavior: "fail_closed"
  };
}

function currentContextFixture(options = {}) {
  const nextAction = options.nextAction ?? "Stage 2 RED evidence for BANDIT-056.";
  const currentStage = options.currentStage ?? "Stage 2: Test Design And RED Evidence";

  return `# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

**Current next action:** ${nextAction}

## Active Work

**Active work item:** \`BANDIT-056\` - Evidence Freshness SLOs.
The current stage is ${currentStage}.

## Required Operator Input

No operator-owned input is required.
`;
}

function roadmapFixture(options = {}) {
  const nextAction = options.nextAction ?? "Stage 2 RED evidence for BANDIT-056.";

  return `# Roadmap

**Current phase:** Phase 8 - Workflow Cockpit kickoff.

## Current Work Item

- \`[Gap]\` \`BANDIT-056\` - Evidence Freshness SLOs

**Current next step:** ${nextAction}
`;
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
