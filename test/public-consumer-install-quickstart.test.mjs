import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

test(
  "packed consumer quickstart initializes a governed repo with local npx commands",
  { timeout: 120_000 },
  async () => {
    const packDir = await mkdtemp(path.join(tmpdir(), "bandit-pack-"));
    const consumerRepo = await mkdtemp(path.join(tmpdir(), "bandit-consumer-"));

    const pack = await execFileResult(
      "npm",
      ["pack", "--json", "--pack-destination", packDir],
      { cwd: repoRoot, timeout: 120_000 }
    );
    assert.equal(pack.code, 0, pack.stderr);
    const tarball = path.join(packDir, JSON.parse(pack.stdout)[0].filename);

    await writeFile(
      path.join(consumerRepo, "package.json"),
      `${JSON.stringify({ private: true, devDependencies: {} }, null, 2)}\n`
    );

    const install = await execFileResult(
      "npm",
      [
        "install",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--save-dev",
        tarball
      ],
      { cwd: consumerRepo, timeout: 120_000 }
    );
    assert.equal(install.code, 0, install.stderr);

    const init = await npmExecBandit(consumerRepo, ["init"]);
    assert.equal(init.code, 0, `${init.stdout}\n${init.stderr}`);
    assert.match(init.stdout, /Initialized Bandit state/);

    const validate = await npmExecBandit(consumerRepo, ["validate"]);
    assert.equal(validate.code, 0, `${validate.stdout}\n${validate.stderr}`);
    assert.match(validate.stdout, /Bandit state is valid/);

    const cockpit = await npmExecBandit(consumerRepo, [
      "cockpit",
      "status",
      "--json"
    ]);
    assert.equal(cockpit.code, 0, `${cockpit.stdout}\n${cockpit.stderr}`);
    const cockpitPayload = JSON.parse(cockpit.stdout);
    assert.equal(cockpitPayload.kind, "workflow_cockpit_status");
    assert.equal(cockpitPayload.required_operator_input.value, "none_required");

    const session = await npmExecBandit(consumerRepo, [
      "session-context",
      "current",
      "--json"
    ]);
    assert.equal(session.code, 0, `${session.stdout}\n${session.stderr}`);
    const sessionPayload = JSON.parse(session.stdout);
    assert.equal(sessionPayload.kind, "focused_session_context_packet");
    assert.equal(sessionPayload.required_operator_input.value, "none_required");
  }
);

function npmExecBandit(cwd, banditArgs) {
  return execFileResult("npx", ["--no-install", "bandit", ...banditArgs], {
    cwd,
    timeout: 120_000
  });
}

function execFileResult(command, args, options = {}) {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      {
        cwd: options.cwd,
        env: {
          ...process.env,
          npm_config_loglevel: "error",
          ...(options.env ?? {})
        },
        maxBuffer: 20 * 1024 * 1024,
        timeout: options.timeout ?? 30_000
      },
      (error, stdout, stderr) => {
        resolve({
          code: typeof error?.code === "number" ? error.code : 0,
          stdout,
          stderr
        });
      }
    );
  });
}
