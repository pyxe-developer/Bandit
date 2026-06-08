# BANDIT-076 Stage 3 Implementation Writer Report

contract_version: 1
work_item: BANDIT-076
stage: stage3_implementation
implementation_writer: claude-implementation-writer-stage3
model_family: claude
base_revision: cf5b0d9d8712624b59129694fbfd7f95241827a1

## Summary

Implemented the smallest source/policy change required to satisfy the approved
Stage 2 RED evidence and `test/evidence-bundle-attestation.test.mjs`. Added the
public read-only command `bandit evidence-bundle attest <WORK_ITEM> [--json]`,
which loads declared repo-local bundle inputs, validates policy authority and
membership, fails closed on missing/stale/unsupported/mismatched evidence and
conditional-UAT gaps, and otherwise emits a deterministic SHA-256 bundle
attestation. No Test Writer-owned surface was touched.

## Files Changed

- `.bandit/policy/evidence-bundle-attestation.json` (new) — canonical real-repo
  bundle policy: read-only authority flags, SHA-256 stable-JSON hashing
  semantics, required-vs-conditional evidence types, command/policy versions,
  required freshness states, and fail-closed reasons.
- `src/state/evidence-bundle-attestation.ts` (new) — read-only attestation
  logic: policy loading, authority and membership checks, evidence loading,
  freshness/UAT/landing-consistency validation, deterministic bundle hashing,
  and report construction. Separated into small single-purpose functions per
  `CLEAN_CODE.md`.
- `src/commands/evidence-bundle.ts` (new) — `attest` subcommand wiring with
  `--json` rendering through the shared canonical-JSON serializer.
- `src/cli.ts` — registered the `evidence-bundle` command import, dispatch
  block, and usage strings.

## Design Notes (CLEAN_CODE.md)

- **Spec alignment**: Bundle membership matches the brief's
  Source-Of-Truth boundary: source subject, RED, test, implementation, review,
  risk classification, supply-chain gate, conditional UAT, landing verdict,
  landing action, policy versions, command versions, and freshness metadata.
- **No hidden authority**: The policy declares `read_only: true` and rejects
  `can_replace_landing_authority`, `can_replace_trust_verifier_cutover`,
  `can_mutate_review_routing`, and `can_mutate_gap_status`. The command only
  reads; it never mutates gate verdicts, reviewer/model routing, landing
  authority, UAT authority, gap status, or coordination history.
- **Failure clarity**: Missing required inputs, stale/changed-after-review
  evidence, unsupported or hash-mismatched landing verdicts, missing
  product-facing UAT, authority expansion, and omitted required evidence types
  all fail closed with specific diagnostics; no hash can hide them. All problems
  are collected and reported together.
- **Determinism**: The bundle hash and `--json` output are produced through the
  existing `canonicalJson` (sorted keys, preserved array order), so equivalent
  input sets yield byte-identical output and a stable lowercase 64-char SHA-256
  hash across repeat runs and filesystem traversal order.

## Validation Command Results

- `node --test test/evidence-bundle-attestation.test.mjs` — exit 0, 6 pass / 0 fail.
- `npm run typecheck` — exit 0.
- `npm run bandit -- validate` — exit 0, "Bandit state is valid."
- `npm run bandit -- evidence-bundle attest BANDIT-076 --json` — fails closed
  (exit 1) with `missing required bundle input: ...` diagnostics. This is the
  expected and correct behavior: BANDIT-076 is mid-flight at Stage 3, so its
  review, landing, risk, and supply-chain bundle artifacts do not exist yet, and
  the real `red-evidence.md` is prose rather than the structured bundle format
  the attestation parses. The command refuses to attest an incomplete bundle
  rather than hiding the gaps behind a hash.
- `node ./bin/bandit.mjs coordination validate BANDIT-076` — exit 0,
  "Coordination log is valid: BANDIT-076".
- `npm test` — exit 0, 567 pass / 0 fail.
- `git diff --check` — exit 0.

## No-Test-Edit Evidence

The Stage 3 Writer did not create, edit, delete, regenerate, format, or
mechanically adjust any Test Writer-owned surface:
`test/evidence-bundle-attestation.test.mjs`, `test/helpers/**`,
`docs/work/BANDIT-076/red-evidence.md`,
`docs/artifact-inputs/BANDIT-076-red-evidence.json`, fixtures,
expected-output mappings, source-artifact mappings, or evidence-bundle
acceptance mappings. The focused suite passed against unmodified tests.

## Deviation Notes

- `src/commands/init.ts` and `src/commands/validate.ts` were authorized by the
  dispatch but intentionally left untouched. `validateBandit` wires each policy
  validator explicitly (no auto-discovery), and the evidence bundle is gated by
  its own dedicated `evidence-bundle attest` command rather than the live
  `bandit validate` state gate. Leaving init/validate untouched keeps the diff
  to the smallest surface area and preserves the read-only/derived separation,
  mirroring the BANDIT-075 precedent. The committed
  `.bandit/policy/evidence-bundle-attestation.json` provides the canonical
  real-repo policy without needing `init` to seed it.

## Boundary

Read-only derived evidence only. This change does not approve Trust Verifier
cutover, replace or wrap old gates, alter landing/UAT/reviewer/model routing
authority, mutate gap status or coordination history, or approve merge, push,
deploy, paid tooling, or external services. Bootstrap Model-Family Separation
preserved: Codex authored Stage 2 RED evidence; the Claude-family
implementation writer performed Stage 3; verification escalation returns to
Codex PM.
