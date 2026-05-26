import { access, appendFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseMetadataFields, readScalar } from "./metadata.js";
import { readUatApproval } from "./uat-approval.js";
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
  actor_context?: ActorContext;
  typed_extension?: TypedExtensionStatus;
};

type AcceptedBlock = {
  owner: string;
  required_input: string;
  resume_condition: string;
};

type TypedExtensionStatus = {
  name: "feature_uat" | "chore_disposition";
  status: "required" | "satisfied";
  required_evidence: string[];
  evidence: string[];
};

type CoordinationState =
  | "brief_created"
  | "red_recorded"
  | "implementation_recorded"
  | "review_recorded"
  | "feature_uat_approved"
  | "landing_verdict_recorded"
  | "landed"
  | "chore_disposition_recorded"
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
  actor_event_type: ActorEventType;
  summary?: string;
  target_actor?: string;
  blocked_owner?: string;
  resume_condition?: string;
  repair_scope?: string;
};

type CoordinationEvent = StepTransition | ActorEvent;
type ActorEventType = "claim" | "handoff" | "block" | "complete" | "repair-request" | "resume";
type ActorContextEntry = {
  actor: string;
  summary: string;
  sequence: number;
};
type ActorContext = {
  latest_advisory_claim?: ActorContextEntry;
  latest_handoff?: ActorContextEntry & { target_actor: string };
  latest_block_event?: ActorContextEntry & {
    blocked_owner: string;
    resume_condition: string;
  };
  pending_repair_request?: ActorContextEntry & { repair_scope: string };
  latest_resume?: ActorContextEntry;
};
export type NewActorEventInput = {
  actor_event_type: ActorEventType;
  actor: string;
  source: string;
  summary: string;
  evidence: string[];
  target_actor?: string;
  blocked_owner?: string;
  resume_condition?: string;
  repair_scope?: string;
};

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
  "feature_uat_approved",
  "landing_verdict_recorded",
  "landed",
  "chore_disposition_recorded",
  "retrospective_recorded",
  "closed"
] satisfies CoordinationState[];
const STATE_ORDER_INDEX: ReadonlyMap<string, number> = new Map(
  STATE_ORDER.map((state, index) => [state, index])
);

export async function validateCoordinationLog(repoRoot: string, workItemId: string) {
  await readCoordinationTimeline(repoRoot, workItemId);
}

