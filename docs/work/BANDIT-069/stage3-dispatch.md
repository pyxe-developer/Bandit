# BANDIT-069 Stage 3 Implementation Dispatch

role: implementation_writer
model_family_requirement: claude
work_item: BANDIT-069
source_stage: Stage 2 RED evidence
verdict: implementation_required

## Mission

Implement the smallest source-only Test Strength / Mutation Adequacy Gate needed
to satisfy the current `BANDIT-069` RED tests.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-069/brief.md`
- `docs/work/BANDIT-069/orchestration-plan.md`
- `docs/work/BANDIT-069/red-evidence.md`
- `test/test-strength-gate.test.mjs`
- `src/cli.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `src/state/work-items.ts`
- `src/state/review-evidence.ts`
- `src/state/landing-verdicts.ts`
- `src/state/templates.ts`

## Allowed Source Surfaces

- `.bandit/policy/test-strength-gate.json`
- `docs/templates/test-strength-evidence.md`
- `docs/templates/red-evidence.md`
- `docs/verification/STAGE_RUBRICS.md`
- `CLEAN_CODE.md`
- `src/state/test-strength-gate.ts`
- `src/commands/test-strength-gate.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `src/state/review-evidence.ts`
- `src/state/landing-verdicts.ts`
- `src/state/templates.ts`
- `src/cli.ts`
- `docs/work/BANDIT-069/writer-report.md`
- `docs/work/BANDIT-069/implementation-evidence.md`
- narrowly related validator, path, or command-wiring files only if required by
  the RED tests

## Forbidden Surfaces

Do not edit tests, test helpers, fixtures, RED evidence, mutation evidence,
assertion-adequacy mappings, adversarial-case mappings, acceptance mappings,
formation evidence, orchestration plan evidence, review evidence, landing
evidence, UAT evidence, retrospective evidence, `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, `STATUS.md`, `.bandit/bootstrap-gaps.json`,
`.bandit/events.jsonl`, dependencies, lockfiles, paid/external tooling, Trust
Verifier cutover, merge, push, deploy, product/UAT policy, guarded browser
action execution, local API, State Index, scheduler, claim/worktree lifecycle,
or unrelated Phase 8 cockpit/product scope.

## Expected Behavior

- Add `bandit test-strength-gate validate [work-item-id]`.
- Read a repo-native `.bandit/policy/test-strength-gate.json` policy that names
  covered surfaces, acceptable evidence modes, and field requirements.
- Validate Stage 1 covered high-risk surfaces declared in work-item briefs:
  covered surfaces require a test-strength strategy or explicit disposition
  before Stage 2 proceeds.
- Validate `docs/work/<ID>/red-evidence.md` for covered surfaces: it must record
  `intended_failure_reason` and `assertion_adequacy_mapping` or equivalent
  explicit field evidence.
- Validate `docs/work/<ID>/test-strength-evidence.md` for mutation,
  property/fault-injection, table-driven adversarial, and explicit disposition
  modes.
- Make `land-check` fail closed for covered high-risk surfaces when current
  adequate test-strength evidence or explicit disposition is missing.
- Keep this gate risk-tiered. Do not add blanket line coverage, universal
  mutation-score, every-file mutation, paid/external tooling, product/UAT,
  merge/push/deploy, or unrelated cockpit behavior.

## Verification

Run at minimum:

```sh
node --test test/test-strength-gate.test.mjs
npm run typecheck
```

Do not edit the tests to make them pass. If a test appears wrong, stop and
record the blocker instead of changing the test surface.

## Evidence To Write

Write:

- `docs/work/BANDIT-069/writer-report.md`
- `docs/work/BANDIT-069/implementation-evidence.md`

Both artifacts must list files changed, verification run, skipped checks, and
confirm zero test-surface edits by the Stage 3 Writer.
