import {
  runRepoPmCreateController,
  type RepoPmCreateControllerOutcome
} from "../state/work-create-controller.js";

export type CreateControllerCommandResult = {
  stdout?: string;
  stderr?: string;
  code: number;
};

export async function workCreateController(
  repoRoot: string,
  args: string[]
): Promise<CreateControllerCommandResult> {
  const wantsJson = args.includes("--json");
  const extra = args.filter((arg) => arg !== "--json");
  if (extra.length > 0) {
    return {
      stderr: "Usage: bandit work-create-controller [--json]\n",
      code: 1
    };
  }

  let outcome: RepoPmCreateControllerOutcome;
  try {
    outcome = await runRepoPmCreateController(repoRoot);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      stderr: `${message}\n`,
      code: 1
    };
  }

  if (!outcome.ok) {
    return {
      stderr: `${outcome.error.diagnostic}\n`,
      code: 1
    };
  }

  if (wantsJson) {
    return {
      stdout: `${JSON.stringify(outcome.result, null, 2)}\n`,
      code: 0
    };
  }

  return {
    stdout: `Repo PM create controller: ${outcome.result.status} ${outcome.result.work_item}\n${outcome.result.next_action}\n`,
    code: 0
  };
}
