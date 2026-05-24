import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  FINAL_LANDING_VERDICTS,
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

export type LandingVerdict = {
  contractVersion: string;
  workItem: string;
  sourceHead: string;
  reviewEvidence: string;
  testsStatus: string;
  cleanCodeStatus: string;
  coderabbitState: string;
  localQwenState: string;
  escalatedReviewState: string;
  uatStatus: string;
  sourceDriftStatus: string;
  operatorInputStatus: string;
  landingAgentState: string;
  landingAgentReplacementEvidence: string[];
  finalVerdict: string;
  rationale: string;
};

type OptionalArtifact = {
  content: string;
  displayPath: string;
};

const LANDING_VERDICT_FILE = "landing-verdict.md";

const REQUIRED_LANDING_SCALARS = [
  "contract_version",
  "work_item",
  "source_head",
  "review_evidence",
  "tests_status",
  "clean_code_status",
  "coderabbit_state",
  "local_qwen_state",
  "escalated_review_state",
  "uat_status",
  "source_drift_status",
  "operator_input_status",
  "landing_agent_state",
  "final_verdict",
  "rationale"
];

export async function validateLandingVerdictArtifacts(repoRoot: string) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalLandingVerdict(repoRoot, workItem.id);

    if (artifact && hasMetadataField(artifact.content, "contract_version")) {
      parseLandingVerdict(artifact.content, artifact.displayPath, workItem.id);
    }
  }
}

export async function readLandingVerdict(
  repoRoot: string,
  workItemId: string
) {
  await readWorkItem(repoRoot, workItemId);

  const displayPath = landingVerdictDisplayPath(workItemId);
  const content = await readRequiredLandingVerdict(
    repoRoot,
    workItemId,
    displayPath
  );

  return parseLandingVerdict(content, displayPath, workItemId);
}

function parseLandingVerdict(
  content: string,
  displayPath: string,
  expectedWorkItemId: string
): LandingVerdict {
  const fields = parseMetadataFields(content);

  for (const field of REQUIRED_LANDING_SCALARS) {
    requireScalar(fields, field);
  }

  const contractVersion = readScalar(fields, "contract_version");
  if (contractVersion !== "1") {
    throw new Error(`Unsupported landing verdict contract version: ${contractVersion}`);
  }

  const workItem = readScalar(fields, "work_item");
  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed landing verdict: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const testsStatus = readScalar(fields, "tests_status");
  const cleanCodeStatus = readScalar(fields, "clean_code_status");
  const coderabbitState = readScalar(fields, "coderabbit_state");
  const localQwenState = readScalar(fields, "local_qwen_state");
  const escalatedReviewState = readScalar(fields, "escalated_review_state");
  const uatStatus = readScalar(fields, "uat_status");
  const sourceDriftStatus = readScalar(fields, "source_drift_status");
  const landingAgentState = readScalar(fields, "landing_agent_state");

  requireSharedVerdict("tests status", testsStatus);
  requireSharedVerdict("clean-code status", cleanCodeStatus);
  requireSharedVerdict("CodeRabbit state", coderabbitState);
  requireSharedVerdict("local Qwen state", localQwenState);
  requireSharedVerdict("escalated review state", escalatedReviewState);
  requireSharedVerdict("UAT status", uatStatus);
  requireSharedVerdict("Landing Agent state", landingAgentState);
  requireSourceDriftStatus(sourceDriftStatus);

  const operatorInputStatus = readScalar(fields, "operator_input_status");
  requireResolvedOperatorInput(
    "Landing verdict",
    expectedWorkItemId,
    operatorInputStatus
  );

  const finalVerdict = readScalar(fields, "final_verdict");
  if (!FINAL_LANDING_VERDICTS.has(finalVerdict)) {
    throw new Error(`Unsupported final landing verdict: ${finalVerdict}`);
  }

  const landingAgentReplacementEvidence = readList(
    fields,
    "landing_agent_replacement_evidence"
  );
  if (
    landingAgentState === "bootstrap_gap" &&
    landingAgentReplacementEvidence.length === 0
  ) {
    throw new Error("Landing Agent bootstrap_gap requires replacement evidence");
  }

  return {
    contractVersion,
    workItem,
    sourceHead: readScalar(fields, "source_head"),
    reviewEvidence: readScalar(fields, "review_evidence"),
    testsStatus,
    cleanCodeStatus,
    coderabbitState,
    localQwenState,
    escalatedReviewState,
    uatStatus,
    sourceDriftStatus,
    operatorInputStatus,
    landingAgentState,
    landingAgentReplacementEvidence,
    finalVerdict,
    rationale: readScalar(fields, "rationale")
  };
}

async function readOptionalLandingVerdict(
  repoRoot: string,
  workItemId: string
): Promise<OptionalArtifact | null> {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(LANDING_VERDICT_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, LANDING_VERDICT_FILE), "utf8"),
      displayPath: landingVerdictDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readRequiredLandingVerdict(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, LANDING_VERDICT_FILE),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing landing verdict artifact: ${displayPath}`);
    }
    throw error;
  }
}

function requireScalar(fields: ParsedFields, field: string) {
  if (!readScalar(fields, field)) {
    throw new Error(`Landing verdict missing required field: ${field}`);
  }
}

function landingVerdictDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/landing-verdict.md`;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
