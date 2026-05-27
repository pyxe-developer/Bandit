# Stage Rubrics

## Purpose

Bandit verification is stage-based. Each stage has a rubric that Codex PM, specialized verifiers, and CodeRabbit can use to decide whether work may proceed.

The goal is not to create ceremony. The goal is to make verification repeatable enough that agents can enforce it.

## Verdict Values

Use these verdicts consistently:

- `pass`: stage satisfies the rubric.
- `blocker`: stage cannot proceed or land until fixed.
- `non_blocking`: real issue, but safe to proceed with a tagged follow-up or improvement chore.
- `not_applicable`: stage does not apply and the reason is recorded.
- `bootstrap_gap`: final Bandit gate does not exist yet; replacement evidence is recorded honestly.

## Stage 0: Context Readiness

**Objective:** Anyone can answer where the project is and what is next.

**Required evidence:**

- `docs/roadmap/CURRENT_CONTEXT.md` names current phase, active work, next action, blockers, and bootstrap gaps.
- `docs/roadmap/ROADMAP.md` maps the work to a phase.
- The next step is narrow enough to execute.
- If a prior slice just completed, `docs/work/<ID>/landing-action.md` or equivalent PR merge evidence exists before the next slice is active.

**Blockers:**

- Current phase or next action is unclear.
- Active work item cannot be identified.
- Context must be reconstructed from chat.
- Implementation starts before context is repaired.
- A new slice is active while the previous slice has only a safe-to-land verdict and no commit, merge, or landing-action evidence.

**Verifier focus:**

- Check whether the repo itself answers "what is next?"
- Reject stale current-context files when the change clearly moved the project forward.
- Confirm the previous slice actually landed before accepting a new active slice.

**CodeRabbit focus:**

- On roadmap/current-context changes, request changes if status and next action conflict.
- Request changes if implementation files change but no current context or work-item evidence identifies the active work.

## Stage 1: Work-Item Brief And Spec

**Objective:** The work has an explicit contract before implementation starts.

**Required evidence:**

- Goal.
- Scope.
- Out of scope.
- Acceptance criteria.
- Test plan.
- `CLEAN_CODE.md` read evidence.
- Bootstrap gaps.
- Expected files.
- Implementation order.
- Stage capability scope: authority role, required skills, allowed tools,
  inputs, outputs, evidence, forbidden actions, and any soft budget band or
  token-cost failsafe needed for paid, high-token, reviewer, or long-running
  execution.
- Codex-owned technical decisions: routine technical routing, implementation
  mechanics, agent/tool selection, skill scoping, review depth, test strategy,
  artifact structure, and Git plumbing decisions are answered by Codex PM unless
  an operator-owned gate is crossed.
- Skill lifecycle contracts for any required load-bearing skills: owner,
  version, changelog, intended stages, required tools, forbidden actions,
  evaluation packets, and rollback criteria.
- Source-of-truth and projection boundary for any workflow state, registry,
  index, cockpit, cache, or current-state view.
- Claim authority backend boundary for release-authorized writable claim work:
  Git refs namespace, `git update-ref --stdin` transaction/CAS semantics,
  `.bandit` projection boundary, fencing-token behavior, idempotency-key
  behavior, Work-Surface Wait-For Graph cycle detection, and reconciliation
  with append-only coordination history.
- Claim Safety Invariants and deterministic fault-injecting or property-style
  simulation plan for release-authorized claim, release, reconcile, worktree
  lock, and claim-gated side-effect correctness.
- Git Mutation Serializer boundary for release-authorized parallel worktrees:
  shared `.git` mutation allow-list, CLI-owned single-writer guard, contention
  behavior, timeout/stale-lock handling, bypass refusal, and separation from
  claim authority.
- Claim-owned worktree lock boundary: immediate `git worktree lock` after
  creation, stable claim-specific reason with claim ID, Work Item ID, and
  stage, no fencing token in the reason, lock-failure cleanup, and Repo PM
  Coordinator-only unlock after handoff verification.
- Worktree Bootstrap Contract boundary for Bandit-created worktrees: allowed
  copied or linked files, setup commands, validation command, environment
  references, secret-handling boundary, expected runtime dependencies, failure
  evidence, and worker-execution refusal until bootstrap validation passes.
