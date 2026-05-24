---
name: bandit
description: Use when the operator types /bandit, invokes $bandit, asks to start or continue Bandit, asks for the next Bandit slice, or starts a cold session that needs to recover Bandit context and kick off the next correct step from /Users/matthewflebbe/Bandit.
---

# Bandit

Use this skill as the cold-start entry point for Bandit.

The goal is to answer, from repo artifacts rather than chat memory:

- where are we?
- what is the next correct step?
- which rules apply before work begins?
- what evidence must be created or updated?

## Hard Boundary

Bandit context lives in `/Users/matthewflebbe/Bandit`.

Do not infer status from memory when the repo can answer it. Read the current
repo state first. If repo artifacts and chat disagree, trust repo artifacts and
surface the discrepancy.

## Invocation Meaning

When the operator invokes `/bandit`, `$bandit`, or asks to start/continue the
next Bandit slice, treat it as:

1. restore Bandit context from the repo;
2. identify the next action;
3. perform only the next appropriate bootstrap step unless the operator clearly
   asks to continue further;
4. update context artifacts if the next action changes.

## Required First Reads

Read these files before deciding what to do:

1. `/Users/matthewflebbe/Bandit/AGENTS.md`
2. `/Users/matthewflebbe/Bandit/docs/roadmap/CURRENT_CONTEXT.md`
3. `/Users/matthewflebbe/Bandit/docs/roadmap/ROADMAP.md`
4. `/Users/matthewflebbe/Bandit/docs/plans/BOOTSTRAP_METHODOLOGY.md`
5. `/Users/matthewflebbe/Bandit/CLEAN_CODE.md`
6. `/Users/matthewflebbe/Bandit/docs/verification/STAGE_RUBRICS.md`

Read these as needed:

- `README.md` for orientation.
- `docs/plans/V0_PLAN.md` for phase decomposition.
- `docs/prds/BANDIT-PRD-001-founding-product.md` when scope is unclear.
- latest `docs/work/**` item if an active work item exists.
- `docs/verification/RUBRIC_DRIVEN_VERIFICATION.md` when verification rules are relevant.

## Cold-Start Workflow

1. **Check repository state.**

   Run:

   ```sh
   git status --short
   git log --oneline --decorate --max-count=5
   ```

   If the tree is dirty, inspect changes before editing. Do not overwrite
   unrelated user changes.

2. **Load context.**

   Read the required first-read files. Extract:

   - current phase
   - active work item
   - current next action
   - known blockers
   - bootstrap gaps
   - required rubrics for the current stage

3. **Repair context first if needed.**

   If `CURRENT_CONTEXT.md` does not clearly answer "what is next?", the next
   task is to repair `CURRENT_CONTEXT.md` and, if needed, `ROADMAP.md`.
   Do not write implementation code until context is repaired.

4. **Read `CLEAN_CODE.md` before any slice work.**

   `CLEAN_CODE.md` is mandatory. If the next action is slice creation or slice
   execution, record in the work item that `CLEAN_CODE.md` was read.

5. **Apply stage rubrics.**

   Use `docs/verification/STAGE_RUBRICS.md` to identify the current stage and
   required evidence. Use the verdict values from that file: `pass`,
   `blocker`, `non_blocking`, `not_applicable`, `bootstrap_gap`.

6. **Perform the next step only.**

   Follow the current next action in `CURRENT_CONTEXT.md`. For the initial
   state, this means creating the first bootstrap work item for
   `BANDIT-001 - Repo-Native State And CLI Skeleton`.

7. **Update current context when the next action changes.**

   If you create or complete a step, update `CURRENT_CONTEXT.md` so a future
   cold session can resume without chat history.

8. **Verify and commit when appropriate.**

   Run `git diff --check`. If the step produced a coherent artifact and the
   operator asked you to proceed, commit with a focused message. Do not bundle
   unrelated changes.

## BANDIT-001 Bootstrap Brief Requirements

When the next action is to create the first work item, create:

`/Users/matthewflebbe/Bandit/docs/work/BANDIT-001/brief.md`

The brief must include:

- goal
- scope
- out of scope
- acceptance criteria
- test plan
- `CLEAN_CODE.md` read evidence
- stage-rubric checklist
- bootstrap gaps
- expected files
- first implementation order

Do not create detailed briefs for future phases yet. Keep future work in the
roadmap until it is the next executable step.

## Operator Question Policy

Do not ask the operator routine technical questions. Codex PM owns:

- slice sizing
- skill or agent choice
- reviewer routing
- smell-trigger escalation
- implementation order within the approved scope
- whether context needs repair before code

Ask the operator only for:

- product direction
- UAT
- policy changes
- business tradeoffs
- explicit cost or risk overrides
- genuinely ambiguous scope

## Output Shape

When invoked, provide a concise status like:

```text
Bandit context restored.
Phase: <phase>
Active work: <work item or none>
Next action: <action>
I am doing: <single next step>
```

After work, report:

- files changed
- verification run
- commit SHA, if committed
- next action now recorded in `CURRENT_CONTEXT.md`
