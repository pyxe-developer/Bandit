import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { readWorkItem, readWorkItems, type WorkItem } from "./work-items.js";

export type CoordinationStatus = {
  work_item: string;
  work_type: string;
  current_state: CoordinationState;
  next_action: string | null;
  accountable_actor: string | null;
  accepted_block: AcceptedBlock | null;
  safe_trigger_points: string[];
  evidence: string[];
};

type AcceptedBlock = {
  owner: string;
  required_input: string;
  resume_condition: string;
};

type CoordinationState =
  | "brief_created"
  | "red_recorded"
  | "implementation_recorded"
  | "review_recorded"
  | "landing_verdict_recorded"
  | "landed"
  | "retrospective_recorded"
  | "closed"
  | "blocked";

type StepTransition = {
  event_type: "step_transition";
  work_item: string;
  sequence: number;
  state: CoordinationState;
  actor: string;
  source: string;
  evidence: string[];
  next_action: string | null;
  accountable_actor: string | null;
  safe_triggers: string[];
  accepted_block: AcceptedBlock | null;
};

type ActorEvent = {
  event_type: "actor_event";
  work_item: string;
  sequence: number;
  actor: string;
  source: string;
  evidence: string[];
  actor_event_type: string;
};

type CoordinationEvent = StepTransition | ActorEvent;

const LOG_FILE_NAME = "coordination-log.jsonl";
const VALID_EVENT_TYPES = new Set(["step_transition", "actor_event"]);
const VALID_ACTOR_EVENT_TYPES = new Set([
  "claim",
  "handoff",
  "block",
  "complete",
  "repair-request",
  "resume"
]);
const STATE_ORDER = [
  "brief_created",
  "red_recorded",
  "implementation_recorded",
  "review_recorded",
  "landing_verdict_recorded",
  "landed",
  "retrospective_recorded",
  "closed"
] satisfies CoordinationState[];
const STATE_ORDER_INDEX: ReadonlyMap<string, number> = new Map(
  STATE_ORDER.map((state, index) => [state, index])
);

export async function validateCoordinationLog(repoRoot: string, workItemId: string) {
  await readCoordinationTimeline(repoRoot, workItemId);
}

export async function readCoordinationStatus(
  repoRoot: string,
  workItemId: string
): Promise<CoordinationStatus> {
  const { workItem, events } = await readCoordinationTimeline(repoRoot, workItemId);
  const stepTransitions = events.filter(isStepTransition);
  const current = stepTransitions.at(-1);

  if (!current) {
    throw new Error(`Coordination log has no step transitions: ${workItemId}`);
  }

  return {
    work_item: workItem.id,
    work_type: readWorkType(workItem),
    current_state: current.state,
    next_action: current.next_action,
    accountable_actor: current.accountable_actor,
    accepted_block: current.accepted_block,
    safe_trigger_points: current.safe_triggers,
    evidence: current.evidence
  };
}

export async function validateCoordinationLogs(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const item of workItems) {
    if (await hasCoordinationLog(repoRoot, item.id)) {
      await validateCoordinationLog(repoRoot, item.id);
    }
  }
}

async function readCoordinationTimeline(repoRoot: string, workItemId: string) {
  const workItem = await readWorkItem(repoRoot, workItemId);
  const logPath = coordinationLogPath(repoRoot, workItemId);
  const content = await readRequiredLog(logPath, workItemId);
  const events = await parseCoordinationEvents(repoRoot, workItemId, content);
  validateStepTransitionOrder(events);

  return { workItem, events };
}

async function parseCoordinationEvents(
  repoRoot: string,
  workItemId: string,
  content: string
) {
  const events: CoordinationEvent[] = [];
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim();
    if (!line) {
      continue;
    }

    const lineNumber = index + 1;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`Malformed coordination log at line ${lineNumber}`);
    }

    const event = parseCoordinationEvent(parsed, lineNumber, workItemId);
    await requireEvidenceReferences(repoRoot, event);
    events.push(event);
  }

  if (events.length === 0) {
    throw new Error(`Coordination log has no events: ${workItemId}`);
  }

  validateSequence(events);
  return events;
}

