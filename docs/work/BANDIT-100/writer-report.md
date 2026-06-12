# BANDIT-100 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-100
stage: Stage 3 Implementation
implementation_writer: minimax_fallback_after_claude_timeout
model_family: minimax
dispatch_packet: docs/work/BANDIT-100/stage3-minimax-dispatch.md
repair_dispatch_packet: docs/work/BANDIT-100/stage3-minimax-repair-dispatch.md
repair_implementation_writer: minimax_focused_repair
created_at: 2026-06-12T13:25:00-04:00
repair_recorded_at: 2026-06-12T13:35:00-04:00

## Dispatch Reason

Claude Sonnet 4.6 was the first Stage 3 implementation writer and timed out
after the allowed implementation window. Per the brief's bootstrap model-family
separation rule and the MiniMax fallback dispatch
(`docs/work/BANDIT-100/stage3-minimax-dispatch.md`), the Stage 3 Writer route
fell back to MiniMax-M3. This writer report and the companion
`implementation-evidence.md` artifact complete the Stage 3 writer package
without expanding scope.

## CLEAN_CODE.md Read Evidence

Read `CLEAN_CODE.md` on 2026-06-12 before inspecting source files or running
verification. The implementation surface is small, explicit, and free of hidden
authority:

- The `parseProjectProfile` validator throws errors that name the offending
  field (failure clarity).
- `initBandit` keeps the unprofiled starter path and the profile-aware
  scaffold as separate, locally named functions (`seedStarterGovernance`,
  `seedProfileGovernance`) so related logic lives together.
- `draft-work` parameterizes the PRD H1 regex by configured prefix with
  `BANDIT-PRD-*` back-compat baked in (no hidden authority, testable
  behavior).
- No new dependencies, lockfile changes, or unrelated refactors were added.

## Source Files Inspected

The fallback writer inspected the following source files to confirm the
existing implementation matches the Stage 3 acceptance criteria:

- `src/commands/init.ts`
- `src/commands/draft-work.ts`
- `src/cli.ts`
- `src/state/config.ts`
- `src/state/project-profile.ts`
- `docs/templates/project-profile.md`

The fallback writer also inspected the Test Writer-owned RED evidence and
the existing RED tests (read-only) to map the implementation back to
acceptance criteria:

- `test/init.test.mjs`
- `test/draft-work.test.mjs`
- `docs/work/BANDIT-100/red-evidence.md`

## Source Files Changed

None.

The Stage 3 source changes that were already in the working tree before this
fallback dispatch satisfy all three acceptance criteria:

1. `bandit init --profile <profile.json>` rejects malformed profiles with
   field diagnostics. `parseProjectProfile` validates `contract_version`,
   `name`, `work_item_prefix`, `starter_work_item`, `roadmap_seed`,
   `reviewers`, `policy_tiers`, and `harnesses`, throwing errors that
   name the offending field (e.g. `Invalid profile field:
   work_item_prefix (must be uppercase letters and digits, starting with
   a letter)`). `cli.ts` propagates that throw through the main
   error path, producing exit code 1 with the field name in stderr.
2. `bandit init --profile <profile.json>` scaffolds a consumer repo under
   the configured identity. `seedProfileGovernance` writes
   `.bandit/config.toml` with the configured `work_item_prefix`, the
   starter brief at `docs/work/<prefix>-001/brief.md`, and profile-native
   `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and
   `STATUS.md` files that do not contain `BANDIT-001`,
   `Phase 0 - Consumer Onboarding`, `Bandit's active work history`, or
   `internal roadmap queue`. `writeProfileTemplate` ensures
   `docs/templates/project-profile.md` is available. `bandit validate`
   passes in a fresh profile-initialized repo.
3. `bandit draft-work <prd>` accepts the configured PRD prefix while
   preserving `BANDIT-PRD-*` back-compat. `parseSourcePrd` builds the H1
   regex from the configured `work_item_prefix` and includes the
   `BANDIT-PRD-*` form as a parallel alternation when the prefix is not
   `BANDIT`. New work item IDs are allocated using the configured
   `work_item_prefix`, but the source PRD ID (which can be
   `BANDIT-PRD-*`) is preserved verbatim in the drafted brief.

## No-Repair-Needed Statement

