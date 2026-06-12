# BANDIT-099 Stage 3 PM Acceptance

contract_version: 1
work_item: BANDIT-099
stage: Stage 3 Implementation
author: codex_pm
timestamp: 2026-06-12T11:41:29Z
verdict: pass

## Accepted Source Evidence

- `docs/work/BANDIT-099/stage3-dispatch.md`
- `docs/work/BANDIT-099/stage3-repair-dispatch.md`
- `docs/work/BANDIT-099/implementation-evidence.md`
- `docs/work/BANDIT-099/writer-report.md`
- `README.md`
- `src/commands/init.ts`

Claude completed the implementation as the non-Codex Stage 3 Writer. The first
PM verification run found one focused assertion miss because the starter
governance sentence split `Configured` and `agents` across a newline. Claude
repaired that source-only issue in `src/commands/init.ts`.

## Acceptance Criteria

- Starter `AGENTS.md` produced by `bandit init` is model-agnostic and no longer
  declares Codex as PM or engineering manager for arbitrary consumer repos.
- Starter clean-code and stage-rubric copy refer to Bandit roles, configured
  providers, or operator-selected agents instead of Codex-only governance.
- Fresh consumer repos receive day-1 onboarding guidance from `bandit init`.
- Existing consumer `README.md` files are preserved, with Bandit onboarding
  written to `docs/BANDIT_ONBOARDING.md`.
- First-time public README command examples use install-aware invocation forms.
- Package allow-list posture is unchanged; no new template package entry was
  required.

## Verification

Focused verification:

- `node --test test/init.test.mjs` passed 7/7 tests.
- `node --test test/public-consumer-install-quickstart.test.mjs` passed 2/2
  tests.
- `node --test test/private-install-update-channel.test.mjs` passed 2/2 tests.
- `npm run typecheck` passed.

Broad verification:

- `npm test` passed 650/650 tests.
- `npm run typecheck` passed.
- `git diff --check` passed.
- `npm pack --dry-run --json` passed with 200 package entries.

Supplemental test baseline repairs are recorded in
`docs/work/BANDIT-099/test-baseline-repair-evidence.md`.

## Clean-Code Evaluation

Verdict: pass.

- The change stays within the formed onboarding-hardening scope.
- The implementation is localized to README command examples and init-owned
  starter/onboarding scaffolding.
- No new canonical state authority is introduced; starter README/onboarding
  output remains generated local guidance.
- No existing consumer README or governance file is overwritten.
- Test ownership is preserved: Stage 3 Writer did not edit tests or
  Test Writer-owned evidence.
- Package distribution scope remains local and documented; there is no public
  publish automation, credential handling, telemetry, hosted update service, or
  external repo mutation.

## Stage 4 Readiness

Stage 3 is accepted. Proceed to Stage 4 review with CodeRabbit pre-PR review or
honest provider-refusal/bootstrap-gap evidence, Local Qwen through
`.bandit/reviewers/local-qwen.json` via `bin/omlx-chat-completions.mjs`,
layered risk classification, supply-chain gate evidence, aggregate review
evidence, review-subject hash, and disposition of every finding before landing.
