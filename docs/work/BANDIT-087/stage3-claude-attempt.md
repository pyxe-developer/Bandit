# BANDIT-087 Stage 3 Claude Attempt

## Status

`blocked_fallback_used`

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

Claude returned a session-limit error before any Stage 3 dispatch:

```text
You've hit your session limit - resets 10:40pm (America/New_York)
```

No source files, tests, Stage 3 delivery artifacts, review artifacts, landing
artifacts, UAT artifacts, retrospective artifacts, routing files, or canonical
policy files were edited by Claude.

## Disposition

The Work Item PM prompt authorizes MiniMax-M3 fallback when Claude auth fails
or cannot run Stage 3. Stage 3 will route to MiniMax-M3 through headless `pi`
with the same Stage 3 write-surface restrictions and zero test-edit authority.
