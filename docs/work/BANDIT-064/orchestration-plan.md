# Work Item PM Orchestration Plan - BANDIT-064

contract_version: 1
work_item: BANDIT-064
owner: work_item_pm
verdict: pass
artifact_authority: advisory_orchestration_evidence_only
created_at: 2026-06-07

## Current Repo State

- Required first reads: pass - `AGENTS.md`, `CONTEXT.md`,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`,
  `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`,
  `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`,
  `docs/work/BANDIT-064/brief.md`,
  `docs/work/BANDIT-064/coordination-log.jsonl`, and
  `docs/templates/work-item-pm-plan.md` were read before authoring this plan.
- Git state: pass - `git status --short --branch` reported a clean worktree on
  `main...origin/main [ahead 3]` before plan authoring.
- Recent history: pass - `git log --oneline -5` shows `b41e4b7 Record
  BANDIT-064 formation approval`, `c777220 Record BANDIT-064 formation review`,
  `0ac3db1 Record BANDIT-064 Trust Verifier triage brief`, and completed
  `BANDIT-063` landing/closeout commits.
- Active work item agreement: pass - `CURRENT_CONTEXT.md`, `ROADMAP.md`,
  `STATUS.md`, `node ./bin/bandit.mjs cockpit status --json`, and
  `node ./bin/bandit.mjs session-context current --json` agree that
  `BANDIT-064` is active and that Work Item PM plan-mode evidence is required
  before Stage 2.
- Previous work item closure: pass - `BANDIT-063` has Stage 5 landing action and
  Stage 6 retrospective/gap disposition evidence under `docs/work/BANDIT-063/`,
  and roadmap/current-context/status files record it as closed.
- Formation gate: pass - `docs/work/BANDIT-064/qwen-formation-review.md`,
  `docs/work/BANDIT-064/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-064/formation-review.md` exist; the coordination log records
  `brief_created` followed by `formation_approved`.
- Operator-owned input: pass - no operator-owned input is required for this
  plan-mode gate or for Stage 2 RED evidence. Halt if work would approve Trust
  Verifier cutover policy, select a Trust Goal for cutover, replace or wrap an
  old gate path, or make another policy/product/cost/risk decision.
- Current coordination state: pass - `docs/work/BANDIT-064/coordination-log.jsonl`
  current state is `formation_approved`; `orchestration_plan_recorded` is not
  recorded until `node ./bin/bandit.mjs work-item-pm start BANDIT-064` accepts
  this artifact.
- Work type: pass - non-product bootstrap-policy chore for
  `BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`.
- Bootstrap gap queue: pass - `.bandit/bootstrap-gaps.json` marks
  `BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE` active through `BANDIT-064`;
  unrelated cockpit/product work remains blocked.

This plan is advisory orchestration evidence only. It cannot replace
`docs/work/BANDIT-064/brief.md`, coordination history, RED evidence,
implementation evidence, review evidence, landing evidence, retrospective
evidence, roadmap/current-context/status authority, or the bootstrap-gap ledger.

## Stage Sequence

- Stage 2 RED evidence: pass - accountable role is Test Writer. Create focused
  RED evidence proving the repo lacks an explicit Trust Verifier Cutover Gate
  contract or validator for future per-Trust-Goal cutover proposals.
- Stage 3 implementation: pass - accountable role is Implementation Writer. If
  Codex authors or materially edits Stage 2 RED tests, implementation must be
  routed to Claude through the bootstrap Process Adapter path.
- Stage 3 PM acceptance: pass - accountable role is Codex PM / Work Item PM.
  Verify implementation against the brief, clean-code posture, role boundaries,
  source-of-truth boundaries, and no-cutover constraints before Stage 4.
- Stage 4 review: pass - accountable role is Reviewer. Run CodeRabbit and Local
  Qwen review or record honest provider-refusal/bootstrap-gap evidence; record
  layered risk classification and supply-chain gate evidence because this chore
  changes workflow policy/validation surfaces.
- Stage 5 landing: pass - accountable role is Landing Agent. Write a landing
  verdict, run required landing checks, and record local landing action evidence
  only if policy and evidence allow it.
- Stage 6 closeout: pass - accountable role is Closeout Agent / Codex PM. Write
  retrospective and improvement/gap dispositions, update concise routing files
  if state changed, and verify derived status before completion.

## Required Evidence

- Stage 2: pass - `docs/work/BANDIT-064/red-evidence.md` and any required
  artifact-input JSON before implementation begins.
- Stage 2 coordination: pass - append-only coordination transition
  `red_recorded` before Stage 3 implementation begins.
- Stage 3: pass - `docs/work/BANDIT-064/implementation-evidence.md`,
  `docs/work/BANDIT-064/writer-report.md` if a Writer report is used, and any
  required role-run manifest or artifact-input evidence.
- Stage 3 PM acceptance: pass - `docs/work/BANDIT-064/stage3-pm-review.md` or
  equivalent PM acceptance evidence before Stage 4.
- Stage 4 CodeRabbit: pass - `docs/work/BANDIT-064/coderabbit-review.md` or
  explicit provider-refusal/bootstrap-gap evidence.
- Stage 4 Local Qwen: pass - `docs/work/BANDIT-064/local-qwen-review.md`.
- Stage 4 finding disposition: pass - disposition artifacts for every
  actionable or non-blocking finding before aggregate review evidence.
- Stage 4 policy gates: pass -
  `.bandit/policy/risk-classifications/BANDIT-064-risk-classification.json` and
  `.bandit/policy/supply-chain-gates/BANDIT-064-supply-chain-gate.json`.
- Stage 4 aggregate: pass - `docs/work/BANDIT-064/review-evidence.md` at the
  current review-subject hash.
- Stage 5: pass - `docs/work/BANDIT-064/landing-verdict.md` before any landing
  action, then `docs/work/BANDIT-064/landing-action.md` with commit SHA if
  landed.
- Stage 6: pass - `docs/work/BANDIT-064/retrospective.md` with structured
  improvement mining and bootstrap-gap disposition, followed by synchronized
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md`
  if state changed.

