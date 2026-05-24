# BANDIT-004: Routing Decision And Smell Trigger Catalog

## Status

Review evidence and safe-to-land bootstrap verdict recorded; landing action evidence and retrospective are pending. Do not begin the next slice.

## Goal

Create the first Phase 3 routing substrate so Codex PM can record and explain manager-owned workflow, skill, agent, reviewer, and escalation decisions from repo policy without asking the operator routine technical routing questions.

This slice should add a repo-native Smell Trigger Catalog seed, a routing decision artifact contract, and a narrow CLI validation/reporting path. It must preserve CLI authority and avoid pretending Bandit can infer product direction, UAT, policy changes, business tradeoffs, or cost/risk overrides.

## Scope

- Add a canonical structured Smell Trigger Catalog seed under repo-native Bandit state.
- Seed the catalog with stable smell IDs covering the escalation-sensitive areas already named in `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`, `docs/architecture/founding-architecture.md`, and `docs/verification/STAGE_RUBRICS.md`.
- Define a routing decision artifact contract for `docs/work/<ID>/routing-decision.md`.
- Add a routing decision template that records:
  - work item ID;
  - decision kind;
  - selected workflow, skill, agent, reviewer, or escalation route;
  - applicable smell IDs;
  - evidence used;
  - operator input boundary;
  - bootstrap gaps;
  - final manager-owned decision.
- Extend validation so the Smell Trigger Catalog has required fields, unique IDs, supported severity/action values, and no malformed trigger entries.
- Extend validation so any present routing decision artifact references known smell IDs and includes the required sections or metadata.
- Add a narrow CLI command, tentatively `bandit route <work-item-id>`, that reads the recorded routing decision artifact and prints the selected route, smell triggers, escalation outcome, and operator-input status.
- Make the route command fail closed when the work item ID is missing, the work item is unknown, the routing decision artifact is missing, or the artifact references an unknown smell ID.
- Create a routing decision artifact for `BANDIT-004` once the contract exists.
- Add focused tests for catalog validation, routing decision validation, route command output, and refusal paths.

## Out Of Scope

- Automated LLM-based smell detection from PR text, diffs, work item prose, or chat history.
- Autonomous model selection based on unrecorded heuristics.
- Paid-model escalation, explicit cost overrides, or risk overrides.
- CodeRabbit automation.
- Local Qwen runtime setup.
- Final adversarial reviewer profile execution.
- Landing Agent implementation.
- UAT artifact implementation.
- PR merge or auto-landing orchestration.
- Workflow Cockpit UI.
- SQLite indexing.
- A broad policy engine, DSL, plugin system, or generated schema framework.
- Retrofitting routing decision artifacts onto every historical work item.
- Treating sourmash patterns as planning authority instead of source material.

## Acceptance Criteria

