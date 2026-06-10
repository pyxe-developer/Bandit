# BANDIT-093 RED Evidence

contract_version: 1
work_item: BANDIT-093
stage: Stage 2 RED
test_writer: codex_test_writer
timestamp: 2026-06-10T20:22:52Z
verdict: pass_red_recorded
red_status: failing_as_expected

## Ownership Boundary

Test Writer owns `test/roadmap-work-targets.test.mjs`, this RED evidence,
fixtures, and acceptance mappings for `BANDIT-093`.

Stage 3 Implementation Writer has zero authority to create, edit, delete,
regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED
evidence, acceptance mappings, formation evidence, review evidence, landing
evidence, UAT evidence, retrospective evidence, or policy acceptance criteria.

Because Codex authored Stage 2 RED tests, Stage 3 implementation must route to
Claude or another non-Codex model family first. Claude must receive the
required 20-minute work window unless authentication fails immediately; if
Claude times out or fails after that window, MiniMax-M3 through headless `pi`
is the authorized fallback.

## RED Test File

- `test/roadmap-work-targets.test.mjs`

## RED Command

```sh
node --test test/roadmap-work-targets.test.mjs
```

## RED Result

The focused suite fails before implementation because the command surface and
resolver do not exist:

```text
not ok 1 - roadmap work target resolver returns the active formed work item
error: Unknown command: roadmap-work-targets
not ok 2 - roadmap work target resolver returns a not-yet-formed interstitial target
error: Unknown command: roadmap-work-targets
not ok 3 - roadmap work target resolver fails closed on roadmap and current-context disagreement
error: expected fail-closed disagreement diagnostic, received Unknown command
not ok 4 - roadmap work target resolver ignores stale historical tail text
error: Unknown command: roadmap-work-targets
not ok 5 - roadmap work target resolver does not use work intake as a hidden scheduler
error: expected no-authorized-target diagnostic, received Unknown command
not ok 6 - roadmap work target resolver dereferences WIL provenance only after roadmap authorization
error: Unknown command: roadmap-work-targets
```

Final TAP summary: 6 tests, 0 pass, 6 fail.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| Resolver returns deterministic current or next target from `ROADMAP.md` and `CURRENT_CONTEXT.md` with title, type, status, relationship, source artifacts, and provenance pointers. | `roadmap work target resolver returns the active formed work item` |
| Resolver handles closed-work interstitial state and returns `not_yet_formed` target data instead of inventing active work. | `roadmap work target resolver returns a not-yet-formed interstitial target` |
| Resolver fails closed with clear diagnostics when roadmap and current context disagree. | `roadmap work target resolver fails closed on roadmap and current-context disagreement` |
| Resolver cannot route execution from stale historical tail wording for closed work. | `roadmap work target resolver ignores stale historical tail text` |
| Resolver refuses to use `.bandit/work-intake-ledger.json` as a primary scheduler or hidden priority queue. | `roadmap work target resolver does not use work intake as a hidden scheduler` |
| Resolver dereferences PRD, spec, or WIL provenance only after roadmap/current-context authority names the target. | `roadmap work target resolver dereferences WIL provenance only after roadmap authorization` |

## Stage 3 Dispatch Requirements

The Stage 3 Writer must implement only source and command surfaces needed to
make the RED suite pass while preserving the clean-code constraints in
`CLEAN_CODE.md`:

- keep roadmap parsing, current-context parsing, reconciliation, provenance
  dereference, and diagnostics small and explicit;
- keep resolver output derived and non-canonical;
- do not make WIL, PRD, specs, cockpit/session-context packets, generated JSON,
  or resolver output independent workflow authority;
- do not implement `/bandit-work-create`, `/bandit-work-execute`, Repo PM
  create controller, Work Item PM execute controller, stage route registry,
  role input packet assembly, provider/blocker recorder, Trust Verifier
  cutover, local API, State Index, hosted services, telemetry, paid routing,
  merge, push, deploy, or unrelated Phase 8 work;
- do not edit Test Writer-owned files.
