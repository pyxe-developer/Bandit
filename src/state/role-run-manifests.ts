import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { readRoleContractRoles, type RoleContract } from "./role-contracts.js";

const POLICY_DISPLAY_PATH = ".bandit/policy/role-contracts.json";

const OBSERVED_CHANGED_FILES_MIN_CONTRACT_VERSION = 2;

export type RoleRunManifestsValidationReport = {
  status: "pass";
  work_item: string;
  manifests: string[];
  role_contracts: string;
  authority: "append_only_evidence";
  projection_authority: "derived_non_canonical";
};

type RawRecord = Record<string, unknown>;

export async function validateRoleRunManifests(
  repoRoot: string,
  workItemId: string
): Promise<RoleRunManifestsValidationReport> {
  const roles = await readRoleContractRoles(repoRoot);
  const manifestPaths = await findManifestPaths(repoRoot, workItemId);

  for (const manifestPath of manifestPaths) {
    const content = await readFile(manifestPath, "utf8");
    const manifest = parseManifest(content, manifestPath);
    await validateManifest(repoRoot, manifest, manifestPath, roles);
  }

  const relativeManifestPaths = manifestPaths
    .map((p) => path.relative(repoRoot, p).split(path.sep).join("/"))
    .sort();

  return {
    status: "pass",
    work_item: workItemId,
    manifests: relativeManifestPaths,
    role_contracts: POLICY_DISPLAY_PATH,
    authority: "append_only_evidence",
    projection_authority: "derived_non_canonical"
  };
}

async function findManifestPaths(repoRoot: string, workItemId: string): Promise<string[]> {
  const dir = path.join(repoRoot, "docs/role-runs", workItemId);
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch (error) {
    if (isMissingPathError(error)) return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => path.join(dir, entry));
}

