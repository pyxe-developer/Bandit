# BANDIT-PRD-002: Post-Bootstrap Parallel Workstreams

## Status

Draft. Ready for post-bootstrap agent decomposition after the active bootstrap-gap
lane is resolved, blocked, or explicitly dispositioned.

Triage label: ready-for-agent after bootstrap.

## Problem

Bandit currently runs work as a single active stream. This is correct during
bootstrap because the repository is still converting missing gates into durable
commands, policies, and artifacts. After bootstrap, the operator wants multiple
agent sessions to move faster by working on different non-overlapping work
items at the same time.

The present "Bandit Next Work Item" heartbeat can start a new Codex run every
15 minutes, but the workflow does not yet have a strict, machine-enforced way
to prove which work items are already in flight, which stage each item is in,
which surfaces are reserved, which worktree owns the work, and whether the
next heartbeat should start work or do nothing. Without that contract, the worst
failure mode is duplicative work on the same item or colliding edits across
worktrees.

The operator also identified a role gap: there is no Repo PM Coordinator. Codex
currently acts as PM, worker, triager, reviewer router, and operator liaison in
each invocation. Parallel workstreams require a control-plane role that keeps
work unblocked, supervises Work Item PM Orchestrators, writes briefs, triages
follow-ups, maintains operator escalations, and pauses wasted heartbeats when no
work is available.

## User

Primary user: the operator managing Bandit-governed repositories.

Primary agent user: Codex PM running as the Repo PM Coordinator.

Secondary agent users: workstream agents, landing agents, future PR-resolution
agents, and future cockpit views that need reliable repo-native coordination
state.

## Goals

- Allow multiple non-overlapping workstreams to run after bootstrap without
  duplicate claims on the same work item or stage.
- Make in-flight work independently authoritative and reconciled with each
  work item's canonical coordination state before any work starts.
- Require every write-capable workstream to claim one stage and declared work
  surface before creating an ephemeral worktree.
- Let a heartbeat activation decide whether to recover existing work, continue
  an open stage, claim new unblocked work, claim an eligible chore, or do
  nothing.
- Introduce a Repo PM Coordinator protocol that can unblock work, create briefs,
  prioritize, triage follow-ups, maintain PM-owned context, supervise Work Item
  PM Orchestrators, escalate to the operator, and pause heartbeats when all work
  is blocked.
- Preserve role boundaries: PM orchestrates, workstream agents implement,
  landing agents decide landing, and the operator owns product direction, UAT,
  policy changes, business tradeoffs, and explicit cost or risk overrides.
- Keep all coordination repo-native and CLI-authoritative. A database or cockpit
  may index or visualize state later, but it must not become hidden authority.
- Keep worktrees ephemeral. Workstream agents mark work cleanup-ready; the Work
  Item PM Orchestrator verifies handoff and evidence transfer, and the Repo PM
  Coordinator handles claim release, integration routing, and worktree deletion.
- Make the protocol reusable across projects through a global Repo PM
  Coordinator skill with Bandit-specific adapters.

## Solution

Bandit will add a post-bootstrap coordination feature that combines an
Authoritative In-Flight Registry, atomic work claim leases, declared work
surface reservations, Repo PM Coordinator governance, and workstream heartbeat
execution.

The Authoritative In-Flight Registry is canonical for active claims and
reservations. Per-work-item coordination state remains canonical for workflow
stage and evidence. The CLI must reconcile both sources before creating,
renewing, releasing, recovering, or completing a claim. If the registry and
work-item state disagree, the CLI fails closed and routes the discrepancy to PM
repair. Agents must never resolve the disagreement by editing the registry or
work item manually.

Every write-capable workstream follows claim-first worktree start:

1. Reconcile work-item state, registry state, active leases, and declared work
   surfaces.
2. Atomically claim exactly one runnable stage and its work surface reservation.
3. Create an ephemeral worktree only after the claim succeeds.
4. Execute the stage, renewing the claim lease as needed.
5. Record stage evidence and a Work Item PM Orchestrator-consumable handoff summary.
6. Mark the claim cleanup-ready or blocked; do not delete the worktree.
7. The Work Item PM Orchestrator verifies that work was transferred correctly;
   the Repo PM Coordinator handles shared-resource integration routing, releases
   the claim, and deletes the worktree.

A Repo PM Coordinator becomes the control plane. It reads required PM surfaces,
maintains `CURRENT_CONTEXT.md`, maintains the Work Intake Ledger, creates or
updates briefs within approved product scope, prioritizes available work,
supervises Work Item PM Orchestrators, escalates operator-owned blockers in the
Operator Inbox, and controls Workstream Agent heartbeat pause/resume behavior.
The Repo PM Coordinator may pause its own recurring automation only when there
are no active claims, no recovery-required leases, no unarchived completed
worktrees, no runnable non-overlapping work, and no remaining coordination
duties. The operator is the only actor allowed to unpause heartbeats. In the
file-based era, operator-visible coordination messages are written to the
Operator Inbox rather than delivered as proactive notifications. Richer
notification or interruption behavior is deferred to future GUI or cockpit work.

Work Item PM Orchestrators may propose follow-up Work Items and `spawns`
dependency edges from their owned orchestration surfaces, but they do not make
those proposals globally claimable. The Repo PM Coordinator accepts,
prioritizes, rejects, or escalates proposed follow-ups before they enter the
repo-level queue.

The Work Intake Ledger becomes the single pre-queue surface for all proposed
work: chores, retrospective improvement candidates, feature ideas, reviewer
follow-ups, operator requests, spawned work, deferred cleanup, and product
questions. Superseded proposal surfaces such as `FOLLOWUPS.md`, work-item
follow-up candidate files, and the prior chore-only ledger plan must be migrated
into the Work Intake Ledger, marked deprecated during migration, and removed
after validation proves every item has an intake outcome. In v0, the ledger is
agent-maintained from guided operator workflows rather than direct operator
editing. Entries expose mutable current state for scanning and claimability
checks, while transition history preserves who or what changed each entry, when,
why, and the prior and next states. Future storage or database work may improve
the representation, but this PRD preserves repo-native artifacts as the
authoritative contract.

