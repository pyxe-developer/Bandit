# BANDIT-009: Local Qwen Full-Packet Reliability

## Status

Bootstrap repair work item created on 2026-05-24. Production implementation has
not started.

## Goal

Make `bandit qwen-review <work-item-id>` return valid structured reviewer JSON
for real Bandit review packets through the repo-backed local Qwen baseline
reviewer route, or prove with evidence that Mastra Code is the wrong harness
substrate for this contract while preserving oMLX as the local model endpoint.

## Non-Product Work

This is a Phase 4 baseline-reviewer reliability repair. `BANDIT-008` proved the
corrected Mastra Code/oMLX route can handle a small prompt but remains
inconclusive for a full Bandit review packet. Because local Qwen is the baseline
adversarial reviewer for every PR, this gap blocks escalated-review placeholder
work and any claim that the pre-landing review loop is enforceable.

## Origin

- `docs/work/BANDIT-008/local-qwen-review.md` records that
  `npm run bandit -- qwen-review BANDIT-008` reached Mastra Code/oMLX but
  failed closed with `Local Qwen reviewer output was inconclusive`.
- Direct subprocess evidence from `BANDIT-008` showed Mastra Code selected
  `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`, avoided the previous hidden
  Google-key dependency, returned valid output for a small prompt, and returned
  an empty JSON envelope for the full review packet.
- `docs/roadmap/CURRENT_CONTEXT.md` and `docs/roadmap/ROADMAP.md` identify
  full-packet reliability as the next blocking Phase 4 gap.

## Scope

- Add RED evidence that captures the current full-packet failure mode without
  requiring a live model in deterministic tests.
- Diagnose the full review packet path, including packet size, prompt shape,
  stdin transport, Mastra Code invocation, timeout behavior, output envelope
  parsing, and reviewer JSON extraction.
- Implement the smallest repair that lets `bandit qwen-review <work-item-id>`
  return structured reviewer JSON for real Bandit packets through the local
  oMLX endpoint.
- If evidence proves Mastra Code cannot satisfy this full-packet contract,
  record the proof and reroute the harness layer to a narrower local
  OpenAI-compatible invocation path while keeping oMLX at
  `http://127.0.0.1:8000/v1` as the local model endpoint.
- Preserve fail-closed behavior for empty output, malformed JSON, pass verdicts
  with findings, stale source evidence, dirty worktrees, and unavailable local
  review.
- Keep the command contract as `bandit qwen-review <work-item-id>`.
- Update review evidence, roadmap context, and closeout artifacts so the
  remaining baseline-reviewer status is clear to a cold session.

## Out Of Scope

- Escalated adversarial reviewer placeholder behavior.
- Final Landing Agent behavior.
- UAT artifacts or stale-UAT policy.
- PR merge automation.
- Live CodeRabbit/GitHub polling or repair orchestration.
- Workflow cockpit or SQLite indexing.
- Paid-model reviewer routing.
- Replacing the local oMLX endpoint with Qwen Code CLI, Ollama, cloud models,
  or hidden global Mastra Code settings.
- Broad refactors of the CLI, artifact schemas, or review pipeline beyond what
  the full-packet reliability repair requires.

## Acceptance Criteria

1. RED evidence demonstrates the current full-packet failure mode or a faithful
   deterministic fixture equivalent before production implementation changes.
2. The implementation preserves the repo-native local reviewer route:
   `provider: mastra-code` unless evidence proves Mastra Code cannot satisfy
   the contract, and `provider_base_url: http://127.0.0.1:8000/v1` either way.
3. `bandit qwen-review <work-item-id>` emits or writes a valid local Qwen
   review artifact containing structured reviewer JSON with a supported
   verdict, findings array, summary, confidence, source head, and source-drift
   status for a real Bandit work item.
4. Empty Mastra Code envelopes, missing reviewer text, malformed reviewer JSON,
   and unsupported reviewer fields fail closed with clear diagnostics.
5. Full-packet prompt construction is inspectable enough for a future agent to
   understand what source, artifacts, and instructions were sent to the
   reviewer without reconstructing intent from chat.
6. The repair does not weaken dirty-worktree refusal, stale-review detection,
   profile validation, local-provider validation, or pass-with-findings parsing.
7. Deterministic tests cover the repaired full-packet path and at least one
   fail-closed inconclusive-output path.
