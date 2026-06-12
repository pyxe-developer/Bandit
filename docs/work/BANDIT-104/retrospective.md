# BANDIT-104 Retrospective

contract_version: 1
work_item: BANDIT-104
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-104/landing-action.md
source_checkpoint_commit: dd024e0fecf0af33d7c2b51d56285fa86c6b4542
landing_checkpoint_commit: 8bff78217ee91f7c5e7c7097c151665135ca0628

## Summary

BANDIT-104 closed the active work-execute stage-route advancement bootstrap
gap. `work-execute --json` now derives its route from accepted coordination
state, reports Stage 2 only after `orchestration_plan_recorded`, reports Stage
3 after `red_recorded`, preserves the Work Item PM plan-mode gate, and fails
closed for unsupported or contradictory coordination state.

## What Worked

- Plan-mode orchestration ran before RED evidence and recorded an explicit
  Orchestrator checklist.
- Test Writer-owned RED coverage captured the BANDIT-100 regression shape:
  RED evidence recorded while `work-execute --json` would previously have
  returned stale Stage 2 routing.
- MiniMax-M3 completed Stage 3 source implementation without editing
  Test Writer-owned test surfaces.
- PM acceptance ran the focused route/controller tests, full suite, typecheck,
  Bandit validation, coordination validation, cockpit/session-context checks,
  and diff hygiene.
- CodeRabbit ultimately produced terminal pass evidence with zero findings
  after committed and uncommitted repair-refresh reviews.
- Local Qwen ran through the authorized `.bandit/reviewers/local-qwen.json`
  route after a clean source/evidence checkpoint and returned pass with no
  findings.
- Risk classification, supply-chain gate, aggregate review evidence,
  `land-check`, and local-record landing completed before closeout.

## Friction

- The first CodeRabbit run timed out before terminal evidence, so Stage 4 had
  to block honestly until a later committed CodeRabbit review completed.
- The operator had already committed and pushed the first checkpoint, so the
  correct CodeRabbit subject became a committed review against `aa2de0e`
  rather than an uncommitted diff.
- CodeRabbit findings exposed stale Stage 4 wording in routing docs and stale
  test helper arguments after the implementation had already advanced.
- Local Qwen refused to run against a dirty worktree, requiring an intermediate
  source/evidence commit before authorized Local Qwen review.
- `bandit land --action local-record` created landing action evidence but did
  not append the canonical `landed` coordination transition; Stage 6 still had
  to record that parser-sensitive transition.

## Structured Improvement Mining

| Signal | Finding | Durable disposition |
| --- | --- | --- |
| Regression | `work-execute --json` previously hardcoded Stage 2 after plan mode and ignored later coordination transitions. | keep: route derivation now follows append-only coordination state and has focused tests. |
| Role boundary | Codex-authored RED tests required a different model family for Stage 3. | keep: MiniMax-M3 performed implementation and did not edit test surfaces. |
| Review loop | CodeRabbit timeout evidence cannot substitute for a terminal review result. | keep: timeout was recorded as blocked evidence, then superseded by terminal findings and final zero-finding pass. |
| Evidence freshness | Local Qwen requires clean source-head evidence. | keep: source/evidence checkpoint `dd024e0` was committed before Local Qwen. |
| Parser wording | Stage routing docs can drift from actual coordination state during repair loops. | keep: routing docs now distinguish Stage 3 completion evidence from current Stage 4/5 state. |
| Landing coordination | Local-record landing evidence and coordination `landed` transition remain separate artifacts. | no_action: existing Stage 6 closeout owns the append-only transition and validators accept that pattern. |

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| `work-execute --json` must derive requested stage and next command from accepted coordination state, not from a fixed Stage 2 assumption. | keep | `src/state/work-execute-controller.ts`, `src/state/stage-route-registry.ts`, `test/work-execute-controller.test.mjs`, `test/stage-route-registry.test.mjs` |
| `formation_approved` plus a present plan artifact still cannot advance until `orchestration_plan_recorded` is appended to coordination history. | keep | `src/state/work-execute-controller.ts`, `test/work-execute-controller.test.mjs` |
| Unsupported stage labels and unsupported coordination states should fail closed rather than fabricate a route. | keep | `src/state/work-execute-controller.ts`, `test/work-execute-controller.test.mjs` |
| Stage evidence should separate historical Stage 3 pass status from the current Stage 4/5 workflow state. | keep | `docs/work/BANDIT-104/implementation-evidence.md`, `docs/work/BANDIT-104/writer-report.md`, `docs/work/BANDIT-104/review-evidence.md` |
| CodeRabbit review subject selection must match git reality: committed review for already-committed work, uncommitted review for repair diffs. | keep | `docs/work/BANDIT-104/coderabbit-review.md`, `docs/work/BANDIT-104/coderabbit-finding-disposition.md` |
| `bandit land --action local-record` records landing evidence; Stage 6 still owns canonical `landed` and `closed` coordination transitions. | no_action | `docs/work/BANDIT-104/landing-action.md`, `docs/work/BANDIT-104/coordination-log.jsonl` |

## Verification

- `node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs` - pass, 17/17 tests.
- `npm run typecheck` - pass.
- `npm test` - pass, 661/661 tests.
- `npm run bandit -- validate` - pass before landing evidence commit and before closeout.
- `node ./bin/bandit.mjs coordination validate BANDIT-104` - pass before closeout.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs review-subject-hash BANDIT-104` - pass with hash `747a9de6178a721b5d6317c01f5e9b18a6a2d30ad47a7aa6aba3480df712a69f`.
- `node ./bin/bandit.mjs qwen-review BANDIT-104` - pass through authorized Local Qwen route.
- `node ./bin/bandit.mjs land-check BANDIT-104` - pass before and after the review/landing evidence checkpoint commit.
- `node ./bin/bandit.mjs land BANDIT-104 --action local-record` - pass.
- `git diff --check` - pass before closeout.

## Next Recorded Action

Repo PM should form BANDIT-101 - Typed reviewer adapters with honest
degradation - only after confirming repo artifacts still authorize that slice
and no new open bootstrap gap takes precedence.
