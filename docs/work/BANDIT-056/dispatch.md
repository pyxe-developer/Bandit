# BANDIT-056 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-056` - Evidence Freshness SLOs
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `<repo-root>`
- Branch: `main`
- Base SHA: `c5eb2700502237e3269a82818edd994a4006d878`
- Dispatch status: Stage 3 implementation requested

## Narrowed Process Adapter Instructions

This is a direct Stage 3 Writer dispatch. Do not perform meta-workflow
selection, subagent selection, workflow planning, or skill delegation. Do not
invoke `Task`, subagents, slash-command skills, or workflow-management tools.
Read the required files below, make the focused production implementation edits
allowed by this packet, run the required verification, write the required Writer
report, and stop.

If local runtime instructions force you to load a startup skill before work,
load only the minimum required startup skill, then immediately return to this
dispatch packet. Do not dispatch another agent or broaden the role taxonomy.

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-056/brief.md`
- `docs/work/BANDIT-056/red-evidence.md`
- `docs/specs/BANDIT-056-red-evidence.json`
- `test/evidence-freshness-slos.test.mjs`
- Existing command/state/projection patterns in `src/cli.ts`,
  `src/commands/stage-capability-scope.ts`,
  `src/state/stage-capability-scope.ts`,
  `src/commands/token-cost-failsafe.ts`,
  `src/state/token-cost-failsafe.ts`,
  `src/commands/agent-observability.ts`,
  `src/state/agent-observability.ts`,
  `src/commands/cockpit.ts`,
  `src/state/cockpit-status.ts`,
  `src/commands/session-context.ts`,
  `src/state/focused-session-context.ts`,
  `src/commands/work-item-create.ts`, `src/commands/validate.ts`, and related
  policy validators.

## Mission

Implement Stage 3 for `BANDIT-056` only: add a repo-native Evidence Freshness
SLO validation surface and projection trust-signal output so the focused RED
tests pass.

The expected command is:

```sh
bandit evidence-freshness-slos validate --json
```

The implementation must validate `.bandit/policy/evidence-freshness-slos.json`
fail-closed. It must accept a complete SLO policy and reject trusted evidence
without source artifacts, owner or authority role, freshness budget or source
identity rule, allowed freshness states, and staleness reason behavior. It must
also reject derived projections that do not propagate missing or stale source
dependencies.

Add Evidence Trust Signals to existing derived cockpit status and
session-context JSON payloads. The signals must be derived non-canonical,
source-linked, and able to report `current`, `stale`, or `missing` evidence
dependencies instead of hiding missing evidence behind trusted status.

Preserve review-subject-hash semantics for review evidence. Evidence Freshness
SLO state may compose with review-subject hashes, but it must not replace them
or create hidden state authority.

## Editable Production Paths

You may edit production implementation and Stage 3 evidence only:

- `src/cli.ts`
- `src/commands/evidence-freshness-slos.ts`
- `src/state/evidence-freshness-slos.ts`
- `src/commands/cockpit.ts`
- `src/state/cockpit-status.ts`
- `src/commands/session-context.ts`
- `src/state/focused-session-context.ts`
- `src/commands/work-item-create.ts`
- `src/commands/validate.ts`
- `.bandit/policy/evidence-freshness-slos.json`
- `docs/templates/evidence-freshness-slos.md`
- `docs/work/BANDIT-056/implementation-evidence.md`
- `docs/work/BANDIT-056/writer-report.md`
- `docs/specs/BANDIT-056-implementation-evidence.json`

Use narrower edits if fewer files are enough. Preserve existing command,
parser, validator, projection, and Markdown rendering patterns.

## Forbidden Paths And Actions

Do not edit:

- `test/evidence-freshness-slos.test.mjs`
- any other test file, test helper, fixture, RED evidence artifact, RED evidence
  spec, or acceptance mapping for `BANDIT-056`
- `docs/work/BANDIT-056/red-evidence.md`
- `docs/specs/BANDIT-056-red-evidence.json`
- review, landing, landing-action, retrospective, CodeRabbit, or Local Qwen
  evidence
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement full scheduler execution, full worktree lifecycle work, claim
lease creation or release, work-surface reservations, cockpit UI/server/API
work beyond existing CLI-derived payload validation, state-index persistence,
PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval
changes, live reviewer routing changes, paid reviewer promotion, external
service integration, installed global skill edits, dependency or lockfile
changes, or unrelated Phase 8 work.

If the RED test is wrong or requires broader scope, stop and record that in
`docs/work/BANDIT-056/writer-report.md`; do not change the tests.

## Verification Commands

Run at least:

```sh
node --test test/evidence-freshness-slos.test.mjs
node --test test/cockpit-status.test.mjs
node --test test/focused-session-context.test.mjs
npm run typecheck
npm run bandit -- evidence-freshness-slos validate --json
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run broader tests if your implementation touches shared command routing,
validators, artifact renderers, work item parsing, templates, bootstrap gaps,
review evidence, landing evidence, risk classification, supply-chain gates,
input quarantine, operator boundaries, token-cost failsafes, or policy
validation beyond the focused command.

## Required Writer Report

Write `docs/work/BANDIT-056/writer-report.md` with:

- summary of production files changed;
- verification commands and results;
- explicit statement that Test Ownership Boundary was preserved;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- any stop conditions, bootstrap gaps, or follow-up concerns.
