# BANDIT-096 Stage 3 Dispatch

contract_version: 1
work_item: BANDIT-096
stage: Stage 3 Implementation
actor: implementation_writer
route: claude-sonnet-4-6
created_at: 2026-06-11T12:35:03Z

## Role

You are the Stage 3 Implementation Writer for `BANDIT-096`.

Codex authored Stage 2 RED tests and RED evidence. You must preserve the
Permanent Test Ownership Boundary: do not create, edit, delete, regenerate,
format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
acceptance mappings, formation evidence, review evidence, landing evidence,
retrospective evidence, roadmap/status files, PRD/source authority files, or
future-slice artifacts.

## Allowed Writes

You may edit only:

- `src/state/work-execute-controller.ts`
- `src/state/stage-route-registry.ts`
- `src/state/role-input-packets.ts`
- `src/state/provider-blocker-evidence.ts`
- `src/commands/work-execute-controller.ts`
- `src/commands/work-item-pm.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `docs/work/BANDIT-096/implementation-evidence.md`
- `docs/work/BANDIT-096/writer-report.md`

Use the smallest subset of those files needed to satisfy the RED tests and the
approved brief. Do not add dependencies, package scripts, lockfile changes,
CI/release workflow changes, hosted services, telemetry, merge/push/deploy
behavior, PRD-005.4 adapters, public context commands, cockpit action
execution, local API, State Index, Trust Verifier cutover, paid/live routing,
external repo mutation, credential handling, or unrelated Phase 8 work.

## Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-096/brief.md`
- `docs/work/BANDIT-096/orchestration-plan.md`
- `docs/work/BANDIT-096/red-evidence.md`
- `test/work-execute-controller.test.mjs`
- `test/stage-route-registry.test.mjs`
- `test/role-input-packets.test.mjs`
- `test/provider-blocker-evidence.test.mjs`

## RED Signal

Focused RED tests currently fail because these modules are missing:

- `src/state/work-execute-controller.ts`
- `src/state/stage-route-registry.ts`
- `src/state/role-input-packets.ts`
- `src/state/provider-blocker-evidence.ts`

## Implementation Requirements

Implement the minimal behavior needed for the RED tests while preserving the
brief:

- Execute-controller state helper:
  - selects exactly one eligible formed Work Item;
  - refuses no eligible work item, ambiguous eligible work items, and selected
    work items without `formation_approved`;
  - requires `orchestration-plan.md` plus coordination evidence before Stage 2;
  - returns an authorized stage route and internal role input packet after
    plan-mode evidence exists;
  - keeps canonical authority in repo-native artifacts, not helper output.
- Stage route registry:
  - maps Stage 2 through Stage 6 to authority role, route type, command or
    process adapter, reviewer route, expected evidence, stop conditions, and
    forbidden fallback behavior;
  - fails closed for missing route, unauthorized Local Qwen path, direct
    `qwen`, Ollama, ad hoc reviewer route, unapproved paid/live model route,
    policy-required escalation without configured route, and route/provider
    mismatch.
- Role Input Packet assembly:
  - returns internal `derived_non_canonical` packet data only;
  - includes source hierarchy, stage rubric and `CLEAN_CODE.md` expectations,
    allowed writes, forbidden writes, evidence paths, operator-input boundary,
    and stop conditions;
  - refuses public `bandit context <stage>` workflow command exposure.
- Provider/blocker evidence:
  - records provider timeout, provider error, malformed provider output,
    unavailable route, missing operator-owned input, stale evidence, review
    blocker, gate failure, and successful stage transition distinctly;
  - never reports partial completion as success;
  - never claims a CodeRabbit pass for timeout/refusal evidence;
  - enforces Local Qwen authorized route constraints.

Keep functions small and explicit. Avoid broad orchestration functions and
hidden workflow authority.

## Required Verification

Run:

```sh
node --test test/work-execute-controller.test.mjs
node --test test/stage-route-registry.test.mjs
node --test test/role-input-packets.test.mjs
node --test test/provider-blocker-evidence.test.mjs
npm run typecheck
```

If these pass quickly, also run:

```sh
npm test
```

## Required Evidence

Create:

- `docs/work/BANDIT-096/writer-report.md`
- `docs/work/BANDIT-096/implementation-evidence.md`

The evidence must list:

- files changed;
- tests run and outcomes;
- confirmation that no Test Writer-owned surfaces were edited;
- clean-code posture against `CLEAN_CODE.md`;
- any blocker/provider issues encountered.
