import { resolveRoadmapWorkTarget } from "../state/roadmap-work-targets.js";

export interface RoadmapWorkTargetsResult {
  stdout?: string;
  stderr?: string;
  code?: number;
}

export async function roadmapWorkTargets(
  repoRoot: string,
  args: string[]
): Promise<RoadmapWorkTargetsResult> {
  const [subCommand, ...options] = args;

  if (subCommand !== "resolve" || !options.includes("--json")) {
    return {
      stderr: "Usage: bandit roadmap-work-targets resolve --json\n",
      code: 1
    };
  }

  const result = await resolveRoadmapWorkTarget(repoRoot);

  if (!result.ok) {
    return { stderr: `${result.diagnostic}\n`, code: 1 };
  }

  return { stdout: `${JSON.stringify(result.resolution, null, 2)}\n` };
}
