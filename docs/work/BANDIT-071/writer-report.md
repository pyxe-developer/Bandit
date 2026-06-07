# BANDIT-071 Stage 3 Writer Report

role: implementation_writer
model_family: claude
work_item: BANDIT-071
active_gap: BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL
source_stage: Stage 3 Implementation
verdict: pass
report_owner: claude_implementation_writer

## Summary

Stage 3 delivered the smallest source/chore change needed to satisfy the
Codex-authored RED tests for private installability and the repo-local update
notification channel. The work covers four concerns from the Stage 2 RED
evidence and the `stage3-dispatch.md` mission:

1. **Private install runtime fix.** The packed CLI no longer depends on a
   `devDependency`-only `tsx` loader. `tsx` was promoted to a runtime
   dependency and `bin/bandit.mjs` resolves the loader through
   `createRequire(...).resolve("tsx")` instead of a hard-coded
   `node_modules/tsx/dist/loader.mjs` path, so installed consumers run the bin
   without this development checkout's `node_modules`.
2. **Intentional package scoping.** A `package.json` `files` allow-list scopes
   packed contents to `bin`, `src`, `docs/templates`, the private
   install/update policy, the seeded reviewer/smell defaults, and `README.md`.
   `.bandit/events*`, `.bandit/bootstrap-gaps*`, `docs/work/**`, and `test/**`
   are excluded.
3. **Update notification channel.** A new `bandit update-check [--json]`
   command and `src/state/update-channel.ts` helper read optional repo-local
   `.bandit/update-channel.json` metadata, compare a file-based private release
   manifest against the installed version/ref, emit deterministic
   `unconfigured` / `disabled` / `unreachable` / `current` / `update_available`
   status, and write a freshness-bounded, data-minimal
   `.bandit/update-channel-cache.json`. Normal CLI commands emit a concise
   non-blocking stderr alert only from a fresh cached `update_available`
   result, without masking the requested command's output or exit status.
4. **Installed-consumer init completeness.** `bandit init` now seeds canonical
   `docs/templates/*.md` and default reviewer/smell artifacts into a fresh
   consumer repo when (and only when) Bandit runs from an installed package,
   never overwriting files the consumer already has, so `init` → `validate` →
   `update-check` succeed from a packed install.

Distribution policy and template artifacts (
`.bandit/policy/private-install-update-channel.json`,
`docs/templates/private-install-update-channel.md`,
`docs/templates/update-channel.md`) record the selected private channel,
install command shapes, version/ref semantics, update source, non-public
boundary, and explicit out-of-scope publishing behavior.

## Changed Source Surfaces

All edits fall within the `stage3-dispatch.md` Allowed Source Surfaces list.

| Surface | Change | Purpose |
| --- | --- | --- |
| `package.json` | Added `files` allow-list; moved `tsx` from `devDependencies` to `dependencies` | Scope packed contents; make installed CLI runtime self-sufficient |
| `package-lock.json` | Regenerated to reflect `tsx` dependency move | Lockfile consistency |
| `bin/bandit.mjs` | Resolve `tsx` loader via `createRequire().resolve("tsx")` instead of a fixed `node_modules` path; rename `repoRoot` → `packageRoot` | Installed bin execution without the dev checkout's `node_modules` |
| `src/cli.ts` | Register `update-check` command; emit cached update alert before non-`update-check` commands; add command to usage strings | Wire the new command and the non-blocking alert hook |
| `src/commands/update-check.ts` (new) | `updateCheck()` command entry with `--json` and human-readable formatting | CLI surface for manual update checks |
| `src/state/update-channel.ts` (new) | `runUpdateCheck()`, `emitCachedUpdateAlert()`, config/manifest readers, freshness-bounded cache writer | Update-channel state, comparison, cache, and alert logic |
| `src/commands/init.ts` | `seedDistributionDefaults()` seeds templates + default artifacts only for installed packages, never overwriting existing files | Installed-consumer init/validate completeness |
| `src/state/paths.ts` | Added `updateChannel` and `updateChannelCache` paths | Canonical repo-local state paths |
| `.bandit/policy/private-install-update-channel.json` (new) | Distribution policy artifact | Records private channel, semantics, out-of-scope publishing |
| `docs/templates/private-install-update-channel.md` (new) | Policy template | Reviewable starter for the distribution policy |
| `docs/templates/update-channel.md` (new) | Update-channel + manifest + output template | Reviewable starter for update-channel metadata |

## Scope Boundaries Honored

- **No test-surface edits.** The Stage 3 Writer created, edited, deleted, and
  mechanically adjusted zero Test Writer-owned surfaces. `test/**`, fixtures,
  test helpers, and acceptance mappings were read-only inputs.
- **No public publishing.** The package remains `private: true`-compatible;
  only private file/Git/tag installs and `npm pack` were targeted. No paid
  registry, hosted service, automatic self-update, or telemetry was added.
- **No forbidden artifacts touched.** RED/orchestration evidence,
  formation/review/landing/retrospective evidence,
  `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, `STATUS.md`,
  `.bandit/bootstrap-gaps.json`, and `.bandit/events.jsonl` were not edited by
  this Stage 3 implementation work.
- **Data minimization.** Update output and cache carry only status, versions,
  ref, and an explicit update command. None of the forbidden payload keys
  (telemetry, repo contents, workflow state, user activity, package usage,
  model-call metadata, review packets, hidden identifiers) are emitted.

## Verification

| Command | Result |
| --- | --- |
| `node --test test/private-install-update-channel.test.mjs` | PASS — tests 2, pass 2, fail 0 |
| `node --test test/update-channel.test.mjs` | PASS — tests 4, pass 4, fail 0 |
| `npm run typecheck` | PASS — `tsc --noEmit` clean |
| `git diff --check` | PASS — no whitespace/conflict errors |
| `npm pack --dry-run --json` | 164 files; 0 forbidden (`docs/work/**`, `test/**`, `.bandit/events*`, `.bandit/bootstrap-gaps*`); private install/update policy + templates included |

Full RED-to-GREEN transition: the Stage 2 RED evidence recorded `tests 2 / pass
0 / fail 2` and `tests 4 / pass 0 / fail 4`; the same suites now pass entirely.

## Known Limitations

- **Interrupted prior writer run.** The initial Claude implementation process
  exceeded the 15-minute budget and was interrupted after the source changes
  were written but before it produced the Stage 3 final output. The source
  surfaces above were already on disk and verified PASS when this report was
  authored; this report and `implementation-evidence.md` are the deferred final
  output for that completed implementation. No additional source edits were
  made while authoring these two documents.
- **Role-run record.** `docs/role-runs/BANDIT-071/stage3-implementation.json`
  is named in the orchestration plan as Stage 3 evidence but is owned by the
  PM/role-run path, not by this Writer report task; it is not created here.
- **Broader suites not re-run here.** `npm test` and `npm run bandit --
  validate` were not re-executed as part of authoring these documents; the
  focused suites named in the dispatch's minimum-verification block plus
  `typecheck`, `git diff --check`, and `npm pack --dry-run` were run and PASS.

## Next Action

Route to Stage 4 review (CodeRabbit + Local Qwen via MLX adapter, with PM
aggregate disposition) using the current review subject. Risk-classification and
supply-chain-gate artifacts apply because package metadata, runtime
dependencies, and install surfaces changed.
