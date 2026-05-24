# Bandit Roadmap

## Purpose

This roadmap decomposes the founding PRD into phases the operator and Codex PM can follow without losing context.

It is not a full slice backlog. Slice briefs are created one at a time when a phase is ready to execute. This document answers:

- What are we building?
- What phase are we in?
- What is done?
- What is next?
- What context must never be lost?

## Current Position

**Current phase:** Phase 4 - Review And Landing Gates.

**Current next step:** Create the next Phase 4 bootstrap work item for the escalated adversarial reviewer placeholder after confirming `BANDIT-007` closeout is committed.

**Current implementation status:** `BANDIT-001` delivered the repo-native CLI skeleton and initialized `.bandit/` state. `BANDIT-002` delivered work artifact templates, template validation, local verification, review evidence, landing verdict, and retrospective. `BANDIT-003` delivered the remaining Phase 2 PRD-to-work draft command with RED evidence, implementation evidence, review evidence, landing verdict, retrospective, landing action evidence, and passing verification. `BANDIT-004` delivered the Smell Trigger Catalog seed, routing decision artifact contract, validation path, route command, review evidence, landing verdict, landing action evidence, and retrospective. `BANDIT-005` delivered the first Phase 4 pre-landing review loop substrate with review evidence and landing verdict contracts, source-drift checks, `bandit land-check <work-item-id>`, landing action evidence, and retrospective closeout. `BANDIT-006` delivered the Local Qwen Baseline Reviewer Gate substrate with profile/evidence validation, `bandit qwen-review <work-item-id>`, dirty-worktree refusal, review-packet construction, land-check integration, review evidence, landing verdict, landing action evidence, and retrospective closeout. The live local 35B Qwen review timed out and is recorded as a bootstrap gap, not a pass. `BANDIT-007` delivered the CodeRabbit State Capture substrate with a CodeRabbit evidence template, parser/validator, `bandit coderabbit-review <work-item-id>`, `land-check` integration for claimed CodeRabbit pass state, closeout evidence, and retrospective. Live CodeRabbit polling remains a bootstrap gap, not a pass.

## Phase Map

| Phase | Name | Outcome | Status |
|---|---|---|---|
| 0 | Foundation | Product intent, architecture, methodology, roadmap, and current-context discipline exist. | Complete |
| 1 | Repo-Native CLI Skeleton | Bandit can initialize, validate, list, show, and record lifecycle events in repo-native state. | Complete |
| 2 | Work Artifacts | Bandit can create PRDs, slices, chores, and retrospective-derived improvement chores. | Complete |
| 3 | Routing And Smell Detection | Codex PM can record manager-owned routing decisions and escalate review from a smell catalog. | Complete |
| 4 | Review And Landing Gates | Bandit can produce pre-landing evidence, CodeRabbit state, Qwen review state, and Landing Verdicts. | In progress |
| 5 | UAT And Auto-Landing | Bandit can record UAT approval, detect stale UAT, and auto-land eligible PRs under policy. | Not started |
| 6 | Improvement Engine | Bandit can evaluate improvement chores and produce keep/revise/revert/double-down decisions. | Not started |
| 7 | Workflow Cockpit | Bandit has a lean UI for status, next actions, gates, UAT, and improvement health. | Not started |
| 8 | Dogfood And Hardening | Bandit uses its own workflow to build and improve itself reliably. | Not started |

## Phase 0: Foundation

Goal: Make sure the project has enough context to begin without drifting.

Completed:

- Fresh repo created.
- Founding PRD drafted.
- Founding architecture drafted.
- V0 plan drafted.
- Bootstrap methodology drafted.
- Metrics and retrospective-derived chore schema drafted.
- Roadmap and current-context checkpoint created.
- First bootstrap work item for Phase 1 created.

Remaining:

- None.

Exit criteria:

- A new Codex session can open `README.md`, this roadmap, and `CURRENT_CONTEXT.md` and know exactly what to do next.

## Phase 1: Repo-Native CLI Skeleton

Goal: Create the smallest CLI and state system that lets Bandit own durable context.

Active work:

- none.

Completed work:

- `BANDIT-001` - Repo-Native State And CLI Skeleton.
- Brief: `docs/work/BANDIT-001/brief.md`.
- Evidence: `docs/work/BANDIT-001/red-evidence.md`, `implementation-evidence.md`, `landing-verdict.md`, and `retrospective.md`.

Expected capabilities:

- `bandit init`
- `.bandit/config.toml`
- `bandit validate`
- `bandit list`
- `bandit show`
- lifecycle event JSONL writer
- work item prefix support
- basic schema validation

Why this comes first:

