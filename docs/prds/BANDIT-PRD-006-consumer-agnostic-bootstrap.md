# BANDIT-PRD-006: Consumer-Agnostic Bootstrap

> Handoff note: this PRD was designed in the nntnos consumer repo on
> 2026-06-12 and is written in the `docs/templates/feature-prd.md` format so it
> can be placed at `docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md` in
> the Bandit repository and decomposed with
> `bandit draft-work docs/prds/BANDIT-PRD-006-consumer-agnostic-bootstrap.md`.
> It is intentionally the first PRD to enter through that front door.

## Problem

Bandit was bootstrapped by governing its own development, and its
consumer-facing surfaces inherited Bandit-specific identity, harness, model,
and format assumptions. Observed in a real consumer repo (nntnos, initialized
2026-06-11):

- **Identity leakage.** `bandit init` scaffolded `BANDIT-001 - Consumer
  Onboarding Starter` and "Phase 0 - Consumer Onboarding" — Bandit's own
  roadmap content — into the consumer's `ROADMAP.md` and
  `CURRENT_CONTEXT.md`. `work_item_prefix` is configurable in `config.toml`,
  but `draft-work` hardcodes the `# BANDIT-PRD-\d+:` H1 regex, so a consumer
  cannot run its own PRDs through decomposition under its own identity.
- **Harness coupling.** The scaffolded `AGENTS.md` names a specific harness
  ("Codex is the PM and engineering manager") even when the consumer drives
  the repo with a different harness. Consumers must hand-write their own
  harness integration (the nntnos operator manually authored Claude Code slash
  commands for `work-create` / `work-execute`).
- **Model coupling.** Policy declares "Local Qwen is the baseline adversarial
  reviewer for every PR," and `.bandit/reviewers/local-qwen.json` plus
  `bin/omlx-chat-completions.mjs` assume one specific local endpoint. A new
  adopter without that endpoint hits an unexplained wall at their first review
  gate.
- **Policy overfit.** Init copies ~21 policy files that reflect Bandit's own
  self-development needs (stage4-evidence-head, trust-verifier-cutover-gates,
  replay-regression-corpus), burying the invariants a consumer actually needs.

The core philosophy — deterministic CLI authority, repo-native canonical
state, evidence contracts — is already consumer-agnostic. The overfitting is
concentrated at the edges where new adopters first touch the tool.

## User

The operator of a brand-new project who wants Bandit's trust layer from the
first commit, using any agent harness (Claude Code, Codex, Cursor, none) and
any reviewer model (local endpoint, cloud API, CLI-invoked agent, human).

Secondary, deferred user: the operator of an existing project with established
planning artifacts (covered by a future PRD; see Non-Goals).

## Goals

- A new repo can be initialized from a declarative project profile and end up
  with state that carries only the consumer's identity — prefix, project
  name, roadmap phases — and no Bandit-bootstrap content.
- The interview that produces the profile is performed by any external
  intelligence (agent or human) against a shipped schema and template; the CLI
  only validates and scaffolds, deterministically.
- Reviewers are typed adapters; any OpenAI-compatible endpoint, CLI command,
  or human can fill the adversarial-review role. Declining to configure one is
  permitted but recorded as an open bootstrap gap that blocks landing gates.
- The harness-facing surface is generated from role contracts: a
  harness-neutral `AGENTS.md` always, plus thin per-harness shims on request,
  starting with Claude Code.
- A fresh consumer receives only core policy invariants by default, with
  additional policy tiers opted into via the profile.

## Non-Goals

- Plan-format adapters that ingest existing free-form planning artifacts
  (e.g. superpowers plans) into decomposition. That is the existing-project
  adoption journey and warrants its own PRD; the project-profile contract
  built here is its prerequisite.
- Interactive terminal prompts inside the CLI. The interview lives outside
  the CLI by design.
