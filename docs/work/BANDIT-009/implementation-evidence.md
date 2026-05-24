# Implementation Evidence: BANDIT-009

## Status

Implementation source is complete for the structured-findings repair and the
Mastra Code harness reroute. Live full-packet local oMLX review must run after
this source/evidence head is committed so `bandit qwen-review BANDIT-009` can
record current source evidence from a clean worktree.

## Changes

- `src/commands/qwen-review.ts`
  - Accepts reviewer findings as either non-empty strings or structured objects
    with a non-empty `issue` field.
  - Preserves optional reviewer `confidence` in executable evidence.
  - Formats object findings into a readable disposition while keeping the full
    structured finding available for evidence.
  - Continues to fail closed for malformed findings, pass verdicts with
    findings, unsupported verdicts, empty envelopes, and malformed JSON.
- `src/state/local-qwen-review.ts`
  - Writes `structured_findings_json` to repo-native local Qwen evidence.
  - Parses optional historical absence of `structured_findings_json` as an
    empty array for compatibility.
  - Fails closed when present structured findings are not a JSON array.
- `.bandit/reviewers/local-qwen.json`
  - Switches the baseline local Qwen provider from `mastra-code` to
    `omlx-openai-compatible`.
  - Keeps the source-of-truth local model endpoint at
    `http://127.0.0.1:8000/v1`.
  - Routes `bandit qwen-review <work-item-id>` through the repo-local
    `node bin/omlx-chat-completions.mjs {{prompt_stdin}}` command.
- `bin/omlx-chat-completions.mjs`
  - Reads the full review packet from stdin.
  - Posts directly to the local OpenAI-compatible
    `/v1/chat/completions` endpoint.
  - Emits a Mastra-compatible JSON envelope with `text` containing the
    reviewer JSON.
- `src/state/reviewer-profiles.ts`
  - Allows the direct `omlx-openai-compatible` provider while preserving
    rejection of Qwen Code CLI and Ollama drift.
  - Keeps committed-profile tests pinned to the direct local oMLX route.
- `test/local-qwen-review.test.mjs`
  - Adds RED/GREEN coverage for a real-packet Mastra Code envelope containing a
    structured blocker finding.
  - Adds RED/GREEN coverage for the direct local OpenAI-compatible command path
    with a fixture server.
  - Retains malformed object-finding fail-closed coverage by requiring
    structured findings to include `issue`.

## Acceptance Criteria Mapping

- AC1: `docs/work/BANDIT-009/red-evidence.md` records the failing focused test
  before implementation.
- AC2: The implementation keeps `provider_base_url:
  http://127.0.0.1:8000/v1` and switches the harness path only after live
  evidence showed Mastra Code remained inconclusive for the real packet while
  oMLX itself was reachable.
- AC3: `qwen-review` now writes structured findings into
  `structured_findings_json` for PM disposition.
- AC4: Empty or malformed reviewer output remains inconclusive; malformed
  structured findings still fail closed.
- AC5: Full-packet prompt transport coverage remains in
  `qwen-review can send the review prompt over stdin for long Mastra Code
  packets`.
- AC6: Dirty-worktree refusal, pass-with-findings rejection, profile validation,
  and local-provider validation still pass in the focused suite.
- AC7: Deterministic tests cover the repaired structured-findings path, the
  direct local OpenAI-compatible harness path, and the fail-closed
  malformed-structured-finding path.

## Verification

| Command | Result |
|---|---|
| `node --test test/local-qwen-review.test.mjs` | `pass` - 32/32 tests passed. |
| `npm test` | `pass` - 107/107 tests passed. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - `Bandit state is valid.` |
| `git diff --check` | `pass`. |

## Clean-Code Self-Check

- **Spec alignment:** The change implements the approved structured-findings
  path without broadening into escalated reviewer, Landing Agent, UAT, or
  cockpit behavior.
- **Small surface area:** The diff is limited to parser/evidence writing and
  focused tests.
- **Explicit state:** Structured findings are recorded in a named evidence
  field, `structured_findings_json`.
- **Failure clarity:** Malformed structured findings and inconclusive output
  still fail closed.
- **Role boundaries:** The command records reviewer output; PM disposition and
  landing decisions remain separate artifacts.

## Remaining Live Verification

Run `npm run bandit -- qwen-review BANDIT-009` after the direct oMLX
source/evidence head is committed and the worktree is clean. Record the result
in `docs/work/BANDIT-009/local-qwen-review.md` or as precise bootstrap/harness
evidence if the live direct oMLX full packet is still inconclusive.
