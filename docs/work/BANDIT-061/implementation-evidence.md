# BANDIT-061 Implementation Evidence

## Status

`pass` for Stage 3: Implementation.

Stage 3 implementation makes the focused Stage 2 RED suites pass without editing
tests. Role-run validation now enforces observed changed-file evidence for
future (`contract_version` 2+) manifests, and role-contract validation requires
`implementation_writer` to model the BANDIT-060 artifact-input policy/support
surfaces when the artifact-input policy is present.

## Production Files Changed

- `src/state/role-run-manifests.ts`
- `src/state/role-contracts.ts`
- `.bandit/policy/role-contracts.json`
- `docs/templates/role-run-manifest.md`

## Acceptance Coverage

| Acceptance criterion | Evidence |
| --- | --- |
| Role-run validation fails closed when observed changed-file evidence is missing for future manifests. | `validateObservedChangedFiles` requires `observed_changed_files` for `contract_version` 2+. `node --test test/role-run-manifests.test.mjs` test "rejects future manifests without observed changed-file evidence" passes. |
| Role-run validation rejects observed changed files absent from `allowed_target_files`. | Each observed file is checked against `allowed_target_files` first. Test "rejects observed changed files missing from allowed targets" passes. |
| Role-run validation rejects observed changed files outside the role contract write surfaces or matching forbidden patterns. | Observed files are checked against `allowed_write_surface_families` and `forbidden_file_patterns` via the shared `isTargetFileAllowed`. The observed check runs before the declared-target check so observed diagnostics surface first. Test "rejects observed changed files outside contract surfaces" passes. |
| Historical role-run manifest compatibility for `contract_version` 1 is preserved. | The observed check returns early below `contract_version` 2. Existing `contract_version` 1 acceptance test still passes, and `npm run bandit -- validate` keeps BANDIT-058/059/060 manifests valid. |
| `implementation_writer` must model the BANDIT-060 artifact-input policy/support surfaces. | `validateImplementationWriterSurfaces` requires the four surfaces when `.bandit/policy/artifact-inputs.json` exists. Test "rejects implementation writer missing artifact-input support surfaces" passes; the real policy declares all four. |
| Stage 3 refusal of tests, RED evidence, and acceptance mappings is preserved. | The pre-existing test-surface refusal in `validateImplementationWriterSurfaces` is unchanged; `role-contracts.json` adds no test/RED/acceptance surfaces. |
| Templates expose the new write-surface evidence requirement. | `docs/templates/role-run-manifest.md` adds `contract_version`, `observed_changed_files`, and field guidance. |

## Verification Commands And Results

- `node --test test/role-run-manifests.test.mjs` — pass (9/9).
- `node --test test/role-contracts.test.mjs` — pass (5/5).
- `npm run typecheck` — pass.
- `npm run bandit -- role-contracts validate --json` — pass.
- `npm run bandit -- role-runs validate BANDIT-061 --json` — pass.
- `npm run bandit -- validate` — pass (`Bandit state is valid.`).
- `npm test` — pass (501/501).
- `git diff --check` — clean (exit 0).

## Clean-Code Self-Check

- **Spec alignment**: Implements only the RED-exercised behavior; no product
  contract redefinition.
- **Small surface area**: Two source files, one policy file, one template.
- **Simple design**: New validation mirrors the existing target-file check and
  reuses `isTargetFileAllowed`; a small `stringArray` helper removes repetition.
- **Explicit state**: Observed changed-file evidence and the artifact-input
  surface requirement are explicit named checks with clear messages.
- **No hidden authority**: Role-run manifests and role contracts remain
  append-only/derived; no canonical-state authority added.
- **Failure clarity**: Each refusal fails closed with a specific message naming
  the offending file or contract version.
- **No role erosion**: Writer did not touch tests, RED evidence, or acceptance
  mappings.

## Test Ownership Boundary Evidence

Codex PM/Test Writer authored the Stage 2 RED tests
(`test/role-run-manifests.test.mjs`, `test/role-contracts.test.mjs`),
`docs/work/BANDIT-061/red-evidence.md`, and
`docs/artifact-inputs/BANDIT-061-red-evidence.json`. This Stage 3 Writer made no
change to any of them.

## Bootstrap Model-Family Separation Evidence

Because Codex authored the Stage 2 RED tests, Stage 3 implementation was
dispatched to Claude through the bootstrap Process Adapter path. The Stage 3
Writer identity is `claude-implementation-writer-stage3`, recorded in
`docs/role-runs/BANDIT-061/stage3-implementation.json`.

## Authority Boundary Statement

Role contracts and role-run manifests remain append-only evidence and derived
non-canonical projections. They do not replace coordination logs, review
evidence, landing evidence, UAT, retrospective evidence, roadmap/current-context
state, or bootstrap-gap ledger authority. The artifact-input taxonomy in
`.bandit/policy/artifact-inputs.json` remains policy evidence, not workflow-state
authority.

## Out-Of-Scope Statement

Trust Verifier cutover remains out of scope. No old-gate replacement, live
evidence capture, reviewer execution, model calls, harness queues,
auth/provider routing, agent lifecycle, role/execution input packets,
Pi/Aperture agent-scope work, state-index persistence, server/API mode,
scheduler/worktree/claim/work-surface lifecycle, PR/CI workflow, automatic
merge/push/deploy, product UAT approval, dependency/lockfile change, installed
global skill edit, external service integration, or unrelated Phase 8 cockpit
work was introduced.

## Bootstrap Gaps / Follow-Up Concerns

None. The chore is self-contained and dogfoods the new `contract_version` 2
observed changed-file requirement via its own Stage 3 manifest.
