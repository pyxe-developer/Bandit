# BANDIT-099 Stage 3 Repair Dispatch

contract_version: 1
work_item: BANDIT-099
stage: Stage 3 Implementation Repair
writer: Claude implementation writer
model_family_required: non-Codex
timestamp: 2026-06-12T11:35:00Z

## Role

You are the Stage 3 Implementation Writer for a repair pass. Codex authored the
RED tests, so you own source repair. Do not edit tests, RED evidence,
coordination logs, roadmap/status files, or PM-owned evidence except for your
writer report/evidence addendum if needed.

## Failure To Repair

PM-side focused verification produced one failing test:

```sh
node --test test/init.test.mjs
```

Failure:

```text
init creates model-agnostic starter governance artifacts
The input did not match the regular expression /configured (agents|providers|roles)/i
```

The generated `AGENTS.md` starter currently contains:

```text
The Work Item PM role is held by your operator-selected PM agent. Configured
agents and providers carry out routine technical routing decisions...
```

Because `Configured` and `agents` are split by a newline, the assertion does not
match. Repair the starter governance text so a generated starter artifact
contains one exact same-line phrase matching `/configured (agents|providers|roles)/i`,
for example `Configured agents and providers`.

## Constraints

- Edit only `src/commands/init.ts` unless you need to add a short repair note to
  `docs/work/BANDIT-099/writer-report.md` or
  `docs/work/BANDIT-099/implementation-evidence.md`.
- Do not edit any file under `test/`.
- Do not edit `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, `STATUS.md`, or
  `docs/work/BANDIT-099/coordination-log.jsonl`.
- Preserve the model-agnostic role language and the scope of BANDIT-099.

## Verification Requested

If your environment allows command execution, run:

```sh
node --test test/init.test.mjs
```

If command execution is blocked by approval mode again, record that honestly and
leave PM to rerun the test.
