# BANDIT-088: Installed-Copy Update Path Disposition

## Disposition

**Decision: Deferred** - the current private Git tag or tarball install
plus manual, non-blocking update-check notification from `BANDIT-071`
remains the only supported installed-copy channel for `BANDIT-088`. No
public npm publishing, paid private registry setup, hosted update
service, telemetry, automatic self-update, credential handling,
consumer-repo mutation, installed global skill mutation, automation
prompt mutation, repo-integration file mutation, merge, push, deploy,
or Trust Verifier cutover is implemented, approved, or authorized by
this work item. The desired installed-copy update-path responsibilities
are recorded as a future-scope contract with named trigger conditions
and a conditional narrow-scope contract; the contract is for reference
only and is not authorized by this disposition.
`.bandit/policy/private-install-update-channel.json` and
`.bandit/policy/skill-lifecycle-contracts.json` remain the binding
source-of-truth policy artifacts. The 2026-05-24 safe-landing and
auto-land ADRs, the V0 plan, and the installed skill drift evidence
remain the binding contract for the current Bandit workflow. No
implementation is authorized by this work item.

---

## Source Citations

### WIL-INSTALLED-COPY-UPDATE

**Source:** `.bandit/work-intake-ledger.json`, entry
`WIL-INSTALLED-COPY-UPDATE`

- Title: "Installed-Copy Update Path"
- Source anchor: "Push Bandit Updates To Installed Copies" in
  `FOLLOWUPS.md`
- Origin date: 2026-06-09
- Intake outcome: `formed`; formed work item: `BANDIT-088`;
  `claimable: false`
- Suggested type: gap
- Risk/product scope: "formed as `BANDIT-088` with no public publishing,
  hosted update service, telemetry, automatic self-update, paid registry
  setup, consumer-repo mutation, installed global skill mutation,
  automation prompt mutation, merge, push, deploy, Trust Verifier
  cutover, or unrelated Phase 8 work authorized"

**Source:** `FOLLOWUPS.md`, section "Push Bandit Updates To Installed
Copies"

- Origin: Post-bootstrap parallel workstreams and global PM heartbeat
  skill discussion on 2026-05-25
- Current decision at intake: "The PM heartbeat protocol should be
  designed as a global skill so it can be reused across projects after
  Bandit bootstrap."
- Follow-up question: "How should the Bandit CLI publish or push
  updates to all installed Bandit skills, automation prompts, and
  repo integration files so global workflow protocols stay in sync
  across projects?"
- Why later: "Global skill reuse depends on a reliable
  installation-update path, but implementing distribution now would
  interrupt the active bootstrap-gap lane and `BANDIT-021`/`BANDIT-022`
  landing work."
- Expected evaluation point: "After the bootstrap-gap lane is complete
  and before Bandit starts using the PM heartbeat protocol across
  multiple projects."

### Current Routing Evidence

**Source:** `docs/roadmap/CURRENT_CONTEXT.md`

- Active work item: `BANDIT-088` - Installed-Copy Update Path
- Stage 1 formation approved; `BANDIT-087` is the last closed work
  item
- No bootstrap gap blocks `BANDIT-088`
- No operator-owned input required for the current action
- Halt conditions include: "approving public package publishing,
  approving paid registry setup, approving hosted update services,
  approving telemetry, approving automatic self-update, approving
  credential handling, approving external repo mutation, approving
  installed global skill mutation, approving automation prompt
  mutation, approving merge/push/deploy authority, approving Trust
  Verifier cutover policy"
- "Local Qwen is authorized only through
  `.bandit/reviewers/local-qwen.json` and
  `bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible
  endpoint at `http://127.0.0.1:8000/v1`. The direct `qwen` CLI is
  revoked for Bandit reviewer routing."

**Source:** `docs/roadmap/ROADMAP.md`

- `BANDIT-088` is current gap: "Installed-Copy Update Path (Stage 1:
  formation approved)"
- `WIL-INSTALLED-COPY-UPDATE` is formed as `BANDIT-088` with Stage 1
  formation approved
- `WIL-V0-TRIAL` is deferred behind this lane and depends on
  `WIL-INSTALLED-COPY-UPDATE` being closed or dispositioned
