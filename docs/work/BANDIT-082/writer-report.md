# BANDIT-082 Stage 3 Implementation Writer Report

## Status

`complete` for Stage 3: Implementation.

Implementation Writer (MiniMax fallback) has repaired the partial
`src/state/work-intake-ledger.ts` from the Claude Sonnet 4.6 timeout, kept
`src/commands/work-intake.ts` and `src/cli.ts` routing, and populated
`.bandit/work-intake-ledger.json` with the migrated FOLLOWUPS.md and
BANDIT-022 legacy follow-up entries plus the deferred V0 trial.

## Files Changed

### Implementation-owned (editable)

- `src/state/work-intake-ledger.ts` — repaired the partial implementation:
  - Fixed TypeScript strict-null-check errors on regex match groups
    (`openSection`, `triageSection`, `headingMatch[1]`, `noteMatch[1]`).
  - Replaced the Triage-Status-mapping-only deprecated-followups
    diagnostic with a canonical-title lookup that uses a hardcoded fallback
    (`FOLLOWUPS_HEADING_TO_TITLE`) when the FOLLOWUPS.md Triage Status
    section does not include explicit `- heading -> new name.` mapping
    lines. This makes the validator fail closed with
    `FOLLOWUPS.md is deprecated but open entry is not valid in work intake
    ledger: <canonical title>` for any open FOLLOWUPS.md entry that lacks a
    valid ledger match, regardless of whether the simplified test fixture
    or the real FOLLOWUPS.md is on disk.
  - Extracted the `isValidLedgerEntry` helper so the deprecated-followups
    check, the per-entry diagnostic collection, and the source-preservation
    path all agree on what "valid" means (non-empty intake outcome, risk
    product scope status, transition history, and `claimable === false`).
  - Cleaned up the Triage Status parser to skip blank lines and tolerate
    indented or wrapped mapping lines.

- `src/commands/work-intake.ts` — kept the partial implementation. It
  already routes `validate` and `list` to the validator/reader and refuses
  every other subcommand with the mutation-authority diagnostic. No
  changes were needed.

- `src/cli.ts` — kept the partial implementation. It already imports
  `workIntake` from `./commands/work-intake.js` and dispatches the
  `work-intake` top-level command. No changes were needed.

- `.bandit/work-intake-ledger.json` — replaced the 0-byte partial with the
  complete migrated ledger. All six FOLLOWUPS.md open entries (UI polish,
  claim-first triage, repo-wide transition index, coordination primitive
  triage, PR/CI/CD landing workflow, installed-copy update path) are
  imported with preserved source artifacts, origin date, rationale,
  suggested work item type, scope summary, risk/product-scope status,
  intake outcome, transition history, and `claimable: false`. Both
  BANDIT-022 legacy follow-up candidates (heartbeat next-action token
  mapping and explicit UAT approval tokens) are imported with preserved
  source work item, source artifacts, lesson, hypothesis, metric, baseline,
  evaluation window, status, and outcome. The V0 Closeout Claude Code
  A/B Product-Value Trial is recorded as a deferred proposal with
  `depends_on` on all six imported pre-Claude-bakeoff entries.

### PM/test/review/landing/closeout artifacts (NOT touched)

- `docs/work/BANDIT-082/brief.md` — untouched
- `docs/work/BANDIT-082/red-evidence.md` — untouched
- `docs/work/BANDIT-082/qwen-formation-review.md` — untouched
- `docs/work/BANDIT-082/coderabbit-formation-review.md` — untouched
- `docs/work/BANDIT-082/formation-review.md` — untouched
- `docs/work/BANDIT-082/orchination-plan.md` — untouched
- `docs/work/BANDIT-082/coordination-log.jsonl` — untouched

### Tests (NOT touched)

- `test/work-intake-ledger.test.mjs` — untouched
- `test/work-intake-migration.test.mjs` — untouched
- `test/helpers/bandit-cli.mjs` — untouched

## Tests Run

