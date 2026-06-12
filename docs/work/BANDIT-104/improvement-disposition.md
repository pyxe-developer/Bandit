# BANDIT-104 Improvement Disposition

contract_version: 1
work_item: BANDIT-104
stage: Stage 6 Improvement Disposition
status: complete
operator_input_status: none_required

## Durable Decisions

| Source | Decision | Rationale | Evidence |
| --- | --- | --- | --- |
| Coordination-derived work-execute routing | keep | The operator-facing route now follows the latest accepted coordination state and returns Stage 2, Stage 3, or a fail-closed blocker from repo-native evidence. | `src/state/work-execute-controller.ts`, `src/state/stage-route-registry.ts`, `test/work-execute-controller.test.mjs` |
| Work Item PM plan-mode gate | keep | A present `orchestration-plan.md` is not enough to advance formed work; the coordination log must record `orchestration_plan_recorded`. | `src/state/work-execute-controller.ts`, `test/work-execute-controller.test.mjs` |
| Unsupported state fail-closed behavior | keep | Unknown stage labels and unsupported coordination states block with explicit evidence requirements instead of returning stale route guidance. | `src/state/work-execute-controller.ts`, `test/work-execute-controller.test.mjs` |
| Stage evidence reconciliation | keep | Stage 3 artifacts now clarify that their pass verdict is historical implementation evidence while Stage 4/5 artifacts own current review and landing state. | `docs/work/BANDIT-104/implementation-evidence.md`, `docs/work/BANDIT-104/writer-report.md`, `docs/work/BANDIT-104/review-evidence.md` |
| CodeRabbit committed/uncommitted subject discipline | keep | The review record preserves the committed review after the operator committed and pushed, then records uncommitted repair refreshes until final zero-finding pass. | `docs/work/BANDIT-104/coderabbit-review.md`, `docs/work/BANDIT-104/coderabbit-finding-disposition.md` |
| Local Qwen clean-worktree requirement | keep | The authorized Local Qwen route correctly required a clean source/evidence checkpoint before review evidence could be recorded. | `docs/work/BANDIT-104/local-qwen-review.md` |
| Local-record landing transition split | no_action | The landing command writes landing-action evidence; Stage 6 closeout records parser-sensitive `landed` and `closed` coordination transitions. This is current repo pattern, not a new defect in this slice. | `docs/work/BANDIT-104/landing-action.md`, `docs/work/BANDIT-104/coordination-log.jsonl` |

## Bootstrap Gap Disposition

id: BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT
status: resolved
source_metadata:
  work_item: BANDIT-100
  source_stage: Stage 3 routing
  source_artifacts:
    - src/commands/bandit-work-execute.ts
    - src/state/work-execute-controller.ts
    - docs/work/BANDIT-100/coordination-log.jsonl
    - docs/work/BANDIT-100/red-evidence.md
    - docs/roadmap/CURRENT_CONTEXT.md
hypothesis: Deriving `work-execute --json` route from current coordination state will prevent stale stage routing after Work Item PM advances a formed item.
metric: `node ./bin/bandit.mjs work-execute --json` reports a next route that agrees with `node ./bin/bandit.mjs coordination status <ID> --json` for active formed work.
baseline: During BANDIT-100 Stage 2/3 routing, RED evidence and coordination state advanced while `work-execute --json` still returned stale Stage 2 route guidance.
outcome: keep
rationale: BANDIT-104 implemented coordination-derived route selection, preserved the plan-mode gate, added fail-closed unsupported-state handling, and covered formation, plan-recorded, RED-recorded, implementation-recorded, review-recorded, landed, and unsupported state behavior with focused tests.
verification_target: docs/work/BANDIT-104/retrospective.md
next_action: Repo PM should form BANDIT-101 - Typed reviewer adapters with honest degradation - only after confirming repo artifacts still authorize that slice and no new open bootstrap gap takes precedence.

## Chore Decisions

No new improvement chore is opened from BANDIT-104 closeout. The active
bootstrap gap `BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT` is resolved by
this work item. CodeRabbit command selection friction is recorded as a keep
decision because the repair loop now preserves the committed and uncommitted
review subjects in `docs/work/BANDIT-104/coderabbit-review.md`.

## Verification

- `node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs` - pass.
- `npm run typecheck` - pass.
- `npm test` - pass.
- `node ./bin/bandit.mjs qwen-review BANDIT-104` - pass.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs land-check BANDIT-104` - pass.
- `node ./bin/bandit.mjs land BANDIT-104 --action local-record` - pass.
- `npm run bandit -- validate` - pass before closeout.
- `node ./bin/bandit.mjs coordination validate BANDIT-104` - pass before closeout.
- `git diff --check` - pass before closeout.
