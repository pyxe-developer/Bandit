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
const REPO_PM_TEMPLATE_DISPLAY_PATH =
  "docs/templates/repo-pm-formation-prompt.md";

const WORK_ITEM_PM_BASELINE_SECTIONS = [
  "Current Repo State",
  "Stage Sequence",
  "Required Evidence",
  "Role Boundaries",
  "Verification Commands",
  "Known Blockers",
  "Stop Conditions",
  "Forbidden Actions"
];

const WORK_ITEM_PM_BASELINE_GATES = [
  "formation_approved",
  "orchestration_plan_recorded",
  "stage2_red_recorded",
  "stage3_implementation_evidence",
  "stage4_review_evidence",
  "stage5_landing_verdict",
  "stage5_landing_action",
  "stage6_retrospective"
];

const REPO_PM_BASELINE_SECTIONS = [
  "Required Reads",
  "Context And Boundary",
  "Target Resolution",
  "Formation Flow",
  "Review Evidence",
  "Operator Input Boundaries",
  "Stop Conditions",
  "Forbidden Actions"
];

const REPO_PM_BASELINE_GATES = [
  "stage0_context_readiness",
  "brief_created",
  "qwen_formation_review",
  "coderabbit_formation_review_or_timeout",
  "aggregate_formation_review",
  "formation_approved",
  "stage2_not_started"
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
  problems.push(...(await foreignSourceLeakageProblems(repoRoot, contract, id)));
  problems.push(...(await reviewerRouteProblems(repoRoot, contract, id)));

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

  return baselineSectionsFor(id).filter(
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

  return baselineGatesFor(id).filter((gate) => !declaredGates.includes(gate)).map(
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

async function foreignSourceLeakageProblems(
  repoRoot: string,
  contract: RawRecord,
  id: string
): Promise<string[]> {
  const sources = Array.isArray(contract.forbidden_foreign_sources)
    ? (contract.forbidden_foreign_sources as unknown[])
    : [];
  if (sources.length === 0) {
    return [];
  }

  const promptPath = contract.prompt_path;
  if (typeof promptPath !== "string" || promptPath.trim().length === 0) {
    return [];
  }

  let template: string;
  try {
    template = await readFile(path.join(repoRoot, promptPath), "utf8");
  } catch {
    return [];
  }

  const categories = new Set<string>();

  for (const rawSource of sources) {
    if (typeof rawSource !== "string" || rawSource.length === 0) continue;
    if (!tokenAppearsInPositiveContext(template, rawSource)) continue;
    if (isRepositoryPathToken(rawSource)) {
      categories.add("repository");
    } else if (isWorkflowPolicyToken(rawSource)) {
      categories.add("policy");
    } else {
      categories.add("routing");
    }
  }

  return problemsFromCategories(categories, id);
}

async function reviewerRouteProblems(
  repoRoot: string,
  contract: RawRecord,
  id: string
): Promise<string[]> {
  const localQwenRoute = isRecord(contract.local_qwen_route)
    ? contract.local_qwen_route
    : null;
  if (!localQwenRoute) {
    return [];
  }

  const promptPath = contract.prompt_path;
  if (typeof promptPath !== "string" || promptPath.trim().length === 0) {
    return [];
  }

  let template: string;
  try {
    template = await readFile(path.join(repoRoot, promptPath), "utf8");
  } catch {
    return [];
  }

  const categories = new Set<string>();

  if (localQwenRoute.direct_qwen_cli_allowed === false) {
    if (hasUnauthorizedQwenCliUsageInPositiveContext(template)) {
      categories.add("routing");
    }
  }

  if (localQwenRoute.ollama_allowed === false) {
    if (tokenAppearsInPositiveContext(template, "ollama")) {
      categories.add("routing");
    }
  }

  return problemsFromCategories(categories, id);
}

const UNAUTHORIZED_QWEN_CLI_PATTERNS: RegExp[] = [
  /\bqwen\s+directly\b/i,
  /\bdirectly\s+qwen\b/i,
  /\bqwen\s+commands?\b/i,
  /\bqwen\s+fallback\b/i,
  /\bqwen\s+install\b/i,
  /\brun\s+qwen\b/i,
  /\binstall\s+qwen\b/i,
  /\bvia\s+qwen\b/i,
  /\buse\s+qwen\b(?!-)/i
];

const FORBIDDEN_LANGUAGE_PATTERNS: RegExp[] = [
  /\bdo\s+not\b/i,
  /\bdon'?t\b/i,
  /\bmust\s+not\b/i,
  /\bshould\s+not\b/i,
  /\bshall\s+not\b/i,
  /\bnever\b/i,
  /\bforbidden\b/i,
  /\bprohibit(?:ed|s)?\b/i,
  /\bnot\s+allowed\b/i,
  /\bavoid\b/i,
  /\brefuse\b/i,
  /\bstop\b/i
];

function paragraphContainsForbiddenLanguage(paragraph: string): boolean {
  return FORBIDDEN_LANGUAGE_PATTERNS.some((pattern) => pattern.test(paragraph));
}

function findMarkdownContextAround(text: string, index: number): string | null {
  if (isInsideMarkdownCode(text, index)) {
    return null;
  }

  const lines = text.split("\n");
  let cursor = 0;
  let lineIndex = 0;
  for (const [candidateIndex, line] of lines.entries()) {
    const lineEnd = cursor + line.length;
    if (index >= cursor && index <= lineEnd) {
      lineIndex = candidateIndex;
      break;
    }
    cursor = lineEnd + 1;
  }

  let start = lineIndex;
  while (start > 0 && !isMarkdownContextBoundary(lines[start - 1] ?? "")) {
    start -= 1;
  }

  let end = lineIndex;
  while (
    end < lines.length - 1 &&
    !isMarkdownContextBoundary(lines[end + 1] ?? "")
  ) {
    end += 1;
  }

  return lines.slice(start, end + 1).join("\n");
}

function isMarkdownContextBoundary(line: string): boolean {
  if (line.trim().length === 0) return true;
  if (/^\s{0,3}#{1,6}\s/.test(line)) return true;
  if (/^\s{0,3}[-*+]\s/.test(line)) return true;
  if (/^\s{0,3}\d+\.\s/.test(line)) return true;
  if (/^\s{0,3}\|/.test(line)) return true;
  return false;
}

function isInsideMarkdownCode(text: string, index: number): boolean {
  if (isInsideCodeFence(text, index)) return true;
  return isInsideInlineCode(text, index);
}

function isInsideCodeFence(text: string, index: number): boolean {
  const fencePattern = /^\s*```.*$/gm;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = fencePattern.exec(text)) !== null) {
    if (match.index >= index) break;
    count += 1;
  }
  return count % 2 === 1;
}

function isInsideInlineCode(text: string, index: number): boolean {
  const lineStart = text.lastIndexOf("\n", index - 1) + 1;
  const lineEndIndex = text.indexOf("\n", index);
  const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
  const before = text.slice(lineStart, index);
  const after = text.slice(index, lineEnd);
  return countUnescapedBackticks(before) % 2 === 1 && after.includes("`");
}

function countUnescapedBackticks(value: string): number {
  let count = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "`" && value[index - 1] !== "\\") {
      count += 1;
    }
  }
  return count;
}

function tokenAppearsInPositiveContext(template: string, token: string): boolean {
  const lowerTemplate = template.toLowerCase();
  const lowerToken = token.toLowerCase();
  if (lowerToken.length === 0) return false;

  let cursor = 0;
  while (cursor < lowerTemplate.length) {
    const index = lowerTemplate.indexOf(lowerToken, cursor);
    if (index === -1) break;
    const context = findMarkdownContextAround(template, index);
    if (context && !paragraphContainsForbiddenLanguage(context)) {
      return true;
    }
    cursor = index + lowerToken.length;
  }
  return false;
}

function hasUnauthorizedQwenCliUsageInPositiveContext(template: string): boolean {
  for (const pattern of UNAUTHORIZED_QWEN_CLI_PATTERNS) {
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g")
      ? pattern.flags
      : `${pattern.flags}g`);
    let match: RegExpExecArray | null;
    while ((match = globalPattern.exec(template)) !== null) {
      const context = findMarkdownContextAround(template, match.index);
      if (context && !paragraphContainsForbiddenLanguage(context)) {
        return true;
      }
      if (globalPattern.lastIndex === match.index) {
        globalPattern.lastIndex += 1;
      }
    }
  }
  return false;
}

function problemsFromCategories(
  categories: Set<string>,
  id: string
): string[] {
  const problems: string[] = [];
  if (categories.has("repository")) {
    problems.push(`prompt contract ${id} leaks foreign repository source`);
  }
  if (categories.has("policy")) {
    problems.push(`prompt contract ${id} leaks foreign workflow policy`);
  }
  if (categories.has("routing")) {
    problems.push(`prompt contract ${id} permits unauthorized Local Qwen routing`);
  }
  return problems;
}

function isRepositoryPathToken(token: string): boolean {
  if (token.startsWith("/")) return true;
  if (token.startsWith("~")) return true;
  if (token.includes("\\") || token.includes("/")) return true;
  if (/seekwins/i.test(token)) return true;
  return false;
}

function isWorkflowPolicyToken(token: string): boolean {
  return /^wi-\d+/i.test(token);
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

function baselineSectionsFor(id: string): string[] {
  if (id === "repo-pm") {
    return REPO_PM_BASELINE_SECTIONS;
  }
  return WORK_ITEM_PM_BASELINE_SECTIONS;
}

function baselineGatesFor(id: string): string[] {
  if (id === "repo-pm") {
    return REPO_PM_BASELINE_GATES;
  }
  return WORK_ITEM_PM_BASELINE_GATES;
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
    prompt_contracts: [
      defaultWorkItemPmPromptContract(),
      defaultRepoPmPromptContract()
    ]
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function writeDefaultOrchestratorPromptTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, TEMPLATE_DISPLAY_PATH);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, DEFAULT_PROMPT_TEMPLATE, "utf8");
}

