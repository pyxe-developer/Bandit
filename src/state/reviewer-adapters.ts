import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type ReviewerAdapterType =
  | "openai_compatible"
  | "cli_command"
  | "human";

export type ReviewerAdapterInput = {
  id: string;
  type: string;
  provider: string;
  required: boolean;
  [field: string]: unknown;
};

export type ReviewerAdapterDiagnostic = {
  reviewerId: string;
  reviewerIndex: number;
  type: string;
  field: string;
  message: string;
};

const SUPPORTED_ADAPTER_TYPES = new Set<ReviewerAdapterType>([
  "openai_compatible",
  "cli_command",
  "human"
]);

const VALID_REVIEWER_ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/;
const HUMAN_REVIEW_EVIDENCE_PATH_PATTERNS = [
  /^docs\/work\/<ID>\/human-review\.md$/,
  /^docs\/work\/\{work_item_id\}\/human-review\.md$/
];

export const NO_REVIEWER_GAP_ID = "BANDIT-GAP-NO-REVIEWER-CONFIGURED";
export const NO_REVIEWER_GAP_TITLE = "No reviewer adapter configured";

const OPENAI_COMPATIBLE_REQUIRED_FIELDS = [
  "id",
  "type",
  "provider",
  "provider_base_url",
  "model",
  "command"
] as const;

const CLI_COMMAND_REQUIRED_FIELDS = [
  "id",
  "type",
  "provider",
  "command"
] as const;

const HUMAN_REQUIRED_FIELDS = [
  "id",
  "type",
  "evidence_path"
] as const;

export function isSupportedReviewerAdapterType(
  value: string
): value is ReviewerAdapterType {
  return SUPPORTED_ADAPTER_TYPES.has(value as ReviewerAdapterType);
}

export function validateReviewerAdapter(
  reviewer: ReviewerAdapterInput,
  index: number
): ReviewerAdapterInput & { type: ReviewerAdapterType } {
  validateReviewerId(reviewer.id, index);

  if (typeof reviewer.required !== "boolean") {
    throw new Error(
      `Invalid profile field: reviewers[${index}].required (must be a boolean)`
    );
  }

  if (typeof reviewer.type !== "string" || reviewer.type.trim().length === 0) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].type (must be one of ${[...SUPPORTED_ADAPTER_TYPES].join(", ")})`
    );
  }

  if (!isSupportedReviewerAdapterType(reviewer.type)) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].type (must be one of ${[...SUPPORTED_ADAPTER_TYPES].join(", ")})`
    );
  }

  switch (reviewer.type) {
    case "openai_compatible":
      validateOpenAiCompatibleReviewer(reviewer, index);
      break;
    case "cli_command":
      validateCliCommandReviewer(reviewer, index);
      break;
    case "human":
      validateHumanReviewer(reviewer, index);
      break;
  }

  return reviewer as ReviewerAdapterInput & { type: ReviewerAdapterType };
}

export function validateTypedReviewerAdapter(
  reviewer: ReviewerAdapterInput,
  index: number
): ReviewerAdapterInput & { type: ReviewerAdapterType } {
  if (typeof reviewer.type !== "string" || reviewer.type.trim().length === 0) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].type (must be one of ${[...SUPPORTED_ADAPTER_TYPES].join(", ")})`
    );
  }
  return validateReviewerAdapter(reviewer, index);
}

function validateReviewerId(id: unknown, index: number) {
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].id (must be a non-empty string)`
    );
  }
  if (!VALID_REVIEWER_ID_PATTERN.test(id)) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].id (must be lowercase letters, digits, hyphen, or underscore; must start with a letter or digit)`
    );
  }
}

function validateOpenAiCompatibleReviewer(
  reviewer: ReviewerAdapterInput,
  index: number
) {
  for (const field of OPENAI_COMPATIBLE_REQUIRED_FIELDS) {
    if (field === "command") {
      requireCommandField(reviewer, field, index);
    } else {
      requireStringField(reviewer, field, index);
    }
  }

  const providerBaseUrl = reviewer.provider_base_url;
  if (!isLikelyHttpUrl(providerBaseUrl)) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].provider_base_url (must be an http or https URL)`
    );
  }
}

