---
work_item: BANDIT-057
stage: Stage 4 repair
reported_at: 2026-06-01T18:44:49Z
---

# BANDIT-057 Stage 4 Aggregate Review Repair Writer Report

## Repair Summary

A single change was made to `src/cli.ts`: the bare invocation error message (reached when no command is supplied) was updated to prepend a `role-required` refusal line before the existing usage block. This restores the wording matched by `/role[- ]required/i` that the RED test `bare workflow invocation fails closed with role-required refusal before context hydration` requires, while keeping the explicit role entry points, the supported legacy command list, and the fail-closed `process.exitCode = 1` path intact.

## Change Made

**File:** `src/cli.ts`

**Old error string** (line 46):

```
"Usage: bandit <command>\n\n" +
```

**New error string** (lines 46-47):

```
"role-required: specify a role entry point to invoke the workflow\n\n" +
  "Usage: bandit <command>\n\n" +
```

The only edit was inserting `"role-required: specify a role entry point to invoke the workflow\n\n" +` as the first line of the `console.error(...)` call in the `if (!command)` branch. All other content - role entry point lines for `repo-pm` and `work-item-pm`, the legacy command list, and the `process.exitCode = 1` assignment - was left unchanged.

## Verification Results

**`node --test test/role-entrypoints-formation.test.mjs`** - exit code 0, PASSED

All 7 tests passed with no failures, cancellations, or skipped tests. Total duration was approximately 2.69 seconds.

```
ok bootstrap gap validation accepts replaced disposition with replacement evidence (613.235625ms)
ok bare workflow invocation fails closed with role-required refusal before context hydration (353.846291ms)
ok repo-pm create-work-item preserves work-item creation safety and artifacts (336.860042ms)
ok repo-pm approve-formation refuses malformed formation before review artifacts (332.21775ms)
ok repo-pm approve-formation requires Qwen, CodeRabbit, and aggregate formation review artifacts (333.167583ms)
ok coordination validate accepts formation_approved between brief and RED evidence (343.357333ms)
ok work-item-pm start refuses work before formation approval (330.513416ms)
info tests 7
info suites 0
info pass 7
info fail 0
info cancelled 0
info skipped 0
info todo 0
info duration_ms 2691.220083
```

---

**`npm run typecheck`** - exit code 0, PASSED

TypeScript type checking passed with no errors. The `tsc --noEmit` command completed successfully.

```
> bandit-workflow@0.0.0 typecheck
> tsc --noEmit
```

---

**`npm run bandit -- validate`** - exit code 0, PASSED

Bandit reported "Bandit state is valid." with no errors or warnings.

```
> bandit-workflow@0.0.0 bandit
> node ./bin/bandit.mjs validate

Bandit state is valid.
```

---

**`git diff --check`** - exit code 0, PASSED

No whitespace errors were found in the working tree. The command exited cleanly with no output.
