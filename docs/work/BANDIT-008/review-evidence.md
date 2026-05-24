# BANDIT-008 Review Evidence

contract_version: 1
work_item: BANDIT-008
source_head: 9edab178bad9c9cafa9e939f724b86faec261e35
verification_state: pass
verification_evidence:
  - `node --test test/local-qwen-review.test.mjs`: pass, 30/30 tests.
  - `npm test`: pass, 105/105 tests.
  - `npm run typecheck`: pass.
  - `npm run bandit -- validate`: pass, `Bandit state is valid.`
  - `git diff --check`: pass.
coderabbit_state: bootstrap_gap
coderabbit_replacement_evidence:
  - No PR exists for this bootstrap repair chore; deterministic tests and PM review replace live CodeRabbit during bootstrap.
local_qwen_state: bootstrap_gap
local_qwen_replacement_evidence:
  - `docs/work/BANDIT-008/local-qwen-review.md` records the corrected Mastra Code/oMLX route and the live full-packet inconclusive output.
  - Focused tests cover drift rejection, repo-local settings, stdin prompt delivery, JSON-envelope parsing, and false-pass refusal.
escalated_review_required: true
escalated_review_state: bootstrap_gap
escalated_review_rationale: Runtime-routing, local-reviewer, external-harness, provider-drift, and output-contract smells apply. Escalated reviewer substrate remains the next Phase 4 gap; deterministic tests and PM review replace unavailable escalated reviewers during bootstrap.
pm_disposition: pass
operator_input_status: none_required
uat_status: not_applicable
clean_code_status: pass
source_drift_status: current
bootstrap_gaps:
  - Live CodeRabbit review unavailable during bootstrap.
  - Live local Qwen review reaches Mastra Code/oMLX but is inconclusive for the full BANDIT-008 review packet.
  - Escalated adversarial reviewer unavailable until the next Phase 4 work item.
  - Landing Agent unavailable; manual Codex PM review replaces it during bootstrap.
  - UAT artifacts unavailable until Phase 5 and not applicable to this workflow-infrastructure repair.

## Scope

This evidence covers Stage 4: Review And Cross-Model Gates for `BANDIT-008`
Local Reviewer Runtime Drift Repair.

The review applies to final implementation source head
`9edab178bad9c9cafa9e939f724b86faec261e35`.

## PM Review Findings

| Finding | Disposition |
|---|---|
| The initial repair correctly moved the profile from `qwen`/Ollama to `mastracode`/oMLX, but Mastra Code's default observational-memory sidecar still tried to use `google/gemini-2.5-flash`. | Repaired with `.bandit/reviewers/mastracode-local-qwen.settings.json`, which keeps the Bandit reviewer path local and avoids requiring `GOOGLE_GENERATIVE_AI_API_KEY`. |
| Passing the full review packet as a CLI argument was brittle for long packets. | Repaired with explicit `{{prompt_stdin}}` transport and fixture coverage. |
| Qwen could return `verdict: pass` with non-empty object findings. | Repaired by tightening the prompt and parser: pass requires `findings: []`, and findings must be strings. |
| Live Mastra Code/oMLX still returns an empty/inconclusive envelope for the full 28k-character BANDIT-008 packet. | Accepted only as a bootstrap gap; it is recorded in `local-qwen-review.md` and not treated as a pass. |

## Clean-Code Landing Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | The implementation repairs the baseline local reviewer route without adding full Harness streaming, A2A, UAT, cockpit, PR merge automation, or paid-model routing. |
| Small surface area | `pass` | Changes are limited to profile/settings, validation, prompt transport, output parsing, focused tests, and evidence/context updates. |
| Simple design | `pass` | Uses explicit JSON config and one stdin placeholder rather than hidden shell wrappers or global environment requirements. |
| Explicit state | `pass` | Provider, endpoint, model, settings path, prompt transport, verification, and bootstrap gaps are repo-native. |
| No hidden authority | `pass` | Bandit's baseline reviewer does not depend on global Mastra Code settings or a Google API key. |
| Testable behavior | `pass` | Focused and full deterministic tests passed; live inconclusive output is recorded as a gap. |
| Readable flow | `pass` | Profile validation, command preparation, and output parsing stay in clear named functions. |
| Locality | `pass` | No unrelated refactors or source-of-truth moves were included. |
| Failure clarity | `pass` | Drift, wrong endpoint, missing settings args, invalid output, dirty worktree, nonzero reviewer exits, and inconclusive output fail closed. |
| No role erosion | `pass` | Local Qwen remains review evidence only, not UAT, writer, or Landing Agent authority. |
| Improvement capture | `pass` | The OM dependency and full-packet inconclusive behavior are recorded as bootstrap gaps and roadmap context. |

## Stage-Rubric Disposition

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `BANDIT-007` was landed before this repair chore began; operator correction made this repair the next safe step. |
| Stage 1: Work-Item Brief And Spec | `pass` | `brief.md` records scope, acceptance criteria, clean-code read evidence, bootstrap gaps, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `red-evidence.md` records expected failures for route drift and wrong provider endpoint. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `implementation-evidence.md` records implementation scope, verification, live-review evidence, and clean-code self-check. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live local Qwen is correctly routed but inconclusive for the full review packet; CodeRabbit and escalated reviewers remain unavailable. |
| Stage 5: Landing And UAT | `pass` | `landing-verdict.md` records a bootstrap safe-to-land verdict; UAT is not applicable. |
| Stage 6: Retrospective And Improvement Capture | `pass` | `retrospective.md` records repaired lessons, explicit bootstrap gaps, and no-action dispositions. |

## Stage 4 Verdict

`bootstrap_gap`

The repair removed the wrong Qwen Code/Ollama route and the Google-key OM
dependency from Bandit's baseline reviewer profile. The remaining full-packet
live review is inconclusive and is recorded as a bootstrap gap, not a pass.
