# Stage 3 Dispatch - BANDIT-075

contract_version: 1
work_item: BANDIT-075
stage: stage3_implementation
actor: work_item_pm
implementation_writer: claude-implementation-writer-stage3
model_family: claude
model_id: claude-sonnet-4-6
recorded_at: 2026-06-08T11:24:51Z
dispatch_status: completed
completed_at: 2026-06-08T11:48:14Z

## Input Packet

Implement the smallest source/policy change required to satisfy
`docs/work/BANDIT-075/red-evidence.md` and
`test/reviewer-calibration.test.mjs`.

## Required Source Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-075/brief.md`
- `docs/work/BANDIT-075/orchestration-plan.md`
- `docs/work/BANDIT-075/red-evidence.md`
- `docs/artifact-inputs/BANDIT-075-red-evidence.json`
- `test/reviewer-calibration.test.mjs`
- `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`
- `docs/templates/role-run-manifest.md`

## Allowed Implementation Surfaces

- `src/state/reviewer-calibration.ts`
- `src/commands/reviewer-calibration.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `.bandit/policy/reviewer-calibration.json`
- `docs/work/BANDIT-075/writer-report.md`
- `docs/role-runs/BANDIT-075/stage3-implementation.json`

## Forbidden Surfaces

- `test/**`
- `docs/reviewer-calibration-packets/**`
- `docs/work/BANDIT-075/red-evidence.md`
- `docs/artifact-inputs/BANDIT-075-red-evidence.json`
- `docs/work/BANDIT-075/brief.md`
- `docs/work/BANDIT-075/orchestration-plan.md`
- `docs/work/BANDIT-075/coordination-log.jsonl`
- formation, review, landing, closeout, roadmap, status, bootstrap-gap, event,
  and retrospective artifacts

## Validation Commands

- `node --test test/reviewer-calibration.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- reviewer-calibration validate --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-075`
- `git diff --check`

## Required Behavior

- Add the public command `bandit reviewer-calibration validate [--json]`.
- Validate `.bandit/policy/reviewer-calibration.json` and the packet paths it
  names.
- Enforce replay-only and no-live-routing boundaries.
- Reject direct `qwen` CLI reviewer eligibility.
- Require repo-derived Bandit workflow failure-mode packets before generic
  benchmark tasks can count as first-harness acceptance.
- Require gold-labeled seeded blockers and seeded non-issues.
- Score completed fixture reviewer outputs deterministically with
  `blocker_recall` as the primary metric.
- Record provider-timeout/refusal/inconclusive output statuses as calibration
  evidence without treating absence as a pass or live routing waiver.
- Do not mutate live reviewer profiles, landing policy, reviewer routing, model
  routing, gate verdicts, landing authority, workflow policy, or Trust Verifier
  authority.

## Role Boundary

Codex authored Stage 2 RED evidence. Stage 3 must use the Claude-family
implementation writer and must not create, edit, delete, regenerate, format, or
mechanically adjust tests, test helpers, seeded calibration packets, gold
labels, RED evidence, reviewer-score acceptance mappings, source-artifact
mappings, or acceptance mappings for `BANDIT-075`.
