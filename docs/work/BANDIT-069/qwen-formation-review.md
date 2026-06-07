# Qwen Formation Review - BANDIT-069

contract_version: 1
work_item: BANDIT-069
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no findings
source_head: a230372
reviewed_at: 2026-06-07T20:14:52Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Test Strength / Mutation Adequacy Gate.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the active bootstrap gap, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the source spec.
- scope is narrow and bounded: pass - the chore is limited to policy, templates, validators, command wiring, reviewer-packet language, package-script support if selected, and focused tests.
- out-of-scope boundaries explicit: pass - universal coverage mandates, paid/external tooling, UAT policy changes, Trust Verifier cutover, merge/push/deploy authority, and unrelated Phase 8 cockpit work are excluded.
- acceptance criteria are verifiable: pass - criteria cover policy fields, Stage 1/2 validation, mutation/property/fault-injection/table-driven evidence, reviewer packet changes, landing/validation consumption, and closeout requirements.
- verification plan present: pass - focused validation, reviewer-packet, landing-gate, typecheck, Bandit validation, review, and landing commands are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is active and linked to `BANDIT-069`.
- expected files and required evidence present: pass - the brief lists the expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; product, UAT, policy, business, cost/risk, paid tooling, cutover, deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, adversarial-case mappings, or acceptance mappings.
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
node -e '<build BANDIT-069 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "explicit non-product work: present and clearly scoped",
    "origin/source authority: present (Operator direction on 2026-06-07)",
    "scope: present with detailed bullet points",
    "out of scope: present with explicit exclusions",
    "acceptance criteria: present and verifiable",
    "test or verification plan: present with focused test steps",
    "CLEAN_CODE.md read evidence: present (read on 2026-06-07)",
    "bootstrap gap disposition: present (BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE linked)",
    "expected files: present",
    "required evidence: present",
    "stage capability scope: present with roles, skills, and forbidden actions",
    "operator-input status: present (no further input required)",
    "Permanent Test Ownership Boundary: explicitly preserved",
    "Bootstrap Model-Family Separation: explicitly preserved (Claude for Stage 3 if Codex authors RED)",
    "forbidden actions: explicitly listed",
    "Local Qwen direct CLI: explicitly revoked and restricted to MLX adapter",
    "Work Item PM/RED/implementation block: coordination log confirms state is brief_created with safe_triggers formation_required, blocking execution until formation_approved"
  ],
  "summary": "Stage 1 formation for BANDIT-069 is complete and fully compliant with the rubric. All required fields are present, boundaries are preserved, and execution is correctly gated until formation approval.",
  "confidence": "high"
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-069` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
