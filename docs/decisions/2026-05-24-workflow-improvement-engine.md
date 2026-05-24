# Workflow Improvement Engine

## Decision

The fresh harness must treat continuous workflow improvement as a core product capability.

Retrospectives, cross-model tension, CodeRabbit outcomes, landing verdicts, incidents, smell triggers, and operator interventions should feed a Workflow Improvement Engine. The engine turns lessons into tagged improvement chores, tracks whether those chores actually improved the workflow, and supports decisions to keep, revise, revert, or double down.

## Rationale

Anyone can build a coding harness. The differentiated product is a harness that gets better at running agentic workflows and can prove which changes helped.

Sourmash already showed the seed pattern: retrospectives captured lessons, follow-ups became chores or slices, and `docs/architecture-changes.md` created trial/adopt/revert mechanics. The fresh harness should make that loop easier, more visible, and more analytical rather than leaving it as heavyweight ceremony.

## Policy Direction

- Every completed slice should produce a retrospective summary with lessons, surprises, repair loops, model disagreements, and workflow smells.
- Retrospective lessons that imply action should become tagged Retrospective-Derived Chores or explicit no-action decisions.
- Each improvement chore should record a hypothesis, source evidence, intended metric, baseline or comparison point, evaluation window, and expected direction of change.
- Improvement outcomes should support `keep`, `revise`, `revert`, and `double_down` decisions.
- The cockpit should expose improvement health: open improvement chores, overdue evaluations, adopted changes, reverted changes, repeated smells, and model-routing performance.
- The heartbeat chore-agent can help evaluate due improvement chores, but Codex PM owns the interpretation and routing decisions.

## Not Decided

- Exact metric catalog.
- Exact artifact schema.
- Whether improvement analytics ship in the v0 cockpit or start as CLI reports.
