# BANDIT-086: Coordination Primitive Completion Disposition

## Disposition

**Decision: Deferred** — the accepted 2026-05-24 coordination primitive design
is satisfied for current Bandit workflow needs by the landed Phase 6
coordination work, later role/formation/coordination evidence, and current
derived projection surfaces. No new coordination primitive implementation is
justified at this time. Per-work-item coordination logs remain canonical. Named
trigger conditions and a conditional future-scope contract are recorded for
reference. No implementation is authorized by this work item.

---

## Source Citations

### WIL-COORDINATION-PRIMITIVE

**Source:** `.bandit/work-intake-ledger.json`, entry `WIL-COORDINATION-PRIMITIVE`

- Title: "Coordination Primitive Completion Triage"
- Source anchor: "Schedule Coordination Primitive Implementation" in `FOLLOWUPS.md`
- Origin date: 2026-06-09
- Intake outcome: `formed`; formed work item: `BANDIT-086`
- Suggested type: gap
- Risk/product scope: formed with no new coordination primitive
  implementation, scheduler, claim/worktree lifecycle, local API, State Index,
  guarded browser action execution, PR/CI/CD, merge, push, deploy, paid
  routing, hosted service, public benchmark publication, Trust Verifier
  cutover, cross-repo runtime behavior, or unrelated product work authorized

**Source:** `FOLLOWUPS.md`, section "Schedule Coordination Primitive Implementation"

- Origin: Coordination primitive design discussion, 2026-05-24
- Current decision at intake: "The coordination primitive design is accepted
  directionally, but implementation should not jump ahead of the active
  bootstrap-gap queue unless a queued gap directly requires it."
- Follow-up question: "When the current bootstrap-gap lane is exhausted,
  resolved, blocked, or explicitly dispositioned, what is the first
  implementation slice for the per-work-item coordination log and shared core
  state machine?"
- Why later: "Starting it now would violate the one-gap-at-a-time queue
  discipline Bandit is trying to enforce."
- Expected evaluation point: "After the queued bootstrap gaps in
  `docs/roadmap/CURRENT_CONTEXT.md` are resolved, blocked, or explicitly
  dispositioned."

### Accepted Design

**Source:** `docs/decisions/2026-05-24-coordination-primitive-state-ledger.md`

- Status: Accepted (2026-05-24)
- Decision: Bandit's coordination primitive will use an explicit canonical
  Step Transition Ledger for work-item progress, not a status view derived
  only from existing artifacts.
- Ledger structure: append-only coordination log scoped per work item.
- Step transitions and actor coordination events live in the same per-work-item
  log as different event types.
- Current-state summaries are derived and rebuildable from the coordination
  log.
- Actor coordination events are context-only and never replace step transitions.
- Block Events are reported by an actor; Accepted Blocks are workflow state
  created by CLI validation or Codex PM policy.
- Retrospective recorded and closed are separate core lifecycle states.
- Cross-repo Bandit uses self-governing repositories; central views aggregate
  only, never own canonical state.
- Safe trigger points are emitted only from validated step transitions in v0.
- Implementation sequencing: defer behind the active bootstrap-gap queue.

**Source:** `docs/roadmap/CURRENT_CONTEXT.md` (last updated 2026-06-09)

- Active work item: `BANDIT-086` - Coordination Primitive Completion Triage
- Stage 1 formation approved
- No bootstrap gap blocks this work item
- No operator-owned input required for the current action
- Halt conditions include: approving a canonical shared transition state,
  State Index timing, local API work, scheduler execution, claim/worktree
  lifecycle, guarded browser action execution, Trust Verifier cutover, merge,
  push, deploy, paid routing, hosted services, public benchmark publication,
  and cross-repo runtime behavior

**Source:** `docs/roadmap/ROADMAP.md`

- `BANDIT-086` is current gap: "Coordination Primitive Completion Triage
  (formation approved)"
- `WIL-PR-CICD-LANDING`, `WIL-INSTALLED-COPY-UPDATE` remain proposal-only
- `WIL-V0-TRIAL` is deferred behind this lane and depends on
  `WIL-COORDINATION-PRIMITIVE` being closed or dispositioned
