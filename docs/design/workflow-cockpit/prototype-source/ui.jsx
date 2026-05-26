// ui.jsx — shallow shared components for the Bandit Attention-First Cockpit.
//
// VIEW-MODEL BOUNDARY (for the future implementation agent):
//   These components are pure render functions of their props. They:
//     - do not import COCKPIT_DATA themselves; the screens pass slices in.
//     - do not decide state, eligibility, or attention category.
//     - never write to canonical state.
//     - know how to render every confidence cue: pass / progress / fail /
//       stale / missing / blocked / info / cli.
//   When the CLI payload is missing a field, components fall back to the
//   `missing` rendering — never a synthesized "looks fine."

const { useMemo } = React;

// -------------------------------------------------------------------
// Chip — one piece of state/confidence/evidence.
// -------------------------------------------------------------------
function Chip({ state = "info", children, tweakable = false }) {
  return (
    <span className="cp-chip" data-state={state} data-tweakable={tweakable ? "evidence" : undefined}>
      <span className="cp-dot" />
      <span>{children}</span>
    </span>
  );
}

// -------------------------------------------------------------------
// MonoPath — a clickable-looking source-link. The cockpit always lets
// you trace any displayed status back to a repo-native artifact path.
// -------------------------------------------------------------------
function MonoPath({ children, hint }) {
  return <code className="cp-path" title={hint || ""}>{children}</code>;
}

