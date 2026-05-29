# BANDIT-048: Focused Session Context Packets

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Bandit cold starts and worker or reviewer sessions still require agents to reabsorb long historical context files before performing narrow work.

## Origin

The 2026-05-28 grill-with-docs review identified that Bandit cold starts are spending excessive token budget on whole-project history. CONTEXT.md now defines Focused Session Context Packet as a CLI-derived task-scoped Context Component, and the queued bootstrap gap records the need to generate compact current-session packets with pointers to deeper source artifacts. The repair is bounded to repo-native context projection, validation, and cold-start evaluation support; it does not authorize unrelated Phase 8 cockpit UI/server/API work or later parallel-workstream bootstrap gaps.

## Scope

- Define Focused Session Context Packet as a CLI-derived, non-canonical projection for one activation that preserves repo artifacts as authority.
- Add a narrow CLI command, tentatively bandit session-context current --json with optional Markdown rendering, that reports current role rules, active Work Item or bootstrap gap, current stage, exact next action, allowed and forbidden actions, blocker state, required operator input, required evidence paths, source hierarchy, and on-demand deep-read pointers.
- Derive packet content from existing repo artifacts instead of a hand-maintained packet file: AGENTS.md for role and operator-input authority, CONTEXT.md for vocabulary, docs/roadmap/CURRENT_CONTEXT.md and docs/roadmap/ROADMAP.md for current phase and next action, .bandit/bootstrap-gaps.json for open or active gap routing, docs/evaluation/skills/bandit-cold-start.md for evaluation behavior, CLEAN_CODE.md for clean-code authority, docs/verification/STAGE_RUBRICS.md for stage gates, and .bandit/policy/smell-triggers.json for blocker routing.
- Separate current-state projection from historical roadmap narrative by emitting concise current fields plus source pointers to historical closeout material instead of replaying full roadmap or current-context history.
- Preserve AGENTS.md and CLEAN_CODE.md as required authority sources; the packet may summarize their current-session implications but must point back to the canonical files.
- Update the Bandit cold-start evaluation packet so future evaluations can verify that a session can identify the exact next action from the focused packet and source pointers without reading full roadmap history unless the task requires it.
- Add validation or focused tests proving the packet is deterministic, source-linked, non-canonical, and sufficient to identify the exact next action and operator-input status for the current activation.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-29 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope: Codex PM owns the packet strategy, Stage 1 brief, Stage 2 RED evidence, and routine technical routing; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, or acceptance mappings; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Consume existing Clean-Code, Stage Rubric, Bootstrap Model-Family Separation, Test Ownership Boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, Coordination Event Log Authority, CAS Claim Authority, Git Mutation Serializer, and review-subject-hash vocabulary without redefining those gates.
- Future-work scope: this chore must not implement Worktree Bootstrap Contract behavior, scheduler execution, event-driven wakeups, full worktree lifecycle enablement, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow execution, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-048/brief.md and links to BANDIT-GAP-FOCUSED-SESSION-CONTEXT.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage capability scope, Codex-owned technical decisions, source hierarchy, non-canonical projection boundary, Bootstrap Model-Family Separation, Test Ownership Boundary, and Operator Fail-Closed Boundary.
- The focused session context command emits a structured JSON packet with current phase, active Work Item or bootstrap gap, current stage, exact next action, required operator input, blockers, allowed actions, forbidden actions, required evidence paths, source artifacts, source hierarchy, and stale or missing evidence notes when available.
- The command supports optional Markdown rendering from the same data model without introducing a hand-maintained packet file or hidden source of truth.
- The packet identifies AGENTS.md, CLEAN_CODE.md, CURRENT_CONTEXT.md, ROADMAP.md, STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json, and smell-trigger policy sources explicitly where their authority affects the current activation.
- The packet keeps historical roadmap narrative, old closeout details, full glossary text, and deep source material behind pointers unless the current task requires a deep read.
- Focused tests prove a session can recover the current next action, operator-input status, active Work Item or gap, and forbidden next-work boundaries from the packet without scanning full historical roadmap narrative.
- Focused tests prove the packet is derived from repo artifacts, marks itself derived_non_canonical, and refuses or reports blocker state when required current-state artifacts are missing or contradictory.
- The cold-start evaluation packet at docs/evaluation/skills/bandit-cold-start.md is updated to exercise the Focused Session Context Packet while preserving required authority checks and source-pointer deep reads.
- If the implementation updates CURRENT_CONTEXT.md or ROADMAP.md structure, those files continue to answer the current phase, active work, next action, blockers, bootstrap gaps, and operator-input status for agents that have not yet adopted the new command.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing if the implementation touches validators, parsers, command routing, templates, generated schemas, agent-skill surfaces, workflow gates, or other sensitive surfaces.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-FOCUSED-SESSION-CONTEXT is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No Worktree Bootstrap Contract implementation, scheduler execution, event-driven wakeup implementation, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim lease implementation, work surface reservation implementation, PR/CI workflow execution, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused session-context RED/GREEN tests for packet shape, source hierarchy, non-canonical authority, next-action recovery, operator-input status, and contradiction or missing-source refusal behavior.
- Run focused Markdown rendering tests proving Markdown output is generated from the same packet model as JSON.
- Run focused cold-start evaluation tests proving the evaluation packet can validate exact next-action recovery without reading full roadmap history.
- Run node --test test/work-item-create.test.mjs if work-item brief rendering or parsing is touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/cockpit-status.test.mjs if cockpit status or derived status behavior is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work item parsing, cockpit status, templates, bootstrap gaps, risk classification, supply-chain gates, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run npm run bandit -- supply-chain-gate validate --json if workflow-gate, template, agent-skill, generated-schema, dependency, lockfile, package-manager script, CI/release, fetched-prompt, or external tool-install surfaces are touched.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run npm run bandit -- coordination-authority validate --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-048 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-048 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-048 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-048 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-FOCUSED-SESSION-CONTEXT.json
- docs/work/BANDIT-048/brief.md
- docs/work/BANDIT-048/red-evidence.md
- docs/work/BANDIT-048/implementation-evidence.md
- docs/work/BANDIT-048/coderabbit-review.md
- docs/work/BANDIT-048/local-qwen-review.md
- docs/work/BANDIT-048/review-evidence.md
- docs/work/BANDIT-048/landing-verdict.md
- docs/work/BANDIT-048/landing-action.md
- docs/work/BANDIT-048/retrospective.md
- docs/evaluation/skills/bandit-cold-start.md
- docs/templates/focused-session-context.md
- src/state/focused-session-context.ts
- src/commands/session-context.ts
- src/cli.ts
- test/focused-session-context.test.mjs
- test/validate.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-048/brief.md
- docs/work/BANDIT-048/red-evidence.md
- docs/work/BANDIT-048/implementation-evidence.md
- docs/work/BANDIT-048/coderabbit-review.md
- docs/work/BANDIT-048/local-qwen-review.md
- docs/work/BANDIT-048/review-evidence.md
- docs/work/BANDIT-048/landing-verdict.md
- docs/work/BANDIT-048/landing-action.md
- docs/work/BANDIT-048/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, Focused Session Context Packet vocabulary, cold-start evaluation packet, current Stage Rubric requirements, Clean-Code authority, and Codex PM boundary that packet generation strategy is a routine technical decision when repo evidence and policy are sufficient. Halt only if implementation would change product direction, UAT policy, workflow policy beyond defining and enforcing the accepted focused-session-context gap, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer spend approval, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
