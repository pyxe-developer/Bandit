import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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

const supplyPolicyPath = ".bandit/policy/supply-chain-gate.json";
const supplyTemplatePath = "docs/templates/supply-chain-gate.md";
const riskPolicyPath = ".bandit/policy/risk-classification.json";

test("validate fails closed when the supply-chain gate policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteSupplyChainEvidence(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/supply-chain-gate\.json/
  );
});

test("validate fails closed when the supply-chain gate template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteSupplyChainEvidence(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/supply-chain-gate\.md/
  );
});

test("supply-chain validation rejects registered decisions without evidence", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteSupplyChainEvidence(repo, { omitEvidence: true });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required supply-chain gate evidence: docs\/supply-chain\/BANDIT-960-supply-chain-gate\.json/
  );
});

test("supply-chain validation rejects dependency changes without SCA disposition", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.dependency_manifest_state.direct_dependency_changes = [
    {
      package: "left-pad",
      change: "added",
      version: "1.3.0"
    }
  ];
  gate.dependency_manifest_state.sca_or_equivalent = {
    state: "missing",
    evidence_path: "",
    unavailable_tool_disposition: ""
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /dependency change left-pad requires SCA evidence or unavailable-tool disposition/
  );
});

test("supply-chain validation rejects lockfile drift without manifest rationale", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: "package-lock.json",
      surface: "lockfile",
      change_type: "lockfile_drift",
      execution_path: false,
      risk: "low",
      operator_supervision_required: false
    }
  ];
  gate.lockfile_state = {
    state: "changed",
    lockfiles: ["package-lock.json"],
    manifest_rationale: "",
    drift_rationale: ""
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /lockfile drift requires manifest rationale and drift rationale/
  );
});

test("supply-chain validation rejects package-manager scripts without review evidence", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: "package.json",
      surface: "package_manager_script",
      change_type: "script_changed",
      execution_path: true,
      risk: "elevated",
      operator_supervision_required: true
    }
  ];
  gate.package_manager_scripts = {
    state: "changed",
    scripts: [
      {
        name: "postinstall",
        command: "node scripts/install.js",
        lifecycle_hook: true,
        review_evidence_path: ""
      }
    ]
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /package-manager script postinstall requires explicit review evidence/
  );
});

test("supply-chain validation rejects CI or release workflows marked auto-landable", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: ".github/workflows/release.yml",
      surface: "ci_release_workflow",
      change_type: "workflow_changed",
      execution_path: true,
      risk: "high",
      operator_supervision_required: true
    }
  ];
  gate.ci_release_workflows = {
    state: "changed",
    workflows: [
      {
        path: ".github/workflows/release.yml",
        entry_points: ["release"],
        review_evidence_path: "docs/work/BANDIT-960/brief.md"
      }
    ]
  };
  gate.operator_supervised_approval = {
    required: true,
    state: "missing",
    evidence_path: ""
  };
  gate.auto_landing = {
    eligible: true,
    refusal_rationale: "Workflow tests pass."
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /CI or release workflow changes require operator-supervised approval before auto-landing/
  );
});

test("supply-chain validation rejects agent skills without lifecycle evidence", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: ".codex/skills/bandit/SKILL.md",
      surface: "agent_skill",
      change_type: "skill_changed",
      execution_path: true,
      risk: "elevated",
      operator_supervision_required: true
    }
  ];
  gate.agent_skills = {
    state: "changed",
    skills: [
      {
        skill_id: "bandit",
        path: ".codex/skills/bandit/SKILL.md",
        owner: "",
        freshness_rule: "",
        revocation_path: ""
      }
    ]
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /agent skill bandit requires owner, freshness rule, and revocation path/
  );
});

test("supply-chain validation rejects fetched prompts without quarantine and trusted-source evidence", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: "prompts/install.md",
      surface: "fetched_prompt",
      change_type: "prompt_added",
      execution_path: true,
      risk: "elevated",
      operator_supervision_required: true
    }
  ];
  gate.fetched_prompts = {
    state: "changed",
    prompt_sources: [
      {
        source_identity: "vendor-install-prompt",
        instruction_bearing_use: true,
        owner: "Codex PM",
        freshness_rule: "expires_after_30_days",
        revocation_path: "docs/security/input-quarantine/revoke-prompts.md"
      }
    ],
    input_quarantine_refs: [],
    trusted_source_gate_refs: []
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /fetched prompt vendor-install-prompt requires Input Quarantine Gate and Trusted Source Gate evidence/
  );
});

