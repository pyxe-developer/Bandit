// screens.jsx — Bandit cockpit artboards.
//
// Each screen is a single static render of one cockpit surface. They all
// share the cockpit chrome (Topbar + ambient grid) so they read as
// pages of the same product, not as unrelated mocks.
//
// INPUT CONTRACT (for the future implementation agent):
//   Each screen takes a `data` (subset of COCKPIT_DATA) and `tweak`
//   ({ activeItem, confidence, density, accent }). Both are immutable
//   props in this prototype. In production, the cockpit reads its
//   payload from `bandit cockpit status --json` (BANDIT-031 substrate).
//
// SCREEN LIST (declared in app.jsx):
//   1. AttentionHome        — Attention bands stacked top→down (primary IA)
//   2. WorkItemDetail       — One work item, gates + actions + sidebar
//   3. LandingReadiness     — Dual-track (code-safe / UAT) summary
//   4. ImprovementHealth    — Improvement ledger + repeated-smell summary
//   5. OperatorInbox        — Repo-native inbox messages (linked, not owned)
//   6. QueueContext         — Light upcoming trajectory
//   7. EvidenceDrilldown    — Full evidence detail panel (one level down)
//   8. PatternsCatalog      — Action affordance states + Fail-closed states

const {
  Chip, MonoPath, TraceLine, TypePill, AttentionBand, AttentionRow,
  GateStrip, ActionButton, SectionH, Topbar, AnnoNote, Card,
  makeConfidenceTransform, shortPath
} = window;

const FALLBACK_WORK_ITEM = {
  id: "UNKNOWN",
  title: "Missing work item",
  type: "chore",
  phase: "unknown",
  stage: "missing",
  attention: "blocked",
  summary: "The cockpit payload did not include this work item.",
  nextAction: {
    command: "bandit validate",
    eligibility: "blocked",
    blockedReason: "Missing cockpit work item data.",
    ownerRole: "Codex PM"
  },
  assignedPm: "—",
  created: "—",
  sourcePaths: [],
  gates: [],
  uat: { state: "n/a", note: "Missing work item data." },
  auto: { eligible: false, reasons: ["Missing cockpit work item data"] }
};

function getWorkItem(data, id, fallbackId) {
  const items = data?.items || {};
  const candidate = items[id] || items[fallbackId];
  if (!candidate) return { ...FALLBACK_WORK_ITEM, id: id || FALLBACK_WORK_ITEM.id };

  return {
    ...FALLBACK_WORK_ITEM,
    ...candidate,
    nextAction: { ...FALLBACK_WORK_ITEM.nextAction, ...(candidate.nextAction || {}) },
    sourcePaths: Array.isArray(candidate.sourcePaths) ? candidate.sourcePaths : [],
    gates: Array.isArray(candidate.gates) ? candidate.gates : [],
    auto: {
      ...FALLBACK_WORK_ITEM.auto,
      ...(candidate.auto || {}),
      reasons: Array.isArray(candidate.auto?.reasons) ? candidate.auto.reasons : []
    }
  };
}

// ============================================================================
// 1. ATTENTION-FIRST HOME
// ============================================================================
function getCurrentNextAction(data) {
  const context = data?.context || {};
  const nextAction = context.currentNextAction || context.nextAction || {};
  const firstAvailableItem = Object.values(data?.items || {}).find((item) => item?.nextAction);

  return {
    title: nextAction.title || firstAvailableItem?.nextAction?.label || "Create the next work item",
    summary: nextAction.summary || firstAvailableItem?.summary || "Use the current context artifact to choose the next governed action.",
    command: nextAction.command || firstAvailableItem?.nextAction?.command || "bandit validate"
  };
}

