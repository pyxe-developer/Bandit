# Followups

This file captures product and workflow questions that should be revisited later
but are not the current active Bandit work queue.

## Open

### Revisit Claim Requirement After Bootstrap

- **Origin:** Coordination primitive design discussion on 2026-05-24.
- **Current decision:** During bootstrap, every step transition must have an accountable actor, but a prior `claim` event is required only for delegated or asynchronous work.
- **Follow-up question:** After bootstrap is complete, should every step transition require an explicit actor claim first?
- **Why later:** Requiring claims universally may be correct once Bandit has durable coordination commands, but it would add ceremony while bootstrap work is still being converted into CLI-backed contracts.
- **Expected evaluation point:** After the current bootstrap-gap resolution lane is complete and before broader cockpit or unattended automation work depends on the coordination primitive.

### Consider Repo-Wide Transition Index

- **Origin:** Coordination primitive design discussion on 2026-05-24.
- **Current decision:** Canonical Step Transition Ledgers are append-only and scoped per work item.
- **Follow-up question:** Should Bandit add a repo-wide derived transition index for faster cockpit queries, cross-work-item reporting, or heartbeat scheduling?
- **Why later:** A repo-wide canonical ledger would create a shared hot file and weaken review locality. A derived index may still be useful once cockpit and heartbeat query needs are concrete.
- **Expected evaluation point:** When cockpit, heartbeat, or cross-repo coordination work needs efficient queries across many work items.

### Schedule Coordination Primitive Implementation

- **Origin:** Coordination primitive design discussion on 2026-05-24.
- **Current decision:** The coordination primitive design is accepted directionally, but implementation should not jump ahead of the active bootstrap-gap queue unless a queued gap directly requires it.
- **Follow-up question:** When the current bootstrap-gap lane is exhausted, resolved, blocked, or explicitly dispositioned, what is the first implementation slice for the per-work-item coordination log and shared core state machine?
- **Why later:** Starting it now would violate the one-gap-at-a-time queue discipline Bandit is trying to enforce.
- **Expected evaluation point:** After the queued bootstrap gaps in `docs/roadmap/CURRENT_CONTEXT.md` are resolved, blocked, or explicitly dispositioned.

### Move From Local Main Landing To PR And CI/CD Workflow

- **Origin:** GitHub remote setup and workflow discussion on 2026-05-24.
- **Current decision:** Until bootstrap is complete, the operator will handle pushing to GitHub manually. Bandit's Landing Agent remains scoped to local-record landing evidence and does not perform remote push, PR merge, deploy, or CI/CD orchestration.
- **Follow-up question:** After bootstrap is complete, how should Bandit define remote publication, GitHub PR workflow, CI checks, merge evidence, and deployment evidence?
- **Why later:** `.bandit/policy/landing-agent.json` currently disables push/merge/deploy behavior intentionally. Adding real GitHub CI/CD and PR-based landing needs its own policy, credentials, branch protection, review, and evidence contracts.
- **Expected evaluation point:** After the bootstrap-gap lane is complete and before Bandit replaces local-main landing with a real PR-based GitHub workflow.
