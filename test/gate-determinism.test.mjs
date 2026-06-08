import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");
const binPath = path.join(repoRoot, "bin/bandit.mjs");

test("validate --json emits stable gate determinism output for dispositioned local and provider evidence", async () => {
  const repo = await createInitializedRepo();
  const cockpitOutput = {
    active_work_item: "BANDIT-073",
    gates: [
      { id: "cockpit-status", verdict: "pass" },
      { id: "session-context", verdict: "pass" }
    ],
    status: "pass"
  };
  await writeGateDeterminismPolicy(repo, {
    covered_gates: [
      coveredGate("cockpit-status", cockpitOutput, [
        { run: 1, stdout_json: cockpitOutput },
        {
          run: 2,
          stdout_json: {
            status: "pass",
            gates: [
              { verdict: "pass", id: "cockpit-status" },
              { verdict: "pass", id: "session-context" }
            ],
            active_work_item: "BANDIT-073"
          }
        }
      ])
    ],
    external_evidence: [
      {
        id: "coderabbit-timeout",
        evidence_class: "provider_dependent",
        provider: "coderabbit",
        source_artifact: "docs/work/BANDIT-073/coderabbit-formation-review.md",
        captured_at: "2026-06-08T01:27:38Z",
        freshness: { expires_at: "2026-06-09T01:27:38Z" },
        availability_disposition: "provider_timeout",
        replaces_deterministic_local_proof: false
      }
    ],
    nondeterminism_dispositions: [
      disposition("provider-timeout", "provider_dependent_evidence")
    ]
  });

  const first = await runBandit(repo, ["validate", "--json"]);
  const second = await runBandit(repo, ["validate", "--json"]);

  assert.equal(first.code, 0, first.stderr);
  assert.equal(second.code, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);
  assert.deepEqual(JSON.parse(first.stdout).gate_determinism_flake_gate, {
    status: "pass",
    policy: ".bandit/policy/gate-determinism-flake-gate.json",
    covered_gate_count: 1,
    covered_gates: [
      {
        id: "cockpit-status",
        command: "node ./bin/bandit.mjs cockpit status --json",
        output_hash: stableHash(cockpitOutput),
        repeat_runs: 2,
        status: "pass"
      }
    ],
    external_evidence: [
      {
        id: "coderabbit-timeout",
        evidence_class: "provider_dependent",
        provider: "coderabbit",
        availability_disposition: "provider_timeout",
        replaces_deterministic_local_proof: false,
        status: "pass"
      }
    ],
    nondeterminism_dispositions: ["provider-timeout"]
  });
});