- No blocking gaps in `.bandit/bootstrap-gaps.json`

**Source:** `STATUS.md` (last updated 2026-06-10)

- `BANDIT-088` is formation approved; required operator input:
  `none_required`
- `BANDIT-087` is closed and recorded as the prior closed work item

**Source:** `docs/work/BANDIT-088/brief.md`

- Work type: chore (decision/triage only); no implementation
  authorized
- Out of scope: "Do not publish Bandit to public npm, provision a paid
  private registry, create a hosted update service, enable telemetry,
  add automatic self-update behavior, or mutate a consumer repository
  in this work item." "Do not push or overwrite installed global
  skills, Codex skills, Claude plugins, automation prompts, automation
  memory, hooks, repo integration files, or external repositories in
  this work item."
- Stage 1 verdict table: Stage 1 brief "pass"; Stage 2 RED evidence
  "required next"; Stage 3 implementation "required later"
- Local Qwen route enforced: "Stage 4 review must use Local Qwen only
  through `.bandit/reviewers/local-qwen.json` via `node
  bin/omlx-chat-completions.mjs`, CodeRabbit with a full 10-minute
  formation/review timeout allowance where applicable, or honest
  provider-timeout/refusal evidence without claiming a pass."

**Source:** `docs/work/BANDIT-088/orchestration-plan.md`

- Contract version 1; coordination state: `formation_approved` ->
  `orchestration_plan_recorded` -> `red_recorded`
- Stage 3 required artifacts:
  `installed-copy-update-path-disposition.md`, `writer-report.md`,
  `implementation-evidence.md`
- No stage authorizes public publishing, paid registry, hosted
  service, telemetry, automatic self-update, credential handling,
  external repo mutation, installed global skill mutation, automation
  prompt mutation, merge/push/deploy, Trust Verifier cutover,
  Installed-Copy Update Path implementation, the V0 Closeout Claude
  Code A/B Product-Value Trial, local API, State Index, scheduler
  behavior, claim/worktree lifecycle, guarded browser action
  execution, or unrelated Phase 8 work

**Source:** `docs/work/BANDIT-088/red-evidence.md`

- `pass` for Stage 2: Test Design And RED Evidence
- Verification plan demands the disposition cite `WIL-INSTALLED-COPY-UPDATE`,
  current routing evidence, `.bandit/policy/private-install-update-channel.json`,
  `.bandit/policy/skill-lifecycle-contracts.json`, installed skill
  drift evidence, prior private install/update source material
  (`BANDIT-071` spec, `README.md`, `init.ts`, `update-check.ts`,
  `update-channel.ts`), and compare current private Git tag or tarball
  install plus manual update-check against desired installed-copy
  update-path responsibilities
- Stage 3 test-edit authority: `none`; Stage 3 must be authored by a
  different model family from Codex

**Source:** `docs/work/BANDIT-088/coordination-log.jsonl`

- Sequence 1: `brief_created` (Repo PM, 2026-06-10T01:26:44Z)
- Sequence 2: `formation_approved` (Repo PM, 2026-06-10T01:40:53.002Z)
- Sequence 3: `orchestration_plan_recorded` (Work Item PM,
  2026-06-10T02:23:45.039Z)
- Sequence 4: `red_recorded` (Test Writer, 2026-06-10T02:23:54Z)
- Safe trigger after sequence 4: `implementation_allowed`

### Current Private Install/Update Policy

**Source:** `.bandit/policy/private-install-update-channel.json`

- `policy_id: "private-install-update-channel"`
- `work_item: "BANDIT-071"`
- `distribution_posture: "private_non_public"`
- `public_npm_publishing: "out_of_scope"`
- `selected_private_channel.type: "private_git_tag"`
- `supported_install_command_shapes`:
  - `npm install -D git+ssh://<private-host>/<org>/bandit.git#<tag>`
  - `npm install -D <private-tarball>.tgz`
- `version_ref_semantics`: install is pinned to an explicit version
  tag/ref so consumers control upgrades; an update is available when
  the private release manifest `latest_version` or `latest_ref`
  differs from the installed version/ref
