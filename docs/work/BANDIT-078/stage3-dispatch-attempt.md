# BANDIT-078 Stage 3 Dispatch Attempts

## Status

`implementation_recorded`: Stage 3 completed after MiniMax-M3 and Claude
writer repairs. PM verification passed the focused cockpit suites, typecheck,
and full `npm test`; implementation evidence and PM acceptance review are
recorded.

## Attempt 1

- Time: 2026-06-08T18:39:00Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-dispatch.md`
- Command shape:

```sh
timeout 900 claude -p --model claude-sonnet-4-6 --output-format stream-json --verbose -- "$(cat docs/work/BANDIT-078/stage3-dispatch.md)"
```

## Observed Output

```text
Failed to authenticate. API Error: 401 Invalid authentication credentials
```

The command exited after startup retries with `authentication_failed`. No source
implementation, Writer report, implementation evidence, review evidence,
landing evidence, UAT evidence, retrospective evidence, tests, fixtures, or RED
evidence were changed by the Claude run.

## Boundary Decision

Codex PM cannot implement Stage 3 locally because Codex authored the Stage 2 RED
tests and `docs/work/BANDIT-078/brief.md` requires Claude-family Stage 3
implementation during bootstrap. Silently rerouting to another implementation
writer path would require operator-owned policy input.

## Required Operator Input

Operator input is now required. The focused Claude-family retry could not
produce source edits and Writer evidence through an authorized Claude-family
route. The operator must approve a scoped policy exception changing the Stage 3
implementation writer path for this Codex-authored RED slice.

Do not start Stage 4 review, UAT, landing, closeout, guarded browser action
execution, local API work, State Index work, merge, push, deploy, Trust
Verifier cutover, or unrelated product work before Stage 3 implementation
evidence and Writer report exist.

## Attempt 2

- Time: 2026-06-08T19:02:18Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-dispatch.md`
- Command shape:

```sh
timeout 900 claude -p --model claude-sonnet-4-6 --output-format stream-json --verbose -- "$(cat docs/work/BANDIT-078/stage3-dispatch.md)"
```

## Observed Output

The command authenticated and ran Stage 3 diagnostics, then exited with code
`124` when the 900-second wrapper elapsed. It did not emit a final Writer
result, did not edit source files, and did not create
`docs/work/BANDIT-078/writer-report.md`.

Diagnostic commands completed inside the Claude run:

```text
node --test test/cockpit-actions.test.mjs
  failing: guarded request metadata is missing from action affordances
node --test test/cockpit-ui.test.mjs
  pass 6, fail 2
node --test test/cockpit-browser-shell.test.mjs
  pass 5, fail 2
```

The observed diagnostics confirm the RED surface remains active. They do not
constitute Stage 3 implementation evidence because the Writer timed out before
source delivery and the required Writer report.

## Boundary Decision

Codex PM cannot implement Stage 3 locally because Codex authored the Stage 2 RED
tests and `docs/work/BANDIT-078/brief.md` requires a different model family for
Stage 3 implementation. The next authorized PM action is to tighten the Stage 3
Claude-family dispatch packet and retry once through the required Writer route.

## Attempt 3

- Time: 2026-06-08T20:03:27Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-dispatch-short.md`
- Command shape:

```sh
timeout 900 claude -p --model claude-sonnet-4-6 --output-format stream-json --verbose -- "$(cat docs/work/BANDIT-078/stage3-dispatch-short.md)"
```

## Observed Output

The command authenticated, read the required evidence, emitted long internal
analysis about the RED tests, then exited with code `124` when the 900-second
wrapper elapsed. It did not emit a final Writer result, did not edit source
files, did not create `docs/work/BANDIT-078/writer-report.md`, and did not
create `docs/work/BANDIT-078/implementation-evidence.md`.

`git status --short` after the timeout showed only the Codex PM-authored short
dispatch packet:

```text
?? docs/work/BANDIT-078/stage3-dispatch-short.md
```

## Boundary Decision

The recorded next action required a shorter Claude-family retry first. That
retry is now complete and did not produce source edits or Writer evidence. The
operator's work-item execution prompt already authorizes the fallback route:
use MiniMax-M3 with headless `pi` after a 15-minute Claude timeout.

## Attempt 4

- Time: 2026-06-08T20:20:00Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-minimax-dispatch.md`
- Command shape:

```sh
timeout 900 pi --provider minimax --model MiniMax-M3 --approve --tools read,bash,edit,write,grep,find,ls -p "$(cat docs/work/BANDIT-078/stage3-minimax-dispatch.md)"
```

## Attempt 4 Observed Output

The command exited with code `124` when the 900-second wrapper elapsed and
emitted no terminal output. It edited cockpit source and static preview files
but did not create `docs/work/BANDIT-078/writer-report.md` or
`docs/work/BANDIT-078/implementation-evidence.md`.

This command shape was later corrected after operator feedback. Large dispatch
packets must be passed with `pi -p @prompt-file.md "short instruction"` or
stdin, not shell command substitution.

PM verification after the timeout showed:

