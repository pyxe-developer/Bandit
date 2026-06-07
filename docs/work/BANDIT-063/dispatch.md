# BANDIT-063 Stage 3 Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-063`, running through the
Claude bootstrap Process Adapter path because Codex authored the Stage 2 RED
tests and RED evidence.

## Direct Writer Instructions

This is a direct Stage 3 Implementation Writer dispatch. Do not perform
meta-workflow selection, subagent selection, workflow planning, or skill
delegation. Do not invoke `Task`, subagents, slash-command skills, or
workflow-management tools.

Read the named files, implement the narrow production behavior, run the
required verification, write the required Writer report, implementation
evidence, artifact input, and role-run manifest, and stop. If local runtime
instructions force you to load a startup skill before work, load only the
minimum required startup skill and immediately return to this packet.

## Goal

Make the focused Stage 2 RED tests pass by adding a Work Item PM plan-mode gate
after formation approval and before RED evidence or broader orchestration.

## Required Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-063/brief.md`
- `docs/work/BANDIT-063/red-evidence.md`
- `docs/artifact-inputs/BANDIT-063-red-evidence.json`
- `test/role-entrypoints-formation.test.mjs`
- `test/coordination-log.test.mjs`
- `src/commands/work-item-pm.ts`
- `src/state/coordination-log.ts`
- `src/state/formation-gate.ts`

## Allowed Target Files

- `src/commands/work-item-pm.ts`
- `src/state/coordination-log.ts`
- `src/state/work-item-pm-plan.ts`
- `docs/templates/work-item-pm-plan.md`
- `docs/work/BANDIT-063/implementation-evidence.md`
- `docs/work/BANDIT-063/writer-report.md`
- `docs/artifact-inputs/BANDIT-063-implementation-evidence.json`
- `docs/role-runs/BANDIT-063/stage3-implementation.json`

## Forbidden Files And Surfaces

- `test/**`
- `docs/work/BANDIT-063/red-evidence.md`
- `docs/artifact-inputs/BANDIT-063-red-evidence.json`
- `docs/work/BANDIT-063/brief.md`
- `docs/work/BANDIT-063/formation-review.md`
- `docs/work/BANDIT-063/qwen-formation-review.md`
- `docs/work/BANDIT-063/coderabbit-formation-review.md`
- `docs/work/BANDIT-063/coordination-log.jsonl`
- `docs/work/BANDIT-063/coderabbit-review.md`
- `docs/work/BANDIT-063/local-qwen-review.md`
- `docs/work/BANDIT-063/review-evidence.md`
- `docs/work/BANDIT-063/landing-verdict.md`
- `docs/work/BANDIT-063/landing-action.md`
- `docs/work/BANDIT-063/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/events.jsonl`
- Dependency manifests, lockfiles, CI/release workflows, installed global skills,
  external service configuration, merge/push/deploy automation, Trust Verifier
  cutover, role input packets, generated execution packets, Pi/Aperture
  agent-scope work, claim authority, worktree lifecycle execution, scheduler
  execution, cockpit product work, and unrelated Phase 8 product scope.

## Implementation Boundary

Keep the fix narrow.

- `work-item-pm start <ID>` must still refuse before `formation_approved`.
- After `formation_approved`, it must refuse if
  `docs/work/<ID>/orchestration-plan.md` is missing.
- It must fail closed for under-scoped plan artifacts. At minimum, require plan
  evidence for current repo state, stage sequence, required evidence, role
  boundaries, verification commands, known blockers, stop conditions, and
  forbidden actions.
- A valid plan should let `work-item-pm start <ID>` record an append-only
  `orchestration_plan_recorded` coordination transition with
  `safe_triggers: ["red_evidence_required"]`.
- Coordination validation must accept `orchestration_plan_recorded` between
  `formation_approved` and `red_recorded`.
- The plan artifact is advisory/orchestration evidence only. It cannot replace
  canonical brief, coordination history, RED evidence, implementation evidence,
  review evidence, landing evidence, retrospective evidence, roadmap,
  current-context, or bootstrap-gap authority.

Do not implement Trust Verifier cutover, role input packets, execution packets,
Pi/Aperture agent-scope work, claim authority, worktree lifecycle execution,
scheduler execution, cockpit product work, dependency or lockfile changes,
external service setup, merge/push/deploy behavior, or product UAT scope.

## Required Verification

Run and report:

- `node --test test/role-entrypoints-formation.test.mjs`
- `node --test test/coordination-log.test.mjs`
- `node --test test/coordination-status.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- role-runs validate BANDIT-063 --json`
- `git diff --check`

Run broader tests only if the implementation touches shared parser or validation
behavior beyond the plan gate and coordination state.

## Required Writer Evidence

Write `docs/work/BANDIT-063/writer-report.md` with:

- production files changed;
- verification commands and results;
- explicit Test Ownership Boundary statement;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- stop conditions, bootstrap gaps, or follow-up concerns.

Write `docs/work/BANDIT-063/implementation-evidence.md` and
`docs/artifact-inputs/BANDIT-063-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance coverage;
- verification commands and results;
- clean-code self-check;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- statement that the orchestration plan is append-only advisory evidence and
  cannot satisfy canonical workflow-state, review, landing, UAT, or
  retrospective authority;
- bootstrap gaps or follow-up concerns.

Write `docs/role-runs/BANDIT-063/stage3-implementation.json` with:

- `contract_version`: `2`;
- `work_item_id`: `BANDIT-063`;
- `stage`: `stage3_implementation`;
- role contract `implementation_writer` version `1.0.0`;
- capability/subagent identity for `claude-implementation-writer-stage3`;
- allowed target files matching this packet;
- observed changed files matching the actual Writer change set;
- forbidden file patterns for tests, RED evidence, brief, formation evidence,
  coordination history, review evidence, landing evidence, and retrospective
  evidence;
- required input packet `docs/work/BANDIT-063/dispatch.md`;
- required summary path `docs/work/BANDIT-063/implementation-evidence.md`;
- validation commands run;
- source artifacts read;
- authority boundary showing role-run evidence is append-only evidence and
  cannot satisfy coordination history, review, landing, UAT, or retrospective
  authority.

## Stop Conditions

Stop and report a blocker if making the RED tests pass requires editing tests,
test helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
coordination history, review evidence, landing evidence, retrospective evidence,
roadmap/current context files, dependency policy, Trust Verifier cutover policy,
or unrelated product scope.
