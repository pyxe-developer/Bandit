import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

test("public README first-time command examples use install-aware invocations", async () => {
  const readme = await readFile(path.join(repoRoot, "README.md"), "utf8");

  for (const command of [
    "init",
    "validate",
    "cockpit status --json",
    "session-context current --json",
    "update-check --json"
  ]) {
    assert.doesNotMatch(
      readme,
      new RegExp(`^bandit ${escapeRegExp(command)}$`, "m")
    );
    assert.doesNotMatch(
      readme,
      new RegExp(`^npx bandit ${escapeRegExp(command)}$`, "m")
    );
  }

  assert.match(
    readme,
    /npx --no-install bandit init|npm exec -- bandit init|npm run bandit -- init/
  );
  assert.match(
    readme,
    /npx --no-install bandit validate|npm exec -- bandit validate|npm run bandit -- validate/
  );
  assert.match(
    readme,
    /npx --no-install bandit update-check --json|npm exec -- bandit update-check --json|npm run bandit -- update-check --json/
  );
});

test(
  "packed consumer quickstart initializes a governed repo with local npx commands",
  { timeout: 120_000 },
  async () => {
    const packDir = await mkdtemp(path.join(tmpdir(), "bandit-pack-"));
    const consumerRepo = await mkdtemp(path.join(tmpdir(), "bandit-consumer-"));

    try {
      const pack = await execFileResult(
        "npm",
        ["pack", "--json", "--pack-destination", packDir],
        { cwd: repoRoot, timeout: 120_000 }
      );
      assert.equal(pack.code, 0, pack.stderr);
      const packOutput = JSON.parse(pack.stdout);
      assert.ok(
        Array.isArray(packOutput) && packOutput.length > 0,
        `npm pack returned no tarballs from ${packDir}: ${pack.stdout}`
      );
      assert.equal(typeof packOutput[0]?.filename, "string", pack.stdout);
      const tarball = path.join(packDir, packOutput[0].filename);

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

      const starterArtifacts = [
        "AGENTS.md",
        "CONTEXT.md",
        "CLEAN_CODE.md",
        "docs/plans/BOOTSTRAP_METHODOLOGY.md",
        "docs/verification/STAGE_RUBRICS.md",
        "docs/roadmap/CURRENT_CONTEXT.md",
        "docs/roadmap/ROADMAP.md",
        "STATUS.md"
      ];
      for (const artifact of starterArtifacts) {
        await assertFileExists(consumerRepo, artifact);
      }

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
    } finally {
      await Promise.all([
        rm(packDir, { force: true, recursive: true }),
        rm(consumerRepo, { force: true, recursive: true })
      ]);
    }
  }
);

function npmExecBandit(cwd, banditArgs) {
  return execFileResult("npx", ["--no-install", "bandit", ...banditArgs], {
    cwd,
    timeout: 120_000
  });
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
          code: error ? (typeof error.code === "number" ? error.code : 1) : 0,
          stdout,
          stderr,
          error
        });
      }
    );
  });
}

async function assertFileExists(repoRoot, relativePath) {
  try {
    await access(path.join(repoRoot, relativePath));
  } catch {
    assert.fail(`Expected starter governance artifact to exist: ${relativePath}`);
  }
}
