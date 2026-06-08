# BANDIT-073 Stage 3 Dispatch

work_item: BANDIT-073
stage: Stage 3 Implementation
dispatcher: work_item_pm
implementation_writer: claude
dispatched_at: 2026-06-08T01:47:00Z

## Assignment

Implement the Gate Determinism And Flake Gate behavior defined by
`docs/work/BANDIT-073/brief.md` and the Codex/Test Writer RED evidence in
`docs/work/BANDIT-073/red-evidence.md`.

## Required RED Target

The focused Stage 3 target is:

```sh
node --test test/gate-determinism.test.mjs
```

Current RED evidence:

- `validate --json` emits plain text instead of stable JSON.
- `bandit validate` ignores invalid gate determinism policies.
- Unstable repeat-run output and hash drift do not fail closed.
- Undispositioned flake sources do not fail closed.
- Provider-dependent evidence missing freshness/availability metadata does not
  fail closed.
- Direct `qwen` CLI evidence is accepted by absence of validation instead of
  being refused.

## Allowed Edit Surfaces

Claude may edit only source/chore surfaces required for implementation:

- `.bandit/policy/gate-determinism-flake-gate.json`
- `src/state/gate-determinism.ts`
- `src/state/paths.ts`
- `src/commands/validate.ts`
- `src/commands/init.ts`
- `src/cli.ts`
- `docs/work/BANDIT-073/writer-report.md`
- `docs/role-runs/BANDIT-073/stage3-implementation.json`

If another source file is strictly required, Claude must explain why in the
writer report. Claude must not edit tests or Test Writer-owned artifacts.

## Forbidden Edit Surfaces

Claude must not create, edit, delete, regenerate, format, or mechanically adjust:

- `test/gate-determinism.test.mjs`
- any `test/**/*.mjs`
- test helpers or fixtures
- `docs/artifact-inputs/BANDIT-073-red-evidence.json`
- `docs/work/BANDIT-073/red-evidence.md`
- this dispatch after starting implementation
- formation, review, landing, UAT, retrospective, roadmap, status, or
  bootstrap-gap disposition artifacts

Any Stage 3 Writer edit to a forbidden surface invalidates the attempt.

## Scope Boundaries

Implement the smallest repo-native gate determinism validator needed to satisfy
the RED tests:

- Read `.bandit/policy/gate-determinism-flake-gate.json` when present.
- Seed a default policy for the development repo and `bandit init`.
- Produce stable `bandit validate --json` output with
  `gate_determinism_flake_gate` details.
- Keep plain `bandit validate` behavior compatible while failing closed with
  useful diagnostics on determinism policy errors.
- Compare repeat-run JSON snapshots by stable canonical JSON hashing.
- Preserve array order as meaningful; do not silently sort arrays to hide drift.
- Require external/provider-dependent evidence to include provider, source
  artifact, captured-at timestamp, freshness expiry, availability disposition,
  and `replaces_deterministic_local_proof: false`.
- Reject Local Qwen evidence routed through the direct `qwen` CLI and name the
  authorized `.bandit/reviewers/local-qwen.json` plus
  `bin/omlx-chat-completions.mjs` route.
- Keep validation read-only against canonical workflow state.

Do not approve Trust Verifier cutover, replace or wrap old gates, change live
reviewer/model routing, add paid routing, publish benchmarks, create hosted
services, add telemetry, merge, push, deploy, or touch unrelated cockpit/product
scope.

## Required Writer Report

Before returning, write `docs/work/BANDIT-073/writer-report.md` with:

- files changed;
- implementation summary;
- verification commands run and results;
- explicit confirmation that no Test Writer-owned surfaces were edited;
- any required deviation from the allowed source/chore surface list.
