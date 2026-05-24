import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseConfig } from "../state/config.js";
import { appendLifecycleEvent } from "../state/events.js";
import { getBanditPaths } from "../state/paths.js";

type SourcePrd = {
  id: string;
  displayPath: string;
};

type DraftEnvelope = {
  items: unknown[];
};

type DraftKind = "slice" | "chore" | "improvement_chore";

type BaseDraftItem = {
  kind: DraftKind;
  title: string;
  scope: string[];
  acceptanceCriteria: string[];
  expectedFiles: string[];
  requiredEvidence: string[];
  operatorInputStatus: string;
};

type SliceDraftItem = BaseDraftItem & {
  kind: "slice";
  goal: string;
  outOfScope: string[];
  testPlan: string[];
  cleanCodeReadEvidence: string;
  stageRubricChecklist: string[];
  bootstrapGaps: string[];
  firstImplementationOrder: string[];
  smellTriggers: string[];
};

type ChoreDraftItem = BaseDraftItem & {
  kind: "chore" | "improvement_chore";
  nonProductWork: string;
  origin: string;
  verificationPlan: string[];
  improvement?: ImprovementMetadata;
};

type DraftItem = SliceDraftItem | ChoreDraftItem;

type ImprovementMetadata = {
  origin: string;
  sourceWorkItem: string;
  sourceArtifacts: string[];
  lesson: string;
  hypothesis: string;
  metric: string;
  baseline: string;
  expectedDirection: string;
  evaluationWindow: string;
  status: string;
  outcome: string;
};

type PlannedDraft = {
  id: string;
  briefDisplayPath: string;
  briefPath: string;
  workDir: string;
  content: string;
};

const FEATURE_PRD_REQUIRED_SECTIONS = [
  "Problem",
  "User",
  "Goals",
  "Non-Goals",
  "Stories Or Workflows",
  "Acceptance Criteria",
  "Out Of Scope",
  "Test Or Verification Strategy",
  "Decomposition Notes"
];

const DRAFT_ITEM_KINDS = new Set(["slice", "chore", "improvement_chore"]);

const IMPROVEMENT_FIELDS = [
  "origin",
  "source_work_item",
  "source_artifacts",
  "lesson",
  "hypothesis",
  "metric",
  "baseline",
  "expected_direction",
  "evaluation_window",
  "status",
  "outcome"
];

export async function draftWork(repoRoot: string, featurePrdPath?: string) {
  if (!featurePrdPath) {
    throw new Error("Usage: bandit draft-work <feature-prd-path>");
  }

  const config = parseConfig(
    await readRequiredStateFile(
      getBanditPaths(repoRoot).config,
      ".bandit/config.toml"
    )
  );
  const prdLocation = resolveRepoPath(repoRoot, featurePrdPath);
  const prdContent = await readFeaturePrd(
    prdLocation.absolutePath,
    prdLocation.displayPath
  );
  const sourcePrd = parseSourcePrd(prdContent, prdLocation.displayPath);
  const draftEnvelope = parseDraftEnvelope(prdContent);
  const draftItems = validateDraftItems(draftEnvelope);
  const nextIds = await allocateWorkItemIds(
    repoRoot,
    config.workItemPrefix,
    draftItems.length
  );
  const plannedDrafts = draftItems.map((item, index) => {
    const nextId = nextIds[index];

    if (!nextId) {
      throw new Error("Internal draft ID allocation failed");
    }

    return planDraft(repoRoot, sourcePrd, nextId, item);
  });

  await assertOutputPathsAreFree(plannedDrafts);
  await writeDrafts(plannedDrafts);
  await appendDraftEvents(repoRoot, sourcePrd.id, plannedDrafts);

  return {
    output: plannedDrafts
      .map(
        (draft) =>
          `Created work item draft: ${draft.id} ${draft.briefDisplayPath}`
      )
      .join("\n")
      .concat("\n")
  };
}

async function readRequiredStateFile(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required state: ${displayPath}`);
    }
    throw error;
  }
}

function resolveRepoPath(repoRoot: string, inputPath: string) {
  const absolutePath = path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(repoRoot, inputPath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(
      `Feature PRD path must stay within repository: ${inputPath}`
    );
  }

  return {
    absolutePath,
    displayPath: normalizeDisplayPath(relativePath)
  };
}

async function readFeaturePrd(filePath: string, displayPath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Feature PRD not found: ${displayPath}`);
    }
    throw error;
  }
}

