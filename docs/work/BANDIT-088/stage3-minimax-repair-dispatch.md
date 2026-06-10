# BANDIT-088 MiniMax Stage 3 Repair Dispatch

You are MiniMax-M3, the Stage 3 Implementation Writer fallback for
`BANDIT-088` in `/Users/matthewflebbe/Bandit`.

The previous MiniMax attempt exited with `Unhandled stop reason: error` after
creating a partial
`docs/work/BANDIT-088/installed-copy-update-path-disposition.md`. The file is
truncated in the "Current Installed-Skill Lifecycle And Drift Policy" section,
and these required files are missing:

- `docs/work/BANDIT-088/writer-report.md`
- `docs/work/BANDIT-088/implementation-evidence.md`

## Allowed Edits

Edit only:

- `docs/work/BANDIT-088/installed-copy-update-path-disposition.md`
- `docs/work/BANDIT-088/writer-report.md`
- `docs/work/BANDIT-088/implementation-evidence.md`

Do not edit coordination logs, tests, RED evidence, acceptance mappings,
formation/review/landing/UAT/retrospective/closeout artifacts, roadmap,
current context, status, source code, package files, lockfiles, policy files,
installed global skills, automation prompts, consumer repos, or external repos.

## Repair Requirements

Complete `installed-copy-update-path-disposition.md` so it:

- keeps the decision `Deferred`;
- preserves current private Git tag or tarball install plus manual advisory
  `bandit update-check`;
- cites `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`,
  `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `brief.md`,
  `orchestration-plan.md`, `red-evidence.md`, `coordination-log.jsonl`,
  `.bandit/policy/private-install-update-channel.json`,
  `.bandit/policy/skill-lifecycle-contracts.json`,
  `docs/evaluation/skills/bandit-installed-skill-drift.md`,
  `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`, `README.md`,
  `src/commands/init.ts`, `src/commands/update-check.ts`, and
  `src/state/update-channel.ts`;
- compares current behavior against desired responsibilities: preview,
  target-surface identification, apply authority, installed package
  verification, installed skill drift verification, automation prompt drift
  verification, repo integration file updates, rollback, consumer-local state
  preservation, supply-chain evidence, input quarantine, and hidden remote
  side-effect avoidance;
- records named trigger conditions for future reconsideration;
- records a conditional future implementation scope that names authority
  boundaries, commands, validators, evidence artifacts, refusal paths, expected
  RED tests, review gates, expected files, operator-owned approvals, rollback
  evidence, and explicit non-goals;
- states that public publishing, paid registry setup, hosted update services,
  telemetry, automatic self-update, credential handling, consumer-repo
  mutation, installed global skill mutation, automation prompt mutation,
  external repo mutation, merge, push, deploy, Trust Verifier cutover, and old
  gate replacement remain unapproved.

Create `writer-report.md` with:

- writer identity/model family: MiniMax-M3 via `pi` fallback;
- Claude unavailable due session limit;
- source evidence read;
- files changed;
- zero test-surface edits;
- no forbidden surface edits;
- no operator-owned input required;
- verification commands run and results.

Create `implementation-evidence.md` with:

- `pass` status;
- summary of the deferred disposition;
- acceptance criteria mapping to the disposition/report;
- clean-code check against `CLEAN_CODE.md`;
- model-family separation evidence;
- zero test-surface edit confirmation.

## Verification

Run:

```sh
node ./bin/bandit.mjs coordination validate BANDIT-088
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Do not run source tests unless you change source files. You should not change
source files for this repair.
