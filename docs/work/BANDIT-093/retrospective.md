# BANDIT-093 Retrospective

## Outcome

`BANDIT-093` landed the first `BANDIT-PRD-005` implementation slice: Roadmap
Work Target Resolver. The slice adds `bandit roadmap-work-targets resolve
--json`, a read-only derived projection that resolves the current or next
authorized work target from `docs/roadmap/ROADMAP.md` and
`docs/roadmap/CURRENT_CONTEXT.md`.

The resolver fails closed when roadmap and current-context authority disagree,
ignores stale `## Historical Tail` text, returns not-yet-formed next work when
no active item is formed, and treats `.bandit/work-intake-ledger.json` only as
provenance after roadmap authorization.

The slice does not start PRD-005.2, PRD-005.3, PRD-005.4, create-controller
work, execute-controller work, command adapter work, Trust Verifier cutover,
cockpit UI, local API, State Index behavior, hosted services, telemetry,
public benchmark publication, paid routing, merge, push, deploy, credential
handling, dependency, lockfile, package-script, CI/release workflow, external
repo mutation, or unrelated Phase 8 work.

## What Worked

- Plan-mode orchestration was recorded before RED evidence, preserving the Work
  Item PM gate.
- RED evidence cleanly covered the target resolver behavior: active formed
  work, interstitial next work, authority disagreement, stale historical tails,
  no hidden WIL scheduling, and WIL provenance after authorization.
- Claude produced a useful partial implementation without touching
  Test Writer-owned surfaces.
- MiniMax repaired the TypeScript strict-nullability failures after Claude
  stalled on verification command approvals.
- Local Qwen completed through the authorized `.bandit/reviewers/local-qwen.json`
  and `bin/omlx-chat-completions.mjs` route and returned pass with zero findings.
- CodeRabbit reached reviewing and timed out after the full 600-second window;
  the timeout was recorded honestly as `bootstrap_gap` replacement evidence.
- `land-check` caught the missing risk/supply-chain release decision registry
  entries, and the exact prerequisite was repaired before landing.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Roadmap/current-context authority can be projected without granting scheduler authority. | keep | `src/state/roadmap-work-targets.ts` returns a derived non-canonical projection and never writes state. |
| WIL must stay provenance-only unless roadmap/current-context names the target. | keep | Focused tests prove WIL is not used as a hidden queue and is dereferenced only after roadmap authorization. |
| Claude command-approval stalls should route to the configured fallback after the timeout boundary. | no_action | The fallback path worked, and `docs/work/BANDIT-093/stage3-claude-attempt.md` records the limitation and routing. Reopen only if Claude sandbox approvals repeatedly block Stage 3 verification. |
| Risk/supply-chain per-work-item evidence is not enough for landing; release decision registries must also point at it. | keep | `land-check` enforced the registry contract, and `.bandit/policy/risk-classification.json` plus `.bandit/policy/supply-chain-gate.json` now include BANDIT-093. |
| CodeRabbit provider timeout remains possible during uncommitted review. | no_action | Timeout replacement evidence is durable and Local Qwen completed. Open hardening only if timeout becomes a repeated blocker without replacement evidence. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude could not run verification commands inside its sandbox and stalled after repeated approval-required responses. | no_action - fallback route succeeded and evidence records the limitation |
| reviewer/provider latency | CodeRabbit timed out after the full 600-second Stage 4 window. | no_action - provider timeout is recorded as replacement evidence without claiming a pass |
| gate feedback | `land-check` blocked until risk/supply-chain release decision registries included BANDIT-093. | keep - the gate correctly forced the exact missing prerequisite |
| agent-scope fit | Codex/Test Writer owned RED, Claude/MiniMax owned Stage 3 source, Qwen/CodeRabbit owned review evidence, Landing Agent recorded landing, and Closeout Agent handled retrospective. | keep |
| recurring inefficiency | Manual registry/hash refresh added time after Stage 4 evidence. | no_action - PRD-005.2/005.3 controller work is next and should reduce this orchestration overhead |
| unresolved uncertainty | PRD-005.2 must now form the Repo PM Create Controller and Prompt Contract slice. | keep - `ROADMAP.md` names PRD-005.2 as the next formation target |

## Improvement Chores

No new improvement chore is created by `BANDIT-093`.

The material lessons are already durable in:

- `docs/work/BANDIT-093/stage3-claude-attempt.md`
- `docs/work/BANDIT-093/stage3-minimax-dispatch.md`
- `docs/work/BANDIT-093/implementation-evidence.md`
- `docs/work/BANDIT-093/coderabbit-review.md`
- `docs/work/BANDIT-093/local-qwen-review.md`
- `docs/work/BANDIT-093/review-evidence.md`
- `docs/work/BANDIT-093/landing-verdict.md`
- `docs/work/BANDIT-093/landing-action.md`
- `.bandit/policy/risk-classification.json`
- `.bandit/policy/supply-chain-gate.json`
- `.bandit/policy/risk-classifications/BANDIT-093-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-093-supply-chain-gate.json`

## Cross-Model Tension

No unresolved cross-model tension remains. Claude produced partial source,
MiniMax completed the allowed repair and evidence, Local Qwen passed the
implementation and registry refresh with zero findings, and CodeRabbit timed
out with no pass claimed.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-093` closeout.

The next recorded action is Repo PM formation for PRD-005.2 Repo PM Create
Controller And Prompt Contract.
