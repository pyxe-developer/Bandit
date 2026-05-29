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
  correlation?: Record<string, unknown>;
  latency_ms?: number;
  retry_count?: number;
  token_count?: number;
  failure_type?: string;
  external_payload?: { handling?: string };
};

type Trace = {
  spans?: TraceSpan[];
};

export async function validateAgentObservability(
  repoRoot: string
): Promise<AgentObservabilityValidationReport> {
  const policy = await readJson(path.join(repoRoot, POLICY_DISPLAY_PATH), POLICY_DISPLAY_PATH);
  const traces = await readTraces(repoRoot);

  if (policy?.projection_boundary?.can_satisfy_required_workflow_artifacts === true) {
    throw new Error("observability traces and projections cannot replace canonical repo artifacts");
  }

  for (const traceEntry of traces) {
    for (const span of traceEntry.trace.spans ?? []) {
      const workItem = span.correlation?.work_item;
      const stage = span.correlation?.stage;
      if (typeof workItem !== "string" || typeof stage !== "string") {
        throw new Error("operation span correlation requires work_item and stage");
      }

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
  const entries = await readdir(traceDir, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

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
