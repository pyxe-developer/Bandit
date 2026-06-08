# Qwen Formation Review - BANDIT-076

contract_version: 1
work_item: BANDIT-076
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: 3d1f03a
reviewed_at: 2026-06-08T15:09:36Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Evidence Bundle Attestation bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the verification-layer review, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the gap ledger.
- scope is narrow and bounded: pass - the chore is limited to evidence bundle policy, hashing, validators, docs, and tests.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement/wrapping, gate-authority replacement, review-subject hash replacement, merge/push/deploy, paid/external tooling, hosted attestation, telemetry, guarded browser actions, unrelated product work, and later queued gaps are excluded.
- acceptance criteria are verifiable: pass - criteria cover bundle membership, optional versus required evidence, hashing semantics, command/policy versions, freshness rules, deterministic output, fail-closed missing/stale/changed/unsupported/mismatched evidence behavior, read-only authority, and closeout.
- verification plan present: pass - focused bundle membership, hash stability, version capture, fail-closed evidence, read-only authority, typecheck, Bandit validation, cockpit/session checks, tests, and `git diff --check` are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is active and linked to `BANDIT-076`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, allowed tools, inputs, outputs, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; product/UAT/policy/business/cost choices, Trust Verifier cutover, merge/push/deploy, paid/external services, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, evidence-bundle acceptance mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- evidence bundle attestation boundary preserved: pass - attestation can identify, normalize, hash, and report bundle membership but cannot mutate live gate verdicts, reviewer routing, model routing, landing authority, UAT authority, gap status, or workflow policy.
- Local Qwen route preserved: pass - the review used `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Adapter probe:

```sh
printf 'Return JSON only: {"verdict":"pass","findings":"none","summary":"adapter probe ok"}\n' | timeout 240 node bin/omlx-chat-completions.mjs
```

Result:

```json
{"text":"{\"verdict\":\"pass\",\"findings\":\"none\",\"summary\":\"adapter probe ok\"}"}
```

Formation review command:

```sh
<BANDIT-076 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md, docs/roadmap/CURRENT_CONTEXT.md, docs/roadmap/ROADMAP.md, docs/work/BANDIT-076/brief.md, and docs/work/BANDIT-076/coordination-log.jsonl> | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings_status": "satisfied",
  "findings": [
    "Stage 1 Work-Item Brief and Spec requirements are fully met.",
    "Scope and out-of-scope are tightly bounded and explicitly exclude unrelated product work, Trust Verifier cutover, and downstream stages.",
    "Acceptance criteria are specific, verifiable, and testable.",
    "CLEAN_CODE.md read evidence is explicitly recorded with compliance expectations.",
    "Source provenance and origin are clearly documented.",
    "Operator-input status is explicitly stated, halting downstream actions if policy/product overrides are needed.",
    "Stage capability scope includes authority roles, allowed tools, inputs/outputs, required skills, forbidden actions, and token-cost failsafes.",
    "Permanent Test Ownership Boundary and Bootstrap Model-Family Separation are explicitly preserved.",
    "Source-of-truth and evidence-bundle boundary are clearly defined, ensuring read-only attestation without gate authority replacement.",
    "Downstream stages are correctly blocked until formation_approved is recorded."
  ],
  "summary": "The BANDIT-076 Stage 1 brief satisfies all required formation criteria. It maintains strict Bandit role boundaries, includes mandatory CLEAN_CODE.md read evidence, and provides verifiable acceptance criteria with a tightly bounded scope. The brief correctly blocks all downstream work until formation approval and clearly documents operator input status, stage capability scope, and evidence-bundle boundaries. No formation blockers are present."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported. The model
returned only satisfied checklist observations, which Repo PM records as
`findings_status: none` for the formation gate contract.

## Summary

Local Qwen formation review for `BANDIT-076` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