- Hosted services, telemetry, automatic self-update, or any expansion of
  landing/merge/push authority (per standing distribution policy).
- Migration tooling for already-initialized consumer repos. Documented manual
  steps suffice while the consumer count is approximately one.

## Stories Or Workflows

- **New project bootstrap.** Operator's agent reads the shipped profile
  schema/template, interviews the operator (project name, work-item prefix,
  reviewer adapters, policy tiers, target harnesses), writes
  `project-profile.json`, runs `bandit init --profile project-profile.json`,
  then `bandit validate`. The scaffold carries the consumer's identity
  end to end: `<PREFIX>-001` starter item or none, project-named roadmap,
  prefix-aware PRD parsing.
- **Reviewer setup.** Profile declares e.g.
  `{"type": "openai_compatible", "name": "local-qwen", "endpoint": ...}` or
  `{"type": "cli_command", ...}` or `{"type": "human", ...}`. With
  `"reviewers": []`, init succeeds but records a bootstrap gap; landing gates
  stay blocked until a reviewer exists or the gap is explicitly dispositioned.
- **Harness install.** `bandit harness install claude-code` generates slash
  commands and harness instructions from the same role-contract source that
  produces `AGENTS.md`; regeneration is idempotent and safe to re-run after
  upgrades. Unknown harness names fail with the supported list.
- **Bandit self-hosting continuity.** Bandit's own repo expresses its current
  state as a profile (prefix `BANDIT`, local-qwen reviewer, all policy tiers)
  and re-derives its scaffolded surfaces from it, proving the consumer path
  and the dogfood path are the same path.

## Acceptance Criteria

- `bandit init --profile <file>` validates the profile against a versioned
  schema and fails with actionable diagnostics naming the offending field.
- After init from a profile with prefix `ACME`, no scaffolded file contains
  the strings `BANDIT-001`, `Phase 0 - Consumer Onboarding`, or any
  Bandit-roadmap content; work items and PRD parsing use the `ACME` prefix.
- `draft-work` accepts `# <PREFIX>-PRD-<n>:` H1s where `<PREFIX>` comes from
  repo config, with existing `BANDIT-PRD-*` documents still parsing.
- Reviewer adapters of types `openai_compatible`, `cli_command`, and `human`
  are validated at init; `reviewers: []` writes a bootstrap-gap entry whose
  open state blocks landing gates.
- `bandit harness install claude-code` emits working slash-command files; the
  generated neutral `AGENTS.md` names no specific harness or model.
- Default policy scaffold contains only the core tier; each opt-in tier is
  selectable in the profile; Bandit-internal policies no longer ship in the
  packed distribution.
- All four slices land through normal Bandit formation, gates, review, and
  closeout in the Bandit repo.

## Out Of Scope

- Ingesting external plan documents into `draft-work` (future PRD).
- Any new CLI authority over merge, push, deploy, or external repos.
- Back-porting scaffold fixes into already-initialized repos automatically.
- Harness shims beyond Claude Code in the first pass (the generator interface
  must make additions cheap, but only one shim ships here).

## Test Or Verification Strategy

- Unit coverage (`node --test`) for: profile schema validation including
  malformed-field diagnostics; prefix-parameterized PRD regex with `BANDIT`
  back-compat; reviewer adapter validation per type; empty-reviewers gap
  write; harness generator output; policy tier selection.
- End-to-end fixture: initialize a temp consumer repo from a non-BANDIT
  profile, run `validate`, run `draft-work` on a prefix-native PRD fixture,
  assert zero Bandit-identity strings in the scaffold.
- Dogfood proof: this PRD itself enters the Bandit repo via `draft-work`, and
  each slice runs the full stage lifecycle.
- Self-hosting check: Bandit's own repo re-derives its surfaces from its own
  profile without drift (snapshot comparison).

## Decomposition Notes

