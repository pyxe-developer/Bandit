# Qwen Formation Review - BANDIT-083

contract_version: 1
work_item: BANDIT-083
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: no_findings
findings_disposition: none
source_head: e4fb45e
reviewed_at: 2026-06-09T13:23:51Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- product work present: pass - the brief records `work_type: slice` and defines
  a bounded Bandit Cockpit UI Polish From Attached Design product-polish slice.
- source provenance clear: pass - source authority traces to current
  roadmap/context, `.bandit/work-intake-ledger.json` entry `WIL-UI-POLISH`,
  `FOLLOWUPS.md`, the UI-polish source note, prior cockpit slices,
  `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the slice is limited to presentation-only
  visual polish for the existing browser-served cockpit and supporting tests.
- out-of-scope boundaries explicit: pass - browser mutation authority, local
  API, State Index, live polling, guarded action execution, claims, scheduler,
  merge, push, deploy, paid routing, Trust Verifier cutover, public benchmark
  publication, external services, dependency/lockfile changes, and unrelated
  Phase 8 work are excluded.
- acceptance criteria are verifiable: pass - criteria cover Evidence Row
  presentation, source-link readability, responsive/accessibility behavior,
  read-only authority boundaries, product UAT, and Stage 4 review gates.
- verification plan present: pass - Stage 1 through Stage 6 checks are listed,
  including RED evidence before implementation and CLI-owned product UAT before
  landing.
- CLEAN_CODE.md read evidence present: pass - read evidence is recorded for
  2026-06-09 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - no open bootstrap gap blocks the
  slice, and future local API, State Index, live polling, claim/worktree,
  inbox mutation, merge/push/deploy, paid routing, hosted service, public
  benchmark, and Trust Verifier cutover work remains outside the slice.
- expected files and required evidence present: pass - the brief lists expected
  cockpit source, tests, roadmap/status, UAT, landing, closeout, and
  formation/review evidence.
- stage capability scope present: pass - authority roles, required skills,
  allowed tools, token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation; product direction beyond the recorded design source,
  policy, business, cost/risk, merge/push/deploy, public benchmark publication,
  paid routing, hosted service, Trust Verifier cutover, guarded action, local
  API, State Index, and ambiguous scope remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit tests, helpers, fixtures, RED evidence, or acceptance mappings.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- CLI Authority and projection boundary preserved: pass - cockpit browser,
  design tokens, generated previews, fixture data, screenshots, local cache,
  browser storage, view models, and generated UI state remain non-canonical.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists
  and Work Item PM, RED, and implementation remain blocked until
  `formation_approved`.
- Local Qwen route preserved: pass - the review used
  `.bandit/reviewers/local-qwen.json` through
  `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 10 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned the configured `Qwen3.6-35B-A3B-MLX-8bit` model.

Formation review command:

```sh
<BANDIT-083 Stage 1 formation packet assembled from AGENTS.md, CLEAN_CODE.md,
docs/verification/STAGE_RUBRICS.md, docs/roadmap/CURRENT_CONTEXT.md,
docs/roadmap/ROADMAP.md, .bandit/work-intake-ledger.json WIL-UI-POLISH,
docs/design/workflow-cockpit/bandit-ui-polish-source.md,
docs/specs/BANDIT-083-bandit-cockpit-ui-polish-from-attached-design.json,
docs/work/BANDIT-083/brief.md, and
docs/work/BANDIT-083/coordination-log.jsonl> | timeout 240 node
bin/omlx-chat-completions.mjs -
```

Result:

```json
{
  "verdict": "pass",
  "findings_status": "no_findings",
  "findings_disposition": "none",
  "findings": [],
  "summary": "The BANDIT-083 Stage 1 brief fully satisfies all required criteria. Goal, origin/source authority, bounded scope, out-of-scope, verifiable acceptance criteria, test/verification plan, CLEAN_CODE.md read evidence, bootstrap gap disposition, expected files, required evidence, stage capability scope, operator input status, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, forbidden actions, CLI authority, source-of-truth/projection boundary, Local Qwen route boundary, and stop-before-RED boundary are all explicitly defined and compliant with Bandit policy. No blockers or missing artifacts identified."
}
```

## Findings

No Stage 1 formation blockers or non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-083` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
