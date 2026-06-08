# BANDIT-075 Implementation Evidence

## Status

`pass`

Stage 3 implementation is accepted for the replay-only reviewer calibration chore. Claude-family implementation added the public reviewer-calibration validation command, deterministic scoring, seeded-packet validation, provider-timeout evidence surfacing, and read-only no-live-routing boundaries. Codex PM tightened RED coverage before acceptance; the repaired implementation now passes focused and full verification.

## Implementation Summary

- Added `src/state/reviewer-calibration.ts` as a pure-read validator for `.bandit/policy/reviewer-calibration.json` and its named packet files.
- Added `src/commands/reviewer-calibration.ts` and `src/cli.ts` wiring for `bandit reviewer-calibration validate [--json]`.
- Added `.bandit/policy/reviewer-calibration.json` naming the Test Writer-owned seeded packet `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`.
- Validated replay-only and no-live-routing boundaries, rejected direct Qwen CLI eligibility, required repo-derived failure-mode packets, required blocker/non-issue gold labels, and required policy-named packet and seeded-case schema fields.
- Recorded provider-timeout evidence as calibration evidence without treating absence as a pass or a live routing waiver.
- Preserved Stage 2 ownership: the Stage 3 Writer did not edit tests, seeded packets, RED evidence, acceptance mappings, or coordination state.

## Verification

- `node --test test/reviewer-calibration.test.mjs` - pass, 10 tests passed and 0 failed.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass, `Bandit state is valid.`
- `npm run bandit -- reviewer-calibration validate --json` - pass with packet `BANDIT-075-reviewer-packet-001`, primary metric `blocker_recall`, blocker recall 1, actionable precision 1, useful finding yield 1, false positive rate 0, provider evidence status `provider_timeout`, replay_only true, and no_live_routing true.
- `node ./bin/bandit.mjs role-runs validate BANDIT-075 --json` - pass.
- `node ./bin/bandit.mjs coordination validate BANDIT-075` - pass before implementation_recorded.
- `npm test` - pass, 561 tests passed and 0 failed.
- `git diff --check` - pass.

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | pass | Implementation satisfies the approved reviewer calibration acceptance criteria without approving live reviewer routing, landing policy changes, Trust Verifier authority, or generic benchmark-first scope. |
| Small surface area | pass | Source changes are limited to one validator, one command wrapper, CLI wiring, and one explicit replay-only policy artifact. |
| Simple explicit design | pass | Parsing, boundary assertions, packet assertions, seeded-case schema checks, and deterministic scoring are separated into named functions with explicit policy and packet paths. |
| No hidden authority | pass | Reviewer calibration is a pure-read command and does not mutate live reviewer profiles, landing policy, model routing, gate verdicts, workflow policy, or projection authority. |
| Failure clarity | pass | Missing policy, empty packet lists, missing packet provenance, missing seeded-case fields, direct Qwen CLI routes, and scorecard violations fail closed with named diagnostics. |
| Testability | pass | Focused RED tests cover pass, fail-closed boundary cases, schema cases, direct-Qwen rejection, scoring policy, and read-only behavior; full regression passes. |
| Role boundary | pass | Codex-authored RED routed Stage 3 to Claude-family implementation. Role-run manifest records zero test-surface edits and validates against the implementation-writer contract. |

## Next Action

Proceed to Stage 4 review: CodeRabbit or provider-timeout evidence, Local Qwen through `.bandit/reviewers/local-qwen.json` via `bin/omlx-chat-completions.mjs`, risk classification, supply-chain gate, review-subject hash, aggregate review evidence, and finding dispositions.