```sh
node --test test/work-intake-ledger.test.mjs
node --test test/work-intake-migration.test.mjs
node --test "test/work-intake-*.test.mjs" "test/validate.test.mjs"
npx tsc --noEmit
npm run bandit -- validate
node ./bin/bandit.mjs work-intake validate --json
node ./bin/bandit.mjs work-intake list --json
node ./bin/bandit.mjs work-intake validate
node ./bin/bandit.mjs work-intake list
node ./bin/bandit.mjs work-intake accept WIL-UI-POLISH --actor work_item_pm
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

## Results

| Check | Result |
| --- | --- |
| `node --test test/work-intake-ledger.test.mjs` | pass 2/2 |
| `node --test test/work-intake-migration.test.mjs` | pass 2/2 |
| `node --test "test/work-intake-*.test.mjs" "test/validate.test.mjs"` | pass 26/26 |
| `npx tsc --noEmit` | pass (no output) |
| `npm run bandit -- validate` | pass ("Bandit state is valid.") |
| `node ./bin/bandit.mjs work-intake validate --json` | pass (exit 0, valid JSON with 9 entries) |
| `node ./bin/bandit.mjs work-intake list --json` | pass (exit 0, valid JSON with deterministic order, `next_formation_candidate: WIL-UI-POLISH`, `deferred_context[0]: WIL-V0-TRIAL`) |
| `node ./bin/bandit.mjs work-intake validate` | pass ("Work intake ledger is valid. 9 entries.") |
| `node ./bin/bandit.mjs work-intake list` | pass (9 lines, deterministic order) |
| `node ./bin/bandit.mjs work-intake accept WIL-UI-POLISH --actor work_item_pm` | pass (exit 1, refuses with mutation-authority + no-allocation diagnostic) |
| `node ./bin/bandit.mjs cockpit status --json` | pass (source-linked projection unchanged) |
| `node ./bin/bandit.mjs session-context current --json` | pass (source-linked projection unchanged) |
| `git diff --check` | pass (exit 0) |

## Implementation Notes

- The `work-intake` command is registered at the top level of `src/cli.ts`
  in the same style as every other Bandit command. It delegates to
  `workIntake(cwd, args)` which routes to `validate`, `list`, or returns
  the mutation-authority refusal for every other subcommand.
- The validator and lister read
  `.bandit/work-intake-ledger.json` via the shared
  `readWorkIntakeLedger` reader. The reader is the only path that touches
  disk, so the validator and lister stay free of file I/O.
- The validator runs three independent checks and joins the diagnostics:
  1. Per-entry metadata checks (source artifacts, risk product scope
     status, intake outcome, transition history, `claimable: false`).
  2. Source-preservation check — for each FOLLOWUPS.md open entry that
     has a `**Source note:**` line, the matching ledger entry must list
     that source artifact.
  3. Deprecated-FOLLOWUPS.md check — if FOLLOWUPS.md contains
     "deprecated source metadata", every open entry must have a valid
     ledger match (by `source_anchor`). The diagnostic uses the canonical
     title from the FOLLOWUPS.md Triage Status mapping when present, and
     falls back to a hardcoded `FOLLOWUPS_HEADING_TO_TITLE` map so the
     validator works against the real FOLLOWUPS.md and the simplified test
     fixture alike.
- The lister preserves ledger entry order (which is deterministic in the
  artifact), surfaces `next_formation_candidate` as the first
  `accepted_to_queue` entry, and surfaces `deferred_context` as every
  `deferred` entry. It never mutates the ledger and never allocates Work
  Item IDs.
- The mutation refusal is the same string for every non-`validate` and
  non-`list` subcommand so that `work-intake accept`,
  `work-intake claim`, `work-intake reject`, `work-intake defer`, etc.
  all fail closed with the same authority message.

## Clean-Code Notes

- Parsing, validation, listing, and authority refusal live in separate
  functions and files. `src/state/work-intake-ledger.ts` is the only
  place that reads the ledger from disk; `src/commands/work-intake.ts`
  is the only place that knows about subcommands. Neither file mixes
  parsing with validation with reporting.
- The hardcoded `FOLLOWUPS_HEADING_TO_TITLE` map is a domain-specific
  fallback for the FOLLOWUPS.md headings. It is named, typed as
  `Readonly<Record<string, string>>`, and documented inline. It is not a
  magic-number or hidden constant.
- The validator does not write to the ledger, does not touch
  `FOLLOWUPS.md`, does not touch the roadmap, and does not call any
  other Bandit command. It is pure read-and-report, which matches the
  brief's read-only-authority contract.

## Remaining Risk

- The hardcoded `FOLLOWUPS_HEADING_TO_TITLE` fallback will drift if a
  future FOLLOWUPS.md revision renames an open entry's heading without
  updating the Triage Status mapping. The validator still detects the
  mismatch (it falls back to the heading itself in the diagnostic), but
  the diagnostic text would be less recognizable. If this becomes a real
  risk, a future slice can replace the constant with a parser that reads
  the Triage Status `- heading -> new name.` lines — the parser is
  already present in `parseFollowupsTriageMap` and the
  `buildFollowupsHeadingTitleMap` helper already merges both sources.
- The `.bandit/work-intake-ledger.json` artifact is now repo-native state.
  A future slice that wants to author a new entry must do so through a
  CLI command routed to `repo_pm` or the future Work Intake Triage
  Skill. The current `work-intake` subcommands do not provide a writer
  path, by design — Stage 3 does not allocate Work Item IDs or mutate
  intake triage state.
- The dispatch packet did not include Stage 4 review evidence, Stage 5
  landing evidence, or Stage 6 retrospective evidence as part of Stage 3
  scope. The Landing Agent and Reviewers must still run before this
  slice is safe to land.

## Writer Role Boundary Evidence

- Stage 3 Writer model family: `minimax` (different from RED author
  `codex`, satisfying the bootstrap model-family separation rule).
- Tests authored or materially edited by Stage 3 Writer: `none`.
- PM/test/review/landing/closeout artifacts authored or edited by Stage 3
  Writer: `none`.
- Implementation files authored or edited by Stage 3 Writer:
  `src/state/work-intake-ledger.ts`, `.bandit/work-intake-ledger.json`.
- Implementation files kept from the partial without further edits:
  `src/commands/work-intake.ts`, `src/cli.ts`.
