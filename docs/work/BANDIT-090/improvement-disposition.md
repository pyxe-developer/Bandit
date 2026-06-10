# BANDIT-090 Improvement Disposition

contract_version: 1
work_item: BANDIT-090
stage: Stage 6 closeout
source_artifacts:
  - docs/work/BANDIT-090/retrospective.md
  - docs/work/BANDIT-090/qwen-finding-disposition.md
  - docs/work/BANDIT-090/review-evidence.md
  - docs/work/BANDIT-090/landing-verdict.md
  - docs/work/BANDIT-090/landing-action.md
  - docs/prds/BANDIT-PRD-004-005-decomposition.md

## Disposition

No new improvement chore is created by `BANDIT-090`.

## Lessons

| Lesson | Outcome | Durable disposition |
| --- | --- | --- |
| Attribution Join Key validation should be required only when a landing verdict explicitly claims PRD-004 boundary autonomy. | keep | `src/commands/land-check.ts` gates only `notify_and_revert` and `auto_land`; `BANDIT-090` does not expand landing autonomy. |
| `attribution_join_hash` must remain derived lookup data, not workflow authority. | keep | `src/state/attribution-join-key.ts` validates the structured tuple and derives the hash from stable tuple fields. |
| Codex PM source correction after a fallback Writer repair is workflow hygiene risk. | no_action | The correction was narrow, documented, verified, and did not touch Test Writer, reviewer, landing, UAT, retrospective, PRD, package, dependency, or future-slice surfaces. A separate chore is not opened unless this repeats. |
| Native `bandit qwen-review` can miss the full implementation diff when RED and implementation evidence first land in the same source commit. | no_action | Supplemental authorized Local Qwen full-packet review covered the full diff for this slice. PRD-005.3 should consider route packet diff-base hardening when implementing execution controllers; no separate blocking bootstrap gap is opened now. |
| Timed-out fallback Writers can leave partial source edits before repair. | no_action | Final source verification passed after repair and evidence preserves the timeout, repair, and PM review sequence. Open a cleanup chore only if this becomes repeated friction. |
| CodeRabbit provider timeouts remain possible. | no_action | Timeout evidence is recorded as `bootstrap_gap` replacement evidence and Local Qwen completed; no CodeRabbit pass is claimed. |

## Follow-Up Candidate Not Opened

| Candidate | Source | Current disposition | Trigger to reopen |
| --- | --- | --- | --- |
| Qwen review diff-base hardening for accumulated multi-commit or same-commit RED/implementation packets. | `docs/work/BANDIT-090/qwen-finding-disposition.md` and `docs/work/BANDIT-090/local-qwen-full-packet-review.md` | Not opened as a separate chore; fold into PRD-005.3 controller and route-registry design if still relevant when that slice forms. | Reopen as a tagged improvement chore if another native Qwen review misses material source diff coverage before PRD-005.3 lands, or if PRD-005.3 cannot absorb the hardening. |

## Metrics And Baselines

No new metric-bearing improvement chore is opened. Existing validators remain
the baseline:

- `node ./bin/bandit.mjs coordination validate BANDIT-090`
- `node ./bin/bandit.mjs land-check BANDIT-090`
- `node ./bin/bandit.mjs auto-land-check BANDIT-090`
- `node ./bin/bandit.mjs risk-classification validate --json`
- `node ./bin/bandit.mjs supply-chain-gate validate --json`
- `npm run bandit -- validate`

## Next Action

Repo PM should form PRD-004.3 Escape Candidate Workflow as the next
`BANDIT-PRD-004` slice.
