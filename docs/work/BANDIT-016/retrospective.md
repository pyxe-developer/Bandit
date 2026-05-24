# BANDIT-016 Retrospective

## Outcome

`BANDIT-016` is landed as a bootstrap workflow-infrastructure chore.

The chore converted `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` into a
repo-native Stage 4 evidence-head contract. Landing readiness can now treat
terminal disposition-only updates as non-stale while preserving fail-closed
behavior for actual source, test, policy, validator, or gate logic changes
after review.

## What Worked

- The Stage 4 evidence-head policy made terminal disposition-only paths
  explicit in `.bandit/policy/stage4-evidence-head.json`.
- Focused tests covered accepted implementation with disposition-only updates,
  protected source drift, PM rationale checks, structured PM rationale, typed
  policy patterns, and shallow changed-path diagnostics.
- Local Qwen repeatedly accepted the implementation behavior while surfacing
  future-hardening concerns, which gave Codex PM concrete follow-up scope.
- The operator-owned loop disposition stopped a self-reinforcing review cycle
  and converted the remaining findings into next-work evidence.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Iterative review artifacts need explicit terminal evidence-head semantics. | Durable artifact | Implemented Stage 4 evidence-head policy validation and `land-check` consumption. |
| Accepted Local Qwen findings need structured PM rationale, not only prose matching. | Durable artifact | Added `pm_disposition_rationale` and updated review-evidence template coverage. |
| Changed-path diagnostics need clear fail-closed categories for unusual git states. | Durable artifact | Added shallow and partial-clone missing-base categories while keeping stale review behavior fail-closed. |
| `land-check.ts` is carrying too much Stage 4 logic after repeated hardening. | Bootstrap-gap chore | Queued `BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING` as `BANDIT-017`. |
| Failed diff classification should avoid repeated git state probes. | Bootstrap-gap chore | Included git-state caching or deferred classification in `BANDIT-017`. |

## Improvement Chores

### BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING

source_work_item: BANDIT-016
source_artifacts:
  - docs/work/BANDIT-016/local-qwen-review.md
  - docs/work/BANDIT-016/qwen-loop-operator-disposition.md
  - docs/work/BANDIT-016/qwen-finding-repair.md
lesson: Repeated Stage 4 review hardening left `land-check.ts` carrying too much stale-evaluation and PM-rationale logic, and changed-path error classification now probes git state during failed diff handling.
hypothesis: Extracting Stage 4 stale-evaluation/rationale logic and caching or deferring git repository state checks will reduce landing-gate complexity without weakening fail-closed stale-evidence behavior.
metric: Existing landing-gate behavior remains covered by tests while Stage 4 stale-evaluation/rationale logic moves behind clearer module boundaries and failed changed-path classification avoids repeated shallow/promisor state probes.
baseline: `BANDIT-016` ended with Local Qwen reporting `land-check.ts` size/complexity and async git state checks as persistent `non_blocking` findings after implementation behavior was accepted.
evaluation_window: Run as the next bootstrap-gap chore after `BANDIT-016` lands.
status: active
outcome: pending

## Cross-Model Tension

Local Qwen accepted the `BANDIT-016` implementation behavior but continued to
return `non_blocking` future-hardening findings. Codex PM accepted the
findings as real workflow debt. The operator directed Codex PM to stop the
rerun loop, land `BANDIT-016`, create a chore for the findings, and run that
chore next.

## Bootstrap Gap Disposition

`BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` is resolved for the bootstrap
Stage 4 evidence-head contract scope.

`BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING` is active as `BANDIT-017` for
the remaining Local Qwen future-hardening findings.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING`.
- `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
