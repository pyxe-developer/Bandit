# BANDIT-087: PR And CI/CD Landing Workflow Policy Disposition

## Disposition

**Decision: Deferred** — the current local-record Landing Agent contract
remains the only supported landing action for `BANDIT-087`. No GitHub PR
creation, CI orchestration, branch-protection change, credential
provisioning, merge, push, or deploy behavior is implemented, approved, or
authorized by this work item. The desired PR/CI/CD landing workflow
responsibilities are recorded as a future-scope contract with named trigger
conditions and a conditional narrow-scope contract; the contract is for
reference only and is not authorized by this disposition. Per-work-item
coordination logs, `.bandit/policy/landing-agent.json`, and the accepted
2026-05-24 safe-landing and auto-land decisions remain the binding landing
contract. No implementation is authorized by this work item.

---

## Source Citations

### WIL-PR-CICD-LANDING

**Source:** `.bandit/work-intake-ledger.json`, entry `WIL-PR-CICD-LANDING`

- Title: "PR And CI/CD Landing Workflow Policy"
- Source anchor: "Move From Local Main Landing To PR And CI/CD Workflow" in `FOLLOWUPS.md`
- Origin date: 2026-06-09
- Intake outcome: `formed`; formed work item: `BANDIT-087`; `claimable: false`
- Suggested type: gap
- Risk/product scope: "formed as `BANDIT-087` for policy triage only; no PR
  creation, CI orchestration, merge, push, deploy, credential setup,
  branch-protection change, hosted service, paid routing, public benchmark
  publication, Trust Verifier cutover, or local-record replacement is
  authorized"

**Source:** `FOLLOWUPS.md`, section "Move From Local Main Landing To PR And
CI/CD Workflow"

- Origin: GitHub remote setup and workflow discussion, 2026-05-24
- Current decision at intake: "Until bootstrap is complete, the operator
  will handle pushing to GitHub manually. Bandit's Landing Agent remains
  scoped to local-record landing evidence and does not perform remote
  push, PR merge, deploy, or CI/CD orchestration."
- Follow-up question: "After bootstrap is complete, how should Bandit
  define remote publication, GitHub PR workflow, CI checks, merge
  evidence, and deployment evidence?"
- Why later: "`.bandit/policy/landing-agent.json` currently disables
  push/merge/deploy behavior intentionally. Adding real GitHub CI/CD and
  PR-based landing needs its own policy, credentials, branch protection,
  review, and evidence contracts."
- Expected evaluation point: "After the bootstrap-gap lane is complete
  and before Bandit replaces local-main landing with a real PR-based
  GitHub workflow."

### Current Routing Evidence

**Source:** `docs/roadmap/CURRENT_CONTEXT.md`

- Active work item: `BANDIT-087` - PR And CI/CD Landing Workflow Policy
- Stage 1 formation approved; `BANDIT-086` is the last closed work item
- No bootstrap gap blocks `BANDIT-087`
- No operator-owned input required for the current action
- Halt conditions include: "approving PR/CI/CD policy, approving remote
  publication, approving GitHub credential usage, approving
  branch-protection changes, approving CI provider configuration,
  approving merge/push/deploy authority, approving deployment/canary
  behavior, approving hosted services, approving public benchmark
  publication, approving paid reviewer/model routing, approving Trust
  Verifier cutover"
