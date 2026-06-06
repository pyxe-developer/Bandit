# BANDIT-062 Stage 3 Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-062`, running through the
Claude bootstrap Process Adapter path because Codex authored the Stage 2 RED
test and RED evidence.

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

Make the focused Stage 2 RED test pass by preserving replaced bootstrap-gap
metadata when work-item creation rewrites `.bandit/bootstrap-gaps.json`.

## Required Inputs

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-062/brief.md`
- `docs/work/BANDIT-062/red-evidence.md`
- `docs/artifact-inputs/BANDIT-062-red-evidence.json`
- `test/work-item-create.test.mjs`
- `src/commands/work-item-create.ts`
- `src/state/bootstrap-gaps.ts`

## Allowed Target Files

- `src/commands/work-item-create.ts`
- `src/state/bootstrap-gaps.ts`
- `docs/work/BANDIT-062/implementation-evidence.md`
- `docs/work/BANDIT-062/writer-report.md`
- `docs/artifact-inputs/BANDIT-062-implementation-evidence.json`
- `docs/role-runs/BANDIT-062/stage3-implementation.json`

## Forbidden Files And Surfaces

- `test/**`
- `docs/work/BANDIT-062/red-evidence.md`
- `docs/artifact-inputs/BANDIT-062-red-evidence.json`
- `docs/work/BANDIT-062/brief.md`
- `docs/work/BANDIT-062/formation-review.md`
- `docs/work/BANDIT-062/qwen-formation-review.md`
- `docs/work/BANDIT-062/coderabbit-formation-review.md`
- `docs/work/BANDIT-062/coordination-log.jsonl`
- `docs/work/BANDIT-062/coderabbit-review.md`
- `docs/work/BANDIT-062/local-qwen-review.md`
- `docs/work/BANDIT-062/review-evidence.md`
- `docs/work/BANDIT-062/landing-verdict.md`
- `docs/work/BANDIT-062/landing-action.md`
- `docs/work/BANDIT-062/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/events.jsonl`
- Dependency manifests, lockfiles, CI/release workflows, installed global skills,
  external service configuration, merge/push/deploy automation, Trust Verifier
  cutover, Work Item PM plan-mode orchestration, role input packets, generated
  execution packets, Pi/Aperture agent-scope work, claim authority, worktree
  lifecycle execution, scheduler execution, cockpit UI, and unrelated Phase 8
  product work.

## Implementation Boundary

Keep the fix narrow. The likely defect is the work-item creation serializer that
round-trips parsed `BootstrapGap` records but currently omits optional
`replacement_gap`, `replacement_work_item`, and `replacement_evidence` fields.
Repair the round-trip behavior without weakening parser validation for replaced
gaps and without adding a new source of truth.

## Required Verification

Run and report:

- `node --test test/work-item-create.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `git diff --check`

Run broader tests only if the implementation touches shared parser or validation
behavior beyond the narrow serializer repair.

## Required Writer Evidence

Write `docs/work/BANDIT-062/writer-report.md` with:

- production files changed;
- verification commands and results;
- explicit Test Ownership Boundary statement;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- stop conditions, bootstrap gaps, or follow-up concerns.

Write `docs/work/BANDIT-062/implementation-evidence.md` and
`docs/artifact-inputs/BANDIT-062-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance coverage;
- verification commands and results;
- clean-code self-check;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- statement that `.bandit/bootstrap-gaps.json` remains the canonical
  bootstrap-gap ledger and that this repair only preserves parsed replacement
  metadata during an existing CLI-authorized rewrite;
- bootstrap gaps or follow-up concerns.

Write `docs/role-runs/BANDIT-062/stage3-implementation.json` with:

- `contract_version`: `2`;
- `work_item_id`: `BANDIT-062`;
- `stage`: `stage3_implementation`;
- role contract `implementation_writer` version `1.0.0`;
- capability/subagent identity for `claude-implementation-writer-stage3`;
- allowed target files matching this packet;
- observed changed files matching the actual Writer change set;
- forbidden file patterns for tests, RED evidence, brief, formation evidence,
  coordination history, review evidence, landing evidence, and retrospective
  evidence;
- required input packet `docs/work/BANDIT-062/dispatch.md`;
- required summary path `docs/work/BANDIT-062/implementation-evidence.md`;
- validation commands run;
- source artifacts read;
- authority boundary showing role-run evidence is append-only evidence and
  cannot satisfy coordination history, review, landing, UAT, or retrospective
  authority.

## Stop Conditions

Stop and report a blocker if making the RED test pass requires editing tests,
test helpers, fixtures, RED evidence, acceptance mappings, formation evidence,
review evidence, landing evidence, retrospective evidence, roadmap/current
context files, dependency policy, Trust Verifier cutover policy, Work Item PM
plan-mode policy, or unrelated product scope.
