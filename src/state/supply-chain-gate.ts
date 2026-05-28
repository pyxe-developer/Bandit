import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type SupplyChainGateValidationReport = {
  status: "pass";
  policy: typeof SUPPLY_CHAIN_POLICY_DISPLAY_PATH;
  decisions: string[];
  surface_states: string[];
  operator_supervision: string[];
  auto_landing_eligibility: string[];
};

type RawRecord = Record<string, unknown>;

type SupplyChainPolicy = {
  sensitiveSurfaces: string[];
  operatorSupervisedSurfaces: string[];
  releaseAuthorizedDecisions: SupplyChainDecision[];
};

type SupplyChainDecision = {
  workItem: string;
  decisionKind: string;
  evidencePath: string;
};

type SupplyChainGateEvidence = {
  workItem: string;
  changedSurfaces: RawRecord[];
  dependencyManifestState: RawRecord;
  lockfileState: RawRecord;
  packageManagerScripts: RawRecord;
  ciReleaseWorkflows: RawRecord;
  agentSkills: RawRecord;
  fetchedPrompts: RawRecord;
  externalToolInstalls: RawRecord;
  inputQuarantineRefs: string[];
  trustedSourceGateRefs: string[];
  operatorSupervisedApproval: RawRecord;
  autoLanding: RawRecord;
};

const SUPPLY_CHAIN_POLICY_DISPLAY_PATH =
  ".bandit/policy/supply-chain-gate.json";
const SUPPLY_CHAIN_TEMPLATE_DISPLAY_PATH =
  "docs/templates/supply-chain-gate.md";
const SENSITIVE_SURFACES = [
  "dependency_manifest",
  "lockfile",
  "package_manager_script",
  "ci_release_workflow",
  "agent_skill",
  "fetched_prompt",
  "external_tool_install",
  "executable_generated_content",
  "unknown"
];
const OPERATOR_SUPERVISED_SURFACES = [
  "package_manager_script",
  "ci_release_workflow",
  "fetched_prompt",
  "external_tool_install",
  "executable_generated_content",
  "unknown"
];
const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "changed_supply_chain_surfaces",
  "dependency_manifest_state",
  "lockfile_state",
  "package_manager_scripts",
  "ci_release_workflows",
  "agent_skills",
  "fetched_prompts",
  "external_tool_installs",
  "input_quarantine_refs",
  "trusted_source_gate_refs",
  "sca_or_unavailable_tool_disposition",
  "operator_supervised_approval",
  "auto_landing",
  "rationale",
  "evidence_paths"
];

export async function writeDefaultSupplyChainGatePolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "supply-chain-gate",
    sensitive_surfaces: SENSITIVE_SURFACES,
    operator_supervised_surfaces: OPERATOR_SUPERVISED_SURFACES,
    release_authorized_decisions: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultSupplyChainGateTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, SUPPLY_CHAIN_TEMPLATE_DISPLAY_PATH);
  const template = `# Supply-Chain Gate Template

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
`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, template, "utf8");
}

export async function validateSupplyChainGate(
  repoRoot: string
): Promise<SupplyChainGateValidationReport> {
  const policy = await readSupplyChainPolicy(repoRoot);
  await validateSupplyChainTemplate(repoRoot);
  const decisions = await validateSupplyChainDecisions(repoRoot, policy);

  return {
    status: "pass",
    policy: SUPPLY_CHAIN_POLICY_DISPLAY_PATH,
    decisions: decisions.map((decision) => decision.workItem),
    surface_states: decisions.map((decision) => formatSurfaceState(decision)),
    operator_supervision: decisions.map((decision) =>
      formatOperatorSupervision(decision)
    ),
    auto_landing_eligibility: decisions.map((decision) =>
      formatAutoLandingEligibility(decision)
    )
  };
}

export async function autoLandingSupplyChainGateProblems(
  repoRoot: string,
  workItemId: string
) {
  const policy = await readSupplyChainPolicy(repoRoot);
  await validateSupplyChainTemplate(repoRoot);
  const decision = policy.releaseAuthorizedDecisions.find(
    (candidate) =>
      candidate.workItem === workItemId &&
      candidate.decisionKind === "auto_landing"
  );

  if (!decision) {
    return [`missing supply-chain gate evidence for ${workItemId}`];
  }

  const evidence = await readSupplyChainGateEvidence(
    repoRoot,
    decision.evidencePath,
    workItemId
  );
  const problems = validateSupplyChainEvidence(evidence, policy);

  if (problems.length > 0) {
    return problems;
  }

  if (!readRequiredBoolean(evidence.autoLanding, "eligible", "auto_landing")) {
    return [
      `supply-chain gate blocks auto-landing for ${workItemId}: ${readRequiredString(
        evidence.autoLanding,
        "refusal_rationale",
        "auto_landing"
      )}`
    ];
  }

  return [];
}

