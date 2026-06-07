# BANDIT-068 Work Item PM Orchestration Plan

contract_version: 1
work_item: BANDIT-068
work_type: slice
author: codex_work_item_pm
created_at: 2026-06-07T19:24:00Z
verdict: pass

## Current Repo State

`BANDIT-068` is the active Phase 8 slice: Evidence Drilldown And Gate Matrix.
Repo PM formation is complete and `docs/work/BANDIT-068/coordination-log.jsonl`
records `formation_approved`.

Current coordination state: `formation_approved`.

Current repo status evidence:

| Check | Verdict | Evidence |
| --- | --- | --- |
| Selected Work Item ID exists | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`, `node ./bin/bandit.mjs cockpit status --json`, and `node ./bin/bandit.mjs session-context current --json` all name `BANDIT-068`. |
| Brief exists | pass | `docs/work/BANDIT-068/brief.md`. |
| Prior Work Item closed | pass | `docs/work/BANDIT-067/landing-action.md`, `docs/work/BANDIT-067/retrospective.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and `STATUS.md` record `BANDIT-067` landed and closed. |
| Bootstrap gaps | pass | `.bandit/bootstrap-gaps.json`; cockpit status reports no queued open gap. |
| Operator input | pass | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/work/BANDIT-068/brief.md`, and session-context report no operator-owned input required for plan-mode or RED. CLI-owned product UAT is required before landing. |

## Stage Sequence

| Stage | Accountable role | Verdict | Evidence / required action |
| --- | --- | --- | --- |
| Stage 2 RED evidence | Test Writer | pass | Test Writer must author tests, fixtures, RED evidence, and acceptance mappings before implementation. |
| Stage 3 implementation | Implementation Writer / Claude if Codex authors RED | pass | Writer owns source/chore delivery only and cannot edit test surfaces or RED evidence. Give Claude up to 15 minutes before interrupting. |
| Stage 4 review | Reviewers and Codex PM disposition | pass | CodeRabbit, Local Qwen through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`, risk classification, supply-chain gate, browser smoke, review-subject hash, and aggregate review evidence are required or must be honestly dispositioned. |
| Stage 5 landing | Landing Agent and operator UAT for feature slice | pass | CLI-owned product UAT, landing verdict, land-check, and local-record landing action evidence are required before closeout. |
| Stage 6 closeout | Closeout Agent / Codex PM | pass | Retrospective, improvement/no-action dispositions, roadmap/current-context/STATUS refresh, validation, and final status agreement are required before any next slice. |

## Required Evidence