8. A live attempt of `npm run bandit -- qwen-review BANDIT-009` or another
   current real Bandit work item either succeeds with structured reviewer JSON
   through local oMLX or records precise evidence proving why the harness path
   must change.
9. `node --test test/local-qwen-review.test.mjs`, `npm test`,
   `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check`
   pass before landing.
10. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Test Plan

- Add focused RED tests in `test/local-qwen-review.test.mjs` or the nearest
  existing local reviewer test file for:
  - full-packet fixture output that currently becomes inconclusive;
  - empty Mastra Code JSON-envelope output failing closed with a useful
    diagnostic;
  - repaired reviewer JSON extraction from full-packet output;
  - preservation of local provider/profile validation.
- Run the focused tests before implementation and record RED output in
  `docs/work/BANDIT-009/red-evidence.md`.
- Implement the smallest production change needed to make focused tests pass.
- Run focused tests, full tests, typecheck, Bandit validation, and
  `git diff --check`.
- Run a live local oMLX review attempt if the local service is available, and
  record the result without treating inconclusive review as a pass.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item.
The acceptance criteria make clean-code compliance evaluable through narrow
scope, explicit local-provider authority, fail-closed behavior, testable output
parsing, readable prompt construction, and preserved role boundaries.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` show Phase 4, no active work before this brief, `BANDIT-008` landing-action evidence, and full-packet local Qwen reliability as the next action. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | Required before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | This work item repairs the local baseline review gate; CodeRabbit live polling, escalated review, and Landing Agent are still bootstrap-limited. |
| Stage 5: Landing And UAT | `bootstrap_gap` | UAT is not applicable to this workflow-infrastructure repair; Landing Agent does not exist yet. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Escalation Plan

- **Weak refusal path:** Empty or malformed reviewer output must fail closed.
- **Hidden state mutation or hidden authority:** Global Mastra Code settings,
  cloud providers, Qwen Code CLI, and Ollama must not silently own the baseline
  local reviewer route.
- **Large orchestration function:** Packet construction, process invocation,
  parsing, artifact writes, and validation should remain separable enough for
  focused tests and review.
- **Passing tests with unclear spec compliance:** Tests must map to the full
  packet contract, not only small-prompt smoke behavior.
- **Escalation plan:** This repair uses Codex PM-owned routing. Escalated
  reviewer work remains queued until the baseline local reviewer can handle
  real packets or a recorded harness reroute decision replaces Mastra Code.

## Bootstrap Gaps

- Live local review depends on the oMLX service and model availability.
- Live CodeRabbit polling, escalated adversarial review, Landing Agent, UAT
  artifacts, and cockpit remain unavailable.
- If the local model cannot produce stable full-packet output within available
  local runtime constraints, the result must be recorded as an explicit harness
  substrate finding rather than hidden behind a pass.

## Expected Files

- `.bandit/reviewers/local-qwen.json`
- `.bandit/reviewers/mastracode-local-qwen.settings.json`
- `src/commands/qwen-review.ts` or the current local reviewer command module
- `src/state/reviewer-profiles.ts`
- `test/local-qwen-review.test.mjs`
- `docs/work/BANDIT-009/red-evidence.md`
- `docs/work/BANDIT-009/implementation-evidence.md`
- `docs/work/BANDIT-009/local-qwen-review.md`
- `docs/work/BANDIT-009/review-evidence.md`
- `docs/work/BANDIT-009/landing-verdict.md`
- `docs/work/BANDIT-009/landing-action.md`
- `docs/work/BANDIT-009/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect the current local Qwen command, packet construction, and parser
   boundaries.
2. Add focused RED tests or fixtures that represent the full-packet failure.
3. Run the focused RED tests and record evidence.
4. Diagnose whether the failure is packet shape, size, timeout, process
   transport, Mastra Code output behavior, or parser extraction.
5. Implement the smallest repair or recorded harness reroute.
6. Run focused and full verification.
7. Run a live local oMLX full-packet attempt if available.
8. Record implementation, review, landing, retrospective, and context evidence.

## Operator Input Status

No operator input is required before RED evidence or implementation. Repo
artifacts define the technical routing decision: repair or evidence-backed
reroute of the baseline local Qwen full-packet path while preserving oMLX as
the local model endpoint.
