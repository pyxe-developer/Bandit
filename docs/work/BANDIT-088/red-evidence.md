# BANDIT-088 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

This work item is a non-product installed-copy update-path triage chore. Stage
2 does not authorize source-code implementation, public package publishing,
hosted update services, paid registry setup, telemetry, automatic self-update,
consumer-repo mutation, installed global skill mutation, automation prompt
mutation, credential handling, external repo mutation, merge, push, deploy,
Trust Verifier cutover, or unrelated Phase 8 product work.

The testable contract for Stage 3 is a source-cited disposition artifact that
records a recommendation, narrow future implementation scope, explicit
no-action decision, explicit deferred disposition, or operator-owned approval
question without implementing or approving any update-apply behavior or
external side effect.

## RED / Disposition Verification Plan

Stage 3 delivery must fail closed unless
`installed-copy-update-path-disposition.md` satisfies all of these checks:

1. It cites source proposal `WIL-INSTALLED-COPY-UPDATE` from
   `.bandit/work-intake-ledger.json` and the deprecated source metadata in
   `FOLLOWUPS.md`.
2. It cites current routing evidence from `docs/roadmap/CURRENT_CONTEXT.md`,
   `docs/roadmap/ROADMAP.md`, `STATUS.md`, `docs/work/BANDIT-088/brief.md`,
   and `docs/work/BANDIT-088/orchestration-plan.md`.
3. It cites current private install/update policy from
   `.bandit/policy/private-install-update-channel.json`.
4. It cites current installed-skill lifecycle and drift evidence from
   `.bandit/policy/skill-lifecycle-contracts.json` and
   `docs/evaluation/skills/bandit-installed-skill-drift.md`.
5. It cites prior private install/update source material from
   `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`, `README.md`,
   `src/commands/init.ts`, `src/commands/update-check.ts`, and
   `src/state/update-channel.ts`.
6. It compares current private Git tag or tarball install plus manual
   update-check notification against desired installed-copy update-path
   responsibilities: preview, target-surface identification, apply authority,
   installed package verification, installed skill drift verification,
   automation prompt drift verification, repo integration file updates,
   rollback instructions, consumer-local state preservation, supply-chain
   evidence, input quarantine, and hidden remote side-effect avoidance.
7. It states that `.bandit/policy/private-install-update-channel.json` remains
   the current install/update source of truth and that update-check remains
   advisory. Public publishing, paid registry setup, hosted update services,
   telemetry, automatic self-update, credential handling, consumer-repo
   mutation, installed global skill mutation, automation prompt mutation,
   merge, push, and deploy remain disabled unless a later approved policy path
   changes them.
8. It states that installed package state, update manifests, update caches,
   package registries, installed global skills, automation prompts, consumer
   repository files, cockpit output, session-context packets, work-intake
   entries, roadmap text, static previews, fixtures, generated JSON, and report
   output cannot become canonical Bandit workflow authority without a later
   approved source-of-truth boundary.
9. It states that fetched package metadata, release manifests, dependency docs,
   installed skill text, automation prompt text, consumer repository content,
   third-party docs, remote package metadata, and generated instruction content
   remain data-only inputs unless a trusted-source gate upgrades them for a
   scoped release-authorized use.
10. It records one of: no-action because manual private reinstall and
    update-check notification remain sufficient now, deferred disposition with
    trigger conditions, one or more narrow future implementation slices, or an
    operator-owned approval question.
11. If it recommends future implementation, it names exact authority boundaries
    for preview, apply, verify, rollback, update manifest trust,
    consumer-local state preservation, installed skill drift checks, automation
    prompt drift checks, repo integration file updates, supply-chain evidence,
    input quarantine, refusal paths, expected tests, review gates, expected
    files, and explicit non-goals.
12. If it determines operator-owned approval is needed for public publishing,
    paid registry, hosted service, telemetry, automatic self-update,
    credential, external repo mutation, installed global skill mutation,
    automation prompt mutation, merge/push/deploy, Trust Verifier, product,
    UAT, business, cost/risk, or ambiguous scope, it halts at that gate and
    states the exact decision required instead of guessing.

No RED source tests are added in Stage 2 because the next delivery can be
verified from a bounded evidence artifact. If Stage 3 recommends a concrete
policy artifact, preview command, apply command, verification command, rollback
artifact, install-manifest validator, skill-drift validator, automation-prompt
drift validator, repo integration update validator, supply-chain rule,
input-quarantine rule, operator-boundary rule, or source implementation, that
future work must create focused RED tests before implementation.

