# Public Consumer Install Command Audit - 2026-06-11

## Scope

Audit the public README command surface against a fresh consumer repository
expectation: commands presented as copy-pasteable install or first-use commands
should either work in any target repo after documented prerequisites, or clearly
state the required context and use safe placeholders.

## Evidence

- Current Bandit working-tree pack includes `bin/bandit.mjs` and creates a
  `node_modules/.bin/bandit` symlink when installed into a temp consumer repo.
- `npm install -D github:pyxe-developer/Bandit#main` also creates
  `node_modules/.bin/bandit` in a temp consumer repo, but installs the committed
  `origin/main` package, not uncommitted local README and policy changes.
- GitHub install lockfiles record a `git+ssh://git@github.com/...` resolved
  source in this environment, but installing both the `github:` shorthand and
  `git+https://github.com/pyxe-developer/Bandit.git#main` with SSH deliberately
  disabled still succeeded. The lockfile shape is confusing evidence, not a
  reproduced blocker.
- `npm view bandit-workflow name version description repository --json` returns
  `E404`, so `bandit-workflow` is not currently published on npm.
- `npm view bandit name version bin --json` returns an unrelated
  `bandit@0.0.1` package with no bin metadata, so `npx bandit` before local
  installation can fail or resolve the wrong package expectation.
- `/Users/matthewflebbe/projects/nntnos` has no `package.json` and no local
  `node_modules/`. The earlier install landed in `/Users/matthewflebbe` instead,
  so `/Users/matthewflebbe/projects/nntnos/node_modules/.bin/bandit` does not
  exist.
- In a fresh temp consumer repo after local packed install:
  - `npx bandit init` exits 0.
  - `npx bandit validate` exits 0.
  - `npx bandit list` exits 0.
  - `npx bandit update-check --json` exits 0 with `unconfigured`.
  - `npx bandit cockpit status --json` exits 1 with missing
    `docs/roadmap/CURRENT_CONTEXT.md`.
  - `npx bandit session-context current --json` exits 1 with missing
    `AGENTS.md`.
- `bandit init` currently seeds `.bandit/` policies, reviewer config, and
  `docs/templates/`, but it does not seed the governance scaffold required for
  a Bandit-governed repo: `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`,
  `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `docs/verification/STAGE_RUBRICS.md`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, or root `STATUS.md`.
- Bare `bandit init` exits 127 in a normal shell after local dependency
  installation because `node_modules/.bin` is not on the shell `PATH`.
- README shell blocks still contain angle-bracket placeholders such as
  `<printed-tarball-name>`, `<work-item-id>`, and policy placeholders such as
  `<version>`. Copying those literally into zsh can produce parse errors or
  redirection behavior.
- `bandit repo-pm create-work-item` is documented without the required
  `<spec-path>` argument and exits 1 with usage guidance.
- `bandit work-create --json` in a fresh consumer repo exits 1 because roadmap
  source artifacts are not initialized.
- `bandit work-execute --json` in a fresh consumer repo exits 1 because no
  active formed work item exists in `CURRENT_CONTEXT.md`.

## Gaps

1. Public install quickstart does not establish an npm project boundary before
   installation. Repos without `package.json` can install Bandit into a parent
   directory, leaving the target repo without `./node_modules/.bin/bandit`.
2. README leads with an unpublished npm package path. It says "once published",
   but the public quickstart still makes an unavailable path visually primary.
3. README uses `npx bandit` without guarding against registry fallback before
   local installation. The safer consumer form is `npx --no-install bandit` or
   `npm exec -- bandit` after installation, plus an npm script option.
4. README presents bare `bandit ...` blocks as common commands even though they
   are not copy-pasteable in a consumer shell unless the caller has a PATH
   modification, npm script, or global install.
5. README includes literal angle-bracket placeholders in shell blocks. These are
   not safe copy-paste commands in zsh.
6. README lists cockpit and session-context commands as post-install commands,
   but `bandit init` does not scaffold the governance and context artifacts
   those commands require.
7. A fresh consumer repo can pass `bandit validate` while missing the files that
   make it meaningfully governable by Bandit: role rules, clean-code rules,
   stage rubrics, bootstrap methodology, glossary/context, roadmap, current
   context, and operator status.
8. README lists role and workflow entry points without separating commands that
   require existing specs, roadmap/current-context artifacts, or formed work
   items.
9. There is no automated README command contract test that installs the packed
   artifact into a fresh consumer repo and verifies the documented public
   quickstart command sequence.

## Recommended Corrective Chore

Create a bootstrap-gap chore for public consumer install and README command
contract hardening.

Acceptance direction:

- Public quickstart starts with `npm init -y` when the target repo has no
  `package.json`.
- Until npm publishing happens, the primary install command is the working GitHub
  install path, not the unpublished registry package.
- Consumer command blocks use `npx --no-install bandit`, `npm exec -- bandit`,
  or `npm run bandit -- ...` after adding a local script.
- Shell blocks avoid literal angle-bracket placeholders or mark examples as
  non-copy-pasteable.
- README separates source-checkout commands, fresh-consumer commands, and
  stateful Bandit-governed-repo commands.
- `init` scaffolds starter governance artifacts for a new Bandit-governed repo,
  or the README clearly separates package installation from governance
  onboarding and provides a command to create those artifacts. The minimum
  governed-repo scaffold should account for `AGENTS.md`, `CONTEXT.md`,
  `CLEAN_CODE.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`,
  `docs/verification/STAGE_RUBRICS.md`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, and root `STATUS.md`.
- The scaffolded docs must be starter contracts, not a copy of Bandit's own
  project state. They should make role authority, clean-code expectations,
  stage verdicts, current context, roadmap, and operator status explicit for
  the consumer repo.
- A focused test installs the packed package into a temporary consumer repo and
  executes the documented quickstart and governed-repo onboarding sequence.
