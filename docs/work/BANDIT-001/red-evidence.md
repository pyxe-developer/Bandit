# BANDIT-001 RED Evidence

## Scope

This evidence covers Stage 2: Test Design And RED Evidence for the Repo-Native State And CLI Skeleton.

## Test Ownership

- Test Writer-owned tests: `test/**/*.test.mjs` and `test/helpers/bandit-cli.mjs`.
- Writer-editable production files: `bin/**`, `src/**`, package tooling, and repo-native `.bandit/**` state.
- Production implementation must not weaken these tests without an explicit test-change rationale.

## Acceptance Criteria Mapping

| Acceptance Criteria | Test Coverage |
|---|---|
| `bandit init` creates repo-native state and is idempotent | `test/init.test.mjs` |
| `.bandit/config.toml` records prefix and state version | `test/init.test.mjs` |
| Lifecycle event writer appends JSONL without overwriting | `test/init.test.mjs` |
| `bandit validate` succeeds and fails closed | `test/validate.test.mjs` |
| `bandit list` reads canonical work artifacts deterministically | `test/work-items.test.mjs` |
| `bandit show <id>` prints one work item and fails closed | `test/work-items.test.mjs` |
| Commands fail closed with clear messages | `test/validate.test.mjs`, `test/work-items.test.mjs` |
| No hidden authority | Tests operate on repo-native `.bandit/**` and `docs/work/**` files only. |

## RED Runs

### Init And Event Tests

Command:

```sh
npm test -- --test-name-pattern="init"
```

Accepted RED result:

- 2 tests failed.
- Failure reason: `src/cli.ts` was missing.
- This proved the tests required a real CLI implementation before production code existed.

Before the accepted RED result, one harness issue was found and fixed: `tsx` initially resolved from the temporary test repo instead of the Bandit repo. That was a test harness defect, not product behavior.

### Validate, List, And Show Tests

Command:

```sh
npm test -- --test-name-pattern="validate|list|show"
```

Accepted RED result:

- 10 behavior tests failed.
- Failure reason: `validate`, `list`, and `show` were unknown commands.
- This proved the tests required the missing command behavior.

### Wrapper Entrypoint Test Surface

Command:

```sh
npm test -- --test-name-pattern="init creates"
```

Accepted RED result:

- Tests failed because `bin/bandit.mjs` was missing.
- This caught that package `bin` must exercise a real wrapper entrypoint rather than relying on direct TypeScript source execution.

## Stage 2 Verdict

`pass`

The tests express the approved spec before the corresponding production implementation, include RED evidence, cover important refusal paths, and preserve a clear Test Writer versus Writer-editable boundary.
