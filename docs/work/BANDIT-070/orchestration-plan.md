# BANDIT-070 Orchestration Plan

contract_version: 1
work_item: BANDIT-070
work_type: chore
orchestrator: work_item_pm
created_at: 2026-06-07
verdict_values: pass, blocker, non_blocking, not_applicable, bootstrap_gap

## Current Repo State

- verdict: pass
- evidence: `git status --short --branch` returned `## main...origin/main [ahead 1]` with no dirty files; `git log --oneline -5` shows `65d5ad4 Form BANDIT-070 oracle provenance gate` after `c4a0c3a Close out BANDIT-069`.
- evidence: `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` all name `BANDIT-070` as the active formed work item and the next action as Work Item PM plan-mode orchestration before RED evidence.
- evidence: `node ./bin/bandit.mjs cockpit status --json` and `node ./bin/bandit.mjs session-context current --json` agree that `BANDIT-070` is active, current stage is Stage 1 formation approved, required operator input is `none_required`, and Stage 2 RED evidence is missing.
- evidence: `.bandit/bootstrap-gaps.json` links active gap `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` to `BANDIT-070`; queued gaps remain behind it.
- evidence: `docs/work/BANDIT-069/landing-action.md`, `docs/work/BANDIT-069/retrospective.md`, and `docs/work/BANDIT-069/improvement-disposition.md` exist, so the previous work item is landed and closed.
- evidence: `docs/work/BANDIT-070/coordination-log.jsonl` records `brief_created` and `formation_approved`; `node ./bin/bandit.mjs coordination validate BANDIT-070` passes.
- operator-input status: pass - no operator-owned input is required unless later work would change product direction, UAT policy, business/cost/risk posture, paid tooling, Trust Verifier cutover, old-gate authority, merge/push/deploy authority, external services, or unrelated Phase 8 scope.

## Stage Sequence

- Stage 2 RED evidence: Test Writer owns tests, fixtures, oracle-source fixtures, RED evidence, claim-to-oracle mappings, and acceptance mappings. Verdict: pending. Evidence required before implementation: `docs/work/BANDIT-070/red-evidence.md`, focused RED tests, and coordination `red_recorded`.
- Stage 3 implementation: Claude Implementation Writer owns source/chore delivery only because Codex PM/Test Writer authors Stage 2 RED evidence. Verdict: pending. Evidence required before review: `docs/work/BANDIT-070/implementation-evidence.md`, `docs/work/BANDIT-070/writer-report.md`, focused verification, and PM acceptance.
- Stage 4 review: Reviewers own CodeRabbit, Local Qwen through `.bandit/reviewers/local-qwen.json` plus `bin/omlx-chat-completions.mjs`, escalation if smell triggers require it, risk classification, supply-chain gate, finding disposition, and aggregate review evidence. Verdict: pending.
- Stage 5 landing: Landing Agent owns `docs/work/BANDIT-070/landing-verdict.md`; local-record landing must follow a clean source/evidence commit, source-head/hash refresh, `land-check`, and `docs/work/BANDIT-070/landing-action.md`. Verdict: pending.
- Stage 6 closeout: Closeout Agent/Codex PM owns retrospective, structured improvement mining, durable lesson disposition, bootstrap-gap resolution, context/status sync, validation, and final recorded next action. Verdict: pending.

## Required Evidence

