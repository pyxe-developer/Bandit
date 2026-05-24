# BANDIT-015 Implementation Evidence

## Status

`pass` - the smallest live CodeRabbit pre-landing loop contract is implemented
behind CLI authority, with fixture-backed provider input and repo-native
`coderabbit-review.md` evidence output.

## Implemented Behavior

- Added `bandit coderabbit-review live <work-item-id> --pr <number> --fixture <path>`.
- Preserved the existing `bandit coderabbit-review <work-item-id>` read path.
- Added a shared CodeRabbit review writer that produces the existing
  `docs/work/<ID>/coderabbit-review.md` contract.
- Added `.bandit/policy/coderabbit-live.json` to record required inputs,
  supported states, secret boundaries, fail-closed states, and out-of-scope
  actions.
- Recorded missing PR context as a closed refusal.
- Recorded missing `GITHUB_TOKEN`/`CODERABBIT_TOKEN` setup as
  `operator_input_blocked` evidence without storing token values.
- Redacted provider error secrets from terminal output and repo-native
  artifacts.
- Preserved fail-closed landing behavior by writing live-normalized
  CodeRabbit evidence that `land-check` already consumes.

## Files Changed

- `src/cli.ts`
- `src/commands/coderabbit-review.ts`
- `src/state/coderabbit-review.ts`
- `.bandit/policy/coderabbit-live.json`

## Acceptance Criteria Mapping

| Acceptance Criteria | Implementation Evidence |
|---|---|
| AC2, AC3 | CLI live subcommand and `.bandit/policy/coderabbit-live.json` define the live loop contract, inputs, supported states, and refusal paths. |
| AC4, AC10 | Live output is written through `writeCodeRabbitReview` into the existing `coderabbit-review.md` artifact consumed by `land-check`. |
| AC5 | Fixture-backed completed/pass review writes `coderabbit-live` pass evidence for the current source head. |
| AC6, AC7 | Missing PR context, missing credential setup, unresolved findings, stale source head, and unavailable provider state fail closed. |
| AC8 | Secret values are redacted from provider errors and are not written to evidence. |
| AC9 | The command does not autofix, merge, push, deploy, record UAT, or route paid-model review. |
| AC11 | Focused tests cover live clean pass, request-changes blocker, missing PR, missing credentials, unavailable provider, redaction, and `land-check` integration. |

## Verification

```sh
node --test test/coderabbit-state.test.mjs
```

Result: `pass` - 16/16.

```sh
npm run typecheck
```

Result: `pass`.

```sh
npm run bandit -- validate
```

Result: `pass` - Bandit state is valid.

```sh
npm test
```

Result: `pass` - 144/144.

## Clean-Code Check

`pass` - the implementation keeps the source of truth in repo-native
`coderabbit-review.md`, confines live provider behavior to the CodeRabbit
command boundary, uses deterministic fixture input for tests, fails closed for
missing operator-owned setup, and avoids unrelated landing, UAT, cockpit,
autofix, merge, push, deploy, or paid-model behavior.

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused and full tests pass, the implementation maps to the recorded acceptance criteria, live state writes the existing artifact contract, and clean-code source-of-truth boundaries are preserved. |
| Stage 4: Review And Cross-Model Gates | `pending` | CodeRabbit/review evidence, local Qwen review, escalated-review disposition, and landing verdict remain the next required step before landing. |

## Next Step

Run the `BANDIT-015` review and landing-gate closeout sequence: CodeRabbit
evidence, review evidence, local Qwen review, escalated-review disposition,
landing verdict, landing action, retrospective, gap-ledger disposition, and
context updates.
