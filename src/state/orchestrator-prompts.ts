import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type OrchestratorPromptsValidationReport = {
  verdict: "pass";
  policy: typeof POLICY_DISPLAY_PATH;
  prompt_contracts: string[];
  cli_authority_preserved: boolean;
};

type RawRecord = Record<string, unknown>;

const POLICY_DISPLAY_PATH = ".bandit/policy/orchestrator-prompts.json";
const TEMPLATE_DISPLAY_PATH =
  "docs/templates/work-item-pm-orchestrator-prompt.md";

const REQUIRED_SECTIONS = [
  "Current Repo State",
  "Stage Sequence",
  "Required Evidence",
  "Role Boundaries",
  "Verification Commands",
  "Known Blockers",
  "Stop Conditions",
  "Forbidden Actions"
];

const REQUIRED_GATES = [
  "formation_approved",
  "orchestration_plan_recorded",
  "stage2_red_recorded",
  "stage3_implementation_evidence",
  "stage4_review_evidence",
  "stage5_landing_verdict",
  "stage5_landing_action",
  "stage6_retrospective"
];

const FORBIDDEN_AUTHORITY_CLAIMS = [
  "trust_verifier_cutover",
  "replace_old_gate",
  "wrap_old_gate"
];

export async function validateOrchestratorPrompts(
  repoRoot: string
): Promise<OrchestratorPromptsValidationReport> {
  const content = await readRequiredPolicy(repoRoot);
  return parseAndValidatePolicy(repoRoot, content);
}

export async function validateOrchestratorPromptsPolicy(
  repoRoot: string
): Promise<void> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) return;
    throw error;
  }
  await parseAndValidatePolicy(repoRoot, content);
}