- Operator-blocking fail-closed boundary: product, UAT, policy, business, cost,
  irreversible-risk, and genuinely ambiguous scope decisions are operator-owned;
  derivable operational drift has a CLI-owned mechanical repair path.
- Untrusted-input boundary for release-authorized paths: input source
  classification, data-only handling for external or third-party content, input
  quarantine boundary, and trusted-source gate for any instruction-bearing use.
- Layered risk classification for review-depth, operator-supervision, and
  auto-landing decisions: hard exclusions, never-auto-landable surfaces,
  blast-radius signals, static-analysis signals, source trust and input
  quarantine state, supply-chain state, smell-trigger inputs, selected review
  depth, and auto-landing eligibility.
- Evidence SLO and trust-signal boundary for any cockpit, gate, review,
  landing, UAT, retrospective, or projection status exposed as trusted.
- Replay-only benchmark boundary for any Agent Evaluation Harness work,
  including fixed packets and an explicit no-live-routing/no-automatic-policy
  rule.
- Benchmark anti-overfit boundary for any Agent Evaluation Harness work:
  visible calibration packets, versioned locked holdout packets, and holdout
  evidence for policy promotion.
- Paid reviewer promotion threshold for recurring paid reviewer routing:
  locked-holdout blocker-recall improvement over Qwen, false-positive ceiling,
  Provider Pricing Evidence-backed expected-cost ceiling, spend-class approval,
  and the risk class or stage capability profile the threshold applies to.
- Provider-pricing evidence for paid reviewer, paid model, or paid/high-token
  recurring routes: provider, model or profile, pricing source, captured date,
  effective date, freshness or expiry rule, expected per-run cost, spend class,
  and approval owner.
- Benchmark/evaluation spend boundary for one-off paid reviewer or paid model
  calls before policy promotion: current provider-pricing evidence, per-run
  approval or active spend-class approval, expected per-run cost, and explicit
  non-recurring routing disposition.
- Workflow Trial policy-change guardrails for improvement work: predeclared
  decision criteria, metric, baseline, uncertainty or minimum-detectable-effect
  context, evaluation window, re-evaluation window, proxy-risk notes, and
  keep/revise/revert/double-down decision vocabulary.
- Reviewer benchmark scoring contract for reviewer eval work: gold-labeled
  reviewer packets, seeded blockers, seeded non-issues, blocker-recall priority,
  actionable precision, useful finding yield, false-positive rate, tool
  friction, latency, and cost.
- Reviewer benchmark packet-source contract: repo-derived and failure-mode
  stratified before generic coding benchmark tasks can satisfy first-harness
  acceptance.
- Relevant smell triggers and escalation plan.

**Blockers:**

- Acceptance criteria are vague or not verifiable.
- Scope allows unrelated refactors.
- `CLEAN_CODE.md` was not read.
- Missing gates are not recorded as bootstrap gaps.
- Claimable stages do not declare scoped skills, tools, or required
  abnormal-run budget failsafes.
- A required load-bearing skill has no lifecycle contract, version, evaluation
  packets, or rollback criteria.
- Stateful work lets a projection, registry, index, cockpit state, or
  current-state view become independent workflow authority.
- Release-authorized writable claim work uses `.bandit` files, filesystem locks,
  worktree markers, or check-then-write logic as claim authority instead of the
  Git refs claim authority backend.
- Claim authority work omits `refs/bandit/*`, `git update-ref --stdin`
  transaction semantics, `.bandit` projection boundaries, or fencing-token
  behavior.
- Claim, release, reconcile, worktree-lock, or claim-gated side-effect
  correctness is proven only by hand-picked examples instead of declared Claim
  Safety Invariants plus deterministic fault-injecting or property-style
  simulation.
- State-changing claim operations or claim-gated external side effects omit
  idempotency keys, same-key replay behavior, same-key mismatch refusal, or
  duplicate-side-effect prevention.
- Work-surface reservation logic only checks pairwise overlap and omits
  wait-for graph cycle detection, deadlock refusal, or cycle-path diagnostics.
