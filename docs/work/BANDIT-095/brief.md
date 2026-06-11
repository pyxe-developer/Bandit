# BANDIT-095: Repo PM Create Controller Closed Anchor Routing

## Status

Brief Created

## Non-Product Work

Repair the Repo PM create controller so it handles the valid closed-current-work interstitial state where ROADMAP.md retains the last closed work item as the current anchor and CURRENT_CONTEXT.md records a next unformed roadmap target.

work_type: chore

## Origin

During the 2026-06-11 Repo PM brief-creation run after BANDIT-094 closeout, `node ./bin/bandit.mjs repo-pm create-controller --json` failed with `Current work item BANDIT-094 is not formation_approved; refusing to re-allocate or skip formation review.` Live repo artifacts agreed that BANDIT-094 was closed and the exact next action was Repo PM formation for PRD-005.3 Work Item PM Execute Controller And Route Registry. BANDIT-094 acceptance criteria required the create controller to handle a closed current work item plus next unformed roadmap target, so this is a bounded bootstrap gap in the just-landed controller path.

Source authority:

- `AGENTS.md`: new bootstrap gaps must be recorded and addressed before
  unrelated product work proceeds.
- `docs/work/BANDIT-094/brief.md`: the accepted PRD-005.2 contract requires
  closed-current-work plus next-unformed-target handling.
- `docs/work/BANDIT-094/implementation-evidence.md`,
  `docs/work/BANDIT-094/landing-action.md`,
  `docs/work/BANDIT-094/retrospective.md`, and
  `docs/work/BANDIT-094/improvement-disposition.md`: prior-slice landing and
  closeout evidence.
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and
  `STATUS.md`: current next-action authority naming PRD-005.3 as the next
  planned product slice before this gap was discovered.
- `.bandit/bootstrap-gaps.json`: now records
  `BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING` as the active
  chore linked to `BANDIT-095`.

## Scope

- Add focused RED evidence proving `repo-pm create-controller --json` fails in the current live closed-anchor state after BANDIT-094 closeout instead of selecting the next unformed PRD-005.3 target.
- Repair the create-controller target selection so a closed current work item retained as a derived-status anchor does not block creation of the roadmap/current-context authorized next unformed target.
- Preserve idempotent current-target behavior for active or formation_approved current Work Items; do not reallocate an unclosed, unformed, or contradictory current Work Item.
- Preserve fail-closed behavior for roadmap/current-context disagreement, missing explicit source spec, operator-owned input, missing authorized Local Qwen route, ambiguous target scope, and duplicate Work Item allocation.
- Preserve CLI authority and source hierarchy: ROADMAP.md and CURRENT_CONTEXT.md remain priority authority, Work Intake Ledger remains provenance only, and cockpit/session-context output remains derived non-canonical.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-06-11 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope: Repo PM owns Stage 1 formation; Test Writer owns Stage 2 RED evidence; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to a different model family during bootstrap; Stage 3 Writer has no authority to edit tests, fixtures, RED evidence, or acceptance mappings; reviewers own Stage 4 evidence; Landing Agent owns Stage 5 verdict/action evidence; Closeout Agent owns Stage 6 retrospective and improvement/no-action disposition evidence.
- Future-work scope: this chore must not implement PRD-005.3 execute-controller behavior, stage route registry, role input packet assembly, provider/blocker evidence recorder, PRD-005.4 operator adapters, public `bandit context <stage>` command, cockpit action execution, local API, State Index, hosted service, telemetry, merge, push, deploy, Trust Verifier cutover, old-gate replacement or wrapping, paid/live reviewer routing, dependency or lockfile changes, or unrelated Phase 8 product work.

## Out Of Scope

- Do not create or approve the PRD-005.3 Work Item PM Execute Controller And
  Route Registry slice until this active bootstrap gap lands and closes.
- Do not implement execute-controller behavior, stage route registry, role
  input packet assembly, provider/blocker evidence recorder, or PRD-005.4
  operator adapters in this repair chore.
- Do not create a public `bandit context <stage>` workflow command.
- Do not replace or wrap old gate paths, approve Trust Verifier cutover,
  expand landing autonomy, approve Notify-And-Revert or Auto-Landing Scope,
  change UAT policy, approve paid/live reviewer or model routing, approve
  merge/push/deploy authority, mutate external repositories, add hosted
  services, add telemetry, add credential handling, change dependencies,
  change package scripts, or change CI/release workflow.
