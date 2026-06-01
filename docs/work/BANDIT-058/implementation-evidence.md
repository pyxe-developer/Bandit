# BANDIT-058 Implementation Evidence

## Status

Stage 3: pass (CodeRabbit source repair accepted)

## Production Files Changed

- `src/state/role-run-manifests.ts` — edited; three CodeRabbit source repairs:
  1. `validateInputPacketRef`: replaced `path.join + fileExists` with repo-root containment check (`absRef.startsWith(normalizedRoot + path.sep)`) plus `isRegularFile`; rejects absolute paths, path traversal, and directory refs for `required_input_packet_ref`.
  2. `validateManifestAuthorityBoundary`: added checks for `can_satisfy_review_or_landing_evidence`, `can_satisfy_uat`, and `can_satisfy_retrospective` alongside the existing `can_satisfy_coordination_history` check; rejects any prohibited authority flag.
  3. `validateBaseRevisionAndSourceArtifacts`: replaced `absPath === normalizedRoot` guard with `!absPath.startsWith(normalizedRoot + path.sep)`; rejects absolute paths, path traversal outside the repo, and the repo root itself for `source_artifacts`.

- `src/state/role-contracts.ts` — edited; one CodeRabbit source repair:
  4. `validateRole`: replaced `role[field] == null` with `!isValidRequiredField(role[field])`; added `isValidRequiredField` helper that rejects empty strings, whitespace-only strings, empty arrays, arrays with blank or non-string entries, and empty objects for all required role contract fields.

All other production files from prior Stage 3 repairs remain unchanged.

## Repair Description (CodeRabbit Source Repair)

CodeRabbit Stage 4 pre-PR review at `docs/work/BANDIT-058/coderabbit-review.md` recorded four source-level findings:

### Finding 1 — `validateInputPacketRef` path containment (major)

The original implementation used `path.join(repoRoot, ref)` with `fileExists`, which accepted absolute paths and path traversal because `path.join` does not reject them and `fileExists` only checks existence. Fix: resolve the ref against `normalizedRoot` and require `absRef.startsWith(normalizedRoot + path.sep)` before calling `isRegularFile`. This rejects absolute paths, traversal that escapes the repo, and directory refs in a single containment check.

### Finding 2 — `validateManifestAuthorityBoundary` incomplete flag check (minor)

The error message forbade "coordination history, review evidence, landing evidence, UAT, or retrospective evidence" but the implementation only checked `can_satisfy_coordination_history`. The accepted manifest already carried `can_satisfy_review_or_landing_evidence: false`. Fix: extract a `prohibited` boolean that ORs all four authority flags; throw if any is true.

### Finding 3 — `validateBaseRevisionAndSourceArtifacts` source_artifacts path containment (major)

The original `absPath === normalizedRoot` guard did not catch absolute paths to files outside the repository (e.g., `/etc/hosts`) because `path.resolve(normalizedRoot, '/abs/path')` returns `/abs/path`, which is not equal to `normalizedRoot` but still passes `isRegularFile`. Fix: replace the equality guard with `!absPath.startsWith(normalizedRoot + path.sep)`, which catches repo-root, parent-traversal, and absolute-escape cases in one check.

### Finding 4 — `validateRole` empty-string/array/object field validation (major)

The original `role[field] == null` check accepted empty strings (`""`), whitespace-only strings (`"  "`), empty arrays (`[]`), and arrays with blank or non-string entries as if they were valid required fields. Fix: replace with `isValidRequiredField` which applies type-appropriate strictness: non-empty/non-whitespace strings, non-empty arrays with all-non-empty-string entries, and non-empty objects.

## Acceptance-Criteria Coverage

