# Current Context

## Last Updated: 2026-06-07

## Current Work Item: BANDIT-063

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-063` is active. It is the bounded bootstrap-gap chore for
`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION`.

Current stage: Stage 4 - aggregate review evidence required.

Stage 1 brief evidence is recorded at `docs/work/BANDIT-063/brief.md`, and the
formation review/approval evidence is recorded at
`docs/work/BANDIT-063/qwen-formation-review.md`,
`docs/work/BANDIT-063/coderabbit-formation-review.md`,
`docs/work/BANDIT-063/formation-review.md`, and
`docs/work/BANDIT-063/coordination-log.jsonl`.
Stage 2 RED evidence is recorded at `docs/work/BANDIT-063/red-evidence.md` and
`docs/artifact-inputs/BANDIT-063-red-evidence.json`. Stage 3 Claude
implementation evidence is recorded at
`docs/work/BANDIT-063/implementation-evidence.md`,
`docs/work/BANDIT-063/writer-report.md`,
`docs/artifact-inputs/BANDIT-063-implementation-evidence.json`, and
`docs/role-runs/BANDIT-063/stage3-implementation.json`; Codex PM acceptance is
recorded at `docs/work/BANDIT-063/stage3-pm-review.md`. Stage 4 CodeRabbit
review evidence is recorded at `docs/work/BANDIT-063/coderabbit-review.md`
with zero findings. Local Qwen review evidence is recorded at
`docs/work/BANDIT-063/local-qwen-review.md`, Codex PM finding disposition is
recorded at `docs/work/BANDIT-063/qwen-finding-disposition.md`, and layered
risk/supply-chain evidence is recorded at
`.bandit/policy/risk-classifications/BANDIT-063-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-063-supply-chain-gate.json`.

Next action: Record aggregate Stage 4 review evidence for `BANDIT-063`, then
run the Stage 5 landing verdict gate.

No operator-owned input is required for that next action. Do not start Stage 5
landing action, Trust Verifier cutover work, or unrelated cockpit product work
until aggregate Stage 4 review evidence is recorded and accepted.

`BANDIT-062` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA`; Stage 6
retrospective/gap disposition evidence is recorded at
`docs/work/BANDIT-062/retrospective.md`, and the gap ledger marks the serializer
metadata preservation gap resolved.

`BANDIT-061` is landed and closed out. It resolved the bounded Role Contract
Artifact Input Write Surface chore for
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`.

`BANDIT-060` is landed and closed out. It resolved
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` with a repo-native artifact-input
taxonomy, preferred `docs/artifact-inputs/` support for future
artifact-renderer inputs, and legacy-readable historical `docs/specs/`
compatibility.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is resolved by
`BANDIT-062`; it records the serializer repair needed after validation caught
lost replacement metadata during work-item creation.

`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` is the next queued bootstrap
gap; it records the required Work Item PM plan-mode gate after brief/current
state grounding and before full orchestration.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-063` - Work Item PM Plan Mode Orchestration Gate (active, Stage 4 aggregate review evidence required)
- `BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION` - active chore linked to `BANDIT-063`
- `BANDIT-062` - Work Item Create Replacement Metadata Preservation (closed)
- `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` - resolved by `BANDIT-062`
- `BANDIT-061` - Role Contract Artifact Input Write Surface (closed)