| Stage | Artifact | Verdict | Evidence |
| --- | --- | --- | --- |
| Stage 2 | `docs/work/BANDIT-068/red-evidence.md` | pass | Must map RED tests to acceptance criteria for gate-matrix derivation, evidence drilldown, fail-closed states, source traceability, responsive behavior, accessibility, and authority boundaries. |
| Stage 3 | `docs/work/BANDIT-068/implementation-evidence.md`, `docs/work/BANDIT-068/writer-report.md`, `docs/work/BANDIT-068/stage3-pm-review.md` | pass | Must show source-only implementation, focused tests, typecheck, clean-code self-check, and zero Writer test-surface edits. |
| Stage 4 | `docs/work/BANDIT-068/coderabbit-review.md`, `docs/work/BANDIT-068/local-qwen-review.md`, `docs/work/BANDIT-068/review-evidence.md` | pass | Must include provider evidence or bootstrap replacement evidence, finding disposition, risk classification, supply-chain gate, browser smoke, and review-subject freshness. |
| Stage 5 | `docs/work/BANDIT-068/uat-approval.md`, `docs/work/BANDIT-068/landing-verdict.md`, `docs/work/BANDIT-068/landing-action.md` | pass | Feature UAT and local-record landing action are required. |
| Stage 6 | `docs/work/BANDIT-068/retrospective.md`, optional improvement disposition, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md` | pass | Must classify every material lesson as improvement chore, cross-model tension, smell update, or no-action. |

## Role Boundaries

| Boundary | Verdict | Evidence |
| --- | --- | --- |
| Repo PM formation | pass | Repo PM owns brief, formation review, and formation approval; Work Item PM only verifies these after `formation_approved`. |
| Work Item PM orchestration | pass | Work Item PM records this plan, coordinates stages, verifies gates, and stops on blockers. |
| Test Writer ownership | pass | Stage 2 owns tests, test helpers, fixtures, RED evidence, and acceptance mappings. |
| Permanent Test Ownership Boundary | pass | Stage 3 Writer has zero authority to create, edit, delete, regenerate, format, or mechanically adjust tests, helpers, fixtures, RED evidence, or acceptance mappings. |
| Bootstrap Model-Family Separation | pass | If Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation routes to Claude during bootstrap. |
| Implementation Writer boundary | pass | Stage 3 Writer owns source/chore delivery only and cannot edit formation, review, UAT, landing, or closeout artifacts. |
| Reviewer boundary | pass | Stage 4 reviewers provide evidence; Codex PM dispositions findings and cross-model tension. |
| Landing boundary | pass | Landing Agent owns landing verdict/action evidence; operator owns product UAT approval. |
| Browser non-authority | pass | UI, static preview, generated payloads, browser state, local cache, and view-model projections remain non-canonical and rebuildable. |

## Verification Commands

Stage-appropriate verification:

```sh
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
npm test -- test/cockpit-status.test.mjs test/cockpit-view-model.test.mjs test/cockpit-evidence-detail.test.mjs test/cockpit-browser-shell.test.mjs test/cockpit-ui.test.mjs
npm run typecheck
npm run bandit -- validate
npm run bandit -- coderabbit-review pre-pr BANDIT-068 --base origin/main
npm run bandit -- qwen-review BANDIT-068
npm run bandit -- review-subject-hash BANDIT-068
npm run bandit -- land-check BANDIT-068
npm run bandit -- auto-land-check BANDIT-068
node ./bin/bandit.mjs coordination validate BANDIT-068
git diff --check
```

Browser/UI verification must cover desktop and mobile evidence matrix rendering,
long source paths, hashes, disabled action reasons, detail-row wrapping,
focus order, source-link reachability, and no overlap.

## Known Blockers

| Item | Verdict | Evidence |
| --- | --- | --- |
| Operator-owned input | pass | None required for plan-mode through implementation/review routing. Product UAT is required before landing and is pre-approved by this automation only through the CLI-owned UAT gate. |
| CodeRabbit availability | bootstrap_gap | Formation CodeRabbit review timed out; Stage 4 may record provider-timeout replacement evidence but must not claim a CodeRabbit pass without terminal provider output. |
| Local Qwen route | pass | Only `.bandit/reviewers/local-qwen.json` through `bin/omlx-chat-completions.mjs` is authorized; direct `qwen` CLI is forbidden. |
| Trust Verifier cutover / local API / State Index / guarded actions | not_applicable | Explicitly out of scope in `docs/work/BANDIT-068/brief.md`. |

## Stop Conditions

| Condition | Verdict | Evidence |
| --- | --- | --- |
| Missing or contradictory formation evidence | pass | Current formation evidence is present and non-blocking; halt if later validation contradicts it. |
| RED evidence absent or fails to map to acceptance criteria | pass | Stage 2 cannot proceed to implementation until `red_recorded` is durable. |
| Stage 3 Writer edits any test surface | pass | Invalidates the Stage 3 attempt; revert and rerun Stage 3 from clean RED evidence. |
| Required reviewer unavailable without honest replacement evidence | pass | Stage 4 must record provider refusal/timeout/bootstrap gap, not a pass. |
| Unresolved reviewer blocker | pass | Halt until repaired or explicitly dispositioned under policy. |
| Product UAT missing or stale | pass | Feature slice cannot land without current CLI-owned UAT evidence. |
| Source changes after UAT or review evidence | pass | Refresh applicable evidence before landing. |
| Operator-owned policy/product/cost/risk/cutover decision emerges | pass | Halt and request exact operator input. |

## Forbidden Actions

| Action family | Verdict | Evidence |
| --- | --- | --- |
| Browser-side CLI execution or repo writes | pass | Out of scope; cockpit remains presentation-only. |
| Local API, live polling, websocket, State Index, SQLite, browser storage authority | pass | Out of scope; no new canonical or durable browser state. |
| Guarded action execution, scheduler, claim/worktree lifecycle, PR/CI orchestration | pass | Future slices only. |
| Dependency additions, lockfile changes, package-manager script changes | pass | Out of scope unless later explicitly authorized. |
| Merge, push, deploy, external service setup, hosted preview | pass | Not authorized by this work item or automation. |
| Trust Verifier cutover or old gate replacement/wrapping | pass | No Trust Goal selected and no cutover approved. |
| Unrelated Phase 8 scope | pass | Guarded CLI Action Requests and Improvement Health Surface remain separate later work. |

## 0. Context And Boundary Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Required reads complete | pass | `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `docs/plans/BOOTSTRAP_METHODOLOGY.md`, `CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`, `STATUS.md`, `docs/work/BANDIT-068/brief.md`, `docs/work/BANDIT-068/coordination-log.jsonl`, and `docs/templates/work-item-pm-plan.md`. |
| Git status inspected and dirty state classified | pass | `git status --short --branch` showed `main...origin/main [ahead 1]` with no dirty paths before this plan write. |
| Context artifacts agree | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, cockpit status, and session-context all name `BANDIT-068` and plan-mode as next action. |
| Prior Work Item fully closed | pass | `BANDIT-067` has landing action, retrospective, improvement disposition, and context/status closeout evidence. |
| Operator-input status explicit | pass | None required now; UAT required before landing; product/policy/cost/risk/cutover decisions halt. |

