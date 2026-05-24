# RED Evidence: BANDIT-009

## Status

`pass` for Stage 2 RED evidence: the focused test fails for the intended
missing behavior before production implementation changes.

## Test Added

- `test/local-qwen-review.test.mjs`: `qwen-review preserves structured findings
  from a real-packet Mastra Code envelope`.

## Acceptance Criteria Mapping

- AC1: Captures the full-packet reliability failure with a deterministic Mastra
  Code JSON-envelope fixture.
- AC3: Requires structured reviewer JSON with a blocker finding to produce
  repo-native local Qwen review evidence.
- AC4: Preserves fail-closed behavior by still blocking landing on a blocker
  verdict.
- AC7: Adds focused deterministic coverage for the repaired full-packet path.

## RED Command

```sh
node --test test/local-qwen-review.test.mjs
```

## RED Result

The focused test suite failed with 30 passing tests and 1 failing test.

Expected failure:

```text
qwen-review preserves structured findings from a real-packet Mastra Code envelope
AssertionError: The input did not match the regular expression
/Local Qwen reviewer verdict blocks landing: blocker/.
Input:
'Local Qwen reviewer output was inconclusive\n'
```

## Interpretation

The current local Qwen parser rejects object-shaped reviewer findings and
collapses a structured Mastra Code full-packet response into a generic
inconclusive failure. This proves the current command cannot preserve
structured findings for PM disposition.

## Harness Reroute RED Evidence

After the structured-findings parser repair was committed at `b53472d`, a live
full-packet Mastra Code/oMLX run was attempted from a clean worktree:

```sh
npm run bandit -- qwen-review BANDIT-009
```

Result:

```text
Local Qwen reviewer output was inconclusive
```

The local oMLX endpoint itself was live at the time:

```sh
curl -sS --max-time 10 http://127.0.0.1:8000/v1/models
```

Returned model list included `Qwen3.6-35B-A3B-MLX-8bit`.

This proves the remaining failure is in the Mastra Code harness path for real
Bandit packets, not in oMLX reachability. A second RED test,
`direct oMLX command posts stdin packets to the local OpenAI-compatible
endpoint`, initially failed because the repo had no direct local
OpenAI-compatible command path and validation still required the Mastra Code
provider.

## Test Ownership

This is Test Writer-owned RED evidence for `BANDIT-009`. Production
implementation may update command parsing and evidence writing to satisfy the
test, but must not weaken this assertion without an explicit test-change
disposition in the work item.
