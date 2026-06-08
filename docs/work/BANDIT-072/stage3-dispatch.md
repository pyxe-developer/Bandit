# BANDIT-072 Stage 3 Implementation Dispatch

role: implementation_writer
model_family_requirement: claude
work_item: BANDIT-072
source_stage: Stage 2 RED evidence
verdict: implementation_required

## Mission

Implement the smallest source/chore change needed to satisfy the
Codex-authored `BANDIT-072` RED tests for the Replay Regression Corpus.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-072/brief.md`
- `docs/work/BANDIT-072/orchestration-plan.md`
- `docs/work/BANDIT-072/red-evidence.md`
- `docs/artifact-inputs/BANDIT-072-red-evidence.json`
- `test/replay-regression-corpus.test.mjs`
- `src/cli.ts`
- `src/commands/init.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- nearby command/state patterns such as `src/commands/test-strength-gate.ts`,
  `src/state/test-strength-gate.ts`,
  `src/commands/verification-oracle-provenance.ts`, and
  `src/state/verification-oracle-provenance.ts`

## Allowed Source Surfaces

- `src/cli.ts`
- `src/commands/replay-regression-corpus.ts`
- `src/state/replay-regression-corpus.ts`
- `src/commands/init.ts`
- `src/state/paths.ts`
- `.bandit/policy/replay-regression-corpus.json`
- `docs/replay-packets/*.json`
- narrowly related CLI/init/path helpers only if required by the RED tests
- `docs/work/BANDIT-072/writer-report.md`
- `docs/work/BANDIT-072/implementation-evidence.md`

## Forbidden Surfaces

Do not edit tests, test helpers, Test Writer-owned replay fixtures inside tests,
RED evidence, replay packet acceptance mappings, expected-verdict mappings,
source-artifact mappings, formation evidence, orchestration plan evidence,
review evidence, landing evidence, UAT evidence, retrospective evidence,
`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
`.bandit/bootstrap-gaps.json`, `.bandit/events.jsonl`, live workflow state,
Trust Verifier cutover, old-gate replacement or wrapping, live reviewer/model
routing, public benchmark publication, paid routing, hosted replay services,
telemetry, merge, push, deploy, guarded browser action execution, local API,
State Index, scheduler, claim/worktree lifecycle, or unrelated Phase 8
cockpit/product scope.

## Expected Behavior

- Add `bandit replay-regression-corpus validate [--json]`.
- Read `.bandit/policy/replay-regression-corpus.json`.
- Load replay packet JSON fixtures from `docs/replay-packets/`.
- Validate packet schema version, policy version, command version, failure mode,
  source artifacts, expected gate, expected verdict, replay-only metadata, and
  simulated replay diagnostics.
- Require every policy `required_failure_modes` entry to have either a packet or
  an explicit disposition.
- Produce deterministic machine-readable output sorted by packet ID and sorted
  failure-mode lists.
- Fail closed when a packet expected verdict differs from the simulated replay
  verdict, especially when a known blocker would be missed.
- Preserve read-only execution against live Bandit workflow state; the command
  must not write coordination logs, gap ledger state, roadmap/current-context
  files, reviewer routing, model routing, landing authority, UAT state,
  merge/push/deploy state, cost policy, or Trust Verifier cutover state.
- Keep replay corpus results supplemental only. They cannot replace live review,
  risk, supply-chain, UAT, landing, or operator-owned approval evidence.
- Add repo-native default policy and replay packets for the historically
  recurring failure classes, or explicit no-action/bootstrap dispositions where
  a class is not represented as a packet in this bounded chore.
- Do not use ungrounded chat memory as replay packet authority; packet source
  metadata must point to repo artifacts or explicit disposition evidence.

## Verification

Run at minimum:

```sh
node --test test/replay-regression-corpus.test.mjs
npm run typecheck
```

If those pass, also run:

```sh
npm test
npm run bandit -- validate
node ./bin/bandit.mjs replay-regression-corpus validate --json
git diff --check
```

Do not edit the RED tests to make them pass. If a test appears wrong, stop and
record the blocker instead of changing the test surface.

## Evidence To Write

Write:

- `docs/work/BANDIT-072/writer-report.md`
- `docs/work/BANDIT-072/implementation-evidence.md`

Both artifacts must list files changed, verification run, skipped checks, and
confirm zero test-surface edits by the Stage 3 Writer.
