# BANDIT-072 Implementation Evidence

work_item: BANDIT-072
stage: Stage 3 Implementation
status: pass
model_family: claude
writer: implementation_writer

## Files Changed

- `src/state/paths.ts` — added `replayRegressionCorpusPolicy`
- `src/state/replay-regression-corpus.ts` — new: policy reader, packet loader, schema validator, deterministic replay validator, default policy writer
- `src/commands/replay-regression-corpus.ts` — new: `validate [--json]` command handler
- `src/cli.ts` — added import and routing for `replay-regression-corpus`
- `src/commands/init.ts` — added `writeDefaultReplayRegressionCorpusPolicy` call
- `.bandit/policy/replay-regression-corpus.json` — new: repo-native default policy
- `docs/replay-packets/provider-timeout-refusal.json` — new: provider_timeout_refusal replay packet
- `docs/replay-packets/stale-review-subject-hash.json` — new: stale_review_subject_hash replay packet
- `docs/replay-packets/dirty-worktree.json` — new: dirty_worktree replay packet

## Verification

| Check | Result |
| --- | --- |
| `node --test test/replay-regression-corpus.test.mjs` | 6/6 pass (repair: was 4/6) |
| `npm run typecheck` | pass |
| `npm test` | 545/545 pass |
| `npm run bandit -- validate` | pass |
| `node ./bin/bandit.mjs replay-regression-corpus validate --json` | pass, deterministic JSON output |
| `git diff --check` | pass, no whitespace errors |

## Test-Surface Edit Confirmation

Zero test-surface edits by Stage 3 Writer. `test/replay-regression-corpus.test.mjs`,
test helpers, RED evidence, replay packet acceptance mappings, expected-verdict mappings,
formation evidence, review evidence, landing evidence, and retrospective evidence are
untouched.

## Clean-Code Evidence

- `src/state/replay-regression-corpus.ts`: packet loading, schema validation, verdict
  comparison, coverage check, and output rendering are separate, named functions.
  The public `validateReplayRegressionCorpus` entry point is read-only and throws on
  any structural, mismatch, or coverage problem.
- `src/commands/replay-regression-corpus.ts`: thin command handler delegates to state
  module; handles `--json` flag and plain-text fallback without mixing validation logic.
- Default policy writer and replay execution path are separate exported functions.
- No live workflow state is mutated: no writes to `.bandit/events.jsonl`,
  `docs/work/*/coordination-log.jsonl`, `docs/roadmap/CURRENT_CONTEXT.md`, gap ledger,
  reviewer routing, model routing, landing authority, UAT state, merge/push/deploy behavior,
  Trust Verifier cutover, or cost policy.

## Replay-Only Boundary

Replay packets are read as fixtures only. The command does not write any coordination
records, gap ledger updates, roadmap updates, reviewer evidence, or landing evidence.
Replay results are supplemental regression evidence and cannot replace required live
CodeRabbit, Local Qwen, risk classification, supply-chain, UAT, landing, or
operator-owned approval evidence.

## Spec Alignment

Every acceptance criterion from `docs/work/BANDIT-072/brief.md` that is testable in Stage 3 is satisfied:

- Repo-native policy defines schema, failure-mode taxonomy, expected verdict semantics, source metadata, replay-only boundaries ✓
- All 7 historically recurring failure classes are covered or dispositioned ✓
- Deterministic machine-readable output, sorted by packet id and failure mode ✓
- Fails closed when expected blocker is missed ✓
- Replay packets cannot mutate live workflow state ✓
- Explicit source artifacts, policy version, replay-only metadata required per packet ✓
- Malformed, unsupported, missing-source, missing-policy-version, missing-authority-fields, outside-taxonomy, verdict-mismatch packets fail closed ✓
- Required failure mode coverage enforced ✓