async function validateSupplyChainDecisions(
  repoRoot: string,
  policy: SupplyChainPolicy
) {
  const decisions: SupplyChainGateEvidence[] = [];
  const problems: string[] = [];

  for (const decision of policy.releaseAuthorizedDecisions) {
    const evidence = await readSupplyChainGateEvidence(
      repoRoot,
      decision.evidencePath,
      decision.workItem
    );
    problems.push(...validateSupplyChainEvidence(evidence, policy));
    decisions.push(evidence);
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return decisions;
}

async function readSupplyChainPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredFile(
    paths.supplyChainPolicy,
    SUPPLY_CHAIN_POLICY_DISPLAY_PATH,
    "policy"
  );

  return parseSupplyChainPolicy(content);
}

async function validateSupplyChainTemplate(repoRoot: string) {
  const content = await readRequiredFile(
    path.join(repoRoot, SUPPLY_CHAIN_TEMPLATE_DISPLAY_PATH),
    SUPPLY_CHAIN_TEMPLATE_DISPLAY_PATH,
    "template"
  );

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${SUPPLY_CHAIN_TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

function parseSupplyChainPolicy(content: string): SupplyChainPolicy {
  const parsed = parseJsonObject(content, "supply-chain gate policy");

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed supply-chain gate policy: missing contract_version 1");
  }

  if (parsed.policy_id !== "supply-chain-gate") {
    throw new Error(
      "Malformed supply-chain gate policy: policy_id must be supply-chain-gate"
    );
  }

  const sensitiveSurfaces = readRequiredStringList(
    parsed,
    "sensitive_surfaces",
    "supply-chain gate policy"
  );
  for (const surface of SENSITIVE_SURFACES) {
    if (!sensitiveSurfaces.includes(surface)) {
      throw new Error(
        `Malformed supply-chain gate policy: sensitive_surfaces must include ${surface}`
      );
    }
  }

  const operatorSupervisedSurfaces = readRequiredStringList(
    parsed,
    "operator_supervised_surfaces",
    "supply-chain gate policy"
  );
  for (const surface of OPERATOR_SUPERVISED_SURFACES) {
    if (!operatorSupervisedSurfaces.includes(surface)) {
      throw new Error(
        `Malformed supply-chain gate policy: operator_supervised_surfaces must include ${surface}`
      );
    }
  }

  return {
    sensitiveSurfaces,
    operatorSupervisedSurfaces,
    releaseAuthorizedDecisions: readSupplyChainDecisions(parsed)
  };
}

function readSupplyChainDecisions(policy: RawRecord): SupplyChainDecision[] {
  return readRequiredRecordList(
    policy,
    "release_authorized_decisions",
    "supply-chain gate policy"
  ).map((decision) => ({
    workItem: readRequiredString(
      decision,
      "work_item",
      "supply-chain gate decision"
    ),
    decisionKind: readRequiredString(
      decision,
      "decision_kind",
      "supply-chain gate decision"
    ),
    evidencePath: readRequiredString(
      decision,
      "evidence_path",
      "supply-chain gate decision"
    )
  }));
}

async function readSupplyChainGateEvidence(
  repoRoot: string,
  evidencePath: string,
  expectedWorkItem: string
): Promise<SupplyChainGateEvidence> {
  const content = await readRequiredFile(
    path.join(repoRoot, evidencePath),
    evidencePath,
    "supply-chain gate evidence"
  );
  const parsed = parseJsonObject(content, "supply-chain gate evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed supply-chain gate for ${expectedWorkItem}: missing contract_version 1`
    );
  }

  const workItem = readRequiredString(
    parsed,
    "work_item",
    "supply-chain gate evidence"
  );
  if (workItem !== expectedWorkItem) {
    throw new Error(
      `Malformed supply-chain gate for ${expectedWorkItem}: work_item does not match`
    );
  }

  return {
    workItem,
    changedSurfaces: readRequiredRecordList(
      parsed,
      "changed_supply_chain_surfaces",
      `supply-chain gate for ${workItem}`
    ),
    dependencyManifestState: readRequiredRecord(
      parsed,
      "dependency_manifest_state",
      `supply-chain gate for ${workItem}`
    ),
    lockfileState: readRequiredRecord(
      parsed,
      "lockfile_state",
      `supply-chain gate for ${workItem}`
    ),
    packageManagerScripts: readRequiredRecord(
      parsed,
      "package_manager_scripts",
      `supply-chain gate for ${workItem}`
    ),
    ciReleaseWorkflows: readRequiredRecord(
      parsed,
      "ci_release_workflows",
      `supply-chain gate for ${workItem}`
    ),
    agentSkills: readRequiredRecord(
      parsed,
      "agent_skills",
      `supply-chain gate for ${workItem}`
    ),
    fetchedPrompts: readRequiredRecord(
      parsed,
      "fetched_prompts",
      `supply-chain gate for ${workItem}`
    ),
    externalToolInstalls: readRequiredRecord(
      parsed,
      "external_tool_installs",
      `supply-chain gate for ${workItem}`
    ),
    inputQuarantineRefs: readRequiredStringList(
      parsed,
      "input_quarantine_refs",
      `supply-chain gate for ${workItem}`
    ),
    trustedSourceGateRefs: readRequiredStringList(
      parsed,
      "trusted_source_gate_refs",
      `supply-chain gate for ${workItem}`
    ),
    operatorSupervisedApproval: readRequiredRecord(
      parsed,
      "operator_supervised_approval",
      `supply-chain gate for ${workItem}`
    ),
    autoLanding: readRequiredRecord(
      parsed,
      "auto_landing",
      `supply-chain gate for ${workItem}`
    )
  };
}