- Stage 0 Context And Boundary: pass - required reads complete from `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-070/brief.md`, `docs/work/BANDIT-070/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`; derived status commands agree.
- Stage 1 Repo PM Formation Complete: pass - `docs/work/BANDIT-070/brief.md` exists; `qwen-formation-review.md` verdict is `pass`; `coderabbit-formation-review.md` records CodeRabbit timeout as `bootstrap_gap` replacement evidence without claiming pass; `formation-review.md` verdict is `pass`; coordination records `formation_approved`.
- Stage 2 RED Checklist: pending - create focused RED tests and `docs/work/BANDIT-070/red-evidence.md`; tests must map to acceptance criteria and state Stage 3 Writer has zero test-edit authority; if Codex authors RED, Stage 3 routes to Claude; record `red_recorded` before implementation.
- Stage 3 Implementation Checklist: pending - Claude Writer must produce source/chore delivery without test edits; focused tests must pass or a bootstrap gap must be recorded; `implementation-evidence.md`, `writer-report.md`, and PM acceptance must verify spec alignment and clean-code posture; Claude gets 15 minutes before interruption.
- Stage 4 Review Checklist: pending - record CodeRabbit review or provider-refusal/bootstrap evidence; run Local Qwen only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`; escalate only if policy smells require it; record risk classification, supply-chain gate, finding dispositions, and current aggregate review evidence.
- Stage 5 Landing Checklist: pending - create landing verdict; feature UAT is `not_applicable` unless product-facing behavior appears; run `land-check`; perform local-record landing only after a clean source/evidence commit and refreshed source-head/hash evidence; do not start next work before landing action exists.
- Stage 6 Closeout Checklist: pending - create retrospective and improvement/no-action dispositions; update `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` if state changes; verify cockpit/session-context agreement, `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-070`, and `git diff --check`.

## Role Boundaries

- Repo PM: owns Stage 1 brief creation, formation review routing, formation approval, source-spec interpretation, and context synchronization before Work Item PM starts.
- Work Item PM: owns this orchestration plan, stage routing, gate enforcement, PM acceptance, finding disposition routing, and status synchronization; it does not author Stage 3 implementation.
- Test Writer: owns Stage 2 RED tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, and acceptance mappings.
- Implementation Writer: owns Stage 3 source/chore delivery only. It may not create, edit, delete, regenerate, format, or mechanically adjust tests, fixtures, RED evidence, oracle evidence, oracle-source fixtures, claim-to-oracle mappings, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Reviewer: owns Stage 4 independent review evidence and findings. Local Qwen is authorized only through the MLX adapter path; direct `qwen` CLI is forbidden.
- Landing Agent: owns Stage 5 landing verdict and landing action evidence.
- Closeout Agent/Codex PM: owns Stage 6 retrospective, improvement disposition, bootstrap-gap disposition, current context, roadmap, and status updates.
- Permanent Test Ownership Boundary: pass - Stage 3 has zero test-edit authority.
- Bootstrap Model-Family Separation: pass - because Codex/Test Writer will author Stage 2 RED, Stage 3 implementation routes to Claude-family Writer during bootstrap.

## Verification Commands

- Stage 2 focused RED: `node --test test/verification-oracle-provenance.test.mjs` or the exact focused tests created by Test Writer, expected to fail with missing oracle-provenance behavior before implementation.
- Stage 2 render/record: repo-native artifact or direct RED evidence record plus coordination `red_recorded`.
- Stage 3 focused verification: rerun focused oracle-provenance tests; add focused landing/validation/trust verify tests only for touched surfaces.
- Shared verification when touched: `npm test`, `npm run typecheck`, `npm run bandit -- validate`, `npm run bandit -- gaps list`, `node ./bin/bandit.mjs cockpit status --json`, `node ./bin/bandit.mjs session-context current --json`, `node ./bin/bandit.mjs review-subject-hash BANDIT-070`, and `git diff --check`.
- Stage 4 review: `npm run bandit -- coderabbit-review pre-pr BANDIT-070 --base origin/main` unless provider-refusal evidence is recorded; `npm run bandit -- qwen-review BANDIT-070` only if it uses `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`.
- Stage 5 landing: `npm run bandit -- land-check BANDIT-070`, then local-record landing after source/evidence commit and source-head/hash refresh.
- Final verification: `npm run bandit -- validate`, `node ./bin/bandit.mjs coordination validate BANDIT-070`, `node ./bin/bandit.mjs cockpit status --json`, `node ./bin/bandit.mjs session-context current --json`, and `git diff --check`.

## Known Blockers

- verdict: pass
- known blockers: none for Work Item PM plan-mode start.
- CodeRabbit formation review status: bootstrap_gap - provider timeout was recorded honestly in `docs/work/BANDIT-070/coderabbit-formation-review.md`; no CodeRabbit pass is claimed.
- Local Qwen formation review status: pass through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`.
- operator-owned input: none currently required.
- queued-work boundary: `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` and later verification gaps must not start until `BANDIT-070` lands and closes out or is explicitly dispositioned.

## Stop Conditions

- Stop and route to Repo PM if `work-item-pm start BANDIT-070` refuses formation evidence, the orchestration plan, or coordination state.
- Stop before implementation if Stage 2 RED evidence cannot be recorded or does not map tests to acceptance criteria.
- Stop before Stage 3 if Stage 3 would use the same model family that authored Codex RED evidence.
- Stop Stage 3 if Claude Writer edits any test-owned surface; invalidate and rerun from clean RED evidence rather than repairing in place.
- Give Claude 15 minutes for assigned Stage 3 tasks before interruption; if it produces no implementation evidence or tooling is unavailable, record a blocker instead of silently taking over Writer-owned source work.
- Stop before review closeout for unresolved CodeRabbit, Local Qwen, escalation, risk, supply-chain, freshness, or review-subject findings.
- Stop before landing if `land-check` fails, landing verdict is stale or missing, source/evidence commit is missing, UAT unexpectedly becomes applicable, or clean-code blocker evidence exists.
- Stop before closeout if retrospective, improvement disposition, bootstrap-gap disposition, context/status sync, coordination validation, cockpit/session-context agreement, `validate`, or `git diff --check` fails.
- Stop for operator input if the work would approve Trust Verifier cutover, replace or wrap old gate authority, approve paid/external tooling, change product/UAT/policy/business/cost/risk posture, merge/push/deploy, use external services, or expand unrelated Phase 8 scope.

## Forbidden Actions

- Do not approve Trust Verifier cutover, select a Trust Goal for cutover, replace old gates, wrap old gates, or silently change verifier authority.
- Do not build replay regression corpus, private install/update channel, guarded CLI action execution, State Index, local API, live cockpit polling, external services, hosted previews, merge automation, push automation, deploy automation, PR/CI orchestration, claim/worktree lifecycle, or unrelated Phase 8 cockpit product scope.
- Do not approve paid or external oracle services, paid reviewers, recurring paid model usage, provider-pricing policy, spend-class policy, dependency policy changes, package-manager script changes, or lockfile changes.
- Do not treat derived status projections, generated trust reports, validators, cockpit status, session-context, review packets, landing reports, or command output as their own independent oracle for correctness claims they expose.
- Do not let Stage 3 Writers edit tests, test helpers, fixtures, RED evidence, oracle-provenance evidence, oracle-source fixtures, claim-to-oracle mappings, acceptance mappings, formation evidence, review evidence, landing evidence, or retrospective evidence.
- Do not add blanket ceremony to trivial metadata-only work; low-risk self-reported or derived oracle classes require explicit scope and disposition.
- Do not use the direct `qwen` CLI for Bandit reviewer routing.
