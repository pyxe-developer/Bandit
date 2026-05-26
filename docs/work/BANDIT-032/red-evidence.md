# BANDIT-032 RED Evidence

## Summary

Stage 2 RED evidence is recorded for Cockpit Status Coverage Hardening before
production implementation. The focused tests broaden the existing read-only
`bandit cockpit status --json` contract to cover blocker breadth, Stage 0
through Stage 6 gate breadth, next-action agreement hardening, stale-evidence
reporting, source links, and preservation of no hidden cockpit authority.

Production code is intentionally unchanged in this step. The new tests fail
because the current cockpit status foundation still reports an empty blocker
list, only exposes the Stage 2 gate, uses narrow hardcoded next-action topic
matching, and has no explicit stale-evidence summary.

## Tests Added

- `test/cockpit-status.test.mjs`
  - `cockpit status summarizes operator and bootstrap blockers with source links`
    defines source-linked operator-input and bootstrap-gap blocker summaries.
  - `cockpit status reports the core stage gate matrix with source paths`
    defines a Stage 0 through Stage 6 gate matrix from repo-native artifacts.
  - `cockpit status accepts equivalent Stage 2 next-action wording for the same
    work item` defines a non-brittle agreement result for matching work item and
    stage.
  - `cockpit status reports stale review and landing evidence without inventing
    authority` defines stale review, review-subject-hash, and landing-verdict
    reporting from existing evidence markers.

## RED Run

Command:

```sh
node --test test/cockpit-status.test.mjs
```

Result: expected failure.

```text
tests 11
pass 7
fail 4
```

Representative failures:

```text
cockpit status summarizes operator and bootstrap blockers with source links
actual: []
expected: operator_input_required and bootstrap_gap blocker records

cockpit status reports the core stage gate matrix with source paths
actual: { stage_2_red_evidence: { status: 'pass', source: 'docs/work/BANDIT-031/red-evidence.md' } }
expected: Stage 0 through Stage 6 gate records with source paths

cockpit status accepts equivalent Stage 2 next-action wording for the same work item
actual: Cockpit status blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action
expected: exit code 0 and next_action.agreement status pass

cockpit status reports stale review and landing evidence without inventing authority
actual: undefined
expected: stale_evidence records for review evidence, review subject hash, and landing verdict
```

The failures prove the current implementation is still at the narrow
`BANDIT-031` foundation boundary and has not implemented the accepted
`BANDIT-032` hardening contract.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Stage 2 RED evidence defines blocker, gate, next-action agreement, and stale-evidence coverage before production implementation starts. | The four new focused tests define those four coverage areas and fail against the current implementation. |
| Cockpit status output remains read-only, deterministic, source-linked, and explicitly non-canonical. | The stale-evidence test reuses `assertNoHiddenCockpitState`, and all new expected records include source paths to repo-native artifacts. |
| The implementation summarizes broader blocker and gate states from available repo-native artifacts without inventing future workflow behavior. | The blocker test uses only `CURRENT_CONTEXT.md` operator-input text and `.bandit/bootstrap-gaps.json`; the gate test uses existing Stage 0 through Stage 6 artifact presence. |
| Next-action agreement checking is hardened beyond the BANDIT-031 topic heuristic and still fails closed for unresolved contradictions. | The Stage 2 agreement test expects equivalent wording for the same work item and stage to pass instead of relying on the existing hardcoded topic pair. Existing disagreement tests remain in the file. |
| Stale-evidence reporting uses existing Bandit evidence where available instead of introducing hidden authority. | The stale-evidence test reads `source_drift_status` and `review_subject_hash_status` markers from review and landing artifacts. |
| Tests cover normal expanded status derivation, missing or contradictory evidence refusal, stale-evidence reporting, gate and blocker source links, and no hidden write authority. | Existing `BANDIT-031` tests continue to cover normal derivation and refusal paths; the new tests add the hardening scope. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-032` as active and `BANDIT-031` has landing action, retrospective, and improvement routing evidence. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-032/brief.md` records scope, acceptance criteria, verification plan, expected files, operator-input status, and CLEAN_CODE.md read evidence. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the hardening contract and fail against current production code for the expected missing behavior. Production code is unchanged. |

## Next Action

Implement the focused `BANDIT-032` cockpit status hardening in
`src/state/cockpit-status.ts` and, only if needed, `src/commands/cockpit.ts` so
the focused RED tests pass. Preserve the read-only, derived, source-linked, and
non-canonical cockpit boundary. Do not start visual UI, server/API mode,
state-index persistence, scheduler execution, worktree lifecycle, claim leases,
work surface reservations, automatic merge/push/deploy behavior, product UAT
approval, actor identity policy, PR/CI workflow, external service setup, policy
change, business tradeoff, or unrelated feature work.
