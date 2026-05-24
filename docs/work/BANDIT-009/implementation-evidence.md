# Implementation Evidence: BANDIT-009

## Status

Implementation source is complete for the deterministic structured-findings
repair. Live full-packet local oMLX review must run after this source/evidence
head is committed so `bandit qwen-review BANDIT-009` can record current source
evidence from a clean worktree.

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
- `test/local-qwen-review.test.mjs`
  - Adds RED/GREEN coverage for a real-packet Mastra Code envelope containing a
    structured blocker finding.
  - Retains malformed object-finding fail-closed coverage by requiring
    structured findings to include `issue`.

## Acceptance Criteria Mapping

- AC1: `docs/work/BANDIT-009/red-evidence.md` records the failing focused test
  before implementation.
- AC3: `qwen-review` now writes structured findings into
  `structured_findings_json` for PM disposition.
- AC4: Empty or malformed reviewer output remains inconclusive; malformed
  structured findings still fail closed.
- AC5: Full-packet prompt transport coverage remains in
  `qwen-review can send the review prompt over stdin for long Mastra Code
  packets`.
- AC6: Dirty-worktree refusal, pass-with-findings rejection, profile validation,
  and local-provider validation still pass in the focused suite.
- AC7: Deterministic tests cover the repaired structured-findings path and the
  fail-closed malformed-structured-finding path.

## Verification

| Command | Result |
|---|---|
| `node --test test/local-qwen-review.test.mjs` | `pass` - 31/31 tests passed. |
| `npm test` | `pass` - 106/106 tests passed. |
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

Run `npm run bandit -- qwen-review BANDIT-009` after the implementation
source/evidence head is committed and the worktree is clean. Record the result
in `docs/work/BANDIT-009/local-qwen-review.md` or as precise bootstrap/harness
evidence if the live Mastra Code/oMLX full packet is still inconclusive.