Bandit cannot improve workflows until it can create and validate durable workflow state.

Exit criteria:

- A repo can be initialized and validated.
- State changes are recorded in repo-native files.
- Bootstrap gaps are explicitly recorded.

Status:

- Complete.

## Phase 2: Work Artifacts

Goal: Make work visible and structured.

Active work:

- none.
- Phase 2 is complete.

Completed work:

- `BANDIT-002` - Work Artifact Templates And Validation.
- `BANDIT-003` - PRD-To-Work Draft Command.

Expected capabilities:

- Feature PRD template. Complete in `BANDIT-002`.
- Slice template. Complete in `BANDIT-002`.
- Chore template. Complete in `BANDIT-002`.
- Retrospective-derived chore metadata. Complete in `BANDIT-002`.
- PRD-to-work draft command. Complete in `BANDIT-003`.

Exit criteria:

- A PRD can be decomposed into slices and chores.
- Chores can carry origin, hypothesis, metric, baseline, and evaluation window.

Status:

- Complete.

## Phase 3: Routing And Smell Detection

Goal: Let Codex PM manage technical decisions from policy.

Active work:

- none.

Expected capabilities:

- Smell Trigger Catalog.
- Routing decision artifact.
- Escalation policy.
- Command or report explaining why a workflow, model, skill, or reviewer was selected.

Exit criteria:

- Codex PM can make manager-owned routing decisions without asking routine technical questions.

Completed work:

- `BANDIT-004` - Routing Decision And Smell Trigger Catalog.

Status:

- Complete.

## Phase 4: Review And Landing Gates

Goal: Make safe landing evidence-driven.

Active work:

- none.
- Next step: create the `BANDIT-008` brief for the escalated adversarial reviewer placeholder after confirming `BANDIT-007` closeout is committed.

Expected capabilities:

- Pre-landing review loop artifact. Complete in `BANDIT-005`.
- Landing Verdict. Complete in `BANDIT-005`.
- stale review/source-drift checks. Complete in `BANDIT-005`.
- CodeRabbit state capture. Complete in `BANDIT-007` as a repo-native gate substrate; live CodeRabbit polling remains an explicit bootstrap gap.
- Local Qwen adversarial review artifact. Complete in `BANDIT-006` as a repo-native gate substrate; live local model timeout remains an explicit bootstrap gap.
- Escalation reviewer placeholder. Next Phase 4 gap.

Exit criteria:

- A PR cannot be marked safe-to-land without required evidence.

Completed work:

- `BANDIT-005` - Pre-Landing Review Loop.
- `BANDIT-006` - Local Qwen Baseline Reviewer Gate.
- `BANDIT-007` - CodeRabbit State Capture.

## Phase 5: UAT And Auto-Landing

Goal: Separate product acceptance from code-safety judgment.

Expected capabilities:

- CLI-owned UAT approval artifact.
- Stale UAT detection after code changes.
- Auto-landing eligibility policy.

Exit criteria:

- Feature slices with green code gates but missing or stale UAT are blocked.
- Eligible chores and UAT-approved feature slices can be auto-landed under policy.

## Phase 6: Improvement Engine

Goal: Prove Bandit's differentiator.

Expected capabilities:

- Retrospective artifact.
- Cross-model tension log.
- Improvement chore ledger.
- Improvement analytics report.
- Evaluation command for due improvement chores.
- Outcomes: `keep`, `revise`, `revert`, `double_down`.

Exit criteria:

- A retrospective lesson becomes a tagged improvement chore.
- That chore can later be evaluated against a metric and outcome.

## Phase 7: Workflow Cockpit

Goal: Give the operator a clear status surface without moving authority out of the CLI.

Expected views:

- Current context.
- PRDs.
- Slices.
- Chores.
- Landing verdicts.
- UAT status.
- Improvement health.
- Next action.

Exit criteria:

- The operator can answer “where are we and what is next?” from the cockpit.
- Cockpit state is derived from repo-native state.

## Phase 8: Dogfood And Hardening

Goal: Use Bandit to improve Bandit.

Expected capabilities:

- Bandit work items use Bandit gates.
- Retrospective-derived chores are evaluated.
- Routing decisions are updated from evidence.
- Bad workflow decisions can be reverted.
- Good workflow decisions can be doubled down.

Exit criteria:

- Bandit has a visible record of improving its own workflow.

## Always-Known Context Rule

At all times, the repo must answer:

- Current phase.
- Current active work item.
- Current next action.
- Current blockers.
- Current bootstrap gaps.
- Last completed milestone.
- What changed since the last checkpoint.

If those answers are unclear, the next task is to repair context before writing code.
