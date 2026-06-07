# BANDIT-071 Stage 3 Implementation Evidence

role: implementation_writer
model_family: claude
work_item: BANDIT-071
active_gap: BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL
source_stage: Stage 3 Implementation
verdict: pass
evidence_owner: claude_implementation_writer

## Status

`pass` for Stage 3: Implementation. The Codex-authored RED suites now pass on
the delivered source surfaces with a clean typecheck, a clean whitespace/diff
check, and an intentionally scoped package, with zero Test Writer-owned surface
edits by the Stage 3 Writer.

## Files Changed

### Source / chore (allowed Stage 3 surfaces)

- `package.json` — added `files` allow-list (`bin`, `src`, `docs/templates`,
  `.bandit/policy/private-install-update-channel.json`,
  `.bandit/policy/smell-triggers.json`, `.bandit/reviewers/local-qwen.json`,
  `README.md`); moved `tsx` from `devDependencies` to `dependencies`.
- `package-lock.json` — regenerated for the `tsx` dependency move.
- `bin/bandit.mjs` — resolve the `tsx` loader via
  `createRequire(import.meta.url).resolve("tsx")` rather than a hard-coded
  `node_modules/tsx/dist/loader.mjs` path; `repoRoot` renamed `packageRoot`.
- `src/cli.ts` — register `bandit update-check [--json]`; call
  `emitCachedUpdateAlert(process.cwd(), process.stderr)` before any non-
  `update-check` command; add `update-check` to the usage strings.
- `src/commands/update-check.ts` (new) — `updateCheck()` entry point with
  `--json` and deterministic human-readable formatting per status.
- `src/state/update-channel.ts` (new) — `runUpdateCheck()`,
  `emitCachedUpdateAlert()`, config + file-manifest readers, comparison logic,
  and the freshness-bounded `.bandit/update-channel-cache.json` writer.
- `src/commands/init.ts` — `seedDistributionDefaults()` /
  `seedTemplates()` / `copyMissingFile()` seed canonical templates and default
  reviewer/smell artifacts for installed packages only, never overwriting
  existing consumer files.
- `src/state/paths.ts` — added `updateChannel` and `updateChannelCache` paths.
- `.bandit/policy/private-install-update-channel.json` (new) — distribution
  policy artifact.
- `docs/templates/private-install-update-channel.md` (new) — policy template.
- `docs/templates/update-channel.md` (new) — update-channel / manifest / output
  template.

### Stage 3 evidence (this Writer)

- `docs/work/BANDIT-071/writer-report.md`
- `docs/work/BANDIT-071/implementation-evidence.md`

## Acceptance Criteria Mapping

| Criterion (from RED evidence) | Implementation evidence |
| --- | --- |
| Repo-native artifact records selected private channel, install shape, version/ref semantics, update source, non-public boundary, out-of-scope publishing | `.bandit/policy/private-install-update-channel.json` + `docs/templates/private-install-update-channel.md`; packaged and present in `npm pack --dry-run` |
| Installable into a fresh consumer repo; `bandit init` exits without the dev checkout's `node_modules` | `bin/bandit.mjs` resolves `tsx` via `createRequire().resolve`; `tsx` promoted to a runtime dependency; packed-install smoke test passes |
| Package contents intentionally scoped; exclude active work history, tests, repo-local workflow state | `package.json` `files` allow-list; `npm pack --dry-run --json` → 164 files, 0 forbidden entries |
| CLI runtime no longer depends on a devDependency-only `tsx` loader in installed packages | `tsx` moved to `dependencies`; loader resolved at runtime |
| Installed repos run `bandit update-check` for deterministic current / update_available / unconfigured / unreachable / disabled status | `src/commands/update-check.ts` + `runUpdateCheck()` in `src/state/update-channel.ts`; `--json` and human output |
| Normal CLI commands emit a concise non-blocking alert only when configured and a newer release is known; failures do not block or mask exit status | `emitCachedUpdateAlert()` writes to stderr only from a fresh cached `update_available` result; invoked before the requested command runs and never alters its exit status |
| Update checks freshness-bounded and cached | `.bandit/update-channel-cache.json` with `freshness_expires_at`; `isCacheFresh()` gate |
| Update metadata repo-local, reviewable, data-minimal; no telemetry/contents/state/activity to external services | Output/cache carry only status, versions, ref, and an explicit update command; no forbidden payload keys; update source is a local `file` manifest |
| Explicit update command/docs; automatic self-update out of scope | `update_command` (e.g. `npm install -D <private-source>#<ref>`) surfaced in output/cache; no self-mutating updater |
| Preserves CLI authority, repo-native canonical artifacts, supply-chain/risk/operator boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation | Claude-authored Stage 3; no test/fixture/RED/evidence edits; policy marks update metadata non-canonical and advisory only |

## Verification Run

```sh
node --test test/private-install-update-channel.test.mjs   # tests 2, pass 2, fail 0
node --test test/update-channel.test.mjs                   # tests 4, pass 4, fail 0
npm run typecheck                                          # tsc --noEmit clean
git diff --check                                           # no errors
npm pack --dry-run --json                                  # 164 files, 0 forbidden
```

RED → GREEN: Stage 2 recorded `pass 0 / fail 2` and `pass 0 / fail 4` for these
two suites; both now pass in full.

## Skipped / Deferred Checks

- `npm test` (full suite) and `npm run bandit -- validate` were not re-executed
  while authoring this evidence; the dispatch's minimum-verification block
  (the two focused suites + `typecheck`) plus `git diff --check` and
  `npm pack --dry-run` were run and PASS. The PM previously recorded the focused
  suites and typecheck as PASS.
- `docs/role-runs/BANDIT-071/stage3-implementation.json` was not authored here;
  it belongs to the PM/role-run path, not this Writer evidence task.

## Clean-Code Self-Check

- **Single responsibility.** `update-check.ts` is the thin CLI adapter;
  `update-channel.ts` owns state, comparison, cache, and alert logic; init
  seeding lives behind named helpers.
- **Smallest viable change.** Reused existing `getBanditPaths`,
  `appendLifecycleEvent`, and `pathExists`/`isMissingPathError` patterns rather
  than introducing new infrastructure; no build system added.
- **Fail-safe, non-blocking.** Missing/malformed config, missing manifest, and
  stale cache degrade to `unconfigured` / `disabled` / `unreachable` or silent
  no-alert; the alert hook never throws into the requested command path.
- **Data minimization by construction.** The cache writer and result types
  enumerate only the permitted fields; no forbidden payload key is reachable.
- **No overwrites.** `copyMissingFile()` resolves source/destination equality
  and an existence guard before copying, and seeding is gated to installed
  packages via `isInstalledPackage()`.
- **Test ownership.** Zero create/edit/delete/regenerate/format/mechanical
  changes to Test Writer-owned surfaces by the Stage 3 Writer.

## Known Limitation

The initial Claude Stage 3 process exceeded the 15-minute budget and was
interrupted after writing the source changes but before producing this final
output. The source surfaces listed above were already committed to the working
tree and independently re-verified PASS during authoring of this evidence; no
source edits were made while writing `writer-report.md` and this file.

## Confirmation

The Stage 3 Implementation Writer made **zero** edits to any Test Writer-owned
surface (tests, fixtures, helpers, RED evidence, install-smoke evidence,
package allow-list acceptance mappings, update-channel acceptance mappings) and
zero edits to forbidden formation/review/landing/retrospective/roadmap/status/
events/bootstrap-gap surfaces.
