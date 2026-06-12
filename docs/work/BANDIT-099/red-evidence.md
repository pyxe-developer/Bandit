# BANDIT-099 RED Evidence

contract_version: 1
work_item: BANDIT-099
stage: Stage 2 Test Design And RED Evidence
author: codex_test_writer
timestamp: 2026-06-12T11:17:19Z
verdict: pass
coordination_state: red_recorded_pending
stage3_route_required: claude_non_codex_writer

## Summary

Focused Test Writer-owned RED tests define the public consumer onboarding
hardening contract before implementation. The current code fails because
`bandit init` still writes Codex-specific starter governance, does not create
day-1 README/onboarding guidance in a fresh consumer repo, does not create a
Bandit onboarding guide when preserving an existing README, and the public
README still contains copy-pasteable bare `bandit` and `npx bandit` first-time
examples before the binary availability path is explicit.

The Test Writer for this stage is Codex. Because Codex authored these RED
tests, Stage 3 implementation must route to Claude or another non-Codex model
family. During bootstrap, Claude is the first Stage 3 Writer route, with
MiniMax-M3 fallback only after auth failure or the required timeout.

## Test Files

- `test/init.test.mjs`
- `test/public-consumer-install-quickstart.test.mjs`

## RED Commands

```sh
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
```

## RED Result

Both commands fail as expected.

Key failing evidence from `node --test test/init.test.mjs`:

```text
not ok 3 - init creates model-agnostic starter governance artifacts
error: The input was expected to not match the regular expression /Codex is the PM and engineering manager/.

not ok 4 - init creates day-1 onboarding guidance in a fresh consumer repo
error: ENOENT: no such file or directory, open '/.../README.md'

not ok 6 - init preserves an existing README and writes Bandit onboarding guidance elsewhere
error: ENOENT: no such file or directory, open '/.../docs/BANDIT_ONBOARDING.md'
```

Key failing evidence from
`node --test test/public-consumer-install-quickstart.test.mjs`:

```text
not ok 1 - public README first-time command examples use install-aware invocations
error: The input was expected to not match the regular expression /^bandit init$/m.
```

The existing packed consumer quickstart still passes after the new README
assertion fails:

```text
ok 2 - packed consumer quickstart initializes a governed repo with local npx commands
```

That pass preserves the accepted `npx --no-install bandit ...` packed-install
execution path while the new RED failures isolate the remaining onboarding
hardening gaps.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| Starter `AGENTS.md` produced by `bandit init` is model-agnostic and does not declare Codex as PM or engineering manager for arbitrary consumer repos. | `init creates model-agnostic starter governance artifacts` reads generated `AGENTS.md` and rejects `Codex is the PM and engineering manager` plus Codex-owned routing language. |
| Starter clean-code and stage-rubric text does not imply Codex-only governance where Bandit roles, configured providers, or operator-selected agents are intended. | The same test reads generated `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`, rejects `Codex PM`, and requires configured roles/providers language. |
| Consumer onboarding guidance explains governance strictness, role ownership, model/provider selection, Local Qwen availability, fallback behavior, and operator-owned decisions. | `init creates day-1 onboarding guidance in a fresh consumer repo` requires generated onboarding text to mention governance strictness, role ownership, model/provider choices, Local Qwen, and operator-owned decisions. |
| The onboarding guidance is available immediately after `bandit init` in a fresh consumer repo without private Bandit repo history or chat context. | The fresh-repo init test expects `README.md` after `bandit init`; current code fails with missing `README.md`. |
| `bandit init` handles README onboarding with explicit no-overwrite behavior. | `init preserves an existing README and writes Bandit onboarding guidance elsewhere` preserves a pre-existing README and requires `docs/BANDIT_ONBOARDING.md`; current code preserves the README but fails to create the guide. |
| First-time public README command blocks use `npx --no-install bandit`, `npm exec -- bandit`, or a documented npm script until global/PATH setup exists. | `public README first-time command examples use install-aware invocations` rejects bare `bandit ...` and `npx bandit ...` for first-time commands and requires an install-aware invocation. |
| No copy-pasteable first-time command block contains bare `bandit init`, `bandit validate`, `bandit cockpit status --json`, `bandit session-context current --json`, or `bandit update-check --json` without an explicit prerequisite. | The public README test scans the README for those exact bare commands and currently fails on `bandit init`. |
| Focused tests or packed-install tests prove the day-1 documented command sequence succeeds in a fresh consumer repo. | `packed consumer quickstart initializes a governed repo with local npx commands` continues to run the packed install and installed `npx --no-install bandit` command sequence. |
| Focused tests prove no-overwrite behavior for an existing consumer README.md and existing governance artifacts. | Existing `init preserves existing starter governance artifacts` still covers governance no-overwrite; the new README test adds README preservation plus alternate onboarding guide creation. |
| The package allow-list includes any new starter onboarding template required by `bandit init` and still excludes active Bandit work history and private local state. | Stage 3 must keep `npm pack --dry-run --json` and package allow-list tests passing if it introduces a template-backed onboarding guide. |

## Test Ownership Boundary

Test Writer owns:

- `test/init.test.mjs`
- `test/public-consumer-install-quickstart.test.mjs`
- this RED evidence
- acceptance mappings in this artifact

Stage 3 Writer has zero authority to create, edit, delete, regenerate, format,
or mechanically adjust tests, test helpers, fixtures, RED evidence, acceptance
mappings, formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, roadmap/status files, or PRD/source authority files for
this Work Item.

## Stage 3 Dispatch Requirements

Dispatch Stage 3 implementation to Claude through the bootstrap Process
Adapter path. The implementation target is narrow:

- make starter governance generated by `bandit init` model-agnostic and refer
  to Bandit roles, configured agents/providers, and operator-selected role
  owners instead of Codex-specific authority;
- make `bandit init` create day-1 onboarding guidance in a fresh consumer repo;
- preserve an existing consumer README and write a clear Bandit-specific
  onboarding guide elsewhere;
- update public README first-time command examples to use `npx --no-install
  bandit`, `npm exec -- bandit`, or documented npm scripts until a
  global/PATH setup is explicit;
- keep packed-install `npx --no-install bandit init`, `validate`, `cockpit
  status --json`, and `session-context current --json` behavior working;
- update package allow-list only if the chosen onboarding implementation needs
  new packaged templates;
- do not edit Test Writer-owned files.

## Verification For Stage 2

- `node --test test/init.test.mjs` - RED, expected failures for
  Codex-specific starter governance, missing fresh-repo README, and missing
  alternate onboarding guide when README exists.
- `node --test test/public-consumer-install-quickstart.test.mjs` - RED,
  expected failure for bare README first-time command examples; existing packed
  install path still passes.

