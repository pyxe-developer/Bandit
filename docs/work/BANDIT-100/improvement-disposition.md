# BANDIT-100 Improvement Disposition

contract_version: 1
work_item: BANDIT-100
stage: Stage 6 Improvement Disposition
status: complete
operator_input_status: none_required

## Durable Decisions

| Source | Decision | Rationale | Evidence |
| --- | --- | --- | --- |
| Project-profile schema diagnostics | keep | The schema contract rejects malformed objects with field-specific diagnostics and blocks missing `--profile` values before repo initialization. | `src/cli.ts`, `src/state/project-profile.ts`, `test/init.test.mjs` |
| Identity-clean consumer scaffold | keep | Fresh consumer repos initialize under configured project name, work-item prefix, roadmap seed, reviewer declarations, policy tiers, and harness targets without Bandit bootstrap identity leakage. | `src/commands/init.ts`, `src/state/project-profile.ts`, `test/init.test.mjs` |
| Configured PRD prefix parsing | keep | Consumer PRD headers parse under the configured prefix while BANDIT PRD headers remain supported for self-hosting. | `src/commands/draft-work.ts`, `test/draft-work.test.mjs` |
| Profile template guidance | keep | The shipped template gives external agents a structured profile contract without hiding workflow authority in generated scaffold text. | `docs/templates/project-profile.md` |
| CodeRabbit hardcoded path repair | keep | Stage 3 dispatch and evidence docs now use `<REPO_ROOT>` placeholders instead of local absolute repo paths, while raw transcripts remain unmodified audit evidence. | `docs/work/BANDIT-100/coderabbit-finding-disposition.md` |
| CodeRabbit timeout classification | keep | Provider timeout is accepted only as `bootstrap_gap` replacement evidence and no CodeRabbit pass is claimed. | `docs/work/BANDIT-100/coderabbit-review.md`, `docs/work/BANDIT-100/review-evidence.md` |
| Claude timeout fallback | keep | MiniMax-M3 fallback produced writer artifacts and repair evidence after Claude timed out, preserving model-family separation from Codex-authored RED tests. | `docs/work/BANDIT-100/stage3-minimax-dispatch.md`, `docs/work/BANDIT-100/stage3-minimax-repair-dispatch.md` |
| ACME fixture as product-confidence surface | no_action | The approved acceptance criteria required deterministic temp-repo fixture evidence and BANDIT back-compat; a second real consumer repo is useful future product evidence but not required for this slice. | `docs/work/BANDIT-100/brief.md`, `test/init.test.mjs` |
| Local-record landing coordination entry | no_action | `bandit land --action local-record` records landing-action evidence; Stage 6 closeout still owns the parser-sensitive `landed` and `closed` coordination transitions. | `docs/work/BANDIT-100/landing-action.md`, `docs/work/BANDIT-100/coordination-log.jsonl` |

## Queued Bootstrap Gap

id: BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT
status: queued_chore
source_metadata:
  work_item: BANDIT-100
  source_stage: Stage 2 RED
  source_artifacts:
    - src/commands/bandit-work-execute.ts
    - src/state/work-execute-controller.ts
    - docs/work/BANDIT-100/coordination-log.jsonl
    - docs/work/BANDIT-100/red-evidence.md
    - docs/roadmap/CURRENT_CONTEXT.md
hypothesis: Deriving `work-execute --json` route from current coordination state will prevent stale stage routing after Work Item PM advances a formed item.
metric: `node ./bin/bandit.mjs work-execute --json` reports a next route that agrees with `node ./bin/bandit.mjs coordination status <ID> --json` for active formed work.
baseline: During BANDIT-100 Stage 2, RED evidence and coordination state advanced while `work-execute --json` still returned stale Stage 2 route guidance.
evaluation_window: First Work Item PM execution after the queued gap chore lands, plus the next slice that progresses from RED to implementation.
outcome: keep
next_action: Repo PM should form this bounded bootstrap-gap chore before starting `BANDIT-101`.

## Verification

- `node ./bin/bandit.mjs land-check BANDIT-100` - pass before local-record
  landing and again after the review/landing evidence checkpoint commit.
- `node ./bin/bandit.mjs land BANDIT-100 --action local-record` - pass.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `npm run bandit -- validate` - pass after closeout routing sync.
- `node ./bin/bandit.mjs coordination validate BANDIT-100` - pass after
  closeout routing sync.
- `node ./bin/bandit.mjs cockpit status --json` - pass after closeout routing
  sync.
- `node ./bin/bandit.mjs session-context current --json` - pass after closeout
  routing sync.
- `git diff --check` - pass after closeout routing sync.
