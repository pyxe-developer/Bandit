# Git Mutation Serializer

**Date:** 2026-05-27
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

Bandit will require a repo-level Git Mutation Serializer before
release-authorized parallel worktrees are enabled.

The serializer is a CLI-owned single-writer guard around shared `.git`
plumbing mutations that can contend across parallel worktrees. It covers
worktree creation, removal, pruning, lock or unlock operations, branch/ref
maintenance outside the claim CAS boundary, and packed-refs-affecting
maintenance.

Every claim-owned worktree is locked immediately after creation with
`git worktree lock`. The lock reason must be stable across claim renewal and
must name the Bandit claim ID, Work Item ID, and stage. Fencing tokens do not
belong in the lock reason because they may change during renewal.

Worktree creation is not complete until the worktree lock succeeds. If locking
fails after creation, the serializer-owned flow records failure evidence and
either releases or marks the claim failed according to the claim lifecycle
rules.

The serializer does not replace the Git refs Claim Authority Primitive. Claim
refs still use `refs/bandit/*` and `git update-ref --stdin` compare-and-swap
semantics as the writable-claim authority. The serializer protects shared Git
plumbing around worktree and repository lifecycle operations.

## Rationale

The Git refs claim backend solves claim authority, but it does not make every
shared `.git` operation safe under parallel agent execution. Worktree
creation, deletion, pruning, and repository maintenance can still contend on
shared Git state.

Serializing those operations keeps Bandit's parallelism boundary narrow and
observable: agents can run work in separate worktrees, but only CLI-owned
repository plumbing paths mutate shared `.git` state.

## Consequences

- `BANDIT-GAP-GIT-MUTATION-SERIALIZER` must define and validate the serializer
  before parallel worktrees are release-authorized.
- Workstream agents must not call shared Git plumbing directly for worktree or
  repository lifecycle mutation.
- Claim-first worktree creation and Repo PM Coordinator cleanup must use the
  serializer for shared `.git` operations.
- Claim-owned worktrees must be `git worktree lock`ed with a claim-specific
  reason immediately after creation.
- Only the Repo PM Coordinator may unlock a claim-owned worktree, and only
  after handoff verification and cleanup routing.
- Serializer behavior must be explicit enough to test contention, stale lock
  handling, timeout/failure behavior, and non-serialized mutation refusal.
- Serializer and claim-owned worktree lock failure paths must be included in
  Claim Safety Invariant simulation where they can affect claim release,
  reconciliation, or false-active-claim cleanup.
- The serializer is not workflow authority and cannot grant claim ownership.

## Not Decided

- Exact lock file path or lock primitive.
- Exact timeout and stale-lock recovery policy.
- Whether claim-ref `git update-ref --stdin` operations are wrapped by the
  serializer or only coordinated with it.
- Exact diagnostics and trace fields emitted by serializer operations.