function validateSupplyChainEvidence(
  evidence: SupplyChainGateEvidence,
  policy: SupplyChainPolicy
) {
  const problems: string[] = [];

  problems.push(...changedSurfaceProblems(evidence, policy));
  problems.push(...dependencyManifestProblems(evidence));
  problems.push(...lockfileProblems(evidence));
  problems.push(...packageManagerScriptProblems(evidence));
  problems.push(...ciReleaseWorkflowProblems(evidence));
  problems.push(...agentSkillProblems(evidence));
  problems.push(...fetchedPromptProblems(evidence));
  problems.push(...externalToolInstallProblems(evidence));
  problems.push(...operatorSupervisionProblems(evidence));

  return problems;
}

function changedSurfaceProblems(
  evidence: SupplyChainGateEvidence,
  policy: SupplyChainPolicy
) {
  const problems: string[] = [];

  for (const surface of evidence.changedSurfaces) {
    const surfaceName = readRequiredString(
      surface,
      "surface",
      `supply-chain gate for ${evidence.workItem} changed_supply_chain_surfaces`
    );
    const surfacePath = readRequiredString(
      surface,
      "path",
      `supply-chain gate for ${evidence.workItem} changed_supply_chain_surfaces`
    );

    if (!policy.sensitiveSurfaces.includes(surfaceName)) {
      problems.push(`unsupported supply-chain surface ${surfaceName}`);
    }

    if (
      surfaceName === "unknown" &&
      (readOptionalString(surface, "risk") === "low" ||
        !readRequiredBoolean(
          surface,
          "operator_supervision_required",
          `supply-chain gate for ${evidence.workItem} changed_supply_chain_surfaces`
        ) ||
        readRequiredBoolean(evidence.autoLanding, "eligible", "auto_landing"))
    ) {
      problems.push(
        `unknown supply-chain surface ${surfacePath} cannot be accepted as low risk`
      );
    }
  }

  return problems;
}

function dependencyManifestProblems(evidence: SupplyChainGateEvidence) {
  const problems: string[] = [];
  const directChanges = readRequiredRecordList(
    evidence.dependencyManifestState,
    "direct_dependency_changes",
    `supply-chain gate for ${evidence.workItem} dependency_manifest_state`
  );
  const versionChanges = readRequiredRecordList(
    evidence.dependencyManifestState,
    "version_or_pin_changes",
    `supply-chain gate for ${evidence.workItem} dependency_manifest_state`
  );
  const sca = readRequiredRecord(
    evidence.dependencyManifestState,
    "sca_or_equivalent",
    `supply-chain gate for ${evidence.workItem} dependency_manifest_state`
  );

  if (directChanges.length === 0 && versionChanges.length === 0) {
    return problems;
  }

  if (!hasScaEvidenceOrUnavailableDisposition(sca)) {
    for (const change of [...directChanges, ...versionChanges]) {
      const packageName = readRequiredString(
        change,
        "package",
        `supply-chain gate for ${evidence.workItem} dependency change`
      );
      problems.push(
        `dependency change ${packageName} requires SCA evidence or unavailable-tool disposition`
      );
    }
  }

  return problems;
}

