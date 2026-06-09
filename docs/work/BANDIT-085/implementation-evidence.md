# BANDIT-085: Stage 3 Implementation Evidence

## Summary

Stage 3 produced a deferred disposition for `WIL-REPO-WIDE-TRANSITION-INDEX`.
No source code was changed. Three documentation artifacts were created. The
disposition is source-cited, preserves canonical per-work-item coordination logs,
compares benefits and risks, names trigger conditions for future reconsideration,
and records a derived-only rebuild contract for conditional future use.

---

## Acceptance Criteria Mapping

### AC 1: WIL-REPO-WIDE-TRANSITION-INDEX Is The Authorized Intake-Derived Proposal After BANDIT-084 Closeout

Evidence in `repo-wide-transition-index-disposition.md`:

- Section "WIL-REPO-WIDE-TRANSITION-INDEX" cites `.bandit/work-intake-ledger.json`
  entry with `intake_outcome: formed`, `formed_work_item: BANDIT-085`,
  `claimable: false`.
- Section "WIL-REPO-WIDE-TRANSITION-INDEX" cites `FOLLOWUPS.md` anchor "Consider
  Repo-Wide Transition Index" as source metadata.
- BANDIT-084 coordination log (sequence 9) names `WIL-REPO-WIDE-TRANSITION-INDEX`
  as the next authorized gap: "Repo PM should form the next intake-derived gap
  work item for WIL-REPO-WIDE-TRANSITION-INDEX."
- No open bootstrap gap blocks this work item per `CURRENT_CONTEXT.md` and
  `ROADMAP.md`.

**Verdict: satisfied.**

### AC 2: Current Source-Of-Truth Policy Remains Unchanged During Triage

Evidence in `repo-wide-transition-index-disposition.md`:

- Section "Source-Of-Truth Policy: Unchanged" explicitly states: "Per-work-item
  `docs/work/<work-item-id>/coordination-log.jsonl` files remain canonical
  append-only Step Transition Ledgers."
- Section explicitly states that cockpit status, session-context, intake ledger,
  queue/context, heartbeat/improvement-health, roadmap text, generated summaries,
  static previews, browser state, caches, databases, and any future repo-wide
  index are projections that cannot grant workflow authority.
- The disposition does not approve, recommend, or authorize any change to this
  policy.

**Verdict: satisfied.**

### AC 3: Evidence Review Covers Concrete Query Pressure

Evidence in `repo-wide-transition-index-disposition.md`:

- Section "Existing Derived Projection Surfaces" enumerates cockpit status,
  session-context, work-intake validate/listing, queue/context, improvement
  health, coordination validation, and heartbeat — and documents that each
  satisfies its query need without a repo-wide index.
- Section "Recent Landed Coordination Log Evidence" reviews BANDIT-081,
  BANDIT-082, BANDIT-083, BANDIT-084 and confirms no cross-work-item
  aggregation was needed during any of these work items.
- Section "Assessment at Current Scale" documents that at 85 work items,
  per-work-item log scanning is sub-second and no concrete pressure exists.

CLI commands (cockpit status, session-context, work-intake validate) required
user approval during execution and were not run. Static file evidence was used
instead. This is noted in the disposition and writer report as a verification
gap; the commands are required post-write checks.

**Verdict: satisfied (with CLI verification gap noted).**

### AC 4: Derived Index Benefits And Risks Are Compared

Evidence in `repo-wide-transition-index-disposition.md`:

- Section "Benefits vs. Risks Analysis" covers:
  - Benefits: faster cockpit queries, cross-work-item reporting, heartbeat/
    scheduler pressure, cross-model tension tracking
  - Risks: duplicate source-of-truth, stale projection trust, hidden workflow
    authority, review-locality loss, unnecessary coupling, concurrent write risk
- Section "Assessment at Current Scale" concludes: "the benefits of an index
  are speculative; the structural risks are immediate."

**Verdict: satisfied.**

### AC 5: Landing Requires A Recommendation, Follow-Up Scope, No-Action Decision, Or Deferred Disposition

Evidence in `repo-wide-transition-index-disposition.md`:

- Disposition is "Deferred With Named Trigger Conditions And Conditional Scope."
- Section "Summary" table records: "Is a repo-wide transition index justified
  now? No."
- Deferred disposition is one of the four authorized outcomes per RED evidence
  and brief acceptance criteria.

**Verdict: satisfied.**

### AC 6: Future Implementation Scope Is Narrow If Recommended

Evidence in `repo-wide-transition-index-disposition.md`, section "Conditional
Future Implementation Scope (Not Authorized Here)":

- Named source artifacts: `docs/work/*/coordination-log.jsonl`
- Index location: `.bandit/derived/transition-index.json` or equivalent
- Authority: non-authoritative, read-only cache
- Rebuild trigger: on-demand only
- Freshness rules and staleness definition named
- Failure behavior: fail closed with clear error; fall back to per-work-item
  log scanning
