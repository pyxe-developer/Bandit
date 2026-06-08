# Stage 3 Dispatch - BANDIT-074

contract_version: 1
work_item: BANDIT-074
stage: stage3_implementation
actor: work_item_pm
implementation_writer: claude-implementation-writer-stage3
model_family: claude
model_id: claude-sonnet-4-6
recorded_at: 2026-06-08T03:24:00Z
dispatch_status: completed

## Input Packet

Implement the smallest source/policy change required to satisfy
`docs/work/BANDIT-074/red-evidence.md` and
`test/metamorphic-cross-projection-checks.test.mjs`.

## Required Source Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-074/brief.md`
- `docs/work/BANDIT-074/red-evidence.md`
- `docs/artifact-inputs/BANDIT-074-red-evidence.json`
- `test/metamorphic-cross-projection-checks.test.mjs`

## Allowed Implementation Surfaces

- `src/state/projection-consistency.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `.bandit/policy/metamorphic-cross-projection-checks.json`
- `docs/work/BANDIT-074/writer-report.md`
- `docs/role-runs/BANDIT-074/stage3-implementation.json`

## Forbidden Surfaces

- `test/**`
- `docs/work/BANDIT-074/red-evidence.md`
- `docs/artifact-inputs/BANDIT-074-red-evidence.json`
- `docs/work/BANDIT-074/brief.md`
- formation, review, landing, closeout, roadmap, status, bootstrap-gap, and event artifacts

## Validation Commands

- `node --test test/metamorphic-cross-projection-checks.test.mjs`
- `npm run typecheck`
- `npm test`
- `npm run bandit -- validate`
- `npm run bandit -- validate --json`
- `git diff --check`

## Completion Evidence

The Stage 3 writer completed with `docs/work/BANDIT-074/writer-report.md` and
`docs/role-runs/BANDIT-074/stage3-implementation.json`. Codex PM later repaired
this dispatch packet as missing role-run input evidence after
`npm run bandit -- role-runs validate BANDIT-074 --json` failed closed.
