# Aggregate Formation Review - BANDIT-075

contract_version: 1
work_item: BANDIT-075
reviewer: codex_pm
review_type: aggregate_formation_review
verdict: pass
findings_status: non_blocking
findings_disposition: Local Qwen MLX adapter passed with no findings; CodeRabbit timed out after the full 10-minute window and is accepted only as provider-timeout replacement evidence; deterministic Repo PM inspection found no Stage 1 formation blockers
source_head: 4b24141
reviewed_at: 2026-06-08T04:26:49Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is `.bandit/reviewers/local-qwen.json`
through `node bin/omlx-chat-completions.mjs` against the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`.

## Scope Check

- work_type present and correct: pass - the brief records `work_type: chore` and defines the bounded Reviewer Calibration With Seeded Defects bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, `BANDIT-074` closeout, `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS`, source spec, roadmap/current context, `CLEAN_CODE.md`, Stage Rubrics, and the active gap ledger state.
- scope is narrow and bounded: pass - the chore is limited to replay-only calibration policy, seeded packets, scoring, command output, docs, and focused tests.
- acceptance criteria are verifiable: pass - criteria name packet schema, gold labels, scoring metrics, reviewer eligibility, provider-refusal handling, no-live-routing boundaries, repo-derived packet sources, scoring priorities, and closeout.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement/wrapping, live reviewer/model routing changes, paid routing, public benchmark publication, hosted services, telemetry, merge/push/deploy authority, guarded browser actions, unrelated cockpit/product scope, and later queued gaps are excluded.
- operator input status recorded: pass - no operator-owned input is needed for Stage 1 formation; product, UAT, policy, business, cost/risk, Trust Verifier cutover, paid/external tooling, live routing, merge/push/deploy, public publication, hosted services, and ambiguous scope remain halt conditions.
- role boundary evidence present: pass - Repo PM, Work Item PM, Test Writer, Implementation Writer, reviewers, Landing Agent, and Closeout Agent boundaries are named.
- write-surface families declared: pass - expected files cover the source spec, work package, reviewer calibration policy, replay-only calibration packets, state/command implementation, focused tests, bootstrap gaps, events, and roadmap/status updates.
- Test Writer boundary explicit: pass - Stage 2 tests, helpers, fixtures, seeded calibration packets, gold labels, reviewer-score acceptance mappings, provider-refusal fixtures, and RED evidence are Test Writer-owned.
- Implementation Writer boundary explicit: pass - Stage 3 source implementation is routed to Claude if Codex authors RED evidence and has no test-surface authority.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable before landing.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists, formation review artifacts are recorded, and Work Item PM execution remains blocked until `formation_approved`.
- Bootstrap gap queue respected: pass - `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is active and linked to `BANDIT-075`; evidence attestation and traceability gaps remain queued behind it.
- replay-only reviewer calibration boundary preserved: pass - calibration can read seeded packets, fixture reviewer outputs, and provider evidence but cannot mutate live reviewer routing, model routing, gate verdicts, landing authority, or workflow policy.
- reviewer benchmark scoring contract present: pass - blocker recall, actionable precision, useful finding yield, false-positive rate, provider/tool friction, latency, and cost are declared.
- reviewer packet-source contract present: pass - repo-derived Bandit workflow failure modes must precede generic coding benchmark tasks for first-harness acceptance.
- Trust Verifier cutover boundary preserved: pass - cutover, old-gate replacement, and old-gate wrapping remain out of scope and require separate authorization.
- Local Qwen route preserved: pass - Local Qwen is restricted to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.
- Permanent Test Ownership Boundary preserved: pass - the Stage 3 Writer cannot edit tests, helpers, fixtures, seeded calibration packets, gold labels, RED evidence, reviewer-score acceptance mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.

## Formation Evidence

- `docs/work/BANDIT-075/qwen-formation-review.md` - `pass` through the MLX OpenAI-compatible adapter with no blockers or non-blocking findings.
- `docs/work/BANDIT-075/coderabbit-formation-review.md` - `bootstrap_gap`; CodeRabbit provider timeout after the full 10-minute window during setup/analyzing/reviewing; no CodeRabbit pass claimed.
- `docs/work/BANDIT-075/brief.md` - Stage 1 brief with non-product work, source provenance, scope, out-of-scope, acceptance criteria, verification plan, `CLEAN_CODE.md` read evidence, bootstrap-gap disposition, expected files, required evidence, role boundaries, stage capability scope, token-cost failsafe, source-of-truth/reviewer-calibration boundary, first implementation order, smell triggers, forbidden actions, Local Qwen route restriction, and operator-input status.
- `docs/work/BANDIT-075/coordination-log.jsonl` - initial `brief_created` transition with `formation_required`; `formation_approved` has not been recorded yet.

## Findings

### CodeRabbit Provider Timeout

verdict: bootstrap_gap

Disposition: accepted only as provider-timeout replacement evidence. CodeRabbit
reached setup/analyzing/reviewing but did not return a terminal review before
the full required 10-minute timeout; no CodeRabbit pass is claimed.

### Direct Qwen CLI Route Revoked

verdict: pass

Disposition: current formation evidence uses only the MLX OpenAI-compatible
adapter route. Direct `qwen` CLI is not an authorized Bandit reviewer path.

## Summary

`BANDIT-075` has adequate Stage 1 formation evidence to proceed. The brief is
narrow, source-backed, verifiable, clean-code/rubric evaluable, and preserves
bootstrap-gap ordering, replay-only reviewer calibration boundaries, no-live-
routing/no-paid-routing constraints, reviewer benchmark scoring and packet-
source contracts, Trust Verifier cutover boundaries, Permanent Test Ownership
Boundary, Bootstrap Model-Family Separation, Local Qwen MLX adapter routing,
and operator-owned product/UAT/policy/business/cost/risk boundaries.

The next recorded action should be Repo PM approval via
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-075`. Work Item PM must
not write an orchestration plan, write RED evidence, dispatch implementation,
approve UAT, land work, merge, push, deploy, or start unrelated Phase 8 slices
until the CLI-owned `formation_approved` transition is recorded.