function validateCliCommandReviewer(
  reviewer: ReviewerAdapterInput,
  index: number
) {
  for (const field of CLI_COMMAND_REQUIRED_FIELDS) {
    if (field === "command") {
      requireCommandField(reviewer, field, index);
    } else {
      requireStringField(reviewer, field, index);
    }
  }
}

function validateHumanReviewer(
  reviewer: ReviewerAdapterInput,
  index: number
) {
  for (const field of HUMAN_REQUIRED_FIELDS) {
    requireStringField(reviewer, field, index);
  }

  if (reviewer.provider !== undefined) {
    requireStringField(reviewer, "provider", index);
  }

  const evidencePath = reviewer.evidence_path;
  if (
    typeof evidencePath !== "string" ||
    !HUMAN_REVIEW_EVIDENCE_PATH_PATTERNS.some((pattern) =>
      pattern.test(evidencePath)
    )
  ) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].evidence_path (must be docs/work/<ID>/human-review.md or docs/work/{work_item_id}/human-review.md)`
    );
  }
}

function requireStringField(
  reviewer: ReviewerAdapterInput,
  field: string,
  index: number
) {
  const value = reviewer[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].${field} (must be a non-empty string)`
    );
  }
}

function requireCommandField(
  reviewer: ReviewerAdapterInput,
  field: string,
  index: number
) {
  const command = reviewer[field];
  if (!isRecord(command)) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].${field} (must be an object with non-empty executable and args list)`
    );
  }

  if (
    typeof command.executable !== "string" ||
    command.executable.trim().length === 0
  ) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].${field}.executable (must be a non-empty string)`
    );
  }

  if (
    !Array.isArray(command.args) ||
    command.args.some((arg) => typeof arg !== "string")
  ) {
    throw new Error(
      `Invalid profile field: reviewers[${index}].${field}.args (must be a list of strings)`
    );
  }
}

function isLikelyHttpUrl(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.hostname.trim().length > 0
    );
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type ScaffoldedReviewer = {
  id: string;
  type: ReviewerAdapterType;
  path: string;
};

export async function scaffoldReviewerAdapter(
  repoRoot: string,
  reviewer: ReviewerAdapterInput & { type: ReviewerAdapterType }
): Promise<ScaffoldedReviewer> {
  const reviewersDir = reviewerReviewersDir(repoRoot);
  await mkdir(reviewersDir, { recursive: true });

  const destination = path.join(reviewersDir, `${reviewer.id}.json`);
  const payload = buildReviewerAdapterPayload(reviewer);

  await writeFile(
    destination,
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8"
  );

  return {
    id: reviewer.id,
    type: reviewer.type,
    path: path.relative(repoRoot, destination)
  };
}

function reviewerReviewersDir(repoRoot: string) {
  return getBanditPaths(repoRoot).reviewersDir;
}

