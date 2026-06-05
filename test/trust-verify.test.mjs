import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("trust verify accepts a complete stage-transition snapshot and emits a deterministic report", async () => {
  const repo = await createInitializedRepo();
  const snapshotPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/stage-transition.json"
  );

  const first = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json"
  ]);
  const second = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json"
  ]);

  assert.equal(first.code, 0, first.stderr);
  assert.equal(second.code, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);

  const report = JSON.parse(first.stdout);
  assert.equal(report.trust_goal, "stage_transition");
  assert.equal(report.verdict, "trusted");
  assert.match(report.snapshot_hash, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(report.failed_checks, []);
  assert.ok(report.passed_checks.includes("snapshot_schema"));
  assert.ok(report.passed_checks.includes("canonical_snapshot_hash"));
  assert.ok(report.passed_checks.includes("evidence_digests"));
  assert.ok(report.passed_checks.includes("reviewer_finding_routing"));
  assert.ok(!JSON.stringify(report).includes("timestamp"));
});

test("trust verify fails closed for unsupported trust goals and missing schema fields", async () => {
  const repo = await createInitializedRepo();
  const unsupportedGoalPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/unsupported-goal.json",
    { trust_goal: "safe_to_land" }
  );
  const missingSchema = validSnapshot();
  delete missingSchema.schema_version;
  await writeJsonAt(
    repo,
    "docs/specs/snapshots/missing-schema-version.json",
    missingSchema
  );

  const unsupportedGoal = await runBandit(repo, [
    "trust",
    "verify",
    unsupportedGoalPath,
    "--json"
  ]);
  const missingSchemaVersion = await runBandit(repo, [
    "trust",
    "verify",
    "docs/specs/snapshots/missing-schema-version.json",
    "--json"
  ]);

  assert.equal(unsupportedGoal.code, 1);
  assert.match(unsupportedGoal.stderr, /unsupported trust_goal: safe_to_land/);
  assert.equal(missingSchemaVersion.code, 1);
  assert.match(missingSchemaVersion.stderr, /schema_version/);
});

test("trust verify rejects changed evidence and unsafe evidence paths", async () => {
  const repo = await createInitializedRepo();
  await writeFileAt(repo, "docs/work/BANDIT-059/red-evidence.md", "red\n");
  await writeJsonAt(
    repo,
    "docs/specs/snapshots/changed-evidence.json",
    validSnapshot({
      evidence: [
        {
          id: "red-evidence",
          path: "docs/work/BANDIT-059/red-evidence.md",
          digest: digest("red\n")
        }
      ]
    })
  );
  await writeFileAt(repo, "docs/work/BANDIT-059/red-evidence.md", "changed\n");
  await writeJsonAt(
    repo,
    "docs/specs/snapshots/unsafe-evidence-path.json",
    validSnapshot({
      evidence: [
        {
          id: "outside",
          path: "../outside.md",
          digest: digest("outside\n")
        }
      ]
    })
  );

  const changedEvidence = await runBandit(repo, [
    "trust",
    "verify",
    "docs/specs/snapshots/changed-evidence.json",
    "--json"
  ]);
  const unsafePath = await runBandit(repo, [
    "trust",
    "verify",
    "docs/specs/snapshots/unsafe-evidence-path.json",
    "--json"
  ]);

  assert.equal(changedEvidence.code, 1);
  assert.match(changedEvidence.stderr, /digest mismatch.*red-evidence/);
  assert.equal(unsafePath.code, 1);
  assert.match(unsafePath.stderr, /unsafe evidence path.*\.\.\/outside\.md/);
});

test("trust verify derives needs_repair for unresolved actionable reviewer findings", async () => {
  const repo = await createInitializedRepo();
  const snapshotPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/unresolved-reviewer-finding.json",
    {
      reviewer_findings: [
        {
          reviewer: "coderabbit",
          finding_id: "CR-1",
          severity: "blocker",
          actionable: true,
          status: "unresolved"
        }
      ]
    }
  );

  const result = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json"
  ]);

  assert.equal(result.code, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.verdict, "needs_repair");
  assert.match(
    report.failed_checks.join("\n"),
    /unresolved actionable reviewer finding: CR-1/
  );
});

test("trust verify derives blocked for malformed non-blocking finding dispositions", async () => {
  const repo = await createInitializedRepo();
  const snapshotPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/malformed-non-blocking-disposition.json",
    {
      reviewer_findings: [
        {
          reviewer: "local_qwen",
          finding_id: "QWEN-1",
          severity: "non_blocking",
          actionable: true,
          disposition: "accepted"
        }
      ]
    }
  );

  const result = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json"
  ]);

  assert.equal(result.code, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.verdict, "blocked");
  assert.match(
    report.failed_checks.join("\n"),
    /accepted non-blocking finding requires rationale: QWEN-1/
  );
});

