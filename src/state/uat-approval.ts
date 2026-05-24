import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireSourceDriftStatus } from "./landing-gate-values.js";
import {
  hasMetadataField,
  parseMetadataFields,
  readScalar,
  type ParsedFields
} from "./metadata.js";
import { readWorkItem, readWorkItems } from "./work-items.js";

export type UatApproval = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  environment: string;
  approvalStatus: string;
  approvedBy: string;
  approvedAt: string;
  sourceDriftStatus: string;
  notes: string;
  displayPath: string;
};

type OptionalArtifact = {
  content: string;
  displayPath: string;
};

type WriteUatApprovalInput = {
  workItemId: string;
  sourceHead: string;
  environment: string;
  approvedBy: string;
  notes: string;
  approvedAt?: Date;
};

const UAT_APPROVAL_FILE = "uat-approval.md";
const PASSING_UAT_STATUS = "pass";

const REQUIRED_UAT_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "environment",
  "approval_status",
  "approved_by",
  "approved_at",
  "source_drift_status",
  "notes"
];

export async function validateUatApprovalArtifacts(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalUatApproval(repoRoot, workItem.id);

    if (artifact && hasMetadataField(artifact.content, "contract_version")) {
      try {
        parseUatApproval(artifact.content, artifact.displayPath, workItem.id);
      } catch (error) {
        throw new Error(
          `Malformed UAT approval artifact: ${artifact.displayPath}; ${errorMessage(error)}`
        );
      }
    }
  }
}

export async function readUatApproval(repoRoot: string, workItemId: string) {
  await readWorkItem(repoRoot, workItemId);

  const displayPath = uatApprovalDisplayPath(workItemId);
  const content = await readRequiredUatApproval(
    repoRoot,
    workItemId,
    displayPath
  );

  return parseUatApproval(content, displayPath, workItemId);
}

export async function writeUatApproval(
  repoRoot: string,
  input: WriteUatApprovalInput
) {
  await readWorkItem(repoRoot, input.workItemId);

  const workDir = path.join(repoRoot, "docs/work", input.workItemId);
  await mkdir(workDir, { recursive: true });

  const displayPath = uatApprovalDisplayPath(input.workItemId);
  const content = `# UAT Approval: ${input.workItemId}

contract_version: 1
work_item: ${input.workItemId}
source_head: ${input.sourceHead}
environment: ${input.environment}
approval_status: ${PASSING_UAT_STATUS}
approved_by: ${input.approvedBy}
approved_at: ${(input.approvedAt ?? new Date()).toISOString()}
source_drift_status: current
notes: ${input.notes}
`;

  await writeFile(path.join(workDir, UAT_APPROVAL_FILE), content, "utf8");

  return displayPath;
}

function parseUatApproval(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): UatApproval {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_UAT_SCALARS) {
    requireScalar(fields, field);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(`Unsupported UAT approval contract version: ${contractVersion}`);
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed UAT approval: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const approvalStatus = readScalar(fields, "approval_status");
  if (approvalStatus !== PASSING_UAT_STATUS) {
    throw new Error(`Unsupported UAT approval status: ${approvalStatus}`);
  }

  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  requireSourceDriftStatus(sourceDriftStatus);

  return {
    contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    environment: readScalar(fields, "environment"),
    approvalStatus,
    approvedBy: readScalar(fields, "approved_by"),
    approvedAt: readScalar(fields, "approved_at"),
    sourceDriftStatus,
    notes: readScalar(fields, "notes"),
    displayPath
  };
}

async function readOptionalUatApproval(
  repoRoot: string,
  workItemId: string
): Promise<OptionalArtifact | null> {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(UAT_APPROVAL_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, UAT_APPROVAL_FILE), "utf8"),
      displayPath: uatApprovalDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readRequiredUatApproval(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, UAT_APPROVAL_FILE),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing UAT approval artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireScalar(fields: ParsedFields, field: string) {
  if (!readScalar(fields, field)) {
    throw new Error(`UAT approval missing required field: ${field}`);
  }
}

function uatApprovalDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/uat-approval.md`;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