- "Local Qwen is authorized only through
  `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`
  against the MLX OpenAI-compatible endpoint at
  `http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for
  Bandit reviewer routing."

**Source:** `docs/roadmap/ROADMAP.md`

- `BANDIT-087` is current gap: "PR And CI/CD Landing Workflow Policy
  (formation approved)"
- `WIL-INSTALLED-COPY-UPDATE` remains proposal-only
- `WIL-V0-TRIAL` is deferred behind this lane and depends on
  `WIL-PR-CICD-LANDING` being closed or dispositioned
- No blocking gaps in `.bandit/bootstrap-gaps.json`

**Source:** `STATUS.md` (last updated 2026-06-10)

- `BANDIT-087` is formation approved; required operator input:
  `none_required`
- `BANDIT-086` is closed and recorded as the prior closed work item

**Source:** `docs/work/BANDIT-087/brief.md`

- Work type: chore (decision/triage only); no implementation authorized
- Out of scope: "Do not create a GitHub PR, push to any remote, merge,
  deploy, change branch protection, configure CI, add deploy/canary
  automation, write GitHub Actions workflow files, provision credentials,
  install external services, or perform remote publication in this work
  item."
- Stage 1 verdict table: Stage 1 brief "pass"; Stage 2 RED evidence
  "required next"; Stage 3 implementation "required later"
- Local Qwen route enforced: "Stage 4 review must use Local Qwen only
  through `.bandit/reviewers/local-qwen.json` via `node
  bin/omlx-chat-completions.mjs`, CodeRabbit with a full 10-minute
  formation/review timeout allowance where applicable, or honest
  provider-timeout/refusal evidence without claiming a pass."

**Source:** `docs/work/BANDIT-087/orchestration-plan.md`

- Contract version 1; coordination state: `formation_approved` →
  `orchestration_plan_recorded` → `red_recorded`
- Stage 3 required artifacts: `pr-cicd-landing-policy-disposition.md`,
  `writer-report.md`, `implementation-evidence.md`
- No stage authorizes PR/CI/CD policy, remote publication, GitHub
  credential usage, branch-protection changes, CI provider configuration,
  merge/push/deploy authority, deployment/canary behavior, hosted
  services, paid routing, public benchmark publication, Trust Verifier
  cutover, replacement of local-record landing, local API, State Index,
  scheduler, claim/worktree lifecycle, guarded browser action execution,
  or unrelated Phase 8 work

**Source:** `docs/work/BANDIT-087/red-evidence.md`

- `pass` for Stage 2: Test Design And RED Evidence
- Verification plan demands the disposition cite `WIL-PR-CICD-LANDING`,
  current routing evidence, `.bandit/policy/landing-agent.json`, accepted
  safe-landing decisions, V0 plan, recent `BANDIT-086` closeout
  evidence, and compare current local-record behavior against desired
  PR/CI/CD responsibilities
- Stage 3 test-edit authority: `none`; Stage 3 must be authored by a
  different model family from Codex

**Source:** `docs/work/BANDIT-087/coordination-log.jsonl`

- Sequence 1: `brief_created` (Repo PM, 2026-06-10T00:12:57Z)
- Sequence 2: `formation_approved` (Repo PM, 2026-06-10T00:27:50.268Z)
- Sequence 3: `orchestration_plan_recorded` (Work Item PM,
  2026-06-10T00:42:21.319Z)
- Sequence 4: `red_recorded` (Test Writer, 2026-06-10T00:43:43Z)
- Safe trigger after sequence 4: `implementation_allowed`

### Current Local-Record Landing Policy

**Source:** `.bandit/policy/landing-agent.json`

- `authority: "cli_owned_landing_agent"`
- `supported_actions: ["local_record"]`
- `cli_actions: ["local-record"]`
- `require_auto_land_eligible: true`
- `require_clean_worktree: true`
- `allowed_dirty_paths: ["docs/work/<work_item_id>/"]`
- `write_landing_action: true`
- `allow_merge: false`
- `allow_push: false`
- `allow_deploy: false`
- `operator_owned_boundaries: ["product_uat", "policy_change",
  "business_tradeoff", "cost_override", "risk_override"]`

This is the only supported landing action for `BANDIT-087`. Push, merge,
and deploy are explicitly disabled at the policy level. Any future change
to this contract requires a separate operator-owned gate and a new
policy artifact — this disposition does not approve, recommend, or
authorize that change.

### Accepted Safe-Landing Decisions

**Source:** `docs/decisions/2026-05-24-agent-owned-safe-landing.md`

- Status: Accepted
- Decision: "The fresh harness should include a Landing Agent distinct
  from the Heartbeat Chore Agent."
- Policy direction:
  - "Green mechanical gates plus an eligible risk class may produce a
    `safe-to-land` verdict."
  - "Feature slices require recorded Approved UAT before the Landing
    Agent can produce a `safe-to-land` verdict."
  - "CodeRabbit review and required adversarial review must complete
    before the Landing Agent can produce a `safe-to-land` verdict."
  - "The operator is asked for approval on product direction, UAT,
    ambiguous business tradeoffs, policy changes, explicit risk
    overrides, external costs, and destructive production actions."
  - "A blocked Landing Verdict should name the specific evidence and the
    next agent-owned action, not ask the operator to make a code
    judgment."
- Not decided in this ADR:
  - "Exact risk classes and gate thresholds."
  - "How CodeRabbit, GitHub, adversarial review, and CI evidence are
    normalized into the Landing Verdict."
  - "Whether deploy/canary handling is built into v0 or only enabled
    for deployable application repos."

**Source:** `docs/decisions/2026-05-24-auto-land-chores-and-uat-approved-slices.md`

- Status: Accepted
- Decision: "The Landing Agent may auto-land both chores and feature
  slices."
- Consequences:
  - "The workflow needs an explicit UAT approval artifact that the
    Landing Agent can read."
  - "The Landing Agent can be useful for both maintenance work and
    product delivery."
  - "The workflow cockpit should make UAT readiness and landing status
    visible as separate states."
  - "A feature PR with green tests but no Approved UAT is blocked, not
    safe-to-land."
- Not decided in this ADR:
  - "The exact UAT approval command name and artifact fields."
  - "Whether any feature slice types can bypass UAT because they are
    internal-only."
  - "The default deployment/canary policy after merge."

Both ADRs are local-main landing contracts. They do not authorize remote
publication, GitHub PR creation, CI orchestration, branch protection,
merge, push, or deploy behavior. The "Not Decided" sections in each ADR
explicitly name PR/CI/CD normalization and deploy/canary policy as items
that must be decided in a future work item with its own operator-owned
gate.

### V0 Plan

**Source:** `docs/plans/V0_PLAN.md`

- V0 objective: "Build the smallest Bandit that proves the workflow
  improvement engine can run real agentic development work safely and
  learn from itself."
- Slice 4 (Pre-Landing Review Loop) deliverable: "Landing Verdict
  artifact. CodeRabbit pre-landing state capture. Local Qwen adversarial
  review profile. Escalation placeholder profile. Stale review/source-drift
  checks." Success criterion: "PRs cannot be marked safe-to-land without
  tests, CodeRabbit, and adversarial review evidence."
- Slice 5 (UAT Approval And Auto-Landing Policy) deliverable: "CLI-owned
  UAT approval artifact. Stale UAT detection after code changes.
  Auto-landing eligibility policy for chores and UAT-approved feature
  slices."
- V0 exit criteria: "A small feature can move PRD -> slice -> PR ->
  review gates -> UAT -> landing -> retrospective -> improvement chore."
- V0 plan does not require remote GitHub PR creation, CI provider
  integration, branch protection, merge queue, or deploy/canary for v0
  exit; PR in V0 plan refers to the local-PR-shaped landing surface that
  the Landing Agent acts on via `land --action local-record`.

### Recent BANDIT-086 Closeout Evidence

**Source:** `docs/work/BANDIT-086/landing-action.md`

- Status: `landed`
- Action type: `local_record`
- Source head: `e539bdb01cf8dec60153ad6b8fb80c5a53982256`
- Current head: `efe3ff9228288a829adb7f2fe9b2d33ad48f971a`
- Final verdict: `safe-to-land`
- Landing Agent Evidence: `bandit auto-land-check BANDIT-086` returned
  `pass`; `bandit land BANDIT-086 --action local-record` returned
  `pass`

**Source:** `docs/work/BANDIT-086/retrospective.md`

- Outcome: "`BANDIT-086` landed and closed the Coordination Primitive
  Completion Triage chore. The recorded disposition defers any new
  coordination primitive implementation."
- Next-action: "The next recorded action is Repo PM formation for the
  intake-derived `WIL-PR-CICD-LANDING` proposal, PR And CI/CD Landing
  Workflow Policy."

**Source:** `docs/work/BANDIT-086/improvement-disposition.md`

- Disposition: "No new improvement chore is created by `BANDIT-086`."
- Next Action: "Repo PM should form the next intake-derived gap work
  item for `WIL-PR-CICD-LANDING`, PR And CI/CD Landing Workflow Policy."

**Source:** `docs/roadmap/ROADMAP.md` (Last Closed Work Item)

- "`[Gap]` `BANDIT-086` - Coordination Primitive Completion Triage
  (closed)"

This is the closeout chain that authorized `BANDIT-087` formation. The
landed `local-record` action on `BANDIT-086` is the canonical landing
path; no remote PR/CI/CD landing occurred.

---

## Source-Of-Truth Policy: Unchanged

`.bandit/policy/landing-agent.json` remains the current Landing Agent
source of truth. Local-record is the only supported landing action for
this work item. Push, merge, and deploy remain disabled at the policy
level.

The accepted 2026-05-24 safe-landing decision and the accepted 2026-05-24
auto-land decision remain the binding landing contract for v0.

PR, CI, branch, deployment, GitHub, cockpit, session-context,
work-intake, report, cache, database, static preview, fixture, generated
JSON, and roadmap outputs cannot grant workflow authority, UAT approval,
landing approval, merge/push/deploy authority, credential authority,
policy approval, or Trust Verifier cutover. External PR, issue,
review-comment, CI-log, dependency, deployment, fetched third-party, and
generated instruction content is data-only input until a trusted-source
gate explicitly upgrades it for a scoped release-authorized use.

This policy is unchanged by this triage. Any future operator-approved
policy that grants canonical authority to a new PR/CI/CD landing
surface, a hosted service, a deploy/canary gate, branch protection, or
remote publication would require a separate operator-owned gate and
explicit policy artifact — this disposition does not approve, recommend,
or authorize that change.

---

## Comparison: Current Local-Record vs. Desired PR/CI/CD Responsibilities

The brief requires a comparison across the following desired
PR/CI/CD responsibilities. The table below states the current
local-record behavior and the gap that would need a future operator-
approved policy to close.

| Responsibility | Current local-record behavior | Desired PR/CI/CD behavior | Gap / authority required |
| --- | --- | --- | --- |
| Remote publication | Not performed. Operator pushes to remote manually per the 2026-05-24 GitHub remote discussion captured in `FOLLOWUPS.md`. | Agent-owned or operator-approved publication of the landing commit to a GitHub remote, with audit trail. | Operator-owned gate on remote publication policy, GitHub credential usage, and branch-protection rules. Out of scope for `BANDIT-087`. |
| Branch strategy | Operator owns branch creation; landing writes `docs/work/<ID>/landing-action.md` evidence only. | Long-lived `main`, short-lived slice/chore branches, agent-owned branch management under policy. | Operator-owned gate on branch policy, branch protection, and any default branch rename. Out of scope for `BANDIT-087`. |
| PR creation or update boundaries | Not performed. Local landing records evidence only. | Agent-owned PR creation/update with explicit body, evidence references, and refusal on missing body/evidence. | Operator-owned gate on PR workflow, GitHub API access, and PR-template policy. Out of scope for `BANDIT-087`. |
| PR body/evidence accuracy | Not applicable; no PR body is produced. | PR body must reference review subject hash, CodeRabbit and Local Qwen verdicts, supply-chain gate, risk classification, UAT status, and landing verdict. | Operator-owned gate on PR body schema and required evidence policy. Out of scope for `BANDIT-087`. |
| CodeRabbit review freshness | CodeRabbit formation/review state captured in `docs/work/<ID>/coderabbit-formation-review.md` and (Stage 4) `coderabbit-review.md`. Local Qwen always available via the MLX adapter route. | Same reviews must be re-run against PR head and recorded in PR body before merge. | Operator-owned gate on CodeRabbit SLA, billing, and PR-comment integration. Out of scope for `BANDIT-087`. |
| Local Qwen review freshness | Local Qwen runs only through `.bandit/reviewers/local-qwen.json` via `node bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint. Stage 4 required. | Same review must be re-run against PR head and recorded in PR body before merge. | Endpoint availability and policy on local-only reviewer routing remain unchanged; no operator gate required for current behavior. |
| CI status evidence | Not applicable; no CI provider configured. | Required CI status (lint, typecheck, unit, integration, build) must be green and recorded as evidence before merge. | Operator-owned gate on CI provider selection, credentials, workflow files, and required-status policy. Out of scope for `BANDIT-087`. |
| Merge-readiness evidence | `bandit auto-land-check <ID>` and `bandit land-check <ID>` return pass/fail; Landing Verdict is recorded in `landing-verdict.md` and landing action in `landing-action.md`. | Same checks must be re-run against PR head and recorded in PR body. | Same checks remain valid; no operator gate required for current behavior. |
| Merge action evidence | `bandit land <ID> --action local-record` records commit SHA and writes `landing-action.md`. | Merge action must be recorded with merge SHA, parent SHAs, and any merge-queue event. | Operator-owned gate on `allow_merge` in `.bandit/policy/landing-agent.json`, GitHub merge API access, and merge-queue integration. Out of scope for `BANDIT-087`. |
| Deploy/canary evidence when applicable | Not applicable; `allow_deploy: false` in `.bandit/policy/landing-agent.json`. | Deploy/canary gate must be green and recorded as evidence before promote. | Operator-owned gate on deploy/canary policy, credentials, hosted services, and provider-specific evidence shape. Out of scope for `BANDIT-087`. |
| Rollback/revert path | Manual local revert by operator; Bandit does not auto-rollback. | Agent-owned revert/rollback path with PR-shape evidence and post-revert verification. | Operator-owned gate on rollback policy, protected-branch revert, and post-revert evidence shape. Out of scope for `BANDIT-087`. |
| Post-merge verification | Local-record landing is the terminal landing state; no further verification is run by Bandit. | Post-merge verification must re-run `bandit auto-land-check`, `bandit land-check`, CodeRabbit, Local Qwen, supply-chain gate, and risk classification against the merge head, and record results. | Operator-owned gate on post-merge verification policy and reviewer/model routing cost. Out of scope for `BANDIT-087`. |

