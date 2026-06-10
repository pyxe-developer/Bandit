import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const CURRENT_CONTEXT_PATH = "docs/roadmap/CURRENT_CONTEXT.md";
const ROADMAP_PATH = "docs/roadmap/ROADMAP.md";
const LEDGER_PATH = ".bandit/work-intake-ledger.json";

export type ProvenancePointer = {
  class: "spec" | "prd" | "wil";
  id: string;
  path: string;
};

export type WorkTarget = {
  id: string;
  title: string;
  work_type: string;
  status: string;
  relationship: "current" | "next";
  source_artifacts: string[];
  provenance_pointers: ProvenancePointer[];
};

export type RoadmapWorkTargetResolution = {
  kind: "roadmap_work_target_resolution";
  authority: "derived_non_canonical";
  target: WorkTarget;
  reconciliation: { status: "pass" };
  hidden_scheduler_used: false;
  stale_tail_status?: "ignored";
};

export type ResolveResult =
  | { ok: true; resolution: RoadmapWorkTargetResolution }
  | { ok: false; diagnostic: string };

type ParsedCurrentContext = {
  activeWorkItemId: string | null;
  hasHistoricalTail: boolean;
};

type RoadmapItem = {
  id: string;
  title: string;
  workType: string;
  status: string;
};

type ParsedRoadmap = {
  currentItem: RoadmapItem | null;
  nextItem: RoadmapItem | null;
};

