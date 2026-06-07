# BANDIT-069 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-069
work_type: chore
author: codex_work_item_pm
created_at: 2026-06-07T20:27:23Z
verdict: pass

## Current Repo State

`BANDIT-069` is the active Phase 8 bootstrap-gap chore: Test Strength /
Mutation Adequacy Gate. Repo PM formation is complete and
`docs/work/BANDIT-069/coordination-log.jsonl` records `formation_approved`.

Current coordination state: `formation_approved`.

Current repo status evidence:

| Check | Verdict | Evidence |
| --- | --- | --- |
| Selected Work Item ID exists | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `node ./bin/bandit.mjs cockpit status --json`, and `node ./bin/bandit.mjs session-context current --json` all name `BANDIT-069`. |
| Brief exists | pass | `docs/work/BANDIT-069/brief.md`. |
| Prior Work Item closed | pass | `docs/work/BANDIT-068/landing-verdict.md`, `docs/work/BANDIT-068/landing-action.md`, `docs/work/BANDIT-068/retrospective.md`, `docs/work/BANDIT-068/improvement-disposition.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` record `BANDIT-068` landed and closed. |
| Bootstrap gap active | pass | `.bandit/bootstrap-gaps.json` links `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` to `BANDIT-069` with next action `Complete active chore BANDIT-069.` |
| Operator input | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `STATUS.md`, and `docs/work/BANDIT-069/brief.md` record no operator-owned input required for plan-mode or the next repo-owned stages. |

## Stage Sequence

| Stage | Accountable role | Verdict | Evidence / required action |
| --- | --- | --- | --- |
| Stage 2 RED evidence | Test Writer | pass | Test Writer owns tests, test helpers, fixtures, RED evidence, assertion-adequacy mappings, mutation/property/fault-injection/table-driven evidence, and acceptance mappings before implementation. |
| Stage 3 implementation | Implementation Writer / Claude if Codex authors RED | pass | Writer owns source/chore delivery only and cannot edit test surfaces, RED evidence, mutation evidence, assertion-adequacy mappings, adversarial-case mappings, or acceptance mappings. Give Claude up to 15 minutes before interrupting. |
| Stage 4 review | Reviewers and Codex PM disposition | pass | CodeRabbit review or provider-refusal evidence, Local Qwen through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, risk classification, supply-chain gate if applicable, review-subject hash, and aggregate review evidence are required or must be honestly dispositioned. |
| Stage 5 landing | Landing Agent | pass | Landing verdict, land-check, source-head/hash refresh, and local-record landing action evidence are required before closeout. Feature UAT is not applicable unless implementation changes product-facing behavior. |
| Stage 6 closeout | Closeout Agent / Codex PM | pass | Retrospective, structured improvement mining, durable lesson dispositions, bootstrap-gap resolution or explicit disposition, roadmap/current-context/STATUS refresh, validation, and final status agreement are required before the next queued gap starts. |

## Required Evidence

| Stage | Artifact | Verdict | Evidence |
| --- | --- | --- | --- |
| Stage 2 | `docs/work/BANDIT-069/red-evidence.md` | pass | Must map RED tests or verification plan to acceptance criteria and identify why RED failed plus the plausible wrong implementations, mutants, invariants, injected failures, or adversarial cases each assertion family rejects. |
| Stage 3 | `docs/work/BANDIT-069/implementation-evidence.md`, `docs/work/BANDIT-069/writer-report.md`, `docs/work/BANDIT-069/stage3-pm-review.md` | pass | Must show source-only implementation, focused tests, typecheck, clean-code self-check, model-family separation evidence, and zero Writer test-surface edits. |
| Stage 4 | `docs/work/BANDIT-069/coderabbit-review.md`, `docs/work/BANDIT-069/local-qwen-review.md`, `docs/work/BANDIT-069/review-evidence.md` | pass | Must include provider evidence or bootstrap replacement evidence, finding disposition, risk classification, supply-chain gate when applicable, and current review-subject freshness. |
| Stage 5 | `docs/work/BANDIT-069/landing-verdict.md`, `docs/work/BANDIT-069/landing-action.md` | pass | Landing verdict and local-record landing action are required; UAT is `not_applicable` for this non-product chore unless implementation changes product-facing behavior. |
| Stage 6 | `docs/work/BANDIT-069/retrospective.md`, optional improvement disposition, `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md` | pass | Must classify every material lesson as improvement chore, cross-model tension, smell update, or explicit no-action and synchronize the next queued gap. |