**Assessment:** every desired PR/CI/CD responsibility beyond what the
local-record Landing Agent already does requires at least one
operator-owned gate on policy, credentials, remote authority, or
hosted-service integration. The local-record contract already provides
merge-readiness evidence (`auto-land-check`, `land-check`), review
freshness (CodeRabbit + Local Qwen), and landing action evidence
(`landing-action.md`). The remaining responsibilities are remote-publication
and branch/PR lifecycle, CI evidence, merge action, deploy/canary,
rollback/revert, and post-merge verification — each of which crosses an
operator-owned boundary that is explicitly halt-listed in
`CURRENT_CONTEXT.md`, `ROADMAP.md`, and the brief.

---

## Benefits vs. Risks Analysis

### Benefits Of Adopting PR/CI/CD Landing Now

1. **Closer to real-world multi-agent workflow.** A PR-based landing
   surface would let multiple Bandit agents (or humans and agents) work
   in parallel on different branches and converge through review and CI
   rather than the current single-branch local-merge pattern.

2. **Stronger evidence trail through PR comments.** PR comments from
   CodeRabbit, Local Qwen, supply-chain gate, risk classification, UAT
   approval, and the Landing Verdict would create an audit trail that
   survives outside the repo.

3. **Deploy/canary gate.** A PR-based landing surface would be a
   natural place to insert a deploy/canary gate for future product
   slices that ship to a hosted environment.

