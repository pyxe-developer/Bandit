import { writeFile } from "node:fs/promises";

const defaultConfig = `state_version = 1
work_item_prefix = "BANDIT"
`;

export type BanditConfig = {
  stateVersion: 1;
  workItemPrefix: string;
};

export async function writeDefaultConfig(configPath: string) {
  await writeFile(configPath, defaultConfig, { flag: "wx" });
}

export function validateConfig(config: string) {
  parseConfig(config);
}

export function parseConfig(config: string): BanditConfig {
  const stateVersion = config.match(/^state_version = (\d+)$/m)?.[1];
  const workItemPrefix = config.match(
    /^work_item_prefix = "([A-Z][A-Z0-9]*)"$/m
  )?.[1];

  if (
    stateVersion !== "1" ||
    typeof workItemPrefix !== "string" ||
    workItemPrefix.length === 0
  ) {
    throw new Error(
      'Malformed config: expected state_version = 1 and work_item_prefix = "BANDIT" style uppercase prefix'
    );
  }

  return {
    stateVersion: 1,
    workItemPrefix
  };
}
