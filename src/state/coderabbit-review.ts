import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  requireResolvedOperatorInput,
  requireSharedVerdict,
  requireSourceDriftStatus
} from "./landing-gate-values.js";
import {
  parseMetadataFields,
  readList,
  readScalar,
  type ParsedFields
} from "./metadata.js";
import { readWorkItem, readWorkItems } from "./work-items.js";

export type CodeRabbitReviewEvidence = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  provider: string;
  reviewTarget: string;
  reviewState: string;
  coderabbitVerdict: string;
  findingsStatus: string;
  findingsDisposition: string;
  operatorInputStatus: string;
  sourceDriftStatus: string;
  executableEvidence: string[];
  bootstrapGaps: string[];
  displayPath: string;
};

export type CodeRabbitReviewWriteInput = {
  workItemId: string;
  sourceHead: string;
  provider: string;
  reviewTarget: string;
  reviewState: string;
  coderabbitVerdict: string;
  findingsStatus: string;
  findingsDisposition: string;
  operatorInputStatus: string;
  sourceDriftStatus: string;
  executableEvidence: string[];
  bootstrapGaps: string[];
};

const CODERABBIT_REVIEW_FILE = "coderabbit-review.md";
const REQUIRED_CODERABBIT_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "provider",
  "review_target",
  "review_state",
  "coderabbit_verdict",
  "findings_status",
  "findings_disposition",
  "operator_input_status",
  "source_drift_status"
];

const REQUIRED_CODERABBIT_LISTS = [
  "executable_evidence",
  "bootstrap_gaps"
];

const REVIEW_STATES = new Set([
  "completed",
  "failed",
  "queued",
  "timeout",
  "blocked",
  "inconclusive",
  "unavailable",
  "bootstrap_gap"
]);

const FINDINGS_STATUSES = new Set([
  "none",
  "resolved",
  "locally_resolved_pending_refresh",
  "open",
  "unresolved",
  "inconclusive",
  "unavailable",
  "not_applicable"
]);

const BLOCKING_FINDINGS_STATUSES = new Set([
  "open",
  "locally_resolved_pending_refresh",
  "unresolved",
  "inconclusive"
]);

export async function validateCodeRabbitReviewArtifacts(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalCodeRabbitReview(repoRoot, workItem.id);

    if (artifact) {
      parseCodeRabbitReview(
        artifact.content,
        artifact.displayPath,
        workItem.id
      );
    }
  }
}

export async function readCodeRabbitReview(
  repoRoot: string,
  workItemId: string
) {
  await readWorkItem(repoRoot, workItemId);

  const displayPath = codeRabbitReviewDisplayPath(workItemId);
  const content = await readRequiredCodeRabbitReview(
    repoRoot,
    workItemId,
    displayPath
  );

  return parseCodeRabbitReview(content, displayPath, workItemId);
}

export async function readOptionalParsedCodeRabbitReview(
  repoRoot: string,
  workItemId: string
) {
  const artifact = await readOptionalCodeRabbitReview(repoRoot, workItemId);
  if (!artifact) {
    return null;
  }

  return parseCodeRabbitReview(
    artifact.content,
    artifact.displayPath,
    workItemId
  );
}

export function codeRabbitReviewHasBlockingFindings(
  evidence: CodeRabbitReviewEvidence
) {
  return BLOCKING_FINDINGS_STATUSES.has(evidence.findingsStatus);
}

export async function writeCodeRabbitReview(
  repoRoot: string,
  input: CodeRabbitReviewWriteInput
) {
  const displayPath = codeRabbitReviewDisplayPath(input.workItemId);
  const workDir = path.join(repoRoot, "docs/work", input.workItemId);
  const content = [
    `# CodeRabbit Review: ${input.workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${input.workItemId}`,
    `source_head: ${input.sourceHead}`,
    `provider: ${input.provider}`,
    `review_target: ${input.reviewTarget}`,
    `review_state: ${input.reviewState}`,
    `coderabbit_verdict: ${input.coderabbitVerdict}`,
    `findings_status: ${input.findingsStatus}`,
    `findings_disposition: ${input.findingsDisposition}`,
    `operator_input_status: ${input.operatorInputStatus}`,
    `source_drift_status: ${input.sourceDriftStatus}`,
    "executable_evidence:",
    ...formatList(input.executableEvidence),
    "bootstrap_gaps:",
    ...formatList(input.bootstrapGaps)
  ].join("\n").concat("\n");

  await mkdir(workDir, { recursive: true });
  await writeFile(path.join(workDir, CODERABBIT_REVIEW_FILE), content, "utf8");

  return displayPath;
}

