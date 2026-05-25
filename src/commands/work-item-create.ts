import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseConfig } from "../state/config.js";
import { appendLifecycleEvent } from "../state/events.js";
import { getBanditPaths } from "../state/paths.js";
import {
  type BootstrapGapLedger,
  parseBootstrapGapLedger
} from "../state/bootstrap-gaps.js";

type WorkItemKind = "slice" | "chore" | "improvement_chore";

type BaseWorkItemSpec = {
  kind: WorkItemKind;
  title: string;
  status: string;
  scope: string[];
  acceptanceCriteria: string[];
  expectedFiles: string[];
  requiredEvidence: string[];
  operatorInputStatus: string;
  bootstrapGap?: string;
};

type SliceWorkItemSpec = BaseWorkItemSpec & {
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

type ChoreWorkItemSpec = BaseWorkItemSpec & {
  kind: "chore" | "improvement_chore";
  nonProductWork: string;
  origin: string;
  verificationPlan: string[];
  improvement?: ImprovementMetadata;
};

type WorkItemSpec = SliceWorkItemSpec | ChoreWorkItemSpec;

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

type PlannedWorkItem = {
  id: string;
  displayPath: string;
  workDir: string;
  briefPath: string;
  content: string;
};

const SUPPORTED_KINDS = new Set(["slice", "chore", "improvement_chore"]);
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

export async function createWorkItem(repoRoot: string, args: string[]) {
  if (args[0] !== "create" || !args[1] || args.length !== 2) {
    throw new Error("Usage: bandit work-item create <spec-path>");
  }

  const specLocation = resolveRepoPath(repoRoot, args[1]);
  const config = parseConfig(
    await readRequiredFile(getBanditPaths(repoRoot).config, ".bandit/config.toml")
  );
  const rawSpec = await readSpec(specLocation.absolutePath, specLocation.displayPath);
  const spec = validateSpec(rawSpec);
  const id = await allocateNextWorkItemId(repoRoot, config.workItemPrefix);
  const plannedWorkItem = planWorkItem(repoRoot, id, spec);
  const nextGapLedger = spec.bootstrapGap
    ? await planBootstrapGapLink(repoRoot, spec.bootstrapGap, id)
    : null;

  await assertOutputPathIsFree(plannedWorkItem);
  await writePlannedWorkItem(plannedWorkItem);

  if (nextGapLedger) {
    await writeFile(
      getBanditPaths(repoRoot).bootstrapGaps,
      `${JSON.stringify(nextGapLedger, null, 2)}\n`,
      "utf8"
    );
  }

  await appendLifecycleEvent(getBanditPaths(repoRoot).events, {
    type: "work_item_created",
    work_item: id,
    message: `Created work item ${id} from ${specLocation.displayPath}`
  });

  return {
    output: `Created work item: ${id}\n${plannedWorkItem.displayPath}\n`
  };
}

async function readRequiredFile(filePath: string, displayPath: string) {
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
    throw new Error(`Work item spec path must stay within repository: ${inputPath}`);
  }

  return {
    absolutePath,
    displayPath: normalizeDisplayPath(relativePath)
  };
}

