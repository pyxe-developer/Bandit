# BANDIT-008 Retrospective

## Outcome

BANDIT-008 repaired the local Qwen baseline reviewer runtime route. The
reviewer profile now uses Mastra Code against the local oMLX OpenAI-compatible
endpoint instead of Qwen Code CLI or Ollama, passes the full review prompt over
stdin, uses repo-local Mastra Code settings to avoid hidden Google-key
observational-memory behavior, and fails closed on invalid reviewer output.

The final implementation source head is
`9edab178bad9c9cafa9e939f724b86faec261e35`.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| The spike/source-of-truth route and operator correction must override accidental implementation drift toward Qwen Code CLI or Ollama. | No-action decision | Repaired inside this chore with `.bandit/reviewers/local-qwen.json`, validator checks, tests, and context updates. |
| Mastra Code global settings can introduce hidden non-local dependencies, including observational-memory requests that require `GOOGLE_GENERATIVE_AI_API_KEY`. | No-action decision | Repaired inside this chore with `.bandit/reviewers/mastracode-local-qwen.settings.json` and validator checks requiring the repo-local settings argument. |
| Long review packets should not be delivered as one large CLI argument. | No-action decision | Repaired inside this chore with explicit `{{prompt_stdin}}` transport and focused tests. |
| A reviewer output contract must not treat `verdict: pass` plus findings as a pass. | No-action decision | Repaired inside this chore with a stricter prompt, parser checks, and fail-closed tests for pass-with-findings and object findings. |
| Full-packet Mastra Code/oMLX review still returns an empty or inconclusive output envelope for the BANDIT-008 packet. | Bootstrap gap | Recorded in `local-qwen-review.md`, `review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and roadmap context. The corrected local route is proven by a small-prompt smoke, but full review remains a gap, not a pass. |

## Cross-Model Tension

None. Live local Qwen did not return structured review findings for the full
packet, so no substantive cross-model disagreement was produced.

## Improvement Chores

None created before landing. Material lessons were either repaired in-slice or
recorded as explicit bootstrap gaps. After operator review, the remaining
full-packet Mastra Code/oMLX inconclusive behavior is not a deferrable cleanup
item: it is the next Phase 4 blocking gap because local Qwen is the baseline
adversarial reviewer for every PR.
