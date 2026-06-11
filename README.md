# Bandit

Bandit is a repo-native trust layer for agentic software delivery.

It helps a repository run AI-assisted work through explicit workflow stages:
context restoration, work formation, test design, implementation, review,
landing, retrospective, and improvement capture. The point is not just to run
coding agents. The point is to make agentic workflows easier to trust and
improve over time.

Bandit is currently private. Public npm publishing, paid private registry setup,
hosted update services, telemetry, automatic self-update, external repo
mutation, and merge/push/deploy authority are not part of the current install
channel.

## Requirements

- Node.js and npm.
- Access to this private repository, a private Git tag, or a packed tarball.
- For adversarial review workflows, the configured Local Qwen endpoint used by
  this repository's policy.

## First-Time Use From This Checkout

Install dependencies:

```sh
npm install
```

Validate the checkout:

```sh
npm run bandit -- validate
npm run typecheck
npm test
```

Run the local CLI through the repository script:

```sh
npm run bandit -- list
npm run bandit -- cockpit status --json
npm run bandit -- session-context current --json
```

Initialize state only when starting from a repository that does not already have
Bandit state:

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
npx bandit cockpit status --json
npx bandit session-context current --json
```

If the consumer repository prefers npm scripts, add one:

```sh
npm pkg set scripts.bandit="bandit"
npm run bandit -- validate
```

The private package intentionally includes only the CLI/runtime surfaces,
starter templates, selected policy defaults, Local Qwen reviewer policy, and
this README. It excludes active work history, tests, and repo-local workflow
state from the packed distribution.

## Current Operator Commands

Use `npm run bandit -- <command>` from this checkout, or `npx bandit <command>`
from a consumer repository where Bandit is installed.

Common first-time commands:

```sh
bandit init
bandit validate
bandit list
bandit show <work-item-id>
bandit cockpit status --json
bandit session-context current --json
bandit update-check --json
```

Role-oriented workflow entry points:

```sh
bandit repo-pm create-work-item
bandit repo-pm approve-formation <work-item-id>
bandit work-item-pm start <work-item-id>
```

The current convenience adapters for local operator workflows are:

```sh
bandit work-create --json
bandit work-execute --json
```

`work-create` delegates to the Repo PM create-controller and stops before Stage
2 work. `work-execute` delegates to the Work Item PM execute-controller and
reports the next authorized route or blocker for the active formed work item.
Both commands emit non-canonical operator-facing output; durable workflow state
continues to live in the repository artifacts managed by the CLI.

Running `bandit` with no command prints usage and the role entry points.
`--help` is not currently a supported flag.

## Manual Update Checks

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
