# BANDIT-008 Implementation Evidence

## Status

GREEN implementation completed on 2026-05-24.

Final implementation source head:
`9edab178bad9c9cafa9e939f724b86faec261e35`.

## Scope Implemented

- Repaired `.bandit/reviewers/local-qwen.json` to use `mastracode` instead of
  the drifted `qwen` CLI.
- Added explicit profile metadata for `provider: mastra-code`,
  `provider_base_url: http://127.0.0.1:8000/v1`, and model
  `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`.
- Added `.bandit/reviewers/mastracode-local-qwen.settings.json` so Bandit's
  reviewer path uses the local oMLX provider and does not require
  `GOOGLE_GENERATIVE_AI_API_KEY`.
- Extended local Qwen profile validation to fail closed on Qwen Code CLI,
  Ollama endpoints, wrong provider metadata, missing Mastra Code settings, and
  missing prompt placeholders.
- Added `{{prompt_stdin}}` support so long Bandit review packets can be sent to
  Mastra Code through stdin.
- Hardened reviewer output parsing so `pass` requires `findings: []` and
  findings must be strings.
- Added deterministic coverage for the repaired profile route, settings file,
  stdin prompt delivery, Mastra Code JSON-envelope parsing, and false-pass
  output refusal.

## Acceptance Criteria Coverage

| Criteria | Evidence |
|---|---|
| AC1-AC2 | `.bandit/reviewers/local-qwen.json` no longer uses `qwen` or Ollama endpoints. |
| AC3-AC5 | The profile records `provider: mastra-code`, `provider_base_url: http://127.0.0.1:8000/v1`, and `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`. |
| AC6 | The profile executes `mastracode` with repo-local settings, the oMLX model, JSON output, thinking off, timeout, and `{{prompt_stdin}}`. |
| AC7-AC8 | `src/state/reviewer-profiles.ts` rejects the drifted Qwen Code/Ollama route and wrong provider endpoint. |
| AC9 | Existing fixture reviewer tests pass with updated profile metadata. |
| AC10 | `qwen-review parses Mastra Code JSON envelope output` covers `text` envelope parsing. |
| AC11 | Focused and full verification passed; commands are recorded below. |
| AC12 | Live `npm run bandit -- qwen-review BANDIT-008` reached Mastra Code/oMLX but returned inconclusive output for the full review packet; this is recorded as a bootstrap gap in `local-qwen-review.md`. |

## Verification

| Command | Result |
|---|---|
| `node --test test/local-qwen-review.test.mjs` | `pass` - 30/30 tests. |
| `npm test` | `pass` - 105/105 tests. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - `Bandit state is valid.` |
| `git diff --check` | `pass`. |

## Live Reviewer Evidence

| Command | Result |
|---|---|
| `npm run bandit -- qwen-review BANDIT-008` before repo-local settings | `bootstrap_gap` - failed closed because Mastra Code observational memory attempted `google/gemini-2.5-flash` and required `GOOGLE_GENERATIVE_AI_API_KEY`. |
| Direct Mastra Code smoke with repo-local settings | `pass` - small prompt returned a JSON envelope through `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`. |
| `npm run bandit -- qwen-review BANDIT-008` after repo-local settings and strict output contract | `bootstrap_gap` - failed closed with `Local Qwen reviewer output was inconclusive`; direct capture showed an empty Mastra Code JSON envelope for the full review packet. |

## Clean-Code Self-Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | The repair follows the operator-corrected Mastra Code/oMLX direction without broadening into full Mastra Harness streaming, A2A, UAT, cockpit, or Landing Agent work. |
| Small surface area | `pass` | The diff is limited to the reviewer profile/settings, profile validation, command prompt transport, output parsing, tests, and work evidence. |
| Simple design | `pass` | The profile remains repo-native JSON; the settings file is a small Mastra Code config; stdin transport is a single explicit placeholder. |
| Explicit state | `pass` | Provider, endpoint, settings path, model, prompt transport, timeout, and bootstrap gaps are visible in repo artifacts. |
| No hidden authority | `pass` | Mastra Code settings are repo-native for this reviewer path; no global Google key is required for Bandit's baseline review contract. |
| Testable behavior | `pass` | Focused tests cover drift rejection, committed profile shape, settings content, stdin prompt delivery, envelope parsing, and invalid reviewer output. |
| Readable flow | `pass` | Profile validation, command preparation, reviewer execution, and output parsing remain separate named functions. |
| Locality | `pass` | Changes stay in the local Qwen reviewer profile, reviewer command, profile validator, and focused fixtures. |
| Failure clarity | `pass` | Drifted routes, missing settings args, missing placeholders, nonzero reviewer exits, timeout, invalid output, and false-pass output fail closed. |
| No role erosion | `pass` | The reviewer remains read-only review evidence; it does not edit files, approve UAT, or become the Landing Agent. |
| Improvement capture | `pass` | The Mastra Code OM dependency and full-packet inconclusive output are recorded as durable bootstrap gaps and roadmap context. |

## Bootstrap Gaps

- Live full-packet `bandit qwen-review BANDIT-008` reaches Mastra Code/oMLX but
  returns an empty/inconclusive envelope for the current 28k-character review
  packet.
- Mastra Code Harness streaming subagent and protocol-level A2A remain unproven
  and out of scope for this repair chore.
- Live CodeRabbit polling, escalated adversarial reviewer, and Landing Agent
  remain unavailable.
- UAT is not applicable to this workflow-infrastructure repair.
