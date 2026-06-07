import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("trust cutover gate validation records current no-cutover-approved state", async () => {
  const repo = await createInitializedRepo();
  await writeCutoverPolicy(repo, validNoCutoverPolicy());

  const result = await runBandit(repo, [
    "trust",
    "cutover-gates",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.verdict, "pass");
  assert.deepEqual(payload.approved_trust_goals, []);
  assert.equal(payload.compatibility_period, true);
  assert.equal(payload.old_gates_authoritative, true);
});

test("trust cutover gate validation fails closed for incomplete future cutover proposals", async () => {
  const repo = await createInitializedRepo();
  await writeCutoverPolicy(repo, {
    ...validNoCutoverPolicy(),
    cutover_gates: [
      {
        trust_goal: "landing",
        status: "proposed",
        old_authoritative_gate: "npm run bandit -- land-check <ID>"
      }
    ]
  });

  const result = await runBandit(repo, [
    "trust",
    "cutover-gates",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing proposed_trust_verifier/);
  assert.match(result.stderr, /missing parity_evidence/);
  assert.match(result.stderr, /missing operator_approval/);
});

test("trust cutover gate validation rejects implicit canonical or wrapper claims", async () => {
  const repo = await createInitializedRepo();
  await writeCutoverPolicy(repo, {
    ...validNoCutoverPolicy(),
    cutover_gates: [
      {
        trust_goal: "landing",
        status: "canonical",
        old_authoritative_gate: "npm run bandit -- land-check <ID>",
        proposed_trust_verifier: "bandit trust verify",
        wrapper_behavior: "replace_old_gate",
        parity_evidence: ["docs/work/BANDIT-064/review-evidence.md"],
        stricter_failure_behavior: "fail closed on missing evidence",
        report_format: "deterministic_json",
        rollback_or_fallback: "return to old gate command",
        evidence_freshness_boundary: ".bandit/policy/evidence-freshness-slos.json",
        reviewer_finding_routing_boundary: "docs/templates/review-evidence.md",
        operator_approval: {
          status: "missing",
          evidence: null
        }
      }
    ]
  });

  const result = await runBandit(repo, [
    "trust",
    "cutover-gates",
    "validate"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /implicit cutover claim.*landing/);
  assert.match(result.stderr, /operator approval status is missing/);
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writeCutoverPolicy(repo, value) {
  await writeJsonAt(repo, ".bandit/policy/trust-verifier-cutover-gates.json", value);
}

async function writeJsonAt(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function validNoCutoverPolicy() {
  return {
    version: 1,
    compatibility_period: true,
    old_gates_authoritative: true,
    approved_trust_goals: [],
    cutover_gates: []
  };
}
