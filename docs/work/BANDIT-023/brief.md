# BANDIT-023: Non-Blocking Review Finding Chore Routing

## Status

RED Recorded

## Non-Product Work

Resolve the bootstrap gap exposed by repeated Local Qwen hardening loops: real non-blocking review findings need durable chore or no-action routing so landing can proceed when required gates accept the implementation.

## Origin

Operator policy direction on 2026-05-25 after BANDIT-022 Local Qwen returned non_blocking hardening findings: move nit-level findings to chores and proceed with landing rather than reopening Stage 4 indefinitely.

origin: operator_observation
source_work_item: BANDIT-022
source_artifacts:
  - docs/work/BANDIT-022/local-qwen-review.md
  - docs/work/BANDIT-022/review-evidence.md
  - docs/work/BANDIT-022/follow-up-chores.md
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
lesson: A review loop prevents slop only when it blocks on substantive implementation risk; non-blocking future-hardening findings should become durable chores or no-action decisions instead of recursively delaying landing.
hypothesis: Explicit non-blocking review-finding routing will reduce adversarial-review churn while preserving fail-closed behavior for real blockers.
metric: adversarial_repair_count
baseline: BANDIT-015 required multiple Local Qwen reruns before the operator ended a recursive Stage 4 loop; BANDIT-022 landed with two Local Qwen non_blocking hardening findings queued as chore candidates.
expected_direction: decrease repeated review loops caused only by future-hardening findings while keeping blocker finding acceptance unchanged.
evaluation_window: Evaluate after the next three work items that reach Stage 4 with Local Qwen findings or after one additional repeated non-blocking review loop, whichever comes first.
status: planned
outcome: pending

## Scope

- Define the policy boundary between blocker review findings, non-blocking review findings, and explicit no-action decisions.
- Route accepted non-blocking review findings into tagged improvement chores, follow-up chore candidates, or explicit no-action dispositions with source artifacts, hypothesis, metric, baseline, evaluation window, status, and outcome.
- Make Stage 4 and Stage 5 evidence distinguish implementation-safety blockers from future-hardening concerns that are safe to defer.
- Use the BANDIT-022 heartbeat next-action token mapping and explicit UAT approval token findings as source examples for the routing contract.
- Preserve fail-closed behavior for stale review-subject hashes, CodeRabbit request-changes, blocker reviewer verdicts, unresolved actionable findings, and missing PM disposition.
- Do not weaken Local Qwen as the baseline adversarial reviewer or make the operator decide routine code-safety warnings.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-023/brief.md and links to BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING.
- The future implementation or policy artifact names Non-Blocking Review Finding as the canonical term for real but safe-to-defer review findings.
- Stage 4 evidence can record non_blocking reviewer findings with PM disposition and durable follow-up routing without forcing another review solely because the disposition artifact was written.
- Landing remains blocked when findings are blocker-level, CodeRabbit request-changes remain actionable, review evidence is stale for the current review subject, or PM disposition/follow-up routing is missing.
- The BANDIT-022 follow-up candidates are linked to the new routing contract or explicitly dispositioned with no-action rationale.
- The metric baseline captures that BANDIT-015 and BANDIT-022 both exposed repeated or potentially repeated review churn from future-hardening findings.
- No cockpit, broader Phase 6 coordination primitive, automatic merge/push/deploy, or product feature work is introduced by this chore.

## Verification Plan

- Run focused tests for any Stage 4, landing-readiness, review-evidence, or improvement-chore routing behavior touched by the implementation.
- Run npm test if implementation touches shared command routing, validators, review evidence parsing, landing gates, bootstrap gaps, or improvement metadata.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run npm run bandit -- qwen-review BANDIT-023 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-023 before landing.
- Run git diff --check.

## Expected Files

- docs/work/BANDIT-023/brief.md
- docs/work/BANDIT-023/red-evidence.md
- docs/work/BANDIT-023/implementation-evidence.md
- docs/work/BANDIT-023/local-qwen-review.md
- docs/work/BANDIT-023/review-evidence.md
- docs/work/BANDIT-023/landing-verdict.md
- docs/work/BANDIT-023/landing-action.md
- docs/work/BANDIT-023/retrospective.md
- docs/work/BANDIT-022/follow-up-chores.md
- CONTEXT.md
- .bandit/bootstrap-gaps.json

## Required Evidence

- docs/work/BANDIT-023/brief.md
- docs/work/BANDIT-023/red-evidence.md
- docs/work/BANDIT-023/implementation-evidence.md
- docs/work/BANDIT-023/local-qwen-review.md
- docs/work/BANDIT-023/review-evidence.md
- docs/work/BANDIT-023/landing-verdict.md
- docs/work/BANDIT-023/landing-action.md
- docs/work/BANDIT-023/retrospective.md

## Operator Input Status

Operator policy direction is provided: non-blocking hardening findings should move to chores and landing should proceed. No additional operator-owned input is required before creating this chore brief or RED evidence. If implementation would change which findings count as blockers, halt and request explicit policy input.
