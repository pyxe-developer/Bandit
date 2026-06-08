# Qwen Formation Review - BANDIT-075

contract_version: 1
work_item: BANDIT-075
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: 4b24141
reviewed_at: 2026-06-08T04:15:59Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and describes the bounded Reviewer Calibration With Seeded Defects bootstrap chore.
- source provenance clear: pass - the brief traces to operator direction on 2026-06-07, the verification-layer review, source spec, `CLEAN_CODE.md`, Stage Rubrics, roadmap/current-context state, and the gap ledger.
- scope is narrow and bounded: pass - the chore is limited to replay-only calibration policy, seeded packets, scoring, command output, docs, and tests.
- out-of-scope boundaries explicit: pass - Trust Verifier cutover, old-gate replacement/wrapping, live reviewer/model routing changes, paid routing, public benchmark publication, hosted services, telemetry, merge/push/deploy, guarded browser actions, and unrelated product work are excluded.
- acceptance criteria are verifiable: pass - criteria cover packet schema, gold labels, scoring metrics, provider-refusal handling, no-live-routing boundaries, repo-derived packet sources, and closeout.
- verification plan present: pass - focused schema, gold-label, deterministic scoring, no-live-routing mutation, provider-refusal, typecheck, Bandit validation, session/cockpit checks, tests, and `git diff --check` are listed.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is active and linked to `BANDIT-075`.
- expected files and required evidence present: pass - the brief lists expected write surfaces and required evidence artifacts.
- stage capability scope present: pass - authority roles, allowed tools, inputs, outputs, required skills, stage profiles, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no further operator-owned input is required for Stage 1 formation; paid routing, live routing, product/UAT/policy/business/cost choices, Trust Verifier cutover, merge/push/deploy, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot edit tests, helpers, fixtures, seeded calibration packets, gold labels, RED evidence, reviewer-score acceptance mappings, source-artifact mappings, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- replay-only reviewer calibration boundary preserved: pass - calibration can read seeded packets and provider evidence but cannot mutate live reviewer routing, model routing, gate verdicts, landing authority, or workflow policy.
- Local Qwen route preserved: pass - the brief restricts Local Qwen to `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs`.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
node --input-type=module -e '<build BANDIT-075 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": "The brief comprehensively satisfies all Stage 1 rubric requirements. Scope is tightly bounded to replay-only calibration with explicit out-of-scope exclusions. Acceptance criteria are specific, verifiable, and enforce no-live-routing, no-paid-routing, and repo-derived packet-source policies. CLEAN_CODE.md read evidence is present. Bootstrap gap BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS is correctly linked, and the previous gap is resolved. Permanent Test Ownership Boundary and Bootstrap Model-Family Separation are explicitly declared. Local Qwen adapter-only routing is enforced. Forbidden actions clearly block Work Item PM, RED, and implementation until formation_approved. Stage capability scope, token-cost failsafe, and operator-input status are fully documented. No blockers or non-blocking gaps identified.",
  "summary": "Stage 1 brief and formation prerequisites are sufficient for Repo PM formation approval. The work item BANDIT-075 is properly scoped, meets all verification and boundary requirements, and correctly enforces bootstrap-gap and role-separation rules. Proceed to formation_approved."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-075` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
