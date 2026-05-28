# Founding Architecture

## Overview

Bandit is a CLI-authoritative, repo-native workflow improvement engine with a lean web cockpit.

The CLI mutates workflow state, enforces gates, runs local checks, invokes model/review integrations, records evidence, and produces landing verdicts. The cockpit visualizes state and triggers approved CLI commands.

## Implementation Defaults

- Language/runtime: TypeScript on Node.js.
- State directory: `.bandit/`.
- Work item prefix: `BANDIT`.
- Canonical state: markdown plus structured JSON/JSONL artifacts in the repo.
- Index: optional SQLite cache under `.bandit/index.sqlite`, rebuildable from repo artifacts.
- Web cockpit: later MVP, likely Vite/React or equivalent, read-only except for invoking CLI commands.

## Core State

Expected repo-native state families:

- `docs/prds/` for Feature PRDs.
- `docs/work/` or equivalent for slices and chores.
- `.bandit/events.jsonl` for lifecycle events.
- `.bandit/reviews/*.jsonl` for review/tension/evaluation events.
- `.bandit/improvements/*.jsonl` or structured markdown for improvement analytics.
- `.bandit/config.toml` for project policy.

Exact paths are not final, but every canonical record must be reconstructable from git.

## Workflows

### Feature Work

Feature PRD -> slices and chores -> implementation branch -> tests -> pre-landing review loop -> UAT approval -> landing verdict -> merge -> retrospective -> improvement chores.

### Chore Work

Chore prompt -> heartbeat or manual execution -> branch/PR -> pre-landing review loop -> landing verdict -> merge -> retrospective when meaningful -> improvement analytics if the chore came from a workflow lesson.

### Landing

The Landing Agent owns code-safety judgment under policy. It may auto-land chores and UAT-approved feature slices after required gates pass.

Landing gates:

- CI/tests pass.
- CodeRabbit pre-landing loop completes.
- Local Qwen adversarial review completes.
- Escalated adversarial review completes when smells require it.
- CodeRabbit request-changes or unresolved actionable findings are repaired or block.
- Feature slices have non-stale UAT approval.
- Landing Verdict is written.

### UAT

UAT approval is a CLI-owned repo-native artifact. Cockpit buttons may trigger it, but cockpit storage is not canonical.

For v0, any branch code change after UAT makes UAT stale.

## Agent Roles

Initial conceptual roles:

- Codex PM: orchestrates, routes, plans, owns bootstrap RED test authorship when needed, decides technical verdicts from policy, and does not implement code for work items whose tests it authored.
- Test Writer: owns acceptance and regression test contracts.
- Writer: implements bounded production changes and never edits tests for the work item it implements.
- Adversarial Reviewer: required cross-model reviewer, local Qwen baseline.
- Strong Reviewer: escalation reviewer for risk smells.
- CodeRabbit Loop Agent: handles queueing, reading, repair prompts, and disposition evidence.
- Landing Agent: produces landing verdicts and lands safe PRs.
- Retrospective Agent: drafts retrospective summaries.
- Improvement Analyst: evaluates improvement chores and proposes keep/revise/revert/double-down decisions.
- Heartbeat Chore Agent: runs approved low-risk chores and due improvement evaluations.

Agents should be specialized. Each role needs explicit inputs, permissions, outputs, evidence, and unavailable protocol.

## Smell-Based Escalation

Escalate review when a PR touches auth, security, privacy, data integrity, schema, migration, infra, deploy, release, billing, workflow gates, approval systems, CodeRabbit waiver, UAT, evidence freshness, state machines, parsers, validators, JSONL logs, registries, indexes, or generated schemas.

Also escalate for large scope, multi-phase orchestrators, low-confidence Qwen, CodeRabbit request-changes, stale review/UAT/source drift, repeated repair loops, test-boundary violations, missing coverage, context pressure, unavailable agents, malformed evidence, or load-bearing policy drift.

## Improvement Engine

Bandit tracks whether workflow changes work.

Inputs:

- Retrospectives.
- Cross-model tension.
- CodeRabbit outcomes.
- Landing verdicts.
- Repair loops.
- Incidents and escaped defects.
- Operator interventions.
- Smell triggers.

Outputs:

- Tagged improvement chores.
- Metric baselines.
- Evaluation windows.
- Outcome decisions: keep, revise, revert, double_down.
- Routing and policy updates.

## Safety Posture

Bandit is designed for cooperative local workflow safety: preventing operator slips, agent drift, stale approvals, missing review, and workflow forgetfulness.

It is not v0 adversarial security against compromised credentials, malicious maintainers, or forged repository history.
