import assert from "node:assert/strict";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createTempRepo,
  runBandit,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

test("improvements candidates discovers complete repo-native improvement metadata", async () => {
  const repo = await createImprovementRepo();
  await writeCandidateDisposition(repo, {
    id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION"
  });

  const result = await runBandit(repo, [
    "improvements",
    "candidates",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.candidates, [
    {
      id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
      source_work_item: "BANDIT-028",
      status: "queued_candidate",
      outcome: "pending",
      metric: "future_stage4_review_repeats_invalid_actor_validation",
      baseline: "BANDIT-028 accepts non-empty actor strings without a canonical actor identity policy.",
      expected_direction: "decrease",
      evaluation_window: "when actor identity policy, coordination event validation, claim leases, or work surface reservation work is next touched",
      source_artifacts: [
        "docs/work/BANDIT-028/local-qwen-review.md",
        "docs/work/BANDIT-028/qwen-finding-disposition.md"
      ]
    }
  ]);
});

test("improvements candidates discovers retrospective improvement metadata", async () => {
  const repo = await createImprovementRepo();
  await writeRetrospectiveImprovementMetadata(repo);

  const result = await runBandit(repo, [
    "improvements",
    "candidates",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.candidates, [
    {
      id: "BANDIT-023",
      source_work_item: "BANDIT-022",
      status: "resolved",
      outcome: "pending",
      metric: "adversarial_repair_count",
      baseline: "BANDIT-015 required multiple Local Qwen reruns before the operator ended a recursive Stage 4 loop; BANDIT-022 landed with two Local Qwen non_blocking hardening findings queued as chore candidates.",
      expected_direction: "decrease repeated review loops caused only by future-hardening findings while keeping blocker finding acceptance unchanged.",
      evaluation_window: "Evaluate after the next three work items that reach Stage 4 with Local Qwen findings or after one additional repeated non-blocking review loop, whichever comes first.",
      source_artifacts: [
        "docs/work/BANDIT-022/local-qwen-review.md",
        "docs/work/BANDIT-022/review-evidence.md",
        "docs/work/BANDIT-022/follow-up-chores.md",
        "docs/work/BANDIT-023/brief.md",
        "docs/work/BANDIT-023/review-evidence.md"
      ]
    }
  ]);
});

test("improvements candidates ignores completed retrospective outcomes", async () => {
  const repo = await createImprovementRepo();
  await writeCompletedRetrospectiveOutcome(repo);

  const result = await runBandit(repo, [
    "improvements",
    "candidates",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.candidates, []);
});

test("improvements candidates fails closed for missing required metadata", async () => {
  const repo = await createImprovementRepo();
  await writeCandidateDisposition(repo, {
    id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
    metric: ""
  });

  const result = await runBandit(repo, [
    "improvements",
    "candidates",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing required improvement metadata: metric/);
});

test("improvements candidates fails closed for missing source artifacts", async () => {
  const repo = await createImprovementRepo();
  await writeCandidateDisposition(repo, {
    id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
    source_artifacts: [
      "docs/work/BANDIT-028/local-qwen-review.md",
      "docs/work/BANDIT-028/missing-disposition.md"
    ]
  });

  const result = await runBandit(repo, [
    "improvements",
    "candidates",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing improvement source artifact: docs\/work\/BANDIT-028\/missing-disposition\.md/);
});

test("improvements evaluate validates one evidence artifact with explicit result and decision", async () => {
  const repo = await createImprovementRepo();
  await writeCandidateDisposition(repo, {
    id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION"
  });
  await writeEvaluationEvidence(repo, {
    candidateId: "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
    result: "effective",
    decision: "keep"
  });

  const result = await runBandit(repo, [
    "improvements",
    "evaluate",
    "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
    "--evidence",
    "docs/work/BANDIT-029/improvement-evaluation.md",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.candidate_id, "BANDIT-028-ACTOR-IDENTITY-VALIDATION");
  assert.equal(report.result, "effective");
  assert.equal(report.decision, "keep");
  assert.equal(report.routing_action, "keep current actor-event advisory policy until actor identity policy is explicitly scoped");
  await assertNoHiddenImprovementIndex(repo);
});

test("improvements evaluate refuses unsupported result and routing decision values", async () => {
  const repo = await createImprovementRepo();
  await writeCandidateDisposition(repo, {
    id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION"
  });
  await writeEvaluationEvidence(repo, {
    candidateId: "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
    result: "helpful",
    decision: "accept"
  });

  const result = await runBandit(repo, [
    "improvements",
    "evaluate",
    "BANDIT-028-ACTOR-IDENTITY-VALIDATION",
    "--evidence",
    "docs/work/BANDIT-029/improvement-evaluation.md"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Unsupported improvement result: helpful/);
  assert.match(result.stderr, /Unsupported improvement decision: accept/);
});

test("improvements candidates report stays derived and does not create canonical cache state", async () => {
  const repo = await createImprovementRepo();
  await writeCandidateDisposition(repo, {
    id: "BANDIT-028-ACTOR-IDENTITY-VALIDATION"
  });

  const result = await runBandit(repo, [
    "improvements",
    "candidates",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  await assertNoHiddenImprovementIndex(repo);
});

async function createImprovementRepo() {
  const repo = await createTempRepo();
  await writeWorkBrief(repo, "BANDIT-028", "Agent Coordination Event Commands", "Closed");
  await writeWorkBrief(repo, "BANDIT-029", "Improvement Evaluation Foundation", "Brief Created");
  await writeArtifact(repo, "docs/work/BANDIT-028/local-qwen-review.md", "# Local Qwen\n");
  return repo;
}

async function writeCandidateDisposition(repo, overrides = {}) {
  const sourceArtifacts = overrides.source_artifacts ?? [
    "docs/work/BANDIT-028/local-qwen-review.md",
    "docs/work/BANDIT-028/qwen-finding-disposition.md"
  ];
  const fields = {
    id: overrides.id,
    metric: overrides.metric ?? "future_stage4_review_repeats_invalid_actor_validation",
    source_artifacts: sourceArtifacts,
    ...overrides
  };

  const metricLine = fields.metric ? `metric: ${fields.metric}\n` : "";
  const sourceArtifactLines = fields.source_artifacts
    .map((artifact) => `  - ${artifact}`)
    .join("\n");

  await writeArtifact(
    repo,
    "docs/work/BANDIT-028/qwen-finding-disposition.md",
    `# BANDIT-028 Local Qwen Finding Disposition

## Durable Chore Candidate

### Chore Candidate: \`${fields.id}\`

origin: Local Qwen non-blocking hardening finding from \`BANDIT-028\`.
source_work_item: BANDIT-028
source_artifacts:
${sourceArtifactLines}
lesson: Coordination event commands need a durable actor identity contract.
hypothesis: Defining actor identity syntax will reduce ambiguous coordination-event authorship.
${metricLine}baseline: BANDIT-028 accepts non-empty actor strings without a canonical actor identity policy.
expected_direction: decrease
evaluation_window: when actor identity policy, coordination event validation, claim leases, or work surface reservation work is next touched
status: queued_candidate
linked_work_item: none_yet
outcome: pending
`,
    "utf8"
  );
}

async function writeCompletedRetrospectiveOutcome(repo) {
  await writeArtifact(
    repo,
    "docs/work/BANDIT-017/retrospective.md",
    `# BANDIT-017 Retrospective

## Improvement Chores

source_work_item: BANDIT-016
source_gap: BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING
linked_work_item: BANDIT-017
hypothesis: Extracting Stage 4 logic will reduce landing-gate complexity.
metric: Existing landing-gate behavior remains covered while complexity decreases.
baseline: BANDIT-016 had persistent non_blocking complexity findings.
evaluation_window: BANDIT-017 closeout.
status: resolved
outcome: keep
`
  );
}

async function writeRetrospectiveImprovementMetadata(repo) {
  await writeWorkBrief(repo, "BANDIT-022", "Heartbeat Chore Agent Contract", "Closed");
  await writeWorkBrief(repo, "BANDIT-023", "Non-Blocking Review Finding Chore Routing", "Closed");
  await writeArtifact(repo, "docs/work/BANDIT-022/local-qwen-review.md", "# Local Qwen\n");
  await writeArtifact(repo, "docs/work/BANDIT-022/review-evidence.md", "# Review Evidence\n");
  await writeArtifact(repo, "docs/work/BANDIT-022/follow-up-chores.md", "# Follow-Up Chores\n");
  await writeArtifact(repo, "docs/work/BANDIT-023/review-evidence.md", "# Review Evidence\n");
  await writeArtifact(
    repo,
    "docs/work/BANDIT-023/retrospective.md",
    `# BANDIT-023 Retrospective

## Improvement Chores

source_work_item: BANDIT-022
source_gap: BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING
linked_work_item: BANDIT-023
origin: operator_observation
source_artifacts:
  - docs/work/BANDIT-022/local-qwen-review.md
  - docs/work/BANDIT-022/review-evidence.md
  - docs/work/BANDIT-022/follow-up-chores.md
  - docs/work/BANDIT-023/brief.md
  - docs/work/BANDIT-023/review-evidence.md
hypothesis: Explicit non-blocking review-finding routing will reduce adversarial-review churn while preserving fail-closed behavior for real blockers.
metric: adversarial_repair_count
baseline: BANDIT-015 required multiple Local Qwen reruns before the operator ended a recursive Stage 4 loop; BANDIT-022 landed with two Local Qwen non_blocking hardening findings queued as chore candidates.
expected_direction: decrease repeated review loops caused only by future-hardening findings while keeping blocker finding acceptance unchanged.
evaluation_window: Evaluate after the next three work items that reach Stage 4 with Local Qwen findings or after one additional repeated non-blocking review loop, whichever comes first.
status: resolved
outcome: pending
`,
    "utf8"
  );
}

async function writeEvaluationEvidence(repo, options) {
  await writeArtifact(
    repo,
    "docs/work/BANDIT-029/improvement-evaluation.md",
    `# Improvement Evaluation Evidence

candidate_id: ${options.candidateId}
source_artifacts:
  - docs/work/BANDIT-028/qwen-finding-disposition.md
metric: future_stage4_review_repeats_invalid_actor_validation
baseline: BANDIT-028 accepts non-empty actor strings without a canonical actor identity policy.
observed_metric_evidence: No later Stage 4 review repeated the invalid actor validation finding.
comparison_to_baseline: The finding did not recur after durable routing.
result: ${options.result}
decision: ${options.decision}
rationale: Evidence supports keeping the current advisory actor-event boundary until actor identity policy is explicitly scoped.
routing_action: keep current actor-event advisory policy until actor identity policy is explicitly scoped
`,
    "utf8"
  );
}

async function writeArtifact(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}

async function assertNoHiddenImprovementIndex(repo) {
  const hiddenIndexes = [
    ".bandit/improvements.json",
    ".bandit/improvement-index.json",
    ".bandit/improvement-candidates.json"
  ];

  for (const hiddenIndex of hiddenIndexes) {
    await assert.rejects(access(path.join(repo, hiddenIndex)));
  }
}
