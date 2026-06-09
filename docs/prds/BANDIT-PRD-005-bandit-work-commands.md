# BANDIT-PRD-005: Bandit Work Commands

## Status

Draft ready-for-agent PRD from the operator-guided command-design
conversation. This is a repo-native planning artifact; no GitHub issue is
required unless the operator explicitly asks for one.

This PRD is not yet decomposed onto the roadmap. After operator approval, it
should be decomposed into roadmap-prioritized Work Items before any
implementation slice is formed.

## Source Inputs

- `CONTEXT.md`
- `AGENTS.md`
- `docs/roadmap/ROADMAP.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/templates/feature-prd.md`
- `docs/templates/work-item-pm-orchestrator-prompt.md`
- `docs/verification/STAGE_RUBRICS.md`
- Operator-provided Repo PM formation prompt source:
  `/Users/matthewflebbe/Documents/SeekWins Repo PM — Brief and Stage 1 Formation.md`
- Operator-provided Work Item PM orchestrator prompt source:
  `/Users/matthewflebbe/Documents/# Bandit Work Item PM Orchestrator.md`

## Relationship To Existing PRDs

`BANDIT-PRD-005` extends `BANDIT-PRD-001` by making Bandit's repo-native
workflow usable through two simple operator commands while preserving CLI
Authority, role boundaries, stage gates, and repo-native canonical state.

`BANDIT-PRD-005` complements `BANDIT-PRD-003` by defining the operator command
surface that a future Workflow Cockpit may request. The commands remain
CLI-authoritative and may be displayed by the cockpit, but the cockpit does not
own their workflow decisions.

`BANDIT-PRD-005` complements `BANDIT-PRD-004` by keeping risk, evidence,
landing autonomy, operator supervision, and product UAT decisions inside the
existing Bandit gate model. The commands do not grant new landing autonomy.

## Problem Statement

The operator wants to use Bandit as a workflow improvement engine, not as a
collection of internal lifecycle commands. Today the underlying repo already
has role entrypoints, formation gates, work-item creation, session-context
packets, cockpit status, work-intake state, orchestration prompts, reviewers,
landing evidence, and closeout artifacts. That rigor is useful, but the
operator-facing entrypoint is still too fragmented.

From the user's perspective, there should be two simple commands:

- `/bandit-work-create`
- `/bandit-work-execute`

The operator should not need to know whether Bandit internally used
`repo-pm create-work-item`, `repo-pm approve-formation`, `work-item-pm start`,
role input packets, reviewer routes, landing commands, or closeout commands.
Those are implementation details of the trust layer.

The operator also needs the work source hierarchy to be clear. Approved PRDs
are decomposed onto the roadmap. Approved `WIL-*` proposals move into
PRD-backed roadmap scope and are then renamed or linked as normal Work Items.
Once work is approved, Bandit should look first at `ROADMAP.md` and
`CURRENT_CONTEXT.md` for current and next work, not scan the Work Intake Ledger
as a hidden scheduler.

Without this simplified command layer, Bandit risks making its internal rigor
operator-facing, blurring the distinction between intake proposals, PRDs,
roadmap priority, work-item formation, execution, and closure.

## Solution

Create a two-command operator workflow for Bandit work:

1. `/bandit-work-create` follows the Repo PM formation prompt. It reads the
   current and next work from the roadmap/current-context authority surface,
   resolves any PRD, spec, or WIL provenance named by those files, creates or
   repairs the next normal Work Item, and may run Stage 1 formation through
   `formation_approved` when repo evidence is sufficient. It must not start
   Stage 2 RED evidence or Work Item PM execution.

2. `/bandit-work-execute` follows the Work Item PM orchestrator prompt. It
   starts from an already formed Work Item, records the orchestration plan when
   required, invokes authorized stage routes from Stage 2 through Stage 6, and
   stops only when it reaches closure or encounters a real blocker, required
   operator-owned input, provider failure, missing authorized route, or gate
   failure.

The commands are operator-facing wrappers over Bandit's existing trust layer.
They do not replace CLI Authority. They do not make slash-command state
canonical. They hide internal stage commands from the operator while recording
all state changes through normal repo-native artifacts and CLI-validated
transitions.

`Role Input Packet` generation remains internal support for
`/bandit-work-execute`. The operator should not call a generic
`bandit context <stage>` command. Stage-scoped packets are generated only when
the orchestrator needs to invoke an authorized worker, reviewer, landing agent,
closeout agent, or equivalent process adapter.