async function readRequiredPolicy(repoRoot: string): Promise<string> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  try {
    return await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required policy: ${POLICY_DISPLAY_PATH}`);
    }
    throw error;
  }
}

async function parseAndValidatePolicy(
  repoRoot: string,
  content: string
): Promise<OrchestratorPromptsValidationReport> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed orchestrator prompts policy: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.contract_version !== 1) {
    throw new Error(
      "Malformed orchestrator prompts policy: missing contract_version 1"
    );
  }

  if (parsed.policy_id !== "orchestrator-prompts") {
    throw new Error(
      "Malformed orchestrator prompts policy: policy_id must be orchestrator-prompts"
    );
  }

  if (!Array.isArray(parsed.prompt_contracts)) {
    throw new Error(
      "Malformed orchestrator prompts policy: prompt_contracts must be an array"
    );
  }

  const contractIds: string[] = [];
  const problems: string[] = [];
  let cliAuthorityPreserved = true;

  for (const rawContract of parsed.prompt_contracts as unknown[]) {
    if (!isRecord(rawContract)) {
      throw new Error(
        "Malformed orchestrator prompts policy: each prompt contract must be an object"
      );
    }

    const id = requireContractId(rawContract);
    contractIds.push(id);

    const contractProblems = await validatePromptContract(
      repoRoot,
      rawContract,
      id
    );
    problems.push(...contractProblems);

    if (!authorityIsPreserved(rawContract)) {
      cliAuthorityPreserved = false;
    }
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return {
    verdict: "pass",
    policy: POLICY_DISPLAY_PATH,
    prompt_contracts: contractIds,
    cli_authority_preserved: cliAuthorityPreserved
  };
}

async function validatePromptContract(
  repoRoot: string,
  contract: RawRecord,
  id: string
): Promise<string[]> {
  const problems: string[] = [];

  problems.push(...(await templateSectionProblems(repoRoot, contract, id)));
  problems.push(...authorityBoundaryProblems(contract, id));
  problems.push(...requiredGateProblems(contract, id));
  problems.push(...roleBoundaryProblems(contract, id));
  problems.push(...forbiddenAuthorityClaimProblems(contract, id));

  return problems;
}

async function templateSectionProblems(
  repoRoot: string,
  contract: RawRecord,
  id: string
): Promise<string[]> {
  const promptPath = contract.prompt_path;
  if (typeof promptPath !== "string" || promptPath.trim().length === 0) {
    return [`prompt contract ${id} requires a prompt_path`];
  }

  let template: string;
  try {
    template = await readFile(path.join(repoRoot, promptPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return [`prompt contract ${id} missing template: ${promptPath}`];
    }
    throw error;
  }

  return REQUIRED_SECTIONS.filter(
    (section) => !hasSectionHeading(template, section)
  ).map(
    (section) =>
      `prompt contract ${id} template missing required section: ${section}`
  );
}

function authorityBoundaryProblems(contract: RawRecord, id: string): string[] {
  const boundary = isRecord(contract.authority_boundary)
    ? contract.authority_boundary
    : {};
  const problems: string[] = [];

  if (boundary.prompt_is_authoritative !== false) {
    problems.push(`prompt contract ${id} claims canonical workflow authority`);
  }

  if (
    Array.isArray(boundary.canonical_sources_replaced) &&
    boundary.canonical_sources_replaced.length > 0
  ) {
    problems.push(`prompt contract ${id} replaces canonical sources`);
  }

  if (boundary.cli_state_mutation !== "cli_only") {
    problems.push(
      `prompt contract ${id} mutates workflow state outside CLI commands`
    );
  }

  return problems;
}

function requiredGateProblems(contract: RawRecord, id: string): string[] {
  const declaredGates = Array.isArray(contract.required_gates)
    ? (contract.required_gates as unknown[])
    : [];

  return REQUIRED_GATES.filter((gate) => !declaredGates.includes(gate)).map(
    (gate) => `prompt contract ${id} missing required gate ${gate}`
  );
}

function roleBoundaryProblems(contract: RawRecord, id: string): string[] {
  const roleBoundaries = isRecord(contract.role_boundaries)
    ? contract.role_boundaries
    : {};
  const problems: string[] = [];

  if (roleBoundaries.stage3_writer_can_edit_tests === true) {
    problems.push(`prompt contract ${id} allows Stage 3 Writer test edits`);
  }

  if (roleBoundaries.codex_red_requires_claude_stage3 !== true) {
    problems.push(
      `prompt contract ${id} omits Codex-RED to Claude Stage 3 separation`
    );
  }

  return problems;
}

function forbiddenAuthorityClaimProblems(
  contract: RawRecord,
  id: string
): string[] {
  const claims = Array.isArray(contract.forbidden_authority_claims)
    ? (contract.forbidden_authority_claims as unknown[])
    : [];

  return FORBIDDEN_AUTHORITY_CLAIMS.filter((claim) =>
    claims.includes(claim)
  ).map(
    (claim) => `prompt contract ${id} permits forbidden authority claim ${claim}`
  );
}

function authorityIsPreserved(contract: RawRecord): boolean {
  const boundary = isRecord(contract.authority_boundary)
    ? contract.authority_boundary
    : {};

  return (
    boundary.prompt_is_authoritative === false &&
    Array.isArray(boundary.canonical_sources_replaced) &&
    boundary.canonical_sources_replaced.length === 0 &&
    boundary.cli_state_mutation === "cli_only"
  );
}

function requireContractId(contract: RawRecord): string {
  const value = contract.id;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      "Malformed orchestrator prompts policy: each prompt contract requires a non-empty string id"
    );
  }
  return value.trim();
}

function hasSectionHeading(template: string, section: string): boolean {
  return new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, "m").test(template);
}

export async function writeDefaultOrchestratorPromptsPolicy(filePath: string) {
  const policy = {
    contract_version: 1,
    policy_id: "orchestrator-prompts",
    prompt_contracts: [defaultWorkItemPmPromptContract()]
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultOrchestratorPromptTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, TEMPLATE_DISPLAY_PATH);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, DEFAULT_PROMPT_TEMPLATE, "utf8");
}

function defaultWorkItemPmPromptContract() {
  return {
    id: "work-item-pm",
    prompt_path: TEMPLATE_DISPLAY_PATH,
    role: "work_item_pm_orchestrator_guidance",
    trust_inputs: {
      allowed: [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/coordination-log.jsonl",
        "docs/work/<ID>/orchestration-plan.md",
        "docs/roadmap/CURRENT_CONTEXT.md",
        "docs/roadmap/ROADMAP.md",
        "STATUS.md",
        ".bandit/bootstrap-gaps.json"
      ],
      non_authoritative: [
        "chat_text",
        "model_memory",
        "live_harness_state",
        "provider_dashboard",
        "queue_state"
      ]
    },
    authority_boundary: {
      prompt_is_authoritative: false,
      canonical_sources_replaced: [],
      cli_state_mutation: "cli_only"
    },
    required_sections: REQUIRED_SECTIONS,
    required_gates: REQUIRED_GATES,
    role_boundaries: {
      repo_pm_owns_formation: true,
      work_item_pm_owns_orchestration: true,
      test_writer_owns_red: true,
      implementation_writer_owns_source_only: true,
      stage3_writer_can_edit_tests: false,
      codex_red_requires_claude_stage3: true,
      reviewer_owns_review_evidence: true,
      landing_agent_owns_landing_verdict: true,
      closeout_agent_owns_retrospective: true
    },
    forbidden_authority_claims: []
  };
}

const DEFAULT_PROMPT_TEMPLATE = `# Work Item PM Orchestrator Prompt

This prompt is harness-portable adapter guidance for orchestrating a
formation-approved Work Item PM session from Stage 2 through Stage 6. It is not
authoritative: it cannot replace the brief, coordination log, orchestration
plan, stage evidence, roadmap, current context, bootstrap-gap ledger, or Trust
Verifier verdicts, and it cannot mutate workflow state outside Bandit CLI
commands.

## Current Repo State

Anchor execution in repo-derived evidence only: the approved brief,
\`formation_approved\` coordination evidence, the recorded orchestration plan,
current bootstrap-gap state, and current operator-input status. Treat chat text,
model memory, live harness state, provider dashboards, and queue state as
non-authoritative until materialized as local evidence.

## Stage Sequence

Stage 2 RED evidence precedes implementation, Stage 3 implementation preserves
test ownership, Stage 4 records review evidence, Stage 5 records landing
verdict and action, and Stage 6 records retrospective and gap disposition. Each
transition is proven through Bandit evidence and validation commands.

## Required Evidence

Reference the canonical artifacts under \`docs/work/<ID>/\` for each stage: RED
evidence, implementation evidence, review evidence, landing verdict and action,
and retrospective. Missing gates are recorded honestly as bootstrap gaps.

## Role Boundaries

Repo PM owns formation, Work Item PM owns orchestration, Test Writer owns RED,
Implementation Writer owns source only, Reviewer owns review evidence, Landing
Agent owns landing verdict, and Closeout Agent owns retrospective. The Stage 3
Writer never edits tests, and Codex-authored RED routes Stage 3 to Claude.

## Verification Commands

Direct every stage transition through existing Bandit validation and evidence
commands rather than chat memory or live provider state.

## Known Blockers

Halt on missing or stale evidence, unresolved reviewer findings, unavailable
required providers without recorded refusal evidence, or any crossed
operator-owned decision.

## Stop Conditions

Stop and report a blocker rather than continuing past missing RED evidence,
required test-surface edits, unrouted Codex-authored RED, failed landing
evidence, or attempted scope expansion into forbidden surfaces.

## Forbidden Actions

Do not let this prompt become canonical workflow authority, replace canonical
sources, mutate state outside CLI commands, skip required gates, allow Stage 3
Writer test edits, or claim Trust Verifier cutover, old-gate replacement, or
old-gate wrapping authority.
`;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