## Acceptance Criteria Mapping

| Criterion | Evidence required from Stage 3 |
| --- | --- |
| `WIL-INSTALLED-COPY-UPDATE` is the authorized intake-derived gap proposal after `BANDIT-087` closeout. | Stage 3 must cite `.bandit/work-intake-ledger.json`, `FOLLOWUPS.md`, `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md`, and `BANDIT-087` closeout evidence. |
| Current install/update policy remains unchanged during triage. | Stage 3 must explicitly preserve `.bandit/policy/private-install-update-channel.json` as source of truth and preserve manual private install plus advisory update-check notification. |
| Evidence review covers current policy and desired future installed-copy responsibilities. | Stage 3 must cite current update-channel policy, skill lifecycle contract, installed skill drift evidence, private install source material, init/update-check/update-channel code, and compare preview/apply/verify/rollback/drift responsibilities. |
| Landing requires recommendation, follow-up implementation scope, no-action, deferred disposition, or operator-owned approval question. | Stage 3 delivery must produce `docs/work/BANDIT-088/installed-copy-update-path-disposition.md` before Stage 4 review. |
| Future implementation scope is narrow if recommended. | Stage 3 must name exact source artifacts, authority boundaries, commands, validators, evidence artifacts, refusal messages, RED tests, expected files, review gates, operator-owned approvals, rollback evidence, and non-goals. |
| Operator-owned decisions remain operator-owned. | Stage 3 must halt instead of guessing if approval is needed for public publishing, paid registry, hosted services, telemetry, automatic self-update, credentials, external mutation, installed skill mutation, automation prompt mutation, merge/push/deploy, Trust Verifier, product, UAT, business, or cost/risk posture. |
| External and installed-copy input remains data-only unless trusted. | Stage 3 must preserve input quarantine for fetched update metadata, release manifests, package metadata, installed skills, automation prompts, dependency docs, consumer repository content, third-party content, and generated instructions. |
| No Stage 2 or Stage 3 artifact implements forbidden surfaces. | Stage 3 must not publish, provision registry or hosted service, enable telemetry or automatic self-update, mutate consumer repos, edit installed skills or automation prompts, create credentials, push, merge, deploy, or approve Trust Verifier cutover. |
| Role and model-family boundaries are preserved. | Stage 3 Writer has no test-edit authority and must be a different model family because Codex authored this Stage 2 evidence. |

## Verification Commands

```sh
node ./bin/bandit.mjs coordination validate BANDIT-088
node ./bin/bandit.mjs work-intake validate --json
npm run bandit -- validate
git diff --check
```

Focused source tests are required later only if Stage 3 or a follow-up work
item changes command routing, install/update policy, update-check, init,
update-channel state, skill lifecycle, installed-package validation,
installed-skill drift validation, automation-prompt drift validation,
repo-integration update behavior, supply-chain policy, input quarantine,
operator-boundary behavior, dependencies, package scripts, package metadata,
artifact renderers, cockpit/session-context projections, or lockfiles.

## Next Action

Dispatch Stage 3 triage delivery to Claude-family Implementation Writer. The
Writer must produce the bounded installed-copy update-path disposition and
supporting evidence without editing Test Writer-owned surfaces, formation
evidence, review evidence, landing evidence, UAT evidence, retrospective
evidence, canonical install/update policy, installed global skills, automation
prompts, consumer repositories, external repositories, credentials, package
publishing, hosted services, telemetry, automatic self-update, merge/push/deploy
behavior, paid routing, Trust Verifier cutover, local API, State Index,
scheduler behavior, claim/worktree lifecycle, guarded browser action
authority, or unrelated Phase 8 product work.

## Role Boundary Evidence

- Stage 2 Test Writer: Codex authored this RED/disposition evidence.
- RED author model family: `codex`.
- Codex materially edited tests: `false`; no source test files were added.
- Codex materially authored Stage 2 acceptance mapping: `true`.
- Acceptance mapping owner: Test Writer.
- Stage 3 test-edit authority: `none`.
- Stage 3 Writer routing: because Codex authored Stage 2 evidence and
  acceptance mapping, Stage 3 must route to a different model family through
  the Claude-family bootstrap implementation-writer path unless Claude auth
  fails or times out after the required 20-minute window; fallback is
  MiniMax-M3 through headless `pi`.
- Stage 3 Writer has zero authority to create, edit, delete, regenerate,
  format, or mechanically adjust tests, test helpers, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, retrospective evidence, or policy acceptance criteria for
  `BANDIT-088`.