// -------------------------------------------------------------------
// TraceLine — small "source-of-truth" trail under any derived value.
//   Renders:  source: <path>  →  <path>  →  <path>
// -------------------------------------------------------------------
function TraceLine({ paths = [], prefix = "source" }) {
  if (!paths.length) return null;
  return (
    <div className="cp-trace">
      <span>{prefix}:</span>
      {paths.map((p, i) => (
        <React.Fragment key={p + i}>
          <MonoPath>{p}</MonoPath>
          {i < paths.length - 1 ? <span className="cp-trace-arrow">→</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------
// TypePill — Slice / Chore / Gap / Improvement
// -------------------------------------------------------------------
function TypePill({ kind }) {
  const label = { slice: "slice", chore: "chore", gap: "gap", improve: "improvement" }[kind] || kind;
  return <span className="cp-type" data-type={kind}>{label}</span>;
}

// -------------------------------------------------------------------
// AttentionBand — the home screen's primary IA primitive.
//
//   PROPS:
//     bandKey   — "operator" | "blocked" | "active" | "landing" |
//                 "improve" | "queue"
//     label     — short human label
//     kicker    — "01"…"06" (priority rank)
//     count     — integer
//     meta      — short right-aligned hint (action verb, etc.)
//     children  — band body
//
//   The colored left edge encodes urgency rank without painting the
//   whole row red/coral. Per design tone: firm but contained.
// -------------------------------------------------------------------
function AttentionBand({ bandKey, label, kicker, count, meta, children }) {
  return (
    <section className="cp-band" data-urgency={bandKey}>
      <header className="cp-band-head">
        <span className="cp-band-title-kicker">{kicker}</span>
        <h3 className="cp-band-title">{label}</h3>
        <span className="cp-band-count tnum">{count}</span>
        <span className="cp-band-meta">{meta}</span>
      </header>
      <div>{children}</div>
    </section>
  );
}

// -------------------------------------------------------------------
// AttentionRow — one work-item row inside a band.
// -------------------------------------------------------------------
function AttentionRow({ row, applyConfidence }) {
  const chips = applyConfidence ? row.chips.map(applyConfidence) : row.chips;
  return (
    <div className="cp-row">
      <div>
        <div className="cp-row-id">{row.id}</div>
        <div style={{ marginTop: 4 }}><TypePill kind={row.type} /></div>
      </div>
      <div>
        <div className="cp-row-title">
          <span className="cp-row-title-text">{row.title}</span>
        </div>
        {row.sub && <div className="cp-row-sub">{row.sub}</div>}
        {row.source && (
          <div className="cp-trace" style={{ marginTop: 6 }}>
            <span>source:</span><MonoPath>{row.source}</MonoPath>
            {row.ownerRole && row.ownerRole !== "—" && (
              <>
                <span className="cp-trace-arrow">·</span>
                <span>next action owner: <b style={{ color: "var(--text-secondary)" }}>{row.ownerRole}</b></span>
              </>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 280 }}>
        {chips.map((c, i) => <Chip key={i} state={c.state} tweakable>{c.text}</Chip>)}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// GateStrip — Bandit's evidence row. Horizontal stage track + UAT
// dual-track for slices.
//
//   PROPS:
//     gates  — [{ stage, name, state, source, note? }]
//     uat    — { state, env, sha, note }  (optional, only for slices)
// -------------------------------------------------------------------
function GateStrip({ gates, uat, applyConfidence }) {
  return (
    <div>
      <div className="cp-gates">
        {gates.map((g) => {
          const eff = applyConfidence ? applyConfidence({ state: g.state, text: "" }) : { state: g.state };
          const state = eff.state;
          return (
            <div key={g.stage} className="cp-gate" data-state={state}>
              <div className="cp-gate-stage">
                <span>{g.stage}</span>
                <Chip state={state}>{state}</Chip>
              </div>
              <div className="cp-gate-name">{g.name}</div>
              <div className="cp-gate-foot">
                {g.source && g.source !== "—" ? (
                  <MonoPath hint={g.source}>{shortPath(g.source)}</MonoPath>
                ) : (
                  <span className="cp-chip" data-state="missing"><span className="cp-dot" />{"no source"}</span>
                )}
                {g.note && <span className="t-meta" style={{ color: "var(--text-tertiary)" }}>{g.note}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {uat && uat.state !== "n/a" && (
        <div className="cp-uat" data-state={uat.state}>
          <Chip state={uat.state === "approved" ? "pass" : uat.state === "stale" ? "stale" : "missing"}>
            UAT · {uat.state}
          </Chip>
          <span style={{ color: "var(--text-secondary)" }}>
            env <b style={{ color: "var(--text-primary)" }}>{uat.env}</b>
            {" · "}sha <code className="t-mono-sm">{uat.sha}</code>
          </span>
          <span style={{ marginLeft: "auto", color: "var(--text-tertiary)", fontSize: 11 }}>{uat.note}</span>
        </div>
      )}
    </div>
  );
}

function shortPath(p) {
  if (!p) return "—";
  if (p.length <= 32) return p;
  const parts = p.split("/");
  if (parts.length <= 2) return p;
  return parts[0] + "/…/" + parts[parts.length - 1];
}

// -------------------------------------------------------------------
// ActionButton — guarded CLI-backed action affordance.
//
//   The cockpit's GOLDEN RULE: every action button maps 1:1 to a CLI
//   command family. The UI sends a request; the CLI validates and
//   performs. UI never owns canonical state.
//
//   PROPS:
//     label        — short verb
//     command      — CLI command preview (mono, displayed under label)
//     variant      — "primary" | "default"
//     glyph        — single-char glyph
//     disabled     — bool
//     reason       — short text shown ONLY when disabled
//     ownerRole    — when reason is "operator-only" or role-bound
// -------------------------------------------------------------------
function ActionButton({ label, command, variant = "default", glyph = "›", disabled = false, reason, ownerRole }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0 }}>
      <button
        type="button"
        className="cp-action"
        data-variant={variant}
        data-disabled={disabled ? "true" : "false"}
        aria-disabled={disabled}
        disabled={disabled}
      >
        <span className="cp-action-glyph">{glyph}</span>
        <span className="cp-action-body">
          <span>{label}</span>
          <span className="cp-action-cmd">{command}</span>
        </span>
      </button>
      {disabled && reason && (
        <span className="cp-action-reason" data-kind={ownerRole ? "info" : "fail"}>
          <span className="cp-dot" style={{ background: ownerRole ? "var(--blue-400)" : "var(--state-fail)" }} />
          {ownerRole ? <span><b style={{ color: "var(--text-secondary)" }}>{ownerRole} only</b> · {reason}</span> : <span>{reason}</span>}
        </span>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// SectionH — within-screen subhead
// -------------------------------------------------------------------
function SectionH({ kicker, children, sub }) {
  return (
    <div className="cp-section-h">
      {kicker && <span className="cp-band-title-kicker">{kicker}</span>}
      <h2>{children}</h2>
      {sub && <span className="cp-sub">· {sub}</span>}
    </div>
  );
}

// -------------------------------------------------------------------
// Topbar — common cockpit header.
// -------------------------------------------------------------------
function Topbar({ context, tweak }) {
  return (
    <header className="cp-topbar">
      <div className="cp-brand">
        <span className="cp-brand-mark" aria-hidden="true" />
        <span>Bandit</span>
        <span className="cp-brand-sub">Workflow Cockpit</span>
      </div>
      <span className="cp-repo-pill">
        <span className="cp-dot" style={{ background: "var(--state-pass)" }} />
        <span>{context.repo}</span>
      </span>
      <span className="cp-repo-pill">
        <span style={{ color: "var(--text-tertiary)" }}>HEAD</span>
        <code style={{ color: "var(--code-fg)" }}>{context.head}</code>
        <span style={{ color: "var(--text-tertiary)" }}>· {context.headAge}</span>
      </span>
      <div className="cp-topbar-meta">
        <span>{context.phase}</span>
        <span style={{ color: "var(--accent)" }}>● live</span>
      </div>
    </header>
  );
}

// -------------------------------------------------------------------
// Confidence transform — used by Tweaks to swap displayed evidence
// state without forking the data tree.
//
//   confidence = "clean"        — no transform
//   confidence = "stale"        — passes become stale
//   confidence = "failclosed"   — passes become fail; missing stays missing
//
//   IMPORTANT: this is a UI demonstration so reviewers can see every
//   cue. In production, the view-model never transforms — it renders
//   whatever the CLI payload says. Keeping the transform here makes it
//   obvious that the UI cannot decide confidence.
// -------------------------------------------------------------------
function makeConfidenceTransform(confidence) {
  if (confidence === "clean" || !confidence) return null;
  return (chip) => {
    if (!chip || !chip.state) return chip;
    if (chip.state === "pass") {
      if (confidence === "stale")      return { ...chip, state: "stale", text: chip.text };
      if (confidence === "failclosed") return { ...chip, state: "fail",  text: chip.text };
    }
    if (chip.state === "progress" && confidence === "failclosed") {
      return { ...chip, state: "fail", text: chip.text };
    }
    return chip;
  };
}

// -------------------------------------------------------------------
// AnnoNote — design annotation visible to the implementation agent
//   audience. Inline (no overlap), dotted amber, lowercase mono header.
// -------------------------------------------------------------------
function AnnoNote({ kind = "view-model", children }) {
  return (
    <aside className="cp-note">
      <b>{kind}</b>
      {children}
    </aside>
  );
}

// -------------------------------------------------------------------
// Card — generic cockpit panel container.
// -------------------------------------------------------------------
function Card({ title, kicker, right, children, style }) {
  return (
    <div className="cp-card" style={style}>
      <div className="cp-card-title">
        {kicker && <span className="cp-card-title-kicker">{kicker}</span>}
        <span className="cp-card-title-text">{title}</span>
        <div style={{ marginLeft: "auto" }}>{right}</div>
      </div>
      {children}
    </div>
  );
}

// Expose for sibling Babel scripts.
Object.assign(window, {
  Chip, MonoPath, TraceLine, TypePill, AttentionBand, AttentionRow,
  GateStrip, ActionButton, SectionH, Topbar, AnnoNote, Card,
  makeConfidenceTransform, shortPath
});
