# BANDIT-097: PRD-005.4 Operator Command Adapters

## Status

Brief Created

## Goal

Implement the fourth BANDIT-PRD-005 slice: thin operator command adapters for the `/bandit-work-create` and `/bandit-work-execute` workflow entrypoints, or their CLI-equivalent invocation layer, that delegate to the already-landed Repo PM create controller and Work Item PM execute controller while preserving CLI Authority, source hierarchy, stage boundaries, and honest blocker reporting.

## Product Work

work_type: slice

This is the fourth `BANDIT-PRD-005` implementation slice. It adds the thin
operator command adapter layer for `/bandit-work-create` and
`/bandit-work-execute`, or the repo CLI-equivalent command names that implement
those entrypoints. The adapters are product-facing command surfaces, but their
workflow authority remains delegated to the existing Bandit CLI controllers and
repo-native artifacts.

## Origin

Source authority:

- `AGENTS.md`: Repo PM owns Stage 1 formation, routine technical routing,
  operator-input boundaries, and slice-boundary enforcement.
- `CONTEXT.md`: Bandit vocabulary, CLI Authority, operator command adapter,
  Role Input Packet, trust-layer, source-of-truth, and non-canonical support
  surface boundaries.
- `docs/prds/BANDIT-PRD-005-bandit-work-commands.md`: accepted product PRD
  for `/bandit-work-create` and `/bandit-work-execute`.
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`: decomposition names
  `PRD-005.4` as "Operator Command Adapters."
- `docs/work/BANDIT-094/landing-action.md`,
  `docs/work/BANDIT-094/retrospective.md`, and
  `docs/work/BANDIT-094/improvement-disposition.md`: landed PRD-005.2
  Repo PM create-controller and prompt-contract foundation.
- `docs/work/BANDIT-095/landing-action.md`,
  `docs/work/BANDIT-095/retrospective.md`, and
  `docs/work/BANDIT-095/improvement-disposition.md`: landed closed-anchor
  create-controller routing repair.
- `docs/work/BANDIT-096/landing-action.md`,
  `docs/work/BANDIT-096/retrospective.md`, and
  `docs/work/BANDIT-096/improvement-disposition.md`: landed PRD-005.3
  Work Item PM execute-controller, route-registry, role-packet, and
  provider/blocker evidence foundation.
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  and `.bandit/bootstrap-gaps.json`: current routing, no-open-gap state, and
  next-action authority for PRD-005.4 formation.

## Scope

- Use BANDIT-PRD-005 and docs/prds/BANDIT-PRD-004-005-decomposition.md as source authority for PRD-005.4 after BANDIT-094, BANDIT-095, and BANDIT-096 landed and closed the required resolver, create-controller, closed-anchor, and execute-controller foundations.
- Add thin operator command adapters for `/bandit-work-create` and `/bandit-work-execute`, or the repo CLI-equivalent command names that implement those entrypoints, without duplicating roadmap parsing, Work Item allocation, formation approval, stage routing, role input packet assembly, reviewer routing, landing, or closeout logic.
- Make the create adapter delegate to the Repo PM create-controller path so it resolves the roadmap/current-context target, creates or reports a Work Item, repairs only derivable Stage 1 prerequisites, and stops before Stage 2.
- Make the execute adapter delegate to the Work Item PM execute-controller path so it starts only from a formed Work Item, preserves plan-mode gating before RED evidence, and reports the next authorized route or blocker without creating new Work Items.
- Render concise operator-facing output for both adapters: target or work item, action performed or refused, stage reached, evidence written or required, blocker if any, required operator input if any, and the next safe command.
- Keep slash-command text, adapter output, prompt contracts, cockpit affordances, session-context packets, and Work Intake Ledger entries non-authoritative. Canonical workflow state remains in Bandit CLI-validated repo artifacts, roadmap/current-context files, Work Item packages, coordination logs, and policy evidence.
- Preserve the authorized Local Qwen reviewer route: `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint. Do not allow direct `qwen` CLI, Ollama, or another ad hoc reviewer route as Local Qwen evidence.
- Preserve the Permanent Test Ownership Boundary and Bootstrap Model-Family Separation for all downstream execution launched through the execute adapter.
- Record CLEAN_CODE.md read evidence in the brief and require implementation to keep adapters, command rendering, controller delegation, refusal diagnostics, and tests small and explicit.

