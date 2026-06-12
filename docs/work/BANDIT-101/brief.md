# BANDIT-101: Typed reviewer adapters with honest degradation

work_type: slice

## Status

Draft

Source PRD: BANDIT-PRD-006
Source PRD Path: docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md

## Origin

Operator direction on 2026-06-12 to decompose `BANDIT-PRD-006` into slices
that solve the remaining consumer-agnostic bootstrap gaps observed in the
nntnos consumer repo. This slice waits behind `BANDIT-100` because reviewer
adapter scaffolding depends on the project-profile contract.

## Goal

Adversarial review works with any OpenAI-compatible endpoint, CLI command, or human reviewer, and the absence of a reviewer is an explicit recorded gap that blocks landing rather than a silent weakening.

## Scope

- Reviewer adapter contract with types openai_compatible, cli_command, human
- Profile-driven reviewer scaffolding in .bandit/reviewers/
- Generalize the local-qwen review path to consume any openai_compatible adapter
- reviewers: [] records an open bootstrap gap wired into landing-gate checks

## Out Of Scope

- Same-harness self-review defaults
- Reviewer quality calibration changes
- Hosted reviewer services

## Acceptance Criteria

- Each adapter type validates at init with type-specific required fields
- Existing local-qwen flow runs unchanged as an openai_compatible instance
- Empty reviewers list yields an open gap that blocks land-check until dispositioned
- human adapter produces a review-evidence path that satisfies the same gate contract

## Test Plan

- Unit tests per adapter type for validation and scaffold output
- Regression test that the local-qwen policy fixture still routes correctly
- Gate test: land-check blocked with open no-reviewer gap, unblocked after disposition

## Verification Plan

- Use the Test Plan above as the RED and GREEN verification surface.
- Run focused reviewer-adapter, Local Qwen routing, and landing-gate tests for this slice.
- Run `npm run typecheck`, `npm test` if shared review or landing gates change, `npm run bandit -- validate`, and `git diff --check` before Stage 5.
- Record CodeRabbit review evidence or honest provider-timeout/refusal evidence and authorized Local Qwen review evidence before landing.
- Record clean-code compliance in review and landing evidence before landing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-06-12 before decomposing PRD-006.
Implementer records `CLEAN_CODE.md` read in the work item implementation
evidence before Stage 3 begins.

## Stage-Rubric Checklist

- Stage 2 red evidence includes the blocked-landing test before implementation
- Stage 4 review verifies no adapter type can silently satisfy the gate without evidence
- Landing evidence shows local-qwen regression passing

## Bootstrap Gaps

- Only one real reviewer endpoint (Local Qwen) is available in-house for live verification of openai_compatible

## Expected Files

- src/state/reviewer-adapters.ts
- src/commands/qwen-review.ts
- src/commands/land-check.ts
- docs/templates/local-qwen-review.md
- test/local-qwen-review.test.mjs
- test/landing-gates.test.mjs

## First Implementation Order

- Define and test the adapter contract
- Refit the existing qwen path onto openai_compatible
- Add cli_command and human adapters
- Wire the no-reviewer gap into land-check

## Smell Triggers

- Reviewer identity hardcoded outside .bandit/reviewers/
- A landing path that passes with zero review evidence and no dispositioned gap
- Endpoint assumptions baked into review prompts

## Required Evidence

- Red evidence for the blocked-landing case
- Local-qwen regression run output
- Adversarial review verdict from a configured adapter

## Operator Input Status

none_required

## Role Boundary Evidence

Repo PM owns formation and slice-boundary decisions when this draft becomes
active. Test Writer owns Stage 2 RED evidence and test/fixture changes.
Implementation Writer owns Stage 3 source implementation after RED evidence and
must not edit tests, test helpers, fixtures, RED evidence, or acceptance
mappings for this work item. Reviewers and Landing Agent own their normal Stage
4 and Stage 5 artifacts.
