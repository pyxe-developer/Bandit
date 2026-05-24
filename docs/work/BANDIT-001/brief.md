# BANDIT-001: Repo-Native State And CLI Skeleton

## Status

Implemented; evidence recorded.

## Goal

Create the smallest Bandit CLI and repo-native state contract that lets a repository initialize Bandit, validate Bandit state, list work items, show a work item, and record lifecycle events without relying on chat history or hidden application state.

## Scope

- Add a `bandit` CLI entrypoint using the repository's TypeScript/Node default.
- Implement `bandit init` to create the first repo-native `.bandit/` state files.
- Create `.bandit/config.toml` with work item prefix support.
- Add a lifecycle event JSONL writer for auditable workflow events.
- Implement `bandit validate` for basic config, state, work-item, and event-log validation.
- Implement `bandit list` to list repo-native work items.
- Implement `bandit show <id>` to show one repo-native work item.
- Add focused tests for command behavior, validation, JSONL append behavior, refusal paths, and basic state discovery.
- Record bootstrap gaps honestly in implementation and landing evidence.

## Out Of Scope

- Workflow Cockpit or any web UI.
- SQLite state index.
- PRD-to-work decomposition commands.
- Retrospective-derived chore generation.
- Smell trigger catalog implementation.
- CodeRabbit automation implementation.
- Local Qwen reviewer implementation.
- Landing Agent implementation.
- UAT approval implementation.
- Auto-landing or branch/PR orchestration.
- Porting Sourmash architecture wholesale.

## Acceptance Criteria

1. `bandit init` creates repo-native Bandit state under `.bandit/` and is idempotent for an already initialized repository.
2. `.bandit/config.toml` records the configured work item prefix and any required v0 metadata in a readable, explicit format.
3. A lifecycle event writer appends JSONL events without overwriting previous events.
4. `bandit validate` succeeds for a freshly initialized repository and reports clear failures for missing or malformed required state.
5. `bandit list` reads canonical repo-native work artifacts and prints a stable, deterministic list.
6. `bandit show <id>` reads a canonical work artifact and prints enough detail for another agent to understand the work item without chat context.
7. Commands fail closed with clear messages when required state is absent, malformed, or ambiguous.
8. Tests cover the important success and refusal paths, including initialization, validation, JSONL append behavior, list, and show.
9. No command treats SQLite, UI state, generated indexes, or chat as canonical.
10. The implementation keeps orchestration phases small and readable enough to satisfy `CLEAN_CODE.md`.
11. Bootstrap review and landing evidence records unavailable final gates as `bootstrap_gap`, not `pass`.

## Test Plan

- Start with tests before production implementation where feasible.
- Add CLI tests for:
  - `bandit init` on an empty temporary repository.
  - `bandit init` on an already initialized repository.
  - `bandit validate` on valid initialized state.
  - `bandit validate` with missing config, malformed config, missing event log, and malformed event JSONL.
  - `bandit list` with no work items and with one or more work artifacts.
  - `bandit show <id>` for present, missing, and ambiguous work item IDs.
- Add lower-level tests for:
  - config read/write behavior;
  - event JSONL append behavior;
  - state-root discovery and refusal behavior.
