# BANDIT-087: Stage 3 Implementation Evidence

## Status

`pass`

## Summary

Stage 3 produced a deferred disposition for `WIL-PR-CICD-LANDING`. No source
code was changed. Three documentation artifacts were created. The disposition
is source-cited, preserves `.bandit/policy/landing-agent.json` and the
local-record landing contract, maps the current local-record behavior
against desired PR/CI/CD landing responsibilities, names trigger conditions
for future reconsideration, records a conditional narrow future-scope
contract, and lists operator-owned decisions that would be required for any
future PR/CI/CD landing implementation.

`BANDIT-087` is a non-product PR and CI/CD landing workflow policy triage
chore, matching the work type and disposition pattern of `BANDIT-084`
(Claim-First Transition Policy Triage), `BANDIT-085` (Repo-Wide Transition
Index Decision), and `BANDIT-086` (Coordination Primitive Completion
Triage).

---

## Acceptance Criteria Mapping

The brief (`docs/work/BANDIT-087/brief.md` § Acceptance Criteria) lists
twelve acceptance criteria. Each is mapped to evidence in
`pr-cicd-landing-policy-disposition.md` and supporting files.

### AC 1: `WIL-PR-CICD-LANDING` is the next authorized intake-derived gap proposal after BANDIT-086 closeout

Evidence in `pr-cicd-landing-policy-disposition.md` § Source Citations →
WIL-PR-CICD-LANDING:

- Cites `.bandit/work-intake-ledger.json` entry with `intake_outcome:
  formed`, `formed_work_item: BANDIT-087`, `claimable: false`, and
  `risk_product_scope_status` referencing no PR creation, CI
  orchestration, merge, push, deploy, credential setup,
  branch-protection change, hosted service, paid routing, public
  benchmark publication, Trust Verifier cutover, or local-record
  replacement.
- Cites `FOLLOWUPS.md` anchor "Move From Local Main Landing To PR And
  CI/CD Workflow" as source metadata.
- BANDIT-086 retrospective (`docs/work/BANDIT-086/retrospective.md`
  § Bootstrap Gaps Remaining) names `WIL-PR-CICD-LANDING` as the next
  authorized gap: "The next recorded action is Repo PM formation for
  the intake-derived `WIL-PR-CICD-LANDING` proposal, PR And CI/CD
  Landing Workflow Policy."
- BANDIT-086 improvement-disposition.md records the same handoff:
  "Repo PM should form the next intake-derived gap work item for
  `WIL-PR-CICD-LANDING`, PR And CI/CD Landing Workflow Policy."
- No open bootstrap gap blocks this work item per
  `CURRENT_CONTEXT.md` and `ROADMAP.md`.

**Verdict: satisfied.**

### AC 2: Current landing policy remains unchanged during triage; local-record is the only supported Landing Agent action

Evidence in `pr-cicd-landing-policy-disposition.md` § Current Local-Record
Landing Policy and § Source-Of-Truth Policy: Unchanged:

- Cites `.bandit/policy/landing-agent.json` directly: `authority:
  "cli_owned_landing_agent"`, `supported_actions: ["local_record"]`,
  `cli_actions: ["local-record"]`, `allow_merge: false`, `allow_push:
  false`, `allow_deploy: false`,
  `operator_owned_boundaries: ["product_uat", "policy_change",
  "business_tradeoff", "cost_override", "risk_override"]`.
- "`.bandit/policy/landing-agent.json` remains the current Landing
  Agent source of truth. Local-record is the only supported landing
  action for this work item. Push, merge, and deploy remain disabled
  at the policy level."
- The disposition does not approve, recommend, or authorize any change
  to this policy.

**Verdict: satisfied.**

### AC 3: Evidence review covers current policy, accepted decisions, V0 plan, recent landing/verdict/action artifacts, CLEAN_CODE, and policy/smell-trigger artifacts

Evidence in `pr-cicd-landing-policy-disposition.md`:

- § Current Local-Record Landing Policy cites
  `.bandit/policy/landing-agent.json`.
- § Accepted Safe-Landing Decisions cites
  `docs/decisions/2026-05-24-agent-owned-safe-landing.md` and
  `docs/decisions/2026-05-24-auto-land-chores-and-uat-approved-slices.md`,
  including their "Not Decided" sections.
