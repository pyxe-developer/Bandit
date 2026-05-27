# Git Refs Claim Authority Backend

**Date:** 2026-05-27
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

Bandit's first Claim Authority Primitive will use a repo-native Git refs
transaction backend.

Active writable claim authority lives in a `refs/bandit/*` namespace. Claim
create, renew, release, fail, block, complete, and recover operations use
`git update-ref --stdin` compare-and-swap transactions as the writer authority
boundary. State-changing claim operations and external side-effecting
operations under a claim also require the current fencing token and a stable
idempotency key.

Human-readable `.bandit` claim files, in-flight registries, cockpit status, and
state indexes are projections. They can explain claim state and support
inspection, but they cannot grant, renew, release, or recover a writable claim.

Append-only work-item coordination history remains canonical workflow history.
The Git refs claim backend is the active writable-claim authority exception:
it grants or refuses live writable claims, then coordination history and
projections reconcile with that authority.

## Rationale

Plain JSON, Markdown, and JSONL files are good repo-native artifacts, but they
do not provide a real compare-and-swap boundary for concurrent writable claims.
A file-only read/check/write sequence can race; fail-closed reconciliation on a
later operation is not the same as atomic claim creation.

Git refs keep the authority repo-native while providing a documented
compare-and-swap write primitive. This preserves Bandit's no-hidden-DB posture
without pretending `.bandit` projection files are a lock service.

Keeping `.bandit` claim state as a projection preserves inspectability for
operators, CodeRabbit, future cockpit views, and agents. The authority boundary
stays narrow: only the CLI-owned Git refs backend may grant or refuse active
writable claims.

## Consequences

- `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` must implement the first claim
  backend with `refs/bandit/*` and `git update-ref --stdin` transactions.
- `.bandit` in-flight claim files must be treated as rebuildable projections,
  not as claim authority.
- Claim operations must reconcile Git refs claim state, projection state, and
  append-only work-item coordination history before acting.
- Manual projection edits cannot create, renew, release, complete, or recover a
  claim.
- Tests must define Claim Safety Invariants and prove them with deterministic
  fault-injecting or property-style simulation; example-only duplicate-claim
  tests are insufficient for release authorization.
- The simulation must cover claim, release, reconcile, stale expected state,
  stale fencing tokens, idempotency replay and conflict, projection/history
  disagreement, work-surface wait-for cycles, and failed serializer or
  worktree-lock cleanup where applicable.
- Fencing tokens remain required on successful writable claims and on later
  state-changing or external side-effecting operations.
- Idempotency keys remain required on state-changing claim operations and
  external side-effecting operations under a claim, so same-key same-input
  retries are recognized and same-key conflicting input is refused.
- Future SQLite, local daemon, cockpit, or scheduler work must not replace this
  claim authority boundary unless a later accepted decision changes the
  backend.
- This claim authority decision does not serialize all shared `.git` plumbing;
  release-authorized parallel worktrees also require the Git Mutation Serializer
  accepted in `docs/decisions/2026-05-27-git-mutation-serializer.md`.

## Not Decided

- Exact `refs/bandit/*` ref naming scheme.
- Exact claim record object shape.
- Whether claim records are stored as blobs, commits, or another Git object
  shape behind refs.
- Exact fencing-token derivation.
- Exact idempotency-key storage shape, retention window, and mismatch
  diagnostics.
- Exact projection regeneration command.
- Exact reader consistency strategy for reconciling refs, projections, and
  coordination history.