Work Intake Ledger entries are triaged with a Work Intake Triage Skill. The
skill ranks entries before presentation, walks the operator through selected
entries one at a time, presents evidence and opportunity, asks clarifying
questions, and records consensus outcomes: `accepted_to_queue`,
`accepted_deferred`, `needs_more_info`, `needs_operator`, `declined`,
`duplicate`, or `superseded`. `accepted_to_queue` is the triage decision; the
Repo PM Coordinator materializes it through the CLI-authoritative path by
allocating a real Work Item ID, creating the initial artifact shell, linking back
to the proposal, and making the work eligible for queueing and claimability
checks. If one agent session performs both steps, it must record the triage
consensus before acting as Repo PM Coordinator for materialization.
Materialization queues the Work Item but does not make it automatically
claimable. Claimability still requires no `recovery_required_claim` or
`expired_claim`, unblocked dependency graph state, declared write surfaces, valid
scope and acceptance criteria, no conflicting active claim, and any required
product, operator, or policy approval. A queued Work
Item that is not claimable remains in `queued` state with a Claimability Report
of `claimability: blocked`; the report must list all known blockers and name a
deterministic `primary_blocker` rather than moving the Work Item into a separate
queue. Initial blocker values are `missing_policy_approval`,
`missing_product_or_operator_approval`, `recovery_required_claim`,
`expired_claim`, `dependency`, `conflicting_active_claim`,
`invalid_scope_or_acceptance`, and `missing_declared_write_surface`. Primary
blocker priority follows that order, placing claim recovery state ahead of
ordinary dependency blockers. The Repo PM Coordinator may automatically repair
mechanical blockers, such as missing declared write surfaces or normalized scope
and acceptance metadata, only when the answer is derivable from already approved
PRDs, briefs, or work artifacts. `recovery_required_claim` is not mechanically
repairable and always routes through claim/recovery protocol. `expired_claim` is
mechanically repairable only when repo evidence proves there is no unmerged work
and policy allows release. Required evidence is the claim record, worktree path
and branch, clean worktree status, no untracked or staged changes, no commits
ahead of the integration base unless already transferred, and policy allowing
release. The generated human-readable release rationale belongs in the
mechanical-repair transition-history entry and is derived from the evidence, such
as "lease expired; worktree clean; branch has no untransferred commits; policy
allows release." The Claimability Report may reference that transition-history
entry ID after repair; it does not own a separate release-rationale artifact. If
any evidence is missing or ambiguous, `expired_claim` converts to
`recovery_required_claim` instead of being released. It must not invent product
scope, grant approvals, override policy, break dependencies, or force-resolve
conflicting claims. Non-mechanical repairs become a Work Item Proposal or
Operator Inbox entry. Every automatic mechanical repair is one atomic
CLI-authoritative operation: it applies the state change, appends transition
history with actor, source evidence, fields changed, before and after values,
and the blocker cleared, assigns and returns the stable transition-history entry
ID, recomputes the Claimability Report once, and fails without partial state if
any step cannot complete. The operation requires expected-current-state inputs:
the observed Claimability Report ID or hash, observed blocker state, and observed
target Work Item state. If current repo state differs, the CLI refuses without
changes and requires the Repo PM Coordinator to reread and recompute before
trying again. The Repo PM Coordinator submits proposed transition content and
evidence, but agents must not author stable transition IDs directly.
Mechanical-repair transition-history entries are immutable once written.
Corrections append a new transition or amendment entry that references the
original transition-history entry ID, rather than mutating the original entry. If
blockers remain after recompute, the Work Item stays queued with the updated
report. If recompute clears blockers for new queued work, the Repo PM
Coordinator marks the Work Item claimable and leaves selection to the regular
Single-Claim Heartbeat scheduler; it must not immediately assign the work or wake
a worker lane for that new work. A Work Item counts as already in progress only
when it has an existing Work Item PM Orchestrator context and prior non-terminal
lifecycle evidence, such as an active claim, blocked stage, cleanup-ready
handoff, review-feedback loop, or equivalent non-terminal state. A newly
materialized queued Work Item is not in progress. If an in-progress Work Item
cannot be resumed, it remains blocked. `recovery_required_claim` or
`expired_claim` prevents Work Item PM Orchestrator wake. If recompute clears
every blocker for an in-progress Work Item, the Repo PM Coordinator may wake that
Work Item PM Orchestrator to resume orchestration, but it must not acquire a Work
Claim Lease or start execution. The wake payload must include Work Item ID,
cleared blocker, updated Claimability Report ID or hash, resume reason, and
timestamp. The Work Item PM Orchestrator must not clear leases, recover
worktrees, or claim replacement work. The Repo PM Coordinator must not run
repeated repair-and-recompute loops in one activation.
`accepted_deferred` remains in the Work Intake Ledger until a later promotion
decision. Each triage session prioritizes low-effort/high-impact opportunities,
handles prioritized new or untriaged entries first, then presents a list of
`accepted_deferred` entries and asks the operator whether any should be revisited
in that session. The skill may end a session without exhausting the list, but
every skipped or unresolved presented entry must keep or receive an explicit
state such as untriaged, `needs_more_info`, or `needs_operator`. Promotion from
`accepted_deferred` to `accepted_to_queue` requires presenting the prior
decision, current evidence, changed context, and operator confirmation;
previously deferred entries should be emphasized when earlier work makes them
materially lower effort or higher impact. Ranking is advisory: the skill should
explain the suggested order and may briefly challenge an override, but an
explicit operator choice to address a different item must be honored and
recorded. Lightweight override metadata may be captured when it falls out of the
triage flow, but missing structured learning fields must not block intake
triage; if richer ranking-learning instrumentation would add workflow
complexity, it should be proposed as a later Work Item Proposal.

Any operator-facing request to review the Work Intake Ledger invokes the Work
Intake Triage Skill. The Repo PM Coordinator and Work Intake Triage Skill are
the only authorities that may mutate Work Intake Ledger triage state. Work Item
PM Orchestrators, workers, reviewers, retrospectives, and other agents may
propose entries or proposed transitions, but they cannot mark proposals
accepted, deferred, declined, superseded, or claimable. Read-only listing,
validation, and reporting commands may inspect the ledger for evidence, but they
do not satisfy a review request and must not mutate triage state.

The workstream heartbeat remains a worker lane. Each activation may claim at
most one runnable stage. If no claim is available, it records or emits a no-op
status and exits. The operator can tune heartbeat frequency based on how much
work is likely available without risking duplicate execution.

## Non-Goals

- Do not interrupt the active bootstrap-gap lane or start parallel execution
  before bootstrap is complete.
- Do not allow two active claims for the same work item in v0.
- Do not implement product-scope changes without a grill-with-docs session and
  a resulting PRD, documented change, or work item.
- Do not make the Repo PM Coordinator an implementation agent.
- Do not allow the Repo PM Coordinator to acquire work claims or start
  execution.
- Do not give workstream agents landing authority.
- Do not let workstream agents delete worktrees.
- Do not let any agent perform another role's governed action for convenience.
- Do not make the Operator Inbox general agent context.
- Do not introduce a database, GUI cockpit, centralized external source of
  truth, or cross-repo scheduler in v0.
- Do not implement dynamic per-stage model routing in v0. The model and
  reasoning profile are set when the relevant automation is created.
- Do not solve PR issue resolution or PR-safe landing governance in this PRD.
  That requires a later dedicated agent and policy.
- Do not require every future repo to be Bandit-specific. The Repo PM
  Coordinator protocol should be global, with Bandit-specific integration
  layered on top.

## Stories Or Workflows

1. As the operator, I want multiple non-overlapping workstreams to run at the
   same time, so that Bandit can move faster after bootstrap without creating
   duplicate work.
2. As the operator, I want the shared in-flight document to be authoritative for
   active work, so that agents do not choose work from stale chat or an advisory
   dashboard.
3. As the operator, I want in-flight state and work-item state to confirm each
   other before work starts, so that disagreement becomes a repair condition
   instead of a hidden race.
4. As the operator, I want duplicate work on the same item prevented by a
   claim-first protocol, so that parallel sessions cannot waste time or corrupt
   evidence.
5. As the operator, I want each heartbeat to decide whether useful work exists,
   so that I can tune heartbeat frequency while active or AFK.
6. As the operator, I want a heartbeat to no-op cleanly when no work is
   available, so that idle automations do not create churn.
7. As the operator, I want one Repo PM Coordinator to keep work unblocked, so
   that each worker run does not need to rediscover priorities and blockers.
8. As the operator, I want PM escalations in an Operator Inbox, so that I can
   answer work stoppages without reading every agent artifact.
9. As the operator, I want the Repo PM Coordinator to consume my Operator Inbox
   responses, so that operator decisions become durable work artifacts.
10. As the operator, I want the Repo PM Coordinator to pause worker heartbeats
    when all work is blocked, so that repeated worker runs are not wasted.
11. As the operator, I want the Repo PM Coordinator to pause its own recurring
    automation only after writing the exact re-engagement requirement, so that I
    can restart work intentionally.
12. As the operator, I want only the operator to unpause heartbeats, so that
    agents cannot silently resume blocked work.
13. As Codex PM, I want a global Repo PM Coordinator skill with a checklist and
    protocol, so that PM orchestration is repeatable across projects.
14. As Codex PM, I want a Bandit adapter for the global Repo PM Coordinator
    skill, so that Bandit-specific artifacts and commands are used without
    making the global protocol Bandit-only.
15. As Codex PM, I want required `MEMORY.md` fields for each automation, so that
    the heartbeat can retain operational audit context until a database exists.
16. As Codex PM, I want PM decisions that affect canonical repo state written to
    repo artifacts, so that automation memory does not become hidden authority.
17. As Codex PM, I want `CURRENT_CONTEXT.md` as PM-owned operational context, so
    that next-action routing can be updated freely without treating
    grill-with-docs context as scratch space.
18. As Codex PM, I want `CONTEXT.md` reserved for durable product vocabulary and
    grill-with-docs artifacts, so that routine PM status does not dilute the
    domain glossary.
19. As Codex PM, I want one Work Intake Ledger instead of scattered follow-up,
    chore, retrospective, feature, and review candidate surfaces, so that every
    proposed Work Item has one triage path.
20. As Codex PM, I want a Work Intake Triage Skill that walks the operator
    through proposed work one item at a time, so that each decision has shared
    context and recorded consensus.
