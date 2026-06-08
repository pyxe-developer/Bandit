import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const policyPath = ".bandit/policy/evidence-bundle-attestation.json";
const workItemId = "BANDIT-999";

test("evidence-bundle attest emits deterministic read-only bundle output for a complete chore", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteBundleEvidence(repo);
  await writeLiveStateSentinels(repo);
  const before = await readLiveStateSentinels(repo);

  const first = await runBandit(repo, [
    "evidence-bundle",
    "attest",
    workItemId,
    "--json"
  ]);
  const second = await runBandit(repo, [
    "evidence-bundle",
    "attest",
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
  assert.match(report.bundle_hash, /^[a-f0-9]{64}$/);
  assert.deepEqual(report.bundle_membership, [
    "source_subject",
    "red_evidence",
    "test_evidence",
    "implementation_evidence",
    "review_evidence",
    "risk_classification",
    "supply_chain_gate",
    "uat",
    "landing_verdict",
    "landing_action",
    "policy_versions",
    "command_versions",
    "freshness_metadata"
  ]);
  assert.equal(report.evidence.red_evidence.freshness_state, "current");
  assert.equal(report.evidence.review_evidence.freshness_state, "current");
  assert.equal(report.evidence.uat.applicability, "not_applicable");
  assert.equal(report.read_only.no_gate_authority_replacement, true);
  assert.equal(report.read_only.no_trust_verifier_cutover, true);
  assert.equal(report.command_versions["evidence-bundle"], 1);
  assert.equal(report.policy_versions["evidence-bundle-attestation"], 1);
});

test("evidence-bundle attest rejects missing required bundle inputs", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteBundleEvidence(repo, {
    omitWorkArtifacts: ["review-evidence.md"]
  });

  const result = await runBandit(repo, [
    "evidence-bundle",
    "attest",
    workItemId,
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /missing required bundle input: docs\/work\/BANDIT-999\/review-evidence\.md/
  );
});

test("evidence-bundle attest rejects stale or changed-after-review evidence", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteBundleEvidence(repo, {
    reviewEvidence: {
      review_subject_hash: "old-review-subject-hash",
      source_head: "0000000",
      freshness_state: "stale",
      staleness_reason: "source_changed_after_review"
    }
  });

  const result = await runBandit(repo, [
    "evidence-bundle",
    "attest",
    workItemId
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /stale bundle input: review_evidence/);
  assert.match(result.stderr, /source_changed_after_review/);
});

test("evidence-bundle attest rejects unsupported and mismatched landing evidence", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteBundleEvidence(repo, {
    landingVerdict: {
      verdict: "blocked",
      review_subject_hash: "different-review-subject-hash",
      freshness_state: "current"
    }
  });

  const result = await runBandit(repo, [
    "evidence-bundle",
    "attest",
    workItemId
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /landing verdict mismatch/);
  assert.match(result.stderr, /review_subject_hash/);
});

test("evidence-bundle attest requires UAT only when the work item is product-facing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteBundleEvidence(repo, {
    workType: "slice",
    uat: {
      applicability: "required",
      freshness_state: "missing",
      source_artifacts: []
    }
  });

  const result = await runBandit(repo, [
    "evidence-bundle",
    "attest",
    workItemId,
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing required bundle input: UAT evidence/);
});

test("evidence-bundle policy rejects authority expansion and optional required-evidence omission", async () => {
  const repo = await createInitializedRepo();
  const policy = completeBundlePolicy();
  policy.authority.read_only = false;
  policy.authority.can_replace_landing_authority = true;
  policy.evidence_types = policy.evidence_types.filter(
    (type) => type.id !== "risk_classification"
  );
  await writeCompleteBundleEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "evidence-bundle",
    "attest",
    workItemId
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /evidence bundle attestation must be read-only and cannot replace gate authority/
  );
  assert.match(
    result.stderr,
    /missing required evidence type: risk_classification/
  );
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit/policy"), { recursive: true });
  await mkdir(path.join(repo, ".bandit/policy/risk-classifications"), {
    recursive: true
  });
  await mkdir(path.join(repo, ".bandit/policy/supply-chain-gates"), {
    recursive: true
  });
  await mkdir(path.join(repo, "docs/work", workItemId), { recursive: true });
  await mkdir(path.join(repo, "docs/artifact-inputs"), { recursive: true });
  await mkdir(path.join(repo, "src"), { recursive: true });
  return repo;
}