4. **Better reviewer trust signal visibility.** Reviewers and operators
   could see fresh review state on each PR head without re-running
   Bandit locally.

### Risks Of Adopting PR/CI/CD Landing Now

1. **Unstated operator-owned gates.** The current bootstrap posture
   records "no GitHub credential usage is approved, no branch-protection
   change is approved, no CI provider configuration is approved, no
   merge/push/deploy authority is approved" (CURRENT_CONTEXT.md). Any
   PR/CI/CD implementation that crosses these gates without explicit
   operator approval would be out of scope.

2. **Hidden authority via PR metadata.** If PR comments, branch
   metadata, CI status, or deployment status are treated as canonical
   workflow authority, Bandit would have a second source of truth for
   landing, which `.bandit/policy/landing-agent.json` does not allow.

3. **Stale evidence trust.** PR-based review evidence is only as fresh
   as the last push. Without an explicit evidence-freshness contract
   tied to PR head, the Landing Verdict could be issued against stale
   review state.

4. **External-input data-only contract violation.** PR text, review
   comments, CI logs, and deployment logs are external content. If
   they can influence release-authorized agent instructions, tools, or
   routing without data-only quarantine and a trusted-source gate,
   that would violate the input-quarantine rule.

5. **Cost and provider lock-in.** PR/CI/CD landing introduces CI
   provider spend, GitHub API spend, and possibly hosted-service
   spend. None of these have approved provider-pricing evidence or
   spend-class approval today.

