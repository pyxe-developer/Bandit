# Aggregate Formation Review - BANDIT-076

contract_version: 1
work_item: BANDIT-076
reviewer: codex_pm
review_type: aggregate_formation_review
verdict: blocker
findings_status: blocker
findings_disposition: Local Qwen MLX adapter route is unavailable and cannot produce the required pass or dispositioned non-blocking findings; CodeRabbit timed out after the full 10-minute window and is accepted only as provider-timeout replacement evidence; deterministic Repo PM inspection found no brief-shape blockers
source_head: fd16437
reviewed_at: 2026-06-08T14:43:29Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is `.bandit/reviewers/local-qwen.json`
through `node bin/omlx-chat-completions.mjs` against the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1`.

## Scope Check

- work_type present and correct: pass - the brief records `work_type: chore` and defines the bounded Evidence Bundle Attestation bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, `BANDIT-075` closeout, `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION`, source spec, roadmap/current context, `CLEAN_CODE.md`, Stage Rubrics, and the active gap ledger state.
- scope is narrow and bounded: pass - the chore is limited to bundle policy, hashing, validators, docs, and focused tests.
- acceptance criteria are verifiable: pass - criteria name bundle membership, optional versus required evidence, hashing semantics, command/policy versions, freshness rules, deterministic output, fail-closed missing/stale/changed/unsupported/mismatched evidence behavior, read-only authority, and closeout.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement/wrapping, gate authority replacement, review-subject hash replacement, merge/push/deploy authority, paid/external tooling, hosted attestation, telemetry, public publication, guarded browser actions, unrelated cockpit/product scope, and later queued gaps are excluded.
- operator input status recorded: pass - no operator-owned input is needed for Stage 1 formation; product, UAT, policy, business, cost/risk, Trust Verifier cutover, paid/external tooling, merge/push/deploy, hosted services, public publication, and ambiguous scope remain halt conditions.
- role boundary evidence present: pass - Repo PM, Work Item PM, Test Writer, Implementation Writer, reviewers, Landing Agent, and Closeout Agent boundaries are named.
- write-surface families declared: pass - expected files cover the source spec, work package, evidence bundle policy, state/command implementation, focused tests, bootstrap gaps, events, and roadmap/status updates.
- Test Writer boundary explicit: pass - Stage 2 tests, helpers, fixtures, evidence-bundle membership cases, freshness/mismatch cases, command-version cases, acceptance mappings, and RED evidence are Test Writer-owned.
- Implementation Writer boundary explicit: pass - Stage 3 source implementation is routed to Claude if Codex authors RED evidence and has no test-surface authority.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable before landing.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists, formation review artifacts are recorded, and Work Item PM execution remains blocked until `formation_approved`.
- Bootstrap gap queue respected: pass - `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is active and linked to `BANDIT-076`; Spec-To-Evidence Traceability Matrix remains queued behind it.
- evidence bundle attestation boundary preserved: pass - attestation can identify, normalize, hash, and report bundle membership but cannot mutate live gate verdicts, reviewer routing, model routing, landing authority, UAT authority, gap status, or workflow policy.
- Trust Verifier cutover boundary preserved: pass - cutover, old-gate replacement, and old-gate wrapping remain out of scope and require separate authorization.
- Local Qwen route preserved: blocker - the brief restricts Local Qwen to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`, but the authorized endpoint is unavailable and no Qwen reviewer verdict was produced.
- Permanent Test Ownership Boundary preserved: pass - the Stage 3 Writer cannot edit tests, helpers, fixtures, RED evidence, evidence-bundle acceptance mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.

## Formation Evidence

- `docs/work/BANDIT-076/qwen-formation-review.md` - `blocker`; the authorized Local Qwen MLX adapter route is unavailable and no Qwen pass or dispositioned non-blocking finding set exists.
- `docs/work/BANDIT-076/coderabbit-formation-review.md` - `bootstrap_gap`; CodeRabbit provider timeout after the full 10-minute window during setup/analyzing/reviewing; no CodeRabbit pass claimed.
- `docs/work/BANDIT-076/brief.md` - Stage 1 brief with non-product work, source provenance, scope, out-of-scope, acceptance criteria, verification plan, `CLEAN_CODE.md` read evidence, bootstrap-gap disposition, expected files, required evidence, role boundaries, stage capability scope, token-cost failsafe, source-of-truth/evidence-bundle boundary, first implementation order, smell triggers, forbidden actions, Local Qwen route restriction, and operator-input status.
- `docs/work/BANDIT-076/coordination-log.jsonl` - initial `brief_created` transition with `formation_required`; `formation_approved` has not been recorded.

## Findings

### F1 - Local Qwen Provider Unavailable

Finding verdict: blocker

Disposition: blocks formation approval. The endpoint at
`http://127.0.0.1:8000/v1` is unavailable, the configured baseline cache is
incomplete, and the complete local MLX community snapshot cannot be loaded by
the installed `mlx-lm 0.26.0` server because `qwen3_5_moe` is unsupported. No
direct `qwen` CLI evidence is allowed.

### F2 - CodeRabbit Provider Timeout

Finding verdict: bootstrap_gap

Disposition: accepted only as provider-timeout replacement evidence. CodeRabbit
reached setup/analyzing/reviewing but did not return a terminal review before
the full required 10-minute timeout; no CodeRabbit pass is claimed.

## Summary

`BANDIT-076` has a repaired Stage 1 brief and coordination prerequisite, but
formation cannot be approved because Local Qwen did not return the required pass
or dispositioned non-blocking findings through the authorized MLX adapter route.

The next recorded action should be Repo PM repair of the Local Qwen provider
route for `BANDIT-076` formation review, then refresh
`docs/work/BANDIT-076/qwen-formation-review.md` and
`docs/work/BANDIT-076/formation-review.md`, and only then run
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-076`. Work Item PM must
not write an orchestration plan, write RED evidence, dispatch implementation,
approve UAT, land work, merge, push, deploy, or start unrelated Phase 8 slices
until the CLI-owned `formation_approved` transition is recorded.
