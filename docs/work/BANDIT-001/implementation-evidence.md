# BANDIT-001 Implementation Evidence

## Summary

Implemented the Phase 1 repo-native CLI skeleton:

- `bandit init`
- `.bandit/config.toml`
- `.bandit/events.jsonl`
- `bandit validate`
- `bandit list`
- `bandit show <work-item-id>`

The executable entrypoint is `bin/bandit.mjs`, with local invocation through:

```sh
npm run bandit -- <command>
```

## Acceptance Criteria Result

| Acceptance Criteria | Verdict | Evidence |
|---|---|---|
| `bandit init` creates repo-native state and is idempotent | `pass` | `test/init.test.mjs` |
| `.bandit/config.toml` records prefix and state version | `pass` | `.bandit/config.toml`, `test/init.test.mjs` |
| Lifecycle event writer appends JSONL without overwriting | `pass` | `.bandit/events.jsonl`, `test/init.test.mjs` |
| `bandit validate` succeeds and reports missing or malformed state | `pass` | `test/validate.test.mjs` |
| `bandit list` prints deterministic work item list | `pass` | `test/work-items.test.mjs` |
| `bandit show <id>` prints one work item | `pass` | `test/work-items.test.mjs` |
| Commands fail closed with clear messages | `pass` | `test/validate.test.mjs`, `test/work-items.test.mjs` |
| Tests cover important success and refusal paths | `pass` | 12 passing tests |
| No command treats SQLite, UI state, generated indexes, or chat as canonical | `pass` | Commands read `.bandit/**` and `docs/work/**` only. |
| Implementation keeps orchestration small and readable | `pass` | Commands are split by `src/commands/**` and state helpers under `src/state/**`. |
| Missing final gates recorded as bootstrap gaps | `pass` | See `landing-verdict.md`. |

## Verification Run

```sh
npm test
npm run typecheck
npm run bandit -- validate
npm run bandit -- list
npm run bandit -- show BANDIT-001
```

Results:

- `npm test`: 12 tests passed.
- `npm run typecheck`: passed.
- `npm run bandit -- validate`: passed.
- `npm run bandit -- list`: printed `BANDIT-001`.
- `npm run bandit -- show BANDIT-001`: succeeded.
