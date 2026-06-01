# BANDIT-058 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-058` - Role Contracts And Run Manifests
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `<repo-root>`
- Branch: `main`
- Base SHA: `c2a504c4a885213e3ac0c89d065f1c905d9c135e`
- Dispatch status: Stage 4 CodeRabbit bounded source repair requested

## Narrowed Process Adapter Instructions

This is a direct Stage 3 Implementation Writer dispatch. Do not perform
meta-workflow selection, subagent selection, workflow planning, or skill
delegation. Do not invoke `Task`, subagents, slash-command skills, or
workflow-management tools. Read the required files below, make the focused
production implementation edits allowed by this packet, run the required
verification, write the required Writer report and implementation evidence, and
stop.

If local runtime instructions force you to load a startup skill before work,
load only the minimum required startup skill, then immediately return to this
dispatch packet. Do not dispatch another agent or broaden the role taxonomy.

## Repair Dispatch Addendum

This dispatch is now a bounded Stage 3 repair. If this section conflicts with
the earlier Stage 3 implementation mission text below, this repair addendum
wins.

Codex PM recorded a Stage 3 acceptance blocker at
`docs/work/BANDIT-058/stage3-pm-review.md`: the current role-run manifest
validator can return `status: pass` when required fields from the accepted brief
and original dispatch are omitted.

Repair only Role Run Manifest fail-closed required-field validation and refresh
Stage 3 Writer evidence. Do not broaden the slice.

Required repair:

- Add explicit required-field validation for Role Run Manifests before semantic
  role/stage/write-surface checks.
- Reject missing, blank, wrong-shaped, or empty values for:
  - `work_item_id`
  - `stage`
  - `role_contract_ref.role_id`
  - `role_contract_ref.version`
  - capability/subagent identity: require at least one non-empty
    `capability_profile` or `subagent_identity`
  - `base_revision`
  - non-empty `allowed_target_files`
  - non-empty `forbidden_file_patterns`
  - `required_input_packet_ref`
  - `required_summary_path`
  - non-empty `validation_commands`
  - non-empty `source_artifacts`
- Verify referenced `source_artifacts` and `required_input_packet_ref` exist.
- Treat `required_summary_path` as a required non-empty output evidence path.
  If enforcing its existence conflicts with the existing Test Writer-owned
  complete-manifest fixture, stop and record the test-contract conflict in
  `docs/work/BANDIT-058/writer-report.md`; do not edit tests.
- Keep existing focused RED suites passing without editing tests or RED
  evidence.
- Refresh `docs/work/BANDIT-058/implementation-evidence.md`,
  `docs/specs/BANDIT-058-implementation-evidence.json`, and
  `docs/work/BANDIT-058/writer-report.md` so they describe the repair and its
  verification.

Suggested extra verification after the focused tests pass: create a temporary
role-run manifest omitting the required fields listed above and confirm
`node ./bin/bandit.mjs role-runs validate BANDIT-058 --json` fails closed.
Remove the temporary probe before finishing.

## Repair Dispatch Addendum 2

This section is the current bounded Stage 3 repair request. If this section
conflicts with the earlier mission text or earlier repair addendum, this section
wins.

Codex PM recorded a remaining Stage 3 acceptance blocker at
`docs/work/BANDIT-058/stage3-pm-review.md`: role-run manifest validation still
returns `status: pass` when required array fields contain blank entries. The PM
throwaway probe copied the accepted Stage 3 manifest and changed:

- `validation_commands` to `[""]`
- `source_artifacts` to `[""]`
- `forbidden_file_patterns` to `[""]`

The probe still passed. A blank `source_artifacts` entry is especially
fail-open because `path.join(repoRoot, "")` resolves to the repository root.

Repair only this role-run manifest array-element validation blocker and refresh
Stage 3 Writer evidence. Do not broaden the slice.

Required repair:

- Make required role-run manifest arrays reject blank, whitespace-only, or
  non-string entries for:
  - `allowed_target_files`
  - `forbidden_file_patterns`
  - `validation_commands`
  - `source_artifacts`
- Ensure every `source_artifacts` entry is a non-empty file path and cannot
  resolve to the repository root or a directory.
- Preserve the existing missing-field diagnostics for omitted or empty required
  arrays.
- Keep focused RED suites passing without editing tests, test helpers, fixtures,
  RED evidence, or acceptance mappings.
