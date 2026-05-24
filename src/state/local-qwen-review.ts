import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  requireResolvedOperatorInput,
  requireSharedVerdict,
  requireSourceDriftStatus
} from "./landing-gate-values.js";
import {
  hasMetadataField,
  parseMetadataFields,
  readList,
  readScalar,
  type ParsedFields
} from "./metadata.js";
import { readWorkItem, readWorkItems } from "./work-items.js";

export type LocalQwenReviewEvidence = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  profileId: string;
  runtime: string;
  model: string;
  runStatus: string;
  reviewerVerdict: string;
  findingsStatus: string;
  findingsDisposition: string;
  operatorInputStatus: string;
  sourceDriftStatus: string;
  executableEvidence: string[];
  bootstrapGaps: string[];
  displayPath: string;
};

export type LocalQwenReviewWriteInput = {
  workItemId: string;
  sourceHead: string;
  profileId: string;
  runtime: string;
  model: string;
  runStatus: string;
  reviewerVerdict: string;
  findingsStatus: string;
  findingsDisposition: string;
  sourceDriftStatus: string;
  executableEvidence: string[];
  bootstrapGaps: string[];
};

const LOCAL_QWEN_REVIEW_FILE = "local-qwen-review.md";
const REQUIRED_LOCAL_QWEN_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "profile_id",
  "runtime",
  "model",
  "run_status",
  "reviewer_verdict",
  "findings_status",
  "findings_disposition",
  "operator_input_status",
  "source_drift_status"
];

const REQUIRED_LOCAL_QWEN_LISTS = [
  "executable_evidence",
  "bootstrap_gaps"
];

const RUN_STATUSES = new Set([
  "completed",
  "failed",
  "inconclusive",
  "unavailable",
  "bootstrap_gap"
]);

export async function validateLocalQwenReviewArtifacts(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalLocalQwenReview(repoRoot, workItem.id);

    if (artifact && hasMetadataField(artifact.content, "contract_version")) {
      parseLocalQwenReview(
        artifact.content,
        artifact.displayPath,
        workItem.id
      );
    }
  }
}

export async function readLocalQwenReview(
  repoRoot: string,
  workItemId: string
) {
  await readWorkItem(repoRoot, workItemId);

  const displayPath = localQwenReviewDisplayPath(workItemId);
  const content = await readRequiredLocalQwenReview(
    repoRoot,
    workItemId,
    displayPath
  );

  return parseLocalQwenReview(content, displayPath, workItemId);
}

export async function writeLocalQwenReview(
  repoRoot: string,
  input: LocalQwenReviewWriteInput
) {
  const displayPath = localQwenReviewDisplayPath(input.workItemId);
  const filePath = path.join(repoRoot, displayPath);
  const content = [
    `# Local Qwen Review: ${input.workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${input.workItemId}`,
    `source_head: ${input.sourceHead}`,
    `profile_id: ${input.profileId}`,
    `runtime: ${input.runtime}`,
    `model: ${input.model}`,
    `run_status: ${input.runStatus}`,
    `reviewer_verdict: ${input.reviewerVerdict}`,
    `findings_status: ${input.findingsStatus}`,
    `findings_disposition: ${input.findingsDisposition}`,
    "operator_input_status: none_required",
    `source_drift_status: ${input.sourceDriftStatus}`,
    "executable_evidence:",
    ...input.executableEvidence.map((line) => `  - ${line}`),
    "bootstrap_gaps:",
    ...input.bootstrapGaps.map((line) => `  - ${line}`)
  ].join("\n").concat("\n");

  await writeFile(filePath, content, "utf8");
  return displayPath;
}

function parseLocalQwenReview(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): LocalQwenReviewEvidence {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_LOCAL_QWEN_SCALARS) {
    requireScalar(fields, field);
  }

  for (const field of REQUIRED_LOCAL_QWEN_LISTS) {
    requireField(fields, field);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(`Unsupported local Qwen review contract version: ${contractVersion}`);
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed local Qwen review: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const runStatus = readScalar(fields, "run_status");
  if (!RUN_STATUSES.has(runStatus)) {
    throw new Error(`Unsupported local Qwen run status: ${runStatus}`);
  }

  const reviewerVerdict = readScalar(fields, "reviewer_verdict");
  requireSharedVerdict("local Qwen reviewer verdict", reviewerVerdict);

  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  requireSourceDriftStatus(sourceDriftStatus);

  const operatorInputStatus = readScalar(fields, "operator_input_status");
  requireResolvedOperatorInput(
    "Local Qwen review",
    expectedWorkItemId,
    operatorInputStatus
  );

  const executableEvidence = readList(fields, "executable_evidence");
  const bootstrapGaps = readList(fields, "bootstrap_gaps");

  if (reviewerVerdict === "pass" && executableEvidence.length === 0) {
    throw new Error("Local Qwen pass requires executable evidence");
  }

  if (
    (runStatus === "unavailable" || runStatus === "bootstrap_gap") &&
    bootstrapGaps.length === 0
  ) {
    throw new Error("Local Qwen unavailable runtime requires bootstrap gap evidence");
  }

  return {
    contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    profileId: readScalar(fields, "profile_id"),
    runtime: readScalar(fields, "runtime"),
    model: readScalar(fields, "model"),
    runStatus,
    reviewerVerdict,
    findingsStatus: readScalar(fields, "findings_status"),
    findingsDisposition: readScalar(fields, "findings_disposition"),
    operatorInputStatus,
    sourceDriftStatus,
    executableEvidence,
    bootstrapGaps,
    displayPath
  };
}

async function readOptionalLocalQwenReview(
  repoRoot: string,
  workItemId: string
) {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(LOCAL_QWEN_REVIEW_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, LOCAL_QWEN_REVIEW_FILE), "utf8"),
      displayPath: localQwenReviewDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readRequiredLocalQwenReview(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, LOCAL_QWEN_REVIEW_FILE),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing local Qwen review evidence artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireScalar(fields: ParsedFields, field: string) {
  if (!readScalar(fields, field)) {
    throw new Error(`Local Qwen review missing required field: ${field}`);
  }
}

function requireField(fields: ParsedFields, field: string) {
  if (!fields.has(field)) {
    throw new Error(`Local Qwen review missing required field: ${field}`);
  }
}

function localQwenReviewDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/${LOCAL_QWEN_REVIEW_FILE}`;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