6. **Bootstrap-gap queue violation.** Adopting PR/CI/CD landing now
   would jump ahead of the active intake triage queue
   (`WIL-INSTALLED-COPY-UPDATE`, `WIL-V0-TRIAL`) and the still-pending
   `BANDIT-082` migrated follow-ups without a bootstrap gap that
   requires it. The 2026-05-24 ADRs explicitly leave PR/CI/CD
   normalization, deploy/canary policy, and risk-class thresholds as
   "Not Decided" items to be revisited in a future work item.

7. **Local-record replacement risk.** Replacing local-record with a
   PR-based landing would require a new policy artifact and a new
   operator-owned gate on the local-main landing path. Replacing the
   local-record path before that policy exists would create a coverage
   gap for work items that do not need remote publication.

### Assessment At Current State (BANDIT-087)

The benefits of PR/CI/CD landing are forward-looking and depend on
operator-approved remote authority, credentials, branch-protection
rules, CI provider configuration, deploy/canary policy, and cost
approval. The risks of premature implementation are immediate: hidden
authority via PR metadata, stale evidence trust, external-input
contract violation, cost approval gaps, and bootstrap-gap queue
violation. The local-record Landing Agent contract already satisfies
the v0 plan success criteria for the current workflow (Slice 4
Pre-Landing Review Loop, Slice 5 UAT Approval And Auto-Landing
Policy). Deferred is the correct outcome.