- § V0 Plan cites `docs/plans/V0_PLAN.md` Slice 4 (Pre-Landing Review
  Loop), Slice 5 (UAT Approval And Auto-Landing Policy), and V0 exit
  criteria.
- § Recent BANDIT-086 Closeout Evidence cites
  `docs/work/BANDIT-086/landing-action.md` (landing action
  `local_record` at `efe3ff9228...`),
  `docs/work/BANDIT-086/retrospective.md`, and
  `docs/work/BANDIT-086/improvement-disposition.md`.
- § Current Routing Evidence cites `CURRENT_CONTEXT.md`, `ROADMAP.md`,
  `STATUS.md`, `docs/work/BANDIT-087/brief.md`,
  `docs/work/BANDIT-087/orchestration-plan.md`,
  `docs/work/BANDIT-087/red-evidence.md`, and
  `docs/work/BANDIT-087/coordination-log.jsonl`.
- The writer report § Source Evidence Read lists every required read
  including `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`,
  `AGENTS.md`, and the disposition-prescribed source artifacts.

**Verdict: satisfied.**

### AC 4: Landing requires recommendation, follow-up implementation scope, no-action decision, deferred disposition, or operator-owned approval question

Evidence in `pr-cicd-landing-policy-disposition.md`:

- Disposition is "Deferred With Named Trigger Conditions And Conditional
  Scope" (one of the four authorized outcomes per RED evidence and
  brief acceptance criteria).
- § Source Citations names all source evidence used for the
  disposition.
- The conditional future-scope contract explicitly forbids
  implementation or approval of any new PR/CI/CD landing policy,
  remote publication, GitHub credential usage, branch-protection
  change, CI provider configuration, merge/push/deploy, deploy/canary,
  hosted service, paid routing, public benchmark publication, Trust
  Verifier cutover, local-record replacement, local API, State Index,
  scheduler, claim/worktree lifecycle, guarded browser action
  execution, or unrelated Phase 8 work.
- § Operator-Owned Decisions lists ten named operator-owned gates that
  would be required for any future PR/CI/CD landing implementation;
  the disposition does not pre-approve any of them.

**Verdict: satisfied.**

### AC 5: If future implementation is recommended, the recommendation must identify exact policy boundaries for remote publication, branch/PR lifecycle, PR body evidence, CI evidence normalization, CodeRabbit/Qwen review freshness, merge evidence, deployment evidence when applicable, rollback/revert evidence, post-merge verification, refusal paths, expected tests, review gates, expected files, and explicit non-goals

Evidence in `pr-cicd-landing-policy-disposition.md` § Comparison: Current
Local-Record vs. Desired PR/CI/CD Responsibilities and § Conditional
Future Implementation Scope (Not Authorized Here):

- Twelve-row comparison table covering remote publication, branch
  strategy, PR lifecycle, PR body/evidence accuracy, CodeRabbit
  review freshness, Local Qwen review freshness, CI status evidence,
  merge-readiness evidence, merge action evidence, deploy/canary
  evidence, rollback/revert path, and post-merge verification.
- Policy boundaries: remote publication
  (`allow_push: false` → `true` only with operator-owned approval),
  branch strategy (new `.bandit/policy/branch-strategy.json`),
  PR lifecycle (new `bandit pr` command family with refusal paths),
  PR body/evidence accuracy (PR body schema requirements), CI
  evidence normalization (new
  `.bandit/policy/ci-evidence-normalization.json` with provider-pricing
  evidence and spend-class approval), CodeRabbit/Local Qwen
  freshness (re-run against PR head; review-subject hash), merge
  evidence (new `.bandit/policy/merge-evidence.json` with merge SHA,
  parent SHAs, and merge-queue events), deployment/canary evidence
  (new `.bandit/policy/deploy-canary.json` only for deployable
  application repos), rollback/revert evidence (new
  `.bandit/policy/rollback-evidence.json` with revert SHA, parent
  SHA, and post-revert verification), and post-merge verification
  (re-run landing checks against merge head).
