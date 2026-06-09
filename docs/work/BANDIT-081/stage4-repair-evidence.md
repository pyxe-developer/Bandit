# Stage 4 Repair Evidence: BANDIT-081

contract_version: 1
work_item: BANDIT-081
source_head: 7bb4f55445a3145fa71b5a4432280e739dedac3b
repair_scope: CodeRabbit partial finding events before provider timeout.
repair_state: pass
operator_input_status: none_required

## Repairs

- `src/cockpit/browser-shell.ts` computes responsive metadata once and reuses
  it for both the legacy `responsive` field and the new `layout.responsive`
  field.
- `src/cockpit/browser-shell.ts` treats missing operator-attention rows as an
  empty list before rendering.
- `src/cockpit/browser-shell.ts` treats missing operator-inbox messages as an
  empty list before rendering.

## Verification

- `node --test test/cockpit-operator-attention.test.mjs` passed.
- `node --test test/cockpit-browser-shell.test.mjs` passed.
- `node --test test/cockpit-view-model.test.mjs` passed.
- `npm run typecheck` passed.

## Role Boundary

Stage 4 repair touched production browser-shell source only. Test
Writer-owned RED tests, RED evidence, and acceptance mappings were not edited.
