# Coordination Primitive Uses A Canonical Step Ledger

**Date:** 2026-05-24
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

Bandit's coordination primitive will use an explicit canonical Step Transition Ledger for work-item progress, not a status view derived only from existing artifacts.

The ledger records the SDLC microstep state machine for a work item. Evidence artifacts remain required proof for each transition, and validators must reconcile ledger state with the artifacts that justify it.

The Step Transition Ledger will live inside an append-only coordination log scoped per work item. The same log stores typed step transitions and typed actor coordination events. Current-state summaries may exist for fast status reads, but they are derived and rebuildable from the coordination log.

Actor coordination actions are separate Agent Coordination Events. Actions such as claim, handoff, block, complete, repair-request, and resume are recorded against a work item and, when relevant, a current workflow state, but they do not replace the Step Transition Ledger.

Blocking uses two related records. A Block Event is an actor coordination event that reports a blocking condition, owner, required input, and resume condition. An Accepted Block is the workflow state that means the work item cannot legally advance. A Block Event becomes an Accepted Block only when accepted by CLI validation or Codex PM policy.

The first coordination state machine will use a shared core sequence for both slices and chores, with typed extensions for work-type-specific requirements. Feature slices can add UAT-specific states; chores can mark UAT not applicable or use chore-specific disposition states without forking the whole lifecycle.

Retrospective recorded and closed are separate core states. Retrospective recorded proves the learning artifact exists. Closed proves every required disposition is complete, including improvement chores, no-action decisions, context updates, and follow-up routing.

The shared core state machine is also the foundation for future heartbeats and cross-repo coordination. Heartbeats need to distinguish work that has merely landed or recorded a retrospective from work that is actually closed. Cross-repo coordination requires repositories to share the same core workflow language before Bandit can safely trigger or compare work across them.

Cross-repo Bandit will use self-governing repositories. Each repository remains canonical for its own workflow state and evidence. A central view may aggregate, compare, or request safe triggers, but it must not become the source of truth for another repository's workflow state.

In v0, safe trigger points are emitted only from validated step transitions. Actor coordination events may produce trigger signals for inspection, but they cannot start automation until CLI validation reconciles them into workflow state.

Implementation sequencing follows the active bootstrap-gap lane. The coordination primitive should not jump ahead of the already queued bootstrap gaps unless a queued gap directly requires it. It should be planned after the current bootstrap-gap queue is exhausted, resolved, blocked, or explicitly dispositioned.

## Rationale

The software-factory coordination problem is not runtime scale; it is preventing agents from relying on chat memory or implied progress. A derived-only status view would help humans inspect work, but it would not give agents a durable coordination primitive for next action, ownership, blocked state, handoff, repair, or resume.

Making the transition ledger canonical gives CLI commands, agents, automations, and the future cockpit the same source for "where are we and what is next?" while preserving Bandit's repo-native evidence discipline.

Append-only transitions preserve why and when state changed, which actor moved it, and what evidence justified the transition. A current-state-only record would be simpler, but it would weaken auditability for review, heartbeats, and cross-repo trust.

Per-work-item logs keep review diffs local to the slice or chore, make cross-repo portability cleaner, and avoid a single hot file that every automation touches. Keeping actor events and step transitions in one log preserves the full coordination timeline while event types preserve the semantic split between workflow state and actor activity.

Separating workflow state from actor coordination prevents two common failures: treating a handoff note as proof that a stage completed, and treating a completed artifact as proof that the next actor has claimed or accepted the next step.

Separating Block Events from Accepted Blocks prevents one actor's advisory concern from silently stopping the workflow, while still preserving fail-closed behavior when policy or evidence proves the work item cannot advance.

A shared core prevents Bandit from drifting into parallel lifecycle systems for slices and chores. Typed extensions preserve the product distinction between feature acceptance and maintenance work without duplicating every gate.

Separating retrospective recorded from closed protects Bandit's improvement loop. A heartbeat or cross-repo automation should not treat a work item as finished until lessons and follow-ups have durable dispositions.

Self-governing repositories preserve Bandit's repo-native trust boundary while still allowing organization-level coordination. The alternative, a central coordination authority, would recreate hidden workflow state outside the repos and weaken reviewability.

Restricting safe triggers to step transitions keeps heartbeats and cross-repo work from reacting to unaccepted claims, handoffs, or block reports. Actor events remain useful context, but automation needs the stronger guarantee of a validated workflow transition.

Deferring implementation preserves Bandit's own slice-boundary and bootstrap-gap discipline. The coordination primitive exists to enforce process clarity; it should not be introduced by violating the repo's current work queue.

## Consequences

- Existing artifacts remain canonical evidence for their own content, but they are not the sole coordination state.
- The Step Transition Ledger should be append-only.
- The canonical coordination log should be scoped per work item.
- Step transitions and actor coordination events should live in the same per-work-item log as different event types.
- Any current-state file, query result, index, or cockpit display should be derived from the append-only log.
- Future commands such as step status, step next, and step complete should read or mutate the ledger under CLI Authority.
- Future actor commands should record Agent Coordination Events under the Agent Coordination Contract.
- The first state-machine implementation should define one shared core lifecycle and work-type-specific extensions rather than separate slice and chore machines.
- Retrospective recorded and closed should be separate core lifecycle states.
- Future heartbeat and cross-repo automation should treat closed, not landed or retrospective recorded, as the terminal safe state.
- Cross-repo coordination should aggregate and trigger against repo-local Bandit state; it should not centralize canonical workflow state.
- Safe trigger points should come from validated step transitions in v0, not raw actor coordination events.
- Coordination primitive implementation should wait behind the active bootstrap-gap queue unless a queued gap directly depends on it.
- Validators must fail closed when ledger state claims a transition without the required evidence artifact.
- Validators should be able to detect contradictions between workflow state and actor events, such as a completed step whose required reviewer is still blocked.
- Block handling must preserve the blocker owner, required input, and resume condition.
- The Workflow Cockpit should visualize the ledger and evidence reconciliation; it must not own coordination state.

## Not Decided

- Exact ledger path and schema.
- Exact shared core microstep names and the first typed extensions.
- Exact cross-repo coordination surface and repository registration model.
- Exact central aggregation view, if any.
- Whether later versions allow selected actor events to trigger bounded inspection workflows.
- Exact append-only log format.
- Whether Bandit materializes a derived current-state file or computes current state on demand.
- Whether a repo-wide derived transition index is worth adding later.
- Exact Agent Coordination Event schema.
- Exact acceptance rules for turning a Block Event into an Accepted Block.
- Exact command names and arguments.
