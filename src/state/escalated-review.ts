import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
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

export type EscalatedReviewEvidence = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  profileId: string;
  triggerRationale: string;
  availabilityStatus: string;
  reviewerVerdict: string;
  disposition: string;
  sourceDriftStatus: string;
  bootstrapGapEvidence: string[];
  displayPath: string;
};

export type EscalatedReviewWriteInput = {
  workItemId: string;
  sourceHead: string;
  profileId: string;
  triggerRationale: string;
  availabilityStatus: string;
  reviewerVerdict: string;
  disposition: string;
  sourceDriftStatus: string;
  bootstrapGapEvidence: string[];
};

type OptionalArtifact = {
  content: string;
  displayPath: string;
};

const ESCALATED_REVIEW_FILE = "escalated-review.md";

const REQUIRED_ESCALATED_REVIEW_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "profile_id",
  "trigger_rationale",
  "availability_status",
  "reviewer_verdict",
  "disposition",
  "source_drift_status"
];

const REQUIRED_ESCALATED_REVIEW_LISTS = ["bootstrap_gap_evidence"];

const SUPPORTED_AVAILABILITY_STATUSES = new Set([
  "available",
  "unavailable",
  "bootstrap_gap"
]);

export async function validateEscalatedReviewArtifacts(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalEscalatedReview(repoRoot, workItem.id);

    if (artifact && hasMetadataField(artifact.content, "contract_version")) {
      parseEscalatedReview(artifact.content, artifact.displayPath, workItem.id);
    }
  }
}

export async function readOptionalParsedEscalatedReview(
  repoRoot: string,
  workItemId: string
) {
  await readWorkItem(repoRoot, workItemId);

  const artifact = await readOptionalEscalatedReview(repoRoot, workItemId);
  if (!artifact) {
    return null;
  }

  return parseEscalatedReview(
    artifact.content,
    artifact.displayPath,
    workItemId
  );
}

export async function writeEscalatedReview(
  repoRoot: string,
  input: EscalatedReviewWriteInput
) {
  const displayPath = escalatedReviewDisplayPath(input.workItemId);
  const workDir = path.join(repoRoot, "docs/work", input.workItemId);
  const content = [
    `# Escalated Review: ${input.workItemId}`,
    "",
    "contract_version: 1",
    `work_item: ${input.workItemId}`,
    `source_head: ${input.sourceHead}`,
    `profile_id: ${input.profileId}`,
    `trigger_rationale: ${input.triggerRationale}`,
    `availability_status: ${input.availabilityStatus}`,
    `reviewer_verdict: ${input.reviewerVerdict}`,
    `disposition: ${input.disposition}`,
    `source_drift_status: ${input.sourceDriftStatus}`,
    "bootstrap_gap_evidence:",
    ...formatList(input.bootstrapGapEvidence)
  ].join("\n").concat("\n");

  await mkdir(workDir, { recursive: true });
  await writeFile(path.join(workDir, ESCALATED_REVIEW_FILE), content, "utf8");

  return displayPath;
}

function parseEscalatedReview(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): EscalatedReviewEvidence {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_ESCALATED_REVIEW_SCALARS) {
    requireScalar(fields, field);
  }

  for (const field of REQUIRED_ESCALATED_REVIEW_LISTS) {
    requireList(fields, field);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(
      `Unsupported escalated review contract version: ${contractVersion}`
    );
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed escalated review: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const availabilityStatus = readScalar(fields, "availability_status");
  if (!SUPPORTED_AVAILABILITY_STATUSES.has(availabilityStatus)) {
    throw new Error(
      `Unsupported escalated review availability status: ${availabilityStatus}`
    );
  }

  const reviewerVerdict = readScalar(fields, "reviewer_verdict");
  requireSharedVerdict("escalated review verdict", reviewerVerdict);

  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  requireSourceDriftStatus(sourceDriftStatus);

  const bootstrapGapEvidence = readList(fields, "bootstrap_gap_evidence");
  if (
    (availabilityStatus === "bootstrap_gap" ||
      reviewerVerdict === "bootstrap_gap") &&
    bootstrapGapEvidence.length === 0
  ) {
    throw new Error(
      "Escalated review bootstrap_gap requires bootstrap gap evidence"
    );
  }

  if (availabilityStatus === "unavailable" && reviewerVerdict === "pass") {
    throw new Error("Unavailable escalated review cannot be treated as pass");
  }

  return {
    contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    profileId: readScalar(fields, "profile_id"),
    triggerRationale: readScalar(fields, "trigger_rationale"),
    availabilityStatus,
    reviewerVerdict,
    disposition: readScalar(fields, "disposition"),
    sourceDriftStatus,
    bootstrapGapEvidence,
    displayPath
  };
}

async function readOptionalEscalatedReview(
  repoRoot: string,
  workItemId: string
): Promise<OptionalArtifact | null> {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(ESCALATED_REVIEW_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, ESCALATED_REVIEW_FILE), "utf8"),
      displayPath: escalatedReviewDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

function requireScalar(fields: ParsedFields, field: string) {
  if (!readScalar(fields, field)) {
    throw new Error(`Escalated review missing required field: ${field}`);
  }
}

function requireList(fields: ParsedFields, field: string) {
  if (readList(fields, field).length === 0) {
    throw new Error(`Escalated review missing required field: ${field}`);
  }
}

function escalatedReviewDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/escalated-review.md`;
}

function formatList(items: string[]) {
  return items.length > 0 ? items.map((item) => `  - ${item}`) : ["  - none"];
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