- Do not let `.bandit/work-intake-ledger.json`, PRD files, specs, prompt
  contracts, cockpit status, session-context packets, or create-controller
  output become independent priority authority.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-095/brief.md and links to BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING as the active bootstrap gap created from BANDIT-094 closeout and the failed create-controller run.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, source authority, stage capability scope, operator-input status, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, source-of-truth/projection boundary, expected files, required evidence, and forbidden actions.
- Focused RED evidence proves the current failure: with BANDIT-094 closed and PRD-005.3 recorded as the next action, `repo-pm create-controller --json` refuses on closed BANDIT-094 instead of selecting the next unformed target.
- The implementation selects the next unformed roadmap/current-context target when the current work item is closed and closeout evidence satisfies the slice boundary.
- The implementation does not select the next target when the current Work Item is active, lacks required closeout evidence, lacks landing action, or has contradictory coordination/current-context/roadmap evidence.
- The implementation preserves existing creation safety: explicit source spec matching, explicit work-item id allocation, no overwrite, missing-source refusal, operator-owned input refusal, and authorized Local Qwen route refusal still fail closed before writes.
- The implementation preserves already-formed idempotency: if the resolved target is already formation_approved, the controller reports the existing Work Item and Work Item PM plan-mode next action without creating a duplicate.
- The implementation keeps Work Intake Ledger, prompt contracts, cockpit status, session-context packets, PRDs, and specs from becoming independent priority or workflow authority.
- Aggregate Bandit validation or focused create-controller validation covers closed-anchor next-target routing, active-current refusal, missing source spec, operator-input refusal, Local Qwen route refusal, idempotent already-formed behavior, and no Stage 2 artifact creation.
- Layered risk-classification and supply-chain gate evidence are recorded before landing if the implementation touches command routing, validators, policy, prompt templates, or workflow gate behavior.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING is resolved only after landing action and retrospective closeout evidence exist for this bounded repair chore.
- No PRD-005.3 execute-controller behavior, route registry, role input packet assembly, provider/blocker recorder, PRD-005.4 adapter, public context command, Trust Verifier cutover, old-gate replacement or wrapping, local API, State Index, cockpit action execution, hosted service, telemetry, merge, push, deploy, dependency change, package-script change, CI/release workflow change, external repo mutation, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused create-controller RED/GREEN tests for the closed-current-anchor plus next-unformed-target state.
- Run focused create-controller tests for active-current refusal, missing source spec, operator-owned input refusal, Local Qwen authorized-route refusal, idempotent already-formed behavior, explicit ID allocation, and no Stage 2 artifact creation.
- Run focused roadmap-work-target resolver tests if resolver current/next relationship handling changes.
- Run focused coordination tests if closed-state or formation-approved transition checks change.
- Run node --test test/work-create-controller.test.mjs.
- Run node --test test/roadmap-work-targets.test.mjs if resolver behavior is touched.
- Run node --test test/role-entrypoints-formation.test.mjs if Repo PM creation routing or formation readiness behavior is touched.
- Run npm run typecheck.
- Run npm test if implementation touches shared CLI routing, validation, formation gate, coordination log, roadmap resolver, cockpit/session-context, risk classification, supply-chain gate, input quarantine, operator-boundary, prompt contracts, or policy validation beyond focused tests.
- Run npm run bandit -- validate.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-095 for aggregate review evidence freshness before Stage 4 closeout.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-095 --base origin/main before Stage 4 closeout, unless provider refusal or timeout evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-095 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-095 before landing.
- Run git diff --check.

## CLEAN_CODE.md Read Evidence

CLEAN_CODE.md was read on 2026-06-11 before creating this brief. This chore
must keep create-controller target selection, closed-anchor detection,
slice-boundary checks, diagnostics, and tests small and explicit. The repair
must preserve CLI authority, fail closed on contradictory state, keep related
logic local to create-controller/resolver boundaries, and avoid mixing future
execute-controller, route registry, role packet, adapter, cockpit, local API,
State Index, hosted service, or deployment behavior into the fix.

## Bootstrap Gap Disposition

`BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING` is active and
linked to `BANDIT-095` in `.bandit/bootstrap-gaps.json`.

The gap may be resolved only after focused RED evidence, implementation
evidence, review evidence, landing verdict/action, retrospective, improvement
or no-action disposition, and synchronized routing files exist. Until then,
PRD-005.3 remains deferred behind this active gap.

## Expected Files

- docs/specs/BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING.json
- docs/work/BANDIT-095/brief.md
- docs/work/BANDIT-095/qwen-formation-review.md
- docs/work/BANDIT-095/coderabbit-formation-review.md
- docs/work/BANDIT-095/formation-review.md
- docs/work/BANDIT-095/coordination-log.jsonl
- docs/work/BANDIT-095/red-evidence.md
- docs/work/BANDIT-095/implementation-evidence.md
- docs/work/BANDIT-095/writer-report.md
- docs/work/BANDIT-095/stage3-pm-acceptance.md
- docs/work/BANDIT-095/coderabbit-review.md
- docs/work/BANDIT-095/local-qwen-review.md
- docs/work/BANDIT-095/review-evidence.md
- docs/work/BANDIT-095/landing-verdict.md
- docs/work/BANDIT-095/landing-action.md
- docs/work/BANDIT-095/retrospective.md
- docs/work/BANDIT-095/improvement-disposition.md
- src/state/work-create-controller.ts
- src/state/roadmap-work-targets.ts
- src/commands/work-create-controller.ts
- src/commands/repo-pm.ts
- src/commands/validate.ts
- src/cli.ts
- test/work-create-controller.test.mjs
- test/roadmap-work-targets.test.mjs
- test/role-entrypoints-formation.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Stage 1 Boundary For Expected Files

Only the source spec, brief, formation review artifacts, coordination log,
bootstrap-gap ledger, roadmap/current-context/status routing, and automation
memory may be created or edited during Repo PM Stage 1 formation.

Later listed RED, implementation, review, landing, UAT, retrospective, and
closeout artifacts are expected downstream surfaces for Work Item PM, Test
Writer, Implementation Writer, reviewers, Landing Agent, and Closeout Agent.
Repo PM must not create those later-stage artifacts in this run.

## Required Evidence

- docs/work/BANDIT-095/brief.md
- docs/work/BANDIT-095/qwen-formation-review.md
- docs/work/BANDIT-095/coderabbit-formation-review.md
- docs/work/BANDIT-095/formation-review.md
- docs/work/BANDIT-095/coordination-log.jsonl
- docs/work/BANDIT-095/red-evidence.md
- docs/work/BANDIT-095/implementation-evidence.md
- docs/work/BANDIT-095/review-evidence.md
- docs/work/BANDIT-095/landing-verdict.md
- docs/work/BANDIT-095/landing-action.md
- docs/work/BANDIT-095/retrospective.md
- docs/work/BANDIT-095/improvement-disposition.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or running formation review. Repo artifacts identify the failed create-controller behavior, the PRD-005.2 acceptance criterion it violates, the closed BANDIT-094 slice boundary evidence, the current next action for PRD-005.3, current Stage Rubric requirements, CLEAN_CODE.md authority, Formation Gate boundary, Stage Capability Scope boundary, Token-Cost Failsafe boundary, and Codex PM/Repo PM authority to route routine controller-repair mechanics. Halt only if implementation would change product direction, UAT policy, workflow policy beyond repairing the accepted create-controller contract, business tradeoffs, explicit cost/risk posture, provider-pricing approval, spend-class approval, paid reviewer promotion, recurring paid routing policy, external service setup, live routing policy, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, Trust Verifier cutover policy, old-gate replacement or wrapping, or broader cockpit/product scope.

## Permanent Test Ownership Boundary

The Stage 3 Writer has no authority to create, edit, delete, regenerate,
format, or mechanically adjust tests, test helpers, fixtures, RED evidence, or
acceptance mappings for `BANDIT-095`. Test Writer owns Stage 2 RED tests and
acceptance mappings. If Stage 3 finds test ambiguity, it must stop and route
back through Work Item PM/Codex PM instead of changing the tests.

## Bootstrap Model-Family Separation

