# Aggregate Formation Review - BANDIT-086

contract_version: 1
work_item: BANDIT-086
reviewer: codex_pm
review_type: aggregate_formation_review
verdict: pass
findings_status: non_blocking
findings_disposition: Local Qwen MLX adapter passed with informational notes only; CodeRabbit timed out after the full 10-minute window and is accepted only as provider-timeout replacement evidence; CodeRabbit partial minor finding was repaired; deterministic Repo PM inspection found no Stage 1 formation blockers
source_head: ff2bd42
reviewed_at: 2026-06-09T21:33:52Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is
`.bandit/reviewers/local-qwen.json` through `node
bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`.

## Reviewed Evidence

- `docs/specs/BANDIT-086-coordination-primitive-completion-triage.json`
- `docs/work/BANDIT-086/brief.md`
- `docs/work/BANDIT-086/coordination-log.jsonl`
- `docs/work/BANDIT-086/qwen-formation-review.md`
- `docs/work/BANDIT-086/coderabbit-formation-review.md`

## Aggregate Verdict

Stage 1 formation passes.

`BANDIT-086` is a bounded non-product triage chore for the intake-derived
`WIL-COORDINATION-PRIMITIVE` proposal. Its purpose is to compare the accepted
2026-05-24 coordination primitive decision, landed Phase 6 coordination work,
later role/formation/coordination evidence, and current workflow needs, then
record a recommendation, missing-slice scope, no-action decision, or deferred
disposition. It does not implement new coordination primitive behavior, alter
source-of-truth authority, create State Index/local API work, start scheduler
or claim/worktree behavior, authorize guarded browser mutation, or start
unrelated Phase 8 work.

The work is authorized by current roadmap/context routing,
`.bandit/work-intake-ledger.json` entry `WIL-COORDINATION-PRIMITIVE`,
`FOLLOWUPS.md` deprecated source metadata, the accepted coordination primitive
decision, `CLEAN_CODE.md`, and Stage Rubrics. No open bootstrap gap blocks
formation.

## Stage 1 Checklist

- goal or non-product work: pass - the brief records `work_type: chore` and
  defines Coordination Primitive Completion Triage as bounded non-product work.
- origin/source authority: pass - source authority is traced to
  `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/work-intake-ledger.json`,
  `FOLLOWUPS.md`, the 2026-05-24 coordination primitive decision,
  `CLEAN_CODE.md`, and Stage Rubrics.
- scope: pass - the work is limited to evidence review, recommendation,
  missing-slice scope, no-action, or deferred disposition.
- out of scope: pass - new coordination implementation, canonical shared
  transition state, local API, State Index, scheduler, heartbeat mutation,
  claim/worktree lifecycle, browser mutation authority, PR/CI workflow, merge,
  push, deploy, paid routing, hosted services, public benchmark publication,
  Trust Verifier cutover, cross-repo runtime work, and unrelated Phase 8 work
  are excluded.
- acceptance criteria: pass - criteria are verifiable and cover current
  source-of-truth policy preservation, source-cited evidence review,
  actor-event non-authority, derived projection boundaries, operator-owned
  approval halts, and future-scope requirements if implementation is
  recommended.
- test/verification plan: pass - Stage 1 validation and later RED,
  coordination, cockpit/session-context, work-intake, operator-boundary,
  typecheck, Bandit, derived-status, review, landing, and closeout checks are
  recorded.
- CLEAN_CODE.md read evidence: pass - read evidence is recorded for 2026-06-09
  and clean-code compliance is made evaluable.
- bootstrap gaps or no-gap disposition: pass - no open bootstrap gap blocks the
  chore; WIL-COORDINATION-PRIMITIVE is correctly identified as a Work Intake
  Ledger proposal, not a bootstrap-gap ledger item.
- expected files and required evidence: pass - brief lists Stage 1 evidence and
  future-stage artifact families while forbidding premature future-stage
  artifact creation in this automation.
- stage capability scope: pass - role authority, required skills, forbidden
  actions, and token-cost failsafe are recorded.
- operator-input status: pass - no operator-owned input is required for Stage 1
  formation; product, policy, State Index timing, local API, scheduler,
  claim/worktree, guarded browser action execution, PR/CI/CD,
  merge/push/deploy, cross-repo runtime, business, cost/risk, Trust Verifier,
  paid routing, hosted service, public benchmark publication, and
  ambiguous-scope decisions remain halt conditions.
- Permanent Test Ownership Boundary: pass - Stage 3 Writer cannot edit tests,
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence, or
  policy acceptance criteria.
- Bootstrap Model-Family Separation: pass - Codex-authored RED evidence
  requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- source-of-truth and projection boundary: pass - per-work-item coordination
  logs remain canonical append-only coordination history; actor coordination
  events remain advisory unless accepted into workflow state by CLI validation
  or Codex PM policy; derived projections remain non-authoritative.
- Formation boundary: pass - `brief_created` coordination evidence exists and
  Work Item PM, RED evidence, implementation, review, landing, UAT, and
  closeout remain blocked until `formation_approved`.

## Reviewer Results

| Reviewer | Verdict | Findings status | Disposition |
| --- | --- | --- | --- |
| Local Qwen via MLX adapter | pass | informational_notes_only | Accepted as baseline adversarial formation review evidence. |
| CodeRabbit CLI | bootstrap_gap | partial_minor_finding_repaired | Provider timed out after the full 10-minute window; accepted only as replacement evidence with no CodeRabbit pass claimed. |

## Findings

### CodeRabbit Provider Timeout

Finding verdict: bootstrap_gap

Disposition: accepted only as provider-timeout replacement evidence. CodeRabbit
reached setup/analyzing/reviewing and emitted reviewing heartbeats, but did
not return a terminal review before the full required 10-minute timeout; no
CodeRabbit pass is claimed.

### CodeRabbit Partial Minor Finding

Finding verdict: non_blocking

Disposition: repaired. CodeRabbit emitted one partial minor finding before
timeout asking for `docs/work/BANDIT-086/qwen-formation-review.md` to replace a
placeholder command with the concrete Qwen formation-review pipeline. The
artifact now records the concrete `printf`/`sed` pipeline that reads the source
spec, brief, coordination log, routing rule, and pipes the packet to
`timeout 240 node bin/omlx-chat-completions.mjs -`.

### Local Qwen Formation Pass

Finding verdict: pass

Disposition: the endpoint preflight passed, and Local Qwen returned a Stage 1
formation pass through the authorized MLX adapter route with no blockers or
actionable non-blocking findings.

## Summary

`BANDIT-086` has adequate Stage 1 formation evidence to proceed. The brief is
narrow, source-backed, verifiable, clean-code/rubric evaluable, and preserves
per-work-item coordination-log authority, actor-event non-authority, derived
projection boundaries, Stage Capability Scope, Permanent Test Ownership
Boundary, Bootstrap Model-Family Separation, Local Qwen MLX adapter routing,
and operator-owned product/UAT/policy/business/cost/risk boundaries.

The next recorded action should be Repo PM approval via
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-086`. Work Item PM must
not write an orchestration plan, write RED evidence, dispatch implementation,
approve UAT, land work, merge, push, deploy, or start unrelated Phase 8 slices
until the CLI-owned `formation_approved` transition is recorded.
