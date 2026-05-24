# Bandit

Bandit is a repo-native workflow improvement engine for agentic software delivery.

The goal is not just to run coding agents. The goal is to make agentic workflows measurably better over time: safer landings, better routing, fewer repair loops, clearer decisions, and durable learning from retrospectives and cross-model tension.

The name matters. Work in this repository should be precise, evidence-backed, and built with care.

## Founding Principles

- The CLI is the authority for workflow state, gates, approvals, and landing decisions.
- The web cockpit is lean: it visualizes state and triggers approved CLI commands.
- Repo-native artifacts are canonical. Any SQLite index is rebuildable.
- Codex PM owns routine technical routing and escalation decisions.
- Specialized agents and skills are preferred over broad generalists.
- Every PR gets pre-landing CodeRabbit plus adversarial review.
- Local Qwen is the default no-paid-key adversarial reviewer.
- Feature slices require CLI-owned UAT approval before auto-landing.
- Retrospectives and cross-model tension become tagged improvement chores, metrics, and keep/revise/revert/double-down decisions.

## Founding Artifacts

- [Product PRD](docs/prds/BANDIT-PRD-001-founding-product.md)
- [Architecture](docs/architecture/founding-architecture.md)
- [V0 Plan](docs/plans/V0_PLAN.md)
- [Roadmap](docs/roadmap/ROADMAP.md)
- [Current Context](docs/roadmap/CURRENT_CONTEXT.md)
- [Clean Code Rubric](CLEAN_CODE.md)
- [Rubric-Driven Verification](docs/verification/RUBRIC_DRIVEN_VERIFICATION.md)
- [Glossary](CONTEXT.md)
- [Founding Decisions](docs/decisions/2026-05-24-founding-decisions.md)
- [Improvement Metrics Catalog](docs/improvement/metrics-catalog.md)
- [Retrospective Chore Schema](docs/improvement/retrospective-chore-schema.md)

## Current Status

Fresh repo created. Implementation has not started.
