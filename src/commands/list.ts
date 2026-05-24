import { readWorkItems } from "../state/work-items.js";

export async function listWorkItems(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  if (workItems.length === 0) {
    return { output: "No work items found.\n" };
  }

  return {
    output: workItems
      .map((item) => `${item.id} | ${item.status} | ${item.title}`)
      .join("\n")
      .concat("\n")
  };
}