- Refusal paths: explicit fail-closed behavior when canonical state
  is unavailable, policy rules are violated, data-only contract is
  violated, evidence is stale, required review/supply-chain/risk
  classification is missing, UAT approval is missing for feature
  slices, operator-owned boundary is crossed, or new policy artifact
  is missing.
- Expected RED tests: 6 named test behaviors covering fail-closed
  canonical-state behavior, no canonical landing-log writes, no
  workflow authority to PR/CI/branch/deployment/GitHub state,
  data-only external input handling, deletable new surfaces, and
  paid-routing/provider-pricing approval requirements.
- Review gates: full Stage 2–5 sequence before any new supported
  action is added to `.bandit/policy/landing-agent.json`.
- Expected files: 10 named artifacts (new policy files, command
  family, evidence artifact, PR body template, and focused RED
  test directories).
- Explicit non-goals: 8 named non-goals including no replacement of
  `.bandit/policy/landing-agent.json`, no PR/CI/branch/deployment
  authority, no GitHub/CI/branch/deployment as canonical workflow
  authority, no external-input-as-instructions, no live polling or
  background writes, no SQLite/database/hosted service without
  operator approval, and no replacement or wrapping of local-record
  landing.

**Verdict: satisfied.**

### AC 6: If future implementation is not justified, the work item must record why local-record landing remains sufficient and which trigger conditions would reopen PR/CI/CD landing work

Evidence in `pr-cicd-landing-policy-disposition.md`:

- § Comparison: Current Local-Record vs. Desired PR/CI/CD
  Responsibilities states that local-record already provides
  merge-readiness evidence (`auto-land-check`, `land-check`),
  review freshness (CodeRabbit + Local Qwen), and landing action
  evidence (`landing-action.md`).
- § Benefits vs. Risks Analysis § Assessment At Current State
  (BANDIT-087) concludes: "The benefits of PR/CI/CD landing are
  forward-looking and depend on operator-approved remote authority,
  credentials, branch-protection rules, CI provider configuration,
  deploy/canary policy, and cost approval. The risks of premature
  implementation are immediate: hidden authority via PR metadata,
  stale evidence trust, external-input contract violation, cost
  approval gaps, and bootstrap-gap queue violation. The local-record
  Landing Agent contract already satisfies the v0 plan success
  criteria for the current workflow (Slice 4 Pre-Landing Review
  Loop, Slice 5 UAT Approval And Auto-Landing Policy). Deferred is
  the correct outcome."
- § Named Trigger Conditions For Reconsideration lists 7 concrete
  trigger conditions (operator-approved remote authority, concrete
  work item requires PR-based landing, CI provider is approved and
  configured, deploy/canary policy is approved, V0 plan exit criteria
  require PR/CI/CD landing, cross-repo Bandit deployment is
  approved, V0 Trial or Phase 8 product slice requires remote
  landing).

**Verdict: satisfied.**

### AC 7: If operator-owned policy, credential, GitHub remote, branch protection, CI provider, deploy, cost/risk, hosted service, public benchmark, merge/push/deploy, paid routing, Trust Verifier, product, UAT, business, or ambiguous scope approval is needed, the work item must halt at that operator-owned gate and state the exact decision needed

Evidence in `pr-cicd-landing-policy-disposition.md` § Operator-Owned
Decisions (If Future Implementation Is Sought):

- Ten named operator-owned decisions listed: approving a PR/CI/CD
  landing policy with workflow authority; approving GitHub
  credential usage and branch-protection rules; approving CI
  provider selection, credentials, workflow files, and
  required-status policy; approving `allow_push`, `allow_merge`, or
  `allow_deploy` becoming `true`; approving a deploy/canary gate
  with provider-pricing evidence and spend-class approval;
  approving hosted services; approving paid routing or public
  benchmark publication; approving cross-repo Bandit deployment;
  approving a Trust Verifier cutover; approving replacement or
  wrapping of the local-record landing path.
- The disposition does not pre-approve any of them.
- The Stage 3 delivery required no operator-owned input during Stage
  3 and made no operator-owned decision.

**Verdict: satisfied.**

