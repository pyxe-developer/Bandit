# BANDIT-PRD-001: Founding Product

## Status

Current foundation, revised after research review.

## Problem

AI coding workflows can produce code quickly, but they are hard to trust and harder to improve. Most harnesses focus on dispatching agents. They do not reliably answer the more important questions:

- Which agent should do this task?
- Which reviewer should check it?
- Which agent-architecture components should shape the work?
- Have those agents, reviewers, skills, and component variants been tested on the same packets?
- Does this change touch a supply-chain-sensitive surface?
- Did the review catch real issues or create noise?
- What evidence and uncertainty exist around a workflow trial?
- Which lessons should become durable policy?
- Which policies should be kept, revised, reverted, or doubled down?

The operator should not need to be a coder or release engineer to use the system safely.

## Product Thesis

Bandit is a repo-native trust layer for agentic software delivery.

The harness runs work, but the product value is the trust contract: explicit evidence, gated release mechanics, operator-supervised product and risk decisions, untrusted-input posture, and a workflow learning loop that turns retrospectives and model tension into operator-reviewed workflow trials.

Bandit also provides the coordination primitive those workflows need: explicit
repo-native workflow state, actor coordination, safe trigger points, and
runtime-agnostic handoff boundaries so agents do not infer progress from chat
or scattered artifacts.

## Users

- Primary: non-coder founder/operator managing AI-authored product work.
- Secondary: AI PM/orchestrator agents that need durable workflow policy and evidence.
- Future: teams who want auditable agentic delivery with evidence-backed workflow learning.

## Goals

