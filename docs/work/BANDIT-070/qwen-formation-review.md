# Qwen Formation Review - BANDIT-070

contract_version: 1
work_item: BANDIT-070
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no findings
source_head: c4a0c3a
reviewed_at: 2026-06-07T21:27:43Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Verification Oracle Provenance Gate.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the active bootstrap gap, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and prior closeout evidence.
- scope is narrow and bounded: pass - the chore is limited to policy, templates, validators, command wiring, reviewer-packet language, projection/landing integration, and focused tests.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement/wrapping, replay corpus, private install/update, guarded actions, State Index, local API, paid tooling, merge/push/deploy, and unrelated cockpit work are excluded.
- acceptance criteria are verifiable: pass - criteria cover supported oracle types, independence classes, required fields, fail-closed behavior, circular self-attestation, stale or mismatched sources, reviewer packet wording, landing/validation consumption, and closeout.
- verification plan present: pass - focused oracle-provenance tests, circularity tests, stale/missing/unsupported/mismatch tests, reviewer-packet tests, landing/validation tests, typecheck, Bandit validation, review, and landing commands are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is active and linked to `BANDIT-070`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; product, UAT, policy, business, cost/risk, paid tooling, cutover, deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- Local Qwen route preserved: pass - the brief restricts Local Qwen to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
node -e '<build BANDIT-070 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "brief.md explicitly covers all Stage 1 required evidence: goal, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, permanent test ownership boundary, bootstrap model-family separation, token-cost failsafe, operator-input status, required evidence, forbidden actions, and smell triggers.",
    "coordination-log.jsonl correctly records the 'brief_created' state with sequence 1 and includes 'formation_required' in safe_triggers, enforcing the block until formation_approved.",
    "Local Qwen route restriction is explicitly documented in the bootstrap gaps section and aligns with CURRENT_CONTEXT.md.",
    "No operator-owned technical routing decisions are requested; routine technical management remains with Codex PM as required.",
    "Scope is tightly bounded to policy, templates, validators, and focused tests, explicitly excluding unrelated Phase 8 product scope, Trust Verifier cutover, and paid tooling."
  ],
  "summary": "The brief satisfies all Stage 1 Work-Item Brief And Spec requirements. It provides a clear, verifiable contract with explicit role boundaries, bootstrap gap dispositions, and token-cost failsafes. The coordination log correctly records the brief_created state and enforces the formation gate. No blockers identified.",
  "confidence": 1.0
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-070` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
