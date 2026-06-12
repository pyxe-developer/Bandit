# BANDIT-099 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-099
stage: Stage 3 Implementation
author: claude_implementation_writer
model_family: claude-sonnet-4-6
timestamp: 2026-06-12T11:28:14Z

## Surfaces Inspected

- `docs/work/BANDIT-099/brief.md` — read for acceptance criteria and scope
- `docs/work/BANDIT-099/orchestration-plan.md` — read for stage checklist
- `docs/work/BANDIT-099/red-evidence.md` — read for failing test assertions
- `test/init.test.mjs` — read to understand exact assertions (not edited)
- `test/public-consumer-install-quickstart.test.mjs` — read for README assertions (not edited)
- `src/commands/init.ts` — read and edited (starter governance constants + seedStarterGovernance)
- `README.md` — read and edited (command example fixes)
- `CLEAN_CODE.md` — read for compliance rubric
- `docs/verification/STAGE_RUBRICS.md` — read for stage rubric context
- `package.json` — read to verify allow-list; no edits needed
- `test/helpers/bandit-cli.mjs` — read to understand how tests invoke the CLI (not edited)

## Source Edits Made

**Yes**, two source files were edited:

### 1. `src/commands/init.ts`

Changes:
- `STARTER_AGENTS_MD`: removed "Codex is the PM and engineering manager" and
  "Codex owns routine technical routing decisions" language; replaced with
  "The Work Item PM role is held by your operator-selected PM agent. Configured
  agents and providers carry out routine technical routing decisions."
- `STARTER_CLEAN_CODE_MD`: replaced three occurrences of "Codex PM" with
  "Work Item PM" / "The Work Item PM".
- `STARTER_STAGE_RUBRICS_MD`: replaced "Codex PM," with "configured PM roles,".
- Added `STARTER_ONBOARDING_MD` constant (~45 lines) with onboarding content
  covering governance strictness, role ownership, model/provider choices, Local
  Qwen, operator-owned decisions, and install-aware init/validate commands.
- Updated `seedStarterGovernance` to: write README.md from `STARTER_ONBOARDING_MD`
  when no README exists; write `docs/BANDIT_ONBOARDING.md` when README exists.

### 2. `README.md`

Changes:
- Install section: replaced `npx bandit init`, `npx bandit validate`,
  `npx bandit cockpit status --json`, `npx bandit session-context current --json`
  with `npx --no-install bandit ...` forms.
- Current Operator Commands section: replaced bare `bandit init`, `bandit validate`,
  `bandit list`, `bandit show`, `bandit cockpit status --json`,
  `bandit session-context current --json`, `bandit update-check --json` with
  `npx --no-install bandit ...` forms; updated prose from `npx bandit <command>`
  to `npx --no-install bandit <command>`.
- Update-check section: replaced `npx bandit update-check --json` with
  `npx --no-install bandit update-check --json`.

## Test Ownership Boundary

**Enforced**. Zero edits to test files, helpers, fixtures, RED evidence,
orchestration plan, coordination log, bootstrap-gap ledger, roadmap, current
context, or STATUS files.

Confirmed via `git diff HEAD -- test/init.test.mjs test/public-consumer-install-quickstart.test.mjs`:
only Codex Stage 2 additions visible; no Stage 3 writer changes.

## Commands Run And Outcomes

| Command | Outcome |
| --- | --- |
| `git diff --stat HEAD` | Confirmed modified files; Stage 3 changes limited to README.md + src/commands/init.ts |
| `git diff HEAD -- test/init.test.mjs test/...` | Confirmed zero Stage 3 test edits |
| `grep -n "Codex" src/commands/init.ts` | Confirmed zero remaining Codex references in starter governance constants |
| `grep -n "^bandit \|^npx bandit " README.md` | Confirmed remaining bare lines (repo-pm, work-item-pm, work-create, work-execute) are not in the test rejection list |
| `grep -n "npx --no-install bandit init\|npm run bandit -- ..." README.md` | Confirmed all three required install-aware patterns are present |
| `git diff HEAD -- README.md src/commands/init.ts` | Verified diff matches implementation intent |
| `node --test test/init.test.mjs` | **BLOCKED** — session approval required |
| `node --test test/public-consumer-install-quickstart.test.mjs` | **BLOCKED** — session approval required |
| `node --test test/private-install-update-channel.test.mjs` | **BLOCKED** — session approval required |
| `npm run typecheck` | **BLOCKED** — session approval required |
| `npm pack --dry-run --json` | **NOT ATTEMPTED** — session blocked |

## Verification Blocker

All shell command execution requires interactive user approval in this Claude
Code session. The approval prompt fired for every `node`, `npm`, and `npx`
invocation. This is a session-level permission mode setting, not an
implementation failure.

Static analysis covering every test assertion was completed manually and
documented in `implementation-evidence.md`.

## Package Allow-List Assessment

No new template files were introduced. `STARTER_ONBOARDING_MD` is inlined in
`src/commands/init.ts`, which is already distributed via the `src` directory in
`package.json` `files`. `package.json` was not modified. The package allow-list
test (`test/private-install-update-channel.test.mjs`) must be confirmed by PM
acceptance.

## Risks For PM Acceptance

1. **Test execution required**: PM acceptance must run the four required commands
   before Stage 4 review. The static analysis is complete but actual execution
   was not possible in this session.
2. **Idempotency edge**: On second `bandit init` in a repo where the first init
   created README.md, the current logic will attempt to write `docs/BANDIT_ONBOARDING.md`.
   This is not covered by an existing idempotency test assertion and should be
   confirmed as acceptable behavior.
3. **No other risks identified**: implementation is minimal (two files, targeted
   text replacements, one new constant, 11 lines of branch logic).
