# Qwen Formation Review - BANDIT-078

contract_version: 1
work_item: BANDIT-078
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: 415754e
reviewed_at: 2026-06-08T17:58:28Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- product work present: pass - the brief records `work_type: slice` and
  describes the bounded guarded CLI action request cockpit product slice.
- source provenance clear: pass - the brief traces to roadmap/current-context
  state, the accepted cockpit PRD/design artifacts, cockpit boundary,
  `BANDIT-068` and `BANDIT-077` closeout evidence, current cockpit source, the
  source spec, `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the slice is limited to request-only
  action affordance derivation and rendering for approved CLI command families.
- out-of-scope boundaries explicit: pass - browser-side CLI execution, local
  API, State Index, live polling, guarded action execution, scheduler,
  claim/worktree lifecycle, merge, push, deploy, Trust Verifier cutover, policy
  changes, cost/risk overrides, external services, and unrelated cockpit scope
  are excluded.
- acceptance criteria are verifiable: pass - criteria cover action request
  derivation, allowed command families, disabled reasons, source links, no
  hidden authority, responsive behavior, accessibility, UAT, and review gates.
- verification plan present: pass - Stage 1 through Stage 6 evidence paths and
  stage-specific checks are listed, including RED tests before implementation.
- CLEAN_CODE.md read evidence present: pass - the brief records
  `CLEAN_CODE.md` read evidence dated 2026-06-08 and makes clean-code
  compliance evaluable.
- bootstrap gap disposition present: pass - the brief records that no open
  bootstrap gap blocks this Phase 8 product slice.
- expected files and required evidence present: pass - the brief lists expected
  source/test/artifact surfaces and required work-item evidence.
- stage capability scope present: pass - authority roles, required skills,
  allowed tools, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required for
  Stage 1 formation; product/UAT/policy/business/cost/risk changes, guarded
  action execution authority, Trust Verifier cutover, merge/push/deploy, and
  ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit tests, helpers, fixtures, RED evidence, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires Claude-family Stage 3 implementation during bootstrap.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists
  and Work Item PM, RED, and implementation remain blocked until
  `formation_approved`.
- CLI Authority preserved: pass - the cockpit may request CLI-backed actions
  but no browser-side execution, artifact mutation, UAT approval, landing
  decision, merge, push, deploy, or policy override is authorized.
- Local Qwen route preserved: pass - the review used
  `.bandit/reviewers/local-qwen.json` through
  `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.

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
<BANDIT-078 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md, docs/roadmap/CURRENT_CONTEXT.md, docs/roadmap/ROADMAP.md, docs/work/BANDIT-078/brief.md, and docs/work/BANDIT-078/coordination-log.jsonl> | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings_status": "none",
  "findings": [],
  "summary": "Stage 1 formation for BANDIT-078 is complete and fully compliant with the Stage 1 rubric. The brief includes all required evidence: goal, scope, out-of-scope, acceptance criteria, test plan, CLEAN_CODE.md read evidence, bootstrap gaps, expected files, implementation order, stage capability scope, role boundaries, permanent test ownership boundary, bootstrap model-family separation, operator input status, smell triggers, and verification plan. Source provenance is clearly cited from roadmap, PRD, design artifacts, and prior work items. Local Qwen route restriction is explicitly documented and enforced. Coordination log confirms the `brief_created` state. No operator input is required to proceed. The formation is ready for formation review."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-078` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
