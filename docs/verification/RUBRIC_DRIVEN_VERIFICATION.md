# Rubric-Driven Verification

## Decision

Bandit uses spec-driven development, test-driven development, and rubric-driven verification together.

The line in the sand is this: tests prove behavior, but rubrics decide whether the implementation is fit for agentic work.

## Model

1. **Spec-driven development** defines what should exist and why.
2. **Test-driven development** turns the spec into executable behavioral contracts.
3. **Rubric-driven verification** evaluates qualities that tests alone do not protect: clarity, maintainability, role boundaries, source-of-truth discipline, reviewability, and workflow improvement.

## Required Rubrics

Every slice must be evaluated against:

- The slice spec and acceptance criteria.
- The test plan and test results.
- [CLEAN_CODE.md](../../CLEAN_CODE.md).
- The Smell Trigger Catalog when applicable.
- Bootstrap gap honesty when final Bandit gates do not exist yet.

## Landing Rule

A slice is not ready to land until Codex PM can answer:

1. Does the implementation satisfy the spec?
2. Do tests prove the important behavior?
3. Does the implementation comply with `CLEAN_CODE.md`?
4. Did we preserve role boundaries and source-of-truth boundaries?
5. Did we record missing gates honestly?
6. Did any lesson become a tagged improvement chore or explicit no-action decision?

If the answer to any required question is no, the slice is `needs-repair` or `blocked`, not safe-to-land.

## Why This Matters

Agentic programming becomes sustainable when agents can repeatedly verify more than test output. A passing test suite is necessary, but not enough. The implementation must also be understandable, bounded, reviewable, and connected to the workflow improvement loop.
