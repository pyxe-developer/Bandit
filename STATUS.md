# Current Context

## Last Updated: 2026-06-06

## Current Work Item: BANDIT-061

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-061` is active. It is the bounded Role Contract Artifact Input Write
Surface chore for
`BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE`.

Current stage: Stage 4 Local Qwen refresh pending. Stage 2 RED evidence, Stage
3 Claude implementation evidence, Codex PM Stage 3 acceptance, CodeRabbit Stage
4 review/disposition, prior Local Qwen Stage 4 review/disposition, risk
classification, and supply-chain gate evidence are recorded. The risk/supply
policy files changed the review subject after the prior Local Qwen run, so a
refresh is required before aggregate Stage 4 review evidence.

Next action: Rerun Local Qwen adversarial review for `BANDIT-061` after risk
and supply-chain policy evidence changed the review subject, then record
aggregate Stage 4 review evidence.

No operator-owned input is required for that Local Qwen refresh action. Do not
land, close out, begin Trust Verifier cutover work, or start unrelated cockpit
product work until refreshed Local Qwen evidence and aggregate Stage 4 review
evidence are complete.

`BANDIT-060` is landed and closed out. It resolved
`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` with a repo-native artifact-input
taxonomy, preferred `docs/artifact-inputs/` support for future
artifact-renderer inputs, and legacy-readable historical `docs/specs/`
compatibility.

`BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` is queued behind
`BANDIT-061`; it records the serializer repair needed after validation caught
lost replacement metadata during work-item creation.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-061` - Role Contract Artifact Input Write Surface (Local Qwen refresh pending)
- `BANDIT-GAP-ROLE-CONTRACT-ARTIFACT-INPUT-WRITE-SURFACE` - active via `BANDIT-061`
- `BANDIT-GAP-WORK-ITEM-CREATE-PRESERVE-REPLACED-GAP-METADATA` - queued gap
- `BANDIT-060` - Artifact Input Directory Split (closed)
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - resolved by `BANDIT-060`