21. As Codex PM, I want all superseded intake surfaces migrated, deprecated, and
    removed after validation, so that old follow-up files do not remain parallel
    sources of truth.
22. As Codex PM, I want Work Item PM Orchestrators to propose follow-up Work
    Items without making them globally claimable, so that local Work Item
    context is captured without creating queue chaos.
23. As Codex PM, I want the Repo PM Coordinator to accept and prioritize
    proposed follow-ups only when product scope is already documented, so that PM
    does not create product direction without the operator's grill-with-docs
    process.
24. As Codex PM, I want every runnable item to declare expected write surfaces,
    so that the claim operation can detect collisions before work begins.
25. As Codex PM, I want the scheduler to prefer recovery, active continuation,
    highest-priority unblocked work, then eligible chores, so that the next
    heartbeat follows a deterministic priority order.
26. As Codex PM, I want expired claims with unmerged changes to enter
    recovery-required state, so that no agent auto-deletes useful work.
27. As Codex PM, I want claim creation to be atomic and CLI-owned, so that two
    simultaneous sessions cannot both believe they own the same stage.
28. As Codex PM, I want claim creation to happen before worktree creation, so
    that speculative worktrees do not create hidden work.
29. As Codex PM, I want failed worktree creation to release or mark the claim
    failed, so that registry state does not falsely block future work.
30. As Codex PM, I want the Repo PM Coordinator to delete worktrees only after
    Work Item PM Orchestrator verification, so that completed work is not lost
    before integration or transfer.
31. As a workstream agent, I want to claim one runnable stage at a time, so that
    my scope and write authority are explicit.
32. As a workstream agent, I want a lease renewal command, so that long-running
    stages remain visibly owned.
33. As a workstream agent, I want collision refusal messages that name the
    conflicting work surface and owner, so that I can stop without guessing.
34. As a workstream agent, I want to run read-only inspection without a claim, so
    that status checks do not create unnecessary locks.
35. As a workstream agent, I want any write, mutating command, reviewer
    evidence, or worktree creation to require a claim, so that meaningful side
    effects are governed.
36. As a workstream agent, I want to commit focused work on an ephemeral branch,
    so that my output can be reviewed, integrated, or abandoned cleanly.
37. As a workstream agent, I want to hand off stage completion with changed
    files, verification, blockers, next recommended stage, and cleanup readiness,
    so that PM can route the work without chat context.
38. As a landing agent, I want PM to route only policy-eligible work after gates
    pass, so that landing remains a specialized governed decision.
39. As a future PR-resolution agent, I want PR issue resolution and safe landing
    governance kept separate, so that this concurrency feature does not blur
    landing authority.
40. As a future cockpit, I want to read derived state from CLI-reconciled
    artifacts, so that the UI can visualize work without owning authority.
41. As a future cross-repo operator, I want the Repo PM Coordinator protocol to
    be reusable across projects, so that Bandit practices can spread after the
    CLI can update installed copies.
42. As a reviewer, I want all claim, recovery, PM, and worktree behavior tested
    through external command outcomes, so that coordination safety is not
    asserted only by implementation structure.

## Acceptance Criteria

- The feature is not enabled until the bootstrap-gap lane is complete, blocked,
  or explicitly dispositioned.
- An Authoritative In-Flight Registry exists for active claims and reservations.
- Work-item coordination state and the registry are independently authoritative
  in their domains and must confirm each other before a claim is accepted.
- Any disagreement between registry state and work-item state fails closed into
  PM repair or recovery workflow.
- The CLI exposes an atomic claim operation that either records one exclusive
  Work Claim Lease or fails without starting work.
- A claim reserves both work item plus stage and declared write surfaces.
- v0 allows at most one active claim per work item.
- Every runnable work item or chore declares expected write surfaces before it
  is claimable.
- The scheduler refuses claims with overlapping work surface reservations.
- A heartbeat activation can claim at most one runnable stage.
- Read-only inspection can run without a claim.
- Any write, mutation, reviewer-evidence write, handoff write, or worktree
  creation requires an active claim.
- Worktree creation happens only after a successful claim.
- If worktree creation fails, the claim is released or marked failed with a
  PM-visible reason.
- Work Claim Leases include owner/session, work item, stage, declared surface,
  worktree path when created, branch, claimed timestamp, expiration timestamp,
  renewal timestamp, status, and recovery metadata.
- Expired claims without unmerged work may be released by policy.
- Expired claims with unmerged changes become recovery-required and are not
  auto-deleted.
- Workstream agents can renew, complete, block, fail, and mark cleanup-ready,
  but cannot land or delete worktrees.
- Work Item PM Orchestrator verifies completed work was transferred correctly
  before shared-resource cleanup begins.
- Repo PM Coordinator controls integration routing, claim release, and worktree
  deletion, and can route eligible work to Landing Agent after gates pass.
- Landing Agent owns the landing verdict and action; workstream agents do not.
- The scheduler priority order is recovery-required claims, continuable active
  work, highest-priority unblocked queued work, deterministic tie-breakers, then
  eligible low-risk chores.
- The project uses a single Work Intake Ledger for all proposed work, including
  chores, retrospective improvement candidates, feature ideas, reviewer
  follow-ups, operator requests, spawned work, deferred cleanup, and product
  questions.
- Work Intake Ledger entries record source, rationale, suggested Work Item type,
  dependency edges, scope, risk, product-scope status, and triage outcome.
- Work Intake Ledger entries expose current state for scanning and preserve
  transition history for decision provenance.
- Work Intake Ledger entries are maintained through agent-mediated operator
  workflows such as Work Intake Triage Skill and grill-with-docs; the operator
  is not expected to edit intake entries directly.
- Operator-facing Work Intake Ledger review requests invoke the Work Intake
  Triage Skill.
- Only Repo PM Coordinator and Work Intake Triage Skill mutate Work Intake
  Ledger triage state; other roles may propose entries or transitions.
- Work Intake Triage Skill records `accepted_to_queue` consensus; Repo PM
  Coordinator materializes it through the CLI-authoritative path by allocating a
  real Work Item ID, creating the initial artifact shell, linking it back to the
  proposal, and making it eligible for queueing and claimability checks.
- A single agent session may perform triage and materialization sequentially only
  if it records the triage decision before acting under Repo PM Coordinator
  authority.
- Materialization queues a Work Item but does not make it automatically
  claimable; dependency, declared-surface, scope, claim-conflict, and required
  approval gates still apply.
- A queued Work Item that is not claimable remains queued with a Claimability
  Report of `claimability: blocked` that lists all known blockers and names a
  deterministic `primary_blocker`.
- Claimability Report blockers include `missing_policy_approval`,
  `missing_product_or_operator_approval`, `recovery_required_claim`,
  `expired_claim`, `dependency`, `conflicting_active_claim`,
  `invalid_scope_or_acceptance`, and `missing_declared_write_surface`.
- Claimability Report primary blocker priority follows that same deterministic
  order, placing claim recovery state ahead of ordinary dependency blockers.
- Repo PM Coordinator may automatically repair mechanical claimability blockers
  only when approved artifacts already prove the answer.
- `recovery_required_claim` is not mechanically repairable and always routes
  through claim/recovery protocol.
- `expired_claim` is mechanically repairable only when repo evidence proves
  there is no unmerged work and policy allows release.
- Expired claim release evidence includes claim record, worktree path and branch,
  clean worktree status, no untracked or staged changes, no commits ahead of the
  integration base unless already transferred, and policy allowing release.
- The expired claim release rationale is generated from evidence, briefly states
  why release is safe, and is recorded in the mechanical-repair
  transition-history entry.
- The Claimability Report may reference the mechanical-repair transition-history
  entry ID; it does not own a separate release-rationale artifact.
- Missing or ambiguous expired claim release evidence converts `expired_claim` to
  `recovery_required_claim` instead of releasing it.
- Every automatic mechanical claimability repair is one atomic
  CLI-authoritative operation: apply the state change, append transition
  history, assign and return the transition-history entry ID, recompute the
  Claimability Report once, or apply nothing.
- Atomic mechanical claimability repair requires expected-current-state inputs:
  observed Claimability Report ID or hash, observed blocker state, and observed
  target Work Item state; stale-state mismatch refuses without changes and
  requires reread and recompute.
- Every automatic mechanical claimability repair records transition history with
  actor, source evidence, fields changed, before and after values, and the
  blocker cleared.
