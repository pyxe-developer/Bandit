# BANDIT-093 Stage 3 Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-093` - Roadmap Work
Target Resolver.

## Required Context

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-093/brief.md`
- `docs/work/BANDIT-093/orchestration-plan.md`
- `docs/work/BANDIT-093/red-evidence.md`
- `docs/work/BANDIT-093/coordination-log.jsonl`
- `test/roadmap-work-targets.test.mjs`
- existing command/state patterns in `src/cli.ts`, `src/commands/*.ts`, and
  `src/state/*.ts`

## Task

Implement the smallest source change that makes:

```sh
node --test test/roadmap-work-targets.test.mjs
```

pass.

The missing behavior is a deterministic `bandit roadmap-work-targets resolve
--json` command that reads `docs/roadmap/ROADMAP.md` and
`docs/roadmap/CURRENT_CONTEXT.md` as priority authority surfaces and returns a
derived, non-canonical current or next authorized work target.

## Acceptance Requirements

- Return a JSON report with `kind: "roadmap_work_target_resolution"` and
  `authority: "derived_non_canonical"`.
- For an active work item, return target id, title, work type, status,
  relationship, source artifacts, and provenance pointers.
- For closed-work interstitial state, return a `TBD` `not_yet_formed` next
  target rather than inventing an active work item.
- Fail closed when `CURRENT_CONTEXT.md` and `ROADMAP.md` disagree on the
  authorized target.
- Ignore stale historical tail text that mentions closed work; do not let it
  route execution.
- Never use `.bandit/work-intake-ledger.json` as a hidden scheduler or primary
  priority queue.
- Dereference WIL provenance only after `ROADMAP.md` and `CURRENT_CONTEXT.md`
  authorize a target with the same title.
- Preserve CLI authority and keep resolver output derived-only.

## Allowed Edit Surfaces

You may edit only source files needed for this command, expected to be:

- `src/state/roadmap-work-targets.ts`
- `src/commands/roadmap-work-targets.ts`
- `src/cli.ts`
- `src/commands/validate.ts` only if validation integration is required
- implementation evidence files listed below

## Forbidden Edit Surfaces

Do not edit:

- `test/roadmap-work-targets.test.mjs`
- any other `test/**` file
- `docs/work/BANDIT-093/red-evidence.md`
- acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, retrospective evidence, or policy acceptance criteria
- roadmap/current-context/status routing files
- `.bandit/work-intake-ledger.json`
- package metadata, lockfiles, dependencies, CI/release workflows, hosted
  services, telemetry, merge/push/deploy behavior, Trust Verifier cutover,
  `/bandit-work-create`, `/bandit-work-execute`, Repo PM create controller,
  Work Item PM execute controller, route registry, role input packet assembly,
  provider/blocker recorder, local API, State Index, or unrelated Phase 8 work

## Required Evidence To Write

After implementation, write:

- `docs/work/BANDIT-093/writer-report.md`
- `docs/work/BANDIT-093/implementation-evidence.md`

Both must state:

- files changed;
- tests/commands run and results;
- how acceptance criteria map to implementation;
- clean-code posture;
- confirmation that no test, fixture, RED evidence, or acceptance mapping was
  edited by the Stage 3 Writer.

## Verification

Run at least:

```sh
node --test test/roadmap-work-targets.test.mjs
npm run typecheck
```

Run broader tests only if you touch shared behavior beyond the focused command
and resolver.
