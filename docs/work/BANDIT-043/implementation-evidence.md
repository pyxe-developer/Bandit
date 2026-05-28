# BANDIT-043 Implementation Evidence

## Status

`pass`

The Coordination Event Log Authority repair is implemented as a repo-native
policy, required template, focused validator, CLI command, init/validate wiring,
and validation-test fixture update. The implementation keeps current-state
views, cockpit status, state indexes, SQLite caches, in-flight registries, and
derived reports as rebuildable non-authoritative projections, while preserving
the future-scoped CAS claim-authority exception without implementing claims.

## Implementation Summary

- Added `src/state/coordination-authority.ts` to validate the coordination
  authority policy, required template fields, release-authorized decision
  evidence, append-only history replay, projection source references, direct
  projection mutation refusal, projection/history disagreement refusal,
  registry-granted claim refusal, `.bandit` claim-authority refusal, and
  actor-event non-authority.
- Added `bandit coordination-authority validate [--json]` and wired the command
  into the CLI.
- Added default init and validation wiring so fresh repos receive
  `.bandit/policy/coordination-authority.json` and
  `docs/templates/coordination-authority.md`, and `bandit validate` fails closed
  if either required surface is missing or malformed.
- Updated the generic template validator and validation tests so the new
  coordination-authority template is part of the repo-native required-template
  contract.
- Kept the committed coordination-authority policy at an empty decision set.
  Configured per-work-item decision evidence is covered by the focused tests,
  while the committed default does not make temporary repos inherit unresolved
  `BANDIT-043` evidence dependencies.
- Kept the repair out of CAS claim operations, claim leases, fencing tokens,
  idempotency-key enforcement, work-surface reservations, Git Mutation
  Serializer behavior, worktree lifecycle, scheduler execution, event-driven
  wakeups, observability traces, state-index persistence, local server/API mode,
  cockpit UI work, PR/CI execution, automatic merge/push/deploy behavior,
  installed global skill edits, paid reviewer routing, live routing changes, and
  another bootstrap-gap chore.

## Verification

- `node --test test/coordination-authority.test.mjs` passed with 10 tests.
- `node --test test/validate.test.mjs` passed with 21 tests after the omitted
  template fixture helper was corrected for templates created by `bandit init`.
- `npm run typecheck` passed.
- `npm test` passed with 329 tests.
- `npm run bandit -- coordination-authority validate --json` passed for the
  committed default policy with no active release-authorized decisions.
- `npm run bandit -- supply-chain-gate validate --json` passed.
- `npm run bandit -- risk-classification validate --json` passed.
- `npm run bandit -- input-quarantine validate --json` passed.
- `npm run bandit -- validate` passed.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | The implementation follows BANDIT-043 Stage 1/2 evidence by adding the coordination authority policy, template, validator, command, init/validate integration, and focused tests only. |
| Small surface area | pass | The production diff is limited to one state validator, one command shim, CLI/init/validate/path/template wiring, and required repo-native policy/template artifacts. |
| Simple design | pass | Validation uses explicit contract fields and direct fail-closed checks instead of a generic projection engine, state index, claim system, or scheduler. |
| Explicit state | pass | Coordination authority policy, template fields, release-authorized decision references, projection source refs, and claim-authority exception status are named repo artifacts. |
| No hidden authority | pass | The validator accepts or rejects explicit artifacts; it does not let UI, caches, cockpit status, registries, or `.bandit` claim files become canonical workflow or writable-claim authority. |
| Failure clarity | pass | Missing policy/template/evidence, source-less projections, direct projection writes, projection/history drift, registry-granted writable claims, `.bandit` claim authority, and actor-event authority overreach fail closed with targeted messages. |
| Testable behavior | pass | Focused tests cover RED/GREEN refusal paths and complete low-risk acceptance output; full repo tests verify shared command, init, template, and validation integration. |
| No role erosion | pass | Codex PM, Test Writer, Writer, CodeRabbit, Local Qwen, and Landing Agent stage boundaries remain unchanged. |

## Next Action

Run Stage 4 review gates for `BANDIT-043`: pre-PR CodeRabbit, Local Qwen,
aggregate review evidence, and Codex PM disposition at the current
`review_subject_hash` before any landing verdict, landing action, retrospective
closeout, next bootstrap-gap chore, or unrelated Phase 8 work.
