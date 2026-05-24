# BANDIT-008 RED Evidence

## Command

```sh
node --test test/local-qwen-review.test.mjs
```

## Result

Status: expected RED failure.

The focused test run executed 26 tests: 23 passed and 3 failed.

Expected failing assertions:

- `validate fails closed when the local Qwen profile uses the drifted Qwen Code CLI route`
  failed because `bandit validate` exited 0 instead of rejecting the
  `qwen`/Ollama route.
- `validate fails closed when the Mastra Code local Qwen profile uses the wrong
  provider endpoint` failed because `bandit validate` exited 0 instead of
  rejecting `http://127.0.0.1:11434/v1`.
- `committed local Qwen baseline profile uses the spike-backed Mastra Code oMLX
  route` failed because the committed `.bandit/reviewers/local-qwen.json` did
  not record `provider: mastra-code`.

Relevant output:

```text
tests 26
pass 23
fail 3

0 !== 1
actual: 0
expected: 1

actual: undefined
expected: 'mastra-code'
```

## Acceptance Criteria Covered

- Validator rejects the drifted Qwen Code CLI / Ollama route.
- Validator rejects the wrong Mastra Code provider endpoint.
- Committed profile records the Mastra Code/oMLX provider route.
- Mastra Code JSON-envelope parsing remains covered and already passed in RED,
  proving parser behavior existed before the profile repair.