- No blocking gaps in `.bandit/bootstrap-gaps.json`

**Source:** `STATUS.md` (last updated 2026-06-09)

- `BANDIT-086` is formation approved; required operator input: none_required

**Source:** `docs/work/BANDIT-086/brief.md`

- Work type: chore (decision/triage only); no implementation authorized
- Out of scope: new coordination commands, state-machine transitions,
  validators, derived indexes, caches, local APIs, State Index, schedulers,
  heartbeats, claim leases, worktrees, browser workflow mutation, merge, push,
  deploy, hosted services, paid routing, public benchmark publication, or
  Trust Verifier cutover

**Source:** `docs/work/BANDIT-086/orchestration-plan.md`

- Contract version 1; coordination state: `formation_approved`
- Stage 3 required artifacts:
  `coordination-primitive-completion-disposition.md`,
  `writer-report.md`, `stage3-pm-review.md`, `implementation-evidence.md`
- No stage authorizes a new coordination primitive implementation, canonical
  shared transition state, local API, State Index, scheduler, claim/worktree
  lifecycle, or Trust Verifier cutover

### Landed Coordination Primitive Evidence

The following work items landed the coordination primitive components named in
the 2026-05-24 decision. All evidence lives in
`docs/work/<ID>/coordination-log.jsonl` and
`docs/work/<ID>/implementation-evidence.md`.

**BANDIT-025** (`docs/work/BANDIT-025/coordination-log.jsonl`) — Coordination Log Foundation

10 transitions: `brief_created` → `formation_approved` → `red_recorded` →
`implementation_recorded` → `implementation_recorded` (Qwen review handoff) →
`implementation_recorded` (aggregate Stage 4) → `review_recorded` →
`landing_verdict_recorded` → `landed` → `retrospective_recorded` → `closed`.

BANDIT-025 established the per-work-item append-only coordination log with
typed `step_transition` events. Each event carries `actor`, `state`,
`evidence`, `safe_triggers`, `next_action`, and `accountable_actor` fields.
The `safe_triggers` field is the v0 safe-trigger emission point required by
the 2026-05-24 decision: "Safe trigger points are emitted only from validated
step transitions." Closed cleanly.

**BANDIT-026** (`docs/work/BANDIT-026/coordination-log.jsonl`) — Typed State Extensions

8 transitions: `brief_created` → `formation_approved` → `red_recorded` →
`implementation_recorded` → `review_recorded` →
`landing_verdict_recorded` → `landed` → `retrospective_recorded` → `closed`.

BANDIT-026 added typed extensions for slices and chores on top of the
per-work-item coordination log. This satisfies the 2026-05-24 requirement
that the first state-machine implementation "should define one shared core
lifecycle and work-type-specific extensions rather than separate slice and
chore machines." Feature slices can record UAT-specific states; chores can
mark UAT not applicable or use chore-specific disposition states without
forking the whole lifecycle. Closed cleanly.

**BANDIT-028** (`docs/work/BANDIT-028/coordination-log.jsonl`) — Agent Coordination Event Commands

8 transitions: `brief_created` → `formation_approved` → `red_recorded` →
`implementation_recorded` → `review_recorded` →
`landing_verdict_recorded` → `landed` → `retrospective_recorded` → `closed`.

BANDIT-028 added Agent Coordination Event commands and an `actor_event_type`
extension on the coordination log. The 2026-05-24 decision requires "Actions
such as claim, handoff, block, complete, repair-request, and resume are
recorded against a work item and, when relevant, a current workflow state,
but they do not replace the Step Transition Ledger." BANDIT-028 implemented
this separation: step transitions remain authoritative lifecycle state while
actor coordination events are context-only. Closed cleanly.

**BANDIT-043** — Coordination Event Log Authority

