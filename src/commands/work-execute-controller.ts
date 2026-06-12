import {
  resolveWorkExecuteControllerAction,
  validateWorkExecuteControllerSelection,
  type WorkItem
} from "../state/work-execute-controller.js";

export async function workExecuteController(
  _repoRoot: string,
  args: string[]
): Promise<void> {
  const [subcommand] = args;
  if (subcommand !== "resolve") {
    throw new Error(
      "Usage: bandit work-execute-controller resolve <work-item-json>"
    );
  }
  const raw = args[1];
  if (!raw) {
    throw new Error("Missing work-item JSON argument");
  }
  const workItem = JSON.parse(raw) as WorkItem;
  validateWorkExecuteControllerSelection([workItem]);
  const action = resolveWorkExecuteControllerAction({ workItem });
  process.stdout.write(JSON.stringify(action, null, 2) + "\n");
}
