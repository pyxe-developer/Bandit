# BANDIT-084 Claim-First Transition Disposition

## Stage 3 Delivery

work_item: BANDIT-084
delivery_type: triage_disposition
authored_by: claude_sonnet_4_6
stage: 3
created_at: 2026-06-09

---

## Source Evidence Reviewed

| Artifact | Purpose |
| --- | --- |
| `FOLLOWUPS.md` § "Revisit Claim Requirement After Bootstrap" | Origin of WIL-CLAIM-FIRST proposal |
| `.bandit/work-intake-ledger.json` entry `WIL-CLAIM-FIRST` | Intake routing and current scope_summary |
| `docs/decisions/2026-05-27-git-refs-claim-authority-backend.md` | Accepted Git refs CAS claim-authority decision |
| `.bandit/policy/claim-authority.json` | Active claim-authority policy record |
| `.bandit/claims/README.md` | Projection directory notice |
| `docs/templates/claim-authority.md` | Template structure for claim-authority artifacts |
| `docs/work/BANDIT-083/coordination-log.jsonl` | Landed work-item transition evidence (10 events) |
| `docs/work/BANDIT-082/coordination-log.jsonl` | Landed work-item transition evidence (9 events) |
| `docs/work/BANDIT-081/coordination-log.jsonl` | Landed work-item transition evidence (10 events) |
| `docs/work/BANDIT-084/brief.md` | Formation spec and scope contract |
| `docs/work/BANDIT-084/red-evidence.md` | Stage 2 disposition plan and acceptance mapping |
| `docs/work/BANDIT-084/orchestration-plan.md` | Work Item PM plan |

---

## Current Policy Summary

From `FOLLOWUPS.md` and `docs/work/BANDIT-084/brief.md`:

> During bootstrap, every step transition must have an accountable actor.
> An explicit prior claim event is required only for delegated or asynchronous work.
> After bootstrap, Bandit should revisit whether every step transition should require
> an explicit actor claim first.

This policy remains unchanged by this triage.

Claim authority is defined in `docs/decisions/2026-05-27-git-refs-claim-authority-backend.md` and enforced by `.bandit/policy/claim-authority.json`:

- Active writable claim authority lives in `refs/bandit/*`.
- State-changing operations use `git update-ref --stdin` compare-and-swap transactions.
- `.bandit/claims/`, in-flight registries, cockpit status, and state indexes are projections.
- Projections cannot grant, renew, release, complete, block, fail, recover, or reconcile writable claims.
- `release_authorized_decisions: []` — no release-authorized claim operations are currently active.

---

## Coordination-History Findings

Reviewed three landed work-item coordination logs. All show the same pattern:

**BANDIT-083** (10 transitions, all landed and closed):

| State | Actor | Accountable Actor Named |
| --- | --- | --- |
| `brief_created` | `repo_pm` | yes |
| `formation_approved` | `repo_pm` | yes (implicit — formation review roles) |
| `orchestration_plan_recorded` | `work_item_pm` | yes |
| `red_recorded` | `test_writer` | yes → `implementation_writer` |
| `implementation_recorded` | `work_item_pm` | yes → `reviewer` |
| `review_recorded` | `work_item_pm` | yes → `operator` |
| `feature_uat_approved` | `operator` | yes → `landing_agent` |
| `landing_verdict_recorded` | `landing_agent` | yes → `landing_agent` |
| `landed` | `landing_agent` | yes → `closeout_agent` |
| `closed` | `closeout_agent` | yes → `repo_pm` |

**BANDIT-082** (9 transitions) and **BANDIT-081** (10 transitions) show the same structure: every event carries an explicit `actor` field and the outgoing `accountable_actor` field for the next state.

**Findings:**

1. Every synchronous sequential transition already has an explicit named actor in the coordination log record.
2. The handoff chain is enforced through `next_action` + `accountable_actor` at each step.
3. No pre-claim events appear or are required before synchronous role handoffs.
4. No transitions show unaccountable actors, missing actor records, or race-condition patterns in the landed evidence.
5. Actor accountability is tracked through two fields: `actor` (who executed) and `accountable_actor` (who is next responsible), providing both a backward audit trail and a forward handoff contract.

---

## Claim-Authority Findings

From `docs/decisions/2026-05-27-git-refs-claim-authority-backend.md`:

- The Git refs CAS backend was accepted for **concurrent and delegated** claim scenarios.
- The rationale is that file-only read/check/write sequences can race; Git refs provide a real CAS boundary without a hidden database.
- The decision does not extend CAS authority to synchronous sequential transitions.
- Fencing tokens and idempotency keys are required on **state-changing claim operations and external side-effecting operations under a claim** — not on every coordination transition.

From `.bandit/policy/claim-authority.json`:

- `release_authorized_decisions: []` — the CAS backend has no release-authorized operations yet.
- The backend architecture is complete (fields, projection surfaces, required record shape) but no worktree, scheduler, or delegated execution has been release-authorized.

From `.bandit/claims/README.md` and the claims directory:

- The directory contains only its projection README — no active claim records exist.
- The README correctly records projections cannot grant claims.

From `docs/templates/claim-authority.md`:

- The template exists for future claim-authority artifacts.
- No instantiated claim-authority records exist for any work item.

**Findings:**