- Let Codex PM manage technical routing, implementation mechanics, skill/tool scoping, test strategy, and escalation without asking the operator routine technical questions.
- Keep workflow state repo-native and auditable.
- Make workflow progress explicit through a repo-native coordination primitive rather than implied by artifact presence.
- Make Landing Verdicts and routine release mechanics agent-owned under policy rather than human guesswork.
- Keep the operator in a supervision role for product direction, UAT, policy, business tradeoffs, and explicit cost or risk approvals.
- Reserve operator-blocking fail-closed behavior for safety, product, UAT, policy, business, cost, irreversible-risk, and genuinely ambiguous scope gates.
- Route ordinary operational drift to CLI-owned mechanical repair when approved repo artifacts already prove the fix.
- Require pre-landing CodeRabbit and cross-model adversarial review.
- Require an untrusted-input posture before release-authorized agents process external contributor input, fetched third-party content, or generated instructions.
- Treat external contributor text, issue/PR metadata, review comments, dependency documentation, fetched third-party content, and generated instructions as data-only input by default.
- Require an input quarantine boundary and trusted-source gate before untrusted content can affect agent instructions, tool permissions, routing, or landing authority.
- Require a supply-chain gate before dependency, lockfile, package-manager script, CI/release workflow, agent-skill, fetched-prompt, or external tool-install changes become auto-landable.
- Require a layered risk-classification gate before review depth, operator supervision, or auto-landing eligibility is finalized.
- Treat smell triggers as one risk input, not the primary authority for auto-landing safety.
- Define never-auto-landable surfaces that cannot be landed automatically even when local tests and reviewers pass.
- Use blast-radius signals, static-analysis signals, source trust, input quarantine state, and supply-chain state as independent inputs that can raise review depth or block auto-landing.
- Use local Qwen as the no-paid-key baseline adversarial reviewer.
- Treat goal definition, perception/input, context, memory, reasoning/planning, tool execution/action, orchestration/coordination, and feedback/observability as load-bearing agent components.
- Treat skills as load-bearing artifacts that shape those components and affect reviewer performance, agent performance, safety, and cost.
- Require load-bearing skills to have a lifecycle contract before they become required stage policy: owner, version, changelog, intended stages, required tools, forbidden actions, evaluation packets, and rollback criteria.
- Keep the agent role taxonomy small and authority-based: operator, PM or coordinator, worker, reviewer, and landing.
- Require each Work Item stage to declare the skills, tools, inputs, outputs, evidence, and forbidden actions needed for that stage.
- Treat capability differences such as test writing, stronger review, CodeRabbit loops, or domain-specific implementation as stage capability profiles rather than new agent roles unless authority differs.
- Capture OTel-compatible agent traces for wakeups, claims, tool calls, reviewer runs, model calls, token spend, failures, retries, and outcomes without making telemetry canonical workflow state.
- Add a benchmark-only, offline/replay Agent Evaluation Harness that runs fixed task and review packets against agents, reviewer profiles, skills, models, and load-bearing component variants without changing live routing or policy automatically.
- Split benchmark packets into visible calibration sets and versioned locked holdout sets so skills, reviewer prompts, and model routing are not tuned only to the visible suite.
- Require reviewer benchmark packets to be gold-labeled with seeded blockers and seeded non-issues, and score reviewers by blocker recall before raw finding count.
- Build the first reviewer benchmark packet set from Bandit's own workflow failure modes before using generic coding benchmark tasks.
- Classify one-off paid reviewer calls before threshold promotion as benchmark/evaluation spend that requires per-run approval or active spend-class approval and cannot become recurring reviewer routing policy.
- Require recurring paid reviewer routing to meet a predeclared promotion threshold: locked-holdout blocker-recall improvement over Qwen, false-positive ceiling, Provider Pricing Evidence-backed expected-cost ceiling, and operator-supervised spend-class approval.
- Scope recurring paid reviewer promotion thresholds by risk class or stage capability profile rather than using one global paid-reviewer threshold.
- Require reviewer capability, agent-component, current provider-pricing evidence, and cost evidence before paid adversarial reviewers become automatic policy.
- Use token and cost budgets as generous abnormal-run failsafes for paid, high-token, reviewer, or long-running execution rather than brittle caps that cause duplicate attempts.
- Make structured improvement mining an ongoing parallel process during work and a required Stage 6 closeout surface.
- Mine retrospectives for failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use rule pressure, reviewer/model routing issues, recurring inefficiency, and tool invocation friction such as repeated uncertainty about how to call CodeRabbit.
- Turn structured improvement-mining signals, retrospectives, and cross-model tension into tagged workflow trials or explicit no-action decisions.
- Require workflow trials and workflow-policy changes to record predeclared decision criteria, explicit uncertainty or minimum-detectable-effect context, and a later re-evaluation window before a keep, revise, revert, or double-down outcome changes policy.
- Track whether workflow trials were kept, revised, reverted, doubled down, or left undecided with explicit uncertainty.
- Provide a lean cockpit for visibility without moving authority out of the CLI.
- Keep append-only coordination history as the workflow source of truth, while current-state views, registries, cockpit status, and indexes remain rebuildable projections except for CAS claim authority over active writable claims.
- Use a repo-native Git refs claim authority backend for the first CAS-backed active writable claim primitive, while `.bandit` claim files remain human-readable projections.
- Require state-changing claim operations and external side effects under claims to carry both the current fencing token and an idempotency key.
- Require work-surface claimability to detect wait-for graph cycles, not just pairwise reservation overlap.
- Require a CLI-owned Git Mutation Serializer for shared `.git` plumbing mutations before parallel worktrees are release-authorized.
- Require every claim-owned worktree to be `git worktree lock`ed immediately with a stable claim-specific reason and unlocked only by Repo PM Coordinator cleanup after handoff verification.
- Require every Bandit-created worktree to satisfy a Worktree Bootstrap Contract before worker execution treats it as runnable.
- Use artifact-specific Evidence SLOs for cockpit trust signals instead of generic confidence badges.

## Non-Goals For V0

- Full agent IDE.
- Cloud-hosted SaaS.
- Paid model dependency as a default.
- Broad malicious-repository-owner security beyond the required data-only input quarantine posture.
- Broad auto-landing for feature slices or material-risk changes without operator supervision.
- Smell-list-only auto-landing eligibility or review-depth decisions.
- Auto-landing supply-chain-sensitive changes before the supply-chain gate exists.
- Auto-landing never-auto-landable surfaces by reviewer waiver, small-change exception, or passing local tests alone.
- General project management replacement.
- Automatic product acceptance by agents.