The command design should normalize the operator-provided Repo PM and Work Item
PM prompt sources into Bandit-native prompt contracts. The resulting prompt
contracts should preserve the role behavior and stage boundaries while removing
repo-specific SeekWins assumptions, absolute paths, and non-Bandit naming.

## User Stories

1. As the operator, I want to run `/bandit-work-create`, so that Bandit creates
   the next authorized Work Item without requiring me to remember internal Repo
   PM commands.
2. As the operator, I want `/bandit-work-create` to read current and next work
   from the roadmap and current-context files, so that approved priority is not
   hidden in an intake ledger.
3. As the operator, I want approved PRD work to be decomposed onto the roadmap,
   so that every approved work lane is visible and prioritized.
4. As the operator, I want approved `WIL-*` proposals to move into PRD-backed
   roadmap scope before execution, so that intake IDs do not masquerade as
   executable Work Items.
5. As the operator, I want a `WIL-*` label to be replaced or linked by a normal
   Work Item ID during materialization, so that execution artifacts use the
   standard Bandit work-item model.
6. As the operator, I want `/bandit-work-create` to complete Stage 1 formation
   when repo evidence is sufficient, so that I do not have to run separate
   formation commands manually.
7. As the operator, I want `/bandit-work-create` to stop before Stage 2, so
   that work formation and execution remain separate lifecycle actions.
8. As the operator, I want `/bandit-work-create` to tell me exactly what
   operator-owned input is missing when formation cannot proceed, so that I can
   provide product, UAT, policy, business, or cost/risk direction explicitly.
9. As the operator, I want `/bandit-work-create` to refuse hidden prioritization
   when roadmap and current-context state disagree, so that Bandit does not
   invent priority from stale artifacts.
10. As the operator, I want `/bandit-work-create` to use PRD, spec, or WIL
   provenance only after roadmap/current-context identify it, so that provenance
   does not become a competing queue.
11. As the operator, I want `/bandit-work-create` to create normal slices or
   chores, so that all downstream gates use standard Work Item artifacts.
12. As the operator, I want `/bandit-work-create` to follow the Repo PM
   formation prompt, so that work briefs are shaped by the same Stage 1 contract
   every time.
13. As the operator, I want `/bandit-work-create` to respect `CLEAN_CODE.md`,
   so that clean-code evaluation is designed into the slice before work begins.
14. As the operator, I want `/bandit-work-create` to include stage-rubric
   requirements in the formed work, so that verification is not added after the
   fact.
15. As the operator, I want `/bandit-work-create` to stop when no approved
   roadmap item is available, so that unapproved ideas do not become active
   implementation work.
16. As the operator, I want `/bandit-work-execute` to run a formed Work Item
   through the remaining lifecycle when feasible, so that I do not have to
   manually advance every stage.
17. As the operator, I want `/bandit-work-execute` to start only after
   `formation_approved`, so that brief creation alone never authorizes
   execution.
18. As the operator, I want `/bandit-work-execute` to create or verify the Work
   Item PM orchestration plan before RED evidence, so that planning remains an
   explicit gate.
19. As the operator, I want `/bandit-work-execute` to invoke authorized Test
   Writer routes for Stage 2, so that RED evidence and test ownership are
   preserved.
20. As the operator, I want `/bandit-work-execute` to invoke authorized
   implementation writer routes for Stage 3, so that model-family separation
   and writer permissions are enforced.
21. As the operator, I want `/bandit-work-execute` to invoke CodeRabbit and
   Local Qwen through authorized routes during Stage 4, so that review evidence
   is not improvised.
22. As the operator, I want `/bandit-work-execute` to record provider timeouts
   honestly, so that missing reviewer evidence is never reported as a pass.
23. As the operator, I want `/bandit-work-execute` to invoke escalated review
   only when policy requires it, so that review depth is based on repo evidence
   rather than operator guesswork.
24. As the operator, I want `/bandit-work-execute` to stop for product UAT when
   required, so that agents cannot infer product acceptance.
25. As the operator, I want `/bandit-work-execute` to use the Landing Agent for
   landing verdicts and landing actions, so that safe-to-land remains a
   recorded decision rather than a chat conclusion.
26. As the operator, I want `/bandit-work-execute` to run Stage 6 closeout after
   landing, so that retrospectives and improvement dispositions are not skipped.
27. As the operator, I want `/bandit-work-execute` to stop if any stage gate
   fails, so that a later stage cannot paper over missing evidence.
28. As the operator, I want `/bandit-work-execute` to stop if no authorized
   worker or reviewer route exists, so that Bandit does not silently fall back
   to ad hoc model calls.