- Release-authorized parallel worktree or repository lifecycle paths mutate
  shared `.git` plumbing without the Git Mutation Serializer.
- Claim-owned worktree creation omits immediate `git worktree lock`, uses an
  unstable or non-claim-specific lock reason, includes a renewing fencing token
  in the lock reason, or allows worker-owned unlock.
- A Bandit-created worktree is treated as runnable without a Worktree Bootstrap
  Contract, or worker execution starts before bootstrap validation passes.
- Worktree bootstrap copies secret material by default or without an existing
  operator-supervised policy authorization.
- Ordinary operational drift, missing derivable metadata, malformed supported
  artifacts, projection mismatch, or bookkeeping drift is routed to the operator
  instead of Codex PM or CLI-owned mechanical repair.
- A mechanical repair path can invent product scope, grant approvals, override
  policy, resolve ambiguous cost/risk, or force-resolve unsafe claim recovery.
- External contributor text, issue or PR metadata, review comments, dependency
  documentation, fetched third-party content, generated instructions, or fetched
  prompts can affect release-authorized agent instructions, tools, routing, or
  landing authority without data-only quarantine and a trusted-source gate.
- Review depth, operator supervision, or auto-landing eligibility is decided
  from smell triggers alone.
- A never-auto-landable surface is marked auto-landable.
- A high-risk blast-radius, static-analysis, source-trust, input-quarantine, or
  supply-chain signal is ignored because the smell list does not match.
- Trusted status is exposed without artifact-specific Evidence SLO, source
  artifact, owner, freshness state, or staleness reason.
- Agent Evaluation Harness work can affect live work, reviewer routing, model
  routing, skill policy, or cost policy without a separate Codex PM decision
  and required operator-supervised approval.
- Agent Evaluation Harness work promotes reviewer routing, model routing, skill
  policy, or cost policy from visible calibration results without versioned
  locked holdout evidence.
- Recurring paid reviewer routing is promoted without a predeclared threshold,
  holdout blocker-recall improvement over Qwen, false-positive ceiling,
  Provider Pricing Evidence-backed expected-cost ceiling, spend-class approval,
  or explicit risk class/stage capability profile scope.
- Paid reviewer, paid model, or paid/high-token recurring execution relies on
  stale, missing, unversioned, or expired provider-pricing evidence, or lacks
  spend-class approval tied to current expected per-run cost.
- A one-off paid reviewer or paid model call before policy promotion lacks
  benchmark/evaluation spend classification, per-run approval or active
  spend-class approval, or is treated as recurring routing policy before the
  scoped promotion threshold is satisfied.
- Improvement work can change workflow policy without predeclared decision
  criteria, uncertainty or minimum-detectable-effect context, a re-evaluation
  window, or proxy-risk disposition.
- Reviewer benchmark work uses raw finding count as the primary score or lacks
  gold labels, seeded blockers, seeded non-issues, blocker recall, precision,
  false-positive, latency, or cost metrics.
- First-harness reviewer benchmark packets are generic coding tasks rather than
  repo-derived packets stratified by Bandit workflow failure mode.
- A new agent role is introduced only to express capability, model tier, skill,
  reviewer depth, or prompt behavior rather than governed authority.
- The brief asks the operator to make technical routing, implementation
  mechanics, skill/tool scoping, test-strategy, artifact-structure, review-depth,
  or Git-plumbing decisions Codex PM should own.

**Verifier focus:**

- Check if the spec is specific enough to drive TDD.
- Check if clean-code and rubric compliance can be evaluated from the brief.
- Check if each claimable stage has the right scoped skills and tools without
  expanding the role taxonomy.
- Check if required load-bearing skills are versioned and covered by lifecycle
  contracts before they are bound to the stage.
- Check that any budget limits are generous abnormal-run failsafes rather than
  brittle caps likely to force duplicate attempts.
- Check that append-only history, canonical artifacts, claim authority, and
  projections are separated before implementation starts.
- Check that claim authority work treats Git refs as the writable claim
  authority and `.bandit` claim files as projections.
