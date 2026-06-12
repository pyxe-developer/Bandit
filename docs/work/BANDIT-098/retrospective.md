# BANDIT-098 Retrospective

contract_version: 1
work_item: BANDIT-098
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-098/landing-action.md
source_checkpoint_commit: 8ca90b1dc14e9f24bf11cb3002e7487aae6329f5
landing_checkpoint_commit: d795dbd340f984b9dff11dbee5724059d2375631

## Summary

BANDIT-098 delivered the Public Consumer Install Quickstart And Governance
Scaffold bootstrap-gap chore. The slice made the README install path
consumer-oriented, updated package metadata and package allow-list posture,
kept install/update policy advisory and data-minimal, and made `bandit init`
seed starter governance files for a newly governed consumer repository while
preserving existing user-owned files.

## What Worked

- Plan-mode orchestration ran before RED evidence.
- Test Writer-owned RED tests covered public consumer packaging and starter
  governance scaffolding.
- Claude completed the Stage 3 implementation on retry without editing
  Test Writer-owned files.
- PM verification supplied the test evidence the writer could not run through
  its approval layer.
- CodeRabbit initial review found real policy/template and evidence hygiene
  issues, and those findings were repaired or dispositioned before refresh.
- Local Qwen ran through the authorized `.bandit/reviewers/local-qwen.json`
  route and returned non-blocking findings with concrete PM disposition.
- Risk classification and supply-chain gate validators caught registry and
  schema details before landing.
- Local-record landing enforced a clean worktree and recorded landing action
  evidence before closeout began.

## Friction

- Claude headless execution required a retry before completing the Stage 3
  implementation and durable writer evidence.
- The writer environment could not run tests because its approval layer blocked
  shell execution, so PM had to run focused verification.
- The CodeRabbit wrapper hit a zsh `status` variable conflict on the initial
  run, though review output was still captured and usable.
- The refreshed CodeRabbit run timed out after the full provider window, so the
  review state is recorded honestly as `bootstrap_gap` instead of a pass.
- Local Qwen required a focused source/evidence checkpoint commit because the
  authorized review command refuses dirty worktrees.
- Risk and supply-chain registry entries had to be added explicitly for this
  bootstrap gap before validation could pass.

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| Public install guidance must be executable from arbitrary consumer repos and avoid shell placeholders that imply local source checkout authority. | keep | `README.md`, `package.json`, `test/public-consumer-install-quickstart.test.mjs` |
| `bandit init` should seed consumer-neutral governance artifacts and preserve existing files. | keep | `src/commands/init.ts`, `test/init.test.mjs` |
| Starter `BANDIT-001` work-item placeholder remains necessary for day-one cockpit and session-context parsing. | keep | `src/commands/init.ts`, `docs/work/BANDIT-098/local-qwen-finding-disposition.md` |
| CodeRabbit provider timeout evidence must remain explicitly non-pass. | keep | `docs/work/BANDIT-098/coderabbit-review.md`, `docs/work/BANDIT-098/review-evidence.md` |
| Reviewer findings about Test Writer-owned RED evidence require careful role-boundary disposition rather than retrospective source edits. | keep | `docs/work/BANDIT-098/coderabbit-finding-disposition.md` |
| Risk and supply-chain gates need both per-item evidence and registry entries. | keep | `.bandit/policy/risk-classification.json`, `.bandit/policy/supply-chain-gate.json` |
| The zsh `status` variable conflict in the CodeRabbit wrapper was worked around locally for evidence capture. | no_action | `.bandit/tmp/BANDIT-098-coderabbit/output.jsonl`, `docs/work/BANDIT-098/coderabbit-review.md` |

## Verification

- `node --test test/public-consumer-install-quickstart.test.mjs` - pass.
- `node --test test/init.test.mjs` - pass.
- `node --test test/private-install-update-channel.test.mjs` - pass.
- `node --test test/update-channel.test.mjs` - pass.
- `npm run typecheck` - pass.
- `npm pack --dry-run --json` - pass.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs land-check BANDIT-098` - pass before local-record landing.
- `node ./bin/bandit.mjs land BANDIT-098 --action local-record` - pass.

## Next Recorded Action

Repo PM should form the next work item for the deferred V0 Closeout Claude Code
A/B Product-Value Trial only after confirming repo artifacts still authorize
that product slice and no open bootstrap gap remains. Do not begin RED evidence
or implementation for that deferred product slice until formation exists and is
approved.
