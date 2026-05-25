# BANDIT-020 Retrospective

## Outcome

`BANDIT-020` is landed as a bootstrap workflow-infrastructure chore.

The chore resolved `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` by adding
`bandit work-item create <spec-path>`, a CLI-owned path for creating exactly
one repo-native work item from an explicit JSON spec. The command validates
supported slice, chore, and improvement-chore inputs before writes, allocates a
deterministic work-item ID, appends lifecycle evidence, refuses unsafe or
ineligible input, and links eligible bootstrap gaps as active chores.

## What Worked

- The focused RED tests captured the absence of a general work-item creation
  command before implementation.
- The implementation kept the command narrow: it creates a brief and lifecycle
  evidence only, and it does not create RED, implementation, review, landing,
  retrospective, UAT, or arbitrary downstream artifacts.
- The bootstrap-gap link path now has a CLI-owned validation boundary instead
  of relying on manual JSON edits when starting the next gap chore.
- Stage 4 used `review_subject_hash` for the aggregate review evidence, proving
  the `BANDIT-019` freshness repair works for the next real work item.
- Local Qwen returned `pass` with no findings.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Manual work-item creation was ready to become a CLI command once the brief and gap-link shape stabilized. | Durable artifact | `src/commands/work-item-create.ts` now owns explicit-spec work-item creation. |
| Work-item creation should remain narrower than artifact creation. | Durable boundary | The command creates the initial brief and lifecycle event only; later evidence artifacts remain outside this command. |
| Bootstrap-gap activation needs fail-closed ledger checks before writes. | Durable artifact | The command refuses missing, resolved, already linked, or ineligible gaps before creating output. |
| The next queued gap should use the new command rather than another manual brief start. | Next-step decision | `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND` is the next queued gap, and the next run should create its chore through `bandit work-item create <spec-path>`. |

## Improvement Chore

source_work_item: BANDIT-011
source_gap: BANDIT-GAP-WORK-ITEM-CREATE-COMMAND
linked_work_item: BANDIT-020
hypothesis: A narrow `bandit work-item create <spec-path>` command can allocate the next work-item ID, validate required brief fields, create exactly one work-item brief, append lifecycle evidence, and optionally link a bootstrap gap without making chat or manual filesystem edits authoritative.
metric: A new bootstrap-gap chore can be created by CLI from a structured spec with deterministic ID allocation, fail-closed validation, no overwrite behavior, and valid `bandit list`, `bandit show`, `bandit gaps list`, and `bandit validate` output.
baseline: Work items after PRD decomposition were created manually unless `draft-work` could consume a Feature PRD decomposition block.
evaluation_window: `BANDIT-020` closeout and creation of the next open bootstrap-gap chore.
status: resolved
outcome: keep
outcome_evidence:
  - `node --test test/work-item-create.test.mjs` passed 8 focused tests.
  - `npm test` passed 176 tests.
  - `npm run typecheck` passed.
  - `npm run bandit -- validate` passed.
  - `npm run bandit -- gaps list` passed.
  - `npm run bandit -- land-check BANDIT-020` passed.
  - `npm run bandit -- auto-land-check BANDIT-020` passed.
  - `bandit land BANDIT-020 --action local-record` recorded landing action evidence.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-020`.

Local Qwen returned `pass` with no findings. CodeRabbit was unavailable because
this local-record bootstrap chore had no PR context; review evidence records
that as explicit replacement evidence rather than claiming a CodeRabbit pass.

## Bootstrap Gap Disposition

`BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` is resolved.

Future one-off slice, chore, and improvement-chore starts should use
`bandit work-item create <spec-path>` when the work is not being decomposed
from a Feature PRD through `draft-work`.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
