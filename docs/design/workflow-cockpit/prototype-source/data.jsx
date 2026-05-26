// data.jsx — Bandit cockpit view-model fixtures
//
// VIEW-MODEL BOUNDARY (for the future implementation agent):
//
//   This file is intentionally a flat data fixture, not a state machine.
//   In production it represents what the `bandit cockpit status --json`
//   substrate (BANDIT-031 + BANDIT-032) returns AFTER a view-model module
//   has translated raw status into:
//
//     1. attentionCategory  — one of: operator | blocked | active |
//                              landing | improve | queue
//     2. confidence         — one of: source-linked | derived | stale |
//                              missing | blocked-by-operator-input | cli
//     3. nextAction         — { command, eligibility, blockedReason? }
//     4. evidence[]         — { kind, state, path, sha?, timestamp? }
//
//   The UI here renders these fields. It NEVER decides them. If the CLI
//   payload is missing a field, the UI must render the missing/fail-closed
//   state — it must not synthesize a value.
//
//   The numbers and titles below were drawn from real BANDIT repo state
//   (CURRENT_CONTEXT.md, ROADMAP.md as of 2026-05-26). Counterfactual
//   states — stale review hash, fail-closed contradictory evidence — were
//   added so the prototype can demonstrate every confidence cue.
//

