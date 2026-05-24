import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type LandingAgentContract = {
  version: 1;
  authority: "cli_owned_landing_agent";
  supportedActions: ["local_record"];
  requireAutoLandEligible: true;
  requireCleanWorktree: true;
  writeLandingAction: true;
  allowMerge: false;
  allowPush: false;
  allowDeploy: false;
  operatorOwnedBoundaries: string[];
};

const LANDING_AGENT_CONTRACT_DISPLAY_PATH = ".bandit/policy/landing-agent.json";
const SUPPORTED_CONTRACT_FIELDS = new Set([
  "version",
  "authority",
  "supported_actions",
  "require_auto_land_eligible",
  "require_clean_worktree",
  "write_landing_action",
  "allow_merge",
  "allow_push",
  "allow_deploy",
  "operator_owned_boundaries"
]);

export async function readLandingAgentContract(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredContractFile(
    paths.landingAgentContract,
    LANDING_AGENT_CONTRACT_DISPLAY_PATH
  );

  return parseLandingAgentContract(content);
}

export async function writeDefaultLandingAgentContract(filePath: string) {
  const contract = {
    version: 1,
    authority: "cli_owned_landing_agent",
    supported_actions: ["local_record"],
    require_auto_land_eligible: true,
    require_clean_worktree: true,
    write_landing_action: true,
    allow_merge: false,
    allow_push: false,
    allow_deploy: false,
    operator_owned_boundaries: [
      "product_uat",
      "policy_change",
      "business_tradeoff",
      "cost_override",
      "risk_override"
    ]
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
}

export async function validateLandingAgentContract(repoRoot: string) {
  await readLandingAgentContract(repoRoot);
}

export function parseLandingAgentContract(
  content: string
): LandingAgentContract {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed Landing Agent contract: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.version !== 1) {
    throw new Error("Malformed Landing Agent contract: missing version 1");
  }

  for (const field of Object.keys(parsed)) {
    if (!SUPPORTED_CONTRACT_FIELDS.has(field)) {
      throw new Error(`Malformed Landing Agent contract: unsupported field ${field}`);
    }
  }

  const authority = requireString(parsed, "authority");
  const supportedActions = requireStringArray(parsed, "supported_actions");
  const requireAutoLandEligible = requireBoolean(
    parsed,
    "require_auto_land_eligible"
  );
  const requireCleanWorktree = requireBoolean(parsed, "require_clean_worktree");
  const writeLandingAction = requireBoolean(parsed, "write_landing_action");
  const allowMerge = requireBoolean(parsed, "allow_merge");
  const allowPush = requireBoolean(parsed, "allow_push");
  const allowDeploy = requireBoolean(parsed, "allow_deploy");
  const operatorOwnedBoundaries = requireStringArray(
    parsed,
    "operator_owned_boundaries"
  );

  if (authority !== "cli_owned_landing_agent") {
    throw new Error(
      "Malformed Landing Agent contract: authority must be cli_owned_landing_agent"
    );
  }

  if (supportedActions.length !== 1 || supportedActions[0] !== "local_record") {
    throw new Error(
      "Malformed Landing Agent contract: supported_actions must be [local_record]"
    );
  }

  if (!requireAutoLandEligible) {
    throw new Error(
      "Malformed Landing Agent contract: require_auto_land_eligible must be true"
    );
  }

  if (!requireCleanWorktree) {
    throw new Error(
      "Malformed Landing Agent contract: require_clean_worktree must be true"
    );
  }

  if (!writeLandingAction) {
    throw new Error(
      "Malformed Landing Agent contract: write_landing_action must be true"
    );
  }

  if (allowMerge || allowPush || allowDeploy) {
    throw new Error(
      "Malformed Landing Agent contract: merge, push, and deploy must be disabled"
    );
  }

  return {
    version: 1,
    authority,
    supportedActions: ["local_record"],
    requireAutoLandEligible,
    requireCleanWorktree,
    writeLandingAction,
    allowMerge,
    allowPush,
    allowDeploy,
    operatorOwnedBoundaries
  };
}

async function readRequiredContractFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing Landing Agent contract: ${displayPath}`);
    }
    throw error;
  }
}

function requireBoolean(rawContract: Record<string, unknown>, field: string) {
  const value = rawContract[field];

  if (typeof value !== "boolean") {
    throw new Error(`Malformed Landing Agent contract: ${field} must be boolean`);
  }

  return value;
}

function requireString(rawContract: Record<string, unknown>, field: string) {
  const value = rawContract[field];

  if (typeof value !== "string") {
    throw new Error(`Malformed Landing Agent contract: ${field} must be string`);
  }

  return value;
}

function requireStringArray(rawContract: Record<string, unknown>, field: string) {
  const value = rawContract[field];

  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string")
  ) {
    throw new Error(
      `Malformed Landing Agent contract: ${field} must be a string array`
    );
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