The focused RED tests (`test/init.test.mjs` and `test/draft-work.test.mjs`)
and `npm run typecheck` all pass on the existing source. Adjacent tests
that share touched surfaces (`test/validate.test.mjs`,
`test/claim-safety-simulation.test.mjs`,
`test/coordination-log.test.mjs`,
`test/coordination-status.test.mjs`) also pass on the same source. No
source churn is required to satisfy the Stage 3 acceptance criteria or
the original RED evidence. Per the dispatch packet, the fallback writer
deliberately did not re-author implementation to avoid introducing
non-essential churn.

## Verification Commands And Observed Results

```sh
node --test test/init.test.mjs
node --test test/draft-work.test.mjs
npm run typecheck
```

Observed results:

- `node --test test/init.test.mjs`: 9/9 pass.
- `node --test test/draft-work.test.mjs`: 15/15 pass.
- `npm run typecheck`: pass (no errors).

Adjacent tests also run to confirm there is no regression on shared
surfaces:

- `node --test test/validate.test.mjs`: 22/22 pass.
- `node --test test/claim-safety-simulation.test.mjs`: 7/7 pass.
- `node --test test/coordination-log.test.mjs test/coordination-status.test.mjs`:
  21/21 pass.

See `docs/work/BANDIT-100/implementation-evidence.md` for the full
verification transcript and acceptance-criteria mapping.

## Test Writer-Owned Surface Compliance

The fallback writer did not create, edit, delete, regenerate, format, or
mechanically adjust any of the following Test Writer-owned surfaces:

- `test/init.test.mjs`
- `test/draft-work.test.mjs`
- `docs/work/BANDIT-100/red-evidence.md`
- any test helper, fixture, acceptance mapping, formation evidence,
  review evidence, landing evidence, UAT evidence, retrospective
  evidence, roadmap/status file, or PRD/source authority file.

The `git diff --stat` for this work item shows the same pre-existing
untracked source changes that were present before the fallback dispatch;
no additional test or evidence file was modified by the fallback writer.

## Unresolved Concerns Or Bootstrap Gaps

None for the Stage 3 implementation surface.

The fallback writer did not introduce new bootstrap gaps. The pre-existing
`.bandit/bootstrap-gaps.json` entry for the BANDIT-100 plan-only CodeRabbit
timeout remains a recorded `bootstrap_gap` per
`docs/work/BANDIT-100/formation-review.md`. It is not caused or worsened by
this Stage 3 fallback and is outside the Stage 3 scope.

## Final Stage 3 Verdict

`pass` — the existing source satisfies the Stage 3 acceptance criteria and
the focused RED tests. No source repair is required. Stage 3 writer
artifacts are complete. The next stage is Stage 4 adversarial review
under the original work item PM plan.

## Stage 3 MiniMax Focused Repair

After Work Item PM acceptance inspection, this writer executed the focused
repair dispatch
(`docs/work/BANDIT-100/stage3-minimax-repair-dispatch.md`) against the
existing source. The repair followed the hard boundaries in the dispatch
packet:

- No test, test helper, fixture, RED evidence, coordination log, roadmap,
  status, review, landing, or closeout file was edited.
- No new tests were added.
- The repair is source-only plus the writer-report and
  implementation-evidence refresh recorded in this and the companion
  artifact.
- The repair was limited to the focused repair list in the dispatch packet.

### Repairs Applied

1. `bandit init --profile` with no path now fails closed in a fresh repo.
   `src/cli.ts` was updated so that when `--profile` is present in
   `process.argv` but the next argument is missing or empty, the command
   writes `bandit init --profile requires a profile path argument` to
   stderr, sets `process.exitCode = 1`, and returns without calling
   `initBandit`. The previous behavior silently fell through to the
   default unprofiled init path, which violated the fail-closed contract
   Work Item PM flagged during acceptance inspection.
2. The unused `readFile` import was removed from
   `src/commands/init.ts`. The file no longer imports `readFile` from
   `node:fs/promises`; the import is now `copyFile, mkdir, readdir, stat,
   writeFile`.
