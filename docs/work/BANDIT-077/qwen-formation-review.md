# Qwen Formation Review - BANDIT-077

contract_version: 1
work_item: BANDIT-077
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: 0b0671a
reviewed_at: 2026-06-08T16:16:49Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Spec-To-Evidence Traceability Matrix bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the verification-layer review, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the gap ledger.
- scope is narrow and bounded: pass - the chore is limited to traceability policy, matrix template, validators, reviewer packet language, docs, and tests.
- out-of-scope boundaries explicit: pass - coverage mandates, historical rewrites, Trust Verifier cutover, old-gate replacement/wrapping, merge/push/deploy, paid/external tooling, hosted services, telemetry, guarded browser actions, unrelated product work, and later queued gaps are excluded.
- acceptance criteria are verifiable: pass - criteria cover schema, evidence-type and disposition values, required fields, covered risk tiers, fail-closed unmapped criteria, reviewer inspection, evidence classification, and closeout.
- verification plan present: pass - focused traceability parsing, missing/weak/unsupported mapping refusal, disposition validation, reviewer packet inspection, typecheck, Bandit validation, cockpit/session checks, tests, and `git diff --check` are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` is active and linked to `BANDIT-077`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts, including formation-review and coordination artifacts.
- stage capability scope present: pass - authority roles, allowed tools, inputs, outputs, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; product/UAT/policy/business/cost choices, Trust Verifier cutover, merge/push/deploy, paid/external services, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, RED evidence, traceability acceptance mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- traceability boundary preserved: pass - traceability can identify, validate, and report acceptance-criterion mappings but cannot mutate acceptance criteria, reviewer routing, model routing, landing authority, UAT authority, gap status, Trust Verifier authority, or workflow policy.
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
<BANDIT-077 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md, docs/roadmap/CURRENT_CONTEXT.md, docs/roadmap/ROADMAP.md, docs/work/BANDIT-077/brief.md, and docs/work/BANDIT-077/coordination-log.jsonl> | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings_status": "clean",
  "findings": [],
  "summary": "The BANDIT-077 Stage 1 formation is valid and satisfies all Stage 1 rubric requirements. The brief clearly defines work_type, source provenance, narrow scope, and explicit out-of-scope boundaries. Acceptance criteria are specific and verifiable. The verification plan, CLEAN_CODE.md read evidence, bootstrap gap disposition, expected/required evidence, operator input status, role boundaries, permanent test ownership boundary, bootstrap model-family separation, stage capability scope, token-cost failsafe, source-of-truth/projection boundary, and forbidden actions are all explicitly documented and aligned with policy. The coordination log correctly records the brief_created event. No blockers or non-blocking findings are present. The slice is ready for formation review."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-077` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
