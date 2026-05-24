# BANDIT-009 Retrospective

## Outcome

BANDIT-009 repaired the baseline local Qwen full-packet reliability gap. The
review command now preserves structured findings, records them in repo-native
evidence, and routes the live baseline reviewer through a direct local
OpenAI-compatible oMLX command instead of Mastra Code. The live full-packet
review passed at source head `8634d256eb1409e7c31f5b9baf74223480745167`.

## Lessons And Dispositions

| Lesson | Classification | Disposition |
|---|---|---|
| Mastra Code could reach oMLX for small prompts but remained inconclusive for real Bandit review packets. | No-action decision | Repaired in-slice by switching the baseline harness path to `bin/omlx-chat-completions.mjs` while keeping oMLX as the local model endpoint. |
| Reviewer findings must preserve structure for PM disposition instead of being collapsed into generic inconclusive output. | No-action decision | Repaired in-slice with structured finding parsing, `structured_findings_json`, and focused tests. |
| Evidence-only commits can hide implementation diffs if the review packet uses the latest RED evidence commit as its diff base. | No-action decision | Repaired in-slice by preferring the previous slice landing head and parsing bootstrap `Final implementation source head` landing records. |

## Cross-Model Tension

Local Qwen first returned non-blocking findings and then blocker findings during
the repair loop. Codex PM accepted both as actionable because they identified
real stale-evidence and diff-base problems. After repair, local Qwen passed
with no findings.

## Improvement Chores

None created. All material lessons were repaired inside this slice and covered
by deterministic tests or explicit closeout evidence.
