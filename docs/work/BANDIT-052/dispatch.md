# BANDIT-052 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-052` - Event-Driven Wake Scheduler
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `b1f0761`
- Dispatch status: Stage 3 implementation requested

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-052/brief.md`
- `docs/work/BANDIT-052/red-evidence.md`
- `docs/specs/BANDIT-052-red-evidence.json`
- `test/event-driven-wake-scheduler.test.mjs`
- Existing command/state patterns in `src/cli.ts`, `src/commands/coordination-authority.ts`, `src/commands/heartbeat.ts`, `src/state/heartbeat-policy.ts`, and related policy validators.

## Mission

Implement Stage 3 for `BANDIT-052` only: add a CLI-readable validation surface for the Event-Driven Wake Scheduler policy so the focused RED tests pass.

The expected command is:

```sh
bandit event-driven-wake-scheduler validate --json
```

The implementation should validate `.bandit/policy/event-driven-wake-scheduler.json` fail-closed. The current RED fixture has:

```json
{
  "contract_version": 1,
  "policy_id": "event-driven-wake-scheduler",
  "include_deterministic_sweeper": true
}
```

At minimum, satisfy the Stage 2 tests by:

- accepting the complete policy fixture;
- rejecting unsupported options with `Usage: bandit event-driven-wake-scheduler validate [--json]`;
- refusing policies without deterministic sweeper coverage with a diagnostic containing `deterministic sweeper contract is required`.

Within the approved scope, shape the validator so later Stage 4 can evaluate the stated boundaries from the brief: event triggers are not workflow authority, deterministic non-LLM sweeper exists, fallback polling is not removed until the Work Availability Wake Guarantee passes, and validation emits clear pass/refusal output.

## Editable Production Paths

You may edit production implementation and Stage 3 evidence only:

- `src/cli.ts`
- `src/commands/event-driven-wake-scheduler.ts`
- `src/state/event-driven-wake-scheduler.ts`
- `src/state/paths.ts`
- `.bandit/policy/event-driven-wake-scheduler.json`
- `docs/templates/event-driven-wake-scheduler.md`
- `docs/work/BANDIT-052/implementation-evidence.md`
- `docs/specs/BANDIT-052-implementation-evidence.json`

Use narrower edits if fewer files are enough. Preserve existing patterns.

## Forbidden Paths And Actions

Do not edit:

- `test/event-driven-wake-scheduler.test.mjs`
- any other test file, test helper, fixture, RED evidence artifact, RED evidence spec, or acceptance mapping for `BANDIT-052`
- `docs/work/BANDIT-052/red-evidence.md`
- `docs/specs/BANDIT-052-red-evidence.json`
- review, landing, landing-action, retrospective, CodeRabbit, or Local Qwen evidence
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement full scheduler execution, batch queue draining, multi-repo scheduling, full worktree lifecycle enablement, true parallel writable workstream enablement, claim lease creation/release, claim authority changes, work-surface reservations, automatic merge/push/deploy behavior, product UAT approval, cockpit UI/server/API work, state-index persistence, actor identity policy, PR/CI workflow execution, live reviewer routing changes, paid reviewer routes, external service integration, or unrelated Phase 8 work.

If the RED test is wrong or requires broader scope, stop and record that in `docs/work/BANDIT-052/writer-report.md`; do not change the tests.

## Verification Commands

Run at least:

```sh
node --test test/event-driven-wake-scheduler.test.mjs
npm run typecheck
npm run bandit -- validate
git diff --check
```

Run broader tests if your implementation touches shared command routing or validation surfaces beyond the focused command.

## Required Writer Report

Write `docs/work/BANDIT-052/writer-report.md` with:

- summary of production files changed;
- verification commands and results;
- explicit statement that Test Ownership Boundary was preserved;
- any stop conditions, bootstrap gaps, or follow-up concerns.
