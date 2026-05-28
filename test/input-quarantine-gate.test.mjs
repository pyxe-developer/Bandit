import assert from "node:assert/strict";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

const policyPath = ".bandit/policy/input-quarantine.json";
const inputQuarantineTemplatePath = "docs/templates/input-quarantine-gate.md";
const trustedSourceGateTemplatePath = "docs/templates/trusted-source-gate.md";
const boundaryEvidencePath =
  "docs/security/input-quarantine/BANDIT-040-review-comment-boundary.md";
const dependencyDocsBoundaryEvidencePath =
  "docs/security/input-quarantine/dependency-docs-boundary.md";
const trustedGateEvidencePath =
  "docs/security/input-quarantine/dependency-docs-trusted-source.md";
const trustedGateRevocationPath =
  "docs/security/input-quarantine/revoke-dependency-docs.md";

test("validate fails closed when the input quarantine policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteInputQuarantineEvidence(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/input-quarantine\.json/
  );
});

test("validate fails closed when the input quarantine template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteInputQuarantineEvidence(repo, {
    omitInputQuarantineTemplate: true
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/input-quarantine-gate\.md/
  );
});

test("input quarantine validation rejects release paths without source classification", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  delete policy.release_authorized_paths[0].source_class;
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /input quarantine path stage4-review-comment-ingest must classify source_class/
  );
});

test("input quarantine validation rejects external input without data-only handling", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  policy.release_authorized_paths[0].input_handling.mode =
    "instruction_bearing";
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /external and third-party inputs must be data_only before release-authorized context/
  );
});

test("input quarantine validation rejects paths without quarantine boundary evidence", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  delete policy.release_authorized_paths[0].quarantine_boundary.evidence_path;
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /input quarantine path stage4-review-comment-ingest requires quarantine boundary evidence_path/
  );
});

test("input quarantine validation rejects instruction-bearing use without a trusted-source gate", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  policy.release_authorized_paths[0].instruction_bearing_use = true;
  policy.release_authorized_paths[0].trusted_source_gate_ref = "";
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /instruction-bearing use requires a bounded Trusted Source Gate/
  );
});

test("input quarantine validation rejects malformed trusted-source gate metadata", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  delete policy.trusted_source_gates[0].owner;
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Trusted Source Gate dependency-docs-install-snippet missing required field: owner/
  );
});

test("input quarantine validation rejects Trusted Local Repo Mode overreach", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  policy.trusted_local_repo_mode.applies_to_source_classes.push(
    "external_contributor_text"
  );
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Trusted Local Repo Mode must not trust external or third-party source classes/
  );
});

test("input quarantine validation rejects unknown source classes", async () => {
  const repo = await createInitializedRepo();
  const policy = completeInputQuarantinePolicy();
  policy.release_authorized_paths[0].source_class = "chat_transcript";
  await writeCompleteInputQuarantineEvidence(repo, { policy });

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /unknown input source class: chat_transcript/);
});

