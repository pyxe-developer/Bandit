# Role-Scoped Workflow Orchestration

## Status

Design record for the workflow redesign that replaces the narrow queued
`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` gap.

This artifact captures the decisions from the 2026-06-01 grill-with-docs
session. It is a planning and terminology source for `BANDIT-057`; it is not
implementation evidence and does not mutate the current bootstrap-gap ledger.
The current ledger does not yet support the accepted `replaced` disposition, so
`BANDIT-057` must add that support before formally replacing the old gap.

## Problem

Bandit's current PM workflow burns too much context and collapses too many
authorities into one PM activation. The overloaded flow reads broad roadmap and
rubric context, reviews details that should already be formation-gated, inspects
raw agent output, and sometimes performs repairs across Writer and Test Writer
ownership boundaries.

The `BANDIT-056` Stage 4 repair ownership violation is the visible symptom:
Codex PM edited implementation-owned source and Test Writer-owned coverage in
one repair step. The root issue is broader role-boundary erosion.

## Accepted Direction

Bandit work must start through explicit authority roles. Bare `/bandit` should
be removed or deprecated into a role-required refusal. It should not read global
context and infer a role.

The first explicit roles are:

- `repo-pm`: formation, unblocking, queued-gap replacement, brief writing,
  formation review, roadmap/status/gap updates, and final repo-level closure.
- `work-item-pm <ID>`: execution orchestration for a formation-approved Work
  Item only.

Repo PM and Work Item PM are separate authority roles. Work Item PM is not a
Repo PM capability profile; it has narrower authority scoped to one Work Item
and cannot own repo-level queue state, claim recovery, intake triage,
implementation, tests, review authority, landing authority, or final `closed`
state.

## Formation Gate

A Work Item is not available to Work Item PM just because `brief.md` exists.
Repo PM must complete a Formation Gate first.

Formation Gate requirements:

- deterministic CLI formation validation passes;
- Qwen formation review runs;
- CodeRabbit formation review runs;
- blocker findings are repaired before availability;
- non-blocking formation findings are dispositioned as audit evidence;
- operator-owned blockers are absent or explicitly recorded as blocked;
- the CLI records `formation_approved` as an append-only coordination
  `step_transition`.

Formation review artifacts live in:

- `docs/work/<ID>/qwen-formation-review.md`
- `docs/work/<ID>/coderabbit-formation-review.md`
- `docs/work/<ID>/formation-review.md`

Formation review checks only work formation:

- work item type is correct;
- source artifact and provenance are clear;
- scope is narrow enough for one Work Item PM session;
- acceptance criteria are verifiable;
- out-of-scope boundaries block obvious scope creep;
- operator-owned inputs are explicitly none or blocked;
- role contracts and decomposed rubrics are named;
- write-surface families are declared;
- Test Writer and Implementation Writer boundaries are preserved;
- formation and execution packets can be generated;
- replacement or supersession state is honest when applicable.

Formation review should not review implementation details beyond whether the
work is bounded and testable.

## Work Item PM Execution

Work Item PM starts only from `formation_approved`.

Default Work Item PM context is a generated Work Item Execution Packet, not the
full brief, full roadmap, raw agent streams, or full reviewer output. The packet
should include only the execution-relevant contract: goal, scope,
out-of-scope, acceptance criteria, test plan, role-run sequence, allowed
execution-stage artifact paths, validation commands, current stage, next
action, and blocker state.

Work Item PM orchestrates execution stages:

- Stage 2: invoke Test Writer for RED tests and RED evidence.
- Stage 3: invoke Implementation Writer for implementation.
- Stage 4: invoke Qwen and CodeRabbit reviewers in parallel.
- Stage 5: invoke Landing Agent.
- Stage 6: invoke Closeout/Retrospective subagent.

Work Item PM does not write tests, implementation, reviewer findings, landing
verdicts, or final repo-level closure. If Test Writer discovers that the brief
is wrong or incomplete, Test Writer stops with a brief amendment request; Work
Item PM records the blocker and calls Repo PM in the same session to amend or
reject the brief. Repo PM owns the amended formation artifacts; Work Item PM
owns execution invalidation and retry after amendment.

