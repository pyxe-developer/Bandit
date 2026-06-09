import { canonicalJson } from "../state/gate-determinism.js";
import {
  LEDGER_RELATIVE_PATH,
  validateWorkIntakeLedger,
  listWorkIntakeLedger
} from "../state/work-intake-ledger.js";

export interface WorkIntakeResult {
  stdout?: string;
  stderr?: string;
  code?: number;
}

const MUTATION_REFUSAL =
  "work-intake mutation is limited to Repo PM Coordinator or future Work Intake Triage Skill\n" +
  "does not allocate Work Item IDs\n";

export async function workIntake(
  repoRoot: string,
  args: string[]
): Promise<WorkIntakeResult> {
  const [subcommand, ...rest] = args;

  if (subcommand === "validate") {
    return runValidate(repoRoot, rest);
  }

  if (subcommand === "list") {
    return runList(repoRoot, rest);
  }

  return { stderr: MUTATION_REFUSAL, code: 1 };
}

async function runValidate(
  repoRoot: string,
  args: string[]
): Promise<WorkIntakeResult> {
  const jsonMode = args.includes("--json");
  const result = await validateWorkIntakeLedger(repoRoot);

  if (result.diagnostics.length > 0) {
    return { stderr: result.diagnostics.join("\n") + "\n", code: 1 };
  }

  const { ledger } = result;
  const report = {
    status: "pass",
    ledger: LEDGER_RELATIVE_PATH,
    entries: ledger.entries,
    read_only: {
      no_claim_authority: ledger.authority.no_claim_authority,
      no_work_item_allocation: ledger.authority.no_work_item_allocation,
      no_scheduler_authority: ledger.authority.no_scheduler_authority,
      no_browser_mutation_authority: ledger.authority.no_browser_mutation_authority
    },
    policy_versions: { "work-intake-ledger": ledger.version }
  };

  if (jsonMode) {
    return { stdout: canonicalJson(report) + "\n" };
  }

  return {
    stdout: `Work intake ledger is valid. ${ledger.entries.length} entries.\n`
  };
}

async function runList(
  repoRoot: string,
  args: string[]
): Promise<WorkIntakeResult> {
  const jsonMode = args.includes("--json");
  const { ledger } = await listWorkIntakeLedger(repoRoot);

  const nextFormationCandidate =
    ledger.entries.find((e) => e.intake_outcome === "accepted_to_queue") ?? null;
  const deferredContext = ledger.entries.filter(
    (e) => e.intake_outcome === "deferred"
  );

  const report = {
    status: "pass",
    entries: ledger.entries,
    next_formation_candidate: nextFormationCandidate,
    deferred_context: deferredContext,
    read_only: {
      no_claim_authority: ledger.authority.no_claim_authority,
      no_work_item_allocation: ledger.authority.no_work_item_allocation,
      no_scheduler_authority: ledger.authority.no_scheduler_authority,
      no_browser_mutation_authority: ledger.authority.no_browser_mutation_authority
    }
  };

  if (jsonMode) {
    return { stdout: canonicalJson(report) + "\n" };
  }

  return {
    stdout:
      ledger.entries
        .map(
          (e) => `${e.id} | ${e.intake_outcome} | ${e.suggested_work_item_type}`
        )
        .join("\n") + "\n"
  };
}
