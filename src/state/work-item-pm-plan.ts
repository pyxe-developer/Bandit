import { readFile } from "node:fs/promises";
import path from "node:path";

const REQUIRED_PLAN_SECTIONS = [
  "Current Repo State",
  "Stage Sequence",
  "Required Evidence",
  "Role Boundaries",
  "Verification Commands",
  "Known Blockers",
  "Stop Conditions",
  "Forbidden Actions"
] as const;

export function orchestrationPlanPath(workItemId: string): string {
  return `docs/work/${workItemId}/orchestration-plan.md`;
}

export async function requireOrchestrationPlan(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const displayPath = orchestrationPlanPath(workItemId);

  let content: string;
  try {
    content = await readFile(path.join(repoRoot, displayPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(
        `Work item ${workItemId} cannot start orchestration: ` +
          `missing plan-mode artifact ${displayPath}\n` +
          `Author the Work Item PM plan-mode artifact before orchestration begins.`
      );
    }
    throw error;
  }

  const missing = REQUIRED_PLAN_SECTIONS.filter(
    (section) => !hasSectionWithContent(content, section)
  );

  if (missing.length > 0) {
    throw new Error(
      `Under-scoped orchestration plan ${displayPath} is missing required ` +
        `plan-mode sections: ${missing.join(", ")}`
    );
  }
}

function hasSectionWithContent(content: string, sectionTitle: string): boolean {
  const pattern = new RegExp(
    `##\\s+${escapeRegExp(sectionTitle)}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`,
    "i"
  );
  const match = content.match(pattern);
  return Boolean(match && (match[1] ?? "").trim().length > 0);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