function AttentionHome({ data, tweak }) {
  const xf = makeConfidenceTransform(tweak.confidence);
  const currentNextAction = getCurrentNextAction(data);
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />

      {/* Hero summary — calm and guided. Single line answer to
          "what is the next action?" plus a guarded primary button. */}
      <div style={{ padding: "22px 22px 12px", display: "flex", gap: 20, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <div className="t-label" style={{ color: "var(--text-tertiary)", marginBottom: 8 }}>Current next action</div>
          <div className="t-h3" style={{ marginBottom: 6 }}>
            {currentNextAction.title}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, maxWidth: 680, lineHeight: 1.45 }}>
            {currentNextAction.summary}
          </div>
          <div className="cp-trace" style={{ marginTop: 8 }}>
            <span>derived from</span>
            <MonoPath>docs/roadmap/CURRENT_CONTEXT.md</MonoPath>
            <span className="cp-trace-arrow">→</span>
            <MonoPath>docs/design/workflow-cockpit/design-review.md</MonoPath>
            <span className="cp-trace-arrow">·</span>
            <span>last sync {data.context.headAge}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 280 }}>
          <ActionButton
            variant="primary"
            glyph="+"
            label="Create work item"
            command={currentNextAction.command}
          />
          <ActionButton
            glyph="✓"
            label="Run validation"
            command="bandit validate"
          />
        </div>
      </div>

      {/* Attention bands — IA centerpiece. Stacked top→down, ranked. */}
      <SectionH kicker="IA">Attention Categories</SectionH>
      <div>
        {data.bands.map((band) => (
          <AttentionBand
            key={band.key}
            bandKey={band.key}
            label={band.label}
            kicker={band.kicker}
            count={band.count}
            meta={band.meta}
          >
            {band.rows.map((row, i) => (
              <AttentionRow key={row.id + i} row={row} applyConfidence={xf} />
            ))}
          </AttentionBand>
        ))}
      </div>

      {/* Footer rail: improvement health teaser + smell summary  */}
      <SectionH kicker="ENGINE">Workflow Improvement Engine</SectionH>
      <div style={{ padding: "12px 22px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card title="Repeated smells" kicker="last 30d">
          {data.smells.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "baseline", padding: "8px 0", borderBottom: i < data.smells.length - 1 ? "1px solid var(--border-1)" : 0 }}>
              <div>
                <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{s.pattern}</div>
                <div className="cp-trace" style={{ marginTop: 4 }}>
                  <MonoPath>{shortPath(s.source)}</MonoPath>
                  {s.note && <span style={{ color: "var(--text-tertiary)" }}>· {s.note}</span>}
                </div>
              </div>
              <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>×{s.occurrences}</span>
              <Chip state={s.status === "active" ? "fail" : s.status === "watching" ? "stale" : "pass"}>{s.status}</Chip>
            </div>
          ))}
        </Card>
        <Card title="Improvement evaluation queue" kicker="next 14d">
          {data.improvements.slice(0, 4).map((i) => (
            <div key={i.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, padding: "8px 0", alignItems: "baseline", borderBottom: "1px solid var(--border-1)" }}>
              <div>
                <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{i.title}</div>
                <div className="cp-trace" style={{ marginTop: 4 }}>
                  <span>source</span><MonoPath>{i.source}</MonoPath>
                  {i.evaluator !== "—" && <><span className="cp-trace-arrow">→</span><MonoPath>{i.evaluator}</MonoPath></>}
                </div>
              </div>
              <span className="cp-imp-decision" data-d={i.decision}>{i.decision}</span>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ padding: "0 22px 22px" }}>
        <AnnoNote kind="view-model boundary">
          The home view never re-orders attention bands. The ranking
          (operator → blocked → active → landing → improve → queue) is
          fixed by the view-model module. Rows inside a band may be
          ordered by recency, owner-role, or staleness — but bands
          themselves never reshuffle, and a row never appears in more
          than one band.
        </AnnoNote>
      </div>
    </div>
  );
}

