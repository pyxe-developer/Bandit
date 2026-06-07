# Bandit

Bandit is a repo-native workflow improvement engine for agentic software
delivery.

The goal is not just to run coding agents. The goal is to make agentic
workflows measurably better over time: safer landings, better routing, fewer
repair loops, clearer decisions, and durable learning from retrospectives,
reviews, and cross-model tension.

## Requirements

- Node.js and npm.
- Access to this private repository, a private Git tag, or a packed tarball.
- For adversarial review workflows, the configured Local Qwen reviewer endpoint
  is repo-local policy under `.bandit/reviewers/local-qwen.json`.

Bandit is currently private. Public npm publishing, paid private registry setup,
hosted update services, telemetry, and automatic self-update are not part of the
current install channel.

## Use From This Checkout

Install dependencies:

```sh
npm install
```

Run the local CLI through the repository script:

```sh
npm run bandit -- validate
npm run bandit -- list
npm run bandit -- cockpit status --json
npm run bandit -- session-context current --json
```

Initialize state from this checkout when needed:

```sh
npm run bandit -- init
npm run bandit -- validate
```

In this development checkout, `init` usually reports that Bandit state already
exists because `.bandit/` state is committed as repo-native workflow evidence.

## Private Install

Install Bandit into another private repository from an explicit private Git tag:

```sh
npm install -D git+ssh://<private-host>/<org>/bandit.git#<tag>
```

Or install from a packed tarball:

```sh
npm pack --pack-destination /tmp/bandit-pack
cd /path/to/consumer-repo
npm install -D /tmp/bandit-pack/<printed-tarball-name>.tgz
```

Then run the installed CLI:

```sh
npx bandit init
npx bandit validate
npx bandit update-check --json
```

If the consumer repository prefers npm scripts, add one:

```sh
npm pkg set scripts.bandit="bandit"
npm run bandit -- validate
```

The private package intentionally includes only the CLI/runtime surfaces,
starter templates, selected policy defaults, and this README. It excludes
active work history, tests, and repo-local workflow state from the packed
distribution.

## Update Checks

Bandit supports manual, non-blocking update checks against a private file
manifest. Configure `.bandit/update-channel.json` in the consumer repository:

```json
{
  "contract_version": 1,
  "enabled": true,
  "package_name": "bandit-workflow",
  "installed_version": "0.0.0",
  "source_channel": "private_git_tag",
  "current_source_ref": "v0.0.0",
  "check_cadence_seconds": 3600,
  "update_source": {
    "type": "file",
    "path": "/path/to/private-bandit-release.json"
  },
  "alert": {
    "enabled": true
  }
}
```

The private release manifest should be data-minimal:

```json
{
  "contract_version": 1,
  "package_name": "bandit-workflow",
  "latest_version": "0.1.0",
  "latest_ref": "v0.1.0",
  "update_command": "npm install -D git+ssh://<private-host>/<org>/bandit.git#v0.1.0"
}
```

Run:

```sh
npx bandit update-check --json
```

Statuses are deterministic: `unconfigured`, `disabled`, `unreachable`,
`current`, or `update_available`. A successful update check writes
`.bandit/update-channel-cache.json`; normal CLI commands may print a concise
stderr update alert from a fresh cached `update_available` result, but update
checks never mutate the package or mask the requested command's exit status.

## Common Commands

Use `npm run bandit -- <command>` from this checkout, or `npx bandit <command>`
from a consumer repository where Bandit is installed.

```sh
bandit init
bandit validate
bandit update-check [--json]
bandit list
bandit show <work-item-id>
bandit gaps list
bandit cockpit status --json
bandit session-context current --json
bandit repo-pm <create-work-item|approve-formation> [args]
bandit work-item-pm start <work-item-id>
```

Running `bandit` with no command prints the full current command list.

## Source Of Truth

For source-checkout development, current workflow state lives in repo artifacts,
not in this README:

- [Status](STATUS.md)
- [Current Context](docs/roadmap/CURRENT_CONTEXT.md)
- [Roadmap](docs/roadmap/ROADMAP.md)
- [Stage Rubrics](docs/verification/STAGE_RUBRICS.md)
- [Clean Code Rubric](CLEAN_CODE.md)
- [Glossary](CONTEXT.md)

Before starting or continuing Bandit work, restore context from those artifacts
and follow the active work item, stage rubrics, and slice-boundary rules.

## Founding Artifacts

- [Product PRD](docs/prds/BANDIT-PRD-001-founding-product.md)
- [Architecture](docs/architecture/founding-architecture.md)
- [V0 Plan](docs/plans/V0_PLAN.md)
- [Rubric-Driven Verification](docs/verification/RUBRIC_DRIVEN_VERIFICATION.md)
- [Bandit Skill Source](skills/bandit/SKILL.md)
- [Founding Decisions](docs/decisions/2026-05-24-founding-decisions.md)
- [Improvement Metrics Catalog](docs/improvement/metrics-catalog.md)
- [Retrospective Chore Schema](docs/improvement/retrospective-chore-schema.md)
