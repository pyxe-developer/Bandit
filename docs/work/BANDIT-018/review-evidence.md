# Review Evidence: BANDIT-018

contract_version: 1
work_item: BANDIT-018
source_head: 1f65ec047371c861134b04d6bf4035d06c532d2b
verification_state: blocker
verification_evidence:
  - node --test --test-name-pattern "escalated-review" test/landing-gates.test.mjs previously passed 3 focused tests at implementation head 211b3c4201e905050c196b7cc729341db8e2089d.
  - npm test previously passed 158 tests at implementation head 211b3c4201e905050c196b7cc729341db8e2089d.
  - npm run typecheck previously passed at implementation head 211b3c4201e905050c196b7cc729341db8e2089d.
  - npm run bandit -- validate previously passed after implementation evidence.
  - Side-by-side reviewer comparison on 2026-05-25 used the same packet for Qwen 3.6, Sonnet 4.6, and Opus 4.7; docs/work/BANDIT-018/model-comparison.md records commands, verdicts, cost/latency evidence, and PM disposition.
  - Sonnet 4.6 and Opus 4.7 independently found a blocker-level AC10 coverage/spec-alignment gap: the brief requires more focused refusal-path tests than the implementation evidence records.
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - No PR-backed CodeRabbit review exists for BANDIT-018 because the active bootstrap work is on main and prior repo evidence showed no associated pull request.
  - Replacement evidence is deterministic local verification plus the side-by-side Qwen/Sonnet/Opus comparison recorded in docs/work/BANDIT-018/model-comparison.md.
local_qwen_state: non_blocking
local_qwen_replacement_evidence:
  - docs/work/BANDIT-018/local-qwen-review.md records Local Qwen non_blocking evidence at implementation source head 211b3c4201e905050c196b7cc729341db8e2089d.
  - The 2026-05-25 same-packet Qwen run also returned non_blocking and did not identify the AC10 blocker found by Sonnet and Opus.
escalated_review_required: true
escalated_review_state: blocker
escalated_review_rationale: The operator approved using the Sourmash-style claude -p headless path for Sonnet and Opus and asked for Qwen 3.6, Sonnet 4.6, and Opus 4.7 comparison before choosing the escalated reviewer. Opus 4.7 is selected as the default escalated reviewer based on this run, and the escalated review blocks landing on the AC10 coverage/spec-alignment gap.
pm_disposition: blocker
pm_disposition_rationale: Codex PM accepts the shared Sonnet/Opus AC10 blocker. The implementation evidence claims AC10 with only three focused tests, while the brief requires coverage for reviewer blocker verdicts, stale source heads, missing credentials/setup, unavailable or timed-out providers, malformed output, configured pass evidence, and land-check integration. Repair is required before landing. Codex PM rejects Sonnet's stale-artifact fail-open claim as a blocker because land-check checks escalated-review source_drift_status and source-head freshness, but the stale-artifact write-before-throw path remains useful repair context.
operator_input_status: provided
uat_status: not_applicable
clean_code_status: blocker
source_drift_status: current
bootstrap_gaps:
  - CodeRabbit PR-backed review is not available for this local-record bootstrap chore because no pull request exists for main; no CodeRabbit pass is claimed.
  - The prior paid-provider credential/setup blocker is superseded for this review step by the operator-approved claude -p comparison path. Future durable provider integration still needs a repo-native Claude headless adapter or explicit no-action disposition.
