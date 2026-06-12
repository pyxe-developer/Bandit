# BANDIT-098 Stage 3 Claude Dispatch

contract_version: 1
work_item: BANDIT-098
stage: Stage 3 Implementation
created_at: 2026-06-12T00:07:00Z
dispatcher: work_item_pm
writer: claude_non_codex_writer

## Mission

Implement the narrow public consumer install quickstart and governance scaffold
chore so the Test Writer-owned RED tests in `test/init.test.mjs` and
`test/public-consumer-install-quickstart.test.mjs` turn GREEN without editing
any Test Writer-owned files.

The core failure is that `bandit init` initializes `.bandit` state but does not
create starter governance artifacts required by `bandit cockpit status --json`
and `bandit session-context current --json` in a fresh consumer repository.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-098/brief.md`
- `docs/work/BANDIT-098/orchestration-plan.md`
- `docs/work/BANDIT-098/red-evidence.md`
- `docs/work/BANDIT-098/coordination-log.jsonl`
- `docs/reports/public-consumer-install-command-audit-2026-06-11.md`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/commands/cockpit.ts`
- `src/commands/session-context.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/state/cockpit-status.ts`
- `src/state/focused-session-context.ts`
- `src/state/update-channel.ts`
- `src/commands/update-check.ts`
- `package.json`
- `README.md`

## Allowed Write Surface

You may create or edit only implementation/source evidence files needed for
Stage 3:

- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/commands/cockpit.ts`
- `src/commands/session-context.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/state/cockpit-status.ts`
- `src/state/focused-session-context.ts`
- `src/state/update-channel.ts`
- `src/commands/update-check.ts`
- `README.md`
- `package.json`
- `.bandit/policy/install-update-channel.json`
- `.bandit/policy/private-install-update-channel.json`
- `docs/templates/install-update-channel.md`
- `docs/templates/private-install-update-channel.md`
- `docs/templates/update-channel.md`
- any new consumer-neutral starter template files under `docs/templates/`
- `docs/work/BANDIT-098/writer-report.md`
- `docs/work/BANDIT-098/implementation-evidence.md`

Prefer the smallest source changes that satisfy the RED tests and approved
brief. Existing uncommitted source changes in this allowed surface are
pre-existing `BANDIT-098` material; inspect them and either preserve, complete,
or simplify them as needed. Account for them in implementation evidence.

## Forbidden Write Surface

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- `test/**`
- test helpers or fixtures
- `docs/work/BANDIT-098/red-evidence.md`
- acceptance mappings
- formation review artifacts
- `docs/work/BANDIT-098/orchestration-plan.md`
- `docs/work/BANDIT-098/coordination-log.jsonl`
- review, landing, UAT, retrospective, or closeout artifacts
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/events.jsonl`
- PRD/source authority specs and audit reports
- dependency, lockfile, package-script, CI/release, hosted service, telemetry,
  credential, merge, push, deploy, installed global skill, external repo,
  local API, State Index, cockpit action, Trust Verifier cutover, or unrelated
  Phase 8 files

A Writer edit to any Test Writer-owned surface invalidates this Stage 3
attempt.

## Implementation Requirements

- Make `bandit init` create starter governance artifacts for a fresh consumer
  repository:
  - `AGENTS.md`
  - `CONTEXT.md`
  - `CLEAN_CODE.md`
  - `docs/plans/BOOTSTRAP_METHODOLOGY.md`
  - `docs/verification/STAGE_RUBRICS.md`
  - `docs/roadmap/CURRENT_CONTEXT.md`
  - `docs/roadmap/ROADMAP.md`
  - `STATUS.md`
- Preserve existing user-owned governance files without silent overwrite.
- Starter governance artifacts must be consumer-neutral starter contracts. Do
  not copy Bandit's active work history, reviewer evidence, roadmap queue,
  private local assumptions, or current project status into consumer repos.
- After `bandit init` in a fresh consumer repo, these must pass:
  - `bandit validate`
  - `bandit cockpit status --json`
  - `bandit session-context current --json`
- Ensure the packed package includes any starter templates or policy files
  needed for installed-package init, while excluding active `docs/work/**`
  history, tests, local reports, private compatibility aliases, and repo-local
  workflow state not needed for consumer onboarding.
- Keep README consumer commands copy-paste safe: establish the npm project
  boundary, prefer the current GitHub install path until npm is published, use
  `npx --no-install bandit` / `npm exec -- bandit` / documented npm script
  forms after local installation, and avoid unsafe literal placeholders in
  copy-paste shell blocks.
- Preserve update-channel behavior as manual, non-blocking, and data-minimal.
- Do not add public npm publish automation, credential handling, hosted
  services, telemetry, automatic self-update, merge/push/deploy authority, or
  external repo mutation outside explicit local onboarding files.

## Verification Commands

Run:

```sh
node --test test/init.test.mjs
node --test test/public-consumer-install-quickstart.test.mjs
node --test test/private-install-update-channel.test.mjs
node --test test/update-channel.test.mjs
node --test test/focused-session-context.test.mjs
node --test test/cockpit-status.test.mjs
npm pack --dry-run --json
npm run typecheck
```

If source changes touch broader CLI startup or shared validation paths, also
run adjacent focused tests as needed. Do not run Stage 4 reviewer commands.

## Evidence To Write

Write:

- `docs/work/BANDIT-098/writer-report.md`
- `docs/work/BANDIT-098/implementation-evidence.md`

Both files must state:

- changed files;
- tests run and results;
- acceptance criteria satisfied;
- clean-code self-check against `CLEAN_CODE.md`, including naming and clarity,
  single responsibility, dead-code removal, no commented-out production code,
  adequate comments or README updates, focused coverage for changed logic, and a
  short signed affirmation that the check was performed;
- how pre-existing dirty source changes were handled;
- explicit evidence that no Test Writer-owned surface was edited.
