# BANDIT-023 Retrospective

## Outcome

`BANDIT-023` is landed and closed out as the bootstrap-gap improvement chore for `BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING`.

The chore added an explicit Stage 4 and Stage 5 contract for Non-Blocking Review Findings: real but safe-to-defer reviewer findings must have concrete PM disposition and durable follow-up routing, while blocker findings, stale review-subject hashes, CodeRabbit request-changes, unresolved actionable findings, and missing disposition remain fail-closed.

## What Worked

- `review_subject_hash` prevented evidence-only closeout artifacts from reopening source review.
- Focused landing-gate tests covered routed non-blocking findings, missing routing, and blocker preservation before implementation.
- The review-evidence template kept durable follow-up routing repo-native instead of putting it in chat.
- Local Qwen passed with no findings after the routing contract was implemented.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Non-blocking review findings need a named routing field, not informal PM memory. | Durable artifact | `docs/templates/review-evidence.md` and `src/state/review-evidence.ts` now use `non_blocking_findings_routing`. |
| Safe-to-defer findings must not weaken blocker-level review behavior. | Durable artifact | `src/state/landing-stage4.ts` still rejects blocker findings and fails closed when non-blocking findings lack PM disposition or durable routing. |
| BANDIT-022 hardening suggestions are useful examples but not current landing blockers. | Follow-up chore candidates | `docs/work/BANDIT-022/follow-up-chores.md` keeps heartbeat token and UAT token hardening queued with source metadata, metric, baseline, evaluation window, status, and outcome. |
| The non-blocking routing contract should be evaluated against future Stage 4 review churn. | Improvement evaluation | This retrospective records the baseline, metric, evaluation window, and pending outcome for later keep/revise/revert/double-down evaluation. |

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
status: evaluated
outcome: keep
outcome_evidence:
  - `node --test --test-name-pattern "non-blocking Local Qwen findings|blocker Local Qwen findings" test/landing-gates.test.mjs` passed 3 focused tests.
  - `npm test` passed 196 tests during Stage 3 verification.
  - `npm run typecheck` passed during Stage 3 verification.
  - `npm run bandit -- validate` passed during Stage 3 and closeout verification.
  - `npm run bandit -- gaps list` passed during Stage 3 and closeout verification.
  - `npm run bandit -- qwen-review BANDIT-023` passed with reviewer_verdict pass and findings_status none.
  - `npm run bandit -- land-check BANDIT-023` passed.
  - `npm run bandit -- auto-land-check BANDIT-023` passed.
  - `npm run bandit -- land BANDIT-023 --action local-record` recorded landing action evidence.
  - `docs/work/BANDIT-030/improvement-evaluation.md` evaluated the policy after the planned Stage 4 evidence window and recorded result `effective`, decision `keep`.
  - `npm run bandit -- improvements evaluate BANDIT-023 --evidence docs/work/BANDIT-030/improvement-evaluation.md --json` passed.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-023`.

Local Qwen passed with no findings. CodeRabbit remains a recorded bootstrap gap for this local-record main-branch chore because no PR-backed CodeRabbit review exists; the aggregate review evidence records deterministic test verification plus Local Qwen pass evidence as replacement evidence without claiming a CodeRabbit pass.

## Bootstrap Gaps Remaining

- BANDIT-GAP-WORKFLOW-COCKPIT