29. As the operator, I want `/bandit-work-execute` to expose concise status when
   blocked, so that I know the exact input or repair needed.
30. As the operator, I want both commands to preserve the slice-boundary rule,
   so that the next work item cannot begin before the current one lands and
   closes.
31. As the operator, I want both commands to update the concise status surfaces
   when workflow state changes, so that the cockpit and cold-start context stay
   aligned.
32. As the operator, I want both commands to preserve CLI Authority, so that the
   slash command never becomes hidden state.
33. As the operator, I want both commands to be separate, so that creating work
   and executing formed work remain explicit actions.
34. As the operator, I want to avoid a nested `/bandit-work create` namespace,
   so that the common path is memorable.
35. As the operator, I want no public `bandit context <stage>` workflow command,
   so that internal packet generation does not become an operator workflow.
36. As the operator, I want the Work Intake Ledger to remain operator-facing
   proposal state, so that I can still review ideas before they become work.
37. As the operator, I want `FOLLOWUPS.md` source material to be migrated into
   durable intake or work artifacts, so that follow-ups do not live in a
   separate informal queue.
38. As the operator, I want every approved work stream to hit the roadmap, so
   that priority is visible before work creation.
39. As the operator, I want current and next work to be understandable in the
   cockpit, so that command behavior and UI status agree.
40. As Codex PM, I want a roadmap/current-context resolver, so that work
   creation has one deterministic authority path.
41. As Codex PM, I want a Work Item creation controller, so that Stage 1
   formation can be automated without starting execution.
42. As Codex PM, I want a Work Item execution controller, so that a formed Work
   Item can be advanced stage by stage with clear stop conditions.
43. As Codex PM, I want an internal Role Input Packet assembler, so that stage
   workers receive scoped context without hand-picked prompts.
44. As Codex PM, I want prompt contracts for Repo PM and Work Item PM, so that
   orchestration behavior is testable and portable across harnesses.
45. As Codex PM, I want prompt contracts to be Bandit-native, so that imported
   prompt source does not carry foreign repository assumptions.
46. As Codex PM, I want provider failures recorded as workflow evidence, so that
   Stage 4 and later gates remain honest.
47. As Codex PM, I want operator-owned decisions detected explicitly, so that
   the commands do not ask the operator routine technical routing questions.
48. As Codex PM, I want the commands to repair only derivable mechanical drift,
   so that they do not guess on product direction or policy.
49. As Codex PM, I want the commands to validate source hierarchy before
   writing, so that WIL, PRD, roadmap, and Work Item states cannot conflict
   silently.
50. As Codex PM, I want normal Bandit validation to cover the new command
   contracts, so that command regressions fail with the rest of the repo.
51. As a Test Writer, I want `/bandit-work-execute` to preserve the Permanent
   Test Ownership Boundary, so that implementation writers cannot edit RED
   tests or acceptance mappings.
52. As an Implementation Writer, I want a clear Role Input Packet, so that I
   know allowed writes, forbidden writes, inputs, evidence expectations, and
   validation commands for my stage.
53. As a reviewer, I want review packets to include the approved brief, diff,
   stage evidence, clean-code expectations, and route-specific policy, so that
   review findings stay grounded.
54. As a Landing Agent, I want landing inputs gathered by the orchestrator, so
   that landing verdicts can evaluate tests, reviews, UAT, risk, supply-chain,
   input quarantine, and evidence freshness together.
55. As a Closeout Agent, I want `/bandit-work-execute` to preserve Stage 6
   mining requirements, so that lessons become durable chores or explicit
   no-action decisions.
56. As a future cockpit surface, I want these commands to expose source-linked
   action eligibility, so that the UI can request approved CLI-backed actions
   without becoming authority.
57. As a future cockpit surface, I want create and execute blockers to be
   derived from the same command logic, so that UI state and command refusal
   behavior do not drift.
58. As a future maintainer, I want the command adapters to be thin, so that the
   deep workflow modules remain testable outside a slash-command runtime.
59. As a future maintainer, I want the stage route registry to be explicit, so
   that adding a new worker or reviewer route does not require changing every
   command.
60. As a future maintainer, I want no direct WIL scheduling behavior, so that
   intake remains proposal provenance and roadmap remains priority authority.

## Implementation Decisions

- Build a deep roadmap work-target resolver that reads the roadmap and current
  context authority surfaces and returns a deterministic current or next work
  target, including status, type, title, priority relationship, and provenance
  pointers.
