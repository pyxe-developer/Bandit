# Qwen Formation Review - BANDIT-072

contract_version: 1
work_item: BANDIT-072
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no findings
source_head: fc4d34c
reviewed_at: 2026-06-08T00:06:22Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Replay Regression Corpus bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, `BANDIT-071` closeout, the active bootstrap gap, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the gap ledger.
- scope is narrow and bounded: pass - the chore is limited to replay packet policy, fixtures, validators, command output, docs, and tests.
- out-of-scope boundaries explicit: pass - live state mutation, Trust Verifier cutover, old-gate replacement or wrapping, paid routing, live reviewer/model routing, public benchmark publication, hosted replay services, telemetry, merge/push/deploy, guarded browser actions, and unrelated Phase 8 product work are excluded.
- acceptance criteria are verifiable: pass - criteria cover schema, failure-mode taxonomy, deterministic output, read-only execution, supplemental evidence boundaries, packet source metadata, and closeout.
- verification plan present: pass - focused replay corpus tests, typecheck, Bandit validation, session/cockpit checks, review routing, landing checks, and `git diff --check` are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is active and linked to `BANDIT-072`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, allowed tools, inputs, outputs, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; Trust Verifier cutover, product/UAT/policy/business/cost choices, paid/external tooling, live routing, merge/push/deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, replay packet acceptance mappings, expected-verdict mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- replay-only boundary preserved: pass - the brief makes replay packets read-only fixtures and supplemental regression evidence, not live workflow authority.
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
node -e '<build BANDIT-072 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "Goal/Non-product work: Clearly defined as converting historical Bandit workflow failures into replay-only verification packets to prove current gates still catch old failure modes.",
    "Origin/Source authority: Cites operator direction from 2026-06-07 and confirms repo authorization via BANDIT-071 closure and updated gap ledger.",
    "Scope/Out-of-scope: Explicitly bounded to policy, fixtures, validators, and tests; explicitly excludes live state mutation, Trust Verifier cutover, paid routing, and unrelated Phase 8 product work.",
    "Acceptance criteria: 10 specific, verifiable criteria covering schema definition, failure-mode taxonomy, deterministic output, read-only execution, and supplemental evidence boundaries.",
    "Verification plan: Comprehensive list of RED/GREEN tests, CLI commands, and review gates aligned with the rubric.",
    "CLEAN_CODE.md evidence: Explicitly recorded as read on 2026-06-07 before brief repair.",
    "Bootstrap gaps: `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` correctly linked to BANDIT-072 and queued behind BANDIT-071.",
    "Expected/Required evidence: Fully listed and aligned with the Stage 1-6 artifact requirements.",
    "Stage capability scope: Roles, skills, tools, inputs, outputs, and forbidden actions explicitly defined with appropriate budget failsafes.",
    "Operator-input status: Correctly identifies Codex PM ownership for technical routing and halts only on operator-gated decisions (product, UAT, policy, cost, Trust Verifier cutover).",
    "Permanent Test Ownership Boundary: Explicitly preserved; Stage 3 Writer cannot edit tests, fixtures, RED evidence, or acceptance mappings.",
    "Bootstrap Model-Family Separation: Explicitly mandates Claude for Stage 3 implementation if Codex authors or materially edits RED tests.",
    "Forbidden actions: Clearly listed, including no live mutation, no Trust Verifier cutover, no paid routing, and no replacing required live evidence.",
    "Coordination brief_created evidence: `coordination-log.jsonl` confirms `state: brief_created` with accountable actor `repo_pm` and correct safe triggers.",
    "Replay-only boundary: Explicitly enforced in Scope, Out of Scope, and Source-Of-Truth sections; fixtures are strictly read-only against live workflow state.",
    "Trust Verifier cutover boundary: Explicitly blocked; requires a separate Codex PM decision and operator-owned approval.",
    "Local Qwen route restriction: Explicitly restricted to `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX endpoint; direct `qwen` CLI is revoked."
  ],
  "summary": "BANDIT-072 Stage 1 formation brief is complete and fully compliant with the Stage 1 rubric. It accurately captures the bootstrap gap, enforces strict replay-only boundaries, preserves all required role and model-family separations, and explicitly blocks unauthorized Trust Verifier cutover, live state mutation, and paid routing. The brief meets all verification, clean-code, and coordination requirements, and is ready for formation review and progression to Stage 2."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-072` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