function parseCoordinationEvent(
  rawEvent: unknown,
  lineNumber: number,
  workItemId: string
): CoordinationEvent {
  if (!isRecord(rawEvent)) {
    throw new Error(`Malformed coordination event at line ${lineNumber}`);
  }

  if (rawEvent.version !== 1) {
    throw new Error(`Malformed coordination event at line ${lineNumber}: missing version 1`);
  }

  const eventType = requireString(rawEvent, "event_type", lineNumber);
  if (!VALID_EVENT_TYPES.has(eventType)) {
    throw new Error(`Unknown coordination event type: ${eventType}`);
  }

  const eventWorkItem = requireString(rawEvent, "work_item", lineNumber);
  if (eventWorkItem !== workItemId) {
    throw new Error(
      `Coordination event work item mismatch at line ${lineNumber}: ${eventWorkItem}`
    );
  }

  const envelope = {
    work_item: eventWorkItem,
    sequence: requirePositiveInteger(rawEvent, "sequence", lineNumber),
    actor: requireString(rawEvent, "actor", lineNumber),
    source: requireString(rawEvent, "source", lineNumber),
    evidence: readStringList(rawEvent.evidence, "evidence", lineNumber)
  };

  if (eventType === "actor_event") {
    return parseActorEvent(rawEvent, envelope, lineNumber);
  }

  return parseStepTransition(rawEvent, envelope, lineNumber);
}

function parseStepTransition(
  rawEvent: Record<string, unknown>,
  envelope: Omit<StepTransition, "event_type" | "state" | "next_action" | "accountable_actor" | "safe_triggers" | "accepted_block">,
  lineNumber: number
): StepTransition {
  const state = requireCoordinationState(rawEvent, lineNumber);
  const acceptedBlock = readAcceptedBlock(rawEvent.accepted_block, lineNumber);

  if (state === "blocked" && !acceptedBlock) {
    throw new Error("Blocked coordination state requires accepted_block");
  }

  if (state !== "blocked" && acceptedBlock) {
    throw new Error("accepted_block is only valid for blocked coordination state");
  }

  return {
    event_type: "step_transition",
    ...envelope,
    state,
    next_action: readNullableString(rawEvent.next_action, "next_action", lineNumber),
    accountable_actor: readNullableString(
      rawEvent.accountable_actor,
      "accountable_actor",
      lineNumber
    ),
    safe_triggers: readStringList(rawEvent.safe_triggers, "safe_triggers", lineNumber),
    accepted_block: acceptedBlock
  };
}

function parseActorEvent(
  rawEvent: Record<string, unknown>,
  envelope: Omit<ActorEvent, "event_type" | "actor_event_type">,
  lineNumber: number
): ActorEvent {
  const actorEventType = requireString(rawEvent, "actor_event_type", lineNumber);
  if (!VALID_ACTOR_EVENT_TYPES.has(actorEventType)) {
    throw new Error(`Unknown actor coordination event type: ${actorEventType}`);
  }

  return {
    event_type: "actor_event",
    ...envelope,
    actor_event_type: actorEventType
  };
}

function validateSequence(events: CoordinationEvent[]) {
  let previousSequence = 0;

  for (const event of events) {
    if (event.sequence <= previousSequence) {
      throw new Error(`Coordination event sequence must increase: ${event.sequence}`);
    }
    previousSequence = event.sequence;
  }
}

function validateStepTransitionOrder(events: CoordinationEvent[]) {
  let previousOrderedState: CoordinationState | null = null;
  let terminalClosed = false;

  for (const event of events) {
    if (!isStepTransition(event)) {
      continue;
    }

    if (terminalClosed && event.state !== "closed") {
      throw new Error(`Terminal coordination state contradiction after closed: ${event.state}`);
    }

    if (event.state === "blocked") {
      continue;
    }

    if (
      previousOrderedState &&
      transitionOrder(event.state) < transitionOrder(previousOrderedState)
    ) {
      throw new Error(
        `Illegal coordination state regression: ${previousOrderedState} -> ${event.state}`
      );
    }

    if (event.state === "closed") {
      terminalClosed = true;
    }

    previousOrderedState = event.state;
  }
}

