# BANDIT-099 Retrospective

contract_version: 1
work_item: BANDIT-099
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-099/landing-action.md
source_checkpoint_commit: 307847106d3c549d477f69f4ff3536205e00996b
landing_checkpoint_commit: 42803873d7b3643b33cdc389b34371c06ba05acd

## Summary

BANDIT-099 delivered the Public Consumer Onboarding Hardening bootstrap-gap
chore. The slice made starter governance model-agnostic, added day-1 Bandit
onboarding from `bandit init`, preserved existing consumer README files by
writing `docs/BANDIT_ONBOARDING.md`, and made first-time public README command
examples install-aware.

## What Worked

- Plan-mode orchestration ran before RED evidence.
- Test Writer-owned RED tests covered model-agnostic starter governance,
  onboarding creation, README no-overwrite behavior, packed consumer
  quickstart, and install-aware README commands.
- Claude completed Stage 3 implementation and repair without editing
  Test Writer-owned files.
- PM verification ran the focused tests, full suite, typecheck, package dry-run,
  and test baseline repairs needed after starter `BANDIT-001` scaffolding.
- CodeRabbit timeout was recorded honestly after the full provider window.
- Local Qwen ran through the authorized `.bandit/reviewers/local-qwen.json`
  route and returned one non-blocking finding with concrete PM disposition.
- Risk classification and supply-chain gate validators passed before landing.
- Local-record landing enforced the clean source/evidence checkpoint and
  recorded landing action evidence before closeout.

## Friction

- Claude's environment could not execute shell verification because its
  approval layer blocked tests, so PM had to run all verification.
- Full-suite verification exposed stale test baselines around the starter
  `BANDIT-001` scaffold and seeded policy/profile/template artifacts.
- CodeRabbit reached provider analysis but timed out after the required
  600-second window without terminal findings.
- Local Qwen's review packet did not include the later PM acceptance artifact,
  so it raised a verification-visibility finding already covered by PM
  evidence.

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| Starter governance must describe Bandit roles and configured agents/providers rather than Codex-specific authority. | keep | `src/commands/init.ts`, `test/init.test.mjs` |
| Day-1 onboarding should be available immediately after `bandit init`, while preserving consumer-owned README files. | keep | `src/commands/init.ts`, `test/init.test.mjs` |
| Public README command examples must stay executable before global PATH setup. | keep | `README.md`, `test/public-consumer-install-quickstart.test.mjs` |
| Existing tests that create fresh repos must account for starter `BANDIT-001` and seeded governance artifacts. | keep | `docs/work/BANDIT-099/test-baseline-repair-evidence.md` |
| CodeRabbit timeout evidence must remain explicit `bootstrap_gap` evidence, not pass evidence. | keep | `docs/work/BANDIT-099/coderabbit-review.md`, `docs/work/BANDIT-099/review-evidence.md` |
| Local Qwen non-blocking findings can be closed by concrete PM evidence when they identify evidence visibility rather than source defects. | keep | `docs/work/BANDIT-099/local-qwen-finding-disposition.md` |
| The Local Qwen packet excludes `stage3-pm-acceptance.md`, which can produce stale verification-visibility findings after PM acceptance. | no_action | The existing Stage 4 disposition and review-evidence flow handles this without changing the reviewer packet contract in this onboarding slice. |

## Verification

- `node --test test/init.test.mjs` - pass.
- `node --test test/public-consumer-install-quickstart.test.mjs` - pass.
- `node --test test/private-install-update-channel.test.mjs` - pass.
- `npm test` - pass, 650/650 tests.
- `npm run typecheck` - pass.
- `npm pack --dry-run --json` - pass, 200 package entries.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs land-check BANDIT-099` - pass before local-record landing.
- `node ./bin/bandit.mjs land BANDIT-099 --action local-record` - pass.

## Next Recorded Action

Repo PM should form the next work item for the deferred V0 Closeout Claude Code
A/B Product-Value Trial only after confirming repo artifacts still authorize
that product slice and no open bootstrap gap remains. Do not begin RED evidence
or implementation for that deferred product slice until formation exists and is
approved.
