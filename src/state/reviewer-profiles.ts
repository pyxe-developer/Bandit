import { readFile } from "node:fs/promises";
import path from "node:path";

export type LocalQwenProfile = {
  contractVersion: number;
  profileId: string;
  version: number;
  provider: "mastra-code";
  providerBaseUrl: string;
  runtime: "command";
  command: {
    executable: string;
    args: string[];
  };
  model: string;
  promptContract: {
    role: string;
    requiredOutputs: string[];
  };
  timeoutMs: number;
  permissions: {
    filesystem: string;
    network: string;
    canEditFiles: boolean;
    canRequestTools: boolean;
  };
  outputContract: {
    format: string;
    requiredFields: string[];
  };
  unavailableRuntimeBehavior: string;
};

const LOCAL_QWEN_PROFILE_PATH = ".bandit/reviewers/local-qwen.json";
const REQUIRED_FIELDS = [
  "contract_version",
  "profile_id",
  "version",
  "provider",
  "provider_base_url",
  "runtime",
  "command",
  "model",
  "prompt_contract",
  "timeout_ms",
  "permissions",
  "output_contract",
  "unavailable_runtime_behavior"
];
const EXPECTED_PROVIDER = "mastra-code";
const EXPECTED_PROVIDER_BASE_URL = "http://127.0.0.1:8000/v1";
const EXPECTED_MODEL = "omlx-local/Qwen3.6-35B-A3B-MLX-8bit";
const DISALLOWED_OLLAMA_ENDPOINTS = [
  "http://localhost:11434/v1",
  "http://127.0.0.1:11434/v1"
];

export async function validateLocalQwenProfile(repoRoot: string) {
  await readLocalQwenProfile(repoRoot);
}

export async function readLocalQwenProfile(repoRoot: string) {
  const content = await readRequiredProfile(repoRoot);
  const parsed = parseProfileJson(content);

  return validateProfileShape(parsed);
}

function validateProfileShape(profile: unknown): LocalQwenProfile {
  if (!isRecord(profile)) {
    throw new Error("Malformed local Qwen profile: expected JSON object");
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in profile)) {
      throw new Error(`Local Qwen profile missing required field: ${field}`);
    }
  }

  if (profile.contract_version !== 1) {
    throw new Error(`Unsupported local Qwen profile contract version: ${String(profile.contract_version)}`);
  }

  if (profile.profile_id !== "local-qwen-baseline") {
    throw new Error(`Unsupported local Qwen profile ID: ${String(profile.profile_id)}`);
  }

  if (profile.runtime !== "command") {
    throw new Error(`Unsupported local Qwen runtime: ${String(profile.runtime)}`);
  }

  const command = requireRecord(profile.command, "command");
  const promptContract = requireRecord(profile.prompt_contract, "prompt_contract");
  const permissions = requireRecord(profile.permissions, "permissions");
  const outputContract = requireRecord(profile.output_contract, "output_contract");

  const executable = requireString(command.executable, "command.executable");
  const args = requireStringArray(command.args, "command.args", {
    allowEmpty: true
  });
  const requiredOutputs = requireStringArray(
    promptContract.required_outputs,
    "prompt_contract.required_outputs"
  );
  const requiredFields = requireStringArray(
    outputContract.required_fields,
    "output_contract.required_fields"
  );
  const timeoutMs = requirePositiveNumber(profile.timeout_ms, "timeout_ms");
  const provider = requireString(profile.provider, "provider");
  const providerBaseUrl = requireString(profile.provider_base_url, "provider_base_url");
  const model = requireString(profile.model, "model");

  if (provider !== EXPECTED_PROVIDER) {
    throw new Error("Local Qwen profile must use Mastra Code custom provider");
  }

  if (providerBaseUrl !== EXPECTED_PROVIDER_BASE_URL) {
    throw new Error(
      `Local Qwen profile must use provider_base_url ${EXPECTED_PROVIDER_BASE_URL}`
    );
  }

  if (model !== EXPECTED_MODEL) {
    throw new Error(`Local Qwen profile must use model ${EXPECTED_MODEL}`);
  }

  rejectDriftedQwenCodeRoute(executable, args);

  if (promptContract.role !== "read_only_adversarial_reviewer") {
    throw new Error("Local Qwen prompt contract must be read-only adversarial reviewer");
  }

  if (permissions.filesystem !== "read_only") {
    throw new Error("Local Qwen filesystem permission must be read_only");
  }

  if (permissions.network !== "disabled") {
    throw new Error("Local Qwen network permission must be disabled");
  }

  if (permissions.can_edit_files !== false) {
    throw new Error("Local Qwen profile must not allow file edits");
  }

  if (permissions.can_request_tools !== false) {
    throw new Error("Local Qwen profile must not allow tool requests");
  }

  if (outputContract.format !== "json") {
    throw new Error("Local Qwen output contract must use json format");
  }

  if (profile.unavailable_runtime_behavior !== "fail_closed_or_bootstrap_gap") {
    throw new Error(
      "Local Qwen profile must fail closed or record a bootstrap gap when unavailable"
    );
  }

  return {
    contractVersion: 1,
    profileId: "local-qwen-baseline",
    version: requirePositiveNumber(profile.version, "version"),
    provider: "mastra-code",
    providerBaseUrl,
    runtime: "command",
    command: { executable, args },
    model,
    promptContract: {
      role: "read_only_adversarial_reviewer",
      requiredOutputs
    },
    timeoutMs,
    permissions: {
      filesystem: "read_only",
      network: "disabled",
      canEditFiles: false,
      canRequestTools: false
    },
    outputContract: {
      format: "json",
      requiredFields
    },
    unavailableRuntimeBehavior: "fail_closed_or_bootstrap_gap"
  };
}

function rejectDriftedQwenCodeRoute(executable: string, args: string[]) {
  const executableName = path.basename(executable);

  if (executableName === "qwen") {
    throw new Error("Local Qwen profile must use Mastra Code custom provider");
  }

  if (args.includes("--openai-base-url")) {
    throw new Error("Local Qwen profile must use Mastra Code custom provider");
  }

  if (args.some((arg) => DISALLOWED_OLLAMA_ENDPOINTS.includes(arg))) {
    throw new Error(
      `Local Qwen profile must use provider_base_url ${EXPECTED_PROVIDER_BASE_URL}`
    );
  }

  if (!args.some((arg) => arg.includes("{{prompt}}") || arg === "{{prompt_stdin}}")) {
    throw new Error("Local Qwen profile command must include a prompt placeholder");
  }
}

async function readRequiredProfile(repoRoot: string) {
  try {
    return await readFile(path.join(repoRoot, LOCAL_QWEN_PROFILE_PATH), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing local Qwen reviewer profile: ${LOCAL_QWEN_PROFILE_PATH}`);
    }
    throw error;
  }
}

function parseProfileJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Malformed local Qwen profile: invalid JSON");
  }
}

function requireRecord(value: unknown, field: string) {
  if (!isRecord(value)) {
    throw new Error(`Local Qwen profile field ${field} must be an object`);
  }

  return value;
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Local Qwen profile field ${field} must be a non-empty string`);
  }

  return value;
}

function requireStringArray(
  value: unknown,
  field: string,
  options: { allowEmpty?: boolean } = {}
) {
  if (
    !Array.isArray(value) ||
    (!options.allowEmpty && value.length === 0) ||
    value.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    const label = options.allowEmpty ? "a string list" : "a non-empty string list";
    throw new Error(`Local Qwen profile field ${field} must be ${label}`);
  }

  return value;
}

function requirePositiveNumber(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Local Qwen profile field ${field} must be a positive integer`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
