# BANDIT-100 Retrospective

contract_version: 1
work_item: BANDIT-100
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-100/landing-action.md
source_checkpoint_commit: ee6d07fbce6a3a52213b1914285ed19652756a58
landing_checkpoint_commit: f6b143188cfb8ec1c4034b7a604cb3b6dcc13c8a

## Summary

BANDIT-100 delivered the project-profile contract and identity-clean init
slice from BANDIT-PRD-006. The slice added a versioned project-profile schema,
made `bandit init --profile` scaffold a consumer repo under configured
identity, shipped profile guidance, and parameterized `draft-work` PRD parsing
by configured work-item prefix while preserving BANDIT PRD back-compat.

## What Worked

- Plan-mode orchestration ran before RED evidence and recorded the
  Work Item PM checklist.
- Test Writer-owned RED tests covered malformed-profile diagnostics,
  identity-clean scaffold output, configured PRD prefix parsing, and BANDIT
  PRD back-compat.
- Claude produced the first Stage 3 source implementation, and MiniMax-M3
  fallback recorded writer evidence and repaired PM-identified fail-closed
  argument and schema validation issues.
- Focused tests, full suite, typecheck, Bandit validation, and diff checks
  passed before review/landing.
- CodeRabbit timeout was recorded honestly after the full 600-second window,
  and its emitted hardcoded-local-path finding was repaired.
- Local Qwen ran through the authorized `.bandit/reviewers/local-qwen.json`
  route and returned a pass verdict with no structured findings.
- Risk classification, supply-chain gate, review-subject hash refresh,
  `land-check`, and local-record landing completed before closeout.

## Friction

- `work-execute --json` still reported stale Stage 2 routing after RED
  evidence was recorded. The gap is now queued as
  `BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`.
- Claude timed out before producing Writer artifacts, so Work Item PM had to
  route MiniMax-M3 fallback and a focused MiniMax repair packet.
- CodeRabbit reached analysis and emitted one finding, then timed out after
  the required provider window.
- The slice validated generality with an ACME temp-repo fixture rather than a
  second real consumer repository.

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| Project-profile schema validation must name malformed fields and fail closed for missing profile arguments. | keep | `src/cli.ts`, `src/state/project-profile.ts`, `test/init.test.mjs` |
| Consumer init scaffolding should derive identity, work-item prefix, roadmap seed, reviewers, policies, and harnesses from a declarative profile rather than Bandit bootstrap defaults. | keep | `src/commands/init.ts`, `src/state/project-profile.ts`, `test/init.test.mjs` |
| `draft-work` needs configured PRD-prefix parsing with BANDIT PRD back-compat. | keep | `src/commands/draft-work.ts`, `test/draft-work.test.mjs` |
| CodeRabbit hardcoded-local-path findings are valid even when embedded in evidence docs; portable placeholders are safer for reusable dispatch packets. | keep | `docs/work/BANDIT-100/coderabbit-finding-disposition.md` |
| CodeRabbit timeout evidence must remain explicit `bootstrap_gap` evidence, not pass evidence. | keep | `docs/work/BANDIT-100/coderabbit-review.md`, `docs/work/BANDIT-100/review-evidence.md` |
| Stage 3 fallback routing worked, but long-running Writer timeouts should leave explicit writer evidence before acceptance. | keep | `docs/work/BANDIT-100/stage3-minimax-dispatch.md`, `docs/work/BANDIT-100/stage3-minimax-repair-dispatch.md` |
| `work-execute` route derivation must follow coordination state rather than a stale stage assumption. | queued_chore | `.bandit/bootstrap-gaps.json` |
| A second real consumer repo would strengthen product confidence, but the approved acceptance surface for this slice was the ACME-profile fixture and self-hosting back-compat. | no_action | `docs/work/BANDIT-100/brief.md`, `test/init.test.mjs` |

## Verification

- `node --test test/init.test.mjs` - pass, 9/9 tests.
- `node --test test/draft-work.test.mjs` - pass, 15/15 tests.
- `npm run typecheck` - pass.
- `npm test` - pass, 656/656 tests.
- `npm run bandit -- validate` - pass before landing.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs coordination validate BANDIT-100` - pass before
  Stage 5.
- `node ./bin/bandit.mjs review-subject-hash BANDIT-100` - current hash
  `72cea7d1dfd37867e41b704029105e5acfb81de2c9529afa80eb3ff8d136b259`.
- `node ./bin/bandit.mjs land-check BANDIT-100` - pass before local-record
  landing and again after the review/landing evidence checkpoint commit.
- `node ./bin/bandit.mjs land BANDIT-100 --action local-record` - pass.
- `npm run bandit -- validate` - pass after closeout routing sync.
- `node ./bin/bandit.mjs coordination validate BANDIT-100` - pass after
  closeout routing sync.
- `node ./bin/bandit.mjs cockpit status --json` - pass after closeout routing
  sync; reports `Stage 6: closed`.
- `node ./bin/bandit.mjs session-context current --json` - pass after
  closeout routing sync; reports exact next action for
  `BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT`.
- `git diff --check` - pass after closeout routing sync.

## Next Recorded Action

Repo PM should form the queued bootstrap-gap chore for
`BANDIT-GAP-WORK-EXECUTE-STAGE-ROUTE-ADVANCEMENT` before starting
`BANDIT-101`.
