# Qwen Formation Review - BANDIT-073

contract_version: 1
work_item: BANDIT-073
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no findings
source_head: 912dbac
reviewed_at: 2026-06-08T01:16:34Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Gate Determinism And Flake Gate bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the active bootstrap gap, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the gap ledger.
- scope is narrow and bounded: pass - the chore is limited to deterministic CLI gates, validators, docs, and tests.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement or wrapping, paid routing, live reviewer/model routing, public benchmark publication, hosted replay services, telemetry, merge/push/deploy, guarded browser actions, and unrelated Phase 8 product work are excluded.
- acceptance criteria are verifiable: pass - criteria cover determinism-critical gate policy, stable ordering, stable hashes, machine-readable output, nondeterminism disposition, provider-dependent evidence, and closeout.
- verification plan present: pass - focused gate determinism tests, typecheck, Bandit validation, session/cockpit checks, review routing, landing checks, and `git diff --check` are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is active and linked to `BANDIT-073`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, allowed tools, inputs, outputs, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; Trust Verifier cutover, product/UAT/policy/business/cost choices, paid/external tooling, live routing, merge/push/deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, gate determinism acceptance mappings, expected-output mappings, nondeterminism-disposition mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- gate determinism boundary preserved: pass - the brief separates canonical local proof from provider-dependent and freshness-bounded evidence.
- Trust Verifier cutover boundary preserved: pass - cutover, old-gate replacement, and old-gate wrapping require separate authorization and are blocked in this chore.
- Local Qwen route preserved: pass - the brief restricts Local Qwen to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
node --input-type=module -e '<build BANDIT-073 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "Stage 1 brief contains all required elements: goal, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, token-cost failsafe, source-of-truth boundary, and smell triggers.",
    "Permanent Test Ownership Boundary is explicitly declared, preventing Stage 3 Writers from editing tests, fixtures, RED evidence, or acceptance mappings.",
    "Bootstrap Model-Family Separation is explicitly declared, routing Stage 3 implementation to Claude-family when Codex authors RED evidence, with escalation returning to Codex PM.",
    "Operator-input status is correctly scoped: no further operator input required for this chore, with explicit halt conditions for product direction, UAT, policy, cost/risk overrides, and unrelated scope.",
    "Active bootstrap gap `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is correctly linked in the brief and `.bandit/bootstrap-gaps.json` ledger.",
    "Stage capability scope defines authority roles, required skills, allowed tools, inputs, outputs, evidence, forbidden actions, and soft budget bands/token-cost failsafe.",
    "Coordination log confirms `brief_created` state with `formation_required` safe trigger and correct accountable actor (repo_pm).",
    "Source-of-truth and projection boundaries are explicitly separated, preventing derived surfaces from becoming hidden workflow authority.",
    "No blockers identified; all rubric requirements for Stage 1 are satisfied."
  ],
  "summary": "BANDIT-073 Stage 1 brief fully satisfies the Stage 1 rubric. It provides a clear, verifiable contract with explicit scope, acceptance criteria, and verification plan. Role boundaries, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation are correctly enforced. The active bootstrap gap is properly linked, operator-input status is accurately scoped, and stage capability/forbidden actions are well-defined. The coordination log confirms the brief_created state. The work item is ready to proceed to formation review."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-073` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
