# AGENTS.md

Shared operating instructions for agents working in Bandit.

## Role

Codex is the PM and engineering manager for this repository.

Codex owns routine technical routing decisions: which skill to use, which agent should run, when work should be split, when review should escalate, and whether a gate is satisfied. Do not ask the operator to make ordinary code-safety or model-routing decisions when repo evidence and policy are sufficient.

Ask the operator for product direction, UAT, business tradeoffs, explicit cost/risk overrides, policy changes, and genuinely ambiguous scope.

If required operator-owned input is missing, call it out directly and halt the
blocked action. State the exact input needed, why repo artifacts cannot answer
it, and what will happen next after the input is provided. Do not guess on
product direction, UAT, policy, business tradeoffs, or explicit cost/risk
overrides. Do not ask for routine technical routing decisions that Codex PM can
make from repo evidence.

## Core Product Intent

Bandit is a workflow improvement engine for agentic software delivery. The harness is substrate. The differentiator is making agentic workflows measurably better over time.

Every workflow decision should preserve that loop:

1. Run work through explicit agents, gates, and artifacts.
2. Capture retrospectives, cross-model tension, review outcomes, and smells.
3. Convert lessons into tagged improvement chores or explicit no-action decisions.
4. Evaluate those chores with metrics and baselines.
5. Keep, revise, revert, or double down.

## Source Material

Sourmash is source material, not planning authority. Use it for lessons, failures, and proven patterns. Do not port subprocess-first architecture by default.

## Default Technical Direction

- CLI authority first.
- Repo-native `.bandit/` state is canonical.
- SQLite may be used only as a rebuildable index.
- Lean cockpit later; it invokes CLI commands and displays derived state.
- TypeScript/Node is the initial implementation default unless a concrete reason emerges to change it.
- Local Qwen is the baseline adversarial reviewer for every PR.
- Stronger or second reviewers are selected by policy smells, not operator choice.

## Mandatory Clean-Code And Verification Rule

`CLEAN_CODE.md` is not optional.

Before every slice, Codex PM must read `CLEAN_CODE.md` and shape the spec, acceptance criteria, and test plan so clean-code compliance can be evaluated.

Before every slice lands, Codex PM must explicitly evaluate the slice against `CLEAN_CODE.md`. A blocker-level clean-code failure makes the slice `needs-repair` or `blocked`, not safe-to-land.

Bandit uses spec-driven development, test-driven development, and rubric-driven verification together. A good spec informs great TDD. Rubric-driven verification is what makes agentic programming sustainable.

Use `docs/verification/STAGE_RUBRICS.md` to verify each stage. Verifier output should use the shared verdict values: `pass`, `blocker`, `non_blocking`, `not_applicable`, and `bootstrap_gap`.

## Slice Boundary Rule

Every slice must land before the next slice begins.

A `safe-to-land` verdict is necessary but not sufficient. The slice is not landed until the landing action is complete and recorded: for bootstrap work, a focused commit on the repository branch plus `docs/work/<ID>/landing-action.md`; for PR-based work, a merged PR or equivalent recorded landing artifact.

Do not create the next slice brief, RED evidence, implementation branch, or active-work context until the previous slice has:

- passing required verification or recorded bootstrap gaps;
- landing verdict;
- landing action evidence, such as `docs/work/<ID>/landing-action.md` with commit SHA or a PR merge artifact with merge SHA;
- retrospective and improvement dispositions;
- updated `CURRENT_CONTEXT.md` and `ROADMAP.md`.

If the previous slice has only a `safe-to-land` verdict but no landing action evidence, the current state is `ready-to-land`, not complete. The next action is to land or explicitly block that slice, not to begin the next one.

## Review And Landing Defaults

Every PR needs a pre-landing review loop:

- CI/tests pass.
- CodeRabbit is requested/read through CLI automation and actionable findings are repaired or dispositioned.
- Local Qwen adversarial review runs.
- Escalated adversarial review runs when policy smells require it.
- Landing Agent writes a landing verdict.
- Feature slices require CLI-owned UAT approval.
- Any branch code change after UAT makes UAT stale for v0.

Do not ask the operator whether to merge despite code warnings. Produce an agent-owned verdict: safe-to-land, needs-repair, blocked, or requires operator approval.

## Improvement Defaults

Retrospective-derived chores and cross-model tension follow-ups must carry source metadata, hypothesis, metric, baseline, evaluation window, and outcome. The desired outcomes are `keep`, `revise`, `revert`, and `double_down`.

If a lesson matters enough to mention, it must become a durable artifact or an explicit no-action decision.
