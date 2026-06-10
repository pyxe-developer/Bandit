# BANDIT-093: Roadmap Work Target Resolver

## Status

Brief Created

work_type: slice

## Origin

`BANDIT-PRD-005` is accepted for implementation after the operator's
2026-06-10 direction to implement `BANDIT-PRD-004` and `BANDIT-PRD-005`
before the V0 Closeout Claude Code A/B Product-Value Trial.
`BANDIT-092` landed and closed the final `BANDIT-PRD-004` prerequisite slice:
Boundary Cell Movement Gate. `docs/prds/BANDIT-PRD-004-005-decomposition.md`,
`.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, and `STATUS.md` record PRD-005.1 Roadmap Work
Target Resolver as the next authorized `BANDIT-PRD-005` slice.

## Product Work

This is the first `BANDIT-PRD-005` implementation slice. It adds the
roadmap/current-context target resolver that later Repo PM create-controller
work will call. It does not implement `/bandit-work-create`,
`/bandit-work-execute`, the create controller, the execute controller, role
input packet assembly, or execution orchestration.

## Goal

Implement the first BANDIT-PRD-005 slice: a deterministic roadmap/current-context work-target resolver that identifies the current or next authorized work target before any PRD, spec, or Work Intake Ledger provenance is dereferenced.

## Scope

- Use BANDIT-PRD-005 and docs/prds/BANDIT-PRD-004-005-decomposition.md as source authority for PRD-005.1 after BANDIT-092 landed and closed PRD-004.4.
- Add a Bandit-native resolver that reads docs/roadmap/ROADMAP.md and docs/roadmap/CURRENT_CONTEXT.md as the priority authority surfaces and returns a deterministic current or next work target with status, type, title, priority relationship, source artifact paths, and provenance pointers.
- Make the resolver fail closed when ROADMAP.md and CURRENT_CONTEXT.md disagree on the current or next authorized work target, including stale closed-work tail text that conflicts with the current next action.
- Allow PRD, spec, or WIL provenance dereference only after ROADMAP.md and CURRENT_CONTEXT.md identify the work target. The Work Intake Ledger may be used as source metadata, not as a primary scheduler or hidden priority queue.
- Support closed-work interstitial routing where the prior work item is closed and the next roadmap item is not yet formed, returning a not_yet_formed target rather than inventing an active work item.
- Expose the resolver through a deterministic CLI or internal command surface suitable for later Repo PM create-controller use, without implementing /bandit-work-create, /bandit-work-execute, role input packet assembly, or execution orchestration in this slice.
- Preserve CLI authority, repo-native canonical state, and derived-only cockpit/session-context status. Do not make WIL entries, PRD files, specs, cockpit views, session-context packets, or resolver output independent workflow authority.
- Record CLEAN_CODE.md read evidence in the brief and require implementation to keep roadmap parsing, context parsing, target reconciliation, provenance dereference, diagnostics, and tests small and explicit.

## Out Of Scope

- Do not implement the Repo PM create controller, /bandit-work-create adapter, Work Item PM execute controller, /bandit-work-execute adapter, stage route registry, role input packet assembler, blocker/provider evidence recorder, or prompt-contract normalization in this slice.
- Do not create a public bandit context <stage> workflow command.
- Do not turn .bandit/work-intake-ledger.json into a claimable queue, scheduler, or priority authority.
- Do not create or approve future PRD-005.2, PRD-005.3, PRD-005.4, V0 trial, or unrelated Phase 8 work items.
- Do not approve Trust Verifier cutover, replace or wrap old gate paths, change landing autonomy, approve Notify-And-Revert or Auto-Landing Scope, change UAT policy, approve paid/live reviewer or model routing, approve merge/push/deploy authority, mutate external repositories, add hosted services, add telemetry, add credential handling, change dependencies, change package scripts, or change CI/release workflow.

## Acceptance Criteria

- The resolver returns a deterministic current or next work target from ROADMAP.md and CURRENT_CONTEXT.md, including target title, work type, status, priority relationship, source artifact paths, and provenance pointers.
- The resolver handles the closed-work interstitial state where the previous work item is closed and the next roadmap item is not yet formed, returning PRD-005.1-style not_yet_formed target data rather than claiming an active Work Item exists.
- The resolver fails closed with clear diagnostics when ROADMAP.md and CURRENT_CONTEXT.md disagree on the current or next authorized work target.
- The resolver ignores stale historical tail text or rejects it explicitly when it conflicts with the current next action; it may not silently use stale wording to route Work Item PM execution for closed work.
- The resolver dereferences PRD, spec, WIL, or mixed provenance only after roadmap/current-context authority names that target.
- The resolver refuses to scan .bandit/work-intake-ledger.json as a primary scheduler or hidden queue.
- The resolver supports PRD-backed and WIL-backed roadmap targets as provenance classes while keeping normal Work Item IDs as the execution artifact identity once materialized.
- Aggregate Bandit validation or focused resolver validation covers matching targets, mismatched targets, missing roadmap/current-context target data, closed-work interstitial targets, PRD-backed provenance, WIL-backed provenance, and no-hidden-WIL-scheduler behavior.
- Implementation keeps resolver parsing and reconciliation logic readable, deterministic, and separated from future create-controller and execute-controller behavior.
- The work preserves role boundaries: Test Writer owns RED evidence and test edits; if Codex authors Stage 2 tests, Stage 3 implementation is routed to Claude or another non-Codex model family; reviewers own Stage 4; Landing Agent owns Stage 5; Closeout Agent owns Stage 6.
- Stage 4 review uses Local Qwen only through .bandit/reviewers/local-qwen.json and node bin/omlx-chat-completions.mjs, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review evidence, risk classification, and supply-chain evidence before landing.
- The work item does not start PRD-005.2, PRD-005.3, PRD-005.4, /bandit-work-create, /bandit-work-execute, V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, cockpit UI, local API, State Index, hosted services, telemetry, public benchmark publication, paid routing, merge, push, deploy, or unrelated Phase 8 work.

## Test Plan

- Stage 2 Test Writer writes RED tests for successful roadmap/current-context target resolution in current-work and next-work states.
- Stage 2 Test Writer writes RED tests for the closed-work interstitial state where BANDIT-092 is closed and PRD-005.1 is the next not_yet_formed target.
- Stage 2 Test Writer writes RED tests proving conflicting ROADMAP.md and CURRENT_CONTEXT.md target text fails closed with a clear diagnostic.
- Stage 2 Test Writer writes RED tests proving stale historical tail wording cannot route execution for a closed work item when the current next action names Repo PM formation.
- Stage 2 Test Writer writes RED tests for PRD-backed, spec-backed, and WIL-backed provenance dereference only after roadmap/current-context authorization.
- Stage 2 Test Writer writes RED tests proving the resolver does not scan .bandit/work-intake-ledger.json as a primary scheduler.
- Run focused resolver tests after implementation.
- Run npm run typecheck.
- Run npm test if shared state parsing, cockpit/session-context, validation, or roadmap parsing behavior changes.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json after context artifacts are updated.
- Run git diff --check.

## Verification Plan

- Run `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-093` after
  Local Qwen formation review, CodeRabbit formation review or provider-timeout
  evidence, aggregate formation review, and coordination evidence exist.
- Run `node ./bin/bandit.mjs coordination validate BANDIT-093` after every
  accepted step transition.
- Run focused Stage 2 RED tests before implementation to prove
  roadmap/current-context target resolution, closed-work interstitial routing,
  conflict refusal, stale-tail refusal, provenance dereference after
  authorization, and no hidden Work Intake Ledger scheduling.
- Run focused implementation tests, `npm run typecheck`, `npm test` when
  shared roadmap parsing, validation, cockpit/session-context, or command
  behavior changes, `npm run bandit -- validate`,
  `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check` before Stage 4 review and landing.
- Before landing, run Local Qwen through the authorized MLX adapter route,
  CodeRabbit or honest provider-timeout/refusal evidence, aggregate review
  evidence, review-subject hash, risk classification, supply-chain gate,
  clean-code compliance review, landing verdict, land-check, local-record
  landing action, retrospective, and improvement or no-action disposition.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-10 before creating this source spec. The slice must keep roadmap/current-context parsing, target reconciliation, provenance dereference, diagnostics, and tests small and explicit; avoid hidden workflow authority; preserve role boundaries; and avoid mixing create-controller, execute-controller, route registry, role packet, cockpit, or slash-command adapter behavior into this resolver slice.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-092 landed and closed with landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, no open bootstrap gaps, and Repo PM formation for PRD-005.1 recorded as the next action.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, no-gap disposition, expected files, required evidence, role boundaries, operator-input status, source-of-truth boundary, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED tests for roadmap/current-context target resolution, closed-work interstitial state, conflict refusal, stale-tail refusal, provenance dereference after authorization, and no hidden Work Intake Ledger scheduling.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit RED tests, test helpers, fixtures, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through the authorized MLX route, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review, review-subject hash, risk/supply-chain checks where applicable, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not applicable unless the implementation changes an operator-facing product surface.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, and STATUS updates are required before PRD-005.2, V0 trial, or unrelated next work begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this PRD-005.1 implementation slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs against the MLX OpenAI-compatible endpoint at http://127.0.0.1:8001/v1. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- No Trust Verifier cutover, old-gate replacement or wrapping, PRD-005 create/execute controller, slash-command adapter, local API, State Index, hosted service, telemetry, paid route, merge, push, deploy, external repo mutation, credential handling, dependency change, package-script change, CI/release workflow change, or unrelated Phase 8 authority is approved by this slice.

## Expected Files

- docs/specs/BANDIT-093-roadmap-work-target-resolver.json
- docs/work/BANDIT-093/brief.md
- docs/work/BANDIT-093/qwen-formation-review.md
- docs/work/BANDIT-093/coderabbit-formation-review.md
- docs/work/BANDIT-093/formation-review.md
- docs/work/BANDIT-093/coordination-log.jsonl
- docs/work/BANDIT-093/orchestration-plan.md
- docs/work/BANDIT-093/red-evidence.md
- src/state/roadmap-work-targets.ts
- src/commands/roadmap-work-targets.ts
- src/commands/validate.ts
- src/cli.ts
- test/roadmap-work-targets.test.mjs
- docs/work/BANDIT-093/implementation-evidence.md
- docs/work/BANDIT-093/writer-report.md
- docs/work/BANDIT-093/stage3-pm-review.md
- docs/work/BANDIT-093/coderabbit-review.md
- docs/work/BANDIT-093/local-qwen-review.md
- docs/work/BANDIT-093/review-evidence.md
- docs/work/BANDIT-093/landing-verdict.md
- docs/work/BANDIT-093/landing-action.md
- docs/work/BANDIT-093/retrospective.md
- docs/work/BANDIT-093/improvement-disposition.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## First Implementation Order

- Repo PM creates the work item and records formation review evidence before Work Item PM execution.
- Work Item PM records orchestration-plan.md only after formation_approved and before RED evidence.
- Test Writer writes failing tests for target resolution, closed-work interstitial routing, roadmap/current-context conflict refusal, stale-tail refusal, provenance dereference after authorization, and no hidden Work Intake Ledger scheduling.
- Implementation Writer adds the minimal resolver state module, diagnostics, optional CLI/internal command surface, validation wiring, and tests needed to satisfy RED tests, without editing Test Writer-owned files if Codex authored the RED tests.
- Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, and evidence freshness before Stage 4 review.
- Reviewers run Local Qwen through the authorized MLX route and CodeRabbit or honest provider-timeout/refusal evidence; PM dispositions any non-blocking findings before landing.
- Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, and synchronizes current context, roadmap, STATUS, and intake state.

## Smell Triggers

- Any implementation that treats .bandit/work-intake-ledger.json as primary priority authority or a hidden scheduler is a blocker.
- Any implementation that dereferences PRD, spec, or WIL provenance before ROADMAP.md and CURRENT_CONTEXT.md identify the target is a blocker.
- Any implementation that silently chooses between conflicting ROADMAP.md and CURRENT_CONTEXT.md target text is a blocker.
- Any implementation that routes execution for closed work from stale historical tail wording is a blocker.
- Any implementation that creates or starts PRD-005.2, PRD-005.3, PRD-005.4, V0 trial, or unrelated work is scope creep.
- Any implementation that starts the Repo PM create controller, Work Item PM execute controller, slash-command adapters, stage route registry, role input packet assembler, or provider/blocker recorder is scope creep.
- Any implementation that creates a public bandit context <stage> workflow command is scope creep.
- Any implementation that lets resolver output, cockpit/session-context output, PRD files, specs, or WIL entries become independent canonical workflow authority is a blocker.
- Any large mixed function that combines roadmap parsing, work-item creation, formation review, execution orchestration, reviewer routing, landing, and closeout is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-093/brief.md
- docs/work/BANDIT-093/qwen-formation-review.md
- docs/work/BANDIT-093/coderabbit-formation-review.md
- docs/work/BANDIT-093/formation-review.md
- docs/work/BANDIT-093/coordination-log.jsonl
- docs/work/BANDIT-093/orchestration-plan.md
- docs/work/BANDIT-093/red-evidence.md
- docs/work/BANDIT-093/implementation-evidence.md
- docs/work/BANDIT-093/review-evidence.md
- docs/work/BANDIT-093/landing-verdict.md
- docs/work/BANDIT-093/landing-action.md
- docs/work/BANDIT-093/retrospective.md
- docs/work/BANDIT-093/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create and form this PRD-005.1 Roadmap Work Target Resolver slice because BANDIT-PRD-005 is accepted for implementation, BANDIT-092 landed and closed the PRD-004 prerequisite lane, the operator directed PRD-004/005 implementation before WIL-V0-TRIAL, and this slice implements deterministic resolver behavior without approving new product direction, UAT policy, landing autonomy, Trust Verifier cutover, paid/live routing, merge/push/deploy authority, hosted services, telemetry, external side effects, credential handling, or slash-command adapters. Halt for operator input if later work would approve /bandit-work-create or /bandit-work-execute operator-facing behavior beyond the accepted PRD, change product or UAT direction, approve paid or live reviewer/model routing, approve hosted services, approve telemetry, approve merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, approve external side effects, or resolve genuinely ambiguous product, business, policy, UAT, or explicit cost/risk scope.

## Role Boundary Evidence

- Repo PM owns Stage 1 source-spec creation, brief repair, formation review
  routing, formation approval, PRD decomposition, Work Intake Ledger source
  interpretation, and repo-level context synchronization.
- Work Item PM owns plan-mode orchestration only after `formation_approved`;
  it may not write tests, implementation, reviewer evidence, landing evidence,
  UAT evidence, or final repo-level closeout state during Stage 1.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence,
  and acceptance mappings for target resolution, closed-work interstitial
  routing, roadmap/current-context conflict refusal, stale-tail refusal,
  provenance dereference after authorization, and no hidden Work Intake Ledger
  scheduling.
- Implementation Writer owns Stage 3 source implementation only. If Codex
  authors or materially edits Stage 2 RED tests, Stage 3 implementation must
  use a different model family during bootstrap unless an operator-approved
  policy exception is recorded.
- Permanent Test Ownership Boundary: the Stage 3 Writer has no authority to
  create, edit, delete, regenerate, format, or mechanically adjust tests, test
  helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective evidence, or
  policy acceptance criteria for this Work Item.
- Reviewers own Stage 4 review evidence. Landing Agent owns Stage 5 landing
  verdict/action evidence. Closeout Agent owns Stage 6 retrospective and
  improvement/no-action disposition evidence. The operator owns any future
  decision that changes product or UAT direction, approves paid/live routing,
  hosted services, telemetry, merge/push/deploy authority, public benchmark
  claims, Trust Verifier cutover, old-gate replacement or wrapping, policy,
  business tradeoffs, or explicit cost/risk posture.

## Stage Capability Scope

- Authority role: Repo PM for Stage 1 formation only.
- Required skill: installed Bandit skill for repo-context restoration and
  strict slice-boundary enforcement.
- Allowed tools: local repo reads, focused file edits to Stage 1 artifacts,
  `node ./bin/bandit.mjs repo-pm create-work-item`,
  `node ./bin/bandit.mjs repo-pm approve-formation`, coordination validation,
  Bandit validation, cockpit/session-context status, work-intake validation,
  `git diff --check`, git status/log, Local Qwen through
  `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, and
  CodeRabbit formation review or honest provider-timeout evidence.