- `update_source.type: "file"` (repo-local or operator-accessible
  private release manifest; no external service is contacted)
- `update_check.command: "bandit update-check [--json]"`
- `deterministic_statuses`: `unconfigured`, `disabled`, `unreachable`,
  `current`, `update_available`
- `non_blocking_statuses`: `disabled`, `unreachable`
- `freshness_bounded_cache: ".bandit/update-channel-cache.json"`
- `normal_cli_alert`: normal CLI commands emit a concise non-blocking
  stderr alert only from a fresh cached `update_available` result and
  never mask the requested command's stdout, stderr, or exit status
- `data_minimization.forbidden_payload`: telemetry, repo contents,
  workflow state, user activity, package usage, model_call_metadata,
  review_packets, hidden_identifier
- `out_of_scope`: `public_npm_publishing`, `paid_private_registry_setup`,
  `hosted_external_update_service`, `automatic_self_update`,
  `telemetry`, `merge_push_deploy_automation`
- `non_canonical_authority`: update metadata, cached update results,
  package registries, and consumer install state are advisory only;
  repo-native `.bandit/` state and CLI commands remain authoritative

This is the only supported install/update channel for `BANDIT-088`.
Public publishing, paid registry setup, hosted update services,
telemetry, automatic self-update, and merge/push/deploy automation are
explicitly disabled at the policy level. Any future change to this
contract requires a separate operator-owned gate and a new policy
artifact - this disposition does not approve, recommend, or authorize
that change.

### Current Installed-Skill Lifecycle And Drift Policy

**Source:** `.bandit/policy/skill-lifecycle-contracts.json`

- `policy_id: "skill-lifecycle-contracts"`
- `installed_skills_are_canonical: false`
- `contracts[0].skill_id: "bandit"`
- `contracts[0].owner: "Codex PM"`
- `contracts[0].version: "1.0.0"`
- `contracts[0].intended_stages`: `stage0_context_readiness`,
  `stage1_work_item_brief`, `stage2_red_evidence`,
  `stage3_implementation`
- `contracts[0].forbidden_actions`: `edit_installed_global_skill`,
  `fetch_external_prompts`, `approve_uat`, `merge`, `push`, `deploy`
- `contracts[0].installed_skill_drift.evidence_path`:
  `docs/evaluation/skills/bandit-installed-skill-drift.md`
- `contracts[0].installed_skill_drift.expected_sha256`:
  `275f633467ca4831a1bce91744fdc3c62326d66f489bcd294a92485f285be158`
- `contracts[0].installed_skill_drift.required_before_policy_use`:
  `true`
- `contracts[0].forbidden_actions`: also includes
  `merge`, `push`, `deploy`; this is consistent with the
  `BANDIT-088` choreography that does not authorize merge, push, or
  deploy authority from this disposition.

The Bandit installed-skill contract declares that the installed copy of
the `bandit` cold-start skill is **not canonical** and forbids editing
the installed global skill, fetching external prompts, approving UAT,
merging, pushing, and deploying. The contract is owned by Codex PM and
requires the installed-skill drift evidence to match the repo contract
before the skill is trusted for policy use.

### Installed-Skill Drift Evidence

**Source:** `docs/evaluation/skills/bandit-installed-skill-drift.md`

- `skill_id: bandit`
- `installed_artifact:
  /Users/matthewflebbe/.codex/skills/bandit/SKILL.md`
- `expected_sha256:
  275f633467ca4831a1bce91744fdc3c62326d66f489bcd294a92485f285be158`
- `artifact_sha256:
  275f633467ca4831a1bce91744fdc3c62326d66f489bcd294a92485f285be158`
- `captured_at: 2026-05-27T00:00:00Z`
- `disposition: matches_repo_contract`

The installed-skill artifact matches the repo contract as captured on
2026-05-27. No installed-skill drift is currently recorded, but the
disposition treats any future drift as a hygiene signal: the repo-native
contract remains canonical, the installed copy is a derived projection,
and any installed-copy update mechanism would need to honor that
projection boundary.

### Prior Private Install/Update Source Material

**Source:** `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json`

- `kind: chore`
- `title: "Private Installable Distribution And Update Notification
  Channel"`
