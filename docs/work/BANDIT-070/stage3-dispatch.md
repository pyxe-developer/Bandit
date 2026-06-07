# BANDIT-070 Stage 3 Implementation Dispatch

role: implementation_writer
model_family_requirement: claude
work_item: BANDIT-070
source_stage: Stage 2 RED evidence
verdict: implementation_required

## Mission

Implement the smallest source-only Verification Oracle Provenance Gate needed to
satisfy the current `BANDIT-070` RED tests.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-070/brief.md`
- `docs/work/BANDIT-070/orchestration-plan.md`
- `docs/work/BANDIT-070/red-evidence.md`
- `test/verification-oracle-provenance.test.mjs`
- `src/cli.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `src/state/work-items.ts`
- `src/state/review-evidence.ts`
- `src/state/landing-verdicts.ts`
- `src/state/templates.ts`
- `src/state/test-strength-gate.ts`

## Allowed Source Surfaces

- `.bandit/policy/verification-oracle-provenance.json`
- `docs/templates/verification-oracle-provenance.md`
- `docs/verification/STAGE_RUBRICS.md`
- `CLEAN_CODE.md`
- `src/state/verification-oracle-provenance.ts`
- `src/commands/verification-oracle-provenance.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `src/commands/init.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/cli.ts`
- `docs/work/BANDIT-070/writer-report.md`
- `docs/work/BANDIT-070/implementation-evidence.md`
- narrowly related validator, path, or command-wiring files only if required by
  the RED tests

## Forbidden Surfaces

Do not edit tests, test helpers, fixtures, RED evidence, oracle-provenance
evidence, oracle-source fixtures, claim-to-oracle mappings, acceptance mappings,
formation evidence, orchestration plan evidence, review evidence, landing
evidence, UAT evidence, retrospective evidence, `docs/roadmap/CURRENT_CONTEXT.md`,
`docs/roadmap/ROADMAP.md`, `STATUS.md`, `.bandit/bootstrap-gaps.json`,
`.bandit/events.jsonl`, dependencies, lockfiles, paid/external tooling, Trust
Verifier cutover, merge, push, deploy, product/UAT policy, guarded browser
action execution, local API, State Index, scheduler, claim/worktree lifecycle,
or unrelated Phase 8 cockpit/product scope.

## Expected Behavior

- Add `bandit verification-oracle-provenance validate [--json] [work-item-id]`.
- Read a repo-native `.bandit/policy/verification-oracle-provenance.json` policy
  that names covered surfaces, covered claims, supported oracle types,
  independent oracle types, required fields, command-required oracle types, and
  low-risk self-reported claim exceptions.
- Validate Stage 1 covered high-risk work-item briefs: covered oracle surfaces
  and claims require an oracle provenance strategy or explicit disposition
  before Stage 2 proceeds.
- Validate `docs/work/<ID>/oracle-provenance-evidence.md` for required fields:
  target surface, claim, oracle type, oracle source, owner or authority role,
  independence class, freshness source, claim mapping, source drift status, and
  command when the oracle type requires command/replay evidence.
- Reject circular self-attestation when an oracle source points to the same
  generated oracle-provenance artifact or when a trusted/current/ready/pass/
  safe-to-land claim relies only on `self_reported_or_derived` evidence.
- Make `land-check` fail closed for covered high-risk `safe-to-land` claims when
  current adequate oracle-provenance evidence is missing.
- Keep replay packets as an allowed oracle type without building the replay
  regression corpus.
- Do not approve Trust Verifier cutover, replace or wrap old gates, add paid or
  external tooling, change UAT policy, or expand unrelated Phase 8 scope.

## Verification

Run at minimum:

```sh
node --test test/verification-oracle-provenance.test.mjs
npm run typecheck
```

Do not edit the tests to make them pass. If a test appears wrong, stop and
record the blocker instead of changing the test surface.

## Evidence To Write

Write:

- `docs/work/BANDIT-070/writer-report.md`
- `docs/work/BANDIT-070/implementation-evidence.md`

Both artifacts must list files changed, verification run, skipped checks, and
confirm zero test-surface edits by the Stage 3 Writer.
