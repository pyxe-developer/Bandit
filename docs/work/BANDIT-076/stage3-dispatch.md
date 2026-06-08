# Stage 3 Dispatch - BANDIT-076

contract_version: 1
work_item: BANDIT-076
stage: stage3_implementation
actor: work_item_pm
implementation_writer: claude-implementation-writer-stage3
model_family: claude
model_id: claude-code
recorded_at: 2026-06-08T15:24:30Z
dispatch_status: pending

## Input Packet

Implement the smallest source/policy change required to satisfy
`docs/work/BANDIT-076/red-evidence.md` and
`test/evidence-bundle-attestation.test.mjs`.

## Required Source Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-076/brief.md`
- `docs/work/BANDIT-076/orchestration-plan.md`
- `docs/work/BANDIT-076/red-evidence.md`
- `docs/artifact-inputs/BANDIT-076-red-evidence.json`
- `test/evidence-bundle-attestation.test.mjs`
- `docs/templates/role-run-manifest.md`

## Allowed Implementation Surfaces

- `.bandit/policy/evidence-bundle-attestation.json`
- `src/state/evidence-bundle-attestation.ts`
- `src/commands/evidence-bundle.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `docs/work/BANDIT-076/writer-report.md`
- `docs/role-runs/BANDIT-076/stage3-implementation.json`

## Forbidden Surfaces

- `test/**`
- `docs/work/BANDIT-076/red-evidence.md`
- `docs/artifact-inputs/BANDIT-076-red-evidence.json`
- `docs/work/BANDIT-076/brief.md`
- `docs/work/BANDIT-076/orchestration-plan.md`
- `docs/work/BANDIT-076/coordination-log.jsonl`
- `docs/work/BANDIT-076/qwen-formation-review.md`
- `docs/work/BANDIT-076/coderabbit-formation-review.md`
- `docs/work/BANDIT-076/formation-review.md`
- `docs/work/BANDIT-076/review-evidence.md`
- `docs/work/BANDIT-076/landing-verdict.md`
- `docs/work/BANDIT-076/landing-action.md`
- `docs/work/BANDIT-076/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/events.jsonl`
- test helpers, fixtures, expected-output mappings, source-artifact mappings,
  evidence-bundle acceptance mappings, and any other Test Writer-owned surface

## Validation Commands

- `node --test test/evidence-bundle-attestation.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- evidence-bundle attest BANDIT-076 --json`
- `node ./bin/bandit.mjs coordination validate BANDIT-076`
- `npm test`
- `git diff --check`

## Required Behavior

- Add the public command `bandit evidence-bundle attest <WORK_ITEM> [--json]`.
- Validate `.bandit/policy/evidence-bundle-attestation.json`.
- Define deterministic evidence bundle membership covering source subject, RED
  evidence, test evidence, implementation evidence, review evidence, risk
  classification, supply-chain gate, UAT where applicable, landing verdict,
  landing action, policy versions, command versions, and freshness metadata.
- Produce stable SHA-256 bundle hashes for equivalent input sets.
- Capture command and policy version evidence in JSON output.
- Fail closed with clear diagnostics for missing, stale, unsupported,
  changed-after-review, landing-verdict-mismatched, or contradictory bundle
  inputs.
- Treat UAT as required only for product-facing slices and as not applicable for
  non-product chores.
- Preserve read-only derived-evidence authority. Do not mutate live gate
  verdicts, reviewer routing, model routing, landing authority, UAT authority,
  gap status, coordination history, workflow policy, or Trust Verifier authority.

## Role Boundary

Codex authored Stage 2 RED evidence. Stage 3 must use the Claude-family
implementation writer and must not create, edit, delete, regenerate, format, or
mechanically adjust tests, test helpers, fixtures, RED evidence, evidence-bundle
acceptance mappings, source-artifact mappings, or acceptance mappings for
`BANDIT-076`.
