# BANDIT-PRD-001: Founding Product

## Status

Draft foundation.

## Problem

AI coding workflows can produce code quickly, but they are hard to trust and harder to improve. Most harnesses focus on dispatching agents. They do not reliably answer the more important questions:

- Which agent should do this task?
- Which reviewer should check it?
- Did the review catch real issues or create noise?
- Did the workflow change make future work better?
- Which lessons should become durable policy?
- Which policies should be reverted?

The operator should not need to be a coder or release engineer to use the system safely.

## Product Thesis

Bandit is a workflow improvement engine for agentic software delivery.

The harness runs work, but the product value is the improvement loop: retrospectives, cross-model tension, review outcomes, landing evidence, and repair loops become measurable workflow changes.

Bandit also provides the coordination primitive those workflows need: explicit
repo-native workflow state, actor coordination, safe trigger points, and
runtime-agnostic handoff boundaries so agents do not infer progress from chat
or scattered artifacts.

## Users

- Primary: non-coder founder/operator managing AI-authored product work.
- Secondary: AI PM/orchestrator agents that need durable workflow policy and evidence.
- Future: teams who want to improve agentic workflows with measurable process analytics.

## Goals

- Let Codex PM manage technical routing and escalation without over-questioning the operator.
- Keep workflow state repo-native and auditable.
- Make workflow progress explicit through a repo-native coordination primitive rather than implied by artifact presence.
- Make safe landing agent-owned rather than human guesswork.
- Require pre-landing CodeRabbit and cross-model adversarial review.
- Use local Qwen as the no-paid-key baseline adversarial reviewer.
- Turn retrospectives and cross-model tension into tagged improvement chores.
- Track whether workflow changes were effective, ineffective, inconclusive, reverted, or worth doubling down on.
- Provide a lean cockpit for visibility without moving authority out of the CLI.

## Non-Goals For V0

- Full agent IDE.
- Cloud-hosted SaaS.
- Paid model dependency as a default.
- Adversarial-grade security against malicious repository owners.
- General project management replacement.
- Automatic product acceptance by agents.

## MVP User Journey

1. Operator or Codex PM creates a Feature PRD.
2. Bandit splits the PRD into slices and chores.
3. Codex PM selects specialized agents and skills from policy.
4. Work lands through branch/PR flow with tests, CodeRabbit, adversarial review, and Landing Verdict.
5. Feature slices require CLI-owned UAT approval before landing.
6. Retrospective captures lessons, repair loops, model tension, and workflow smells.
7. Closeout records whether lessons, context updates, and follow-ups are fully dispositioned.
8. Lessons become tagged improvement chores or explicit no-action decisions.
9. Improvement chores are evaluated against metrics and become keep/revise/revert/double-down decisions.

## Success Criteria

- Operator is not asked to judge routine code-safety warnings.
- Every landed PR has a Landing Verdict with review and test evidence.
- Every feature slice has UAT status tracked separately from code safety.
- Every retrospective lesson with action creates a tagged improvement chore.
- Work-item status and next action are readable from explicit repo-native coordination state.
- Improvement dashboard/report shows open, due, effective, ineffective, reverted, and double-down workflow changes.
- Codex PM can explain why a model, agent, or escalation path was selected.
