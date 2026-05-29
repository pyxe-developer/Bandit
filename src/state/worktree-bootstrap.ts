import { readFile } from "node:fs/promises";
import path from "node:path";

export type WorktreeBootstrapValidationReport = {
  status: "pass";
  policy: string;
  template: string;
  decisions: string[];
  evidence: string[];
};

type RawRecord = Record<string, unknown>;

type WorktreeBootstrapPolicy = {
  contract_version: number;
  policy_id: string;
  releaseAuthorizedDecisions: WorktreeBootstrapDecision[];
};

type WorktreeBootstrapDecision = {
  work_item: string;
  decision_kind: string;
  evidence_path: string;
  secret_copy_exception: string;
};

type WorktreeBootstrapEvidence = {
  contract_version: number;
  work_item: string;
  allowed_copy_entries: CopyEntry[];
  bootstrap_commands: BootstrapCommands;
};

type CopyEntry = {
  from: string;
  to: string;
  classification: string;
};

type BootstrapCommands = {
  setup: string;
  validation: string;
};

const POLICY_DISPLAY_PATH = ".bandit/policy/worktree-bootstrap.json";
const TEMPLATE_DISPLAY_PATH = "docs/templates/worktree-bootstrap.md";
const SECRET_CLASSIFICATION = "secret_material";
const SECRET_COPY_EXCEPTIONS = new Set(["none", "operator_supervised_secret_copy"]);

const REQUIRED_TEMPLATE_FIELDS = [
  "work_item",
  "source_artifacts",
  "allowed_copy_entries",
  "allowed_link_entries",
  "bootstrap_commands",
  "environment_references",
  "expected_runtime_dependencies",
  "secret_handling_boundary",
  "bootstrap_failure_evidence",
  "runnable_gate"
];

export async function validateWorktreeBootstrap(
  repoRoot: string
): Promise<WorktreeBootstrapValidationReport> {
  const policy = await readPolicy(repoRoot);
  await validateTemplate(repoRoot);

  const decisions: string[] = [];
  const evidencePaths: string[] = [];

  for (const decision of policy.releaseAuthorizedDecisions) {
    const evidence = await readEvidence(repoRoot, decision.evidence_path, decision.work_item);
    validateEvidenceAgainstDecision(evidence, decision);
    decisions.push(decision.work_item);
    evidencePaths.push(decision.evidence_path);
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    template: TEMPLATE_DISPLAY_PATH,
    decisions,
    evidence: evidencePaths
  };
}

async function readPolicy(repoRoot: string): Promise<WorktreeBootstrapPolicy> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  const content = await readRequiredFile(policyPath, POLICY_DISPLAY_PATH, "policy");
  return parsePolicy(content);
}

function parsePolicy(content: string): WorktreeBootstrapPolicy {
  const parsed = parseJsonObject(content, "worktree-bootstrap policy");

  if (parsed.contract_version !== 1) {
    throw new Error("Malformed worktree-bootstrap policy: missing contract_version 1");
  }

  if (parsed.policy_id !== "worktree-bootstrap-contract") {
    throw new Error("Malformed worktree-bootstrap policy: policy_id must be worktree-bootstrap-contract");
  }

  const releaseAuthorizedDecisions = readRequiredRecordList(
    parsed,
    "release_authorized_decisions",
    "worktree-bootstrap policy"
  ).map((decision) => ({
    work_item: readRequiredString(decision, "work_item", "worktree-bootstrap decision"),
    decision_kind: readRequiredString(decision, "decision_kind", "worktree-bootstrap decision"),
    evidence_path: readRepoRelativePath(
      decision,
      "evidence_path",
      "worktree-bootstrap decision"
    ),
    secret_copy_exception: readSecretCopyException(decision)
  }));

  return {
    contract_version: 1,
    policy_id: "worktree-bootstrap-contract",
    releaseAuthorizedDecisions
  };
}

async function validateTemplate(repoRoot: string) {
  const templatePath = path.join(repoRoot, TEMPLATE_DISPLAY_PATH);
  const content = await readRequiredFile(templatePath, TEMPLATE_DISPLAY_PATH, "template");

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!new RegExp(`^${escapeRegExp(field)}:`, "im").test(content)) {
      throw new Error(
        `Malformed template: ${TEMPLATE_DISPLAY_PATH}; missing required field: ${field}`
      );
    }
  }
}

