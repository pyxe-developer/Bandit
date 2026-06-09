# Qwen Formation Review - BANDIT-082

contract_version: 1
work_item: BANDIT-082
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: none
findings_disposition: no blockers or non-blocking findings
source_head: 8d24244
reviewed_at: 2026-06-09T10:47:55Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- product/workflow work present: pass - the brief records `work_type: slice`
  and defines the bounded Work Intake Ledger And Followups Migration slice.
- source provenance clear: pass - the brief traces to repo-level routing,
  `FOLLOWUPS.md`, the UI-polish source note, `BANDIT-022` follow-up
  candidates, PRD-002 Work Intake Ledger text, `CONTEXT.md`, `BANDIT-081`
  closeout evidence, `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the slice is limited to v0 intake ledger
  schema, migration, validation/listing, deprecation guardrails, and routing.
- out-of-scope boundaries explicit: pass - full triage skill, claimability,
  scheduler, claims, worktrees, local API, State Index, browser mutation,
  merge, push, deploy, Trust Verifier cutover, public benchmark publication,
  paid routing, and V0 trial execution are excluded.
- acceptance criteria are verifiable: pass - criteria cover source-preserving
  imports, transition history, deterministic ordering, deprecated
  `FOLLOWUPS.md` refusal, proposal-not-claimable boundaries, and review gates.
- verification plan present: pass - Stage 1 through Stage 6 checks are listed,
  including RED evidence before implementation.
- CLEAN_CODE.md read evidence present: pass - read evidence is recorded for
  2026-06-09 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - no open bootstrap gap blocks the
  slice, and future Work Intake Triage Skill / claimability / V0 trial work is
  explicitly left outside this slice.
- expected files and required evidence present: pass - the brief lists expected
  source, test, CLI, ledger, roadmap, status, and work-item evidence surfaces.
- stage capability scope present: pass - authority roles, required skills,
  allowed tools, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation; product/policy/business/cost/risk, merge/push/deploy,
  public benchmark publication, paid routing, hosted service, Trust Verifier
  cutover, guarded action, local API, State Index, and ambiguous scope remain
  halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit tests, helpers, fixtures, RED evidence, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- Work Intake Ledger boundary preserved: pass - imported proposals remain
  non-claimable and cannot allocate Work Item IDs, start Work Item PM
  orchestration, acquire claims, or bypass normal Stage 1 formation.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists
  and Work Item PM, RED, and implementation remain blocked until
  `formation_approved`.
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
<BANDIT-082 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md,
docs/verification/STAGE_RUBRICS.md, docs/plans/BOOTSTRAP_METHODOLOGY.md,
docs/roadmap/CURRENT_CONTEXT.md, docs/roadmap/ROADMAP.md, STATUS.md,
FOLLOWUPS.md, docs/design/workflow-cockpit/bandit-ui-polish-source.md,
docs/work/BANDIT-022/follow-up-chores.md,
docs/specs/BANDIT-082-work-intake-ledger-and-followups-migration.json,
docs/work/BANDIT-082/brief.md, and
docs/work/BANDIT-082/coordination-log.jsonl> | node
bin/omlx-chat-completions.mjs
```

Result:

```json
{
  "verdict": "pass",
  "findings_status": "none",
  "findings": [],
  "summary": "Stage 1 formation for BANDIT-082 is complete and compliant. The goal, scope, and out-of-scope boundaries are clearly defined and narrow. Source authority is explicit and repo-backed. Acceptance criteria are specific and verifiable. A detailed test plan and verification plan are present. CLEAN_CODE.md read evidence is recorded. Bootstrap gaps are explicitly listed. Stage capability scope, operator input status, permanent test ownership boundary, bootstrap model-family separation, and source-of-truth/projection boundaries are all explicit. Imported proposals are correctly constrained to non-claimable status and cannot bypass Stage 1. Local Qwen routing is correctly specified through the authorized path. No blockers or non-blocking findings identified. Proceed to Stage 2."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-082` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
