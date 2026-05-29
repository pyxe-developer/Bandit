import { validateEventDrivenWakeSchedulerPolicy } from "../state/event-driven-wake-scheduler.js";

export async function eventDrivenWakeScheduler(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error("Usage: bandit event-driven-wake-scheduler <validate>");
}

async function validate(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit event-driven-wake-scheduler validate [--json]");
  }

  const report = await validateEventDrivenWakeSchedulerPolicy(repoRoot);

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: "Event-driven wake scheduler policy is valid.\n" };
}