- `status: Queued`
- `bootstrap_gap: "BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL"`
- `blocked_until`: `BANDIT-068` is landed/closed, the
  test-strength/mutation-adequacy gate and the verification-oracle
  provenance gate are resolved, blocked, or explicitly dispositioned.
- Scope items: define a private non-public distribution contract;
  prefer a private Git/tag or private-registry compatible install path;
  make the CLI package installable from the selected private channel;
  define repo-local install/update metadata; add a CLI-owned update
  check; show update alerts on normal CLI use only when configured,
  non-blocking, freshness-bounded, and unable to mask command failures;
  add an explicit `bandit update-check` command; keep update checks
  data-minimal with no telemetry; keep this chore focused on
  private installability, package metadata, update metadata,
  update-check command wiring, docs, and tests; do not approve public
  npm publishing, paid private registry setup, automatic self-update,
  merge/push/deploy, product UAT, Trust Verifier cutover, or unrelated
  cockpit/product scope.
- Acceptance criteria: private distribution policy artifact exists;
  packed/private install smoke succeeds in a fresh consumer repo; packed
  artifacts exclude unrelated active work history; installed CLI
  runtime no longer depends on devDependency-only `tsx`; consumer
  `bandit update-check` returns deterministic
  `current`/`update_available`/`unconfigured`/`unreachable`/`disabled`;
  normal CLI update alerts are non-blocking and never mask exit status;
  update checks are freshness-bounded and cached; update metadata is
  data-minimal; the install/update channel includes explicit update
  commands or docs; validation, focused tests, and smoke tests cover
  all deterministic status paths; CLI authority, repo-native
  canonical artifacts, supply-chain gate, layered risk
  classification, operator fail-closed boundary, Permanent Test
  Ownership Boundary, and Bootstrap Model-Family Separation are
  preserved.

This spec is the source of truth for the
`.bandit/policy/private-install-update-channel.json` artifact and is
the contract this `BANDIT-088` disposition must preserve, not extend.

**Source:** `README.md`

- "Bandit is currently private. Public npm publishing, paid private
  registry setup, hosted update services, telemetry, and automatic
  self-update are not part of the current install channel."
- Private install section supports:
  `npm install -D git+ssh://<private-host>/<org>/bandit.git#<tag>` and
  `npm install -D <private-tarball>.tgz`.
- Update checks section documents
  `.bandit/update-channel.json` config, the data-minimal private
  release manifest, `npx bandit update-check --json`, and the
  deterministic statuses
  `unconfigured`/`disabled`/`unreachable`/`current`/`update_available`.
- "The private package intentionally includes only the CLI/runtime
  surfaces, starter templates, selected policy defaults, and this
  README. It excludes active work history, tests, and repo-local
  workflow state from the packed distribution."
- "update checks never mutate the package or mask the requested
  command's exit status."

**Source:** `src/commands/init.ts`

- `initBandit(repoRoot)` seeds the default Bandit repo-native state
  including policy artifacts, templates, and the local Qwen reviewer
  configuration. It is idempotent and will not overwrite existing
  files.
- `seedDistributionDefaults(repoRoot)` only runs when the package is
  resolved from inside `node_modules` (an installed package), not from
  this development checkout. It copies starter templates and selected
  seed files (`.bandit/policy/smell-triggers.json` and
  `.bandit/reviewers/local-qwen.json`) into the consumer repo,
  skipping any file the consumer already has.
- `init.ts` is the only place the Bandit package itself writes into a
  consumer repo at install/seed time. It does not mutate installed
  global skills, automation prompts, hooks, repo integration files,
  or any other surface beyond the documented seed list.

**Source:** `src/commands/update-check.ts`

- `updateCheck(repoRoot, args)` parses `--json` and delegates to
  `runUpdateCheck(repoRoot)` in `src/state/update-channel.ts`. It
  formats human-readable output for each deterministic status.
- The command writes no state in the consumer repo beyond the
  freshness-bounded cache file that `runUpdateCheck` produces.
- There is no `bandit apply-update` or equivalent command: the
  update-check command is read-only and advisory by design.

**Source:** `src/state/update-channel.ts`