- The resolver must fail closed when roadmap and current-context state disagree
  on the current or next work target.
- The resolver may not inspect the Work Intake Ledger as a primary scheduler.
  It may dereference WIL provenance only after the roadmap/current-context
  authority surface names the WIL entry.
- Build a provenance resolver that can normalize PRD, spec, roadmap, and WIL
  references into a single Work Item formation input without treating any
  provenance source as priority authority.
- Build a Repo PM create controller for `/bandit-work-create`. It should call
  existing Work Item creation and formation operations, run or verify formation
  review, record `formation_approved` when gates pass, and stop before Stage 2.
- `/bandit-work-create` should be idempotent where possible. If the current
  target is already formed and `formation_approved`, it should report the
  existing Work Item and next execution command rather than recreate it.
- `/bandit-work-create` should mechanically repair only metadata that is
  derivable from approved PRDs, roadmap state, specs, or existing work
  artifacts. It must halt for missing product, UAT, policy, business,
  cost/risk, or ambiguous scope input.
- Build a Work Item PM execution controller for `/bandit-work-execute`. It
  should verify `formation_approved`, create or verify orchestration-plan
  evidence, record Work Item PM start, and advance through Stage 2 to Stage 6
  using authorized routes.
- `/bandit-work-execute` should default to the current formed Work Item when
  exactly one roadmap/current-context target is executable. If multiple formed
  Work Items are eligible or no formed Work Item is eligible, it should fail
  closed with a concise explanation.
- `/bandit-work-execute` must not create a new Work Item. Formation remains the
  responsibility of `/bandit-work-create`.
- Build an internal Role Input Packet assembler that derives stage-scoped
  packet content from approved formation evidence, role contracts, stage
  rubrics, clean-code requirements, allowed writes, forbidden writes, source
  hierarchy, and current evidence state.
- The Role Input Packet assembler is not operator-facing. It exists to support
  Work Item PM orchestration and authorized role runs.
- Build a stage route registry that maps each lifecycle stage and role to the
  authorized command, process adapter, reviewer provider, or stop condition.
- The stage route registry should distinguish unavailable route, provider
  timeout, provider error, policy-required escalation, and missing operator
  input because those outcomes have different evidence and retry behavior.
- Build a blocker and provider-evidence recorder so `/bandit-work-execute`
  records honest failure state instead of reporting partial completion as
  success.
- Build Bandit-native Repo PM and Work Item PM prompt contracts from the
  operator-provided prompt sources. Preserve role behavior, stage boundaries,
  and stop conditions while removing SeekWins-specific paths and assumptions.
- Prompt contracts should instruct agents how to call Bandit's CLI, but they
  must not claim workflow authority. Authority remains in CLI validation and
  repo-native artifacts.
- The command adapters for `/bandit-work-create` and `/bandit-work-execute`
  should be thin. They parse operator intent, invoke the relevant controller,
  render concise status, and never parse repo artifacts directly.
- The implementation should preserve existing role entrypoints. The new
  operator commands simplify invocation; they do not remove or weaken
  lower-level CLI commands used by agents and tests.
- The implementation should preserve existing cockpit and session-context
  command behavior. Future cockpit action affordances may call these operator
  commands, but this PRD does not require new cockpit UI.
- The implementation should preserve existing Work Intake Ledger validation and
  triage behavior. This PRD changes how approved WIL entries flow into roadmap
  and Work Items; it does not turn WIL into a claimable queue.
- The implementation should update normal aggregate validation so command
  contracts, prompt contracts, route registry configuration, and role packet
  authority boundaries are covered by repo validation.
- The implementation should keep command output concise: current target,
  action performed, stage reached, evidence written, blocker if any, required
  operator input if any, and next safe command.
- The commands should use Bandit's shared verdict vocabulary for stage and gate
  summaries.
- The commands should preserve the normal slice-boundary rule: no new Work Item
  formation should begin until the previous active Work Item has required
  verification, landing action evidence, retrospective, improvement
  disposition, and synchronized routing files.

## Testing Decisions

- Tests should verify external workflow behavior and authority boundaries, not
  incidental helper implementation.
- Roadmap work-target resolver tests should cover current work, next work,
  closed-work interstitial state, missing current context, contradictory
  roadmap/current-context state, PRD-backed targets, WIL-backed targets, and
  refusal to scan WIL as an independent queue.
- Provenance resolver tests should cover PRD, spec, WIL, and mixed provenance
  references after roadmap authorization, including missing or stale provenance
  refusal.
