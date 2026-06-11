# BANDIT-095 RED Evidence

contract_version: 1
work_item: BANDIT-095
stage: Stage 2 RED
actor: test_writer
created_at: 2026-06-11T11:19:45Z
verdict: pass
findings_status: no_findings
findings_disposition: no_action_required

## Scope

Stage 2 RED evidence covers the approved `BANDIT-095` brief for Repo PM Create
Controller Closed Anchor Routing. Codex authored the RED tests, so Stage 3
must route implementation to a different model family. During bootstrap, Stage
3 routes to Claude first and may fall back to MiniMax-M3 only after immediate
Claude authentication failure or the required 20-minute timeout.

## Test Ownership Boundary

Test Writer owns:

- `test/work-create-controller.test.mjs`
- `test/roadmap-work-targets.test.mjs`
- this RED evidence and acceptance mapping

The Stage 3 Implementation Writer has zero authority to edit tests, test
helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-095`.

## RED Tests Added

| Test surface | Acceptance criteria mapped |
| --- | --- |
| `test/roadmap-work-targets.test.mjs` returns the next target when current roadmap item is a closed anchor | Resolver selects the next unformed roadmap/current-context target when the current Work Item is closed and retained only as a derived-status anchor. |
| `test/work-create-controller.test.mjs` creates next target from a closed current-work anchor | `repo-pm create-controller --json` creates the next explicit source spec target from a fully closed current anchor and does not start Stage 2. |
| `test/work-create-controller.test.mjs` refuses closed-anchor routing without landing action evidence | Controller fails closed when the retained closed current Work Item lacks required slice-boundary landing action evidence. |

Existing tests remain in the focused suite for current-target idempotency,
missing source spec refusal, operator-owned input refusal, authorized Local
Qwen route refusal, and no Stage 2 artifact creation.

## Command Evidence

```sh
node --test test/work-create-controller.test.mjs
```

Result: `fail` as expected for RED.

Observed failures:

- `Repo PM create controller creates next target from a closed current-work
  anchor` failed because current behavior returns
  `Current work item BANDIT-094 is not formation_approved; refusing to
  re-allocate or skip formation review.`
- `Repo PM create controller refuses closed-anchor routing without landing
  action evidence` failed because the diagnostic is the generic
  `not formation_approved` refusal rather than a closed-anchor
  slice-boundary evidence refusal naming `landing-action.md`.

```sh
node --test test/roadmap-work-targets.test.mjs
```

Result: `fail` as expected for RED.

Observed failure:

- `roadmap work target resolver returns next target when current roadmap item
  is a closed anchor` failed because the resolver returned target id
  `BANDIT-094` instead of `TBD`.

## Acceptance Mapping

The RED suite requires Stage 3 implementation to add:

- Closed-anchor detection in roadmap/current-context target resolution when
  `ROADMAP.md` retains a `Stage 6: closed` current work item and also records
  an authorized next unformed target.
- Slice-boundary evidence checks before the create controller may advance from
  a closed current anchor to the next target. At minimum, the retained closed
  Work Item must have `landing-action.md`, `retrospective.md`,
  `improvement-disposition.md`, and a `closed` coordination transition.
- Preservation of active-current idempotency and refusal semantics: active or
  `formation_approved` current work still resolves as current, and unclosed,
  incomplete, stale, or contradictory current work cannot silently route to the
  next target.
- Preservation of creation safety for explicit source specs, operator-owned
  input, authorized Local Qwen route, duplicate allocation, and no Stage 2
  artifact creation.
- Preservation of source hierarchy: `ROADMAP.md`, `CURRENT_CONTEXT.md`,
  work-item artifacts, and coordination logs remain authority surfaces; Work
  Intake Ledger, PRDs, specs, prompt contracts, cockpit status, and
  session-context packets do not become independent priority authority.

## Stage 3 Route

Because Codex authored the RED tests and acceptance mapping, Stage 3
implementation must be performed by Claude first, preserving the Permanent Test
Ownership Boundary. If Claude authentication fails immediately or Claude times
out after the required 20-minute window, Stage 3 may fall back to MiniMax-M3
through headless `pi`.