## Out Of Scope

- Do not implement a new workflow state machine, scheduler, claim system, Work Intake Ledger priority engine, local API, State Index, hosted service, live polling loop, cockpit action UI, or browser-owned workflow authority.
- Do not replace lower-level Bandit role entrypoints, Repo PM create-controller behavior, Work Item PM execute-controller behavior, roadmap-work-target resolver behavior, stage route registry behavior, role input packet behavior, provider/blocker evidence behavior, reviewer commands, landing commands, closeout commands, coordination validation, or session-context behavior.
- Do not create a public `bandit context <stage>` workflow command. Role Input Packets remain internal support for authorized route invocation only.
- Do not start PRD-005.4 RED evidence, implementation, review-loop evidence, landing evidence, UAT evidence, retrospective evidence, closeout evidence, V0 Closeout Claude Code A/B Product-Value Trial implementation, Trust Verifier cutover, old-gate replacement or wrapping, PR/CI/CD implementation, installed-copy update-path implementation, local API work, State Index work, guarded browser action execution, or unrelated Phase 8 product work during Stage 1 formation.
- Do not auto-approve product direction, UAT, policy changes, business tradeoffs, explicit cost/risk posture, landing autonomy expansion, Notify-And-Revert or Auto-Landing Scope, paid/live reviewer or model routing, provider-pricing spend classes, public package publishing, paid registry setup, hosted update service, telemetry, automatic self-update, credential handling, merge/push/deploy authority, external repo mutation, installed global skill mutation, automation prompt mutation, dependency changes, package-script changes, lockfile changes, or CI/release workflow changes.

## Acceptance Criteria

- The create adapter invokes the existing Repo PM create-controller path and does not independently parse roadmap/current-context authority, scan WIL as a scheduler, allocate Work Items, write formation evidence, or approve formation outside the controller and existing Repo PM gates.
- The create adapter stops at `brief_created`, `already_formed`, `formation_approved`, an explicit blocker, or required operator-owned input, and it never creates `orchestration-plan.md`, RED evidence, implementation evidence, review-loop evidence, landing evidence, UAT evidence, retrospective evidence, or closeout evidence.
- The execute adapter invokes the existing Work Item PM execute-controller path and refuses to create new Work Items or run from a Work Item without `formation_approved` coordination evidence.
- The execute adapter preserves the Work Item PM plan-mode gate before Stage 2 RED evidence and reports missing plan-mode evidence as a blocker or next required action rather than skipping it.
- Adapter output is concise and operator-facing while still naming the source target or Work Item, action taken or refused, evidence written or required, blocker reason if any, required operator input if any, and next safe command.
- Both adapters preserve CLI Authority: adapter command text and output are non-canonical support surfaces, and all durable state changes happen through existing Bandit CLI commands and repo-native artifacts.
- Both adapters fail closed when roadmap/current-context state conflicts, no approved target exists, Local Qwen is unavailable through the authorized adapter route, CodeRabbit terminal evidence is absent without accepted timeout evidence, operator-owned input is required, or no authorized stage route exists.
- Local Qwen evidence remains restricted to `.bandit/reviewers/local-qwen.json` through `node bin/omlx-chat-completions.mjs`; direct `qwen`, Ollama, paid/live reviewer routes, or ad hoc local reviewer commands are refused.
- The adapters do not expose a public `bandit context <stage>` command and do not make Role Input Packets canonical workflow authority.
- Focused tests cover create-adapter delegation, create-adapter refusal before source authority exists, idempotent already-formed reporting, no Stage 2 artifacts from create, execute-adapter refusal before `formation_approved`, execute-adapter no-new-work-item behavior, plan-mode gate reporting, concise status rendering, Local Qwen route refusal, and command separation between create and execute.
- Implementation keeps adapter parsing, controller delegation, output rendering, refusal mapping, and tests small, deterministic, and separated from lower-level controller logic.