- Mechanical-repair transition-history entry IDs are assigned atomically by the
  CLI-authoritative append operation and returned for references; agents do not
  author stable transition IDs directly.
- Mechanical-repair transition-history entries are immutable once written;
  corrections append a new transition or amendment entry referencing the
  original transition-history entry ID.
- After an automatic mechanical claimability repair, Repo PM Coordinator
  recomputes the Claimability Report once.
- If blockers remain after the recompute, the Work Item stays queued with the
  updated Claimability Report.
- If blockers clear after the recompute for new queued work, Repo PM Coordinator
  marks the Work Item claimable and leaves selection to the regular Single-Claim
  Heartbeat scheduler.
- Repo PM Coordinator does not immediately assign new claimable work or wake a
  worker lane for that new work.
- A Work Item is already in progress only if it has an existing Work Item PM
  Orchestrator context and prior non-terminal lifecycle evidence.
- In-progress lifecycle evidence includes active claim, blocked stage,
  cleanup-ready handoff, review-feedback loop, or equivalent non-terminal state.
- Newly materialized queued work is not in progress.
- If an in-progress Work Item cannot be resumed, it remains blocked.
- `recovery_required_claim` or `expired_claim` prevents Work Item PM Orchestrator
  wake.
- If blockers clear for an in-progress Work Item, Repo PM Coordinator may wake
  that Work Item PM Orchestrator to resume orchestration, but it does not acquire
  a Work Claim Lease or start execution.
- Work Item PM wake payload includes Work Item ID, cleared blocker, updated
  Claimability Report ID or hash, resume reason, and timestamp.
- Work Item PM Orchestrator does not clear leases, recover worktrees, or claim
  replacement work.
- Repo PM Coordinator does not run repeated repair-and-recompute loops in one
  activation.
- Repo PM Coordinator must not invent product scope, grant approvals, override
  policy, break dependencies, or force-resolve conflicting claims to make queued
  work claimable.
- Non-mechanical claimability repairs become a Work Item Proposal or Operator
  Inbox entry.
- `accepted_deferred` entries remain non-claimable Work Item Proposals until a
  later promotion decision records `accepted_to_queue`.
- Work Intake Triage Skill exists and guides operator review one item at a time,
  with clarifying questions and recorded consensus outcomes.
- Work Intake Triage Skill ranks entries before presentation using effort,
  impact, risk, dependencies, operator-boundary status, and changed-context
  signals.
- Low-effort/high-impact proposals float to the top unless stronger risk,
  dependency, or operator-boundary evidence says otherwise.
- Triage ranking is advisory and records rationale; explicit operator overrides
  are honored after brief challenge or clarification when useful.
- Lightweight override learning signals may be recorded when cheap, but missing
  override telemetry does not block triage.
- Work Intake Triage Skill processes prioritized new or untriaged entries before
  offering a deferred-item revisit list.
- Work Intake Triage Skill may end before the full list is exhausted, but no
  presented item is silently skipped.
- Work Intake Triage Skill emphasizes accepted-deferred entries when earlier
  work makes them materially lower effort or higher impact.
- Promoting `accepted_deferred` to `accepted_to_queue` requires operator
  confirmation after presenting the prior decision, current evidence, and
  changed context.
- Superseded intake surfaces are imported into the Work Intake Ledger, marked
  deprecated during migration, and removed after validation proves no item was
  lost.
- Repo PM Coordinator protocol exists as a global skill with a clear checklist,
  authority envelope, required reads, allowed writes, pause rules, escalation
  rules, and handoff obligations.
- Bandit-specific Repo PM Coordinator integration is layered as a repo adapter,
  not as the global protocol itself.
- Repo PM Coordinator may edit PM-owned operational surfaces and coordination
  artifacts but may not write production code or implement product changes.
- Repo PM Coordinator may mark work claimable, pause or resume worker heartbeats,
  and wake Work Item PM Orchestrators for unblocked in-progress work, but must
  never acquire work claims, execute work, or immediately assign new work.
- Role authority boundaries apply to every agent role. Coordination roles do not
  implement or claim, worker roles do not govern intake or landing, reviewer
  roles do not land, and landing roles do not invent missing product or policy
  approval.
- Repo PM Coordinator can pause/resume Workstream Agent heartbeat through
  explicit automation control paths.
- Repo PM Coordinator may pause its own recurring automation only when all
  self-pause preconditions are met and an Operator Inbox entry records why it
  paused, what input is needed, which heartbeats are paused, and how the
  operator re-engages.
- Only the operator may unpause paused heartbeats.
- The Operator Inbox is strictly PM-to-operator and operator-to-PM. Workstream
  agents do not read it.
- In the file-based era, Repo PM Coordinator writes operator-visible
  coordination messages to the Operator Inbox instead of using a separate
  proactive notification channel.
- Repo PM Coordinator translates operator decisions into work artifacts and
  removes or archives resolved Operator Inbox entries.
- Work Item PM Orchestrators may propose follow-up Work Items and `spawns`
  dependency edges from owned orchestration surfaces, but those proposals are
  not globally claimable until accepted by the Repo PM Coordinator.
- Automation `MEMORY.md` required fields are defined for Repo PM Coordinator and
  Workstream automations.
- Canonical decisions affecting repo state are written to repo artifacts even
  when automation memory records the reasoning.
- Product-scope changes require grill-with-docs before work items are created.
- The implementation fails closed when policy, registry, work-item state,
  automation status, declared surfaces, or worktree state cannot be reconciled.

## Implementation Decisions

- Build the feature after bootstrap. This PRD is planning output only and must
  not reroute the current active bootstrap work.
- Preserve CLI Authority. Agents, skills, automations, cockpit views, and
  indexes call or read the CLI contract; they do not manually mutate canonical
  coordination state.
- Treat the Authoritative In-Flight Registry as canonical for active claims and
  reservations, not as a derived status page.
- Treat per-work-item coordination state as canonical for workflow state,
  evidence state, accepted blocks, and safe trigger points.
- Require claim reconciliation to confirm both authoritative sources before
  work starts.
- Use a deep claim coordination module with a small public interface for claim,
  renew, release, fail, block, complete, recover, and inspect operations.
- Use a deep work-surface reservation module to normalize declared surfaces,
  detect overlap, and explain collisions.
- Use a deterministic scheduler module that ranks candidates from reconciled
  state and returns at most one claimable stage.
- Use a Repo PM Coordinator protocol module or skill boundary separate from worker
  execution logic.
- Use a heartbeat automation control adapter for pause/resume/status rather than
  letting PM write raw automation internals ad hoc.
- Use a worktree lifecycle module that enforces claim-first worktree creation,
  Work Item PM Orchestrator handoff verification, and Repo PM Coordinator-only
  cleanup.
- Use explicit state values for claims, including active, renewing, blocked,
  failed, completed, cleanup-ready, recovery-required, released, and expired.
- Do not make stale timeout cleanup destructive. Recovery-required work must be
  surfaced to PM.
- Keep `OPERATOR.md` as the compact file-backed Operator Inbox in the file-based
  era. It is not an append-only board and is not part of workstream context.
- Defer richer operator notification and interruption behavior to future GUI or
  cockpit work; v0 records messages in the Operator Inbox.
- Keep `CURRENT_CONTEXT.md` as PM-owned operational context. PM may edit it
  freely to preserve next-action routing.
- Keep `CONTEXT.md` for durable vocabulary and grill-with-docs artifacts.
  Routine Repo PM Coordinator state does not belong there.
- Use automation `MEMORY.md` as v0 audit and memory surface. Required fields
  should include repo, automation role, allowed reads, allowed writes, pause
  authority, last claim or PM decision, open operator escalations, and blocked
  state summary.
- Keep model reasoning choices at automation creation time for v0. Repo PM
  Coordinator uses high reasoning because it analyzes and routes; delegated
  implementation uses the reasoning profile configured for its own heartbeat.
- Allow Work Item PM Orchestrators to propose follow-up Work Items only into the
  Work Intake Ledger or their owned orchestration surfaces that feed it.
- Allow Repo PM Coordinator to accept Work Intake Ledger entries as chores or
  feature slices only when product scope is already documented. New product-scope
  direction requires grill-with-docs.