export async function writeDefaultRepoPmPromptTemplate(repoRoot: string) {
  const filePath = path.join(repoRoot, REPO_PM_TEMPLATE_DISPLAY_PATH);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, DEFAULT_REPO_PM_PROMPT_TEMPLATE, "utf8");
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
    required_sections: WORK_ITEM_PM_BASELINE_SECTIONS,
    required_gates: WORK_ITEM_PM_BASELINE_GATES,
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

function defaultRepoPmPromptContract() {
  return {
    id: "repo-pm",
    prompt_path: REPO_PM_TEMPLATE_DISPLAY_PATH,
    role: "repo_pm_formation_guidance",
    trust_inputs: {
      allowed: [
        "AGENTS.md",
        "CONTEXT.md",
        "CLEAN_CODE.md",
        "docs/verification/STAGE_RUBRICS.md",
        "docs/roadmap/CURRENT_CONTEXT.md",
        "docs/roadmap/ROADMAP.md",
        "STATUS.md",
        "docs/prds/BANDIT-PRD-005-bandit-work-commands.md",
        "docs/specs/<ID>.json",
        ".bandit/bootstrap-gaps.json",
        ".bandit/reviewers/local-qwen.json"
      ],
      non_authoritative: [
        "chat_text",
        "model_memory",
        "live_harness_state",
        "provider_dashboard",
        "work_intake_ledger_priority",
        "slash_command_text"
      ]
    },
    authority_boundary: {
      prompt_is_authoritative: false,
      canonical_sources_replaced: [],
      cli_state_mutation: "cli_only"
    },
    required_sections: REPO_PM_BASELINE_SECTIONS,
    required_gates: REPO_PM_BASELINE_GATES,
    role_boundaries: {
      repo_pm_owns_formation: true,
      work_item_pm_owns_orchestration: false,
      test_writer_owns_red: false,
      implementation_writer_owns_source_only: false,
      stage3_writer_can_edit_tests: false,
      codex_red_requires_claude_stage3: true,
      reviewer_owns_review_evidence: true,
      landing_agent_owns_landing_verdict: false,
      closeout_agent_owns_retrospective: false
    },
    local_qwen_route: {
      profile: ".bandit/reviewers/local-qwen.json",
      adapter: "node bin/omlx-chat-completions.mjs",
      direct_qwen_cli_allowed: false,
      ollama_allowed: false
    },
    forbidden_foreign_sources: [
      "SeekWins",
      "WI-00",
      "Ollama"
    ],
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

const DEFAULT_REPO_PM_PROMPT_TEMPLATE = `# Repo PM Formation Prompt

This prompt is Bandit-native adapter guidance for Stage 1 work-item formation.
It is not canonical workflow authority and cannot replace Bandit CLI
validation, roadmap/current-context authority, work-item artifacts,
coordination logs, or formation review evidence.

## Required Reads

Read AGENTS.md, CONTEXT.md, docs/roadmap/CURRENT_CONTEXT.md,
docs/roadmap/ROADMAP.md, CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md,
STATUS.md, and the selected source spec before forming work.

## Context And Boundary

Use repository artifacts only. Treat prompt text, chat history, live harness
state, slash-command text, and Work Intake Ledger priority as non-authoritative
unless roadmap/current-context authority names them.

## Target Resolution

Resolve the current or next authorized target from ROADMAP.md and
CURRENT_CONTEXT.md. Dereference PRD, spec, or WIL provenance only after roadmap
authorization.

## Formation Flow

Create or repair the Stage 1 brief and coordination evidence only. Stop at
formation_approved and do not create Stage 2 or later evidence.

## Review Evidence

Use Local Qwen only through .bandit/reviewers/local-qwen.json and node
bin/omlx-chat-completions.mjs. Record CodeRabbit timeout evidence honestly
without claiming a pass.

## Operator Input Boundaries

Halt for product, UAT, policy, business, explicit cost/risk, Trust Verifier
cutover, merge, push, deploy, hosted services, telemetry, external mutation, or
genuinely ambiguous scope.

## Stop Conditions

Stop when roadmap/current-context disagree, source material is missing, Local
Qwen is unavailable through the authorized route, formation reviews block, or
operator-owned input is required.

## Forbidden Actions

Do not start Stage 2, create execution artifacts, use direct qwen CLI, use
Ollama as a reviewer route, scan WIL as a hidden scheduler, approve Trust
Verifier cutover, replace old gates, merge, push, deploy, or mutate state
outside Bandit CLI commands.
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
