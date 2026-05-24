# Bootstrap Methodology

## Purpose

Bandit has a chicken-and-egg problem: the product is a workflow engine, but the engine does not exist yet.

The solution is progressive hardening. We use Bandit-like discipline manually from the first implementation slice, then convert repeated manual steps into CLI commands, specialized agents, and cockpit views as soon as the shape is stable.

## Core Rule

Do not wait for Bandit to exist before using Bandit discipline.

Every bootstrap slice should leave durable repo-native evidence:

- Scope and acceptance criteria.
- Test plan or verification plan.
- `CLEAN_CODE.md` read evidence.
- Known missing gates.
- Implementation evidence.
- Review and landing evidence.
- Retrospective.
- Improvement chores or explicit no-action decisions.

## Slice Boundary

Every slice must land before the next slice begins.

During bootstrap, "landed" means the slice has a complete landing verdict, the landing action itself has happened as a focused commit, and `docs/work/<ID>/landing-action.md` records the actual landed commit SHA. Later PR-based workflows may replace this with merge evidence, but the rule is the same: a safe-to-land verdict is not the same as landed.

Before creating the next slice brief, RED evidence, implementation branch, or active-work context, confirm the previous slice has:

- verification evidence;
- landing verdict;
- landing action evidence in `docs/work/<ID>/landing-action.md`, including commit SHA or merge SHA;
- retrospective and improvement dispositions;
- updated roadmap/current-context state.

If any of these are missing, the next task is landing or closeout repair for the current slice. Do not begin the next slice.

## Build Order

The durable path is:

1. Manual policy.
2. Structured artifact.
3. CLI command.
4. Specialized agent or skill.
5. Cockpit view.

Do not jump straight to agents or UI when the artifact contract is still unclear.

## Bootstrap Exceptions

Early slices will lack parts of the final workflow. That is acceptable only when recorded honestly.

Examples:

- Qwen adversarial gate unavailable.
- CodeRabbit CLI loop unavailable.
- Landing Agent unavailable.
- Heartbeat chore-agent unavailable.
- Cockpit unavailable.

The slice must record the missing gate as a bootstrap gap. It must not pretend the gate ran.

## Codex PM Responsibilities

Codex PM owns routine technical management:

- Split work into small slices.
- Choose when a task is a chore versus a slice.
- Select the relevant skill or agent pattern.
- Detect smell triggers.
- Decide when stronger review is required.
- Keep the operator out of routine code-safety decisions.
- Ask the operator only for product direction, UAT, business tradeoffs, policy changes, explicit cost/risk overrides, or ambiguous scope.

## Slice Shape

Each implementation slice should be thin and testable.

Preferred slice size:

- One workflow behavior.
- One artifact family.
- One state transition.
- One gate.
- One report.
- One validator.

Avoid slices that attempt to build a whole subsystem. If a slice touches multiple orchestration phases, define the helper boundaries before implementation.

## Test Strategy

Bandit's first code should be CLI and schema behavior because those are deterministic.

Use tests for:

- Command input/output.
- Artifact validation.
- JSONL append behavior.
- Refusal paths.
- State transitions.
- Stale evidence detection.
- Improvement chore metadata.

Use manual verification only when an external integration does not exist yet, and record that as a bootstrap gap.

## Verification Strategy

Bandit uses three verification layers:

1. Spec-driven verification: the implementation must satisfy the approved spec and acceptance criteria.
2. Test-driven verification: important behavior must be covered by tests or an explicit bootstrap gap.
3. Rubric-driven verification: the implementation must comply with `CLEAN_CODE.md` and any applicable workflow rubrics before landing.

Codex PM must read `CLEAN_CODE.md` before each slice and must perform a clean-code compliance check before landing. This applies during bootstrap, even before Bandit's final review agents exist.

## Retrospective Rule

Every bootstrap slice ends with a retrospective.

The retrospective must classify lessons as:

- Improvement chore.
- Cross-model tension entry.
- Smell catalog update.
- No-action decision.

An actionable lesson without a tagged chore is incomplete.

## First Implementation Target

The first implementation target is not the cockpit.

The first implementation target is the smallest CLI path that lets Bandit improve itself:

1. Initialize repo-native Bandit state.
2. Create a work item.
3. Validate state.
4. Record lifecycle events.
5. Create a retrospective-derived improvement chore.
6. Report due improvement chores.

This proves the engine before the release machinery and cockpit are built.

## Success Criteria

The bootstrap methodology is working when:

- Each slice produces evidence that another agent can audit.
- Missing gates are recorded as missing, not silently substituted.
- Repeated manual steps become CLI commands.
- Retrospective lessons become tagged improvement chores.
- Codex PM asks fewer technical questions over time because routing policy improves.
- Workflow changes can be kept, revised, reverted, or doubled down based on evidence.
