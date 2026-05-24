# BANDIT-012 Implementation Evidence

## Status

Production implementation completed on 2026-05-24.

## Implemented Behavior

- Added a versioned `docs/work/<ID>/uat-approval.md` parser, writer, and
  validator in `src/state/uat-approval.ts`.
- Added `bandit uat approve <work-item-id> --environment <name> --approved-by
  <operator-reference> --notes <approval-notes>` to write CLI-owned UAT
  approval evidence for the current git source head.
- Wired `bandit validate` to reject malformed UAT approval metadata.
- Wired `bandit land-check <work-item-id>` to require current UAT approval
  evidence when review or landing evidence claims `uat_status: pass`.
- Preserved `uat_status: not_applicable` for chores and workflow-infrastructure
  work.
- Kept operator-owned product acceptance explicit: the command records supplied
  operator approval inputs, and agents do not infer approval.

## Verification

```sh
node --test test/landing-gates.test.mjs
npm test
npm run typecheck
npm run bandit -- validate
git diff --check
```

Results:

- `node --test test/landing-gates.test.mjs` passed 25/25 tests.
- `npm test` passed 124/124 tests.
- `npm run typecheck` passed.
- `npm run bandit -- validate` passed.
- `git diff --check` passed.

## Acceptance Criteria Mapping

| Acceptance Criterion | Evidence |
|---|---|
| AC1 | RED evidence in `docs/work/BANDIT-012/red-evidence.md` shows prior `land-check` accepted claimed passing UAT without approval evidence. |
| AC2 | RED evidence shows `bandit uat` was unknown before implementation. |
| AC3 | `src/state/uat-approval.ts` defines the versioned UAT approval contract. |
| AC4 | `src/commands/uat.ts` writes current-head UAT approval artifacts from explicit approval inputs. |
| AC5 | `uat approve` usage and current-git-head refusal paths are implemented; focused tests cover missing approval inputs. |
| AC6 | `bandit validate` now validates UAT approval artifacts and rejects unsupported approval status values. |
| AC7 | `land-check` now requires UAT approval evidence when `uat_status: pass` is claimed. |
| AC8 | `land-check` fails closed when UAT approval source head differs from current git head. |
| AC9 | Existing not-applicable landing-gate behavior remains covered by the focused test suite. |
| AC10 | Missing, stale, malformed, and usage-refusal paths have distinct messages. |
| AC11 | Focused tests cover approval writing, missing inputs, malformed metadata, missing evidence, stale evidence, and current passing evidence. |
| AC12 | Full test suite passed. |
| AC13 | Required implementation verification commands passed. |
| AC14 | Clean-code and stage-rubric closeout remains required before landing verdict. |

## Clean-Code Self-Check

| Rubric Area | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation follows the `BANDIT-012` brief without adding auto-merge, cockpit, live CodeRabbit, or broad Landing Agent behavior. |
| Small surface area | `pass` | Changes are limited to UAT approval state, one CLI command, validation, landing-gate integration, and focused tests. |
| Simple design | `pass` | UAT approval uses the existing metadata parser and artifact-per-work-item pattern. |
| Explicit state | `pass` | Product acceptance is represented by a named repo-native artifact. |
| No hidden authority | `pass` | The CLI records explicit operator approval inputs; no UI, cache, or agent inference owns UAT truth. |
| Testable behavior | `pass` | Tests cover command output, validation, missing evidence, stale evidence, and current evidence. |
| Failure clarity | `pass` | Refusal messages distinguish missing approval artifacts, stale UAT, malformed metadata, and missing command inputs. |

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused and full tests pass; implementation is narrow, explicit, fail-closed, and aligned to the approved brief. |
| Stage 4: Review And Cross-Model Gates | `pending` | Review evidence, local Qwen evidence, and escalated-review disposition still need to be recorded before landing. |
| Stage 5: Landing And UAT | `pending` | Landing verdict and landing action evidence are not yet recorded. UAT is not applicable to this workflow-infrastructure chore. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Retrospective remains required before closeout. |
