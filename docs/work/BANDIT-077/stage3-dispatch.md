# Stage 3 Dispatch - BANDIT-077

contract_version: 1
work_item: BANDIT-077
stage: stage3_implementation
actor: work_item_pm
implementation_writer: claude-implementation-writer-stage3
model_family: claude
model_id: claude-code
recorded_at: 2026-06-08T16:54:00Z
dispatch_status: pending

## Input Packet

Implement the smallest source/policy/template change required to satisfy
`docs/work/BANDIT-077/red-evidence.md` and
`test/spec-to-evidence-traceability.test.mjs`.

## Required Source Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-077/brief.md`
- `docs/work/BANDIT-077/orchestration-plan.md`
- `docs/work/BANDIT-077/red-evidence.md`
- `test/spec-to-evidence-traceability.test.mjs`
- `docs/templates/review-evidence.md`
- `docs/templates/role-run-manifest.md`

## Allowed Implementation Surfaces

- `.bandit/policy/spec-to-evidence-traceability.json`
- `docs/templates/spec-to-evidence-traceability.md`
- `docs/templates/review-evidence.md`
- `src/state/spec-to-evidence-traceability.ts`
- `src/commands/spec-to-evidence.ts`
- `src/commands/validate.ts`
- `src/commands/init.ts`
- `src/cli.ts`
- `docs/work/BANDIT-077/writer-report.md`
- `docs/role-runs/BANDIT-077/stage3-implementation.json`

## Forbidden Surfaces

- `test/**`
- `docs/work/BANDIT-077/red-evidence.md`
- `docs/work/BANDIT-077/brief.md`
- `docs/work/BANDIT-077/orchestration-plan.md`
- `docs/work/BANDIT-077/coordination-log.jsonl`
- `docs/work/BANDIT-077/qwen-formation-review.md`
- `docs/work/BANDIT-077/coderabbit-formation-review.md`
- `docs/work/BANDIT-077/formation-review.md`
- `docs/work/BANDIT-077/review-evidence.md`
- `docs/work/BANDIT-077/landing-verdict.md`
- `docs/work/BANDIT-077/landing-action.md`
- `docs/work/BANDIT-077/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/events.jsonl`
- test helpers, fixtures, expected-output mappings, source-artifact mappings,
  traceability acceptance mappings, and any other Test Writer-owned surface

## Validation Commands

- `node --test test/spec-to-evidence-traceability.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `node ./bin/bandit.mjs spec-to-evidence validate BANDIT-077 --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-077`
- `npm test`
- `git diff --check`

## Required Behavior

- Add the public command `bandit spec-to-evidence validate <WORK_ITEM> [--json]`.
- Validate `.bandit/policy/spec-to-evidence-traceability.json`.
- Define a human-readable matrix template at
  `docs/templates/spec-to-evidence-traceability.md`.
- Read `docs/work/<WORK_ITEM>/brief.md` acceptance criteria and
  `docs/work/<WORK_ITEM>/spec-to-evidence-traceability.json`.
- Emit deterministic read-only JSON for valid traceability mappings.
- Fail closed with clear diagnostics for missing acceptance-criterion mappings,
  vague evidence summaries, unsupported evidence types, implementation-detail
  evidence used as behavior proof without explicit rationale, and vague
  explicit dispositions.
- Update `docs/templates/review-evidence.md` so Stage 4 asks reviewers to
  inspect traceability state, traceability quality, and traceability
  disposition.
- Preserve derived-evidence authority. The command must not mutate acceptance
  criteria, reviewer routing, model routing, landing authority, UAT authority,
  gap status, coordination history, workflow policy, old-gate authority, or
  Trust Verifier authority.

## Role Boundary

Codex authored Stage 2 RED evidence. Stage 3 must use the Claude-family
implementation writer and must not create, edit, delete, regenerate, format, or
mechanically adjust tests, test helpers, fixtures, RED evidence, traceability
acceptance mappings, source-artifact mappings, or acceptance mappings for
`BANDIT-077`.