// ============================================================================
// 2. ACTIVE WORK ITEM DETAIL
// ============================================================================
function WorkItemDetail({ data, tweak }) {
  const item = getWorkItem(data, tweak.activeItem, "BANDIT-033");
  const xf = makeConfidenceTransform(tweak.confidence);
  const nextAction = item.nextAction;
  const actionDisabled = nextAction.eligibility === "blocked" || nextAction.eligibility === "operator-only";
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />

      <div style={{ padding: "22px 22px 14px", display: "flex", gap: 14, alignItems: "baseline" }}>
        <TypePill kind={item.type} />
        <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>{item.id}</span>
        <span style={{ marginLeft: 8, color: "var(--text-tertiary)" }}>·</span>
        <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>{item.phase} · {item.stage}</span>
      </div>
      <div style={{ padding: "0 22px 16px" }}>
        <h1 className="t-h2" style={{ margin: 0, marginBottom: 6 }}>{item.title}</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, maxWidth: 720 }}>{item.summary}</p>
      </div>

      <div style={{ padding: "0 22px 24px" }} className="cp-split">

        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Next action — primary affordance card */}
          <Card title="Next governed action" kicker="cli-bound">
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div className="cp-trace" style={{ marginBottom: 8 }}>
                  <span>owner role</span>
                  <b style={{ color: "var(--text-primary)" }}>{nextAction.ownerRole}</b>
                  <span className="cp-trace-arrow">·</span>
                  <span>eligibility</span>
                  <Chip state={nextAction.eligibility === "available" ? "pass" : "blocked"}>{nextAction.eligibility}</Chip>
                </div>
                <code className="t-mono-sm" style={{ display: "block", color: "var(--code-fg)", background: "var(--code-bg)", border: "1px solid var(--code-border)", borderRadius: 4, padding: "8px 10px", marginTop: 6 }}>{nextAction.command}</code>
                {nextAction.blockedReason && (
                  <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.45, maxWidth: 460 }}>
                    <Chip state="blocked">{nextAction.eligibility === "operator-only" ? "operator only" : "blocked"}</Chip>
                    {" "}{nextAction.blockedReason}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 240 }}>
                <ActionButton
                  variant={actionDisabled ? "default" : "primary"}
                  glyph={actionDisabled ? "✿" : "›"}
                  label={item.attention === "operator" ? "Open in Operator Inbox" : item.attention === "landing" ? "Record UAT approval" : "Run review gate"}
                  command={item.attention === "operator" ? ".bandit/inbox/…" : item.attention === "landing" ? "bandit uat record …" : "bandit qwen-review " + item.id}
                  disabled={actionDisabled}
                  reason={actionDisabled ? (nextAction.eligibility === "operator-only" ? "Operator action only — UI cannot record acceptance." : "Operator input required.") : null}
                  ownerRole={nextAction.eligibility === "operator-only" ? "Operator" : null}
                />
                <ActionButton
                  glyph="↧"
                  label="Check landing readiness"
                  command={"bandit land-check " + item.id}
                />
                <ActionButton
                  glyph="✓"
                  label="Run validation"
                  command="bandit validate"
                />
              </div>
            </div>
          </Card>

          {/* Gate strip */}
          <Card title="Workflow gates" kicker="stage-by-stage">
            <GateStrip gates={item.gates} uat={item.uat} applyConfidence={xf} />
            {item.staleness && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(244,183,64,0.04)", border: "1px solid rgba(244,183,64,0.24)", borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <Chip state="stale">{item.staleness.kind}</Chip>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    recorded <code className="t-mono-sm">{item.staleness.recordedHash}</code>
                    {" "}≠ current <code className="t-mono-sm">{item.staleness.currentHash}</code>
                  </span>
                </div>
                <TraceLine paths={[item.staleness.sourcePath]} prefix="evidence" />
              </div>
            )}
            <AnnoNote kind="design rationale">
              Gate strip is Bandit's evidence-row analogue. Each gate is a cell with stage label, state, source path, and a short note. UAT is rendered as a parallel track only when the item is a feature slice — chores never show UAT. Both tracks are derived; the UI never decides "UAT-ready" or "code-safe."
            </AnnoNote>
          </Card>

          {/* Coordination log strip */}
          <Card title="Recent transitions" kicker="coordination log">
            <div className="cp-stream">
              {data.stream.filter((s) => s.id === item.id).slice(0, 4).map((s, i) => (
                <div key={i} className="cp-stream-row">
                  <time>{s.ts}</time>
                  <Chip state={s.event.includes("fail") || s.event.includes("blocker") ? "fail" : s.event.includes("stale") ? "stale" : s.event.includes("required") ? "blocked" : "pass"}>{s.event}</Chip>
                  <span>{s.detail}</span>
                  <MonoPath>{"docs/work/" + s.id + "/coordination-log.jsonl"}</MonoPath>
                </div>
              ))}
              {data.stream.filter((s) => s.id === item.id).length === 0 && (
                <div className="cp-stream-row">
                  <time>—</time>
                  <Chip state="missing">no transitions</Chip>
                  <span style={{ color: "var(--text-tertiary)" }}>No coordination events recorded for this work item yet.</span>
                  <MonoPath>{"docs/work/" + item.id + "/coordination-log.jsonl"}</MonoPath>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* SIDEBAR */}
        <aside className="cp-side">
          <Card title="Item details" kicker="metadata">
            <dl className="cp-kv">
              <dt>id</dt>          <dd><code>{item.id}</code></dd>
              <dt>type</dt>        <dd><TypePill kind={item.type} /></dd>
              <dt>phase</dt>       <dd>{item.phase}</dd>
              <dt>stage</dt>       <dd>{item.stage}</dd>
              <dt>attention</dt>   <dd><Chip state={item.attention === "operator" ? "blocked" : item.attention === "blocked" ? "fail" : item.attention === "active" ? "progress" : item.attention === "landing" ? "pass" : "info"}>{item.attention}</Chip></dd>
              <dt>pm</dt>          <dd>{item.assignedPm}</dd>
              <dt>created</dt>     <dd className="t-mono-sm">{item.created}</dd>
            </dl>
          </Card>

          <Card title="Source artifacts" kicker="trace">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {item.sourcePaths.map((p) => <MonoPath key={p}>{p}</MonoPath>)}
            </div>
          </Card>

          <Card title="Auto-land eligibility" kicker="secondary">
            <Chip state={item.auto.eligible ? "pass" : "missing"}>
              {item.auto.eligible ? "eligible" : "not eligible"}
            </Chip>
            <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {item.auto.reasons.map((r) => (
                <li key={r} style={{ display: "flex", gap: 8, alignItems: "baseline", color: "var(--text-secondary)", fontSize: 12 }}>
                  <span style={{ color: "var(--text-tertiary)" }}>·</span>{r}
                </li>
              ))}
            </ul>
            <TraceLine paths={["bandit auto-land-check " + item.id]} prefix="cli" />
          </Card>

          <AnnoNote kind="action-eligibility module">
            All four buttons in the &ldquo;Next governed action&rdquo; card are
            reads of the action-eligibility module&apos;s output. The UI
            cannot enable a disabled button. Hover (not shown in static
            mock) reveals the same {`reason`} text the disabled state shows
            inline.
          </AnnoNote>
        </aside>
      </div>
    </div>
  );
}