## Role Boundaries

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Repo PM formation | pass | Repo PM owns brief, formation review, formation approval, and context synchronization before Work Item PM start. |
| Work Item PM orchestration | pass | Work Item PM records this plan, coordinates stages, verifies gates, and stops on blockers without taking over Test Writer, Writer, reviewer, landing, or operator-owned authority. |
| Test Writer ownership | pass | Stage 2 owns tests, test helpers, fixtures, RED evidence, assertion-adequacy mappings, mutation evidence, property/fault-injection evidence, adversarial-case mappings, and acceptance mappings. |
| Permanent Test Ownership Boundary | pass | Stage 3 Writer has zero authority to create, edit, delete, regenerate, format, or mechanically adjust tests, helpers, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, adversarial-case mappings, or acceptance mappings. |
| Bootstrap Model-Family Separation | pass | If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation routes to Claude during bootstrap. |
| Implementation Writer boundary | pass | Stage 3 Writer owns source/chore delivery only and cannot edit formation, review, UAT, landing, closeout, or Test Writer-owned evidence. |
| Reviewer boundary | pass | Stage 4 reviewers provide evidence; Codex PM dispositions findings and cross-model tension. |
| Landing boundary | pass | Landing Agent owns landing verdict/action evidence; Work Item PM verifies current evidence and land-check before local-record landing. |
| Projection non-authority | pass | Policy files, validators, generated reports, cockpit views, and derived status are projections over repo-native `.bandit/` and work-item artifacts, not independent workflow authority. |

## Verification Commands

Stage-appropriate verification:

```sh
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
npm test -- test/test-strength-gate.test.mjs test/landing-gates.test.mjs test/validate.test.mjs
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
npm run bandit -- coderabbit-review pre-pr BANDIT-069 --base origin/main
npm run bandit -- qwen-review BANDIT-069
node ./bin/bandit.mjs review-subject-hash BANDIT-069
npm run bandit -- land-check BANDIT-069
node ./bin/bandit.mjs coordination validate BANDIT-069
git diff --check
```

If implementation adds a local mutation script or dependency, also run the
selected scoped local mutation command and record supply-chain and layered-risk
evidence. If the runner is unavailable or excessive for the slice, record an
honest bootstrap/no-run disposition instead of pass evidence.

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Operator-owned input | pass | None required for the next recorded action or routine technical routing. Halt only for product, UAT, policy, business, explicit cost/risk, paid/external tooling, Trust Verifier cutover, merge/push/deploy, or genuinely ambiguous scope decisions. |
| CodeRabbit formation availability | bootstrap_gap | `docs/work/BANDIT-069/coderabbit-formation-review.md` records bounded provider timeout replacement evidence; no CodeRabbit pass is claimed. Stage 4 must retry CodeRabbit or record current provider-refusal/bootstrap evidence. |
| Local Qwen route | pass | Only `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs` is authorized; direct `qwen` CLI is forbidden. |
| Paid/external mutation tooling | not_applicable | Explicitly out of scope; only local deterministic runner support may be selected by Codex PM if justified and supply-chain evidence is recorded. |
| Trust Verifier cutover / guarded actions / unrelated cockpit product scope | not_applicable | Explicitly out of scope in `docs/work/BANDIT-069/brief.md` and current roadmap/context. |

## Stop Conditions

| Condition | Verdict | Evidence |
| --- | --- | --- |
| Missing or contradictory formation evidence | pass | Current formation evidence is present and non-blocking; halt if later validation contradicts it. |
| RED evidence absent or not mapped to acceptance criteria | pass | Stage 2 cannot proceed to implementation until `red_recorded` is durable. |
| RED evidence lacks intended-failure reason or assertion-adequacy mapping | pass | Stage 2 must identify why the RED failed and what plausible wrong behavior the assertions reject. |
| Stage 3 Writer edits any Test Writer-owned surface | pass | Invalidates the Stage 3 attempt; revert and rerun Stage 3 from clean RED evidence. |
| Required reviewer unavailable without honest replacement evidence | pass | Stage 4 must record provider refusal/timeout/bootstrap gap, not a pass. |
| Unresolved reviewer blocker | pass | Halt until repaired or explicitly dispositioned under policy. |
| Source changes after review, risk, supply-chain, or landing evidence | pass | Refresh applicable evidence before landing. |
| Covered high-risk surface lacks test-strength evidence or explicit disposition | pass | Landing or validation must fail closed until evidence is current and adequate. |
| Operator-owned policy/product/cost/risk/cutover decision emerges | pass | Halt and request exact operator input. |

## Forbidden Actions

| Action family | Verdict | Evidence |
| --- | --- | --- |
| Universal line coverage, universal mutation score, or every-file mutation mandate | pass | Out of scope; gate is risk-tiered and evidence-mode based. |
| Stage 3 edits to tests, fixtures, RED evidence, mutation evidence, assertion-adequacy mappings, or acceptance mappings | pass | Forbidden by Permanent Test Ownership Boundary. |
| Generic coverage-only, snapshot churn, or test-presence-only trust claims | pass | Forbidden for covered high-risk surfaces. |
| Paid/external mutation services, paid reviewer routing, recurring paid model usage, provider-pricing policy, or spend-class policy | pass | Operator-owned and out of scope. |
| Product/UAT policy changes, Trust Verifier cutover, old gate replacement/wrapping, guarded browser action execution, local API, State Index, scheduler, claim/worktree lifecycle | pass | Out of scope unless separately authorized by repo artifacts and required operator approval. |
| Merge, push, deploy, external service setup, hosted preview | pass | Not authorized by this work item or automation. |
| Unrelated Phase 8 cockpit or product scope | pass | Guarded CLI Action Requests and Improvement Health Surface remain separate later work. |

