# BANDIT-006 Implementation Evidence

## Status

GREEN implementation completed on 2026-05-24 in the current working tree.

This implementation is not landed yet. Stage 4 review evidence, Stage 5
landing verdict, landing action evidence, and retrospective closeout still need
to be created before `BANDIT-006` can be considered complete.

## Implemented Scope

- Added `.bandit/reviewers/local-qwen.json` as the repo-native
  `local-qwen-baseline` reviewer profile seed.
- Added `docs/templates/local-qwen-review.md` as the local Qwen review evidence
  artifact template.
- Added local Qwen reviewer profile validation for required fields, supported
  runtime, read-only permissions, JSON output contract, timeout, prompt
  contract, and unavailable-runtime behavior.
- Added local Qwen review evidence parsing and validation for work item ID,
  source head, profile ID, runtime/model, run status, reviewer verdict,
  executable evidence, operator-input status, source drift, and bootstrap gaps.
- Added `bandit qwen-review <work-item-id>` with usage, unknown-work-item,
  missing-profile, unavailable-runtime, nonzero-exit, timeout, inconclusive
  output, and successful fixture evidence paths.
- Extended `bandit validate` to require the seeded local Qwen profile/template
  and validate any present `docs/work/<ID>/local-qwen-review.md` artifacts.
- Extended `bandit land-check <work-item-id>` to consume local Qwen review
  evidence when review or landing evidence claims `local_qwen_state: pass`, and
  to fail closed for stale, blocked, inconclusive, unavailable, or malformed
  local Qwen evidence.
- Updated older test fixtures so otherwise valid temp repositories include the
  new mandatory local Qwen profile and template.

## Acceptance Criteria Coverage

| Criteria | Evidence |
|---|---|
| AC1-AC3 | `.bandit/reviewers/local-qwen.json`, `src/state/reviewer-profiles.ts`, `src/commands/validate.ts`, and `test/local-qwen-review.test.mjs` cover profile seed and fail-closed profile validation. |
| AC4-AC5 | `docs/templates/local-qwen-review.md` and `src/state/local-qwen-review.ts` define and validate the review evidence contract. |
| AC6-AC12 | `src/commands/qwen-review.ts` implements the narrow command, fail-closed runtime/output paths, source-head capture, and repo-native evidence writing. |
| AC13 | `src/commands/land-check.ts` reads current local Qwen review evidence when local Qwen is recorded as `pass` and blocks stale, blocker, or inconclusive local Qwen evidence. |
| AC14 | `test/local-qwen-review.test.mjs` covers profile validation, evidence validation, command usage/refusal paths, fixture pass evidence, stale source head, and `land-check` integration. |
| AC15 | The implementation surface is limited to the profile seed, evidence template, validators, one command, `validate` integration, `land-check` integration, and focused fixtures. |
| AC16 | Focused and full GREEN verification passed. The live local Qwen run and final landing check remain next-step Stage 4/5 evidence, not GREEN implementation evidence. |

## Verification

Commands run:

```sh
node --test test/local-qwen-review.test.mjs
npm test
npm run typecheck
npm run bandit -- validate
git diff --check
```

Results:

- `node --test test/local-qwen-review.test.mjs`: pass, 20/20 tests.
- `npm test`: pass, 85/85 tests.
- `npm run typecheck`: pass.
- `npm run bandit -- validate`: pass, `Bandit state is valid.`
- `git diff --check`: pass.

## Clean-Code Self-Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation follows the `BANDIT-006` brief and RED evidence without adding CodeRabbit automation, paid reviewer routing, UAT, final Landing Agent behavior, cockpit state, SQLite indexing, or automated repair. |
| Small surface area | `pass` | Diff is limited to local Qwen profile/evidence contracts, validators, one command, focused `land-check` integration, and test fixture updates required by the new mandatory profile/template. |
| Simple design | `pass` | Uses direct JSON and Markdown metadata contracts; no schema framework, policy engine, database, generated index, or broad review orchestration was introduced. |
| Explicit state | `pass` | Reviewer profile, source head, verdict, run status, findings disposition, executable evidence, source drift, and bootstrap gaps live in named repo-native artifacts. |
| No hidden authority | `pass` | `qwen-review` writes evidence; `validate` and `land-check` read repo artifacts and Git head. Chat history, terminal scrollback, UI state, model-local memory, and caches do not own review readiness. |
| Testable behavior | `pass` | Focused tests cover validation, command refusal paths, subprocess failure paths, stale evidence, and landing integration without requiring a live model, network, paid key, or operator approval. |
| Readable flow | `pass` | Profile parsing, review evidence parsing, command execution/output interpretation, evidence writing, and landing consumption are separated into named modules. |
| Locality | `pass` | Local Qwen logic stays under `src/state/**`, `src/commands/qwen-review.ts`, and the narrow `land-check` integration. |
| Failure clarity | `pass` | Missing, malformed, unavailable, nonzero, timed out, inconclusive, stale, blocked, unresolved, and missing-evidence paths fail closed with clear messages. |
| No role erosion | `pass` | The local Qwen profile is read-only and produces review evidence only; it does not become Writer, Landing Agent, operator, UAT approver, or hidden product decision maker. |
| Improvement capture | `pass` | No new material workflow lesson requires a separate improvement chore at GREEN stage. |

## Remaining Work Before Landing

- Produce Stage 4 review evidence for `BANDIT-006`, including a current
  local-Qwen review artifact or an explicit bootstrap gap if the configured
  runtime is unavailable.
- Produce Stage 5 landing verdict evidence.
- Run `npm run bandit -- land-check BANDIT-006` at the source head used by the
  review and landing artifacts.
- Record landing action evidence, retrospective, and updated roadmap/current
  context before the next slice begins.