```text
node --test test/cockpit-actions.test.mjs: pass
node --test test/cockpit-ui.test.mjs: fail 1/8, legacy rendered-control shape
node --test test/cockpit-browser-shell.test.mjs: pass
npm run typecheck: pass
```

## Attempt 5

- Time: 2026-06-08T20:37:00Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-minimax-repair-dispatch.md`
- Command shape:

```sh
timeout 900 pi --provider minimax --model MiniMax-M3 --approve --no-session --mode json --tools read,bash,edit,write,grep,find,ls -p @docs/work/BANDIT-078/stage3-minimax-repair-dispatch.md "Execute this focused repair dispatch from the file argument. Continue from the current dirty worktree. Do not edit tests, fixtures, RED evidence, acceptance mappings, PM routing/status artifacts, review evidence, landing evidence, UAT evidence, retrospective evidence, or coordination logs. You may edit source files needed for the cockpit render repair and update docs/work/BANDIT-078/writer-report.md only."
```

## Attempt 5 Observed Output

MiniMax-M3 repaired the default-derived rendered-control compatibility issue in
`src/cockpit/render.ts` and updated `docs/work/BANDIT-078/writer-report.md`.
PM verification after the repair showed:

```text
node --test test/cockpit-actions.test.mjs: pass
node --test test/cockpit-ui.test.mjs: pass
node --test test/cockpit-browser-shell.test.mjs: pass
npm run typecheck: pass
node --test test/cockpit-view-model.test.mjs: fail 2/8
npm test: fail 2/579
```

The remaining failures were the older minimal enumerable view-model shape
expectations for `cockpitStatusFixture()`.

## Attempt 6

- Time: 2026-06-08T21:10:00Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-minimax-viewmodel-repair-dispatch.md`
- Command shape:

```sh
timeout 900 pi --provider minimax --model MiniMax-M3 --approve --no-session --mode json --tools read,bash,edit,write,grep,find,ls -p @docs/work/BANDIT-078/stage3-minimax-viewmodel-repair-dispatch.md "Execute this focused Stage 3 repair dispatch from the file argument. Continue from the current dirty worktree. Do not edit tests, fixtures, RED evidence, acceptance mappings, PM routing/status artifacts, review evidence, landing evidence, UAT evidence, retrospective evidence, or coordination logs. You may edit source files needed for the cockpit action/view-model/render/browser-shell repair and update docs/work/BANDIT-078/writer-report.md only."
```

## Attempt 6 Observed Output

MiniMax-M3 edited `src/state/cockpit-actions.ts` to preserve an older minimal
enumerable affordance shape for pre-orchestration payloads and keep expanded
metadata as non-enumerable properties. The run timed out with code `124` before
writing a current report. PM verification showed:

```text
node --test test/cockpit-actions.test.mjs: pass
node --test test/cockpit-ui.test.mjs: pass
node --test test/cockpit-view-model.test.mjs: pass
node --test test/cockpit-browser-shell.test.mjs: fail 1/7
```

The remaining failure was label-only: browser-shell HTML expected the expanded
labels `Validate repo` and `Review gate` while the older view-model deep-equal
shape required the enumerable labels `Validate` and `Review Gate`.

## Attempt 7

- Time: 2026-06-08T21:27:00Z
- Dispatch artifact: `docs/work/BANDIT-078/stage3-claude-label-repair-dispatch.md`
- Command shape:

```sh
timeout 900 claude -p --model claude-sonnet-4-6 --output-format stream-json --verbose --no-session-persistence --permission-mode acceptEdits --tools Read,Edit,Bash < docs/work/BANDIT-078/stage3-claude-label-repair-dispatch.md
```

## Attempt 7 Observed Output

Claude repaired the final label split by preserving the expanded label as a
non-enumerable `display_label` on legacy affordances and rendering
`display_label ?? label` in the browser shell. Claude's own Bash verification
was blocked by hook approval requirements, and the writer report records that
limitation.

PM reran verification from the orchestrator shell:

```text
node --test test/cockpit-actions.test.mjs: pass 3/3
node --test test/cockpit-ui.test.mjs: pass 8/8
node --test test/cockpit-browser-shell.test.mjs: pass 7/7
node --test test/cockpit-view-model.test.mjs: pass 8/8
npm run typecheck: pass
npm test: pass 579/579
git diff -- test docs/work/BANDIT-078/red-evidence.md docs/artifact-inputs/BANDIT-078-red-evidence.json: no diff
```

Stage 3 implementation evidence and PM acceptance are recorded in
`docs/work/BANDIT-078/implementation-evidence.md` and
`docs/work/BANDIT-078/stage3-pm-review.md`.

## Current Authorized Next Action

Run Stage 4 review for `BANDIT-078`: request CodeRabbit pre-PR evidence or
record provider-refusal evidence, run Local Qwen through
`.bandit/reviewers/local-qwen.json` via `bin/omlx-chat-completions.mjs`, record
risk classification, supply-chain evidence, browser smoke evidence,
review-subject hash, aggregate review evidence, and disposition every finding
before landing.
