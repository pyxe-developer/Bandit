# BANDIT-020 Implementation Evidence

## Status

`pass` for Stage 3 implementation evidence on 2026-05-25.

`bandit work-item create <spec-path>` is implemented as a narrow CLI-owned
work-item creation command. It creates exactly one work-item brief from an
explicit JSON spec, appends lifecycle evidence, and can link an eligible open
bootstrap gap to the created active chore.

## Implementation Summary

- Added `src/commands/work-item-create.ts`.
- Routed `bandit work-item create <spec-path>` through `src/cli.ts`.
- Validated required `slice`, `chore`, and `improvement_chore` fields before
  writing any work-item files.
- Allocated the lowest available work-item ID from existing
  `docs/work/<ID>/` directories and the configured work-item prefix.
- Refused out-of-repo spec paths, malformed specs, unsupported kinds, missing
  config, occupied output paths, and ineligible bootstrap gaps before writing
  new work-item output.
- Rendered created work-item briefs with the existing ID-bearing H1 and
  `## Status` shape used by `list`, `show`, and `validate`.
- Appended a repo-native `work_item_created` lifecycle event.
- Updated `.bandit/bootstrap-gaps.json` only when the spec names an eligible
  open bootstrap gap.
- Corrected the focused test helper to treat `ENOTDIR` as path absence when an
  occupied output path is intentionally a file.

## Acceptance Criteria Mapping

| Acceptance Criteria | Evidence |
|---|---|
| AC2-AC4: narrow command creates one explicit work item for supported kinds | `test/work-item-create.test.mjs` passes for slice, chore, and improvement-chore creation. |
| AC5: deterministic ID allocation | Focused tests pass for baseline work-item directories and occupied target paths. |
| AC6: fail-closed validation | Focused tests pass for malformed spec, occupied output path, out-of-repo path, and ineligible bootstrap gap refusals. |
| AC7: bootstrap-gap linking | Focused bootstrap-gap test confirms only the eligible named gap becomes active and linked. |
| AC8: created work items are readable | Focused slice test runs `list`, `show`, and `validate` after creation. |
| AC9: existing behavior continues | `npm test`, `npm run typecheck`, and `npm run bandit -- validate` pass. |
| AC10: focused success and refusal coverage | `node --test test/work-item-create.test.mjs` passes. |

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | The command implements the approved `BANDIT-020` surface only. |
| Small surface area | `pass` | Changes are limited to the new command, CLI dispatch, focused test helper, evidence, and context artifacts. |
| Simple design | `pass` | The command uses explicit parse, validate, plan, assert-free, write, and event steps. |
| Explicit state | `pass` | Work-item files, lifecycle events, and optional bootstrap-gap ledger updates remain repo-native. |
| No hidden authority | `pass` | No UI, cache, chat state, or generated index becomes canonical. |
| Testable behavior | `pass` | Focused tests cover success, ID allocation, lifecycle evidence, gap linking, and refusal paths. |
| Readable flow | `pass` | Validation happens before writes, and refusal messages name the blocked condition. |
| Locality | `pass` | Existing `draft-work`, landing, UAT, review, and hash behavior are not broadened. |
| Failure clarity | `pass` | Invalid paths, malformed specs, occupied output, missing state, and ineligible gaps fail closed. |
| No role erosion | `pass` | The command creates briefs only; it does not create RED, review, landing, retrospective, or UAT evidence. |
| Improvement capture | `not_applicable` | No new workflow lesson requires a follow-up chore from this implementation step. |

## Verification Run

```sh
node --test test/work-item-create.test.mjs
npm run typecheck
npm test
npm run bandit -- validate
npm run bandit -- gaps list
```

Results:

- `node --test test/work-item-create.test.mjs`: 8 tests passed.
- `npm run typecheck`: passed.
- `npm test`: 176 tests passed.
- `npm run bandit -- validate`: passed.
- `npm run bandit -- gaps list`: passed and still reports
  `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` as active `BANDIT-020`.

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `.bandit/bootstrap-gaps.json` identify `BANDIT-020` as active. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-020/brief.md` defines the implementation contract. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-020/red-evidence.md` records the focused RED test failures. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused and full verification passed; clean-code self-check is recorded above. |
| Stage 4: Review And Cross-Model Gates | `pending` | Next required action is review evidence with `review_subject_hash`. |

## Next Action

Record Stage 4 review evidence for `BANDIT-020`, including current
`review_subject_hash`, Local Qwen evidence, CodeRabbit or explicit bootstrap
replacement evidence if no PR-backed live CodeRabbit route is available, and
PM disposition of any actionable findings.
