# BANDIT-088 Stage 3 Implementation Evidence

## Verdict

`pass`

Stage 3 produced a bounded `Deferred` disposition artifact for
`BANDIT-088` that satisfies the Stage 2 RED/disposition
verification plan, the brief's disposition requirements, the
orchestration plan, the `CLEAN_CODE.md` rubric, the model-family
separation invariant, and the zero test-surface edit
invariant. No source code, package metadata, dependency,
lockfile, validator, command routing, artifact renderer, init,
update-check, update-channel state, skill lifecycle,
supply-chain policy, input quarantine, operator-boundary, or
cockpit/session-context projection change was introduced.

## Stage 3 Delivery Summary

The Stage 3 implementation writer was dispatched to produce
the bounded installed-copy update-path triage delivery for
`BANDIT-088`. The chore is a non-product update-path triage
disposition and the Stage 3 Writer produced three artifacts:

- `docs/work/BANDIT-088/installed-copy-update-path-disposition.md`
  - Completed. Records a `Deferred` decision, preserves the
    current private Git tag or tarball install plus manual
    advisory `bandit update-check` as the only supported
    installed-copy channel, and lists named trigger
    conditions and a conditional narrow-scope contract for
    any future implementation.
- `docs/work/BANDIT-088/writer-report.md` - Created.
  Records the writer identity, the Claude unavailability, the
  source evidence read, the files changed, the zero
  test-surface edits, the no-forbidden-surface edits, the
  operator-input status, and the verification commands run.
- `docs/work/BANDIT-088/implementation-evidence.md` - This
  file. Records `pass`, summarizes the disposition delivery,
  maps every acceptance criterion to evidence, includes a
  clean-code check, and confirms model-family separation and
  zero test-surface edits.

The previous MiniMax-M3 attempt exited with `Unhandled stop
reason: error` after writing a partial
`installed-copy-update-path-disposition.md` that was
truncated in the "Current Installed-Skill Lifecycle And Drift
Policy" section. This repair completed the truncated file
from that point forward, did not contradict the prior
disposition text, did not relax any boundary, and did not add
any forbidden approval. The writer-report.md and
implementation-evidence.md required by the dispatch did not
exist after the prior attempt and are now created.

## Acceptance Criteria Mapping

The Stage 3 disposition, writer report, and this
implementation evidence satisfy the acceptance criteria from
`docs/work/BANDIT-088/brief.md` and the verification plan
from `docs/work/BANDIT-088/red-evidence.md`. The mapping
follows.

