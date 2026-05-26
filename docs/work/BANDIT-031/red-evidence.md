# BANDIT-031 RED Evidence

## Summary

Stage 2 RED evidence is recorded for the Phase 8 Workflow Cockpit Status
Foundation before production implementation. The focused cockpit status tests
define the read-only CLI command surface, source-linked derived status payload,
fail-closed source reconciliation, bootstrap-gap/gate/improvement/coordination
summaries, and the boundary that cockpit output must not create hidden
canonical state.

Production code is intentionally unchanged in this step. The tests fail because
`bandit cockpit` does not exist yet.

## Tests Added

- `test/cockpit-status.test.mjs`
  - Derives a non-canonical workflow snapshot with current phase, active work
    item, next action, required operator input, blockers, and source artifact
    links.
  - Reports bootstrap-gap status, Stage 2 gate status, landing-readiness
    summary, UAT status, improvement health, and coordination state with source
    paths.
  - Fails closed when `docs/roadmap/CURRENT_CONTEXT.md` is missing.
  - Fails closed when `CURRENT_CONTEXT.md` and `ROADMAP.md` disagree on the next
    action.
  - Fails closed when the active work item is marked closed while context still
    treats it as active.
  - Proves the report is derived by checking that no hidden cockpit cache, index,
    status artifact, or event mutation is created.

## Proposed Command Surface

- `bandit cockpit status --json`
  - Read repo-native workflow artifacts and return a deterministic
    `workflow_cockpit_status` payload.
  - Include source artifact paths for every displayed workflow state.
  - Report current phase, active work item, next action, required operator input,
    blockers, bootstrap gaps, gate summaries, landing readiness, UAT status when
    applicable, improvement health, and coordination state when available.
  - Fail closed for missing, contradictory, stale, or malformed required source
    artifacts.
  - Remain read-only and non-canonical; no hidden cockpit state, SQLite, cache,
    generated status file, server memory, UI storage, or event mutation may own
    workflow authority.

## RED Run

Command:

```sh
node --test test/cockpit-status.test.mjs
```

Result: expected failure.

```text
tests 6
pass 0
fail 6
```

Representative failures:

```text
Unknown command: cockpit
Usage: bandit <init|validate|list|show|draft-work|work-item|artifact|route|land-check|land|auto-land-check|qwen-review|review-subject-hash|coderabbit-review|escalated-review|heartbeat|improvements|uat|gaps|coordination>
expected: /Missing cockpit source artifact: docs\/roadmap\/CURRENT_CONTEXT\.md/
actual: 'Unknown command: cockpit\nUsage: bandit <...>\n'
expected: /Cockpit status blocked: CURRENT_CONTEXT\.md and ROADMAP\.md disagree on next action/
actual: 'Unknown command: cockpit\nUsage: bandit <...>\n'
```

The failures prove the slice has not been implemented yet:

- `src/cli.ts` has no `cockpit` command route.
- `src/commands/cockpit.ts` does not exist.
- `src/state/cockpit-status.ts` does not exist.
- No parser reconciles `CURRENT_CONTEXT.md`, `ROADMAP.md`, work-item evidence,
  bootstrap gaps, gate artifacts, improvement metadata, and coordination logs
  into a derived cockpit status payload.
- No fail-closed cockpit status command exists for missing or contradictory
  repo-native workflow evidence.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| The implementation can derive a deterministic cockpit status payload or report from repo-native artifacts and include source artifact paths for every displayed workflow state. | `cockpit status derives a non-canonical workflow snapshot with source links` defines the core payload and source-link contract. |
| The status foundation reports current phase, active work item, next action, required operator input, known blockers, bootstrap-gap status, gate status, landing readiness summary, UAT status when applicable, improvement health, and coordination state when available. | `cockpit status reports bootstrap gaps, gates, improvements, and coordination with sources` defines those report sections against fixture repo artifacts. |
| The implementation refuses missing, contradictory, or stale required source artifacts with clear fail-closed messages instead of hiding gaps or inventing status. | Missing-current-context, current-context-vs-roadmap disagreement, and active-work-closed contradiction tests expect explicit refusal messages. |
| Derived cockpit output is explicitly non-canonical and rebuildable; canonical workflow state remains in repo artifacts mutated only by approved Bandit CLI commands. | The no-hidden-authority test verifies no cockpit cache, SQLite index, generated status file, or events mutation is created by status reporting. |
| Tests cover normal status derivation, missing-source refusal, contradictory next-action or active-work refusal, bootstrap-gap status reporting, gate status source links, improvement health source links, coordination-state reporting, and no hidden write authority. | `test/cockpit-status.test.mjs` contains six focused RED tests covering those paths. |
| No Phase 8 visual UI, state-index persistence, local API/server, scheduler execution, claim lease, work surface reservation, worktree lifecycle, automatic merge/push/deploy, product UAT approval, actor identity policy, PR/CI workflow, or unrelated feature behavior is introduced by this slice. | RED tests exercise only local `cockpit status --json` behavior against temporary repo artifacts and do not require or create UI, server, persistence, scheduler, leases, worktrees, deploy authority, UAT approval, actor identity policy, PR/CI workflow, or unrelated features. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-031` as active, `BANDIT-030` is landed and closed, no bootstrap gaps are open, and Stage 2 RED evidence is the current step before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-031/brief.md` is present with goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the cockpit status derivation, source-link, refusal, and no-hidden-authority contract and fail before production implementation because the command and state helpers are missing. |

## Next Action

Implement the narrow read-only cockpit status foundation in
`src/commands/cockpit.ts`, `src/state/cockpit-status.ts`, and `src/cli.ts` so
the focused RED tests pass. Preserve repo-native artifacts as canonical state,
keep derived reports read-only, fail closed for incomplete or contradictory
evidence, and do not introduce visual UI, server/API mode, state-index
persistence, scheduler execution, claim leases, work surface reservations,
worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval,
actor identity policy, PR/CI workflow, or unrelated feature work.