function buildReviewerAdapterPayload(
  reviewer: ReviewerAdapterInput & { type: ReviewerAdapterType }
): Record<string, unknown> {
  switch (reviewer.type) {
    case "openai_compatible":
      return {
        type: "openai_compatible",
        id: reviewer.id,
        provider: reviewer.provider,
        provider_base_url: reviewer.provider_base_url,
        model: reviewer.model,
        command: reviewer.command,
        required: reviewer.required,
        timeout_ms: reviewer.timeout_ms ?? 180000,
        prompt_contract: reviewer.prompt_contract ?? {
          role: "read_only_adversarial_reviewer",
          required_outputs: ["verdict", "findings", "summary"]
        },
        permissions: reviewer.permissions ?? {
          filesystem: "read_only",
          network: "disabled",
          can_edit_files: false,
          can_request_tools: false
        },
        output_contract: reviewer.output_contract ?? {
          format: "json",
          required_fields: ["verdict", "findings", "summary"]
        },
        unavailable_runtime_behavior:
          reviewer.unavailable_runtime_behavior ??
          "fail_closed_or_bootstrap_gap"
      };
    case "cli_command":
      return {
        type: "cli_command",
        id: reviewer.id,
        provider: reviewer.provider,
        command: reviewer.command,
        required: reviewer.required,
        timeout_ms: reviewer.timeout_ms ?? 180000,
        permissions: reviewer.permissions ?? {
          filesystem: "read_only",
          network: "disabled",
          can_edit_files: false,
          can_request_tools: false
        },
        output_contract: reviewer.output_contract ?? {
          format: "json",
          required_fields: ["verdict", "findings", "summary"]
        },
        unavailable_runtime_behavior:
          reviewer.unavailable_runtime_behavior ??
          "fail_closed_or_bootstrap_gap"
      };
    case "human":
      return {
        type: "human",
        id: reviewer.id,
        provider: reviewer.provider ?? "human",
        evidence_path: reviewer.evidence_path,
        required: reviewer.required
      };
  }
}

export type ReviewerGapResult = {
  recorded: boolean;
  ledgerPath: string;
};

export type NoReviewerBootstrapGapStatus = "open" | "resolved" | "replaced";

const NO_REVIEWER_GAP_STATUSES = new Set<NoReviewerBootstrapGapStatus>([
  "open",
  "resolved",
  "replaced"
]);

export async function recordNoReviewerBootstrapGap(
  repoRoot: string,
  sourceWorkItem: string
): Promise<ReviewerGapResult> {
  const paths = getBanditPaths(repoRoot);
  const ledgerPath = paths.bootstrapGaps;
  const ledger = await readJsonOrEmptyLedger(ledgerPath);
  const existingGap = ledger.gaps.find(
    (gap) => gap.id === NO_REVIEWER_GAP_ID
  );
  const shouldRecord =
    !existingGap ||
    existingGap.status === "resolved" ||
    existingGap.status === "replaced";

  if (shouldRecord) {
    const nextGap: NoReviewerBootstrapGap = {
      id: NO_REVIEWER_GAP_ID,
      title: NO_REVIEWER_GAP_TITLE,
      status: "open",
      disposition: "queued_chore",
      source_work_item: sourceWorkItem,
      source_artifacts: ["docs/work/" + sourceWorkItem + "/brief.md"],
      linked_work_item: null,
      rationale:
        "Profile reviewers were empty, so no adversarial reviewer can satisfy the landing gate.",
      verification_target: null,
      next_action:
        "Configure a reviewer adapter or explicitly disposition the no-reviewer gap before landing."
    };

    if (existingGap) {
      Object.assign(existingGap, nextGap);
    } else {
      ledger.gaps.push(nextGap);
    }

    await mkdir(path.dirname(ledgerPath), { recursive: true });
    await writeFile(
      ledgerPath,
      `${JSON.stringify(ledger, null, 2)}\n`,
      "utf8"
    );
  }

  return {
    recorded: shouldRecord,
    ledgerPath: path.relative(repoRoot, ledgerPath)
  };
}

export type NoReviewerBootstrapGap = {
  id: string;
  title: string;
  status: NoReviewerBootstrapGapStatus;
  disposition: string;
  source_work_item?: string;
  source_artifacts?: string[];
  linked_work_item?: string | null;
  rationale?: string;
  verification_target?: string | null;
  next_action?: string;
};

export type BootstrapGapLedgerShape = {
  version: 1;
  gaps: NoReviewerBootstrapGap[];
};