| Acceptance criterion | Evidence in Stage 3 artifacts |
| --- | --- |
| `WIL-INSTALLED-COPY-UPDATE` is the authorized intake-derived gap proposal after `BANDIT-087` closeout. | `installed-copy-update-path-disposition.md` "Source Citations" section cites `.bandit/work-intake-ledger.json` (entry `WIL-INSTALLED-COPY-UPDATE` with `intake_outcome: "formed"`, `formed_work_item: "BANDIT-088"`), `FOLLOWUPS.md` (anchor "Push Bandit Updates To Installed Copies"), `CURRENT_CONTEXT.md` (active work item `BANDIT-088`, last closed `BANDIT-087`), `ROADMAP.md` (current `[Gap] BANDIT-088` and last closed `[Gap] BANDIT-087`), `STATUS.md` (`BANDIT-088` formation approved, `BANDIT-087` closed), `brief.md`, `orchestration-plan.md`, `red-evidence.md`, and `coordination-log.jsonl`. |
| Current install/update policy remains unchanged during triage. | The "Current Private Install/Update Policy" section in the disposition cites `.bandit/policy/private-install-update-channel.json` and preserves the current private Git tag or tarball install plus manual advisory `bandit update-check`. The "Disposition" paragraph records that no public publishing, paid registry setup, hosted service, telemetry, automatic self-update, credential handling, consumer-repo mutation, installed global skill mutation, automation prompt mutation, merge, push, deploy, or Trust Verifier cutover is implemented, approved, or authorized. |
| Evidence review covers current policy and desired future installed-copy responsibilities. | The "Current Private Install/Update Policy", "Current Installed-Skill Lifecycle And Drift Policy", "Installed-Skill Drift Evidence", "Prior Private Install/Update Source Material", and "Current vs. Desired Installed-Copy Update Path Comparison" sections cite `.bandit/policy/private-install-update-channel.json`, `.bandit/policy/skill-lifecycle-contracts.json`, `docs/evaluation/skills/bandit-installed-skill-drift.md`, `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`, `README.md`, `src/commands/init.ts`, `src/commands/update-check.ts`, and `src/state/update-channel.ts`. The comparison table evaluates preview, target-surface identification, apply authority, installed package verification, installed skill drift verification, automation prompt drift verification, repo integration file updates, rollback instructions, consumer-local state preservation, supply-chain evidence, input quarantine, and hidden remote side-effect avoidance. |
| Landing requires recommendation, follow-up implementation scope, no-action, deferred disposition, or operator-owned approval question. | The "Disposition" paragraph records a `Deferred` decision. The "Trigger Conditions For Future Reconsideration" section names six explicit trigger conditions. The "Conditional Future Implementation Scope" section records the conditional narrow-scope contract. The "Conclusion" section confirms that the current channel is sufficient and any future implementation is a separate work item. |
| Future implementation scope is narrow if recommended. | The "Conditional Future Implementation Scope" section names authority boundaries, commands, validators, evidence artifacts, refusal paths, expected RED tests, review gates, expected files, operator-owned approvals, rollback evidence, and explicit non-goals. The "Forbidden / Unapproved Surfaces" section lists the unapproved surfaces explicitly. |
| Operator-owned decisions remain operator-owned. | The "Conditional Future Implementation Scope" section names operator-owned approvals (policy artifact id, commands, validators, evidence, refusal paths, RED tests, review gates, files, rollback, non-goals, supply-chain, credential, external-mutation, installed-skill, automation-prompt, consumer-repo, merge/push/deploy, public-publish, paid-registry, hosted-service, telemetry, automatic-self-update, Trust Verifier). The "Forbidden / Unapproved Surfaces" section names the surfaces that must halt for operator-owned approval. The writer-report.md "Operator-Owned Input" section records that no operator-owned input is required by this repair and lists the gates that would halt. |
| External and installed-copy input remains data-only unless trusted. | The "Current Installed-Skill Lifecycle And Drift Policy" and "Installed-Skill Drift Evidence" sections record that installed skills are not canonical and that the repo-native contract is the source of truth. The "Current Private Install/Update Policy" section records the `non_canonical_authority` rule. The "Forbidden / Unapproved Surfaces" section prohibits ingesting fetched content as agent instructions. |
| No Stage 2 or Stage 3 artifact implements forbidden surfaces. | The "Disposition" paragraph and the "Forbidden / Unapproved Surfaces" section list every forbidden surface explicitly. The writer-report.md "No Forbidden Surface Edits" section confirms that the repair made no such change. |
| Role and model-family boundaries are preserved. | The writer-report.md "Model-Family Note" section records that Stage 2 (Codex) authored the RED evidence and Stage 3 (this repair) is MiniMax-M3 via `pi` fallback, satisfying Bootstrap Model-Family Separation. The writer-report.md "Zero Test-Surface Edits" and "No Forbidden Surface Edits" sections confirm the Permanent Test Ownership Boundary. |
| The disposition cites the documented source artifacts. | The "Source Citations", "Current Private Install/Update Policy", "Current Installed-Skill Lifecycle And Drift Policy", "Installed-Skill Drift Evidence", and "Prior Private Install/Update Source Material" sections cite `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, `brief.md`, `orchestration-plan.md`, `red-evidence.md`, `coordination-log.jsonl`, `.bandit/policy/private-install-update-channel.json`, `.bandit/policy/skill-lifecycle-contracts.json`, `docs/evaluation/skills/bandit-installed-skill-drift.md`, `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`, `README.md`, `src/commands/init.ts`, `src/commands/update-check.ts`, and `src/state/update-channel.ts`. |
| The disposition records a `Deferred` decision and preserves the current private Git tag or tarball install plus the manual advisory `bandit update-check`. | The "Disposition" paragraph explicitly records `Decision: Deferred` and the "Current Private Install/Update Policy" section preserves the `selected_private_channel.type: "private_git_tag"` install plus the `update_check.command: "bandit update-check [--json]"` advisory. |
| The disposition records the named trigger conditions. | The "Trigger Conditions For Future Reconsideration" section lists six explicit trigger conditions: multi-repo operational signal, repo-wide heartbeat or PM protocol rollout, operator-owned product/policy decision, bootstrap lane exhaustion, provider-pricing or budget approval, and update-channel policy artifact change. |
| The disposition records the conditional future implementation scope with the required scope elements. | The "Conditional Future Implementation Scope" section names authority boundaries, commands, validators, evidence artifacts, refusal paths, expected RED tests, review gates, expected files, operator-owned approvals, rollback evidence, and explicit non-goals. |

## Clean-Code Check Against `CLEAN_CODE.md`

`CLEAN_CODE.md` was read on 2026-06-10 before Stage 3 began and
again during this repair. The disposition artifact, writer
report, and this implementation evidence are documentation
artifacts; the relevant clean-code checks apply to the
documentation surface and to the operational discipline that
the documentation enforces.

- **Spec alignment.** The disposition implements the approved
  brief and the Stage 2 RED verification plan without
  redefining the product contract. The `Deferred` decision is
  the only decision the choreography authorized.
- **Small surface area.** The repair only completed the
  truncated tail of the disposition and added the writer
  report and implementation evidence. The disposition does
  not propose new source code, new commands, new validators,
  new policy artifacts, or new evidence artifacts; it only
  records the conditional future scope as a reference.
- **Simple design.** The disposition follows the
  source-evidence-then-comparison-then-trigger-then-scope
  pattern that the brief and the RED verification plan
  require. No mixed orchestration phases, no flag arguments,
  no hidden state authority.
- **Explicit state.** The disposition names the source
  artifacts by path, the trigger conditions explicitly, the
  forbidden surfaces explicitly, and the operator-owned
  approvals explicitly. The writer report names the writer
  identity, the fallback trigger, the source evidence read,
  the files changed, and the verification commands run.
- **No hidden authority.** The disposition is documentation;
  it does not move canonical authority into the update
  manifest, the cache, the registry, the installed package
  state, the installed global skill, the automation prompt,
  the consumer repo file, the cockpit surface, the
  session-context packet, the work-intake entry, the report,
  the static preview, the fixture, the generated JSON, or
  the roadmap output. The `.bandit/policy/private-install-update-channel.json`
  and `.bandit/policy/skill-lifecycle-contracts.json`
  artifacts remain the binding source of truth.
- **Testable behavior.** The disposition is verifiable
  against the Stage 2 RED verification plan and the brief
  acceptance criteria. The mapping table above shows that
  every criterion has evidence. The writer report records
  the verification commands run and their results.
- **Readable flow.** A reviewer can follow the disposition
  from the top-line decision to the source citations, the
  current policy, the current skill lifecycle, the prior
  source material, the comparison, the trigger conditions,
  the conditional future scope, the forbidden surfaces, and
  the conclusion without reconstructing intent from chat.
- **Locality.** The disposition, writer report, and
  implementation evidence are colocated under
  `docs/work/BANDIT-088/` and reference the existing
  policy, source, and evaluation artifacts directly. No
  unrelated refactors.
- **Failure clarity.** The disposition names the refusal
  paths the conditional future scope would require, names
  the surfaces that would halt for operator-owned approval,
  and explicitly preserves the current policy as
  fail-closed.
- **No role erosion.** The Stage 3 Writer did not edit tests,
  test helpers, fixtures, RED evidence, acceptance mappings,
  formation evidence, review evidence, landing evidence, UAT
  evidence, retrospective evidence, or policy acceptance
  criteria. The writer report records the writer identity as
  MiniMax-M3 via `pi` fallback and notes the Claude
  unavailability; this satisfies the model-family separation
  invariant.
- **Improvement capture.** The disposition records the
  conditional future scope as a reference contract only; the
  trigger conditions are recorded explicitly so that any
  future retrospective can map a future concrete operational
  signal back to the trigger conditions. The Stage 6
  retrospective for `BANDIT-088` will mine the writer-report
  fallback experience and the disposition repair
  experience.

No blocker-level clean-code finding exists in the Stage 3
artifacts. The accepted non-blocking observation is that
Claude is currently unavailable due to the documented
provider session limit; the fallback to MiniMax-M3 is the
explicit fallback the orchestration plan authorized and
does not require a new policy or operator-owned approval.

## Model-Family Separation Evidence

- Stage 2 author model family: `codex` (Codex PM / Test
  Writer authored `red-evidence.md` and the acceptance
  mapping). This is recorded in the
  "Role Boundary Evidence" section of
  `docs/work/BANDIT-088/red-evidence.md`.
- Stage 3 first-priority writer: Claude Sonnet 4.6.
- Stage 3 first-priority writer status: `unavailable` due
  to provider session limit (HTTP 429). Evidence:
  `docs/work/BANDIT-088/stage3-claude-attempt.md`.
- Stage 3 fallback writer: MiniMax-M3 via headless `pi`.
- Stage 3 actual writer for this repair: MiniMax-M3 via
  headless `pi`. The repair is the second MiniMax-M3 attempt
  and produces a complete disposition and the required
  writer report and implementation evidence.
- Bootstrap Model-Family Separation: Stage 2 (Codex) and
  Stage 3 (MiniMax-M3) are different model families. The
  invariant is preserved.
- Permanent Test Ownership Boundary: Stage 3 Writer has
  zero test-edit authority. The writer report records zero
  test-surface edits. The invariant is preserved.

## Zero Test-Surface Edit Confirmation

The Stage 3 Writer (this repair) made zero changes to:

- Test files, test helpers, or fixtures under `test/`.
- `docs/work/BANDIT-088/red-evidence.md`.
- Acceptance mappings in `red-evidence.md` or `brief.md`.
- Any other Test Writer-owned or future-stage surface.

`git diff --check` was run after the repair and reported no
issues. The repair's `git diff` is bounded to the three
allowed Stage 3 artifacts in `docs/work/BANDIT-088/`. No
source code, package metadata, dependency, lockfile,
validator, command routing, artifact renderer, init,
update-check, update-channel state, skill lifecycle,
supply-chain policy, input quarantine, operator-boundary,
or cockpit/session-context projection change was
introduced.

## Verification Commands Run And Results

```sh
node ./bin/bandit.mjs coordination validate BANDIT-088
```

Result: `Coordination log is valid: BANDIT-088`.

```sh
node ./bin/bandit.mjs work-intake validate --json
```

Result: the JSON payload lists every Work Intake Ledger
entry with the expected outcomes. `WIL-INSTALLED-COPY-UPDATE`
is `intake_outcome: "formed"`, `claimable: false`, and
`formed_work_item: "BANDIT-088"`. The other entries remain
`closed` as `BANDIT-083` through `BANDIT-087`, `deferred` for
`WIL-V0-TRIAL`, and `queued_candidate` for the legacy
follow-ups. No intake mutation was introduced.

```sh
npm run bandit -- validate
```

Result: `Bandit state is valid.`

```sh
git diff --check
```

Result: no output (no whitespace or conflict errors).

`npm run typecheck` and `npm test` were **not** run because
no source code, package metadata, package script,
dependency, lockfile, validator, command routing, artifact
renderer, init, update-check, update-channel state, skill
lifecycle, supply-chain policy, input quarantine,
operator-boundary, or cockpit/session-context projection
change was introduced. The dispatch explicitly forbade
running source tests unless source files were changed,
and the repair did not change source files.

## Blocker Disposition

No blocker was encountered by this repair. The prior
MiniMax-M3 attempt exited with `Unhandled stop reason: error`
mid-write, which is the only blocker the repair was
dispatched to resolve. The repair completed the disposition,
the writer report, and this implementation evidence in a
single repair pass and recorded `pass` as the verdict.