---

## Disposition: Deferred With Named Trigger Conditions And Conditional Scope

### Decision

**Deferred.** No PR/CI/CD landing policy, remote publication, GitHub
PR creation, CI orchestration, branch-protection change, credential
provisioning, merge, push, deploy/canary, hosted service, paid
routing, public benchmark publication, or Trust Verifier cutover is
implemented or authorized by this work item.

`.bandit/policy/landing-agent.json` remains the current Landing Agent
source of truth. Local-record is the only supported landing action.
Push, merge, and deploy remain disabled. The 2026-05-24 safe-landing
and auto-land ADRs remain the binding landing contract.

### Named Trigger Conditions For Reconsideration

Reconsider when any of the following is observed and a concrete
PR/CI/CD landing need is documented:

1. **Operator-approved remote authority exists.** The operator has
   explicitly approved GitHub credential usage, branch-protection
   policy, CI provider configuration, and merge/push/deploy authority
   under a separate work item with its own operator-owned gate.

2. **A concrete work item requires PR-based landing.** A work item
   brief or bootstrap-gap chore identifies a missing PR-based landing
   surface that local-record cannot satisfy — for example, a hosted
   deployment slice, a multi-agent parallel branch workflow, or a
   `BANDIT-066`/`BANDIT-067` cockpit surface that needs PR-shape
   evidence for an external consumer.

3. **CI provider is approved and configured.** A CI provider has been
   approved for spend, credentials are provisioned, and a CI provider
   policy artifact is in place.

4. **Deploy/canary policy is approved.** A deploy/canary policy
   artifact exists and is approved, with provider-pricing evidence and
   spend-class approval.

5. **V0 plan exit criteria require PR/CI/CD landing.** A future v0
   exit-criteria review finds that local-record landing cannot
   satisfy the V0 plan exit criteria and that PR/CI/CD landing is
   required.

6. **Cross-repo Bandit deployment is approved.** A concrete
   cross-repo Bandit deployment is approved by the operator, requiring
   self-governing-repository coordination and a shared canonical
   landing surface.

7. **V0 Trial or Phase 8 product slice requires remote landing.** The
   V0 Closeout Claude Code A/B Product-Value Trial or another
   Phase 8 product slice explicitly requires PR-based landing
   evidence that the current local-record path cannot provide.

### Conditional Future Implementation Scope (Not Authorized Here)

If a trigger condition is observed, a future work item may implement
a narrow PR/CI/CD landing slice under the following contract. This is
recorded for reference; no implementation is authorized by this
disposition.

**PR/CI/CD Landing Slice Contract:**

