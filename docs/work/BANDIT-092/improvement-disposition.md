# BANDIT-092 Improvement Disposition

contract_version: 1
work_item: BANDIT-092
stage: Stage 6 closeout
source_artifacts:
  - docs/work/BANDIT-092/retrospective.md
  - docs/work/BANDIT-092/stage3-pm-review.md
  - docs/work/BANDIT-092/coderabbit-review.md
  - docs/work/BANDIT-092/local-qwen-review.md
  - docs/work/BANDIT-092/qwen-finding-disposition.md
  - docs/work/BANDIT-092/review-evidence.md
  - docs/work/BANDIT-092/landing-verdict.md
  - docs/work/BANDIT-092/landing-action.md
  - docs/prds/BANDIT-PRD-004-005-decomposition.md

## Disposition

No new improvement chore is created by `BANDIT-092`.

## Lessons

| Lesson | Outcome | Durable disposition |
| --- | --- | --- |
| Boundary Cell Movement evidence must remain evidentiary, not movement authority. | keep | `src/state/boundary-cell-movement.ts` validates optional artifacts without moving boundary cells or granting landing autonomy. |
| Expansion evidence requires Workflow Trial guardrails and cannot rely on zero escapes alone. | keep | Focused RED/GREEN coverage and validator diagnostics enforce both constraints. |
| Confirmed escapes require contraction evidence before autonomy claims proceed. | keep | `src/commands/land-check.ts` enforces contraction evidence when boundary autonomy is claimed after confirmed escape disposition. |
| Local Qwen endpoint repair was necessary reviewer tooling, not product-scope expansion. | no_action | `docs/work/BANDIT-092/qwen-finding-disposition.md` records the accepted non-blocking disposition and Stage 6 routing. |
| Historical blocked coordination transitions should be closed forward. | no_action | `coordination-log.jsonl` preserves the blocked event and records later `review_recorded`, `landed`, and `closed` transitions. |
| CodeRabbit refresh timeouts remain possible. | no_action | `docs/work/BANDIT-092/coderabbit-review.md` records provider-timeout replacement evidence and no pass claim. |

## Follow-Up Candidate Not Opened

| Candidate | Source | Current disposition | Trigger to reopen |
| --- | --- | --- | --- |
| Local reviewer endpoint drift preflight before Qwen review. | Local Qwen endpoint moved from 8000 to 8001 and the first Stage 4 review blocked. | Not opened as a separate chore because the tooling references were updated, smoke-tested, and validated in this slice. | Reopen if endpoint drift recurs or blocks another required review after this repair. |
| CodeRabbit refresh timeout hardening. | CodeRabbit timed out after the required 600-second Stage 4 refresh. | Not opened as a separate chore because timeout replacement evidence is an accepted bootstrap path and Local Qwen completed. | Reopen if CodeRabbit timeout becomes a repeated blocker or prevents landing without replacement evidence. |

## Metrics And Baselines

No new metric-bearing improvement chore is opened. Existing validators remain
the baseline:

- `node ./bin/bandit.mjs coordination validate BANDIT-092`
- `node ./bin/bandit.mjs land-check BANDIT-092`
- `node ./bin/bandit.mjs auto-land-check BANDIT-092`
- `node ./bin/bandit.mjs risk-classification validate --json`
- `node ./bin/bandit.mjs supply-chain-gate validate --json`
- `npm run bandit -- validate`

## Next Action

Repo PM should form PRD-005.1 Roadmap Work Target Resolver as the first
`BANDIT-PRD-005` slice.