- `/bandit-work-create` tests should cover creation from a roadmap-authorized
  PRD target, creation from a roadmap-authorized WIL-derived target, formation
  review approval, `formation_approved` recording, idempotent already-formed
  behavior, and refusal to start Stage 2.
- `/bandit-work-create` tests should cover operator-owned input refusal for
  missing product direction, missing policy approval, cost/risk approval,
  ambiguous scope, or missing UAT policy.
- `/bandit-work-execute` tests should cover refusal before formation approval,
  orchestration-plan requirement, Work Item PM start recording, Stage 2 route
  invocation, Stage 3 route invocation, Stage 4 reviewer routing, Stage 5
  landing routing, and Stage 6 closeout routing.
- `/bandit-work-execute` tests should cover stops for gate failure, missing
  authorized route, provider timeout, provider malformed output, missing
  operator input, stale evidence, and review finding blockers.
- Role Input Packet assembler tests should cover allowed writes, forbidden
  writes, role contract inclusion, stage-rubric inclusion, clean-code
  requirements, source hierarchy, evidence pointers, and non-canonical packet
  status.
- Stage route registry tests should cover authorized route selection, missing
  route refusal, policy-required escalation, local Qwen route use, CodeRabbit
  provider failure handling, and no ad hoc reviewer fallback.
- Prompt contract tests should verify the Repo PM and Work Item PM prompt
  contracts preserve role boundaries, do not claim canonical workflow
  authority, name required gates, and forbid stage-skipping.
- Validation tests should ensure aggregate validation fails when command
  contracts, route registry state, prompt contracts, or role packet contracts
  are malformed.
- Tests should include regression coverage that no operator-facing
  `bandit context <stage>` workflow command is required for normal execution.
- Tests should include regression coverage that `/bandit-work-create` and
  `/bandit-work-execute` remain separate commands.
- Tests should include regression coverage that approved WIL entries are
  promoted through PRD-backed roadmap scope before Work Item materialization.
- Prior art includes existing tests for work-item creation, role entrypoints and
  formation, Work Item PM start, focused session context, cockpit status,
  work-intake ledger validation, orchestrator prompt validation, role run
  manifests, stage capability scope, and artifact-input taxonomy.
- Good tests should assert observable command output, files created through
  normal CLI authority, coordination transitions, refusal diagnostics, and
  evidence artifacts. They should not assert private helper names or formatting
  that is not part of the operator contract.

## Out of Scope

- Replacing Bandit's existing lower-level CLI commands.
- Creating a single `/bandit-work create|execute` namespace.
- Adding a public operator workflow command for generic context packet
  generation.
- Starting Stage 2 from `/bandit-work-create`.
- Creating new Work Items from `/bandit-work-execute`.
- Treating the Work Intake Ledger as the primary scheduler or claimable queue.
- Automatically approving WIL proposals.
- Automatically approving PRDs.
- Automatically decomposing unapproved PRDs onto the roadmap.
- Replacing the roadmap/current-context authority path.
- Building a new external issue tracker integration.
- Building a new cockpit UI, local API, State Index, live polling loop, or
  browser-owned workflow authority.
- Changing landing autonomy, auto-landing eligibility, UAT policy, or
  never-auto-landable surfaces.
- Adding new paid reviewer/model routing or spend approval behavior.
- Changing the Local Qwen authorized reviewer route.
- Adding parallel writable workstreams, claim leases, work-surface
  reservations, worktree lifecycle automation, merge/push/deploy automation, or
  PR/CI orchestration.
- Changing Stage 7 improvement evaluation behavior except when a formed Work
  Item is itself Stage 7 evaluation work.
- Porting SeekWins repository paths, command names, or planning authority into
  Bandit.

## Further Notes

The two operator-facing command names are intentionally separate:
`/bandit-work-create` and `/bandit-work-execute`.

The shorthand `ROADMAP.md` and `CURRENT_CONTEXT.md` refers to Bandit's current
repo-native roadmap sources under the roadmap documentation area.

The Work Intake Ledger remains operator-facing proposal state and preserved
provenance. Once the operator approves a WIL proposal into queueable work, it
must become PRD-backed, roadmap-prioritized scope before normal Work Item
materialization.

The source prompts provided by the operator should be treated as prompt
behavior source material, not as literal Bandit file content. Bandit should
normalize them into its own glossary, role taxonomy, state machine, stage
rubrics, and repo-native artifact layout.

No additional product questions are currently blocking the PRD. The next gate
is operator approval of this PRD followed by roadmap decomposition.
