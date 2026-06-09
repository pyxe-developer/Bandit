# Qwen Formation Review - BANDIT-084

contract_version: 1
work_item: BANDIT-084
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: no_findings
findings_disposition: none
source_head: 5f24575
reviewed_at: 2026-06-09T17:33:57Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and
  defines a bounded Claim-First Transition Policy Triage chore.
- source provenance clear: pass - source authority traces to current
  roadmap/context, `.bandit/work-intake-ledger.json` entry `WIL-CLAIM-FIRST`,
  `FOLLOWUPS.md`, accepted claim-authority evidence, `CLEAN_CODE.md`, and
  Stage Rubrics.
- scope is narrow and bounded: pass - the work is limited to triaging whether
  every post-bootstrap transition should require an explicit prior claim and
  recording a recommendation, follow-up scope, no-action, or deferred
  disposition.
- out-of-scope boundaries explicit: pass - universal claim-first policy
  approval, claim authority changes, claim operations, worktree lifecycle,
  scheduler behavior, merge, push, deploy, paid routing, hosted services, Trust
  Verifier cutover, and unrelated Phase 8 work are excluded.
- acceptance criteria are verifiable: pass - criteria cover source-cited
  evidence review, current-policy preservation, coordination versus
  claim-authority separation, operator-owned policy halt, and future-scope
  requirements if implementation is recommended.
- verification plan present: pass - Stage 1 validation and later RED,
  coordination, claim-authority, operator-boundary, work-intake, and standard
  Bandit verification paths are listed.
- CLEAN_CODE.md read evidence present: pass - read evidence is recorded for
  2026-06-09 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - no open bootstrap gap blocks this
  intake-derived triage chore; WIL-CLAIM-FIRST is identified as Work Intake
  Ledger proposal state rather than a bootstrap-gap ledger entry.
- expected files and required evidence present: pass - the brief lists Stage 1
  evidence and future-stage artifact families while forbidding creation of
  future-stage artifacts in this run.
- stage capability scope present: pass - authority roles, required skills,
  token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation, but universal claim-first policy approval and related
  policy/cost/risk/deploy decisions remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit Test Writer-owned surfaces or policy acceptance criteria.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- claim authority boundary preserved: pass - append-only coordination history,
  Git refs writable claim authority, and `.bandit` or cockpit projections are
  explicitly separated.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists
  and Work Item PM, RED, implementation, review, landing, UAT, and closeout
  remain blocked until `formation_approved`.
- Local Qwen route preserved: pass - the review used
  `.bandit/reviewers/local-qwen.json` through
  `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
<BANDIT-084 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md,
docs/verification/STAGE_RUBRICS.md, docs/roadmap/CURRENT_CONTEXT.md,
docs/roadmap/ROADMAP.md, .bandit/work-intake-ledger.json, FOLLOWUPS.md,
docs/specs/BANDIT-084-claim-first-transition-policy-triage.json,
docs/work/BANDIT-084/brief.md, and
docs/work/BANDIT-084/coordination-log.jsonl> | timeout 300 node
bin/omlx-chat-completions.mjs -
```

Result:

```json
{
  "verdict": "pass",
  "findings_status": "no_findings",
  "findings_disposition": "none",
  "findings": [],
  "summary": "Stage 1 formation package for BANDIT-084 is complete and compliant. The brief correctly scopes the work as a non-product triage chore, explicitly forbids universal claim-first policy approval, preserves test ownership and model-family separation boundaries, and aligns with all Stage 1 rubric requirements. No blockers or gaps identified. Ready for formation review routing."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-084` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