async function readSpec(filePath: string, displayPath: string) {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Work item spec not found: ${displayPath}`);
    }
    throw error;
  }

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error(`Malformed work item spec JSON: ${displayPath}`);
  }
}

function validateSpec(rawSpec: unknown): WorkItemSpec {
  if (!isRecord(rawSpec)) {
    throw new Error("Work item spec must be an object");
  }

  const kind = requireKind(rawSpec);
  const base = {
    kind,
    title: requireString(rawSpec, "title"),
    status: requireString(rawSpec, "status"),
    scope: requireStringList(rawSpec, "scope"),
    acceptanceCriteria: requireStringList(rawSpec, "acceptance_criteria"),
    expectedFiles: requireStringList(rawSpec, "expected_files"),
    requiredEvidence: requireStringList(rawSpec, "required_evidence"),
    operatorInputStatus: requireString(rawSpec, "operator_input_status"),
    bootstrapGap: optionalString(rawSpec.bootstrap_gap)
  };

  if (kind === "slice") {
    return {
      ...base,
      kind,
      goal: requireString(rawSpec, "goal"),
      outOfScope: requireStringList(rawSpec, "out_of_scope"),
      testPlan: requireStringList(rawSpec, "test_plan"),
      cleanCodeReadEvidence: requireString(
        rawSpec,
        "clean_code_read_evidence"
      ),
      stageRubricChecklist: requireChecklist(rawSpec, "stage_rubric_checklist"),
      bootstrapGaps: requireStringList(rawSpec, "bootstrap_gaps"),
      firstImplementationOrder: requireStringList(
        rawSpec,
        "first_implementation_order"
      ),
      smellTriggers: requireStringList(rawSpec, "smell_triggers")
    };
  }

  const choreSpec: ChoreWorkItemSpec = {
    ...base,
    kind,
    nonProductWork: requireString(rawSpec, "non_product_work"),
    origin: requireString(rawSpec, "origin"),
    verificationPlan: requireStringList(rawSpec, "verification_plan")
  };

  if (kind === "improvement_chore") {
    choreSpec.improvement = requireImprovementMetadata(rawSpec);
  }

  return choreSpec;
}

function requireKind(spec: Record<string, unknown>) {
  const kind = requireString(spec, "kind");

  if (!SUPPORTED_KINDS.has(kind)) {
    throw new Error(`Unsupported work item spec kind: ${kind}`);
  }

  return kind as WorkItemKind;
}

function requireImprovementMetadata(
  spec: Record<string, unknown>
): ImprovementMetadata {
  const improvement = spec.improvement;

  if (!isRecord(improvement)) {
    throw new Error("Work item spec missing required field: improvement");
  }

  for (const field of IMPROVEMENT_FIELDS) {
    const value = improvement[field];
    const valid =
      field === "source_artifacts"
        ? isNonEmptyStringList(value)
        : typeof value === "string" && value.trim().length > 0;

    if (!valid) {
      throw new Error(
        `Work item spec missing required improvement metadata: ${field}`
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

async function allocateNextWorkItemId(repoRoot: string, workItemPrefix: string) {
  const existingNumbers = await readExistingWorkItemNumbers(
    path.join(repoRoot, "docs/work"),
    workItemPrefix
  );
  const usedNumbers = new Set(existingNumbers);
  let nextNumber = 1;

  while (usedNumbers.has(nextNumber)) {
    nextNumber += 1;
  }

  return `${workItemPrefix}-${String(nextNumber).padStart(3, "0")}`;
}

async function readExistingWorkItemNumbers(
  workRoot: string,
  workItemPrefix: string
) {
  try {
    const entries = await readdir(workRoot, { withFileTypes: true });
    const pattern = new RegExp(`^${escapeRegExp(workItemPrefix)}-(\\d+)$`);

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name.match(pattern)?.[1])
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

function planWorkItem(
  repoRoot: string,
  id: string,
  spec: WorkItemSpec
): PlannedWorkItem {
  const displayPath = normalizeDisplayPath(path.join("docs/work", id, "brief.md"));
  const workDir = path.join(repoRoot, "docs/work", id);

  return {
    id,
    displayPath,
    workDir,
    briefPath: path.join(workDir, "brief.md"),
    content: spec.kind === "slice" ? renderSliceBrief(id, spec) : renderChoreBrief(id, spec)
  };
}

async function planBootstrapGapLink(
  repoRoot: string,
  gapId: string,
  workItemId: string
) {
  const paths = getBanditPaths(repoRoot);
  const ledger = parseBootstrapGapLedger(
    await readRequiredFile(paths.bootstrapGaps, ".bandit/bootstrap-gaps.json")
  );
  const gapIndex = ledger.gaps.findIndex((gap) => gap.id === gapId);
  const gap = ledger.gaps[gapIndex];

  if (
    gapIndex === -1 ||
    !gap ||
    gap.status !== "open" ||
    gap.linkedWorkItem !== ""
  ) {
    throw new Error(
      `Bootstrap gap ${gapId} is not eligible for work-item creation`
    );
  }

  const gaps = ledger.gaps.map((currentGap, index) =>
    index === gapIndex
      ? {
          ...currentGap,
          status: "active",
          disposition: "active_chore",
          linkedWorkItem: workItemId,
          nextAction: `Complete active chore ${workItemId}.`
        }
      : currentGap
  );

  return serializeBootstrapGapLedger({ version: 1, gaps });
}

async function assertOutputPathIsFree(plannedWorkItem: PlannedWorkItem) {
  if (await pathExists(plannedWorkItem.workDir)) {
    throw new Error(
      `Refusing to overwrite existing work item path: ${normalizeDisplayPath(
        path.join("docs/work", plannedWorkItem.id)
      )}`
    );
  }
}

async function writePlannedWorkItem(plannedWorkItem: PlannedWorkItem) {
  await mkdir(path.dirname(plannedWorkItem.workDir), { recursive: true });
  await mkdir(plannedWorkItem.workDir, { recursive: false });
  await writeFile(plannedWorkItem.briefPath, plannedWorkItem.content, {
    flag: "wx"
  });
}

function renderSliceBrief(id: string, spec: SliceWorkItemSpec) {
  return `# ${id}: ${spec.title}

## Status

${spec.status}

## Goal

${spec.goal}

## Scope

${renderList(spec.scope, id)}

## Out Of Scope

${renderList(spec.outOfScope, id)}

## Acceptance Criteria

${renderList(spec.acceptanceCriteria, id)}

## Test Plan

${renderList(spec.testPlan, id)}

## CLEAN_CODE.md Read Evidence

${spec.cleanCodeReadEvidence}

## Stage-Rubric Checklist

${renderList(spec.stageRubricChecklist, id)}

## Bootstrap Gaps

${renderList(spec.bootstrapGaps, id)}

## Expected Files

${renderList(spec.expectedFiles, id)}

## First Implementation Order

${renderList(spec.firstImplementationOrder, id)}

## Smell Triggers

${renderList(spec.smellTriggers, id)}

## Required Evidence

${renderList(spec.requiredEvidence, id)}

## Operator Input Status

${spec.operatorInputStatus}
`;
}

function renderChoreBrief(id: string, spec: ChoreWorkItemSpec) {
  const improvementMetadata = spec.improvement
    ? `\n${renderImprovementMetadata(spec.improvement)}`
    : "";

  return `# ${id}: ${spec.title}

## Status

${spec.status}

## Non-Product Work

${spec.nonProductWork}

## Origin

${spec.origin}${improvementMetadata}

## Scope

${renderList(spec.scope, id)}

## Acceptance Criteria

${renderList(spec.acceptanceCriteria, id)}

## Verification Plan

${renderList(spec.verificationPlan, id)}

## Expected Files

${renderList(spec.expectedFiles, id)}

## Required Evidence

${renderList(spec.requiredEvidence, id)}

## Operator Input Status

${spec.operatorInputStatus}
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

function serializeBootstrapGapLedger(ledger: BootstrapGapLedger) {
  return {
    version: ledger.version,
    gaps: ledger.gaps.map((gap) => ({
      id: gap.id,
      title: gap.title,
      status: gap.status,
      disposition: gap.disposition,
      source_work_item: gap.sourceWorkItem,
      source_artifacts: gap.sourceArtifacts,
      linked_work_item: gap.linkedWorkItem || null,
      rationale: gap.rationale,
      verification_target: gap.verificationTarget || null,
      next_action: gap.nextAction
    }))
  };
}

function requireString(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Work item spec missing required field: ${field}`);
  }

  return value;
}

function requireStringList(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (!isNonEmptyStringList(value)) {
    throw new Error(`Work item spec missing required field: ${field}`);
  }

  return value;
}

function requireChecklist(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Work item spec missing required field: ${field}`);
  }

  return value.map((entry) => formatChecklistEntry(entry, field));
}

function formatChecklistEntry(entry: unknown, field: string) {
  if (typeof entry === "string" && entry.trim().length > 0) {
    return entry;
  }

  if (!isRecord(entry)) {
    throw new Error(`Work item spec missing required field: ${field}`);
  }

  const stage = requireString(entry, "stage");
  const verdict = requireString(entry, "verdict");
  const evidence = requireString(entry, "evidence");
  return `${stage} | ${verdict} | ${evidence}`;
}

function renderList(items: string[], id: string) {
  return items.map((item) => `- ${item.replaceAll("<ID>", id)}`).join("\n");
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
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

function normalizeDisplayPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