- Inputs: `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`,
  `docs/verification/STAGE_RUBRICS.md`,
  `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `docs/prds/BANDIT-PRD-005-bandit-work-commands.md`,
  `docs/prds/BANDIT-PRD-004-005-decomposition.md`,
  `.bandit/work-intake-ledger.json`, `.bandit/bootstrap-gaps.json`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `BANDIT-092` closeout evidence.
- Outputs: source spec, brief, `brief_created` coordination event, Local Qwen
  formation review, CodeRabbit formation review or timeout evidence, aggregate
  formation review, `formation_approved` coordination event, and synchronized
  routing surfaces that hand off to Work Item PM plan mode.
- Evidence: `docs/work/BANDIT-093/brief.md`,
  `docs/work/BANDIT-093/coordination-log.jsonl`,
  `docs/work/BANDIT-093/qwen-formation-review.md`,
  `docs/work/BANDIT-093/coderabbit-formation-review.md`,
  `docs/work/BANDIT-093/formation-review.md`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `.bandit/work-intake-ledger.json` if PRD-005 queue state is updated.
- Soft budget/failsafe: CodeRabbit formation review must be allowed the
  prompt-required full 10-minute timeout. Local Qwen must use the authorized
  MLX route only; if unavailable, stop and ask the operator for help.
- Forbidden actions: do not create `orchestration-plan.md`, RED evidence,
  implementation evidence, review-loop evidence, landing evidence, UAT
  evidence, retrospective evidence, PRD-005.2 create-controller evidence,
  PRD-005.3 execute-controller evidence, PRD-005.4 adapter evidence, Trust
  Verifier cutover evidence, V0 trial evidence, merge/push/deploy evidence, or
  unrelated Phase 8 artifacts during Stage 1 formation.

## Source-Of-Truth And Projection Boundary

- `docs/roadmap/ROADMAP.md` and `docs/roadmap/CURRENT_CONTEXT.md` are the
  priority authority surfaces for identifying current and next work targets.
- `.bandit/work-intake-ledger.json`, PRD files, and spec files are provenance
  sources only after roadmap/current-context authority names the target.
- Resolver output, cockpit status, and session-context packets are derived
  non-canonical projections. They may report eligibility and diagnostics but
  cannot create work, authorize execution, or override repo-native artifacts.
- Work Item IDs and lifecycle transitions remain normal repo-native artifacts
  under `docs/work/<ID>/` and `.bandit/` append-only history once work is
  materialized.

## Bootstrap Model-Family Separation

If Codex authors or materially edits Stage 2 RED tests for `BANDIT-093`, Stage
3 source implementation must be dispatched to Claude or another non-Codex model
family during bootstrap. The Implementation Writer may not edit Test
Writer-owned tests, fixtures, RED evidence, or acceptance mappings.

## Forbidden Actions

- Do not create `docs/work/BANDIT-093/orchestration-plan.md`.
- Do not create RED evidence, implementation evidence, review-loop evidence,
  landing evidence, UAT evidence, retrospective evidence, or closeout evidence.
- Do not implement `/bandit-work-create`, `/bandit-work-execute`, the Repo PM
  create controller, Work Item PM execute controller, stage route registry, role
  input packet assembler, provider/blocker recorder, or prompt-contract
  normalization.
- Do not turn `.bandit/work-intake-ledger.json` into priority authority,
  claimable scheduler state, or a hidden queue.
- Do not approve Trust Verifier cutover, replace or wrap old gates, expand
  landing autonomy, approve Notify-And-Revert or Auto-Landing Scope, change UAT
  policy, approve paid/live routing, hosted services, telemetry,
  merge/push/deploy authority, public benchmark claims, credential handling,
  dependency changes, CI/release workflow changes, external repo mutation, or
  unrelated Phase 8 work.