function parseManifest(content: string, filePath: string): RawRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Malformed role-run manifest: invalid JSON in ${filePath}`);
  }
  if (!isRecord(parsed)) {
    throw new Error(`Malformed role-run manifest: must be an object in ${filePath}`);
  }
  return parsed;
}

async function validateManifest(
  repoRoot: string,
  manifest: RawRecord,
  filePath: string,
  roles: RoleContract[]
): Promise<void> {
  const manifestId = resolveManifestId(manifest, filePath);

  validateRequiredManifestFields(manifest, manifestId);
  validateManifestAuthorityBoundary(manifest, manifestId);
  await validateBaseRevisionAndSourceArtifacts(repoRoot, manifest, manifestId);
  await validateInputPacketRef(repoRoot, manifest, manifestId);

  const roleContractRef = manifest.role_contract_ref;
  const roleId =
    isRecord(roleContractRef) && typeof roleContractRef.role_id === "string"
      ? roleContractRef.role_id
      : "";
  const version =
    isRecord(roleContractRef) && typeof roleContractRef.version === "string"
      ? roleContractRef.version
      : "";

  const matchedRole = findRoleContract(roles, roleId, version, manifestId);
  validateRoleStageCompatibility(manifest, matchedRole, manifestId);
  validateObservedChangedFiles(manifest, matchedRole, manifestId);
  validateTargetFiles(manifest, matchedRole, manifestId);
}

function resolveManifestId(manifest: RawRecord, filePath: string): string {
  if (typeof manifest.manifest_id === "string" && manifest.manifest_id.trim().length > 0) {
    return manifest.manifest_id;
  }
  return path.basename(filePath, ".json");
}

function validateRequiredManifestFields(manifest: RawRecord, manifestId: string): void {
  const missing: string[] = [];

  if (!isNonEmptyString(manifest.work_item_id)) missing.push("work_item_id");
  if (!isNonEmptyString(manifest.stage)) missing.push("stage");

  const ref = manifest.role_contract_ref;
  if (!isRecord(ref) || !isNonEmptyString(ref.role_id) || !isNonEmptyString(ref.version)) {
    missing.push("role_contract_ref.role_id and role_contract_ref.version");
  }

  if (!isNonEmptyString(manifest.capability_profile) && !isNonEmptyString(manifest.subagent_identity)) {
    missing.push("capability_profile or subagent_identity");
  }

  if (!isNonEmptyStringArray(manifest.allowed_target_files)) missing.push("allowed_target_files");
  if (!isNonEmptyStringArray(manifest.forbidden_file_patterns)) missing.push("forbidden_file_patterns");
  if (!isNonEmptyString(manifest.required_input_packet_ref)) missing.push("required_input_packet_ref");
  if (!isNonEmptyString(manifest.required_summary_path)) missing.push("required_summary_path");
  if (!isNonEmptyStringArray(manifest.validation_commands)) missing.push("validation_commands");

  if (missing.length > 0) {
    throw new Error(
      `role-run manifest ${manifestId} is missing required fields: ${missing.join(", ")}`
    );
  }
}

function validateManifestAuthorityBoundary(manifest: RawRecord, manifestId: string): void {
  const boundary = manifest.authority_boundary;
  if (!isRecord(boundary)) return;
  const prohibited =
    boundary.can_satisfy_coordination_history === true ||
    boundary.can_satisfy_review_or_landing_evidence === true ||
    boundary.can_satisfy_uat === true ||
    boundary.can_satisfy_retrospective === true;
  if (prohibited) {
    throw new Error(
      "role-run manifests cannot satisfy coordination history, review evidence, landing evidence, UAT, or retrospective evidence"
    );
  }
}

async function validateBaseRevisionAndSourceArtifacts(
  repoRoot: string,
  manifest: RawRecord,
  manifestId: string
): Promise<void> {
  const baseRevision = manifest.base_revision;
  if (!isNonEmptyString(baseRevision)) {
    throw new Error(
      `role-run manifest ${manifestId} requires base_revision and existing source artifacts`
    );
  }

  if (!isNonEmptyStringArray(manifest.source_artifacts)) {
    throw new Error(
      `role-run manifest ${manifestId} requires base_revision and existing source artifacts`
    );
  }

  const normalizedRoot = path.resolve(repoRoot);
  for (const artifact of manifest.source_artifacts as string[]) {
    const absPath = path.resolve(normalizedRoot, artifact);
    if (!absPath.startsWith(normalizedRoot + path.sep) || !(await isRegularFile(absPath))) {
      throw new Error(
        `role-run manifest ${manifestId} requires base_revision and existing source artifacts`
      );
    }
  }
}

async function validateInputPacketRef(
  repoRoot: string,
  manifest: RawRecord,
  manifestId: string
): Promise<void> {
  const ref = manifest.required_input_packet_ref as string;
  const normalizedRoot = path.resolve(repoRoot);
  const absRef = path.resolve(normalizedRoot, ref);
  if (!absRef.startsWith(normalizedRoot + path.sep) || !(await isRegularFile(absRef))) {
    throw new Error(
      `role-run manifest ${manifestId} requires existing required_input_packet_ref: ${ref}`
    );
  }
}

function findRoleContract(
  roles: RoleContract[],
  roleId: string,
  version: string,
  manifestId: string
): RoleContract {
  const matching = roles.find((r) => r.role_id === roleId);
  if (!matching || matching.version !== version) {
    throw new Error(
      `role-run manifest ${manifestId} references stale or missing role contract ${roleId}@${version}`
    );
  }
  return matching;
}

function validateRoleStageCompatibility(
  manifest: RawRecord,
  role: RoleContract,
  manifestId: string
): void {
  const stage = typeof manifest.stage === "string" ? manifest.stage : "";
  if (!role.allowed_stages.includes(stage)) {
    throw new Error(
      `role-run manifest ${manifestId} references role ${role.role_id}, which is not allowed for stage ${stage}`
    );
  }
}

function validateObservedChangedFiles(
  manifest: RawRecord,
  role: RoleContract,
  manifestId: string
): void {
  const contractVersion =
    typeof manifest.contract_version === "number" ? manifest.contract_version : 1;
  if (contractVersion < OBSERVED_CHANGED_FILES_MIN_CONTRACT_VERSION) return;

  if (!isNonEmptyStringArray(manifest.observed_changed_files)) {
    throw new Error(
      `role-run manifest ${manifestId} requires observed_changed_files for contract_version ${OBSERVED_CHANGED_FILES_MIN_CONTRACT_VERSION}`
    );
  }

  const allowedTargets = stringArray(manifest.allowed_target_files);
  const forbiddenPatterns = stringArray(manifest.forbidden_file_patterns);

  for (const file of manifest.observed_changed_files as string[]) {
    if (!allowedTargets.includes(file)) {
      throw new Error(
        `role-run manifest ${manifestId} observed changed file ${file} is not listed in allowed_target_files`
      );
    }
    if (!isTargetFileAllowed(file, role.allowed_write_surface_families, forbiddenPatterns)) {
      throw new Error(
        `role-run manifest ${manifestId} observed changed file ${file} is outside the ${role.role_id} contract write surfaces or matches a forbidden pattern`
      );
    }
  }
}

function validateTargetFiles(
  manifest: RawRecord,
  role: RoleContract,
  manifestId: string
): void {
  if (!Array.isArray(manifest.allowed_target_files)) return;

  const forbiddenPatterns = stringArray(manifest.forbidden_file_patterns);

  for (const file of manifest.allowed_target_files as unknown[]) {
    if (typeof file !== "string") continue;
    if (!isTargetFileAllowed(file, role.allowed_write_surface_families, forbiddenPatterns)) {
      throw new Error(
        `role-run manifest ${manifestId} target ${file} is outside the ${role.role_id} contract write surfaces or matches a forbidden pattern`
      );
    }
  }
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? (value as unknown[]).filter((item): item is string => typeof item === "string")
    : [];
}

function isTargetFileAllowed(
  file: string,
  writeSurfaces: string[],
  forbiddenPatterns: string[]
): boolean {
  if (forbiddenPatterns.some((pat) => matchesGlob(file, pat))) return false;
  return writeSurfaces.some((pat) => matchesGlob(file, pat));
}

function matchesGlob(filePath: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const regexStr = escaped
    .replace(/\*\*/g, "\x00")
    .replace(/\*/g, "[^/]*")
    .replace(/\x00/g, ".*");
  return new RegExp(`^${regexStr}$`).test(filePath);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isRegularFile(filePath: string): Promise<boolean> {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
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