- Check that claim authority work requires idempotency keys for state-changing
  claim operations and claim-gated external side effects.
- Check that claim authority work declares Claim Safety Invariants and validates
  them through fault-injecting or property-style simulation that covers races,
  retries, pauses, stale expected state, stale fencing tokens, idempotency
  replay and conflict, projection/history disagreement, wait-for cycles, and
  serializer or worktree-lock failures where applicable.
- Check that work-surface reservation work detects wait-for graph cycles, not
  only pairwise overlap.
- Check that shared `.git` worktree or repository plumbing mutations go through
  a Git Mutation Serializer without replacing claim CAS authority.
- Check that claim-owned worktrees are locked immediately with stable
  claim-specific reasons and unlocked only by Repo PM Coordinator cleanup after
  handoff verification.
- Check that Bandit-created worktrees require Worktree Bootstrap Contract
  validation before worker execution and preserve secret-handling boundaries.
- Check that fail-closed destinations are explicit: operator for operator-owned
  gates, Codex PM or CLI-owned mechanical repair for derivable operational
  drift.
- Check that untrusted text is admitted as quoted data only and cannot become
  agent instruction without a trusted-source gate.
- Check that smell triggers are only one input to review-depth and
  auto-landing decisions.
- Check that hard never-auto-landable exclusions and high-risk signals can
  independently block auto-landing or require operator supervision.
- Check that generic confidence badges are replaced by Evidence Trust Signals
  with artifact-specific freshness rules.
- Check that agent evaluation work is benchmark-only replay unless a separate
  policy change explicitly authorizes live routing.
- Check that policy promotion uses locked holdout evidence rather than visible
  calibration packets alone.
- Check that any recurring paid reviewer route has threshold evidence and
  current provider-pricing evidence plus spend-class approval before becoming
  automatic policy for its specific risk class or stage capability profile.
- Check that paid execution pricing evidence has a source, effective date,
  freshness or expiry rule, expected per-run cost, spend class, and approval
  owner.
- Check that one-off paid reviewer calls used to gather benchmark evidence are
  approved evaluation spend, not stealth recurring routing.
- Check that Workflow Trial outcomes are not post-hoc policy claims: decision
  criteria are predeclared, uncertainty/MDE context is explicit, and
  re-evaluation is scheduled before policy changes persist.
- Check that reviewer benchmark packets can distinguish missed blockers from
  useful findings and false positives.
- Check that reviewer benchmark packets cover Bandit's actual failure modes
  before broader generic code-review tasks are used.

**CodeRabbit focus:**

- On `docs/work/**/brief.md`, request changes if acceptance criteria are unverifiable or bootstrap gaps are missing.
- Request changes if the brief omits clean-code read evidence.

## Stage 2: Test Design And RED Evidence

**Objective:** Tests express the spec before production implementation.

**Required evidence:**

- Tests or explicit bootstrap verification plan.
- RED evidence where feasible.
- Mapping from tests to acceptance criteria.
- Clear distinction between Test Writer-owned tests and Writer-editable tests.

**Blockers:**

- Production implementation starts without tests or a recorded reason.
- Tests assert implementation details instead of behavior.
- Tests weaken or redefine the spec.
- Test ownership is unclear.

**Verifier focus:**

- Confirm tests would fail against missing behavior.
- Confirm tests cover important refusal paths and state transitions.

**CodeRabbit focus:**

- On tests, request changes if assertions are vague, brittle, or disconnected from acceptance criteria.
- Request changes if production code changes alter Test Writer-owned assertions without an explicit Test Change Request or equivalent approval.

## Stage 3: Implementation Clean-Code Rubric

**Objective:** Implementation satisfies the spec with a small, understandable, maintainable diff.

**Required evidence:**

- Passing focused tests.
- Code path mapped to acceptance criteria.
- No unexplained source-of-truth changes.
- Clean-code self-check against `CLEAN_CODE.md`.

**Blockers:**

- Code redefines the spec.
- Hidden state authority moves into UI, cache, helper, or generated file.
- Large multi-responsibility functions or mixed orchestration phases.
- Flag arguments or generic callbacks that hide distinct behavior.
- Parser/writer mismatch.
- Weak refusal or fail-open behavior.
- Unrelated refactors.
- Important behavior lacks tests or bootstrap gap evidence.

