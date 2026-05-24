# BANDIT-003 Implementation Evidence

## Status

Production implementation, post-review repair, and Stage 3 verification are
complete for `bandit draft-work <feature-prd-path>`.

Review evidence, landing verdict, and retrospective are recorded in separate
BANDIT-003 closeout artifacts.

## Implemented Scope

- Added `bandit draft-work <feature-prd-path>` CLI routing.
- Added deterministic Feature PRD parsing for an ID-bearing H1, required Feature
  PRD sections, and exactly one fenced `bandit-work-draft` JSON block.
- Added draft item validation for `slice`, `chore`, and `improvement_chore`.
- Added deterministic work item ID allocation from `.bandit/config.toml`
  `work_item_prefix` and existing `docs/work/<ID>` directories.
- Added fail-closed preflight before writes, including overwrite refusal and
  no partial writes for invalid planned drafts.
- Added Slice and Chore brief rendering with source PRD ID/path metadata.
- Added retrospective-derived improvement chore metadata rendering.
- Added lifecycle events for each successfully drafted work item.
- Kept work item header parsing consistent with the configured work item prefix
  format, including uppercase prefixes with digits.
- Kept repo-native files canonical; no database, generated index, UI state, or
  LLM decomposition path was introduced.

## Acceptance Mapping

| Acceptance Criteria | Evidence |
|---|---|
| AC 1 | Missing path returns `Usage: bandit draft-work <feature-prd-path>`. |
| AC 2 | Command reads and parses `.bandit/config.toml`; malformed state uses the existing malformed config error path. A post-review regression test covers a configured prefix with digits. |
| AC 3 | Feature PRD H1 and required sections are validated before draft parsing. |
| AC 4 | Decomposition notes require exactly one fenced `bandit-work-draft` JSON block. |
| AC 5 | Draft item validation requires supported kind, title, work statement, scope, acceptance criteria, verification/test plan, expected files, required evidence, and operator input status. |
| AC 6 | Slice drafts render briefs with the Slice template headings. |
| AC 7 | Chore drafts render briefs with the Chore template headings. |
| AC 8 | `improvement_chore` drafts require and render origin, source metadata, lesson, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome. |
| AC 9 | IDs are allocated by scanning existing `docs/work/<PREFIX>-NNN` directories and assigning sequential IDs for the run; generated IDs validate with the same prefix format. |
| AC 10 | Existing output paths are refused before writes. |
| AC 11 | All items are validated and all output paths are preflighted before any draft files are written. |
| AC 12 | Successful output lists created IDs and `docs/work/<ID>/brief.md` paths. |
| AC 13 | Successful drafts append `work_item_drafted` lifecycle events. |
| AC 14-16 | `test/draft-work.test.mjs` covers slice/chore success, improvement chore success, and refusal paths. |
| AC 17 | `bandit validate` passes after valid draft work items are created in tests and in the current repo. |
| AC 18 | Implementation stays in CLI/repo-native state and avoids hidden canonical state or broad parser/framework complexity. |

## TDD Evidence

- RED was recorded before production implementation in
  `docs/work/BANDIT-003/red-evidence.md`; the focused suite failed because the
  command did not exist.
- GREEN was verified after implementation with
  `node --test test/draft-work.test.mjs`.
- Test Writer-owned assertions in `test/draft-work.test.mjs` were not weakened.
- PM review found a prefix contract mismatch after implementation: `parseConfig`
  accepted uppercase prefixes with digits, while work item header validation did
  not. A RED regression test was added before the parser fix and now passes.

## Verification

| Command | Result |
|---|---|
| `node --test test/draft-work.test.mjs` | `pass` - 14 tests passed. |
| `npm test` | `pass` - 35 tests passed. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - Bandit state is valid. |
| `git diff --check` | `pass`. |

## Clean-Code Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation maps to BANDIT-003 acceptance criteria without redefining PRD-to-work scope. |
| Small surface area | `pass` | Diff is limited to CLI routing, config parsing, draft-work command implementation, a work item ID parser consistency fix, focused tests, and required evidence/context updates. |
| Simple design | `pass` | Uses explicit JSON parsing and local validators; no schema framework, LLM decomposition, database, or cockpit path was added. |
| Explicit state | `pass` | Source PRDs, work briefs, and lifecycle events remain named repo files. |
| No hidden authority | `pass` | `.bandit/` config and `docs/work/**` remain canonical; no index or UI state owns workflow truth. |
| Testable behavior | `pass` | Success, refusal, overwrite, and no-partial-write behavior are covered by focused tests. |
| Readable flow | `pass` | Parsing, validation, ID allocation, rendering, write preflight, writes, and event recording are separated in named helpers. |
| Locality | `pass` | Draft-work behavior is grouped in `src/commands/draft-work.ts`; shared config parsing stays in `src/state/config.ts`. |
| Failure clarity | `pass` | Missing, malformed, unsupported, incomplete, outside-repo, occupied-path, and configured-prefix validation paths fail closed with explicit messages. |
| No role erosion | `pass` | The command drafts only from explicit PRD decomposition data and does not infer product direction. |
| Improvement capture | `pass` | No new workflow lesson requiring an improvement chore was identified during implementation. |

## Stage-Rubric Verdict

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify BANDIT-003 as active and next action as review/landing closeout. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-003/brief.md` is the implementation contract. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-003/red-evidence.md` and `test/draft-work.test.mjs` captured RED before implementation. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | This evidence records green verification, the post-review repair, and clean-code compliance. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | `review-evidence.md` records manual PM review and unavailable CodeRabbit/Qwen/escalation gates as bootstrap gaps. |
| Stage 5: Landing And UAT | `pass` | `landing-verdict.md` records a safe-to-land bootstrap verdict. UAT is not applicable to this workflow-infrastructure slice. |
| Stage 6: Retrospective And Improvement Capture | `pass` | `retrospective.md` records lessons and durable dispositions. |

## Bootstrap Gaps

- CodeRabbit pre-landing loop is not automated yet.
- Local Qwen adversarial gate is not implemented yet.
- Landing Agent is not implemented yet.
- UAT artifact is unavailable and not applicable to this infrastructure slice.

## Next Action

Land BANDIT-003 with a focused bootstrap commit, then create the next Phase 3
brief in a later step. Do not begin the next slice until the commit exists.
