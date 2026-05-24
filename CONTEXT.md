# Bandit

Bandit defines a trust and improvement layer for AI-authored development workflows. This glossary keeps the product language precise while preserving the decisions and context that led from Sourmash to this fresh repository.

Sourmash is source material, evidence archive, terminology history, and prior-art context. It is not Bandit's planning authority. Bandit owns the current implementation direction.

## Language

**Trust Layer**:
A project-portable contract that constrains, observes, and verifies AI development work.
_Avoid_: task tracker, generic agent runner

**Workflow Improvement Engine**:
The closed loop that turns retrospectives, cross-model tension, review outcomes, incidents, and smell triggers into tagged improvement chores, measurable trials, analytics, and keep/revise/revert/double-down decisions.
_Avoid_: retrospective theater, buried lessons, generic analytics dashboard

**True Agent**:
A harness-managed actor with bidirectional agent-to-agent communication, scoped permissions, controlled context, and observable lifecycle.
_Avoid_: subprocess prompt, one-shot reviewer, structured-output command

**Process Adapter**:
A compatibility bridge that invokes a model through a CLI or subprocess without making it a true agent.
_Avoid_: agent, subagent

**Harness**:
The runtime that manages true agents, communication, permissions, context, and lifecycle events.
_Avoid_: CLI wrapper, script runner

**Harness Candidate**:
A runtime being evaluated for hosting the Bandit trust layer without locking Bandit to one model provider.
_Avoid_: preferred vendor, default CLI

**Provider-Agnostic Harness**:
A harness that can configure agents across multiple model providers through explicit per-agent settings.
_Avoid_: single-provider harness, proprietary lock-in

**Runtime Portability Gate**:
A hard exclusion rule requiring harness candidates to avoid proprietary lock-in and support provider-agnostic agent configuration.
_Avoid_: preference, nice-to-have

**Harness Spike**:
A prototype plan that tests harness candidates against sourmash gates using observed behavior.
_Avoid_: decision memo, architecture essay

**Harness Spike Plan**:
A source-material documentation artifact under `docs/spikes/` that defines evidence-producing harness evaluation work.
_Avoid_: ADR, decision record

**Fresh Harness Repo**:
Bandit: the new implementation home for the next trust-layer runtime, using Sourmash as source material rather than continuing the subprocess-first Sourmash architecture in place.
_Avoid_: Sourmash rewrite, fork-and-patch continuation

**CLI Authority**:
The rule that workflow state changes and enforcement decisions are performed by the command-line runtime, not by the web interface.
_Avoid_: UI-owned enforcement, dashboard-as-source-of-truth

**Workflow Cockpit**:
A lean web application that visualizes repo-backed workflow state and triggers approved CLI commands without becoming the enforcement layer.
_Avoid_: full agent IDE, autonomous factory, separate project tracker

**Repo-Native Workflow State**:
Versioned project files that are the canonical record for PRDs, slices, chores, runs, reviews, lessons, follow-ups, approvals, UAT, bootstrap gaps, and improvement decisions.
_Avoid_: dashboard database truth, hidden app state

**State Index**:
A rebuildable local cache, likely SQLite, that helps the Workflow Cockpit query and filter Repo-Native Workflow State without becoming canonical.
_Avoid_: source of truth, primary workflow database

**Feature PRD**:
A planning artifact that captures the product problem, solution, user stories, implementation decisions, testing decisions, and explicit out-of-scope boundaries before implementation is split into work.
_Avoid_: ticket, vague feature request, implementation prompt

**Slice**:
A bounded implementation unit for product or behavior-changing work that should move through planning, TDD, quality gates, review, and UAT.
_Avoid_: generic task, chore

**Chore**:
A bounded non-product work unit for trust-layer maintenance, tooling, documentation, state repair, evidence refresh, cleanup, or continuous-improvement work.
_Avoid_: slice, feature, backlog junk drawer

**Bootstrap Gap**:
A missing final workflow capability identified while Bandit is still bootstrapping. A gap may be recorded only to avoid pretending a gate ran, and it must become executable gap-resolution work at this stage of the project unless an operator-owned product or policy decision blocks that work. After the current active slice lands, open bootstrap gaps are addressed one at a time before unrelated new work proceeds.
_Avoid_: deferred forever, passive known issue, hidden missing gate

**Bootstrap-Gap Chore**:
A chore whose purpose is to convert one Bootstrap Gap into a durable artifact, CLI command, validator, agent contract, or explicit no-action policy decision.
_Avoid_: feature slice, vague cleanup, future note

**Heartbeat Chore Agent**:
A recurring automation that can inspect eligible chores and run approved low-risk maintenance workflows under CLI Authority.
_Avoid_: autonomous product implementer, unattended feature builder

**Landing Agent**:
A CLI-authorized release worker that evaluates PR readiness, interprets mechanical gates, repairs safe issues, and lands approved low-risk work without requiring the operator to make code-safety judgments.
_Avoid_: human rubber-stamp, direct-main chore runner, deploy bot

**Landing Verdict**:
A recorded decision that classifies a PR as safe-to-land, blocked, needs-repair, or requires operator approval, backed by CI, tests, CodeRabbit, adversarial review, review freshness, PR accuracy, and policy evidence.
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
The default no-paid-key adversarial reviewer that runs on every PR before landing. The bootstrap runtime routes through the repo-local oMLX OpenAI-compatible endpoint and must not silently fall back to Qwen Code CLI, Ollama, global Mastra Code settings, or paid-key sidecars.
_Avoid_: best reviewer forever, optional local check, hidden provider drift

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

**Auto-Landing Scope**:
The policy boundary allowing the Landing Agent to merge both chores and feature slices after the required non-code approvals and all mechanical gates are green.
_Avoid_: direct-to-main automation, product acceptance by agent