### AC 8: No Stage 1 or Stage 3 artifact approves or implements PR creation, CI orchestration, merge, push, deploy, branch-protection changes, credential handling, hosted services, public benchmark publication, paid routing, or Trust Verifier cutover

Evidence from writer report forbidden-surface confirmation:

- No source code, no PR/CI/CD policy, no remote publication, no
  GitHub credential usage, no branch-protection change, no CI
  provider configuration, no merge, no push, no deploy, no
  deploy/canary automation, no hosted service, no paid routing, no
  public benchmark publication, no Trust Verifier cutover, no
  local-record replacement, no local API, no State Index, no
  scheduler, no claim/worktree lifecycle, no guarded browser
  action execution, no unrelated Phase 8 product work.
- No intake ledger, routing files, or canonical policy file
  modifications.
- `.bandit/policy/landing-agent.json` is referenced as a binding
  contract but not modified.

**Verdict: satisfied.**

### AC 9: The work item preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation for any later RED/implementation stages

Evidence:

- Stage 3 writer report § Test-Surface Authority Status: zero test,
  fixture, RED evidence, acceptance mapping, formation, review,
  landing, UAT, or retrospective file was touched.
- Stage 3 writer report § Bootstrap Model-Family Separation
  Compliance: Codex authored Stage 2 evidence (Codex family);
  Claude was attempted first (Claude family) and exited with a
  session-limit rejection; MiniMax-M3 executed Stage 3 (MiniMax
  family) after Claude rejection. The Stage 3 implementation was
  not authored by the Codex model family that authored the Stage 2
  RED evidence, and the Bootstrap Model-Family Separation
  requirement is satisfied.
- The Claude rejection event is recorded as honest bootstrap
  replacement evidence, not a contaminated Stage 3 implementation
  attempt. No Stage 3 source edits, partial implementation, or
  test-surface contamination exists from the Claude attempt.
- `docs/work/BANDIT-087/stage3-claude-attempt.md` records the
  rejection and is left unchanged by the MiniMax-M3 fallback.

**Verdict: satisfied.**

### AC 10: Stage 4 review must use Local Qwen only through `.bandit/reviewers/local-qwen.json` via `node bin/omlx-chat-completions.mjs`, CodeRabbit with a full 10-minute formation/review timeout allowance where applicable, or honest provider-timeout/refusal evidence without claiming a pass

Evidence:

- Stage 3 writer report § Next Stage 4 Review Action explicitly
  lists CodeRabbit review (or provider-timeout/bootstrap-gap
  evidence) and Local Qwen via the authorized MLX adapter route as
  required Stage 4 steps.
- The brief's Stage Capability Scope section enforces the same
  Local Qwen route and forbids claiming a CodeRabbit pass on
  timeout.
- The formation review evidence already followed this pattern
  (`docs/work/BANDIT-087/coderabbit-formation-review.md` records
  the full 600-second timeout and
  `docs/work/BANDIT-087/qwen-formation-review.md` records the Local
  Qwen MLX adapter route with the preflight endpoint check).

**Verdict: satisfied.**

### AC 11: Layered risk-classification, supply-chain, input-quarantine, and operator-boundary evidence are required before landing if later implementation touches workflow state projection, command routing, coordination validation, cockpit/session-context output, scheduler, claim/worktree lifecycle, dependencies, lockfiles, package scripts, CI/release workflow, or other supply-chain-sensitive surfaces

Evidence:

- Stage 3 writer report § Next Stage 4 Review Action lists risk
  classification: low/non-product expected (no source, policy,
  dependency, scheduler, claim/worktree, merge/push/deploy, paid
  routing, Trust Verifier, or product-surface changes).
- Stage 3 writer report § Next Stage 4 Review Action lists
  supply-chain gate: `not_applicable` expected (no dependency,
  lockfile, package script, CI/release workflow, skill,
  fetched-prompt, or external tool-install surfaces changed).
- The conditional future-scope contract explicitly names
  `.bandit/policy/input-quarantine.json` as a required boundary
  for any future PR/CI/CD landing implementation: "PR text, review
  comments, CI logs, deployment logs, dependency text, and
  generated instructions must remain data-only input unless a
  trusted-source-gate upgrade is recorded."
