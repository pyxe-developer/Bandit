import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type WorkItem = {
  id: string;
  title: string;
  status: string;
  content: string;
};

export async function readWorkItems(repoRoot: string) {
  const workRoot = path.join(repoRoot, "docs/work");
  const entries = await readWorkDirectories(workRoot);
  const workItems = await Promise.all(
    entries.map((entry) => readWorkItemBrief(workRoot, entry))
  );

  return workItems.sort((first, second) => first.id.localeCompare(second.id));
}

export async function readWorkItem(repoRoot: string, workItemId: string) {
  const workItems = await readWorkItems(repoRoot);
  const match = workItems.find((item) => item.id === workItemId);

  if (!match) {
    throw new Error(`Work item not found: ${workItemId}`);
  }

  return match;
}

export async function validateWorkItems(repoRoot: string) {
  await readWorkItems(repoRoot);
}

async function readWorkDirectories(workRoot: string) {
  try {
    const entries = await readdir(workRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }
}

async function readWorkItemBrief(workRoot: string, directoryName: string) {
  const briefPath = path.join(workRoot, directoryName, "brief.md");
  const content = await readFile(briefPath, "utf8");
  const header = content.match(/^# ([A-Z][A-Z0-9]*-\d+): (.+)$/m);

  if (!header) {
    throw new Error(`Malformed work item brief: ${briefPath}`);
  }

  const [, id, title] = header;
  if (id !== directoryName) {
    throw new Error(
      `Malformed work item brief: header ID ${id} does not match ${directoryName}`
    );
  }

  return {
    id,
    title,
    status: readStatus(content, briefPath),
    content
  };
}

function readStatus(content: string, briefPath: string) {
  const statusSection = content.match(/## Status\s+([\s\S]*?)(?:\n## |\s*$)/);
  const status = statusSection?.[1]?.trim();

  if (!status) {
    throw new Error(`Malformed work item brief: missing status in ${briefPath}`);
  }

  return status;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
