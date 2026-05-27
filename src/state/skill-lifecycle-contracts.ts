import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type SkillLifecycleValidationReport = {
  status: "pass";
  policy: typeof SKILL_LIFECYCLE_POLICY_DISPLAY_PATH;
  contracts: SkillLifecycleValidationSummary[];
};

export type SkillLifecycleValidationSummary = {
  skill_id: string;
  version: string;
  intended_stages: string[];
  evaluation_packets: string[];
  drift_evidence: string;
};

type RawContract = Record<string, unknown>;

const SKILL_LIFECYCLE_POLICY_DISPLAY_PATH =
  ".bandit/policy/skill-lifecycle-contracts.json";
const SKILL_LIFECYCLE_TEMPLATE_DISPLAY_PATH =
  "docs/templates/skill-lifecycle-contract.md";
const SUPPORTED_POLICY_FIELDS = new Set([
  "contract_version",
  "policy_id",
  "installed_skills_are_canonical",
  "contracts"
]);
const REQUIRED_TEMPLATE_FIELDS = [
  "skill_id",
  "owner",
  "version",
  "changelog",
  "intended_stages",
  "required_tools",
  "forbidden_actions",
  "evaluation_packets",
  "rollback_criteria",
  "stage_bindings",
  "installed_skill_drift"
];

export async function writeDefaultSkillLifecyclePolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "skill-lifecycle-contracts",
    installed_skills_are_canonical: false,
    contracts: []
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateSkillLifecycleContracts(repoRoot: string) {
  await validateSkillLifecycleTemplate(repoRoot);

  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.skillLifecyclePolicy,
    SKILL_LIFECYCLE_POLICY_DISPLAY_PATH
  );
  const parsed = parsePolicyEnvelope(content);
  const contracts: SkillLifecycleValidationSummary[] = [];
  const seenSkillIds = new Set<string>();

  for (const rawContract of parsed.contracts) {
    const contract = await validateContract(repoRoot, rawContract);

    if (seenSkillIds.has(contract.skill_id)) {
      throw new Error(
        `Malformed skill lifecycle contract ${contract.skill_id}: duplicate skill_id`
      );
    }

    seenSkillIds.add(contract.skill_id);
    contracts.push(contract);
  }

  return {
    status: "pass",
    policy: SKILL_LIFECYCLE_POLICY_DISPLAY_PATH,
    contracts
  } satisfies SkillLifecycleValidationReport;
}

async function validateSkillLifecycleTemplate(repoRoot: string) {
  const content = await readRequiredTemplateFile(
    path.join(repoRoot, SKILL_LIFECYCLE_TEMPLATE_DISPLAY_PATH),
    SKILL_LIFECYCLE_TEMPLATE_DISPLAY_PATH
  );

  const missingFields = REQUIRED_TEMPLATE_FIELDS.filter(
    (field) => !new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)
  );

  if (missingFields.length > 0) {
    const missing = missingFields
      .map((field) => `missing required field: ${field}`)
      .join("; ");
    throw new Error(
      `Malformed template: ${SKILL_LIFECYCLE_TEMPLATE_DISPLAY_PATH}; ${missing}`
    );
  }
}

function parsePolicyEnvelope(content: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed skill lifecycle policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error(
      "Malformed skill lifecycle policy: missing contract_version 1"
    );
  }

  for (const field of Object.keys(parsed)) {
    if (!SUPPORTED_POLICY_FIELDS.has(field)) {
      throw new Error(
        `Malformed skill lifecycle policy: unsupported field ${field}`
      );
    }
  }

  if (parsed.policy_id !== "skill-lifecycle-contracts") {
    throw new Error(
      "Malformed skill lifecycle policy: policy_id must be skill-lifecycle-contracts"
    );
  }

  if (parsed.installed_skills_are_canonical !== false) {
    throw new Error(
      "Malformed skill lifecycle policy: installed_skills_are_canonical must be false"
    );
  }

  if (
    !Array.isArray(parsed.contracts) ||
    !parsed.contracts.every((contract) => isRecord(contract))
  ) {
    throw new Error(
      "Malformed skill lifecycle policy: contracts must be an array of objects"
    );
  }

  return {
    contracts: parsed.contracts as RawContract[]
  };
}