Sequencing constraint: Slice 1 establishes the project-profile contract that
slices 2-4 consume, so it must land first. Slices 2-4 are independent of each
other after that and may proceed in any order; the suggested order below
front-loads the highest adopter pain. Each slice requires normal Work Item
formation, stage gates, adversarial review, and closeout before the next
begins.

```bandit-work-draft
{
  "items": [
    {
      "kind": "slice",
      "title": "Project-profile contract and identity-clean init",
      "goal": "A declarative, schema-validated project profile drives bandit init so a new repo is scaffolded deterministically under its own identity with zero Bandit-bootstrap leakage.",
      "scope": [
        "Versioned project-profile JSON schema (name, work_item_prefix, starter work item choice, roadmap seed, reviewers, policy_tiers, harnesses)",
        "bandit init --profile <file> validation and scaffold path",
        "Shipped profile template plus interview guidance doc for external agents",
        "Parameterize draft-work PRD H1 regex by configured prefix with BANDIT back-compat",
        "Remove Bandit roadmap/starter content from all scaffold templates"
      ],
      "out_of_scope": [
        "Interactive CLI prompts",
        "Reviewer adapter implementations beyond schema fields (slice 2)",
        "Harness shim generation (slice 3)",
        "Policy tier mechanics beyond schema fields (slice 4)"
      ],
      "acceptance_criteria": [
        "init --profile fails malformed profiles with diagnostics naming the offending field",
        "Scaffold from an ACME profile contains no BANDIT-001, no Phase 0 - Consumer Onboarding, and no Bandit roadmap strings",
        "draft-work parses # ACME-PRD-1: headers in an ACME-configured repo and still parses BANDIT-PRD-* documents",
        "bandit validate passes on a fresh profile-initialized repo"
      ],
      "test_plan": [
        "Unit tests for schema validation accept/reject cases with diagnostic assertions",
        "Unit tests for prefix-parameterized PRD header parsing including back-compat",
        "End-to-end temp-repo fixture: init --profile, validate, grep scaffold for forbidden Bandit-identity strings"
      ],
      "clean_code_read_evidence": "Implementer records CLEAN_CODE.md read in the work item implementation evidence before Stage 3 begins",
      "stage_rubric_checklist": [
        "Stage 1 brief names the profile contract as the shared dependency of slices 2-4",
        "Stage 2 red evidence captures failing tests for schema validation and identity-leak greps before implementation",
        "Stage 3 implementation touches only files listed in expected scope",
        "Stage 4 review includes adversarial pass on schema diagnostics quality",
        "Landing evidence includes end-to-end fixture run output"
      ],
      "bootstrap_gaps": [
        "No second real consumer repo exists yet to validate profile generality beyond nntnos"
      ],
      "expected_files": [
        "src/commands/init.ts",
        "src/state/project-profile.ts",
        "src/commands/draft-work.ts",
        "docs/templates/project-profile.md",
        "test/init.test.mjs",
        "test/draft-work.test.mjs"
      ],
      "first_implementation_order": [
        "Define and test the profile schema module",
        "Wire init --profile to the schema with diagnostics",
        "Purge Bandit identity from scaffold templates",
        "Parameterize the PRD header regex",
        "Add the end-to-end temp-repo fixture"
      ],
      "smell_triggers": [
        "Any hardcoded BANDIT literal surviving in scaffold output paths",
        "Schema validation that reports failure without naming the field",
        "Template content that references Bandit's own roadmap or phases"
      ],
      "required_evidence": [
        "Red evidence for schema and identity-leak tests",
        "End-to-end fixture transcript in implementation evidence",
        "Adversarial review verdict on the profile contract"
      ],
      "operator_input_status": "none_required"
    },
    {
      "kind": "slice",
      "title": "Typed reviewer adapters with honest degradation",
      "goal": "Adversarial review works with any OpenAI-compatible endpoint, CLI command, or human reviewer, and the absence of a reviewer is an explicit recorded gap that blocks landing rather than a silent weakening.",
      "scope": [
        "Reviewer adapter contract with types openai_compatible, cli_command, human",
        "Profile-driven reviewer scaffolding in .bandit/reviewers/",
        "Generalize the local-qwen review path to consume any openai_compatible adapter",
        "reviewers: [] records an open bootstrap gap wired into landing-gate checks"
      ],
      "out_of_scope": [
        "Same-harness self-review defaults",
        "Reviewer quality calibration changes",
        "Hosted reviewer services"
      ],
      "acceptance_criteria": [
        "Each adapter type validates at init with type-specific required fields",
        "Existing local-qwen flow runs unchanged as an openai_compatible instance",
        "Empty reviewers list yields an open gap that blocks land-check until dispositioned",
        "human adapter produces a review-evidence path that satisfies the same gate contract"
      ],
      "test_plan": [
        "Unit tests per adapter type for validation and scaffold output",
        "Regression test that the local-qwen policy fixture still routes correctly",
        "Gate test: land-check blocked with open no-reviewer gap, unblocked after disposition"
      ],
      "clean_code_read_evidence": "Implementer records CLEAN_CODE.md read in the work item implementation evidence before Stage 3 begins",
      "stage_rubric_checklist": [
        "Stage 2 red evidence includes the blocked-landing test before implementation",
        "Stage 4 review verifies no adapter type can silently satisfy the gate without evidence",
        "Landing evidence shows local-qwen regression passing"
      ],
      "bootstrap_gaps": [
        "Only one real reviewer endpoint (Local Qwen) is available in-house for live verification of openai_compatible"
      ],
      "expected_files": [
        "src/state/reviewer-adapters.ts",
        "src/commands/qwen-review.ts",
        "src/commands/land-check.ts",
        "docs/templates/local-qwen-review.md",
        "test/local-qwen-review.test.mjs",
        "test/landing-gates.test.mjs"
      ],
      "first_implementation_order": [
        "Define and test the adapter contract",
        "Refit the existing qwen path onto openai_compatible",
        "Add cli_command and human adapters",
        "Wire the no-reviewer gap into land-check"
      ],
      "smell_triggers": [
        "Reviewer identity hardcoded outside .bandit/reviewers/",
        "A landing path that passes with zero review evidence and no dispositioned gap",
        "Endpoint assumptions baked into review prompts"
      ],
      "required_evidence": [
        "Red evidence for the blocked-landing case",
        "Local-qwen regression run output",
        "Adversarial review verdict from a configured adapter"
      ],
      "operator_input_status": "none_required"
    },
    {
      "kind": "slice",
      "title": "Harness-neutral AGENTS.md and generated harness shims",
      "goal": "The harness-facing surface is generated from role contracts: a neutral AGENTS.md always, plus bandit harness install <name> producing thin shims, with Claude Code as the first supported target.",
      "scope": [
        "Neutral AGENTS.md generation from role contracts with no harness or model named",
        "bandit harness install claude-code generating .claude/commands/ shims for work-create and work-execute",
        "Idempotent regeneration safe to run after package upgrades",
        "Harness generator interface that makes additional targets additive"
      ],
      "out_of_scope": [
        "Codex, Cursor, or other harness shims beyond the generator interface",
        "Changes to role contract semantics",
        "Any harness-side state beyond generated files"
      ],
      "acceptance_criteria": [
        "Generated AGENTS.md contains no harness or model product names",
        "harness install claude-code emits slash-command files equivalent to the hand-written nntnos versions",
        "Re-running install produces no diff on unchanged contracts",
        "Unknown harness name fails listing supported targets"
      ],
      "test_plan": [
        "Snapshot tests for AGENTS.md and Claude Code shim output",
        "Idempotency test running install twice and asserting no changes",
        "Unit test for unknown-harness diagnostics"
      ],
      "clean_code_read_evidence": "Implementer records CLEAN_CODE.md read in the work item implementation evidence before Stage 3 begins",
      "stage_rubric_checklist": [
        "Stage 1 brief confirms shims derive from role contracts not hand-written templates",
        "Stage 4 review checks generated instructions match actual CLI behavior",
        "Landing evidence includes generated-shim snapshot diffs"
      ],
      "bootstrap_gaps": [
        "No automated way to exercise a generated shim inside a live harness session from CI"
      ],
      "expected_files": [
        "src/commands/harness.ts",
        "src/state/harness-generators/claude-code.ts",
        "src/state/role-contracts.ts",
        "test/harness-install.test.mjs"
      ],
      "first_implementation_order": [
        "Extract neutral AGENTS.md generation from role contracts",
        "Define the harness generator interface",
        "Implement the claude-code generator",
        "Add idempotency and snapshot tests"
      ],
      "smell_triggers": [
        "Harness product names appearing in neutral surfaces",
        "Shim content drifting from role contracts instead of being derived",
        "Generators that overwrite operator-customized files without warning"
      ],
      "required_evidence": [
        "Snapshot diffs for generated surfaces",
        "Idempotency test output",
        "Adversarial review verdict on instruction-to-behavior fidelity"
      ],
      "operator_input_status": "none_required"
    },
    {
      "kind": "slice",
      "title": "Policy tiering: core invariants plus opt-in tiers",
      "goal": "A fresh consumer receives only the core policy invariants by default, with additional tiers enabled via the profile, and Bandit-internal policies stop shipping in the packed distribution.",
      "scope": [
        "Audit of the ~21 shipped policies into core, named opt-in tiers, and Bandit-internal",
        "Profile policy_tiers selection wired into init scaffolding",
        "Package files list updated so internal policies are not distributed",
        "Tier documentation describing what each tier guarantees and costs"
      ],
      "out_of_scope": [
        "Changing the semantics of any individual policy",
        "Runtime tier switching after init beyond documented manual steps",
        "New policy authoring"
      ],
      "acceptance_criteria": [
        "Default init scaffolds only core-tier policies",
        "Each opt-in tier selected in the profile scaffolds its documented policy set",
        "Packed tarball contains no Bandit-internal policy files",
        "Bandit's own repo expresses its full policy set as core plus all tiers with no orphan policies"
      ],
      "test_plan": [
        "Unit tests for tier resolution from profile to scaffolded policy set",
        "Pack test asserting internal policies absent from npm pack output",
        "Self-hosting test that Bandit's repo policy set is reproducible from its own profile"
      ],
      "clean_code_read_evidence": "Implementer records CLEAN_CODE.md read in the work item implementation evidence before Stage 3 begins",
      "stage_rubric_checklist": [
        "Stage 1 brief includes the full policy audit table with tier assignments",
        "Stage 4 review adversarially challenges each core-tier inclusion and exclusion",
        "Landing evidence includes the pack-content assertion output"
      ],
      "bootstrap_gaps": [
        "Tier boundaries are hypotheses until a second consumer with different needs exercises them"
      ],
      "expected_files": [
        "src/state/policy-tiers.ts",
        "src/commands/init.ts",
        "package.json",
        "docs/templates/policy-tiers.md",
        "test/init.test.mjs"
      ],
      "first_implementation_order": [
        "Produce the policy audit and tier assignment table",
        "Implement tier resolution and scaffolding",
        "Update package files list and pack test",
        "Add the self-hosting reproducibility test"
      ],
      "smell_triggers": [
        "A policy assigned to core without a consumer-facing justification",
        "Internal policies reappearing in pack output",
        "Tier names that describe Bandit history rather than consumer guarantees"
      ],
      "required_evidence": [
        "Policy audit table in formation evidence",
        "Pack assertion output",
        "Self-hosting reproducibility test output"
      ],
      "operator_input_status": "none_required"
    }
  ]
}
```
