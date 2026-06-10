# BANDIT-093 Stage 3 Implementation Evidence

work_item: BANDIT-093
stage: Stage 3 Implementation
writer_model: MiniMax-M3 (headless pi, fallback dispatch)
timestamp: 2026-06-10
verdict: pass_implementation_recorded

## Source Files Changed

- `src/state/roadmap-work-targets.ts` — added `noUncheckedIndexedAccess`
  narrowing in `parseRoadmapItem` and `parseCurrentContext` so the
  `RegExpMatchArray` capture groups are explicitly guarded before use.
  Resolution flow, reconciliation, provenance dereference, diagnostics,
  and exported `resolveRoadmapWorkTarget` API are unchanged from the
  Claude attempt, which had already passed the focused tests.

No other source files required repair:

- `src/commands/roadmap-work-targets.ts` — already satisfies the test
  surface for `bandit roadmap-work-targets resolve --json` (usage
  diagnostic, exit code, JSON projection).
- `src/cli.ts` — already wires the new command into the role-aware
  dispatcher, mirroring the work-intake and spec-to-evidence commands.

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node --test test/roadmap-work-targets.test.mjs` | pass, 6/6 |
| `npm run typecheck` | pass, no diagnostics |
| `npm test` | pass, 618/618 |
| `git diff --check` | clean |

The focused test suite covers every acceptance criterion that
`red-evidence.md` mapped to it (active formed work item, interstitial
not-yet-formed target, fail-closed disagreement, stale historical
tail, no hidden WIL scheduler, WIL provenance dereference after
authorization). The full suite stays green to prove the source change
did not regress shared roadmap, validation, cockpit, or session
context behavior.

## Acceptance Criteria Mapping

| Acceptance criterion | Evidence |
| --- | --- |
| Resolver returns deterministic current or next work target from `ROADMAP.md` and `CURRENT_CONTEXT.md` with title, type, status, relationship, source artifacts, and provenance pointers. | `node --test test/roadmap-work-targets.test.mjs` → test 1 (`roadmap work target resolver returns the active formed work item`) asserts `kind`, `authority`, `target.id`, `target.title`, `target.work_type`, `target.status`, `target.relationship`, `target.source_artifacts`, and `target.provenance_pointers` exactly. |
| Resolver handles closed-work interstitial state and returns `not_yet_formed` target data instead of inventing active work. | Test 2 (`returns a not-yet-formed interstitial target`) asserts `target.id === "TBD"`, `target.status === "not_yet_formed"`, `target.relationship === "next"`, `source_artifacts: ["docs/roadmap/ROADMAP.md"]`, and the PRD-005.2 provenance pointer. |
| Resolver fails closed with clear diagnostics when `ROADMAP.md` and `CURRENT_CONTEXT.md` disagree. | Test 3 (`fails closed on roadmap and current-context disagreement`) asserts exit code 1 and the diagnostic `Roadmap work target blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on authorized work target`. |
| Resolver cannot route execution from stale historical tail wording for closed work. | Test 4 (`ignores stale historical tail text`) asserts the active target remains `BANDIT-093` and that `stale_tail_status === "ignored"` is set when the historical tail is detected. |
| Resolver refuses to use `.bandit/work-intake-ledger.json` as a primary scheduler or hidden priority queue. | Test 5 (`does not use work intake as a hidden scheduler`) confirms the resolver returns the no-authorized-target diagnostic and that `WIL-V0-TRIAL` is not surfaced when the roadmap itself does not name a target. |
| Resolver dereferences PRD, spec, or WIL provenance only after roadmap/current-context authority names the target. | Test 6 (`dereferences WIL provenance only after roadmap authorization`) confirms a WIL provenance pointer is attached only when the next-item title matches a WIL entry AND no PRD reference is extractable from the title. |
| Aggregate Bandit validation or focused resolver validation covers matching targets, mismatched targets, missing roadmap/current-context target data, closed-work interstitial targets, PRD-backed provenance, WIL-backed provenance, and no-hidden-WIL-scheduler behavior. | Tests 1-6 cover matching, mismatched, missing roadmap target (test 5), interstitial (test 2), PRD-backed (tests 1 and 2), WIL-backed (test 6), and no-hidden-WIL-scheduler (test 5) cases. |
| Implementation keeps resolver parsing and reconciliation logic readable, deterministic, and separated from future create-controller and execute-controller behavior. | `src/state/roadmap-work-targets.ts` exposes only `resolveRoadmapWorkTarget` and the type definitions. There is no create, execute, claim, schedule, or write path. `src/commands/roadmap-work-targets.ts` is a thin `resolve --json` adapter. |
| The work preserves role boundaries: Test Writer owns RED evidence and test edits; if Codex authors Stage 2 tests, Stage 3 implementation is routed to Claude or another non-Codex model family. | The MiniMax fallback writer is a non-Codex model family; only source files and Stage 3 writer evidence were edited. Test Writer-owned files were not touched. |
| Stage 4 review uses Local Qwen only through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`, CodeRabbit or honest provider-timeout/refusal evidence, aggregate review evidence, risk classification, and supply-chain evidence before landing. | Out of scope for this Stage 3 evidence file. Recorded for the review and landing agents in `docs/work/BANDIT-093/`. |
| The work item does not start PRD-005.2, PRD-005.3, PRD-005.4, `/bandit-work-create`, `/bandit-work-execute`, V0 Closeout Claude Code A/B Product-Value Trial, Trust Verifier cutover, cockpit UI, local API, State Index, hosted services, telemetry, public benchmark publication, paid routing, merge, push, deploy, or unrelated Phase 8 work. | The `roadmap-work-targets resolve --json` command is a derived read-only projection. No new workflow authority, no hosted service, no telemetry, no merge/push/deploy authority, no Trust Verifier cutover, and no PRD-005.2/3/4 evidence was created. |