test("trust verify derives requires_operator when captured routing requires operator input", async () => {
  const repo = await createInitializedRepo();
  const snapshotPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/operator-input-required.json",
    {
      trust_goal: "landing",
      required_operator_input: [
        {
          gate: "uat",
          prompt: "Confirm CLI-owned UAT approval for BANDIT-059 landing."
        }
      ]
    }
  );

  const result = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json"
  ]);

  assert.equal(result.code, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.verdict, "requires_operator");
  assert.deepEqual(report.required_operator_input, [
    {
      gate: "uat",
      prompt: "Confirm CLI-owned UAT approval for BANDIT-059 landing."
    }
  ]);
});

test("trust verify is read-only by default and writes reports only when requested", async () => {
  const repo = await createInitializedRepo();
  const snapshotPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/report-write.json"
  );
  await writeFileAt(
    repo,
    "docs/work/BANDIT-059/coordination-log.jsonl",
    '{"state":"red_recorded"}\n'
  );
  const eventsBefore = await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8");
  const coordinationBefore = await readFile(
    path.join(repo, "docs/work/BANDIT-059/coordination-log.jsonl"),
    "utf8"
  );

  const defaultResult = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json"
  ]);

  assert.equal(defaultResult.code, 0, defaultResult.stderr);
  assert.equal(
    await pathExists(path.join(repo, "reports/trust/BANDIT-059.json")),
    false
  );
  assert.equal(
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8"),
    eventsBefore
  );
  assert.equal(
    await readFile(path.join(repo, "docs/work/BANDIT-059/coordination-log.jsonl"), "utf8"),
    coordinationBefore
  );

  const reportResult = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--json",
    "--report",
    "reports/trust/BANDIT-059.json"
  ]);

  assert.equal(reportResult.code, 0, reportResult.stderr);
  assert.deepEqual(
    JSON.parse(await readFile(path.join(repo, "reports/trust/BANDIT-059.json"), "utf8")),
    JSON.parse(reportResult.stdout)
  );
  assert.equal(
    await readFile(path.join(repo, ".bandit/events.jsonl"), "utf8"),
    eventsBefore
  );
  assert.equal(
    await readFile(path.join(repo, "docs/work/BANDIT-059/coordination-log.jsonl"), "utf8"),
    coordinationBefore
  );
});

test("trust verify rejects compatibility-period gate replacement or live execution flags", async () => {
  const repo = await createInitializedRepo();
  const snapshotPath = await writeTrustSnapshot(
    repo,
    "docs/specs/snapshots/compatibility-period.json"
  );

  const replacementAttempt = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--replace-land-check"
  ]);
  const liveExecutionAttempt = await runBandit(repo, [
    "trust",
    "verify",
    snapshotPath,
    "--run-tests"
  ]);

  assert.equal(replacementAttempt.code, 1);
  assert.match(
    replacementAttempt.stderr,
    /trust verifier compatibility period.*cannot replace existing gates/
  );
  assert.equal(liveExecutionAttempt.code, 1);
  assert.match(
    liveExecutionAttempt.stderr,
    /trust verifier is read-only.*does not run tests/
  );
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  const init = await runBandit(repo, ["init"]);
  assert.equal(init.code, 0, init.stderr);
  return repo;
}

async function writeTrustSnapshot(repo, relativePath, overrides = {}) {
  await writeFileAt(repo, "docs/work/BANDIT-059/brief.md", "# BANDIT-059\n");
  await writeFileAt(
    repo,
    "docs/work/BANDIT-059/red-evidence.md",
    "# BANDIT-059 RED Evidence\n"
  );
  await writeJsonAt(repo, relativePath, validSnapshot(overrides));
  return relativePath;
}

function validSnapshot(overrides = {}) {
  return {
    schema_version: 1,
    trust_goal: "stage_transition",
    work_item: {
      id: "BANDIT-059",
      stable_id: "bandit-059-trust-verify-snapshot-foundation"
    },
    repo: {
      base_ref: "main~1",
      head_ref: "main"
    },
    declared_intent:
      "Advance BANDIT-059 through the trust verifier foundation workflow.",
    changed_surfaces: [
      {
        path: "test/trust-verify.test.mjs",
        kind: "test_surface",
        risk: "workflow_authority"
      }
    ],
    policy_context: [
      {
        id: "approved-brief",
        path: "docs/work/BANDIT-059/brief.md"
      }
    ],
    evidence: [
      {
        id: "red-evidence",
        path: "docs/work/BANDIT-059/red-evidence.md",
        digest: digest("# BANDIT-059 RED Evidence\n")
      }
    ],
    reviewer_findings: [],
    required_operator_input: [],
    ...overrides
  };
}

async function writeJsonAt(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, contents) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
}

function digest(contents) {
  return `sha256:${createHash("sha256").update(contents).digest("hex")}`;
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
