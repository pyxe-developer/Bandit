import { readWorkItem } from "../state/work-items.js";

export async function showWorkItem(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit show <work-item-id>");
  }

  const workItem = await readWorkItem(repoRoot, workItemId);
  return { output: workItem.content };
}
