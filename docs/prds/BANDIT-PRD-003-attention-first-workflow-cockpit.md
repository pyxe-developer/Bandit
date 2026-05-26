# BANDIT-PRD-003: Attention-First Workflow Cockpit UI

## Status

Accepted design input for the next Phase 8 visual UI work item. This is a
repo-native planning artifact; no GitHub issue is required unless the operator
explicitly asks for one.

## Problem Statement

The operator can already rely on Bandit repo artifacts and CLI commands for workflow authority, but the current experience is still artifact-heavy. To understand the state of work, the operator must read roadmap files, work-item evidence, review artifacts, landing verdicts, retrospectives, and command output directly.

That works for Codex PM and implementation agents, but it is not the right operator experience. The operator needs a calm, guided Workflow Cockpit that answers:

- What needs my attention now?
- What is blocked, stale, or waiting on me?
- What work is active and what happens next?
- Which gates are green, missing, blocked, or stale?
- Which safe CLI-backed actions can I request?
- Are Bandit's workflow improvements actually improving the system?

The design must not turn Bandit into a generic dashboard, full agent IDE, project-management clone, or hidden source of truth. The cockpit exists to make CLI-authoritative repo-native workflow state understandable and actionable.

## Solution

Design an Attention-First Workflow Cockpit for a single Bandit-governed repository.

The cockpit should feel like an attention-first control surface with mission-control depth. The first screen leads with operator-owned attention and workflow risk, not with Bandit's internal phase model. It should be calm and guided at the top level, with dense evidence, source paths, gate matrices, coordination logs, review evidence, and hashes available one level down.

The primary user is the operator. Agent-facing details remain inspectable, but the top-level UI should organize around Work Items, Attention Categories, blockers, next actions, and trust signals. Agent names and roles should appear when useful, but they are secondary to work state.

The cockpit is a guided action surface, not just a read-only report. It may expose approved actions such as validation, evidence inspection, review requests, UAT recording, and landing readiness checks only when those actions map to CLI Authority. The UI never owns canonical workflow state. It requests CLI-backed actions, then displays the resulting repo-native artifacts and derived status.

The first design should include:

- Attention-first home view.
- Attention Category navigation.
- Active Work Item detail view.
- Gate and landing readiness views.
- Operator input and blocker surfaces.
- Compact workflow improvement health.
- Light queue and context area.
- Evidence/source traceability detail views.
- Guarded CLI-backed action affordances.

## User Stories

