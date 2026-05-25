# BANDIT-020 RED Evidence

## Status

`pass` for Stage 2 RED evidence on 2026-05-25.

Production implementation has not started. The focused tests define the desired
`bandit work-item create <spec-path>` behavior and fail because the CLI has no
general work-item creation command yet.

## Test Writer Scope

Added `test/work-item-create.test.mjs` before any production code for
`BANDIT-020`. The tests cover the command contract from
`docs/work/BANDIT-020/brief.md`:

- create one slice brief from explicit structured JSON input;
- create one chore brief and one improvement-chore brief;
- append repo-native lifecycle evidence for the created work item;
- link an eligible bootstrap gap to the new active chore while preserving later
  queued gaps;
- fail closed for malformed specs before writing partial files;
- fail closed for occupied output paths before writing partial files;
- fail closed for spec paths outside the repository;
- fail closed for ineligible bootstrap gaps before writing partial files.

## Command

```sh
node --test test/work-item-create.test.mjs
```

## Observed RED Output

```text
tests 8
pass 0
fail 8
```

Representative failures:

```text
Unknown command: work-item
Usage: bandit <init|validate|list|show|draft-work|route|land-check|land|auto-land-check|qwen-review|review-subject-hash|coderabbit-review|escalated-review|uat|gaps>

AssertionError [ERR_ASSERTION]:
1 !== 0
```

Refusal-path tests also fail for the expected RED reason: the CLI rejects the
top-level `work-item` command before it can validate malformed specs, occupied
paths, out-of-repo paths, or bootstrap-gap eligibility.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1: no general CLI-owned work-item creation command exists outside `draft-work` | Focused test run fails with `Unknown command: work-item`. |
| AC2: CLI exposes `bandit work-item create <spec-path>` or equivalent narrow surface | Tests define `bandit work-item create <spec-path>` as the selected narrow surface. |
| AC3: command creates exactly one work item from explicit structured input | Slice, chore, improvement-chore, and bootstrap-gap tests each call the command with one JSON spec path. |
| AC4: supports `slice`, `chore`, and `improvement_chore` required fields | Tests assert required headings and improvement metadata in created briefs. |
| AC5: deterministic ID allocation | Tests create `BANDIT-001` first and expect the next generated brief at `BANDIT-002`. |
| AC6: fail-closed refusal paths before partial writes | Tests cover malformed spec, occupied output path, out-of-repo spec path, and ineligible bootstrap gap. |
| AC7: bootstrap-gap specs link the gap as active chore | Bootstrap-gap test expects `.bandit/bootstrap-gaps.json` to update only the eligible gap. |
| AC8: created work items are readable by list/show/validate | Slice test runs `list`, `show`, and `validate` after creation. |
| AC9: existing behavior continues to pass | Deferred to implementation verification; no production code changed in RED step. |
| AC10: focused tests cover success and refusal paths | `test/work-item-create.test.mjs` covers the requested success and refusal paths. |
| AC11: full verification before landing | Deferred to implementation and closeout stages. |
| AC12: closeout evaluates clean code and stage rubrics | Deferred to Stage 5 landing evidence. |

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `bandit gaps list` route `BANDIT-020` to RED evidence. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-020/brief.md` defines the scope, acceptance criteria, and test plan. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests exist and fail before production implementation because the command is missing. |

## Next Action

Implement the narrow `bandit work-item create <spec-path>` command, parser,
brief rendering, lifecycle event append, and optional bootstrap-gap linking
needed to make `test/work-item-create.test.mjs` pass. Do not broaden into
general artifact creation, heartbeat automation, coordination primitives, or
cockpit work.
