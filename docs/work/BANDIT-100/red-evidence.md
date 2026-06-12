# BANDIT-100 RED Evidence

contract_version: 1
work_item: BANDIT-100
stage: Stage 2 Test Design And RED Evidence
author: codex_test_writer
timestamp: 2026-06-12T16:57:56Z
verdict: pass
coordination_state: red_recorded_pending
stage3_route_required: claude_non_codex_writer

## Summary

Focused Test Writer-owned RED tests define the project-profile and
identity-clean init contract before implementation. The current code fails
because `bandit init` ignores `--profile`, does not validate malformed profile
fields, still writes `work_item_prefix = "BANDIT"` for a profile-initialized
repo, and `draft-work` only accepts `BANDIT-PRD-*` H1 identifiers instead of a
configured PRD prefix with BANDIT back-compat.

The Test Writer for this stage is Codex. Because Codex authored these RED
tests, Stage 3 implementation must route to Claude or another non-Codex model
family. During bootstrap, Claude is the first Stage 3 Writer route, with
MiniMax-M3 fallback only after auth failure or the required timeout.

## Test Files

- `test/init.test.mjs`
- `test/draft-work.test.mjs`

## RED Commands

```sh
node --test test/init.test.mjs
node --test test/draft-work.test.mjs
```

## RED Result

Both commands fail as expected.

Key failing evidence from `node --test test/init.test.mjs`:

```text
not ok 2 - init --profile rejects malformed profiles with field diagnostics
error: Expected values to be strictly equal:
0 !== 1

not ok 4 - init --profile scaffolds a consumer repo under its configured identity
error: The input did not match the regular expression /work_item_prefix = "ACME"/.
Input:
'state_version = 1
work_item_prefix = "BANDIT"
'
```

Key failing evidence from `node --test test/draft-work.test.mjs`:

```text
not ok 4 - draft-work parses configured PRD prefix while preserving BANDIT PRD back-compat
error: Malformed Feature PRD: missing ID-bearing H1
1 !== 0
```

Existing init and draft-work tests continue to pass around the new failures,
which keeps the RED signal focused on the missing profile path and configured
PRD-prefix parsing.

## Acceptance Mapping

| Acceptance criterion | RED coverage |
| --- | --- |
| `init --profile` fails malformed profiles with diagnostics naming the offending field. | `init --profile rejects malformed profiles with field diagnostics` writes a malformed `work_item_prefix` and expects exit code 1 with `work_item_prefix` in stderr. Current code exits 0 because `--profile` is ignored. |
| Scaffold from an ACME profile contains no `BANDIT-001`, no `Phase 0 - Consumer Onboarding`, and no Bandit roadmap strings. | `init --profile scaffolds a consumer repo under its configured identity` expects ACME config, `docs/work/ACME-001/brief.md`, ACME routing/status text, `docs/templates/project-profile.md`, and rejects `BANDIT-001`, `Phase 0 - Consumer Onboarding`, `Bandit's active work history`, and `internal roadmap queue`. Current code writes BANDIT defaults. |
| `bandit validate` passes on a fresh profile-initialized repo. | The same profile-init test runs `bandit validate` after the ACME scaffold. Current code fails before this assertion because the scaffold is still BANDIT-owned. |
| `draft-work` parses `# ACME-PRD-1:` headers in an ACME-configured repo. | `draft-work parses configured PRD prefix while preserving BANDIT PRD back-compat` writes `.bandit/config.toml` with `work_item_prefix = "ACME"` and an `ACME-PRD-1` source PRD. Current code rejects the H1 as malformed. |
| `draft-work` still parses `BANDIT-PRD-*` documents. | The same draft-work test creates a `BANDIT-PRD-912` source after the ACME source and expects a second `ACME-*` work item preserving `Source PRD: BANDIT-PRD-912`. Current code has not reached this assertion because ACME PRD parsing fails first. |

## Test Ownership Boundary

Test Writer owns:

- `test/init.test.mjs`
- `test/draft-work.test.mjs`
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

- define a versioned project-profile contract with field diagnostics for
  malformed profiles;
- wire `bandit init --profile <file>` to validate and scaffold deterministic
  repo-native state under the configured project identity;
- write `work_item_prefix = "ACME"` and starter routing/status/work artifacts
  for the configured prefix without `BANDIT-001`, `Phase 0 - Consumer
  Onboarding`, or Bandit-internal roadmap leakage;
- ship `docs/templates/project-profile.md` as the profile template surface;
- parameterize `draft-work` PRD H1 parsing by configured prefix while keeping
  `BANDIT-PRD-*` source documents accepted for compatibility;
- keep Stage 3 away from tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, retrospective evidence, roadmap/status files, PRD/source
  authority files, public npm publish automation, credentials, hosted services,
  telemetry, automatic self-update, external repo mutation, installed global
  skill mutation, automation prompt mutation, merge/push/deploy authority,
  Trust Verifier cutover, old-gate replacement or wrapping, local API, State
  Index, guarded browser action execution, `BANDIT-101` through `BANDIT-103`,
  V0 trial work, and unrelated Phase 8 scope.
