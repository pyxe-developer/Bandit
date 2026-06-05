# BANDIT-059 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-059` - Trust Verify Snapshot Foundation
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `df6b52d`
- Dispatch status: Stage 3 implementation requested

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

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-059/brief.md`
- `docs/work/BANDIT-059/red-evidence.md`
- `docs/specs/BANDIT-059-red-evidence.json`
- `docs/role-runs/BANDIT-059/stage3-implementation.json`
- `test/trust-verify.test.mjs`
- Existing command/state patterns in:
  - `src/cli.ts`
  - `src/commands/agent-observability.ts`
  - `src/state/agent-observability.ts`
  - `src/commands/evidence-freshness-slos.ts`
  - `src/state/evidence-freshness-slos.ts`
  - `src/commands/role-runs.ts`
  - `src/state/role-run-manifests.ts`
  - `src/commands/validate.ts`
  - `src/state/paths.ts`
  - `src/state/templates.ts`

## Mission

Implement Stage 3 for `BANDIT-059` only: add the narrow read-only
compatibility-mode deterministic Trust Verifier surface needed to make
`test/trust-verify.test.mjs` pass.

The expected command is:

```sh
bandit trust verify <snapshot.json> [--json] [--report <path>]
```

Implement only the first-slice verifier foundation:

- command routing for `trust verify`;
- Work Item Snapshot schema validation for the fields exercised by the RED
  suite and accepted brief;
- trust goals limited to `stage_transition`, `landing`, `closeout`, and
  `evidence_refresh`;
- canonical deterministic snapshot hashing that is independent of object key
  order, whitespace, evidence-file read order, wall-clock time, live provider
  state, auth state, queue state, or active harness memory;
- repo-contained local evidence digest verification with fail-closed missing
  file, directory, path escape, and digest mismatch diagnostics;
- reviewer-finding routing validation for unresolved actionable findings,
  malformed accepted non-blocking dispositions, rejected findings without
  rationale when relevant, and required operator input routing;
- Trust Verdict derivation limited to `trusted`, `needs_repair`, `blocked`, and
  `requires_operator`;
- deterministic JSON report output with no timestamps or live provider/auth
  state;
- explicit `--report <path>` safe report writing, while default verification
  remains read-only;
- compatibility-period refusals for gate replacement or live execution flags
  such as `--replace-land-check` and `--run-tests`.

Keep the verifier inside the Trust Verifier Compatibility Period. Do not replace
`land-check`, review evidence validation, closeout validation, coordination
checks, artifact creation, test execution, reviewer invocation, model calls,
work-item creation, routing, landing, queue mutation, or closeout behavior.

## Editable Production Paths

You may edit production implementation and Stage 3 evidence only:

- `src/cli.ts`
- `src/commands/trust.ts`
- `src/state/trust-verify.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/commands/validate.ts`
- `docs/work/BANDIT-059/implementation-evidence.md`
- `docs/work/BANDIT-059/writer-report.md`
- `docs/specs/BANDIT-059-implementation-evidence.json`

Use narrower edits if fewer files are enough. Preserve existing command,
parser, validator, policy, template, and Markdown rendering patterns.

## Forbidden Paths And Actions

Do not edit:

- `test/trust-verify.test.mjs`
- any other test file, test helper, fixture, snapshot fixture, RED evidence
  artifact, RED evidence spec, or acceptance mapping for `BANDIT-059`
- `docs/work/BANDIT-059/red-evidence.md`
- `docs/specs/BANDIT-059-red-evidence.json`
- `docs/work/BANDIT-059/brief.md`
- `docs/work/BANDIT-059/qwen-formation-review.md`
- `docs/work/BANDIT-059/coderabbit-formation-review.md`
- `docs/work/BANDIT-059/formation-review.md`
- `docs/work/BANDIT-059/coordination-log.jsonl`
- review, landing, landing-action, retrospective, CodeRabbit, or Local Qwen
  evidence
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement Trust Verifier cutover, old gate replacement, live evidence
capture helpers, test execution, reviewer execution, model calls, harness
queues, auth/provider routing, live status, agent lifecycle, role input
packets, execution packets, Pi/Aperture agent-scope work, artifact input
directory split, state-index persistence, server/API mode, scheduler/worktree,
claim/work-surface lifecycle, PR/CI workflow, automatic merge/push/deploy,
product UAT approval, dependency or lockfile changes, installed global skill
edits, external service integration, or unrelated Phase 8 cockpit feature work.

If a RED test is wrong or requires broader scope, stop and record that in
`docs/work/BANDIT-059/writer-report.md`; do not change the test.

## Verification Commands

Run at least:

```sh
node --test test/trust-verify.test.mjs
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
npm run bandit -- stage-capability-scope validate --json
npm run bandit -- token-cost-failsafe validate --json
npm run bandit -- evidence-freshness-slos validate --json
npm run bandit -- risk-classification validate --json
npm run bandit -- supply-chain-gate validate --json
npm run bandit -- input-quarantine validate --json
npm run bandit -- operator-boundary validate --json
npm run bandit -- role-contracts validate --json
npm run bandit -- role-runs validate BANDIT-059 --json
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run broader tests if your implementation touches shared command routing,
validators, artifact renderers, work-item parsing, templates, bootstrap gaps,
coordination history, cockpit status, session-context packets, risk
classification, supply-chain gates, input quarantine, operator boundaries,
token-cost failsafes, evidence freshness SLOs, role contracts, role-run
manifests, or policy validation beyond the focused verifier command.

## Required Writer Report

Write `docs/work/BANDIT-059/writer-report.md` with:

- summary of production files changed;
- verification commands and results;
- explicit statement that Test Ownership Boundary was preserved;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- any stop conditions, bootstrap gaps, or follow-up concerns.

## Required Implementation Evidence

Write `docs/work/BANDIT-059/implementation-evidence.md` and
`docs/specs/BANDIT-059-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance-criteria coverage;
- verification commands and results;
- clean-code self-check against `CLEAN_CODE.md`;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- explicit statement that `bandit trust verify` remains read-only compatibility
  evidence and does not replace existing workflow gates or mutate workflow
  state by default;
- any bootstrap gaps or follow-up concerns.
