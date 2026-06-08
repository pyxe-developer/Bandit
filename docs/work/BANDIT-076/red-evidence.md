# BANDIT-076 RED Evidence

## Status

`pass` for stage2_red_evidence.

```json
{
  "artifact_type": "red_evidence",
  "work_item": "BANDIT-076",
  "freshness_state": "current",
  "source_artifacts": [
    "test/evidence-bundle-attestation.test.mjs",
    "docs/artifact-inputs/BANDIT-076-red-evidence.json"
  ]
}
```

Codex PM acted as Test Writer for Stage 2. The focused RED suite defines the
public `bandit evidence-bundle attest <WORK_ITEM> --json` surface, deterministic
bundle membership and hashing output, command and policy version capture,
freshness metadata, fail-closed missing/stale/changed/unsupported/mismatched
input diagnostics, conditional UAT handling, and read-only no-gate-authority
boundaries.

The current repo fails because the `evidence-bundle` command does not exist yet.

## Test Command

```sh
node --test test/evidence-bundle-attestation.test.mjs
```

## Observed Output

```text
exit_code=1
Initial RED: 6 failing tests, 0 passing tests
Primary failure symptom: Unknown command: evidence-bundle
The missing command proves the approved evidence bundle policy, bundle
membership, deterministic attestation output, freshness diagnostics,
landing-verdict mismatch refusal, conditional UAT handling, and read-only
authority boundaries are not implemented yet.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The chore brief links to `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` as the active bootstrap gap once it becomes the next queued work item. | The Stage 2 fixtures preserve `.bandit/bootstrap-gaps.json` as read-only sentinel state and the test asserts the attestation command does not mutate gap status. |
| A policy artifact defines evidence bundle membership, optional versus required evidence, hashing semantics, command/policy version capture, and freshness rules. | `test/evidence-bundle-attestation.test.mjs` writes `.bandit/policy/evidence-bundle-attestation.json` with required/conditional evidence types, SHA-256 stable JSON hashing semantics, command versions, policy version, freshness states, and fail-closed reasons. |
| Covered landing/trusted claims can produce a deterministic bundle attestation with stable hash output. | The pass-path test runs `bandit evidence-bundle attest BANDIT-999 --json` twice, expects byte-identical JSON output, a 64-character lowercase SHA-256 hash, sorted declared bundle membership, policy version, command version, and current freshness metadata. |
| Validation fails closed when a required bundle input is missing, stale, changed after review, unsupported, or mismatched with the landing verdict. | Negative tests omit `review-evidence.md`, mark review evidence stale with `source_changed_after_review`, make landing verdict hash/verdict mismatches, and require policy-authority violations plus missing required evidence type diagnostics to exit non-zero. |
| Bundle attestation remains read-only and does not replace existing gate authority or approve Trust Verifier cutover. | The pass-path test snapshots bootstrap-gap and coordination-log sentinels before and after attestation and expects no mutation; policy tests reject `read_only: false`, `can_replace_landing_authority: true`, and `can_replace_trust_verifier_cutover: true`. |
| `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is resolved only after landing action and retrospective closeout evidence exist. | RED evidence does not resolve the gap. The Stage 3 implementation must keep bundle attestation read-only and leave closeout/gap disposition to Stage 6 after landing action and retrospective evidence. |
| UAT evidence is included when applicable and reported as not applicable for non-product chores. | The pass-path chore fixture expects `uat.applicability: not_applicable`; a product-facing slice fixture with missing UAT must fail closed with `missing required bundle input: UAT evidence`. |
| The implementation preserves CLI authority, repo-native canonical artifacts, read-only derived evidence, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation. | Tests exercise only the public Bandit CLI in temporary repos, include risk and supply-chain evidence in bundle membership, require no live-state mutation, and this RED evidence routes Stage 3 to Claude with zero test-surface authority. |

## Stage 3 Writer Boundary

Dispatch Stage 3 implementation to a Claude-family implementation Writer.

Allowed implementation surfaces are source/chore delivery only:

- `.bandit/policy/evidence-bundle-attestation.json`
- `src/state/evidence-bundle-attestation.ts`
- `src/commands/evidence-bundle.ts`
- `src/cli.ts`
- validation wiring or docs required by the implementation
- Stage 3 implementation evidence and Writer report

Forbidden Stage 3 Writer surfaces:

- `test/evidence-bundle-attestation.test.mjs`
- `docs/work/BANDIT-076/red-evidence.md`
- `docs/artifact-inputs/BANDIT-076-red-evidence.json`
- test helpers, fixtures, expected-output mappings, source-artifact mappings,
  evidence-bundle acceptance mappings, and any other Test Writer-owned surface

## Next Action

Dispatch Stage 3 implementation for `BANDIT-076` to Claude through the
bootstrap Process Adapter path. Implement evidence bundle policy loading,
membership validation, deterministic read-only attestation output,
freshness/mismatch diagnostics, command routing, and aggregate validation
without editing Test Writer-owned surfaces.