test("input quarantine validation accepts a complete bounded contract", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteInputQuarantineEvidence(repo);

  const result = await runBandit(repo, [
    "input-quarantine",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: policyPath,
    source_classes: [
      "trusted_local_repo",
      "external_contributor_text",
      "issue_or_pr_metadata",
      "review_comment",
      "dependency_documentation",
      "fetched_third_party_content",
      "generated_instruction",
      "fetched_prompt"
    ],
    release_authorized_paths: [
      "stage4-review-comment-ingest",
      "dependency-doc-extraction"
    ],
    trusted_source_gates: ["dependency-docs-install-snippet"],
    trusted_local_repo_mode:
      "scoped_until_external_input_enters_release_authorized_path"
  });
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  await copyCommittedDirectory(repo, "docs/evaluation");
  await writeLocalQwenProfile(repo);
  return repo;
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeCompleteInputQuarantineEvidence(repo, options = {}) {
  if (options.omitInputQuarantineTemplate) {
    await rm(path.join(repo, inputQuarantineTemplatePath), { force: true });
  } else {
    await writeFileAt(
      repo,
      inputQuarantineTemplatePath,
      `# Input Quarantine Gate Template

source_identity:
source_class:
data_only_handling:
quarantine_boundary_evidence:
admitted_fields:
stripped_or_ignored_fields:
allowed_extraction_uses:
forbidden_instruction_bearing_uses:
owning_stage:
trusted_source_gate_refs:
freshness_or_expiry:
owner:
revocation_path:
`
    );
  }

  await writeFileAt(
    repo,
    trustedSourceGateTemplatePath,
    `# Trusted Source Gate Template

source_identity:
scope:
allowed_uses:
owner:
freshness_or_expiry_rule:
revocation_path:
trust_rationale:
evidence_artifact:
`
  );

  await writeFileAt(
    repo,
    boundaryEvidencePath,
    `# BANDIT-040 Review Comment Boundary

source_identity: github-pr-123-review-comment-7
source_class: review_comment
data_only_handling: quoted extraction only
`
  );
  await writeFileAt(
    repo,
    trustedGateEvidencePath,
    `# Dependency Docs Trusted Source Evidence

gate_id: dependency-docs-install-snippet
source_identity: vendor-docs-install-section
scope: bounded fixture setup command only
`
  );
  await writeFileAt(
    repo,
    dependencyDocsBoundaryEvidencePath,
    `# Dependency Docs Boundary

source_identity: vendor-docs-install-section
source_class: dependency_documentation
data_only_handling: extract quoted fixture command only
`
  );
  await writeFileAt(
    repo,
    trustedGateRevocationPath,
    `# Dependency Docs Trusted Source Revocation

gate_id: dependency-docs-install-snippet
revocation_owner: Codex PM
`
  );

  if (options.omitPolicy) {
    await rm(path.join(repo, policyPath), { force: true });
    return;
  }

  await writeJson(repo, policyPath, options.policy ?? completeInputQuarantinePolicy());
}

function completeInputQuarantinePolicy(overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "input-quarantine",
    source_classes: [
      "trusted_local_repo",
      "external_contributor_text",
      "issue_or_pr_metadata",
      "review_comment",
      "dependency_documentation",
      "fetched_third_party_content",
      "generated_instruction",
      "fetched_prompt"
    ],
    trusted_local_repo_mode: {
      mode: "scoped_until_external_input_enters_release_authorized_path",
      applies_to_source_classes: ["trusted_local_repo"],
      terminates_when_source_classes_enter_context: [
        "external_contributor_text",
        "issue_or_pr_metadata",
        "review_comment",
        "dependency_documentation",
        "fetched_third_party_content",
        "generated_instruction",
        "fetched_prompt"
      ]
    },
    release_authorized_paths: [
      {
        path_id: "stage4-review-comment-ingest",
        owning_stage: "stage4_review",
        source_identity: "github-pr-123-review-comment-7",
        source_class: "review_comment",
        input_handling: {
          mode: "data_only",
          admitted_fields: ["author", "body", "url"],
          stripped_or_ignored_fields: ["hidden_prompt", "tool_directive"],
          allowed_extraction_uses: ["summarize_findings", "quote_evidence"],
          forbidden_instruction_bearing_uses: [
            "agent_instructions",
            "tool_permissions",
            "routing_decisions",
            "landing_authority",
            "auto_landing_eligibility",
            "policy_authority",
            "gate_satisfaction"
          ]
        },
        quarantine_boundary: {
          evidence_path: boundaryEvidencePath,
          owner: "Codex PM"
        },
        instruction_bearing_use: false,
        trusted_source_gate_ref: ""
      },
      {
        path_id: "dependency-doc-extraction",
        owning_stage: "stage2_red_evidence",
        source_identity: "vendor-docs-install-section",
        source_class: "dependency_documentation",
        input_handling: {
          mode: "data_only",
          admitted_fields: ["quoted_command", "version_note"],
          stripped_or_ignored_fields: ["page_script", "prompt_like_text"],
          allowed_extraction_uses: ["extract_fixture_command"],
          forbidden_instruction_bearing_uses: [
            "agent_instructions",
            "tool_permissions",
            "routing_decisions",
            "landing_authority",
            "auto_landing_eligibility",
            "policy_authority",
            "gate_satisfaction"
          ]
        },
        quarantine_boundary: {
          evidence_path: dependencyDocsBoundaryEvidencePath,
          owner: "Codex PM"
        },
        instruction_bearing_use: true,
        trusted_source_gate_ref: "dependency-docs-install-snippet"
      }
    ],
    trusted_source_gates: [
      {
        gate_id: "dependency-docs-install-snippet",
        source_identity: "vendor-docs-install-section",
        source_class: "dependency_documentation",
        scope: "Use the quoted install command only for local fixture setup.",
        allowed_uses: ["extract_fixture_command"],
        owner: "Codex PM",
        freshness_or_expiry_rule: "expires_after_30_days",
        revocation_path: trustedGateRevocationPath,
        trust_rationale:
          "Bounded release-authorized use is limited to a quoted fixture command.",
        evidence_artifact: trustedGateEvidencePath
      }
    ],
    ...overrides
  };
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
