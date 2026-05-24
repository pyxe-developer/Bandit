# BANDIT-006 Review Evidence

contract_version: 1
work_item: BANDIT-006
source_head: 61279b0ffc9bade9e4eda1ee0b59e1874283a01b
verification_state: pass
verification_evidence:
  - `node --test test/local-qwen-review.test.mjs`: pass, 22/22 tests.
  - `npm test`: pass, 87/87 tests.
  - `npm run typecheck`: pass.
  - `npm run bandit -- validate`: pass, `Bandit state is valid.`
  - `git diff --check`: pass.
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - No PR-backed CodeRabbit pre-landing loop exists during bootstrap; Codex PM reviewed the current diff and artifacts manually.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - `docs/work/BANDIT-006/local-qwen-review.md` records that the configured local Qwen route failed closed by timeout against the current source head after profile and review-packet repairs.
  - Focused tests cover local Qwen profile validation, review evidence validation, dirty-worktree refusal, review-packet construction, subprocess failures, stale evidence, and `land-check` integration.
escalated_review_required: true
escalated_review_state: bootstrap_gap
escalated_review_rationale: Parser-validator, schema/evidence-shape, policy-drift, unavailable-agent, and missing-coverage smells apply. Focused tests and PM review replace unavailable specialized escalated reviewers during bootstrap.
pm_disposition: pass
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - CodeRabbit pre-landing loop unavailable; replacement evidence is manual PM review and passing local verification.
  - Local Qwen live review installed but timed out; replacement evidence is fail-closed timeout behavior plus focused review-gate tests and PM review.
  - Escalated adversarial and schema reviewers unavailable; replacement evidence is focused parser/validator coverage, source-diff packet repair, and PM clean-code review.
  - Landing Agent unavailable; replacement evidence is the manual landing verdict and `land-check` output.
  - UAT artifacts unavailable until Phase 5 and not applicable to this workflow-infrastructure slice.

## Scope

This evidence covers Stage 4: Review And Cross-Model Gates for `BANDIT-006`
Local Qwen Baseline Reviewer Gate.

The review applies to final implementation source head
`61279b0ffc9bade9e4eda1ee0b59e1874283a01b`.

## PM Review Findings

| Finding | Disposition |
|---|---|
| The initial live Qwen run failed because the seeded profile did not configure the available non-interactive local Ollama-backed Qwen route. | Repaired by adding `--auth-type openai`, local Ollama base URL, local API key placeholder, explicit model, and a longer timeout to `.bandit/reviewers/local-qwen.json`. |
| The initial review packet only passed the work-item brief, which was too weak for an adversarial implementation review. | Repaired by adding dirty-worktree refusal and review-packet construction that includes RED evidence, implementation evidence, and source diff. |
| The first source-diff repair used the previous landed slice commit, which pulled prior closeout noise into the review packet. | Repaired by preferring the current work item's RED-evidence commit as the source diff base. |
| The actual local Qwen review still timed out twice before producing structured output. | Accepted only as a Stage 4 bootstrap gap; this is not treated as a local Qwen pass. |
| The command now fails closed for unavailable runtime, nonzero exit, timeout, inconclusive output, dirty worktree, stale evidence, and blocker/inconclusive review evidence. | Accepted as the narrow v0 local Qwen gate behavior. |

## Clean-Code Landing Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation follows the `BANDIT-006` brief and RED evidence without adding CodeRabbit automation, paid reviewer routing, UAT, final Landing Agent behavior, cockpit state, SQLite indexing, or automated repair. |
| Small surface area | `pass` | Diff is limited to the local Qwen profile/evidence contract, validator helpers, one command, narrow `land-check` integration, tests, and required evidence/context updates. |
| Simple design | `pass` | Uses explicit JSON and Markdown metadata contracts plus direct subprocess execution; no database, broad policy engine, generated schema framework, or cockpit authority was added. |
| Explicit state | `pass` | Reviewer profile, source head, review status, findings disposition, executable evidence, source drift, and bootstrap gaps live in repo-native artifacts. |
| No hidden authority | `pass` | `qwen-review`, `validate`, and `land-check` read Git and repo artifacts; chat, terminal scrollback, UI state, model-local memory, and caches do not own review readiness. |
| Testable behavior | `pass` | Focused tests cover validators, command refusal paths, subprocess failures, dirty worktree, review-packet construction, stale evidence, and landing integration. |
| Readable flow | `pass` | Profile parsing, evidence parsing, review packet construction, command execution, evidence writing, and landing consumption are separated into named modules. |
| Locality | `pass` | Local Qwen behavior stays under `src/state/**`, `src/commands/qwen-review.ts`, `src/commands/land-check.ts`, and focused test fixtures. |
| Failure clarity | `pass` | Missing, malformed, unavailable, nonzero, timed out, inconclusive, dirty, stale, blocked, unresolved, and missing-evidence paths fail closed with clear messages. |
| No role erosion | `pass` | Local Qwen is a read-only adversarial reviewer and cannot become Writer, Landing Agent, operator, UAT approver, or hidden product decision maker. |
| Improvement capture | `pass` | Runtime timeout and review-packet lessons were repaired or recorded as explicit bootstrap/no-action dispositions for this slice. |

## Stage-Rubric Disposition

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 4, active work `BANDIT-006`, and the next post-closeout action. |
| Stage 1: Work-Item Brief And Spec | `pass` | `brief.md` records the slice contract, clean-code read evidence, bootstrap gaps, expected files, smell triggers, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `red-evidence.md` records the Test Writer-owned RED suite and acceptance-criteria mapping. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `implementation-evidence.md` records GREEN implementation scope, acceptance-criteria coverage, verification, repairs, and clean-code self-check. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | CodeRabbit, escalated reviewers, and Landing Agent remain unavailable; the live local Qwen route failed closed by timeout and is recorded as an explicit bootstrap gap. |
| Stage 5: Landing And UAT | `pass` | `landing-verdict.md` records safe-to-land bootstrap verdict and `landing-action.md` records final implementation source head `61279b0ffc9bade9e4eda1ee0b59e1874283a01b`; UAT is not applicable. |
| Stage 6: Retrospective And Improvement Capture | `pass` | `retrospective.md` records lessons and dispositions. |

## Stage 4 Verdict

`bootstrap_gap`

Local Qwen support is implemented and fails closed, but the configured live
local Qwen review timed out before returning structured findings. This is a
recorded bootstrap gap, not a pass.