const COCKPIT_DATA = {

  // ===================================================================
  // Top-of-cockpit summary — "where are we and what is next?"
  //
  //   Derived fields. The CLI is the source.
  // ===================================================================
  context: {
    phase: "Phase 8 — Workflow Cockpit",
    phaseSub: "Design review recorded; next visual UI work item ready to create.",
    repo: "github.com/pyxe-developer/Bandit",
    branch: "main",
    head: "97bb34c9926713",
    headFull: "97bb34c9926713b0228c9971a4ef44fd08fe2af722b15fec81ee3c2e22951861",
    headAge: "2h ago",
    lastMilestone: "BANDIT-032 — Cockpit Status Coverage Hardening — closed",
    source: ".bandit/state/ + docs/roadmap/CURRENT_CONTEXT.md"
  },

  // ===================================================================
  // Active Work Items (referenced from multiple screens)
  //
  //   - BANDIT-033 is the first visual UI work item implied by this prototype.
  //     Its design direction is now recorded; the fixture keeps it visible so
  //     the cockpit can show how a ready next slice is routed.
  //   - BANDIT-034 is a counterfactual chore in Stage 4 with a stale
  //     review-subject-hash, demonstrating the stale state.
  //   - BANDIT-035 is a counterfactual feature slice in Landing with
  //     UAT missing — demonstrating dual-track readiness.
  // ===================================================================
  items: {

    "BANDIT-033": {
      id: "BANDIT-033",
      title: "Attention-First Cockpit Web Surface",
      type: "slice",
      phase: "Phase 8",
      stage: "Stage 1 — Brief",
      attention: "active",
      summary: "First web cockpit slice built on the cockpit status substrate.",
      nextAction: {
        command: "bandit work-item create docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md",
        eligibility: "available",
        blockedReason: null,
        ownerRole: "Codex PM"
      },
      assignedPm: "—",
      created: "2026-05-25",
      sourcePaths: [
        "docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md",
        "docs/design/workflow-cockpit-boundary.md",
        "docs/roadmap/CURRENT_CONTEXT.md"
      ],
      gates: [
        { stage: "S0", name: "Brief",       state: "pass",     source: "docs/work/BANDIT-033/brief.md (pending)", note: "PRD-003 imported" },
        { stage: "S2", name: "RED",         state: "missing",  source: "—", note: "Create work item first" },
        { stage: "S3", name: "Impl",        state: "missing",  source: "—" },
        { stage: "S4", name: "Review",      state: "missing",  source: "—" },
        { stage: "S5", name: "Landing",     state: "missing",  source: "—" },
        { stage: "S6", name: "Retro",       state: "missing",  source: "—" }
      ],
      uat: { state: "n/a", env: "—", sha: "—", note: "Feature slice — UAT required before auto-land. Not yet relevant." },
      auto: { eligible: false, reasons: ["No landing verdict", "No UAT artifact"] }
    },

    "BANDIT-034": {
      id: "BANDIT-034",
      title: "Stage 4 Review Subject Hash Refresh",
      type: "chore",
      phase: "Phase 8",
      stage: "Stage 4 — Review",
      attention: "blocked",
      summary: "Review evidence is STALE — implementation source moved after Local Qwen evidence was recorded.",
      nextAction: {
        command: "bandit qwen-review BANDIT-034",
        eligibility: "available",
        blockedReason: null,
        ownerRole: "Codex PM"
      },
      assignedPm: "Codex PM",
      created: "2026-05-26",
      sourcePaths: [
        "docs/work/BANDIT-034/brief.md",
        "docs/work/BANDIT-034/review-evidence.md",
        "docs/work/BANDIT-034/local-qwen-review.md"
      ],
      gates: [
        { stage: "S0", name: "Brief",       state: "pass",     source: "docs/work/BANDIT-034/brief.md" },
        { stage: "S2", name: "RED",         state: "pass",     source: "docs/work/BANDIT-034/red-evidence.md" },
        { stage: "S3", name: "Impl",        state: "pass",     source: "docs/work/BANDIT-034/implementation-evidence.md" },
        { stage: "S4", name: "Review",      state: "stale",    source: "docs/work/BANDIT-034/review-evidence.md", note: "subject hash drift" },
        { stage: "S5", name: "Landing",     state: "blocked",  source: "—", note: "Stage 4 not current" },
        { stage: "S6", name: "Retro",       state: "missing",  source: "—" }
      ],
      uat: { state: "n/a", note: "Chore — no UAT" },
      auto: { eligible: false, reasons: ["Stage 4 review evidence is stale"] },
      staleness: {
        recordedHash: "a06a265a7319fd5f6b39440c20",
        currentHash:  "97bb34c9926713b0228c9971a4",
        kind: "review_subject_hash drift",
        sourcePath: "docs/work/BANDIT-034/review-evidence.md"
      }
    },

    "BANDIT-035": {
      id: "BANDIT-035",
      title: "Coordination Log JSON Schema Export",
      type: "slice",
      phase: "Phase 6",
      stage: "Stage 5 — Landing",
      attention: "landing",
      summary: "Code-safe. Awaiting operator UAT in named environment.",
      nextAction: {
        command: "bandit uat record BANDIT-035 --env staging --sha 97bb34c",
        eligibility: "operator-only",
        blockedReason: "Operator acceptance required. UI cannot record UAT.",
        ownerRole: "Operator"
      },
      assignedPm: "Codex PM",
      created: "2026-05-22",
      sourcePaths: [
        "docs/work/BANDIT-035/brief.md",
        "docs/work/BANDIT-035/landing-verdict.md",
        "docs/work/BANDIT-035/review-evidence.md"
      ],
      gates: [
        { stage: "S0", name: "Brief",       state: "pass",  source: "docs/work/BANDIT-035/brief.md" },
        { stage: "S2", name: "RED",         state: "pass",  source: "docs/work/BANDIT-035/red-evidence.md" },
        { stage: "S3", name: "Impl",        state: "pass",  source: "docs/work/BANDIT-035/implementation-evidence.md" },
        { stage: "S4", name: "Review",      state: "pass",  source: "docs/work/BANDIT-035/review-evidence.md", note: "subject hash current" },
        { stage: "S5", name: "Landing",     state: "pass",  source: "docs/work/BANDIT-035/landing-verdict.md", note: "safe-to-land" },
        { stage: "S6", name: "Retro",       state: "missing", source: "—" }
      ],
      uat: { state: "missing", env: "staging", sha: "97bb34c", note: "Feature slice — UAT artifact required before auto-land." },
      auto: { eligible: false, reasons: ["UAT missing for feature slice"] }
    }
  },

  // ===================================================================
  // Attention bands — the home screen's primary IA.
  //
  //   Order is fixed (per Implementation Decisions):
  //     operator → blocked → active → landing → improve → queue
  //
  //   The UI MUST NOT reorder by recency or alpha.
  // ===================================================================
  bands: [
    {
      key: "operator",
      label: "Ready for next work item",
      kicker: "01",
      count: 1,
      meta: "Action: create scoped slice",
      rows: [
        {
          id: "BANDIT-033",
          title: "Attention-First Cockpit Web Surface",
          type: "slice",
          chips: [
            { state: "cli",  text: "PM action" },
            { state: "pass", text: "design review recorded" }
          ],
          sub: "Create one visual UI work item from PRD-003, design review, design system, and prototype source.",
          ownerRole: "Codex PM",
          source: "docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md"
        }
      ]
    },
    {
      key: "blocked",
      label: "Blocked or stale",
      kicker: "02",
      count: 2,
      meta: "Action: refresh evidence or unblock",
      rows: [
        {
          id: "BANDIT-034",
          title: "Stage 4 Review Subject Hash Refresh",
          type: "chore",
          chips: [
            { state: "stale", text: "review_subject_hash drift" },
            { state: "cli",   text: "rerun gate" }
          ],
          sub: "Implementation moved after Local Qwen evidence. Recorded hash a06a26… vs. current 97bb34….",
          ownerRole: "Codex PM",
          source: "docs/work/BANDIT-034/review-evidence.md"
        },
        {
          id: "BANDIT-015",
          title: "Live CodeRabbit Pre-Landing Loop",
          type: "slice",
          historical: true,
          chips: [
            { state: "fail", text: "contradictory" },
            { state: "info", text: "auto-routed" }
          ],
          sub: "Historical: Local Qwen returned 5 consecutive blocker verdicts on terminal evidence. Routed to BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS.",
          ownerRole: "Codex PM",
          source: "docs/work/BANDIT-015/qwen-evidence-head-disposition.md"
        }
      ]
    },
    {
      key: "active",
      label: "Active work",
      kicker: "03",
      count: 1,
      meta: "Action: continue current stage",
      rows: [
        {
          id: "BANDIT-034",
          title: "Stage 4 Review Subject Hash Refresh",
          type: "chore",
          chips: [
            { state: "progress", text: "Stage 4" },
            { state: "cli",      text: "bandit qwen-review" }
          ],
          sub: "Active stage: 4 (Review). Next: rerun Local Qwen at current review-subject-hash.",
          ownerRole: "Codex PM",
          source: "docs/work/BANDIT-034/brief.md"
        }
      ]
    },
    {
      key: "landing",
      label: "Landing readiness",
      kicker: "04",
      count: 1,
      meta: "Action: record UAT (operator)",
      rows: [
        {
          id: "BANDIT-035",
          title: "Coordination Log JSON Schema Export",
          type: "slice",
          chips: [
            { state: "pass",    text: "code-safe" },
            { state: "missing", text: "uat missing" }
          ],
          sub: "Stage 5 verdict safe-to-land. Auto-land blocked: feature slice requires UAT artifact for env=staging at sha=97bb34c.",
          ownerRole: "Operator",
          source: "docs/work/BANDIT-035/landing-verdict.md"
        }
      ]
    },
    {
      key: "improve",
      label: "Improvement health",
      kicker: "05",
      count: 3,
      meta: "1 due · 2 kept",
      rows: [
        {
          id: "BANDIT-IMP-001",
          title: "Non-blocking review-finding routing",
          type: "improve",
          chips: [
            { state: "pass", text: "evaluated · keep" }
          ],
          sub: "Source: BANDIT-023 retro. Evaluator: BANDIT-030. Outcome window covered 4 Stage 4 cycles.",
          ownerRole: "—",
          source: "docs/work/BANDIT-030/improvement-evaluation.md"
        },
        {
          id: "BANDIT-IMP-002",
          title: "Pre-PR CodeRabbit CLI review",
          type: "improve",
          chips: [
            { state: "pass", text: "evaluated · keep" }
          ],
          sub: "Source: BANDIT-027. Eliminated PR-context dependency for Stage 4 evidence.",
          ownerRole: "—",
          source: "docs/work/BANDIT-027/retrospective.md"
        },
        {
          id: "BANDIT-IMP-003",
          title: "Heartbeat chore agent eligibility scope",
          type: "improve",
          chips: [
            { state: "info", text: "evaluation due" }
          ],
          sub: "Source: BANDIT-022. Evaluation window opens after BANDIT-034 closeout.",
          ownerRole: "Codex PM",
          source: "docs/work/BANDIT-022/follow-up-chores.md"
        }
      ]
    },
    {
      key: "queue",
      label: "Queue & context",
      kicker: "06",
      count: 4,
      meta: "Trajectory only — not a backlog manager",
      rows: [
        {
          id: "BANDIT-036",
          title: "State Index Rebuild Performance",
          type: "chore",
          chips: [{ state: "info", text: "queued" }],
          sub: "Proposed. Depends on the first BANDIT-033 visual cockpit implementation slice.",
          source: "docs/work-intake.json#BANDIT-036"
        },
        {
          id: "BANDIT-037",
          title: "Operator Inbox compaction policy",
          type: "chore",
          chips: [{ state: "info", text: "queued" }],
          sub: "Proposed. Low-effort/high-impact per intake skill.",
          source: "docs/work-intake.json#BANDIT-037"
        },
        {
          id: "BANDIT-038",
          title: "Actor identity validation",
          type: "chore",
          chips: [{ state: "info", text: "deferred" }],
          sub: "Source: BANDIT-028 non-blocking finding. accepted_deferred.",
          source: "docs/work/BANDIT-028/qwen-finding-disposition.md"
        }
      ]
    }
  ],

  // ===================================================================
  // CLI-backed actions (5 emphasized per operator instruction).
  //
  //   ELIGIBILITY KEYS:
  //     available     — CLI accepts this command right now
  //     blocked       — CLI would reject; UI shows reason chip
  //     operator-only — only the named operator role may invoke
  //     unsupported   — UI must not show (kept here for type completeness)
  //
  //   Each action maps 1:1 to a CLI command family. The UI never carries
  //   the canonical mutation; it sends the request, the CLI validates,
  //   the CLI writes the repo-native artifact, the cockpit re-reads.
  // ===================================================================
  actions: {

    validate: {
      label: "Run validation",
      command: "bandit validate",
      glyph: "✓",
      scope: "global",
      family: "cli://validate",
      ownerRole: "Any",
      eligibility: "available"
    },

    landCheck: {
      label: "Check landing readiness",
      command: "bandit land-check {ID}",
      glyph: "↧",
      scope: "work-item",
      family: "cli://land-check",
      ownerRole: "Codex PM",
      eligibility: "available"
    },

    review: {
      label: "Run review gate",
      command: "bandit coderabbit-review pre-pr {ID} + bandit qwen-review {ID}",
      glyph: "◇",
      scope: "work-item",
      family: "cli://review-gate",
      ownerRole: "Codex PM",
      eligibility: "available",
      note: "Wraps CodeRabbit pre-PR + Local Qwen. Single guided affordance — reviewer plumbing stays inside the CLI."
    },

    uat: {
      label: "Record UAT approval",
      command: "bandit uat record {ID} --env {env} --sha {sha}",
      glyph: "✿",
      scope: "feature-slice",
      family: "cli://uat-record",
      ownerRole: "Operator",
      eligibility: "operator-only",
      note: "Operator action ONLY. UI displays env + sha for the named environment; user must explicitly authorize. UI never approves UAT."
    },

    artifactCreate: {
      label: "Create required evidence",
      command: "bandit artifact create {ID} --kind {kind}",
      glyph: "+",
      scope: "stage-specific",
      family: "cli://artifact-create",
      ownerRole: "Implementation Agent",
      eligibility: "contextual",
      note: "Contextual — surfaces only when a known artifact type is missing for the current stage."
    },

    // De-emphasized: surfaced as detail, never as a primary button.
    autoLandCheck: {
      label: "Auto-landing eligibility",
      command: "bandit auto-land-check {ID}",
      glyph: "ⓘ",
      scope: "work-item",
      family: "cli://auto-land-check",
      ownerRole: "Codex PM",
      eligibility: "secondary"
    }
  },

  // ===================================================================
  // Operator Inbox messages — repo-native, distinct from the cockpit's
  // attention framing. The cockpit may LINK to them; it does not OWN
  // them.
  // ===================================================================
  inbox: [
    {
      id: "OI-2026-05-26-01",
      from: "Codex PM",
      ts: "2026-05-26 09:42",
      requires: "operator-decision",
      subject: "Next Phase 8 cockpit direction",
      body: "Repo artifacts defer cockpit screen list, UI stack/packaging, direct file reads vs. local API, and state-index timing to Phase 8 product input. Required choice: visual UI, local server/API mode, direct file-read surface, state-index-backed surface, or another bounded step.",
      source: ".bandit/inbox/2026-05-26-01.md"
    },
    {
      id: "OI-2026-05-26-02",
      from: "Codex PM",
      ts: "2026-05-26 08:11",
      requires: "uat-approval",
      subject: "UAT requested — BANDIT-035 @ staging",
      body: "Feature slice safe-to-land. Click-through preview built from 97bb34c. Reply with approve or block + reason.",
      source: ".bandit/inbox/2026-05-26-02.md"
    },
    {
      id: "OI-2026-05-25-01",
      from: "Heartbeat Chore Agent",
      ts: "2026-05-25 18:30",
      requires: "ack",
      subject: "Eligible chore queue is empty",
      body: "No chores claimable in this heartbeat cycle. Ledger: 0 eligible · 2 deferred · 0 conflicting.",
      source: ".bandit/inbox/2026-05-25-01.md"
    }
  ],

  // ===================================================================
  // Improvement ledger — Workflow Improvement Engine output, evaluated.
  // ===================================================================
  improvements: [
    { id: "IMP-001", source: "BANDIT-023", title: "Route non-blocking review findings to durable chores",       evaluator: "BANDIT-030", outcome: "effective",   decision: "keep",        window: "4 cycles" },
    { id: "IMP-002", source: "BANDIT-027", title: "Pre-PR CodeRabbit CLI review (local diff before PR)",         evaluator: "BANDIT-031", outcome: "effective",   decision: "keep",        window: "3 cycles" },
    { id: "IMP-003", source: "BANDIT-031", title: "Cockpit status coverage hardening (S0–S6 gate breadth)",     evaluator: "BANDIT-032", outcome: "effective",   decision: "keep",        window: "—" },
    { id: "IMP-004", source: "BANDIT-022", title: "Heartbeat chore agent eligibility scope",                    evaluator: "—",           outcome: "due",         decision: "due",         window: "opens after BANDIT-034" },
    { id: "IMP-005", source: "BANDIT-018", title: "Adversarial escalation default reviewer profile",            evaluator: "—",           outcome: "pending",     decision: "pending",     window: "next 2 cycles" }
  ],

  // ===================================================================
  // Recent step transitions / coordination log slice.
  // ===================================================================
  stream: [
    { ts: "09:42",   id: "BANDIT-033", event: "design_review_recorded",   detail: "Phase 8 cockpit direction recorded. Source: docs/design/workflow-cockpit/design-review.md" },
    { ts: "09:31",   id: "BANDIT-034", event: "stage_4_stale",           detail: "review_subject_hash drift — recorded a06a26… vs current 97bb34…" },
    { ts: "08:11",   id: "BANDIT-035", event: "stage_5_safe_to_land",    detail: "Landing verdict recorded. UAT required." },
    { ts: "07:55",   id: "BANDIT-035", event: "stage_4_review_pass",     detail: "CodeRabbit pre-PR pass + Local Qwen pass at 97bb34c" },
    { ts: "yesterday", id: "BANDIT-032", event: "closed",                detail: "Cockpit Status Coverage Hardening — retrospective recorded" },
    { ts: "yesterday", id: "BANDIT-031", event: "improvement_evaluated", detail: "BANDIT-032 evaluated as keep" }
  ],

  // ===================================================================
  // Cross-model tension / repeated smells summary
  // ===================================================================
  smells: [
    { pattern: "Recursive Stage 4 blocker on terminal evidence", occurrences: 1, status: "addressed", source: "BANDIT-016", note: "Routed to evidence-head semantics fix." },
    { pattern: "Local Qwen vs CodeRabbit verdict divergence",   occurrences: 2, status: "watching",  source: "docs/decisions/2026-05-24-cross-model-tension-log.md" },
    { pattern: "Stale review_subject_hash on quick iterations",  occurrences: 3, status: "active",    source: "BANDIT-019 + BANDIT-034" }
  ]
};

// Expose to other Babel scripts.
Object.assign(window, { COCKPIT_DATA });
