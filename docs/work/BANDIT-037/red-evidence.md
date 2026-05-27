# BANDIT-037 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the Workflow Trial decision guardrail contract before
production implementation. They fail because improvement candidate discovery
currently accepts policy-changing Workflow Trial candidates without
predeclared decision criteria, uncertainty or minimum-detectable-effect
context, and a re-evaluation window; candidate reports do not expose guardrail
completeness; and improvement evaluation currently accepts policy-changing
decisions without proxy-risk disposition.

Production implementation code is intentionally unchanged in this step.

## Test Command

```sh
node --test test/improvements.test.mjs
```

## Observed Output

```text
tests 13
pass 8
fail 5

improvements candidates fails closed for workflow trials without decision criteria
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
0 !== 1

improvements candidates fails closed for workflow trials without uncertainty context
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
0 !== 1

improvements candidates fails closed for workflow trials without re-evaluation window
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
0 !== 1

improvements candidates exposes workflow trial guardrail completeness
actual: undefined
expected: workflow_trial_guardrails metadata

improvements evaluate refuses policy-changing decisions without proxy-risk disposition
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
0 !== 1
```

## Tests Added

- `test/improvements.test.mjs`
  - `improvements candidates fails closed for workflow trials without decision criteria`
  - `improvements candidates fails closed for workflow trials without uncertainty context`
  - `improvements candidates fails closed for workflow trials without re-evaluation window`
  - `improvements candidates exposes workflow trial guardrail completeness`
  - `improvements evaluate refuses policy-changing decisions without proxy-risk disposition`

## Acceptance Criteria Mapping

| Criterion | RED evidence |
| --- | --- |
| Improvement metadata contracts require predeclared keep, revise, revert, and double_down decision criteria for Workflow Trial or workflow-policy change candidates. | The missing decision-criteria test expects `improvements candidates` to fail closed for a policy-changing Workflow Trial candidate without `decision_criteria`; the current command exits 0. |
| Improvement metadata contracts require explicit uncertainty or minimum-detectable-effect context and reject policy-change candidates that omit both. | The missing uncertainty-context test omits both `minimum_detectable_effect` and `uncertainty`; the current command exits 0. |
| Improvement metadata contracts require a re-evaluation window before a keep, revise, revert, or double_down decision can be treated as policy-changing. | The missing re-evaluation-window test expects `improvements candidates` to reject a Workflow Trial candidate without `reevaluation_window`; the current command exits 0. |
| Improvement evaluation evidence requires proxy-risk or reward-hacking side-effect disposition before a policy-changing decision is accepted. | The evaluation refusal test marks the decision policy-changing and omits `proxy_risk_disposition`; the current command exits 0. |
| Focused tests prove candidate discovery and evaluation validation fail closed for missing guardrail fields and pass for complete guardrail metadata. | Four new refusal tests define missing-field behavior, and the completeness test defines the expected `workflow_trial_guardrails` report shape for complete metadata. |
| Cockpit or reporting surfaces expose guardrail completeness and uncertainty without presenting metric movement as causal proof. | The completeness test expects the improvements JSON report to expose decision criteria, minimum-detectable-effect context, uncertainty, re-evaluation window, and proxy-risk notes instead of only reporting metric movement. |
| No local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow, live reviewer routing change, paid reviewer route, external service integration, or unrelated Phase 8 work is introduced. | This RED step changes only focused improvement tests, this Stage 2 evidence artifact, and roadmap/current-context routing. It adds no production implementation or broader workflow surface. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, cockpit status, and `land-check BANDIT-036` identify `BANDIT-037` as active, prove the prior slice is landed and closed out, and name Stage 2 RED evidence as the current step before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-037/brief.md` records the bootstrap-gap origin, scope, acceptance criteria, verification plan, expected files, operator-input status, and CLEAN_CODE.md read evidence. |
| Stage 2: Test Design And RED Evidence | `pass` | The focused tests express behavior before production implementation and fail for the expected missing-guardrail reasons. Production implementation code is unchanged. |

## Next Action

Implement the narrow Workflow Trial guardrail repair in improvement candidate
and evaluation validation/reporting so policy-changing Workflow Trial metadata
requires decision criteria, uncertainty or minimum-detectable-effect context,
re-evaluation window, and proxy-risk disposition, and the focused improvement
tests pass. Keep the repair within improvement metadata parsing, validation,
templates, focused reporting surfaces, and necessary context/gap evidence.