## 1. Repo PM Formation Complete Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Brief exists and satisfies Stage 1 | pass | `docs/work/BANDIT-068/brief.md`; aggregate formation review verdict `pass`. |
| Qwen formation review exists and is not blocking | pass | `docs/work/BANDIT-068/qwen-formation-review.md` verdict `pass`, one `non_blocking` note dispositioned. |
| CodeRabbit formation review exists and is not blocking | bootstrap_gap | `docs/work/BANDIT-068/coderabbit-formation-review.md` records provider timeout replacement evidence; no CodeRabbit pass claimed. |
| Aggregate formation review exists and is not blocking | pass | `docs/work/BANDIT-068/formation-review.md` verdict `pass`. |
| Coordination records formation approval | pass | `docs/work/BANDIT-068/coordination-log.jsonl` sequence 2 state `formation_approved`. |

## 2. Stage 2 RED Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Test Writer owns tests, fixtures, RED evidence, and mappings | pass | `docs/work/BANDIT-068/brief.md` role boundary evidence. |
| RED evidence maps to acceptance criteria | pass | Required in `docs/work/BANDIT-068/red-evidence.md` before implementation. |
| Stage 3 Writer has zero test-edit authority | pass | Permanent Test Ownership Boundary in brief and this plan. |
| Codex-authored RED routes Stage 3 to Claude | pass | Bootstrap Model-Family Separation in brief and this plan. |
| `red_recorded` before implementation | pass | `node ./bin/bandit.mjs work-item-pm start BANDIT-068` must record/validate plan before Stage 2; Stage 2 must record RED before Stage 3. |

## 3. Stage 3 Implementation Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Implementation Writer owns source/chore only | pass | Brief and plan role boundaries. |
| No Writer test-surface edits | pass | Verify with `git diff --name-only` and Stage 3 evidence after Claude delivery. |
| Focused tests pass or bootstrap gap recorded | pass | Required focused cockpit/evidence-detail/browser-shell/UI tests. |
| `implementation-evidence.md` and Writer report exist | pass | Required before Stage 4. |
| PM acceptance verifies spec and clean-code posture | pass | Required in `docs/work/BANDIT-068/stage3-pm-review.md`. |
| Give Claude 15 minutes | pass | Work Item PM will not interrupt Stage 3 before 15 minutes unless the process exits. |

## 4. Stage 4 Review Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| CodeRabbit review or provider replacement evidence | pass | Required in `docs/work/BANDIT-068/coderabbit-review.md`. |
| Local Qwen review | pass | Required through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`. |
| Escalated review if policy smells require it | pass | Determine after risk/smell classification. |
| Risk classification | pass | Required in Stage 4 aggregate evidence. |
| Supply-chain gate when applicable | pass | Required because browser/static preview surfaces are touched; dependency/lockfile/package-script changes remain forbidden. |
| Every finding repaired or dispositioned | pass | Required before landing. |
| Aggregate review current for subject | pass | `npm run bandit -- review-subject-hash BANDIT-068` and current source metadata required. |

## 5. Stage 5 Landing Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Landing verdict exists | pass | Required at `docs/work/BANDIT-068/landing-verdict.md`. |
| Feature UAT handled | pass | CLI-owned product UAT required at `docs/work/BANDIT-068/uat-approval.md`. |
| `land-check` passes | pass | Required before landing action. |
| Landing action records commit or merge evidence | pass | `docs/work/BANDIT-068/landing-action.md`. |
| No next Work Item starts before landing action | pass | Enforced by slice boundary and closeout checks. |

## 6. Stage 6 Closeout Checklist

| Check | Verdict | Evidence |
| --- | --- | --- |
| Retrospective exists | pass | Required at `docs/work/BANDIT-068/retrospective.md`. |
| Structured improvement mining complete | pass | Required in retrospective. |
| Every lesson dispositioned | pass | Required as improvement chore, cross-model tension, smell update, or no-action. |
| Context/status updated if changed | pass | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `STATUS.md` must be refreshed when closeout changes next action. |
| Cockpit and session-context agree | pass | Required final commands. |
| `validate` and `git diff --check` pass | pass | Required final verification. |
