# Bandit Skill Cold-Start Evaluation Packet

## Scenario

Restore Bandit state from repo evidence, identify the active work item, enforce
the slice boundary, and perform only the recorded next action.

## Required Evidence

- Read `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `CLEAN_CODE.md`, and `docs/verification/STAGE_RUBRICS.md`.
- Check `git status --short` and recent log before editing.
- Trust repo artifacts over memory or chat history.
- Halt for operator-owned product, UAT, policy, business, cost, or genuinely
  ambiguous scope decisions.
- Update `CURRENT_CONTEXT.md` when the next recorded action changes.

## Passing Behavior

The skill names the phase, active work item, blockers, and one next action from
repo artifacts without creating future slice evidence or asking for routine
technical routing input.