function parseSourcePrd(content: string, displayPath: string): SourcePrd {
  const header = content.match(/^# (BANDIT-PRD-\d+): .+$/m);

  if (!header) {
    throw new Error("Malformed Feature PRD: missing ID-bearing H1");
  }

  for (const section of FEATURE_PRD_REQUIRED_SECTIONS) {
    if (!hasHeading(content, section)) {
      throw new Error(
        `Malformed Feature PRD: missing required section: ${section}`
      );
    }
  }

  const prdId = header[1];

  if (!prdId) {
    throw new Error("Malformed Feature PRD: missing ID-bearing H1");
  }

  return {
    id: prdId,
    displayPath
  };
}

function parseDraftEnvelope(content: string): DraftEnvelope {
  const decompositionNotes = readSection(content, "Decomposition Notes");
  const blockMatches = [
    ...decompositionNotes.matchAll(
      /```bandit-work-draft(?:\r?\n)([\s\S]*?)(?:\r?\n)```/g
    )
  ];

  if (blockMatches.length === 0) {
    throw new Error("Missing required decomposition block: bandit-work-draft");
  }

  if (blockMatches.length > 1) {
    throw new Error("Expected exactly one bandit-work-draft block");
  }

  let parsed: unknown;
  try {
    const draftBlock = blockMatches[0];
    parsed = JSON.parse(draftBlock?.[1] ?? "");
  } catch {
    throw new Error("Malformed bandit-work-draft JSON");
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.items)) {
    throw new Error("Malformed bandit-work-draft: expected items array");
  }

  if (parsed.items.length === 0) {
    throw new Error("Malformed bandit-work-draft: items array must not be empty");
  }

  return { items: parsed.items };
}

function validateDraftItems(draftEnvelope: DraftEnvelope): DraftItem[] {
  return draftEnvelope.items.map((rawItem, index) =>
    validateDraftItem(rawItem, index + 1)
  );
}

function validateDraftItem(rawItem: unknown, itemNumber: number): DraftItem {
  if (!isRecord(rawItem)) {
    throw new Error(`Draft item ${itemNumber} must be an object`);
  }

  const kind = requireKind(rawItem, itemNumber);

  if (kind === "slice") {
    return {
      kind,
      title: requireString(rawItem, "title", itemNumber),
      goal: requireString(rawItem, "goal", itemNumber),
      scope: requireStringList(rawItem, "scope", itemNumber),
      outOfScope: requireStringList(rawItem, "out_of_scope", itemNumber),
      acceptanceCriteria: requireStringList(
        rawItem,
        "acceptance_criteria",
        itemNumber
      ),
      testPlan: requireStringList(rawItem, "test_plan", itemNumber),
      cleanCodeReadEvidence: requireString(
        rawItem,
        "clean_code_read_evidence",
        itemNumber
      ),
      stageRubricChecklist: requireChecklist(
        rawItem,
        "stage_rubric_checklist",
        itemNumber
      ),
      bootstrapGaps: requireStringList(rawItem, "bootstrap_gaps", itemNumber),
      expectedFiles: requireStringList(rawItem, "expected_files", itemNumber),
      firstImplementationOrder: requireStringList(
        rawItem,
        "first_implementation_order",
        itemNumber
      ),
      smellTriggers: requireStringList(rawItem, "smell_triggers", itemNumber),
      requiredEvidence: requireStringList(
        rawItem,
        "required_evidence",
        itemNumber
      ),
      operatorInputStatus: requireString(
        rawItem,
        "operator_input_status",
        itemNumber
      )
    };
  }

  const choreDraft: ChoreDraftItem = {
    kind,
    title: requireString(rawItem, "title", itemNumber),
    nonProductWork: requireString(rawItem, "non_product_work", itemNumber),
    origin: requireString(rawItem, "origin", itemNumber),
    scope: requireStringList(rawItem, "scope", itemNumber),
    acceptanceCriteria: requireStringList(
      rawItem,
      "acceptance_criteria",
      itemNumber
    ),
    verificationPlan: requireStringList(
      rawItem,
      "verification_plan",
      itemNumber
    ),
    expectedFiles: requireStringList(rawItem, "expected_files", itemNumber),
    requiredEvidence: requireStringList(
      rawItem,
      "required_evidence",
      itemNumber
    ),
    operatorInputStatus: requireString(
      rawItem,
      "operator_input_status",
      itemNumber
    )
  };

  if (kind === "improvement_chore") {
    choreDraft.improvement = requireImprovementMetadata(rawItem, itemNumber);
  }

  return choreDraft;
}

function requireKind(item: Record<string, unknown>, itemNumber: number) {
  const rawKind = item.kind;

  if (typeof rawKind !== "string" || rawKind.trim().length === 0) {
    throw new Error(`Draft item ${itemNumber} missing required field: kind`);
  }

  if (!DRAFT_ITEM_KINDS.has(rawKind)) {
    throw new Error(`Unsupported draft item kind: ${rawKind}`);
  }

  return rawKind as DraftKind;
}

