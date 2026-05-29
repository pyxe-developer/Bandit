import { readFile } from "node:fs/promises";
import { getBanditPaths } from "./paths.js";

export type EventDrivenWakeSchedulerPolicy = {
  contractVersion: 1;
  policyId: "event-driven-wake-scheduler";
  includeDeterministicSweeper: boolean;
};

export type EventDrivenWakeSchedulerValidationReport = {
  status: "pass";
  policy: string;
  include_deterministic_sweeper: boolean;
};

const POLICY_DISPLAY_PATH = ".bandit/policy/event-driven-wake-scheduler.json";

export async function validateEventDrivenWakeSchedulerPolicy(
  repoRoot: string
): Promise<EventDrivenWakeSchedulerValidationReport> {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredPolicyFile(
    paths.eventDrivenWakeSchedulerPolicy,
    POLICY_DISPLAY_PATH
  );
  const policy = parsePolicy(content);

  if (!policy.includeDeterministicSweeper) {
    throw new Error(
      "Event-driven wake scheduler policy: deterministic sweeper contract is required"
    );
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    include_deterministic_sweeper: policy.includeDeterministicSweeper
  };
}

function parsePolicy(content: string): EventDrivenWakeSchedulerPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed event-driven wake scheduler policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error(
      "Malformed event-driven wake scheduler policy: missing contract_version 1"
    );
  }

  if (parsed.policy_id !== "event-driven-wake-scheduler") {
    throw new Error(
      "Malformed event-driven wake scheduler policy: policy_id must be event-driven-wake-scheduler"
    );
  }

  if (typeof parsed.include_deterministic_sweeper !== "boolean") {
    throw new Error(
      "Malformed event-driven wake scheduler policy: include_deterministic_sweeper must be a boolean"
    );
  }

  return {
    contractVersion: 1,
    policyId: "event-driven-wake-scheduler",
    includeDeterministicSweeper: parsed.include_deterministic_sweeper
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