async function requireEvidenceReferences(repoRoot: string, event: CoordinationEvent) {
  if (isStepTransition(event) && event.evidence.length === 0) {
    throw new Error(`Step transition requires evidence: ${event.work_item}`);
  }

  for (const reference of event.evidence) {
    if (path.isAbsolute(reference) || reference.includes("..")) {
      throw new Error(`Unsafe coordination evidence reference: ${reference}`);
    }

    try {
      await access(path.join(repoRoot, reference));
    } catch (error) {
      if (isMissingPathError(error)) {
        throw new Error(`Missing coordination evidence reference: ${reference}`);
      }
      throw error;
    }
  }
}

async function hasCoordinationLog(repoRoot: string, workItemId: string) {
  try {
    const entries = await readdir(path.join(repoRoot, "docs/work", workItemId));
    return entries.includes(LOG_FILE_NAME);
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

async function readRequiredLog(filePath: string, workItemId: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing coordination log: docs/work/${workItemId}/${LOG_FILE_NAME}`);
    }
    throw error;
  }
}

function coordinationLogPath(repoRoot: string, workItemId: string) {
  return path.join(repoRoot, "docs/work", workItemId, LOG_FILE_NAME);
}

function readWorkType(workItem: WorkItem) {
  return workItem.content.match(/^work_type:\s*(\S+)\s*$/m)?.[1] ?? "slice";
}

function requireCoordinationState(
  record: Record<string, unknown>,
  lineNumber: number
): CoordinationState {
  const state = requireString(record, "state", lineNumber);
  if (state !== "blocked" && !STATE_ORDER_INDEX.has(state)) {
    throw new Error(`Invalid coordination state: ${state}`);
  }
  return state as CoordinationState;
}

function transitionOrder(state: CoordinationState) {
  if (state === "blocked") {
    return Number.MAX_SAFE_INTEGER;
  }
  return STATE_ORDER_INDEX.get(state) ?? Number.MAX_SAFE_INTEGER;
}

function readAcceptedBlock(value: unknown, lineNumber: number) {
  if (value === undefined || value === null) {
    return null;
  }

  if (!isRecord(value)) {
    throw new Error(`Malformed accepted_block at line ${lineNumber}`);
  }

  return {
    owner: requireString(value, "owner", lineNumber),
    required_input: requireString(value, "required_input", lineNumber),
    resume_condition: requireString(value, "resume_condition", lineNumber)
  };
}

function requireString(
  record: Record<string, unknown>,
  field: string,
  lineNumber: number
) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Malformed coordination event at line ${lineNumber}: missing ${field}`
    );
  }
  return value.trim();
}

function requirePositiveInteger(
  record: Record<string, unknown>,
  field: string,
  lineNumber: number
) {
  const value = record[field];
  if (!Number.isInteger(value) || typeof value !== "number" || value < 1) {
    throw new Error(
      `Malformed coordination event at line ${lineNumber}: invalid ${field}`
    );
  }
  return value;
}

function readNullableString(value: unknown, field: string, lineNumber: number) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      `Malformed coordination event at line ${lineNumber}: invalid ${field}`
    );
  }

  return value;
}

function readStringList(value: unknown, field: string, lineNumber: number) {
  if (value === undefined) {
    return [];
  }

  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string" || entry.trim().length === 0)
  ) {
    throw new Error(
      `Malformed coordination event at line ${lineNumber}: invalid ${field}`
    );
  }

  return value.map((entry) => entry.trim());
}

function isStepTransition(event: CoordinationEvent): event is StepTransition {
  return event.event_type === "step_transition";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
