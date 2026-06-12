# BANDIT-102: Harness-neutral AGENTS.md and generated harness shims

work_type: slice

## Status

Draft

Source PRD: BANDIT-PRD-006
Source PRD Path: docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md

## Origin

Operator direction on 2026-06-12 to decompose `BANDIT-PRD-006` into slices
that solve the remaining consumer-agnostic bootstrap gaps observed in the
nntnos consumer repo. This slice waits behind `BANDIT-100` because generated
harness surfaces consume the project-profile and role-contract boundary.

## Goal

The harness-facing surface is generated from role contracts: a neutral AGENTS.md always, plus bandit harness install <name> producing thin shims, with Claude Code as the first supported target.

## Scope

- Neutral AGENTS.md generation from role contracts with no harness or model named
- bandit harness install claude-code generating .claude/commands/ shims for work-create and work-execute
- Idempotent regeneration safe to run after package upgrades
- Harness generator interface that makes additional targets additive

## Out Of Scope

- Codex, Cursor, or other harness shims beyond the generator interface
- Changes to role contract semantics
- Any harness-side state beyond generated files

## Acceptance Criteria

- Generated AGENTS.md contains no harness or model product names
- harness install claude-code emits slash-command files equivalent to the hand-written nntnos versions
- Re-running install produces no diff on unchanged contracts
- Unknown harness name fails listing supported targets

## Test Plan

- Snapshot tests for AGENTS.md and Claude Code shim output
- Idempotency test running install twice and asserting no changes
- Unit test for unknown-harness diagnostics

## Verification Plan

- Use the Test Plan above as the RED and GREEN verification surface.
- Run focused harness-generation and role-contract tests for this slice.
- Run `npm run typecheck`, `npm test` if shared CLI/init/role-contract behavior changes, `npm run bandit -- validate`, and `git diff --check` before Stage 5.
- Record CodeRabbit review evidence or honest provider-timeout/refusal evidence and authorized Local Qwen review evidence before landing.
- Record clean-code compliance in review and landing evidence before landing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-06-12 before decomposing PRD-006.
Implementer records `CLEAN_CODE.md` read in the work item implementation
evidence before Stage 3 begins.

## Stage-Rubric Checklist

- Stage 1 brief confirms shims derive from role contracts not hand-written templates
- Stage 4 review checks generated instructions match actual CLI behavior
- Landing evidence includes generated-shim snapshot diffs

## Bootstrap Gaps

- No automated way to exercise a generated shim inside a live harness session from CI

## Expected Files

- src/commands/harness.ts
- src/state/harness-generators/claude-code.ts
- src/state/role-contracts.ts
- test/harness-install.test.mjs

## First Implementation Order

- Extract neutral AGENTS.md generation from role contracts
- Define the harness generator interface
- Implement the claude-code generator
- Add idempotency and snapshot tests

## Smell Triggers

- Harness product names appearing in neutral surfaces
- Shim content drifting from role contracts instead of being derived
- Generators that overwrite operator-customized files without warning

## Required Evidence

- Snapshot diffs for generated surfaces
- Idempotency test output
- Adversarial review verdict on instruction-to-behavior fidelity

## Operator Input Status

none_required

## Role Boundary Evidence

Repo PM owns formation and slice-boundary decisions when this draft becomes
active. Test Writer owns Stage 2 RED evidence and test/fixture changes.
Implementation Writer owns Stage 3 source implementation after RED evidence and
must not edit tests, test helpers, fixtures, RED evidence, or acceptance
mappings for this work item. Reviewers and Landing Agent own their normal Stage
4 and Stage 5 artifacts.