BANDIT-043 created `.bandit/policy/coordination-authority.json` with
`canonical_history: per_work_item_append_only_coordination_log`,
`authoritative_event_families: ["step_transition"]`, and
`actor_event_authority: "context_only"`. Projection surfaces
(`current_state_view`, `cockpit_status`, `state_index`, `sqlite_cache`,
`in_flight_registry`, `derived_status_report`) are explicitly listed as
non-authoritative. Allowed projection mutation paths are
`rebuild_from_history`, `cli_append_or_reconcile`, and
`fail_closed_mechanical_repair`. The `claim_authority_exception` is
`future_scoped` and `release_authorized_decisions: []`. This is the
authoritative policy contract that binds the 2026-05-24 design to runtime
projection behavior. Closed cleanly.

**BANDIT-057** — Role Entry Points And Formation Gate

BANDIT-057 added formation-approved execution boundaries: `formation_approved`
became an append-only coordination state that gates `work-item-pm start` and
later stage transitions. BANDIT-063 added plan-mode orchestration
(`orchestration_plan_recorded`) on top. Together they satisfy the 2026-05-24
requirement that "the shared core state machine is also the foundation for
future heartbeats and cross-repo coordination" by ensuring cross-role
execution is bounded by validated step transitions, not by ad-hoc actor
events. Closed cleanly.

**BANDIT-081 through BANDIT-085** — Recent Landed Work Using Coordination Logs

- **BANDIT-081** (Operator Attention / Operator Inbox Surface): 10 transitions
  including `feature_uat_approved` for product UAT. The UAT approval is a
  validated step transition, not an actor event. This demonstrates the
  shared core lifecycle with typed UAT extension in production.
- **BANDIT-082** (Work Intake Ledger And Followups Migration): 9 transitions.
  Used the per-work-item coordination log without any cross-work-item
  aggregation or transition index.
- **BANDIT-083** (Bandit Cockpit UI Polish From Attached Design): 10
  transitions including `feature_uat_approved`. Cockpit UI polish consumed
  per-work-item log state through existing derived projections without
  adding a shared transition authority.
- **BANDIT-084** (Claim-First Transition Policy Triage): 9 transitions.
  Decision/triage chore pattern matches BANDIT-086. Stage 3 produced
  `claim-first-transition-disposition.md` with a deferred disposition for
  universal claim-first policy.
- **BANDIT-085** (Repo-Wide Transition Index Decision): 9 transitions. Triage
  chore that deferred a repo-wide transition index until named trigger
  conditions are observed. Closeout next-action named
  `WIL-COORDINATION-PRIMITIVE` as the next authorized gap.

**Pattern across the landed evidence:**

Every Phase 6 coordination work item (BANDIT-025, BANDIT-026, BANDIT-028) and
every subsequent role/formation/coordination work item (BANDIT-043, BANDIT-057,
BANDIT-058, BANDIT-059, BANDIT-060, BANDIT-061, BANDIT-062, BANDIT-063,
BANDIT-064, BANDIT-065, BANDIT-081, BANDIT-082, BANDIT-083, BANDIT-084,
BANDIT-085) completed its full lifecycle through per-work-item coordination
logs without any new coordination primitive implementation, canonical shared
transition state, or cross-work-item transition authority. The accepted
2026-05-24 design is the working contract; the landed work is the working
implementation.

### Existing Derived Projection Surfaces

The following surfaces already satisfy known aggregation, query, and
disposition needs. None is canonical transition history; all are derived,
rebuildable, and non-authoritative.

