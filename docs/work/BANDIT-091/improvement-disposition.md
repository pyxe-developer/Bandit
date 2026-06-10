# BANDIT-091 Improvement Disposition

contract_version: 1
work_item: BANDIT-091
stage: Stage 6 closeout
source_artifacts:
  - docs/work/BANDIT-091/retrospective.md
  - docs/work/BANDIT-091/stage3-pm-acceptance.md
  - docs/work/BANDIT-091/coderabbit-review.md
  - docs/work/BANDIT-091/local-qwen-review.md
  - docs/work/BANDIT-091/review-evidence.md
  - docs/work/BANDIT-091/landing-verdict.md
  - docs/work/BANDIT-091/landing-action.md
  - docs/prds/BANDIT-PRD-004-005-decomposition.md

## Disposition

No new improvement chore is created by `BANDIT-091`.

## Lessons

| Lesson | Outcome | Durable disposition |
| --- | --- | --- |
| Escape Candidate evidence must remain candidate-level until attribution review confirms an escape. | keep | `src/state/boundary-escape.ts` validates candidate artifacts without moving boundary cells or granting escape-classification authority. |
| Boundary Escape Disposition must make operator-input requirements explicit. | keep | The validator rejects `operator_input_required` without `required_operator_input_status: required`. |
| Ordinary safe-to-land flows must remain unblocked without escape workflow evidence. | keep | Missing optional escape artifacts are skipped and the non-regression test passes. |
| Shared template fixtures can drift when required templates are added. | no_action | `npm test` caught the drift before review; the PM/Test Writer fixture repair is recorded in `stage3-pm-acceptance.md`. Reopen only if this repeats. |
| Landing policy release-authorized registries are required for local-record landing. | no_action | The first landing attempt failed closed, the registries were refreshed, validators reported `BANDIT-091`, and review-subject hash evidence was refreshed before successful landing. |
| CodeRabbit provider timeouts remain possible. | no_action | Timeout evidence is recorded as `bootstrap_gap` replacement evidence and Local Qwen passed; no CodeRabbit pass is claimed. |

## Follow-Up Candidate Not Opened

| Candidate | Source | Current disposition | Trigger to reopen |
| --- | --- | --- | --- |
| Shared required-template fixture generator for temp repos. | `test/routing.test.mjs` fixture drift after adding `escape-candidate.md` and `boundary-escape-disposition.md`. | Not opened as a separate chore; one full-suite-discovered drift was repaired in place. | Reopen as a tagged improvement chore if another required template addition causes fixture drift before review. |
| Landing registry preflight hint before `bandit land`. | First `bandit land BANDIT-091 --action local-record` failed closed on missing risk/supply-chain registry entries. | Not opened as a separate chore because the gate blocked landing and the registries/hash evidence were refreshed. | Reopen if another slice reaches landing with per-work-item evidence present but release-authorized registry entries missing. |

## Metrics And Baselines

No new metric-bearing improvement chore is opened. Existing validators remain
the baseline:

- `node ./bin/bandit.mjs coordination validate BANDIT-091`
- `node ./bin/bandit.mjs land-check BANDIT-091`
- `node ./bin/bandit.mjs auto-land-check BANDIT-091`
- `node ./bin/bandit.mjs risk-classification validate --json`
- `node ./bin/bandit.mjs supply-chain-gate validate --json`
- `npm run bandit -- validate`

## Next Action

Repo PM should form PRD-004.4 Boundary Cell Movement Gate as the next
`BANDIT-PRD-004` slice.
