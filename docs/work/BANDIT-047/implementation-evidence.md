# BANDIT-047 Implementation Evidence

## Status

Stage 3 Complete

## Writer Identity

- writer_identity: claude_process_adapter
- model_family: claude
- base_sha: d5f83e6a3a23645c89053ebb9192c4bc79afcbd0

## Summary

Added `src/state/model-family-separation.ts` implementing model-family separation validation for Bootstrap Model-Family Separation. Wired it into `src/commands/validate.ts`. Created committed policy, template, and BANDIT-047 evidence artifacts required for the gate to pass.

The validator enforces in order:

1. If neither `.bandit/policy/model-family-separation.json` nor `docs/model-family-separation/` exists, validation skips the gate for historical compatibility.
2. If the evidence directory exists but policy is missing, validation fails closed.
3. Template must exist at `docs/templates/model-family-separation.md` when the gate is active.
4. For each `model_family_separation` decision in the policy's `release_authorized_decisions`:
   - Evidence file must exist at the declared `evidence_path`
   - Stage 2 must record all four ownership fields
   - Stage 3 model family must differ from Stage 2 RED author
   - When Stage 2 RED is Codex-authored, Stage 3 must be Claude
   - Writer test-surface edits with partial repair and no revert evidence are rejected
   - Writer test-surface edits with touched surfaces are rejected
   - Claude self-escalation is rejected

Bootstrap Orchestration Boundary is enforced through artifact and diff gates around Process Adapter runs, not live True Agent orchestration.

The first fresh Writer run timed out after producing a partial implementation and writer report. A second Claude repair run preserved historical/fresh-initialized fixture compatibility by adding the inactive-gate skip guard while retaining fail-closed behavior when model-family evidence exists without policy.

## Files Changed by Writer

- `src/state/model-family-separation.ts` (new)
- `src/commands/validate.ts` (added import and call)
- `.bandit/policy/model-family-separation.json` (new)
- `docs/templates/model-family-separation.md` (new)
- `docs/model-family-separation/BANDIT-047-model-family-separation.json` (new)
- `docs/specs/BANDIT-047-implementation-evidence.json` (new)
- `docs/work/BANDIT-047/implementation-evidence.md` (new)
- `docs/work/BANDIT-047/writer-report.md` (new)

## Forbidden Test-Owned Surfaces

No test, test helper, fixture, RED evidence, acceptance mapping, or dispatch surface was created, edited, deleted, regenerated, formatted, or mechanically adjusted.

## Verification

| Command | Result |
| --- | --- |
| `node --test test/model-family-separation.test.mjs` | 10 pass, 0 fail |
| `node --test test/landing-gates.test.mjs test/local-qwen-review.test.mjs test/validate.test.mjs test/bootstrap-gaps.test.mjs test/artifact-create.test.mjs test/draft-work.test.mjs test/work-item-create.test.mjs` | 161 pass, 0 fail |
| `npm test` | 380 pass, 0 fail |
| `npm run typecheck` | pass |
| `npm run bandit -- validate` | Bandit state is valid. |
| `git diff --check` | pass |