function extractSection(content: string, header: string): string | null {
  const headerIndex = content.indexOf(header);
  if (headerIndex === -1) return null;
  const afterHeader = content.slice(headerIndex + header.length);
  const nextHeaderIndex = afterHeader.search(/^##\s/m);
  return nextHeaderIndex === -1 ? afterHeader : afterHeader.slice(0, nextHeaderIndex);
}

function parseRoadmapItem(sectionContent: string): RoadmapItem | null {
  const itemMatch = sectionContent.match(/- `\[(Slice|Gap)\]` `([^`]+)` - (.+)/);
  if (!itemMatch || !itemMatch[2] || !itemMatch[3]) return null;
  const workType = (itemMatch[1] ?? "slice").toLowerCase();
  const id = itemMatch[2];
  const title = itemMatch[3].trim().replace(/,\s*$/, "").trim();
  const statusMatch = sectionContent.match(/\(Stage \d+: ([^)]+)\)/);
  const status = statusMatch && statusMatch[1] ? statusMatch[1] : "not_yet_formed";
  return { id, title, workType, status };
}

function parseRoadmap(content: string): ParsedRoadmap {
  const currentSection = extractSection(content, "## Current Work Item");
  const nextSection = extractSection(content, "## Next Work Item");
  return {
    currentItem: currentSection ? parseRoadmapItem(currentSection) : null,
    nextItem: nextSection ? parseRoadmapItem(nextSection) : null
  };
}

function parseCurrentContext(content: string): ParsedCurrentContext {
  const hasHistoricalTail = /^## Historical Tail/m.test(content);
  const mainContent: string = hasHistoricalTail
    ? content.split(/^## Historical Tail/m)[0] ?? ""
    : content;

  if (/No active work item is currently formed\./.test(mainContent)) {
    return { activeWorkItemId: null, hasHistoricalTail };
  }

  const activeMatch = mainContent.match(/\*\*Active work item:\*\* `([^`]+)`/);
  return {
    activeWorkItemId: activeMatch && activeMatch[1] ? activeMatch[1] : null,
    hasHistoricalTail
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findSpecForWorkItem(
  repoRoot: string,
  workItemId: string
): Promise<{ id: string; prdId: string | null; specPath: string } | null> {
  const specsDir = path.join(repoRoot, "docs/specs");
  let files: string[];
  try {
    files = await readdir(specsDir);
  } catch {
    return null;
  }
  const prefix = `${workItemId}-`;
  const specFile = files.find((f) => f.startsWith(prefix) && f.endsWith(".json"));
  if (!specFile) return null;
  const specRelPath = `docs/specs/${specFile}`;
  const raw = await readFile(path.join(repoRoot, specRelPath), "utf8");
  const spec = JSON.parse(raw) as { id?: string; prd?: string };
  return {
    id: spec.id ?? specFile.replace(/\.json$/, ""),
    prdId: spec.prd ?? null,
    specPath: specRelPath
  };
}

async function findPrdPath(repoRoot: string, prdId: string): Promise<string | null> {
  const prdsDir = path.join(repoRoot, "docs/prds");
  let files: string[];
  try {
    files = await readdir(prdsDir);
  } catch {
    return null;
  }
  const exactPrefix = `${prdId}-`;
  const exactMatch = files.find((f) => f.startsWith(exactPrefix));
  if (exactMatch) return `docs/prds/${exactMatch}`;

  const dotIndex = prdId.lastIndexOf(".");
  if (dotIndex !== -1) {
    const parentId = prdId.slice(0, dotIndex);
    const parentMatch = files.find((f) => f.startsWith(`${parentId}-`));
    if (parentMatch) return `docs/prds/${parentMatch}`;
  }
  return null;
}

function extractPrdId(title: string): string | null {
  const match = title.match(/\bPRD-(\d+(?:\.\d+)?)\b/);
  return match ? `BANDIT-PRD-${match[1]}` : null;
}

async function findWilEntry(
  repoRoot: string,
  title: string
): Promise<{ id: string } | null> {
  const ledgerPath = path.join(repoRoot, LEDGER_PATH);
  let ledger: { entries: Array<{ id: string; title: string }> };
  try {
    const raw = await readFile(ledgerPath, "utf8");
    ledger = JSON.parse(raw);
  } catch {
    return null;
  }
  const entry = ledger.entries.find((e) => e.title === title);
  return entry ? { id: entry.id } : null;
}

async function buildCurrentTarget(repoRoot: string, item: RoadmapItem): Promise<WorkTarget> {
  const sourceArtifacts: string[] = [];
  const briefRelPath = `docs/work/${item.id}/brief.md`;
  if (await fileExists(path.join(repoRoot, briefRelPath))) {
    sourceArtifacts.push(briefRelPath);
  }
  sourceArtifacts.push(CURRENT_CONTEXT_PATH);
  sourceArtifacts.push(ROADMAP_PATH);

  const provenancePointers: ProvenancePointer[] = [];
  const spec = await findSpecForWorkItem(repoRoot, item.id);
  if (spec) {
    provenancePointers.push({ class: "spec", id: spec.id, path: spec.specPath });
    if (spec.prdId) {
      const prdPath = await findPrdPath(repoRoot, spec.prdId);
      if (prdPath) {
        provenancePointers.push({ class: "prd", id: spec.prdId, path: prdPath });
      }
    }
  }

  return {
    id: item.id,
    title: item.title,
    work_type: item.workType,
    status: item.status,
    relationship: "current",
    source_artifacts: sourceArtifacts,
    provenance_pointers: provenancePointers
  };
}

async function buildNextTarget(repoRoot: string, item: RoadmapItem): Promise<WorkTarget> {
  const provenancePointers: ProvenancePointer[] = [];

  const prdId = extractPrdId(item.title);
  if (prdId) {
    const prdPath = await findPrdPath(repoRoot, prdId);
    if (prdPath) {
      provenancePointers.push({ class: "prd", id: prdId, path: prdPath });
    }
  } else {
    const wilEntry = await findWilEntry(repoRoot, item.title);
    if (wilEntry) {
      provenancePointers.push({ class: "wil", id: wilEntry.id, path: LEDGER_PATH });
    }
  }

  return {
    id: "TBD",
    title: item.title,
    work_type: item.workType,
    status: "not_yet_formed",
    relationship: "next",
    source_artifacts: [ROADMAP_PATH],
    provenance_pointers: provenancePointers
  };
}

export async function resolveRoadmapWorkTarget(repoRoot: string): Promise<ResolveResult> {
  let currentContextContent: string;
  let roadmapContent: string;
  try {
    currentContextContent = await readFile(
      path.join(repoRoot, CURRENT_CONTEXT_PATH),
      "utf8"
    );
  } catch {
    return {
      ok: false,
      diagnostic: `Roadmap work target blocked: ${CURRENT_CONTEXT_PATH} is not readable`
    };
  }
  try {
    roadmapContent = await readFile(path.join(repoRoot, ROADMAP_PATH), "utf8");
  } catch {
    return {
      ok: false,
      diagnostic: `Roadmap work target blocked: ${ROADMAP_PATH} is not readable`
    };
  }

  const parsedContext = parseCurrentContext(currentContextContent);
  const parsedRoadmap = parseRoadmap(roadmapContent);

  if (parsedRoadmap.currentItem !== null) {
    if (
      parsedContext.activeWorkItemId !== null &&
      parsedContext.activeWorkItemId !== parsedRoadmap.currentItem.id
    ) {
      return {
        ok: false,
        diagnostic:
          "Roadmap work target blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on authorized work target"
      };
    }

    const target = await buildCurrentTarget(repoRoot, parsedRoadmap.currentItem);
    const resolution: RoadmapWorkTargetResolution = {
      kind: "roadmap_work_target_resolution",
      authority: "derived_non_canonical",
      target,
      reconciliation: { status: "pass" },
      hidden_scheduler_used: false
    };
    if (parsedContext.hasHistoricalTail) {
      resolution.stale_tail_status = "ignored";
    }
    return { ok: true, resolution };
  }

  if (parsedRoadmap.nextItem === null) {
    return {
      ok: false,
      diagnostic:
        "Roadmap work target blocked: ROADMAP.md does not identify an authorized current or next work target"
    };
  }

  const target = await buildNextTarget(repoRoot, parsedRoadmap.nextItem);
  return {
    ok: true,
    resolution: {
      kind: "roadmap_work_target_resolution",
      authority: "derived_non_canonical",
      target,
      reconciliation: { status: "pass" },
      hidden_scheduler_used: false
    }
  };
}
