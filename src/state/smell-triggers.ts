import { readFile } from "node:fs/promises";
import { getBanditPaths } from "./paths.js";

export type SmellTrigger = {
  id: string;
  name: string;
  category: string;
  trigger: string;
  severity: string;
  defaultAction: string;
  escalationTarget: string;
  requiredEvidence: string[];
};

export type SmellCatalog = {
  version: 1;
  smells: SmellTrigger[];
  smellIds: Set<string>;
};

const SMELL_CATALOG_DISPLAY_PATH = ".bandit/policy/smell-triggers.json";

const SUPPORTED_SEVERITIES = new Set([
  "blocker",
  "non_blocking",
  "bootstrap_gap"
]);

const SUPPORTED_ACTIONS = new Set([
  "create_improvement_chore",
  "compress_context",
  "fail_validation",
  "halt_for_operator_input",
  "record_bootstrap_gap",
  "refresh_evidence",
  "reject_hidden_authority",
  "repair_artifact",
  "require_coderabbit_review",
  "require_coverage",
  "require_data_integrity_review",
  "require_escalated_review",
  "require_generated_schema_source",
  "require_jsonl_replay_tests",
  "require_landing_repair",
  "require_parser_validator_tests",
  "require_pm_disposition",
  "require_qwen_review",
  "require_release_review",
  "require_schema_review",
  "require_test_change_rationale",
  "require_uat_refresh",
  "split_orchestration",
  "split_slice",
  "update_policy"
]);

export async function readSmellCatalog(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.smellTriggers,
    SMELL_CATALOG_DISPLAY_PATH
  );

  return parseSmellCatalog(content);
}

export function parseSmellCatalog(content: string): SmellCatalog {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed smell trigger catalog: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.version !== 1) {
    throw new Error("Malformed smell trigger catalog: missing version 1");
  }

  if (!Array.isArray(parsed.smells) || parsed.smells.length === 0) {
    throw new Error("Malformed smell trigger catalog: missing smells");
  }

  const smellIds = new Set<string>();
  const smells = parsed.smells.map((rawSmell, index) => {
    const smell = parseSmellTrigger(rawSmell, index + 1);

    if (smellIds.has(smell.id)) {
      throw new Error(`Duplicate smell trigger ID: ${smell.id}`);
    }

    smellIds.add(smell.id);
    return smell;
  });

  return {
    version: 1,
    smells,
    smellIds
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

function parseSmellTrigger(rawSmell: unknown, smellNumber: number) {
  if (!isRecord(rawSmell)) {
    throw new Error(`Malformed smell trigger at index ${smellNumber}`);
  }

  const severity = requireString(rawSmell, "severity", smellNumber);
  if (!SUPPORTED_SEVERITIES.has(severity)) {
    throw new Error(`Unsupported smell trigger severity: ${severity}`);
  }

  const defaultAction = requireString(
    rawSmell,
    "default_action",
    smellNumber
  );
  if (!SUPPORTED_ACTIONS.has(defaultAction)) {
    throw new Error(`Unsupported smell trigger action: ${defaultAction}`);
  }

  return {
    id: requireString(rawSmell, "id", smellNumber),
    name: requireString(rawSmell, "name", smellNumber),
    category: requireString(rawSmell, "category", smellNumber),
    trigger: requireString(rawSmell, "trigger", smellNumber),
    severity,
    defaultAction,
    escalationTarget: requireString(
      rawSmell,
      "escalation_target",
      smellNumber
    ),
    requiredEvidence: requireStringList(
      rawSmell,
      "required_evidence",
      smellNumber
    )
  };
}

function requireString(
  record: Record<string, unknown>,
  field: string,
  smellNumber: number
) {
  const value = record[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Malformed smell trigger at index ${smellNumber}: missing required field: ${field}`
    );
  }

  return value.trim();
}

function requireStringList(
  record: Record<string, unknown>,
  field: string,
  smellNumber: number
) {
  const value = record[field];

  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error(
      `Malformed smell trigger at index ${smellNumber}: missing required field: ${field}`
    );
  }

  return value.map((item) => item.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
