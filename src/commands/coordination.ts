import {
  appendActorCoordinationEvent,
  type NewActorEventInput,
  readCoordinationStatus,
  validateCoordinationLog
} from "../state/coordination-log.js";

export async function coordination(repoRoot: string, args: string[]) {
  const [action, workItemId, eventTypeOrOption, ...options] = args;

  if (action === "validate") {
    if (!workItemId || eventTypeOrOption || options.length > 0) {
      throw new Error("Usage: bandit coordination validate <work-item-id>");
    }

    await validateCoordinationLog(repoRoot, workItemId);
    return { output: `Coordination log is valid: ${workItemId}\n` };
  }

  if (action === "status") {
    const statusOptions = [eventTypeOrOption, ...options].filter(Boolean);
    if (!workItemId || statusOptions.some((option) => option !== "--json")) {
      throw new Error("Usage: bandit coordination status <work-item-id> [--json]");
    }

    const status = await readCoordinationStatus(repoRoot, workItemId);
    if (statusOptions.includes("--json")) {
      return { output: `${JSON.stringify(status, null, 2)}\n` };
    }

    return {
      output: [
        `Work item: ${status.work_item}`,
        `Work type: ${status.work_type}`,
        `Current state: ${status.current_state}`,
        `Next action: ${status.next_action ?? "none"}`,
        `Accountable actor: ${status.accountable_actor ?? "none"}`,
        `Safe trigger points: ${status.safe_trigger_points.join(", ") || "none"}`
      ].join("\n").concat("\n")
    };
  }

  if (action === "event") {
    if (!workItemId || !eventTypeOrOption) {
      throw new Error("Usage: bandit coordination event <work-item-id> <type> [options]");
    }

    const event = parseActorEventInput(eventTypeOrOption, options);
    await appendActorCoordinationEvent(repoRoot, workItemId, event);
    return {
      output: `Recorded actor coordination event: ${event.actor_event_type} for ${workItemId}\n`
    };
  }

  throw new Error("Usage: bandit coordination <validate|status|event> <work-item-id> [--json]");
}

function parseActorEventInput(
  actorEventType: string,
  options: string[]
): NewActorEventInput {
  if (!isActorEventType(actorEventType)) {
    throw new Error(`Unknown actor coordination event type: ${actorEventType}`);
  }

  const parsed = parseOptions(options);
  const input = {
    actor_event_type: actorEventType,
    actor: requireOption(parsed, "--actor"),
    source: requireOption(parsed, "--source"),
    summary: requireOption(parsed, "--summary"),
    evidence: parsed.get("--evidence") ?? [],
    target_actor: readSingleOption(parsed, "--target-actor"),
    blocked_owner: readSingleOption(parsed, "--blocked-owner"),
    resume_condition: readSingleOption(parsed, "--resume-condition"),
    repair_scope: readSingleOption(parsed, "--repair-scope")
  };

  requireActionSpecificOptions(input);
  return input;
}

function parseOptions(options: string[]) {
  const allowedOptions = new Set([
    "--actor",
    "--source",
    "--summary",
    "--target-actor",
    "--blocked-owner",
    "--resume-condition",
    "--repair-scope",
    "--evidence"
  ]);
  const parsed = new Map<string, string[]>();

  for (let index = 0; index < options.length; index += 2) {
    const flag = options[index];
    const value = options[index + 1];

    if (!flag || !allowedOptions.has(flag)) {
      throw new Error(`Unknown coordination event option: ${flag ?? ""}`.trim());
    }

    if (!value || value.trim().length === 0 || value.startsWith("--")) {
      throw new Error(`coordination event option requires a value: ${flag}`);
    }

    parsed.set(flag, [...(parsed.get(flag) ?? []), value.trim()]);
  }

  return parsed;
}

function requireActionSpecificOptions(input: NewActorEventInput) {
  if (input.actor_event_type === "handoff" && !input.target_actor) {
    throw new Error("handoff actor event requires --target-actor");
  }

  if (
    input.actor_event_type === "block" &&
    (!input.blocked_owner || !input.resume_condition)
  ) {
    throw new Error("block actor event requires --blocked-owner and --resume-condition");
  }

  if (input.actor_event_type === "complete" && input.evidence.length === 0) {
    throw new Error("complete actor event requires at least one --evidence reference");
  }

  if (input.actor_event_type === "repair-request" && !input.repair_scope) {
    throw new Error("repair-request actor event requires --repair-scope");
  }
}

function requireOption(options: Map<string, string[]>, flag: string) {
  const value = readSingleOption(options, flag);
  if (!value) {
    throw new Error(`coordination event requires ${flag}`);
  }
  return value;
}

function readSingleOption(options: Map<string, string[]>, flag: string) {
  const values = options.get(flag) ?? [];
  if (values.length > 1) {
    throw new Error(`coordination event option may be provided once: ${flag}`);
  }
  return values[0];
}

function isActorEventType(value: string): value is NewActorEventInput["actor_event_type"] {
  return ["claim", "handoff", "block", "complete", "repair-request", "resume"].includes(value);
}