## Role Boundaries

- Repo PM: pass - owns Stage 1 brief creation, formation routing, formation
  approval, and context-artifact synchronization before Work Item PM starts.
- Work Item PM: pass - owns this advisory orchestration plan and stage routing
  from the approved brief; does not create new product scope, approve cutover
  policy, or replace canonical stage artifacts.
- Test Writer: pass - owns tests, test helpers, fixtures, RED evidence, and
  acceptance mappings.
- Implementation Writer: pass - owns source/chore delivery only after RED
  evidence exists and may not edit tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  or retrospective evidence.
- Reviewer: pass - owns Stage 4 CodeRabbit, Local Qwen, escalated review when
  smell triggers require it, risk classification, supply-chain gate, and finding
  disposition evidence.
- Landing Agent: pass - owns Stage 5 landing verdict and landing action
  evidence.
- Closeout Agent / Codex PM: pass - owns Stage 6 retrospective, improvement
  dispositions, bootstrap-gap disposition, and routing-file synchronization.
- Permanent Test Ownership Boundary: pass - Stage 3 Writer has zero authority
  over tests, test helpers, fixtures, RED evidence, or acceptance mappings for
  this work item.
- Bootstrap Model-Family Separation: pass - if Codex authors or materially edits
  Stage 2 RED tests, Stage 3 implementation is assigned to Claude / a different
  model family; during bootstrap Claude is the allowed Stage 3 Writer path.

## Verification Commands

- Stage 2 focused RED: pass - run focused Trust Verifier Cutover Gate RED tests
  proving missing, incomplete, implicit, and unsupported cutover claims fail
  closed.
- Focused cutover validation: pass - run focused validation tests for supported
  trust_goal vocabulary, old gate path presence, proposed trust-verifier path,
  parity evidence references, stricter-failure behavior, report format,
  rollback/fallback rule, operator approval status, and no-cutover-approved
  current state.
- Trust verifier behavior: pass - run `node --test test/trust-verify.test.mjs`
  if trust-verifier command behavior or snapshot validation is touched.
- Repo validation: pass - run `node --test test/validate.test.mjs` if repo
  validation behavior is touched.
- Work-item creation/formation: pass - run `node --test
  test/work-item-create.test.mjs` if work-item creation, spec validation, brief
  rendering, or bootstrap-gap linking is touched; run `node --test
  test/role-entrypoints-formation.test.mjs` if formation approval, role
  entrypoint routing, or Work Item PM readiness behavior is touched.
- Shared behavior: pass - run `npm test` if implementation touches shared
  command routing, validators, artifact renderers, work-item parsing, templates,
  bootstrap gaps, coordination history, cockpit status, session-context packets,
  risk classification, supply-chain gates, input quarantine, operator
  boundaries, token-cost failsafes, evidence freshness, role contracts,
  role-run manifests, model-family separation, or policy validation beyond
  focused tests.
