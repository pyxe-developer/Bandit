# Worktree Bootstrap Contract

## Status

Accepted

## Context

Bandit will eventually create claim-owned worktrees for parallel writable
workstreams. A successful claim plus `git worktree lock` protects ownership and
shared `.git` plumbing, but it does not prove the worktree can actually run the
stage. Missing env files, setup commands, generated assets, local dependencies,
or secret references can make a correctly claimed worktree fail only after a
worker starts.

The operator delegated routine technical questions to Codex PM when repo
evidence and accepted policy are sufficient. Product direction, UAT, policy,
business, explicit cost/risk, irreversible operational risk, and genuinely
ambiguous scope remain operator-owned.

## Decision

Every Bandit-created worktree must satisfy a repo-native Worktree Bootstrap
Contract before worker execution treats it as runnable.

The first implementation should use a CLI-readable policy artifact such as
`.bandit/policy/worktree-bootstrap.json`, with optional `.worktreeinclude`-style
allow-list support for repositories that need file copy/link declarations.

The contract must cover:

- allowed copied or linked files;
- setup commands;
- validation command;
- environment-variable references;
- secret-handling boundary;
- expected runtime dependencies;
- bootstrap failure evidence.

Secret material is not copied into worktrees by default. Worktrees should
reference approved secret sources unless an existing operator-supervised policy
explicitly authorizes a narrower exception.

## Consequences

- A locked worktree is not automatically a runnable worktree.
- Worker execution must be refused until the Worktree Bootstrap Contract passes.
- Bootstrap failure records PM-visible evidence and routes the claim to failed,
  blocked, or recovery-required state.
- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` must define the artifact schema,
  CLI behavior, tests, and validation path before event-driven scheduler work
  assumes runnable worktrees.
- The Worktree Bootstrap Contract complements, but does not replace, the Git
  Mutation Serializer or Claim Authority Primitive.

## Alternatives Considered

- Treat `git worktree add` plus `git worktree lock` as sufficient. Rejected
  because ownership and `.git` serialization do not prove runtime readiness.
- Copy local environment files by convention. Rejected because it hides setup
  state and can accidentally copy secret material.
- Leave bootstrap to worker prompts. Rejected because a worker prompt is not a
  repo-native, testable contract and would make failures inconsistent.

## Open Questions

- Exact schema for `.bandit/policy/worktree-bootstrap.json`.
- Whether `.worktreeinclude`-style allow-list support is implemented directly or
  generated from the CLI-readable policy.
- The exact claim state used for recoverable bootstrap failure.
