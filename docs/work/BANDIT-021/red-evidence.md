# BANDIT-021 RED Evidence

## Status

`pass` for Stage 2 RED evidence on 2026-05-25.

Production implementation has not started. The focused tests define the desired
`bandit artifact create <spec-path>` behavior and fail because the CLI has no
artifact creation command yet.

## Test Writer Scope

Added `test/artifact-create.test.mjs` before any production code for
`BANDIT-021`. The tests cover the command contract from
`docs/work/BANDIT-021/brief.md`:

- create `red_evidence` from explicit structured JSON input;
- create `implementation_evidence` from explicit structured JSON input;
- create `landing_verdict` from explicit structured JSON input;
- create `retrospective` from explicit structured JSON input;
- append repo-native lifecycle evidence for created artifacts;
- fail closed for unsupported artifact kinds before writing partial files;
- fail closed for occupied output paths before overwriting existing evidence;
- fail closed for spec paths outside the repository.

The selected supported artifact families are intentionally narrow for this
chore: RED evidence, implementation evidence, landing verdicts, and
retrospectives. Review-specific artifacts remain governed by their existing
review commands and Stage 4 `review_subject_hash` requirements.

## Command

```sh
node --test test/artifact-create.test.mjs
```

## Observed RED Output

```text
tests 7
pass 0
fail 7
```

Representative failures:

```text
Unknown command: artifact
Usage: bandit <init|validate|list|show|draft-work|work-item|route|land-check|land|auto-land-check|qwen-review|review-subject-hash|coderabbit-review|escalated-review|uat|gaps>

AssertionError [ERR_ASSERTION]:
1 !== 0
```

Refusal-path tests also fail for the expected RED reason: the CLI rejects the
top-level `artifact` command before it can validate unsupported kinds, occupied
paths, or out-of-repo spec paths.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1: chore brief exists and links to the bootstrap gap | `docs/work/BANDIT-021/brief.md` exists and links `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`. |
| AC2: future implementation defines one narrow command surface | Tests define `bandit artifact create <spec-path>` as the selected narrow surface. |
| AC3: command refuses unsupported kinds and unsafe paths before writing | Tests cover unsupported kinds, occupied output paths, and specs outside the repository. |
| AC4: command records lifecycle or evidence state where required | RED evidence and lifecycle assertions expect an `artifact_created` event for created artifacts. |
| AC5: focused tests cover success and refusal paths | `test/artifact-create.test.mjs` covers four success artifact families and three fail-closed paths. |
| AC6: validation and gap listing remain authoritative | Deferred to implementation verification because production code has not changed in the RED step. |
| AC7: no cockpit, heartbeat agent, broad schema framework, or feature work | Tests exercise only CLI-owned artifact creation for named work-item files. |

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `bandit gaps list` route `BANDIT-021` to RED evidence. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-021/brief.md` defines the scope, acceptance criteria, and test plan. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests exist and fail before production implementation because the command is missing. |

## Next Action

Implement the narrow `bandit artifact create <spec-path>` command, parser, safe
path checks, artifact renderers, lifecycle event append, and CLI dispatch needed
to make `test/artifact-create.test.mjs` pass. Do not broaden into review
automation, heartbeat automation, coordination primitives, cockpit work, or
feature work.