- **Source artifacts:**
  - `.bandit/policy/landing-agent.json` (Landing Agent source of truth;
    will need a new policy artifact for any new supported action).
  - `docs/work/<ID>/landing-action.md` and `landing-verdict.md`
    (local-record landing evidence; reusable as PR-body evidence).
  - `docs/work/<ID>/coderabbit-review.md` and
    `local-qwen-review.md` (review evidence; reusable as PR-comment
    evidence).
  - `.bandit/policy/risk-classifications/<ID>-risk-classification.json`
    (auto-landing eligibility evidence).
  - `.bandit/policy/supply-chain-gates/<ID>-supply-chain-gate.json`
    (supply-chain gate evidence; will need an extension for CI/release
    workflow files, lockfiles, package scripts, fetched prompts, and
    external tool installs).
  - `.bandit/policy/input-quarantine.json` (PR text, review comments,
    CI logs, deployment logs, dependency text, and generated
    instructions must remain data-only input unless a
    trusted-source-gate upgrade is recorded).

- **Policy boundaries (when implemented):**
  - **Remote publication:** `.bandit/policy/landing-agent.json`
    `allow_push: false` must change to `true` only with operator-owned
    approval of GitHub credential usage and branch-protection policy.
  - **Branch strategy:** A new `.bandit/policy/branch-strategy.json`
    artifact is required to define default branch, short-lived
    branch policy, and protected-branch rules.
  - **PR lifecycle:** A new `bandit pr` command family is required to
    create, update, and inspect PRs. PR body must be generated from
    `landing-action.md` and the Stage 4 review evidence; refusal paths
    must require all required evidence before PR creation/update.
  - **PR body/evidence accuracy:** PR body schema must include review
    subject hash, CodeRabbit verdict, Local Qwen verdict,
    supply-chain gate, risk classification, UAT status (when
    applicable), and landing verdict.
  - **CI evidence normalization:** A new
    `.bandit/policy/ci-evidence-normalization.json` artifact is
    required to map CI provider status to Bandit landing evidence,
    with provider-pricing evidence, spend-class approval, and explicit
    freshness rules.
  - **CodeRabbit and Local Qwen freshness:** Same review evidence
    must be re-run against PR head; review-subject hash must be
    re-computed and recorded in PR body.
  - **Merge evidence:** A new `.bandit/policy/merge-evidence.json`
    artifact is required; merge action must record merge SHA, parent
    SHAs, and any merge-queue event.
  - **Deployment/canary evidence when applicable:** A new
    `.bandit/policy/deploy-canary.json` artifact is required; only
    enabled for deployable application repos.
  - **Rollback/revert evidence:** A new
    `.bandit/policy/rollback-evidence.json` artifact is required;
    rollback action must record revert SHA, parent SHA, and
    post-revert verification evidence.
  - **Post-merge verification:** Same landing checks must be re-run
    against merge head and recorded as evidence.

- **Refusal paths:** All new commands must fail closed when canonical
  state is unavailable, when `.bandit/policy/landing-agent.json`
  policy rules are violated, when `.bandit/policy/input-quarantine.json`
  data-only contract is violated, when evidence is stale, when
  required review/supply-chain/risk classification is missing, when
  UAT approval is missing for feature slices, when the operator-owned
  boundary is crossed, or when the new policy artifact is missing.

- **Expected RED tests (for future Test Writer):**
  - The new policy artifacts, commands, and validators must fail
    closed when canonical landing state is unavailable.
  - The new surfaces must never write to
    `docs/work/<ID>/coordination-log.jsonl`, never grant workflow
    authority to PR/CI/branch/deployment/GitHub state, and never
    duplicate `.bandit/policy/landing-agent.json` rules.
  - PR text, review comments, CI logs, deployment logs, dependency
    text, and generated instructions must remain data-only input
    unless a trusted-source-gate upgrade is recorded.
  - Deleting the new surfaces must not break the local-record landing
    path.
  - Merge, push, and deploy behavior must remain disabled at the
    policy level unless the operator-owned gate is satisfied.
  - Provider-pricing evidence and spend-class approval must be
    required for any paid CI provider, paid reviewer route, paid
    model route, hosted service, or public benchmark publication.

- **Review gates:** Normal Stage 2 RED evidence, Stage 3
  implementation, Stage 4 Local Qwen and CodeRabbit review, risk
  classification, supply-chain gate, input-quarantine and
  operator-boundary validation, review-subject hash, Stage 5 landing
  verdict, and local-record landing action — before any new
  supported action is added to `.bandit/policy/landing-agent.json`.

