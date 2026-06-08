# Aggregate Formation Review - BANDIT-072

contract_version: 1
work_item: BANDIT-072
reviewer: codex_pm
review_type: aggregate_formation_review
verdict: pass
findings_status: non_blocking
findings_disposition: Local Qwen MLX adapter passed with no findings; CodeRabbit timed out and is accepted only as provider-timeout replacement evidence; deterministic Repo PM inspection found no Stage 1 formation blockers
source_head: fc4d34c
reviewed_at: 2026-06-08T00:11:27Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is `.bandit/reviewers/local-qwen.json`
through `node bin/omlx-chat-completions.mjs` against the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`.

## Scope Check

- work_type present and correct: pass - the brief records `work_type: chore` and defines the bounded Replay Regression Corpus bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, `BANDIT-071` closeout, `BANDIT-GAP-REPLAY-REGRESSION-CORPUS`, source spec, roadmap/current context, `CLEAN_CODE.md`, Stage Rubrics, and the active gap ledger state.
- scope is narrow and bounded: pass - the chore is limited to replay packet policy, fixtures, validators, command output, docs, focused tests, and read-only replay evidence.
- acceptance criteria are verifiable: pass - criteria name the replay schema, failure-mode taxonomy, expected verdict semantics, deterministic output, read-only execution, supplemental evidence boundaries, packet source metadata, closeout, and preservation of Bandit workflow boundaries.
- out-of-scope boundaries explicit: pass - live state mutation, Trust Verifier cutover, old-gate replacement/wrapping, paid routing, live reviewer/model routing, public benchmark publication, hosted replay services, telemetry, merge/push/deploy authority, guarded browser actions, and unrelated cockpit/product scope are excluded.
- operator input status recorded: pass - no operator-owned input is needed for Stage 1 formation; product, UAT, policy, business, cost/risk, Trust Verifier cutover, paid/external tooling, live routing, merge/push/deploy, and ambiguous scope remain halt conditions.
- role boundary evidence present: pass - Repo PM, Work Item PM, Test Writer, Implementation Writer, reviewers, Landing Agent, and Closeout Agent boundaries are named.
- write-surface families declared: pass - expected files cover the source spec, work package, replay policy/design, replay packets, state/command implementation, focused tests, bootstrap gaps, events, and roadmap/status updates.
- Test Writer boundary explicit: pass - Stage 2 tests, helpers, fixtures, replay packet acceptance mappings, expected-verdict mappings, replay-only boundary tests, and RED evidence are Test Writer-owned.
- Implementation Writer boundary explicit: pass - Stage 3 source implementation is routed to Claude if Codex authors RED evidence and has no test-surface authority.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable before landing.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists, formation review artifacts are recorded, and Work Item PM execution remains blocked until `formation_approved`.
- Bootstrap gap queue respected: pass - `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is active and linked to `BANDIT-072`; determinism, metamorphic, reviewer calibration, evidence attestation, and traceability gaps remain queued behind it.
- replay-only boundary preserved: pass - replay packets are fixtures/regression evidence only, read-only against live repo workflow state, and cannot replace live review, risk, supply-chain, UAT, landing, operator approval, or routing evidence.
- Trust Verifier cutover boundary preserved: pass - cutover, old-gate replacement, and old-gate wrapping remain out of scope and require separate authorization.
- Local Qwen route preserved: pass - Local Qwen is restricted to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.
- Permanent Test Ownership Boundary preserved: pass - the Stage 3 Writer cannot edit tests, helpers, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.

## Formation Evidence

- `docs/work/BANDIT-072/qwen-formation-review.md` - `pass` through the MLX OpenAI-compatible adapter with no blockers or non-blocking findings.
- `docs/work/BANDIT-072/coderabbit-formation-review.md` - `bootstrap_gap`; CodeRabbit provider timeout after setup/analyzing; no CodeRabbit pass claimed.
- `docs/work/BANDIT-072/brief.md` - Stage 1 brief with non-product work, source provenance, scope, out-of-scope, acceptance criteria, verification plan, `CLEAN_CODE.md` read evidence, bootstrap-gap disposition, expected files, required evidence, role boundaries, stage capability scope, token-cost failsafe, source-of-truth/replay boundary, first implementation order, smell triggers, forbidden actions, Local Qwen route restriction, and operator-input status.
- `docs/work/BANDIT-072/coordination-log.jsonl` - initial `brief_created` transition with `formation_required`; `formation_approved` has not been recorded yet.

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

`BANDIT-072` has adequate Stage 1 formation evidence to proceed. The brief is
narrow, source-backed, verifiable, clean-code/rubric evaluable, and preserves
bootstrap-gap ordering, replay-only evidence boundaries, Trust Verifier cutover
boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family
Separation, Local Qwen MLX adapter routing, and operator-owned
product/UAT/policy/business/cost/risk boundaries.

The next recorded action should be Repo PM approval via
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-072`. Work Item PM must
not write an orchestration plan, write RED evidence, dispatch implementation,
approve UAT, land work, merge, push, deploy, or start unrelated Phase 8 slices
until the CLI-owned `formation_approved` transition is recorded.
