# Bandit Context

Bandit defines a trust and improvement layer for agentic software delivery.

## Language

**Workflow Improvement Engine**:
The closed loop that turns retrospectives, cross-model tension, review outcomes, incidents, and smell triggers into tagged improvement chores, measurable trials, analytics, and keep/revise/revert/double-down decisions.
_Avoid_: retrospective theater, buried lessons, generic analytics dashboard

**Trust Layer**:
A project-portable contract that constrains, observes, and verifies AI development work.
_Avoid_: task tracker, generic agent runner

**Harness**:
The runtime that manages agents, permissions, context, communication, gates, and lifecycle events.
_Avoid_: script pile, prompt convention

**CLI Authority**:
The rule that workflow state changes and enforcement decisions are performed by the command-line runtime, not by the web interface.
_Avoid_: UI-owned enforcement, dashboard-as-source-of-truth

**Workflow Cockpit**:
A lean web application that visualizes repo-backed workflow state and triggers approved CLI commands without becoming the enforcement layer.
_Avoid_: full agent IDE, autonomous factory, separate project tracker

**Repo-Native Workflow State**:
Versioned project files that are the canonical record for PRDs, slices, chores, runs, reviews, lessons, follow-ups, approvals, UAT, and improvement decisions.
_Avoid_: dashboard database truth, hidden app state

**State Index**:
A rebuildable local cache, likely SQLite, that helps the Workflow Cockpit query and filter Repo-Native Workflow State without becoming canonical.
_Avoid_: source of truth, primary workflow database

**Feature PRD**:
A planning artifact that captures the product problem, solution, user stories, implementation decisions, testing decisions, and explicit out-of-scope boundaries before implementation is split into work.
_Avoid_: ticket, vague feature request, implementation prompt

**Slice**:
A bounded implementation unit for product or behavior-changing work that moves through planning, tests, quality gates, review, and UAT.
_Avoid_: generic task, chore

**Chore**:
A bounded non-product work unit for maintenance, tooling, documentation, state repair, evidence refresh, cleanup, or continuous improvement.
_Avoid_: slice, feature, backlog junk drawer

**Heartbeat Chore Agent**:
A recurring automation that can inspect eligible chores and run approved low-risk maintenance workflows under CLI Authority.
_Avoid_: unattended feature builder, direct-main agent

**Landing Agent**:
A CLI-authorized release worker that evaluates PR readiness, interprets mechanical gates, repairs safe issues, and lands approved work without requiring the operator to make code-safety judgments.
_Avoid_: human rubber-stamp, direct-main chore runner, deploy bot

**Landing Verdict**:
A recorded decision that classifies a PR as safe-to-land, blocked, needs-repair, or requires operator approval, backed by CI, tests, CodeRabbit, adversarial review, review freshness, PR accuracy, UAT, and policy evidence.
_Avoid_: warning dump, looks-good summary, user gut check

**Pre-Landing Review Loop**:
A CLI-driven quality loop that runs required external and cross-model review gates before the Landing Agent can produce a safe-to-land verdict.
_Avoid_: post-merge cleanup, optional advisory scan

**CodeRabbit Pre-Landing Loop**:
A CLI-driven CodeRabbit cycle that requests or reads review, repairs actionable findings, waits for reruns when needed, and records the final CodeRabbit state before landing.
_Avoid_: GitHub-only waiting, after-merge review, unchecked queue delay

**Adversarial Review Gate**:
A required pre-landing cross-model review for every PR, using a configurable reviewer profile to look for failures, edge cases, and trust-boundary problems.
_Avoid_: same-model self-review, optional critique, compliments

**Adversarial Reviewer Profile**:
The configured model, prompt, tools, cost budget, timeout, and blocking policy for the Adversarial Review Gate.
_Avoid_: hard-coded model choice, hidden prompt, permanent default

**Local Qwen Baseline Reviewer**:
The default no-paid-key adversarial reviewer that runs on every PR before landing.
_Avoid_: best reviewer forever, optional local check

**Adversarial Escalation**:
The policy path that adds or replaces the baseline reviewer with a stronger or second reviewer for complex or high-risk PRs.
_Avoid_: manual panic review, permanent expensive default

**Manager-Owned Routing**:
The rule that Codex PM selects the right workflow, skill, agent, reviewer, and escalation path from recorded policy and repo evidence instead of asking the operator to make technical routing decisions.
_Avoid_: operator-as-engineering-manager, every-choice questionnaire

**Operator Input Boundary**:
The rule that Codex PM must call out missing operator-owned input when repo artifacts cannot answer a product, UAT, policy, business tradeoff, explicit cost/risk override, or genuinely ambiguous scope question.
_Avoid_: guessing user intent, burying uncertainty, asking the operator routine technical routing questions

**Smell Trigger Catalog**:
A repo-native policy list of risk signals that require stronger review, narrower slice planning, mechanical enforcement, or halt-and-surface behavior.
_Avoid_: gut feel, buried retrospective lesson, ad hoc escalation

**Specialized Agent Role**:
A narrowly scoped agent or skill with explicit inputs, permissions, outputs, unavailable protocol, and evidence contract for one kind of work.
_Avoid_: generalist prompt, vague helper

**Cross-Model Tension Log**:
A repo-native record of substantive disagreements between implementation, review, CodeRabbit, and adversarial models, including the decision made and whether later evidence validated it.
_Avoid_: forgotten chat disagreement, untracked model preference

**Retrospective-Derived Chore**:
An improvement chore created from a retrospective lesson, tagged with source slice, lesson, hypothesis, expected impact, metric, baseline, trial window, and evaluation status.
_Avoid_: untracked follow-up, vague process note

**Improvement Analytics**:
Metrics that show whether workflow changes improved delivery, review quality, repair-loop count, false-positive rate, landing safety, cost, latency, or operator burden.
_Avoid_: vanity charts, activity counts without outcome signal

**Improvement Decision**:
An explicit keep, revert, revise, or double-down decision made after evaluating an improvement chore or cross-model tension decision against outcome data.
_Avoid_: permanent default by inertia, forgotten experiment

**Approved UAT**:
An operator-recorded acceptance that a feature slice satisfies its product and user-facing contract in the relevant test environment.
_Avoid_: test pass, code review, assumed acceptance

**UAT Approval Artifact**:
A repo-native record written by CLI Authority when the operator accepts a feature slice in a named environment.
_Avoid_: hidden UI flag, PR comment as source of truth, verbal approval

**Stale UAT**:
A previously recorded UAT approval that no longer authorizes landing because branch code changed after approval.
_Avoid_: assumed-valid acceptance, agent-classified product impact

## Relationships

- CLI Authority keeps the Trust Layer enforceable while the Workflow Cockpit keeps work visible.
- Repo-Native Workflow State is canonical; the State Index may be rebuilt from it.
- Feature PRDs split into Slices and Chores.
- Heartbeat Chore Agent prepares eligible chores; Landing Agent decides if PRs can land.
- Landing Verdict requires a completed Pre-Landing Review Loop.
- Local Qwen Baseline Reviewer runs on every PR; Adversarial Escalation adds stronger review when smells require it.
- Manager-Owned Routing means Codex PM applies the Smell Trigger Catalog without asking routine technical questions.
- Operator Input Boundary means Codex PM halts and asks directly when the missing decision belongs to the operator.
- Workflow Improvement Engine turns retrospectives and cross-model tension into Retrospective-Derived Chores, Improvement Analytics, and Improvement Decisions.
- Feature slices require Approved UAT before auto-landing.
- Any branch code change after a UAT Approval Artifact creates Stale UAT for v0.
