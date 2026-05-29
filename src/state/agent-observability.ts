import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH = ".bandit/policy/agent-observability.json";
const TRACE_DIR_DISPLAY_PATH = "docs/agent-observability";

export type AgentObservabilityValidationReport = {
  status: "pass";
  policy: string;
  traces: string[];
  authority: "derived_non_canonical";
};

export type AgentObservabilityProjectionReport = {
  authority: "derived_non_canonical";
  cost_signals: { total_tokens: number };
  latency_signals: { total_ms: number };
  retry_signals: { total_retries: number };
  failure_patterns: string[];
};

type TraceSpan = {
  span_id?: unknown;
  operation_kind?: unknown;
  started_at?: unknown;
  ended_at?: unknown;
  correlation?: Record<string, unknown>;
  outcome?: unknown;
  latency_ms?: number;
  retry_count?: number;
  token_count?: number;
  failure_type?: string;
  external_payload?: { handling?: string };
};

type Trace = {
  trace_id?: unknown;
  work_item?: unknown;
  stage?: unknown;
  actor?: unknown;
  started_at?: unknown;
  ended_at?: unknown;
  outcome?: unknown;
  source_artifacts?: unknown;
  spans?: TraceSpan[];
};

type AgentObservabilityPolicy = {
  projection_boundary?: {
    can_satisfy_required_workflow_artifacts?: unknown;
  };
  trace_shape?: {
    required_fields?: unknown;
    required_span_fields?: unknown;
    operation_kinds?: unknown;
  };
  correlation_requirements?: unknown;
};

export async function validateAgentObservability(
  repoRoot: string
): Promise<AgentObservabilityValidationReport> {
  const policy = await readJson(
    path.join(repoRoot, POLICY_DISPLAY_PATH),
    POLICY_DISPLAY_PATH
  ) as AgentObservabilityPolicy;
  const traces = await readTraces(repoRoot);
  const traceRequirements = readStringArray(
    policy.trace_shape?.required_fields,
    "policy trace_shape.required_fields"
  );
  const spanRequirements = readStringArray(
    policy.trace_shape?.required_span_fields,
    "policy trace_shape.required_span_fields"
  );
  const operationKinds = readStringArray(
    policy.trace_shape?.operation_kinds,
    "policy trace_shape.operation_kinds"
  );
  const correlationRequirements = readStringArray(
    policy.correlation_requirements,
    "policy correlation_requirements"
  );

  if (policy?.projection_boundary?.can_satisfy_required_workflow_artifacts === true) {
    throw new Error("observability traces and projections cannot replace canonical repo artifacts");
  }

  for (const traceEntry of traces) {
    validateRequiredFields(traceEntry.trace, traceRequirements, traceEntry.displayPath);
    if (!Array.isArray(traceEntry.trace.spans)) {
      throw new Error(`${traceEntry.displayPath} field spans must be an array`);
    }

    for (const span of traceEntry.trace.spans) {
      validateRequiredFields(span, spanRequirements, `${traceEntry.displayPath} span`);
      validateOperationKind(span, operationKinds, traceEntry.displayPath);
      validateSpanCorrelation(span, traceEntry.trace, correlationRequirements);

      if (span.external_payload?.handling === "instruction_bearing") {
        throw new Error("external trace payloads must remain data-only");
      }
    }
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    traces: traces.map((entry) => entry.displayPath),
    authority: "derived_non_canonical"
  };
}

export async function projectAgentObservability(
  repoRoot: string
): Promise<AgentObservabilityProjectionReport> {
  await validateAgentObservability(repoRoot);
  const traces = await readTraces(repoRoot);

  let totalTokens = 0;
  let totalMs = 0;
  let totalRetries = 0;
  const failureTypes = new Set<string>();

  for (const traceEntry of traces) {
    for (const span of traceEntry.trace.spans ?? []) {
      totalTokens += numberOrZero(span.token_count);
      totalMs += numberOrZero(span.latency_ms);
      totalRetries += numberOrZero(span.retry_count);
      if (typeof span.failure_type === "string" && span.failure_type.length > 0) {
        failureTypes.add(span.failure_type);
      }
    }
  }

  return {
    authority: "derived_non_canonical",
    cost_signals: { total_tokens: totalTokens },
    latency_signals: { total_ms: totalMs },
    retry_signals: { total_retries: totalRetries },
    failure_patterns: Array.from(failureTypes)
  };
}

async function readTraces(repoRoot: string): Promise<Array<{ displayPath: string; trace: Trace }>> {
  const traceDir = path.join(repoRoot, TRACE_DIR_DISPLAY_PATH);
  let entries;
  try {
    entries = await readdir(traceDir, { withFileTypes: true });
  } catch {
    throw new Error(`Missing ${TRACE_DIR_DISPLAY_PATH}`);
  }
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
  if (jsonFiles.length === 0) {
    throw new Error(`${TRACE_DIR_DISPLAY_PATH} must contain at least one JSON trace`);
  }

  const traces: Array<{ displayPath: string; trace: Trace }> = [];
  for (const fileName of jsonFiles) {
    const displayPath = path.posix.join(TRACE_DIR_DISPLAY_PATH, fileName);
    const trace = await readJson(path.join(traceDir, fileName), displayPath);
    traces.push({ displayPath, trace });
  }

  return traces;
}

async function readJson(filePath: string, label: string): Promise<any> {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    throw new Error(`Missing ${label}`);
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(`Malformed ${label}: invalid JSON`);
  }
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`${label} must be an array of strings`);
  }

  return value;
}

function validateRequiredFields(
  record: Record<string, unknown>,
  fields: string[],
  label: string
) {
  for (const field of fields) {
    const value = record[field];
    if (value === undefined || value === null) {
      throw new Error(`${label} missing required field ${field}`);
    }
  }
}

function validateOperationKind(
  span: TraceSpan,
  allowedOperationKinds: string[],
  displayPath: string
) {
  if (
    typeof span.operation_kind !== "string" ||
    !allowedOperationKinds.includes(span.operation_kind)
  ) {
    throw new Error(`${displayPath} span operation_kind is not allowed by policy`);
  }
}

function validateSpanCorrelation(span: TraceSpan, trace: Trace, requirements: string[]) {
  if (!isRecord(span.correlation)) {
    throw new Error("operation span correlation must be an object");
  }

  const missingWorkItem = requires(requirements, "work_item") && !hasText(span.correlation.work_item);
  const missingStage = requires(requirements, "stage") && !hasText(span.correlation.stage);
  if (missingWorkItem && missingStage) {
    throw new Error("operation span correlation requires work_item and stage");
  }

  for (const field of requirements) {
    if (field === "source_artifacts" && hasStringList(trace.source_artifacts)) {
      continue;
    }

    if (!hasText(span.correlation[field]) && !hasStringList(span.correlation[field])) {
      throw new Error(`operation span correlation requires ${field}`);
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requires(requirements: string[], field: string): boolean {
  return requirements.includes(field);
}

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

function hasStringList(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}
