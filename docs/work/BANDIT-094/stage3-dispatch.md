# BANDIT-094 Stage 3 Implementation Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-094`.

## Required Role Boundary

Codex authored Stage 2 RED tests and `docs/work/BANDIT-094/red-evidence.md`.
You must not edit, format, regenerate, delete, or mechanically adjust any test
surface, test helper, fixture, RED evidence, acceptance mapping, formation
artifact, review artifact, landing artifact, UAT artifact, retrospective
artifact, roadmap/status file, or PRD/source authority file for this Work Item.

Forbidden write surfaces include:

- `test/orchestrator-prompts.test.mjs`
- `test/work-create-controller.test.mjs`
- `test/helpers/**`
- `docs/work/BANDIT-094/red-evidence.md`
- `docs/work/BANDIT-094/brief.md`
- `docs/work/BANDIT-094/qwen-formation-review.md`
- `docs/work/BANDIT-094/coderabbit-formation-review.md`
- `docs/work/BANDIT-094/formation-review.md`
- `docs/work/BANDIT-094/orchestration-plan.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`

If the tests appear wrong, stop and report the issue in the writer report
instead of editing tests.

## Goal

Implement the approved `BANDIT-094` Stage 3 source behavior needed to satisfy
the RED tests while preserving the brief's scope:

- Add Bandit-native Repo PM prompt contract support.
- Add role-specific prompt-contract validation.
- Add Repo PM foreign-source and unauthorized reviewer-route leakage checks.
- Add `repo-pm create-controller --json`.
- Keep create-controller behavior Stage 1 only; it must not create Stage 2 or
  later evidence.

## Allowed Write Surfaces

Use the smallest source/template/policy changes needed. Expected allowed
surfaces include:

- `docs/templates/repo-pm-formation-prompt.md`
- `.bandit/policy/orchestrator-prompts.json`
- `src/state/orchestrator-prompts.ts`
- `src/state/work-create-controller.ts`
- `src/commands/repo-pm.ts`
- `src/commands/work-create-controller.ts`
- `src/commands/validate.ts`
- `src/commands/init.ts`
- `src/cli.ts`
- `docs/work/BANDIT-094/writer-report.md`
- `docs/work/BANDIT-094/implementation-evidence.md`

Do not implement PRD-005.3 execute-controller behavior, route registries, role
input packet assembly, provider/blocker evidence recorders, PRD-005.4
slash-command adapters, cockpit action execution, local API, State Index,
Trust Verifier cutover, hosted services, telemetry, paid routing, merge, push,
deploy, dependency changes, package-script changes, CI/release workflow
changes, claim/worktree lifecycle behavior, guarded browser actions, or
unrelated Phase 8 work.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-094/brief.md`
- `docs/work/BANDIT-094/red-evidence.md`
- `test/orchestrator-prompts.test.mjs`
- `test/work-create-controller.test.mjs`
- `src/state/orchestrator-prompts.ts`
- `src/state/roadmap-work-targets.ts`
- `src/commands/repo-pm.ts`
- `src/commands/work-item-create.ts`

## Required Behavior

Prompt contracts:

- Existing Work Item PM prompt behavior must continue to pass.
- Repo PM prompt contracts use their own required sections and gates rather
  than Work Item PM orchestration sections/gates.
- Repo PM prompt validation must reject foreign source leakage such as
  SeekWins paths, `WI-00`, Ollama reviewer semantics, direct `qwen` CLI
  fallback, or unauthorized Local Qwen routing.
- Prompt contracts remain non-authoritative guidance and mutate workflow state
  only through CLI commands.

Create controller:

- Command: `bandit repo-pm create-controller --json`.
- Resolve the authorized target through the existing roadmap/current-context
  resolver.
- Refuse when required operator input is not `none_required`.
- Refuse when `.bandit/reviewers/local-qwen.json` is missing or does not
  preserve the authorized Local Qwen route through `node
  bin/omlx-chat-completions.mjs` / MLX-compatible endpoint semantics.
- For a next unformed PRD-005.2 target, require an explicit matching source
  spec under `docs/specs/`.
- Create the Work Item through the existing creation path where feasible, and
  ensure `docs/work/<ID>/coordination-log.jsonl` records `brief_created`.
- Stop before Stage 2: do not create orchestration plan, RED, implementation,
  review, landing, UAT, retrospective, PRD-005.3, or adapter evidence.
- If the target is already formed and `formation_approved`, report
  `already_formed`, do not allocate a duplicate, and point to Work Item PM
  plan-mode orchestration.

## Verification

Run:

```sh
node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs
npm run typecheck
```

Run broader tests if the implementation touches shared validation or CLI
dispatch behavior in a way that could affect other commands.

## Required Output Artifacts

Create:

- `docs/work/BANDIT-094/writer-report.md`
- `docs/work/BANDIT-094/implementation-evidence.md`

Both must include changed files, verification commands/results, clean-code
posture, and explicit confirmation that no Test Writer-owned surface was edited.
