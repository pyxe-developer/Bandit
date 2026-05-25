# BANDIT-018 Reviewer Model Comparison

comparison_time_utc: 2026-05-25T15:27:31Z
work_item: BANDIT-018
comparison_packet_source_head: 1f65ec047371c861134b04d6bf4035d06c532d2b
implementation_source_head: 211b3c4201e905050c196b7cc729341db8e2089d
diff_range: 1221752..211b3c4
operator_input_status: provided

## Purpose

The operator approved using the Sourmash-style `claude -p` headless path for
Sonnet and Opus and asked Codex PM to compare Qwen 3.6, Sonnet 4.6, and Opus
4.7 side by side before choosing the escalated reviewer route for `BANDIT-018`.

All three reviewers received the same review packet: `AGENTS.md`,
`CLEAN_CODE.md`, `docs/verification/STAGE_RUBRICS.md`,
`docs/work/BANDIT-018/brief.md`, RED evidence, implementation evidence, and
the implementation diff from `1221752` to `211b3c4`.

## Runs

| Reviewer | Invocation | Result | Cost/Latency Evidence |
|---|---|---|---|
| Qwen 3.6 | `node bin/omlx-chat-completions.mjs` with the shared packet | `non_blocking` | Local oMLX run completed in about 68 seconds; no paid-provider cost. |
| Sonnet 4.6 | `claude -p --model claude-sonnet-4-6 --effort high --output-format json --tools "" --disable-slash-commands --strict-mcp-config` | `blocker` | Claude reported 235966 ms and `$0.32836155`. |
| Opus 4.7 | `claude -p --model claude-opus-4-7 --effort xhigh --output-format json --tools "" --disable-slash-commands --strict-mcp-config` | `blocker` | Claude reported 103599 ms and `$0.331385`. |

`claude --bare` was tested first to reduce unrelated context cost, but it could
not use the local subscription/keychain auth path and returned `Not logged in`.
The successful Claude runs used tools disabled and an empty strict MCP config.

## Findings By Reviewer

### Qwen 3.6

Qwen accepted the implementation behavior and surfaced only non-blocking
concerns:

- Stage 4, Stage 5, and Stage 6 closeout remain pending.
- CLI failure paths may leak stack traces without a standard top-level error
  handler.
- `runEscalatedReview` mixes routing, fixture parsing, state writing, and drift
  checking.
- Strict profile-ID equality in `land-check` could become brittle if profile
  aliases are introduced.

Codex PM disposition: useful baseline review, but insufficient as the sole
escalated reviewer for this slice because it missed the acceptance-criteria
coverage blocker found independently by both Claude reviewers.

### Sonnet 4.6

Sonnet returned a blocker verdict:

- Valid blocker: `BANDIT-018` acceptance criterion 10 required focused coverage
  for configured pass evidence, reviewer blockers, stale source heads, missing
  credentials/setup, unavailable or timed-out providers, malformed output, and
  `land-check` integration. The implementation evidence claims AC10 with only
  three focused tests and does not record bootstrap verification gaps for the
  missing scenarios.
- Dispositioned as non-blocking/partly false: Sonnet also claimed a stale
  fixture-pass artifact can fail open because `writeEscalatedReview` happens
  before the stale-source check. The write-before-throw behavior is undesirable
  evidence hygiene, but `land-check` does check `source_drift_status` and
  independently evaluates escalated-review source freshness, so Codex PM does
  not accept it as a proven fail-open blocker.
- Non-blocking concerns: policy wording around `supported_providers`,
  function decomposition, blocked-artifact drift wording, and paid-profile
  approval clarity.

### Opus 4.7

Opus returned a blocker verdict:

- Valid blocker: the same AC10 test-coverage/spec-alignment gap as Sonnet.
  Opus framed this as implementation evidence redefining AC10 to match the
  three tests that exist.
- Valid non-blocking concern: `land-check` source freshness for escalated
  review should stay mechanically demonstrated in tests; the current code
  appears to have stale-evidence checks, but the BANDIT-018 tests do not prove
  the path.
- Non-blocking concerns: committed paid-profile vendor choice before durable
  approval record, ignored profile `contract_version`, malformed markdown in
  the implementation-evidence stage table, and always-current drift wording in
  blocked escalated-review artifacts.

## Codex PM Call

Use Qwen 3.6 as the always-on baseline reviewer, but do not treat it as on par
with Sonnet 4.6 or Opus 4.7 for high-risk escalated review yet. In this
side-by-side run, Qwen missed the material AC10 blocker that both Claude
reviewers found.

Use Opus 4.7 as the default escalated reviewer for policy-triggered high-risk
Bandit review until more data says otherwise. It was faster than Sonnet on this
packet, cost was effectively comparable in this run, and it separated the real
blocker from a stale-evidence concern more accurately. Sonnet 4.6 remains a
reasonable fallback or second opinion, but it over-escalated one issue into a
fail-open blocker that repo code did not support.

`BANDIT-018` next state is `needs-repair`: add or explicitly disposition the
missing AC10 tests, then rerun the review/landing gate path.

## AC10 Repair-Head Refresh

refresh_time_utc: 2026-05-25T16:45:00Z
repair_source_head: 53c7cdb470604191f0764c17409e828ee2c7aa39
operator_input_status: provided

After the AC10 repair, Codex PM refreshed Stage 4 review evidence at
`53c7cdb470604191f0764c17409e828ee2c7aa39`.

| Reviewer | Invocation | Result | Cost/Latency Evidence |
|---|---|---|---|
| Qwen 3.6 | `npm run bandit -- qwen-review BANDIT-018` | `non_blocking` | Local oMLX run completed through the repo-native qwen-review command; no paid-provider cost. |
| Opus 4.7 | `claude -p --model claude-opus-4-7 --effort xhigh --output-format json --json-schema ... --tools "" --disable-slash-commands --strict-mcp-config --max-budget-usd 0.50 --no-session-persistence` | `non_blocking` | Claude reported 84333 ms and `$0.47568875`. |

### Repair-Head Findings

- Opus 4.7 accepted the AC10 repair: the prior AC10 coverage/spec-alignment
  blocker is resolved by the added focused tests and current verification.
- Qwen 3.6 and Opus 4.7 both left non-blocking clean-code/evidence hygiene
  findings around unreachable fixture fallback code, routing-decision null
  guard clarity, test ID traceability, and write-before-throw evidence hygiene.
- Local Qwen also reported that aggregate review evidence was stale. This
  refresh updates `docs/work/BANDIT-018/review-evidence.md` to current-head
  Stage 4 state.

Codex PM disposition: Stage 4 is no longer blocked on AC10 coverage, but it is
not ready for landing verdict. The next step is to repair or explicitly
disposition the non-blocking Stage 4 findings and align the escalated-review
evidence/routing story before creating landing verdict or landing action
evidence.
