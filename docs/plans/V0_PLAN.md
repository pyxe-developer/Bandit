# V0 Plan

## Objective

Build the smallest Bandit that proves the workflow improvement engine can run real agentic development work safely and learn from itself.

## Slice 1: Repo-Native State And CLI Skeleton

Deliver:

- `bandit` CLI entrypoint.
- `.bandit/config.toml`.
- Work item ID prefix support.
- Event JSONL writer.
- `doctor`, `init`, `validate`, `list`, and `show` commands.
- Basic schema validation.

Success:

- A repo can be initialized and validated.
- All canonical state is repo-native.

## Slice 2: PRD, Slice, And Chore Artifacts

Deliver:

- Feature PRD template.
- Slice template.
- Chore template.
- PRD-to-work decomposition command or draft command.
- Chore origin metadata, including retrospective-derived fields.

Success:

- A PRD can produce trackable slices and chores.
- Chores can record origin, hypothesis, metric, baseline, and evaluation window.

## Slice 3: Manager-Owned Routing And Smell Catalog

Deliver:

- Smell Trigger Catalog.
- Routing decision artifact.
- Escalation policy.
- CLI command to explain routing decisions.

Success:

- Codex PM can record why a workflow, skill, agent, or reviewer profile was selected.
- Operator is not asked routine technical routing questions.

## Slice 4: Pre-Landing Review Loop

Deliver:

- Landing Verdict artifact.
- CodeRabbit pre-landing state capture.
- Local Qwen adversarial review profile.
- Escalation placeholder profile.
- Stale review/source-drift checks.

Success:

- PRs cannot be marked safe-to-land without tests, CodeRabbit, and adversarial review evidence.

## Slice 5: UAT Approval And Auto-Landing Policy

Deliver:

- CLI-owned UAT approval artifact.
- Stale UAT detection after code changes.
- Auto-landing eligibility policy for chores and UAT-approved feature slices.

Success:

- Feature PRs with green code gates but missing/stale UAT are blocked.

## Slice 6: Retrospective And Improvement Engine

Deliver:

- Retrospective artifact.
- Retrospective-derived chore generation.
- Improvement metrics ledger.
- Evaluation command for due improvement chores.
- Outcomes: keep, revise, revert, double_down.

Success:

- Lessons become tagged chores.
- Bandit can show which workflow changes are pending, effective, ineffective, reverted, or worth doubling down on.

## Slice 7: Lean Workflow Cockpit

Deliver:

- Minimal web app reading repo/index state.
- Views: PRDs, slices, chores, landing verdicts, UAT status, improvement health.
- Buttons invoke approved CLI commands.

Success:

- Operator can see status and trigger approved actions without the cockpit owning canonical state.

## Chore Track

Run in parallel when safe:

- Set up local Qwen runtime.
- Evaluate CodeRabbit CLI integration.
- Draft reviewer prompts.
- Define JSON schemas.
- Define metric catalog.
- Port selected sourmash lessons into Bandit policy.

## V0 Exit Criteria

- A small feature can move PRD -> slice -> PR -> review gates -> UAT -> landing -> retrospective -> improvement chore.
- A workflow improvement can be evaluated and marked keep/revise/revert/double_down.
- Operator is not asked to make routine code-safety decisions.
