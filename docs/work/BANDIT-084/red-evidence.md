# BANDIT-084 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

This work item is a non-product policy triage chore. Stage 2 does not authorize
source-code implementation yet. The testable contract for Stage 3 is a
source-cited triage delivery artifact that records a recommendation,
follow-up scope, explicit no-action decision, or deferred disposition without
approving universal claim-first policy or changing claim authority.

## RED / Disposition Verification Plan

Stage 3 delivery must fail closed unless the artifact satisfies all of these
checks:

1. It cites the source proposal `WIL-CLAIM-FIRST` from
   `.bandit/work-intake-ledger.json` and `FOLLOWUPS.md`.
2. It cites landed coordination evidence from recent closed work items,
   including per-work-item coordination logs that record accountable actors for
   stage transitions.
3. It cites accepted claim-authority evidence from
   `docs/decisions/2026-05-27-git-refs-claim-authority-backend.md`,
   `.bandit/policy/claim-authority.json`, `.bandit/claims/README.md`, and
   `docs/templates/claim-authority.md`.
4. It distinguishes append-only coordination history from active writable claim
   authority.
5. It states that current policy remains unchanged: every step transition needs
   an accountable actor, while an explicit prior claim event is required only
   for delegated or asynchronous work unless a later operator-approved policy
   changes that boundary.
6. It forbids `.bandit` claim projections, cockpit/status views, roadmap text,
   intake-ledger entries, generated reports, tests, or browser state from
   granting, renewing, releasing, completing, blocking, failing, recovering, or
   reconciling writable claims.
7. It records one of: bounded recommendation, future follow-up scope, explicit
   no-action decision, or deferred disposition.
8. If it recommends future implementation, it names narrow artifact/validator
   scope, RED test targets, claim safety invariants or non-applicability
   rationale, stage capability boundaries, operator-owned approval gates, and
   non-goals.
9. If it determines universal claim-first policy approval is needed, it halts
   at the operator-owned policy gate and states the exact decision required.

No RED source tests are added in Stage 2 because the next delivery can be
verified from a bounded evidence artifact. If Stage 3 recommends a concrete
validator or policy artifact, that future work must create focused RED tests
before implementation.

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| WIL-CLAIM-FIRST is identified as the authorized intake-derived gap after `BANDIT-083` closeout. | Stage 3 must cite `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, `CURRENT_CONTEXT.md`, and `ROADMAP.md` source routing. |
| Current policy remains unchanged during triage. | Stage 3 must explicitly state the accountable-actor versus explicit-claim boundary and may not approve universal claim-first policy. |
| Evidence review covers coordination logs and claim-authority artifacts. | Stage 3 must cite recent coordination logs plus the accepted Git refs CAS claim-authority decision, policy, projection README, and template. |
| Append-only coordination history is separated from writable claim authority. | Stage 3 must classify coordination logs as canonical workflow history and Git refs CAS as writable claim authority. |
| Projections cannot grant claims. | Stage 3 must record `.bandit` claim files, cockpit/status, roadmap, intake ledger, generated reports, tests, and browser state as projection/source material only. |
| Landing requires a recommendation, follow-up scope, no-action decision, or deferred disposition. | Stage 3 delivery must produce the recorded triage disposition before Stage 4 review. |
| Future implementation scope is narrow if recommended. | Stage 3 must name validator/artifact scope, RED tests, claim-safety rationale, operator gates, and non-goals for any future implementation. |
| Universal claim-first policy approval is operator-owned. | Stage 3 must halt instead of guessing if it needs a policy decision that every transition must claim first. |
| Role and model-family boundaries are preserved. | Stage 3 Writer has no test-edit authority and must be a different model family because Codex authored this Stage 2 evidence. |

## Verification Commands

```sh
node ./bin/bandit.mjs coordination validate BANDIT-084
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Focused source tests are required later only if Stage 3 or a follow-up work item
changes command routing, claim authority, coordination validation,
operator-boundary behavior, work-intake state, or policy validators.

## Next Action

Dispatch Stage 3 triage delivery to Claude-family Implementation Writer. The
Writer must produce the bounded claim-first transition triage recommendation or
disposition and supporting evidence without editing Test Writer-owned surfaces,
formation evidence, review evidence, landing evidence, retrospective evidence,
claim authority, coordination history, scheduler behavior, worktrees, merge,
push, deploy, paid routing, hosted services, public benchmark publication, or
unrelated Phase 8 product work.

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
  `BANDIT-084`.