## Test Plan

- Stage 2 Test Writer writes RED tests for the create adapter delegating to the existing Repo PM create-controller and rendering the target, work item, status, evidence, and next safe command.
- Stage 2 Test Writer writes RED tests proving the create adapter does not create Stage 2 or later artifacts and does not duplicate Work Item allocation or formation logic.
- Stage 2 Test Writer writes RED tests for create-adapter refusal when roadmap/current-context disagree, when no explicit source target exists, and when operator-owned input is required.
- Stage 2 Test Writer writes RED tests for the execute adapter delegating to the existing Work Item PM execute-controller and refusing to create new Work Items.
- Stage 2 Test Writer writes RED tests for execute-adapter refusal before `formation_approved`, plan-mode gate reporting before RED evidence, missing route refusal, and operator-owned input blocker reporting.
- Stage 2 Test Writer writes RED tests for Local Qwen route enforcement through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`, including refusal of direct `qwen` CLI, Ollama, paid/live reviewer routes, or ad hoc reviewer commands.
- Stage 2 Test Writer writes RED tests proving adapter output, slash-command text, prompt contracts, cockpit affordances, session-context packets, and Role Input Packets remain non-canonical support surfaces.
- Run focused adapter tests, create-controller tests, execute-controller tests, route-registry tests, role-input-packet tests, provider/blocker evidence tests, and CLI routing tests after implementation.
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
  `docs/work/BANDIT-097/qwen-formation-review.md`,
  `docs/work/BANDIT-097/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-097/formation-review.md` with supported `verdict`,
  `findings_status`, and `findings_disposition` metadata.
- Repo PM approval must run
  `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-097` and append
  `formation_approved` to `docs/work/BANDIT-097/coordination-log.jsonl`.
- Stage 1 closeout for this run must verify `npm run bandit -- validate`,
  `node ./bin/bandit.mjs coordination validate BANDIT-097`,
  `node ./bin/bandit.mjs cockpit status --json`,
  `node ./bin/bandit.mjs session-context current --json`, and
  `git diff --check`.
- Later stages must add Work Item PM plan-mode orchestration, focused RED
  tests, typecheck, targeted test suites, Bandit validation, Stage 4 review
  evidence, landing verdict/action, and Stage 6 retrospective before the V0
  trial, Trust Verifier cutover, local API, State Index, cockpit action work,
  or unrelated Phase 8 work can begin.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-11 before creating this source spec. The slice must keep operator adapters thin; reuse the existing Repo PM create-controller, Work Item PM execute-controller, stage route registry, role input packet assembler, and provider/blocker evidence boundaries; avoid hidden workflow authority; preserve role boundaries; preserve the Permanent Test Ownership Boundary; and avoid mixing local API, State Index, cockpit action execution, hosted service, telemetry, Trust Verifier cutover, merge/push/deploy, dependency, package-script, CI/release workflow, installed global skill mutation, automation prompt mutation, or unrelated Phase 8 behavior into this adapter slice.

## Stage-Rubric Checklist

- Stage 0: Context Readiness | pass | BANDIT-096 landed and closed with verification, landing verdict, landing action, retrospective, improvement disposition, synchronized roadmap/current-context/status, no open bootstrap gaps, and Repo PM formation for PRD-005.4 recorded as the next action.
- Stage 1: Work-Item Brief And Spec | pass | This spec defines goal, source authority, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, no-gap disposition, expected files, required evidence, role boundaries, operator-input status, source-of-truth boundary, forbidden actions, implementation order, and smell triggers.
- Stage 2: Test Design And RED Evidence | required next | Test Writer must produce RED tests for create-adapter delegation and refusal, execute-adapter delegation and refusal, no Stage 2 artifacts from create, no new Work Item from execute, plan-mode gate reporting, Local Qwen route refusal, concise output, and command separation.
- Stage 3: Implementation Clean-Code Rubric | required later | Implementation must be routed to a different model family if Codex authors RED tests and must not edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence.
- Stage 4: Review And Cross-Model Gates | required later | Local Qwen through the authorized MLX route, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review, review-subject hash, risk/supply-chain checks where applicable, and clean-code review are required before landing.
- Stage 5: Landing And UAT | required later | Landing verdict, land-check, local-record landing action, and clean-code compliance evidence are required; product UAT is not applicable unless implementation adds a user-facing cockpit/browser surface beyond CLI operator command adapters.
- Stage 6: Retrospective And Improvement Capture | required later | Retrospective, improvement/no-action dispositions, current context, roadmap, STATUS, and intake-state updates are required before V0 trial, Trust Verifier cutover, local API, State Index, cockpit actions, or unrelated next work begins.

## Bootstrap Gaps

- No open bootstrap gap blocks this PRD-005.4 implementation slice.
- Live CodeRabbit may time out or be unavailable; if so, record provider-timeout/bootstrap replacement evidence after the full required wait and do not claim a CodeRabbit pass.
- Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at `http://127.0.0.1:8001/v1`. If the endpoint or adapter is unavailable, stop and ask the operator for help rather than substituting another reviewer route.
- Adapter command text, slash-command names, prompt contracts, cockpit affordances, session-context packets, and Role Input Packets are derived support surfaces only; they must not become canonical workflow authority.
- No Trust Verifier cutover, old-gate replacement or wrapping, local API, State Index, cockpit action execution, hosted service, telemetry, paid route, merge, push, deploy, external repo mutation, installed global skill mutation, automation prompt mutation, credential handling, dependency change, package-script change, lockfile change, CI/release workflow change, public package publishing, paid registry setup, hosted update service, automatic self-update, V0 trial implementation, or unrelated Phase 8 authority is approved by this slice.

