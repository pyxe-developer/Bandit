import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

const UPDATE_CHECK_KIND = "bandit_update_check";
const CONTRACT_VERSION = 1;

export type UpdateStatus =
  | "unconfigured"
  | "disabled"
  | "unreachable"
  | "current"
  | "update_available";

export type UpdateCheckResult = {
  kind: typeof UPDATE_CHECK_KIND;
  status: UpdateStatus;
  configured: boolean;
  update_available: boolean;
  installed_version?: string;
  latest_version?: string;
  latest_ref?: string;
  update_command?: string;
};

type RawRecord = Record<string, unknown>;

type UpdateChannelConfig = {
  enabled: boolean;
  installedVersion: string;
  currentSourceRef: string;
  checkCadenceSeconds: number;
  updateSource: { type: string; path: string | null };
};

type ReleaseManifest = {
  latestVersion: string;
  latestRef: string;
  updateCommand: string | null;
};

export async function runUpdateCheck(
  repoRoot: string
): Promise<UpdateCheckResult> {
  const config = await readUpdateChannelConfig(repoRoot);
  if (!config) {
    return unconfiguredResult();
  }

  if (!config.enabled) {
    return nonBlockingResult("disabled", config);
  }

  const manifest = await readFileReleaseManifest(config);
  if (!manifest) {
    return nonBlockingResult("unreachable", config);
  }

  const result = comparisonResult(config, manifest);
  await writeUpdateCache(repoRoot, config, result);
  return result;
}

export async function emitCachedUpdateAlert(
  repoRoot: string,
  stderr: NodeJS.WritableStream
): Promise<void> {
  const cache = await readUpdateCache(repoRoot);
  if (!cache) {
    return;
  }

  if (
    cache.status !== "update_available" ||
    cache.update_available !== true ||
    !isCacheFresh(cache)
  ) {
    return;
  }

  const latestVersion = readOptionalString(cache, "latest_version");
  if (!latestVersion) {
    return;
  }

  stderr.write(`Bandit update available: ${latestVersion}\n`);
  const updateCommand = readOptionalString(cache, "update_command");
  if (updateCommand) {
    stderr.write(`Run: ${updateCommand}\n`);
  }
}

function unconfiguredResult(): UpdateCheckResult {
  return {
    kind: UPDATE_CHECK_KIND,
    status: "unconfigured",
    configured: false,
    update_available: false
  };
}

function nonBlockingResult(
  status: "disabled" | "unreachable",
  config: UpdateChannelConfig
): UpdateCheckResult {
  return {
    kind: UPDATE_CHECK_KIND,
    status,
    configured: true,
    update_available: false,
    installed_version: config.installedVersion
  };
}

function comparisonResult(
  config: UpdateChannelConfig,
  manifest: ReleaseManifest
): UpdateCheckResult {
  const updateAvailable =
    manifest.latestVersion !== config.installedVersion ||
    manifest.latestRef !== config.currentSourceRef;

  if (!updateAvailable) {
    return {
      kind: UPDATE_CHECK_KIND,
      status: "current",
      configured: true,
      update_available: false,
      installed_version: config.installedVersion,
      latest_version: manifest.latestVersion,
      latest_ref: manifest.latestRef
    };
  }

  return {
    kind: UPDATE_CHECK_KIND,
    status: "update_available",
    configured: true,
    update_available: true,
    installed_version: config.installedVersion,
    latest_version: manifest.latestVersion,
    latest_ref: manifest.latestRef,
    update_command:
      manifest.updateCommand ??
      `npm install -D bandit-workflow@${manifest.latestVersion}`
  };
}

async function readUpdateChannelConfig(
  repoRoot: string
): Promise<UpdateChannelConfig | null> {
  const paths = getBanditPaths(repoRoot);
  const parsed = await readOptionalJsonObject(paths.updateChannel);
  if (!parsed) {
    return null;
  }

  const updateSource = isRecord(parsed.update_source)
    ? parsed.update_source
    : {};

  return {
    enabled: parsed.enabled !== false,
    installedVersion: readOptionalString(parsed, "installed_version") ?? "",
    currentSourceRef: readOptionalString(parsed, "current_source_ref") ?? "",
    checkCadenceSeconds: readPositiveNumber(parsed.check_cadence_seconds, 3600),
    updateSource: {
      type: readOptionalString(updateSource, "type") ?? "",
      path: readOptionalString(updateSource, "path")
    }
  };
}

async function readFileReleaseManifest(
  config: UpdateChannelConfig
): Promise<ReleaseManifest | null> {
  if (config.updateSource.type !== "file" || !config.updateSource.path) {
    return null;
  }

  const parsed = await readOptionalJsonObject(config.updateSource.path);
  if (!parsed) {
    return null;
  }

  const latestVersion = readOptionalString(parsed, "latest_version");
  const latestRef = readOptionalString(parsed, "latest_ref");
  if (!latestVersion || !latestRef) {
    return null;
  }

  return {
    latestVersion,
    latestRef,
    updateCommand: readOptionalString(parsed, "update_command")
  };
}

async function writeUpdateCache(
  repoRoot: string,
  config: UpdateChannelConfig,
  result: UpdateCheckResult
): Promise<void> {
  const paths = getBanditPaths(repoRoot);
  const checkedAt = new Date();
  const expiresAt = new Date(
    checkedAt.getTime() + config.checkCadenceSeconds * 1000
  );

  const cache: RawRecord = {
    contract_version: CONTRACT_VERSION,
    status: result.status,
    update_available: result.update_available,
    installed_version: result.installed_version,
    latest_version: result.latest_version,
    latest_ref: result.latest_ref,
    checked_at: checkedAt.toISOString(),
    freshness_expires_at: expiresAt.toISOString()
  };

  if (result.update_command) {
    cache.update_command = result.update_command;
  }

  await mkdir(paths.stateRoot, { recursive: true });
  await writeFile(
    paths.updateChannelCache,
    `${JSON.stringify(cache, null, 2)}\n`,
    "utf8"
  );
}

async function readUpdateCache(repoRoot: string): Promise<RawRecord | null> {
  const paths = getBanditPaths(repoRoot);
  return readOptionalJsonObject(paths.updateChannelCache);
}

function isCacheFresh(cache: RawRecord): boolean {
  const expiresAt = readOptionalString(cache, "freshness_expires_at");
  if (!expiresAt) {
    return false;
  }

  const expiry = Date.parse(expiresAt);
  return Number.isFinite(expiry) && expiry > Date.now();
}

async function readOptionalJsonObject(
  filePath: string
): Promise<RawRecord | null> {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }

  try {
    const parsed: unknown = JSON.parse(content);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readOptionalString(record: RawRecord, field: string): string | null {
  const value = record[field];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function readPositiveNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
