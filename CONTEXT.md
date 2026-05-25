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
A lean web application that visualizes repo-backed workflow and coordination state and triggers approved CLI commands without becoming the enforcement layer.
_Avoid_: full agent IDE, autonomous factory, separate project tracker

**Repo-Native Workflow State**:
Versioned project files that are the canonical record for PRDs, slices, chores, runs, reviews, lessons, follow-ups, approvals, UAT, bootstrap gaps, and improvement decisions.
_Avoid_: dashboard database truth, hidden app state

**Coordination Primitive**:
A repo-native contract that makes work-item position, next action, actor handoff, and blocked state explicit for agents and automation.
_Avoid_: chat context, GitHub issue thread, implied workflow state

**SDLC Microstep State Machine**:
A durable sequence of small workflow states that governs one work item from brief through closeout.
_Avoid_: artifact pile, coarse SDLC phase, checklist-only workflow

**Shared Core State Machine**:
The common SDLC microstep sequence used by both slices and chores before work-type-specific extensions apply.
_Avoid_: separate workflow per work type, duplicated stage model, feature-only lifecycle

**Typed State Extension**:
A work-type-specific addition to the shared core state machine, such as feature UAT or chore-specific no-action disposition.
_Avoid_: forked lifecycle, hidden exception, ad hoc state

**Retrospective Recorded State**:
A workflow state proving the work item's retrospective artifact exists.
_Avoid_: closed, done, all lessons dispositioned

**Closed Work Item**:
A work item whose required artifacts, dispositions, context updates, and follow-up routing are complete.
_Avoid_: landed, retro written, inactive

**Step Transition Ledger**:
The canonical repo-native record of a work item's workflow-state transitions.
_Avoid_: derived status only, prose progress note, checklist checkbox

**Append-Only Transition Log**:
A Step Transition Ledger shape where every workflow-state change is recorded as a new immutable transition entry.
_Avoid_: current-state-only file, overwritten progress, mutable audit trail

**Per-Work-Item Transition Log**:
An append-only transition log scoped to one work item.
_Avoid_: repo-wide canonical ledger, shared hot file, global mutable queue

**Per-Work-Item Coordination Log**:
A unified append-only work-item log containing typed workflow transitions and actor coordination events.
_Avoid_: split timeline, actor-only source of truth, workflow-only audit trail

**Derived Current State View**:
A rebuildable view of the latest accepted workflow state computed from the append-only transition log.
_Avoid_: canonical state, hidden cache, dashboard truth

**Authoritative In-Flight Registry**:
A repo-native coordination artifact that agents may treat as authoritative for currently claimed or runnable work only after CLI reconciliation with the relevant work-item coordination state.
_Avoid_: advisory dashboard, chat queue, stale status summary

**Work Surface Reservation**:
An exclusive coordination claim over the files, artifacts, or repo resources a work stage may write while it is in flight.
_Avoid_: best-effort note, read-only interest, implied ownership

**Declared Work Surface**:
The files, path patterns, or named repo resources a work item or chore is allowed to write during a claimable stage.
_Avoid_: inferred edit area, unlimited repo access, post-hoc collision check

**Single-Claim Heartbeat**:
A recurring automation activation that may claim and start at most one runnable work stage after reconciling coordination state and work surface reservations.
_Avoid_: batch runner, queue drainer, multi-claim activation

**Work Claim Lease**:
A time-bound exclusive claim over one work stage and its work surface reservation, with renewal required during long-running work and recovery required before clearing expired claims with unmerged changes.
_Avoid_: permanent lock, blind timeout cleanup, chat-owned ownership

**Claim-First Worktree Start**:
The rule that a session must record an exclusive work claim lease before creating an ephemeral worktree for that stage.
_Avoid_: speculative worktree, claim-after-start, parallel unclaimed setup

**Atomic Work Claim**:
A CLI-owned claim operation that reconciles current work-item state and in-flight reservations, then either records one exclusive work claim lease or fails without starting work.
_Avoid_: manual registry edit, advisory claim, best-effort lock

**One Active Claim Per Work Item**:
The v0 coordination rule that a work item may have no more than one active work claim lease at a time, even when multiple stages appear theoretically available.
_Avoid_: same-item parallel stages, split ownership inside one work item, evidence race

**Post-Bootstrap Parallel Workstreams**:
Bandit's future ability to run multiple non-overlapping work items at the same time after the active bootstrap-gap lane is resolved, blocked, or explicitly dispositioned.
_Avoid_: bootstrap shortcut, one-gap-at-a-time bypass, uncontrolled concurrency

**Agent Coordination Contract**:
A repo-native protocol for agents to claim, hand off, block, complete, request repair, and resume bounded work.
_Avoid_: informal delegation, chat-only handoff, human task board

**Agent Coordination Event**:
A repo-native actor action recorded against a work item and, when relevant, a current workflow state.
_Avoid_: workflow state transition, chat update, unstructured status note

**Accepted Block**:
A validated coordination state meaning a work item cannot legally advance until the recorded resume condition is satisfied.
_Avoid_: actor opinion, warning, advisory concern

**Block Event**:
An Agent Coordination Event where an actor reports a blocking condition, owner, required input, and resume condition.
_Avoid_: accepted workflow state, vague concern, hidden blocker

**Safe Trigger Point**:
A CLI-confirmed workflow transition where automation may observe or begin a bounded follow-up action.
_Avoid_: webhook as authority, arbitrary event trigger, UI-owned trigger

