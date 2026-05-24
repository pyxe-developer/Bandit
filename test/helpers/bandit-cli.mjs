import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "../..");
const binPath = path.join(repoRoot, "bin/bandit.mjs");

export async function createTempRepo() {
  return mkdtemp(path.join(tmpdir(), "bandit-test-"));
}

export function runBandit(cwd, args) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [binPath, ...args],
      { cwd },
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

export async function writeWorkBrief(repo, id, title, status = "Ready") {
  const workDir = path.join(repo, "docs/work", id);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "brief.md"),
    `# ${id}: ${title}

## Status

${status}

## Goal

Test work item.
`,
    "utf8"
  );
}
