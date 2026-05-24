# BANDIT-016 Implementation Evidence

## Status

`pass` - implementation is complete for the narrow Stage 4 evidence-head
contract. Review, landing verdict, landing action, retrospective, and
gap-ledger closeout remain required before `BANDIT-016` can land or the next
bootstrap-gap chore can begin.

## Implementation Source Head

Recorded by the focused implementation commit for this step. The exact commit
SHA is reported in the automation result and will be consumed by later review
and landing artifacts.

## Contract Added

`.bandit/policy/stage4-evidence-head.json` defines the repo-native Stage 4
evidence-head contract:

- `docs/work/<work_item_id>/`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `.bandit/bootstrap-gaps.json`

Changes limited to those paths after accepted review evidence may be treated as
terminal disposition-only Stage 4 updates. Changes outside those paths remain
source drift and fail closed.

## Code Path Mapping

| Acceptance Criteria | Code Path |
|---|---|
| AC2, AC4, AC6 | `src/state/stage4-evidence-head-policy.ts` defines and validates the terminal disposition-only path contract. `src/commands/init.ts` writes the default policy for initialized repos. |
| AC3, AC7 | `src/commands/land-check.ts` compares changed paths between each review artifact source head and the current head. Any path outside the policy remains stale source evidence. |
| AC5 | `src/commands/land-check.ts` now consumes the Stage 4 policy when evaluating CodeRabbit, Local Qwen, and escalated-review evidence freshness. |
| AC8 | `src/commands/land-check.ts` requires concrete PM rationale when Local Qwen findings are present in a claimed passing gate. |
| AC10 | `test/landing-gates.test.mjs` covers terminal disposition-only updates, source drift after review, missing Local Qwen PM rationale, and `land-check` integration. |

## Verification

Focused verification:

```text
node --test test/landing-gates.test.mjs
tests 41
pass 41
fail 0
```

Additional implementation checks:

```text
npm run typecheck
pass

npm run bandit -- validate
pass
```

Full verification completed before review closeout:

```text
node --test test/landing-gates.test.mjs
tests 41
pass 41
fail 0

npm test
tests 147
pass 147
fail 0

npm run typecheck
pass

npm run bandit -- validate
pass

npm run bandit -- land-check BANDIT-016
expected blocker - Missing review evidence artifact: docs/work/BANDIT-016/review-evidence.md
```

## CLEAN_CODE.md Self-Check

| Rubric | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | The change implements the `BANDIT-016` Stage 4 evidence-head semantics without widening live reviewer, artifact creation, heartbeat, cockpit, or feature scope. |
| Small surface area | `pass` | The diff is limited to the landing-readiness path, git helper, Stage 4 policy artifact, init/validate wiring, and implementation evidence. |
| Simple design | `pass` | The logic uses changed-path comparison against a small explicit policy rather than introducing a new state machine or database. |
| Explicit state | `pass` | The durable contract lives in `.bandit/policy/stage4-evidence-head.json`; landing readiness consumes that policy directly. |
| No hidden authority | `pass` | Git history and repo-native policy remain authoritative. Chat or reviewer prose does not determine source freshness. |
| Testable behavior | `pass` | Focused tests cover both terminal disposition-only acceptance and protected source drift refusal. |
| Failure clarity | `pass` | Unknown git diffs and protected-path changes fail closed as stale review evidence. Missing Local Qwen rationale reports a concrete PM-rationale error. |
| Locality | `pass` | Related source-drift behavior remains in `land-check`; policy parsing is isolated under `src/state/`. |
| Role boundaries | `pass` | Codex PM can record technical rationale for reviewer findings; product UAT, policy changes beyond this brief, business tradeoffs, and cost/risk overrides remain operator-owned. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused tests pass, code paths map to acceptance criteria, source-of-truth boundaries are explicit, and `CLEAN_CODE.md` was evaluated above. |
| Stage 4: Review And Cross-Model Gates | `pending` | CodeRabbit evidence and escalated-review bootstrap disposition are recorded. Local Qwen review and aggregate review evidence remain required next. |
| Stage 5: Landing And UAT | `pending` | Landing verdict and landing action evidence remain required. UAT is not required for this non-product chore. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Retrospective and gap-ledger disposition remain required after review and landing. |

## Next Step

Run `npm run bandit -- qwen-review BANDIT-016` from a clean worktree, then
record aggregate review evidence from the Local Qwen result. Do not create
another gap chore or begin unrelated Phase 6, Phase 7, Phase 8, Phase 9,
cockpit, heartbeat, or feature work.
