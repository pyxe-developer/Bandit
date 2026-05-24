#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const binPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(binPath), "..");
const tsxLoaderPath = path.join(repoRoot, "node_modules/tsx/dist/loader.mjs");
const cliPath = path.join(repoRoot, "src/cli.ts");

const result = spawnSync(
  process.execPath,
  ["--import", tsxLoaderPath, cliPath, ...process.argv.slice(2)],
  { stdio: "inherit" }
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