- Refresh `docs/work/BANDIT-058/implementation-evidence.md`,
  `docs/specs/BANDIT-058-implementation-evidence.json`, and
  `docs/work/BANDIT-058/writer-report.md` so they describe this repair and its
  verification.

Suggested extra verification after the focused tests pass: create temporary
role-run manifest probes with blank, whitespace-only, and non-string entries in
the required arrays above. Confirm
`node ./bin/bandit.mjs role-runs validate BANDIT-058 --json` fails closed.
Remove every temporary probe before finishing.

## CodeRabbit Repair Dispatch Addendum

This section is the current bounded repair request. If this section conflicts
with earlier Stage 3 mission text or repair addenda, this section wins.

CodeRabbit Stage 4 pre-PR review completed at
`docs/work/BANDIT-058/coderabbit-review.md` with four source-level findings
that must be repaired before Local Qwen, aggregate Stage 4 review, landing,
closeout, or unrelated Phase 8 work. Repair only these findings:

1. `src/state/role-run-manifests.ts`: make `required_input_packet_ref`
   validation fail closed for path traversal, absolute-path escape, and
   directory refs. Required input packets must resolve inside the repository and
   be regular files.
2. `src/state/role-run-manifests.ts`: make each `source_artifacts` entry fail
   closed for absolute paths and path traversal outside the repository. Source
   artifacts must resolve inside the repository and be regular files.
3. `src/state/role-run-manifests.ts`: enforce the full role-run manifest
   authority-boundary contract. A manifest must not be able to satisfy
   coordination history, review evidence, landing evidence, UAT, or
   retrospective/closeout evidence. Reject any true authority-boundary flag or
   equivalent claim that crosses this boundary.
4. `src/state/role-contracts.ts`: make role contract required-field validation
   fail closed for empty strings, whitespace-only strings, empty arrays,
   arrays with blank/non-string entries, and empty required object fields. Do
   not treat only `null` or `undefined` as missing.

Keep the repair bounded to production validation and Stage 3 Writer evidence.
Do not edit Test Writer-owned tests, test helpers, fixtures, RED evidence,
formation evidence, CodeRabbit evidence, Local Qwen evidence, landing evidence,
retrospective artifacts, or acceptance mappings.

Refresh `docs/work/BANDIT-058/implementation-evidence.md`,
`docs/specs/BANDIT-058-implementation-evidence.json`, and
`docs/work/BANDIT-058/writer-report.md` so they describe this CodeRabbit source
repair and verification.

Suggested extra verification after the focused tests pass:

- Create temporary role-run manifest probes for `required_input_packet_ref`
  values that use `../`, absolute paths, and directory paths; confirm
  `node ./bin/bandit.mjs role-runs validate BANDIT-058 --json` fails closed.
- Create temporary role-run manifest probes for `source_artifacts` values that
  use `../`, absolute paths, repository-root paths, and directory paths; confirm
  validation fails closed.
- Create temporary role-run manifest probes that set each prohibited
  authority-boundary flag to `true`; confirm validation fails closed.
- Create temporary role-contract policy probes with empty required strings,
  whitespace required strings, empty required arrays, blank array entries, and
  empty required objects; confirm
  `node ./bin/bandit.mjs role-contracts validate --json` fails closed.
