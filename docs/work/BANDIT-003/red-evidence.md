# BANDIT-003 RED Evidence

## Status

RED evidence created for `bandit draft-work <feature-prd-path>`.

Production implementation has not started. This evidence belongs to Stage 2:
Test Design And RED Evidence.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating the BANDIT-003
brief and re-applied it before this RED stage. The tests are shaped around
small behavior surfaces, explicit repo-native state, fail-closed errors,
no hidden authority, no partial writes, and readable command flow.

## Stage-Rubric Verdict

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 2 and BANDIT-003 as active work. BANDIT-002 has landing evidence and commit history records it as landed. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-003/brief.md` defines scope, acceptance criteria, test plan, clean-code evidence, expected files, and implementation order. |
| Stage 2: Test Design And RED Evidence | `pass` | `test/draft-work.test.mjs` defines success and refusal behavior before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | Production implementation has not started. |
| Stage 4: Review And Cross-Model Gates | `not_applicable` | Not reached in RED stage. |
| Stage 5: Landing And UAT | `not_applicable` | Not reached in RED stage. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Not reached in RED stage. |

## Test Ownership

`test/draft-work.test.mjs` is Test Writer-owned RED evidence for this slice.
Writer implementation must not weaken these tests without a recorded test
change rationale in BANDIT-003 evidence.

## Acceptance Mapping

| Test | Acceptance Criteria |
|---|---|
| `draft-work creates slice and chore briefs from explicit PRD decomposition` | AC 2, 3, 4, 5, 6, 7, 9, 12, 13, 17, 18 |
| `draft-work creates improvement chores with retrospective-derived metadata` | AC 5, 8, 9, 12, 13, 18 |
| `draft-work fails closed when the PRD path is omitted` | AC 1 |
| `draft-work fails closed when the PRD file is missing` | AC 2, 16 |
| `draft-work fails closed when required Feature PRD sections are missing` | AC 3, 16 |
| `draft-work fails closed when the decomposition block is missing` | AC 4, 16 |
| `draft-work fails closed when multiple decomposition blocks are present` | AC 4, 16 |
| `draft-work fails closed when decomposition JSON is malformed` | AC 4, 16 |
| `draft-work fails closed for unsupported draft item kinds` | AC 5, 16 |
| `draft-work fails closed when required draft item fields are missing` | AC 5, 16 |
| `draft-work fails closed when improvement metadata is incomplete` | AC 8, 16 |
| `draft-work refuses overwrites before writing files` | AC 10, 11, 16 |
| `draft-work validates every planned item before writing any draft` | AC 11, 16 |

## Expected RED Failure

The current CLI supports `init`, `validate`, `list`, and `show`. These tests are
expected to fail because the `draft-work` command has not been wired yet.

Expected failure class:

- `draft-work` success tests fail with `Unknown command: draft-work`.
- `draft-work` refusal tests fail because the command-level usage and validation
  paths do not exist yet.

## Bootstrap Gaps

- CodeRabbit pre-landing loop is unavailable: `bootstrap_gap` for later review.
- Local Qwen adversarial gate is unavailable: `bootstrap_gap` for later review.
- Landing Agent is unavailable: `bootstrap_gap` for later landing verdict.
- UAT artifact is unavailable and not applicable to this infrastructure slice.

## Operator Input Status

No operator-owned input is missing for this RED stage. The repo artifacts already
define the command boundary: draft only from explicit PRD decomposition data and
fail closed instead of inferring product direction.

## RED Verification

Command:

```sh
node --test test/draft-work.test.mjs
```

Result: expected RED failure.

Summary:

- 13 tests ran.
- 0 passed.
- 13 failed.
- Failure class matched the expected missing-implementation state.

Representative failure:

```text
Unknown command: draft-work
Usage: bandit <init|validate|list|show>
```

Interpretation:

The tests are executable and fail because the `draft-work` command does not yet
exist. This is the correct RED state for BANDIT-003. The next action is
production implementation to make these tests pass without weakening the test
contract.
