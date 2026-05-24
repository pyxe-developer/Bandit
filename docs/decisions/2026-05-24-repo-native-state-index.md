# Repo-Native State And Rebuildable Index Decision

**Date:** 2026-05-24
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

The fresh harness repo will make repo-native workflow artifacts canonical. A local SQLite database may exist, but only as a rebuildable index for the Workflow Cockpit.

## Rationale

The trust layer depends on workflow evidence being durable, reviewable, portable, and reconstructable without a running web app. Repo-native files make work state visible in pull requests and allow CodeRabbit, GitHub review, local CLI checks, and future migrations to inspect the same records.

SQLite is still useful for cockpit responsiveness, filtering, search, and dashboards. It should be treated as derived state that can be dropped and rebuilt from the repo artifacts.

## Consequences

- Backlogs, slices, chores, run records, reviews, lessons, follow-ups, approvals, and UAT readiness need stable file formats.
- The CLI owns writes to canonical workflow artifacts.
- The Workflow Cockpit can maintain or request a State Index refresh, but cannot make hidden state changes that are absent from the repo.
- Any future server mode must preserve the same canonical repo-artifact boundary.

## Not Decided

- Exact state directory name.
- Exact JSON/Markdown/JSONL schema split.
- Whether the first State Index ships in v0 or waits until cockpit queries demand it.
