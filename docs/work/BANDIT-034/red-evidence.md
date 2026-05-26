# BANDIT-034 RED Evidence

## Summary

Stage 2 RED evidence is recorded for Cockpit Shell Hardening before production
implementation. The focused tests define the hardening contract for a single
derived guarded-action presentation source and explicit light queue/context
mapping while preserving the cockpit shell's presentation-only, source-linked,
non-canonical authority boundary.

Production code is intentionally unchanged in this step. The new tests fail
because the current `BANDIT-033` implementation still keeps action derivation
inside the render layer and does not expose explicit light queue context on the
view model or shell output.

## Tests Added

- `test/cockpit-view-model.test.mjs`
  - `cockpit view model exposes derived guarded action affordances as one presentation source`
    requires the view model to expose action affordances derived from the
    existing guarded-action helper, preserving disabled/refusal reasons and
    approved CLI command families.
  - `cockpit view model maps light queue context explicitly without becoming a backlog manager`
    requires a source-linked `light_queue_context` object and queue-context
    Attention Category mapping that excludes intake, scheduler, claimability,
    and workstream queue authority.
- `test/cockpit-ui.test.mjs`
  - `cockpit shell renders guarded controls from pre-derived action affordances`
    requires render output to consume pre-derived action affordances instead of
    re-deriving review and landing eligibility from gate/status cues.
  - `cockpit shell renders explicit light queue context without mutation controls`
    requires shell output to render the explicit light queue context with source
    paths, no mutation forms, and no future queue-management authority.

## RED Run

Command:

```sh
node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs
```

Result: expected failure.

```text
tests 12
pass 8
fail 4
```

Representative failures:

```text
cockpit view model exposes derived guarded action affordances as one presentation source
actual: undefined
expected: derived validate/evidence/review/landing/UAT action affordance array

cockpit view model maps light queue context explicitly without becoming a backlog manager
actual: undefined
expected: light_queue_context with source paths and excluded authority

cockpit shell renders guarded controls from pre-derived action affordances
actual: run_review_gate remains disabled from render-local gate logic
expected: run_review_gate follows pre-derived action affordance state

cockpit shell renders explicit light queue context without mutation controls
actual: undefined
expected: queue_context render payload with no mutation forms
```

The failures prove the missing behavior:

- `buildCockpitViewModel` does not yet expose a single derived
  `action_affordances` presentation source.
- `renderCockpitShell` still derives guarded controls locally from gate/status
  cues instead of consuming pre-derived affordances.
- `buildCockpitViewModel` does not yet expose explicit, source-linked light
  queue/context mapping.
- `renderCockpitShell` does not yet render a queue-context section with excluded
  authority and no mutation controls.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Stage 2 RED evidence defines expected guarded action derivation and explicit queue/context mapping behavior before production implementation starts. | The four focused tests define those contracts and fail before implementation. |
| Guarded action affordances have one derived presentation source consumed by render code, reducing duplicate action-eligibility logic while preserving guarded/refusal semantics. | The view-model test requires `action_affordances`; the render test injects a pre-derived review-gate affordance and expects controls to follow it. |
| Queue/context mapping is explicit, deterministic, and source-linked for the current light cockpit shell without inventing future intake ledger, scheduler, claimability, workstream, product UAT, PR/CI, merge, push, deploy, or server/API behavior. | The queue-context tests require explicit source paths and `excluded_authority` entries for intake, scheduler, claimability, and workstream queue behavior. |
| The implementation remains presentation-only and does not mutate repo-native workflow state, create hidden cockpit state, or move source-of-truth authority into UI/render helpers. | The shell queue-context test requires `mutation_forms: []`; existing no-hidden-authority tests remain in the same focused run. |
| Tests cover normal action-affordance derivation, render consumption of derived affordances, explicit queue/context mapping, missing or ambiguous source refusal where applicable, and preservation of no hidden write authority. | The focused RED tests cover derivation, render consumption, explicit mapping, and no mutation authority; existing cockpit tests continue to cover disabled reasons, source links, and no hidden write authority. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-034` as active, `BANDIT-033` is landed and closed out, and Stage 2 RED evidence is the current recorded action before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-034/brief.md` records the improvement origin, scope, acceptance criteria, verification plan, expected files, operator-input status, and CLEAN_CODE.md read evidence. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the guarded-action and light queue/context hardening contract and fail before production implementation because the required view-model and render outputs do not exist yet. Production code is unchanged. |

## Next Action

Implement the focused `BANDIT-034` cockpit shell hardening contract in
`src/state/cockpit-view-model.ts` and `src/cockpit/render.ts` so the focused
RED tests pass. Preserve CLI Authority, source traceability, the
presentation-only/non-canonical cockpit boundary, no mutation forms, and the
explicit exclusion of intake ledger management, scheduler execution,
claimability decisions, workstream queue management, local server/API mode,
state-index persistence, worktree lifecycle, claim leases, work surface
reservations, merge/push/deploy behavior, product UAT approval, actor identity
policy, PR/CI workflow, external service setup, policy changes, business
tradeoffs, cost/risk overrides, and unrelated feature work.
