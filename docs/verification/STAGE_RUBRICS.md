# Stage Rubrics

## Purpose

Bandit verification is stage-based. Each stage has a rubric that Codex PM, specialized verifiers, and CodeRabbit can use to decide whether work may proceed.

The goal is not to create ceremony. The goal is to make verification repeatable enough that agents can enforce it.

## Verdict Values

Use these verdicts consistently:

- `pass`: stage satisfies the rubric.
- `blocker`: stage cannot proceed or land until fixed.
- `non_blocking`: real issue, but safe to proceed with a tagged follow-up or improvement chore.
- `not_applicable`: stage does not apply and the reason is recorded.
- `bootstrap_gap`: final Bandit gate does not exist yet; replacement evidence is recorded honestly.

## Stage 0: Context Readiness

**Objective:** Anyone can answer where the project is and what is next.

**Required evidence:**

- `docs/roadmap/CURRENT_CONTEXT.md` names current phase, active work, next action, blockers, and bootstrap gaps.
- `docs/roadmap/ROADMAP.md` maps the work to a phase.
- The next step is narrow enough to execute.
- If a prior slice just completed, landing action evidence exists before the next slice is active.

**Blockers:**

- Current phase or next action is unclear.
- Active work item cannot be identified.
- Context must be reconstructed from chat.
- Implementation starts before context is repaired.
- A new slice is active while the previous slice has only a safe-to-land verdict and no commit, merge, or landing-action evidence.

**Verifier focus:**

- Check whether the repo itself answers "what is next?"
- Reject stale current-context files when the change clearly moved the project forward.
- Confirm the previous slice actually landed before accepting a new active slice.

**CodeRabbit focus:**

- On roadmap/current-context changes, request changes if status and next action conflict.
- Request changes if implementation files change but no current context or work-item evidence identifies the active work.

## Stage 1: Work-Item Brief And Spec

**Objective:** The work has an explicit contract before implementation starts.

**Required evidence:**

- Goal.
- Scope.
- Out of scope.
- Acceptance criteria.
- Test plan.
- `CLEAN_CODE.md` read evidence.
- Bootstrap gaps.
- Expected files.
- Implementation order.
- Relevant smell triggers and escalation plan.

**Blockers:**

- Acceptance criteria are vague or not verifiable.
- Scope allows unrelated refactors.
- `CLEAN_CODE.md` was not read.
- Missing gates are not recorded as bootstrap gaps.
- The brief asks the operator to make technical routing decisions Codex PM should own.

**Verifier focus:**

- Check if the spec is specific enough to drive TDD.
- Check if clean-code and rubric compliance can be evaluated from the brief.

**CodeRabbit focus:**

- On `docs/work/**/brief.md`, request changes if acceptance criteria are unverifiable or bootstrap gaps are missing.
- Request changes if the brief omits clean-code read evidence.

## Stage 2: Test Design And RED Evidence

**Objective:** Tests express the spec before production implementation.

**Required evidence:**

- Tests or explicit bootstrap verification plan.
- RED evidence where feasible.
- Mapping from tests to acceptance criteria.
- Clear distinction between Test Writer-owned tests and Writer-editable tests.

**Blockers:**

- Production implementation starts without tests or a recorded reason.
- Tests assert implementation details instead of behavior.
- Tests weaken or redefine the spec.
- Test ownership is unclear.

**Verifier focus:**

- Confirm tests would fail against missing behavior.
- Confirm tests cover important refusal paths and state transitions.

**CodeRabbit focus:**

- On tests, request changes if assertions are vague, brittle, or disconnected from acceptance criteria.
- Request changes if production code changes alter Test Writer-owned assertions without an explicit Test Change Request or equivalent approval.

## Stage 3: Implementation Clean-Code Rubric

**Objective:** Implementation satisfies the spec with a small, understandable, maintainable diff.

**Required evidence:**

- Passing focused tests.
- Code path mapped to acceptance criteria.
- No unexplained source-of-truth changes.
- Clean-code self-check against `CLEAN_CODE.md`.

**Blockers:**

- Code redefines the spec.
- Hidden state authority moves into UI, cache, helper, or generated file.
- Large multi-responsibility functions or mixed orchestration phases.
- Flag arguments or generic callbacks that hide distinct behavior.
- Parser/writer mismatch.
- Weak refusal or fail-open behavior.
- Unrelated refactors.
- Important behavior lacks tests or bootstrap gap evidence.

**Verifier focus:**

