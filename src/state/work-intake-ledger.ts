import { readFile } from "node:fs/promises";
import path from "node:path";

export interface WorkIntakeTransition {
  at: string;
  actor: string;
  from: string;
  to: string;
  source: string;
}

export interface WorkIntakeLedgerEntry {
  id: string;
  title: string;
  source_artifacts: string[];
  source_anchor?: string;
  origin_date?: string;
  rationale?: string;
  suggested_work_item_type: string;
  depends_on?: string[];
  scope_summary?: string;
  risk_product_scope_status: string;
  intake_outcome: string;
  claimable: boolean;
  transition_history: WorkIntakeTransition[];
  source_work_item?: string;
  lesson?: string;
  hypothesis?: string;
  metric?: string;
  baseline?: string;
  evaluation_window?: string;
  current_status?: string;
  outcome?: string;
}

export interface WorkIntakeLedgerAuthority {
  source?: string;
  allowed_mutators?: string[];
  read_only_consumers?: string[];
  no_claim_authority: boolean;
  no_work_item_allocation: boolean;
  no_scheduler_authority: boolean;
  no_browser_mutation_authority: boolean;
}

export interface WorkIntakeLedger {
  version: number;
  authority: WorkIntakeLedgerAuthority;
  entries: WorkIntakeLedgerEntry[];
}

export const LEDGER_RELATIVE_PATH = ".bandit/work-intake-ledger.json";

// Canonical FOLLOWUPS.md heading -> canonical Work Intake Ledger title.
// Used as a fallback when the FOLLOWUPS.md Triage Status section does not
// include explicit `- heading -> new name.` mapping lines.
const FOLLOWUPS_HEADING_TO_TITLE: Readonly<Record<string, string>> = {
  "Add Bandit UI Polish From Attached Design":
    "Bandit Cockpit UI Polish From Attached Design",
  "Revisit Claim Requirement After Bootstrap":
    "Claim-First Transition Policy Triage",
  "Consider Repo-Wide Transition Index":
    "Repo-Wide Transition Index Decision",
  "Schedule Coordination Primitive Implementation":
    "Coordination Primitive Completion Triage",
  "Move From Local Main Landing To PR And CI/CD Workflow":
    "PR And CI/CD Landing Workflow Policy",
  "Push Bandit Updates To Installed Copies":
    "Installed-Copy Update Path"
};

export async function readWorkIntakeLedger(
  repoRoot: string
): Promise<WorkIntakeLedger> {
  const ledgerPath = path.join(repoRoot, LEDGER_RELATIVE_PATH);
  const content = await readFile(ledgerPath, "utf8");
  return JSON.parse(content) as WorkIntakeLedger;
}

export interface WorkIntakeValidationResult {
  ledger: WorkIntakeLedger;
  diagnostics: string[];
}

export async function validateWorkIntakeLedger(
  repoRoot: string
): Promise<WorkIntakeValidationResult> {
  const ledger = await readWorkIntakeLedger(repoRoot);
  const diagnostics: string[] = [];

  for (const entry of ledger.entries) {
    collectEntryDiagnostics(entry, diagnostics);
  }

  const followupsPath = path.join(repoRoot, "FOLLOWUPS.md");
  let followupsContent: string | null = null;
  try {
    followupsContent = await readFile(followupsPath, "utf8");
  } catch {
    // FOLLOWUPS.md is optional
  }

  if (followupsContent) {
    const headingTitleMap = buildFollowupsHeadingTitleMap(followupsContent);
    collectSourcePreservationDiagnostics(
      ledger.entries,
      followupsContent,
      diagnostics
    );
    if (isFollowupsDeprecated(followupsContent)) {
      collectDeprecatedFollowupsDiagnostics(
        ledger.entries,
        followupsContent,
        headingTitleMap,
        diagnostics
      );
    }
  }

  return { ledger, diagnostics };
}

export async function listWorkIntakeLedger(
  repoRoot: string
): Promise<{ ledger: WorkIntakeLedger }> {
  const ledger = await readWorkIntakeLedger(repoRoot);
  return { ledger };
}

