# BANDIT-085 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

This work item is a non-product transition-index decision chore. Stage 2 does
not authorize source-code implementation. The testable contract for Stage 3 is
a source-cited triage delivery artifact that records a recommendation,
follow-up implementation scope, explicit no-action decision, or deferred
disposition without implementing or approving a repo-wide transition index.

## RED / Disposition Verification Plan

Stage 3 delivery must fail closed unless the artifact satisfies all of these
checks:

1. It cites the source proposal `WIL-REPO-WIDE-TRANSITION-INDEX` from
   `.bandit/work-intake-ledger.json` and `FOLLOWUPS.md`.
2. It cites current routing evidence from `docs/roadmap/CURRENT_CONTEXT.md`,
   `docs/roadmap/ROADMAP.md`, `STATUS.md`, `docs/work/BANDIT-085/brief.md`,
   and `docs/work/BANDIT-085/orchestration-plan.md`.
3. It cites recent landed coordination evidence from per-work-item
   `coordination-log.jsonl` files, including at least `BANDIT-081`,
   `BANDIT-082`, `BANDIT-083`, and `BANDIT-084`, to identify whether current
   cockpit, queue/context, closeout, or cross-work-item queries have concrete
   pressure that existing per-work-item logs and derived projections do not
   satisfy.
4. It cites existing derived projection surfaces, including cockpit status,
   session-context, work-intake validation/listing, queue/context sources, and
   improvement-health or heartbeat-adjacent status, and distinguishes them from
   canonical transition history.
5. It states that current source-of-truth policy remains unchanged:
   per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files are
   canonical append-only Step Transition Ledgers; cockpit, session-context,
   intake, queue/context, heartbeat/improvement-health reports, roadmap text,
   generated summaries, static previews, browser state, caches, databases, and
   any future repo-wide index are projections unless a later operator-approved
   policy changes that boundary.
6. It compares a rebuildable derived transition index against the risks of a
   repo-wide canonical hot file, duplicate source-of-truth state, stale
   projection trust, hidden workflow authority, review-locality loss, and
   unnecessary scheduler or cockpit coupling.
7. It records one of: bounded recommendation, future follow-up implementation
   scope, explicit no-action decision, or deferred disposition.
8. If it recommends future implementation, it names derived-only rebuild
   contract, source artifact list, freshness/staleness rules, validation
   behavior, failure messages, expected RED tests, review gates, and explicit
   non-goals.
9. If it determines a canonical repo-wide transition ledger, State Index, local
   API, scheduler, claim/worktree lifecycle, guarded browser action authority,
   merge/push/deploy, Trust Verifier cutover, paid routing, hosted service, or
   product-policy approval is needed, it halts at the operator-owned gate and
   states the exact decision required instead of guessing.

No RED source tests are added in Stage 2 because the next delivery can be
verified from a bounded evidence artifact. If Stage 3 recommends a concrete
validator, report, projection, or policy artifact, that future work must create
focused RED tests before implementation.

## Acceptance Criteria Mapping

| Criterion | Evidence required from Stage 3 |
| --- | --- |
| `WIL-REPO-WIDE-TRANSITION-INDEX` is the authorized intake-derived proposal after `BANDIT-084` closeout. | Stage 3 must cite `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `BANDIT-084` closeout evidence. |
| Current source-of-truth policy remains unchanged during triage. | Stage 3 must explicitly preserve canonical per-work-item coordination logs and non-canonical projection status for derived status, queue, cockpit, session-context, intake, and reports. |
| Evidence review covers concrete query pressure. | Stage 3 must cite current cockpit/session-context outputs, work-intake output, queue/context source, improvement-health or heartbeat-adjacent evidence, and recent coordination logs. |
| Derived index benefits and risks are compared. | Stage 3 must evaluate faster cockpit queries, cross-work-item reporting, and heartbeat/scheduler pressure against hot-file, duplicate-authority, stale-projection, review-locality, and coupling risk. |
| Landing requires a recommendation, follow-up scope, no-action decision, or deferred disposition. | Stage 3 delivery must produce `repo-wide-transition-index-disposition.md` before Stage 4 review. |
| Future implementation scope is narrow if recommended. | Stage 3 must name source artifacts, rebuild/freshness rules, validation behavior, expected tests, review gates, and non-goals. |
| Operator-owned decisions remain operator-owned. | Stage 3 must halt instead of guessing if approval is needed for canonical repo-wide transition authority, State Index, local API, scheduler, claim/worktree, guarded browser actions, merge/push/deploy, Trust Verifier cutover, paid routing, hosted services, product, policy, business, or cost/risk posture. |
| No Stage 2 or Stage 3 artifact implements forbidden surfaces. | Stage 3 must not create source code, database/cache/index writers, local API, State Index, scheduler, claim/worktree, browser mutation, merge/push/deploy, hosted service, paid routing, or unrelated Phase 8 artifacts. |
| Role and model-family boundaries are preserved. | Stage 3 Writer has no test-edit authority and must be a different model family because Codex authored this Stage 2 evidence. |

## Verification Commands

```sh
node ./bin/bandit.mjs coordination validate BANDIT-085
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Focused source tests are required later only if Stage 3 or a follow-up work
item changes command routing, coordination validation, derived projections,
work-intake state, operator-boundary behavior, policy validators, source code,
dependencies, package scripts, or artifact renderers.

## Next Action

Dispatch Stage 3 triage delivery to Claude-family Implementation Writer. The
Writer must produce the bounded repo-wide transition-index recommendation or
disposition and supporting evidence without editing Test Writer-owned surfaces,
formation evidence, review evidence, landing evidence, retrospective evidence,
canonical coordination history, intake authority, scheduler behavior,
claim/worktree lifecycle, local API, State Index, merge, push, deploy, paid
routing, hosted services, public benchmark publication, Trust Verifier cutover,
guarded browser action authority, or unrelated Phase 8 product work.

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored this RED/disposition evidence.
- RED author model family: `codex`.
- Codex materially edited tests: `false`; no source test files were added.
- Codex materially authored Stage 2 acceptance mapping: `true`.
- Acceptance mapping owner: Test Writer.
- Stage 3 test-edit authority: `none`.
- Stage 3 Writer routing: because Codex authored Stage 2 evidence and
  acceptance mapping, Stage 3 must route to a different model family through
  the Claude-family bootstrap implementation-writer path unless Claude auth
  fails or times out after the required 20-minute window; fallback is
  MiniMax-M3 through headless `pi`.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, retrospective evidence, or policy acceptance criteria for
  `BANDIT-085`.