## Bootstrap Gap Or No-Gap Disposition

No open bootstrap gap blocks this slice. `BANDIT-096` closed the final
PRD-005.3 prerequisite and routed the repo to PRD-005.4 formation.

CodeRabbit provider timeout during formation may be recorded as
`bootstrap_gap` replacement evidence only after the full prompt-required
timeout. Local Qwen unavailability is not substitutable; it requires operator
help because the authorized reviewer route is fixed.

## Expected Files

- docs/specs/BANDIT-097-operator-command-adapters.json
- docs/work/BANDIT-097/brief.md
- docs/work/BANDIT-097/qwen-formation-review.md
- docs/work/BANDIT-097/coderabbit-formation-review.md
- docs/work/BANDIT-097/formation-review.md
- docs/work/BANDIT-097/coordination-log.jsonl
- src/commands/bandit-work-create.ts
- src/commands/bandit-work-execute.ts
- src/commands/work-create-controller.ts
- src/commands/work-execute-controller.ts
- src/cli.ts
- src/state/work-create-controller.ts
- src/state/work-execute-controller.ts
- src/state/stage-route-registry.ts
- src/state/role-input-packets.ts
- src/state/provider-blocker-evidence.ts
- test/bandit-work-command-adapters.test.mjs
- test/work-create-controller.test.mjs
- test/work-execute-controller.test.mjs
- test/stage-route-registry.test.mjs
- test/role-input-packets.test.mjs
- test/provider-blocker-evidence.test.mjs
- docs/work/BANDIT-097/orchestration-plan.md
- docs/work/BANDIT-097/red-evidence.md
- docs/work/BANDIT-097/implementation-evidence.md
- docs/work/BANDIT-097/writer-report.md
- docs/work/BANDIT-097/stage3-pm-acceptance.md
- docs/work/BANDIT-097/coderabbit-review.md
- docs/work/BANDIT-097/local-qwen-review.md
- docs/work/BANDIT-097/review-evidence.md
- docs/work/BANDIT-097/landing-verdict.md
- docs/work/BANDIT-097/landing-action.md
- docs/work/BANDIT-097/retrospective.md
- docs/work/BANDIT-097/improvement-disposition.md
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
retrospective evidence, closeout evidence, V0 trial evidence, Trust Verifier
cutover evidence, or unrelated Phase 8 evidence in this run.

