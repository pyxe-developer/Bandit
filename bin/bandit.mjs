#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const binPath = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(binPath), "..");
const require = createRequire(import.meta.url);
const tsxLoaderPath = require.resolve("tsx");
const cliPath = path.join(packageRoot, "src/cli.ts");

const result = spawnSync(
  process.execPath,
  ["--import", tsxLoaderPath, cliPath, ...process.argv.slice(2)],
  { stdio: "inherit" }
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
