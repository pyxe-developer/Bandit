import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH = ".bandit/policy/model-family-separation.json";
const TEMPLATE_DISPLAY_PATH = "docs/templates/model-family-separation.md";
const STAGE2_OWNERSHIP_ERROR =
  "Stage 2 RED evidence must record test writer identity, red author model family, material edit status, acceptance mapping owner, and zero Stage 3 test-edit authority";
const STAGE3_MODEL_FAMILY_ERROR =
  "Stage 3 implementation evidence must record a non-empty model_family before model-family routing checks";

type Stage2RedEvidence = {
  test_writer_identity?: string;
  red_author_model_family?: string;
  codex_materially_edited_tests?: boolean;
  acceptance_mapping_owner?: string;
  stage3_test_edit_authority?: string;
  stage3_writer_routing?: unknown;
};

type Stage3ImplementationEvidence = {
  writer_identity?: string;
  model_family?: string;
  allowed_write_surfaces?: string[];
  forbidden_write_surfaces?: string[];
  implementation_diff_files?: string[];
  writer_touched_test_surfaces?: string[];
  writer_touched_acceptance_mappings?: string[];
  test_surface_edit_status?: string;
};

type Invalidation = {
  required_when_writer_touches_test_surface?: boolean;
  contaminated_attempt_status?: string;
  complete_revert_evidence?: unknown[];
};

type Escalation = {
  claude_authored_escalation_target?: string;
  claude_self_review_allowed?: boolean;
};

type ModelFamilyEvidence = {
  stage2_red_evidence?: Stage2RedEvidence;
  stage3_implementation_evidence?: Stage3ImplementationEvidence;
  invalidation?: Invalidation;
  escalation?: Escalation;
};

type ReleaseAuthorizedDecision = {
  work_item: string;
  decision_kind: string;
  evidence_path: string;
};

type ModelFamilyPolicy = {
  release_authorized_decisions?: ReleaseAuthorizedDecision[];
};

export async function validateModelFamilySeparation(repoRoot: string) {
  const policyExists = await pathExistsAt(repoRoot, POLICY_DISPLAY_PATH);
  const evidenceDirExists = await pathExistsAt(repoRoot, "docs/model-family-separation");

  if (!policyExists && !evidenceDirExists) {
    return;
  }

  if (!policyExists) {
    throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
  }

  const policy = await loadPolicy(repoRoot);
  await checkTemplateExists(repoRoot);
  await validateDecisions(repoRoot, policy);
}

async function loadPolicy(repoRoot: string): Promise<ModelFamilyPolicy> {
  try {
    const content = await readFile(path.join(repoRoot, POLICY_DISPLAY_PATH), "utf8");
    return JSON.parse(content) as ModelFamilyPolicy;
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
    }
    throw error;
  }
}

async function checkTemplateExists(repoRoot: string) {
  try {
    await readFile(path.join(repoRoot, TEMPLATE_DISPLAY_PATH), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${TEMPLATE_DISPLAY_PATH}`);
    }
    throw error;
  }
}

async function validateDecisions(repoRoot: string, policy: ModelFamilyPolicy) {
  for (const decision of policy.release_authorized_decisions ?? []) {
    if (decision.decision_kind !== "model_family_separation") continue;
    if (!(await workItemExists(repoRoot, decision.work_item))) continue;
    const evidence = await loadEvidence(repoRoot, decision.evidence_path);
    validateEvidence(evidence);
  }
}

async function workItemExists(repoRoot: string, workItem: string): Promise<boolean> {
  try {
    await stat(path.join(repoRoot, "docs/work", workItem));
    return true;
  } catch {
    return false;
  }
}

async function loadEvidence(repoRoot: string, evidencePath: string): Promise<ModelFamilyEvidence> {
  try {
    const content = await readFile(path.join(repoRoot, evidencePath), "utf8");
    return JSON.parse(content) as ModelFamilyEvidence;
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required model-family separation evidence: ${evidencePath}`);
    }
    throw error;
  }
}

function validateEvidence(evidence: ModelFamilyEvidence) {
  const stage2 = evidence.stage2_red_evidence ?? {};
  const stage3 = evidence.stage3_implementation_evidence ?? {};
  const invalidation = evidence.invalidation ?? {};
  const escalation = evidence.escalation ?? {};

  checkStage2OwnershipFields(stage2);
  checkStage3ModelFamily(stage3);
  checkModelFamilySeparation(stage2, stage3);
  checkClaudeBootstrapRouting(stage2, stage3);
  checkTestSurfaceEdits(stage3, invalidation);
  checkEscalationRouting(escalation);
}

function checkStage2OwnershipFields(stage2: Stage2RedEvidence) {
  const requiredStringFields = [
    "test_writer_identity",
    "red_author_model_family",
    "acceptance_mapping_owner",
    "stage3_test_edit_authority"
  ] satisfies (keyof Stage2RedEvidence)[];

  if (
    requiredStringFields.some((field) => !isNonEmptyString(stage2[field])) ||
    typeof stage2.codex_materially_edited_tests !== "boolean"
  ) {
    throw new Error(STAGE2_OWNERSHIP_ERROR);
  }
}

function checkStage3ModelFamily(stage3: Stage3ImplementationEvidence) {
  if (!isNonEmptyString(stage3.model_family)) {
    throw new Error(STAGE3_MODEL_FAMILY_ERROR);
  }
}

function checkModelFamilySeparation(
  stage2: Stage2RedEvidence,
  stage3: Stage3ImplementationEvidence
) {
  if (stage2.red_author_model_family === "codex" && stage3.model_family === "codex") {
    throw new Error(
      "Codex-authored RED evidence requires Stage 3 implementation by a different model family"
    );
  }
}

function checkClaudeBootstrapRouting(
  stage2: Stage2RedEvidence,
  stage3: Stage3ImplementationEvidence
) {
  if (stage2.red_author_model_family === "codex" && stage3.model_family !== "claude") {
    throw new Error(
      "Codex-authored bootstrap RED evidence must route Stage 3 implementation to Claude through the Process Adapter path"
    );
  }
}

function checkTestSurfaceEdits(stage3: Stage3ImplementationEvidence, invalidation: Invalidation) {
  if (stage3.test_surface_edit_status !== "touched") return;

  if (
    invalidation.contaminated_attempt_status === "partial_repair" &&
    !invalidation.complete_revert_evidence?.length
  ) {
    throw new Error(
      "Writer test-surface edits require invalidating the entire Stage 3 attempt and recording complete revert evidence before rerun"
    );
  }

  const touched = stage3.writer_touched_test_surfaces ?? [];
  if (touched.length > 0) {
    throw new Error(`Stage 3 Writer touched forbidden test-owned surface: ${touched[0]}`);
  }
}

function checkEscalationRouting(escalation: Escalation) {
  if (
    escalation.claude_authored_escalation_target === "claude" ||
    escalation.claude_self_review_allowed === true
  ) {
    throw new Error(
      "Claude-authored implementation escalation must route to Codex PM, not Claude"
    );
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function pathExistsAt(repoRoot: string, relativePath: string): Promise<boolean> {
  try {
    await stat(path.join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
