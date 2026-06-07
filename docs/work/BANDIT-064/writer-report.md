# Stage 3 Implementation Writer Report - BANDIT-064

contract_version: 1
work_item: BANDIT-064
stage: stage3_implementation
owner: implementation_writer
model_family: claude
verdict: pass
recorded_at: 2026-06-07

## Summary

Implemented the smallest GREEN path for the Trust Verifier Cutover Gate triage
chore: a repo-native cutover-gate policy artifact, a narrow read-only validator,
a read-only `bandit trust cutover-gates validate [--json]` command, and inclusion
of the validator in `npm run bandit -- validate`. The implementation records the
current compatibility period with no approved Trust Goal cutover and preserves
old gate authority. No Trust Verifier cutover is approved, no Trust Goal is
selected, and no old gate path is replaced or wrapped.

## Files Changed

- `.bandit/policy/trust-verifier-cutover-gates.json` (new) - repo-native policy
  recording `version: 1`, `compatibility_period: true`,
  `old_gates_authoritative: true`, `approved_trust_goals: []`, `cutover_gates: []`.
- `src/state/trust-verifier-cutover-gates.ts` (new) - narrow fail-closed validator
  and default-policy writer. Validates required cutover-gate contract fields
  (`old_authoritative_gate`, `proposed_trust_verifier`, `stricter_failure_behavior`,
  `report_format`, `rollback_or_fallback`, `evidence_freshness_boundary`,
  `reviewer_finding_routing_boundary`, `parity_evidence`, `operator_approval`) and
  rejects implicit canonical/wrapper/replace cutover claims that lack
  operator-approved cutover evidence.
- `src/commands/trust.ts` - added the read-only `trust cutover-gates validate
  [--json]` subcommand path; preserved existing `trust verify` behavior, refused
  flags, and usage messaging.
- `src/state/paths.ts` - added `trustVerifierCutoverGatesPolicy` path.
- `src/commands/validate.ts` - included `validateTrustVerifierCutoverGates` in
  `npm run bandit -- validate`.
- `src/commands/init.ts` - writes the default cutover-gate policy for freshly
  initialized repos (idempotent; only when absent), matching how other
  repo-native policies are seeded.

## Commands Run

- `node --test test/trust-verifier-cutover-gate.test.mjs` - pass (3/3).
- `node --test test/trust-verify.test.mjs` - pass (8/8).
- `npm run typecheck` - pass (`tsc --noEmit`, no errors).
- `node --test test/validate.test.mjs` - pass (22/22); confirms init + validate
  remain green with the new policy/validator wired in.
- `npm run bandit -- validate` - "Bandit state is valid." on the real repo.
- `node ./bin/bandit.mjs trust cutover-gates validate --json` - returns a passing
  no-cutover-approved report on the real repo.

## Boundary Compliance

- Did NOT edit `test/trust-verifier-cutover-gate.test.mjs`,
  `docs/work/BANDIT-064/red-evidence.md`,
  `docs/artifact-inputs/BANDIT-064-red-evidence.json`, test helpers, fixtures,
  acceptance mappings, or formation/review/landing/retrospective evidence.
- Did NOT approve Trust Verifier cutover, select a Trust Goal for cutover, or
  replace/wrap old gates. The committed policy records zero approved cutover and
  keeps `old_gates_authoritative: true`.
- `bandit trust verify` behavior is unchanged; the new command is read-only,
  runs no tests or reviewers, and mutates no queues, routing, landing, or
  coordination state.
- No dependency or lockfile changes; no unrelated product/cockpit work; no
  commit made.

## Notes For PM Acceptance / Reviewers

- `init.ts` and `paths.ts` were edited only to seed and locate the new
  repo-native policy so that `npm run bandit -- validate` (which the brief
  requires the validator to be part of) fails closed when the policy is absent
  while keeping fresh `init` repos valid. This mirrors the existing
  supply-chain-gate / risk-classification seeding pattern.
- The validator is intentionally narrow and read-only; it inspects the policy
  artifact only and emits clear per-gate fail-closed diagnostics.
