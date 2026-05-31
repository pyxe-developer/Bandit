import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

test("writer stream sanitizer emits durable digest without raw runtime payloads", () => {
  const rawStream = [
    JSON.stringify({
      type: "system",
      subtype: "hook_response",
      hook_id: "hook-123",
      output: "runtime payload with /Users/matthewflebbe/Bandit and ghp_secret_123",
      stdout: "hidden stdout",
      stderr: "hidden stderr"
    }),
    JSON.stringify({
      type: "assistant",
      message: {
        content: "model output that should not be durable evidence"
      },
      session_id: "session-123"
    }),
    JSON.stringify({
      type: "result",
      subtype: "success",
      stop_reason: "end_turn"
    })
  ].join("\n");

  const script = `
    import { sanitizeWriterStreamJsonl } from "./src/state/writer-stream-sanitizer.ts";
    const raw = ${JSON.stringify(rawStream)};
    process.stdout.write(sanitizeWriterStreamJsonl(raw, {
      workItem: "BANDIT-999",
      stage: "Stage 4 Repair",
      rawStreamPath: ".bandit/tmp/BANDIT-999/writer-stream.jsonl"
    }));
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", script],
    { cwd: repoRoot, encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  const digest = JSON.parse(result.stdout);
  assert.equal(digest.artifact, "writer-stream-digest");
  assert.equal(digest.work_item, "BANDIT-999");
  assert.equal(digest.stage, "Stage 4 Repair");
  assert.equal(digest.disposition, "sanitized_digest_only");
  assert.equal(digest.raw_stream_path, ".bandit/tmp/BANDIT-999/writer-stream.jsonl");
  assert.equal(digest.raw_stream_bytes, Buffer.byteLength(rawStream, "utf8"));
  assert.equal(digest.line_count, 3);
  assert.equal(digest.terminal_reason, "end_turn");
  assert.deepEqual(digest.event_counts, {
    "system:hook_response": 1,
    assistant: 1,
    "result:success": 1
  });
  assert.ok(digest.raw_stream_sha256);
  assert.equal(digest.secret_values_recorded, false);

  assert.doesNotMatch(result.stdout, /ghp_secret_123/);
  assert.doesNotMatch(result.stdout, /\/Users\/matthewflebbe\/Bandit/);
  assert.doesNotMatch(result.stdout, /hidden stdout/);
  assert.doesNotMatch(result.stdout, /model output/);
  assert.doesNotMatch(result.stdout, /session-123/);
  assert.match(result.stdout, /content/);
  assert.match(result.stdout, /stdout/);
  assert.match(result.stdout, /session_id/);
});