## MVP User Journey

1. Operator or Codex PM creates a Feature PRD.
2. Bandit splits the PRD into slices and chores.
3. Codex PM selects the authority role and stage-scoped skills/tools from policy.
4. Work advances through branch/PR flow with tests, CodeRabbit, adversarial review, and Landing Verdict.
5. The layered risk-classification gate evaluates hard exclusions, blast-radius signals, static-analysis signals, source trust, input quarantine state, supply-chain state, and smell triggers before review depth or auto-landing eligibility is finalized.
6. Low-risk work inside Auto-Landing Scope may be landed by the Landing Agent after gates pass.
7. Feature slices and material-risk changes require Operator Supervision, including CLI-owned UAT when product behavior changes, before the Landing Agent performs landing mechanics.
8. Structured improvement mining runs alongside the work and is reconciled at retrospective closeout.
9. Retrospective captures lessons, failed tool calls, tool invocation friction, repair loops, model tension, workflow smells, and uncertainty.
10. Closeout records whether lessons, context updates, and follow-ups are fully dispositioned.
11. Lessons and mined execution smells become tagged workflow trials or explicit no-action decisions.
12. Workflow trials are interpreted against predeclared criteria, uncertainty, minimum-detectable-effect context, and a re-evaluation window before they become keep/revise/revert/double-down decisions.

## Success Criteria

