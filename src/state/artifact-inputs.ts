import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const ARTIFACT_INPUTS_POLICY_PATH = ".bandit/policy/artifact-inputs.json";

type SupportedClass = {
  class_id: string;
  preferred_directory: string;
  path_patterns: string[];
  [key: string]: unknown;
};

type ObservedInput = {
  path: string;
  declared_class: string;
  consumer: string;
  legacy: boolean;
};

type ArtifactInputPolicy = {
  contract_version: number;
  policy_id: string;
  supported_classes: SupportedClass[];
  observed_inputs: ObservedInput[];
  [key: string]: unknown;
};

export type ArtifactInputValidationReport = {
  status: "pass";
  supported_classes: SupportedClass[];
  preferred_directories: Record<string, string>;
  legacy_readable_paths?: string[];
};

export async function validateArtifactInputTaxonomy(
  repoRoot: string
): Promise<ArtifactInputValidationReport> {
  const policy = await readRequiredPolicy(repoRoot);

  const legacyReadablePaths: string[] = [];
  const errors: string[] = [];

  for (const input of policy.observed_inputs) {
    const result = validateObservedInput(input, policy.supported_classes);
    errors.push(...result.errors);
    if (result.isLegacy) {
      legacyReadablePaths.push(input.path);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  const preferred_directories: Record<string, string> = {};
  for (const cls of policy.supported_classes) {
    preferred_directories[cls.class_id] = cls.preferred_directory;
  }

  const report: ArtifactInputValidationReport = {
    status: "pass",
    supported_classes: policy.supported_classes,
    preferred_directories
  };

  if (legacyReadablePaths.length > 0) {
    report.legacy_readable_paths = legacyReadablePaths;
  }

  return report;
}

export async function validateArtifactInputsPolicy(repoRoot: string): Promise<void> {
  const raw = await readOptionalPolicyFile(repoRoot);
  if (raw === null) return;
  parsePolicyJson(raw);
}

export async function artifactInputsPolicyExists(repoRoot: string): Promise<boolean> {
  try {
    await stat(path.join(repoRoot, ARTIFACT_INPUTS_POLICY_PATH));
    return true;
  } catch {
    return false;
  }
}

function validateObservedInput(
  input: ObservedInput,
  supportedClasses: SupportedClass[]
): { errors: string[]; isLegacy: boolean } {
  const errors: string[] = [];

  if (isUnsafeInputPath(input.path)) {
    errors.push(`Unsafe artifact input path: ${input.path}`);
    return { errors, isLegacy: false };
  }

  if (input.legacy) {
    return { errors, isLegacy: true };
  }

  const classConfig = supportedClasses.find((c) => c.class_id === input.declared_class);
  if (!classConfig) {
    errors.push(`Unknown artifact input class: ${input.declared_class}`);
    return { errors, isLegacy: false };
  }

  if (isAmbiguousDocSpecsPath(input.path, input.declared_class)) {
    errors.push(`Ambiguous artifact input path: ${input.path}`);
    errors.push(`${input.declared_class} inputs must use ${classConfig.preferred_directory}`);
  } else if (!pathMatchesPreferredDirectory(input.path, classConfig.preferred_directory)) {
    errors.push(`Artifact input class mismatch: ${input.path}`);
  }

  return { errors, isLegacy: false };
}

function isUnsafeInputPath(inputPath: string): boolean {
  if (path.isAbsolute(inputPath)) return true;
  const normalized = path.normalize(inputPath);
  return normalized === ".." || normalized.startsWith(".." + path.sep);
}

function isAmbiguousDocSpecsPath(inputPath: string, declaredClass: string): boolean {
  return inputPath.startsWith("docs/specs/") && declaredClass !== "work_or_gap_spec";
}

function pathMatchesPreferredDirectory(inputPath: string, preferredDirectory: string): boolean {
  return inputPath.startsWith(preferredDirectory + "/");
}

async function readRequiredPolicy(repoRoot: string): Promise<ArtifactInputPolicy> {
  const raw = await readOptionalPolicyFile(repoRoot);
  if (raw === null) {
    throw new Error(`Missing required policy: ${ARTIFACT_INPUTS_POLICY_PATH}`);
  }
  return parsePolicyJson(raw);
}

async function readOptionalPolicyFile(repoRoot: string): Promise<string | null> {
  try {
    return await readFile(path.join(repoRoot, ARTIFACT_INPUTS_POLICY_PATH), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return null;
    throw error;
  }
}

function parsePolicyJson(raw: string): ArtifactInputPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Malformed artifact-inputs policy: invalid JSON");
  }

  if (!isRecord(parsed)) {
    throw new Error("Malformed artifact-inputs policy: expected object");
  }

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed artifact-inputs policy: contract_version must be 1");
  }

  if (parsed.policy_id !== "artifact-input-directory-taxonomy") {
    throw new Error(
      "Malformed artifact-inputs policy: policy_id must be artifact-input-directory-taxonomy"
    );
  }

  if (!Array.isArray(parsed.supported_classes)) {
    throw new Error("Malformed artifact-inputs policy: supported_classes must be an array");
  }

  if (!Array.isArray(parsed.observed_inputs)) {
    throw new Error("Malformed artifact-inputs policy: observed_inputs must be an array");
  }

  return parsed as unknown as ArtifactInputPolicy;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
