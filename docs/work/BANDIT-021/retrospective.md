# BANDIT-021 Retrospective

## Outcome

`BANDIT-021` is landed as a bootstrap workflow-infrastructure chore.

The chore resolved `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND` by adding
`bandit artifact create <spec-path>`, a narrow CLI-owned path for creating
selected workflow artifacts from explicit JSON input. The command supports RED
evidence, implementation evidence, landing verdicts, and retrospectives;
refuses unsupported kinds, unsafe spec paths, unknown work items, and occupied
outputs before writes; records lifecycle evidence; and rolls back the created
artifact if lifecycle event append fails.

## What Worked

- Focused RED tests captured the missing `artifact create` command before
  implementation.
- The command stayed narrow and did not take over review automation, UAT,
  landing, heartbeat, cockpit, or arbitrary artifact authority.
- Local Qwen identified real maintainability and review-loop concerns that
  were repaired before landing.
- `review_subject_hash` allowed final Stage 4 evidence to remain current after
  terminal review and landing artifacts were written.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Artifact creation should be CLI-owned only for artifact families with stable input shape. | Durable artifact | `src/commands/artifact-create.ts` supports the four selected families and refuses unsupported kinds. |
| Markdown remains canonical even when JSON is used as explicit input. | Durable boundary | JSON specs are command inputs only; generated Markdown and `.bandit/events.jsonl` remain repo-native evidence. |
| Local Qwen Stage 4 prompts must not treat future landing and closeout artifacts as missing during review. | Durable artifact | `src/commands/qwen-review.ts` now tells the reviewer not to flag future-stage artifacts as missing unless current evidence claims they are complete. |
| Artifact writes and lifecycle event appends need a rollback path for partial failure. | Durable artifact | `artifact create` removes the just-created artifact if lifecycle event append fails. |
| Renderer code should stay separate from command orchestration once an artifact command owns multiple output families. | Durable artifact | Markdown rendering moved to `src/commands/artifact-create-renderers.ts`. |

## Improvement Chore

source_work_item: BANDIT-011
source_gap: BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND
linked_work_item: BANDIT-021
hypothesis: A narrow `bandit artifact create <spec-path>` command can create selected workflow evidence artifacts from explicit structured input while preserving repo-native Markdown authority and fail-closed behavior.
metric: Supported artifacts can be created from explicit JSON specs with deterministic output paths, no overwrite behavior, safe path refusal, lifecycle event evidence, valid `bandit validate` output, and successful focused and full test verification.
baseline: RED, implementation, landing, retrospective, and follow-up artifacts were manually authored unless a specialized command existed for that workflow step.
evaluation_window: `BANDIT-021` closeout and the next bootstrap-gap chore that needs a supported artifact family.
status: resolved
outcome: keep
outcome_evidence:
  - `node --test test/artifact-create.test.mjs test/local-qwen-review.test.mjs` passed 40 focused tests after the Stage 4 repair loop.
  - `npm test` passed 183 tests.
  - `npm run typecheck` passed.
  - `npm run bandit -- validate` passed.
  - `npm run bandit -- gaps list` passed.
  - `npm run bandit -- qwen-review BANDIT-021` passed.
  - `npm run bandit -- land-check BANDIT-021` passed.
  - `npm run bandit -- auto-land-check BANDIT-021` passed.
  - `npm run bandit -- land BANDIT-021 --action local-record` recorded landing action evidence.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-021`.

Local Qwen initially returned `non_blocking` findings around file cohesion,
temporary spec clutter, review-loop prompt expectations, lifecycle rollback,
path strictness, and landing-verdict scalar validation. Codex PM accepted the
findings as useful hardening, repaired them, and reran Local Qwen to `pass`.
CodeRabbit was unavailable because this local-record bootstrap chore had no PR
context; review evidence records that as explicit replacement evidence rather
than claiming a CodeRabbit pass.

## Bootstrap Gap Disposition

`BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND` is resolved.

Future creation of the supported artifact families should use
`bandit artifact create <spec-path>` when the required structured input exists.
Unsupported artifact families remain manual or future-scope until their input
contracts stabilize.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