function requireImprovementMetadata(
  item: Record<string, unknown>,
  itemNumber: number
): ImprovementMetadata {
  const improvement = item.improvement;

  if (!isRecord(improvement)) {
    throw new Error(
      `Draft item ${itemNumber} missing required field: improvement`
    );
  }

  for (const field of IMPROVEMENT_FIELDS) {
    const value = improvement[field];
    const validValue =
      field === "source_artifacts"
        ? isNonEmptyStringList(value)
        : typeof value === "string" && value.trim().length > 0;

    if (!validValue) {
      throw new Error(
        `Draft item ${itemNumber} missing required improvement metadata: ${field}`
      );
    }
  }

  return {
    origin: improvement.origin as string,
    sourceWorkItem: improvement.source_work_item as string,
    sourceArtifacts: improvement.source_artifacts as string[],
    lesson: improvement.lesson as string,
    hypothesis: improvement.hypothesis as string,
    metric: improvement.metric as string,
    baseline: improvement.baseline as string,
    expectedDirection: improvement.expected_direction as string,
    evaluationWindow: improvement.evaluation_window as string,
    status: improvement.status as string,
    outcome: improvement.outcome as string
  };
}

async function allocateWorkItemIds(
  repoRoot: string,
  workItemPrefix: string,
  count: number
) {
  const existingNumbers = await readExistingWorkItemNumbers(
    path.join(repoRoot, "docs/work"),
    workItemPrefix
  );
  const startAt = existingNumbers.length === 0 ? 1 : Math.max(...existingNumbers) + 1;

  return Array.from({ length: count }, (_, index) =>
    formatWorkItemId(workItemPrefix, startAt + index)
  );
}

async function readExistingWorkItemNumbers(workRoot: string, workItemPrefix: string) {
  try {
    const entries = await readdir(workRoot, { withFileTypes: true });
    const workItemPattern = new RegExp(`^${escapeRegExp(workItemPrefix)}-(\\d+)$`);

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name.match(workItemPattern)?.[1])
      .filter((numberText): numberText is string => typeof numberText === "string")
      .map((numberText) => Number.parseInt(numberText, 10))
      .filter((number) => Number.isInteger(number));
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }
    throw error;
  }
}

function planDraft(
  repoRoot: string,
  sourcePrd: SourcePrd,
  id: string,
  item: DraftItem
): PlannedDraft {
  const briefDisplayPath = normalizeDisplayPath(
    path.join("docs/work", id, "brief.md")
  );
  const workDir = path.join(repoRoot, "docs/work", id);

  return {
    id,
    briefDisplayPath,
    briefPath: path.join(workDir, "brief.md"),
    workDir,
    content:
      item.kind === "slice"
        ? renderSliceBrief(id, item, sourcePrd)
        : renderChoreBrief(id, item, sourcePrd)
  };
}

async function assertOutputPathsAreFree(plannedDrafts: PlannedDraft[]) {
  for (const draft of plannedDrafts) {
    if (await pathExists(draft.workDir)) {
      throw new Error(
        `Refusing to overwrite existing work item path: ${normalizeDisplayPath(
          path.join("docs/work", draft.id)
        )}`
      );
    }
  }
}

async function writeDrafts(plannedDrafts: PlannedDraft[]) {
  for (const draft of plannedDrafts) {
    await mkdir(path.dirname(draft.workDir), { recursive: true });
    await mkdir(draft.workDir, { recursive: false });
    await writeFile(draft.briefPath, draft.content, { flag: "wx" });
  }
}

async function appendDraftEvents(
  repoRoot: string,
  sourcePrdId: string,
  plannedDrafts: PlannedDraft[]
) {
  const eventsPath = getBanditPaths(repoRoot).events;

  for (const draft of plannedDrafts) {
    await appendLifecycleEvent(eventsPath, {
      type: "work_item_drafted",
      work_item: draft.id,
      message: `Drafted work item ${draft.id} from ${sourcePrdId}`
    });
  }
}