export async function appendActorCoordinationEvent(
  repoRoot: string,
  workItemId: string,
  input: NewActorEventInput
) {
  try {
    await readWorkItem(repoRoot, workItemId);
  } catch (error) {
    if (error instanceof Error && error.message === `Work item not found: ${workItemId}`) {
      throw new Error(`Unknown work item: ${workItemId}`);
    }
    throw error;
  }

  const logPath = coordinationLogPath(repoRoot, workItemId);
  const content = await readRequiredLog(logPath, workItemId);
  const existingEvents = await parseCoordinationEvents(repoRoot, workItemId, content);
  validateStepTransitionOrder(existingEvents);

  const event = createActorEvent(workItemId, existingEvents.at(-1)?.sequence ?? 0, input);
  const nextContent = appendJsonLine(content, event);
  const nextEvents = await parseCoordinationEvents(repoRoot, workItemId, nextContent);
  validateStepTransitionOrder(nextEvents);

  await appendFile(logPath, `${JSON.stringify(event)}\n`, "utf8");
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
  const workType = readWorkType(workItem);

  return {
    work_item: workItem.id,
    work_type: workType,
    current_state: current.state,
    next_action: current.next_action,
    accountable_actor: current.accountable_actor,
    accepted_block: current.accepted_block,
    safe_trigger_points: current.safe_triggers,
    evidence: current.evidence,
    ...readActorContext(events),
    ...readTypedExtensionStatus(workItem.id, workType, current)
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
  await validateTypedExtensionTransitions(repoRoot, workItem, events);
  validateStepTransitionOrder(events);

  return { workItem, events };
}

async function validateTypedExtensionTransitions(
  repoRoot: string,
  workItem: WorkItem,
  events: CoordinationEvent[]
) {
  const workType = readWorkType(workItem);
  let previousOrderedState: CoordinationState | null = null;

  for (const event of events) {
    if (!isStepTransition(event)) {
      continue;
    }

    if (event.state === "feature_uat_approved") {
      await validateFeatureUatTransition(
        repoRoot,
        workItem.id,
        workType,
        event,
        previousOrderedState
      );
    }

    if (event.state === "chore_disposition_recorded") {
      await validateChoreDispositionTransition(
        repoRoot,
        workItem.id,
        workType,
        event,
        previousOrderedState
      );
    }

    if (event.state !== "blocked") {
      previousOrderedState = event.state;
    }
  }
}

async function validateFeatureUatTransition(
  repoRoot: string,
  workItemId: string,
  workType: string,
  event: StepTransition,
  previousOrderedState: CoordinationState | null
) {
  if (workType !== "slice") {
    throw new Error("feature_uat_approved requires work_type slice");
  }

  if (previousOrderedState !== "review_recorded") {
    throw new Error("feature_uat_approved must follow review_recorded");
  }

  const requiredEvidence = featureUatEvidencePath(workItemId);
  if (!event.evidence.includes(requiredEvidence)) {
    throw new Error(
      `feature_uat_approved requires current UAT evidence: ${requiredEvidence}`
    );
  }

  try {
    const approval = await readUatApproval(repoRoot, workItemId);
    if (approval.sourceDriftStatus !== "current") {
      throw new Error("stale UAT approval");
    }
  } catch {
    throw new Error(
      `feature_uat_approved requires current UAT evidence: ${requiredEvidence}`
    );
  }
}

async function validateChoreDispositionTransition(
  repoRoot: string,
  workItemId: string,
  workType: string,
  event: StepTransition,
  previousOrderedState: CoordinationState | null
) {
  if (workType !== "chore" && workType !== "improvement_chore") {
    throw new Error(
      "chore_disposition_recorded requires work_type chore or improvement_chore"
    );
  }

  if (previousOrderedState !== "landed") {
    throw new Error("chore_disposition_recorded must follow landed");
  }

  const requiredEvidence = choreDispositionEvidencePath(workItemId);
  if (!event.evidence.includes(requiredEvidence)) {
    throw new Error(
      `chore_disposition_recorded requires disposition evidence: ${requiredEvidence}`
    );
  }

  await readChoreDisposition(repoRoot, workItemId, requiredEvidence);
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
    actor_event_type: actorEventType as ActorEventType,
    ...readOptionalActorEventFields(rawEvent, lineNumber)
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

function createActorEvent(
  workItemId: string,
  previousSequence: number,
  input: NewActorEventInput
): ActorEvent & { version: 1; timestamp: string } {
  const event = {
    version: 1 as const,
    event_type: "actor_event" as const,
    work_item: workItemId,
    sequence: previousSequence + 1,
    timestamp: new Date().toISOString(),
    actor: input.actor,
    source: input.source,
    evidence: input.evidence,
    actor_event_type: input.actor_event_type,
    summary: input.summary
  };

  return {
    ...event,
    ...readActionSpecificFields(input)
  };
}

function readActionSpecificFields(input: NewActorEventInput) {
  if (input.actor_event_type === "handoff") {
    return { target_actor: input.target_actor };
  }

  if (input.actor_event_type === "block") {
    return {
      blocked_owner: input.blocked_owner,
      resume_condition: input.resume_condition
    };
  }

  if (input.actor_event_type === "repair-request") {
    return { repair_scope: input.repair_scope };
  }

  return {};
}

function appendJsonLine(content: string, event: unknown) {
  const separator = content.endsWith("\n") || content.length === 0 ? "" : "\n";
  return `${content}${separator}${JSON.stringify(event)}\n`;
}

function readActorContext(events: CoordinationEvent[]): { actor_context?: ActorContext } {
  const context: ActorContext = {};

  for (const event of events) {
    if (!isActorEvent(event) || !event.summary) {
      continue;
    }

    const base = {
      actor: event.actor,
      summary: event.summary,
      sequence: event.sequence
    };

    if (event.actor_event_type === "claim") {
      context.latest_advisory_claim = base;
    }

    if (event.actor_event_type === "handoff" && event.target_actor) {
      context.latest_handoff = { ...base, target_actor: event.target_actor };
    }

    if (
      event.actor_event_type === "block" &&
      event.blocked_owner &&
      event.resume_condition
    ) {
      context.latest_block_event = {
        ...base,
        blocked_owner: event.blocked_owner,
        resume_condition: event.resume_condition
      };
    }

    if (event.actor_event_type === "repair-request" && event.repair_scope) {
      context.pending_repair_request = { ...base, repair_scope: event.repair_scope };
    }

    if (event.actor_event_type === "resume") {
      context.latest_resume = base;
    }
  }

  if (Object.keys(context).length === 0) {
    return {};
  }

  return { actor_context: context };
}

function readTypedExtensionStatus(
  workItemId: string,
  workType: string,
  current: StepTransition
): { typed_extension?: TypedExtensionStatus } {
  if (current.state === "feature_uat_approved") {
    const evidencePath = featureUatEvidencePath(workItemId);
    return {
      typed_extension: {
        name: "feature_uat",
        status: "satisfied",
        required_evidence: [evidencePath],
        evidence: current.evidence.filter((reference) => reference === evidencePath)
      }
    };
  }

  if (current.state === "chore_disposition_recorded") {
    const evidencePath = choreDispositionEvidencePath(workItemId);
    return {
      typed_extension: {
        name: "chore_disposition",
        status: "satisfied",
        required_evidence: [evidencePath],
        evidence: current.evidence.filter((reference) => reference === evidencePath)
      }
    };
  }

  if (workType === "slice" && current.safe_triggers.includes("feature_uat_required")) {
    return {
      typed_extension: {
        name: "feature_uat",
        status: "required",
        required_evidence: [featureUatEvidencePath(workItemId)],
        evidence: []
      }
    };
  }

  if (
    (workType === "chore" || workType === "improvement_chore") &&
    current.safe_triggers.includes("chore_disposition_required")
  ) {
    return {
      typed_extension: {
        name: "chore_disposition",
        status: "required",
        required_evidence: [choreDispositionEvidencePath(workItemId)],
        evidence: []
      }
    };
  }

  return {};
}

async function readChoreDisposition(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  const content = await readFile(path.join(repoRoot, displayPath), "utf8");
  const fields = parseMetadataFields(content);

  requireChoreDispositionScalar(fields, "contract_version", displayPath);
  requireChoreDispositionScalar(fields, "work_item", displayPath);
  requireChoreDispositionScalar(fields, "disposition_status", displayPath);
  requireChoreDispositionScalar(fields, "disposition_kind", displayPath);
  requireChoreDispositionScalar(fields, "rationale", displayPath);

  if (readScalar(fields, "contract_version") !== "1") {
    throw new Error(`Unsupported chore disposition contract version: ${displayPath}`);
  }

  if (readScalar(fields, "work_item") !== workItemId) {
    throw new Error(`Malformed chore disposition: ${displayPath}; work_item mismatch`);
  }

  if (readScalar(fields, "disposition_status") !== "pass") {
    throw new Error(
      `chore_disposition_recorded requires passing disposition evidence: ${displayPath}`
    );
  }
}

function requireChoreDispositionScalar(
  fields: ReturnType<typeof parseMetadataFields>,
  field: string,
  displayPath: string
) {
  if (!readScalar(fields, field)) {
    throw new Error(`Malformed chore disposition: ${displayPath}; missing ${field}`);
  }
}

function featureUatEvidencePath(workItemId: string) {
  return `docs/work/${workItemId}/uat-approval.md`;
}

function choreDispositionEvidencePath(workItemId: string) {
  return `docs/work/${workItemId}/chore-disposition.md`;
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

function readOptionalActorEventFields(
  rawEvent: Record<string, unknown>,
  lineNumber: number
) {
  return {
    ...readOptionalStringField(rawEvent, "summary", lineNumber),
    ...readOptionalStringField(rawEvent, "target_actor", lineNumber),
    ...readOptionalStringField(rawEvent, "blocked_owner", lineNumber),
    ...readOptionalStringField(rawEvent, "resume_condition", lineNumber),
    ...readOptionalStringField(rawEvent, "repair_scope", lineNumber)
  };
}

function readOptionalStringField(
  record: Record<string, unknown>,
  field: string,
  lineNumber: number
) {
  if (record[field] === undefined) {
    return {};
  }

  return { [field]: requireString(record, field, lineNumber) };
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

function isActorEvent(event: CoordinationEvent): event is ActorEvent {
  return event.event_type === "actor_event";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