**Trigger Signal**:
A non-authoritative coordination event that may prompt inspection but cannot start automation until reconciled into a Safe Trigger Point.
_Avoid_: safe trigger point, automation authority, accepted workflow state

**Runtime-Agnostic Coordination**:
The rule that Bandit coordinates bounded work steps without owning the runtime that executes those steps.
_Avoid_: VM-first architecture, swarm platform, provider-specific orchestration

**Bandit-Governed Repository**:
A repository whose agentic workflow is coordinated by Bandit's shared contracts, gates, and evidence model.
_Avoid_: bespoke repo workflow, local convention, one-off automation

**Self-Governing Repository**:
A Bandit-governed repository that retains canonical authority over its own workflow state and evidence.
_Avoid_: centrally owned repo state, external source of truth, dashboard-controlled workflow

**Cross-Repo Coordination**:
Bandit's ability to coordinate consistent workflow states and safe trigger points across multiple Bandit-governed repositories.
_Avoid_: fleet runtime, shared dashboard only, multi-repo script

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

**Tagged Chore Ledger**:
A single repo-native queue of chores whose origin, risk, heartbeat eligibility, blocker state, and improvement metadata are represented with tags or required fields rather than separate chore queues.
_Avoid_: separate chore logs, hidden follow-up bucket, untyped maintenance backlog

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

**Stage 4 Evidence-Head Semantics**:
The contract that distinguishes historical review artifacts from current landing-gate evidence during iterative review and disposition loops. The contract must keep actual source-code drift fail-closed without requiring every historical review artifact to share one final source head.
_Avoid_: recursive rerun loop, stale-evidence waiver, reviewer-by-inertia

**Review Subject Hash**:
A deterministic hash of the review-relevant subject for a work item: implementation source, tests, policy, reviewer profiles, governance files, and selected work-item contract artifacts. It separates "what was reviewed" from "which commit contains terminal evidence," so evidence-only commits do not force repeated Stage 4 review loops while source, test, policy, and reviewer-input changes still fail closed.
_Avoid_: raw HEAD as review identity, evidence artifact commit as source freshness

**Hash-Based Evidence Freshness**:
The Stage 4 freshness method introduced by `BANDIT-019`: when review evidence records `review_subject_hash`, landing readiness compares the current review-subject hash instead of treating every raw git HEAD mismatch as stale. Historical artifacts without `review_subject_hash` keep the previous Stage 4 fallback behavior.
_Avoid_: current-head refresh loop, self-invalidating evidence write

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
- A **Coordination Primitive** is part of **Repo-Native Workflow State**.
- An **SDLC Microstep State Machine** is recorded in a **Step Transition Ledger** so work-item progress is explicit instead of inferred from artifacts alone.
- A **Shared Core State Machine** governs both **Slices** and **Chores**, with **Typed State Extensions** for work-type-specific requirements.
- A **Retrospective Recorded State** is not the same as a **Closed Work Item**.
- A **Step Transition Ledger** lives inside a **Per-Work-Item Coordination Log** as typed workflow transition events.
- A **Derived Current State View** may summarize a **Step Transition Ledger**, but it is not canonical.
- An **Agent Coordination Contract** uses **Runtime-Agnostic Coordination** so Codex, Claude, Qwen, CI jobs, Owner VMs, or future harnesses can execute bounded steps without becoming Bandit's planning authority.
- An **Agent Coordination Event** lives inside a **Per-Work-Item Coordination Log** without becoming workflow state itself.
- A **Block Event** becomes an **Accepted Block** only when accepted by CLI validation or Codex PM policy.
- A **Safe Trigger Point** is exposed by **CLI Authority** from validated step transitions and displayed by the **Workflow Cockpit**.
- An **Agent Coordination Event** may be a **Trigger Signal**, but it is not a **Safe Trigger Point** until validated into workflow state.
- **Cross-Repo Coordination** depends on **Self-Governing Repositories** that share the same core coordination contracts while retaining repo-local canonical state.
- A **Feature PRD** is split into **Slices** and **Chores** so product delivery and maintenance can use different workflows.
- A **Bootstrap Gap** discovered at this stage becomes the next **Bootstrap-Gap Chore** before unrelated feature or slice work proceeds.
- A **Heartbeat Chore Agent** may run selected **Chores**, but it does not get the same authority as a feature implementation workflow.
- A **Heartbeat Chore Agent** prepares eligible work; a **Landing Agent** decides whether a PR can land under policy.
- A **Landing Verdict** replaces asking the operator to judge routine code-safety warnings.
- A **Landing Verdict** requires a completed **Pre-Landing Review Loop**.
- **Stage 4 Evidence-Head Semantics** keeps iterative review closeout from becoming recursive while preserving fail-closed behavior for actual source drift.
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
- "software factory" overlaps Bandit's coordination problem but is not the primary product category; resolved: Bandit is a **Workflow Improvement Engine** whose **Coordination Primitive** can support software-factory use cases.
- "swarm" and "fleet" describe runtime scaling patterns; resolved: Bandit adopts **Runtime-Agnostic Coordination**, not a VM, fleet, or swarm architecture.

## Imported Decision Context

The decision records in `docs/decisions/` were imported from Sourmash on 2026-05-24 because they contain the discussion context that led to Bandit. They are provenance and source material. Current Bandit planning authority lives in `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, active work-item artifacts, and accepted Bandit decision records.
