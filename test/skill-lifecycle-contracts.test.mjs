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
const committedTemplateRoot = path.join(repoRoot, "docs/templates");

const skillLifecyclePolicyPath = ".bandit/policy/skill-lifecycle-contracts.json";
const skillLifecycleTemplatePath = "docs/templates/skill-lifecycle-contract.md";
const evaluationPacketPath = "docs/evaluation/skills/bandit-cold-start.md";
const driftEvidencePath = "docs/evaluation/skills/bandit-installed-skill-drift.md";

test("validate fails closed when the skill lifecycle policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeSkillLifecycleTemplate(repo);
  await writeCompleteSkillLifecycleEvidence(repo);
  await rm(path.join(repo, skillLifecyclePolicyPath), { force: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/skill-lifecycle-contracts\.json/
  );
});

test("validate fails closed when the skill lifecycle template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeSkillLifecyclePolicy(repo, [completeSkillContract()]);
  await writeCompleteSkillLifecycleEvidence(repo);
  await rm(path.join(repo, skillLifecycleTemplatePath), { force: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/skill-lifecycle-contract\.md/
  );
});

test("skill lifecycle validation rejects contracts without an owner", async () => {
  const repo = await createInitializedRepo();
  await writeSkillLifecycleTemplate(repo);
  await writeCompleteSkillLifecycleEvidence(repo);
  const { owner, ...contractWithoutOwner } = completeSkillContract();
  await writeSkillLifecyclePolicy(repo, [contractWithoutOwner]);

  const result = await runBandit(repo, [
    "skill-lifecycle",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Malformed skill lifecycle contract bandit: owner must be a non-empty string/
  );
});

test("skill lifecycle validation rejects stage bindings that imply new agent authority", async () => {
  const repo = await createInitializedRepo();
  await writeSkillLifecycleTemplate(repo);
  await writeCompleteSkillLifecycleEvidence(repo);
  await writeSkillLifecyclePolicy(repo, [
    completeSkillContract({
      stage_bindings: [
        {
          stage: "stage2_red_evidence",
          capability: "required_red_evidence_skill",
          authority: "new_agent_role"
        }
      ]
    })
  ]);

  const result = await runBandit(repo, [
    "skill-lifecycle",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Malformed skill lifecycle contract bandit: stage binding authority must be stage_scoped_capability/
  );
});

test("skill lifecycle validation rejects missing evaluation packets", async () => {
  const repo = await createInitializedRepo();
  await writeSkillLifecycleTemplate(repo);
  await writeCompleteSkillLifecycleEvidence(repo, {
    omitEvaluationPacket: true
  });
  await writeSkillLifecyclePolicy(repo, [completeSkillContract()]);

  const result = await runBandit(repo, [
    "skill-lifecycle",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Malformed skill lifecycle contract bandit: missing evaluation packet docs\/evaluation\/skills\/bandit-cold-start\.md/
  );
});

test("skill lifecycle validation accepts a complete contract with drift evidence", async () => {
  const repo = await createInitializedRepo();
  await writeSkillLifecycleTemplate(repo);
  await writeCompleteSkillLifecycleEvidence(repo);
  await writeSkillLifecyclePolicy(repo, [completeSkillContract()]);

  const result = await runBandit(repo, [
    "skill-lifecycle",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: skillLifecyclePolicyPath,
    contracts: [
      {
        skill_id: "bandit",
        version: "1.0.0",
        intended_stages: [
          "stage0_context_readiness",
          "stage1_work_item_brief",
          "stage2_red_evidence"
        ],
        evaluation_packets: [evaluationPacketPath],
        drift_evidence: driftEvidencePath
      }
    ]
  });
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedTemplates(repo);
  await writeSmellCatalog(repo);
  await writeLocalQwenProfile(repo);
  return repo;
}

async function copyCommittedTemplates(repo) {
  await cp(committedTemplateRoot, path.join(repo, "docs/templates"), {
    recursive: true
  });
}

async function writeSkillLifecycleTemplate(repo) {
  await writeFileAt(
    repo,
    skillLifecycleTemplatePath,
    `# Skill Lifecycle Contract Template

skill_id:
owner:
version:
changelog:
intended_stages:
required_tools:
forbidden_actions:
evaluation_packets:
rollback_criteria:
stage_bindings:
installed_skill_drift:
`
  );
}

async function writeSkillLifecyclePolicy(repo, contracts) {
  await writeJson(repo, skillLifecyclePolicyPath, {
    contract_version: 1,
    policy_id: "skill-lifecycle-contracts",
    installed_skills_are_canonical: false,
    contracts
  });
}

async function writeCompleteSkillLifecycleEvidence(repo, options = {}) {
  if (!options.omitEvaluationPacket) {
    await writeFileAt(
      repo,
      evaluationPacketPath,
      `# Bandit Skill Cold-Start Evaluation Packet

## Scenario

Restore Bandit state from repo evidence and identify the next recorded action.
`
    );
  }

  await writeFileAt(
    repo,
    driftEvidencePath,
    `# Bandit Installed Skill Drift Evidence

skill_id: bandit
installed_artifact: /Users/matthewflebbe/.codex/skills/bandit/SKILL.md
artifact_sha256: ${"a".repeat(64)}
disposition: matches_repo_contract
`
  );
}

function completeSkillContract(overrides = {}) {
  return {
    skill_id: "bandit",
    owner: "Codex PM",
    version: "1.0.0",
    changelog: [
      {
        date: "2026-05-27",
        summary: "Initial repo-native skill lifecycle contract."
      }
    ],
    intended_stages: [
      "stage0_context_readiness",
      "stage1_work_item_brief",
      "stage2_red_evidence"
    ],
    required_tools: ["shell", "apply_patch"],
    forbidden_actions: [
      "edit_installed_global_skill",
      "fetch_external_prompts",
      "approve_uat",
      "merge",
      "push",
      "deploy"
    ],
    evaluation_packets: [evaluationPacketPath],
    rollback_criteria: [
      "Installed skill drift evidence does not match the repo contract.",
      "Evaluation packet produces a blocker-level regression."
    ],
    stage_bindings: [
      {
        stage: "stage2_red_evidence",
        capability: "required_red_evidence_skill",
        authority: "stage_scoped_capability"
      }
    ],
    installed_skill_drift: {
      evidence_path: driftEvidencePath,
      expected_sha256: "a".repeat(64),
      required_before_policy_use: true
    },
    ...overrides
  };
}

async function writeSmellCatalog(repo) {
  await writeJson(repo, ".bandit/policy/smell-triggers.json", {
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
  });
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
