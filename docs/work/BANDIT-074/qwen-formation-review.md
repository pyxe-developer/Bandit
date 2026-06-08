# Qwen Formation Review - BANDIT-074

contract_version: 1
work_item: BANDIT-074
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: 1af5d12
reviewed_at: 2026-06-08T02:50:09Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Metamorphic Cross-Projection Checks bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the verification-layer review, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the gap ledger.
- scope is narrow and bounded: pass - the chore is limited to projection consistency, validators, fixtures, docs, and tests.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement or wrapping, reviewer calibration, evidence bundle attestation, spec-to-evidence traceability, paid routing, public benchmark publication, hosted services, telemetry, merge/push/deploy, guarded browser actions, and unrelated product work are excluded.
- acceptance criteria are verifiable: pass - criteria cover policy definition, covered projection agreement, fail-closed disagreement handling, metamorphic invariance, and closeout.
- verification plan present: pass - focused projection tests, metamorphic tests, disagreement refusal tests, typecheck, Bandit validation, session/cockpit checks, review routing, landing checks, and `git diff --check` are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is active and linked to `BANDIT-074`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, allowed tools, inputs, outputs, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; Trust Verifier cutover, product/UAT/policy/business/cost choices, paid/external tooling, live routing, merge/push/deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, cross-projection acceptance mappings, perturbation fixtures, expected-output mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- source-of-truth and projection boundary preserved: pass - canonical repo artifacts remain authoritative, while derived projections are compared as read-only trust surfaces.
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
node --input-type=module -e '<build BANDIT-074 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "Non-product work, origin/source authority, narrow scope, out-of-scope boundaries, verifiable acceptance criteria, verification plan, CLEAN_CODE.md evidence, bootstrap gap disposition, expected files, required evidence, role boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, stage capability scope, token-cost failsafe, source-of-truth/projection boundary, operator-input status, forbidden actions, formation gate coordination, and Local Qwen route restriction are present.",
    "Formation gate coordination is correctly initialized with brief_created and formation_required.",
    "No blockers or missing gates are present."
  ],
  "summary": "BANDIT-074 Stage 1 brief fully satisfies the Stage 1 rubric. The scope is narrow and well-bounded, acceptance criteria are verifiable, and all mandatory policy boundaries are explicitly declared. Formation gate coordination is correctly initialized."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-074` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
