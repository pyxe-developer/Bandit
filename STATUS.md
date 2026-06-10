# Current Context

## Last Updated: 2026-06-10

## Current Work Item: BANDIT-092

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-092` is the fourth `BANDIT-PRD-004` implementation slice: Boundary
Cell Movement Gate. The current stage is Stage 4: blocked on Local Qwen
reviewer availability.

Next action: Operator must restore the authorized Local Qwen oMLX
OpenAI-compatible endpoint, then Work Item PM should rerun
`node ./bin/bandit.mjs qwen-review BANDIT-092`.

Required operator input: restore the Local Qwen endpoint configured by
`.bandit/reviewers/local-qwen.json` so `bin/omlx-chat-completions.mjs` returns
chat-completions responses instead of `404 Not Found`. The operator approved
prioritizing `BANDIT-PRD-004` and `BANDIT-PRD-005` before `WIL-V0-TRIAL` on
2026-06-10.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-092` - Boundary Cell Movement Gate (Stage 4 blocked on Local Qwen)
- `BANDIT-091` - Escape Candidate Workflow (closed)
- `BANDIT-090` - Attribution Join Key Wiring (closed)
- `BANDIT-089` - Trust Boundary Evidence Schema Contracts (closed)
- `BANDIT-088` - Installed-Copy Update Path (closed)
