#!/usr/bin/env node
import { initBandit } from "./commands/init.js";
import { listWorkItems } from "./commands/list.js";
import { showWorkItem } from "./commands/show.js";
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

  if (command === "show") {
    const result = await showWorkItem(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  const commandText = command ? `Unknown command: ${command}` : "Missing command";
  console.error(`${commandText}\nUsage: bandit <init|validate|list|show>`);
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
