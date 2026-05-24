#!/usr/bin/env node
import { initBandit } from "./commands/init.js";
import { autoLandCheck } from "./commands/auto-land-check.js";
import { coderabbitReview } from "./commands/coderabbit-review.js";
import { draftWork } from "./commands/draft-work.js";
import { land } from "./commands/land.js";
import { listBootstrapGaps } from "./commands/gaps.js";
import { landCheck } from "./commands/land-check.js";
import { listWorkItems } from "./commands/list.js";
import { qwenReview } from "./commands/qwen-review.js";
import { routeWorkItem } from "./commands/route.js";
import { showWorkItem } from "./commands/show.js";
import { uat } from "./commands/uat.js";
import { validateBandit } from "./commands/validate.js";

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === "init") {
    const result = await initBandit(process.cwd());
    console.log(result.message);
    return;
  }

  if (command === "validate") {
    const result = await validateBandit(process.cwd());
    console.log(result.message);
    return;
  }

  if (command === "list") {
    const result = await listWorkItems(process.cwd());
    process.stdout.write(result.output);
    return;
  }

  if (command === "gaps") {
    if (args[0] !== "list") {
      console.error("Usage: bandit gaps <list>");
      process.exitCode = 1;
      return;
    }

    const result = await listBootstrapGaps(process.cwd());
    process.stdout.write(result.output);
    return;
  }

  if (command === "draft-work") {
    const result = await draftWork(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "show") {
    const result = await showWorkItem(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "route") {
    const result = await routeWorkItem(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "land-check") {
    const result = await landCheck(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "land") {
    const result = await land(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "auto-land-check") {
    const result = await autoLandCheck(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "uat") {
    const result = await uat(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "qwen-review") {
    const result = await qwenReview(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "coderabbit-review") {
    const result = await coderabbitReview(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  const commandText = command ? `Unknown command: ${command}` : "Missing command";
  console.error(`${commandText}\nUsage: bandit <init|validate|list|show|draft-work|route|land-check|land|auto-land-check|qwen-review|coderabbit-review|uat|gaps>`);
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
