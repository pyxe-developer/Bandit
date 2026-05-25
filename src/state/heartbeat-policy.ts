import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type HeartbeatPolicy = {
  contractVersion: 1;
  policyId: "heartbeat-chore-agent";
  allowedActions: string[];
  forbiddenActions: string[];
  eligibleWorkKinds: string[];
  requiredStateSources: string[];
  dirtyWorktreeBehavior: "fail_closed";
  operatorInputBehavior: "report_and_halt";
};

const HEARTBEAT_POLICY_DISPLAY_PATH = ".bandit/policy/heartbeat-chore-agent.json";
const HIDDEN_AUTHORITY_ACTIONS = new Set([
  "land",
  "merge",
  "push",
  "deploy",
  "feature_implementation",
  "uat_approval"
]);
const SUPPORTED_ALLOWED_ACTIONS = new Set(["inspect", "prepare_evidence"]);
const SUPPORTED_WORK_KINDS = new Set(["chore", "improvement_chore"]);
const REQUIRED_STATE_SOURCES = [
  "docs/work",
  ".bandit/bootstrap-gaps.json",
  ".bandit/policy/heartbeat-chore-agent.json"
];

export async function readHeartbeatPolicy(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.heartbeatPolicy,
    HEARTBEAT_POLICY_DISPLAY_PATH
  );

  return parseHeartbeatPolicy(content);
}

export async function writeDefaultHeartbeatPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "heartbeat-chore-agent",
    allowed_actions: ["inspect", "prepare_evidence"],
    forbidden_actions: [
      "land",
      "merge",
      "push",
      "deploy",
      "feature_implementation",
      "uat_approval"
    ],
    eligible_work_kinds: ["chore", "improvement_chore"],
    required_state_sources: REQUIRED_STATE_SOURCES,
    dirty_worktree_behavior: "fail_closed",
    operator_input_behavior: "report_and_halt"
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateHeartbeatPolicy(repoRoot: string) {
  await readHeartbeatPolicy(repoRoot);
}

export function parseHeartbeatPolicy(content: string): HeartbeatPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed heartbeat policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error("Malformed heartbeat policy: missing contract_version 1");
  }

  const policyId = requireString(parsed, "policy_id");
  if (policyId !== "heartbeat-chore-agent") {
    throw new Error("Malformed heartbeat policy: policy_id must be heartbeat-chore-agent");
  }

  const allowedActions = requireStringList(parsed, "allowed_actions");
  for (const action of allowedActions) {
    if (HIDDEN_AUTHORITY_ACTIONS.has(action)) {
      throw new Error(
        `Heartbeat policy cannot allow hidden workflow authority: ${action}`
      );
    }

    if (!SUPPORTED_ALLOWED_ACTIONS.has(action)) {
      throw new Error(`Malformed heartbeat policy: unsupported action ${action}`);
    }
  }

  if (!allowedActions.includes("inspect")) {
    throw new Error("Malformed heartbeat policy: allowed_actions must include inspect");
  }

  const forbiddenActions = requireStringList(parsed, "forbidden_actions");
  for (const action of HIDDEN_AUTHORITY_ACTIONS) {
    if (!forbiddenActions.includes(action)) {
      throw new Error(
        `Malformed heartbeat policy: forbidden_actions must include ${action}`
      );
    }
  }

  const eligibleWorkKinds = requireStringList(parsed, "eligible_work_kinds");
  for (const kind of eligibleWorkKinds) {
    if (!SUPPORTED_WORK_KINDS.has(kind)) {
      throw new Error(`Malformed heartbeat policy: unsupported work kind ${kind}`);
    }
  }

  const requiredStateSources = requireStringList(parsed, "required_state_sources");
  for (const source of REQUIRED_STATE_SOURCES) {
    if (!requiredStateSources.includes(source)) {
      throw new Error(
        `Malformed heartbeat policy: required_state_sources must include ${source}`
      );
    }
  }

  const dirtyWorktreeBehavior = requireString(parsed, "dirty_worktree_behavior");
  if (dirtyWorktreeBehavior !== "fail_closed") {
    throw new Error(
      "Malformed heartbeat policy: dirty_worktree_behavior must be fail_closed"
    );
  }

  const operatorInputBehavior = requireString(parsed, "operator_input_behavior");
  if (operatorInputBehavior !== "report_and_halt") {
    throw new Error(
      "Malformed heartbeat policy: operator_input_behavior must be report_and_halt"
    );
  }

  return {
    contractVersion: 1,
    policyId: "heartbeat-chore-agent",
    allowedActions,
    forbiddenActions,
    eligibleWorkKinds,
    requiredStateSources,
    dirtyWorktreeBehavior,
    operatorInputBehavior
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

function requireString(record: Record<string, unknown>, field: string) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Malformed heartbeat policy: ${field} must be a string`);
  }
  return value.trim();
}

function requireStringList(record: Record<string, unknown>, field: string) {
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error(`Malformed heartbeat policy: ${field} must be a string list`);
  }
  return value.map((item) => item.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