function renderSliceBrief(
  id: string,
  item: SliceDraftItem,
  sourcePrd: SourcePrd
) {
  return `# ${id}: ${item.title}

## Status

Draft

Source PRD: ${sourcePrd.id}
Source PRD Path: ${sourcePrd.displayPath}

## Goal

${item.goal}

## Scope

${renderList(item.scope, id)}

## Out Of Scope

${renderList(item.outOfScope, id)}

## Acceptance Criteria

${renderList(item.acceptanceCriteria, id)}

## Test Plan

${renderList(item.testPlan, id)}

## CLEAN_CODE.md Read Evidence

${item.cleanCodeReadEvidence}

## Stage-Rubric Checklist

${renderList(item.stageRubricChecklist, id)}

## Bootstrap Gaps

${renderList(item.bootstrapGaps, id)}

## Expected Files

${renderList(item.expectedFiles, id)}

## First Implementation Order

${renderList(item.firstImplementationOrder, id)}

## Smell Triggers

${renderList(item.smellTriggers, id)}

## Required Evidence

${renderList(item.requiredEvidence, id)}

## Operator Input Status

${item.operatorInputStatus}
`;
}

function renderChoreBrief(
  id: string,
  item: ChoreDraftItem,
  sourcePrd: SourcePrd
) {
  const improvementMetadata = item.improvement
    ? `\n${renderImprovementMetadata(item.improvement)}`
    : "";

  return `# ${id}: ${item.title}

## Status

Draft

Source PRD: ${sourcePrd.id}
Source PRD Path: ${sourcePrd.displayPath}

## Non-Product Work

${item.nonProductWork}

## Origin

${item.origin}${improvementMetadata}

## Scope

${renderList(item.scope, id)}

## Acceptance Criteria

${renderList(item.acceptanceCriteria, id)}

## Verification Plan

${renderList(item.verificationPlan, id)}

## Expected Files

${renderList(item.expectedFiles, id)}

## Required Evidence

${renderList(item.requiredEvidence, id)}

## Operator Input Status

${item.operatorInputStatus}
`;
}

function renderImprovementMetadata(improvement: ImprovementMetadata) {
  return `
origin: ${improvement.origin}
source_work_item: ${improvement.sourceWorkItem}
source_artifacts:
${improvement.sourceArtifacts.map((artifact) => `  - ${artifact}`).join("\n")}
lesson: ${improvement.lesson}
hypothesis: ${improvement.hypothesis}
metric: ${improvement.metric}
baseline: ${improvement.baseline}
expected_direction: ${improvement.expectedDirection}
evaluation_window: ${improvement.evaluationWindow}
status: ${improvement.status}
outcome: ${improvement.outcome}`;
}

function requireString(
  item: Record<string, unknown>,
  field: string,
  itemNumber: number
) {
  const value = item[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Draft item ${itemNumber} missing required field: ${field}`);
  }

  return value;
}

function requireStringList(
  item: Record<string, unknown>,
  field: string,
  itemNumber: number
) {
  const value = item[field];

  if (!isNonEmptyStringList(value)) {
    throw new Error(`Draft item ${itemNumber} missing required field: ${field}`);
  }

  return value;
}

function requireChecklist(
  item: Record<string, unknown>,
  field: string,
  itemNumber: number
) {
  const value = item[field];

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Draft item ${itemNumber} missing required field: ${field}`);
  }

  return value.map((entry) => formatChecklistEntry(entry, itemNumber, field));
}

function formatChecklistEntry(
  entry: unknown,
  itemNumber: number,
  field: string
) {
  if (typeof entry === "string" && entry.trim().length > 0) {
    return entry;
  }

  if (!isRecord(entry)) {
    throw new Error(`Draft item ${itemNumber} missing required field: ${field}`);
  }

  const stage = requireString(entry, "stage", itemNumber);
  const verdict = requireString(entry, "verdict", itemNumber);
  const evidence = requireString(entry, "evidence", itemNumber);
  return `${stage} | ${verdict} | ${evidence}`;
}

function renderList(items: string[], id: string) {
  return items.map((item) => `- ${item.replaceAll("<ID>", id)}`).join("\n");
}

function readSection(content: string, headingText: string) {
  const headingPattern = new RegExp(`^## ${escapeRegExp(headingText)}$`, "m");
  const headingMatch = content.match(headingPattern);

  if (!headingMatch || typeof headingMatch.index !== "number") {
    return "";
  }

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const sectionContent = content.slice(sectionStart).replace(/^\r?\n/, "");
  const nextHeadingIndex = sectionContent.search(/^## /m);

  if (nextHeadingIndex === -1) {
    return sectionContent;
  }

  return sectionContent.slice(0, nextHeadingIndex);
}

function hasHeading(content: string, headingText: string) {
  return new RegExp(`^## ${escapeRegExp(headingText)}$`, "m").test(content);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyStringList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

function formatWorkItemId(workItemPrefix: string, workItemNumber: number) {
  return `${workItemPrefix}-${String(workItemNumber).padStart(3, "0")}`;
}

function normalizeDisplayPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
