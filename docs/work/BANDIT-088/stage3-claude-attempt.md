# BANDIT-088 Stage 3 Claude Attempt

contract_version: 1
work_item: BANDIT-088
stage: Stage 3 implementation
attempted_at: 2026-06-10T02:25:14Z
writer_route: claude-sonnet-4-6
verdict: unavailable

## Command

```sh
printf 'Reply exactly OK.\n' | timeout 90 claude -p \
  --model claude-sonnet-4-6 \
  --output-format json \
  --no-session-persistence \
  --permission-mode dontAsk \
  --tools ""
```

## Result

The Claude smoke/auth check exited non-zero with a provider session-limit
response:

```text
api_error_status: 429
result: You've hit your session limit - resets 10:40pm (America/New_York)
```

## Disposition

This is an allowed immediate fallback condition under the `BANDIT-088`
orchestration plan. Stage 3 implementation routes to MiniMax-M3 via headless
`pi` as the different-model-family fallback. No Claude Stage 3 edits were made.
