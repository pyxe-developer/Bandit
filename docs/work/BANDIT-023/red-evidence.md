# BANDIT-023 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the non-blocking review finding routing contract before production implementation. They fail because land-check still accepts only Local Qwen pass or bootstrap_gap evidence and does not enforce durable routing for non_blocking findings.

## Test Command

```sh
node --test --test-name-pattern "non-blocking Local Qwen findings|blocker Local Qwen findings" test/landing-gates.test.mjs
```

## Observed Output

```text
tests 3
pass 0
fail 3
land-check accepts non-blocking Local Qwen findings with durable routing failed: safe-to-land requires local Qwen pass or explicit bootstrap_gap evidence
land-check blocks non-blocking Local Qwen findings without durable routing failed: expected non-blocking review findings require durable follow-up routing, received safe-to-land requires local Qwen pass or explicit bootstrap_gap evidence
land-check keeps blocker Local Qwen findings blocked even with routing failed: expected Local Qwen reviewer verdict blocks landing: blocker, received safe-to-land requires local Qwen pass or explicit bootstrap_gap evidence
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The chore brief exists and links to BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING. | docs/work/BANDIT-023/brief.md exists and .bandit/bootstrap-gaps.json links BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING to BANDIT-023. |
| The future implementation or policy artifact names Non-Blocking Review Finding as the canonical term. | CONTEXT.md already defines Non-Blocking Review Finding; RED tests use non_blocking Local Qwen evidence as the executable policy case. |
| Stage 4 evidence can record non_blocking reviewer findings with PM disposition and durable follow-up routing without forcing another review solely because the disposition artifact was written. | The routed non_blocking test expects land-check to return safe-to-land when review evidence records pm_disposition_rationale and non_blocking_findings_routing. |
| Landing remains blocked when PM disposition or follow-up routing is missing. | The unrouted non_blocking test expects land-check to fail with a durable follow-up routing error instead of accepting a bare rationale. |
| Landing remains blocked when findings are blocker-level. | The blocker Local Qwen test expects land-check to preserve fail-closed blocker behavior even if a follow-up route is present. |
| BANDIT-022 follow-up candidates are linked to the new routing contract or explicitly dispositioned. | The routed test references docs/work/BANDIT-022/follow-up-chores.md as the durable follow-up source example. |
| No cockpit, broader coordination primitive, automatic merge/push/deploy, or product feature work is introduced. | The focused tests touch only Stage 4 and Stage 5 land-check evidence interpretation. |

## Next Action

Implement the non-blocking review finding routing contract in review evidence parsing and land-check readiness. Accept non_blocking review findings only with concrete PM disposition and durable routing, keep blocker findings fail-closed, and do not broaden into cockpit, Phase 6 coordination, automatic merge/push/deploy, or product feature work.
