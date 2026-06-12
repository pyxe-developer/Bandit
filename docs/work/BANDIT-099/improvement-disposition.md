# BANDIT-099 Improvement Disposition

contract_version: 1
work_item: BANDIT-099
stage: Stage 6 Improvement Disposition
status: complete
operator_input_status: none_required

## Durable Decisions

| Source | Decision | Rationale | Evidence |
| --- | --- | --- | --- |
| Model-agnostic starter governance | keep | Starter governance now describes Bandit roles and configured agents/providers instead of declaring Codex-specific authority in arbitrary consumer repos. | `src/commands/init.ts`, `test/init.test.mjs` |
| Day-1 onboarding scaffold | keep | Fresh consumer repos receive onboarding guidance immediately, and existing README files are preserved with Bandit-specific guidance written elsewhere. | `src/commands/init.ts`, `test/init.test.mjs` |
| Install-aware public README examples | keep | Copy-pasteable first-time commands now use local npx/npm forms before global/PATH setup. | `README.md`, `test/public-consumer-install-quickstart.test.mjs` |
| Starter scaffold test baseline repairs | keep | Tests now reflect the intended starter `BANDIT-001` work item and seeded governance/policy artifacts from `bandit init`. | `docs/work/BANDIT-099/test-baseline-repair-evidence.md` |
| CodeRabbit provider timeout | keep | Provider timeout is accepted only as `bootstrap_gap` replacement evidence, not as a pass. | `docs/work/BANDIT-099/coderabbit-review.md`, `docs/work/BANDIT-099/review-evidence.md` |
| Local Qwen non-blocking finding | keep | The verification-visibility finding was resolved with PM-run test evidence and no source repair was required. | `docs/work/BANDIT-099/local-qwen-finding-disposition.md` |
| Local Qwen packet PM-acceptance omission | no_action | The aggregate review and PM disposition flow already handles findings about later PM evidence; changing reviewer packet scope is outside this onboarding slice and not justified by one resolved finding. | `docs/work/BANDIT-099/local-qwen-finding-disposition.md` |
| Risk and supply-chain gate registry requirement | keep | The validators correctly required both per-work-item gate files and registry entries before landing. | `.bandit/policy/risk-classification.json`, `.bandit/policy/supply-chain-gate.json` |

## Chore Decisions

No new improvement chore is opened from BANDIT-099 closeout. The active
bootstrap gap `BANDIT-GAP-PUBLIC-CONSUMER-ONBOARDING-HARDENING` is resolved by
this work item. The next queued work remains the deferred V0 Closeout Claude
Code A/B Product-Value Trial after Repo PM formation determines the exact slice
boundary and confirms no open bootstrap gap takes precedence.

## Verification

- `node ./bin/bandit.mjs land-check BANDIT-099` - pass before local-record landing.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