async function readJsonOrEmptyLedger(
  ledgerPath: string
): Promise<BootstrapGapLedgerShape> {
  try {
    const content = await readFile(ledgerPath, "utf8");
    const parsed = JSON.parse(content);
    if (!isRecord(parsed)) {
      throw new Error(
        `Malformed bootstrap gap ledger: ${ledgerPath} (root must be an object)`
      );
    }
    if (parsed.version !== 1) {
      throw new Error(
        `Malformed bootstrap gap ledger: ${ledgerPath} (version must be 1)`
      );
    }
    if (!Array.isArray(parsed.gaps)) {
      throw new Error(
        `Malformed bootstrap gap ledger: ${ledgerPath} (gaps must be an array)`
      );
    }
    return {
      version: 1,
      gaps: parsed.gaps.map((gap, index) =>
        validateNoReviewerBootstrapGap(gap, ledgerPath, index)
      )
    };
  } catch (error) {
    if (!isMissingPathError(error)) {
      throw error;
    }
  }

  return { version: 1, gaps: [] };
}

function validateNoReviewerBootstrapGap(
  gap: unknown,
  ledgerPath: string,
  index: number
): NoReviewerBootstrapGap {
  if (!isRecord(gap)) {
    throw new Error(
      `Malformed bootstrap gap ledger: ${ledgerPath} (gaps[${index}] must be an object)`
    );
  }

  for (const field of ["id", "title", "status", "disposition"] as const) {
    requireLedgerString(gap, field, ledgerPath, index);
  }

  if (!isNoReviewerBootstrapGapStatus(gap.status)) {
    throw new Error(
      `Malformed bootstrap gap ledger: ${ledgerPath} (gaps[${index}].status must be one of open, resolved, replaced)`
    );
  }

  requireOptionalLedgerString(gap, "source_work_item", ledgerPath, index);
  requireOptionalLedgerString(gap, "rationale", ledgerPath, index);
  requireOptionalLedgerString(gap, "next_action", ledgerPath, index);
  requireOptionalLedgerNullableString(
    gap,
    "linked_work_item",
    ledgerPath,
    index
  );
  requireOptionalLedgerNullableString(
    gap,
    "verification_target",
    ledgerPath,
    index
  );

  if (
    "source_artifacts" in gap &&
    (!Array.isArray(gap.source_artifacts) ||
      gap.source_artifacts.some((artifact) => typeof artifact !== "string"))
  ) {
    throw new Error(
      `Malformed bootstrap gap ledger: ${ledgerPath} (gaps[${index}].source_artifacts must be a list of strings)`
    );
  }

  return gap as NoReviewerBootstrapGap;
}

function isNoReviewerBootstrapGapStatus(
  value: unknown
): value is NoReviewerBootstrapGapStatus {
  return (
    typeof value === "string" &&
    NO_REVIEWER_GAP_STATUSES.has(value as NoReviewerBootstrapGapStatus)
  );
}

function requireLedgerString(
  gap: Record<string, unknown>,
  field: string,
  ledgerPath: string,
  index: number
) {
  if (typeof gap[field] !== "string" || gap[field].trim().length === 0) {
    throw new Error(
      `Malformed bootstrap gap ledger: ${ledgerPath} (gaps[${index}].${field} must be a non-empty string)`
    );
  }
}

function requireOptionalLedgerString(
  gap: Record<string, unknown>,
  field: string,
  ledgerPath: string,
  index: number
) {
  if (field in gap && typeof gap[field] !== "string") {
    throw new Error(
      `Malformed bootstrap gap ledger: ${ledgerPath} (gaps[${index}].${field} must be a string)`
    );
  }
}

function requireOptionalLedgerNullableString(
  gap: Record<string, unknown>,
  field: string,
  ledgerPath: string,
  index: number
) {
  if (field in gap && gap[field] !== null && typeof gap[field] !== "string") {
    throw new Error(
      `Malformed bootstrap gap ledger: ${ledgerPath} (gaps[${index}].${field} must be a string or null)`
    );
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