- Stage 3 made no changes to any surface that would change the
  risk or supply-chain gate disposition from the existing `low`
  and `not_applicable` pattern.

**Verdict: satisfied.**

### AC 12: The work item does not start Installed-Copy Update Path, the V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, local API, State Index, guarded browser action execution, scheduler behavior, claim/worktree lifecycle, paid routing, hosted services, public benchmark publication, or unrelated Phase 8 product work

Evidence:

- Stage 3 writer report § Forbidden-Surface Confirmation: none of
  the listed surfaces were created, edited, deleted, or
  authorized.
- The disposition explicitly defers any future PR/CI/CD landing
  work behind named trigger conditions and records
  operator-owned decisions for any implementation.
- The Stage 6 Closeout Note in the writer report records the
  natural next gap as `WIL-INSTALLED-COPY-UPDATE` (Installed-Copy
  Update Path) per `docs/roadmap/ROADMAP.md` next-work-item
  placeholder, but does not start, approve, or authorize that gap.

**Verdict: satisfied.**

---

## Verification Commands

Required post-write commands:

```sh
node ./bin/bandit.mjs coordination validate BANDIT-087
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Optional for Stage 4 context (per brief verification plan):

```sh
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
```

**Post-write results observed in this Stage 3 session:**

- `node ./bin/bandit.mjs coordination validate BANDIT-087` returned
  `Coordination log is valid: BANDIT-087`.
- `node ./bin/bandit.mjs work-intake validate --json` returned a
  JSON payload with the work intake ledger entries; the output
  begins with the `WIL-UI-POLISH` entry and includes
  `WIL-PR-CICD-LANDING` with `intake_outcome: "formed"`,
  `formed_work_item: "BANDIT-087"`, `claimable: false`.
- `npm run bandit -- validate` reported `Bandit state is valid.`
- `git diff --check` returned no whitespace errors (exit 0).
- `node ./bin/bandit.mjs cockpit status --json` and
  `node ./bin/bandit.mjs session-context current --json` were
  not run in this session; they remain required Stage 4 context
  checks before aggregate review and landing decisions.
- `npm run typecheck` and `npm test` are not required: Stage 3
  made no source code changes.
- `land-check` is not run in Stage 3, per dispatch packet.

---

## Clean-Code Posture

| CLEAN_CODE.md rubric item | Assessment |
| --- | --- |
| Spec alignment | Deferred disposition implements the approved scope: source-cited triage of `WIL-PR-CICD-LANDING`; no implementation; decision-only |
| Small surface area | Three files only; no source changes; no unrelated refactors |
| Simple design | Deferred disposition with named conditions; no structural complexity |
| Explicit state | Decision, rationale, comparison table, trigger conditions, operator-owned gates, and conditional contract all named |
| No hidden authority | Disposition explicitly names operator halt conditions and non-authoritative projection boundaries; cites `.bandit/policy/landing-agent.json` as binding contract |
| Testable behavior | RED evidence verification plan satisfied by disposition content; no source behavior changed |
| Readable flow | Source citations, comparison table, benefits/risks analysis, disposition, and conditional scope in separate sections |
| Locality | All artifacts in `docs/work/BANDIT-087/` only; no unrelated content |
| Failure clarity | Disposition names fail-closed behavior for any future PR/CI/CD landing surface and halts on operator-owned decisions |
| No role erosion | Test Writer-owned surfaces untouched; stage boundaries preserved |
| Improvement capture | Deferred disposition with trigger conditions is the durable artifact; no lesson is left without a record |

No clean-code blockers identified.

---

## Role Boundaries

| Role | Actions performed in Stage 3 |
| --- | --- |
| Stage 2 Test Writer (Codex) | Authored `red-evidence.md` and acceptance mapping. No edits by Stage 3 Writer. |
| Stage 3 Implementation Writer (MiniMax-M3 fallback after Claude session-limit failure) | Created three allowed Stage 3 files; read required source evidence; no test-surface edits; no source code changes; no policy mutations; no canonical coordination log mutations; no intake ledger, routing file, or policy contract mutations. |
| Reviewers | Own Stage 4 evidence (not yet created). |
| Landing Agent | Owns Stage 5 verdict and action (not yet created). |
| Closeout Agent | Owns Stage 6 retrospective and improvement/no-action disposition evidence (not yet created). |
| Operator | Owns any future decision to approve a PR/CI/CD landing policy, grant it workflow authority, change `.bandit/policy/landing-agent.json`, approve GitHub credentials, approve branch protection, approve CI provider configuration, approve merge/push/deploy, approve deploy/canary behavior, approve hosted services, approve public benchmark publication, approve paid routing, approve cross-repo Bandit deployment, approve a Trust Verifier cutover, or replace/wrap the local-record landing path. No operator-owned input was required for Stage 3. |

---

## Source and Delivery Paths

| Role | Path |
| --- | --- |
| Source evidence | `AGENTS.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `docs/work/BANDIT-087/brief.md`, `docs/work/BANDIT-087/orchestration-plan.md`, `docs/work/BANDIT-087/red-evidence.md`, `docs/work/BANDIT-087/coordination-log.jsonl`, `docs/work/BANDIT-087/stage3-minimax-dispatch.md`, `docs/work/BANDIT-087/stage3-claude-attempt.md`, `docs/work/BANDIT-087/formation-review.md`, `docs/work/BANDIT-087/qwen-formation-review.md`, `docs/work/BANDIT-087/coderabbit-formation-review.md`, `FOLLOWUPS.md`, `.bandit/work-intake-ledger.json`, `.bandit/policy/landing-agent.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `docs/decisions/2026-05-24-agent-owned-safe-landing.md`, `docs/decisions/2026-05-24-auto-land-chores-and-uat-approved-slices.md`, `docs/plans/V0_PLAN.md`, `docs/work/BANDIT-086/landing-action.md`, `docs/work/BANDIT-086/retrospective.md`, `docs/work/BANDIT-086/improvement-disposition.md`, `docs/work/BANDIT-086/coordination-primitive-completion-disposition.md`, `docs/work/BANDIT-086/writer-report.md`, `docs/work/BANDIT-086/implementation-evidence.md`, `docs/work/BANDIT-086/stage3-pm-review.md`, `docs/work/BANDIT-085/repo-wide-transition-index-disposition.md`, `docs/work/BANDIT-085/writer-report.md`, `docs/work/BANDIT-085/implementation-evidence.md`, `docs/work/BANDIT-084/claim-first-transition-disposition.md`, `docs/work/BANDIT-084/writer-report.md`, `docs/work/BANDIT-084/implementation-evidence.md` |
| Stage 3 delivery | `docs/work/BANDIT-087/pr-cicd-landing-policy-disposition.md`, `docs/work/BANDIT-087/writer-report.md`, `docs/work/BANDIT-087/implementation-evidence.md` |

---

## Next Action

PM acceptance and Stage 4 review.

Codex PM should:

1. Confirm the post-write verification commands results in §
   Verification Commands above.
2. If verification passes, commit the three Stage 3 artifacts and
   proceed to Stage 4 review.
3. Dispatch CodeRabbit review or record provider-timeout/bootstrap-gap
   evidence after the full 10-minute window.
4. Run Local Qwen via `.bandit/reviewers/local-qwen.json` through
   `node bin/omlx-chat-completions.mjs`.
5. Record risk classification:
   `.bandit/policy/risk-classifications/BANDIT-087-risk-classification.json`
   (low/non-product expected).
6. Record supply-chain gate:
   `.bandit/policy/supply-chain-gates/BANDIT-087-supply-chain-gate.json`
   (not-applicable expected; no dependency, lockfile, package script,
   CI/release workflow, skill, fetched-prompt, or external tool-install
   surfaces changed).
7. Run `node ./bin/bandit.mjs review-subject-hash BANDIT-087` after
   Stage 4 evidence commit.
8. Write `docs/work/BANDIT-087/review-evidence.md` with aggregate
   verdict and every finding dispositioned.
9. Proceed to Stage 5 landing only after aggregate Stage 4 review
   passes.

Do not land, close out, or begin another work item before CodeRabbit,
Local Qwen, aggregate review evidence, risk-classification evidence,
supply-chain evidence, landing verdict, landing action, retrospective,
and improvement/no-action disposition are recorded.
