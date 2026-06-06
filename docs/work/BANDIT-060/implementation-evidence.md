# BANDIT-060 Implementation Evidence

## Status

`pass` for Stage 3: Implementation.

## Stage 3 Authorship

Stage 3 implementation was authored by Claude (claude-sonnet-4-6) through the bootstrap Process Adapter path. Codex authored the Stage 2 RED tests, requiring Stage 3 to be assigned to a different model family. No Codex (GPT-family) model contributed to Stage 3 production code.

## Production Files Changed

- `src/state/artifact-inputs.ts` — artifact-input taxonomy state validator (new)
- `src/commands/artifact-inputs.ts` — `bandit artifact-inputs validate [--json]` command (new)
- `src/cli.ts` — registered `artifact-inputs` command (updated)
- `src/commands/artifact-create.ts` — added path routing enforcement for `docs/artifact-inputs/` (updated)
- `src/commands/validate.ts` — added `validateArtifactInputsPolicy` to `validateBandit` (updated)
- `.bandit/policy/artifact-inputs.json` — repo-native taxonomy policy artifact (new)
- `docs/artifact-inputs/.gitkeep`, `docs/reviewer-captures/.gitkeep`, `docs/trust-snapshot-fixtures/.gitkeep` — new preferred directories (new)

## Acceptance Coverage

| Acceptance Criterion | Status | Evidence |
| --- | --- | --- |
| Focused RED evidence proves Bandit currently cannot distinguish input classes under `docs/specs/` | pass | Tests 1–5 all failed RED; all pass GREEN |
| Repo-native taxonomy artifact names supported JSON input classes, preferred directories, owners, stages, consumers, refusal behavior | pass | `.bandit/policy/artifact-inputs.json` defines four classes with all required fields |
| `bandit validate` or narrow CLI path fails closed for ambiguous future inputs, unsafe paths, unsupported directories, class/name mismatches | pass | `artifact-inputs validate` refuses ambiguous paths (test 2), unsafe paths, and class mismatches (test 5) |
| `bandit artifact create` accepts new artifact-renderer input location while preserving path checks, no-overwrite, lifecycle events, rollback | pass | Test 3 confirms `docs/specs/` refuses and `docs/artifact-inputs/` accepts with full artifact rendering |
| Historical `docs/specs/` files remain readable as legacy inputs | pass | Test 4 confirms legacy inputs return `legacy_readable_paths` and pass validation |
| Reviewer/provider capture JSON has explicit future path | pass | `reviewer_capture` class with preferred directory `docs/reviewer-captures/` |
| Trust snapshot fixtures have explicit future path | pass | `trust_snapshot_fixture` class with preferred directory `docs/trust-snapshot-fixtures/` |
| Role contracts, role-run manifests, and model-family separation remain consistent | pass | Role-run manifest validates; Stage 2 and Stage 3 are different model families |
| No generated Markdown evidence loses authority | pass | Taxonomy classifies only JSON command inputs; canonical Markdown evidence unaffected |
| No Trust Verifier cutover or parity replacement introduced | pass | No trust verifier, gate replacement, live execution, or cockpit work added |
| Permanent Test Ownership Boundary preserved | pass | Zero test-surface edits; Stage 2 tests remain Codex PM/Test Writer-owned |

## Verification Commands and Results

```sh
node --test test/artifact-inputs.test.mjs
# tests 5 / pass 5 / fail 0

npm run typecheck
# clean, no type errors

npm run bandit -- artifact-inputs validate --json
# exit 0, status: "pass"

npm run bandit -- validate
# Bandit state is valid.

npm run bandit -- role-runs validate BANDIT-060 --json
# status: "pass", manifest listed

git diff --check
# clean
```

## Clean-Code Self-Check

1. **Spec alignment**: Implements exactly the behavior exercised by RED tests and the accepted brief. No redefinition of product contract.
2. **Small surface area**: Five production files touched; three new directories; one new policy file. All changes are narrowly scoped to the artifact-input taxonomy.
3. **Simple design**: `validateObservedInput` handles one input at a time; error collection is a flat array; path checks are pure functions with no hidden state.
4. **Explicit state**: Taxonomy is in `.bandit/policy/artifact-inputs.json`; validation report is explicit JSON with deterministic field order.
5. **No hidden authority**: Policy file is read-only input; JSON taxonomy does not become canonical evidence or replace Markdown authority.
6. **Testable behavior**: All five acceptance cases are covered by the RED tests.
7. **Readable flow**: Three distinct validation paths (`isUnsafeInputPath`, `isAmbiguousDocSpecsPath`, `pathMatchesPreferredDirectory`) are clearly named and sequential.
8. **Locality**: Artifact-input state logic is in `src/state/artifact-inputs.ts`; command dispatch in `src/commands/artifact-inputs.ts`.
9. **Failure clarity**: Errors are collected and thrown as a single newline-joined message; `artifact create` fails closed with a clear diagnostic.
10. **No role erosion**: Stage 3 Writer did not touch tests, test helpers, fixtures, RED evidence, or acceptance mappings.
11. **Improvement capture**: Bootstrap gap for role contract write surfaces recorded in writer report.

## Test Ownership Boundary Evidence

Stage 3 made zero changes to `test/**`, `docs/specs/BANDIT-060-red-evidence.json`, `docs/work/BANDIT-060/red-evidence.md`, any test helper, fixture, or acceptance mapping. The Stage 2 RED test suite is unmodified and remains Codex PM/Test Writer-owned.

## Bootstrap Model-Family Separation Evidence

- Stage 2 RED tests authored by: Codex PM (GPT-family)
- Stage 3 implementation authored by: Claude (claude-sonnet-4-6, Anthropic Claude family)
- These are different model families. Bootstrap model-family separation is satisfied.

## JSON Taxonomy Boundary Statement

The artifact-input taxonomy policy (`.bandit/policy/artifact-inputs.json`) and `bandit artifact-inputs validate --json` output are JSON command inputs and validation reports. They do not replace, supersede, or reduce the authority of:
- Canonical Markdown evidence under `docs/work/<ID>/`
- Append-only coordination history
- Roadmap and current-context authority
- Review evidence, landing evidence, retrospective evidence
- Trust Verifier reports
- Bootstrap-gap ledger state

The taxonomy classifies JSON command inputs only. Canonical workflow authority remains with Markdown evidence and append-only lifecycle artifacts as before.

## Trust Verifier Cutover Boundary

Trust Verifier cutover remains out of scope. No old gates were replaced. No live evidence capture, parity replacement, or trust-goal cutover decision was implemented or implied by this work.

## Bootstrap Gaps and Follow-Up Concerns

- **Role contract write surfaces**: The `implementation_writer` role contract does not cover `.bandit/policy/artifact-inputs.json` (only `.bandit/policy/role-contracts.json` is listed). A follow-up gap chore should extend the role contract to cover the artifact-inputs policy path.