**Verifier focus:**

- Apply `CLEAN_CODE.md`.
- Check source-of-truth boundaries.
- Check state transitions and refusal paths.
- Check whether a future agent can safely change the code.

**CodeRabbit focus:**

- Request changes for clean-code blockers.
- Request changes for hidden side effects, stale evidence logic, schema drift, unsafe path handling, weak validation, or oversized orchestration.

## Stage 4: Review And Cross-Model Gates

**Objective:** Independent review gates run before landing.

**Required evidence:**

- CodeRabbit state and disposition.
- Local Qwen adversarial review state.
- Escalated reviewer evidence when smell triggers require it.
- Evidence SLO state for tests, CodeRabbit, Local Qwen, escalated review, and
  any derived aggregate review evidence.
- Supply-chain gate state when the work touches dependency, lockfile,
  package-manager script, CI/release workflow, agent-skill, fetched-prompt, or
  external tool-install surfaces.
- Layered risk-classification state for review depth and auto-landing
  eligibility, including any never-auto-landable, blast-radius,
  static-analysis, source-trust, input-quarantine, supply-chain, or smell
  trigger signals.
- PM disposition of accepted/rejected/waived findings.
- Cross-model tension entries for substantive disagreements.

**Blockers:**

- Required review unavailable without bootstrap gap.
- CodeRabbit request-changes or unresolved actionable findings.
- Qwen result failed, inconclusive, stale, or unavailable without escalation or
  recorded bootstrap gap.
- Required review evidence lacks artifact-specific freshness state or staleness
  reason.
- Supply-chain-sensitive changes lack gate evidence or recorded bootstrap gap.
- Review evidence treats passing reviewers as sufficient to override a
  never-auto-landable or high-risk layered risk-classification signal.
- PM accepts a reviewer disagreement without rationale.
- Review evidence is stale after source changes.

**Verifier focus:**

- Confirm review evidence applies to current source under its Evidence SLO.
- Confirm rejected findings have concrete rationale.
- Confirm tension is logged when models disagree materially.

**CodeRabbit focus:**

- Request changes if PR evidence claims CodeRabbit is clean while actionable comments remain unresolved.
- Request changes if stale review is treated as current.
- Request changes if cross-model tension is ignored.

## Stage 5: Landing And UAT

**Objective:** Landing is evidence-driven and agent-owned under policy.

**Required evidence:**

- Landing Verdict.
- Landing action evidence in `docs/work/<ID>/landing-action.md` or equivalent PR merge artifact, including commit SHA, merge SHA, or recorded blocked/needs-repair state.
- Tests/CI current at landing head.
- Required review gates current at landing head.
- UAT approval for feature slices.
- Stale UAT/source-drift check.
- Evidence SLO state for landing verdict, UAT when applicable, review evidence,
  tests, and source-drift checks.
- Bootstrap gaps, if any.

**Blockers:**

- Feature slice lacks Approved UAT.
- Any branch code change after UAT for v0.
- Landing Verdict asks the operator to judge routine code-safety warnings.
- Landing Verdict treats a supply-chain-sensitive change as auto-landable before
  supply-chain gate evidence and any required operator-supervised approval exist.
- Landing Verdict treats a never-auto-landable surface as auto-landable, or
  ignores a high-risk layered risk-classification signal without operator
  supervision or recorded blocker disposition.
- Tests, review evidence, UAT, source-drift checks, or landing verdict evidence
  are stale under their artifact-specific Evidence SLOs.
- Missing required gate without bootstrap gap.
- The next slice begins before landing action evidence exists for the current slice.

**Verifier focus:**

- Confirm the Landing Verdict is a decision, not a warning dump.
- Confirm product acceptance and code-safety are separated.
- Confirm the Landing Verdict is based on current evidence under each artifact
  type's Evidence SLO.
- Confirm `safe-to-land` was followed by an actual landing action before closeout.

**CodeRabbit focus:**

