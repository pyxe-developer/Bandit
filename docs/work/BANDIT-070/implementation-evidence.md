# BANDIT-070 Implementation Evidence

contract_version: 1
work_item: BANDIT-070
stage: stage3_implementation
implementer: claude_implementation_writer
verdict: pass

## Scope Delivered

Smallest source-only Verification Oracle Provenance Gate satisfying the Stage 2
RED tests:

- Added `bandit verification-oracle-provenance validate [--json] [work-item-id]`.
- Read repo-native `.bandit/policy/verification-oracle-provenance.json` naming
  covered surfaces, covered claims, supported oracle types, independent oracle
  types, required fields, command-required oracle types, and low-risk
  self-reported claim exceptions.
- Stage 1 covered high-risk briefs (`risk_tier: high` with
  `covered_oracle_surfaces`) must declare `oracle_provenance_strategy` or an
  explicit `oracle_provenance_disposition` before Stage 2 proceeds.
- `docs/work/<ID>/oracle-provenance-evidence.md` records are validated for the
  policy-required fields (target surface, claim, oracle type, oracle source,
  owner or authority role, independence class, freshness source, claim mapping,
  source drift status) plus a command when the oracle type requires
  command/replay evidence.
- Circular self-attestation is rejected when `oracle_source` points to the work
  item's own generated `oracle-provenance-evidence.md`, and trust claims
  (`pass`, `safe-to-land`, `trusted`, `current`, `ready`) relying only on
  `self_reported_or_derived` evidence are rejected as not independent.
- `land-check` fails closed for covered high-risk `safe-to-land` claims that lack
  current independent oracle provenance evidence; it no-ops when the policy file
  is absent so unrelated repos and work items are unaffected.
- Replay packets remain an allowed oracle type; no replay regression corpus was
  built.

## Files Changed

- src/state/verification-oracle-provenance.ts (new)
- src/commands/verification-oracle-provenance.ts (new)
- src/cli.ts
- src/commands/land-check.ts
- src/commands/init.ts
- src/state/paths.ts
- .bandit/policy/verification-oracle-provenance.json (new artifact)
- docs/templates/verification-oracle-provenance.md (new artifact)

## Verification Run

- node --test test/verification-oracle-provenance.test.mjs → tests 4, pass 4, fail 0
- npm run typecheck → pass (tsc --noEmit, no errors)
- npm test → tests 533, pass 533, fail 0
- npm run bandit -- validate → "Bandit state is valid."
- git diff --check → no whitespace errors

## Skipped Checks

- Stage 4 reviewer routes (CodeRabbit, Local Qwen) and projection commands
  (cockpit status, session-context, review-subject-hash) are later-stage scope
  and were not run.
- Out-of-scope items intentionally not built: replay regression corpus, Trust
  Verifier cutover, old-gate replacement/wrapping, paid/external tooling, UAT
  policy change, merge/push/deploy authority, guarded action execution, and
  unrelated Phase 8 cockpit/product scope.

## Test-Surface Edit Confirmation

Zero test-surface edits by the Stage 3 Writer. No tests, test helpers, fixtures,
RED evidence, oracle-provenance evidence, oracle-source fixtures,
claim-to-oracle mappings, acceptance mappings, formation/review/landing/
retrospective evidence, roadmap, STATUS, `.bandit/events.jsonl`, or
`.bandit/bootstrap-gaps.json` were created or modified by this Writer. The only
non-source artifacts written are the explicitly allowed policy
(`.bandit/policy/verification-oracle-provenance.json`) and template
(`docs/templates/verification-oracle-provenance.md`).