Work Item PM may reach `retrospective_recorded`. Repo PM owns the final
`closed` transition and next-work availability.

## Role Contracts And Run Manifests

Role contracts are structured repo-native policy files. Markdown skills and
prompts are adapters, not the authority source.

Future role contracts should cover:

- Repo PM
- Work Item PM
- Test Writer
- Implementation Writer
- Reviewer
- Landing Agent
- Closeout/Retrospective

Each subagent invocation requires a CLI-generated Role Run Manifest. Work Item
PM requests the manifest; it does not invent allowed write surfaces from
scratch.

Each manifest records:

- Work Item ID;
- stage;
- role contract ID and version;
- capability profile or subagent identity;
- `base_revision`;
- target files the run may write;
- forbidden file patterns;
- required input packet;
- required summary path;
- validation commands.

Role-run attempts are append-only artifacts, with derived current-state views
only. Validation compares the run's actual diff against the manifest from
`base_revision`. Reads are audited through the role summary; writes are
enforced.

Subagents write structured JSON summaries. The CLI validates and normalizes
those summaries into the role-run attempt record. Work Item PM reads summaries,
validation results, changed-file lists, command-result summaries, and blocker
or handoff requests. It reads diffs only when validation fails, summaries
conflict with changed files, reviewer findings require disposition, or a gate
blocks.

## Stage 4 Repair Loop

Stage 4 repair routing is authority-specific:

- implementation repair goes to the same Implementation Writer session when
  available;
- test or acceptance repair goes to the same Test Writer session when
  available;
- brief or scope problems go to Repo PM;
- reviewer misunderstanding is dispositioned by Work Item PM;
- operator-owned decisions block for operator input.

Same-agent continuation is preferred so the repairing agent can use existing
working context. It is not required; cold-start recovery must work from
manifests, packets, summaries, committed stage artifacts, and validation
results.

Repair manifests should record:

- `continuation_of_role_run_id`;
- same role contract ID and version;
- same subagent identity when known;
- new `base_revision`;
- finding IDs being repaired;
- allowed repair write surfaces;
- unchanged forbidden surfaces;
- expected repair summary path.

After any implementation or test repair, Work Item PM reruns Qwen and
CodeRabbit in parallel from a fresh Stage 4 review packet.

## Landing And Closeout

Landing Agent is invoked as a subagent. Work Item PM does not switch into
landing authority.

Closeout/Retrospective is also a subagent. It drafts retrospective and
improvement-mining evidence from role-run summaries, reviewer findings, landing
evidence, and stage outcomes. Work Item PM validates the closeout artifacts.
Repo PM reads a compact Closeout Packet and owns final `closed` plus roadmap,
status, gap, and intake updates.

## First Implementation Slice

The first slice is `BANDIT-057 - Role Entry Points And Formation Gate`.

It should implement only:

- support for a `replaced` bootstrap-gap disposition;
- explicit role entrypoints;
- bare `/bandit` or bare CLI role-required refusal;
- `repo-pm create-work-item <spec-path>`;
- `repo-pm approve-formation <work-item-id>`;
- deterministic formation validation;
- Qwen and CodeRabbit formation review artifacts;
- aggregate formation review artifact;
- `formation_approved` coordination transition;
- `work-item-pm start <work-item-id>` readiness checks;
- the decision and glossary updates that describe the new boundary.

It should not implement:

- full PRD decomposition;
- broad claimability or unblocking repairs;
- role contracts;
- role-run manifests;
- execution packets or role input packets beyond minimal readiness checks;
- diff-based write validation;
- same-agent repair continuation;
- landing subagent packets;
- closeout packets;
- full monolithic rubric migration.

## Follow-On Slices

Expected follow-on slices:

1. Role Contracts And Run Manifests.
2. Execution And Role Input Packets.
3. Stage 4 Repair Continuation.
4. Landing And Closeout Handoffs.
5. Decomposed Rubric Migration.

The exact split remains Repo PM formation work and should be finalized through
formation review before those Work Items become available to Work Item PM.