- Request changes if landing evidence omits UAT status for feature work.
- Request changes if landing evidence does not distinguish stale aggregate review status from current-head review status.

## Stage 6: Retrospective And Improvement Capture

**Objective:** The workflow learns from the slice.

**Required evidence:**

- Retrospective.
- Structured improvement-mining checklist with evidence-backed answers for:
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lessons classified as improvement chore, cross-model tension entry, smell catalog update, or explicit no-action decision.
- Improvement chores include origin, source artifacts, hypothesis, metric,
  baseline, expected direction, predeclared decision criteria, uncertainty or
  minimum-detectable-effect context, evaluation window, re-evaluation window,
  proxy-risk notes, evaluation result, and outcome status.
- Current context updated if the next action changed.

**Blockers:**

- Actionable lesson appears only in prose.
- The retrospective omits the structured improvement-mining checklist.
- Repeated tool invocation friction, such as recurring uncertainty about how to
  invoke CodeRabbit or another required gate, is not surfaced and dispositioned.
- Retrospective-derived chore lacks metric, predeclared decision criteria,
  uncertainty or minimum-detectable-effect context, evaluation window, or
  re-evaluation window.
- Cross-model tension is not logged.
- Current context remains stale after completion.

**Verifier focus:**

- Check that every material lesson has a durable disposition.
- Check that the agent actively mined for failed tool calls, overreasoning,
  work-breakdown issues, agent-scope mismatches, tool-use rule pressure,
  reviewer/model routing issues, recurring inefficiencies, and tool invocation
  friction rather than waiting for voluntary suggestions.
- Check that improvement chores are evaluable, not vague reminders, and do not
  treat proxy metric movement as causal proof.

**CodeRabbit focus:**

- On retrospective and improvement files, request changes if actionable lessons lack tagged follow-up artifacts or no-action rationale.
- Request changes if the structured improvement-mining checklist is missing or
  leaves repeated tool/reviewer invocation friction undispositioned.
- Request changes if metrics/baselines/evaluation windows are missing.

## Stage 7: Improvement Evaluation

**Objective:** Bandit interprets workflow trials without overstating certainty.

**Required evidence:**

- Due improvement chore.
- Metric observation.
- Baseline or comparison point.
- Predeclared decision criteria.
- Uncertainty or minimum-detectable-effect context.
- Proxy-risk or reward-hacking side-effect check.
- Evaluation result: `effective`, `ineffective`, `inconclusive`, `reverted`, or `double_down`.
- Decision: `keep`, `revise`, `revert`, or `double_down`.
- Re-evaluation window before the decision becomes or remains policy.
- Routing or policy update when the decision requires it.

**Blockers:**

- Improvement chore passes its evaluation window without evaluation.
- Result or decision is recorded without evidence.
- Decision was not predeclared, or is based on post-hoc metric selection.
- Uncertainty, minimum-detectable-effect context, or proxy-risk disposition is missing.
- Policy changes before re-evaluation is scheduled or satisfied.
- Bad workflow decision remains active after a revert decision.
- Good workflow decision is not kept or doubled down when the predeclared criteria support it.

**Verifier focus:**

- Check whether the result and decision follow from predeclared criteria and evidence.
- Check whether the evidence is strong enough for the claimed decision, or whether uncertainty should force revise/inconclusive handling.
- Check whether policy/routing changed when the outcome demanded it.

**CodeRabbit focus:**

- Request changes if an improvement decision lacks metric evidence.
- Request changes if an improvement decision lacks predeclared criteria,
  uncertainty/MDE context, re-evaluation window, or proxy-risk disposition.
- Request changes if a reverted decision remains referenced as active policy.

## Universal Rubric Questions

Every verifier should ask:

1. Is the current stage clear?
2. Is the evidence current under the artifact-specific Evidence SLO?
3. Is the source of truth explicit?
4. Are projections prevented from becoming hidden authority?
5. Are missing gates honestly recorded?
6. Is auto-landing blocked by any never-auto-landable surface or high-risk
   layered risk-classification signal?
6. Are role boundaries preserved?
7. Are stage skills and tools scoped explicitly?
8. Are decisions evaluable later?
9. Did we reduce future ambiguity?
