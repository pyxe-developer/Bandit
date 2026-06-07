# Qwen Formation Review - BANDIT-071

contract_version: 1
work_item: BANDIT-071
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no findings
source_head: 4f98bd1
reviewed_at: 2026-06-07T22:24:43Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Private Installable Distribution And Update Notification Channel.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the active bootstrap gap, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and prior closeout evidence.
- scope is narrow and bounded: pass - the chore is limited to private installability, package metadata/runtime fixes, update metadata, update-check command wiring, docs, and tests.
- out-of-scope boundaries explicit: pass - public npm publishing, paid registry setup, automatic self-update, telemetry, external service setup, Trust Verifier cutover, merge/push/deploy, guarded browser actions, and unrelated cockpit/product work are excluded.
- acceptance criteria are verifiable: pass - criteria cover private install contract, packed install behavior, package contents allow-listing, runtime dependency boundary, deterministic update-check states, non-blocking alert behavior, freshness-bounded cache behavior, data-minimal metadata, docs, and closeout.
- verification plan present: pass - focused install/update tests, package allow-list tests, `npm pack --dry-run --json`, packed-install smoke test, typecheck, Bandit validation, review, and landing commands are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is active and linked to `BANDIT-071`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; public publishing, paid registry/external service setup, business/cost tradeoffs, automatic self-update, UAT, Trust Verifier cutover, merge/push/deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, install-smoke evidence, package allow-list acceptance mappings, update-channel acceptance mappings, or acceptance mappings.
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
node -e '<build BANDIT-071 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "Brief comprehensively covers all Stage 1 required fields: goal, scope, out of scope, acceptance criteria, verification plan, CLEAN_CODE.md read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, role boundaries, operator input status, and smell triggers.",
    "Coordination log correctly records the brief_created state with appropriate metadata, sequence, and next action.",
    "Explicitly blocks Stage 2 RED evidence, Stage 3 implementation, Stage 4 review, Stage 5 landing, and Stage 6 retrospective until formation_approved.",
    "Correctly enforces Local Qwen routing via .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs, explicitly revoking the direct qwen CLI.",
    "Properly identifies operator-owned boundaries (no public npm, no paid registry, no auto-update, no telemetry) and defers technical design to Codex PM.",
    "Permanent Test Ownership Boundary and Bootstrap Model-Family Separation are explicitly stated and aligned with rubric requirements.",
    "Verification plan includes focused tests, smoke tests, and CLI validation steps directly mapped to acceptance criteria.",
    "No vague acceptance criteria, scope creep, or missing bootstrap gap dispositions detected.",
    "Token-cost failsafe and stage capability profiles are explicitly defined, preventing unbounded paid execution or policy drift."
  ],
  "summary": "The BANDIT-071 brief and coordination log fully satisfy Bandit Stage 1 formation requirements. The brief is well-structured, explicitly defines non-product work, scope, acceptance criteria, and verification steps, and correctly records CLEAN_CODE.md read evidence. It properly blocks downstream stages until formation approval, enforces the required Local Qwen routing constraint, and clearly delineates operator-owned versus Codex-owned decisions. The coordination log accurately reflects the current state. No blockers or bootstrap gaps prevent proceeding to formation review.",
  "confidence": 1.0
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-071` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