test("supply-chain validation rejects external tool installs without trusted evidence", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: "scripts/install-tool.sh",
      surface: "external_tool_install",
      change_type: "install_path_added",
      execution_path: true,
      risk: "elevated",
      operator_supervision_required: true
    }
  ];
  gate.external_tool_installs = {
    state: "changed",
    install_paths: [
      {
        path: "scripts/install-tool.sh",
        tool: "example-tool",
        source_identity: "vendor-install-docs",
        review_evidence_path: "docs/work/BANDIT-960/brief.md"
      }
    ],
    input_quarantine_refs: [],
    trusted_source_gate_refs: []
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /external tool install example-tool requires Input Quarantine Gate and Trusted Source Gate evidence/
  );
});

test("supply-chain validation rejects unknown surfaces accepted as low risk", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces = [
    {
      path: "scripts/bootstrap.sh",
      surface: "unknown",
      change_type: "unknown",
      execution_path: true,
      risk: "low",
      operator_supervision_required: false
    }
  ];
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /unknown supply-chain surface scripts\/bootstrap\.sh cannot be accepted as low risk/
  );
});

test("supply-chain validation rejects missing operator-supervised approval", async () => {
  const repo = await createInitializedRepo();
  const gate = completeSupplyChainGate();
  gate.changed_supply_chain_surfaces[0].operator_supervision_required = true;
  gate.operator_supervised_approval = {
    required: true,
    state: "missing",
    evidence_path: ""
  };
  gate.auto_landing = {
    eligible: false,
    refusal_rationale: "Operator-supervised approval is required."
  };
  await writeCompleteSupplyChainEvidence(repo, { gate });

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /operator-supervised approval is required for BANDIT-960/
  );
});

test("supply-chain validation accepts a complete low-risk classification", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteSupplyChainEvidence(repo);

  const result = await runBandit(repo, [
    "supply-chain-gate",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: supplyPolicyPath,
    decisions: ["BANDIT-960"],
    surface_states: ["BANDIT-960:low"],
    operator_supervision: ["BANDIT-960:not_required"],
    auto_landing_eligibility: ["BANDIT-960:eligible"]
  });
});

