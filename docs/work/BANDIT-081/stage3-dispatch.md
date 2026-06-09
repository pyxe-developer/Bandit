# BANDIT-081 Stage 3 Implementation Dispatch

## Role

You are the Claude-family Implementation Writer for `BANDIT-081`.

Codex authored and materially edited Stage 2 RED tests, so model-family
separation requires Claude-family implementation for Stage 3.

## Goal

Implement the narrow Operator Attention / Operator Inbox presentation boundary
for the browser-served Workflow Cockpit.

The implementation must make `node --test test/cockpit-operator-attention.test.mjs`
pass without editing any Test Writer-owned surface.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-081/brief.md`
- `docs/work/BANDIT-081/red-evidence.md`
- `test/cockpit-operator-attention.test.mjs`
- `src/state/cockpit-view-model.ts`
- `src/cockpit/browser-shell.ts`
- `public/cockpit/cockpit.css`

## Allowed Write Surfaces

You may edit only source/presentation files needed for this implementation:

- `src/state/cockpit-view-model.ts`
- `src/state/cockpit-status.ts`
- `src/cockpit/browser-shell.ts`
- `public/cockpit/cockpit.css`
- other `src/**` or `public/cockpit/**` files only if strictly necessary for
  this source implementation.

## Forbidden Write Surfaces

Do not create, edit, delete, format, regenerate, or mechanically adjust:

- `test/**`
- `docs/work/BANDIT-081/red-evidence.md`
- `docs/work/BANDIT-081/orchestration-plan.md`
- `docs/work/BANDIT-081/coordination-log.jsonl`
- `docs/work/BANDIT-081/brief.md`
- formation, review, UAT, landing, retrospective, roadmap, status, artifact
  input, or acceptance-mapping artifacts.

If a test appears wrong, stop and report the concern. Do not repair tests.

## Implementation Contract

Add a small, explicit view-model boundary for:

- `operator_attention`
- `operator_inbox`

The boundary must be presentation-derived and non-canonical. It must not write
repo artifacts, resolve inbox messages, record operator responses, record UAT,
grant approvals, decide landing safety, invoke CLI commands, schedule work,
claim work, merge, push, deploy, change policy, or treat fixture/browser state
as canonical.

The RED tests define the exact minimum observable contract:

- `operator_attention.kind === "operator_attention"`
- required-input, blocker, and stale-evidence rows with owner, route, source,
  freshness, and blocked-reason fields
- `operator_inbox.kind === "operator_inbox"`
- fixture-backed inbox messages with source artifact links
- absent/empty inbox state with `empty_inbox`
- browser shell sections with `aria-label="Operator attention"` and
  `aria-label="Operator Inbox"`
- browser shell metadata with empty mutation forms and false inbox authority
  flags
- no form, browser storage, fetch, resolve/archive, approve-UAT, or record-UAT
  behavior

Keep Operator Inbox visually and semantically distinct from the existing
Attention category navigation.

## Verification

Run at minimum:

```sh
node --test test/cockpit-operator-attention.test.mjs
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

If broader shared behavior is touched, also run:

```sh
npm test
```

## Output

Return a concise report with:

- files changed
- tests run and results
- confirmation that no forbidden test/evidence/acceptance-mapping surfaces were
  edited
- any blocker, if encountered