1. The repository contains a canonical Smell Trigger Catalog seed in a structured repo-native artifact, with stable IDs, names, categories, trigger descriptions, severity, default action, escalation target, and required evidence.
2. The seed catalog includes smell coverage for workflow gates, approvals/UAT, evidence freshness, CodeRabbit waivers, adversarial review, security/privacy/auth, data integrity, schema/migration, infra/deploy/release/billing, parsers, validators, JSONL logs, registries, indexes, generated schemas, large scope, multi-phase orchestration, test boundary violations, missing coverage, repeated repair loops, context pressure, unavailable agents, malformed evidence, and policy drift.
3. `bandit validate` fails closed when the Smell Trigger Catalog is missing, malformed, has duplicate IDs, has unsupported severity/action values, or omits required evidence fields.
4. A routing decision template exists and defines the required contract for `docs/work/<ID>/routing-decision.md`.
5. Routing decision artifacts can record workflow, skill, agent, reviewer, and escalation decisions without asking the operator routine technical routing questions.
6. `bandit validate` validates any present routing decision artifact and fails closed when it omits required fields, references an unknown smell ID, or hides missing operator-owned input.
7. The CLI exposes `bandit route <work-item-id>` or an equivalently narrow command name chosen during implementation.
8. The route command prints the recorded selected route, applicable smell IDs, escalation outcome, evidence summary, and operator-input status for a valid routing decision artifact.
9. The route command reports a clear usage error when the work item ID is omitted.
10. The route command fails closed when the work item does not exist.
11. The route command fails closed when the work item has no routing decision artifact.
12. The route command fails closed when the routing decision artifact references unknown smell IDs or malformed catalog entries.
13. The command reports recorded decisions only; it does not infer smells, product direction, UAT acceptance, cost overrides, or policy changes from prose.
14. The implementation keeps repo-native artifacts canonical and does not introduce hidden state, SQLite authority, cockpit-owned state, or generated indexes.
15. Tests cover success and refusal paths for the catalog, routing decision artifacts, validation, and route command behavior.
16. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check` pass before landing.

## Test Plan

- Start with RED evidence before production implementation.
- Add focused tests, likely `test/routing.test.mjs`, plus targeted additions to validation tests if that is simpler.
- Use temp repos through `test/helpers/bandit-cli.mjs`.
- Cover catalog validation:
  - valid seeded catalog passes;
  - missing catalog fails;
  - duplicate smell IDs fail;
  - missing required fields fail;
  - unsupported severity or action values fail.
- Cover routing decision validation:
  - valid artifact referencing known smell IDs passes;
  - unknown smell ID fails;
  - missing selected route fails;
  - missing operator-input status fails;
  - hidden or unresolved operator-owned input fails.
- Cover route command behavior:
  - valid artifact prints work item, selected route, smell IDs, escalation outcome, and operator-input status;
  - missing work item argument prints usage and exits nonzero;
  - unknown work item exits nonzero;
  - missing routing decision artifact exits nonzero;
  - malformed routing decision artifact exits nonzero.
- Keep assertions on behavior, refusal messages, source-of-truth boundaries, and stable fields rather than incidental Markdown formatting.
- Record RED evidence before adding implementation.
- Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check` before landing.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The spec and acceptance criteria make clean-code compliance evaluable through small surface area, explicit state, no hidden authority, readable validation and command flow, failure clarity, locality, testable behavior, and preserved role boundaries.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria. |
| Small surface area | Diff contains only routing policy/artifact code, a narrow route command or validation path, tests, evidence, and required context updates. |
| Simple design | Uses structured repo-native artifacts and small validators; no broad policy engine, DSL, database, generated schema framework, or autonomous smell inference. |
| Explicit state | Smells and routing decisions live in named repo artifacts; lifecycle and validation behavior remain visible. |
| No hidden authority | CLI validation/reporting reads repo artifacts; cockpit, cache, generated files, or implicit model choices do not own routing policy. |
| Testable behavior | Catalog, decision artifacts, route command output, and refusal paths are covered by tests or recorded bootstrap gaps. |
| Readable flow | Catalog parsing, routing-decision parsing, validation, and command output have clear boundaries. |
| Locality | Routing policy logic stays near validation and command helpers; unrelated refactors are excluded. |
| Failure clarity | Missing, malformed, unsupported, stale, unavailable, or operator-owned inputs fail closed with clear messages. |
| No role erosion | Codex PM owns technical routing; operator-owned inputs remain product direction, UAT, business tradeoffs, policy changes, and explicit cost/risk overrides. |
| Improvement capture | Any material workflow lesson becomes a tagged improvement chore, smell catalog update, cross-model tension entry, or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Current Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 3 and the next action. `docs/work/BANDIT-003/landing-action.md` records the prior slice landing action before this slice became active. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, escalation plan, and operator input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-004/red-evidence.md` maps acceptance criteria to `test/routing.test.mjs`; focused RED run fails 11/11 tests because validation ignores missing routing policy and `bandit route` is not implemented. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `docs/work/BANDIT-004/implementation-evidence.md` records the GREEN implementation, clean-code self-check, passing focused/full tests, `bandit validate`, `bandit route BANDIT-004`, typecheck, and `git diff --check`. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | `docs/work/BANDIT-004/review-evidence.md` records manual PM review with no blocker-level finding and records final CodeRabbit, Qwen, and escalated adversarial gates as unavailable bootstrap gaps. |
| Stage 5: Landing And UAT | `blocker` | `docs/work/BANDIT-004/landing-verdict.md` records a safe-to-land bootstrap verdict, but landing action evidence does not exist yet. The slice is ready-to-land, not landed. UAT is `not_applicable` because this is workflow infrastructure, not a user-facing feature slice. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Retrospective is required before this slice closes. |

## Bootstrap Gaps

- Smell Trigger Catalog implementation does not exist yet; this slice creates the first seed.
- Routing decision artifact implementation does not exist yet; this slice creates the first contract.
- Automated diff/prose smell detection does not exist yet.
- Reviewer profile registry does not exist yet.
- CodeRabbit pre-landing loop is not automated yet.
- Local Qwen adversarial gate is not implemented yet.
- Escalated adversarial review gate is not implemented yet.
- Landing Agent is not implemented yet.
- UAT artifact is not implemented yet.
- Heartbeat chore-agent is not implemented yet.
- Workflow Cockpit is not implemented yet.

These are accepted bootstrap gaps for this work item only if replacement manual evidence is recorded honestly.

## Required Operator Input

None before RED evidence or implementation starts.

Repo artifacts already define the product direction for this slice: Codex PM owns routine technical routing, stronger or second reviewers are selected by policy smells rather than operator choice, `.bandit/` and repo-native artifacts remain canonical, and missing operator-owned input must be surfaced rather than guessed.

## Expected Files

Likely implementation files:

- `.bandit/policy/smell-triggers.json`
- `docs/templates/routing-decision.md`
- `src/commands/route.ts`
- `src/cli.ts`
- `src/commands/validate.ts`
- `src/state/smell-triggers.ts`
- `src/state/routing-decisions.ts`
- focused test files under `test/`

Likely evidence files:

- `docs/work/BANDIT-004/red-evidence.md`
- `docs/work/BANDIT-004/implementation-evidence.md`
- `docs/work/BANDIT-004/review-evidence.md`
- `docs/work/BANDIT-004/routing-decision.md`
- `docs/work/BANDIT-004/landing-verdict.md`
- `docs/work/BANDIT-004/landing-action.md`
- `docs/work/BANDIT-004/retrospective.md`

Context files expected to change:

- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

The final implementation may adjust file names if tests and local structure prove a simpler pattern, but it must preserve this brief's acceptance criteria and source-of-truth boundaries.

## First Implementation Order

1. Write RED evidence mapping acceptance criteria to tests.
2. Add failing tests for Smell Trigger Catalog validation and malformed catalog refusal paths.
3. Add failing tests for routing decision artifact validation and unknown smell-ID refusal paths.
4. Add failing tests for route command usage, success output, missing artifact, unknown work item, and malformed artifact paths.
5. Add the structured Smell Trigger Catalog seed with stable IDs and small parser/validator helpers.
6. Add the routing decision template and parser/validator helpers.
7. Extend `bandit validate` to validate the catalog and any present routing decision artifacts.
8. Wire the route command to report recorded routing decisions without inferring unstated decisions.
9. Create `docs/work/BANDIT-004/routing-decision.md` using the new contract.
10. Run focused tests and confirm RED-to-green behavior.
11. Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, and `git diff --check`.
12. Produce implementation evidence, clean-code check, review-gap evidence, landing verdict, retrospective, landing action evidence, and updated `CURRENT_CONTEXT.md`.

## Smell Triggers

- Routing decision is made from chat memory instead of repo policy: blocker.
- The operator is asked for routine technical routing, reviewer selection, or code-safety judgment: blocker.
- Missing product direction, UAT, policy change, business tradeoff, or explicit cost/risk override is guessed instead of surfaced: blocker.
- Smell detection relies on unstructured LLM inference in this slice: blocker.
- Routing artifact references unknown smell IDs or unsupported actions: blocker.
- Unavailable CodeRabbit, Qwen, escalation, or Landing Agent gates are collapsed into a pass instead of recorded as bootstrap gaps: blocker.
- Catalog or routing decisions become generated index state, UI state, or cache authority instead of repo-native source of truth: blocker.
- Validation makes historical work items invalid solely because they predate routing decision artifacts: blocker unless the migration is explicitly scoped.
- Large mixed orchestration code combines parsing, validation, command output, artifact writes, and policy decisions without clear boundaries: blocker or `needs-repair` under `CLEAN_CODE.md`.
- New schema framework, policy DSL, or database is introduced before repeated complexity exists: blocker unless justified by concrete evidence.

Codex PM owns these routing and escalation decisions. No operator input is needed for routine code-safety routing in this slice.

## Required Evidence

- `docs/work/BANDIT-004/red-evidence.md`
- `docs/work/BANDIT-004/implementation-evidence.md`
- `docs/work/BANDIT-004/review-evidence.md`
- `docs/work/BANDIT-004/routing-decision.md`
- `docs/work/BANDIT-004/landing-verdict.md`
- `docs/work/BANDIT-004/landing-action.md`
- `docs/work/BANDIT-004/retrospective.md`
- Updated `docs/roadmap/CURRENT_CONTEXT.md` when the next action changes.

## Operator Input Status

No required operator-owned input is missing for RED evidence or implementation.

The implementation must fail closed and surface the missing input if a routing decision requires product direction, UAT, a business tradeoff, a policy change, or an explicit cost/risk override that repo artifacts cannot answer.