- **Expected files (if implemented in a future work item):**
  - `.bandit/policy/landing-agent.json` (extended with new
    `supported_actions`).
  - `.bandit/policy/branch-strategy.json` (new).
  - `.bandit/policy/ci-evidence-normalization.json` (new).
  - `.bandit/policy/merge-evidence.json` (new).
  - `.bandit/policy/deploy-canary.json` (new).
  - `.bandit/policy/rollback-evidence.json` (new).
  - `bin/bandit.mjs` `pr` command family (new).
  - `docs/work/<ID>/pr-action.md` (new PR evidence artifact).
  - `docs/templates/pr-body.template.md` (new PR body template).
  - Focused RED tests in `test/landing/`,
    `test/landing-agent/`, `test/policy/`,
    `test/input-quarantine/`, `test/operator-boundary/`,
    `test/supply-chain-gate/`, and `test/risk-classification/`.

- **Explicit non-goals:**
  - The new surfaces must never replace `.bandit/policy/landing-agent.json`
    as the Landing Agent source of truth.
  - The new surfaces must never grant workflow, claim, scheduling,
    UAT, landing, or merge/push/deploy authority to PR/CI/branch/
    deployment/GitHub state.
  - The new surfaces must never treat GitHub, CI provider status, PR
    comments, branch metadata, deployment status, cockpit output,
    session-context packets, work-intake entries, roadmap text,
    cache, database, static preview, fixture, generated JSON, or
    report output as canonical workflow authority.
  - The new surfaces must never ingest external PR text, issue text,
    review comments, CI logs, deployment logs, dependency text, or
    generated instructions as agent instructions without a
    trusted-source-gate upgrade.
  - The new surfaces must never run live polling, background writes,
    or shared cross-repo state without separate operator approval.
  - The new surfaces must never be a SQLite store, database, hosted
    service, or public benchmark publication without separate
    operator approval.
  - The new surfaces must never replace or wrap local-record landing
    while local-record remains the only operator-approved supported
    action.

### Operator-Owned Decisions (If Future Implementation Is Sought)

If a future work item proposes PR/CI/CD landing implementation, the
following decisions require explicit operator approval and must not be
guessed:

- Approving a PR/CI/CD landing policy that grants workflow authority.
- Approving GitHub credential usage and branch-protection rules.
- Approving CI provider selection, credentials, workflow files, and
  required-status policy.
- Approving `allow_push`, `allow_merge`, or `allow_deploy` becoming
  `true` in `.bandit/policy/landing-agent.json`.
- Approving a deploy/canary gate with provider-pricing evidence and
  spend-class approval.
- Approving hosted services (CI, code-hosting, deploy, canary,
  rollback, monitoring).
- Approving paid routing or public benchmark publication of any
  PR/CI/CD landing evidence.
- Approving cross-repo Bandit deployment with shared canonical
  landing.
- Approving a Trust Verifier cutover that depends on PR/CI/CD landing
  evidence.
- Approving replacement or wrapping of the local-record landing
  path.

None of these are approved or recommended by this disposition.

---

## Summary

| Dimension | Verdict |
| --- | --- |
| Is a PR/CI/CD landing policy justified now? | No |
| Does local-record landing satisfy current Bandit v0 needs? | Yes |
| Do accepted 2026-05-24 safe-landing and auto-land ADRs cover current needs? | Yes |
| Are trigger conditions named for future reconsideration? | Yes |
| Is implementation authorized by this work item? | No |
| Does `.bandit/policy/landing-agent.json` change? | No |
| Does the local-record supported action change? | No |
| Does `allow_push`, `allow_merge`, or `allow_deploy` change? | No |
| Are GitHub credentials, branch protection, CI provider, or deploy/canary policy approved? | No |
| Is operator approval needed for this deferred disposition? | No |
| What would require operator approval? | Any proposal to approve a PR/CI/CD landing policy, grant it workflow authority, change `.bandit/policy/landing-agent.json` `supported_actions`/`allow_push`/`allow_merge`/`allow_deploy`, approve GitHub credentials, approve branch protection, approve CI provider configuration, approve merge/push/deploy authority, approve deploy/canary behavior, approve hosted services, approve public benchmark publication, approve paid routing, approve cross-repo Bandit deployment, approve a Trust Verifier cutover, or replace/wrap the local-record landing path. |

**Disposition: Deferred.** Land and close this work item. Reconsider when a
named trigger condition is observed and a concrete PR/CI/CD landing need is
documented under a separate work item with its own operator-owned gate.