## First Implementation Order

- Repo PM creates the work item and records formation review evidence before Work Item PM execution.
- Work Item PM records or verifies orchestration-plan.md only after formation_approved and before RED evidence.
- Test Writer writes failing tests for create-adapter delegation and refusal, execute-adapter delegation and refusal, no Stage 2 artifacts from create, no new Work Item from execute, plan-mode gate reporting, Local Qwen route refusal, concise output, command separation, and non-canonical adapter surfaces.
- Implementation Writer adds the minimal command adapter modules, CLI routing, output rendering, and refusal mapping needed to satisfy RED tests, without editing Test Writer-owned files if Codex authored the RED tests.
- Codex PM verifies focused tests, typecheck, full tests as needed, Bandit validation, cockpit/session-context derived status, clean-code compliance, and evidence freshness before Stage 4 review.
- Reviewers run Local Qwen through the authorized MLX route and CodeRabbit or honest provider-timeout/refusal evidence; PM dispositions any non-blocking findings before landing.
- Landing Agent writes landing verdict/action; Closeout Agent records retrospective, improvement/no-action disposition, and synchronizes current context, roadmap, STATUS, and intake state.

## Smell Triggers

- Any implementation that parses roadmap/current-context, WIL, PRD, or Work Item artifacts inside the thin adapters instead of delegating to existing controller/state helpers is a clean-code and authority blocker.
- Any implementation that creates Stage 2 or later evidence from the create adapter is a blocker.
- Any implementation that creates a new Work Item from the execute adapter is a blocker.
- Any implementation that starts execution without `formation_approved` coordination evidence is a blocker.
- Any implementation that skips Work Item PM plan-mode orchestration before RED evidence is a blocker.
- Any implementation that uses direct `qwen` CLI, Ollama, paid/live reviewer routes, or another ad hoc reviewer route as Local Qwen evidence is a blocker.
- Any implementation that reports CodeRabbit timeout, provider error, malformed output, missing route, missing operator-owned input, stale evidence, review blockers, or gate failure as success is a blocker.
- Any implementation that treats adapter output, slash-command text, prompt contracts, cockpit/session-context output, WIL entries, PRD files, specs, or Role Input Packets as canonical workflow authority is a blocker.
- Any implementation that creates a public `bandit context <stage>` workflow command is scope creep.
- Any implementation that lets an Implementation Writer edit tests, test helpers, fixtures, RED evidence, acceptance mappings, or Test Writer-owned evidence is a blocker.
- Any implementation that auto-approves product direction, UAT, policy, business tradeoffs, explicit cost/risk posture, Trust Verifier cutover, old-gate replacement/wrapping, merge/push/deploy, paid/live reviewer routing, hosted service, telemetry, external mutation, installed global skill mutation, automation prompt mutation, credential handling, dependency, package-script, lockfile, CI/release workflow, public package publishing, paid registry setup, hosted update service, automatic self-update, or ambiguous scope is a blocker.
- Any large mixed function that combines adapter parsing, target resolution, Work Item creation, formation approval, plan-mode gating, route registry lookup, packet assembly, provider parsing, evidence rendering, reviewer routing, landing, closeout, and context synchronization without small explicit boundaries is a clean-code blocker.

## Required Evidence