test("auto-land-check refuses safe-to-land evidence without supply-chain gate evidence", async () => {
  const repo = await createInitializedRepo();
  await writeSupplyChainTemplate(repo);
  await initGitRepo(repo);
  const sourceHead = await commitAll(repo, "Initial state");
  await writeWorkBrief(repo, "BANDIT-961", "Missing Supply-Chain Gate");
  await writeReviewEvidence(repo, "BANDIT-961", { sourceHead });
  await writeLandingVerdict(repo, "BANDIT-961", { sourceHead });
  await writeRiskClassificationEvidence(repo, "BANDIT-961");

  const result = await runBandit(repo, ["auto-land-check", "BANDIT-961"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Auto-landing blocked: missing supply-chain gate evidence for BANDIT-961/
  );
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

async function writeCompleteSupplyChainEvidence(repo, options = {}) {
  if (options.omitTemplate) {
    await rm(path.join(repo, supplyTemplatePath), { force: true });
  } else {
    await writeSupplyChainTemplate(repo);
  }

  const workItemId = options.workItemId ?? "BANDIT-960";
  const evidencePath = supplyChainEvidencePath(workItemId);
  const gate = options.gate ?? completeSupplyChainGate(workItemId);

  if (!options.omitEvidence) {
    await writeJson(repo, evidencePath, gate);
  }

  if (options.omitPolicy) {
    await rm(path.join(repo, supplyPolicyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    supplyPolicyPath,
    options.policy ?? completeSupplyPolicy(workItemId, evidencePath)
  );
}

async function writeSupplyChainTemplate(repo) {
  await writeFileAt(
    repo,
    supplyTemplatePath,
    `# Supply-Chain Gate Template

work_item:
changed_supply_chain_surfaces:
dependency_manifest_state:
lockfile_state:
package_manager_scripts:
ci_release_workflows:
agent_skills:
fetched_prompts:
external_tool_installs:
input_quarantine_refs:
trusted_source_gate_refs:
sca_or_unavailable_tool_disposition:
operator_supervised_approval:
auto_landing:
rationale:
evidence_paths:
`
  );
}

function completeSupplyPolicy(workItemId, evidencePath, overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "supply-chain-gate",
    sensitive_surfaces: [
      "dependency_manifest",
      "lockfile",
      "package_manager_script",
      "ci_release_workflow",
      "agent_skill",
      "fetched_prompt",
      "external_tool_install",
      "executable_generated_content",
      "unknown"
    ],
    operator_supervised_surfaces: [
      "package_manager_script",
      "ci_release_workflow",
      "fetched_prompt",
      "external_tool_install",
      "executable_generated_content",
      "unknown"
    ],
    release_authorized_decisions: [
      {
        work_item: workItemId,
        decision_kind: "auto_landing",
        evidence_path: evidencePath
      }
    ],
    ...overrides
  };
}

function completeSupplyChainGate(workItemId = "BANDIT-960", overrides = {}) {
  return {
    contract_version: 1,
    work_item: workItemId,
    changed_supply_chain_surfaces: [
      {
        path: "package.json",
        surface: "dependency_manifest",
        change_type: "version_pin",
        execution_path: false,
        risk: "low",
        operator_supervision_required: false
      }
    ],
    dependency_manifest_state: {
      state: "changed",
      package_manager: "npm",
      manifests: ["package.json"],
      direct_dependency_changes: [],
      version_or_pin_changes: [
        {
          package: "tsx",
          from: "4.20.0",
          to: "4.20.0",
          rationale: "Fixture records unchanged pinned dev tool state."
        }
      ],
      sca_or_equivalent: {
        state: "unavailable_with_disposition",
        evidence_path: "docs/work/BANDIT-960/brief.md",
        unavailable_tool_disposition:
          "No live SCA provider is configured during bootstrap; this fixture records no direct dependency additions."
      },
      rationale:
        "Dependency manifest state is explicit and does not add executable dependency surface."
    },
    lockfile_state: {
      state: "not_touched",
      lockfiles: ["package-lock.json"],
      manifest_rationale: "No lockfile-only drift.",
      drift_rationale: "Not applicable."
    },
    package_manager_scripts: {
      state: "not_touched",
      scripts: [],
      review_evidence_path: "docs/work/BANDIT-960/brief.md"
    },
    ci_release_workflows: {
      state: "not_touched",
      workflows: []
    },
    agent_skills: {
      state: "not_touched",
      skills: [],
      owner: "Codex PM",
      freshness_rule: "not_applicable",
      revocation_path: "not_applicable"
    },
    fetched_prompts: {
      state: "not_touched",
      prompt_sources: [],
      input_quarantine_refs: [],
      trusted_source_gate_refs: []
    },
    external_tool_installs: {
      state: "not_touched",
      install_paths: [],
      input_quarantine_refs: [],
      trusted_source_gate_refs: []
    },
    input_quarantine_refs: [".bandit/policy/input-quarantine.json"],
    trusted_source_gate_refs: [],
    operator_supervised_approval: {
      required: false,
      state: "not_required",
      evidence_path: ""
    },
    auto_landing: {
      eligible: true,
      refusal_rationale: "none"
    },
    rationale:
      "Complete low-risk supply-chain gate evidence records all known sensitive surfaces before auto-landing eligibility.",
    evidence_paths: [
      supplyPolicyPath,
      supplyTemplatePath,
      `docs/work/${workItemId}/brief.md`
    ],
    ...overrides
  };
}

function supplyChainEvidencePath(workItemId) {
  return `docs/supply-chain/${workItemId}-supply-chain-gate.json`;
}

async function writeRiskClassificationEvidence(repo, workItemId) {
  const evidencePath = `docs/risk/layered/${workItemId}-risk-classification.json`;
  const classification = {
    contract_version: 1,
    work_item: workItemId,
    changed_surfaces: [
      {
        path: `docs/work/${workItemId}/brief.md`,
        surface: "documentation",
        risk: "low",
        never_auto_landable: false
      }
    ],
    hard_exclusions: [],
    blast_radius_signals: [
      {
        signal_id: "docs_only",
        risk: "low",
        evidence_path: `docs/work/${workItemId}/brief.md`
      }
    ],
    static_analysis_signals: [
      {
        tool: "typecheck",
        state: "pass",
        risk: "low",
        evidence_path: "npm run typecheck"
      }
    ],
    source_trust_state: {
      state: "trusted_local_repo",
      evidence_path: ".bandit/policy/input-quarantine.json"
    },
    input_quarantine_state: {
      state: "not_applicable",
      evidence_path: ".bandit/policy/input-quarantine.json"
    },
    supply_chain_state: {
      state: "not_touched",
      evidence_path: supplyPolicyPath
    },
    smell_trigger_inputs: [],
    selected_review_depth: "pre_pr_coderabbit_plus_qwen",
    operator_supervision: {
      required: false,
      route: "none",
      rationale: "Low-risk fixture classification."
    },
    auto_landing: {
      eligible: true,
      refusal_rationale: "none"
    },
    rationale:
      "Fixture classification includes all layered signals before auto-landing eligibility.",
    evidence_paths: [
      riskPolicyPath,
      "docs/templates/layered-risk-classification.md",
      `docs/work/${workItemId}/brief.md`
    ]
  };

  await writeJson(repo, evidencePath, classification);
  await upsertRiskClassificationPolicyDecision(repo, workItemId, evidencePath);
}

async function upsertRiskClassificationPolicyDecision(repo, workItemId, evidencePath) {
  const policyPath = path.join(repo, riskPolicyPath);
  const policy = JSON.parse(await readFile(policyPath, "utf8"));
  policy.release_authorized_decisions =
    policy.release_authorized_decisions?.filter(
      (decision) =>
        decision.work_item !== workItemId ||
        decision.decision_kind !== "auto_landing"
    ) ?? [];
  policy.release_authorized_decisions.push({
    work_item: workItemId,
    decision_kind: "auto_landing",
    evidence_path: evidencePath
  });
  await writeFile(policyPath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

async function writeReviewEvidence(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "review-evidence.md"),
    `# Review Evidence: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
verification_state: pass
verification_evidence:
  - node --test test/supply-chain-gate.test.mjs
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - Manual PM review replaces unavailable final gates during bootstrap.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - Local Qwen runtime is unavailable during bootstrap.
escalated_review_required: false
escalated_review_state: not_applicable
escalated_review_rationale: No smell trigger requires escalation beyond baseline gates.
pm_disposition: pass
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - Manual PM review replaces unavailable final gates during bootstrap.
`,
    "utf8"
  );
}

async function writeLandingVerdict(repo, workItemId, options = {}) {
  const workDir = path.join(repo, "docs/work", workItemId);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "landing-verdict.md"),
    `# Landing Verdict: ${workItemId}

contract_version: 1
work_item: ${workItemId}
source_head: ${options.sourceHead ?? "unknown"}
review_evidence: docs/work/${workItemId}/review-evidence.md
tests_status: pass
clean_code_status: pass
coderabbit_state: bootstrap_gap
local_qwen_state: bootstrap_gap
escalated_review_state: not_applicable
uat_status: not_applicable
source_drift_status: current
operator_input_status: none_required
landing_agent_state: bootstrap_gap
landing_agent_replacement_evidence:
  - Manual PM review replaces unavailable final gates during bootstrap.
final_verdict: safe-to-land
rationale: Evidence is explicit and unavailable final gates are recorded as bootstrap gaps.
`,
    "utf8"
  );
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function initGitRepo(repo) {
  await runGit(repo, ["init"]);
  await runGit(repo, ["config", "user.email", "bandit@example.test"]);
  await runGit(repo, ["config", "user.name", "Bandit Test"]);
}

async function commitAll(repo, message) {
  await runGit(repo, ["add", "."]);
  await runGit(repo, ["commit", "-m", message]);
  const result = await runGit(repo, ["rev-parse", "HEAD"]);
  return result.stdout.trim();
}

function runGit(cwd, args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}