function collectEntryDiagnostics(
  entry: WorkIntakeLedgerEntry,
  diagnostics: string[]
): void {
  if (!entry.source_artifacts || entry.source_artifacts.length === 0) {
    diagnostics.push(`missing source artifacts: ${entry.id}`);
  }
  if (!entry.risk_product_scope_status) {
    diagnostics.push(`missing risk product scope status: ${entry.id}`);
  }
  if (!entry.intake_outcome) {
    diagnostics.push(`missing intake outcome: ${entry.id}`);
  }
  if (!entry.transition_history || entry.transition_history.length === 0) {
    diagnostics.push(`missing transition history: ${entry.id}`);
  }
  if (entry.claimable !== false) {
    diagnostics.push(`proposal must not be claimable: ${entry.id}`);
  }
}

function isFollowupsDeprecated(content: string): boolean {
  return content.includes("deprecated source metadata");
}

interface FollowupsOpenEntry {
  heading: string;
  sourceNotes: string[];
}

function parseFollowupsOpenEntries(content: string): FollowupsOpenEntry[] {
  const openMatch = content.match(/## Open\n([\s\S]*?)(?=\n## |\s*$)/);
  const openSection = openMatch?.[1] ?? "";
  const entries: FollowupsOpenEntry[] = [];
  const chunks = openSection.split(/\n(?=### )/);
  for (const chunk of chunks) {
    const headingMatch = chunk.match(/^### (.+)/);
    if (!headingMatch || !headingMatch[1]) continue;
    const heading = headingMatch[1].trim();
    const sourceNotes: string[] = [];
    for (const line of chunk.split("\n")) {
      const noteMatch = line.match(/\*\*Source note:\*\*\s+`([^`]+)`/);
      if (noteMatch && noteMatch[1]) {
        sourceNotes.push(noteMatch[1]);
      }
    }
    entries.push({ heading, sourceNotes });
  }
  return entries;
}

function parseFollowupsTriageMap(content: string): Map<string, string> {
  const result = new Map<string, string>();
  const triageMatch = content.match(/## Triage Status\n([\s\S]*?)(?=\n## |\s*$)/);
  const triageSection = triageMatch?.[1] ?? "";
  for (const rawLine of triageSection.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("- ")) continue;
    const match = line.match(/^-\s+(.+?)\s*->\s*(.+?)\.?\s*$/);
    if (match && match[1] && match[2]) {
      result.set(match[1].trim(), match[2].trim().replace(/\.$/, ""));
    }
  }
  return result;
}

function buildFollowupsHeadingTitleMap(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const [heading, title] of Object.entries(FOLLOWUPS_HEADING_TO_TITLE)) {
    map.set(heading, title);
  }
  for (const [heading, title] of parseFollowupsTriageMap(content)) {
    map.set(heading, title);
  }
  return map;
}

function collectSourcePreservationDiagnostics(
  entries: WorkIntakeLedgerEntry[],
  followupsContent: string,
  diagnostics: string[]
): void {
  const openEntries = parseFollowupsOpenEntries(followupsContent);
  for (const fEntry of openEntries) {
    if (fEntry.sourceNotes.length === 0) continue;
    const ledgerEntry = entries.find((e) => e.source_anchor === fEntry.heading);
    if (!ledgerEntry) continue;
    for (const note of fEntry.sourceNotes) {
      if (!ledgerEntry.source_artifacts.includes(note)) {
        diagnostics.push(`missing preserved source artifact: ${ledgerEntry.id}`);
      }
    }
  }
}

function isValidLedgerEntry(entry: WorkIntakeLedgerEntry | undefined): boolean {
  if (!entry) return false;
  if (!entry.intake_outcome) return false;
  if (!entry.risk_product_scope_status) return false;
  if (entry.claimable !== false) return false;
  if (!entry.transition_history || entry.transition_history.length === 0) {
    return false;
  }
  return true;
}

function collectDeprecatedFollowupsDiagnostics(
  entries: WorkIntakeLedgerEntry[],
  followupsContent: string,
  headingTitleMap: Map<string, string>,
  diagnostics: string[]
): void {
  const openEntries = parseFollowupsOpenEntries(followupsContent);
  for (const fEntry of openEntries) {
    const canonicalTitle =
      headingTitleMap.get(fEntry.heading) ?? fEntry.heading;
    const matchedEntry = entries.find((e) => e.source_anchor === fEntry.heading);
    if (!isValidLedgerEntry(matchedEntry)) {
      diagnostics.push(
        `FOLLOWUPS.md is deprecated but open entry is not valid in work intake ledger: ${canonicalTitle}`
      );
    }
  }
}
