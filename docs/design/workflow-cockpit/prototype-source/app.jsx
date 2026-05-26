// app.jsx — entry point. Composes the design canvas + tweaks panel +
// each screen as its own artboard inside DesignCanvas.
//
// LAYOUT:
//   Section 1: "Cockpit" — the primary screens (home, detail, landing,
//              improvement, operator-inbox, queue/context)
//   Section 2: "Drill-downs & patterns" — evidence drill-down + action
//              affordance / fail-closed catalogs
//
// TWEAKS exposed (all four per operator request):
//   activeItem  — which work item drives the WorkItemDetail screen
//   confidence  — clean / stale / fail-closed — global evidence transform
//   density     — calm / dense
//   accent      — coral (default) / beam / amber

const {
  DesignCanvas, DCSection, DCArtboard,
  TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect,
  AttentionHome, WorkItemDetail, LandingReadiness, ImprovementHealth,
  OperatorInboxSurface, QueueContext, EvidenceDrilldown, PatternsCatalog,
  COCKPIT_DATA
} = window;

const FALLBACK_TWEAK_DEFAULTS = {
  activeItem: "BANDIT-034",
  confidence: "clean",
  density: "calm",
  accent: "coral"
};

const EMPTY_COCKPIT_DATA = {
  context: {},
  items: {},
  bands: [],
  smells: [],
  improvements: [],
  inbox: [],
  stream: []
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeCockpitData(value) {
  if (!isRecord(value)) return EMPTY_COCKPIT_DATA;

  return {
    ...EMPTY_COCKPIT_DATA,
    ...value,
    context: isRecord(value.context) ? value.context : {},
    items: isRecord(value.items) ? value.items : {},
    bands: Array.isArray(value.bands) ? value.bands : [],
    smells: Array.isArray(value.smells) ? value.smells : [],
    improvements: Array.isArray(value.improvements) ? value.improvements : [],
    inbox: Array.isArray(value.inbox) ? value.inbox : [],
    stream: Array.isArray(value.stream) ? value.stream : []
  };
}

function normalizeTweakDefaults(value, data) {
  const firstItem = Object.keys(data.items)[0] || FALLBACK_TWEAK_DEFAULTS.activeItem;
  const candidate = isRecord(value) ? value : {};
  const activeItem = typeof candidate.activeItem === "string" && data.items[candidate.activeItem]
    ? candidate.activeItem
    : firstItem;

  return {
    ...FALLBACK_TWEAK_DEFAULTS,
    ...candidate,
    activeItem
  };
}

function App() {
  const data = normalizeCockpitData(COCKPIT_DATA);
  const [tweak, setTweak] = useTweaks(normalizeTweakDefaults(window.COCKPIT_TWEAK_DEFAULTS, data));

  // Item options for the activeItem tweak — labels come from real data.
  const itemOptions = Object.keys(data.items).map((id) => ({
    value: id,
    label: id + " · " + (data.items[id]?.attention || "unknown")
  }));

  return (
    <React.Fragment>
      <DesignCanvas>

        {/* SECTION 1 — primary cockpit surfaces */}
        <DCSection
          id="cockpit"
          title="Bandit Cockpit — Attention-First Workflow Cockpit"
          subtitle="Bandit palette + type · Attention Bands · Gate Strip · Guarded actions"
        >
          <DCArtboard id="home" label="01 · Attention-first home" width={1320} height={1880}>
            <AttentionHome data={data} tweak={tweak} />
          </DCArtboard>

          <DCArtboard id="work-item" label="02 · Active Work Item detail" width={1320} height={1480}>
            <WorkItemDetail data={data} tweak={tweak} />
          </DCArtboard>

          <DCArtboard id="landing" label="03 · Landing readiness · dual-track" width={1320} height={1080}>
            <LandingReadiness data={data} tweak={tweak} />
          </DCArtboard>

          <DCArtboard id="improvement" label="04 · Improvement health" width={1320} height={1080}>
            <ImprovementHealth data={data} tweak={tweak} />
          </DCArtboard>

          <DCArtboard id="inbox" label="05 · Operator Inbox surface" width={780} height={1080}>
            <OperatorInboxSurface data={data} tweak={tweak} />
          </DCArtboard>

          <DCArtboard id="queue" label="06 · Queue & context (light)" width={780} height={1080}>
            <QueueContext data={data} tweak={tweak} />
          </DCArtboard>
        </DCSection>

        {/* SECTION 2 — drill-downs and patterns */}
        <DCSection
          id="patterns"
          title="Drill-downs & patterns"
          subtitle="One level down from the cockpit · shallow, source-linked, never canonical"
        >
          <DCArtboard id="evidence" label="07 · Evidence drill-down" width={1320} height={1080}>
            <EvidenceDrilldown data={data} tweak={tweak} />
          </DCArtboard>

          <DCArtboard id="patterns-catalog" label="08 · Action affordance & confidence cues" width={1320} height={1320}>
            <PatternsCatalog data={data} tweak={tweak} />
          </DCArtboard>
        </DCSection>

      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Active Work Item">
          <TweakSelect
            label="Item shown in detail"
            value={tweak.activeItem}
            options={itemOptions}
            onChange={(v) => setTweak("activeItem", v)}
          />
        </TweakSection>

        <TweakSection label="Evidence confidence">
          <TweakRadio
            label="Global state"
            value={tweak.confidence}
            options={[
              { value: "clean",      label: "Clean" },
              { value: "stale",      label: "Stale" },
              { value: "failclosed", label: "Fail" }
            ]}
            onChange={(v) => setTweak("confidence", v)}
          />
        </TweakSection>

        <TweakSection label="Density">
          <TweakRadio
            label="Spacing"
            value={tweak.density}
            options={[
              { value: "calm",  label: "Calm" },
              { value: "dense", label: "Dense" }
            ]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>

        <TweakSection label="Accent">
          <TweakRadio
            label="Hue"
            value={tweak.accent}
            options={[
              { value: "coral", label: "Coral" },
              { value: "beam",  label: "Beam" },
              { value: "amber", label: "Amber" }
            ]}
            onChange={(v) => setTweak("accent", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
