# Bandit

Bandit is a repo-native trust layer for agentic software delivery.

It helps a repository run AI-assisted work through explicit workflow stages:
context restoration, work formation, test design, implementation, review,
landing, retrospective, and improvement capture. The point is not just to run
coding agents. The point is to make agentic workflows easier to trust and
improve over time.

Bandit is open source under the MIT license. The package is intended to be
discoverable and installable by other teams; public npm publishing is allowed by
current policy, while publish credentials, hosted update services, telemetry,
automatic self-update, external repo mutation, and merge/push/deploy authority
remain out of scope for the CLI itself.

## Requirements

- Node.js and npm.
- Access to this repository, a Git tag, the npm package once published, or a
  packed tarball.
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

## Install

Install Bandit from npm once a public release is published:

```sh
npm install -D bandit-workflow
```

Until then, install from the public GitHub repository:

```sh
npm install -D github:pyxe-developer/Bandit#main
```

For repeatable installs, pin a release tag or full commit SHA once one exists.

Or install from a packed tarball:

```sh
npm pack --pack-destination /tmp/bandit-pack
cd /path/to/consumer-repo
npm install -D /tmp/bandit-pack/<printed-tarball-name>.tgz
```

Then run the installed CLI:

```sh
npx --no-install bandit init
npx --no-install bandit validate
npx --no-install bandit cockpit status --json
npx --no-install bandit session-context current --json
```

If the consumer repository prefers npm scripts, add one:

```sh
npm pkg set scripts.bandit="bandit"
npm run bandit -- validate
```

The package intentionally includes only the CLI/runtime surfaces, starter
templates, selected policy defaults, Local Qwen reviewer policy, and this
README. It excludes active work history, tests, and repo-local workflow state
from the packed distribution.

## Current Operator Commands

Use `npm run bandit -- <command>` from this checkout, or
`npx --no-install bandit <command>` from a consumer repository where Bandit is
installed.

Common first-time commands (from a consumer repo with Bandit installed):

```sh
npx --no-install bandit init
npx --no-install bandit validate
npx --no-install bandit list
npx --no-install bandit show <work-item-id>
npx --no-install bandit cockpit status --json
npx --no-install bandit session-context current --json
npx --no-install bandit update-check --json
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

Bandit supports manual, non-blocking update checks against a file-based release
manifest. Configure `.bandit/update-channel.json` in the consumer repository:

```json
{
  "contract_version": 1,
  "enabled": true,
  "package_name": "bandit-workflow",
  "installed_version": "0.0.0",
  "source_channel": "public_npm",
  "current_source_ref": "v0.0.0",
  "check_cadence_seconds": 3600,
  "update_source": {
    "type": "file",
    "path": "/path/to/bandit-release.json"
  },
  "alert": {
    "enabled": true
  }
}
```

The release manifest should be data-minimal:

```json
{
  "contract_version": 1,
  "package_name": "bandit-workflow",
  "latest_version": "0.1.0",
  "latest_ref": "v0.1.0",
  "update_command": "npm install -D bandit-workflow@0.1.0"
}
```

Run:

```sh
npx --no-install bandit update-check --json
```

Statuses are deterministic: `unconfigured`, `disabled`, `unreachable`,
`current`, or `update_available`. A successful update check writes
`.bandit/update-channel-cache.json`; normal CLI commands may print a concise
stderr update alert from a fresh cached `update_available` result, but update
checks never mutate the package or mask the requested command's exit status.
