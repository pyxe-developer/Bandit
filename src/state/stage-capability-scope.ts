import { readFile } from "node:fs/promises";
import path from "node:path";

export type StageCapabilityScopeValidationReport = {
  status: "pass";
  policy: string;
  stages: string[];
  authority_roles: string[];
  required_skill_contracts: string[];
  forbidden_actions: string[];
  soft_budget_bands: string[];
};

type RawRecord = Record<string, unknown>;

const POLICY_DISPLAY_PATH = ".bandit/policy/stage-capability-scope.json";
const TEMPLATE_DISPLAY_PATH = "docs/templates/stage-capability-scope.md";
const WRITER_AUTHORITY_ROLE = "writer";

const TEST_SURFACE_ACTIONS = [
  "edit_tests",
  "edit_test_helpers",
  "edit_fixtures",
  "edit_red_evidence",
  "edit_acceptance_mappings"
];

const REQUIRED_STAGE_FIELDS = [
  "authority_role",
  "required_skills",
  "allowed_tools",
  "inputs",
  "outputs",
  "evidence",
  "forbidden_actions"
];

const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "policy",
  "stage_id",
  "authority_role",
  "required_skills",
  "allowed_tools",
  "inputs",
  "outputs",
  "evidence",
  "forbidden_actions",
  "skill_lifecycle_contracts",
  "soft_budget_bands",
  "source_artifacts"
];

export async function validateStageCapabilityScope(
  repoRoot: string
): Promise<StageCapabilityScopeValidationReport> {
  await validateTemplate(repoRoot);
  const content = await readRequiredPolicy(repoRoot);
  return parseAndValidatePolicy(content);
}

export async function validateStageCapabilityScopePolicy(
  repoRoot: string
): Promise<void> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return;
    throw error;
  }
  await validateTemplate(repoRoot);
  parseAndValidatePolicy(content);
}

export async function readStageCapabilityScopePolicyStagesCount(
  repoRoot: string
): Promise<number> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  try {
    const content = await readFile(policyPath, "utf8");
    const parsed = JSON.parse(content) as unknown;
    if (isRecord(parsed) && Array.isArray(parsed.stages)) {
      return (parsed.stages as unknown[]).length;
    }
    return 0;
  } catch {
    return 0;
  }
}

async function validateTemplate(repoRoot: string) {
  const templatePath = path.join(repoRoot, TEMPLATE_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(templatePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${TEMPLATE_DISPLAY_PATH}`);
    }
    throw error;
  }

  const missingFields = REQUIRED_TEMPLATE_FIELDS.filter(
    (field) => !new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Malformed template: ${TEMPLATE_DISPLAY_PATH}; missing required fields: ${missingFields.join(", ")}`
    );
  }
}

async function readRequiredPolicy(repoRoot: string): Promise<string> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  try {
    return await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
    }
    throw error;
  }
}

function parseAndValidatePolicy(content: string): StageCapabilityScopeValidationReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed stage capability scope policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error(
      "Malformed stage capability scope policy: missing contract_version 1"
    );
  }

  if (parsed.policy_id !== "stage-capability-scope") {
    throw new Error(
      "Malformed stage capability scope policy: policy_id must be stage-capability-scope"
    );
  }

  if (!Array.isArray(parsed.stages)) {
    throw new Error(
      "Malformed stage capability scope policy: stages must be an array"
    );
  }

  const stages: string[] = [];
  const authorityRoles: string[] = [];
  const requiredSkillContracts: string[] = [];
  let writerForbiddenActions: string[] = [];
  const softBudgetBands: string[] = [];

  for (const rawStage of parsed.stages as unknown[]) {
    if (!isRecord(rawStage)) {
      throw new Error(
        "Malformed stage capability scope policy: each stage must be an object"
      );
    }

    const stageId = requireStageId(rawStage);
    validateRequiredStageFields(rawStage, stageId);
    collectLoadBearingSkillContracts(rawStage, stageId, requiredSkillContracts);
    validateWriterTestSurfaceAuthority(rawStage);

    stages.push(stageId);

    const authorityRole = rawStage.authority_role as string;
    if (!authorityRoles.includes(authorityRole)) {
      authorityRoles.push(authorityRole);
    }

    if (authorityRole === WRITER_AUTHORITY_ROLE) {
      writerForbiddenActions = Array.isArray(rawStage.forbidden_actions)
        ? (rawStage.forbidden_actions as string[])
        : [];
    }

    const softBudgetBand = rawStage.soft_budget_band;
    if (
      typeof softBudgetBand === "string" &&
      softBudgetBand.trim().length > 0 &&
      !softBudgetBands.includes(softBudgetBand)
    ) {
      softBudgetBands.push(softBudgetBand);
    }
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    stages,
    authority_roles: authorityRoles,
    required_skill_contracts: requiredSkillContracts,
    forbidden_actions: writerForbiddenActions,
    soft_budget_bands: softBudgetBands
  };
}

function requireStageId(stage: RawRecord): string {
  const value = stage.stage_id;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      "Malformed stage capability scope policy: stage_id must be a non-empty string"
    );
  }
  return value.trim();
}

function validateRequiredStageFields(stage: RawRecord, stageId: string) {
  const hasMissingField = REQUIRED_STAGE_FIELDS.some(
    (field) => stage[field] == null
  );

  if (hasMissingField) {
    throw new Error(
      `stage capability scope ${stageId} requires authority_role, required_skills, allowed_tools, inputs, outputs, evidence, and forbidden_actions`
    );
  }
}

function collectLoadBearingSkillContracts(
  stage: RawRecord,
  stageId: string,
  contracts: string[]
) {
  if (!Array.isArray(stage.required_skills)) return;

  for (const skill of stage.required_skills as unknown[]) {
    if (!isRecord(skill) || skill.load_bearing !== true) continue;

    const lifecycleContract = skill.lifecycle_contract;
    if (
      typeof lifecycleContract !== "string" ||
      lifecycleContract.trim().length === 0
    ) {
      const skillId =
        typeof skill.skill_id === "string" ? skill.skill_id : "unknown";
      throw new Error(
        `load-bearing skill ${skillId} for ${stageId} requires a skill lifecycle contract reference`
      );
    }

    if (!contracts.includes(lifecycleContract)) {
      contracts.push(lifecycleContract);
    }
  }
}

function validateWriterTestSurfaceAuthority(stage: RawRecord) {
  if (stage.authority_role !== WRITER_AUTHORITY_ROLE) return;
  if (!Array.isArray(stage.allowed_tools)) return;

  const hasTestSurfaceInAllowedTools = TEST_SURFACE_ACTIONS.some((action) =>
    (stage.allowed_tools as unknown[]).includes(action)
  );

  if (hasTestSurfaceInAllowedTools) {
    throw new Error(
      "Stage 3 Writer capability scope cannot authorize edits to tests, test helpers, fixtures, RED evidence, or acceptance mappings"
    );
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