1. As the operator, I want the cockpit to show what needs my attention first, so that I do not have to inspect every work artifact manually.
2. As the operator, I want operator-owned blockers to appear above routine progress, so that I can unblock work quickly.
3. As the operator, I want stale or contradictory workflow state to be visible, so that Bandit does not hide trust problems behind a green status.
4. As the operator, I want the active Work Item and next action to be obvious, so that I understand what Bandit is doing now.
5. As the operator, I want landing readiness to be summarized clearly, so that I know whether work is code-safe, UAT-ready, or blocked.
6. As the operator, I want feature UAT status to be separate from code-safety status, so that product acceptance is not blurred with engineering review.
7. As the operator, I want safe next actions presented as guided buttons, so that I can request approved CLI-backed actions without memorizing commands.
8. As the operator, I want unavailable actions shown as blocked with reasons, so that I understand what evidence or input is missing.
9. As the operator, I want dangerous or unsupported actions excluded or disabled, so that the cockpit cannot imply authority it does not have.
10. As the operator, I want every displayed status to have a confidence or evidence cue, so that I know whether the state is source-linked, stale, missing, or derived.
11. As the operator, I want full source paths and evidence details available on drill-down, so that trust is auditable without crowding the main view.
12. As the operator, I want work grouped by Attention Category, so that I can scan by required attention rather than by internal workflow phase.
13. As the operator, I want workflow phase and stage shown inside item details, so that rigor remains available when I need it.
14. As the operator, I want a light queue/context area, so that I understand what is coming without turning the cockpit into a backlog manager.
15. As the operator, I want active work to remain the center of gravity, so that future work does not distract from what is currently blocked or runnable.
16. As the operator, I want improvement health to be first-class but compact, so that Bandit's workflow-learning loop remains visible.
17. As the operator, I want to see open improvement chores, due evaluations, and keep/revise/revert/double-down decisions, so that I can tell whether workflow changes are paying off.
18. As the operator, I want repeated smells and cross-model tension patterns summarized, so that process problems are surfaced before they become repeated failures.
19. As the operator, I want the cockpit to feel calm and guided, so that I can use it without becoming a release engineer.
20. As the operator, I want dense mission-control detail one click down, so that I can inspect evidence when a decision needs rigor.
21. As the operator, I want agent and reviewer names to be secondary to work state, so that the UI does not become an agent roster.
22. As the operator, I want to know which role owns the next governed action when it matters, so that role boundaries stay understandable.
23. As the operator, I want the Operator Inbox to remain distinct from the cockpit's attention-first framing, so that repo-native operator messages are not confused with UI navigation.
24. As Codex PM, I want the cockpit to preserve CLI Authority, so that UI affordances never become hidden workflow enforcement.
25. As Codex PM, I want cockpit state derived from repo-native artifacts, so that deleting browser state or a local cache cannot lose canonical workflow state.
26. As Codex PM, I want the cockpit to display fail-closed states, so that missing or contradictory evidence becomes visible repair work.
27. As Codex PM, I want the cockpit to expose source artifact links, so that future agents and reviewers can trace every displayed state.
28. As Codex PM, I want action buttons to invoke approved CLI command families, so that mutations remain validated and evidence-recorded.
29. As Codex PM, I want the UI to avoid product UAT inference, so that only operator-recorded UAT artifacts authorize feature acceptance.
30. As Codex PM, I want the cockpit to avoid independent merge, push, deploy, or policy override authority, so that release governance remains agent-owned and CLI-bound.
31. As a Work Item PM Orchestrator, I want the cockpit to show my Work Item state and blockers without making my internal context the main UI model, so that operator attention stays focused.
32. As a reviewer, I want gate status to link to review evidence, so that review outcomes are not reduced to unexplained green or red badges.
33. As a landing agent, I want landing readiness to show missing gate blockers, stale evidence, and final verdict state separately, so that landing decisions remain explicit.
34. As a future implementation agent, I want the UI design to define a stable view model boundary, so that web components do not re-implement workflow rules.
35. As a future implementation agent, I want the design to separate action eligibility from action execution, so that the UI cannot bypass CLI validation.
36. As a future implementation agent, I want visual screens to use the existing cockpit status foundation where possible, so that the first implementation does not invent a separate state model.

## Implementation Decisions

- The canonical UX framing is Attention-First Workflow Cockpit.
- The top-level information architecture uses Attention Categories first and workflow phase second.
- The default attention priority order is operator input required, blocked or stale state, active work and next action, landing/readiness gates, improvement health and follow-ups, then broader queue/context.
- The primary design target is a single-repo local cockpit for the operator.
- The cockpit should be a guided action surface, not a passive dashboard.
- The cockpit may request approved CLI-backed actions, but the CLI validates and performs all canonical state changes.
- The UI must never store approvals, verdicts, work-item state, policy exceptions, or landing readiness as canonical browser or app state.
- Agent identity is secondary to Work Item state. Role names appear where they clarify ownership or evidence.
- The Operator Inbox remains the repo-native artifact for operator-owned messages. The cockpit may display or link to those messages, but the UI concept is not called an inbox.
- Cards show evidence confidence inline through compact cues such as source-linked, stale, missing evidence, blocked by operator input, derived from CLI, or unavailable.
- Full artifact paths, hashes, review records, coordination logs, and detailed gate evidence live in detail views.
- The first design includes a compact workflow improvement health surface, because Bandit's differentiator is measurable workflow improvement.
- The queue/context area is lightweight and secondary. It should show trajectory and upcoming work, not become the main backlog management surface.
- The visual style should be calm and guided with dense operational detail one click down.
- The design should favor predictable controls: clear buttons for approved commands, disabled states with reasons, tabs or segmented controls for major views, status chips for evidence confidence, and drill-down panels for dense artifacts.
- A deep view-model module should translate CLI-derived cockpit status into presentation-ready Attention Categories, priority ordering, evidence confidence, and action affordance state.
- A deep action-eligibility module should expose what the UI may request, why an action is available or blocked, and which CLI command family owns execution.
- A deep evidence-detail module should normalize source links, gate evidence, review evidence, landing evidence, UAT evidence, and coordination evidence for drill-down views.
- UI components should stay shallow: they render view models and request actions; they do not parse repo artifacts or decide workflow authority.
- Any future local API or State Index remains derived and rebuildable from repo-native artifacts.