- Required before landing: pass - run `npm run typecheck`, `npm run bandit --
  validate`, `npm run bandit -- gaps list`, `npm run bandit --
  stage-capability-scope validate --json`, `npm run bandit --
  token-cost-failsafe validate --json`, `npm run bandit --
  evidence-freshness-slos validate --json`, `npm run bandit --
  risk-classification validate --json`, `npm run bandit -- supply-chain-gate
  validate --json`, `npm run bandit -- input-quarantine validate --json`,
  `npm run bandit -- operator-boundary validate --json`, `node
  ./bin/bandit.mjs cockpit status --json`, `node ./bin/bandit.mjs
  session-context current --json`, `node ./bin/bandit.mjs review-subject-hash
  BANDIT-064`, `npm run bandit -- coderabbit-review pre-pr BANDIT-064 --base
  origin/main` unless provider-refusal evidence is recorded, `npm run bandit --
  qwen-review BANDIT-064`, `npm run bandit -- land-check BANDIT-064`, and
  `git diff --check`.

## Known Blockers

- Operator input: pass - none required for this plan gate or for Stage 2 RED
  evidence.
- Formation evidence: pass - formation review artifacts exist and
  `formation_approved` is recorded.
- CodeRabbit formation review: bootstrap_gap - prior formation CodeRabbit run
  timed out and is recorded only as provider-timeout replacement evidence, not
  pass evidence.
- Open queued gap: non_blocking - `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`
  remains source material and queued/open, but current repo policy prioritizes
  completing active `BANDIT-064` first.
- Current stage blockers: pass - no blocker prevents recording
  `orchestration_plan_recorded`.

## Stop Conditions

- blocker - Stage 2 RED evidence would begin before this plan is accepted and
  `orchestration_plan_recorded` is appended.
- blocker - any action would approve Trust Verifier cutover, select a Trust
  Goal for cutover, replace or wrap an old gate path, or make broader policy,
  product, UAT, business, cost/risk, provider-pricing, paid-routing,
  dependency, external-service, merge/push/deploy, global-skill, claim, or
  worktree-lifecycle decisions without explicit operator-owned approval.
- blocker - Stage 3 Writer attempts to edit tests, test helpers, fixtures, RED
  evidence, or acceptance mappings.
- blocker - Codex-authored or Codex-materially-edited RED tests are followed by
  Codex same-family Stage 3 implementation without an explicit repo-recorded
  exception.
- blocker - implementation changes old gate execution semantics, lets `bandit
  trust verify` replace/wrap/invoke/mutate old gates, mutates queues or routing
  state from trust verification, runs tests/reviewers from trust verification,
  or claims any Trust Goal is cut over.
- blocker - current context, roadmap, status, cockpit status, session-context,
  or coordination history disagree on active work item or next action.
- blocker - provider review, Local Qwen, risk classification, supply-chain gate,
  or landing evidence is missing without explicit provider-refusal/bootstrap-gap
  evidence at the stage where it is required.
- blocker - prior stage evidence is missing, stale, contradictory, or not
  recorded in the expected canonical artifact before proceeding.

## Forbidden Actions

- Do not write Stage 2 RED evidence before `orchestration_plan_recorded` exists.
- Do not dispatch implementation before Stage 2 RED evidence and `red_recorded`
  coordination evidence exist.
- Do not approve Trust Verifier cutover.
- Do not select a Trust Goal for cutover.
- Do not replace, wrap, invoke, or mutate old gate paths through `bandit trust
  verify`.
- Do not run tests or reviewers from inside `bandit trust verify`.
- Do not mutate queues, routing state, coordination state, landing state, or
  closeout state from trust verification.
- Do not create role input packets, generated execution packets, Pi/Aperture
  agent-scope work, cockpit product work, claim authority, worktree lifecycle,
  scheduler work, dependency or lockfile changes, external service setup,
  merge/push/deploy behavior, product UAT scope, provider-pricing approval,
  spend-class approval, paid reviewer promotion, recurring paid routing policy,
  installed global skill edits, or broader product/policy changes in this
  bounded chore.
- Do not let the Stage 3 Writer edit tests, test helpers, fixtures, RED
  evidence, acceptance mappings, formation evidence, review evidence, landing
  evidence, or retrospective evidence.
