# BANDIT-037 Implementation Evidence

## Status

`pass`

Workflow Trial and workflow-policy improvement decisions now fail closed unless
policy-changing candidates carry predeclared decision criteria, uncertainty or
minimum-detectable-effect context, a re-evaluation window, and proxy-risk
notes. Policy-changing evaluation evidence must compare against the criteria,
record a re-evaluation window, and disposition proxy-risk or reward-hacking
side effects before a keep, revise, revert, or double_down decision can be
accepted.

## Implementation Summary

- Added Workflow Trial guardrail parsing, reporting, and fail-closed validation to `src/state/improvements.ts`.
- Extended `improvements candidates --json` to expose `workflow_trial_guardrails` for policy-changing candidates while keeping the report derived and non-canonical.
- Extended `improvements evaluate` validation so policy-changing decisions require criteria comparison, re-evaluation window, and proxy-risk disposition.
- Preserved optional guardrail fields when `draft-work` and `work-item create` render improvement-chore metadata.
- Added `docs/templates/improvement-evaluation.md` and updated improvement-chore/schema docs plus template validation fixtures for the guardrail fields.

## Verification

- `node --test test/improvements.test.mjs` passed with 13 tests.
- `node --test test/validate.test.mjs` passed with 19 tests.
- `node --test test/templates.test.mjs` passed with 1 test.
- `node --test test/landing-gates.test.mjs` passed with 65 tests.
- `node --test test/routing.test.mjs` passed with 11 tests.
- `npm test` passed with 267 tests.
- `npm run typecheck` passed.
- `npm run bandit -- validate` passed.
- `npm run bandit -- gaps list` passed and still shows `BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` active for `BANDIT-037`.
- `node ./bin/bandit.mjs cockpit status --json` passed.
- `npm run bandit -- improvements candidates --json` passed.
- `git diff --check` passed.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation enforces the Stage 1/2 guardrail contract without changing the broader improvement-loop policy. |
| Small surface area | pass | Source edits are limited to improvement metadata validation/reporting, improvement metadata rendering, template contracts, and focused tests/docs. |
| Explicit state | pass | Guardrail fields remain explicit repo-native Markdown metadata; no hidden improvement index, cache, or cockpit authority was added. |
| Failure clarity | pass | Missing policy guardrails produce field-specific fail-closed errors before candidate reports or evaluation decisions are accepted. |
| Testable behavior | pass | Focused tests cover missing decision criteria, missing uncertainty/MDE context, missing re-evaluation window, report completeness, and missing proxy-risk disposition. |
| Role boundaries | pass | This stage records implementation evidence only; Stage 4 review, landing, retrospective, and bootstrap-gap resolution remain future gates. |

## Next Action

Run Stage 4 pre-PR CodeRabbit review for `BANDIT-037` at the current review
subject before Local Qwen, aggregate review evidence, landing, retrospective,
or unrelated Phase 8 work.