## Testing Decisions

- Tests should verify user-visible behavior and authority boundaries, not incidental component internals.
- View-model tests should cover Attention Category assignment, priority ordering, source confidence cues, blocked states, stale states, and missing-evidence states.
- Action-eligibility tests should cover allowed actions, disabled actions, unavailable command families, operator-owned input requirements, product UAT boundaries, and refusal to expose unsupported authority.
- Evidence-detail tests should cover source traceability, gate evidence summaries, review and landing evidence links, UAT artifact display, and coordination evidence display.
- UI tests should cover the main operator flows: identify required attention, inspect an active Work Item, inspect a blocked item, inspect landing readiness, inspect improvement health, and request an allowed CLI-backed action.
- Regression tests should prove browser state, cache state, local API state, or a State Index cannot become canonical workflow authority.
- Existing cockpit status tests provide prior art for source-linked derived status, fail-closed missing-source behavior, contradictory-state refusal, gate summaries, stale evidence, and no hidden write authority.
- Tests should include accessible states for disabled actions, status cues, keyboard navigation, and dense detail panels.
- If a prototype is built, visual QA should verify that cards, controls, and dense detail panels do not overlap or truncate text at desktop and mobile widths.

## Out of Scope

- Full agent IDE.
- Generic project-management replacement.
- Cross-repo cockpit authority.
- Cloud-hosted SaaS packaging.
- Independent workflow state stored by the UI.
- UI-owned enforcement, approval, landing, merge, push, deploy, or policy override.
- Automatic product UAT approval.
- Automatic merge, push, deploy, or production canary.
- State Index persistence as canonical data.
- Scheduler execution, claim leases, work surface reservations, and worktree lifecycle controls unless a future CLI-authoritative PRD explicitly enables them.
- Dynamic model routing.
- PR/CI orchestration beyond displaying or linking existing evidence.
- Visualizing every internal agent message as a chat UI.
- Replacing the Operator Inbox artifact with a UI-only notification system.
- Direct editing of repo-native workflow artifacts from UI forms outside approved CLI commands.

## Further Notes

Source material for Claude Design should include the existing Workflow Cockpit boundary, CLI Authority decision, repo-native state/index decision, CLI-owned UAT decision, current cockpit status foundation, cockpit status coverage hardening evidence, and the Bandit glossary.

The accepted visual starting point is recorded in `docs/design/workflow-cockpit/design-review.md`, with the design-system artifact in `docs/design/workflow-cockpit/design-system.md`, the standalone Claude Design prototype in `docs/design/workflow-cockpit/attention-first-workflow-cockpit-prototype.html`, and the extracted source bundle in `docs/design/workflow-cockpit/prototype-source/`.

The design should treat `bandit cockpit status` as the current substrate, not the full product. The PRD asks Claude Design to shape the operator-facing experience that should eventually sit on top of that substrate.

Claude Design should avoid a marketing-style landing page. The first screen should be the usable cockpit experience.

The design should not over-index on decorative data visualization. It should make attention, blockers, safe action, and evidence traceability faster to understand.

Open product/design decisions for later iteration include exact screen count, navigation layout, local API versus direct CLI invocation packaging, and whether a rebuildable State Index is needed for responsiveness once real UI query needs are clear.
