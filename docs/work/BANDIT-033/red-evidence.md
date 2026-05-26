# BANDIT-033 RED Evidence

## Summary

Stage 2 RED evidence is recorded for Attention-First Cockpit Visual Shell before
production implementation. The focused tests define the presentation boundary
for mapping derived cockpit status into operator-first Attention Categories,
source confidence cues, guarded CLI-backed actions, evidence drill-down data,
and responsive accessible shell rendering.

Production code is intentionally unchanged in this step. The tests fail because
the production-oriented cockpit presentation modules do not exist yet:
`src/state/cockpit-view-model.ts`, `src/state/cockpit-actions.ts`, and
`src/cockpit/render.ts`.

## Tests Added

- `test/cockpit-view-model.test.mjs`
  - `cockpit view model prioritizes attention categories from operator risk to queue context`
    defines the operator-first Attention Category order.
  - `cockpit view model maps gate, stale, improvement, and evidence source cues without unexplained green state`
    defines source-linked confidence cues, gate-strip status, active work data,
    and evidence drill-down sources.
  - `cockpit guarded actions expose only CLI-backed requests and disabled reasons`
    defines action affordances, disabled reasons, and exclusion of merge, push,
    deploy, and policy override authority.
  - `cockpit presentation data cannot become canonical workflow authority`
    defines the no-hidden-authority guarantees for browser state, fixtures,
    generated UI state, local caches, State Indexes, and component state.
- `test/cockpit-ui.test.mjs`
  - `cockpit shell renders the attention-first home with traceable status and guarded controls`
    defines the first usable shell contract, landmarks, Attention Category
    navigation, primary panel, CLI-backed controls, and source links.
  - `cockpit shell exposes accessible disabled states and keyboard order`
    defines disabled button semantics, reason associations, and keyboard order.
  - `cockpit shell maintains responsive layout constraints without overlap or text clipping`
    defines desktop and mobile layout contracts, text-overflow refusal, source
    path wrapping, touch/control sizes, and no-overlap expectations.
  - `cockpit evidence drilldown shows source paths without mutation forms or hidden state`
    defines source traceability and prevents UI mutation forms from becoming a
    workflow authority path.

## RED Run

Command:

```sh
node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs
```

Result: expected failure.

```text
tests 8
pass 0
fail 8
```

Representative failures:

```text
Cannot find module '/Users/matthewflebbe/Bandit/src/state/cockpit-view-model.ts'
Cannot find module '/Users/matthewflebbe/Bandit/src/state/cockpit-actions.ts'
```

The failures prove the first visual shell has not been implemented yet:

- No view-model mapper converts `workflow_cockpit_status` into
  `attention_first_cockpit_view_model`.
- No action-eligibility helper exposes CLI-backed action requests with disabled
  reasons.
- No cockpit renderer exposes the attention-first shell, accessible disabled
  controls, responsive layout contract, or evidence drill-down surface.
- No UI or presentation module can yet claim workflow authority, approve UAT,
  decide landing safety, or write repo-native workflow artifacts.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Stage 2 RED evidence defines attention-category mapping, cockpit shell rendering, confidence cues, disabled guarded actions, source traceability, responsive behavior, accessibility states, and no-hidden-authority guarantees before production implementation starts. | The two focused test files define those contracts and fail before implementation because the production presentation modules are missing. |
| The first UI surface prioritizes operator-owned input, blocked or stale state, active work and next action, landing/readiness gates, improvement health, and queue/context in approved order. | `cockpit view model prioritizes attention categories from operator risk to queue context` and `cockpit shell renders the attention-first home...` assert that order. |
| Presentation data is derived from typed view-model fixtures or CLI-derived status output; UI components do not read or mutate repo-native artifacts directly. | The fixtures use the existing `workflow_cockpit_status` shape and expect presentation-only output with `authority: presentation_derived_non_canonical`. |
| Every displayed workflow status includes a source, confidence cue, or fail-closed missing/blocked/stale state. | The gate-strip, primary-attention, status-cue, and evidence-drilldown assertions require source paths or confidence cue records. |
| Guarded action affordances expose only approved CLI-backed requests, show unavailable actions as disabled with reasons, and never imply merge, push, deploy, UAT, policy override, or hidden workflow authority. | `cockpit guarded actions expose only CLI-backed requests and disabled reasons` asserts command families, disabled reasons, and exclusion of unsupported authority. |
| Implementation keeps view-model mapping, action eligibility, evidence-detail normalization, and visual components separated. | Tests import the expected surfaces separately from `src/state/cockpit-view-model.ts`, `src/state/cockpit-actions.ts`, and `src/cockpit/render.ts`. |
| Tests cover active work detail, blocked/stale display, landing readiness, improvement health, evidence drill-down data, disabled action reasons, responsive constraints, and no canonical browser/UI state. | The view-model and shell tests cover those areas against one derived status fixture with operator block, missing gates, stale evidence, landing-not-ready state, and pending improvement health. |
| Product UAT remains CLI-owned and required before landing if the slice produces an operator-facing usable UI surface. | The guarded-action tests keep UAT disabled until an operator-facing implementation exists and assert that the presentation layer does not approve UAT. |
| The slice does not choose local server/API mode, state-index persistence, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy, actor identity policy, PR/CI workflow, external service setup, cost/risk approval, policy change, or unrelated feature behavior. | RED tests exercise pure presentation/view-model contracts only; they introduce no server, API, persistence, scheduler, leases, worktrees, deploy authority, identity policy, PR/CI workflow, or external service integration. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-033` as active, `BANDIT-032` is landed and closed out, and Stage 2 RED evidence is the current recorded action before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-033/brief.md` records goal, scope, out of scope, acceptance criteria, test plan, expected files, smell triggers, operator-input status, and CLEAN_CODE.md read evidence. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the visual cockpit shell, attention-first view model, guarded actions, source confidence, responsive behavior, accessibility states, and no-hidden-authority contract and fail before production implementation because the modules are missing. Production code is unchanged. |

## Next Action

Implement the focused `BANDIT-033` visual shell presentation boundary in
`src/state/cockpit-view-model.ts`, `src/state/cockpit-actions.ts`, and
`src/cockpit/render.ts` so the focused RED tests pass. Preserve CLI Authority,
source traceability, accessible disabled guarded actions, responsive text/layout
constraints, and the rule that browser state, fixtures, generated UI state,
local caches, State Indexes, or web components cannot become canonical workflow
state. Do not start local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, claim leases, work surface reservations,
automatic merge/push/deploy behavior, product UAT approval, actor identity
policy, PR/CI workflow, external service setup, policy change, business
tradeoff, cost/risk override, or unrelated feature work.