| Criterion | Status | Evidence |
| --- | --- | --- |
| Focused RED evidence proves Bandit currently lacks enforced Role Contract policy validation | pass | 4/4 role-contracts tests pass |
| Role Contract validation fails closed when a contract omits required fields | pass | `validateRole` checks all 13 required fields |
| Role Contract validation rejects empty/whitespace required fields and empty/blank arrays | pass (CodeRabbit repair) | `isValidRequiredField` enforces type-appropriate strictness |
| Role Contract validation preserves the Permanent Test Ownership Boundary | pass | `validateImplementationWriterSurfaces` rejects test surfaces |
| Role contracts and manifests cannot replace canonical workflow state | pass | `validateAuthorityBoundary` rejects canonical state claims |
| Role Run Manifest validation fails closed when a manifest omits required fields | pass (repaired 1) | `validateRequiredManifestFields` + `validateBaseRevisionAndSourceArtifacts` |
| Role Run Manifest required arrays reject blank, whitespace-only, or non-string entries | pass (repaired 2) | `isNonEmptyStringArray` calls `every(isNonEmptyString)` |
| Source artifact entries cannot resolve to the repository root, escape the repo, or be directories | pass (CodeRabbit repair) | `!absPath.startsWith(normalizedRoot + path.sep)` + `isRegularFile` |
| `required_input_packet_ref` cannot use path traversal, absolute paths, or directory refs | pass (CodeRabbit repair) | `!absRef.startsWith(normalizedRoot + path.sep)` + `isRegularFile` |
| Role-run manifest authority boundary rejects all prohibited flags | pass (CodeRabbit repair) | All four flags checked: `can_satisfy_coordination_history`, `can_satisfy_review_or_landing_evidence`, `can_satisfy_uat`, `can_satisfy_retrospective` |
| Role Run Manifest validation rejects role/stage mismatches and stale contract versions | pass | `findRoleContract` and `validateRoleStageCompatibility` unchanged |
| Role Run Manifest validation rejects forbidden or out-of-surface target files | pass | `validateTargetFiles` unchanged |
| Implementation keeps role contracts and manifests as repo-native evidence | pass | `validateManifestAuthorityBoundary` enforced |
| Formation Gate availability and Test Ownership Boundary preserved | pass | `test/role-entrypoints-formation.test.mjs` 7/7 pass; no test files edited |

## Verification Commands and Results

```
node --test test/role-contracts.test.mjs          → tests 4, pass 4, fail 0
node --test test/role-run-manifests.test.mjs      → tests 6, pass 6, fail 0
node --test test/role-entrypoints-formation.test.mjs → tests 7, pass 7, fail 0
npm run typecheck                                  → pass (no errors)
npm run bandit -- role-contracts validate --json   → status: pass, 7 roles
npm run bandit -- role-runs validate BANDIT-058 --json → status: pass, 1 manifest
npm run bandit -- validate                        → Bandit state is valid.
npm run bandit -- gaps list                       → BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION active
node ./bin/bandit.mjs cockpit status --json        → pass
node ./bin/bandit.mjs session-context current --json → pass
git diff --check                                   → pass
```

Temporary probes run and removed before finishing:

- Probe: `required_input_packet_ref: "../outside/file.txt"` → exit 1, "requires existing required_input_packet_ref"
- Probe: `required_input_packet_ref: "/etc/hosts"` (absolute) → exit 1, "requires existing required_input_packet_ref"
- Probe: `required_input_packet_ref: "docs/work/BANDIT-058"` (directory) → exit 1, "requires existing required_input_packet_ref"
- Probe: `source_artifacts: ["docs/work/BANDIT-058/brief.md", "../outside/file.txt"]` → exit 1, "requires base_revision and existing source artifacts"
- Probe: `source_artifacts: ["/etc/hosts"]` (absolute) → exit 1, "requires base_revision and existing source artifacts"
- Probe: `source_artifacts: ["."]` (resolves to repo root) → exit 1, "requires base_revision and existing source artifacts"
- Probe: `source_artifacts: ["docs/work/BANDIT-058"]` (directory) → exit 1, "requires base_revision and existing source artifacts"
- Probe: `authority_boundary.can_satisfy_review_or_landing_evidence: true` → exit 1, "cannot satisfy coordination history, review evidence, landing evidence, UAT, or retrospective evidence"
- Probe: `authority_boundary.can_satisfy_uat: true` → exit 1, "cannot satisfy..."
- Probe: `authority_boundary.can_satisfy_retrospective: true` → exit 1, "cannot satisfy..."
- Probe: role contract `version: ""` (empty string) → exit 1, "requires role_id, version, ..."
- Probe: role contract `owner: "   "` (whitespace-only) → exit 1, "requires role_id, version, ..."
- Probe: role contract `allowed_stages: []` (empty array) → exit 1, "requires role_id, version, ..."
- Probe: role contract `validation_commands: [""]` (blank entry) → exit 1, "requires role_id, version, ..."
- Probe: role contract `authority_boundary: {}` (empty object) → exit 1, "requires role_id, version, ..."

All 15 probes failed closed as expected. All probes removed before finishing.

## Clean-Code Self-Check Against CLEAN_CODE.md

1. **Spec alignment**: Repair covers exactly the four CodeRabbit source-level findings. No scope creep.
2. **Small surface area**: Two files changed; total additions are ~15 lines across both files.
3. **Simple design**: Each fix uses the simplest expression that satisfies the containment or validation requirement. No new abstractions introduced beyond `isValidRequiredField`.
4. **Explicit state**: Validation throws on failure; success continues without side effects. No hidden state.
5. **No hidden authority**: Role contracts and manifests remain repo-native evidence only.
6. **Testable behavior**: All acceptance criteria covered by focused tests. Probes confirmed fix behavior beyond what tests exercise.
7. **Readable flow**: Validation order unchanged. `isValidRequiredField` is a small, self-contained predicate.
8. **Locality**: Changes stay in the two source files identified by CodeRabbit.
9. **Failure clarity**: Probes confirm descriptive error messages for all rejection cases.
10. **No role erosion**: No test files edited.
11. **Improvement capture**: No new smells introduced.

## Test Ownership Boundary Evidence

The Stage 3 Writer made **zero changes** to:
- `test/role-contracts.test.mjs`
- `test/role-run-manifests.test.mjs`
- `test/role-entrypoints-formation.test.mjs`
- Any other test file, test helper, fixture, RED evidence artifact, RED evidence spec, or acceptance mapping for BANDIT-058

Test Ownership Boundary is preserved.

## Bootstrap Model-Family Separation Evidence

- RED evidence (Stage 2) was authored by Codex PM as Test Writer (model family: codex).
- Stage 3 implementation, all prior repairs, and this CodeRabbit source repair were authored by Claude Sonnet 4.6 through the bootstrap Process Adapter path (model family: claude).
- These are different model families as required by Bootstrap Model-Family Separation.

## Non-Canonical Evidence Statement

Role contracts (`.bandit/policy/role-contracts.json`) and role-run manifests (`docs/role-runs/<ID>/*.json`) are **append-only repo-native evidence** only. They:

- Cannot replace or satisfy Canonical Coordination History
- Cannot replace or satisfy review evidence, landing evidence, UAT, or retrospective evidence
- Cannot become hidden workflow authority; cockpit state, trace output, and manifest projections remain derived and non-canonical

This is enforced at runtime by `validateAuthorityBoundary` (role contracts) and `validateManifestAuthorityBoundary` (manifests), both of which reject any policy or manifest that claims to satisfy canonical workflow state.

## Bootstrap Gaps and Follow-Up Concerns

- **Template integration with init**: `docs/templates/role-contract.md` and `docs/templates/role-run-manifest.md` are created but not yet added to `src/state/templates.ts` template contracts or written by `bandit init`. Follow-up needed once template shape is stable.
- No other bootstrap gaps identified or introduced by this repair.