// ============================================================================
// 3. LANDING READINESS — dual-track
// ============================================================================
function LandingReadiness({ data, tweak }) {
  const slice = getWorkItem(data, "BANDIT-035");
  const chore = getWorkItem(data, "BANDIT-034");
  const xf = makeConfidenceTransform(tweak.confidence);
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />
      <div style={{ padding: "20px 22px 6px" }}>
        <div className="t-label">Landing readiness</div>
        <h1 className="t-h3" style={{ margin: "4px 0 4px" }}>Code-safe vs. UAT-ready vs. blocked</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, maxWidth: 640 }}>
          Feature slices need both tracks green; chores need only code-safety. The cockpit never infers UAT.
        </p>
      </div>

      <div style={{ padding: "12px 22px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Feature slice card */}
        <Card title={slice.title} kicker={slice.id} right={<TypePill kind="slice" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(127,229,177,0.04)", border: "1px solid rgba(127,229,177,0.22)" }}>
              <div className="t-label" style={{ color: "var(--green-300)" }}>Code-safety</div>
              <div className="t-h4" style={{ margin: "4px 0" }}>safe-to-land</div>
              <TraceLine paths={["docs/work/BANDIT-035/landing-verdict.md"]} prefix="verdict" />
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,77,77,0.04)", border: "1px solid rgba(255,77,77,0.30)" }}>
              <div className="t-label" style={{ color: "var(--red-300)" }}>UAT</div>
              <div className="t-h4" style={{ margin: "4px 0" }}>missing</div>
              <div className="cp-trace">
                <span>env</span><code>{slice.uat.env}</code>
                <span className="cp-trace-arrow">·</span>
                <span>sha</span><code>{slice.uat.sha}</code>
              </div>
            </div>
          </div>
          <GateStrip gates={slice.gates} uat={slice.uat} applyConfidence={xf} />
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ActionButton variant="default" glyph="✿" label="Record UAT approval" command={"bandit uat record " + slice.id + " --env staging --sha " + slice.uat.sha} reason="Operator action only — UI cannot record acceptance." ownerRole="Operator" disabled />
            <ActionButton glyph="↧" label="Re-check landing readiness" command={"bandit land-check " + slice.id} />
            <ActionButton glyph="ⓘ" label="Auto-land eligibility" command={"bandit auto-land-check " + slice.id} />
          </div>
        </Card>

        {/* Chore card */}
        <Card title={chore.title} kicker={chore.id} right={<TypePill kind="chore" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(244,183,64,0.04)", border: "1px solid rgba(244,183,64,0.28)" }}>
              <div className="t-label" style={{ color: "#ffd5b0" }}>Code-safety</div>
              <div className="t-h4" style={{ margin: "4px 0" }}>stale</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>review_subject_hash drift</div>
              <TraceLine paths={["docs/work/BANDIT-034/review-evidence.md"]} prefix="evidence" />
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border-2)", borderStyle: "dashed" }}>
              <div className="t-label">UAT</div>
              <div className="t-h4" style={{ margin: "4px 0", color: "var(--text-tertiary)" }}>n/a</div>
              <div style={{ color: "var(--text-tertiary)", fontSize: 12 }}>Chore — no UAT track</div>
            </div>
          </div>
          <GateStrip gates={chore.gates} applyConfidence={xf} />
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ActionButton variant="primary" glyph="◇" label="Run review gate" command={"bandit qwen-review " + chore.id} />
            <ActionButton glyph="↧" label="Re-check landing readiness" command={"bandit land-check " + chore.id} />
            <ActionButton glyph="ⓘ" label="Auto-land eligibility" command={"bandit auto-land-check " + chore.id} />
          </div>
        </Card>
      </div>

      <div style={{ padding: "0 22px 22px" }}>
        <AnnoNote kind="dual-track contract">
          Landing readiness is rendered as <b>two parallel cells</b> for slices and <b>one cell + n/a marker</b> for chores. The dual-track decision is owned by the CLI&apos;s landing policy. The UI never collapses both into a single &ldquo;ready&rdquo; verdict — that would blur engineering review and product acceptance. Per PRD-003 user story #6.
        </AnnoNote>
      </div>
    </div>
  );
}

