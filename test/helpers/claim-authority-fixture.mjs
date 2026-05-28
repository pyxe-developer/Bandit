import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile,
  writeWorkBrief
} from "./bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "../..");

export const claimPolicyPath = ".bandit/policy/claim-authority.json";
export const claimTemplatePath = "docs/templates/claim-authority.md";

export async function createInitializedClaimRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  await copyCommittedDirectory(repo, "docs/evaluation");
  await writeLocalQwenProfile(repo);
  return repo;
}

export async function writeCompleteClaimAuthorityFixture(repo, options = {}) {
  const workItemId = options.workItemId ?? "BANDIT-970";
  await writeWorkBrief(repo, workItemId, "Claim Authority Fixture");
  await writeFileAt(
    repo,
    `docs/work/${workItemId}/red-evidence.md`,
    "# RED Evidence\n"
  );
  await writeCoordinationLog(repo, workItemId);

  if (options.omitTemplate) {
    await rm(path.join(repo, claimTemplatePath), { force: true });
  } else {
    await writeClaimAuthorityTemplate(repo);
  }

  const evidencePath = claimAuthorityEvidencePath(workItemId);
  const authority =
    options.authority ?? completeClaimAuthorityEvidence(workItemId);

  if (!options.omitEvidence) {
    await writeJson(repo, evidencePath, authority);
  }

  if (options.omitPolicy) {
    await rm(path.join(repo, claimPolicyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    claimPolicyPath,
    options.policy ?? completeClaimAuthorityPolicy(workItemId, evidencePath)
  );
}

export function claimAuthorityEvidencePath(workItemId) {
  return `docs/claim-authority/${workItemId}-claim-authority.json`;
}

export function completeClaimAuthorityPolicy(workItemId = "BANDIT-970", evidencePath = claimAuthorityEvidencePath(workItemId)) {
  return {
    contract_version: 1,
    policy_id: "cas-fenced-claim-authority",
    authority_backend: {
      authority: "git_refs",
      ref_namespace: "refs/bandit/*",
      transaction_primitive: "git update-ref --stdin",
      compare_and_swap: "required"
    },
    projection_surfaces: [
      ".bandit/claims/",
      "in_flight_registry",
      "cockpit_status",
      "state_index"
    ],
    required_claim_record_fields: [
      "claim_id",
      "work_item",
      "stage",
      "declared_work_surfaces",
      "owner",
      "status",
      "expected_state",
      "fencing_token",
      "idempotency_keys",
      "timestamps",
      "recovery_metadata",
      "projection_ref",
      "reconciliation_evidence"
    ],
    required_state_change_fields_after_token: [
      "expected_current_state",
      "fencing_token",
      "idempotency_key"
    ],
    release_authorized_decisions: [
      {
        work_item: workItemId,
        decision_kind: "claim_authority",
        evidence_path: evidencePath
      }
    ]
  };
}

export function completeClaimAuthorityEvidence(workItemId = "BANDIT-970") {
  return {
    contract_version: 1,
    work_item: workItemId,
    source_artifacts: [
      "docs/decisions/2026-05-27-git-refs-claim-authority-backend.md",
      "docs/prds/BANDIT-PRD-002-post-bootstrap-parallel-workstreams.md",
      `docs/work/${workItemId}/red-evidence.md`
    ],
    claim_authority_backend: {
      status: "active",
      authority: "git_refs",
      ref_namespace: "refs/bandit/*",
      transaction_primitive: "git update-ref --stdin",
      compare_and_swap: "required",
      plain_bandit_files_are_projection: true
    },
    claim_state_values: [
      "claimable",
      "active",
      "renewed",
      "blocked",
      "failed",
      "completed",
      "released",
      "recovery_required"
    ],
    claim_record_fields: [
      "claim_id",
      "work_item",
      "stage",
      "declared_work_surfaces",
      "owner",
      "status",
      "expected_state",
      "fencing_token",
      "idempotency_keys",
      "created_at",
      "renewed_at",
      "expires_at",
      "recovery_metadata",
      "projection_ref",
      "reconciliation_evidence"
    ],
    operations: [
      claimOperation("claim", {
        expected_current_state: "claimable",
        issues_fencing_token: true
      }),
      claimOperation("renew", { expected_current_state: "active" }),
      claimOperation("release", { expected_current_state: "active" }),
      claimOperation("fail", { expected_current_state: "active" }),
      claimOperation("block", { expected_current_state: "active" }),
      claimOperation("complete", { expected_current_state: "active" }),
      claimOperation("recover", { expected_current_state: "recovery_required" })
    ],
    projection_artifacts: [
      {
        path: ".bandit/claims/active.json",
        authority: "projection",
        rebuilt_from: ["refs/bandit/*", `docs/work/${workItemId}/coordination-log.jsonl`],
        manual_edits_may_grant_claims: false
      }
    ],
    reconciliation: {
      git_refs_state: "active",
      projection_state: "active",
      coordination_history_state: "active",
      disagreement_behavior: "fail_closed_recovery_or_pm_repair",
      operator_escalation: "only_operator_owned_gate"
    },
    fencing: {
      token_model: "monotonic",
      required_after_issuance: true,
      stale_token_behavior: "refuse_state_change"
    },
    idempotency: {
      required_after_token_issuance: true,
      same_key_same_input: "replay_prior_result",
      same_key_different_input: "refuse"
    },
    work_surface_wait_for_graph: completeWaitForGraph(),
    claim_safety_invariants: requiredClaimSafetyInvariants(),
    simulation_plan: completeSimulationPlan(workItemId),
    parallel_write_authorization: {
      status: "blocked_until_full_gate",
      missing_gates: [
        "BANDIT-GAP-GIT-MUTATION-SERIALIZER",
        "BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT"
      ]
    },
    evidence_paths: [
      claimPolicyPath,
      claimTemplatePath,
      claimAuthorityEvidencePath(workItemId),
      `docs/work/${workItemId}/red-evidence.md`,
      `docs/work/${workItemId}/coordination-log.jsonl`
    ]
  };
}

export function completeWaitForGraph() {
  return {
    strategy: "work_surface_wait_for_graph",
    active_claims: [
      {
        claim_id: "claim-alpha",
        work_item: "BANDIT-970",
        stage: "implementation",
        declared_work_surfaces: ["src/state/claim-authority.ts"]
      }
    ],
    candidate_claims: [
      {
        claim_id: "claim-beta",
        work_item: "BANDIT-971",
        stage: "implementation",
        declared_work_surfaces: ["test/claim-authority.test.mjs"]
      }
    ],
    wait_for_edges: [],
    cycle_paths: []
  };
}

export function completeSimulationPlan(workItemId = "BANDIT-970") {
  return {
    deterministic_seed: "BANDIT-045-red",
    scenarios: [
      {
        name: "concurrent duplicate claim",
        operations: [
          simulationOperation("agent-a", "claim", {
            claim_id: "claim-a",
            work_item: workItemId,
            stage: "implementation",
            declared_work_surfaces: ["src/state/claim-authority.ts"],
            expected_current_state: "claimable",
            idempotency_key: "claim-a-create"
          }),
          simulationOperation("agent-b", "claim", {
            claim_id: "claim-b",
            work_item: workItemId,
            stage: "implementation",
            declared_work_surfaces: ["src/state/claim-authority.ts"],
            expected_current_state: "claimable",
            idempotency_key: "claim-b-create"
          })
        ],
        expected_result: {
          accepted_claims: 1,
          refused_claims: 1,
          final_status: "active"
        }
      },
      {
        name: "stale fencing token after renewal",
        operations: [
          simulationOperation("agent-a", "claim", {
            claim_id: "claim-a",
            expected_current_state: "claimable",
            idempotency_key: "claim-a-create"
          }),
          simulationOperation("agent-a", "renew", {
            claim_id: "claim-a",
            expected_current_state: "active",
            fencing_token: 1,
            idempotency_key: "claim-a-renew"
          }),
          simulationOperation("agent-a", "complete", {
            claim_id: "claim-a",
            expected_current_state: "active",
            fencing_token: 1,
            idempotency_key: "claim-a-complete"
          })
        ],
        expected_result: {
          stale_token_refusals: 1,
          duplicate_side_effects: 0
        }
      }
    ]
  };
}

export function requiredClaimSafetyInvariants() {
  return [
    "duplicate_active_claim_refused",
    "cas_mismatch_refused",
    "release_requires_current_state",
    "reconcile_requires_authority_projection_history_agreement",
    "stale_expected_state_refused",
    "stale_fencing_token_refused",
    "idempotency_same_key_same_input_replayed",
    "idempotency_same_key_different_input_refused",
    "projection_history_disagreement_refused",
    "work_surface_wait_for_cycle_refused",
    "failed_serializer_cleanup_preserves_recovery_state",
    "failed_worktree_lock_cleanup_preserves_recovery_state",
    "recovery_required_claim_not_auto_deleted"
  ];
}

function claimOperation(name, overrides = {}) {
  return {
    name,
    authority: "git_update_ref_cas",
    requires_expected_current_state: true,
    requires_current_fencing_token_after_issuance: true,
    requires_idempotency_key_after_issuance: true,
    duplicate_side_effect_prevention: "idempotency_key",
    ...overrides
  };
}

function simulationOperation(actor, operation, overrides = {}) {
  return {
    actor,
    operation,
    claim_id: "claim-a",
    work_item: "BANDIT-970",
    stage: "implementation",
    declared_work_surfaces: ["src/state/claim-authority.ts"],
    ...overrides
  };
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeClaimAuthorityTemplate(repo) {
  await writeFileAt(
    repo,
    claimTemplatePath,
    `# Claim Authority Template

work_item:
source_artifacts:
claim_authority_backend:
claim_state_values:
claim_record_fields:
operations:
projection_artifacts:
reconciliation:
fencing:
idempotency:
work_surface_wait_for_graph:
claim_safety_invariants:
simulation_plan:
parallel_write_authorization:
evidence_paths:
`
  );
}

async function writeCoordinationLog(repo, workItemId) {
  await writeJsonLines(repo, `docs/work/${workItemId}/coordination-log.jsonl`, [
    {
      version: 1,
      event_type: "step_transition",
      work_item: workItemId,
      sequence: 1,
      timestamp: "2026-05-28T00:00:00.000Z",
      actor: "codex_pm",
      source: "test fixture",
      evidence: [`docs/work/${workItemId}/brief.md`],
      state: "brief_created",
      next_action: "Write RED evidence",
      accountable_actor: "Test Writer",
      safe_triggers: []
    },
    {
      version: 1,
      event_type: "step_transition",
      work_item: workItemId,
      sequence: 2,
      timestamp: "2026-05-28T00:00:00.000Z",
      actor: "codex_pm",
      source: "test fixture",
      evidence: [`docs/work/${workItemId}/red-evidence.md`],
      state: "red_recorded",
      next_action: "Implement claim authority contract",
      accountable_actor: "Writer",
      safe_triggers: ["implementation_allowed"]
    }
  ]);
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeJsonLines(repo, relativePath, values) {
  await writeFileAt(
    repo,
    relativePath,
    values.map((value) => JSON.stringify(value)).join("\n") + "\n"
  );
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
