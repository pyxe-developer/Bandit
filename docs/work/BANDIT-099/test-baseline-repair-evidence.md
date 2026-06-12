# BANDIT-099 Test Baseline Repair Evidence

contract_version: 1
work_item: BANDIT-099
stage: Stage 3 PM Acceptance
author: codex_pm_test_writer
timestamp: 2026-06-12T11:41:29Z
verdict: pass

## Reason

After Claude completed Stage 3 source changes, focused acceptance tests passed.
The full suite then exposed stale baseline expectations in tests that assumed
`bandit init` created no starter work item, no seeded Local Qwen reviewer route,
no seeded smell-trigger policy, and no seeded routing/current-context/template
files.

Those assumptions were already superseded by the public consumer scaffold from
`BANDIT-098` and the onboarding behavior in `BANDIT-099`. The repairs below
were Test Writer / Codex PM baseline updates, not Stage 3 Writer edits.

## Repaired Test Baselines

- `test/work-item-create.test.mjs`: expected user-created work items now start
  at `BANDIT-002`/`BANDIT-003` after the starter `BANDIT-001` scaffold.
- `test/draft-work.test.mjs`: expected improvement drafts now start at
  `BANDIT-002`; failed-create no-partial-write checks account for the seeded
  starter work item.
- `test/role-entrypoints-formation.test.mjs`: repo-pm created work item now
  expects `BANDIT-002`.
- `test/stage-capability-scope.test.mjs`: generated brief lookup now uses
  `BANDIT-002`.
- `test/token-cost-failsafe.test.mjs`: generated brief lookup now uses
  `BANDIT-002`.
- `test/cockpit-status.test.mjs`: the missing-current-context fixture removes
  the seeded `docs/roadmap/CURRENT_CONTEXT.md`.
- `test/landing-gates.test.mjs`: the omitted-template fixture removes the
  seeded landing-verdict template after init.
- `test/local-qwen-review.test.mjs`: the missing-profile fixture removes the
  seeded `.bandit/reviewers/local-qwen.json`.
- `test/routing.test.mjs`: missing smell-catalog and omitted-template fixtures
  remove seeded policy/template files after init.
- `test/work-create-controller.test.mjs`: the missing Local Qwen route fixture
  removes the seeded `.bandit/reviewers/local-qwen.json`.

## Verification

Focused reruns passed:

- `node --test test/init.test.mjs`
- `node --test test/public-consumer-install-quickstart.test.mjs`
- `node --test test/private-install-update-channel.test.mjs`
- `node --test test/work-item-create.test.mjs`
- `node --test test/draft-work.test.mjs`
- `node --test test/stage-capability-scope.test.mjs`
- `node --test test/token-cost-failsafe.test.mjs`
- `node --test test/local-qwen-review.test.mjs`
- `node --test test/routing.test.mjs`
- `node --test test/cockpit-status.test.mjs`
- `node --test test/landing-gates.test.mjs`
- `node --test test/work-create-controller.test.mjs`
- `node --test test/role-entrypoints-formation.test.mjs`

Broad verification passed:

- `npm test` passed 650/650 tests.
- `npm run typecheck` passed.
- `git diff --check` passed.
- `npm pack --dry-run --json` passed with 200 package entries.

## Boundary Statement

The Stage 3 Implementation Writer did not edit tests, fixtures, RED evidence,
acceptance mappings, or Test Writer-owned evidence. Test baseline repairs were
owned by Codex PM / Test Writer after PM verification found repository-wide
fixture drift.