function lockfileProblems(evidence: SupplyChainGateEvidence) {
  if (
    readOptionalString(evidence.lockfileState, "state") !== "changed" &&
    !evidence.changedSurfaces.some(
      (surface) =>
        readOptionalString(surface, "surface") === "lockfile" ||
        readOptionalString(surface, "change_type") === "lockfile_drift"
    )
  ) {
    return [];
  }

  if (
    !readOptionalString(evidence.lockfileState, "manifest_rationale") ||
    !readOptionalString(evidence.lockfileState, "drift_rationale")
  ) {
    return ["lockfile drift requires manifest rationale and drift rationale"];
  }

  return [];
}

function packageManagerScriptProblems(evidence: SupplyChainGateEvidence) {
  const scripts = readRequiredRecordList(
    evidence.packageManagerScripts,
    "scripts",
    `supply-chain gate for ${evidence.workItem} package_manager_scripts`
  );
  const problems: string[] = [];

  for (const script of scripts) {
    const scriptName = readRequiredString(
      script,
      "name",
      `supply-chain gate for ${evidence.workItem} package_manager_scripts`
    );
    if (!readOptionalString(script, "review_evidence_path")) {
      problems.push(
        `package-manager script ${scriptName} requires explicit review evidence`
      );
    }
  }

  return problems;
}

function ciReleaseWorkflowProblems(evidence: SupplyChainGateEvidence) {
  if (!hasChangedSurface(evidence, "ci_release_workflow")) {
    return [];
  }

  const approvalState = readOptionalString(
    evidence.operatorSupervisedApproval,
    "state"
  );
  const autoLandingEligible = readRequiredBoolean(
    evidence.autoLanding,
    "eligible",
    "auto_landing"
  );

  if (autoLandingEligible && approvalState !== "pass") {
    return [
      "CI or release workflow changes require operator-supervised approval before auto-landing"
    ];
  }

  return [];
}

function agentSkillProblems(evidence: SupplyChainGateEvidence) {
  const skills = readRequiredRecordList(
    evidence.agentSkills,
    "skills",
    `supply-chain gate for ${evidence.workItem} agent_skills`
  );
  const problems: string[] = [];

  for (const skill of skills) {
    const skillId = readRequiredString(
      skill,
      "skill_id",
      `supply-chain gate for ${evidence.workItem} agent_skills`
    );
    if (
      !readOptionalString(skill, "owner") ||
      !readOptionalString(skill, "freshness_rule") ||
      !readOptionalString(skill, "revocation_path")
    ) {
      problems.push(
        `agent skill ${skillId} requires owner, freshness rule, and revocation path`
      );
    }
  }

  return problems;
}

function fetchedPromptProblems(evidence: SupplyChainGateEvidence) {
  const promptSources = readRequiredRecordList(
    evidence.fetchedPrompts,
    "prompt_sources",
    `supply-chain gate for ${evidence.workItem} fetched_prompts`
  );
  const inputRefs = readRequiredStringList(
    evidence.fetchedPrompts,
    "input_quarantine_refs",
    `supply-chain gate for ${evidence.workItem} fetched_prompts`
  );
  const trustedRefs = readRequiredStringList(
    evidence.fetchedPrompts,
    "trusted_source_gate_refs",
    `supply-chain gate for ${evidence.workItem} fetched_prompts`
  );
  const problems: string[] = [];

  for (const prompt of promptSources) {
    const promptId = readRequiredString(
      prompt,
      "source_identity",
      `supply-chain gate for ${evidence.workItem} fetched_prompts`
    );
    if (
      readRequiredBoolean(
        prompt,
        "instruction_bearing_use",
        `supply-chain gate for ${evidence.workItem} fetched_prompts`
      ) &&
      (inputRefs.length === 0 || trustedRefs.length === 0)
    ) {
      problems.push(
        `fetched prompt ${promptId} requires Input Quarantine Gate and Trusted Source Gate evidence`
      );
    }
  }

  return problems;
}

