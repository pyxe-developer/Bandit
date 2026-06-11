import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProviderBlockerEvidence,
  validateProviderBlockerEvidence
} from "../src/state/provider-blocker-evidence.ts";

test("provider blocker evidence records failure classes without pass claims", () => {
  const timeout = buildProviderBlockerEvidence({
    workItemId: "BANDIT-096",
    stage: "stage_4_review",
    provider: "coderabbit",
    outcome: "provider_timeout",
    command: "timeout 600 coderabbit review --agent --type uncommitted",
    elapsedMs: 600000,
    terminalEvidence: false
  });

  assert.equal(timeout.verdict, "bootstrap_gap");
  assert.equal(timeout.pass_claimed, false);
  assert.equal(timeout.findings_status, "resolved");
  assert.equal(timeout.findings_disposition, "provider_timeout_replacement_evidence");
  assert.equal(timeout.stop_condition, "provider_timeout");
  assert.match(timeout.summary, /No CodeRabbit pass is claimed/i);

  const malformed = buildProviderBlockerEvidence({
    workItemId: "BANDIT-096",
    stage: "stage_3_implementation",
    provider: "claude",
    outcome: "malformed_output",
    command: "claude -p",
    elapsedMs: 1000,
    terminalEvidence: true
  });
  assert.equal(malformed.verdict, "blocker");
  assert.equal(malformed.stop_condition, "malformed_provider_output");
});

test("provider blocker evidence rejects partial completion as success", () => {
  assert.throws(
    () =>
      validateProviderBlockerEvidence({
        work_item: "BANDIT-096",
        stage: "stage_4_review",
        provider: "coderabbit",
        outcome: "provider_timeout",
        verdict: "pass",
        pass_claimed: true,
        terminal_evidence: false
      }),
    /partial completion.*success|pass.*without terminal/i
  );

  assert.throws(
    () =>
      validateProviderBlockerEvidence({
        work_item: "BANDIT-096",
        stage: "stage_4_review",
        provider: "local_qwen",
        outcome: "unavailable_route",
        verdict: "bootstrap_gap",
        pass_claimed: false,
        route: "qwen review"
      }),
    /Local Qwen.*authorized route/i
  );
});
