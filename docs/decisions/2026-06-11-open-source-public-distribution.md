# Open-Source Public Distribution Posture

Date: 2026-06-11

## Decision

Bandit is open source under the MIT license and should not be described or
constrained as private-only. The install and discovery posture is public:
people should be able to find it, evaluate it, and install it from public npm
once released, from a public Git tag, or from a packed tarball.

## Approved By

- Operator: Matthew Flebbe, 2026-06-11.
- Repo PM: Codex recorded the decision in repo-native documentation on
  2026-06-11.

## Scope

- Remove package metadata that prevents public npm publication.
- Keep the npm package name `bandit-workflow`.
- Document public npm, public Git tag, and tarball install paths.
- Keep package contents scoped to CLI/runtime surfaces, templates, selected
  policy defaults, Local Qwen reviewer policy, and README.
- Preserve data-minimal, manual, non-blocking update checks.

## Out Of Scope

- Publishing a release in this decision.
- Adding npm publish automation.
- Handling or storing publish credentials.
- Adding hosted update services.
- Adding telemetry.
- Adding automatic self-update behavior.
- Mutating consumer repositories outside explicit CLI commands.
- Adding merge, push, deploy, or release-tag automation.

## Rationale

The previous private-only posture came from an early bootstrap distribution
chore. The operator clarified that Bandit should be discoverable and usable by
other people as an open-source project. Public installability now matches the
MIT license and the product goal of improving agentic software delivery beyond
this repository.