- docs/work/BANDIT-097/brief.md
- docs/work/BANDIT-097/qwen-formation-review.md
- docs/work/BANDIT-097/coderabbit-formation-review.md
- docs/work/BANDIT-097/formation-review.md
- docs/work/BANDIT-097/coordination-log.jsonl
- docs/work/BANDIT-097/orchestration-plan.md
- docs/work/BANDIT-097/red-evidence.md
- docs/work/BANDIT-097/implementation-evidence.md
- docs/work/BANDIT-097/review-evidence.md
- docs/work/BANDIT-097/landing-verdict.md
- docs/work/BANDIT-097/landing-action.md
- docs/work/BANDIT-097/retrospective.md
- docs/work/BANDIT-097/improvement-disposition.md

## Operator Input Status

No operator-owned input is required to create and form this PRD-005.4 Operator Command Adapters slice because BANDIT-PRD-005 is accepted for implementation, PRD-005.1 through PRD-005.3 landed and closed, BANDIT-095 repaired closed-anchor routing, the operator directed PRD-004/005 implementation before WIL-V0-TRIAL, and this slice implements thin operator command adapters or CLI-equivalent invocation behavior over existing controllers without approving new product direction, UAT policy, landing autonomy, Trust Verifier cutover, old-gate replacement/wrapping, paid/live routing, public package publishing, paid registry setup, hosted update services, telemetry, automatic self-update, merge/push/deploy authority, external repo mutation, installed global skill mutation, automation prompt mutation, credential handling, dependency changes, package-script changes, lockfile changes, CI/release workflow changes, or hosted services. Halt for operator input if later work would change command names beyond the accepted PRD, change product or UAT direction, approve paid or live reviewer/model routing, approve public package publishing, approve paid registry setup, approve hosted update services, approve telemetry, approve automatic self-update, approve credential handling, approve merge/push/deploy authority, approve Trust Verifier cutover, replace or wrap old gates, approve external side effects, approve installed global skill mutation, approve automation prompt mutation, or resolve genuinely ambiguous product, business, policy, UAT, or explicit cost/risk scope.

## Role Boundary Evidence

- Repo PM owns this Stage 1 source spec, brief repair, formation review
  aggregation, formation approval, and routing/status synchronization.
- Work Item PM may start only after `formation_approved` is recorded and must
  create or verify `docs/work/BANDIT-097/orchestration-plan.md` before RED
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
package, and coordination log are canonical for this slice. The operator
command adapters, slash-command names, prompt contracts, cockpit affordances,
session-context packets, Role Input Packets, Work Intake Ledger, PRDs, specs,
and command output are derived, provenance, or guidance surfaces unless a
Bandit CLI command writes canonical repo-native artifacts.

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

- `docs/specs/BANDIT-097-operator-command-adapters.json`
- `docs/work/BANDIT-097/brief.md`
- `docs/work/BANDIT-097/qwen-formation-review.md`
- `docs/work/BANDIT-097/coderabbit-formation-review.md`
- `docs/work/BANDIT-097/formation-review.md`
- `docs/work/BANDIT-097/coordination-log.jsonl`
- synchronized `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
  `STATUS.md`, and `.bandit/work-intake-ledger.json`

forbidden_actions:

- orchestration-plan
- red-evidence
- implementation
- review-loop
- landing
- retrospective
- local-api
- state-index
- cockpit-action
- trust-verifier-cutover
- old-gate-replacement-or-wrapping
- paid-live-routing
- merge-push-deploy
- external-repo-mutation
- installed-global-skill-mutation
- automation-prompt-mutation

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
retrospective evidence, closeout evidence, V0 trial evidence, Trust Verifier
cutover evidence, local API work, State Index work, cockpit action execution,
hosted service work, telemetry, paid route, merge, push, deploy, external repo
mutation, installed global skill mutation, automation prompt mutation,
credential handling, dependency or lockfile change, package-script change,
CI/release workflow change, old-gate replacement or wrapping,
landing-autonomy expansion, or unrelated Phase 8 product work during this
Stage 1 formation run.