| Surface | Source artifacts | Query satisfied | CLI route |
| --- | --- | --- | --- |
| Cockpit status | `CURRENT_CONTEXT.md`, active work-item `coordination-log.jsonl` | Current active work-item state | `bandit cockpit status` |
| Session-context packet | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md` | Focused per-session state for dispatch | `bandit session-context current` |
| Work-intake validate/listing | `.bandit/work-intake-ledger.json` | Intake proposal lifecycle state | `bandit work-intake validate` |
| Queue/context | `ROADMAP.md`, intake ledger | Next-action queue | `bandit queue` |
| Improvement health | `docs/work/*/improvement-disposition.md` | Improvement chore status | `bandit improvement-health` |
| Coordination validation | Per-work-item `coordination-log.jsonl` | Single work-item transition validity | `bandit coordination validate <ID>` |
| Coordination authority | `.bandit/policy/coordination-authority.json` | Projection non-authority contract | `bandit coordination-authority validate` |
| Heartbeat | Per-work-item logs, `CURRENT_CONTEXT.md` | Bootstrap-gap next-action, UAT status | `bandit heartbeat` |
| Stage 4 evidence hash | `bandit review-subject-hash` | Review evidence freshness | `bandit review-subject-hash <ID>` |
| Risk classification | `.bandit/policy/risk-classification.json` | Auto-landing eligibility | `bandit risk-classification validate` |
| Supply-chain gate | `.bandit/policy/supply-chain-gate.json` | Supply-chain-sensitive change gate | `bandit supply-chain-gate validate` |

**Note on CLI command evidence:** Verification commands `bandit cockpit
status --json`, `bandit session-context current --json`, `bandit work-intake
validate --json`, and `bandit coordination validate BANDIT-086` are recorded
as required post-write checks for Codex PM at Stage 4 handoff. Per BANDIT-085
verification-gap precedent, the dispatch packet does not require these
commands to be run before Stage 3 evidence is written; the requirement is
that they be run by Codex PM before Stage 4 review and that any deviation be
recorded honestly.

No surface above requires a new coordination primitive implementation. Each
reads the data it needs from per-work-item logs, `CURRENT_CONTEXT.md`, or
`.bandit/policy/coordination-authority.json` and produces a non-authoritative
projection.

---

## Source-Of-Truth Policy: Unchanged

Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
canonical append-only Step Transition Ledgers.

Step transitions remain the authoritative lifecycle state. Actor coordination
events remain advisory unless accepted by CLI validation or Codex PM policy
into workflow state.

Cockpit status, session-context packets, intake ledger entries, queue/context
projections, heartbeat/improvement-health reports, roadmap text, generated
summaries, static previews, browser state, caches, databases, transition
indexes, and any future coordination primitive implementation are
projections. They cannot grant workflow authority, claim authority,
scheduling authority, Work Item allocation, UAT approval, landing approval,
or merge/push/deploy authority.

This policy is unchanged by this triage. Any future operator-approved policy
that grants canonical authority to a new coordination primitive, a shared
transition state, a State Index, a local API, or a scheduler would require
a separate operator-owned gate and explicit policy artifact — this
disposition does not approve, recommend, or authorize that change.

---

## Comparison: Accepted Design vs. Landed Capabilities

### Per-Work-Item Append-Only Coordination Logs

| Requirement (2026-05-24) | Landed | Evidence |
| --- | --- | --- |
| Per-work-item append-only coordination log | yes | BANDIT-025, BANDIT-026, BANDIT-028, BANDIT-043, BANDIT-081 through BANDIT-085 |
| Canonical Step Transition Ledger | yes | `.bandit/policy/coordination-authority.json` `canonical_history: per_work_item_append_only_coordination_log`, `authoritative_event_families: ["step_transition"]` |

### Step Transitions And Actor Coordination Events

| Requirement | Landed | Evidence |
| --- | --- | --- |
| Step transitions record `actor`, `state`, `evidence`, `safe_triggers`, `next_action`, `accountable_actor` | yes | BANDIT-025 forward; every coordination log sequence since 2026-05-25 records these fields |
| Actor coordination events are context-only and never replace step transitions | yes | BANDIT-028 added `actor_event_type` extension; `.bandit/policy/coordination-authority.json` `actor_event_authority: "context_only"` |
| Block Events reported by an actor | yes | BANDIT-028 actor coordination event commands; coordination log `accepted_block` field exists for downstream acceptance |
| Accepted Block workflow state created by CLI validation or Codex PM policy | yes | BANDIT-043 coordination-authority validator enforces this; `claim_authority_exception.status: "future_scoped"` means no actor-event-based claim is release-authorized |

### Shared Core Lifecycle And Typed Extensions

| Requirement | Landed | Evidence |
| --- | --- | --- |
| Shared core lifecycle for slices and chores | yes | BANDIT-025 core states; BANDIT-026 typed extensions |
| Typed extensions for slices (UAT states, `feature_uat_approved`) | yes | BANDIT-026 typed extensions; BANDIT-081 and BANDIT-083 record `feature_uat_approved` |
| Typed extensions for chores (UAT not applicable, chore-specific disposition) | yes | BANDIT-026 typed extensions; BANDIT-082, BANDIT-084, BANDIT-085 follow chore lifecycle without UAT |
| Retrospective recorded separate from closed | yes | BANDIT-025, BANDIT-026, BANDIT-028 record both states; BANDIT-084 and BANDIT-085 follow same pattern |

### Derived Current-State Views

| Requirement | Landed | Evidence |
| --- | --- | --- |
| Current-state summaries are derived and rebuildable from the coordination log | yes | `.bandit/policy/coordination-authority.json` `projection_surfaces` listed; `allowed_projection_mutation_paths: ["rebuild_from_history", "cli_append_or_reconcile", "fail_closed_mechanical_repair"]` |
| Cockpit status reads per-work-item coordination log and `CURRENT_CONTEXT.md` | yes | BANDIT-031, BANDIT-048, BANDIT-049, BANDIT-050, BANDIT-067; BANDIT-081 cockpit-status.ts |

### Safe Triggers

| Requirement | Landed | Evidence |
| --- | --- | --- |
| Safe trigger points emitted only from validated step transitions in v0 | yes | BANDIT-025 introduced `safe_triggers` field on step_transition events; every coordination log since records safe_triggers array per state |
| Actor coordination events may produce trigger signals for inspection but cannot start automation until CLI validation reconciles them | yes | BANDIT-028 actor event commands; `.bandit/policy/coordination-authority.json` enforces context-only actor events |

### Formation-Approved Execution Boundaries

| Requirement | Landed | Evidence |
| --- | --- | --- |
| `formation_approved` is an append-only coordination state | yes | BANDIT-057 added `formation_approved` state; coordination logs since then include it as sequence 2 |
| Work Item PM plan-mode orchestration records `orchestration_plan_recorded` | yes | BANDIT-063 added `orchestration_plan_recorded`; coordination logs since include it as sequence 3 |
| Stages block until formation_approved and orchestration_plan_recorded | yes | BANDIT-057 and BANDIT-063; `work-item-pm start` readiness refusal |

### Closeout Semantics

| Requirement | Landed | Evidence |
| --- | --- | --- |
| Retrospective recorded proves the learning artifact exists | yes | Every closed work item since BANDIT-025 records `retrospective_recorded` state |
| Closed proves every required disposition is complete, including improvement chores, no-action decisions, context updates, and follow-up routing | yes | BANDIT-025 through BANDIT-085 all record `closed` state with synchronized CURRENT_CONTEXT.md, ROADMAP.md, STATUS.md, and `.bandit/work-intake-ledger.json` updates |

### Heartbeat And Cross-Repo Coordination

| Requirement | Landed | Status |
| --- | --- | --- |
| Heartbeat distinguishes work that has merely landed or recorded retrospective from work that is actually closed | yes | BANDIT-052 event-driven wake scheduler policy; BANDIT-022 heartbeat inspect command; `bandit heartbeat` reads per-work-item `closed` state |
| Self-governing repositories for cross-repo coordination | n/a | Not yet needed; no cross-repo Bandit deployment exists |
| Central view aggregates or triggers safely but does not own canonical state | n/a | Not yet needed |
| Safe triggers come from validated step transitions in v0 | yes | BANDIT-052 scheduler policy; BANDIT-025 safe_triggers field |

### Assessment

The accepted 2026-05-24 design is satisfied for current Bandit workflow needs
by the landed coordination work. Every requirement that is currently relevant
has a concrete implementation, a policy contract, or a recorded bootstrap-gap
disposition. The two requirements that are not yet relevant
(cross-repo coordination, central aggregation views) are explicitly deferred
behind the bootstrap-gap queue in the original decision and remain so.

---

## Benefits vs. Risks Analysis

### Benefits Of New Coordination Primitive Implementation

1. **Heartbeat inspection depth.** A richer coordination primitive could
   expose additional actor-event metadata, transition timing histograms, or
   per-stage latency tracking that the current `bandit heartbeat inspect`
   command does not provide.

2. **Cross-work-item review tension tracking.** Aggregating reviewer findings
   across work items could expose recurring code smells without manual log
   inspection.

3. **Scheduler fan-out efficiency.** A pre-built coordination projection
   could let a scheduler fanning out across many active work items use
   O(1) lookups instead of directory scans.

4. **Cross-repo coordination foundation.** A formal coordination primitive
   with self-governing-repository semantics would lay the foundation for
   cross-repo Bandit deployment.

### Risks Of New Coordination Primitive Implementation

1. **Duplicate source-of-truth.** A new coordination primitive that
   duplicates any part of the existing per-work-item coordination log or
   `.bandit/policy/coordination-authority.json` would create a parallel
   canonical surface that the existing policy forbids.

2. **Stale projection trust.** A richer projection could be trusted as
   canonical by future agents if not bound to the existing
   `fail_closed_mechanical_repair` and `actor_event_authority:
   "context_only"` rules.

3. **Hidden workflow authority.** Any routing, scheduling, or gate decision
   that reads a new coordination primitive instead of the canonical
   per-work-item log makes that primitive de facto authoritative without an
   explicit operator-approved policy change.

4. **Review-locality loss.** A coordination primitive that aggregates across
   work items would be reviewed as a diff against itself; reviewers lose
   the per-item context needed to catch transition errors.

5. **Unnecessary coupling.** Building a new coordination primitive ahead of
   any concrete scheduler, heartbeat, or cross-repo need creates a
   build-order dependency and a surface that must be kept valid even during
   bootstrap.

6. **Bootstrap-gap queue violation.** The 2026-05-24 decision explicitly
   records: "Implementation sequencing follows the active bootstrap-gap
   lane. The coordination primitive should not jump ahead of the already
   queued bootstrap gaps unless a queued gap directly requires it." Starting
   implementation now would violate this guardrail without a queued gap
   that requires it.

### Assessment At Current State (BANDIT-086)

Every coordination-primitive requirement that is currently exercised by
Bandit workflow is already implemented by landed Phase 6 work and bounded by
`.bandit/policy/coordination-authority.json`. The benefits of additional
implementation are speculative (heartbeat depth, cross-work-item review
tension tracking, scheduler fan-out, cross-repo foundation). The structural
risks are immediate and would either duplicate canonical authority or
violate the bootstrap-gap queue. Deferred is the correct outcome.

---

## Disposition: Deferred With Named Trigger Conditions And Conditional Scope

### Decision

**Deferred.** No new coordination primitive implementation is implemented or
authorized by this work item. The decision is deferred until one or more
named trigger conditions are observed and a concrete coordination-primitive
need is documented.

Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
canonical. All existing derived projection surfaces remain non-authoritative.
`.bandit/policy/coordination-authority.json` remains the binding contract
between append-only coordination history and projection behavior.

### Named Trigger Conditions For Reconsideration

Reconsider when any of the following is observed:

1. **A queued bootstrap gap or future work item directly requires a new
   coordination primitive.** A concrete work item brief or bootstrap-gap
   chore identifies a missing coordination-primitive requirement that
   per-work-item logs, `.bandit/policy/coordination-authority.json`, and
   existing derived projections cannot satisfy.

2. **Heartbeat inspection depth gap.** `bandit heartbeat inspect` or a
   similar recurring chore cannot satisfy an operational need using
   per-work-item coordination logs and the existing `bandit heartbeat`
   command surface.

3. **Cross-work-item review-tension tracking need.** A concrete feature
   requires aggregating reviewer findings across work items at a cadence or
   scale that makes per-work-item log scanning impractical.

4. **Scheduler fan-out need.** A release-authorized scheduler or event-driven
   wake path needs current transition state across all active work items
   faster than per-work-item log scanning allows.

5. **Cross-repo coordination requirement.** A concrete product or trust-layer
   decision authorizes cross-repo Bandit deployment, which would require
   self-governing-repository coordination semantics.

6. **V0 Trial blocking gap.** The V0 Closeout Claude Code A/B Product-Value
   Trial explicitly requires coordination-primitive reporting that the
   current surfaces cannot provide.

### Conditional Future Implementation Scope (Not Authorized Here)

If a trigger condition is observed, a future work item may implement a
narrow coordination-primitive slice under the following contract. This is
recorded for reference; no implementation is authorized by this disposition.

**Coordination-Primitive Slice Contract:**

- **Source artifacts:** Existing per-work-item
  `docs/work/*/coordination-log.jsonl` files; the set expands as work items
  are created.
- **Source-of-truth policy:** `.bandit/policy/coordination-authority.json`
  remains binding. New coordination-primitive artifacts must be projections
  with `actor_event_authority: "context_only"` and must never replace
  per-work-item logs.
- **Implementation surface:** Smallest policy artifact, validator, command,
  or report needed to satisfy the named trigger condition. No new
  coordination command, state-machine transition, or canonical shared
  transition state is authorized.
- **Authority:** Non-authoritative. The new surface must be a derived
  projection or a policy contract bound by
  `.bandit/policy/coordination-authority.json`.
- **Failure behavior:** A new coordination-primitive artifact must fail
  closed when canonical state is unavailable, when
  `.bandit/policy/coordination-authority.json` projection rules are
  violated, or when source artifacts are stale.
- **Expected RED tests (for future Test Writer):**
  - The new surface reads from per-work-item coordination logs and never
    writes to them.
  - The new surface fails closed when canonical state is unavailable.
  - The new surface cannot grant workflow, claim, scheduling, UAT, landing,
    or merge/push/deploy authority.
  - The new surface does not duplicate `.bandit/policy/coordination-authority.json`
    canonical rules.
  - Deleting the new surface does not break any canonical coordination-log
    command.
- **Review gates:** Normal Stage 2 RED evidence, Stage 3 implementation,
  Stage 4 Local Qwen and CodeRabbit review, risk classification,
  supply-chain gate, and Stage 5 landing verdict/action — before any cockpit,
  scheduler, or cross-repo surface uses the new coordination primitive.
- **Explicit non-goals:** The new surface must never become canonical;
  never grant claim, scheduling, UAT, landing, or merge/push/deploy
  authority; never replace per-work-item append-only logs; never run live
  polling or background writes; never be a SQLite store, database, or hosted
  service without separate operator approval; never be shared across repos
  or published externally.

### Operator-Owned Decisions (If Future Implementation Is Sought)

If a future work item proposes a new coordination primitive implementation,
the following decisions require explicit operator approval and must not be
guessed:

- Approving a canonical (non-derived) shared transition state that gains
  workflow authority.
- Approving a State Index with claim, scheduling, or UAT authority.
- Approving a local API or hosted service for the new coordination
  primitive.
- Approving a background scheduler or live polling rebuild route.
- Approving a SQLite store or database for transition history.
- Approving merge/push/deploy behavior tied to the new coordination
  primitive.
- Approving paid routing or public benchmark publication of the new
  coordination primitive outputs.
- Approving cross-repo coordination runtime behavior.
- Approving a Trust Verifier cutover that depends on the new coordination
  primitive.

None of these are approved or recommended by this disposition.

---

## Summary

| Dimension | Verdict |
| --- | --- |
| Is a new coordination primitive implementation justified now? | No |
| Do per-work-item coordination logs satisfy current needs? | Yes |
| Do derived projection surfaces and `.bandit/policy/coordination-authority.json` satisfy current needs? | Yes |
| Are trigger conditions named for future reconsideration? | Yes |
| Is implementation authorized by this work item? | No |
| Does source-of-truth policy change? | No |
| Does `.bandit/policy/coordination-authority.json` change? | No |
| Is operator approval needed for this deferred disposition? | No |
| What would require operator approval? | Any proposal to implement a new coordination primitive, grant it workflow authority, change `.bandit/policy/coordination-authority.json`, or implement a State Index, local API, scheduler, claim/worktree lifecycle, merge/push/deploy, hosted service, or public benchmark surface tied to coordination |

**Disposition: Deferred.** Land and close this work item. Reconsider when a
named trigger condition is observed and a concrete coordination-primitive
implementation need is documented.
