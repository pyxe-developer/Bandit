# BANDIT-071 Stage 3 Implementation Dispatch

role: implementation_writer
model_family_requirement: claude
work_item: BANDIT-071
source_stage: Stage 2 RED evidence
verdict: implementation_required

## Mission

Implement the smallest source/chore change needed to satisfy the
Codex-authored `BANDIT-071` RED tests for private installability and the
repo-local update notification channel.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-071/brief.md`
- `docs/work/BANDIT-071/orchestration-plan.md`
- `docs/work/BANDIT-071/red-evidence.md`
- `docs/artifact-inputs/BANDIT-071-red-evidence.json`
- `test/private-install-update-channel.test.mjs`
- `test/update-channel.test.mjs`
- `bin/bandit.mjs`
- `package.json`
- `package-lock.json`
- `src/cli.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/state/config.ts`

## Allowed Source Surfaces

- `package.json`
- `package-lock.json`
- `bin/bandit.mjs`
- `README.md`
- `.bandit/policy/private-install-update-channel.json`
- `docs/templates/private-install-update-channel.md`
- `docs/templates/update-channel.md`
- `src/cli.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/commands/update-check.ts`
- `src/state/update-channel.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/state/config.ts`
- narrowly related CLI/init/template/path helpers only if required by the RED
  tests
- `docs/work/BANDIT-071/writer-report.md`
- `docs/work/BANDIT-071/implementation-evidence.md`

## Forbidden Surfaces

Do not edit tests, test helpers, fixtures, RED evidence, install-smoke
evidence, package allow-list acceptance mappings, update-channel acceptance
mappings, formation evidence, orchestration plan evidence, review evidence,
landing evidence, UAT evidence, retrospective evidence,
`docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
`.bandit/bootstrap-gaps.json`, `.bandit/events.jsonl`, public npm publishing,
paid private registry setup, hosted external services, automatic self-update,
telemetry, merge, push, deploy, Trust Verifier cutover, guarded browser action
execution, local API, State Index, scheduler, claim/worktree lifecycle, or
unrelated Phase 8 cockpit/product scope.

## Expected Behavior

- Keep public npm publishing out of scope. The package may remain `private:
  true`, but `npm pack` and private file/Git/tag installs must work.
- Make installed CLI execution work without this development checkout's
  existing `node_modules`. Prefer the smallest runtime/package change; if the
  bin continues to use `tsx`, it must be a production dependency in packed
  installs. Avoid adding a build system unless necessary.
- Scope package contents intentionally. `npm pack --dry-run --json` must exclude
  `.bandit/events*`, `.bandit/bootstrap-gaps*`, `docs/work/**`, and `test/**`,
  while including the CLI, package metadata, source/runtime files, and the
  private install/update policy/template artifacts required by the tests.
- Ensure a fresh installed consumer repo can run `bandit init`, `bandit
  validate`, and `bandit update-check --json` from the installed package.
  Repair init/default-template completeness if packed install smoke exposes a
  missing-template validation gap.
- Add `bandit update-check [--json]`.
- Read optional repo-local `.bandit/update-channel.json` metadata with:
  contract version, enabled flag, package name, installed version, source
  channel, current source ref, check cadence, file-based private update source,
  and alert enabled flag.
- Compare file-source private release metadata to the installed version/ref and
  emit deterministic `unconfigured`, `disabled`, `unreachable`, `current`, or
  `update_available` status. Unreachable and disabled are non-blocking.
- Write `.bandit/update-channel-cache.json` after successful manual checks and
  keep cache data-minimal.
- Normal CLI commands should emit a concise non-blocking update alert to stderr
  only from a fresh cached `update_available` result, without masking the
  requested command's stdout, stderr, or exit status.
- Do not send telemetry, repo contents, workflow state, user activity,
  package usage, model-call metadata, review packets, or hidden identifiers.
- Automatic self-update remains out of scope; update output may include an
  explicit `npm install -D <private-source>#<tag>` style command.

## Verification

Run at minimum:

```sh
node --test test/private-install-update-channel.test.mjs
node --test test/update-channel.test.mjs
npm run typecheck
```

If those pass, also run:

```sh
npm test
npm run bandit -- validate
git diff --check
```

Do not edit the RED tests to make them pass. If a test appears wrong, stop and
record the blocker instead of changing the test surface.

## Evidence To Write

Write:

- `docs/work/BANDIT-071/writer-report.md`
- `docs/work/BANDIT-071/implementation-evidence.md`

Both artifacts must list files changed, verification run, skipped checks, and
confirm zero test-surface edits by the Stage 3 Writer.