## 0. Context And Boundary Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-069/brief.md`, `docs/work/BANDIT-069/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | pass | `git status --short --branch` showed `main...origin/main [ahead 1]` with no dirty paths before this plan write. |
| Context artifacts agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context all name `BANDIT-069` and plan-mode as next action. |
| Prior Work Item fully closed | pass | `BANDIT-068` has landing verdict, landing action, retrospective, improvement disposition, and context/status closeout evidence. |
| Operator-input status explicit | pass | None required now; product/policy/UAT/cost/risk/cutover decisions halt. |

## 1. Repo PM Formation Complete Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-069/brief.md`; aggregate formation review verdict `pass`. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-069/qwen-formation-review.md` verdict `pass`, findings status `none`, MLX adapter route evidence recorded. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-069/coderabbit-formation-review.md` records provider timeout replacement evidence; no CodeRabbit pass claimed. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-069/formation-review.md` verdict `pass`, CodeRabbit timeout accepted as non-blocking replacement evidence. |
| Coordination records formation approval | pass | `docs/work/BANDIT-069/coordination-log.jsonl` sequence 2 state `formation_approved`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and mappings | pass | `docs/work/BANDIT-069/brief.md` role boundary evidence. |
| RED evidence maps to acceptance criteria | pass | Required in `docs/work/BANDIT-069/red-evidence.md` before implementation. |
| RED identifies plausible wrong behavior | pass | Required assertion-adequacy, mutant, invariant, injected-failure, or adversarial-case mapping from the brief. |
| Stage 3 Writer has zero test-edit authority | pass | Permanent Test Ownership Boundary in brief and this plan. |
| Codex-authored RED routes Stage 3 to Claude | pass | Bootstrap Model-Family Separation in brief and this plan. |
| `red_recorded` before implementation | pass | This plan must be recorded by `work-item-pm start`; Stage 2 must record RED before Stage 3. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore only | pass | Brief and plan role boundaries. |
| No Writer test-surface edits | pass | Verify with `git diff --name-only` and Stage 3 evidence after Claude delivery. |
| Focused tests pass or bootstrap gap recorded | pass | Required focused test-strength, landing-gate, validation, typecheck, and bandit validation commands. |
| `implementation-evidence.md` and Writer report exist | pass | Required before Stage 4. |
| PM acceptance verifies spec and clean-code posture | pass | Required in `docs/work/BANDIT-069/stage3-pm-review.md`. |
| Give Claude 15 minutes | pass | Work Item PM will not interrupt Stage 3 before 15 minutes unless the process exits. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider replacement evidence | pass | Required in `docs/work/BANDIT-069/coderabbit-review.md`. |
| Local Qwen review | pass | Required through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`. |
| Escalated review if policy smells require it | pass | Determine after risk/smell classification; Claude-authored implementation escalation returns to Codex PM. |
| Risk classification | pass | Required in Stage 4 aggregate evidence. |
| Supply-chain gate when applicable | pass | Required if package scripts, dependencies, lockfile, tool-install, or external runner surfaces change. |
| Every finding repaired or dispositioned | pass | Required before landing. |
| Aggregate review current for subject | pass | `node ./bin/bandit.mjs review-subject-hash BANDIT-069` and current source metadata required. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required at `docs/work/BANDIT-069/landing-verdict.md`. |
| Feature UAT handled when applicable | not_applicable | Work type is chore; UAT becomes required only if implementation changes product-facing behavior. |
| `land-check` passes | pass | Required before landing action. |
| Source head/hash refresh before local-record landing | pass | Required by the local-record landing path and review-subject freshness evidence. |
| Landing action records commit or merge evidence | pass | `docs/work/BANDIT-069/landing-action.md`. |
| No next Work Item starts before landing action | pass | Enforced by slice boundary and closeout checks. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required at `docs/work/BANDIT-069/retrospective.md`. |
| Structured improvement mining complete | pass | Required in retrospective. |
| Every lesson dispositioned | pass | Required as improvement chore, cross-model tension, smell update, or no-action. |
| Active bootstrap gap resolved, blocked, or explicitly dispositioned | pass | `.bandit/bootstrap-gaps.json` must resolve or disposition `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` before the next queued gap starts. |
| Context/status updated if changed | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` must be refreshed when closeout changes next action. |
| Cockpit and session-context agree | pass | Required final commands. |
| `validate` and `git diff --check` pass | pass | Required final verification. |
