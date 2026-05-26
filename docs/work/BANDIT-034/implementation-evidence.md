# BANDIT-034 Implementation Evidence

## Summary

Stage 3 implementation is recorded for Cockpit Shell Hardening. The
implementation consolidates guarded action affordances into the cockpit view
model and exposes explicit light queue context while preserving the
presentation-only, non-canonical Workflow Cockpit boundary.

## Changes

- `src/state/cockpit-view-model.ts` now exposes `action_affordances` by using
  the existing guarded-action derivation helper as the single presentation
  source for cockpit controls.
- `src/state/cockpit-view-model.ts` now exposes `queue_context` as an explicit,
  source-linked light queue summary with excluded authority for intake ledger
  management, scheduler execution, claimability decisions, and workstream queue
  management.
- `src/cockpit/render.ts` now renders controls from pre-derived action
  affordances instead of re-deriving gate and landing eligibility locally.
- `src/cockpit/render.ts` now renders the explicit queue-context payload with
  source paths, excluded authority, and no mutation forms.
- `tsconfig.json` enables TypeScript-extension imports under the existing
  `noEmit` NodeNext setup so the direct Node test runner can execute the
  runtime cockpit action helper import used by the view model.

No local server/API mode, state-index persistence, scheduler execution,
worktree lifecycle, claim lease, work surface reservation, automatic
merge/push/deploy behavior, product UAT approval, actor identity policy,
PR/CI workflow, external service setup, policy change, business tradeoff,
cost/risk override, or unrelated feature behavior was introduced.

## Acceptance Criteria Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Guarded action affordances have one derived presentation source consumed by render code. | `buildCockpitViewModel` exposes `action_affordances` from `deriveCockpitActionAffordances`; `renderCockpitShell` renders controls only from that array. |
| Queue/context mapping is explicit, deterministic, and source-linked for the current light cockpit shell. | `buildLightQueueContext` reports bootstrap-gap, improvement-candidate, and current-context sources with deterministic summary text. |
| The implementation remains presentation-only and non-canonical. | Rendered queue context has `mutation_forms: []`; the view model still reports `writes_repo_artifacts: false`, `approves_uat: false`, and `decides_landing_safety: false`. |
| Tests cover derivation, render consumption, explicit mapping, and no hidden write authority. | Focused cockpit view-model and UI tests now pass, including the four RED tests recorded in Stage 2. |
| Future queue, scheduler, claimability, workstream, server/API, UAT, PR/CI, merge, push, and deploy authority remains out of scope. | Queue context explicitly lists excluded authority and no new command, server, persistence, scheduler, worktree, claim, UAT, PR/CI, merge, push, or deploy behavior was added. |

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | `pass` | The implementation targets only the Stage 2 RED contract for guarded controls and light queue/context mapping. |
| Small surface area | `pass` | The diff is limited to the view model, shell renderer, and the TypeScript setting needed for direct runtime helper import in tests. |
| Simple design | `pass` | Action derivation remains in the existing helper; the render layer maps pre-derived affordances into controls. |
| Explicit state | `pass` | Queue context names its sources and excluded authority instead of implying queue-management capability. |
| No hidden authority | `pass` | The cockpit still writes no repo artifacts, owns no canonical state, approves no UAT, and decides no landing safety. |
| Testable behavior | `pass` | Focused and full repository tests pass. |
| Readable flow | `pass` | The view model owns presentation derivation; the renderer only renders view-model fields. |
| Failure clarity | `pass` | Disabled actions keep their explicit CLI Authority reasons and missing-gate explanations. |
| Improvement capture | `pass` | This work implements the routed `BANDIT-033-COCKPIT-SHELL-HARDENING` improvement chore. |

## Verification

| Command | Result |
| --- | --- |
| `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs` before implementation | expected RED: 8 pass, 4 fail |
| `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs` after implementation | pass: 12 tests |
| `npm test` | pass: 255 tests |
| `npm run typecheck` | pass |
| `npm run bandit -- validate` | pass |
| `npm run bandit -- cockpit status --json` before implementation evidence | pass; derived status reported `BANDIT-034`, Stage 2 pass, Stage 3 missing, no blockers, and no bootstrap gaps |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identified `BANDIT-034` as active and ready for Stage 3 implementation before code changes. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-034/brief.md` records scope, acceptance criteria, verification plan, clean-code evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-034/red-evidence.md` records focused failing tests before production code changed. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused/full tests, typecheck, validation, and cockpit status pass; implementation is source-linked, presentation-only, and non-canonical. |

## Next Action

Run Stage 4 review and cross-model gates for `BANDIT-034`: pre-PR CodeRabbit
review when available, Local Qwen adversarial review, review-subject hash,
Codex PM disposition, and aggregate review evidence. Do not start landing,
product UAT, retrospective closeout, local server/API mode, state-index
persistence, scheduler execution, worktree lifecycle, claim leases, work
surface reservations, actor identity policy, PR/CI workflow, or unrelated work
before current Stage 4 review evidence exists.