- Record RED evidence before production implementation unless a specific test path is blocked by bootstrap constraints.
- Run the final repository test command and `git diff --check` before any landing verdict.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The acceptance criteria and test plan explicitly cover clean-code evaluability: small surface area, explicit state, no hidden authority, testable behavior, readable flow, locality, failure clarity, role boundaries, and improvement capture.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria. |
| Small surface area | Diff contains only CLI skeleton, repo-native state, tests, and required docs/evidence. |
| Simple design | No UI, database authority, broad framework, or premature agent abstraction. |
| Explicit state | Config, work artifacts, event logs, and validation failures are named and visible. |
| No hidden authority | `.bandit/` and repo work artifacts remain canonical. |
| Testable behavior | Important command and refusal paths have tests or recorded bootstrap gaps. |
| Readable flow | CLI command paths and state transitions are easy to follow. |
| Locality | Related CLI/state logic is grouped; unrelated refactors are excluded. |
| Failure clarity | Missing, malformed, stale, or ambiguous state fails closed with clear messages. |
| No role erosion | Codex PM, test design, implementation, review, and landing evidence stay distinct. |
| Improvement capture | Any lesson becomes a tagged improvement chore or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-001` test design and RED evidence as the next step. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, and escalation plan. |
| Stage 2: Test Design And RED Evidence | `not_applicable` | Next stage; no production implementation should start until test design and RED evidence exist or a bootstrap gap is recorded. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No implementation code in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | CodeRabbit and Qwen gates do not exist in Bandit yet; manual review evidence must be recorded before landing implementation. |
| Stage 5: Landing And UAT | `bootstrap_gap` | Landing Agent and CLI-owned UAT artifacts do not exist yet; this is not a feature UAT step. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Required after the implementation slice completes. |

## Bootstrap Gaps

- Bandit CLI does not exist yet.
- Bandit work-item command does not exist yet.
- Bandit event log does not exist yet.
- Bandit validation command does not exist yet.
- CodeRabbit pre-landing loop is not automated yet.
- Local Qwen adversarial gate is not implemented yet.
- Landing Agent is not implemented yet.
- UAT artifact is not implemented yet.
- Heartbeat chore-agent is not implemented yet.
- Workflow Cockpit is not implemented yet.

These are accepted bootstrap gaps for this work item only if replacement manual evidence is recorded honestly.

## Required Operator Input

None before test design or implementation starts.

Repo artifacts already define the required product direction for this slice: CLI authority first, repo-native `.bandit/` state as canonical, TypeScript/Node as the default implementation, and Qwen/CodeRabbit/Landing Agent work deferred as recorded bootstrap gaps.

## Expected Files

Likely implementation files:

- `package.json`
- `tsconfig.json`
- `src/cli.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/commands/list.ts`
- `src/commands/show.ts`
- `src/state/config.ts`
- `src/state/events.ts`
- `src/state/work-items.ts`
- `src/state/paths.ts`
- `src/state/validation.ts`
- test files under the repository's chosen test directory

Likely repo-native generated or fixture state:

- `.bandit/config.toml`
- `.bandit/events.jsonl`
- `docs/work/**`

The final implementation may adjust these names if the tests and codebase structure make a simpler local pattern obvious, but it must preserve the acceptance criteria and explicit source-of-truth boundaries.

## First Implementation Order

1. Confirm package/test tooling for TypeScript/Node.
2. Write tests for `bandit init` and state-root/config creation.
3. Implement the minimal CLI entrypoint and `init`.
4. Write tests for event JSONL append behavior.
5. Implement the event writer.
6. Write tests for `validate` success and refusal paths.
7. Implement `validate`.
8. Write tests for `list` and `show`.
9. Implement work item discovery, `list`, and `show`.
10. Run focused tests, full test command, and `git diff --check`.
11. Produce implementation evidence, clean-code check, review-gap evidence, landing verdict, retrospective, and updated `CURRENT_CONTEXT.md`.

## Smell Triggers And Escalation Plan

- Hidden canonical state outside repo artifacts: blocker; repair before landing.
- SQLite or cockpit authority introduced in this slice: blocker; out of scope.
- Broad framework or agent abstraction introduced before CLI contract is stable: blocker unless justified by a recorded product decision.
- Weak refusal paths for missing or malformed state: blocker.
- Production implementation before tests or explicit bootstrap gap: blocker.
- Large mixed orchestration functions: blocker or `needs-repair` under `CLEAN_CODE.md`.
- Review gate unavailable without explicit `bootstrap_gap` evidence: blocker until recorded.

Codex PM owns these routing and escalation decisions. No operator input is needed for routine code-safety routing in this slice.