async function writeCompleteBundleEvidence(repo, options = {}) {
  const policy = options.policy ?? completeBundlePolicy();
  const workType = options.workType ?? "chore";
  const omitWorkArtifacts = new Set(options.omitWorkArtifacts ?? []);
  const reviewSubjectHash =
    "1111111111111111111111111111111111111111111111111111111111111111";

  await writeJson(repo, policyPath, policy);
  await writeFile(path.join(repo, "src/source-subject.ts"), "export const value = 1;\n", "utf8");
  await writeFile(
    path.join(repo, `docs/work/${workItemId}/brief.md`),
    `# ${workItemId}: Evidence Bundle Fixture

work_type: ${workType}
`,
    "utf8"
  );

  const workArtifacts = {
    "red-evidence.md": {
      artifact_type: "red_evidence",
      freshness_state: "current",
      source_artifacts: ["test/evidence-bundle-attestation.test.mjs"]
    },
    "implementation-evidence.md": {
      artifact_type: "implementation_evidence",
      freshness_state: "current",
      source_artifacts: ["src/state/evidence-bundle-attestation.ts"]
    },
    "review-evidence.md": {
      artifact_type: "review_evidence",
      review_subject_hash: reviewSubjectHash,
      source_head: "abc1234",
      freshness_state: "current",
      staleness_reason: "none",
      source_artifacts: [
        "docs/work/BANDIT-999/local-qwen-review.md",
        "docs/work/BANDIT-999/coderabbit-review.md"
      ],
      ...(options.reviewEvidence ?? {})
    },
    "landing-verdict.md": {
      artifact_type: "landing_verdict",
      verdict: "safe-to-land",
      review_subject_hash: reviewSubjectHash,
      freshness_state: "current",
      source_artifacts: ["docs/work/BANDIT-999/review-evidence.md"],
      ...(options.landingVerdict ?? {})
    },
    "landing-action.md": {
      artifact_type: "landing_action",
      action: "local-record",
      commit_sha: "abcdef1234567890abcdef1234567890abcdef12",
      freshness_state: "current"
    }
  };

  for (const [name, value] of Object.entries(workArtifacts)) {
    if (!omitWorkArtifacts.has(name)) {
      await writeStructuredMarkdownJson(
        repo,
        `docs/work/${workItemId}/${name}`,
        value
      );
    }
  }

  await writeJson(repo, `.bandit/policy/risk-classifications/${workItemId}-risk-classification.json`, {
    artifact_type: "risk_classification",
    work_item: workItemId,
    freshness_state: "current",
    risk_tier: "low_reversible",
    source_artifacts: [`docs/work/${workItemId}/review-evidence.md`]
  });
  await writeJson(repo, `.bandit/policy/supply-chain-gates/${workItemId}-supply-chain-gate.json`, {
    artifact_type: "supply_chain_gate",
    work_item: workItemId,
    verdict: "not_applicable",
    freshness_state: "current",
    source_artifacts: [policyPath]
  });
  await writeJson(repo, `docs/artifact-inputs/${workItemId}-red-evidence.json`, {
    artifact_type: "test_evidence",
    command: "node --test test/evidence-bundle-attestation.test.mjs",
    freshness_state: "current"
  });
  await writeJson(repo, `docs/work/${workItemId}/uat.json`, options.uat ?? {
    artifact_type: "uat",
    applicability: "not_applicable",
    freshness_state: "current",
    source_artifacts: [`docs/work/${workItemId}/brief.md`]
  });
}

function completeBundlePolicy() {
  return {
    contract_version: 1,
    policy_id: "evidence-bundle-attestation",
    policy_version: 1,
    command_versions: {
      "evidence-bundle": 1
    },
    authority: {
      read_only: true,
      can_replace_landing_authority: false,
      can_replace_trust_verifier_cutover: false,
      can_mutate_review_routing: false,
      can_mutate_gap_status: false
    },
    hashing: {
      algorithm: "sha256",
      canonicalization: "stable-json",
      stable_across_filesystem_order: true
    },
    required_freshness_states: ["current"],
    fail_closed_reasons: [
      "missing",
      "stale",
      "unsupported",
      "changed_after_review",
      "landing_verdict_mismatch",
      "contradictory"
    ],
    evidence_types: [
      evidenceType("source_subject", "required"),
      evidenceType("red_evidence", "required"),
      evidenceType("test_evidence", "required"),
      evidenceType("implementation_evidence", "required"),
      evidenceType("review_evidence", "required"),
      evidenceType("risk_classification", "required"),
      evidenceType("supply_chain_gate", "required"),
      evidenceType("uat", "conditional"),
      evidenceType("landing_verdict", "required"),
      evidenceType("landing_action", "required"),
      evidenceType("policy_versions", "required"),
      evidenceType("command_versions", "required"),
      evidenceType("freshness_metadata", "required")
    ]
  };
}

function evidenceType(id, requirement) {
  return {
    id,
    requirement,
    freshness_required: requirement !== "conditional"
  };
}

async function writeLiveStateSentinels(repo) {
  await writeJson(repo, ".bandit/bootstrap-gaps.json", {
    gaps: [
      {
        id: "BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION",
        status: "active",
        work_item: workItemId
      }
    ]
  });
  await writeFile(
    path.join(repo, `docs/work/${workItemId}/coordination-log.jsonl`),
    `${JSON.stringify({
      version: 1,
      event_type: "step_transition",
      work_item: workItemId,
      sequence: 1,
      state: "landed",
      evidence: [`docs/work/${workItemId}/landing-action.md`]
    })}\n`,
    "utf8"
  );
}

async function readLiveStateSentinels(repo) {
  const gapLedger = await readFile(path.join(repo, ".bandit/bootstrap-gaps.json"), "utf8");
  const coordinationLog = await readFile(
    path.join(repo, `docs/work/${workItemId}/coordination-log.jsonl`),
    "utf8"
  );

  return { gapLedger, coordinationLog };
}

async function writeStructuredMarkdownJson(repo, relativePath, value) {
  await writeFile(
    path.join(repo, relativePath),
    `# ${value.artifact_type}

\`\`\`json
${JSON.stringify(value, null, 2)}
\`\`\`
`,
    "utf8"
  );
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
