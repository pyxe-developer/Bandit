# BANDIT-021: General Artifact Create Command

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap for CLI-owned creation of Bandit workflow artifacts beyond PRD draft-work and work-item briefs.

## Origin

Bootstrap gap BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND is queued after BANDIT-020 created the narrow work-item creation command.

## Scope

- Define the narrow artifact families this chore will make CLI-owned for the current bootstrap workflow.
- Add a CLI-owned artifact creation path for selected workflow artifacts that are still manually created.
- Keep repo-native Markdown and JSON artifacts as canonical state; generated helpers must not become hidden authority.
- Fail closed for unknown artifact families, unknown work items, occupied output paths, malformed input, and attempts to create artifacts outside the repository.
- Preserve existing PRD draft-work and work-item creation contracts.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-021/brief.md and links to BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND.
- The future implementation defines one narrow command surface for creating supported workflow artifacts from explicit structured input.
- The command refuses unsupported artifact kinds and unsafe paths before writing files.
- The command records lifecycle or evidence state where the existing Bandit state model requires it.
- The implementation includes focused tests for successful artifact creation and fail-closed refusal paths.
- Bandit validation and gap listing remain authoritative after the gap is active and after the later closeout.
- No cockpit, heartbeat agent, broad artifact schema framework, or feature work is introduced by this chore.

## Verification Plan

- Run focused tests for the new artifact creation command.
- Run npm test if implementation touches shared command routing, state parsing, templates, or validators.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run git diff --check.

## Expected Files

- docs/work/BANDIT-021/brief.md
- docs/work/BANDIT-021/red-evidence.md
- docs/work/BANDIT-021/implementation-evidence.md
- docs/work/BANDIT-021/local-qwen-review.md
- docs/work/BANDIT-021/review-evidence.md
- docs/work/BANDIT-021/landing-verdict.md
- docs/work/BANDIT-021/landing-action.md
- docs/work/BANDIT-021/retrospective.md
- src/commands/artifact-create.ts
- src/cli.ts
- test/artifact-create.test.mjs

## Required Evidence

- docs/work/BANDIT-021/brief.md
- docs/work/BANDIT-021/red-evidence.md
- docs/work/BANDIT-021/implementation-evidence.md
- docs/work/BANDIT-021/local-qwen-review.md
- docs/work/BANDIT-021/review-evidence.md
- docs/work/BANDIT-021/landing-verdict.md
- docs/work/BANDIT-021/landing-action.md
- docs/work/BANDIT-021/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this chore brief. Codex PM owns the narrow technical routing from repo artifacts.
