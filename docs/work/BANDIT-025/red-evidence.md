# BANDIT-025 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the coordination log foundation contract before production
implementation. They fail because the CLI has no `coordination` command family,
no per-work-item coordination log parser, and no derived status report yet.

Production implementation has not started for `BANDIT-025`.

## Test Writer Scope

Added `test/coordination-log.test.mjs` and
`test/coordination-status.test.mjs` before production code. The tests cover the
command contract from `docs/work/BANDIT-025/brief.md`:

- `bandit coordination validate <work-id>` validates a per-work-item append-only
  `docs/work/<ID>/coordination-log.jsonl` file.
- `bandit coordination status <work-id> --json` derives current state, next
  action, accountable actor, accepted block state, safe trigger points, and
  evidence from accepted step-transition events.
- The shared core state sequence covers slices and chores and separates
  `retrospective_recorded` from `closed`.
- Actor coordination events are schema-valid context but cannot complete
  workflow stages or emit safe trigger points.
- Validation fails closed for malformed JSONL, unknown event types, illegal
  state regressions, and missing evidence references.

The selected command surface is intentionally narrow. It does not introduce work
claim leases, work surface reservations, scheduler execution, heartbeat work
claiming, claim-first worktree creation, cockpit behavior, cross-repo
coordination, merge/push/deploy behavior, product UAT changes, or Phase 7
improvement evaluation behavior.

## Command

```sh
node --test test/coordination-log.test.mjs test/coordination-status.test.mjs
```

## Observed RED Output

```text
tests 9
pass 0
fail 9
```

Representative failures:

```text
Unknown command: coordination
Usage: bandit <init|validate|list|show|draft-work|work-item|artifact|route|land-check|land|auto-land-check|qwen-review|review-subject-hash|coderabbit-review|escalated-review|heartbeat|uat|gaps>

AssertionError [ERR_ASSERTION]:
1 !== 0
```

Refusal-path tests also fail for the expected RED reason: the CLI rejects the
top-level `coordination` command before it can parse coordination logs, validate
event envelopes, detect illegal regressions, reconcile evidence references, or
derive status.

## Acceptance Criteria Mapping

| Criterion | RED Evidence |
| --- | --- |
| A coordination log contract exists for each work item and is explicitly append-only, per-work-item, repo-native, and CLI-authoritative. | Tests define `docs/work/<ID>/coordination-log.jsonl` and require `bandit coordination validate <work-id>` to accept append-only step transitions with evidence references. |
| The shared core state sequence covers both slices and chores and separates retrospective-recorded from closed. | Status tests exercise slice state derivation and chore progression through `retrospective_recorded` and `closed`. |
| Actor coordination events are schema-valid context events but cannot complete workflow stages or emit safe trigger points without an accepted step transition. | `actor coordination events cannot complete workflow stages or emit safe triggers` expects a raw `complete` actor event to leave state at `brief_created` with no safe trigger points. |
| Validation fails closed for malformed logs, unknown event types, invalid state values, missing required event fields, missing evidence references, illegal regressions, and terminal-state contradictions. | Log tests cover malformed JSONL, unknown event types, illegal regressions, and missing evidence references; implementation should add any narrower field and terminal-state checks needed to satisfy this contract. |
| The derived status/report command reads the coordination log and required evidence artifacts to report current state, next action, accountable actor, accepted block state, and safe trigger points. | Status tests expect JSON output containing `current_state`, `next_action`, `accountable_actor`, `accepted_block`, `safe_trigger_points`, and `evidence`. |
| Safe trigger points are emitted only from validated step-transition events and are absent for raw actor coordination events. | Step-transition status includes `implementation_allowed`; actor-event-only status returns an empty safe trigger list. |
| The implementation preserves existing Markdown evidence, landing gates, UAT gates, review evidence, and `.bandit/events.jsonl` behavior while documenting the new authority boundary. | RED tests create Markdown evidence references and require reconciliation rather than replacing evidence artifacts. Existing gates are not touched in the RED step. |
| Tests cover successful status derivation, slice and chore core states, malformed log refusal, missing evidence refusal, actor-event non-authority, accepted block reporting, and safe-trigger derivation. | `test/coordination-log.test.mjs` and `test/coordination-status.test.mjs` cover those categories. |
| No claim leases, scheduler, worktree, cockpit, cross-repo, automatic merge/push/deploy, or Phase 7 improvement engine behavior is introduced by this slice. | RED tests exercise only the `coordination` validate/status command family and local work-item coordination logs. |

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-025` as active and RED evidence as the next action before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-025/brief.md` defines the Phase 6 scope, acceptance criteria, out-of-scope boundaries, clean-code constraints, and test plan. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests exist and fail before production implementation because the coordination command family is missing. |

## Next Action

Implement the narrow coordination log parser, validator, and read-only
`bandit coordination validate/status` command family needed to make
`test/coordination-log.test.mjs` and `test/coordination-status.test.mjs` pass.
Do not broaden into claim leases, scheduler execution, heartbeat work claiming,
worktree lifecycle, cockpit UI, cross-repo coordination, automatic
merge/push/deploy behavior, product UAT changes, or Phase 7 improvement
evaluation behavior.