function parseCodeRabbitReview(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): CodeRabbitReviewEvidence {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_CODERABBIT_SCALARS) {
    requireScalar(fields, field);
  }

  for (const field of REQUIRED_CODERABBIT_LISTS) {
    requireField(fields, field);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(`Unsupported CodeRabbit review contract version: ${contractVersion}`);
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed CodeRabbit review: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const reviewState = readScalar(fields, "review_state");
  if (!REVIEW_STATES.has(reviewState)) {
    throw new Error(`Unsupported CodeRabbit review state: ${reviewState}`);
  }

  const coderabbitVerdict = readScalar(fields, "coderabbit_verdict");
  requireSharedVerdict("CodeRabbit review verdict", coderabbitVerdict);

  const findingsStatus = readScalar(fields, "findings_status");
  if (!FINDINGS_STATUSES.has(findingsStatus)) {
    throw new Error(`Unsupported CodeRabbit findings status: ${findingsStatus}`);
  }

  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  requireSourceDriftStatus(sourceDriftStatus);

  const operatorInputStatus = readScalar(fields, "operator_input_status");
  requireResolvedOperatorInput(
    "CodeRabbit review",
    expectedWorkItemId,
    operatorInputStatus
  );

  const executableEvidence = readList(fields, "executable_evidence");
  const bootstrapGaps = readList(fields, "bootstrap_gaps");

  if (coderabbitVerdict === "pass" && executableEvidence.length === 0) {
    throw new Error("CodeRabbit pass requires executable evidence");
  }

  if (coderabbitVerdict === "pass" && BLOCKING_FINDINGS_STATUSES.has(findingsStatus)) {
    throw new Error("CodeRabbit pass cannot have unresolved findings");
  }

  if (coderabbitVerdict === "bootstrap_gap" && !hasBootstrapGapEvidence(bootstrapGaps)) {
    throw new Error("CodeRabbit bootstrap_gap requires bootstrap gap evidence");
  }

  if (isUnavailableReviewState(reviewState) && coderabbitVerdict === "pass") {
    throw new Error("CodeRabbit unavailable review cannot be treated as pass");
  }

  if (isUnavailableReviewState(reviewState) && !hasBootstrapGapEvidence(bootstrapGaps)) {
    throw new Error("CodeRabbit unavailable review requires bootstrap gap evidence");
  }

  return {
    contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    provider: readScalar(fields, "provider"),
    reviewTarget: readScalar(fields, "review_target"),
    reviewState,
    coderabbitVerdict,
    findingsStatus,
    findingsDisposition: readScalar(fields, "findings_disposition"),
    operatorInputStatus,
    sourceDriftStatus,
    executableEvidence,
    bootstrapGaps,
    displayPath
  };
}

async function readOptionalCodeRabbitReview(
  repoRoot: string,
  workItemId: string
) {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(CODERABBIT_REVIEW_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, CODERABBIT_REVIEW_FILE), "utf8"),
      displayPath: codeRabbitReviewDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readRequiredCodeRabbitReview(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, CODERABBIT_REVIEW_FILE),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing CodeRabbit review evidence artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireScalar(fields: ParsedFields, field: string) {
  if (!readScalar(fields, field)) {
    throw new Error(`CodeRabbit review missing required field: ${field}`);
  }
}

function requireField(fields: ParsedFields, field: string) {
  if (!fields.has(field)) {
    throw new Error(`CodeRabbit review missing required field: ${field}`);
  }
}

function codeRabbitReviewDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/${CODERABBIT_REVIEW_FILE}`;
}

function formatList(items: string[]) {
  return items.length > 0 ? items.map((item) => `  - ${item}`) : ["  - none"];
}

function isUnavailableReviewState(reviewState: string) {
  return reviewState === "unavailable" || reviewState === "bootstrap_gap";
}

function hasBootstrapGapEvidence(bootstrapGaps: string[]) {
  return bootstrapGaps.some((gap) => gap !== "none");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
