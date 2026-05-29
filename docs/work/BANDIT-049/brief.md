# BANDIT-049: Session Context Interstitial Recovery

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where the Focused Session Context Packet fails in the valid interstitial state after a work item is closed and before the next bootstrap-gap work item is active.

## Origin

BANDIT-048 Stage 6 closeout verification recorded BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY after `bandit session-context current --json` failed with `Session context blocked: no active bootstrap gap linked to BANDIT-048`. The focused packet is supposed to be the compact first recovery surface for Bandit cold starts, so it needs a derived interstitial recovery path that reports the last closed work item, next queued bootstrap gap, exact next action, operator-input status, blockers, source hierarchy, and required deep-read pointers without inventing active work or making the packet canonical.

## Scope

- Add focused RED evidence for the closed-work-item/no-active-gap interstitial state before implementation.
- Make `bandit session-context current --json` recover when the latest active work item is closed, its linked bootstrap gap is resolved, and the next queued bootstrap gap has no linked work item yet.
- Report the last closed work item separately from any active work item so the packet does not invent an active work item or treat closed work as runnable.
- Report the next queued bootstrap gap, exact next action, no-required-operator-input status, blocker list, allowed action, forbidden unrelated work, source hierarchy, source artifacts, required evidence paths for the future work item, and deep-read pointers from repo artifacts.
- Preserve Focused Session Context Packet authority as `derived_non_canonical`; repo artifacts remain authoritative and the packet remains rebuildable on demand.
- Keep CURRENT_CONTEXT.md and ROADMAP.md as readable recovery sources for agents that cannot use the focused packet yet.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-29 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope: Codex PM owns the Stage 1 brief, Stage 2 RED evidence, routine technical routing, and context-artifact synchronization; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, or acceptance mappings; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Consume existing Clean-Code, Stage Rubric, Focused Session Context, Bootstrap Model-Family Separation, Test Ownership Boundary, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, Coordination Event Log Authority, CAS Claim Authority, Git Mutation Serializer, and review-subject-hash vocabulary without redefining those gates.
- Future-work scope: this chore must not implement Worktree Bootstrap Contract behavior, scheduler execution, event-driven wakeups, full worktree lifecycle enablement, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow execution, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-049/brief.md and links to BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage capability scope, Codex-owned technical decisions, source hierarchy, non-canonical projection boundary, Bootstrap Model-Family Separation, Test Ownership Boundary, and Operator Fail-Closed Boundary.
- Focused RED evidence proves the current failure: `bandit session-context current --json` blocks in the closed-work-item/no-active-gap interstitial state instead of reporting the next queued bootstrap gap.
- The packet distinguishes last closed work item from active work item and does not report a closed work item as runnable active work.
- The packet reports the next queued bootstrap gap from .bandit/bootstrap-gaps.json, the exact next action from CURRENT_CONTEXT.md and ROADMAP.md, and `none_required` operator-input status when repo artifacts say no operator-owned input is required.
- The packet reports forbidden actions that keep Worktree Bootstrap Contract work, scheduler execution, worktree lifecycle implementation, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT scope, and unrelated Phase 8 work blocked until the interstitial-recovery brief and later gates allow them.
- The packet source artifacts and source hierarchy identify AGENTS.md, CLEAN_CODE.md, CURRENT_CONTEXT.md, ROADMAP.md, STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json, smell-trigger policy, and the cold-start evaluation packet where their authority affects recovery.
- The packet's required evidence paths for interstitial recovery point at the next work item's expected Stage 1 through Stage 6 evidence without requiring that work item to exist before creation.
- Missing or contradictory current-state artifacts still fail closed with clear blocker messages; interstitial recovery is accepted only when repo artifacts agree that the previous work is closed and the next queued gap is the correct next action.
- The cold-start evaluation packet or focused tests cover the interstitial recovery path so future Bandit sessions can identify the next action without scanning full roadmap history.
- If CURRENT_CONTEXT.md or ROADMAP.md structure is adjusted, those files continue to answer current phase, active or last closed work, next action, blockers, bootstrap gaps, and operator-input status for agents that have not yet adopted the repaired command.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing if the implementation touches validators, parsers, command routing, templates, generated schemas, agent-skill surfaces, workflow gates, or other sensitive surfaces.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No Worktree Bootstrap Contract implementation, scheduler execution, event-driven wakeup implementation, true parallel writable workstream enablement, local server/API mode, cockpit UI implementation, state-index persistence, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim lease implementation, work surface reservation implementation, PR/CI workflow execution, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused session-context RED/GREEN tests for closed-work-item/no-active-gap recovery, next queued gap reporting, last-closed-work separation, exact next action, operator-input status, forbidden actions, source hierarchy, required evidence paths, and missing or contradictory source refusal behavior.
- Run focused Markdown rendering tests if Markdown output is affected, proving Markdown is generated from the same packet model as JSON.
- Run focused cold-start evaluation tests or update the cold-start packet if evaluation behavior changes.
- Run node --test test/focused-session-context.test.mjs.
- Run node --test test/work-item-create.test.mjs if work-item brief rendering or parsing is touched.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/cockpit-status.test.mjs if cockpit status or derived status behavior is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work item parsing, cockpit status, templates, bootstrap gaps, risk classification, supply-chain gates, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run npm run bandit -- supply-chain-gate validate --json if workflow-gate, template, agent-skill, generated-schema, dependency, lockfile, package-manager script, CI/release, fetched-prompt, or external tool-install surfaces are touched.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- operator-boundary validate --json.
- Run npm run bandit -- coordination-authority validate --json.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-049 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-049 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-049 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-049 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY.json
- docs/work/BANDIT-049/brief.md
- docs/work/BANDIT-049/red-evidence.md
- docs/work/BANDIT-049/implementation-evidence.md
- docs/work/BANDIT-049/coderabbit-review.md
- docs/work/BANDIT-049/local-qwen-review.md
- docs/work/BANDIT-049/review-evidence.md
- docs/work/BANDIT-049/landing-verdict.md
- docs/work/BANDIT-049/landing-action.md
- docs/work/BANDIT-049/retrospective.md
- docs/specs/BANDIT-049-red-evidence.json
- docs/specs/BANDIT-049-implementation-evidence.json
- docs/specs/BANDIT-049-landing-verdict.json
- docs/specs/BANDIT-049-retrospective.json
- docs/evaluation/skills/bandit-cold-start.md
- src/state/focused-session-context.ts
- src/commands/session-context.ts
- src/cli.ts
- test/focused-session-context.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-049/brief.md
- docs/work/BANDIT-049/red-evidence.md
- docs/work/BANDIT-049/implementation-evidence.md
- docs/work/BANDIT-049/coderabbit-review.md
- docs/work/BANDIT-049/local-qwen-review.md
- docs/work/BANDIT-049/review-evidence.md
- docs/work/BANDIT-049/landing-verdict.md
- docs/work/BANDIT-049/landing-action.md
- docs/work/BANDIT-049/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, current failed command behavior, Focused Session Context Packet vocabulary, cold-start evaluation packet, current Stage Rubric requirements, Clean-Code authority, and Codex PM boundary that interstitial recovery mechanics are a routine technical decision when repo evidence and policy are sufficient. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the accepted interstitial-recovery gap, business tradeoffs, explicit cost/risk posture, external service setup, paid reviewer spend approval, paid reviewer routing, live routing, scheduler authority, claim/worktree authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