- `runUpdateCheck(repoRoot)` returns one of
  `unconfigured`/`disabled`/`unreachable`/`current`/`update_available`.
- The configured update source type is `file`; the source path is
  read from `.bandit/update-channel.json` `update_source.path`. There
  is no network call, no telemetry, and no external service.
- A successful check writes
  `.bandit/update-channel-cache.json` with `contract_version`,
  `status`, `update_available`, `installed_version`,
  `latest_version`, `latest_ref`, `checked_at`, and
  `freshness_expires_at`.
- `emitCachedUpdateAlert` only writes a concise stderr alert from a
  fresh cached `update_available` result, never from a stale cache,
  and never masks the requested command's stdout, stderr, or exit
  status.
- `nonBlockingResult("disabled" | "unreachable", config)` explicitly
  marks `disabled` and `unreachable` as non-blocking; the
  `unconfigured` status is returned when there is no
  `.bandit/update-channel.json`.

### Current Vs. Desired Installed-Copy Update Path Comparison

The current installed-copy update path is the
`BANDIT-071` private Git tag or tarball install plus the manual,
non-blocking `bandit update-check [--json]` advisory. The desired
installed-copy update path is a future-shaped workflow with explicit
responsibilities across preview, target-surface identification, apply
authority, installed package verification, installed skill drift
verification, automation prompt drift verification, repo integration
file updates, rollback instructions, consumer-local state preservation,
supply-chain evidence, input quarantine, and hidden remote side-effect
avoidance.

| Desired responsibility | Current behavior in this repo | Gap |
| --- | --- | --- |
| Preview | `bandit update-check [--json]` reports the deterministic status, `installed_version`, `latest_version`, `latest_ref`, and the `update_command` from the manifest. | A dry-run/diff-style preview that names the exact files, configs, and surfaces that an apply would change is not implemented. |
| Target-surface identification | The CLI identifies the consumer install surface (the installed package version and ref) but does not enumerate installed global skills, automation prompts, hooks, repo integration files, or external repos. | Target surfaces beyond the package itself are not enumerated and not verified. |
| Apply authority | `bandit update-check` is read-only. There is no `bandit apply-update` or equivalent; an actual update requires the operator to re-run the documented `npm install -D <private-source>#<ref>` or the packaged `update_command`. | No apply command exists; applying an update is a manual operator action. |
| Installed package verification | `update-check` reports `installed_version` and the `update_command`; the operator decides when to re-run the install. | No automated post-install verification (smoke, `bandit validate`, `bandit init`, `bandit update-check --json`) gate is part of an apply path. |
| Installed skill drift verification | `docs/evaluation/skills/bandit-installed-skill-drift.md` records the captured installed-skill SHA-256 against the repo contract; the policy contract requires this drift evidence before the installed skill can be trusted for policy use. | Drift verification is captured once on 2026-05-27 and is not run as part of any apply path. |
| Automation prompt drift verification | There is no automation-prompt drift artifact for the Bandit cold-start or PM heartbeat prompts. | Drift verification is not implemented. |
| Repo integration file updates | `init.ts` seeds only the documented `docs/templates/` files plus `.bandit/policy/smell-triggers.json` and `.bandit/reviewers/local-qwen.json` and only when Bandit runs as an installed package. It does not overwrite existing files. | There is no apply path that mutates repo integration files; only the initial seed-on-install path exists. |
| Rollback instructions | The `update_command` returns the operator to the prior `installed_version`/`current_source_ref` by re-running the documented install command, and `package.json` records the installed version. | No explicit `bandit rollback` or rollback recipe is implemented; rollback is operator-driven. |
| Consumer-local state preservation | `update-check` is read-only; `init` does not overwrite existing seed files; the freshness-bounded cache lives in `.bandit/update-channel-cache.json` and is overwritten only by a successful check. | No apply path is implemented, so consumer-local state preservation is moot until an apply path is added. |
| Supply-chain evidence | `data_minimization.forbidden_payload` and `non_canonical_authority` in `.bandit/policy/private-install-update-channel.json` declare update metadata data-minimal and advisory. The release manifest is a private repo-local file. | Supply-chain evidence (signed release manifest, pinned private source ref, operator-readable provenance) is not formalized in this disposition because no apply path is implemented. |
| Input quarantine | Installed global skills are not canonical per the lifecycle contract; the installed copy is a derived projection that must match the repo contract before policy use. | The update channel does not ingest fetched prompts, release instructions, or external documentation as agent instructions; nothing in the current channel crosses the data-only quarantine line. |
| Hidden remote side-effect avoidance | `update_source.type: "file"` and `update_source.path` are repo-local or operator-accessible; no network call is made. | Hidden remote side effects are not possible in the current channel because there is no apply path and no network call. |

