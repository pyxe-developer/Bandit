import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  parseMetadataFields,
  readScalar,
  type ParsedFields
} from "./metadata.js";

export type HumanReviewEvidence = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  adapterType: string;
  reviewerId: string;
  reviewState: string;
  reviewerVerdict: string;
  findingsStatus: string;
  findingsDisposition: string;
  operatorInputStatus: string;
  sourceDriftStatus: string;
  evidenceSummary: string;
  displayPath: string;
};

const HUMAN_REVIEW_FILE = "human-review.md";

const REQUIRED_HUMAN_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "adapter_type",
  "reviewer_id",
  "review_state",
  "reviewer_verdict",
  "findings_status",
  "findings_disposition",
  "operator_input_status",
  "source_drift_status",
  "evidence_summary"
];

export async function readOptionalHumanReview(
  repoRoot: string,
  workItemId: string
): Promise<HumanReviewEvidence | null> {
  let resolved: ResolvedHumanReviewPath;
  try {
    resolved = resolveHumanReviewPath(repoRoot, workItemId);
  } catch {
    return null;
  }

  let content: string;
  try {
    content = await readFile(resolved.filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }

  return parseHumanReview(content, resolved.displayPath, workItemId);
}

export async function tryReadHumanReview(
  repoRoot: string,
  workItemId: string
): Promise<{ evidence: HumanReviewEvidence | null; error: string | null }> {
  let resolved: ResolvedHumanReviewPath;
  try {
    resolved = resolveHumanReviewPath(repoRoot, workItemId);
  } catch (error) {
    return {
      evidence: null,
      error: (error as Error).message
    };
  }

  let content: string;
  try {
    content = await readFile(resolved.filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return {
        evidence: null,
        error: `Missing human review evidence: ${resolved.displayPath}`
      };
    }
    return {
      evidence: null,
      error: `Unable to read human review evidence: ${(error as Error).message}`
    };
  }

  try {
    return {
      evidence: parseHumanReview(content, resolved.displayPath, workItemId),
      error: null
    };
  } catch (error) {
    return {
      evidence: null,
      error: (error as Error).message
    };
  }
}

export async function readHumanReview(
  repoRoot: string,
  workItemId: string
): Promise<HumanReviewEvidence> {
  const resolved = resolveHumanReviewPath(repoRoot, workItemId);

  let content: string;
  try {
    content = await readFile(resolved.filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(
        `Missing human review evidence artifact: ${resolved.displayPath}`
      );
    }
    throw error;
  }

  return parseHumanReview(content, resolved.displayPath, workItemId);
}

export function parseHumanReview(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): HumanReviewEvidence {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_HUMAN_SCALARS) {
    requireScalar(fields, field, displayPath);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(
      `Unsupported human review contract version: ${contractVersion}`
    );
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed human review: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const reviewerVerdict = readScalar(fields, "reviewer_verdict");
  if (
    reviewerVerdict !== "pass" &&
    reviewerVerdict !== "non_blocking" &&
    reviewerVerdict !== "blocker"
  ) {
    throw new Error(
      `Unsupported human review reviewer verdict: ${reviewerVerdict}`
    );
  }

  const adapterType = readScalar(fields, "adapter_type");
  if (adapterType !== "human") {
    throw new Error(
      `Malformed human review: ${displayPath}; adapter_type must be human`
    );
  }

  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  if (sourceDriftStatus !== "current" && sourceDriftStatus !== "stale") {
    throw new Error(
      `Unsupported human review source_drift_status: ${sourceDriftStatus}`
    );
  }

  return {
    contractVersion: contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    adapterType,
    reviewerId: readScalar(fields, "reviewer_id"),
    reviewState: readScalar(fields, "review_state"),
    reviewerVerdict,
    findingsStatus: readScalar(fields, "findings_status"),
    findingsDisposition: readScalar(fields, "findings_disposition"),
    operatorInputStatus: readScalar(fields, "operator_input_status"),
    sourceDriftStatus,
    evidenceSummary: readScalar(fields, "evidence_summary"),
    displayPath
  };
}

export function humanReviewDisplayPath(workItemId: string) {
  assertValidWorkItemId(workItemId);
  return `docs/work/${workItemId}/${HUMAN_REVIEW_FILE}`;
}

type ResolvedHumanReviewPath = {
  displayPath: string;
  filePath: string;
};

function resolveHumanReviewPath(
  repoRoot: string,
  workItemId: string
): ResolvedHumanReviewPath {
  assertValidWorkItemId(workItemId);
  const workRoot = path.resolve(repoRoot, "docs/work");
  const workDir = path.resolve(workRoot, workItemId);
  if (workDir !== workRoot && !workDir.startsWith(`${workRoot}${path.sep}`)) {
    throw new Error(`Invalid human review work item path: ${workItemId}`);
  }

  return {
    displayPath: humanReviewDisplayPath(workItemId),
    filePath: path.join(workDir, HUMAN_REVIEW_FILE)
  };
}

function assertValidWorkItemId(workItemId: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(workItemId)) {
    throw new Error(`Invalid human review work item id: ${workItemId}`);
  }
}

function requireScalar(
  fields: ParsedFields,
  field: string,
  displayPath: string
) {
  if (!readScalar(fields, field)) {
    throw new Error(
      `Human review evidence missing required field: ${field} in ${displayPath}`
    );
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
