import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit, writeWorkBrief } from "./helpers/bandit-cli.mjs";

const POLICY_PATH = ".bandit/policy/worktree-bootstrap.json";
const TEMPLATE_PATH = "docs/templates/worktree-bootstrap.md";
const EVIDENCE_PATH =
  "docs/worktree-bootstrap/BANDIT-051-worktree-bootstrap-contract.json";

test("worktree-bootstrap validate accepts a complete bootstrap contract policy", async () => {
  const repo = await createInitializedWorktreeBootstrapRepo();
  await writeCompleteWorktreeBootstrapFixture(repo);

  const result = await runBandit(repo, ["worktree-bootstrap", "validate", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "pass");
  assert.equal(report.policy, POLICY_PATH);
  assert.equal(report.template, TEMPLATE_PATH);
  assert.deepEqual(report.decisions, ["BANDIT-051"]);
  assert.deepEqual(report.evidence, [EVIDENCE_PATH]);
});

test("worktree-bootstrap validate rejects secret-copy entries by default", async () => {
  const repo = await createInitializedWorktreeBootstrapRepo();
  const policy = completeWorktreeBootstrapPolicy();
  policy.release_authorized_decisions[0].secret_copy_exception = "none";
  const evidence = completeWorktreeBootstrapEvidence();
  evidence.allowed_copy_entries = [
    {
      from: ".env",
      to: ".env",
      classification: "secret_material"
    }
  ];

  await writeCompleteWorktreeBootstrapFixture(repo, { policy, evidence });

  const result = await runBandit(repo, ["worktree-bootstrap", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /secret material copy entries require an explicit operator-supervised exception/
  );
});

test("worktree-bootstrap validate rejects missing validation command wiring", async () => {
  const repo = await createInitializedWorktreeBootstrapRepo();
  const evidence = completeWorktreeBootstrapEvidence();
  evidence.bootstrap_commands.validation = "";
  await writeCompleteWorktreeBootstrapFixture(repo, { evidence });

  const result = await runBandit(repo, ["worktree-bootstrap", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /bootstrap validation command is required before a worktree can be runnable/
  );
});

async function createInitializedWorktreeBootstrapRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writeCompleteWorktreeBootstrapFixture(repo, options = {}) {
  await writeWorkBrief(repo, "BANDIT-051", "Worktree Bootstrap Contract");
  await writeFileAt(repo, "docs/work/BANDIT-051/red-evidence.md", "# RED Evidence\n");
  await writeFileAt(repo, TEMPLATE_PATH, completeWorktreeBootstrapTemplate());

  const evidence = options.evidence ?? completeWorktreeBootstrapEvidence();
  const policy = options.policy ?? completeWorktreeBootstrapPolicy();

  await writeJson(repo, EVIDENCE_PATH, evidence);
  await writeJson(repo, POLICY_PATH, policy);
}

function completeWorktreeBootstrapPolicy() {
  return {
    contract_version: 1,
    policy_id: "worktree-bootstrap-contract",
    release_authorized_decisions: [
      {
        work_item: "BANDIT-051",
        decision_kind: "worktree_bootstrap_contract",
        evidence_path: EVIDENCE_PATH,
        secret_copy_exception: "none"
      }
    ]
  };
}

function completeWorktreeBootstrapEvidence() {
  return {
    contract_version: 1,
    work_item: "BANDIT-051",
    source_artifacts: [
      "docs/decisions/2026-05-27-worktree-bootstrap-contract.md",
      "docs/specs/BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT.json",
      "docs/work/BANDIT-051/brief.md",
      "docs/work/BANDIT-051/red-evidence.md"
    ],
    allowed_copy_entries: [
      {
        from: "docs/templates/worktree-bootstrap.md",
        to: "docs/templates/worktree-bootstrap.md",
        classification: "non_secret"
      }
    ],
    allowed_link_entries: [
      {
        from: ".bandit/policy/worktree-bootstrap.json",
        to: ".bandit/policy/worktree-bootstrap.json"
      }
    ],
    bootstrap_commands: {
      setup: "npm ci --ignore-scripts",
      validation: "npm run bandit -- validate"
    },
    environment_references: [
      {
        name: "OPENAI_API_KEY",
        source: "operator-managed-env"
      }
    ],
    expected_runtime_dependencies: [
      "node",
      "npm"
    ],
    secret_handling_boundary: {
      default_secret_copy_policy: "refuse",
      allowed_secret_sources: ["operator-managed-env"]
    },
    bootstrap_failure_evidence: {
      artifact_path: "docs/work/BANDIT-051/bootstrap-failure.md",
      required_fields: [
        "work_item",
        "claim_id",
        "stage",
        "failure",
        "recovery_route",
        "source_artifacts"
      ]
    },
    runnable_gate: {
      locked_unbootstrapped_worktree_behavior: "refuse_worker_execution",
      requires_passed_bootstrap_validation: true
    }
  };
}

function completeWorktreeBootstrapTemplate() {
  return `# Worktree Bootstrap Contract Template

work_item:
source_artifacts:
allowed_copy_entries:
allowed_link_entries:
bootstrap_commands:
environment_references:
expected_runtime_dependencies:
secret_handling_boundary:
bootstrap_failure_evidence:
runnable_gate:
`;
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const target = path.join(repo, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}