**Mini SeekWins Delivery Loop**:
A spike proof that starts or observes a governed run from a control plane, keeps PM context alive, separates Test Writer, Writer, and Reviewer agent profiles, records agent-to-agent evidence, mechanically blocks a forbidden action, and leaves Mastra-readable or Mastra-reconfigurable state.
_Avoid_: agent chat demo, subprocess smoke test

**SeekWins Transferability Gate**:
A hard exclusion rule requiring a harness candidate to leave a demonstrated path for building SeekWins on top of, or directly reconfiguring into, the chosen agent workflow.
_Avoid_: bonus criterion, later integration

**Mastra**:
The application agent framework used by SeekWins.
_Avoid_: Mastra Code

**Mastra Code**:
The coding-agent harness related to, but distinct from, Mastra.
_Avoid_: Mastra

**Planning Authority**:
The actor allowed to define product direction, architecture direction, acceptance contracts, and go/no-go decisions.
_Avoid_: implementation helper, reviewer

**Execution Worker**:
A bounded agent that implements or checks a pre-approved contract without redefining the plan.
_Avoid_: planner, architect

## Relationships

- A **Trust Layer** can run on one or more **Harnesses**.
- A **Harness** manages one or more **True Agents**.
- A **Harness Candidate** must pass the **Runtime Portability Gate**.
- A **Provider-Agnostic Harness** satisfies one part of the **Runtime Portability Gate**.
- A **Harness Spike** evaluates **Harness Candidates** before any replacement architecture is adopted.
- A **Harness Spike** may be specified by a **Harness Spike Plan** imported from Sourmash source material.
- **Bandit** preserves Sourmash's **Trust Layer** contracts while replacing Sourmash's deprecated subprocess-first architecture.
- **CLI Authority** keeps the **Trust Layer** enforceable while the **Workflow Cockpit** keeps slices, chores, reviews, lessons, follow-ups, and UAT readiness visible.
- **Repo-Native Workflow State** is canonical; a **State Index** may be rebuilt from it for cockpit speed and filtering.
- A **Feature PRD** is split into **Slices** and **Chores** so product delivery and maintenance can use different workflows.
- A **Bootstrap Gap** discovered at this stage becomes the next **Bootstrap-Gap Chore** before unrelated feature or slice work proceeds.
- A **Heartbeat Chore Agent** may run selected **Chores**, but it does not get the same authority as a feature implementation workflow.
- A **Heartbeat Chore Agent** prepares eligible work; a **Landing Agent** decides whether a PR can land under policy.
- A **Landing Verdict** replaces asking the operator to judge routine code-safety warnings.
- A **Landing Verdict** requires a completed **Pre-Landing Review Loop**.
- A **CodeRabbit Pre-Landing Loop** runs before landing so review queues and repair loops do not happen after merge.
- An **Adversarial Review Gate** is required for every PR and is configured by an **Adversarial Reviewer Profile**.
- The **Local Qwen Baseline Reviewer** runs on every PR; **Adversarial Escalation** adds a stronger or second reviewer when policy says complexity or risk requires it.
- **Manager-Owned Routing** means Codex PM applies the **Smell Trigger Catalog** to choose skills, agents, review depth, and model escalation without asking the operator to make routine technical calls.
- **Specialized Agent Roles** are preferred over broad generalists when a repeated workflow has stable inputs, permissions, outputs, and evidence.
- **Cross-Model Tension Log** entries keep disputed model judgments visible for later evaluation.
- The **Workflow Improvement Engine** is the harness's differentiator: it converts **Retrospective-Derived Chores** and cross-model tension decisions into measurable **Improvement Analytics** and later **Improvement Decisions**.
- **Retrospective-Derived Chores** and cross-model tension follow-ups must be tagged so the cockpit and CLI can track whether they were effective, ineffective, reverted, or worth doubling down on.
- **Auto-Landing Scope** includes **Chores** and **Slices**, but feature **Slices** require **Approved UAT** before the Landing Agent can merge them.
- **Approved UAT** is represented by a **UAT Approval Artifact** written by **CLI Authority**; the **Workflow Cockpit** may trigger that command, but does not store acceptance as canonical state.
- Any branch code change after a **UAT Approval Artifact** creates **Stale UAT** for v0; feature **Slices** require renewed **Approved UAT** before auto-landing.
- A **Harness Candidate** must pass the **SeekWins Transferability Gate** by demonstrating a **Mini SeekWins Delivery Loop**.
- A **Process Adapter** may call a model, but it is not a **True Agent**.
- **Planning Authority** belongs to the operator and Codex PM unless explicitly delegated.
- Claude, Codex, or another model may act as an **Execution Worker**, but planning authority remains with the operator and Codex PM unless explicitly delegated.

## Example Dialogue

> **Dev:** "Can we call `claude -p` the Writer agent?"
> **Domain expert:** "No. That is a **Process Adapter** unless the harness gives it bidirectional communication, scoped permissions, controlled context, and lifecycle visibility."

## Flagged Ambiguities

- "subagent" was used to mean both **True Agent** and **Process Adapter**; resolved: Bandit requires bidirectional agent-to-agent communication for true agents.
- "Claude" was used as both planner and worker; resolved: model workers are not Bandit planning authority by default.
- "Mastra" was used as shorthand for multiple related surfaces; resolved: **Mastra** and **Mastra Code** are distinct harness candidates and must be evaluated separately.

## Imported Decision Context

The decision records in `docs/decisions/` were imported from Sourmash on 2026-05-24 because they contain the discussion context that led to Bandit. They are provenance and source material. Current Bandit planning authority lives in `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, active work-item artifacts, and accepted Bandit decision records.
