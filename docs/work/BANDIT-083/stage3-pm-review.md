# BANDIT-083 Stage 3 PM Review

contract_version: 1
work_item: BANDIT-083
stage: stage3_pm_acceptance
reviewer: codex_pm
recorded_at: 2026-06-09T14:34:14Z
verdict: pass

## Scope And Spec Alignment

- verdict: pass
- evidence: `docs/work/BANDIT-083/brief.md`, `docs/work/BANDIT-083/red-evidence.md`, `docs/work/BANDIT-083/writer-report.md`, `docs/work/BANDIT-083/implementation-evidence.md`

The implementation satisfies the Stage 3 scope for the attached-design cockpit
polish slice. It adapts the existing browser-served cockpit toward the dense
Evidence Row direction, refreshes the static preview for `BANDIT-083`, keeps
source links visible, and preserves CLI/repo-native workflow authority.

## Clean-Code Review

- verdict: pass
- evidence: `CLEAN_CODE.md`, `src/state/cockpit-evidence-detail.ts`, `src/state/cockpit-actions.ts`, `src/cockpit/render.ts`, `src/cockpit/browser-shell.ts`, `public/cockpit/cockpit.css`

Clean-code posture is acceptable for Stage 3:

- Spec alignment: behavior maps to the approved brief and RED evidence.
- Locality: changes are limited to cockpit evidence/action derivation, render
  metadata, browser-shell presentation, CSS/static preview output, and Stage 3
  evidence.
- Separation: browser presentation remains derived from CLI/repo artifacts and
  does not gain workflow mutation authority.
- Failure clarity: Evidence Rows expose visible status/freshness labels, and
  the Review gate now explicitly refuses review when implementation evidence is
  missing.
- No role erosion: Stage 3 Writers did not edit tests, fixtures, RED evidence,
  formation evidence, review evidence, UAT evidence, landing evidence, or
  retrospective evidence.
- Review focus: non-enumerable presentation metadata keeps existing
  shape-compatibility tests passing while exposing new row fields. This is
  acceptable for Stage 3 but should be scrutinized in Stage 4 for
  maintainability.

## Model-Family Separation

- verdict: pass
- evidence: `docs/work/BANDIT-083/stage3-dispatch.md`, `docs/work/BANDIT-083/stage3-minimax-dispatch.md`, `docs/work/BANDIT-083/stage3-review-affordance-repair-dispatch.md`, `docs/work/BANDIT-083/writer-report.md`

Codex authored Stage 2 RED evidence. Stage 3 implementation first routed to
Claude Sonnet 4.6. Claude timed out after the required 15-minute window at a
shell command approval boundary, so PM used the prompt-authorized MiniMax-M3
fallback through headless `pi`. MiniMax completed implementation and the
bounded review-affordance repair. Codex PM performed verification and
acceptance only.

## Test-Surface Boundary

- verdict: pass
- evidence: `docs/work/BANDIT-083/red-evidence.md`, `docs/work/BANDIT-083/writer-report.md`, PM diff inspection

The dirty test files are the Stage 2 RED tests recorded before implementation:

- `test/cockpit-ui.test.mjs`
- `test/cockpit-browser-shell.test.mjs`

Stage 3 Writers were forbidden from editing test surfaces, and the Writer
report records no Stage 3 edits to `test/**`, fixtures, RED evidence, or
acceptance mappings. The implementation and repair dispatches also excluded
test files.

## Verification

- verdict: pass
- evidence:
  - `node --test test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs test/cockpit-view-model.test.mjs test/cockpit-evidence-detail.test.mjs test/cockpit-actions.test.mjs` - pass, 30/30.
  - `npm test` - pass, 596/596.
  - `npm run typecheck` - pass.
  - `npm run bandit -- validate` - pass.
  - `node ./bin/bandit.mjs coordination validate BANDIT-083` - pass.
  - `node ./bin/bandit.mjs cockpit status --json` - pass.
  - `node ./bin/bandit.mjs session-context current --json` - pass.
  - `git diff --check` - pass.

## Writer Timeout Disposition

Claude's first writer dispatch timed out after the required 15-minute window
before generating preview output or Writer evidence. This is not a remaining
Stage 3 blocker because the authorized MiniMax-M3 fallback completed source
delivery, regenerated the preview, wrote the Writer report, completed the
bounded PM-requested repair, and verification passed from both the Writer
report and PM shell.

## Disposition

Stage 3 is accepted. The next required action is Stage 4 review: CodeRabbit
pre-PR evidence or provider-timeout/refusal evidence after the full required
window, Local Qwen only through `.bandit/reviewers/local-qwen.json` via
`bin/omlx-chat-completions.mjs`, browser smoke evidence, risk classification,
supply-chain gate, review-subject hash, aggregate review evidence, and
disposition of every finding before UAT or landing.
