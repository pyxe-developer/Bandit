# CLEAN_CODE.md

Clean code is mandatory in Bandit.

Clean code is code that can be understood, verified, changed, and extended by someone other than the original author. In an agentic workflow, this matters even more: unreadable code creates hidden risk, weakens review, and makes future agents worse.

## Mandatory Slice Rule

Before every slice:

- Codex PM must read this file.
- The slice brief must record that `CLEAN_CODE.md` was read.
- The spec and acceptance criteria must be shaped so clean-code compliance can be evaluated.

Before every slice lands:

- Codex PM must perform a clean-code compliance check.
- The landing evidence must answer whether the slice complies with this rubric.
- Any blocker-level clean-code finding must be fixed before landing.
- Any accepted non-blocking clean-code concern must become a tagged improvement chore, follow-up, or explicit no-action decision.

## Bandit Clean-Code Rubric

Use this rubric before landing:

1. **Spec alignment**: The code implements the approved spec and acceptance criteria without redefining the product contract.
2. **Small surface area**: The diff is no larger than the slice requires.
3. **Simple design**: The solution uses the simplest structure that satisfies the spec.
4. **Explicit state**: Workflow state, gates, approvals, metrics, and side effects are visible in named artifacts or functions.
5. **No hidden authority**: UI, agents, helpers, and indexes do not secretly own canonical state.
6. **Testable behavior**: Important behavior is covered by tests or a recorded bootstrap verification gap.
7. **Readable flow**: A reviewer can follow command paths, state transitions, and failure paths without reconstructing intent from chat.
8. **Locality**: Related logic lives together; unrelated refactors are excluded.
9. **Failure clarity**: Refusals, blocked gates, stale evidence, and unavailable agents fail closed with clear messages.
10. **No role erosion**: Writer, reviewer, Test Writer, Landing Agent, and Codex PM boundaries are preserved.
11. **Improvement capture**: Any workflow lesson is converted into a tagged improvement chore or explicit no-action decision.

## General Rules

1. Follow standard conventions.
2. Keep it simple. Simpler is better. Reduce complexity as much as possible.
3. Leave the code cleaner than you found it.
4. Always look for root cause.

## Design Rules

1. Keep configurable data at high levels.
2. Prevent over-configurability.
3. Prefer dependency injection where it improves testability and clarity.
4. Keep boundaries explicit.
5. Separate orchestration phases when a function coordinates multiple concerns.

## Understandability

1. Be consistent.
2. Use explanatory variables.
3. Encapsulate boundary conditions.
4. Prefer dedicated value objects or structured records over ambiguous primitives.
5. Avoid logical dependencies where one method only works because another method was called first.
6. Avoid negative conditionals when a positive condition is clearer.

## Names

1. Choose descriptive and unambiguous names.
2. Make meaningful distinctions.
3. Use searchable names.
4. Replace magic numbers with named constants.
5. Avoid encoding type or implementation details into names unless the distinction is operationally meaningful.

## Functions

1. Keep functions small.
2. Make each function do one thing.
3. Use descriptive names.
4. Prefer fewer arguments.
5. Avoid hidden side effects.
6. Avoid flag arguments. Split behavior into separate functions when the flag changes the operation.

## Comments

1. Prefer self-explanatory code.
2. Use comments for intent, clarification, and warnings about consequences.
3. Do not add obvious narration.
4. Do not leave commented-out code.

## Source Structure

1. Separate concepts vertically.
2. Keep related code close.
3. Declare variables close to usage.
4. Keep dependent functions near each other.
5. Keep lines readable.
6. Use whitespace to group related ideas.

## Tests

1. Tests should be readable.
2. Tests should be fast enough to run often.
3. Tests should be independent.
4. Tests should be repeatable.
5. Tests should verify behavior, not incidental implementation details.

## Code Smells

Treat these as escalation triggers:

1. Rigidity: small changes cause cascades.
2. Fragility: changes break unrelated behavior.
3. Immobility: useful code cannot be reused because of coupling.
4. Needless complexity.
5. Needless repetition.
6. Opacity.
7. Large orchestration functions with mixed validation, subprocess, parsing, artifact writes, and state transitions.
8. Hidden state mutation.
9. Weak refusal paths.
10. Passing tests with unclear spec compliance.
