import { writeFile } from "node:fs/promises";

const defaultConfig = `state_version = 1
work_item_prefix = "BANDIT"
`;

export async function writeDefaultConfig(configPath: string) {
  await writeFile(configPath, defaultConfig, { flag: "wx" });
}

export function validateConfig(config: string) {
  if (
    !/^state_version = 1$/m.test(config) ||
    !/^work_item_prefix = "BANDIT"$/m.test(config)
  ) {
    throw new Error(
      'Malformed config: expected state_version = 1 and work_item_prefix = "BANDIT"'
    );
  }
}