1. The CAS backend is designed for concurrent/delegated scenarios (parallel worktrees, multi-actor dispatch, asynchronous execution).
2. No release-authorized claim operations are currently active.
3. Universal claim-first for synchronous sequential transitions would require the CAS backend to be release-authorized first.
4. The current accountable-actor model already satisfies the accountability goal for synchronous work without pre-claim ceremony.

---

## Transition Context Classification

| Context | Already Covered By | Explicit Claim Required |
| --- | --- | --- |
| Synchronous sequential stage transitions (brief → formation → red → impl → review → landing → closed) | `actor` + `accountable_actor` fields in per-work-item coordination log; named role handoff chain | No — current policy; accountable actor is sufficient |
| Delegated or asynchronous work (parallel worktrees, multi-actor dispatch) | Git refs CAS claim authority backend per current policy | Yes — current policy |
| Concurrent claim attempts on same work surface | Git refs CAS `git update-ref --stdin` compare-and-swap | Yes — current policy |
| Coordination history (append-only per-work-item logs) | Per-work-item `.jsonl` logs; canonical workflow history | Not applicable — coordination logs record transitions, not claim grants |
| Projections (`.bandit/claims/`, cockpit status, roadmap, intake ledger, generated reports) | `claim-authority.json` projection surface list | Not applicable — projections have no claim grant authority |
| Bootstrap stage gates (formation_approved, orchestration_plan_recorded) | Named actor handoffs with explicit safe_triggers | No — synchronous sequential; accountable actor is sufficient |

---

## Disposition: Deferred

**Universal claim-first policy for all transitions is deferred pending two conditions.**

### Rationale

1. The coordination-history evidence shows that every transition in recent landed work items already records an explicit accountable actor. The accountability goal of claim-first is already satisfied for synchronous sequential work through the `actor` + `accountable_actor` + `next_action` fields.

2. The Git refs CAS backend (`release_authorized_decisions: []`) is not yet release-authorized. Universal claim-first for synchronous sequential transitions would require a functioning release-authorized CAS backend to avoid adding deadlock risk without a real concurrent-writer problem to solve.

3. No concrete evidence of unaccountable-actor transitions or sequential-transition race conditions exists in the landed coordination logs reviewed (BANDIT-081, BANDIT-082, BANDIT-083).

4. Adding universal pre-claim ceremony to synchronous sequential work before the CAS backend is release-authorized and before concrete accountable-actor failures appear would increase workflow friction without measurable safety improvement.

### Deferred Conditions

This disposition should be revisited when **both** of the following are true:

- The Git refs CAS claim-authority backend becomes release-authorized (i.e., `release_authorized_decisions` is no longer empty and at least one worktree, scheduler, or delegated execution path uses it); **and**
- Concrete evidence exists that synchronous sequential transitions produce unaccountable actors or race conditions under the current accountable-actor model.

Until both conditions are met, no universal claim-first policy change is warranted.

### No Implementation Needed

This triage finds no implementation work required at this time. The disposition-only result satisfies Stage 3 for this work item.

---

## Operator-Owned Policy Gate

If the operator decides to require every step transition — including synchronous sequential handoffs — to have an explicit prior claim event, that is an **operator-owned policy change**. This triage halts at that gate without guessing.

The exact decision required from the operator would be:

> "Approve universal claim-first policy: every stage transition in every work item must be preceded by an explicit claim event using the Git refs CAS backend, regardless of whether the transition is synchronous, sequential, or involves concurrent actors."

This decision would also require:
- Release authorization of the Git refs CAS claim-authority backend.
- An updated coordination log schema (adding a `claim_event_id` precondition field).
- A new claim precondition validator enforced before each stage transition.
- Operator approval of any increased workflow latency or ceremony from pre-claim round-trips.

---

## Future Implementation Scope (Conditional)

If the deferred conditions are met and the operator approves universal claim-first policy, the following narrow implementation scope would apply:

**Required artifacts:**
- Updated `.bandit/policy/claim-authority.json` with `release_authorized_decisions` populated for sequential transitions.
- Coordination validation rule: each stage transition must reference a valid prior claim event ID.
- Coordination log schema update: `claim_event_id` field on each `step_transition` event (nullable until the policy is activated).

**Required RED tests:**
- Claim-gated transition acceptance: transition with valid claim → allowed.
- Transition without prior claim → rejected with clear message.
- Transition with stale/released claim → rejected.
- Idempotency: same-key replay of a claim-gated transition → recognized.
- Projection non-authority: `.bandit` claim file edit does not satisfy claim precondition.

**Claim safety invariants:**
- No two actors may hold simultaneous claims on the same work surface and stage.
- A released or failed claim cannot satisfy a transition precondition.
- Idempotency key collision on different inputs is refused.
- Coordination history records claim event ID alongside actor for each transition.

**Stage capability boundaries:**
- Claim creation/release uses Git refs CAS only; coordination log records the outcome.
- Coordination validation reads Git refs claim state; it does not write claim state.
- Projections are not consulted for transition precondition checks.

**Non-goals:**
- This triage does not authorize worktree lifecycle, scheduler behavior, paid routing, merge, push, deploy, or Trust Verifier cutover.
- The claim-gated sequential transition implementation does not change claim-authority backend architecture.
- No changes to existing coordination log events (append-only history is preserved).
