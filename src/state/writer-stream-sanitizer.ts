import { createHash } from "node:crypto";

type WriterStreamSanitizeOptions = {
  workItem: string;
  stage: string;
  rawStreamPath: string;
};

type WriterStreamDigest = {
  artifact: "writer-stream-digest";
  work_item: string;
  stage: string;
  disposition: "sanitized_digest_only";
  reason: string;
  raw_stream_path: string;
  raw_stream_sha256: string;
  raw_stream_bytes: number;
  line_count: number;
  event_counts: Record<string, number>;
  redacted_fields: string[];
  malformed_json_lines: number;
  terminal_reason: string | null;
  secret_values_recorded: false;
};

const REDACTED_FIELD_NAMES = [
  "additionalContext",
  "content",
  "hookSpecificOutput",
  "hook_id",
  "message",
  "output",
  "session_id",
  "stderr",
  "stdout",
  "tool_use_result",
  "uuid"
] as const;

export function sanitizeWriterStreamJsonl(
  rawStream: string,
  options: WriterStreamSanitizeOptions
): string {
  const eventCounts: Record<string, number> = {};
  const redactedFields = new Set<string>();
  let malformedJsonLines = 0;
  let terminalReason: string | null = null;

  for (const line of rawStream.split(/\r?\n/)) {
    if (!line.trim()) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      malformedJsonLines += 1;
      continue;
    }

    collectRedactedFields(parsed, redactedFields);

    if (!isRecord(parsed)) {
      increment(eventCounts, "unknown");
      continue;
    }

    const type = readString(parsed.type) ?? "unknown";
    const subtype = readString(parsed.subtype);
    increment(eventCounts, subtype ? `${type}:${subtype}` : type);
    terminalReason = readString(parsed.stop_reason) ?? terminalReason;
  }

  const digest: WriterStreamDigest = {
    artifact: "writer-stream-digest",
    work_item: options.workItem,
    stage: options.stage,
    disposition: "sanitized_digest_only",
    reason:
      "Raw writer streams can contain host, hook, session, prompt, tool, and runtime payloads; durable evidence records only a non-reversible digest and event summary.",
    raw_stream_path: options.rawStreamPath,
    raw_stream_sha256: createHash("sha256").update(rawStream).digest("hex"),
    raw_stream_bytes: Buffer.byteLength(rawStream, "utf8"),
    line_count: rawStream.split(/\r?\n/).filter((line) => line.trim()).length,
    event_counts: eventCounts,
    redacted_fields: Array.from(redactedFields).sort(),
    malformed_json_lines: malformedJsonLines,
    terminal_reason: terminalReason,
    secret_values_recorded: false
  };

  return `${JSON.stringify(digest)}\n`;
}

function collectRedactedFields(value: unknown, fields: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectRedactedFields(item, fields);
    return;
  }
  if (!isRecord(value)) return;

  for (const [key, nestedValue] of Object.entries(value)) {
    if (isRedactedField(key)) {
      fields.add(key);
    }
    collectRedactedFields(nestedValue, fields);
  }
}

function isRedactedField(key: string): boolean {
  return REDACTED_FIELD_NAMES.some((fieldName) => fieldName === key);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function increment(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}
