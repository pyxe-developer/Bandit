# BANDIT-096: Work Item PM Execute Controller And Route Registry

## Status

Brief Created

## Goal

Implement the third BANDIT-PRD-005 slice: a Work Item PM execute-controller foundation that can advance an already formed Work Item from plan-mode through authorized stage routes with an explicit route registry, internal role input packet assembly, and honest blocker/provider evidence recording, while preserving all existing gates and stop conditions.

## Product Work

work_type: slice

This is the third `BANDIT-PRD-005` implementation slice. It adds the internal
Work Item PM execute-controller foundation, route registry, role input packet
assembly, and provider/blocker evidence recording needed before the later
operator command adapter slice. The work is product-facing in the sense that it
makes the future `/bandit-work-execute` command possible, but this slice is
still an internal CLI/controller foundation and does not add the slash-command
adapter itself.

## Origin

Source authority:

- `AGENTS.md`: Repo PM owns Stage 1 formation, routine technical routing, and
  operator-input boundaries; Work Item PM may execute only after formation is
  approved.
- `CONTEXT.md`: Bandit vocabulary, CLI Authority, role input packet, route,
  evidence, provider, and workflow trust-layer boundaries.
- `docs/prds/BANDIT-PRD-005-bandit-work-commands.md`: accepted product PRD
  for `/bandit-work-create` and `/bandit-work-execute` command behavior.
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`: decomposition names
  `PRD-005.3` as "Work Item PM Execute Controller And Route Registry."
- `docs/work/BANDIT-094/landing-action.md`,
  `docs/work/BANDIT-094/retrospective.md`, and
  `docs/work/BANDIT-094/improvement-disposition.md`: prior PRD-005.2 landing
  and closeout evidence.
- `docs/work/BANDIT-095/landing-action.md`,
  `docs/work/BANDIT-095/retrospective.md`, and
  `docs/work/BANDIT-095/improvement-disposition.md`: closed-anchor
  create-controller repair evidence that unblocks this formation.
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `.bandit/bootstrap-gaps.json`: current routing, no-open-gap state, and
  next-action authority.

## Scope

- Use BANDIT-PRD-005 and docs/prds/BANDIT-PRD-004-005-decomposition.md as source authority for PRD-005.3 after BANDIT-094 landed PRD-005.2 and BANDIT-095 landed the closed-anchor create-controller repair.
- Add a Work Item PM execute-controller behavior for the future /bandit-work-execute path that starts only from an already formed Work Item with formation_approved coordination evidence.
- Verify or create the required Work Item PM plan-mode orchestration evidence before any RED evidence route may be invoked, preserving work-item-pm start as the explicit plan-mode gate.
- Add an explicit stage route registry that maps Stage 2 through Stage 6 work to authorized route types, commands, process adapters, reviewer providers, stop conditions, and evidence outputs without introducing ad hoc model or reviewer fallback.
- Add internal Role Input Packet assembly for authorized stage routes, deriving scoped packet content from the approved brief, stage rubrics, CLEAN_CODE.md, role contracts, allowed writes, forbidden writes, source hierarchy, current evidence, and required stop conditions.
- Add a blocker and provider-evidence recorder so execute-controller outcomes distinguish gate failure, missing authorized route, provider timeout, provider error, malformed output, missing operator-owned input, stale evidence, review blockers, and successful stage transition.
- Preserve CLI Authority and repo-native canonical state: the execute controller may call existing Bandit commands and write normal evidence artifacts, but command output, route registry views, role packets, cockpit status, session context, and prompt contracts remain non-authoritative support surfaces.
- Preserve the authorized Local Qwen reviewer route: .bandit/reviewers/local-qwen.json through node bin/omlx-chat-completions.mjs against the MLX endpoint. Do not allow direct qwen CLI, Ollama, or another ad hoc reviewer route as Local Qwen evidence.
- Preserve the Stage 3 Writer boundary: implementation writers may not edit tests, test helpers, fixtures, RED evidence, or acceptance mappings for the Work Item they implement.
- Record CLEAN_CODE.md read evidence in the brief and require implementation to keep execution orchestration, route lookup, packet assembly, provider/blocker evidence recording, diagnostics, and tests separated into small explicit units.

## Out Of Scope

- Do not implement the PRD-005.4 /bandit-work-create or /bandit-work-execute operator adapter layer, slash-command runtime integration, cockpit action affordances, local API, State Index, hosted service, live polling loop, or browser-owned workflow authority.
- Do not create a public bandit context <stage> workflow command. Role input packets are internal support for authorized route invocation only.
- Do not make route registry output, role input packets, prompt contracts, cockpit status, session-context packets, PRD files, specs, or Work Intake Ledger entries independent workflow authority.
- Do not auto-approve product direction, UAT, policy changes, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, old-gate replacement or wrapping, Notify-And-Revert or Auto-Landing Scope, landing autonomy expansion, paid/live reviewer or model routing, provider-pricing spend classes, merge/push/deploy authority, credential handling, external repo mutation, dependency changes, package-script changes, or CI/release workflow changes.
- Do not add parallel writable workstreams, claim leases, work-surface reservations, worktree lifecycle automation, PR/CI orchestration, public benchmark publication, telemetry, hosted services, or automatic self-update behavior.
- Do not weaken lower-level Bandit role entrypoints, work-item-pm start, artifact creation, reviewer, landing, closeout, coordination, validation, or session-context behavior.

## Acceptance Criteria

- The execute controller refuses to run when no current formed Work Item is eligible, when more than one formed Work Item is eligible, or when the selected Work Item lacks formation_approved coordination evidence.
- The execute controller verifies or records Work Item PM plan-mode orchestration before RED evidence and refuses to create Stage 2 evidence without the plan-mode gate.
- The route registry explicitly maps lifecycle stages and authority roles to authorized route types, commands, process adapters, reviewer routes, expected evidence, stop conditions, and forbidden fallback behavior.
- The route registry fails closed for missing route, unauthorized Local Qwen path, unapproved paid/live model route, policy-required escalation without configured route, and route/provider mismatch.
- Role Input Packet assembly creates internal, derived_non_canonical packet content for authorized stage routes with source hierarchy, brief excerpts, stage rubric requirements, CLEAN_CODE.md expectations, allowed writes, forbidden writes, evidence paths, operator-input boundary, and stop conditions.
- Role Input Packet assembly does not create a public operator workflow command and does not become canonical workflow state.
- The blocker/provider evidence recorder writes or validates explicit evidence for provider timeout, provider error, malformed provider output, unavailable route, missing operator-owned input, stale evidence, review blocker, gate failure, and successful stage transition without reporting partial completion as success.
- CodeRabbit timeout behavior remains honest: a timeout may be recorded as bootstrap_gap replacement evidence only after the configured full timeout window, and no CodeRabbit pass is claimed without terminal pass evidence.
- Local Qwen evidence uses only .bandit/reviewers/local-qwen.json through node bin/omlx-chat-completions.mjs; if that route is unavailable, the controller stops and asks for operator help.
- The execute controller preserves existing lower-level command semantics and records normal coordination transitions and evidence artifacts instead of inventing a separate lifecycle state machine.
- Focused tests cover pre-formation refusal, plan-mode orchestration requirement, authorized Stage 2 route selection, Stage 3 route selection with test-edit boundary preservation, Stage 4 reviewer routing, Stage 5 landing routing, Stage 6 closeout routing, route-registry missing-route refusal, provider-timeout evidence, malformed-provider-output evidence, operator-owned input stop, and no public context command.
- Implementation keeps orchestration, route registry lookup, packet assembly, provider/blocker evidence recording, route invocation, diagnostics, and validation readable, deterministic, and separated from PRD-005.4 adapter behavior.

## Test Plan

- Stage 2 Test Writer writes RED tests for execute-controller refusal before formation_approved and for ambiguous or missing eligible Work Item selection.
- Stage 2 Test Writer writes RED tests proving the execute controller verifies or records Work Item PM plan-mode orchestration before RED evidence.
- Stage 2 Test Writer writes RED tests for authorized Stage 2, Stage 3, Stage 4, Stage 5, and Stage 6 route registry entries and missing-route refusal.
- Stage 2 Test Writer writes RED tests for Local Qwen route enforcement through .bandit/reviewers/local-qwen.json and node bin/omlx-chat-completions.mjs, including refusal of direct qwen CLI, Ollama, or ad hoc reviewer routes.
- Stage 2 Test Writer writes RED tests for CodeRabbit provider timeout, provider error, and malformed output evidence recording without pass claims.
- Stage 2 Test Writer writes RED tests for Role Input Packet content: source hierarchy, stage rubric, clean-code requirements, allowed writes, forbidden writes, evidence paths, operator-input boundary, and derived_non_canonical authority status.
- Stage 2 Test Writer writes RED tests proving the Role Input Packet assembler does not expose or require a public bandit context <stage> workflow command.
- Stage 2 Test Writer writes RED tests for stops on missing operator-owned input, stale evidence, review blockers, and policy-required escalation without an authorized route.
- Run focused execute-controller, route-registry, role-input-packet, provider-evidence, coordination, and role-boundary tests after implementation.
- Run npm run typecheck.
- Run npm test if implementation touches shared CLI routing, validation, formation gate, Work Item PM start behavior, artifact rendering, reviewer routes, landing, closeout, coordination log, cockpit/session-context, risk classification, supply-chain gate, input quarantine, operator-boundary, prompt contracts, or policy validation.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json and node ./bin/bandit.mjs session-context current --json after context artifacts are updated.
- Run git diff --check.

## Verification Plan

- Stage 1 formation verification checks this brief against
  `docs/verification/STAGE_RUBRICS.md`, `CLEAN_CODE.md`, and the formation
  gate.
- Stage 1 formation review must produce
  `docs/work/BANDIT-096/qwen-formation-review.md`,
  `docs/work/BANDIT-096/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-096/formation-review.md` with supported `verdict`,
  `findings_status`, and `findings_disposition` metadata.
- Repo PM approval must run
  `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-096` and append
  `formation_approved` to `docs/work/BANDIT-096/coordination-log.jsonl`.
- Stage 1 closeout for this run must verify `npm run bandit -- validate`,
  `node ./bin/bandit.mjs coordination validate BANDIT-096`,
  `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check`.
- Later stages must add Work Item PM plan-mode orchestration, focused RED
  tests, typecheck, targeted test suites, Bandit validation, Stage 4 review
  evidence, landing verdict/action, and Stage 6 retrospective before PRD-005.4
  can begin.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-11 before creating this source spec. The slice must keep execute-controller orchestration, route registry lookup, internal role input packet assembly, provider/blocker evidence recording, route invocation, diagnostics, and tests small and explicit; avoid hidden workflow authority; preserve role boundaries; preserve the Permanent Test Ownership Boundary; and avoid mixing PRD-005.4 operator adapters, cockpit action execution, local API, State Index, hosted service, telemetry, Trust Verifier cutover, merge/push/deploy, dependency, package-script, CI/release workflow, or unrelated Phase 8 behavior into this slice.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-095 landed and closed with verification, landing verdict, landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, no open bootstrap gaps, and Repo PM formation for PRD-005.3 recorded as the next action.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, no-gap disposition, expected files, required evidence, role boundaries, operator-input status, source-of-truth boundary, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED tests for pre-formation refusal, plan-mode gating, route registry entries and refusals, role input packet content and authority status, provider/blocker evidence recording, Local Qwen route enforcement, CodeRabbit timeout honesty, operator-owned input stops, and no public context command.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through the authorized MLX route, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review, review-subject hash, risk/supply-chain checks where applicable, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not applicable unless the implementation changes an operator-facing product surface beyond internal CLI/controller behavior.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and intake-state updates are required before PRD-005.4, V0 trial, Trust Verifier cutover, or unrelated next work begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this PRD-005.3 implementation slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through .bandit/reviewers/local-qwen.json and bin/omlx-chat-completions.mjs against the MLX OpenAI-compatible endpoint at http://127.0.0.1:8001/v1. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- Role Input Packets are internal derived support artifacts only; they must not become a public operator workflow command or canonical workflow authority.
- No Trust Verifier cutover, old-gate replacement or wrapping, PRD-005.4 operator adapter, public context command, cockpit action execution, local API, State Index, hosted service, telemetry, paid route, merge, push, deploy, external repo mutation, credential handling, dependency change, package-script change, CI/release workflow change, or unrelated Phase 8 authority is approved by this slice.

## Bootstrap Gap Or No-Gap Disposition

No open bootstrap gap blocks this slice. `BANDIT-095` resolved the active
create-controller closed-anchor routing gap and routed the repo to PRD-005.3
formation.

CodeRabbit provider timeout during formation may be recorded as
`bootstrap_gap` replacement evidence only after the full prompt-required
timeout. Local Qwen unavailability is not substitutable; it requires operator
help because the authorized reviewer route is fixed.

## Expected Files

- docs/specs/BANDIT-096-work-item-pm-execute-controller-and-route-registry.json
- docs/work/BANDIT-096/brief.md
- docs/work/BANDIT-096/qwen-formation-review.md
- docs/work/BANDIT-096/coderabbit-formation-review.md
- docs/work/BANDIT-096/formation-review.md
- docs/work/BANDIT-096/coordination-log.jsonl
- src/state/work-execute-controller.ts
- src/state/stage-route-registry.ts
- src/state/role-input-packets.ts
- src/state/provider-blocker-evidence.ts
- src/commands/work-execute-controller.ts
- src/commands/work-item-pm.ts
- src/commands/validate.ts
- src/cli.ts
- test/work-execute-controller.test.mjs
- test/stage-route-registry.test.mjs
- test/role-input-packets.test.mjs
- test/provider-blocker-evidence.test.mjs
- docs/work/BANDIT-096/orchestration-plan.md
- docs/work/BANDIT-096/red-evidence.md
- docs/work/BANDIT-096/implementation-evidence.md
- docs/work/BANDIT-096/writer-report.md
- docs/work/BANDIT-096/stage3-pm-acceptance.md
- docs/work/BANDIT-096/coderabbit-review.md
- docs/work/BANDIT-096/local-qwen-review.md
- docs/work/BANDIT-096/review-evidence.md
- docs/work/BANDIT-096/landing-verdict.md
- docs/work/BANDIT-096/landing-action.md
- docs/work/BANDIT-096/retrospective.md
- docs/work/BANDIT-096/improvement-disposition.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md
- .bandit/work-intake-ledger.json

## Stage 1 Boundary For Expected Files

Only the source spec, brief, formation review artifacts, coordination log,
roadmap/current-context/status routing, and PRD-005 intake metadata may be
created or edited during Repo PM Stage 1 formation.

Later listed orchestration, RED, implementation, review, landing, UAT,
retrospective, and closeout artifacts are expected downstream surfaces for Work
Item PM, Test Writer, Implementation Writer, reviewers, Landing Agent, and
Closeout Agent. Repo PM must not create `orchestration-plan.md`, RED evidence,
implementation evidence, review-loop evidence, landing evidence, UAT evidence,
retrospective evidence, closeout evidence, PRD-005.4 adapter evidence, or
unrelated Phase 8 evidence in this run.

## First Implementation Order

- Repo PM creates the work item and records formation review evidence before Work Item PM execution.
- Work Item PM records or verifies orchestration-plan.md only after formation_approved and before RED evidence.
- Test Writer writes failing tests for execute-controller formation refusal, plan-mode gating, route registry entries and refusals, role input packet content and authority status, provider/blocker evidence recording, Local Qwen route enforcement, CodeRabbit timeout honesty, operator-owned input stops, and no public context command.
- Implementation Writer adds the minimal execute-controller, route-registry, internal role input packet, provider/blocker evidence, command routing, validation wiring, and diagnostics needed to satisfy RED tests, without editing Test Writer-owned files if Codex authored the RED tests.
- Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, and evidence freshness before Stage 4 review.
- Reviewers run Local Qwen through the authorized MLX route and CodeRabbit or honest provider-timeout/refusal evidence; PM dispositions any non-blocking findings before landing.
- Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, and synchronizes current context, roadmap, STATUS, and intake state.

## Smell Triggers

- Any implementation that starts from an unformed Work Item or skips formation_approved evidence is a blocker.
- Any implementation that starts Stage 2 before Work Item PM plan-mode orchestration evidence is recorded or verified is a blocker.
- Any implementation that uses direct qwen CLI, Ollama, or another ad hoc reviewer route as Local Qwen evidence is a blocker.
- Any implementation that reports CodeRabbit timeout, provider error, malformed output, or missing route as pass evidence is a blocker.
- Any implementation that treats route registry output, role input packets, prompt contracts, cockpit/session-context output, WIL entries, PRD files, specs, or command output as canonical workflow authority is a blocker.
- Any implementation that creates a public bandit context <stage> workflow command is scope creep.
- Any implementation that lets an Implementation Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence is a blocker.
- Any implementation that auto-approves product direction, UAT, policy, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, old-gate replacement/wrapping, merge/push/deploy, paid/live reviewer routing, hosted service, telemetry, external mutation, credential handling, dependency, package-script, CI/release workflow, or ambiguous scope is a blocker.
- Any implementation that creates PRD-005.4 operator adapter behavior, cockpit action execution, local API, State Index, hosted service, telemetry, merge, push, deploy, Trust Verifier cutover, dependency changes, package-script changes, CI/release workflow changes, external repo mutation, or unrelated Phase 8 artifacts is scope creep.
- Any large mixed function that combines current target selection, plan-mode gating, route registry lookup, packet assembly, provider parsing, stage evidence rendering, reviewer routing, landing, closeout, and context synchronization without small explicit boundaries is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-096/brief.md
- docs/work/BANDIT-096/qwen-formation-review.md
- docs/work/BANDIT-096/coderabbit-formation-review.md
- docs/work/BANDIT-096/formation-review.md
- docs/work/BANDIT-096/coordination-log.jsonl
- docs/work/BANDIT-096/orchestration-plan.md
- docs/work/BANDIT-096/red-evidence.md
- docs/work/BANDIT-096/implementation-evidence.md
- docs/work/BANDIT-096/review-evidence.md
- docs/work/BANDIT-096/landing-verdict.md
- docs/work/BANDIT-096/landing-action.md
- docs/work/BANDIT-096/retrospective.md
- docs/work/BANDIT-096/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create and form this PRD-005.3 Work Item PM Execute Controller And Route Registry slice because BANDIT-PRD-005 is accepted for implementation, PRD-005.1 and PRD-005.2 landed and closed, BANDIT-095 repaired the create-controller closed-anchor routing gap, the operator directed PRD-004/005 implementation before WIL-V0-TRIAL, and this slice implements internal execute-controller, route-registry, role-packet, and provider/blocker evidence behavior without approving new product direction, UAT policy, landing autonomy, Trust Verifier cutover, old-gate replacement/wrapping, paid/live routing, merge/push/deploy authority, hosted services, telemetry, external side effects, credential handling, public context commands, or slash-command adapters. Halt for operator input if later work would approve /bandit-work-execute operator-facing adapter behavior beyond the accepted PRD, change product or UAT direction, approve paid or live reviewer/model routing, approve hosted services, approve telemetry, approve merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, approve external side effects, or resolve genuinely ambiguous product, business, policy, UAT, or explicit cost/risk scope.

## Role Boundary Evidence

- Repo PM owns this Stage 1 source spec, brief repair, formation review
  aggregation, formation approval, and routing/status synchronization.
- Work Item PM may start only after `formation_approved` is recorded and must
  create or verify `docs/work/BANDIT-096/orchestration-plan.md` before RED
  evidence.
- Test Writer owns Stage 2 RED tests, test helpers, fixtures, RED evidence,
  and acceptance mappings for this Work Item.
- Implementation Writer owns Stage 3 implementation source and implementation
  evidence only. The Stage 3 Writer must not edit tests, test helpers,
  fixtures, RED evidence, acceptance mappings, formation artifacts, review
  artifacts, landing artifacts, retrospective artifacts, roadmap/status files,
  or PRD/source authority files for this Work Item.
- Reviewers own Stage 4 review evidence. Local Qwen may run only through
  `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`;
  CodeRabbit evidence must be terminal or honestly recorded as provider
  timeout replacement evidence.
- Landing Agent owns Stage 5 landing verdict/action. Closeout Agent owns Stage
  6 retrospective, improvement disposition, and next-action routing.

## Permanent Test Ownership Boundary

If Codex authors or materially edits Stage 2 RED tests for this Work Item, the
Stage 3 implementation writer must be a different model family. Regardless of
model or harness, the Stage 3 Writer has zero authority to create, edit,
delete, regenerate, format, or mechanically adjust Work Item-owned tests, test
helpers, fixtures, RED evidence, or acceptance mappings.

## Bootstrap Model-Family Separation

During bootstrap, Codex-authored RED evidence routes Stage 3 implementation to
Claude as the default non-Codex writer path, with MiniMax fallback only when
the authorized Stage 3 route fails or times out under the recorded policy. Any
same-model RED/implementation shortcut is a blocker unless a future approved
policy explicitly changes this boundary.

## Source Of Truth And Projection Boundary

`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, the work-item
package, and coordination log are canonical for this slice. The execute
controller, route registry, role input packets, provider/blocker evidence
helpers, prompt contracts, cockpit status, session-context packets, Work Intake
Ledger, PRDs, specs, and future slash-command adapters are derived, provenance,
or guidance surfaces unless a Bandit CLI command writes canonical repo-native
artifacts.

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

