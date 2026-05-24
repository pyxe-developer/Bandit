import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type AutoLandingPolicy = {
  version: 1;
  requireSafeToLand: true;
  requireCurrentSource: true;
  allowChores: boolean;
  allowFeatureSlicesWithCurrentUat: boolean;
  performMerge: false;
};

const AUTO_LANDING_POLICY_DISPLAY_PATH = ".bandit/policy/auto-landing.json";
const SUPPORTED_POLICY_FIELDS = new Set([
  "version",
  "require_safe_to_land",
  "require_current_source",
  "allow_chores",
  "allow_feature_slices_with_current_uat",
  "perform_merge"
]);

export async function readAutoLandingPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.autoLandingPolicy,
    AUTO_LANDING_POLICY_DISPLAY_PATH
  );

  return parseAutoLandingPolicy(content);
}

export async function writeDefaultAutoLandingPolicy(filePath: string) {
  const policy = {
    version: 1,
    require_safe_to_land: true,
    require_current_source: true,
    allow_chores: true,
    allow_feature_slices_with_current_uat: true,
    perform_merge: false
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateAutoLandingPolicy(repoRoot: string) {
  await readAutoLandingPolicy(repoRoot);
}

export function parseAutoLandingPolicy(content: string): AutoLandingPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed auto-landing policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.version !== 1) {
    throw new Error("Malformed auto-landing policy: missing version 1");
  }

  for (const field of Object.keys(parsed)) {
    if (!SUPPORTED_POLICY_FIELDS.has(field)) {
      throw new Error(`Malformed auto-landing policy: unsupported field ${field}`);
    }
  }

  const requireSafeToLand = requireBoolean(parsed, "require_safe_to_land");
  const requireCurrentSource = requireBoolean(parsed, "require_current_source");
  const allowChores = requireBoolean(parsed, "allow_chores");
  const allowFeatureSlicesWithCurrentUat = requireBoolean(
    parsed,
    "allow_feature_slices_with_current_uat"
  );
  const performMerge = requireBoolean(parsed, "perform_merge");

  if (!requireSafeToLand) {
    throw new Error("Malformed auto-landing policy: require_safe_to_land must be true");
  }

  if (!requireCurrentSource) {
    throw new Error("Malformed auto-landing policy: require_current_source must be true");
  }

  if (performMerge) {
    throw new Error("Malformed auto-landing policy: perform_merge must be false");
  }

  return {
    version: 1,
    requireSafeToLand,
    requireCurrentSource,
    allowChores,
    allowFeatureSlicesWithCurrentUat,
    performMerge
  };
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

function requireBoolean(rawPolicy: Record<string, unknown>, field: string) {
  const value = rawPolicy[field];

  if (typeof value !== "boolean") {
    throw new Error(`Malformed auto-landing policy: ${field} must be boolean`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