- Operator is not asked to judge routine code-safety warnings, resolve routine git issues, or perform release mechanics.
- Operator-blocking gates are limited to operator-owned decisions, while derivable metadata, projection, malformed-artifact, ledger, or workflow bookkeeping drift is handled by CLI-owned mechanical repair or Codex PM disposition.
- Every landed PR has a Landing Verdict with review and test evidence.
- Every feature slice has UAT status tracked separately from code safety.
- Every release-authorized path that processes external or third-party text has an explicit untrusted-input posture, data-only input handling, input quarantine boundary, and trusted-source gate for any content promoted to instruction-bearing context.
- Review-depth and auto-landing decisions use a layered risk-classification gate that includes hard never-auto-landable exclusions, blast-radius signals, static-analysis signals, source trust, input quarantine state, supply-chain state, and smell triggers.
- Never-auto-landable surfaces are blocked from Auto-Landing Scope even when tests, CodeRabbit, Qwen, or escalated reviewers pass.
- Any high-risk blast-radius, static-analysis, source-trust, input-quarantine, or supply-chain signal can raise review depth, require operator supervision, or block auto-landing without smell-list concurrence.
- Supply-chain-sensitive changes are blocked from auto-landing unless the supply-chain gate has explicit evidence and any required operator-supervised approval.
- Any recurring paid reviewer route has reviewer benchmark evidence, agent-component evidence, current provider-pricing evidence with source, effective date, freshness or expiry, expected per-run cost, spend class, and operator-supervised spend-class approval.
- Paid or high-token agent and reviewer execution has expected-cost evidence, current provider-pricing evidence when paid, a soft budget band, an abnormal-run failsafe, and a recorded continuation path when the failsafe trips.
- Load-bearing skills and agent components have ownership, versioning, changelogs, intended stages, required tools, forbidden actions, evaluation packets, rollback criteria, and performance evidence instead of being treated as incidental prompts.
- Work Item stages declare the skills and tools required for that stage before execution starts.
- Capability specialization is represented through stage capability profiles unless a separate authority boundary is required.
- Agent runtime behavior, cost, latency, tool friction, reviewer runs, wakeups, and failures are traceable through first-class observability data while repo-native workflow artifacts remain canonical.
- Agent and reviewer policy changes are backed by comparable replay benchmark evidence rather than one-off work-item anecdotes.
- The first Agent Evaluation Harness can compare Local Qwen, Claude or paid reviewers, skill variants, reviewer profiles, and load-bearing component variants on fixed packets, but its outputs are evidence-only until Codex PM and any required operator-supervised approval convert them into policy.
- Policy promotion from the Agent Evaluation Harness requires versioned locked holdout evidence; visible calibration packet results are development feedback and cannot be the only basis for reviewer routing, model routing, skill policy, or cost policy.
- Reviewer capability benchmarks use a scorecard that prioritizes blocker recall and also records actionable precision, useful finding yield, false-positive rate, tool friction, latency, and Provider Pricing Evidence-backed expected cost.
- One-off paid reviewer calls before threshold promotion are recorded as benchmark/evaluation spend with current provider-pricing evidence plus per-run approval or active spend-class approval, and are not treated as recurring reviewer routing policy.
- Recurring paid reviewer routes have a predeclared promotion threshold with holdout blocker-recall improvement over Qwen, false-positive and provider-pricing-backed expected-cost ceilings, plus operator-supervised spend-class approval.
- Paid reviewer promotion is limited to the approved risk class or stage capability profile; proving value for supply-chain-sensitive changes, architecture changes, or evidence-freshness logic does not make paid review the default for unrelated low-risk chores.
- The first reviewer benchmark packet set covers Bandit-specific failure modes: evidence freshness loops, malformed artifacts, CodeRabbit invocation friction, stage capability or skill scope mistakes, supply-chain-sensitive changes, stale UAT or landing evidence, and false-positive review churn.
- Every retrospective uses a structured mining checklist across load-bearing agent components.
- Repeated tool invocation friction, including confusion about how to call CodeRabbit or other required gates, is surfaced and routed to a skill, command, documentation, policy repair, workflow trial, or explicit no-action decision.
- Every retrospective lesson or material mined execution smell with action creates a tagged workflow trial or explicit no-action decision.
- Every workflow trial has predeclared decision criteria, metric evidence, baseline, uncertainty or minimum-detectable-effect context, and a re-evaluation window before it can change workflow policy.
- Workflow trial outcomes are limited to keep, revise, revert, and double-down decisions, and the decision record states why proxy metric gaming or reward-hacking side effects are not being mistaken for improvement.
- Work-item status and next action are readable from explicit repo-native coordination state.
- Current-state files, cockpit status, indexes, and in-flight registries are visibly derived from append-only coordination history, CAS claim authority, or both, and cannot become hidden workflow authority.
- Active writable claim authority uses `refs/bandit/*` and `git update-ref --stdin` compare-and-swap transactions; `.bandit` claim files are projections and cannot grant claims.
- State-changing claim operations and claim-gated external side effects require the current fencing token and an idempotency key so stale agents and retries cannot duplicate effects.
- Work-surface reservation checks refuse overlapping reservations and wait-for graph cycles before work is claimable.
- Shared `.git` worktree and repository plumbing mutations run through a CLI-owned Git Mutation Serializer; claim CAS remains separate authority.
- Claim-owned worktrees are locked immediately with a reason naming claim ID, Work Item ID, and stage, and worker-owned unlock is refused.
- A Bandit-created worktree is not runnable until its Worktree Bootstrap Contract passes validation, including setup command, validation command, allowed copy/link policy, environment references, and secret-handling boundary.
- Claim, release, reconcile, worktree-lock, and claim-gated side-effect correctness is backed by declared Claim Safety Invariants plus deterministic fault-injecting or property-style simulation; example-only duplicate-claim tests do not satisfy release authorization.
- Cockpit and CLI trust signals show source artifact, owner, freshness state, and staleness reason for tests, CodeRabbit, Qwen, escalated review, UAT, landing verdicts, retrospectives, and projections.
- Cockpit/reporting surfaces show open workflow trials, keep/revise/revert/double-down decisions, re-evaluation windows, and uncertainty rather than claiming causal proof.
- Codex PM can explain why a model, agent, or escalation path was selected.
- Routine technical questions are recorded as Codex PM decisions rather than operator prompts unless they cross product, UAT, policy, business, cost/risk, irreversible operational-risk, or genuinely ambiguous scope boundaries.
