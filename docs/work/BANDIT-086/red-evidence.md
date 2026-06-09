# BANDIT-086 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

This work item is a non-product coordination primitive completion triage chore.
Stage 2 does not authorize source-code implementation. The testable contract
for Stage 3 is a source-cited triage delivery artifact that records a
recommendation, missing-slice scope, explicit no-action decision, or deferred
disposition without implementing or approving new coordination primitive
behavior.

## RED / Disposition Verification Plan

Stage 3 delivery must fail closed unless the artifact satisfies all of these
checks:

1. It cites the source proposal `WIL-COORDINATION-PRIMITIVE` from
   `.bandit/work-intake-ledger.json` and the deprecated source metadata in
   `FOLLOWUPS.md`.
2. It cites the accepted coordination primitive decision in
   `docs/decisions/2026-05-24-coordination-primitive-state-ledger.md`.
3. It cites current routing evidence from `docs/roadmap/CURRENT_CONTEXT.md`,
   `docs/roadmap/ROADMAP.md`, `STATUS.md`, `docs/work/BANDIT-086/brief.md`,
   and `docs/work/BANDIT-086/orchestration-plan.md`.
4. It cites landed coordination primitive evidence from `BANDIT-025`,
   `BANDIT-026`, `BANDIT-028`, and later role/formation/coordination evidence,
   including per-work-item `coordination-log.jsonl` files and current
   cockpit/session-context outputs.
5. It compares the accepted coordination primitive design against landed
   capabilities: per-work-item append-only coordination logs, step transitions,
   actor coordination events, shared lifecycle state, typed slice/chore
   extensions, derived current-state views, safe triggers,
   formation-approved execution boundaries, and closeout semantics.
6. It states that current source-of-truth policy remains unchanged:
   per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files are
   canonical append-only coordination history; step transitions are
   authoritative lifecycle state; actor events, cockpit, session-context,
   queue/context, intake, roadmap, browser, report, cache, database, and index
   surfaces are non-authoritative projections unless accepted by CLI validation
   or later operator-approved policy.
7. It records one of: bounded recommendation, future missing-slice scope,
   explicit no-action decision, or deferred disposition.
8. If it recommends future implementation, it names the exact missing
   coordination primitive requirement, source artifacts, canonical
   coordination-history boundary, derived projection boundary, validation
   behavior, failure messages, expected RED tests, review gates, expected
   files, and explicit non-goals.
9. If it determines operator-owned approval is needed for product direction,
   policy change, State Index timing, local API work, scheduler execution,
   claim/worktree lifecycle, guarded browser action execution, PR/CI/CD,
   merge/push/deploy, public benchmark publication, paid routing, hosted
   service, Trust Verifier cutover, cross-repo coordination runtime, business
   tradeoff, or explicit cost/risk posture, it halts at that gate and states
   the exact decision required instead of guessing.

No RED source tests are added in Stage 2 because the next delivery can be
verified from a bounded evidence artifact. If Stage 3 recommends a concrete
command, validator, state-machine extension, report, projection, policy
artifact, or source implementation, that future work must create focused RED
tests before implementation.

## Acceptance Criteria Mapping

| Criterion | Evidence required from Stage 3 |
| --- | --- |
| `WIL-COORDINATION-PRIMITIVE` is the authorized intake-derived gap proposal after `BANDIT-085` closeout. | Stage 3 must cite `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `BANDIT-085` closeout evidence. |
| Current source-of-truth policy remains unchanged during triage. | Stage 3 must explicitly preserve canonical per-work-item coordination logs and non-canonical projection status for actor events, derived status, queue, cockpit, session-context, intake, reports, browser state, cache, database, and indexes. |
| Evidence review covers accepted design and landed capabilities. | Stage 3 must cite the 2026-05-24 coordination primitive decision plus `BANDIT-025`, `BANDIT-026`, `BANDIT-028`, later role/formation coordination evidence, and current derived status outputs. |
| Landing requires a recommendation, missing-slice scope, no-action decision, or deferred disposition. | Stage 3 delivery must produce `coordination-primitive-completion-disposition.md` before Stage 4 review. |
| Future implementation scope is narrow if recommended. | Stage 3 must name exact missing requirement, source artifacts, canonical and derived boundaries, validation behavior, expected tests, review gates, expected files, and non-goals. |
| Operator-owned decisions remain operator-owned. | Stage 3 must halt instead of guessing if approval is needed for product, policy, State Index, local API, scheduler, claim/worktree, guarded browser action, PR/CI/CD, merge/push/deploy, Trust Verifier cutover, paid routing, hosted services, public benchmark, cross-repo runtime, business, or cost/risk posture. |
| No Stage 2 or Stage 3 artifact implements forbidden surfaces. | Stage 3 must not create source code, new coordination commands, validators, state-machine transitions, database/cache/index writers, local API, State Index, scheduler, claim/worktree, browser mutation, PR/CI/CD, merge/push/deploy, hosted service, paid routing, or unrelated Phase 8 artifacts. |
| Role and model-family boundaries are preserved. | Stage 3 Writer has no test-edit authority and must be a different model family because Codex authored this Stage 2 evidence. |

## Verification Commands

```sh
node ./bin/bandit.mjs coordination validate BANDIT-086
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Focused source tests are required later only if Stage 3 or a follow-up work
item changes command routing, coordination validation, derived projections,
work-intake state, operator-boundary behavior, policy validators, source code,
dependencies, package scripts, artifact renderers, scheduler behavior,
claim/worktree lifecycle, State Index behavior, local API, or browser workflow
mutation.

## Next Action

Dispatch Stage 3 triage delivery to Claude-family Implementation Writer. The
Writer must produce the bounded coordination primitive completion
recommendation or disposition and supporting evidence without editing Test
Writer-owned surfaces, formation evidence, review evidence, landing evidence,
UAT evidence, retrospective evidence, canonical coordination history, intake
authority, scheduler behavior, claim/worktree lifecycle, local API, State
Index, PR/CI/CD, merge, push, deploy, paid routing, hosted services, public
benchmark publication, Trust Verifier cutover, guarded browser action
authority, cross-repo runtime behavior, or unrelated Phase 8 product work.

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
  `BANDIT-086`.
