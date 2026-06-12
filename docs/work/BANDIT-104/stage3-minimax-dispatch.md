# BANDIT-104 Stage 3 MiniMax Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-104`.

Use MiniMax-M3 as the implementation writer. You are not the Test Writer,
reviewer, Landing Agent, Repo PM, or Work Item PM.

## Context Root

Repository: `/Users/matthewflebbe/Bandit`

Work item: `BANDIT-104`

Brief: `docs/work/BANDIT-104/brief.md`

Orchestration plan: `docs/work/BANDIT-104/orchestration-plan.md`

RED evidence: `docs/work/BANDIT-104/red-evidence.md`

Coordination log: `docs/work/BANDIT-104/coordination-log.jsonl`

## Stage 3 Trigger Evidence

`docs/work/BANDIT-104/coordination-log.jsonl` records sequence 4
`red_recorded` with `safe_triggers: ["implementation_required"]`.

`node ./bin/bandit.mjs work-execute --json` still returns a stale Stage 2 route
after `red_recorded`; that is the regression this work item fixes. Do not use
the stale Stage 2 route as authority to edit tests or recreate RED evidence.

## Goal

Implement the missing `work-execute --json` route derivation so route selection
comes from the latest accepted append-only coordination state and evidence
presence, not from a hardcoded or caller-supplied Stage 2 request.

## Allowed Source Files

You may edit only source and Stage 3 writer evidence needed for this work:

- `src/state/work-execute-controller.ts`
- `src/commands/bandit-work-execute.ts`
- `src/state/stage-route-registry.ts`
- `src/commands/work-execute-controller.ts` only if needed to keep the internal resolver command honest
- `docs/work/BANDIT-104/writer-report.md`
- `docs/work/BANDIT-104/implementation-evidence.md`

Ask Work Item PM by stopping with a blocker if you believe any other file must
be edited.

## Forbidden Files And Surfaces

Do not edit, format, regenerate, or mechanically adjust:

- `test/work-execute-controller.test.mjs`
- `test/bandit-work-command-adapters.test.mjs`
- `test/stage-route-registry.test.mjs`
- any other file under `test/`
- `docs/work/BANDIT-104/red-evidence.md`
- `docs/work/BANDIT-104/orchestration-plan.md`
- `docs/work/BANDIT-104/coordination-log.jsonl`
- `docs/work/BANDIT-104/brief.md`
- formation-review artifacts
- review, landing, retrospective, roadmap, status, PRD, or bootstrap-gap files
- dependencies, lockfiles, CI/release workflows, publish automation, hosted services, telemetry, Trust Verifier cutover, claim authority, cockpit UI, State Index, or Local Qwen reviewer routing

If you touch a test-owned file, the Stage 3 attempt is invalid.

## Required Behavior

1. `formation_approved` without `orchestration-plan.md` remains blocked with
   `missing_plan_mode` and next command
   `node ./bin/bandit.mjs work-item-pm start <ID>`.
2. `orchestration_plan_recorded` with plan-mode evidence returns the Stage 2
   RED route and truthful Stage 2 status.
3. `red_recorded` with RED evidence returns the Stage 3 implementation route
   and truthful Stage 3 status.
4. `red_recorded` without RED evidence fails closed with
   `missing_red_evidence`.
5. Unsupported or blocked coordination states fail closed with
   `unsupported_coordination_state`; they must not fabricate readiness.
6. The Stage 3 route registry uses `minimax_m3` as the first implementation
   writer, `claude` as fallback, and
   `minimax_m3_failure_or_20_minute_timeout` as fallback trigger.
7. Keep repo-native append-only coordination history as source of truth.
   `work-execute`, cockpit status, and session-context are derived projections.

## RED Tests To Satisfy

Run:

```sh
node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs
```

The RED evidence recorded these expected failures before implementation:

- public adapter returned `Stage 2: ready_for_red` after `red_recorded`;
- route registry reported Claude instead of MiniMax-M3 as first Stage 3 writer;
- controller selection rejected executable states after `formation_approved`;
- controller returned Stage 2 for `red_recorded`;
- controller returned ready for unsupported/contradictory states.

## Verification Commands

Run:

```sh
node --test test/bandit-work-command-adapters.test.mjs test/work-execute-controller.test.mjs test/stage-route-registry.test.mjs
npm run typecheck
```

If shared projection behavior changes beyond those files, also run:

```sh
npm test
```

## Required Writer Artifacts

Create:

- `docs/work/BANDIT-104/writer-report.md`
- `docs/work/BANDIT-104/implementation-evidence.md`

The artifacts must record:

- MiniMax-M3 writer identity;
- source files changed;
- verification commands and observed results;
- confirmation that no tests, fixtures, RED evidence, acceptance mappings,
  coordination log, roadmap, or status files were edited by the Writer;
- any blockers encountered.

## Clean-Code Expectations

Keep the implementation small and readable. Prefer explicit state-to-route
mapping over hidden conditionals. Preserve clear fail-closed errors. Do not
introduce hidden state authority, unrelated refactors, or broad orchestration
logic.