async function readEvidence(
  repoRoot: string,
  evidencePath: string,
  expectedWorkItem: string
): Promise<WorktreeBootstrapEvidence> {
  const fullPath = path.join(repoRoot, evidencePath);
  const content = await readRequiredFile(fullPath, evidencePath, "evidence");
  const parsed = parseJsonObject(content, "worktree-bootstrap evidence");

  if (parsed.contract_version !== 1) {
    throw new Error(
      `Malformed worktree-bootstrap evidence for ${expectedWorkItem}: missing contract_version 1`
    );
  }

  const workItem = readRequiredString(parsed, "work_item", "worktree-bootstrap evidence");
  if (workItem !== expectedWorkItem) {
    throw new Error(
      `Malformed worktree-bootstrap evidence for ${expectedWorkItem}: work_item does not match`
    );
  }

  const allowedCopyEntries = readCopyEntries(parsed, workItem);
  const bootstrapCommands = readBootstrapCommands(parsed, workItem);

  return {
    contract_version: 1,
    work_item: workItem,
    allowed_copy_entries: allowedCopyEntries,
    bootstrap_commands: bootstrapCommands
  };
}

function readCopyEntries(parsed: RawRecord, workItem: string): CopyEntry[] {
  const entries = readRequiredRecordList(
    parsed,
    "allowed_copy_entries",
    `worktree-bootstrap evidence for ${workItem}`
  );

  return entries.map((entry) => ({
    from: readRepoRelativePath(entry, "from", `worktree-bootstrap copy entry for ${workItem}`),
    to: readRepoRelativePath(entry, "to", `worktree-bootstrap copy entry for ${workItem}`),
    classification: readRequiredString(
      entry,
      "classification",
      `worktree-bootstrap copy entry for ${workItem}`
    ).toLowerCase()
  }));
}

function readBootstrapCommands(parsed: RawRecord, workItem: string): BootstrapCommands {
  const commands = readRequiredRecord(
    parsed,
    "bootstrap_commands",
    `worktree-bootstrap evidence for ${workItem}`
  );

  return {
    setup: typeof commands.setup === "string" ? commands.setup : "",
    validation: typeof commands.validation === "string" ? commands.validation : ""
  };
}

function validateEvidenceAgainstDecision(
  evidence: WorktreeBootstrapEvidence,
  decision: WorktreeBootstrapDecision
) {
  validateNoSecretCopyEntries(evidence, decision);
  validateBootstrapValidationCommand(evidence);
}

function validateNoSecretCopyEntries(
  evidence: WorktreeBootstrapEvidence,
  decision: WorktreeBootstrapDecision
) {
  const secretEntries = evidence.allowed_copy_entries.filter(
    (entry) => entry.classification === SECRET_CLASSIFICATION
  );

  if (secretEntries.length === 0) {
    return;
  }

  if (decision.secret_copy_exception === "operator_supervised_secret_copy") {
    return;
  }

  throw new Error(
    "secret material copy entries require an explicit operator-supervised exception"
  );
}

function validateBootstrapValidationCommand(evidence: WorktreeBootstrapEvidence) {
  if (!evidence.bootstrap_commands.validation || evidence.bootstrap_commands.validation.trim() === "") {
    throw new Error(
      "bootstrap validation command is required before a worktree can be runnable"
    );
  }
}

function parseJsonObject(content: string, label: string): RawRecord {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Malformed ${label}: invalid JSON`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`Malformed ${label}: expected object`);
  }

  return parsed;
}

async function readRequiredFile(filePath: string, displayPath: string, kind: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      const prefix =
        kind === "policy"
          ? "Missing required policy"
          : kind === "template"
            ? "Missing required template"
            : "Missing required worktree-bootstrap evidence";
      throw new Error(`${prefix}: ${displayPath}`);
    }
    throw error;
  }
}

function readRequiredRecord(record: RawRecord, field: string, label: string): RawRecord {
  const value = record[field];
  if (!isRecord(value)) {
    throw new Error(`Malformed ${label}: ${field} must be object`);
  }

  return value;
}

function readRequiredRecordList(record: RawRecord, field: string, label: string): RawRecord[] {
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(`Malformed ${label}: ${field} must be an object list`);
  }

  return value;
}

function readRequiredString(record: RawRecord, field: string, label: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Malformed ${label}: ${field} must be string`);
  }

  return value.trim();
}

function readRepoRelativePath(record: RawRecord, field: string, label: string): string {
  const value = readRequiredString(record, field, label);
  const normalized = path.posix.normalize(value.replaceAll(path.win32.sep, path.posix.sep));

  if (
    path.isAbsolute(value) ||
    path.win32.isAbsolute(value) ||
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(`Malformed ${label}: ${field} must be a repo-relative path`);
  }

  return normalized;
}

function readSecretCopyException(record: RawRecord): string {
  const value = readRequiredString(
    record,
    "secret_copy_exception",
    "worktree-bootstrap decision"
  );

  if (!SECRET_COPY_EXCEPTIONS.has(value)) {
    throw new Error(
      "Malformed worktree-bootstrap decision: secret_copy_exception must be one of none, operator_supervised_secret_copy"
    );
  }

  return value;
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