- Remove every temporary probe before finishing.

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-058/brief.md`
- `docs/work/BANDIT-058/red-evidence.md`
- `docs/work/BANDIT-058/stage3-pm-review.md`
- `docs/specs/BANDIT-058-red-evidence.json`
- `test/role-contracts.test.mjs`
- `test/role-run-manifests.test.mjs`
- Existing command/state/policy patterns in `src/cli.ts`,
  `src/commands/stage-capability-scope.ts`,
  `src/state/stage-capability-scope.ts`,
  `src/commands/token-cost-failsafe.ts`,
  `src/state/token-cost-failsafe.ts`,
  `src/commands/evidence-freshness-slos.ts`,
  `src/state/evidence-freshness-slos.ts`,
  `src/commands/validate.ts`,
  `src/state/paths.ts`, `src/state/templates.ts`, and related policy validators.

## Mission

Implement Stage 3 for `BANDIT-058` only: add the narrow repo-native Role
Contract and Role Run Manifest validation surface needed to make the focused RED
suites pass.

The expected commands are:

```sh
bandit role-contracts validate --json
bandit role-runs validate BANDIT-058 --json
```

The implementation must validate `.bandit/policy/role-contracts.json`
fail-closed. It must accept a complete policy for the first governed roles:
Repo PM, Work Item PM, Test Writer, Implementation Writer, Reviewer, Landing
Agent, and Closeout Agent. It must reject contracts missing role identity,
version, authority boundary, allowed stages, required inputs, allowed tool or
command families, allowed write-surface families, forbidden actions, required
output summary, validation commands, escalation paths, rollback or supersession
rule, or owner.

The implementation must validate append-only role-run manifests under
`docs/role-runs/<ID>/` fail-closed. It must reject missing work item ID, stage,
role contract ID and version, capability profile or subagent identity, base
revision, allowed target files, forbidden file patterns, required input packet
reference, required summary path, validation commands, or source artifacts. It
must reject role/stage mismatches, missing or stale role contract references,
missing source artifacts, missing base revision, target files outside the role
contract write surface, forbidden action conflicts, and any claim that role
contracts or role-run manifests can satisfy canonical workflow state such as
coordination history, review evidence, landing evidence, UAT, or retrospective
evidence.

Integrate `bandit validate` with role contract validation only as needed for
this bounded slice. Keep role contracts and role-run manifests as repo-native
evidence. Do not let generated views, caches, cockpit state, trace output, or
manifest projections become workflow authority.

## Editable Production Paths

You may edit production implementation and Stage 3 evidence only:

- `src/cli.ts`
- `src/commands/role-contracts.ts`
- `src/commands/role-runs.ts`
- `src/commands/validate.ts`
- `src/state/role-contracts.ts`
- `src/state/role-run-manifests.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `.bandit/policy/role-contracts.json`
- `docs/templates/role-contract.md`
- `docs/templates/role-run-manifest.md`
- `docs/role-runs/BANDIT-058/`
- `docs/work/BANDIT-058/implementation-evidence.md`
- `docs/work/BANDIT-058/writer-report.md`
- `docs/specs/BANDIT-058-implementation-evidence.json`

Use narrower edits if fewer files are enough. Preserve existing command,
parser, validator, policy, template, and Markdown rendering patterns.

## Forbidden Paths And Actions

Do not edit:

- `test/role-contracts.test.mjs`
- `test/role-run-manifests.test.mjs`
- any other test file, test helper, fixture, RED evidence artifact, RED evidence
  spec, or acceptance mapping for `BANDIT-058`
- `docs/work/BANDIT-058/red-evidence.md`
- `docs/specs/BANDIT-058-red-evidence.json`
- formation review, review, landing, landing-action, retrospective, CodeRabbit,
  or Local Qwen evidence
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement generated execution packets, generated role input packets,
diff-based write validation, same-agent repair continuation, stage-specific
repair manifests, landing subagent packets, closeout packets, broad claimability,
claim leases, work-surface reservations, scheduler execution, worktree lifecycle
execution, PR/CI workflow, automatic merge/push/deploy behavior, product UAT
approval, dependency or lockfile changes, local server/API mode, external service
integration, full rubric migration, installed global skill edits, or unrelated
Phase 8 cockpit feature work.

If a RED test is wrong or requires broader scope, stop and record that in
`docs/work/BANDIT-058/writer-report.md`; do not change tests.

## Verification Commands

Run at least:

```sh
node --test test/role-contracts.test.mjs
node --test test/role-run-manifests.test.mjs
node --test test/role-entrypoints-formation.test.mjs
npm run typecheck
npm run bandit -- role-contracts validate --json
npm run bandit -- role-runs validate BANDIT-058 --json
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run broader tests if your implementation touches shared command routing,
validators, artifact renderers, work item parsing, templates, bootstrap gaps,
coordination history, cockpit status, session-context packets, risk
classification, supply-chain gates, input quarantine, operator boundaries,
token-cost failsafes, evidence freshness SLOs, or policy validation beyond the
focused commands.

## Required Writer Report

Write `docs/work/BANDIT-058/writer-report.md` with:

- summary of production files changed;
- verification commands and results;
- explicit statement that Test Ownership Boundary was preserved;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- any stop conditions, bootstrap gaps, or follow-up concerns.

## Required Implementation Evidence

Write `docs/work/BANDIT-058/implementation-evidence.md` and
`docs/specs/BANDIT-058-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance-criteria coverage;
- verification commands and results;
- clean-code self-check against `CLEAN_CODE.md`;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- explicit statement that role contracts and role-run manifests remain
  non-canonical evidence and cannot replace coordination history, review,
  landing, UAT, or retrospective evidence;
- any bootstrap gaps or follow-up concerns.