- Expected RED tests: 5 named test behaviors
- Review gates: full Stage 2–5 sequence before any surface uses the index
- Explicit non-goals: 8 named non-goals

**Verdict: satisfied.**

### AC 7: Operator-Owned Decisions Remain Operator-Owned

Evidence in `repo-wide-transition-index-disposition.md`, section "Operator-Owned
Decisions (If Future Implementation Is Sought)":

- Seven named operator-owned decisions: canonical ledger with workflow authority,
  State Index with claim/scheduling/UAT authority, local API or hosted service,
  background scheduler or live polling rebuild, SQLite store or database,
  merge/push/deploy behavior tied to the index, paid routing or public benchmark
  publication.
- Each stated as "not approved or recommended by this disposition."

**Verdict: satisfied.**

### AC 8: No Stage 2 Or Stage 3 Artifact Implements Forbidden Surfaces

Evidence from writer report forbidden-surface confirmation:

- No source code, tests, index writers, caches, databases, local APIs, State
  Index, scheduler, browser mutation, merge/push/deploy, hosted service, paid
  routing, or Phase 8 product artifacts were created.
- No intake ledger, routing files, or canonical coordination log modifications.

**Verdict: satisfied.**

### AC 9: Role And Model-Family Boundaries Preserved

Evidence:

- Stage 3 writer model: Claude Sonnet 4.6 (claude-sonnet-4-6), Claude family.
- Codex (different model family) authored Stage 2 RED/disposition evidence.
- Stage 3 routes to Claude family per orchestration plan bootstrap model-family
  separation rule.
- No test-surface edits: Permanent Test Ownership Boundary preserved.

**Verdict: satisfied.**

---

## Verification Commands

Required post-write commands (Codex PM owns execution at Stage 4 handoff):

```sh
node ./bin/bandit.mjs coordination validate BANDIT-085
node ./bin/bandit.mjs work-intake validate --json
git diff --check
```

Optional for Stage 4 context:

```sh
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
```

`npm run typecheck` and `npm test` are not required: Stage 3 made no source
code changes.

---

## Clean-Code Posture

| Rubric item | Assessment |
| --- | --- |
| Spec alignment | Disposition implements the approved scope: source-cited triage of WIL-REPO-WIDE-TRANSITION-INDEX; no implementation; decision-only |
| Small surface area | Three files only; no source changes; no unrelated refactors |
| Simple design | Deferred disposition with named conditions; no structural complexity |
| Explicit state | Decision, rationale, trigger conditions, operator-owned gates, and conditional contract all named |
| No hidden authority | Disposition explicitly names operator halt conditions and non-authoritative projection boundaries |
| Testable behavior | RED evidence verification plan satisfied by disposition content |
| Readable flow | Source citations, benefits/risks, disposition, and conditional scope in separate sections |
| Locality | All artifacts in `docs/work/BANDIT-085/` only |
| Failure clarity | Disposition names fail-closed behavior for any future derived index and halts on operator-owned decisions |
| No role erosion | Test Writer-owned surfaces untouched; stage boundaries preserved |
| Improvement capture | Deferred disposition with trigger conditions is the durable artifact; no lesson is left without a record |

---

## Role Boundaries

| Role | Actions performed in Stage 3 |
| --- | --- |
| Implementation Writer (Claude Sonnet 4.6) | Created three allowed Stage 3 files; read required source evidence |
| Test Writer (Codex) | Owns `red-evidence.md` and acceptance mapping; no edits by Stage 3 Writer |
| Reviewers | Own Stage 4 evidence (not yet created) |
| Landing Agent | Owns Stage 5 verdict and action (not yet created) |
| Closeout Agent | Owns Stage 6 retrospective and improvement disposition (not yet created) |
| Operator | Owns any future decision to approve a canonical repo-wide index, State Index, local API, scheduler, claim/worktree lifecycle, merge/push/deploy, paid routing, or hosted service |

---

## Next Stage 4 Review Action

Codex PM should:

1. Run post-write verification commands:
   `node ./bin/bandit.mjs coordination validate BANDIT-085`,
   `node ./bin/bandit.mjs work-intake validate --json`, and `git diff --check`.
2. If verification passes, commit the three Stage 3 artifacts and proceed to
   Stage 4 review.
3. Dispatch CodeRabbit review or record provider-timeout/bootstrap-gap evidence.
4. Run Local Qwen via `.bandit/reviewers/local-qwen.json`.
5. Record risk classification and supply-chain gate.
6. Run `node ./bin/bandit.mjs review-subject-hash BANDIT-085` after Stage 4
   evidence commit.
7. Write `docs/work/BANDIT-085/review-evidence.md` with aggregate verdict and
   every finding dispositioned.
8. Proceed to Stage 5 landing only after aggregate Stage 4 review passes.