function externalToolInstallProblems(evidence: SupplyChainGateEvidence) {
  const installPaths = readRequiredRecordList(
    evidence.externalToolInstalls,
    "install_paths",
    `supply-chain gate for ${evidence.workItem} external_tool_installs`
  );
  const inputRefs = readRequiredStringList(
    evidence.externalToolInstalls,
    "input_quarantine_refs",
    `supply-chain gate for ${evidence.workItem} external_tool_installs`
  );
  const trustedRefs = readRequiredStringList(
    evidence.externalToolInstalls,
    "trusted_source_gate_refs",
    `supply-chain gate for ${evidence.workItem} external_tool_installs`
  );
  const problems: string[] = [];

  for (const install of installPaths) {
    const tool = readRequiredString(
      install,
      "tool",
      `supply-chain gate for ${evidence.workItem} external_tool_installs`
    );
    if (inputRefs.length === 0 || trustedRefs.length === 0) {
      problems.push(
        `external tool install ${tool} requires Input Quarantine Gate and Trusted Source Gate evidence`
      );
    }
  }

  return problems;
}

function operatorSupervisionProblems(evidence: SupplyChainGateEvidence) {
  const approvalRequired =
    readRequiredBoolean(
      evidence.operatorSupervisedApproval,
      "required",
      "operator_supervised_approval"
    ) ||
    evidence.changedSurfaces.some((surface) =>
      readRequiredBoolean(
        surface,
        "operator_supervision_required",
        `supply-chain gate for ${evidence.workItem} changed_supply_chain_surfaces`
      )
    );

  if (!approvalRequired) {
    return [];
  }

  if (
    readOptionalString(evidence.operatorSupervisedApproval, "state") !== "pass"
  ) {
    return [
      `operator-supervised approval is required for ${evidence.workItem}`
    ];
  }

  return [];
}

function hasScaEvidenceOrUnavailableDisposition(sca: RawRecord) {
  const state = readOptionalString(sca, "state");
  const evidencePath = readOptionalString(sca, "evidence_path");
  const unavailableDisposition = readOptionalString(
    sca,
    "unavailable_tool_disposition"
  );

  return (
    (state === "pass" && Boolean(evidencePath)) ||
    (state === "unavailable_with_disposition" &&
      Boolean(unavailableDisposition))
  );
}

function hasChangedSurface(
  evidence: SupplyChainGateEvidence,
  surfaceName: string
) {
  return evidence.changedSurfaces.some(
    (surface) => readOptionalString(surface, "surface") === surfaceName
  );
}

function formatSurfaceState(evidence: SupplyChainGateEvidence) {
  const risks = evidence.changedSurfaces.map((surface) =>
    readOptionalString(surface, "risk")
  );
  const state = risks.includes("high")
    ? "high"
    : risks.includes("elevated")
      ? "elevated"
      : risks.includes("unknown")
        ? "unknown"
        : "low";

  return `${evidence.workItem}:${state}`;
}

function formatOperatorSupervision(evidence: SupplyChainGateEvidence) {
  const required = readRequiredBoolean(
    evidence.operatorSupervisedApproval,
    "required",
    "operator_supervised_approval"
  );
  return `${evidence.workItem}:${required ? "required" : "not_required"}`;
}

function formatAutoLandingEligibility(evidence: SupplyChainGateEvidence) {
  const eligible = readRequiredBoolean(
    evidence.autoLanding,
    "eligible",
    "auto_landing"
  );
  return `${evidence.workItem}:${eligible ? "eligible" : "blocked"}`;
}

function parseJsonObject(content: string, label: string): RawRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Malformed ${label}: invalid JSON`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`Malformed ${label}: expected object`);
  }

  return parsed;
}

async function readRequiredFile(
  filePath: string,
  displayPath: string,
  kind: string
) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      const prefix =
        kind === "policy"
          ? "Missing required policy"
          : kind === "template"
            ? "Missing required template"
            : "Missing required supply-chain gate evidence";
      throw new Error(`${prefix}: ${displayPath}`);
    }
    throw error;
  }
}

function readRequiredRecord(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (!isRecord(value)) {
    throw new Error(`Malformed ${label}: ${field} must be object`);
  }

  return value;
}

function readRequiredRecordList(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(`Malformed ${label}: ${field} must be an object list`);
  }

  return value;
}

function readRequiredStringList(
  record: RawRecord,
  field: string,
  label: string
) {
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string")
  ) {
    throw new Error(`Malformed ${label}: ${field} must be a string list`);
  }

  return value
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function readRequiredString(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Malformed ${label}: ${field} must be string`);
  }

  return value.trim();
}

function readOptionalString(record: RawRecord, field: string) {
  const value = record[field];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function readRequiredBoolean(record: RawRecord, field: string, label: string) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${label}: ${field} must be boolean`);
  }

  return value;
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
