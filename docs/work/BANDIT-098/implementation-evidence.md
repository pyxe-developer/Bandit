# BANDIT-098 Implementation Evidence

contract_version: 1
work_item: BANDIT-098
stage: Stage 3 Implementation
author: claude_implementation_writer
model_family: claude_non_codex
model_id: claude-sonnet-4-6
timestamp: 2026-06-12T01:27:14Z
source_head: 105f231cbe96bbc1ce4ae371ad4b37a279bcf910
verdict: pending_test_verification

## Writer Identity And Model Family

Writer: Claude (claude-sonnet-4-6), non-Codex model family. Dispatched as the
Stage 3 Implementation Writer per the bootstrap model-family separation rule
because Codex authored Stage 2 RED tests.

## Test-Surface Edit Statement

Stage 3 made zero test-surface edits. No files under `test/` were created,
modified, deleted, or mechanically adjusted during this retry. The following
test surfaces remain exactly as authored by the Test Writer (Codex):

- `test/init.test.mjs`
- `test/public-consumer-install-quickstart.test.mjs`
- `test/private-install-update-channel.test.mjs`
- `test/update-channel.test.mjs`

## Code Path Mapped To Acceptance Criteria

### AC: Governance scaffold artifacts created in fresh consumer repo

`initBandit()` in `src/commands/init.ts` calls `seedStarterGovernance(repoRoot)`
at line 361, after `seedDistributionDefaults(repoRoot)` at line 360 and before
the `alreadyInitialized` check at line 363.

`seedStarterGovernance` (lines 789-798) iterates over `STARTER_GOVERNANCE_FILES`
(a `ReadonlyArray<{ relativePath, contents }>`) and for each entry:
1. Resolves the full path in the consumer repo
2. Skips the write if the file already exists (`pathExists` guard at line 792)
3. Creates the parent directory with `mkdir(..., { recursive: true })`
4. Writes file contents with `writeFile`

Files created (`STARTER_GOVERNANCE_FILES` lines 762-787):
- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/plans/BOOTSTRAP_METHODOLOGY.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `docs/work/BANDIT-001/brief.md`

All content is consumer-neutral: it does not import Bandit's active work history,
internal roadmap queue, reviewer evidence, or private local assumptions.

### AC: Preserve existing user-owned governance files

The `pathExists` guard in `seedStarterGovernance` skips every existing file
without modification. Test case "init preserves existing starter governance
artifacts" in `test/init.test.mjs` pre-creates `AGENTS.md`, `CLEAN_CODE.md`,
`docs/roadmap/CURRENT_CONTEXT.md`, and `STATUS.md` with custom content and
verifies those contents are unchanged after `bandit init`.

### AC: cockpit status exits 0 with required_operator_input.value none_required

`readCockpitStatus` in `src/state/cockpit-status.ts` reads:

- `docs/roadmap/CURRENT_CONTEXT.md`: `STARTER_CURRENT_CONTEXT_MD` (init.ts lines
  669-690) contains `**Phase:** 0 - Consumer Onboarding.`, `**Active work item:**
  \`BANDIT-001\``, `**Current next action:** Complete Stage 1 brief formation for
  BANDIT-001.`, and `## Required Operator Input` section with the text "No
  operator-owned input is required for the starter onboarding step."
- `docs/roadmap/ROADMAP.md`: `STARTER_ROADMAP_MD` (init.ts lines 692-714)
  contains `**Current next step:** Complete Stage 1 brief formation for BANDIT-001.`
  This text matches the CURRENT_CONTEXT next action after normalization, so
  `nextActionsAgree` (cockpit-status.ts line 805) returns `"normalized_text"`.
- `.bandit/bootstrap-gaps.json`: seeded as `{ version: 1, gaps: [] }` by
  `writeDefaultBootstrapGapLedger`, so no open gaps and no blockers.
- `docs/work/BANDIT-001/brief.md`: `STARTER_STARTER_BRIEF_MD` (init.ts lines
  733-760) has valid `# BANDIT-001: Consumer Onboarding Starter` header; Status
  section contains "Starter ready." (not "closed").

`readRequiredOperatorInput` uses regex `/No operator-owned input is required/i`
(cockpit-status.ts line 919), which matches the CURRENT_CONTEXT content.
Returns `"none_required"`. Payload includes `required_operator_input.value: "none_required"`. OK.

### AC: session-context exits 0 with required_operator_input.value none_required

`readFocusedSessionContext` in `src/state/focused-session-context.ts` requires:
- `AGENTS.md`: created by `seedStarterGovernance`. OK.
- `docs/roadmap/CURRENT_CONTEXT.md`: created with all required labeled fields. OK.
- `docs/roadmap/ROADMAP.md`: created with `**Current next step:**`. OK.
- `.bandit/bootstrap-gaps.json`: empty gaps, no blockers. OK.

