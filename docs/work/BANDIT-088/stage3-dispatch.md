# BANDIT-088 Stage 3 Implementation Writer Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-088` in
`/Users/matthewflebbe/Bandit`.

## Mission

Produce the bounded installed-copy update-path triage delivery for
`BANDIT-088`.

This is a non-product chore. The expected Stage 3 delivery is disposition and
evidence, not source code, unless repo evidence proves a blocker-level need for
source implementation. Do not implement source code for package publishing,
hosted update services, update apply, installed global skill mutation,
automation prompt mutation, consumer-repo mutation, merge, push, deploy, Trust
Verifier cutover, local API, State Index, scheduler, claim/worktree lifecycle,
guarded browser action execution, or unrelated Phase 8 work.

## Required Reads

Read at least:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-088/brief.md`
- `docs/work/BANDIT-088/orchestration-plan.md`
- `docs/work/BANDIT-088/red-evidence.md`
- `docs/work/BANDIT-088/coordination-log.jsonl`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/work-intake-ledger.json`
- `FOLLOWUPS.md`
- `README.md`
- `.bandit/policy/private-install-update-channel.json`
- `.bandit/policy/skill-lifecycle-contracts.json`
- `docs/evaluation/skills/bandit-installed-skill-drift.md`
- `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`
- `src/commands/init.ts`
- `src/commands/update-check.ts`
- `src/state/update-channel.ts`

## Required Outputs

Create or update only these Stage 3 artifacts:

- `docs/work/BANDIT-088/installed-copy-update-path-disposition.md`
- `docs/work/BANDIT-088/writer-report.md`
- `docs/work/BANDIT-088/implementation-evidence.md`

Do not edit:

- tests, test helpers, fixtures, RED evidence, acceptance mappings
- formation review artifacts
- `docs/work/BANDIT-088/coordination-log.jsonl`
- review, landing, UAT, retrospective, or closeout artifacts
- roadmap/current-context/status files
- `.bandit/work-intake-ledger.json`
- source code, package files, dependency files, lockfiles, policy files, or installed global skills unless you first record a blocker that explains why the approved Stage 3 disposition-only scope is impossible

## Disposition Requirements

`installed-copy-update-path-disposition.md` must satisfy the Stage 2
verification plan in `docs/work/BANDIT-088/red-evidence.md`:

- cite `WIL-INSTALLED-COPY-UPDATE` in `.bandit/work-intake-ledger.json` and its
  `FOLLOWUPS.md` source metadata;
- cite current routing evidence from `CURRENT_CONTEXT.md`, `ROADMAP.md`,
  `STATUS.md`, the brief, orchestration plan, RED evidence, and coordination
  log;
- cite current private install/update policy from
  `.bandit/policy/private-install-update-channel.json`;
- cite skill lifecycle and drift evidence from
  `.bandit/policy/skill-lifecycle-contracts.json` and
  `docs/evaluation/skills/bandit-installed-skill-drift.md`;
- cite prior private install/update source material from
  `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`, `README.md`,
  `src/commands/init.ts`, `src/commands/update-check.ts`, and
  `src/state/update-channel.ts`;
- compare current private Git tag or tarball install plus manual
  update-check notification against desired installed-copy responsibilities:
  preview, target-surface identification, apply authority, installed package
  verification, installed skill drift verification, automation prompt drift
  verification, repo integration file updates, rollback instructions,
  consumer-local state preservation, supply-chain evidence, input quarantine,
  and hidden remote side-effect avoidance;
- record one of: no-action, deferred disposition with trigger conditions,
  narrow future implementation slices, or a concrete operator-owned approval
  question;
- if future implementation is recommended, name exact authority boundaries,
  commands, validators, evidence artifacts, refusal paths, expected RED tests,
  review gates, expected files, operator-owned approvals, rollback evidence,
  and explicit non-goals;
- preserve current policy: private Git tag or tarball install and advisory
  update-check remain supported; public publishing, paid registry setup,
  hosted update services, telemetry, automatic self-update, credentials,
  external repo mutation, installed global skill mutation, automation prompt
  mutation, consumer-repo mutation, merge, push, deploy, Trust Verifier
  cutover, and old-gate replacement remain unapproved.

## Writer Report Requirements

`writer-report.md` must state:

- writer identity/model family;
- source evidence read;
- files changed;
- no test-surface edits;
- no forbidden surface edits;
- whether operator-owned input is required;
- verification commands run and results;
- any blocker encountered.

## Implementation Evidence Requirements

`implementation-evidence.md` must:

- record `pass` or `blocker`;
- summarize Stage 3 delivery;
- map every acceptance criterion from `docs/work/BANDIT-088/brief.md` and
  `docs/work/BANDIT-088/red-evidence.md` to evidence in the disposition or
  report;
- include a clean-code check against `CLEAN_CODE.md`;
- confirm model-family separation and zero test-surface edits.

## Verification

Run:

```sh
node ./bin/bandit.mjs coordination validate BANDIT-088
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Run `npm run typecheck` and `npm test` only if you change source code, package
metadata, package scripts, dependencies, lockfiles, validators, command routing,
artifact renderers, init, update-check, update-channel state, skill lifecycle,
supply-chain policy, input quarantine, operator-boundary behavior, or
cockpit/session-context projections.
