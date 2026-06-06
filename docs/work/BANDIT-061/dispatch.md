# BANDIT-061 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-061` - Role Contract Artifact Input Write Surface
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `a75b445d5b92be4fec6e695a41f925f4954d305a`
- Created: 2026-06-06T22:25:10Z
- Dispatch status: Stage 3 implementation requested

## Direct Writer Instructions

This is a direct Stage 3 Implementation Writer dispatch. Do not perform
meta-workflow selection, subagent selection, workflow planning, or skill
delegation. Do not invoke `Task`, subagents, slash-command skills, or
workflow-management tools.

Read the named files, implement the narrow production behavior, run the
required verification, write the required Writer report and implementation
evidence, and stop. If local runtime instructions force you to load a startup
skill before work, load only the minimum required startup skill and immediately
return to this packet.

## Hard Boundaries

Stage 2 RED tests and acceptance mappings were authored by Codex PM/Test
Writer. Stage 3 must be authored by Claude through this Process Adapter path.

Do not create, edit, format, delete, regenerate, or mechanically adjust:

- `test/**`
- test helpers, fixtures, or snapshot fixtures
- `docs/work/BANDIT-061/red-evidence.md`
- `docs/artifact-inputs/BANDIT-061-red-evidence.json`
- `docs/work/BANDIT-061/brief.md`
- formation, review, landing, landing-action, retrospective, CodeRabbit, or
  Local Qwen evidence
- canonical historical work evidence under `docs/work/BANDIT-001` through
  `docs/work/BANDIT-060`
- roadmap, current-context, root status, bootstrap-gap ledger, or coordination
  history unless the implementation evidence itself requires a narrow
  Stage 3-owned append-only update
- dependencies, lockfiles, installed global skills, external service setup, or
  unrelated workflow docs

If the RED test is wrong or requires broader scope, stop and record the blocker
in `docs/work/BANDIT-061/writer-report.md`; do not edit tests.

## Required Reads

Read only what is needed from these files before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-061/brief.md`
- `docs/work/BANDIT-061/red-evidence.md`
- `docs/artifact-inputs/BANDIT-061-red-evidence.json`
- `test/role-run-manifests.test.mjs`
- `test/role-contracts.test.mjs`
- `src/state/role-run-manifests.ts`
- `src/state/role-contracts.ts`
- `src/commands/role-runs.ts`
- `src/commands/role-contracts.ts`
- `.bandit/policy/role-contracts.json`
- `.bandit/policy/artifact-inputs.json`
- `docs/templates/role-run-manifest.md`

## Mission

Make these focused Stage 2 RED suites pass without editing tests:

```sh
node --test test/role-run-manifests.test.mjs
node --test test/role-contracts.test.mjs
```

Implement only the behavior exercised by the RED tests and accepted brief:

- preserve historical role-run manifest compatibility for `contract_version: 1`;
- require `observed_changed_files` for future role-run manifests with
  `contract_version: 2`;
- require each observed changed file to appear in `allowed_target_files`;
- require each observed changed file to be permitted by the referenced role
  contract write surfaces and not match `forbidden_file_patterns`;
- produce clear fail-closed diagnostics for missing observed changed-file
  evidence, unlisted observed files, and observed files outside the role
  contract or forbidden patterns;
- update role-contract validation so `implementation_writer` must model the
  artifact-input policy/support surfaces introduced by `BANDIT-060`:
  `.bandit/policy/artifact-inputs.json`, `docs/artifact-inputs/**`,
  `docs/reviewer-captures/.gitkeep`, and
  `docs/trust-snapshot-fixtures/.gitkeep`;
- update `.bandit/policy/role-contracts.json` and any required templates or
  future manifest guidance to expose the new observed changed-file and
  artifact-input write-surface requirements;
- preserve the existing Stage 3 refusal for tests, test helpers, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, and retrospective evidence.

Do not implement Trust Verifier cutover, old gate replacement, live evidence
capture, reviewer execution, model calls, harness queues, auth/provider
routing, live status, agent lifecycle, role input packets, execution packets,
Pi/Aperture agent-scope work, state-index persistence, server/API mode,
scheduler/worktree/claim/work-surface lifecycle, PR/CI workflow, automatic
merge/push/deploy behavior, product UAT approval, dependency or lockfile
changes, installed global skill edits, external service integration, or
unrelated Phase 8 cockpit feature work.

## Editable Paths

Production implementation:

- `src/state/role-run-manifests.ts`
- `src/state/role-contracts.ts`
- `.bandit/policy/role-contracts.json`
- `docs/templates/role-run-manifest.md`

Stage 3 evidence:

- `docs/work/BANDIT-061/implementation-evidence.md`
- `docs/work/BANDIT-061/writer-report.md`
- `docs/artifact-inputs/BANDIT-061-implementation-evidence.json`
- `docs/role-runs/BANDIT-061/stage3-implementation.json`

Use fewer files if possible. Preserve existing command, parser, validator,
policy, and Markdown evidence style.

## Implementation Order

1. Add role-run manifest `observed_changed_files` validation for
   `contract_version: 2`.
2. Add the implementation-writer artifact-input support-surface contract check.
3. Update `.bandit/policy/role-contracts.json` and template guidance only as
   needed.
4. Run focused tests and fix only production code.
5. Write Writer report, implementation evidence, implementation evidence JSON,
   and the Stage 3 role-run manifest.

## Required Verification

Run at least:

```sh
node --test test/role-run-manifests.test.mjs
node --test test/role-contracts.test.mjs
npm run typecheck
npm run bandit -- role-contracts validate --json
npm run bandit -- role-runs validate BANDIT-061 --json
npm run bandit -- validate
git diff --check
```

Run broader validation only if production edits touch shared validators,
artifact rendering, workflow-state behavior, model-family separation, or policy
validation beyond role contracts and role-run manifests.

## Required Writer Evidence

Write `docs/work/BANDIT-061/writer-report.md` with:

- production files changed;
- verification commands and results;
- explicit Test Ownership Boundary statement;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- stop conditions, bootstrap gaps, or follow-up concerns.

Write `docs/work/BANDIT-061/implementation-evidence.md` and
`docs/artifact-inputs/BANDIT-061-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance coverage;
- verification commands and results;
- clean-code self-check;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- statement that role contracts and role-run manifests remain append-only
  evidence/projection boundaries and do not replace coordination logs, review
  evidence, landing evidence, UAT, retrospective evidence, roadmap/current
  context state, or bootstrap-gap ledger authority;
- statement that Trust Verifier cutover remains out of scope;
- bootstrap gaps or follow-up concerns.

Write `docs/role-runs/BANDIT-061/stage3-implementation.json` with:

- `contract_version`: `2`;
- `work_item_id`: `BANDIT-061`;
- `stage`: `stage3_implementation`;
- role contract `implementation_writer` version `1.0.0`;
- capability/subagent identity for `claude-implementation-writer-stage3`;
- base revision `a75b445d5b92be4fec6e695a41f925f4954d305a`;
- allowed target files matching this packet;
- observed changed files matching the actual Writer change set;
- forbidden file patterns for tests, RED evidence, brief, formation evidence,
  coordination history, review evidence, landing evidence, and retrospective
  evidence;
- required input packet `docs/work/BANDIT-061/dispatch.md`;
- required summary path `docs/work/BANDIT-061/implementation-evidence.md`;
- validation commands run;
- source artifacts read;
- authority boundary showing role-run evidence is append-only evidence and
  cannot satisfy coordination history, review, landing, UAT, or retrospective
  authority.
