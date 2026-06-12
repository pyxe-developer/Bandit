import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

const forbiddenTelemetryKeys = new Set([
  "hidden_identifier",
  "model_call_metadata",
  "package_usage",
  "repo_contents",
  "review_packets",
  "telemetry",
  "user_activity",
  "workflow_state"
]);

test("update-check reports unconfigured with deterministic data-minimal JSON", async () => {
  const repo = await initializedRepo();

  const result = await runBandit(repo, ["update-check", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.kind, "bandit_update_check");
  assert.equal(payload.status, "unconfigured");
  assert.equal(payload.configured, false);
  assert.equal(payload.update_available, false);
  assert.deepEqual(findForbiddenKeys(payload), []);
});

test("update-check reports current and update_available from configured file source", async () => {
  const repo = await initializedRepo();
  const manifest = path.join(repo, "bandit-release.json");
  await writeReleaseManifest(manifest, {
    latest_version: "0.0.0",
    latest_ref: "v0.0.0"
  });
  await writeUpdateChannel(repo, { manifest });

  const current = await runBandit(repo, ["update-check", "--json"]);
  assert.equal(current.code, 0, current.stderr);
  const currentPayload = JSON.parse(current.stdout);
  assert.equal(currentPayload.status, "current");
  assert.equal(currentPayload.installed_version, "0.0.0");
  assert.equal(currentPayload.latest_version, "0.0.0");
  assert.deepEqual(findForbiddenKeys(currentPayload), []);

  await writeReleaseManifest(manifest, {
    latest_version: "0.1.0",
    latest_ref: "v0.1.0"
  });

  const update = await runBandit(repo, ["update-check", "--json"]);
  assert.equal(update.code, 0, update.stderr);
  const updatePayload = JSON.parse(update.stdout);
  assert.equal(updatePayload.status, "update_available");
  assert.equal(updatePayload.update_available, true);
  assert.equal(updatePayload.installed_version, "0.0.0");
  assert.equal(updatePayload.latest_version, "0.1.0");
  assert.match(updatePayload.update_command, /npm install -D/);
  assert.deepEqual(findForbiddenKeys(updatePayload), []);

  const cache = await readJson(path.join(repo, ".bandit/update-channel-cache.json"));
  assert.equal(cache.status, "update_available");
  assert.equal(cache.latest_version, "0.1.0");
  assert.deepEqual(findForbiddenKeys(cache), []);
});

test("update-check reports disabled and unreachable as non-blocking statuses", async () => {
  const repo = await initializedRepo();
  await writeUpdateChannel(repo, {
    enabled: false,
    manifest: path.join(repo, "unused-release.json")
  });

  const disabled = await runBandit(repo, ["update-check", "--json"]);
  assert.equal(disabled.code, 0, disabled.stderr);
  assert.equal(JSON.parse(disabled.stdout).status, "disabled");

  await writeUpdateChannel(repo, {
    enabled: true,
    manifest: path.join(repo, "missing-release.json")
  });

  const unreachable = await runBandit(repo, ["update-check", "--json"]);
  assert.equal(unreachable.code, 0, unreachable.stderr);
  const payload = JSON.parse(unreachable.stdout);
  assert.equal(payload.status, "unreachable");
  assert.equal(payload.update_available, false);
  assert.deepEqual(findForbiddenKeys(payload), []);
});

test("ordinary CLI commands use fresh cached update alerts without masking command exit status", async () => {
  const repo = await initializedRepo();
  await writeUpdateChannel(repo, {
    manifest: path.join(repo, "bandit-release.json")
  });
  await writeJson(path.join(repo, ".bandit/update-channel-cache.json"), {
    contract_version: 1,
    status: "update_available",
    update_available: true,
    installed_version: "0.0.0",
    latest_version: "0.2.0",
    latest_ref: "v0.2.0",
    checked_at: "2026-06-07T22:45:00.000Z",
    freshness_expires_at: "2999-01-01T00:00:00.000Z",
    update_command: "npm install -D bandit-workflow@0.2.0"
  });

  const initAgain = await runBandit(repo, ["init"]);
  assert.equal(initAgain.code, 0, initAgain.stderr);
  assert.match(initAgain.stderr, /Bandit update available: 0\.2\.0/);
  assert.match(initAgain.stdout, /Bandit state already initialized/);

  await rm(path.join(repo, ".bandit/config.toml"));
  const failedValidate = await runBandit(repo, ["validate"]);
  assert.equal(failedValidate.code, 1);
  assert.match(failedValidate.stderr, /Bandit update available: 0\.2\.0/);
  assert.match(failedValidate.stderr, /Missing required state: \.bandit\/config\.toml/);
});

async function initializedRepo() {
  const repo = await createTempRepo();
  const result = await runBandit(repo, ["init"]);
  assert.equal(result.code, 0, result.stderr);
  return repo;
}

async function writeUpdateChannel(repo, options) {
  await mkdir(path.join(repo, ".bandit"), { recursive: true });
  await writeJson(path.join(repo, ".bandit/update-channel.json"), {
    contract_version: 1,
    enabled: options.enabled ?? true,
    package_name: "bandit-workflow",
    installed_version: "0.0.0",
    source_channel: "public_npm",
    current_source_ref: "v0.0.0",
    check_cadence_seconds: 3600,
    update_source: {
      type: "file",
      path: options.manifest
    },
    alert: {
      enabled: true
    }
  });
}

async function writeReleaseManifest(filePath, overrides = {}) {
  await writeJson(filePath, {
    contract_version: 1,
    package_name: "bandit-workflow",
    latest_version: overrides.latest_version,
    latest_ref: overrides.latest_ref,
    update_command: `npm install -D bandit-workflow@${overrides.latest_version}`
  });
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function findForbiddenKeys(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      findForbiddenKeys(item, found);
    }
    return found;
  }

  if (!value || typeof value !== "object") {
    return found;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenTelemetryKeys.has(key)) {
      found.push(key);
    }
    findForbiddenKeys(nested, found);
  }

  return found.sort();
}