`requireCurrentStage` (focused-session-context.ts lines 502-503) matches regex
`/The current stage is (Stage [^.]+)\./` against the CURRENT_CONTEXT content which
contains "The current stage is Stage 1: starter_ready." Extracts "Stage 1: starter_ready". OK.

`readRequiredOperatorInput` returns `"none_required"`. OK.

### AC: Package allow-list correct for public distribution

`package.json` `files` array (verified by reading the file):
```
"bin", "src", "docs/templates",
"!docs/templates/private-install-update-channel.md",
".bandit/policy/install-update-channel.json",
".bandit/policy/smell-triggers.json",
".bandit/reviewers/local-qwen.json",
"README.md"
```

Assertions from `test/private-install-update-channel.test.mjs` lines 39-44:
- `files.includes(".bandit/policy/install-update-channel.json")` → true. OK.
- `files.includes("docs/templates/install-update-channel.md")` → true. OK.
- `files.includes("docs/templates/update-channel.md")` → true. OK.
- `files.includes(".bandit/policy/private-install-update-channel.json")` → false. OK.
- `files.includes("docs/templates/private-install-update-channel.md")` → false. OK.

Forbidden prefixes `.bandit/events`, `.bandit/bootstrap-gaps`, `docs/work/`,
`test/` are absent from the `files` array. OK.

### AC: Update-channel wording is public-distribution neutral

`src/commands/update-check.ts`: "Configured private update source is unreachable"
changed to "Configured update source is unreachable."

`src/state/update-channel.ts`: Default fallback update command changed from
`npm install -D <private-source>#${manifest.latestRef}` to
`npm install -D bandit-workflow@${manifest.latestVersion}`.

`update-channel.test.mjs` line 61 asserts
`assert.match(updatePayload.update_command, /npm install -D/)` which matches the
new format. OK.

### AC: validate exits 0 after init in fresh consumer repo

`validateBandit` requires `.bandit/config.toml` (`writeDefaultConfig`),
`.bandit/events.jsonl` (`appendLifecycleEvent`), all policy files
(`writeDefault*` calls), `docs/templates/*.md` (`seedTemplates` from package
root), `.bandit/reviewers/local-qwen.json` (`SEED_FILES`),
`docs/work/BANDIT-001/brief.md` (valid format), and empty bootstrap gaps.
All satisfied by `initBandit`. OK.

### AC: Remove "private": true and add publishConfig for public npm

`package.json` removes `"private": true` and adds `"publishConfig": { "access":
"public" }`, `"description"`, `"keywords"`, `"repository"`, `"bugs"`, and
`"homepage"`. Verified by reading the file directly. OK.

## Test Execution Status

Commands attempted but blocked by permission mode:

```
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
npm run typecheck
npm pack --dry-run --json
```

Each returned "This command requires approval." No test output was produced.

**PM acceptance must run the following before accepting Stage 3:**

```sh
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
npm run typecheck
npm pack --dry-run --json
node --test test/private-install-update-channel.test.mjs
node --test test/update-channel.test.mjs
```

Static analysis indicates all tests will pass. The implementation is complete
and code paths satisfy each acceptance criterion. Runtime verification is required
before PM acceptance.

## Clean-Code Self-Check Against CLEAN_CODE.md

1. **Spec alignment**: PASS. `seedStarterGovernance` creates exactly the 8
   governance files + BANDIT-001 brief listed in acceptance criteria. No extra state.
2. **Small surface area**: PASS. Diff adds one call-site line at `init.ts:361`
   and one function plus string constants. No unrelated changes.
3. **Simple design**: PASS. Function is a linear loop over a read-only array of
   `{ relativePath, contents }` pairs with a `pathExists` guard.
4. **Explicit state**: PASS. All new state is explicit files written to named
   paths. No hidden side effects.
5. **No hidden authority**: PASS. `seedStarterGovernance` writes files but does
   not claim to own canonical workflow state. Governance files are consumer-owned
   from the moment they are created.
6. **Testable behavior**: PASS. `test/init.test.mjs` covers scaffold creation,
   preserve-on-exists, idempotency, and validate/cockpit/session-context outcomes.
   `test/public-consumer-install-quickstart.test.mjs` covers the packed install path.
7. **Readable flow**: PASS. Code path: call → loop over `STARTER_GOVERNANCE_FILES`
   → skip if exists → `mkdir` + `writeFile`. Each constant is named for its destination.
8. **Locality**: PASS. All governance seeding logic is in `seedStarterGovernance`
   in `init.ts`.
9. **Failure clarity**: PASS. `pathExists` and file write use native fs errors.
   No silent swallowing.
10. **No role erosion**: PASS. Zero test files edited. Roles preserved.

## Remaining Gaps

**Test execution gap (non-blocking for evidence, blocking for PM acceptance):**
Shell commands required user approval and could not be run. PM acceptance must
execute the test commands listed above before signing off.