During bootstrap, if Codex authors or materially edits Stage 2 RED tests for
`BANDIT-095`, Stage 3 implementation must be assigned to a different model
family. Claude remains the default Stage 3 Writer path, with MiniMax fallback
only after an authorized Stage 3 route fails or times out and the fallback is
recorded in repo evidence.

## Source Of Truth And Projection Boundary

`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, the work-item
package, coordination log, and `.bandit/bootstrap-gaps.json` are canonical for
this repair. The create controller, resolver output, cockpit status,
session-context packets, Work Intake Ledger, PRDs, specs, and prompt contracts
are derived, provenance, or guidance surfaces unless a Bandit CLI command
writes canonical repo-native artifacts.

## Stage Capability Scope

policy: .bandit/policy/stage-capability-scope.json
stages:
- stage1_brief
- formation_review
- stage2_red_evidence
- stage3_implementation
- stage4_review
- stage5_landing
- stage6_retrospective
authority_roles:
- codex_pm
- repo_pm
- work_item_pm
- test_writer
- implementation_writer
- reviewer
- landing_agent
- closeout_agent
required_skills:
- bandit
- tdd
- review
forbidden_actions:
- prd-005-execute-controller
- stage-route-registry
- role-input-packet-assembly
- provider-blocker-recorder
- prd-005-operator-adapter
- public-context-command
- cockpit-action
- local-api
- state-index
- trust-verifier-cutover
- old-gate-replacement-or-wrapping
- merge-push-deploy

allowed_tools:

- Read repo-local artifacts.
- Write Stage 1 source spec, brief, formation review artifacts, coordination
  log, routing/status surfaces, bootstrap-gap ledger, and automation memory.
- Run Bandit CLI validation, coordination validation, cockpit status,
  session-context, Local Qwen through the authorized MLX adapter, CodeRabbit
  formation review, git status/log/diff checks, and date for timestamps.

outputs:

- `docs/specs/BANDIT-GAP-REPO-PM-CREATE-CONTROLLER-CLOSED-ANCHOR-ROUTING.json`
- `docs/work/BANDIT-095/brief.md`
- `docs/work/BANDIT-095/qwen-formation-review.md`
- `docs/work/BANDIT-095/coderabbit-formation-review.md`
- `docs/work/BANDIT-095/formation-review.md`
- `docs/work/BANDIT-095/coordination-log.jsonl`
- synchronized `.bandit/bootstrap-gaps.json`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and
  `STATUS.md`

evidence:

- `docs/work/BANDIT-095/brief.md`
- `docs/work/BANDIT-095/coordination-log.jsonl`
- `docs/work/BANDIT-095/qwen-formation-review.md`
- `docs/work/BANDIT-095/coderabbit-formation-review.md`
- `docs/work/BANDIT-095/formation-review.md`
- `.bandit/bootstrap-gaps.json`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`

## Token-Cost Failsafe

policy: .bandit/policy/token-cost-failsafe.json
soft_budget_bands:
- formation_review
- stage3_implementation
- stage4_review
provider_pricing_evidence:
- not_applicable_local_qwen
- not_applicable_coderabbit_cli
spend_classes:
- local_or_included
continuation_decisions:
- CodeRabbit formation review must receive the full 600-second prompt-required timeout before provider-timeout replacement evidence is recorded.
- Local Qwen unavailability is fail-closed and requires operator help rather than an alternate reviewer path.
- Any paid, live, or recurring model/reviewer route remains blocked unless a separate approved provider-pricing and spend-class artifact exists.
stage_capability_profiles:
- stage1_formation_only
- claude-implementation-writer-stage3
- qwen-and-coderabbit-review-stage4

## Forbidden Actions

Repo PM must not create or start Stage 2 RED evidence, Work Item PM
orchestration, implementation, review-loop evidence, landing evidence, UAT
evidence, retrospective evidence, closeout evidence, PRD-005.3
execute-controller work, stage route registry work, role input packet assembly,
provider/blocker evidence recorder work, PRD-005.4 adapter work, public context
command work, cockpit action execution, local API, State Index, hosted service,
telemetry, paid route, merge, push, deploy, external repo mutation, credential
handling, dependency or lockfile change, package-script change, CI/release
workflow change, Trust Verifier cutover, old-gate replacement or wrapping,
landing-autonomy expansion, or unrelated Phase 8 product work during this
Stage 1 formation run.