- Allow PM to pick up the next eligible chore when no runnable work item exists.
- Require Bandit CLI installation/update support before relying on the global
  Repo PM Coordinator skill across multiple repositories.
- Scope v0 to one Bandit-governed repository at a time. Cross-repo coordination
  is future work.

## Testing Decisions

- Tests should verify observable CLI behavior, artifact state, refusal paths,
  reconciliation results, scheduler decisions, and worktree lifecycle effects.
  They should not assert incidental parser or helper internals.
- Test the claim coordination module with successful claims, duplicate claims,
  stale state, conflicting registry/work-item state, lease renewal, release,
  completion, blocking, failure, expiration, and recovery-required behavior.
- Test the work-surface reservation module with exact path conflicts, ancestor
  and descendant conflicts, named resource conflicts, non-overlapping claims,
  normalized path equivalence, and readable conflict messages.
- Test scheduler behavior with recovery-first ordering, continuation ordering,
  unblocked priority ordering, deterministic tie-breakers, eligible chore
  fallback, no-op behavior, and fail-closed ambiguous state.
- Test Repo PM Coordinator behavior through command outcomes or skill protocol
  fixtures: required reads, allowed writes, operator escalation, self-pause
  preconditions, Workstream heartbeat pause/resume, refusal to claim work, and
  refusal to implement product scope.
- Test role authority boundaries across coordinator, worker, reviewer, and
  landing fixtures.
- Test Workstream Agent behavior with claim-first worktree start, failed
  worktree creation cleanup, lease renewal, Work Item PM Orchestrator handoff
  summary, cleanup-ready marking, and refusal to land or delete worktrees.
- Test Operator Inbox contract behavior through Repo PM Coordinator protocol
  tests that consume operator responses and translate decisions into work
  artifacts.
- Test automation `MEMORY.md` setup requirements without treating memory as
  canonical repo state.
- Reuse existing Bandit command tests, validator tests, work-item tests, landing
  gate tests, auto-land policy tests, and artifact creation tests as prior art.
- Add validation tests that detect registry/work-item disagreement, duplicate
  active claims, undeclared work surfaces, overlapping reservations, stale
  leases, and cleanup-ready worktrees awaiting Work Item PM Orchestrator
  verification.
- Run focused tests for each slice, then `npm test`, `npm run typecheck`,
  `npm run bandit -- validate`, relevant claim/scheduler validation commands,
  relevant landing checks, and `git diff --check`.

## Out Of Scope

- Current bootstrap implementation work.
- Any direct implementation of this feature before the bootstrap queue allows
  it.
- Database-backed coordination storage.
- GUI/cockpit work surface.
- Cross-repo scheduling.
- Centralized authority over self-governing repositories.
- Dynamic model/reasoning selection by PM per delegated stage.
- Paid provider routing changes.
- Automatic PR resolution.
- Remote merge, push, deploy, or CI/CD governance.
- Workstream-owned landing.
- Workstream-owned worktree deletion.
- Product-scope creation without grill-with-docs.
- General agent access to the Operator Inbox.

## Test Or Verification Strategy

The implementation should be decomposed into slices that each produce RED
evidence before production code. The safest first slice is the global Repo PM
Coordinator protocol and Operator Inbox contract because parallel claims depend
on a control-plane role that can safely pause, recover, and escalate work.

Verification should combine:

- Unit-level command tests for claim, scheduler, registry, and worktree behavior.
- Validator tests for conflicting canonical state.
- Protocol tests for Repo PM Coordinator and Workstream Agent boundaries.
- Fixture-based tests for `OPERATOR.md` Operator Inbox, `CURRENT_CONTEXT.md`, automation
  `MEMORY.md`, and handoff summaries.
- Integration tests that simulate two concurrent claim attempts and prove only
  one can win.
- Manual dry runs only for automation platform pause/resume behavior until that
  path has a deterministic local test harness.

## Decomposition Notes

Implementation should wait until the active bootstrap-gap lane is complete,
blocked, or explicitly dispositioned. The first slice should define the Repo PM
Coordinator protocol and Operator Inbox contract before enabling parallel
workstreams.

Major modules to build or modify:

- Repo PM Coordinator global skill and Bandit adapter.
- Operator Inbox contract.
- Automation memory setup contract.
- Work Intake Ledger.
- Work Intake Triage Skill.
- Work item declared-surface metadata.
- Authoritative In-Flight Registry.
- Claim reconciliation and lease operations.
- Work surface reservation overlap detection.
- Scheduler candidate selection.
- Claim-first worktree lifecycle.
- Workstream handoff summary contract.
- Work Item PM Orchestrator handoff verification.
- Repo PM Coordinator cleanup and integration routing.
- Automation pause/resume adapter.
- Validation and reporting commands.

Proposed work draft:

