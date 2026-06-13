# BANDIT-101 Stage 3 MiniMax-M3 Dispatch

contract_version: 1
work_item: BANDIT-101
stage: Stage 3 Implementation
writer: MiniMax-M3
owner: work_item_pm
created_at: 2026-06-13T13:36:04Z

## Mission

Implement the minimal source/config changes needed to turn the Stage 2 RED
tests GREEN for typed reviewer adapters with honest degradation.

Read these first:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-101/brief.md`
- `docs/work/BANDIT-101/orchestration-plan.md`
- `docs/work/BANDIT-101/red-evidence.md`

## RED Tests To Satisfy

Run these before editing to confirm RED:

```sh
node --test test/reviewer-adapters.test.mjs
node --test test/landing-gates.test.mjs
```

Expected current failures:

- `test/reviewer-adapters.test.mjs` 4 failing tests:
  typed `openai_compatible` validation, typed reviewer scaffolding,
  no-reviewer bootstrap gap recording, and Local Qwen `type:
  openai_compatible`.
- `test/landing-gates.test.mjs` 3 failing tests:
  open no-reviewer gap must block `land-check`, malformed human-review
  replacement evidence must fail closed, and valid human-review evidence must
  appear in `land-check` output without claiming a Local Qwen model review.

## Required Behavior

Implement these acceptance slices only:

1. Reviewer profile entries support typed adapters:
   - `openai_compatible`
   - `cli_command`
   - `human`
2. `init --profile` validates reviewer entries with type-specific diagnostics
   naming offending fields.
3. `init --profile` scaffolds one `.bandit/reviewers/<id>.json` file per
   configured reviewer adapter.
4. `reviewers: []` records a no-reviewer gap with status in `open`,
   `resolved`, or `replaced` in `.bandit/bootstrap-gaps.json`.
5. `.bandit/reviewers/local-qwen.json` remains the authorized Local Qwen route
   and is marked as `type: "openai_compatible"`.
6. `land-check` fails closed while an open no-reviewer gap is present.
7. `land-check` validates `docs/work/<ID>/human-review.md` when it is used as
   review replacement evidence.
8. `land-check` prints accepted human review evidence without claiming a Local
   Qwen model review ran.

## Allowed Writes

You may edit only implementation/config surfaces required by the RED tests:

- `src/state/project-profile.ts`
- `src/state/reviewer-profiles.ts`
- `src/state/reviewer-adapters.ts` or another narrowly named new source file
  for typed adapter validation/scaffolding
- `src/state/human-review.ts` or another narrowly named new source file for
  human review evidence parsing
- `src/commands/init.ts`
- `src/commands/land-check.ts`
- `src/commands/validate.ts` only if validation wiring is required
- `.bandit/reviewers/local-qwen.json`
- `docs/templates/project-profile.md` or the profile template constant in
  `src/commands/init.ts` if needed
- `docs/templates/local-qwen-review.md` only if parser-compatible metadata
  requires a template update

If a required implementation file is missing from this list, stop and explain
why instead of expanding scope silently.

## Forbidden Writes

Do not edit:

- `test/**`
- `docs/work/BANDIT-101/red-evidence.md`
- `docs/work/BANDIT-101/orchestration-plan.md`
- `docs/work/BANDIT-101/coordination-log.jsonl`
- any acceptance mappings, fixtures, or Test Writer-owned evidence
- dependency manifests, lockfiles, package scripts, CI/release workflows
- harness shims, policy tiering, reviewer benchmark policy, paid/live reviewer
  routing, provider pricing, Trust Verifier cutover, merge, push, deploy,
  public publishing automation, hosted services, telemetry, external repo
  mutation, installed global skill mutation, automation prompt mutation,
  claim authority, worktree lifecycle, State Index, local API, or unrelated
  Phase 8 work

Any test-surface edit invalidates the Stage 3 attempt.

## Verification Commands

Run at minimum:

```sh
node --test test/reviewer-adapters.test.mjs
node --test test/local-qwen-review.test.mjs
node --test test/landing-gates.test.mjs
npm run typecheck
```

Run broader tests if shared init/profile/reviewer/landing behavior changes
outside the focused surfaces:

```sh
npm test
```

## Output Required

Create `docs/work/BANDIT-101/writer-report.md` summarizing:

- implementation files changed
- how each RED failure was addressed
- exact commands run and results
- confirmation that no test surfaces were edited
- clean-code self-check against `CLEAN_CODE.md`

Do not create Stage 4 review, landing, retrospective, or closeout evidence.
