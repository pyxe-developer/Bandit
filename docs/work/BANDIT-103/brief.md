# BANDIT-103: Policy tiering: core invariants plus opt-in tiers

work_type: slice

## Status

Draft

Source PRD: BANDIT-PRD-006
Source PRD Path: docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md

## Origin

Operator direction on 2026-06-12 to decompose `BANDIT-PRD-006` into slices
that solve the remaining consumer-agnostic bootstrap gaps observed in the
nntnos consumer repo. This slice waits behind `BANDIT-100` because policy tier
selection is declared through the project-profile contract.

## Goal

A fresh consumer receives only the core policy invariants by default, with additional tiers enabled via the profile, and Bandit-internal policies stop shipping in the packed distribution.

## Scope

- Audit of the ~21 shipped policies into core, named opt-in tiers, and Bandit-internal
- Profile policy_tiers selection wired into init scaffolding
- Package files list updated so internal policies are not distributed
- Tier documentation describing what each tier guarantees and costs

## Out Of Scope

- Changing the semantics of any individual policy
- Runtime tier switching after init beyond documented manual steps
- New policy authoring

## Acceptance Criteria

- Default init scaffolds only core-tier policies
- Each opt-in tier selected in the profile scaffolds its documented policy set
- Packed tarball contains no Bandit-internal policy files
- Bandit's own repo expresses its full policy set as core plus all tiers with no orphan policies

## Test Plan

- Unit tests for tier resolution from profile to scaffolded policy set
- Pack test asserting internal policies absent from npm pack output
- Self-hosting test that Bandit's repo policy set is reproducible from its own profile

## Verification Plan

- Use the Test Plan above as the RED and GREEN verification surface.
- Run focused policy-tier, package allow-list, and self-hosting reproducibility tests for this slice.
- Run `npm run typecheck`, `npm test` if shared init/package policy behavior changes, `npm run bandit -- validate`, and `git diff --check` before Stage 5.
- Record CodeRabbit review evidence or honest provider-timeout/refusal evidence and authorized Local Qwen review evidence before landing.
- Record clean-code compliance in review and landing evidence before landing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-06-12 before decomposing PRD-006.
Implementer records `CLEAN_CODE.md` read in the work item implementation
evidence before Stage 3 begins.

## Stage-Rubric Checklist

- Stage 1 brief includes the full policy audit table with tier assignments
- Stage 4 review adversarially challenges each core-tier inclusion and exclusion
- Landing evidence includes the pack-content assertion output

## Bootstrap Gaps

- Tier boundaries are hypotheses until a second consumer with different needs exercises them

## Expected Files

- src/state/policy-tiers.ts
- src/commands/init.ts
- package.json
- docs/templates/policy-tiers.md
- test/init.test.mjs

## First Implementation Order

- Produce the policy audit and tier assignment table
- Implement tier resolution and scaffolding
- Update package files list and pack test
- Add the self-hosting reproducibility test

## Smell Triggers

- A policy assigned to core without a consumer-facing justification
- Internal policies reappearing in pack output
- Tier names that describe Bandit history rather than consumer guarantees

## Required Evidence

- Policy audit table in formation evidence
- Pack assertion output
- Self-hosting reproducibility test output

## Operator Input Status

none_required

## Role Boundary Evidence

Repo PM owns formation and slice-boundary decisions when this draft becomes
active. Test Writer owns Stage 2 RED evidence and test/fixture changes.
Implementation Writer owns Stage 3 source implementation after RED evidence and
must not edit tests, test helpers, fixtures, RED evidence, or acceptance
mappings for this work item. Reviewers and Landing Agent own their normal Stage
4 and Stage 5 artifacts.
