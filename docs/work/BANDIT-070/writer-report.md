# BANDIT-070 Stage 3 Writer Report

role: implementation_writer
model_family: claude
work_item: BANDIT-070
stage: Stage 3 Implementation
verdict: pass

## Summary

Implemented the smallest source-only Verification Oracle Provenance Gate needed
to satisfy the Codex-authored Stage 2 RED tests in
`test/verification-oracle-provenance.test.mjs`. The gate adds a
`bandit verification-oracle-provenance validate [--json] [work-item-id]` command,
reads the repo-native `.bandit/policy/verification-oracle-provenance.json`
policy, validates covered high-risk Stage 1 briefs for an oracle provenance
strategy or explicit disposition, validates
`docs/work/<ID>/oracle-provenance-evidence.md` records, rejects circular
self-attestation and self-reported trust claims, and makes `land-check` fail
closed for covered high-risk `safe-to-land` claims that lack current independent
oracle provenance evidence.

## Files Changed

New source:
- `src/state/verification-oracle-provenance.ts` — policy reader, brief/evidence
  parsing, validate logic, landing fail-closed problems, default policy/template
  writers.
- `src/commands/verification-oracle-provenance.ts` — CLI command handler with
  `validate` action and `--json` flag.

Edited source:
- `src/cli.ts` — registered the `verification-oracle-provenance` command and
  added it to the usage strings.
- `src/commands/land-check.ts` — wired `landingOracleProvenanceProblems` into the
  `safe-to-land` readiness path (fails closed only when the oracle policy is
  present; no-ops when absent so existing repos are unaffected).
- `src/commands/init.ts` — writes the default policy and template on init when
  absent.
- `src/state/paths.ts` — added the `verificationOracleProvenancePolicy` path.

New repo-native artifacts (allowed source surfaces):
- `.bandit/policy/verification-oracle-provenance.json` — covered surfaces,
  covered claims, supported/independent oracle types, required fields,
  command-required oracle types, and low-risk self-reported claim exceptions.
- `docs/templates/verification-oracle-provenance.md` — provenance evidence
  template.

## Verification Run

- `node --test test/verification-oracle-provenance.test.mjs` → 4 pass / 0 fail.
- `npm run typecheck` → clean (`tsc --noEmit`, no errors).
- `npm test` → 533 pass / 0 fail.
- `npm run bandit -- validate` → `Bandit state is valid.`
- `node ./bin/bandit.mjs verification-oracle-provenance validate --json` →
  `{"status":"pass",...,"checked_work_items":[],"covered_claims":[]}`.
- `node ./bin/bandit.mjs land-check BANDIT-070` → fails on the expected
  pre-existing Stage 4 prerequisite (missing review evidence), unrelated to this
  change.
- `git diff --check` → no whitespace errors.

## Skipped Checks

- Stage 4 reviewer commands (`coderabbit-review`, `qwen-review`),
  `cockpit status`, `session-context`, and `review-subject-hash` were not run:
  they belong to later stages and are outside the Stage 3 implementation scope.
- Replay regression corpus, Trust Verifier cutover, paid/external tooling, and
  unrelated Phase 8 cockpit/product scope were intentionally not built, per the
  brief out-of-scope boundaries. Replay packets remain an allowed oracle type
  without building the corpus.

## Test-Surface Edit Confirmation

Zero test-surface edits by the Stage 3 Writer. No tests, test helpers, fixtures,
RED evidence, oracle-provenance evidence, oracle-source fixtures,
claim-to-oracle mappings, acceptance mappings, formation/review/landing/
retrospective evidence, roadmap, STATUS, `.bandit/events.jsonl`, or
`.bandit/bootstrap-gaps.json` were created or modified by this Writer.