3. `src/state/project-profile.ts` was tightened for the obvious invalid
   supplied-field cases the Work Item PM flagged:
   - `starter_work_item.number`, when present, must be a positive integer
     (rejects `0`, negative, non-integer, and non-number values with
     `Invalid profile field: starter_work_item.number (must be a positive
     integer)`).
   - optional `starter_work_item.current_stage` and
     `starter_work_item.next_action`, when present, must be non-empty
     strings (rejects `""` and whitespace-only values with
     `Invalid profile field: starter_work_item.current_stage (must be a
     non-empty string)` and the matching `next_action` error).
   - `roadmap_seed.planned_work`, when present, must be an array of
     objects; each object must have non-empty string `kind`, `id`, and
     `title`. Errors name the offending index and field, e.g.
     `Invalid profile field: roadmap_seed.planned_work[0].kind (must be a
     non-empty string)`.
   - each `reviewers` entry must be an object with non-empty string `id`
     and `provider`, plus a boolean `required`. Errors name the offending
     index and field, e.g. `Invalid profile field: reviewers[0].required
     (must be a boolean)`.
   - Default values for the optional starter-work-item fields are still
     applied when the field is omitted from the profile, so the
     validation only fires when the field is present and invalid.
4. `docs/templates/project-profile.md` was made ASCII-only by replacing
   the em dashes in the field bullets with `:` (colon) punctuation. The
   file contains no non-ASCII bytes after the repair; this was verified
   with `LC_ALL=C grep -n '[^[:print:][:space:]]' docs/templates/project-profile.md`.
5. `docs/work/BANDIT-100/writer-report.md` (this file) and
   `docs/work/BANDIT-100/implementation-evidence.md` were updated to
   record the focused repair, the no-test-edit boundary, and the
   refreshed verification results.

### No-Test-Edit Boundary Compliance

The focused repair did not create, edit, delete, regenerate, format, or
mechanically adjust any Test Writer-owned surface. The following files
were inspected read-only and left untouched:

- `test/init.test.mjs`
- `test/draft-work.test.mjs`
- `docs/work/BANDIT-100/red-evidence.md`
- `test/helpers/bandit-cli.mjs` (helper, not Test-Writer-owned RED surface,
  but also not modified)

The repair also did not touch any coordination log, roadmap, status,
formation review, review evidence, landing evidence, UAT evidence,
retrospective evidence, or PRD/source authority file. The
`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and
`STATUS.md` files were not modified by this repair, in line with the
dispatch packet's forbidden-file list.

### Refreshed Verification Results

After the focused repair, the writer re-ran the required verification
commands and the manual fail-closed CLI edge case:

```text
node --test test/init.test.mjs           # 9/9 pass
node --test test/draft-work.test.mjs     # 15/15 pass
npm run typecheck                        # pass (no errors)
npm test                                 # 656/656 pass (full suite, no regressions)
```

The manual fail-closed CLI edge case (run in a fresh `mktemp -d` repo)
now produces:

```text
$ node "<REPO_ROOT>/bin/bandit.mjs" init --profile
bandit init --profile requires a profile path argument
exit_code=1
```

The fresh repo is left empty (no `.bandit/`, no `AGENTS.md`, no
`STATUS.md`, no scaffold) after the failed invocation. The happy path
`bandit init --profile <file>` continues to scaffold a profile-initialized
repo and exits 0.

### Schema Validator Manual Coverage

In addition to the focused RED tests, the writer executed a one-off
ad-hoc check over the new `parseProjectProfile` validators to confirm
that each new failure mode names the offending field and index. The
ad-hoc check covered the happy paths and the rejection cases for
`starter_work_item.number`, `starter_work_item.current_stage`,
`starter_work_item.next_action`, `roadmap_seed.planned_work` (missing
object fields, non-string entries, empty strings), and `reviewers`
(missing fields, non-string `id`/`provider`, non-boolean `required`,
non-object entries). All checks produced the expected pass/fail outcome
and error message. The ad-hoc check is not a permanent test addition and
was not added to the repo, in line with the dispatch packet's
no-new-test rule.

### Repair Verdict

`pass` — the focused repair list in the dispatch packet is fully
satisfied, the focused RED tests and `npm run typecheck` still pass, the
manual fail-closed CLI edge case is recorded, and the no-test-edit
boundary is preserved. Stage 3 writer artifacts are refreshed and
ready for the next stage under the original work item PM plan.
