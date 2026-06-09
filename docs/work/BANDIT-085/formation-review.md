# Aggregate Formation Review - BANDIT-085

contract_version: 1
work_item: BANDIT-085
reviewer: codex_pm
review_type: aggregate_formation_review
verdict: pass
findings_status: non_blocking
findings_disposition: Local Qwen MLX adapter passed with informational notes only; CodeRabbit timed out after the full 10-minute window and is accepted only as provider-timeout replacement evidence; deterministic Repo PM inspection found no Stage 1 formation blockers
source_head: 1f836d9
reviewed_at: 2026-06-09T19:10:53Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was installed
only for evaluation and is not an authorized option for Bandit work.

The only authorized Local Qwen route on this machine is
`.bandit/reviewers/local-qwen.json` through `node
bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`.

## Reviewed Evidence

- `docs/specs/BANDIT-085-repo-wide-transition-index-decision.json`
- `docs/work/BANDIT-085/brief.md`
- `docs/work/BANDIT-085/coordination-log.jsonl`
- `docs/work/BANDIT-085/qwen-formation-review.md`
- `docs/work/BANDIT-085/coderabbit-formation-review.md`

## Aggregate Verdict

Stage 1 formation passes.

`BANDIT-085` is a bounded non-product decision chore for the intake-derived
`WIL-REPO-WIDE-TRANSITION-INDEX` proposal. Its purpose is to inspect current
cockpit, heartbeat, coordination-log, queue/context, and cross-work-item
reporting evidence, then record a recommendation, follow-up scope, no-action
decision, or deferred disposition. It does not implement a repo-wide transition
index, alter source-of-truth authority, create State Index/local API work,
start scheduler or claim/worktree behavior, or start unrelated Phase 8 work.

The work is authorized by current roadmap/context routing,
`.bandit/work-intake-ledger.json` entry `WIL-REPO-WIDE-TRANSITION-INDEX`,
`FOLLOWUPS.md` deprecated source metadata, `CLEAN_CODE.md`, and Stage Rubrics.
No open bootstrap gap blocks formation.

## Stage 1 Checklist

- goal or non-product work: pass - the brief records `work_type: chore` and
  defines Repo-Wide Transition Index Decision as bounded non-product work.
- origin/source authority: pass - source authority is traced to
  `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/work-intake-ledger.json`,
  `FOLLOWUPS.md`, `CLEAN_CODE.md`, and Stage Rubrics.
- scope: pass - the work is limited to evidence review, recommendation,
  follow-up scope, no-action, or deferred disposition.
- out of scope: pass - repo-wide index implementation, canonical shared
  transition state, local API, State Index, scheduler, heartbeat mutation,
  claim/worktree lifecycle, browser mutation authority, PR/CI workflow, merge,
  push, deploy, paid routing, hosted services, public benchmark publication,
  Trust Verifier cutover, and unrelated Phase 8 work are excluded.
- acceptance criteria: pass - criteria are verifiable and cover current
  source-of-truth policy preservation, source-cited evidence review,
  derived-only rebuild/freshness requirements, operator-owned approval halts,
  and future-scope requirements if implementation is recommended.
- test/verification plan: pass - Stage 1 validation and later RED,
  coordination, cockpit/session-context, work-intake, operator-boundary,
  typecheck, Bandit, derived-status, review, landing, and closeout checks are
  recorded.
- CLEAN_CODE.md read evidence: pass - read evidence is recorded for 2026-06-09
  and clean-code compliance is made evaluable.
- bootstrap gaps or no-gap disposition: pass - no open bootstrap gap blocks the
  chore; WIL-REPO-WIDE-TRANSITION-INDEX is correctly identified as a Work
  Intake Ledger proposal, not a bootstrap-gap ledger item.
- expected files and required evidence: pass - brief lists Stage 1 evidence and
  future-stage artifact families while forbidding premature future-stage
  artifact creation in this automation.
- stage capability scope: pass - role authority, required skills, forbidden
  actions, and token-cost failsafe are recorded.
- operator-input status: pass - no operator-owned input is required for Stage 1
  formation; canonical repo-wide transition authority, State Index timing,
  local API, scheduler, claim/worktree, product, policy, business, cost/risk,
  Trust Verifier, merge/push/deploy, paid routing, hosted service, public
  benchmark publication, guarded action execution, and ambiguous-scope
  decisions remain halt conditions.
- Permanent Test Ownership Boundary: pass - Stage 3 Writer cannot edit tests,
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence, or
  policy acceptance criteria.
- Bootstrap Model-Family Separation: pass - Codex-authored RED evidence
  requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- source-of-truth and projection boundary: pass - per-work-item coordination
  logs remain canonical append-only transition history; any future repo-wide
  index must be derived, rebuildable, and non-authoritative unless a separate
  operator-owned policy decision changes that boundary.
- Formation boundary: pass - `brief_created` coordination evidence exists and
  Work Item PM, RED evidence, implementation, review, landing, UAT, and
  closeout remain blocked until `formation_approved`.

## Reviewer Results

| Reviewer | Verdict | Findings status | Disposition |
| --- | --- | --- | --- |
| Local Qwen via MLX adapter | pass | informational_notes_only | Accepted as baseline adversarial formation review evidence. |
| CodeRabbit CLI | bootstrap_gap | none | Provider timed out after the full 10-minute window; accepted only as replacement evidence with no CodeRabbit pass claimed. |

## Findings

### CodeRabbit Provider Timeout

Finding verdict: bootstrap_gap

Disposition: accepted only as provider-timeout replacement evidence. CodeRabbit
reached setup/analyzing/reviewing and emitted a reviewing heartbeat, but did
not return a terminal review before the full required 10-minute timeout; no
CodeRabbit pass is claimed.

### Local Qwen Formation Pass

Finding verdict: pass

Disposition: the endpoint preflight passed, and Local Qwen returned a Stage 1
formation pass through the authorized MLX adapter route with no blockers or
actionable non-blocking findings.

## Summary

`BANDIT-085` has adequate Stage 1 formation evidence to proceed. The brief is
narrow, source-backed, verifiable, clean-code/rubric evaluable, and preserves
per-work-item coordination-log authority, derived-only projection boundaries,
Stage Capability Scope, Permanent Test Ownership Boundary, Bootstrap
Model-Family Separation, Local Qwen MLX adapter routing, and operator-owned
product/UAT/policy/business/cost/risk boundaries.

The next recorded action should be Repo PM approval via
`node ./bin/bandit.mjs repo-pm approve-formation BANDIT-085`. Work Item PM must
not write an orchestration plan, write RED evidence, dispatch implementation,
approve UAT, land work, merge, push, deploy, or start unrelated Phase 8 slices
until the CLI-owned `formation_approved` transition is recorded.