// ============================================================================
// 4. IMPROVEMENT HEALTH
// ============================================================================
function ImprovementHealth({ data, tweak }) {
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />
      <div style={{ padding: "20px 22px 6px" }}>
        <div className="t-label">Workflow improvement engine</div>
        <h1 className="t-h3" style={{ margin: "4px 0" }}>Improvement health</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, maxWidth: 640 }}>
          Bandit&apos;s differentiator: every retrospective lesson becomes a tagged chore that is evaluated, then decided <code>keep</code>, <code>revise</code>, <code>revert</code>, or <code>double-down</code>.
        </p>
      </div>

      {/* Summary tiles */}
      <div style={{ padding: "14px 22px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {[
          { label: "evaluated", value: 3, kind: "pass", sub: "kept" },
          { label: "due",       value: 1, kind: "info", sub: "this window" },
          { label: "pending",   value: 1, kind: "missing", sub: "awaiting cycles" },
          { label: "reverted",  value: 0, kind: "missing", sub: "—" },
          { label: "doubled-down", value: 0, kind: "missing", sub: "—" }
        ].map((t) => (
          <div key={t.label} className="cp-card" style={{ padding: 14 }}>
            <div className="t-label">{t.label}</div>
            <div className="t-h2" style={{ margin: "4px 0 4px", fontVariantNumeric: "tabular-nums" }}>{t.value}</div>
            <div style={{ color: "var(--text-tertiary)", fontSize: 11 }}>{t.sub}</div>
          </div>
        ))}
      </div>

      {/* Ledger */}
      <SectionH kicker="LEDGER">Improvement chores</SectionH>
      <div style={{ padding: "12px 22px" }}>
        <div className="cp-imp-row" style={{ background: "transparent", border: 0, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>id</span>
          <span>title · source</span>
          <span>window</span>
          <span>outcome</span>
          <span>decision</span>
        </div>
        {data.improvements.map((i) => (
          <div key={i.id} className="cp-imp-row">
            <code className="t-mono-sm" style={{ color: "var(--text-secondary)" }}>{i.id}</code>
            <div>
              <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{i.title}</div>
              <div className="cp-trace" style={{ marginTop: 4 }}>
                <span>source</span><MonoPath>{i.source}</MonoPath>
                {i.evaluator !== "—" && <><span className="cp-trace-arrow">→</span><span>evaluator</span><MonoPath>{i.evaluator}</MonoPath></>}
              </div>
            </div>
            <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>{i.window}</span>
            <Chip state={i.outcome === "effective" ? "pass" : i.outcome === "due" ? "info" : "missing"}>{i.outcome}</Chip>
            <span className="cp-imp-decision" data-d={i.decision}>{i.decision}</span>
          </div>
        ))}
      </div>

      {/* Repeated smells */}
      <SectionH kicker="SIGNALS">Repeated smells &amp; cross-model tension</SectionH>
      <div style={{ padding: "12px 22px 22px" }}>
        {data.smells.map((s, i) => (
          <div key={i} className="cp-imp-row" style={{ gridTemplateColumns: "1fr 90px 90px 1fr" }}>
            <div>
              <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{s.pattern}</div>
              {s.note && <div style={{ color: "var(--text-tertiary)", fontSize: 12 }}>{s.note}</div>}
            </div>
            <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>×{s.occurrences}</span>
            <Chip state={s.status === "active" ? "fail" : s.status === "watching" ? "stale" : "pass"}>{s.status}</Chip>
            <MonoPath>{s.source}</MonoPath>
          </div>
        ))}
        <AnnoNote kind="compact, first-class">
          Improvement health is first-class but compact — five tiles plus
          one ledger table plus one signal table. It must never feel like
          a separate analytics dashboard. The PRD calls this out as
          Bandit&apos;s differentiator (user stories #16–18).
        </AnnoNote>
      </div>
    </div>
  );
}

// ============================================================================
// 5. OPERATOR INBOX SURFACE (linked, not owned)
// ============================================================================
function OperatorInboxSurface({ data, tweak }) {
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />
      <div style={{ padding: "20px 22px 6px" }}>
        <div className="t-label">Operator-owned</div>
        <h1 className="t-h3" style={{ margin: "4px 0" }}>Operator Inbox</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, maxWidth: 460 }}>
          Repo-native messages. The cockpit <b>links</b> and <b>displays</b>; it does not own these.
        </p>
        <div className="cp-trace" style={{ marginTop: 8 }}>
          <span>artifact</span><MonoPath>.bandit/inbox/*.md</MonoPath>
        </div>
      </div>

      <div style={{ padding: "14px 22px 22px" }}>
        {data.inbox.map((m) => (
          <div key={m.id} className="cp-inbox-item">
            <div className="cp-inbox-meta">
              <span>{m.from}</span>
              <span>·</span>
              <span>{m.ts}</span>
              <span style={{ marginLeft: "auto" }}>
                <Chip state={m.requires === "operator-decision" ? "blocked" : m.requires === "uat-approval" ? "info" : "missing"}>requires: {m.requires}</Chip>
              </span>
            </div>
            <div className="cp-inbox-q">{m.subject}</div>
            <div style={{ marginTop: 6, color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.45 }}>{m.body}</div>
            <TraceLine paths={[m.source]} prefix="artifact" />
          </div>
        ))}

        <AnnoNote kind="vocabulary">
          The PRD insists the Operator Inbox is a distinct repo-native
          concept, not the cockpit&apos;s attention framing. This surface is
          deliberately styled differently from Attention Bands — coral
          left edge, denser text, conversational tone — so the user
          never confuses cockpit IA with operator messages.
        </AnnoNote>
      </div>
    </div>
  );
}

// ============================================================================
// 6. QUEUE & CONTEXT (light)
// ============================================================================
function QueueContext({ data, tweak }) {
  const queueBand = Array.isArray(data?.bands) ? data.bands.find((b) => b.key === "queue") : null;
  const queueRows = Array.isArray(queueBand?.rows) ? queueBand.rows : [];
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />
      <div style={{ padding: "20px 22px 6px" }}>
        <div className="t-label">Trajectory</div>
        <h1 className="t-h3" style={{ margin: "4px 0" }}>Queue &amp; context</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, maxWidth: 460 }}>
          What&apos;s next, not how to manage a backlog. Heavy intake belongs in the Work Intake Triage skill.
        </p>
      </div>

      {/* Upcoming */}
      <SectionH kicker="UPCOMING">Proposed &amp; deferred</SectionH>
      <div style={{ padding: "8px 22px 18px" }}>
        {queueRows.map((r) => (
          <AttentionRow key={r.id} row={r} />
        ))}
        {queueRows.length === 0 && (
          <div className="cp-stream-row">
            <time>—</time>
            <Chip state="missing">queue unavailable</Chip>
            <span style={{ color: "var(--text-tertiary)" }}>No queue band rows are present in the cockpit payload.</span>
          </div>
        )}
      </div>

      {/* Recent transitions */}
      <SectionH kicker="RECENT">Coordination log (24h)</SectionH>
      <div style={{ padding: "8px 22px 22px" }}>
        <div className="cp-stream">
          {data.stream.map((s, i) => (
            <div key={i} className="cp-stream-row" style={{ gridTemplateColumns: "70px 110px 1fr" }}>
              <time>{s.ts}</time>
              <Chip state={s.event.includes("required") ? "blocked" : s.event.includes("stale") ? "stale" : s.event.includes("closed") || s.event.includes("pass") || s.event.includes("evaluated") ? "pass" : "progress"}>
                {s.id}
              </Chip>
              <span style={{ fontSize: 12 }}>{s.event} · <span style={{ color: "var(--text-tertiary)" }}>{s.detail}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 22px 22px" }}>
        <AnnoNote kind="scope discipline">
          PRD-003: &ldquo;the queue/context area is lightweight and
          secondary. It should show trajectory and upcoming work, not
          become the main backlog management surface.&rdquo; This screen
          intentionally has no kanban, no drag, no priority editor —
          intake belongs in the operator-facing Work Intake Triage skill.
        </AnnoNote>
      </div>
    </div>
  );
}

// ============================================================================
// 7. EVIDENCE DRILL-DOWN PANEL (one level down)
// ============================================================================
function EvidenceDrilldown({ data, tweak }) {
  const item = getWorkItem(data, "BANDIT-034"); // stale-state demo target
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />

      <div style={{ padding: "20px 22px 4px", display: "flex", alignItems: "baseline", gap: 12 }}>
        <span className="t-label">Evidence drill-down</span>
        <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>›</span>
        <span className="t-mono-sm" style={{ color: "var(--text-secondary)" }}>{item.id}</span>
        <span className="t-mono-sm" style={{ color: "var(--text-tertiary)" }}>›</span>
        <span className="t-mono-sm" style={{ color: "var(--text-secondary)" }}>Stage 4 — Review</span>
        <span style={{ marginLeft: "auto" }}>
          <Chip state="stale">stale</Chip>
        </span>
      </div>
      <div style={{ padding: "0 22px 16px" }}>
        <h1 className="t-h3" style={{ margin: 0 }}>Stage 4 review evidence — review_subject_hash drift</h1>
      </div>

      <div style={{ padding: "0 22px 22px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>

        <Card title="Evidence detail" kicker="normalized">
          <dl style={{ margin: 0 }}>
            <div className="cp-evi-row">
              <dt>kind</dt>
              <dd>aggregate Stage 4 review evidence</dd>
              <Chip state="stale">stale</Chip>
            </div>
            <div className="cp-evi-row">
              <dt>recorded hash</dt>
              <dd><code className="t-mono-sm">a06a265a7319fd5f6b39440c201e0fd4a87dfa1c3fb578abdcc138efb10c7d7a</code></dd>
              <Chip state="info">historical</Chip>
            </div>
            <div className="cp-evi-row">
              <dt>current hash</dt>
              <dd><code className="t-mono-sm">97bb34c9926713b0228c9971a4ef44fd08fe2af722b15fec81ee3c2e22951861</code></dd>
              <Chip state="info">live</Chip>
            </div>
            <div className="cp-evi-row">
              <dt>artifact</dt>
              <dd><MonoPath>docs/work/BANDIT-034/review-evidence.md</MonoPath></dd>
              <span></span>
            </div>
            <div className="cp-evi-row">
              <dt>local qwen</dt>
              <dd><MonoPath>docs/work/BANDIT-034/local-qwen-review.md</MonoPath><br/><span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>verdict: pass at recorded hash</span></dd>
              <Chip state="pass">pass</Chip>
            </div>
            <div className="cp-evi-row">
              <dt>coderabbit</dt>
              <dd><MonoPath>docs/work/BANDIT-034/coderabbit-review.md</MonoPath><br/><span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>verdict: pass at recorded hash · 0 findings</span></dd>
              <Chip state="pass">pass</Chip>
            </div>
            <div className="cp-evi-row">
              <dt>coordination log</dt>
              <dd><MonoPath>docs/work/BANDIT-034/coordination-log.jsonl</MonoPath><br/><span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>last event: stage_4_review_recorded · 2026-05-25 14:02</span></dd>
              <Chip state="info">8 events</Chip>
            </div>
            <div className="cp-evi-row">
              <dt>landing verdict</dt>
              <dd>—</dd>
              <Chip state="missing">not yet recorded</Chip>
            </div>
          </dl>

          <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(244,183,64,0.04)", border: "1px solid rgba(244,183,64,0.22)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
              <Chip state="stale">staleness policy</Chip>
              <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>hash-based evidence freshness (BANDIT-019)</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              When review evidence records <code>review_subject_hash</code>, landing readiness compares against the current review-subject hash rather than treating every raw HEAD mismatch as stale. This evidence is stale because review-relevant source changed since 14:02.
            </p>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ActionButton variant="primary" glyph="◇" label="Run review gate" command={"bandit coderabbit-review pre-pr " + item.id + " + bandit qwen-review " + item.id} />
            <ActionButton glyph="↧" label="Check landing readiness" command={"bandit land-check " + item.id} />
          </div>
        </Card>

        <aside className="cp-side">
          <Card title="Source traceability" kicker="every value links back">
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "docs/work/BANDIT-034/brief.md",
                "docs/work/BANDIT-034/red-evidence.md",
                "docs/work/BANDIT-034/implementation-evidence.md",
                "docs/work/BANDIT-034/review-evidence.md",
                "docs/work/BANDIT-034/local-qwen-review.md",
                "docs/work/BANDIT-034/coderabbit-review.md",
                "docs/work/BANDIT-034/coordination-log.jsonl"
              ].map((p) => (
                <li key={p}><MonoPath>{p}</MonoPath></li>
              ))}
            </ul>
          </Card>

          <Card title="Stage 4 evidence-head semantics" kicker="policy">
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>
              The PM disposition record explains why a hash mismatch is required to be marked stale rather than auto-reset. See <MonoPath>docs/decisions/2026-05-24-cli-authority-workflow-cockpit.md</MonoPath>.
            </p>
          </Card>

          <AnnoNote kind="evidence-detail module">
            One module normalizes source links, gate evidence, review
            evidence, landing evidence, UAT evidence, and coordination
            evidence — all of them. Components on this screen never
            parse repo files; they read the normalized shape.
          </AnnoNote>
        </aside>
      </div>
    </div>
  );
}