test("validate fails closed when a covered gate has unstable output ordering or hash drift", async () => {
  const repo = await createInitializedRepo();
  const firstOutput = { verdicts: ["pass", "blocker"], status: "pass" };
  await writeGateDeterminismPolicy(repo, {
    covered_gates: [
      coveredGate("review-evidence", firstOutput, [
        { run: 1, stdout_json: firstOutput },
        { run: 2, stdout_json: { verdicts: ["blocker", "pass"], status: "pass" } }
      ])
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /review-evidence/);
  assert.match(result.stderr, /unstable output/);
  assert.match(result.stderr, /output hash drift/);
});

test("validate fails closed on undispositioned flakes and provider evidence without freshness metadata", async () => {
  const repo = await createInitializedRepo();
  const stableOutput = { status: "pass" };
  await writeGateDeterminismPolicy(repo, {
    covered_gates: [
      coveredGate("session-context", stableOutput, [
        { run: 1, stdout_json: stableOutput },
        { run: 2, stdout_json: stableOutput }
      ])
    ],
    nondeterminism_sources: [
      {
        id: "flaky-focused-test",
        source: "flaky_test",
        source_artifact: "test/gate-determinism.test.mjs",
        disposition_id: "missing-disposition"
      }
    ],
    external_evidence: [
      {
        id: "coderabbit-review",
        evidence_class: "provider_dependent",
        provider: "coderabbit",
        source_artifact: "docs/work/BANDIT-073/coderabbit-review.md",
        replaces_deterministic_local_proof: true
      }
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /flaky-focused-test/);
  assert.match(result.stderr, /missing nondeterminism disposition missing-disposition/);
  assert.match(result.stderr, /coderabbit-review/);
  assert.match(result.stderr, /missing captured_at/);
  assert.match(result.stderr, /missing freshness.expires_at/);
  assert.match(result.stderr, /missing availability_disposition/);
  assert.match(result.stderr, /cannot replace deterministic local proof/);
});

test("validate rejects direct qwen CLI evidence as Local Qwen proof", async () => {
  const repo = await createInitializedRepo();
  const stableOutput = { status: "pass" };
  await writeGateDeterminismPolicy(repo, {
    covered_gates: [
      coveredGate("local-qwen-review", stableOutput, [
        { run: 1, stdout_json: stableOutput },
        { run: 2, stdout_json: stableOutput }
      ])
    ],
    external_evidence: [
      {
        id: "local-qwen-direct",
        evidence_class: "provider_dependent",
        provider: "local_qwen",
        route: "direct_qwen_cli",
        source_artifact: "docs/work/BANDIT-073/local-qwen-review.md",
        captured_at: "2026-06-08T01:27:38Z",
        freshness: { expires_at: "2026-06-09T01:27:38Z" },
        availability_disposition: "available",
        replaces_deterministic_local_proof: false
      }
    ]
  });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /local-qwen-direct/);
  assert.match(result.stderr, /direct qwen CLI is not authorized/);
  assert.match(result.stderr, /\.bandit\/reviewers\/local-qwen\.json/);
  assert.match(result.stderr, /bin\/omlx-chat-completions\.mjs/);
});

function runBandit(cwd, args) {
  return new Promise((resolve) => {
    execFile(process.execPath, [binPath, ...args], { cwd }, (error, stdout, stderr) => {
      resolve({
        code: typeof error?.code === "number" ? error.code : 0,
        stdout,
        stderr
      });
    });
  });
}

async function createInitializedRepo() {
  const repo = await mkdtemp(path.join(tmpdir(), "bandit-gate-determinism-"));
  const result = await runBandit(repo, ["init"]);
  assert.equal(result.code, 0, result.stderr);
  await copyTemplateFixtures(repo);
  await copyReviewerFixtures(repo);
  await copyPolicyFixtures(repo);
  return repo;
}

async function copyTemplateFixtures(repo) {
  const sourceDir = path.join(repoRoot, "docs/templates");
  const fileNames = await readdir(sourceDir);
  await mkdir(path.join(repo, "docs/templates"), { recursive: true });
  for (const fileName of fileNames.filter((name) => name.endsWith(".md"))) {
    await copyFile(
      path.join(sourceDir, fileName),
      path.join(repo, "docs/templates", fileName)
    );
  }
}

async function copyReviewerFixtures(repo) {
  await mkdir(path.join(repo, ".bandit/reviewers"), { recursive: true });
  await copyFile(
    path.join(repoRoot, ".bandit/reviewers/local-qwen.json"),
    path.join(repo, ".bandit/reviewers/local-qwen.json")
  );
}

async function copyPolicyFixtures(repo) {
  await mkdir(path.join(repo, ".bandit/policy"), { recursive: true });
  await copyFile(
    path.join(repoRoot, ".bandit/policy/smell-triggers.json"),
    path.join(repo, ".bandit/policy/smell-triggers.json")
  );
}

function coveredGate(id, expectedOutput, repeatRuns) {
  return {
    id,
    command: `node ./bin/bandit.mjs ${id === "cockpit-status" ? "cockpit status --json" : "validate"}`,
    output_type: "json",
    deterministic_local_proof: true,
    expected_hash: stableHash(expectedOutput),
    repeat_runs: repeatRuns
  };
}

function disposition(id, source) {
  return {
    id,
    source,
    source_artifact: "docs/work/BANDIT-073/brief.md",
    disposition: "bounded_freshness",
    rationale: `${source} is allowed only with explicit freshness and availability metadata`
  };
}

async function writeGateDeterminismPolicy(repo, overrides = {}) {
  await writeJson(repo, ".bandit/policy/gate-determinism-flake-gate.json", {
    version: 1,
    command_version: 1,
    covered_gates: overrides.covered_gates ?? [],
    nondeterminism_sources: overrides.nondeterminism_sources ?? [],
    nondeterminism_dispositions: overrides.nondeterminism_dispositions ?? [],
    external_evidence: overrides.external_evidence ?? []
  });
}

async function writeJson(repo, relativePath, value) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function stableHash(value) {
  return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}

function stableStringify(value) {
  return JSON.stringify(sortForStableStringify(value));
}

function sortForStableStringify(value) {
  if (Array.isArray(value)) {
    return value.map(sortForStableStringify);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortForStableStringify(value[key])])
    );
  }
  return value;
}
