# BANDIT-090 Stage 3 PM Review

contract_version: 1
work_item: BANDIT-090
stage: Stage 3 implementation
reviewed_at: 2026-06-10T05:13:15Z
reviewer: codex_pm
verdict: needs_repair

## Summary

The first MiniMax Stage 3 attempt timed out after producing partial source and
template changes. The focused attribution RED tests, full landing-gates file,
and typecheck pass, but Codex PM does not accept Stage 3 yet because the
implementation and evidence package do not fully satisfy the accepted
`BANDIT-090` brief.

## Passing Evidence

- `node --test --test-name-pattern "Attribution|attribution" test/landing-gates.test.mjs`: pass (`3` pass, `0` fail).
- `node --test test/landing-gates.test.mjs`: pass (`72` pass, `0` fail).
- `npm run typecheck`: pass.

## Repair Blockers

1. Attribution Join Key field validation is under-complete for landing
   artifacts. It validates work item, actor, review-subject hash, evidence
   artifact hash, authorizing boundary cell, and landing autonomy level, but it
   does not reject missing `artifact_kind`, `artifact_path`,
   `role_or_profile`, `touched_surface`, `boundary_prediction_record`,
   `purpose`, or `artifact_state` when the artifact kind is `landing`.
2. Unsupported `artifact_kind` values are not rejected. Stage 3 should accept
   the repo-native contract values in the brief (`landing`, `model_call`,
   `tool_call`, and future `escape`) and fail closed on other values.
3. Landing attribution cross-checks omit `review_subject_hash` and
   `boundary_prediction_record` path consistency with the Boundary Prediction
   Record and landing verdict reference.
4. `land-check` parses optional `attribution_join_key:` from the landing
   verdict but the attribution gate ignores the parsed path and always reads
   the conventional landing attribution path.
5. The `deriveAttributionJoinHash` implementation exists, but its comment
   incorrectly describes a stub returning fixture data. The helper should be
   documented honestly as derived lookup data; Stage 3 does not need to make
   `attribution_join_hash` canonical evidence.
6. The timed-out MiniMax attempt did not produce `writer-report.md` or
   `implementation-evidence.md`, so the Stage 3 evidence package is incomplete.

## Required Repair

Dispatch a bounded Stage 3 repair to a non-Codex fallback writer. Keep the
repair inside:

- `src/state/attribution-join-key.ts`
- `src/commands/land-check.ts`
- `docs/work/BANDIT-090/writer-report.md`
- `docs/work/BANDIT-090/implementation-evidence.md`

The repair must not edit tests, test helpers, fixtures, RED evidence,
acceptance mappings, formation evidence, review evidence, landing evidence,
UAT evidence, retrospective evidence, roadmap/current-context/status files,
intake ledger state, PRDs, package files, lockfiles, dependencies, or
unrelated source.

After repair, Codex PM should rerun focused attribution tests, full
`test/landing-gates.test.mjs`, `npm run typecheck`, `npm run bandit --
validate`, `npm test`, cockpit/session-context checks, coordination
validation, and `git diff --check` before accepting Stage 3.
