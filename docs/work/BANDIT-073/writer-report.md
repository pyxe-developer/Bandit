# BANDIT-073 Stage 3 Writer Report

work_item: BANDIT-073
stage: Stage 3 Implementation
implementation_writer: claude
base_revision: b7e9e377470cf641c193e952d5b24317131e7aa8

## Summary

Implemented the smallest repo-native Gate Determinism And Flake Gate validator
needed to satisfy the Codex/Test Writer RED evidence in
`docs/work/BANDIT-073/red-evidence.md` and make
`node --test test/gate-determinism.test.mjs` pass.

The gate is a recorded determinism attestation read from
`.bandit/policy/gate-determinism-flake-gate.json`. The validator never executes
covered commands; the policy carries each covered gate's repeat-run output
snapshots, so the check stays deterministic and read-only against canonical
workflow state. `bandit validate --json` now emits stable, canonical
machine-readable output with a `gate_determinism_flake_gate` report, and plain
`bandit validate` keeps its existing behavior while failing closed with explicit
diagnostics on determinism policy errors.

## Files Changed

- `src/state/gate-determinism.ts` (new) — policy reader, stable canonical JSON
  hashing (sorted object keys, array order preserved), repeat-run snapshot
  comparison, external/provider-dependent evidence metadata checks, direct-Qwen
  CLI refusal, nondeterminism-disposition cross-check, default-policy writer, and
  `canonicalJson` serializer.
- `src/commands/validate.ts` — runs `validateGateDeterminismFlakeGate` at the end
  of aggregate validation and returns the report alongside the existing message
  (new exported `BanditValidationResult` type).
- `src/cli.ts` — `validate --json` prints canonical JSON containing
  `gate_determinism_flake_gate`; plain `validate` is unchanged.
- `src/commands/init.ts` — seeds a default
  `.bandit/policy/gate-determinism-flake-gate.json` for `bandit init` when absent.
- `src/state/paths.ts` — adds the `gateDeterminismFlakeGatePolicy` path.
- `.bandit/policy/gate-determinism-flake-gate.json` (new) — default development-repo
  policy (determinism-critical gate list, allowed nondeterminism sources, and empty
  covered-gate / source / disposition / external-evidence sets that validate clean).
- `docs/work/BANDIT-073/writer-report.md` (this report).
- `docs/role-runs/BANDIT-073/stage3-implementation.json` (Stage 3 role-run manifest).

## Behavior Implemented (mapped to RED evidence)

- `validate --json` emits stable JSON: byte-identical across repeat runs, with a
  `gate_determinism_flake_gate` report (covered gates with stable output hashes,
  external evidence summary, nondeterminism dispositions).
- Covered-gate repeat-run snapshots are compared by stable canonical JSON hash.
  Array order is preserved (not silently sorted), so reordered array output is
  detected as `output hash drift` and fails closed naming the gate id.
- Undispositioned nondeterminism sources fail closed naming the source id and the
  missing disposition id.
- Provider-dependent external evidence must carry `captured_at`,
  `freshness.expires_at`, `availability_disposition`, and
  `replaces_deterministic_local_proof: false`; each missing field or an attempt to
  replace deterministic local proof fails closed with a specific diagnostic.
- Local Qwen evidence routed via `route: direct_qwen_cli` is refused, naming the
  authorized `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`
  route.

## Verification Commands Run

- `npm run typecheck` — pass.
- `node --test test/gate-determinism.test.mjs` — pass (4/4).
- `npm test` — pass (549/549).
- `npm run bandit -- validate` — pass (`Bandit state is valid.`).
- `npm run bandit -- validate --json` — pass; emits stable
  `gate_determinism_flake_gate` report (covered_gate_count 0 for the default repo
  policy).
- `npm run bandit -- gaps list` — pass; BANDIT-073 shown as active chore.
- `node ./bin/bandit.mjs cockpit status --json` — pass (read-only).
- `node ./bin/bandit.mjs session-context current --json` — pass (read-only).
- `git diff --check` — clean.
- `npm run bandit -- role-runs validate BANDIT-073 --json` — fails closed on the
  `.bandit/policy/gate-determinism-flake-gate.json` write surface; see deviation
  below.

## Test Writer-Owned Surfaces Confirmation

No Test Writer-owned or otherwise forbidden surface was created, edited, deleted,
formatted, or mechanically adjusted. Specifically untouched: `test/**`,
`docs/work/BANDIT-073/red-evidence.md`,
`docs/artifact-inputs/BANDIT-073-red-evidence.json`,
`docs/work/BANDIT-073/brief.md`, `docs/work/BANDIT-073/stage3-dispatch.md`,
formation/review/landing/UAT/retrospective/roadmap/status/bootstrap-gap artifacts,
`.bandit/bootstrap-gaps.json`, and `.bandit/events.jsonl`. The pre-existing
modifications shown by `git status` for `.bandit/events.jsonl` and
`docs/work/BANDIT-073/coordination-log.jsonl` are Stage 1/2 entries that predate
this implementation run; this run appended nothing to them.

## Required Deviation

The Stage 3 dispatch "Allowed Edit Surfaces" and the brief "Expected Files" both
explicitly list `.bandit/policy/gate-determinism-flake-gate.json`, so the default
policy artifact is committed and is also seeded by `bandit init`. That path is
broader than the `implementation_writer` role contract (v1.0.0)
`allowed_write_surface_families`, which permits only
`.bandit/policy/role-contracts.json` and `.bandit/policy/artifact-inputs.json`
under `.bandit/policy`. As a result `bandit role-runs validate BANDIT-073` fails
closed on that file. This is reported honestly rather than worked around: the role
contract is not in this dispatch's allowed edit surfaces, so it was not modified.

Codex PM reconciliation options:

1. Widen the `implementation_writer` contract write surface to include
   `.bandit/policy/gate-determinism-flake-gate.json` (or `.bandit/policy/**`), then
   re-run `role-runs validate`; or
2. Treat the policy as init-seeded-only and drop the committed dev-repo copy (the
   validator already treats a missing policy as an empty, passing report and
   `bandit init` seeds the default into every repo).

No other deviation from the allowed source/chore surface list was required.