```bandit-work-draft
{
  "items": [
    {
      "kind": "slice",
      "title": "Repo PM Coordinator Protocol And Operator Inbox",
      "goal": "Define the global Repo PM Coordinator protocol, Bandit adapter, OPERATOR.md Operator Inbox contract, and automation memory setup requirements before parallel execution begins.",
      "scope": [
        "Create the Repo PM Coordinator authority envelope, required reads, allowed writes, pause rules, self-pause preconditions, and operator escalation workflow.",
        "Define role authority boundaries so the Repo PM Coordinator can mark work claimable and notify or trigger worker lanes but cannot acquire claims, execute work, review as reviewer, or land.",
        "Define OPERATOR.md as a compact Operator Inbox with operator response handling and resolution rules.",
        "Define file-era operator-visible coordination as Operator Inbox messages, with richer notification behavior deferred to future GUI or cockpit work.",
        "Define required automation MEMORY.md fields for Repo PM Coordinator and Workstream automations.",
        "Record Bandit adapter responsibilities without making the global Repo PM Coordinator skill Bandit-only."
      ],
      "out_of_scope": [
        "Do not implement claim leases, worktree creation, or scheduler execution.",
        "Do not write production code outside protocol and validation surfaces.",
        "Do not create product-scope work without documented product scope."
      ],
      "acceptance_criteria": [
        "Repo PM Coordinator protocol names required reads, allowed writes, forbidden actions, pause authority, self-pause preconditions, and escalation duties.",
        "Repo PM Coordinator is forbidden from acquiring work claims, starting execution, acting as reviewer, or landing work.",
        "Role authority boundary tests prove coordinator, worker, reviewer, and landing roles cannot perform each other's governed actions.",
        "Operator Inbox contract is strictly operator-facing and excludes Workstream Agent context.",
        "Repo PM Coordinator writes operator-visible coordination messages to the Operator Inbox rather than a separate notification channel in v0.",
        "Resolved operator entries have a required artifact translation and archive or removal rule.",
        "Automation MEMORY.md required fields are defined without becoming canonical workflow state.",
        "The protocol refuses product-scope creation without grill-with-docs output."
      ],
      "test_plan": [
        "Run focused validation tests for Repo PM Coordinator protocol required fields, forbidden actions, refusal to claim work, and role authority boundaries.",
        "Run fixture tests for Operator Inbox entries, file-era coordination messages, operator responses, and resolution flow.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; the protocol must preserve explicit authority, failure clarity, and no role erosion.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 1: Work-Item Brief And Spec",
          "verdict": "pass",
          "evidence": "The slice defines PM authority, operator escalation, and no-implementation boundaries before code."
        },
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Protocol fixtures and validation tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Parallel workstream execution remains disabled until bootstrap is complete.",
        "Automation pause/resume may require manual dry-run evidence until locally testable."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "OPERATOR.md",
        "docs/templates/operator-inbox.md",
        "docs/templates/automation-memory.md"
      ],
      "first_implementation_order": [
        "Write protocol and inbox fixture tests.",
        "Add templates and validation rules.",
        "Document global skill requirements and Bandit adapter responsibilities.",
        "Record implementation evidence and run validation."
      ],
      "smell_triggers": [
        "Repo PM Coordinator must not become implementation agent.",
        "Any agent performing another role's governed action for convenience.",
        "Operator Inbox must not become general agent context.",
        "Automation MEMORY.md must not become hidden canonical state."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required if this PRD is accepted; product-scope questions must route through grill-with-docs."
    },
    {
      "kind": "slice",
      "title": "Work Intake Ledger And Triage Skill",
      "goal": "Replace scattered follow-up, chore, retrospective, feature, review, and deferred-work proposal surfaces with one Work Intake Ledger and an operator-guided triage skill.",
      "scope": [
        "Define a single Work Intake Ledger schema with source, rationale, suggested Work Item type, proposed dependency edges, scope, risk, product-scope status, current triage outcome, and transition history.",
        "Define accepted_to_queue, accepted_deferred, needs_more_info, needs_operator, declined, duplicate, and superseded outcomes.",
        "Make the v0 ledger agent-maintained from guided operator workflows rather than requiring direct operator edits.",
        "Require operator-facing Work Intake Ledger review requests to invoke the Work Intake Triage Skill.",
        "Restrict Work Intake Ledger triage-state mutation to the Repo PM Coordinator and Work Intake Triage Skill; other roles may only propose entries or proposed transitions.",
        "Define the boundary where Work Intake Triage Skill records accepted_to_queue consensus and Repo PM Coordinator materializes the accepted proposal through the CLI-authoritative path.",
        "Separate Work Item materialization from claimability; materialized Work Items must still satisfy dependency, declared-surface, scope, claim-conflict, and required-approval gates before claim.",
        "Define Claimability Report output for queued Work Items that are not claimable, including claimability: blocked, all known blockers, explicit blocker values, deterministic primary_blocker, and no separate blocked queue.",
        "Allow Repo PM Coordinator to repair mechanical claimability blockers only when approved artifacts already prove the fix; route non-mechanical repairs to Work Item Proposal or Operator Inbox.",
        "Route recovery_required_claim through claim/recovery protocol; allow expired_claim mechanical repair only when repo evidence proves no unmerged work and policy allows release.",
        "Require expired_claim release evidence: claim record, worktree path and branch, clean worktree status, no untracked or staged changes, no commits ahead of integration base unless already transferred, and policy allowing release.",
        "Record generated expired_claim release rationale in the mechanical-repair transition-history entry without requiring operator-authored text.",
        "Allow Claimability Report to reference the mechanical-repair transition-history entry ID rather than owning a separate release-rationale artifact.",
        "Convert expired_claim to recovery_required_claim when expired-claim release evidence is missing or ambiguous.",
        "Require every automatic mechanical claimability repair to run as one atomic CLI-authoritative operation that applies the state change, appends transition history, assigns and returns the transition-history entry ID, recomputes Claimability Report once, or applies nothing.",
        "Require atomic mechanical repair requests to include expected current state: observed Claimability Report ID or hash, observed blocker state, and observed target Work Item state.",
        "Require every automatic mechanical claimability repair to record transition history with actor, source evidence, fields changed, before and after values, and blocker cleared.",
        "Assign mechanical-repair transition-history entry IDs through the CLI-authoritative append operation and return them for Claimability Report references.",
        "Make mechanical-repair transition-history entries immutable; corrections append a transition or amendment entry referencing the original transition-history entry ID.",
        "After automatic mechanical repair, recompute Claimability Report once and leave remaining blockers queued with the updated report; do not loop repair/recompute in one activation.",
        "When recompute clears blockers for new queued work, mark the Work Item claimable and leave selection to regular Single-Claim Heartbeat scheduling rather than immediate assignment or worker wake.",
        "Define in-progress Work Item as existing Work Item PM Orchestrator context plus non-terminal lifecycle evidence; newly materialized queued work is excluded.",
        "Define non-resumable in-progress work as still blocked; recovery_required_claim or expired_claim prevents Work Item PM wake.",
        "When recompute clears every blocker for an in-progress Work Item, allow Repo PM Coordinator to wake that Work Item PM Orchestrator to resume orchestration without acquiring a claim or starting execution.",
        "Define Work Item PM wake payload with Work Item ID, cleared blocker, updated Claimability Report ID or hash, resume reason, and timestamp.",
        "Forbid Work Item PM Orchestrator from clearing leases, recovering worktrees, or claiming replacement work.",
        "Add a Work Intake Triage Skill that ranks entries before presentation, floats low-effort/high-impact opportunities, walks the operator through prioritized new or untriaged entries first, presents evidence, asks clarifying questions, records consensus, then offers accepted_deferred entries for optional revisit.",
        "Make triage ranking advisory: the skill records ranking rationale, may briefly challenge an override, and honors explicit operator choice.",
        "Capture only lightweight override metadata that is already available from the triage flow; defer richer ranking-learning instrumentation to a later Work Item Proposal if it adds workflow complexity.",
        "Allow triage sessions to end before the full list is exhausted, while preserving explicit state for skipped or unresolved entries.",
        "Emphasize accepted_deferred entries when earlier work makes them materially lower effort or higher impact.",
        "Define migration from FOLLOWUPS.md, work-item follow-up candidate files, and the prior chore-only ledger plan into the Work Intake Ledger.",
        "Deprecate superseded intake surfaces during migration and remove them after validation proves every item has an intake outcome.",
        "Expose read-only listing and validation for intake status and claimability boundaries."
      ],
      "out_of_scope": [
        "Do not run accepted work automatically.",
        "Do not implement work claim leases.",
        "Do not change product scope without documented PRD input."
      ],
      "acceptance_criteria": [
        "All proposed work types are represented in one Work Intake Ledger rather than separate proposal surfaces.",
        "The ledger can distinguish untriaged proposals, active-queue acceptances, approved deferred items, needs_more_info items, operator-needed items, declined items, duplicates, and superseded items.",
        "The ledger exposes current entry state while preserving transition history with actor, timestamp, rationale, from state, and to state.",
        "Operator-originated feature ideas and issues can enter through grill-with-docs or Work Intake Triage Skill without direct operator edits to ledger files.",
        "An operator-facing request to review the Work Intake Ledger starts the Work Intake Triage Skill rather than ad hoc raw-ledger review.",
        "Validation rejects triage-state mutations from roles other than Repo PM Coordinator or Work Intake Triage Skill.",
        "accepted_to_queue is recorded as triage consensus before the Repo PM Coordinator allocates a real Work Item ID, creates an initial artifact shell, links back to the proposal, and makes the Work Item eligible for queueing and claimability checks.",
        "If one agent session performs both triage and materialization, evidence preserves the role boundary and ordering.",
        "A materialized Work Item is not claimable until recovery_required_claim, expired_claim, dependency graph, declared-surface, scope and acceptance criteria, active-claim conflict, and required-approval checks pass.",
        "A materialized Work Item that fails claimability remains queued with claimability: blocked, blockers, and primary_blocker, not a separate blocked queue.",
        "Claimability Report blockers cover missing_policy_approval, missing_product_or_operator_approval, recovery_required_claim, expired_claim, dependency, conflicting_active_claim, invalid_scope_or_acceptance, and missing_declared_write_surface.",
        "Claimability Report primary_blocker is selected deterministically in that priority order, with recovery_required_claim and expired_claim ahead of ordinary dependency blockers.",
        "Repo PM Coordinator can repair missing declared write surfaces or normalize scope and acceptance metadata only when approved PRDs, briefs, or work artifacts prove the answer.",
        "Repo PM Coordinator cannot mechanically repair recovery_required_claim.",
        "Repo PM Coordinator can mechanically repair expired_claim only when repo evidence proves no unmerged work and policy allows release.",
        "expired_claim mechanical release requires claim record, worktree path and branch, clean worktree status, no untracked or staged changes, no commits ahead of integration base unless already transferred, and policy allowing release.",
        "expired_claim release rationale is generated from evidence, briefly explains why release is safe, and is recorded in the mechanical-repair transition-history entry.",
        "Claimability Report references the mechanical-repair transition-history entry ID instead of owning a separate release-rationale artifact.",
        "Missing or ambiguous expired_claim release evidence converts the blocker to recovery_required_claim.",
        "Automatic mechanical claimability repair is all-or-nothing: no repaired state without transition history, no transition history without repaired state, and no stale Claimability Report after a successful repair.",
        "Atomic mechanical repair fails closed with no changes when expected current state differs from repo state, and the Repo PM Coordinator must reread and recompute before retrying.",
        "Automatic mechanical claimability repairs record actor, source evidence, fields changed, before and after values, and blocker cleared in transition history.",
        "Repo PM Coordinator submits proposed mechanical-repair transition content, while the CLI append operation assigns the stable transition-history entry ID atomically and returns it for references.",
        "Validation rejects agent-authored stable transition-history entry IDs for mechanical repairs.",
        "Mechanical-repair transition-history entries are immutable once written; corrections append a new transition or amendment entry referencing the original transition-history entry ID.",
        "After an automatic mechanical repair, Claimability Report is recomputed exactly once and remaining blockers keep the Work Item queued with an updated report.",
        "If recompute clears blockers for new queued work, Repo PM Coordinator marks the Work Item claimable and normal Single-Claim Heartbeat scheduling decides whether it is the next highest-priority claim.",
        "Repo PM Coordinator does not immediately assign new claimable work or wake a worker lane for that new work.",
        "A Work Item is in progress only with existing Work Item PM Orchestrator context and prior non-terminal lifecycle evidence.",
        "Newly materialized queued Work Items are not in progress.",
        "An in-progress Work Item that cannot be resumed remains blocked.",
        "recovery_required_claim or expired_claim prevents Work Item PM wake.",
        "If recompute clears every blocker for an in-progress Work Item, Repo PM Coordinator may wake that Work Item PM Orchestrator to resume orchestration without claiming or executing the work.",
        "Work Item PM wake payload contains Work Item ID, cleared blocker, updated Claimability Report ID or hash, resume reason, and timestamp.",
        "Work Item PM Orchestrator cannot clear leases, recover worktrees, or claim replacement work.",
        "Validation rejects repeated repair-and-recompute loops in one Repo PM Coordinator activation.",
        "Repo PM Coordinator cannot invent product scope, grant approvals, override policy, break dependencies, or force-resolve conflicting claims to clear claimability.",
        "Claimability blockers that are not mechanically repairable produce a Work Item Proposal or Operator Inbox entry.",
        "accepted_deferred remains a non-claimable Work Item Proposal until later promotion.",
        "Work Intake Triage Skill records operator consensus and clarifying-question answers before a proposal becomes claimable.",
        "Work Intake Triage Skill ranks entries and floats low-effort/high-impact opportunities before presenting them.",
        "Operator can override the suggested triage order; the skill records the override and continues without blocking.",
        "Missing optional override-learning metadata does not block a triage outcome.",
        "Work Intake Triage Skill processes prioritized new or untriaged entries before offering an accepted_deferred revisit list.",
        "Work Intake Triage Skill may end without exhausting the full list, but presented entries are never silently skipped.",
        "Work Intake Triage Skill emphasizes accepted_deferred entries when changed context makes them materially lower effort or higher impact.",
        "accepted_deferred promotion requires the prior decision, current evidence, changed context, and operator confirmation.",
        "Imported FOLLOWUPS.md entries, work-item follow-up candidate files, and chore-only candidates have preserved source metadata and intake outcomes.",
        "Superseded intake surfaces are marked deprecated and removed after migration validation.",
        "Validation fails closed on missing source, rationale, scope, risk, product-scope status, or triage outcome."
      ],
      "test_plan": [
        "Run focused Work Intake Ledger parser, transition-history, role-authority, materialized-but-not-claimable, Claimability Report explicit blocker values, multi-blocker and primary_blocker priority, recovery_required_claim non-mechanical routing, expired_claim release evidence, expired_claim transition-history rationale, expired_claim safe mechanical repair, expired_claim missing-evidence conversion, mechanical repair transition history, atomic repair rollback, expected-current-state mismatch refusal, CLI-assigned repair-transition IDs, immutable repair-transition amendment behavior, Claimability Report repair-transition reference, recompute-once behavior, new-work waits for normal heartbeat scheduling, in-progress detection, blocked-state prevents PM wake, Work Item PM wake payload, Work Item PM recovery-action refusal, coordinator-refuses-claim behavior, non-mechanical repair routing, and validator tests.",
        "Run Work Intake Triage Skill fixture tests for review-request routing, ranking, low-effort/high-impact ordering, operator order override, override without optional learning metadata, new-first ordering, partial-session stop behavior, clarifying questions, consensus capture, accepted_to_queue consensus before coordinator materialization, accepted_deferred, deferred revisit prompts, deferred promotion confirmation, changed-context deferred emphasis, needs_more_info, needs_operator, declined, duplicate, and superseded outcomes.",
        "Run migration fixture tests for FOLLOWUPS.md and work-item follow-up candidate imports.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; the intake ledger must keep explicit state and avoid hidden authority.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Intake eligibility, triage, migration, and validation refusal tests must exist before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Parallel workstream execution remains disabled until claim and worktree slices land."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/templates/work-intake-entry.md",
        "docs/templates/work-intake-triage.md"
      ],
      "first_implementation_order": [
        "Write failing validation tests for intake metadata and migration.",
        "Add intake ledger schema and fixtures.",
        "Add read-only listing and Work Intake Triage Skill behavior.",
        "Run validation and update evidence."
      ],
      "smell_triggers": [
        "Separate proposal surfaces reappearing as parallel sources of truth.",
        "Claimability inferred from prose instead of intake outcome."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for ledger mechanics; product-scope triage must escalate when needed."
    },
    {
      "kind": "slice",
      "title": "In-Flight Registry And Atomic Claim Leases",
      "goal": "Create the CLI-owned Authoritative In-Flight Registry and atomic Work Claim Lease operations that prevent duplicate work.",
      "scope": [
        "Define registry schema for active claims, leases, owners, stages, surfaces, timestamps, worktree path, branch, renewal, and recovery metadata.",
        "Implement atomic claim, inspect, renew, release, fail, block, complete, and recover operations.",
        "Reconcile registry state with per-work-item coordination state before accepting claims.",
        "Fail closed on duplicate active claims, stale state, malformed registry, or registry/work-item disagreement."
      ],
      "out_of_scope": [
        "Do not create worktrees.",
        "Do not schedule candidate work.",
        "Do not integrate or land completed work."
      ],
      "acceptance_criteria": [
        "Two simultaneous claim attempts for the same work item and stage cannot both succeed.",
        "v0 permits at most one active claim per work item.",
        "Registry/work-item disagreement creates PM repair or recovery output.",
        "Expired claims with unmerged work become recovery-required rather than auto-deleted.",
        "Manual registry edits are detected by validation when they break reconciliation."
      ],
      "test_plan": [
        "Run focused claim tests for duplicate, stale, renewal, release, block, fail, complete, expiration, and recovery paths.",
        "Run fixture tests for registry/work-item disagreement.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; claim operations must keep state explicit and failure paths clear.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Duplicate-claim and reconciliation tests must fail before implementation."
        },
        {
          "stage": "Stage 3: Implementation Clean-Code Rubric",
          "verdict": "required",
          "evidence": "Atomic claim logic must be a deep module with a narrow interface."
        }
      ],
      "bootstrap_gaps": [
        "True cross-process locking semantics may need platform-specific verification."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/in-flight.json",
        ".bandit/policy/work-claims.json"
      ],
      "first_implementation_order": [
        "Write duplicate-claim and reconciliation RED tests.",
        "Define registry schema and claim state values.",
        "Implement atomic claim operations.",
        "Add validation and evidence."
      ],
      "smell_triggers": [
        "Any advisory-only lock behavior.",
        "Any manual registry mutation path.",
        "Any fail-open stale-state behavior."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for v0 claim semantics already captured in the PRD."
    },
    {
      "kind": "slice",
      "title": "Declared Work Surfaces And Collision Detection",
      "goal": "Require claimable work to declare expected write surfaces and refuse overlapping reservations before work starts.",
      "scope": [
        "Add declared work surface metadata for work items and chores.",
        "Normalize path patterns and named repo resources for collision checks.",
        "Detect exact, ancestor, descendant, and named-resource conflicts.",
        "Explain collision refusals with owner, work item, stage, and reserved surface."
      ],
      "out_of_scope": [
        "Do not infer unlimited write access from missing declarations.",
        "Do not implement full static analysis of all possible file writes.",
        "Do not allow product-scope claims without documented scope."
      ],
      "acceptance_criteria": [
        "A runnable work item without declared write surfaces is not claimable.",
        "Overlapping declared surfaces cannot be claimed concurrently.",
        "Non-overlapping surfaces can be claimed concurrently when work-item rules allow.",
        "Collision refusal messages identify the conflicting reservation and owner.",
        "Validation reports missing or malformed declared surfaces."
      ],
      "test_plan": [
        "Run focused overlap detection tests.",
        "Run claim integration tests with overlapping and non-overlapping surfaces.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; collision detection should be isolated and testable.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Surface collision tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Perfect write prediction is out of scope; declared surfaces are the v0 contract."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/templates/work-surface.md"
      ],
      "first_implementation_order": [
        "Write RED tests for missing, malformed, overlapping, and non-overlapping surfaces.",
        "Implement normalization and overlap checks.",
        "Integrate surfaces into claim validation.",
        "Update validation and evidence."
      ],
      "smell_triggers": [
        "Implicit write surfaces.",
        "Collision checks implemented as ad hoc string matching.",
        "Refusals that do not name the conflicting claim."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for the declared-surface contract."
    },
    {
      "kind": "slice",
      "title": "Parallel Work Scheduler",
      "goal": "Select at most one runnable claim candidate per heartbeat using deterministic post-bootstrap priority rules.",
      "scope": [
        "Rank recovery-required claims first, then continuable active work, then highest-priority unblocked queued work, then eligible low-risk chores.",
        "Use roadmap or backlog order and work item ID as deterministic tie-breakers.",
        "Return no-op output when no work is claimable.",
        "Refuse ambiguous or unreconciled state instead of guessing."
      ],
      "out_of_scope": [
        "Do not run implementation work.",
        "Do not create worktrees.",
        "Do not schedule across multiple repositories."
      ],
      "acceptance_criteria": [
        "A heartbeat activation can select at most one claimable stage.",
        "Scheduler output explains why selected work was chosen.",
        "Scheduler output explains why blocked, overlapping, or ineligible work was skipped.",
        "Eligible chores are selected only when no higher-priority runnable work exists.",
        "No runnable work produces a clean no-op."
      ],
      "test_plan": [
        "Run scheduler priority fixture tests.",
        "Run no-op and ambiguous-state refusal tests.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; scheduler ranking must be deterministic and explainable.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Priority ordering tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Heartbeat platform frequency controls remain outside the repo; scheduler behavior is repo-native."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/policy/workstream-scheduler.json"
      ],
      "first_implementation_order": [
        "Write RED tests for priority ranking and no-op behavior.",
        "Implement candidate collection from reconciled repo state.",
        "Implement one-claim scheduling output.",
        "Integrate with claim operations and validation."
      ],
      "smell_triggers": [
        "Batch queue draining.",
        "Priority derived from chat.",
        "Silent skip decisions."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for scheduler priority because this PRD records the v0 priority order."
    },
    {
      "kind": "slice",
      "title": "Claim-First Worktree Lifecycle",
      "goal": "Create ephemeral worktrees only after successful claims, require Work Item PM Orchestrator handoff verification, and reserve shared-resource cleanup for the Repo PM Coordinator.",
      "scope": [
        "Add worktree creation after successful claim and record worktree path and branch in the lease.",
        "Handle worktree creation failure by releasing or marking the claim failed.",
        "Add workstream handoff summary requirements for completion, verification, blockers, next stage, and cleanup readiness.",
        "Add Work Item PM Orchestrator handoff verification before cleanup.",
        "Add Repo PM Coordinator claim release, integration routing, and deletion flow."
      ],
      "out_of_scope": [
        "Do not give workstream agents landing authority.",
        "Do not allow workstream agents to delete worktrees.",
        "Do not implement PR-based landing governance."
      ],
      "acceptance_criteria": [
        "Worktree creation is refused without an active claim.",
        "A failed worktree creation does not leave an active false claim.",
        "Completed work includes a Work Item PM Orchestrator-consumable handoff summary before claim release.",
        "Work Item PM Orchestrator verifies handoff and evidence transfer before cleanup.",
        "Only Repo PM Coordinator cleanup flow releases claims and deletes worktrees after verification.",
        "Recovery-required worktrees are never auto-deleted."
      ],
      "test_plan": [
        "Run worktree lifecycle tests with successful creation, failed creation, handoff, cleanup-ready, and recovery paths.",
        "Run command tests proving workstream cannot land or delete worktrees.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; lifecycle side effects must be explicit and reversible where possible.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Claim-first worktree tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "PR-based integration changes are future work."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/templates/workstream-handoff.md"
      ],
      "first_implementation_order": [
        "Write RED tests for claim-first worktree behavior.",
        "Implement worktree creation and failure handling.",
        "Implement handoff summary and cleanup-ready state.",
        "Implement Work Item PM Orchestrator handoff verification.",
        "Implement Repo PM Coordinator claim release and cleanup."
      ],
      "smell_triggers": [
        "Speculative worktree creation.",
        "Worker cleanup of unverified work.",
        "Landing behavior embedded in worker lifecycle."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for v0 worktree lifecycle boundaries."
    },
    {
      "kind": "slice",
      "title": "Workstream Heartbeat Execution Contract",
      "goal": "Connect single-claim scheduling to worker heartbeat execution while preserving no-op behavior and role boundaries.",
      "scope": [
        "Define Workstream Agent required reads, claim attempt flow, allowed actions, forbidden actions, and no-op behavior.",
        "Connect scheduler output to claim acquisition and claim-first worktree start.",
        "Require lease renewal for long-running work.",
        "Require completion, block, failure, and cleanup-ready outputs that Work Item PM Orchestrator can consume."
      ],
      "out_of_scope": [
        "Do not implement Repo PM Coordinator governance in the worker.",
        "Do not implement landing or PR resolution.",
        "Do not delete worktrees from workstream execution."
      ],
      "acceptance_criteria": [
        "Each Workstream heartbeat activation claims at most one stage.",
        "No available claim produces a clean no-op.",
        "Worker actions without a claim are refused when they mutate state.",
        "Lease renewal and stale lease behavior are visible in registry state.",
        "Worker output is sufficient for PM to continue without chat context."
      ],
      "test_plan": [
        "Run worker protocol tests for no-op, claim success, claim refusal, renewal, block, failure, and completion.",
        "Run integration tests with scheduler and claim registry fixtures.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; worker execution must keep role boundaries explicit.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Worker protocol tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Dynamic model routing remains future work."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/policy/workstream-agent.json"
      ],
      "first_implementation_order": [
        "Write RED tests for Workstream heartbeat single-claim behavior.",
        "Implement protocol checks and no-op output.",
        "Integrate scheduler, claim, and worktree lifecycle.",
        "Record evidence and validation."
      ],
      "smell_triggers": [
        "Worker takes PM decisions.",
        "Worker lands or deletes worktrees.",
        "Heartbeat drains multiple items."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for worker role boundaries captured in the PRD."
    },
    {
      "kind": "chore",
      "title": "Bandit Installed-Copy Update Path",
      "non_product_work": "Define the CLI-supported distribution path for pushing Bandit global skill, automation prompt, and integration updates to installed copies.",
      "origin": "Post-bootstrap parallel workstream rollout dependency currently recorded in FOLLOWUPS.md and expected to migrate into the Work Intake Ledger.",
      "scope": [
        "Define how Bandit detects installed global skills, automation prompts, and repo integration files that need updates.",
        "Define how updates are previewed, applied, verified, and rolled back or repaired.",
        "Document rollout requirements before Repo PM Coordinator is used across multiple projects."
      ],
      "acceptance_criteria": [
        "The update path has an explicit source of truth and does not overwrite user-local changes silently.",
        "Installed-copy drift can be reported before applying updates.",
        "The global Repo PM Coordinator skill and Bandit adapter can be distributed consistently.",
        "Verification proves installed copies match the intended version or reports exact drift."
      ],
      "verification_plan": [
        "Run update-path design validation against installed skill fixtures.",
        "Run command tests for preview, apply, verify, and refusal paths when implemented.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "Operator input may be required before modifying installed copies outside the repository."
    }
  ]
}
```

## Further Notes

This PRD intentionally lands as future planning while `BANDIT-022` remains the
active bootstrap-gap chore. It should not update the current work queue or
start Phase 6 until the current bootstrap rules allow that transition.

The first executable implementation should be the Repo PM Coordinator protocol
and Operator Inbox contract. Parallel workstreams need a control plane before
they need more worker lanes.

Once Bandit moves to PR-based workflows, PR issue resolution and safe landing
should become a separate governed agent capability with its own PRD, policy,
and skill. This PRD only preserves that boundary.
