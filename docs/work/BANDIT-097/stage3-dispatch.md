# BANDIT-097 Stage 3 Claude Dispatch

contract_version: 1
work_item: BANDIT-097
stage: Stage 3 Implementation
created_at: 2026-06-11T14:31:53Z
dispatcher: work_item_pm
writer: claude_non_codex_writer

## Mission

Implement the narrow PRD-005.4 Operator Command Adapters slice so the
Test Writer-owned RED tests in `test/bandit-work-command-adapters.test.mjs`
turn GREEN without editing any Test Writer-owned files.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-097/brief.md`
- `docs/work/BANDIT-097/orchestration-plan.md`
- `docs/work/BANDIT-097/red-evidence.md`
- `docs/work/BANDIT-097/coordination-log.jsonl`
- `src/cli.ts`
- `src/commands/repo-pm.ts`
- `src/commands/work-create-controller.ts`
- `src/commands/work-execute-controller.ts`
- `src/state/work-create-controller.ts`
- `src/state/work-execute-controller.ts`
- `src/state/coordination-log.ts`
- `src/state/roadmap-work-targets.ts`
- `src/state/stage-route-registry.ts`
- `src/state/role-input-packets.ts`
- `test/bandit-work-command-adapters.test.mjs`

## Allowed Write Surface

You may create or edit only implementation/source evidence files needed for
Stage 3:

- `src/commands/bandit-work-create.ts`
- `src/commands/bandit-work-execute.ts`
- `src/commands/work-create-controller.ts`
- `src/commands/work-execute-controller.ts`
- `src/state/work-create-controller.ts`
- `src/state/work-execute-controller.ts`
- `src/cli.ts`
- `docs/work/BANDIT-097/writer-report.md`
- `docs/work/BANDIT-097/implementation-evidence.md`

Prefer the smallest adapter/source changes that satisfy the RED tests and keep
the lower-level controller behavior authoritative.

## Forbidden Write Surface

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- `test/**`
- test helpers or fixtures
- `docs/work/BANDIT-097/red-evidence.md`
- acceptance mappings
- formation review artifacts
- `docs/work/BANDIT-097/orchestration-plan.md`
- `docs/work/BANDIT-097/coordination-log.jsonl`
- review, landing, UAT, retrospective, or closeout artifacts
- roadmap/status files
- PRD/source authority files
- dependency, lockfile, package-script, CI/release, hosted service, telemetry,
  credential, merge, push, deploy, installed global skill, external repo, local
  API, State Index, cockpit action, Trust Verifier cutover, or unrelated Phase 8
  files

A Writer edit to any Test Writer-owned surface invalidates this Stage 3
attempt.

## Implementation Requirements

- Add a public `bandit work-create` adapter as the CLI equivalent of
  `/bandit-work-create`.
- Add a public `bandit work-execute` adapter as the CLI equivalent of
  `/bandit-work-execute`.
- Keep `bandit work create` unavailable and keep `bandit context <stage>`
  unavailable.
- `work-create --json` delegates to the existing Repo PM create-controller path.
- `work-create --json` renders structured JSON with:
  `kind: "bandit_work_create_result"`, `delegate`, `status`, `work_item`,
  `stage_reached`, `evidence_written`, `blocker`,
  `required_operator_input`, `stage2_started`, and `next_safe_command`.
- On create refusal with `--json`, write the structured blocker JSON to stderr
  and exit non-zero.
- `work-create` without `--json` may render concise human text, but JSON test
  behavior is the acceptance target.
- `work-execute --json` finds the current active Work Item from
  roadmap/current-context and coordination evidence, validates formation
  readiness, delegates route decision behavior to the existing Work Item PM
  execute-controller state helper, and reports either a structured blocker or
  the ready Stage 2 route.
- `work-execute --json` must not create new Work Items.
- `work-execute --json` must report missing plan-mode evidence as
  `blocker: "missing_plan_mode"` with next safe command
  `node ./bin/bandit.mjs work-item-pm start <ID>`.
- Preserve CLI Authority: adapter output and role input packets are
  non-canonical support surfaces; canonical state remains repo-native artifacts.
- Preserve Local Qwen route restrictions by relying on the existing create
  controller and not adding any direct reviewer invocation.

## Verification Commands

Run:

```sh
node --test test/bandit-work-command-adapters.test.mjs
node --test test/work-create-controller.test.mjs
node --test test/work-execute-controller.test.mjs
npm run typecheck
```

If source changes touch broader routing than expected, also run targeted
adjacent tests as needed. Do not run Stage 4 reviewer commands.

## Evidence To Write

Write:

- `docs/work/BANDIT-097/writer-report.md`
- `docs/work/BANDIT-097/implementation-evidence.md`

Both files must state:

- changed files;
- tests run and results;
- acceptance criteria satisfied;
- clean-code self-check;
- explicit evidence that no Test Writer-owned surface was edited.