The current behavior is sufficient for the bootstrap-gap lane: every
installed copy sees the same private install contract, the
freshness-bounded cache prevents unbounded network work, the alert
behavior is non-blocking and never masks command failure, and the
installed-skill drift evidence is captured against the repo contract.
The desired responsibilities above remain future work behind named
trigger conditions, and any implementation that crosses into apply
authority, public publishing, hosted service, telemetry, automatic
self-update, credential handling, installed global skill mutation,
automation prompt mutation, consumer-repo mutation, or external
side effects is **explicitly out of scope** for this disposition.

### Trigger Conditions For Future Reconsideration

The deferred disposition is conditional on Bandit reaching any of the
following trigger conditions. Until one of these is observed, the
current private Git tag or tarball install plus the manual advisory
`bandit update-check` is the only supported installed-copy channel:

1. **Multi-repo operational signal.** Bandit is actively used as an
   installed devDependency across two or more private consumer
   repos that need the same workflow protocol updates simultaneously
   and the operator reports a concrete coordination or drift problem
   that the current advisory channel cannot resolve.
2. **Repo-wide heartbeat or PM protocol rollout.** The
   `BANDIT-022` heartbeat chore agent or a similar PM protocol is
   moved from bootstrap-only to general rollout and an operator-owned
   decision exists to require the same protocol in every consumer
   repo's installed global skills and automation prompts.
3. **Operator-owned product/policy decision.** The operator records
   a product/policy decision that an installed-copy update path is
   required, names the risk class, and approves the
   supply-chain/credential/external-mutation scope, the policy
   artifact id, and the operator-owned gate that will own the
   approval.
4. **Bootstrap lane exhaustion.** The bootstrap-gap lane is fully
   resolved, blocked, or explicitly dispositioned and the next
   active work item is a deferred install/update path implementation
   slice that has its own formation, RED, implementation, review,
   and landing evidence.
5. **Provider-pricing or budget approval.** A recurring paid
   reviewer, paid model, hosted update service, paid private registry,
   or recurring high-token routing is required to support a
   documented installed-copy update workflow, and the operator has
   recorded a Provider Pricing Evidence-backed approval, an active
   spend-class approval, and a per-run expected cost ceiling.
6. **Update-channel policy artifact change.** A new
   `.bandit/policy/private-install-update-channel.json` revision
   (or successor policy artifact) is approved with a new contract
   version, a new `selected_private_channel`, a new
   `update_source.type`, new forbidden/required evidence, or a new
   out-of-scope list, and that revision is itself formed as a
   separate work item with its own formation, RED, implementation,
   review, landing, and closeout evidence.

If none of the trigger conditions are observed, the deferred
disposition is still correct and the current channel is still
sufficient.

### Conditional Future Implementation Scope

If a future work item satisfies one or more of the trigger conditions
above and the operator approves the scope, the smallest viable
implementation must remain narrow and fail-closed. The conditional
scope is for reference only; this disposition does not authorize it.

- **Authority boundaries.** Implementation is bounded to
  `preview`, `apply`, `verify`, `rollback`,
  `update_manifest_trust`, `consumer_local_state_preservation`,
  `installed_skill_drift_check`, `automation_prompt_drift_check`,
  `repo_integration_file_update`, `supply_chain_evidence`, and
  `input_quarantine`. The implementation must **never** grant
  workflow authority to the update manifest, the cache, the
  registry, the installed package state, the installed global
  skill, the automation prompt, the consumer repo file, the
  cockpit surface, the session-context packet, the work-intake
  entry, the report, the static preview, the fixture, the
  generated JSON, or the roadmap output. `.bandit/` state and CLI
  commands remain canonical.
