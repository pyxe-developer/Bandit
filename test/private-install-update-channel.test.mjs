import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

test("package dry-run exposes only intentional private CLI distribution files", async () => {
  const result = await execFileResult("npm", ["pack", "--dry-run", "--json"], {
    cwd: repoRoot
  });

  assert.equal(result.code, 0, result.stderr);
  const packageInfo = JSON.parse(result.stdout)[0];
  const files = packageInfo.files.map((file) => file.path).sort();

  const forbiddenPrefixes = [
    ".bandit/events",
    ".bandit/bootstrap-gaps",
    "docs/work/",
    "test/"
  ];
  const forbiddenFiles = files.filter((file) =>
    forbiddenPrefixes.some((prefix) => file.startsWith(prefix))
  );

  assert.equal(
    forbiddenFiles.length,
    0,
    `package includes ${forbiddenFiles.length} non-distribution files; first entries:\n${forbiddenFiles
      .slice(0, 30)
      .join("\n")}`
  );
  assert.ok(files.includes("bin/bandit.mjs"));
  assert.ok(files.includes("package.json"));
  assert.ok(files.includes(".bandit/policy/private-install-update-channel.json"));
  assert.ok(files.includes("docs/templates/private-install-update-channel.md"));
  assert.ok(files.includes("docs/templates/update-channel.md"));
});

test(
  "packed private install runs bandit init, validate, and update-check without development node_modules",
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
      ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--save-dev", tarball],
      { cwd: consumerRepo, timeout: 120_000 }
    );
    assert.equal(install.code, 0, install.stderr);

    const banditBin = path.join(consumerRepo, "node_modules/.bin/bandit");

    const init = await execFileResult(banditBin, ["init"], {
      cwd: consumerRepo
    });
    assert.equal(init.code, 0, `${init.stdout}\n${init.stderr}`);
    assert.match(init.stdout, /Initialized Bandit state/);

    const validate = await execFileResult(banditBin, ["validate"], {
      cwd: consumerRepo
    });
    assert.equal(validate.code, 0, `${validate.stdout}\n${validate.stderr}`);
    assert.match(validate.stdout, /Bandit state is valid/);

    const updateCheck = await execFileResult(banditBin, ["update-check", "--json"], {
      cwd: consumerRepo
    });
    assert.equal(updateCheck.code, 0, `${updateCheck.stdout}\n${updateCheck.stderr}`);
    assert.equal(JSON.parse(updateCheck.stdout).status, "unconfigured");
  }
);

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