- `docs/specs/BANDIT-096-work-item-pm-execute-controller-and-route-registry.json`
- `docs/work/BANDIT-096/brief.md`
- `docs/work/BANDIT-096/qwen-formation-review.md`
- `docs/work/BANDIT-096/coderabbit-formation-review.md`
- `docs/work/BANDIT-096/formation-review.md`
- `docs/work/BANDIT-096/coordination-log.jsonl`
- synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
  `STATUS.md`, and `.bandit/work-intake-ledger.json`

forbidden_actions:

- orchestration-plan
- red-evidence
- implementation
- review-loop
- landing
- retrospective
- prd-005-operator-adapter
- public-context-command
- cockpit-action
- local-api
- state-index
- trust-verifier-cutover
- old-gate-replacement-or-wrapping
- paid-live-routing
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

Repo PM must not create or start Work Item PM orchestration, Stage 2 RED
evidence, implementation, review-loop evidence, landing evidence, UAT evidence,
retrospective evidence, closeout evidence, PRD-005.4 operator adapter work,
public context command work, cockpit action execution, local API, State Index,
hosted service, telemetry, paid route, merge, push, deploy, external repo
mutation, credential handling, dependency or lockfile change, package-script
change, CI/release workflow change, Trust Verifier cutover, old-gate
replacement or wrapping, landing-autonomy expansion, or unrelated Phase 8
product work during this Stage 1 formation run.
