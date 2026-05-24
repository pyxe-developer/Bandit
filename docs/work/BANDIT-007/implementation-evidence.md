# BANDIT-007 Implementation Evidence

## Status

GREEN implementation completed on 2026-05-24.

Final implementation source head:
`6375436e6be76415bdd9b6493f0f79fd997a1c81`.

## Scope Implemented

- Added `docs/templates/coderabbit-review.md` and template validation.
- Added a repo-native CodeRabbit review evidence parser and validator for
  `docs/work/<ID>/coderabbit-review.md`.
- Added `bandit coderabbit-review <work-item-id>` as a narrow command that
  reports repo-native CodeRabbit evidence and fails closed for missing or
  unknown work items.
- Extended `bandit validate` to validate any present CodeRabbit review
  evidence artifact.
- Extended `bandit land-check <work-item-id>` to require current CodeRabbit
  review evidence whenever aggregate review or landing evidence claims
  `coderabbit_state: pass`.
- Preserved historical bootstrap-gap compatibility for work items that do not
  claim CodeRabbit pass.
- Updated deterministic test fixtures for the expanded template contract.

## Acceptance Criteria Coverage

| Criteria | Evidence |
|---|---|
| AC1-AC2 | `docs/templates/coderabbit-review.md`; template validation now requires it. |
| AC3-AC4 | `src/state/coderabbit-review.ts` parses and validates any present CodeRabbit evidence artifact and checks the containing work item ID. |
| AC5 | `coderabbit_verdict` uses the shared verdict values. |
| AC6 | unresolved `operator_input_status` fails closed through shared operator-input validation. |
| AC7 | `coderabbit_verdict: pass` requires executable evidence. |
| AC8 | unavailable or bootstrap-gap CodeRabbit state requires explicit bootstrap-gap evidence and cannot be treated as pass. |
| AC9-AC12 | `src/commands/coderabbit-review.ts` exposes a deterministic artifact-backed command with usage and unknown-work-item refusal paths. |
| AC13-AC15 | `src/commands/land-check.ts` requires current CodeRabbit evidence for claimed pass state, reports the evidence path/provider, and blocks stale or non-passing evidence. |
| AC16 | historical work items remain valid unless they opt into CodeRabbit evidence or claim CodeRabbit pass. |
| AC17 | implementation is limited to one template, one parser/validator, one narrow command, small validation and `land-check` integration, and focused tests. |
| AC18 | focused and full verification passed before closeout; live CodeRabbit and local Qwen unavailability are recorded as bootstrap gaps, not passes. |

## Verification

| Command | Result |
|---|---|
| `node --test test/coderabbit-state.test.mjs` | `pass` - 9/9 tests. |
| `npm test` | `pass` - 97/97 tests. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - `Bandit state is valid.` |
| `git diff --check` | `pass`. |

## Clean-Code Self-Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | The implementation follows the `BANDIT-007` brief and RED evidence without adding live polling, repair orchestration, UAT, auto-landing, cockpit state, SQLite, or paid reviewer routing. |
| Small surface area | `pass` | The code diff is limited to the CodeRabbit template, evidence parser, narrow command, validation wiring, `land-check` integration, and related tests. |
| Simple design | `pass` | Uses direct Markdown metadata parsing and repo-native artifacts consistent with existing review-gate code. |
| Explicit state | `pass` | CodeRabbit provider, source head, review state, verdict, findings disposition, executable evidence, and bootstrap gaps live in `coderabbit-review.md`. |
| No hidden authority | `pass` | `validate`, `coderabbit-review`, and `land-check` read repo artifacts and Git head; dashboard state, terminal scrollback, chat, and caches do not own readiness. |
| Testable behavior | `pass` | Focused tests cover template validation, evidence validation, command refusal, missing evidence, current evidence reporting, and stale evidence. |
| Readable flow | `pass` | Template validation, artifact parsing, command reporting, and landing consumption are separated into named modules. |
| Locality | `pass` | CodeRabbit behavior is isolated to `src/state/coderabbit-review.ts`, `src/commands/coderabbit-review.ts`, `land-check`, and focused fixtures. |
| Failure clarity | `pass` | Missing, malformed, unsupported, unresolved, unavailable, stale, and non-passing evidence fails closed with clear messages. |
| No role erosion | `pass` | CodeRabbit evidence remains review evidence only; it does not become Writer, Landing Agent, UAT approver, or policy owner. |
| Improvement capture | `pass` | Live integration gaps are recorded as bootstrap gaps; no new actionable workflow lesson needs a separate chore in this slice. |

## Bootstrap Gaps

- Live CodeRabbit API, GitHub API, PR comment polling, repair orchestration, and
  rerun automation remain out of scope.
- The local Qwen route timed out against the committed implementation source
  head and is recorded in `local-qwen-review.md`.
- Escalated adversarial reviewer and final Landing Agent behavior remain
  unavailable.
- UAT is not applicable to this workflow-infrastructure slice.
