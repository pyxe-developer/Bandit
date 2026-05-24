import { readFile } from "node:fs/promises";
import { validateConfig } from "../state/config.js";
import { validateEventLog } from "../state/events.js";
import { getBanditPaths } from "../state/paths.js";
import { validateWorkItems } from "../state/work-items.js";

export async function validateBandit(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const config = await readRequiredFile(paths.config, ".bandit/config.toml");
  validateConfig(config);

  const eventLog = await readRequiredFile(paths.events, ".bandit/events.jsonl");
  validateEventLog(eventLog);

  await validateWorkItems(repoRoot);

  return { message: "Bandit state is valid." };
}

async function readRequiredFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required state: ${displayPath}`);
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
