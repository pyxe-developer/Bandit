# Qwen Formation Review - BANDIT-081

contract_version: 1
work_item: BANDIT-081
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: d9d8920
reviewed_at: 2026-06-09T03:13:01Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- product work present: pass - the brief records `work_type: slice` and
  describes the bounded Operator Attention / Operator Inbox cockpit product
  slice.
- source provenance clear: pass - the brief traces to roadmap/current-context
  state, accepted PRD-003/design artifacts, the prototype Operator Inbox
  surface, `CONTEXT.md` Operator Inbox glossary, `BANDIT-080` closeout
  evidence, current cockpit source, `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the slice is limited to a read-only,
  presentation-derived operator-attention and Operator Inbox surface.
- out-of-scope boundaries explicit: pass - inbox write/resolve/archive,
  notification delivery, browser-side CLI execution, approval storage, UAT
  approval, landing decision, local API, State Index, live polling,
  scheduler/claim/worktree behavior, merge, push, deploy, Trust Verifier
  cutover, benchmark publication, policy changes, cost/risk overrides,
  external services, and unrelated cockpit scope are excluded.
- acceptance criteria are verifiable: pass - criteria cover operator-attention
  rows, absent inbox artifacts, fixture-backed message rendering, distinct
  attention versus inbox framing, source traceability, no hidden authority,
  responsive behavior, accessibility, UAT, and review gates.
- verification plan present: pass - Stage 1 through Stage 6 evidence paths and
  stage-specific checks are listed, including RED tests before implementation.
- CLEAN_CODE.md read evidence present: pass - the brief records
  `CLEAN_CODE.md` read evidence dated 2026-06-09 and makes clean-code
  compliance evaluable.
- bootstrap gap disposition present: pass - the brief records that no open
  bootstrap gap blocks this Phase 8 product slice, and treats missing inbox
  files as an empty-source condition rather than permission to invent messages.
- expected files and required evidence present: pass - the brief lists expected
  source/test/artifact surfaces and required work-item evidence.
- stage capability scope present: pass - authority roles, required skills,
  allowed tools, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation; product/UAT/policy/business/cost/risk changes,
  benchmark publication, inbox write/resolve/archive semantics, notification
  delivery, guarded execution, Trust Verifier cutover, merge/push/deploy, and
  ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit tests, helpers, fixtures, RED evidence, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists
  and Work Item PM, RED, and implementation remain blocked until
  `formation_approved`.
- CLI Authority preserved: pass - the cockpit may display derived
  operator-attention and inbox state but no browser-side execution, artifact
  mutation, inbox resolution, operator-response recording, UAT approval,
  landing decision, scheduling, merge, push, deploy, benchmark publication, or
  policy override is authorized.
- Local Qwen route preserved: pass - the review used
  `.bandit/reviewers/local-qwen.json` through
  `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 10 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
<BANDIT-081 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md, docs/plans/BOOTSTRAP_METHODOLOGY.md, docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md, docs/design/workflow-cockpit/design-review.md, docs/design/workflow-cockpit-boundary.md, CONTEXT.md, docs/specs/BANDIT-081-operator-attention-inbox-surface.json, docs/work/BANDIT-081/brief.md, and docs/work/BANDIT-081/coordination-log.jsonl> | node bin/omlx-chat-completions.mjs
```

The adapter posts to `http://127.0.0.1:8000/v1/chat/completions` with model
`Qwen3.6-35B-A3B-MLX-8bit` and returns the model response as JSON.

Result:

```json
{
  "verdict": "pass",
  "findings_status": "none",
  "findings": [],
  "summary": "Stage 1 brief satisfies all STAGE_RUBRICS criteria. Authority boundaries, CLEAN_CODE.md evidence, source-of-truth/projection separation, and bootstrap gap handling are explicit and aligned with repo facts. Local Qwen routing is correctly constrained. Ready for Repo PM formation approval."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-081` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