- Apply `CLEAN_CODE.md`.
- Check source-of-truth boundaries.
- Check state transitions and refusal paths.
- Check whether a future agent can safely change the code.

**CodeRabbit focus:**

- Request changes for clean-code blockers.
- Request changes for hidden side effects, stale evidence logic, schema drift, unsafe path handling, weak validation, or oversized orchestration.

## Stage 4: Review And Cross-Model Gates

**Objective:** Independent review gates run before landing.

**Required evidence:**

- CodeRabbit state and disposition.
- Local Qwen adversarial review state.
- Escalated reviewer evidence when smell triggers require it.
- PM disposition of accepted/rejected/waived findings.
- Cross-model tension entries for substantive disagreements.

**Blockers:**

- Required review unavailable without bootstrap gap.
- CodeRabbit request-changes or unresolved actionable findings.
- Qwen result failed, inconclusive, or unavailable without escalation or recorded bootstrap gap.
- PM accepts a reviewer disagreement without rationale.
- Review evidence is stale after source changes.

**Verifier focus:**

- Confirm review evidence applies to current source.
- Confirm rejected findings have concrete rationale.
- Confirm tension is logged when models disagree materially.

**CodeRabbit focus:**

- Request changes if PR evidence claims CodeRabbit is clean while actionable comments remain unresolved.
- Request changes if stale review is treated as current.
- Request changes if cross-model tension is ignored.

## Stage 5: Landing And UAT

**Objective:** Landing is evidence-driven and agent-owned under policy.

**Required evidence:**

- Landing Verdict.
- Landing action evidence, such as commit SHA, merge SHA, or recorded blocked/needs-repair state.
- Tests/CI current at landing head.
- Required review gates current at landing head.
- UAT approval for feature slices.
- Stale UAT/source-drift check.
- Bootstrap gaps, if any.

**Blockers:**

- Feature slice lacks Approved UAT.
- Any branch code change after UAT for v0.
- Landing Verdict asks the operator to judge routine code-safety warnings.
- Tests or review evidence are stale.
- Missing required gate without bootstrap gap.
- The next slice begins before landing action evidence exists for the current slice.

**Verifier focus:**

- Confirm the Landing Verdict is a decision, not a warning dump.
- Confirm product acceptance and code-safety are separated.
- Confirm `safe-to-land` was followed by an actual landing action before closeout.

**CodeRabbit focus:**

- Request changes if landing evidence omits UAT status for feature work.
- Request changes if landing evidence does not distinguish stale aggregate review status from current-head review status.

## Stage 6: Retrospective And Improvement Capture

**Objective:** The workflow learns from the slice.

**Required evidence:**

- Retrospective.
- Lessons classified as improvement chore, cross-model tension entry, smell catalog update, or explicit no-action decision.
- Improvement chores include origin, source artifacts, hypothesis, metric, baseline, evaluation window, and outcome status.
- Current context updated if the next action changed.

**Blockers:**

- Actionable lesson appears only in prose.
- Retrospective-derived chore lacks metric or evaluation window.
- Cross-model tension is not logged.
- Current context remains stale after completion.

**Verifier focus:**

- Check that every material lesson has a durable disposition.
- Check that improvement chores are evaluable, not vague reminders.

**CodeRabbit focus:**

- On retrospective and improvement files, request changes if actionable lessons lack tagged follow-up artifacts or no-action rationale.
- Request changes if metrics/baselines/evaluation windows are missing.

## Stage 7: Improvement Evaluation

**Objective:** Bandit judges whether workflow changes worked.

**Required evidence:**

- Due improvement chore.
- Metric observation.
- Baseline or comparison point.
- Outcome: `effective`, `ineffective`, `inconclusive`, `reverted`, or `double_down`.
- Routing or policy update when outcome requires it.

**Blockers:**

- Improvement chore passes its evaluation window without evaluation.
- Outcome is recorded without evidence.
- Bad workflow decision remains active after ineffective/reverted outcome.
- Good workflow decision is not promoted or doubled down when evidence supports it.

**Verifier focus:**

- Check whether outcome follows from evidence.
- Check whether policy/routing changed when the outcome demanded it.

**CodeRabbit focus:**

- Request changes if an improvement decision lacks metric evidence.
- Request changes if a reverted decision remains referenced as active policy.

## Universal Rubric Questions

Every verifier should ask:

1. Is the current stage clear?
2. Is the evidence current?
3. Is the source of truth explicit?
4. Are missing gates honestly recorded?
5. Are role boundaries preserved?
6. Are decisions evaluable later?
7. Did we reduce future ambiguity?
