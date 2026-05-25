# Review Evidence: BANDIT-018

contract_version: 1
work_item: BANDIT-018
source_head: 102d3a8b7e1cf05daffa903c10864385e0c61293
verification_state: pass
verification_evidence:
  - node --test --test-name-pattern "escalated-review" test/landing-gates.test.mjs passed 8 focused tests at focused repair head e80ddbe635bd68e8cdbf04d7a2dca8aff719a0c5.
  - npm test passed 164 tests at focused repair head e80ddbe635bd68e8cdbf04d7a2dca8aff719a0c5.
  - npm run typecheck passed at focused repair head e80ddbe635bd68e8cdbf04d7a2dca8aff719a0c5.
  - npm run bandit -- validate passed after the Local Qwen refresh artifact was written.
  - npm run bandit -- land-check BANDIT-018 failed closed on the expected missing landing verdict artifact; no landing verdict has been created.
  - docs/work/BANDIT-018/model-comparison.md records the original Qwen 3.6 / Sonnet 4.6 / Opus 4.7 comparison, the AC10 repair-head Qwen 3.6 / Opus 4.7 refresh, and the focused Stage 4 finding repair-head Qwen 3.6 / Opus 4.7 refresh.
  - Opus 4.7 accepted the focused Stage 4 finding repair as sound, found no Stage 3 blocker, and returned non_blocking findings only.
  - The operator explicitly directed Codex PM to finish BANDIT-018 now under the existing terminal-disposition-only policy and route the remaining raw-HEAD evidence-loop problem to BANDIT-019.
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - No PR-backed CodeRabbit review exists for BANDIT-018 because the active bootstrap work is on main and prior repo evidence showed no associated pull request.
  - Replacement evidence is deterministic local verification plus the side-by-side, AC10 repair-head, and focused finding repair-head Qwen/Opus review evidence recorded in docs/work/BANDIT-018/model-comparison.md.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - docs/work/BANDIT-018/local-qwen-review.md records Local Qwen non_blocking evidence at focused repair source head e80ddbe635bd68e8cdbf04d7a2dca8aff719a0c5.
  - Qwen accepted the implementation behavior and surfaced only non-blocking routing-null-guard, write-before-throw hygiene, and test-ID traceability findings.
  - Codex PM disposition resolves those findings for landing: readRoutingDecision fails closed instead of returning null, write-before-throw evidence is accepted as audit evidence, test-ID traceability was repaired, and the operator directed the remaining evidence-head loop to BANDIT-019.
escalated_review_required: true
escalated_review_state: pass
escalated_review_rationale: The operator approved using the Sourmash-style claude -p headless path for Sonnet and Opus and asked for Qwen 3.6, Sonnet 4.6, and Opus 4.7 comparison before choosing the escalated reviewer. Opus 4.7 was selected as the default escalated reviewer based on the side-by-side run. The focused repair-head Opus 4.7 refresh at e80ddbe635bd68e8cdbf04d7a2dca8aff719a0c5 accepted the focused repair and returned non_blocking findings only. docs/work/BANDIT-018/escalated-review.md now records that operator-approved headless Opus evidence as the configured escalated review pass for this bootstrap chore.
pm_disposition: pass
pm_disposition_rationale: Codex PM accepts the Opus 4.7 finding that the focused Stage 4 repair is sound and no blocker remains. Local Qwen's routing-null-guard concern is non-blocking because readRoutingDecision is a required-artifact parser that throws on missing or malformed routing evidence and does not return null. Write-before-throw evidence is accepted as intentional audit evidence because the command exits nonzero and land-check rejects stale or non-pass escalated-review evidence. Test-ID traceability is resolved by the current focused repair sequence. The raw-HEAD evidence-loop concern is real but outside BANDIT-018 closeout; the operator directed it to become BANDIT-019 and required future work to use the new hash-based freshness methodology after BANDIT-019 lands.
operator_input_status: provided
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - CodeRabbit PR-backed review is not available for this local-record bootstrap chore because no pull request exists for main; no CodeRabbit pass is claimed.
  - BANDIT-019 will replace raw git HEAD freshness with review-subject hash freshness so evidence-only commits do not force repeated review loops.
