# BANDIT-062 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the work-item creation replacement metadata preservation behavior before production implementation. Existing work-item creation tests still pass, while the new test fails because serializeBootstrapGapLedger drops replacement_gap, replacement_work_item, and replacement_evidence from an unrelated replaced bootstrap gap when linking a different open gap.

## Test Command

```sh
node --test test/work-item-create.test.mjs
```

## Observed Output

```text
TAP version 13
Subtest: work-item create preserves replaced bootstrap gap metadata when linking a gap
not ok 5 - work-item create preserves replaced bootstrap gap metadata when linking a gap
Expected values to be strictly equal:
+ actual - expected
+ undefined
- 'BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION'
tests 9
pass 8
fail 1
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves the current failure mode: creating or Repo PM-creating a work item for one eligible open gap rewrites the ledger and drops replacement_gap, replacement_work_item, or replacement_evidence from an unrelated replaced gap. | test/work-item-create.test.mjs adds a public CLI test that creates a temp repo with one replaced gap carrying replacement_gap, replacement_work_item, and replacement_evidence plus one unrelated open gap. Running bandit work-item create for the open gap rewrites .bandit/bootstrap-gaps.json and the test observes replacement_gap is undefined. |
| The implementation preserves replacement_gap, replacement_work_item, and replacement_evidence for replaced gaps during every work-item creation ledger rewrite. | The RED assertion checks replacement_gap, replacement_work_item, and replacement_evidence after work-item creation. Current code fails on the first field, proving the preservation behavior is missing. |
| The implementation preserves existing validations for replaced gaps, including required replacement metadata and existing replacement evidence paths. | The RED fixture uses an existing replacement work item brief and replacement evidence file, then runs bandit validate after creation. The validate assertion remains unreachable until the serializer preserves the replacement metadata. |
| The implementation preserves existing work-item create safety behavior: malformed specs, occupied output paths, specs outside the repository, and ineligible bootstrap gaps fail closed before writes. | The focused test run shows all eight pre-existing work-item creation tests still pass; the only failure is the newly specified replacement metadata preservation behavior. |
| No projection, generated file, helper, or JSON input becomes canonical workflow state authority; .bandit/bootstrap-gaps.json remains the bootstrap-gap ledger source of truth and CLI commands remain the mutation authority. | The RED test uses the public bandit work-item create CLI and inspects the rewritten .bandit/bootstrap-gaps.json ledger. It does not introduce a new state surface. |
| The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for this work item. | Codex authored this Stage 2 test and acceptance-mapping evidence. Stage 3 must be dispatched to Claude through the bootstrap Process Adapter path with zero authority over test files, test helpers, fixtures, RED evidence, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence. |
| No Work Item PM plan-mode orchestration, Trust Verifier cutover, old gate replacement, role input packet, generated execution packet, Pi/Aperture agent-scope work, claim authority, worktree lifecycle execution, scheduler execution, cockpit UI, dependency or lockfile change, merge/push/deploy behavior, external service integration, or unrelated Phase 8 product work is introduced. | This Stage 2 step adds only one focused work-item creation test plus RED evidence for BANDIT-062. It does not implement unrelated workflow or product surfaces. |

## Next Action

Dispatch Stage 3 implementation for BANDIT-062 to Claude through the bootstrap Process Adapter path. Implement the narrow bootstrap-gap ledger serialization repair needed to make test/work-item-create.test.mjs pass while preserving existing fail-closed work-item create behavior. Keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence artifacts/specs, acceptance mappings, formation evidence, review evidence, landing evidence, retrospective evidence, Work Item PM plan-mode orchestration, Trust Verifier cutover, old gate replacement, role input packets, generated execution packets, Pi/Aperture agent-scope work, claim authority, worktree lifecycle execution, scheduler execution, cockpit UI, dependency or lockfile changes, merge/push/deploy behavior, external service integration, and unrelated Phase 8 product work.