async function validateContract(
  repoRoot: string,
  contract: RawContract
): Promise<SkillLifecycleValidationSummary> {
  const skillId = contractSkillId(contract);
  requireString(contract, "owner", skillId);
  const version = requireString(contract, "version", skillId);
  requireChangelog(contract, skillId);
  const intendedStages = requireStringList(contract, "intended_stages", skillId);
  requireStringList(contract, "required_tools", skillId);
  requireStringList(contract, "forbidden_actions", skillId);
  const evaluationPackets = requireStringList(
    contract,
    "evaluation_packets",
    skillId
  );
  requireStringList(contract, "rollback_criteria", skillId);
  validateStageBindings(contract, skillId, intendedStages);
  const driftEvidence = await validateInstalledSkillDrift(
    repoRoot,
    contract,
    skillId
  );

  for (const packetPath of evaluationPackets) {
    const displayPath = requireRepoRelativePath(
      packetPath,
      skillId,
      "evaluation packet"
    );
    await requireExistingFile(
      repoRoot,
      displayPath,
      `Malformed skill lifecycle contract ${skillId}: missing evaluation packet ${displayPath}`
    );
  }

  return {
    skill_id: skillId,
    version,
    intended_stages: intendedStages,
    evaluation_packets: evaluationPackets,
    drift_evidence: driftEvidence
  };
}

function contractSkillId(contract: RawContract) {
  const value = contract.skill_id;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      "Malformed skill lifecycle contract unknown: skill_id must be a non-empty string"
    );
  }
  return value.trim();
}

function requireString(contract: RawContract, field: string, skillId: string) {
  const value = contract[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: ${field} must be a non-empty string`
    );
  }
  return value.trim();
}

function requireStringList(
  contract: RawContract,
  field: string,
  skillId: string
) {
  const value = contract[field];
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: ${field} must be a non-empty string array`
    );
  }
  return value.map((item) => String(item).trim());
}

function requireChangelog(contract: RawContract, skillId: string) {
  const value = contract.changelog;
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: changelog must be a non-empty array`
    );
  }

  for (const entry of value) {
    if (!isRecord(entry)) {
      throw new Error(
        `Malformed skill lifecycle contract ${skillId}: changelog entries must be objects`
      );
    }
    requireString(entry, "date", skillId);
    requireString(entry, "summary", skillId);
  }
}

function validateStageBindings(
  contract: RawContract,
  skillId: string,
  intendedStages: string[]
) {
  const value = contract.stage_bindings;
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: stage_bindings must be a non-empty array`
    );
  }

  for (const binding of value) {
    if (!isRecord(binding)) {
      throw new Error(
        `Malformed skill lifecycle contract ${skillId}: stage bindings must be objects`
      );
    }

    const stage = requireString(binding, "stage", skillId);
    requireString(binding, "capability", skillId);
    const authority = requireString(binding, "authority", skillId);

    if (authority !== "stage_scoped_capability") {
      throw new Error(
        `Malformed skill lifecycle contract ${skillId}: stage binding authority must be stage_scoped_capability`
      );
    }

    if (!intendedStages.includes(stage)) {
      throw new Error(
        `Malformed skill lifecycle contract ${skillId}: stage binding stage must be listed in intended_stages`
      );
    }
  }
}

async function validateInstalledSkillDrift(
  repoRoot: string,
  contract: RawContract,
  skillId: string
) {
  const value = contract.installed_skill_drift;
  if (!isRecord(value)) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: installed_skill_drift must be an object`
    );
  }

  const evidencePath = requireString(value, "evidence_path", skillId);
  const displayPath = requireRepoRelativePath(
    evidencePath,
    skillId,
    "installed skill drift evidence"
  );
  const expectedSha256 = requireString(value, "expected_sha256", skillId);
  if (!/^[a-f0-9]{64}$/i.test(expectedSha256)) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: expected_sha256 must be a sha256 hex digest`
    );
  }

  if (value.required_before_policy_use !== true) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: required_before_policy_use must be true`
    );
  }

  const content = await readExistingFile(
    repoRoot,
    displayPath,
    `Malformed skill lifecycle contract ${skillId}: missing installed skill drift evidence ${displayPath}`
  );
  if (!content.includes(expectedSha256)) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: installed skill drift evidence must include expected_sha256`
    );
  }

  return displayPath;
}

function requireRepoRelativePath(value: string, skillId: string, field: string) {
  if (
    path.isAbsolute(value) ||
    value.includes("\0") ||
    value.split(/[\\/]+/).includes("..")
  ) {
    throw new Error(
      `Malformed skill lifecycle contract ${skillId}: ${field} must be repo-addressable`
    );
  }

  return value;
}

async function requireExistingFile(
  repoRoot: string,
  displayPath: string,
  missingMessage: string
) {
  try {
    await stat(path.join(repoRoot, displayPath));
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(missingMessage);
    }
    throw error;
  }
}

async function readExistingFile(
  repoRoot: string,
  displayPath: string,
  missingMessage: string
) {
  try {
    return await readFile(path.join(repoRoot, displayPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(missingMessage);
    }
    throw error;
  }
}

async function readRequiredPolicyFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${displayPath}`);
    }
    throw error;
  }
}

async function readRequiredTemplateFile(
  filePath: string,
  displayPath: string
) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${displayPath}`);
    }
    throw error;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
