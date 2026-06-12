# BANDIT-098 RED Evidence

contract_version: 1
work_item: BANDIT-098
stage: Stage 2 Test Design And RED Evidence
author: codex_test_writer
timestamp: 2026-06-12T00:04:20Z
verdict: pass
coordination_state: red_recorded_pending
stage3_route_required: claude_non_codex_writer

## Summary

Focused Test Writer-owned RED tests define the day-1 consumer install and
governance scaffold contract before implementation. The current code fails
because `bandit init` creates repo-native `.bandit` state and package templates
but does not create starter governance artifacts required by cockpit status and
focused session context in a fresh consumer repository.

The Test Writer for this stage is Codex. Because Codex authored these RED
tests, Stage 3 implementation must route to Claude or another non-Codex model
family. During bootstrap, Claude is the first Stage 3 Writer route, with
MiniMax-M3 fallback only after auth failure or the required timeout.

## Test Files

- `test/init.test.mjs`
- `test/public-consumer-install-quickstart.test.mjs`

## Dirty Test-Surface Classification

The worktree already contained edits to `test/private-install-update-channel.test.mjs`
and `test/update-channel.test.mjs` before Stage 2. Test Writer inspected those
changes and classifies them as pre-existing public-distribution wording and
package allow-list coverage related to `BANDIT-098`, not sufficient RED
evidence for the day-1 governance scaffold contract. Stage 3 Writer still has
zero authority to edit test surfaces, including those pre-existing test files.

## RED Commands

```sh
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
```

## RED Result

Both commands fail as expected.

Key failing evidence from `node --test test/init.test.mjs`:

```text
not ok 2 - init creates starter governance artifacts for day-1 cockpit and session context
error: "ENOENT: no such file or directory, access '/.../AGENTS.md'"
```

Key failing evidence from
`node --test test/public-consumer-install-quickstart.test.mjs`:

```text
not ok 1 - packed consumer quickstart initializes a governed repo with local npx commands
error: "Missing cockpit source artifact: docs/roadmap/CURRENT_CONTEXT.md"
```

The missing governance artifacts and cockpit source artifact failures are the
intended RED signal. Existing `init` behavior still initializes `.bandit`
state, preserves lifecycle events, and preserves existing governance files, so
the failure is scoped to missing starter governance scaffolding and day-1
consumer cockpit/session-context usability.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| The selected CLI-owned onboarding path creates starter `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `docs/verification/STAGE_RUBRICS.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and root `STATUS.md` in a fresh consumer repo. | `init creates starter governance artifacts for day-1 cockpit and session context` asserts every required starter artifact exists immediately after `bandit init`. |
| After install plus onboarding in a fresh temp consumer repo, `npx --no-install bandit validate` exits 0. | `packed consumer quickstart initializes a governed repo with local npx commands` installs the packed package in a temp npm project, runs `npx --no-install bandit init`, then runs `npx --no-install bandit validate`. |
| After install plus onboarding in a fresh temp consumer repo, `npx --no-install bandit cockpit status --json` exits 0 with a derived status that names required operator input. | The packed quickstart test runs `npx --no-install bandit cockpit status --json` and expects `kind: workflow_cockpit_status` plus `required_operator_input.value: none_required`; current code fails before this assertion because `CURRENT_CONTEXT.md` is missing. |
| After install plus onboarding in a fresh temp consumer repo, `npx --no-install bandit session-context current --json` exits 0 with a focused session context packet. | The packed quickstart test runs `npx --no-install bandit session-context current --json` and expects `kind: focused_session_context_packet` plus `required_operator_input.value: none_required`. |
| Starter governance files state consumer-repo role authority, clean-code expectations, stage verdict vocabulary, bootstrap methodology, current context, roadmap, and operator status without importing Bandit's active work-item history or internal project queue. | The new init test requires the starter artifact set as the public interface; Stage 3 PM acceptance must inspect content neutrality before implementation is accepted. |
| The selected onboarding path creates directories required by starter artifacts and preserves existing files without silent overwrite. | `init preserves existing starter governance artifacts` pre-creates `AGENTS.md`, `CLEAN_CODE.md`, `docs/roadmap/CURRENT_CONTEXT.md`, and `STATUS.md`, then asserts `bandit init` leaves their contents unchanged. |
| Focused tests or a packed-install contract test prove the documented day-1 sequence in a temporary consumer repo, including local binary invocation. | `test/public-consumer-install-quickstart.test.mjs` packs the current package, installs it in a temp npm project, and uses `npx --no-install bandit ...` commands from the consumer repo. |
| The package allow-list includes every template or starter artifact needed by the selected onboarding path and excludes active repo history. | Pre-existing `test/private-install-update-channel.test.mjs` changes cover public package allow-list behavior; Stage 3 must update or satisfy them without editing tests. |

## Test Ownership Boundary

Test Writer owns:

- `test/init.test.mjs`
- `test/public-consumer-install-quickstart.test.mjs`
- this RED evidence
- acceptance mappings in this artifact
- the Stage 2 classification of pre-existing test-surface edits

Stage 3 Writer has zero authority to create, edit, delete, regenerate, format,
or mechanically adjust tests, test helpers, fixtures, RED evidence, acceptance
mappings, formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, roadmap/status files, or PRD/source authority files
for this Work Item.

## Stage 3 Dispatch Requirements

Dispatch Stage 3 implementation to Claude through the bootstrap Process
Adapter path. The implementation target is narrow:

- make `bandit init` create or preserve starter governance artifacts for a
  fresh consumer repository;
- keep starter artifacts consumer-neutral and free of Bandit's active work
  history, internal roadmap queue, reviewer evidence, or private local
  assumptions;
- preserve no-overwrite behavior for existing consumer governance files;
- make the packed consumer path work with `npx --no-install bandit init`,
  `validate`, `cockpit status --json`, and `session-context current --json`;
- update package allow-list, README command guidance, and update-channel
  wording only as needed for the accepted public install contract;
- do not edit Test Writer-owned files.

## Verification For Stage 2

- `node --test test/init.test.mjs` - RED, expected failure for missing
  `AGENTS.md` after `bandit init`.
- `node --test test/public-consumer-install-quickstart.test.mjs` - RED,
  expected failure for missing `docs/roadmap/CURRENT_CONTEXT.md` during packed
  consumer `cockpit status --json`.
