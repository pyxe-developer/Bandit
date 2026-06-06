import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH = ".bandit/policy/role-contracts.json";
const ARTIFACT_INPUTS_POLICY_PATH = ".bandit/policy/artifact-inputs.json";

const REQUIRED_ARTIFACT_INPUT_SURFACES = [
  ".bandit/policy/artifact-inputs.json",
  "docs/artifact-inputs/**",
  "docs/reviewer-captures/.gitkeep",
  "docs/trust-snapshot-fixtures/.gitkeep"
];

const REQUIRED_ROLE_FIELDS = [
  "role_id",
  "version",
  "authority_boundary",
  "allowed_stages",
  "required_inputs",
  "allowed_tools_or_command_families",
  "allowed_write_surface_families",
  "forbidden_actions",
  "required_output_summary",
  "validation_commands",
  "escalation_paths",
  "rollback_or_supersession_rule",
  "owner"
];

export type RoleContractsValidationReport = {
  status: "pass";
  policy: string;
  roles: string[];
  manifest_authority: "append_only_evidence";
  projection_authority: "derived_non_canonical";
};

export type RoleContract = {
  role_id: string;
  version: string;
  allowed_stages: string[];
  allowed_write_surface_families: string[];
  forbidden_actions: string[];
};

type RawRecord = Record<string, unknown>;

export async function validateRoleContracts(
  repoRoot: string
): Promise<RoleContractsValidationReport> {
  const content = await readRequiredPolicy(repoRoot);
  const requireArtifactInputSurfaces = await artifactInputsPolicyExists(repoRoot);
  return parseAndValidatePolicy(content, requireArtifactInputSurfaces);
}

export async function validateRoleContractsPolicy(repoRoot: string): Promise<void> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return;
    throw error;
  }
  const requireArtifactInputSurfaces = await artifactInputsPolicyExists(repoRoot);
  parseAndValidatePolicy(content, requireArtifactInputSurfaces);
}

async function artifactInputsPolicyExists(repoRoot: string): Promise<boolean> {
  try {
    await stat(path.join(repoRoot, ARTIFACT_INPUTS_POLICY_PATH));
    return true;
  } catch {
    return false;
  }
}

export async function readRoleContractRoles(repoRoot: string): Promise<RoleContract[]> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  const content = await readFile(policyPath, "utf8");
  const parsed = JSON.parse(content) as unknown;
  if (!isRecord(parsed) || !Array.isArray(parsed.roles)) {
    throw new Error(`Malformed role contracts policy: ${POLICY_DISPLAY_PATH}`);
  }
  return (parsed.roles as unknown[]).filter(isRecord).map((role) => ({
    role_id: typeof role.role_id === "string" ? role.role_id : "",
    version: typeof role.version === "string" ? role.version : "",
    allowed_stages: Array.isArray(role.allowed_stages)
      ? (role.allowed_stages as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
    allowed_write_surface_families: Array.isArray(role.allowed_write_surface_families)
      ? (role.allowed_write_surface_families as unknown[]).filter(
          (s): s is string => typeof s === "string"
        )
      : [],
    forbidden_actions: Array.isArray(role.forbidden_actions)
      ? (role.forbidden_actions as unknown[]).filter((s): s is string => typeof s === "string")
      : []
  }));
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

function parseAndValidatePolicy(
  content: string,
  requireArtifactInputSurfaces: boolean
): RoleContractsValidationReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed role contracts policy: invalid JSON");
  }

  if (!isRecord(parsed)) {
    throw new Error("Malformed role contracts policy: must be an object");
  }

  validateAuthorityBoundary(parsed);

  if (!Array.isArray(parsed.roles)) {
    throw new Error("Malformed role contracts policy: roles must be an array");
  }

  const roleIds: string[] = [];
  for (const rawRole of parsed.roles as unknown[]) {
    if (!isRecord(rawRole)) {
      throw new Error("Malformed role contracts policy: each role must be an object");
    }
    validateRole(rawRole, requireArtifactInputSurfaces);
    roleIds.push(rawRole.role_id as string);
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    roles: roleIds,
    manifest_authority: "append_only_evidence",
    projection_authority: "derived_non_canonical"
  };
}

function validateAuthorityBoundary(policy: RawRecord): void {
  const boundary = policy.authority_boundary;
  if (!isRecord(boundary)) return;
  if (boundary.manifests_can_satisfy_coordination_history === true) {
    throw new Error(
      "role contracts and role-run manifests cannot replace coordination history, review evidence, landing evidence, or closeout evidence"
    );
  }
}

function validateRole(role: RawRecord, requireArtifactInputSurfaces: boolean): void {
  const roleId = typeof role.role_id === "string" ? role.role_id : "unknown";

  const missingField = REQUIRED_ROLE_FIELDS.find((field) => !isValidRequiredField(role[field]));
  if (missingField) {
    throw new Error(
      `role contract ${roleId} requires role_id, version, authority_boundary, allowed_stages, required_inputs, allowed_tools_or_command_families, allowed_write_surface_families, forbidden_actions, required_output_summary, validation_commands, escalation_paths, rollback_or_supersession_rule, and owner`
    );
  }

  if (roleId === "implementation_writer") {
    validateImplementationWriterSurfaces(role, requireArtifactInputSurfaces);
  }
}

function isValidRequiredField(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) {
    return (
      value.length > 0 &&
      value.every((item) => typeof item === "string" && item.trim().length > 0)
    );
  }
  if (typeof value === "object") {
    return Object.keys(value as RawRecord).length > 0;
  }
  return true;
}

function validateImplementationWriterSurfaces(
  role: RawRecord,
  requireArtifactInputSurfaces: boolean
): void {
  if (!Array.isArray(role.allowed_write_surface_families)) return;
  const surfaces = role.allowed_write_surface_families as unknown[];

  const hasTestSurface = surfaces.some(
    (surface) =>
      typeof surface === "string" &&
      (surface === "test_surfaces" ||
        surface.startsWith("test/") ||
        surface.startsWith("test\\"))
  );

  if (hasTestSurface) {
    throw new Error(
      "implementation_writer role contract cannot authorize tests, test helpers, fixtures, RED evidence, or acceptance mappings"
    );
  }

  if (!requireArtifactInputSurfaces) return;

  const declaredSurfaces = surfaces.filter((s): s is string => typeof s === "string");
  const missingSurfaces = REQUIRED_ARTIFACT_INPUT_SURFACES.filter(
    (surface) => !declaredSurfaces.includes(surface)
  );

  if (missingSurfaces.length > 0) {
    throw new Error(
      `implementation_writer role contract must include artifact-input policy support surfaces: ${REQUIRED_ARTIFACT_INPUT_SURFACES.join(", ")}`
    );
  }
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