- **Commands.** Conditional commands (not approved by this
  disposition): `bandit update-preview [--json]`,
  `bandit update-apply --ref <ref> [--dry-run]`,
  `bandit update-verify [--json]`, and `bandit update-rollback
  --to <ref> [--json]`. All four must be non-blocking on failure,
  freshness-bounded, refusal-path explicit, and must not mask
  the requested command's exit status.
- **Validators.** A new
  `.bandit/policy/installed-copy-update-contract.json` (or
  successor artifact) records the source trust model, the
  signed/unsigned manifest expectation, the installed-skill drift
  expectation, the automation-prompt drift expectation, the
  repo-integration file expectation, the supply-chain evidence
  expectation, the input-quarantine expectation, the operator
  boundary, and the explicit out-of-scope list. A validator
  script (e.g. `bandit policy validate
  installed-copy-update-contract`) must fail closed on missing
  required fields, on a forbidden payload, on a stale freshness
  window, on missing operator-owned approval metadata, or on a
  weak refusal path.
- **Evidence artifacts.** Required artifacts for a future apply:
  `update-preview.json`, `update-apply.json`,
  `update-verify.json`, `update-rollback.json`,
  `installed-skill-drift.md`, `automation-prompt-drift.md`,
  `repo-integration-update.md`, `supply-chain-evidence.md`,
  `input-quarantine-evidence.md`, and the corresponding policy
  validator output. Each evidence artifact must be
  freshness-bounded and must be checked before any apply.
- **Refusal paths.** The validators and commands must refuse with
  a clear message when: the manifest is unsigned and the policy
  requires signing; the manifest payload contains a forbidden
  field; the freshness window is expired; the installed-skill
  drift evidence is missing or stale; the automation-prompt
  drift evidence is missing or stale; the operator-owned
  approval metadata is missing; the targeted surface is not in
  the documented allow-list; the consumer repo contains
  uncommitted local changes that would be overwritten; or the
  apply would cross a documented never-auto-landable or
  high-risk layered risk-classification signal.
- **Expected RED tests.** RED tests must cover: the
  `bandit update-preview` output for the five deterministic
  states; the validator refusal paths above; the cache
  freshness-bounded behavior; the `bandit update-apply`
  refusal when the operator-owned approval metadata is missing;
  the `bandit update-verify` refusal when the installed-skill
  drift is stale; the `bandit update-rollback` refusal when the
  target ref is not in the documented allow-list; the
  `update-channel.test.mjs` happy path and refusal paths; the
  supply-chain gate refusal when a forbidden payload is
  present; the input-quarantine refusal when an external
  instruction-bearing surface is treated as instruction; the
  operator-boundary refusal when an external repo mutation is
  requested; the consumer-local state preservation test that
  proves the consumer's `.bandit/` state, hooks, automation
  prompts, and global skills are not mutated by the apply.
- **Review gates.** Stage 4 must include Local Qwen through the
  authorized MLX adapter route, CodeRabbit with the full
  10-minute timeout window or honest provider-timeout/refusal
  evidence, an escalated reviewer when policy smells require
  it, the supply-chain gate, the input-quarantine gate, the
  skill-lifecycle gate, the operator-boundary gate, the
  layered risk-classification gate, the review-subject hash,
  and the aggregate review evidence.
- **Expected files.** Conditional files (not approved by this
  disposition): `src/commands/update-preview.ts`,
  `src/commands/update-apply.ts`,
  `src/commands/update-verify.ts`,
  `src/commands/update-rollback.ts`,
  `src/state/installed-copy-update.ts`,
  `.bandit/policy/installed-copy-update-contract.json`,
  `docs/templates/installed-copy-update-contract.md`,
  `test/installed-copy-update.test.mjs`,
  `test/installed-copy-update-validators.test.mjs`,
  `test/installed-copy-update-refusal.test.mjs`,
  `test/installed-copy-update-supply-chain.test.mjs`,
  `test/installed-copy-update-input-quarantine.test.mjs`,
  `test/installed-copy-update-operator-boundary.test.mjs`,
  `docs/evaluation/skills/bandit-installed-skill-drift.md` (refresh),
  `docs/evaluation/prompts/bandit-automation-prompt-drift.md` (new).