// ============================================================================
// 8. PATTERNS CATALOG — Action affordance states + Fail-closed states
// ============================================================================
function PatternsCatalog({ data, tweak }) {
  return (
    <div className="cp" data-density={tweak.density} data-accent={tweak.accent} data-confidence={tweak.confidence}>
      <Topbar context={data.context} tweak={tweak} />
      <div style={{ padding: "20px 22px 6px" }}>
        <div className="t-label">Pattern reference</div>
        <h1 className="t-h3" style={{ margin: "4px 0" }}>Guarded actions &amp; fail-closed states</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13, maxWidth: 720 }}>
          Two contracts the rest of the cockpit composes from. Both stay shallow — they render whatever the action-eligibility and evidence-detail modules say, and never decide.
        </p>
      </div>

      {/* Action affordance pattern */}
      <SectionH kicker="ACTION">Affordance pattern</SectionH>
      <div style={{ padding: "12px 22px 6px" }}>
        <div className="cp-pgrid">
          <div className="cp-pcell">
            <h5>Available — primary</h5>
            <p>Default for the work item&apos;s next governed action when eligibility = <code>available</code>. Coral fill, on-coral text.</p>
            <ActionButton variant="primary" glyph="◇" label="Run review gate" command="bandit coderabbit-review pre-pr BANDIT-034 + bandit qwen-review BANDIT-034" />
          </div>
          <div className="cp-pcell">
            <h5>Available — secondary</h5>
            <p>Surface, but never primary. Use for actions the user might want without it being the next action.</p>
            <ActionButton glyph="↧" label="Check landing readiness" command="bandit land-check BANDIT-034" />
            <ActionButton glyph="✓" label="Run validation" command="bandit validate" />
          </div>
          <div className="cp-pcell">
            <h5>Blocked by operator input</h5>
            <p>Disabled, dashed border, inline reason chip. The cockpit never circumvents this — it surfaces the link to the Operator Inbox instead.</p>
            <ActionButton variant="default" disabled glyph="✿" label="Record UAT approval" command="bandit uat record BANDIT-035 --env staging --sha 97bb34c" ownerRole="Operator" reason="UI cannot record acceptance. Open Operator Inbox to authorize." />
          </div>
          <div className="cp-pcell">
            <h5>Blocked by missing evidence</h5>
            <p>Disabled with a fail-closed reason. Reason chip names the missing artifact.</p>
            <ActionButton variant="default" disabled glyph="↧" label="Check landing readiness" command="bandit land-check BANDIT-033" reason="No Stage 5 verdict exists — Stage 3 is unstarted." />
          </div>
          <div className="cp-pcell">
            <h5>Contextual — appears only when needed</h5>
            <p>Surfaces only when the current stage is missing a known artifact. Composed by the action-eligibility module from gate-state.</p>
            <ActionButton glyph="+" label="Create RED evidence" command="bandit artifact create BANDIT-033 --kind red-evidence" />
          </div>
          <div className="cp-pcell">
            <h5>Excluded — does not render</h5>
            <p>The cockpit never shows direct land/merge/push/deploy/override buttons. The button list is curated by the action-eligibility module; unsupported families are not even rendered.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["bandit merge --force", "git push origin main", "bandit policy override"].map((cmd) => (
                <span key={cmd} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-tertiary)", padding: "4px 8px", border: "1px dashed var(--border-2)", borderRadius: 4, opacity: 0.6 }}>
                  <span style={{ color: "var(--red-300)" }}>✕</span>{cmd}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fail-closed catalog */}
      <SectionH kicker="FAIL-CLOSED">Confidence cues</SectionH>
      <div style={{ padding: "12px 22px 22px" }}>
        <div className="cp-pgrid">
          {[
            { state: "pass",     name: "source-linked", note: "Live state computed from current repo artifacts. Pass chip + source path." },
            { state: "progress", name: "in progress",   note: "Stage active, no final verdict yet. Coral fill, ambient glow." },
            { state: "stale",    name: "stale",         note: "Evidence exists but its review_subject_hash is older than current source. Firm but contained — chip + reason, no full-card red." },
            { state: "missing",  name: "missing",       note: "Required artifact not yet recorded. Dashed border, neutral text. Never synthesizes a value." },
            { state: "fail",     name: "fail-closed",   note: "Contradictory or refused evidence. Red chip, source link, named reason. Cockpit does not retry silently." },
            { state: "blocked",  name: "blocked",       note: "Cannot legally advance until resume condition is satisfied. Names the resume condition + owner role." },
            { state: "info",     name: "derived",       note: "Aggregated from multiple sources. Mono-blue chip. Trace shows every contributing path." },
            { state: "cli",      name: "cli-derived",   note: "Computed by a CLI command (e.g. bandit auto-land-check) rather than read from an artifact." }
          ].map((c) => (
            <div key={c.state} className="cp-pcell">
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                <h5>{c.name}</h5>
                <Chip state={c.state}>{c.state}</Chip>
              </div>
              <p>{c.note}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <AnnoNote kind="tone calibration">
            Per operator instruction: <b>firm but contained</b>. A
            fail-closed state shows a red chip + reason text + linked
            source. It does not paint the whole card red, it does not
            block the rest of the screen, and it does not auto-retry.
            The operator decides what to do — the cockpit just makes
            the problem and its source visible.
          </AnnoNote>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AttentionHome, WorkItemDetail, LandingReadiness, ImprovementHealth,
  OperatorInboxSurface, QueueContext, EvidenceDrilldown, PatternsCatalog
});
