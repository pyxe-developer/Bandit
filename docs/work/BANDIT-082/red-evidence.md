# BANDIT-082 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Test Writer-owned RED tests now express the Work Intake Ledger And Followups
Migration contract before implementation. The current CLI has no `work-intake`
command, no ledger validator, no deterministic list/report path, and no
fail-closed mutation refusal for non-authoritative actors.

## Test Commands

```sh
node --test test/work-intake-ledger.test.mjs
node --test test/work-intake-migration.test.mjs
```

## Observed Output

```text
test/work-intake-ledger.test.mjs: fail 2/2
1. `work-intake validate --json` exits 1 with `Unknown command: work-intake`
   instead of validating a source-preserving, non-claimable
   `.bandit/work-intake-ledger.json` artifact.
2. Invalid ledger diagnostics are unavailable because the command is not routed;
   expected refusal diagnostics cover missing preserved source artifacts, missing
   risk/product-scope status, missing transition history, missing intake
   outcome, claimable proposals, and deprecated `FOLLOWUPS.md` with missing
   valid entries.

test/work-intake-migration.test.mjs: fail 2/2
1. `work-intake list --json` exits 1 with `Unknown command: work-intake`
   instead of returning deterministic proposal order, current outcomes,
   suggested kinds, deferred context, next formation candidate, and read-only
   authority metadata.
2. `work-intake accept WIL-UI-POLISH --actor work_item_pm` exits with unknown
   command instead of refusing mutation outside Repo PM Coordinator or future
   Work Intake Triage Skill authority.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| A Work Intake Ledger artifact exists in a repo-native location and stores current entry state plus transition history without requiring operators to edit ledger files directly. | `test/work-intake-ledger.test.mjs` creates `.bandit/work-intake-ledger.json` and expects `work-intake validate --json` to validate current state, transition history, and read-only authority without mutating sentinel state. |
| The ledger schema captures source artifact paths, source excerpt or source anchor when available, origin date when known, rationale, suggested Work Item type, dependency/ordering edges, scope summary, risk/product-scope status, current intake outcome, and transition history for each imported entry. | `test/work-intake-ledger.test.mjs` validates required metadata and rejects missing source artifacts, risk/product-scope status, intake outcome, and transition history. |
| `FOLLOWUPS.md` open entries are all represented with preserved source metadata and explicit intake outcomes. | The complete ledger fixture includes all six current `FOLLOWUPS.md` entries: UI polish, claim-first triage, repo-wide transition index, coordination primitive triage, PR/CI/CD landing workflow, and installed-copy update path. |
| The Bandit Cockpit UI Polish entry links to `docs/design/workflow-cockpit/bandit-ui-polish-source.md` and remains before the V0 Closeout Claude Code A/B Product-Value Trial in the intake-derived queue. | `test/work-intake-ledger.test.mjs` asserts the UI-polish entry includes both `FOLLOWUPS.md` and the UI-polish source note, and `test/work-intake-migration.test.mjs` asserts deterministic order with UI polish as `next_formation_candidate` and V0 trial in `deferred_context`. |
| `docs/work/BANDIT-022/follow-up-chores.md` candidates are imported or explicitly dispositioned with preserved source work item, source artifacts, lesson, hypothesis, metric, baseline, evaluation window, status, and outcome. | Both RED fixtures include `WIL-B022-HEARTBEAT-NEXT-ACTION-TOKENS` and `WIL-B022-UAT-APPROVAL-TOKENS` with `source_work_item: BANDIT-022`, source artifacts, lesson, hypothesis, metric, baseline, evaluation window, status, and outcome. |
| The V0 Closeout Claude Code A/B Product-Value Trial remains deferred until the imported pre-Claude-bakeoff follow-up/UI-polish entries are formed, blocked on operator-owned input, or explicitly dispositioned. | `test/work-intake-ledger.test.mjs` asserts `WIL-V0-TRIAL` has `intake_outcome: deferred`, `claimable: false`, and dependencies on the six imported pre-Claude-bakeoff entries. |
| Validation fails closed if a migrated entry lacks required source metadata, intake outcome, transition history, scope summary, risk/product-scope status, or preserved source artifact link. | `test/work-intake-ledger.test.mjs` expects diagnostics for missing preserved source artifact, missing risk/product-scope status, missing transition history, and missing intake outcome. |
| Validation fails closed if `FOLLOWUPS.md` is marked deprecated while any open entry lacks a corresponding valid ledger entry and intake outcome. | `test/work-intake-ledger.test.mjs` marks `FOLLOWUPS.md` deprecated and expects a diagnostic for a missing valid `Repo-Wide Transition Index Decision` ledger entry. |
| Listing/reporting behavior can show imported entries in deterministic order with current outcome, suggested kind, source artifacts, and deferred or queued rationale without making them claimable. | `test/work-intake-migration.test.mjs` asserts deterministic order, outcome, suggested kind, `claimable: false`, `next_formation_candidate`, `deferred_context`, and read-only no-allocation metadata. |
| The implementation preserves the role boundary that only Repo PM Coordinator and future Work Intake Triage Skill may mutate intake triage state. | `test/work-intake-migration.test.mjs` expects `work-intake accept ... --actor work_item_pm` to fail closed with mutation-authority and no Work Item allocation diagnostics. |
| Imported proposals do not become claimable Work Items and do not trigger Work Item PM orchestration, RED evidence, implementation, review, scheduler work, claims, worktrees, merge, push, or deploy. | RED fixtures assert `claimable: false` on every entry and validate read-only `no_claim_authority`, `no_work_item_allocation`, `no_scheduler_authority`, and `no_browser_mutation_authority` flags. |

## Next Action

Dispatch Stage 3 implementation for `BANDIT-082` to Claude-family
Implementation Writer. Implement the narrow Work Intake Ledger validation and
listing path without editing Test Writer-owned tests, fixtures, RED evidence,
or acceptance mappings.

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored `test/work-intake-ledger.test.mjs`,
  `test/work-intake-migration.test.mjs`, and this RED evidence.
- RED author model family: `codex`.
- Codex materially edited tests: `true`.
- Acceptance mapping owner: Test Writer.
- Stage 3 test-edit authority: `none`.
- Stage 3 Writer routing: because Codex authored and materially edited RED
  tests, Stage 3 must route to a different model family through the
  Claude-family bootstrap implementation-writer path unless an
  operator-approved policy exception is recorded.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, or retrospective evidence for `BANDIT-082`.
