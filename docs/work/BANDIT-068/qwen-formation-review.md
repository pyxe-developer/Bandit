# Qwen Formation Review - BANDIT-068

contract_version: 1
work_item: BANDIT-068
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: non_blocking
findings_disposition: MLX adapter review found one minor documentation note about skill lifecycle binding; accepted as non-blocking because the brief names required skills, references existing stage-capability policy, and defers no Stage 1 blocker
source_head: 4055146
reviewed_at: 2026-06-07T19:10:24Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- work_type present and correct: pass - the brief records `work_type: slice` and defines an operator-facing Phase 8 product slice.
- source provenance clear: pass - the brief traces to current roadmap context, accepted cockpit PRD/design artifacts, cockpit boundary, `BANDIT-067` closeout, current cockpit status/view-model/browser shell code, `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the slice is limited to source-linked evidence drilldown and gate matrix presentation derived from CLI/repo evidence.
- acceptance criteria are verifiable: pass - criteria name gate-matrix derivation, evidence-detail mapping, visible fail-closed states, source traceability, guarded action boundaries, clean-code separation, responsive checks, accessibility checks, UAT, review, and forbidden surfaces.
- out-of-scope boundaries explicit: pass - browser-side CLI execution, local APIs, live polling, State Index, SQLite, scheduler, claim/worktree lifecycle, PR/CI, merge, push, deploy, external services, Trust Verifier cutover, dependency/lockfile/package script changes, and unrelated cockpit features are excluded.
- operator input status recorded: pass - no operator-owned input is needed for Stage 1 formation; CLI-owned product UAT is required before landing, and product/policy/cost/risk/cutover/deploy decisions remain halt conditions.
- role boundary evidence present: pass - Repo PM, Work Item PM, Test Writer, Implementation Writer, Reviewer, Landing Agent, Closeout Agent, and operator authorities are named.
- write-surface families declared: pass - expected files cover the source spec, work package, cockpit source/test surfaces, static preview files, roadmap, status, and required evidence.
- Test Writer boundary explicit: pass - Stage 2 RED tests, test helpers, fixtures, RED evidence, and acceptance mappings are Test Writer-owned.
- Implementation Writer boundary explicit: pass - Stage 3 source implementation is routed to Claude if Codex authors RED evidence and has no test-surface authority.
- CLEAN_CODE.md read evidence present: pass - the brief records `CLEAN_CODE.md` read evidence dated 2026-06-07 and makes clean-code compliance evaluable before landing.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists, formation review artifacts are being recorded, and Work Item PM execution remains blocked until `formation_approved`.
- CLI Authority preserved: pass - `bandit cockpit status --json` and repo-native artifacts are the evidence authority, guarded actions remain request-only, and the UI cannot invoke CLI commands or write canonical evidence.
- browser non-authority boundary preserved: pass - generated/static payloads, browser process, preview files, fixture data, local cache, browser storage, State Index, and generated UI state are explicitly non-canonical.
- Permanent Test Ownership Boundary preserved: pass - the Stage 3 Writer cannot edit tests, helpers, fixtures, RED evidence, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED evidence requires Claude-family Stage 3 implementation during bootstrap.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured
`Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
node -e '<build BANDIT-068 formation packet from repo artifacts>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings": [
    "All Stage 1 required evidence fields are present and explicit, including Goal, Scope, Out of Scope, Acceptance Criteria, Test Plan, CLEAN_CODE.md read evidence, Bootstrap Gaps, Expected Files, Implementation Order, Stage Capability Scope, and Token-Cost Failsafe.",
    "Role boundaries and operator-blocking fail-closed boundaries are clearly defined, ensuring Codex PM retains technical routing authority and the operator is only consulted for genuine product/policy tradeoffs.",
    "Projection vs. canonical authority boundary is explicitly enforced: browser state, generated payloads, and UI components are strictly non-canonical and rebuildable from repo-native artifacts.",
    "Bootstrap model-family separation and permanent test ownership boundaries are correctly stated, aligning with AGENTS.md and CLEAN_CODE.md mandates.",
    "Skill lifecycle contracts are referenced via external policy rather than detailed inline; this is a minor documentation gap to be resolved during Stage 2/3 skill binding or via existing policy, but does not block formation.",
    "All Stage 1 rubric blockers are either explicitly addressed, correctly marked as out of scope, or handled via fail-closed operator gates and CLI-owned mechanical repair paths."
  ],
  "summary": "The BANDIT-068 brief satisfies all Stage 1 requirements. It provides a clear, verifiable contract with explicit scope boundaries, fail-closed operator gates, and strict separation between browser presentation state and canonical workflow authority. CLEAN_CODE.md compliance is acknowledged, and all Stage 1 rubric blockers are either addressed, out of scope, or explicitly handled. The brief is ready for formation review.",
  "confidence": "high"
}
```

## Findings

### Skill Lifecycle Binding Detail

verdict: non_blocking

Disposition: accepted as non-blocking for Stage 1 formation. The brief names
required skills and references the existing stage-capability policy. This
slice does not create or change a load-bearing skill contract, and Stage 2/3
execution packets can bind the already named skills without expanding Stage 1
scope.

## Summary

Local Qwen formation review for `BANDIT-068` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
