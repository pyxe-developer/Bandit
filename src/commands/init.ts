import { mkdir, stat } from "node:fs/promises";
import { writeDefaultAutoLandingPolicy } from "../state/auto-landing-policy.js";
import { writeDefaultBootstrapGapLedger } from "../state/bootstrap-gaps.js";
import { writeDefaultConfig } from "../state/config.js";
import { appendLifecycleEvent } from "../state/events.js";
import { writeDefaultLandingAgentContract } from "../state/landing-agent-contract.js";
import { getBanditPaths } from "../state/paths.js";

export async function initBandit(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const alreadyInitialized = await pathExists(paths.config);
  const bootstrapGapsExist = await pathExists(paths.bootstrapGaps);
  const autoLandingPolicyExists = await pathExists(paths.autoLandingPolicy);
  const landingAgentContractExists = await pathExists(paths.landingAgentContract);

  await mkdir(paths.stateRoot, { recursive: true });

  if (!bootstrapGapsExist) {
    await writeDefaultBootstrapGapLedger(paths.bootstrapGaps);
  }

  if (!autoLandingPolicyExists) {
    await writeDefaultAutoLandingPolicy(paths.autoLandingPolicy);
  }

  if (!landingAgentContractExists) {
    await writeDefaultLandingAgentContract(paths.landingAgentContract);
  }

  if (alreadyInitialized) {
    await appendLifecycleEvent(paths.events, {
      type: "repo_init_skipped",
      work_item: null,
      message: "Bandit repo-native state already existed"
    });
    return { message: "Bandit state already initialized." };
  }

  await writeDefaultConfig(paths.config);
  await appendLifecycleEvent(paths.events, {
    type: "repo_initialized",
    work_item: null,
    message: "Initialized Bandit repo-native state"
  });

  return { message: "Initialized Bandit state." };
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