- **Operator-owned approvals.** Required operator-owned approvals
  before the conditional scope is implemented: explicit approval
  of the new policy artifact id, the new commands, the new
  validators, the new evidence artifacts, the refusal paths,
  the expected RED tests, the review gates, the expected
  files, the rollback evidence, and the explicit non-goals.
  The operator must also approve the supply-chain/credential
  scope, the external-mutation scope, the installed-global-skill
  scope, the automation-prompt scope, the consumer-repo scope,
  the merge/push/deploy scope, the public-publish scope, the
  paid-registry scope, the hosted-service scope, the
  telemetry scope, the automatic-self-update scope, and the
  Trust Verifier cutover scope if any of them is in scope.
- **Rollback evidence.** A future apply must record: the prior
  `installed_version`, the prior `current_source_ref`, the
  prior installed-skill drift SHA-256, the prior automation
  prompt drift SHA-256, the prior repo integration file
  SHA-256, the apply timestamp, the apply ref, the apply
  evidence path, the rollback command used (or
  `bandit update-rollback --to <ref>` if implemented), the
  rollback evidence path, the post-rollback verification
  status, and the freshness window for the rollback evidence.
- **Explicit non-goals.** The conditional scope is **not** a
  green light for: public npm publishing, paid private
  registry setup, hosted update services, telemetry,
  automatic self-update, credential handling, consumer-repo
  mutation outside the documented allow-list, installed global
  skill mutation outside the documented allow-list,
  automation prompt mutation outside the documented allow-list,
  hooks mutation outside the documented allow-list, repo
  integration file mutation outside the documented allow-list,
  external repo mutation, merge, push, deploy, Trust Verifier
  cutover, local API, State Index, scheduler behavior,
  claim/worktree lifecycle, guarded browser action execution,
  PR/CI/CD implementation, paid routing, public benchmark
  publication, the V0 Closeout Claude Code A/B Product-Value
  Trial, or unrelated Phase 8 product work.

### Forbidden / Unapproved Surfaces

This disposition does **not** approve, recommend, or authorize any of
the following surfaces. Any future change that touches one of these
surfaces must be a separate work item with its own formation, RED,
implementation, review, landing, and closeout evidence, and the
required operator-owned approvals:

- Public npm publishing.
- Paid private registry setup.
- Hosted update services.
- Telemetry.
- Automatic self-update.
- Credential handling.
- Consumer-repo mutation.
- Installed global skill mutation.
- Automation prompt mutation.
- Hooks mutation.
- Repo integration file mutation.
- External repo mutation.
- Merge.
- Push.
- Deploy.
- Trust Verifier cutover.
- Old-gate replacement or wrapping.
- Local API, State Index, scheduler, claim/worktree lifecycle,
  or guarded browser action execution.
- PR/CI/CD implementation.
- Public benchmark publication.
- Paid routing.
- The V0 Closeout Claude Code A/B Product-Value Trial.
- Unrelated Phase 8 product work.

The 2026-05-24 founding decisions, the 2026-05-24 safe-landing and
auto-land ADRs, the V0 plan, the Bandit workflow contract, the
`BANDIT-021`/`BANDIT-022` landing evidence, the
`BANDIT-087` closeout evidence, and the
`BANDIT-088` choreography evidence remain the binding contract for
the current Bandit workflow. This disposition is a triage decision
that does not weaken, replace, wrap, or bypass any of them.

## Conclusion

`BANDIT-088` records a `Deferred` disposition: the current private
Git tag or tarball install plus the manual, non-blocking advisory
`bandit update-check` from `BANDIT-071` remains the only supported
installed-copy channel. The current behavior is sufficient for the
bootstrap-gap lane. A future implementation is allowed only behind
named trigger conditions, an explicit operator-owned approval, a
narrow conditional scope, and a separate work item with its own
formation, RED, implementation, review, landing, and closeout
evidence. Until then, the current private install/update policy
remains the source of truth and the
`.bandit/policy/private-install-update-channel.json` and
`.bandit/policy/skill-lifecycle-contracts.json` artifacts remain
binding.
