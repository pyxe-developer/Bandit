# BANDIT-094 Retrospective

## Outcome

`BANDIT-094` landed the second `BANDIT-PRD-005` implementation slice: Repo PM
Create Controller And Prompt Contract.

The slice adds `bandit repo-pm create-controller --json`, role-specific Repo
PM prompt-contract validation, a Repo PM formation prompt template, and
fail-closed controller behavior for missing explicit source specs,
operator-owned input, and missing or unauthorized Local Qwen reviewer routes.
The controller creates only Stage 1 work-item evidence and stops before RED,
implementation, review, landing, UAT, retrospective, PRD-005.3, PRD-005.4,
Trust Verifier cutover, merge, push, deploy, hosted services, telemetry,
dependencies, CI/release workflow changes, paid routing, or unrelated Phase 8
work.

## What Worked

- Plan-mode orchestration was recorded before RED evidence.
- RED evidence covered Repo PM prompt-contract acceptance, foreign-source
  leakage rejection, create-controller happy path, already-formed idempotency,
  missing explicit source-spec refusal, operator-input refusal, and Local Qwen
  route refusal.
- Claude timed out without source edits after the configured window, and the
  fallback was recorded honestly.
- MiniMax produced the implementation and then repaired the exact focused
  test/typecheck failures without editing Test Writer-owned files.
- CodeRabbit repeatedly timed out, but emitted useful findings during earlier
  attempts; the valid findings were repaired and the contradictory policy-path
  finding was explicitly rejected with rationale.
- Local Qwen completed through the authorized `.bandit/reviewers/local-qwen.json`
  route and returned non-blocking findings that were dispositioned in aggregate
  review evidence.
- `land-check` passed with CodeRabbit timeout replacement evidence, Local Qwen
  non-blocking disposition, risk classification, supply-chain gate, and
  landing verdict evidence.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Create-controller work needs a clean source/evidence commit before Local Qwen can record source-head evidence. | keep | Local Qwen correctly refused a dirty worktree, forcing the checkpoint commit before review. |
| CodeRabbit can emit actionable findings before timing out. | keep | `docs/work/BANDIT-094/coderabbit-finding-disposition.md` records repaired findings and one rejected contradictory finding; timeout evidence does not erase partial reviewer output. |
| Generic forbidden-source markers are better committed policy than operator-specific absolute paths. | keep | The policy keeps `SeekWins`, `WI-00`, and `Ollama`; the operator-specific `/Users/...` path was rejected as non-portable. |
| Non-blocking Local Qwen findings need concrete PM rationale and durable routing in `review-evidence.md`. | keep | `docs/work/BANDIT-094/review-evidence.md` records no-action dispositions and reopen triggers for each non-blocking finding. |
| Risk/supply-chain registry allow-list entries remain a required landing prerequisite. | keep | `.bandit/policy/risk-classification.json` and `.bandit/policy/supply-chain-gate.json` now include BANDIT-094 auto-landing pointers. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| writer/provider timeout | Claude timed out at Stage 3 without source edits. | no_action - MiniMax fallback completed implementation and evidence; reopen only if Claude timeouts become repeated blockers. |
| reviewer/provider timeout | CodeRabbit timed out after multiple 600-second attempts. | no_action - provider timeout is recorded as bootstrap-gap replacement evidence and Local Qwen completed. |
| cross-model tension | CodeRabbit gave contradictory advice about operator-specific absolute paths. | keep - PM rejected the non-portable path while preserving generic leakage detection. |
| review prompt limitation | Local Qwen noted limited direct diff visibility in its packet. | no_action - PM verification reran focused tests, typecheck, full tests, validation, and review-subject hash. |
| future hardening | Local Qwen suggested extra forbidden-intent assertions. | no_action - current command has no intent input surface and tests assert Stage 2+ artifacts are not created; reopen if future adapters add intent text. |

## Improvement Chores

No new improvement chore is created by `BANDIT-094`.

The material lessons are already durable in:

- `docs/work/BANDIT-094/stage3-claude-attempt.md`
- `docs/work/BANDIT-094/stage3-minimax-dispatch.md`
- `docs/work/BANDIT-094/stage3-minimax-repair-dispatch.md`
- `docs/work/BANDIT-094/writer-report.md`
- `docs/work/BANDIT-094/implementation-evidence.md`
- `docs/work/BANDIT-094/coderabbit-review.md`
- `docs/work/BANDIT-094/coderabbit-finding-disposition.md`
- `docs/work/BANDIT-094/local-qwen-review.md`
- `docs/work/BANDIT-094/review-evidence.md`
- `docs/work/BANDIT-094/landing-verdict.md`
- `docs/work/BANDIT-094/landing-action.md`
- `.bandit/policy/risk-classification.json`
- `.bandit/policy/supply-chain-gate.json`
- `.bandit/policy/risk-classifications/BANDIT-094-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-094-supply-chain-gate.json`

## Cross-Model Tension

All cross-model tension is dispositioned. CodeRabbit timeout evidence is not
treated as a pass; CodeRabbit findings emitted before timeout were repaired or
rejected with rationale; Local Qwen non-blocking findings have PM disposition
and no landing blocker remains.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-094` closeout.

The next recorded action is Repo PM formation for PRD-005.3 Work Item PM
Execute Controller And Route Registry.
