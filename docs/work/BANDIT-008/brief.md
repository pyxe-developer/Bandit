# BANDIT-008: Local Reviewer Runtime Drift Repair

## Status

Repair chore created on 2026-05-24. Production implementation has not started.

## Non-Product Work

Repair Bandit's baseline local reviewer runtime contract after discovering that
`BANDIT-006` implemented `Bandit -> Qwen Code CLI -> Ollama` even though the
spike evidence preserved the Mastra-family path with local OpenAI-compatible
providers and the operator clarified that oMLX at `http://127.0.0.1:8000/v1`
is the expected faster local endpoint.

## Origin

- Operator correction on 2026-05-24: the spike settled on Mastra Code/oMLX
  direction, not Qwen Code CLI.
- Source evidence:
  `/Users/matthewflebbe/sourmash/docs/spikes/harness-evaluation/mastra-code/verdict.md`.
- Provider evidence:
  `/Users/matthewflebbe/sourmash/docs/spikes/harness-evaluation/mastra-code/config/provider-profiles.json`.
- Current drift:
  `.bandit/reviewers/local-qwen.json` invokes `qwen` against
  `http://localhost:11434/v1` and model `qwen3.6:35b-a3b-coding-mxfp8`.

## Scope

- Update the repo-native local Qwen baseline reviewer profile so its runtime
  path uses `mastracode` with the Mastra Code custom provider model
  `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`.
- Record the oMLX local OpenAI-compatible endpoint
  `http://127.0.0.1:8000/v1` as explicit provider evidence in the profile.
- Add fail-closed profile validation that rejects the drifted Qwen Code CLI /
  Ollama route for the baseline local reviewer.
- Keep the existing `bandit qwen-review <work-item-id>` command shape for now,
  but make it execute the corrected Mastra Code/oMLX command from the profile.
- Preserve deterministic tests by using fixture commands in temp repos.
- Run a live Mastra Code/oMLX smoke through Bandit's reviewer command if the
  local service is available; otherwise record a precise bootstrap gap.
- Update roadmap/current context so the next post-repair step returns to the
  Phase 4 escalated adversarial reviewer placeholder.

## Out Of Scope

- Full Mastra Code Harness streaming subagent implementation.
- Protocol-level Mastra A2A implementation.
- Rebuilding Bandit's reviewer command around Mastra Agent APIs.
- Changing work-item artifact schemas beyond fields needed to identify the
  corrected provider path.
- Live CodeRabbit polling, UAT, Landing Agent, PR merge automation, cockpit, or
  SQLite indexing.
- Deleting historical `BANDIT-006`/`BANDIT-007` timeout evidence.

## Acceptance Criteria

1. `.bandit/reviewers/local-qwen.json` no longer uses `qwen` as the executable.
2. `.bandit/reviewers/local-qwen.json` no longer points at the Ollama
   `http://localhost:11434/v1` or `http://127.0.0.1:11434/v1` endpoint.
3. The baseline profile records `provider: mastra-code`.
4. The baseline profile records `provider_base_url: http://127.0.0.1:8000/v1`.
5. The baseline profile records model
   `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`.
6. The profile command executes `mastracode` with `--model
   omlx-local/Qwen3.6-35B-A3B-MLX-8bit`, `--output-format json`, and an
   explicit prompt placeholder. The implementation may pass Bandit's long
   review packet through stdin when the profile uses `{{prompt_stdin}}`.
7. `bandit validate` fails closed when a local Qwen profile uses the drifted
   Qwen Code CLI route.
8. `bandit validate` fails closed when a Mastra Code profile omits provider
   metadata or uses the wrong local provider endpoint.
9. Existing deterministic fixture reviewer tests continue to pass.
10. `bandit qwen-review <work-item-id>` can parse Mastra Code JSON-envelope
    output containing reviewer JSON in the `text` field.
11. `node --test test/local-qwen-review.test.mjs`, `npm test`,
    `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check`
    pass before landing.
12. A live `npm run bandit -- qwen-review BANDIT-008` attempt either passes
    through Mastra Code/oMLX or records a precise bootstrap gap without
    treating unavailable review as a pass.

## Verification Plan

- Add RED tests in `test/local-qwen-review.test.mjs`:
  - validator rejects the drifted Qwen Code CLI / Ollama profile;
  - validator rejects a Mastra Code profile with the wrong provider endpoint;
  - committed profile uses the spike-backed Mastra Code/oMLX route;
  - command parsing accepts Mastra Code `--output-format json` envelopes.
- Run the focused RED tests and record expected failures.
- Implement the smallest profile and validator changes to pass.
- Run focused and full local verification.
- Run live `npm run bandit -- qwen-review BANDIT-008` after committing the
  implementation source head, if the worktree is clean.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this repair chore.
The acceptance criteria make clean-code compliance evaluable through small
surface area, explicit provider state, fail-closed validation, testable command
parsing, and preserved role boundaries.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` showed `BANDIT-007` landed and no active work. Operator correction makes this repair chore the next safe step before `BANDIT-008` escalated-reviewer work. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code evidence, expected files, implementation order, bootstrap gaps, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | Required before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production code in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live external review gates remain bootstrap-limited; this chore repairs the local baseline reviewer path. |
| Stage 5: Landing And UAT | `bootstrap_gap` | Landing Agent and UAT artifacts do not exist; UAT is not applicable to this workflow-infrastructure repair. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Bootstrap Gaps

- Mastra Code Harness streaming subagent and protocol-level A2A remain unproven
  per the spike verdict.
- Live Mastra Code/oMLX review depends on the local oMLX service and model
  availability.
- Escalated adversarial reviewer and Landing Agent remain unavailable.
- UAT is not applicable.

## Expected Files

- `.bandit/reviewers/local-qwen.json`
- `src/state/reviewer-profiles.ts`
- `test/local-qwen-review.test.mjs`
- `docs/work/BANDIT-008/red-evidence.md`
- `docs/work/BANDIT-008/implementation-evidence.md`
- `docs/work/BANDIT-008/local-qwen-review.md`
- `docs/work/BANDIT-008/review-evidence.md`
- `docs/work/BANDIT-008/landing-verdict.md`
- `docs/work/BANDIT-008/landing-action.md`
- `docs/work/BANDIT-008/retrospective.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Add RED tests for profile drift and Mastra Code JSON-envelope parsing.
2. Run the focused tests and record RED evidence.
3. Update profile validation to require the spike-backed Mastra Code/oMLX route.
4. Update the committed local Qwen baseline profile.
5. Run focused and full verification.
6. Commit implementation source head.
7. Run live Mastra Code/oMLX reviewer command against `BANDIT-008` if available.
8. Record implementation, review, landing, retrospective, and context evidence.

## Operator Input Status

No further operator input is required. The operator supplied the missing runtime
direction and endpoint: use oMLX at `http://127.0.0.1:8000/v1` rather than the
Qwen Code CLI / Ollama route.
