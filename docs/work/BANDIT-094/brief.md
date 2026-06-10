# BANDIT-094: Repo PM Create Controller And Prompt Contract

## Status

Brief Created

## Goal

Implement the second BANDIT-PRD-005 slice: a Bandit-native Repo PM prompt contract and create-controller path that resolves the next roadmap-authorized target, creates or repairs a normal Work Item through Stage 1 formation approval when evidence is sufficient, and stops before Stage 2.

## Product Work

work_type: slice

This is the second `BANDIT-PRD-005` implementation slice. It adds the
Bandit-native Repo PM prompt contract and the underlying create-controller
behavior needed before the later execute-controller and operator-adapter
slices. The work is product-facing in the sense that it simplifies future
operator workflow entry, but this slice is still an internal CLI/controller
foundation and does not add the `/bandit-work-create` slash-command adapter.

## Origin

Source authority:

- `AGENTS.md`: Repo PM owns routine technical routing, Stage 1 formation, and
  operator-input boundaries.
- `CONTEXT.md`: Bandit vocabulary, CLI Authority, Prompt Contract, and
  workflow trust-layer boundaries.
- `docs/prds/BANDIT-PRD-005-bandit-work-commands.md`: accepted product PRD
  for `/bandit-work-create` and `/bandit-work-execute` command behavior.
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`: decomposition names
  `PRD-005.2` as "Repo PM Create Controller And Prompt Contract."
- `docs/work/BANDIT-093/landing-action.md`,
  `docs/work/BANDIT-093/retrospective.md`, and
  `docs/work/BANDIT-093/improvement-disposition.md`: prior-slice landing and
  closeout evidence authorizing the next PRD-005.2 formation.
- `/Users/matthewflebbe/Documents/SeekWins Repo PM — Brief and Stage 1 Formation.md`:
  source material for prompt behavior only. It is not Bandit planning authority
  and must be normalized away from SeekWins paths, WI-00 rules, Linux install
  assumptions, Ollama reviewer semantics, and SeekWins-specific policy.
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `.bandit/work-intake-ledger.json`: current routing and provenance
  surfaces. Roadmap/current-context priority authority outranks intake
  provenance.

## Scope

- Use BANDIT-PRD-005 and docs/prds/BANDIT-PRD-004-005-decomposition.md as source authority for PRD-005.2 after BANDIT-093 landed and closed PRD-005.1 Roadmap Work Target Resolver.
- Normalize the operator-provided Repo PM formation prompt source into a Bandit-native prompt contract that uses Bandit paths, Bandit role names, Bandit reviewer routes, Stage 1 formation gates, and Bandit's operator-owned input boundaries.
- Extend or introduce prompt-contract policy, template, and validation so the Repo PM prompt contract is non-authoritative adapter guidance and cannot replace CLI validation, roadmap/current-context authority, work-item artifacts, coordination logs, or formation review evidence.
- Add a create-controller behavior under the Repo PM command surface or an internal command surface that resolves the current or next authorized target from ROADMAP.md and CURRENT_CONTEXT.md, handles the closed-current-work interstitial state, creates a Work Item from an explicit source spec when one exists, and repairs only derivable Stage 1 prerequisites.
- Make the create controller idempotent: if the current target already has a Work Item with brief_created and formation_approved evidence, report the existing Work Item and the Work Item PM plan-mode next action instead of allocating a duplicate.
- Make the create controller fail closed when product, UAT, policy, business, explicit cost/risk, Trust Verifier cutover, old-gate replacement/wrapping, merge/push/deploy, reviewer-route availability, or genuinely ambiguous scope input is required.
- Preserve the authorized Local Qwen reviewer route: .bandit/reviewers/local-qwen.json through node bin/omlx-chat-completions.mjs against the MLX endpoint. Do not allow direct qwen CLI fallback.
- Preserve CLI authority, repo-native canonical state, roadmap/current-context priority authority, and Work Intake Ledger provenance-only behavior. The controller must not treat WIL, prompt contracts, cockpit/session-context output, or slash commands as independent workflow authority.
- Record CLEAN_CODE.md read evidence in the brief and require implementation to keep resolver handoff, create-controller orchestration, prompt validation, diagnostics, and tests small and explicit.

## Out Of Scope

- Do not implement the PRD-005.3 Work Item PM execute controller, stage route registry, role input packet assembler, blocker/provider evidence recorder, or Stage 2 through Stage 6 orchestration.
- Do not implement the PRD-005.4 /bandit-work-create or /bandit-work-execute operator adapter layer, slash-command runtime integration, cockpit action affordances, local API, State Index, hosted service, live polling loop, or browser-owned workflow authority.
- Do not create a public bandit context <stage> workflow command.
- Do not turn .bandit/work-intake-ledger.json into a claimable queue, scheduler, or priority authority.
- Do not auto-approve PRDs, WIL proposals, Trust Verifier cutover, old-gate replacement or wrapping, landing autonomy expansion, Notify-And-Revert or Auto-Landing Scope, UAT policy, paid/live reviewer or model routing, merge/push/deploy authority, credential handling, external repo mutation, dependency changes, package-script changes, or CI/release workflow changes.

## Acceptance Criteria

- A Bandit-native Repo PM prompt contract exists and preserves the required first reads, slice boundary checks, bounded triage, operator-owned input boundaries, Stage 1 formation flow, reviewer evidence requirements, stop conditions, and forbidden actions without SeekWins paths, SeekWins-specific policy, or Linux-only reviewer assumptions.
- Prompt-contract validation fails closed if the Repo PM prompt claims canonical workflow authority, replaces roadmap/current-context/work-item artifacts, skips Stage 1 formation review, starts Stage 2, weakens Local Qwen routing, grants Trust Verifier cutover, or omits operator-owned input boundaries.
- The create controller uses the BANDIT-093 roadmap/current-context target resolver or an explicitly compatible helper and handles a closed current work item plus next unformed roadmap target without routing back to the closed item.
- The create controller creates a Work Item only from an explicit source spec or approved derivable source material named by roadmap/current-context authority; it does not scan WIL as a hidden scheduler or invent product scope.
- The create controller repairs only derivable Stage 1 prerequisites such as missing coordination-log brief_created evidence, generated brief shape, or exact routing text. It does not guess product, UAT, policy, business, cost/risk, or ambiguous scope decisions.
- The create controller approves formation only when qwen-formation-review.md, coderabbit-formation-review.md, and formation-review.md exist with supported verdict, findings_status, and findings_disposition metadata accepted by the formation gate.
- If the target is already formed and formation_approved, the controller reports idempotent success, does not allocate a duplicate Work Item, and points to Work Item PM plan-mode orchestration.
- If Local Qwen is unavailable through the authorized MLX adapter route, the controller fails closed and asks for operator help rather than substituting another local reviewer route.
- If CodeRabbit does not return terminal formation evidence within the configured Stage 1 timeout, the controller records or accepts provider-timeout bootstrap_gap evidence without claiming a CodeRabbit pass.
- The controller stops before Stage 2: it creates no orchestration-plan.md, RED evidence, implementation evidence, review-loop evidence, landing evidence, UAT evidence, retrospective evidence, PRD-005.3 evidence, or PRD-005.4 adapter evidence.
- Focused tests cover prompt-contract validation, target resolution from a closed current item to a next unformed item, source-spec creation, missing-source refusal, idempotent already-formed behavior, formation-review metadata enforcement, operator-owned input refusal, Local Qwen route refusal, and no Stage 2 artifact creation.
- Implementation keeps create-controller orchestration, prompt-contract validation, target resolution handoff, diagnostics, and tests readable, deterministic, and separated from future execute-controller and adapter behavior.

## Test Plan

- Stage 2 Test Writer writes RED tests for Repo PM prompt-contract validation accepting a Bandit-native non-authoritative prompt contract and rejecting SeekWins path leakage, canonical authority claims, missing Stage 1 gates, missing operator-owned input boundaries, or direct qwen CLI routing.
- Stage 2 Test Writer writes RED tests for create-controller resolution where BANDIT-093 is closed and PRD-005.2 is the next unformed roadmap target.
- Stage 2 Test Writer writes RED tests for creation from a roadmap-authorized source spec and refusal when no explicit source spec or bounded approved source material exists.
- Stage 2 Test Writer writes RED tests for idempotent already-formed behavior when brief_created and formation_approved already exist.
- Stage 2 Test Writer writes RED tests proving the controller does not create orchestration-plan.md, RED evidence, implementation evidence, review evidence, landing evidence, retrospective evidence, or adapter evidence.
- Stage 2 Test Writer writes RED tests for operator-owned input refusal and Local Qwen unavailability refusal.
- Run focused create-controller and prompt-contract tests after implementation.
- Run npm run typecheck.
- Run npm test if shared CLI routing, validation, prompt policy, roadmap resolver, formation gate, or coordination-log behavior changes.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json after context artifacts are updated.
- Run git diff --check.

## Verification Plan

- Stage 1 formation verification checks this brief against
  `docs/verification/STAGE_RUBRICS.md`, `CLEAN_CODE.md`, and the formation gate.
- Stage 1 formation review must produce
  `docs/work/BANDIT-094/qwen-formation-review.md`,
  `docs/work/BANDIT-094/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-094/formation-review.md` with supported `verdict`,
  `findings_status`, and `findings_disposition` metadata.
- Repo PM approval must run
  `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-094` and append
  `formation_approved` to `docs/work/BANDIT-094/coordination-log.jsonl`.
- Stage 1 closeout for this run must verify `npm run bandit -- validate`,
  `node ./bin/bandit.mjs coordination validate BANDIT-094`,
  `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check`.
- Later stages must add focused RED tests, typecheck, targeted test suites,
  full validation as needed, Stage 4 review evidence, landing verdict/action,
  and Stage 6 retrospective before PRD-005.3 can begin.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-10 before creating this source spec. The slice must keep Repo PM prompt normalization, prompt-contract validation, target resolution handoff, Work Item creation orchestration, coordination repair, formation approval checks, diagnostics, and tests small and explicit; avoid hidden workflow authority; preserve role boundaries; and avoid mixing PRD-005.3 execute-controller, route registry, role packet assembly, Stage 2 execution, cockpit, local API, State Index, or slash-command adapter behavior into this create-controller slice.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-093 landed and closed with verification, landing verdict, landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, no open bootstrap gaps, and Repo PM formation for PRD-005.2 recorded as the next action.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, no-gap disposition, expected files, required evidence, role boundaries, operator-input status, source-of-truth boundary, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED tests for Repo PM prompt-contract validation, create-controller target resolution, source-spec creation/refusal, idempotency, formation-review metadata enforcement, operator-input refusal, reviewer-route refusal, and no Stage 2 artifact creation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit RED tests, test helpers, fixtures, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through the authorized MLX route, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review, review-subject hash, risk/supply-chain checks where applicable, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not applicable unless the implementation changes an operator-facing product surface.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and intake-state updates are required before PRD-005.3, PRD-005.4, V0 trial, or unrelated next work begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this PRD-005.2 implementation slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs against the MLX OpenAI-compatible endpoint at http://127.0.0.1:8001/v1. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- The operator-provided SeekWins Repo PM prompt is source material only; Bandit implementation must normalize it and must not import SeekWins paths, installed CLI assumptions, Ollama reviewer semantics, WI-00 governance rules, or SeekWins policy authority.
- No Trust Verifier cutover, old-gate replacement or wrapping, PRD-005 execute-controller, role input packet assembly, slash-command adapter, cockpit action execution, local API, State Index, hosted service, telemetry, paid route, merge, push, deploy, external repo mutation, credential handling, dependency change, package-script change, CI/release workflow change, or unrelated Phase 8 authority is approved by this slice.

## Bootstrap Gap Or No-Gap Disposition

No open bootstrap gap blocks this slice. The stale PRD-005 intake metadata is
mechanically derivable from `BANDIT-093` closeout and may be refreshed when
Stage 1 formation is approved, but it does not create a separate bootstrap gap.
CodeRabbit provider timeout during formation may be recorded as
`bootstrap_gap` replacement evidence only after the full prompt-required
timeout. Local Qwen unavailability is not substitutable; it requires operator
help because the authorized reviewer route is fixed.

## Expected Files

- docs/specs/BANDIT-094-repo-pm-create-controller-and-prompt-contract.json
- docs/work/BANDIT-094/brief.md
- docs/work/BANDIT-094/qwen-formation-review.md
- docs/work/BANDIT-094/coderabbit-formation-review.md
- docs/work/BANDIT-094/formation-review.md
- docs/work/BANDIT-094/coordination-log.jsonl
- docs/templates/repo-pm-formation-prompt.md
- .bandit/policy/orchestrator-prompts.json
- src/state/orchestrator-prompts.ts
- src/state/work-create-controller.ts
- src/commands/repo-pm.ts
- src/commands/work-create-controller.ts
- src/commands/validate.ts
- src/cli.ts
- test/orchestrator-prompts.test.mjs
- test/work-create-controller.test.mjs
- docs/work/BANDIT-094/orchestration-plan.md
- docs/work/BANDIT-094/red-evidence.md
- docs/work/BANDIT-094/implementation-evidence.md
- docs/work/BANDIT-094/writer-report.md
- docs/work/BANDIT-094/stage3-pm-acceptance.md
- docs/work/BANDIT-094/coderabbit-review.md
- docs/work/BANDIT-094/local-qwen-review.md
- docs/work/BANDIT-094/review-evidence.md
- docs/work/BANDIT-094/landing-verdict.md
- docs/work/BANDIT-094/landing-action.md
- docs/work/BANDIT-094/retrospective.md
- docs/work/BANDIT-094/improvement-disposition.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md
- .bandit/work-intake-ledger.json

## Stage 1 Boundary For Expected Files

Only the source spec, brief, formation review artifacts, coordination log,
roadmap/current-context/status routing, and PRD-005 intake metadata may be
created or edited during Repo PM Stage 1 formation. Later listed files are
expected downstream surfaces for Work Item PM, Test Writer, Implementation
Writer, reviewers, Landing Agent, and Closeout Agent. Repo PM must not create
`orchestration-plan.md`, RED evidence, implementation evidence, review-loop
evidence, landing evidence, UAT evidence, retrospective evidence, PRD-005.3
execute-controller evidence, or PRD-005.4 adapter evidence in this run.

## First Implementation Order

- Repo PM creates the work item and records formation review evidence before Work Item PM execution.
- Work Item PM records orchestration-plan.md only after formation_approved and before RED evidence.
- Test Writer writes failing tests for Repo PM prompt-contract validation, create-controller target resolution, source-spec creation/refusal, idempotent already-formed behavior, operator-input refusal, reviewer-route refusal, and no Stage 2 artifact creation.
- Implementation Writer adds the minimal Repo PM prompt contract template/policy validation changes and create-controller command/state module needed to satisfy RED tests, without editing Test Writer-owned files if Codex authored the RED tests.
- Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, and evidence freshness before Stage 4 review.
- Reviewers run Local Qwen through the authorized MLX route and CodeRabbit or honest provider-timeout/refusal evidence; PM dispositions any non-blocking findings before landing.
- Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, and synchronizes current context, roadmap, STATUS, and intake state.

## Smell Triggers

- Any implementation that treats the Repo PM prompt contract, slash-command text, WIL entries, cockpit/session-context output, or resolver output as canonical workflow authority is a blocker.
- Any implementation that scans .bandit/work-intake-ledger.json as primary priority authority or a hidden scheduler is a blocker.
- Any implementation that silently chooses between conflicting ROADMAP.md and CURRENT_CONTEXT.md target text is a blocker.
- Any implementation that routes execution for closed work instead of resolving the authorized next formation target is a blocker.
- Any implementation that auto-approves product direction, UAT, policy, business, explicit cost/risk, Trust Verifier cutover, old-gate replacement/wrapping, merge/push/deploy, paid/live reviewer routing, hosted service, telemetry, external mutation, or ambiguous scope is a blocker.
- Any implementation that uses direct qwen CLI, Ollama, or another ad hoc reviewer route as Local Qwen evidence is a blocker.
- Any implementation that creates Stage 2, implementation, review-loop, landing, UAT, retrospective, PRD-005.3 execute-controller, PRD-005.4 adapter, local API, State Index, cockpit action, hosted service, telemetry, merge, push, deploy, or unrelated artifacts from the create controller is scope creep.
- Any large mixed function that combines target resolution, Work Item creation, prompt validation, formation review, execution orchestration, reviewer routing, landing, and closeout is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-094/brief.md
- docs/work/BANDIT-094/qwen-formation-review.md
- docs/work/BANDIT-094/coderabbit-formation-review.md
- docs/work/BANDIT-094/formation-review.md
- docs/work/BANDIT-094/coordination-log.jsonl
- docs/work/BANDIT-094/orchestration-plan.md
- docs/work/BANDIT-094/red-evidence.md
- docs/work/BANDIT-094/implementation-evidence.md
- docs/work/BANDIT-094/review-evidence.md
- docs/work/BANDIT-094/landing-verdict.md
- docs/work/BANDIT-094/landing-action.md
- docs/work/BANDIT-094/retrospective.md
- docs/work/BANDIT-094/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create and form this PRD-005.2 Repo PM Create Controller And Prompt Contract slice because BANDIT-PRD-005 is accepted for implementation, BANDIT-093 landed and closed PRD-005.1, the operator directed PRD-004/005 implementation before WIL-V0-TRIAL, and this slice implements Bandit-native Stage 1 create-controller and prompt-contract behavior without approving new product direction, UAT policy, landing autonomy, Trust Verifier cutover, old-gate replacement/wrapping, paid/live routing, merge/push/deploy authority, hosted services, telemetry, external side effects, credential handling, or slash-command adapters. Halt for operator input if later work would approve /bandit-work-create or /bandit-work-execute operator-facing behavior beyond the accepted PRD, change product or UAT direction, approve paid or live reviewer/model routing, approve hosted services, approve telemetry, approve merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, approve external side effects, or resolve genuinely ambiguous product, business, policy, UAT, or explicit cost/risk scope.

## Role Boundary Evidence

- Repo PM owns this Stage 1 source spec, brief repair, formation review
  aggregation, formation approval, and routing/status synchronization.
- Work Item PM may start only after `formation_approved` is recorded and must
  create `docs/work/BANDIT-094/orchestration-plan.md` before RED evidence.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence,
  and acceptance mappings for this Work Item.
- Implementation Writer owns Stage 3 implementation source and implementation
  evidence only. The Stage 3 Writer must not edit tests, test helpers,
  fixtures, RED evidence, acceptance mappings, formation artifacts, review
  artifacts, landing artifacts, retrospective artifacts, roadmap/status files,
  or PRD/source authority files for this Work Item.
- Reviewers own Stage 4 review evidence. Local Qwen may run only through
  `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`;
  CodeRabbit evidence must be terminal or honestly recorded as provider timeout
  replacement evidence.
- Landing Agent owns Stage 5 landing verdict/action. Closeout Agent owns Stage
  6 retrospective, improvement disposition, and next-action routing.

## Permanent Test Ownership Boundary

If Codex authors or materially edits Stage 2 RED tests for this Work Item, the
Stage 3 implementation writer must be a different model family. Regardless of
model or harness, the Stage 3 Writer has zero authority to edit Work
Item-owned tests, test helpers, fixtures, RED evidence, or acceptance mappings.

## Bootstrap Model-Family Separation

During bootstrap, Codex-authored RED evidence routes Stage 3 implementation to
Claude as the default non-Codex writer path, with MiniMax fallback only when
the authorized Stage 3 route fails or times out under the recorded policy. Any
same-model RED/implementation shortcut is a blocker unless a future approved
policy explicitly changes this boundary.

## Source Of Truth And Projection Boundary

`docs/roadmap/CURRENT_CONTEXT.md` and `docs/roadmap/ROADMAP.md` identify the
authorized work target. The create controller, prompt contracts, cockpit
status, session-context packets, Work Intake Ledger, PRDs, specs, and future
slash-command adapters are derived, provenance, or guidance surfaces only
unless a Bandit CLI command writes canonical repo-native artifacts. The Work
Intake Ledger may be refreshed as PRD-005 provenance, but it must not become a
hidden queue, scheduler, claim authority, or priority source.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json

stages:

- Stage 1

authority_roles:

- repo_pm

required_skills:

- bandit

allowed_tools:

- Read repo-local artifacts.
- Write Stage 1 source spec, brief, formation review artifacts, coordination
  log, routing/status surfaces, and PRD-005 intake metadata.
- Run Bandit CLI validation, coordination validation, cockpit status,
  session-context, Local Qwen through the authorized MLX adapter, CodeRabbit
  formation review, git status/log/diff checks, and date for timestamps.

outputs:

- `docs/specs/BANDIT-094-repo-pm-create-controller-and-prompt-contract.json`
- `docs/work/BANDIT-094/brief.md`
- `docs/work/BANDIT-094/qwen-formation-review.md`
- `docs/work/BANDIT-094/coderabbit-formation-review.md`
- `docs/work/BANDIT-094/formation-review.md`
- `docs/work/BANDIT-094/coordination-log.jsonl`
- synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
  `STATUS.md`, and `.bandit/work-intake-ledger.json`

forbidden_actions:

- orchestration-plan
- red-evidence
- implementation
- review-loop
- landing
- retrospective
- prd-005-execute-controller
- role-input-packet
- slash-command-adapter
- cockpit-action
- trust-verifier-cutover
- old-gate-replacement-or-wrapping
- merge-push-deploy

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json

soft_budget_bands:

- formation_review

provider_pricing_evidence:

- not_applicable_local_qwen
- not_applicable_coderabbit_cli

spend_classes:

- local_or_included

continuation_decisions:

- CodeRabbit formation review must receive the full 600-second prompt-required
  timeout before provider-timeout replacement evidence is recorded.
- Local Qwen unavailability is fail-closed and requires operator help rather
  than an alternate reviewer path.

stage_capability_profiles:

- stage1_formation_only

## Forbidden Actions

Repo PM must not create or start Stage 2 RED evidence, Work Item PM
orchestration, implementation, review-loop, landing, UAT, retrospective,
PRD-005.3 execute-controller, PRD-005.4 adapter, local API, State Index,
cockpit action execution, hosted service, telemetry, paid route, merge, push,
deploy, external repo mutation, credential handling, dependency or lockfile
change, package-script change, CI/release workflow change, Trust Verifier
cutover, old-gate replacement or wrapping, landing-autonomy expansion, or
unrelated Phase 8 product work during this Stage 1 formation run.
