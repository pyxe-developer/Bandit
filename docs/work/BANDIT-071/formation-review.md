# Aggregate Formation Review - BANDIT-071

contract_version: 1
work_item: BANDIT-071
reviewer: codex_pm
review_type: aggregate_formation_review
verdict: pass
findings_status: non_blocking
findings_disposition: Local Qwen MLX adapter passed with no findings; CodeRabbit timed out and is accepted only as provider-timeout replacement evidence; deterministic Repo PM inspection found no Stage 1 formation blockers
source_head: 4f98bd1
reviewed_at: 2026-06-07T22:29:28Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is `.bandit/reviewers/local-qwen.json`
through `node bin/omlx-chat-completions.mjs` against the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`.

## Scope Check

- work_type present and correct: pass - the brief records `work_type: chore` and defines the bounded Private Installable Distribution And Update Notification Channel.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL`, source spec, roadmap/current context, `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the chore is limited to private installability, package metadata/runtime fixes, update metadata, update-check command wiring, docs, focused tests, and install smoke evidence.
- acceptance criteria are verifiable: pass - criteria name the private distribution contract, package install behavior, package contents, runtime dependency boundary, update-check states, alert behavior, cache behavior, data-minimal metadata, update docs, verification evidence, and closeout.
- out-of-scope boundaries explicit: pass - public npm publishing, paid private registry setup, automatic self-update, telemetry, external service setup, Trust Verifier cutover, old-gate replacement/wrapping, UAT changes, merge/push/deploy authority, guarded browser actions, and unrelated cockpit/product scope are excluded.
- operator input status recorded: pass - no operator-owned input is needed for Stage 1 formation; public publishing, paid registry/external service setup, business/cost tradeoffs, automatic self-update, UAT, Trust Verifier cutover, merge/push/deploy, and ambiguous scope remain halt conditions.
- role boundary evidence present: pass - Repo PM, Work Item PM, Test Writer, Implementation Writer, reviewers, Landing Agent, and Closeout Agent boundaries are named.
- write-surface families declared: pass - expected files cover the source spec, work package, package metadata, CLI entrypoint, update-check command, update-channel state, policy/template/docs, focused tests, bootstrap gaps, events, and roadmap/status updates.
- Test Writer boundary explicit: pass - Stage 2 tests, helpers, fixtures, packed-install smoke-test fixtures, package allow-list acceptance mappings, update-channel acceptance mappings, and RED evidence are Test Writer-owned.
- Implementation Writer boundary explicit: pass - Stage 3 source implementation is routed to Claude if Codex authors RED evidence and has no test-surface authority.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable before landing.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists, formation review artifacts are recorded, and Work Item PM execution remains blocked until `formation_approved`.
- Bootstrap gap queue respected: pass - `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is active and linked to `BANDIT-071`; `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` remains queued behind it.
- Local Qwen route preserved: pass - Local Qwen is restricted to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.
- Permanent Test Ownership Boundary preserved: pass - the Stage 3 Writer cannot edit tests, helpers, fixtures, RED evidence, install-smoke evidence, package allow-list acceptance mappings, update-channel acceptance mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.

## Formation Evidence

- `docs/work/BANDIT-071/qwen-formation-review.md` - `pass` through the MLX OpenAI-compatible adapter with no findings.
- `docs/work/BANDIT-071/coderabbit-formation-review.md` - `bootstrap_gap`; CodeRabbit provider timeout after setup/analyzing; no CodeRabbit pass claimed.
- `docs/work/BANDIT-071/brief.md` - Stage 1 brief with non-product work, source provenance, scope, out-of-scope, acceptance criteria, verification plan, `CLEAN_CODE.md` read evidence, bootstrap-gap disposition, expected files, required evidence, role boundaries, stage capability scope, token-cost failsafe, first implementation order, smell triggers, forbidden actions, Local Qwen route restriction, and operator-input status.
- `docs/work/BANDIT-071/coordination-log.jsonl` - initial `brief_created` transition with `formation_required`; `formation_approved` has not been recorded yet.

## Findings

### CodeRabbit Provider Timeout

verdict: bootstrap_gap

Disposition: accepted only as provider-timeout replacement evidence. CodeRabbit
reached setup/analyzing but did not return a terminal review before bounded
timeout; no CodeRabbit pass is claimed.

### Direct Qwen CLI Route Revoked

verdict: pass

Disposition: current formation evidence uses only the MLX OpenAI-compatible
adapter route. Direct `qwen` CLI is not an authorized Bandit reviewer path.

## Summary

`BANDIT-071` has adequate Stage 1 formation evidence to proceed. The brief is
narrow, source-backed, verifiable, clean-code/rubric evaluable, and preserves
bootstrap-gap ordering, Permanent Test Ownership Boundary, Bootstrap
Model-Family Separation, Local Qwen MLX adapter routing, and operator-owned
product/UAT/policy/business/cost/risk boundaries.

The next recorded action should be Repo PM approval via
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-071`. Work Item PM must
not write an orchestration plan, write RED evidence, dispatch implementation,
approve UAT, land work, merge, push, deploy, or start unrelated Phase 8 slices
until the CLI-owned `formation_approved` transition is recorded.
