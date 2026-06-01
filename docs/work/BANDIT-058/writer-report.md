# BANDIT-058 Writer Report

## Writer Identity

- Role: Implementation Writer (CodeRabbit source repair)
- Model family: claude (claude-sonnet-4-6)
- Path: Bootstrap Process Adapter
- Dispatch: `docs/work/BANDIT-058/dispatch.md` and `docs/work/BANDIT-058/coderabbit-review.md`

## Stage 3 Status

pass (CodeRabbit source repair complete)

## Production Files Changed

| File | Action | Purpose |
| --- | --- | --- |
| `src/state/role-run-manifests.ts` | edited | Three CodeRabbit repairs: `validateInputPacketRef` path containment; `validateManifestAuthorityBoundary` all prohibited flags; `validateBaseRevisionAndSourceArtifacts` source_artifacts path containment |
| `src/state/role-contracts.ts` | edited | One CodeRabbit repair: `validateRole` + `isValidRequiredField` for empty/whitespace/empty-array/blank-entry/empty-object required field rejection |
| `docs/work/BANDIT-058/implementation-evidence.md` | refreshed | Updated to describe CodeRabbit source repair |
| `docs/work/BANDIT-058/writer-report.md` | refreshed | This file |
| `docs/specs/BANDIT-058-implementation-evidence.json` | refreshed | Updated to describe CodeRabbit source repair |

## Repair Description (CodeRabbit Source Repair)

CodeRabbit Stage 4 pre-PR review at `docs/work/BANDIT-058/coderabbit-review.md` recorded four source-level findings that blocked Local Qwen, aggregate Stage 4 review, and landing.

### Finding 1 — `validateInputPacketRef` path containment (`src/state/role-run-manifests.ts`)

Original: `path.join(repoRoot, ref)` + `fileExists`. Allowed absolute paths and path traversal because `path.join` does not reject them and `fileExists` accepts anything including directories.

Fix: resolve ref against `normalizedRoot`; require `absRef.startsWith(normalizedRoot + path.sep)` + `isRegularFile`. Rejects absolute paths, traversal, and directory refs in a single containment + file-type check.

### Finding 2 — `validateManifestAuthorityBoundary` incomplete flag set (`src/state/role-run-manifests.ts`)

Original: only checked `can_satisfy_coordination_history`. Error message named additional forbidden roles but code did not enforce them.

Fix: extracted `prohibited` boolean that ORs `can_satisfy_coordination_history`, `can_satisfy_review_or_landing_evidence`, `can_satisfy_uat`, and `can_satisfy_retrospective`. Throws on any true flag.

### Finding 3 — `validateBaseRevisionAndSourceArtifacts` source_artifacts path containment (`src/state/role-run-manifests.ts`)

Original: `absPath === normalizedRoot` guard. Did not catch absolute paths to files outside the repository (e.g., `path.resolve(normalizedRoot, '/etc/hosts')` is not equal to `normalizedRoot` but passes `isRegularFile`).

Fix: replaced equality guard with `!absPath.startsWith(normalizedRoot + path.sep)`. Catches repo-root, parent-traversal, and absolute-escape cases.

### Finding 4 — `validateRole` empty-string/array/object field validation (`src/state/role-contracts.ts`)

Original: `role[field] == null`. Accepted empty strings, whitespace-only strings, empty arrays, and arrays with blank or non-string entries.

Fix: replaced with `!isValidRequiredField(role[field])`. Added `isValidRequiredField` helper:
- strings: rejects empty and whitespace-only
- arrays: rejects empty; rejects any element that is not a non-empty string
- objects: rejects empty objects
- null/undefined: rejected

## Verification Commands and Results

```
node --test test/role-contracts.test.mjs          → tests 4, pass 4, fail 0  ✓
node --test test/role-run-manifests.test.mjs      → tests 6, pass 6, fail 0  ✓
node --test test/role-entrypoints-formation.test.mjs → tests 7, pass 7, fail 0  ✓
npm run typecheck                                  → pass (no errors)  ✓
npm run bandit -- role-contracts validate --json   → status: pass, 7 roles  ✓
npm run bandit -- role-runs validate BANDIT-058 --json → status: pass, 1 manifest  ✓
npm run bandit -- validate                        → Bandit state is valid.  ✓
npm run bandit -- gaps list                       → BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION active  ✓
node ./bin/bandit.mjs cockpit status --json        → pass  ✓
node ./bin/bandit.mjs session-context current --json → pass  ✓
git diff --check                                   → pass  ✓
```

Temporary probes (all removed before finishing):

| Probe | Expected | Result |
| --- | --- | --- |
| `required_input_packet_ref: "../outside/file.txt"` | exit 1 | exit 1 ✓ |
| `required_input_packet_ref: "/etc/hosts"` | exit 1 | exit 1 ✓ |
| `required_input_packet_ref: "docs/work/BANDIT-058"` (dir) | exit 1 | exit 1 ✓ |
| `source_artifacts: ["...", "../outside/file.txt"]` | exit 1 | exit 1 ✓ |
| `source_artifacts: ["/etc/hosts"]` | exit 1 | exit 1 ✓ |
| `source_artifacts: ["."]` (resolves to repo root) | exit 1 | exit 1 ✓ |
| `source_artifacts: ["docs/work/BANDIT-058"]` (dir) | exit 1 | exit 1 ✓ |
| `authority_boundary.can_satisfy_review_or_landing_evidence: true` | exit 1 | exit 1 ✓ |
| `authority_boundary.can_satisfy_uat: true` | exit 1 | exit 1 ✓ |
| `authority_boundary.can_satisfy_retrospective: true` | exit 1 | exit 1 ✓ |
| role contract `version: ""` | exit 1 | exit 1 ✓ |
| role contract `owner: "   "` | exit 1 | exit 1 ✓ |
| role contract `allowed_stages: []` | exit 1 | exit 1 ✓ |
| role contract `validation_commands: [""]` | exit 1 | exit 1 ✓ |
| role contract `authority_boundary: {}` | exit 1 | exit 1 ✓ |

## Test Ownership Boundary

The Stage 3 Writer made **zero changes** to test files, test helpers, fixtures, RED evidence artifacts, RED evidence specs, or acceptance mappings for BANDIT-058. Test Ownership Boundary was preserved throughout all repairs.

## Bootstrap Model-Family Separation

Stage 2 RED evidence was authored by Codex PM as Test Writer (model family: codex). All Stage 3 repairs including this CodeRabbit source repair were authored by Claude Sonnet 4.6 through the bootstrap Process Adapter path (model family: claude). Model-family separation was maintained.

## Authored Through Process Adapter Path

Stage 3 (including all repairs) was authored by Claude through the bootstrap Process Adapter path as required by Bootstrap Model-Family Separation.

## Stop Conditions

No stop conditions triggered. No test-contract conflict arose. The `required_summary_path` remains a required non-empty output evidence path; the accepted Stage 3 manifest carries the correct path.

## Bootstrap Gaps and Follow-Up Concerns

- **Template-init integration**: `docs/templates/role-contract.md` and `docs/templates/role-run-manifest.md` are created but not yet added to `TEMPLATE_CONTRACTS` in `src/state/templates.ts` and not written by `bandit init`. Follow-up needed once template shape is stable.
- No new bootstrap gaps introduced by this repair.