## Clean-Code Compliance

- Resolution flow is split into small, named helpers
  (`extractSection`, `parseRoadmapItem`, `parseRoadmap`,
  `parseCurrentContext`, `buildCurrentTarget`, `buildNextTarget`) so
  each stage can be reasoned about independently.
- Provenance dereference is contained in `findSpecForWorkItem`,
  `findPrdPath`, and `findWilEntry`; it is only invoked from
  `buildCurrentTarget` and `buildNextTarget` after the authority
  surfaces identify a target.
- The CLI is a thin adapter that returns the JSON projection or a
  diagnostic string; it does not import or call any create, execute,
  land, claim, schedule, or persistence routine.
- The added nullability narrowing in `parseRoadmapItem` and
  `parseCurrentContext` keeps the helpers single-purpose: each fix is
  a guard expression, not new behavior.

## Role Boundary Confirmation

The Stage 3 fallback writer did not create, edit, delete, regenerate,
format, or mechanically adjust any of the following:

- `test/roadmap-work-targets.test.mjs` or any `test/**` file.
- `docs/work/BANDIT-093/red-evidence.md`.
- Acceptance mappings, formation evidence, review evidence, landing
  evidence, UAT evidence, retrospective evidence, or policy acceptance
  criteria.
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, or root
  `STATUS.md`.
- `.bandit/work-intake-ledger.json`.
- Package metadata, lockfiles, dependencies, CI/release workflows,
  hosted services, telemetry, merge/push/deploy behavior, or unrelated
  Phase 8 work.

The only source edit was the targeted nullability repair in
`src/state/roadmap-work-targets.ts`. The only new files are
`docs/work/BANDIT-093/writer-report.md` and this
`implementation-evidence.md`.

## Verdict

`pass_implementation_recorded` for Stage 3. The source implementation
satisfies the focused tests, the strict TypeScript build, the full
test suite, and the clean-code constraints from `CLEAN_CODE.md` and
the brief. Stage 4 review, Stage 5 landing, and Stage 6 retrospective
remain the responsibility of their owning agents.
