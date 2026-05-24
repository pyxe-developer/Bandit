# BANDIT-017 Implementation Evidence

## Status

`pass` - implementation is complete for the `BANDIT-017` landing-gate
complexity and git diagnostics hardening step. Review evidence, Local Qwen
review, landing verdict, landing action, retrospective, and gap-ledger closeout
remain required before this chore can land or the next bootstrap-gap chore can
begin.

## Implementation Source Head

Recorded by the focused implementation commit for this step. The exact commit
SHA is reported in the automation result and will be consumed by later review
and landing artifacts.

## Contract Added

`src/state/landing-stage4.ts` now owns the Stage 4 review-source staleness
evaluation and Local Qwen PM-rationale checks that previously lived inside the
`land-check` command. `src/commands/land-check.ts` remains the CLI
orchestration entry point and delegates the Stage 4 details through explicit
inputs and outputs.

`src/state/git.ts` now exposes a per-evaluation cached changed-path reader.
`land-check` uses one cached reader while evaluating CodeRabbit, Local Qwen,
and escalated review evidence, so equivalent missing-base changed-path
failures reuse the same repository-state diagnostics instead of repeating
promisor and shallow-repository probes.

## Code Path Mapping

| Acceptance Criteria | Code Path |
|---|---|
| AC1 | `docs/work/BANDIT-017/red-evidence.md` records the failing repeated-probe test and its expected guard diagnostics. |
| AC2, AC3 | `src/state/landing-stage4.ts` contains Stage 4 stale-evidence evaluation, terminal-disposition path matching, and PM-rationale validation; `src/commands/land-check.ts` delegates to that module while retaining command orchestration. |
| AC4 | `src/state/git.ts` adds `createCachedGitChangedPathsReader`; `evaluateLandingReadiness` creates one reader per landing-readiness evaluation and passes it to each review-source staleness check. |
| AC5 | `test/landing-gates.test.mjs` remains green for terminal disposition-only updates, protected source drift, PM rationale, typed Stage 4 policy patterns, shallow diagnostics, missing changed-path bases, and safe-to-land refusal paths. |
| AC6 | Focused Stage 4 tests, full `npm test`, and `npm run typecheck` passed after implementation. |
| AC7 | This evidence records the `CLEAN_CODE.md` and stage-rubric implementation self-checks. |

## Verification

Focused RED-to-GREEN verification:

```text
node --test --test-name-pattern "land-check reuses git repository state" test/landing-gates.test.mjs
tests 1
pass 1
fail 0
```

Focused Stage 4 regression verification:

```text
node --test --test-name-pattern "land-check (accepts terminal Stage 4|accepts glob Stage 4|keeps blocking when implementation source changes|requires PM rationale|rejects boilerplate PM rationale|accepts concrete PM rationale|accepts concise concrete PM rationale|accepts structured PM rationale|fails closed when review changed paths cannot be resolved|reports shallow repository changed-path failures|reuses git repository state)" test/landing-gates.test.mjs
tests 11
pass 11
fail 0
```

Full implementation checks:

```text
npm run typecheck
pass

npm test
tests 155
pass 155
fail 0
```

## CLEAN_CODE.md Self-Check

| Rubric | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | The change implements the `BANDIT-017` brief without changing Stage 4 evidence-head semantics, live reviewer routing, CodeRabbit provider orchestration, artifact creation, heartbeat, cockpit, or feature UAT scope. |
| Small surface area | `pass` | The diff is limited to the landing-readiness path, one Stage 4 helper module, one git changed-path cache helper, and this evidence/context update. |
| Simple design | `pass` | The implementation uses a per-evaluation cache and focused pure-ish Stage 4 helper functions instead of introducing a new state machine, global cache, or database. |
| Explicit state | `pass` | Review evidence, landing verdicts, Stage 4 policy, and git heads remain the source of truth; no derived cache becomes canonical. |
| No hidden authority | `pass` | The cached reader only avoids duplicate git diagnostics inside one evaluation and does not persist or override repo-native evidence. |
| Testable behavior | `pass` | Focused tests cover the new probe-reuse behavior and existing Stage 4 stale-evidence and PM-rationale behavior remains green. |
| Readable flow | `pass` | `land-check` now reads as orchestration, while Stage 4 path/rationale details live behind named state helpers. |
| Locality | `pass` | Related Stage 4 landing-gate behavior is isolated under `src/state/landing-stage4.ts`; unrelated command and artifact behavior was not refactored. |
| Failure clarity | `pass` | Missing-base, shallow-repository, protected drift, stale evidence, and PM-rationale failures keep their existing fail-closed diagnostics. |
| No role erosion | `pass` | Codex PM owns the technical routing and implementation boundary; product UAT and policy changes remain operator-owned. |
| Improvement capture | `pass` | This chore is itself the recorded follow-up for the prior Local Qwen findings; closeout will evaluate outcome and gap disposition. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused tests and full tests pass, code paths map to acceptance criteria, source-of-truth boundaries are explicit, and the `CLEAN_CODE.md` self-check is recorded above. |
| Stage 4: Review And Cross-Model Gates | `pending` | Review evidence, CodeRabbit or bootstrap replacement evidence, Local Qwen review, and escalated-review disposition remain the next required step. |
| Stage 5: Landing And UAT | `pending` | Landing verdict and landing action evidence remain required. UAT is not required for this non-product chore. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Retrospective and gap-ledger disposition remain required after review and landing. |

## Next Step

Record `BANDIT-017` review and cross-model gate evidence, including Local Qwen
review, before writing a landing verdict or starting any other bootstrap-gap
chore.
