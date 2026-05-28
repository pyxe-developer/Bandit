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

export const gitMutationPolicyPath = ".bandit/policy/git-mutations.json";
export const gitMutationTemplatePath = "docs/templates/git-mutation-serializer.md";

export async function createInitializedGitMutationRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  await copyCommittedDirectory(repo, "docs/evaluation");
  await writeLocalQwenProfile(repo);
  return repo;
}

export async function writeCompleteGitMutationFixture(repo, options = {}) {
  const workItemId = options.workItemId ?? "BANDIT-980";
  await writeWorkBrief(repo, workItemId, "Git Mutation Serializer Fixture");
  await writeFileAt(
    repo,
    `docs/work/${workItemId}/red-evidence.md`,
    "# RED Evidence\n"
  );

  if (options.omitTemplate) {
    await rm(path.join(repo, gitMutationTemplatePath), { force: true });
  } else {
    await writeGitMutationTemplate(repo);
  }

  const evidencePath = gitMutationEvidencePath(workItemId);
  const evidence = options.evidence ?? completeGitMutationEvidence(workItemId);

  if (!options.omitEvidence) {
    await writeJson(repo, evidencePath, evidence);
  }

  if (options.omitPolicy) {
    await rm(path.join(repo, gitMutationPolicyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    gitMutationPolicyPath,
    options.policy ?? completeGitMutationPolicy(workItemId, evidencePath)
  );
}

export function gitMutationEvidencePath(workItemId) {
  return `docs/git-mutations/${workItemId}-git-mutation-serializer.json`;
}

export function completeGitMutationPolicy(
  workItemId = "BANDIT-980",
  evidencePath = gitMutationEvidencePath(workItemId)
) {
  return {
    contract_version: 1,
    policy_id: "git-mutation-serializer",
    serializer_boundary: {
      authority: "cli_single_writer_guard",
      lock_scope: "shared_git_plumbing",
      claim_authority: "separate_refs_bandit_cas"
    },
    shared_git_mutation_allow_list: requiredSharedGitMutationAllowList(),
    required_evidence_fields: requiredSerializerEvidenceFields(),
    release_authorized_decisions: [
      {
        work_item: workItemId,
        decision_kind: "git_mutation_serializer",
        evidence_path: evidencePath
      }
    ]
  };
}

export function completeGitMutationEvidence(workItemId = "BANDIT-980") {
  return {
    contract_version: 1,
    work_item: workItemId,
    source_artifacts: [
      "docs/decisions/2026-05-27-git-mutation-serializer.md",
      "docs/prds/BANDIT-PRD-002-post-bootstrap-parallel-workstreams.md",
      `docs/work/${workItemId}/brief.md`,
      `docs/work/${workItemId}/red-evidence.md`
    ],
    serializer_boundary: {
      authority: "cli_single_writer_guard",
      canonical_workflow_authority: false,
      claim_authority_backend: "refs/bandit/*",
      claim_authority_primitive: "git update-ref --stdin",
      serializer_can_grant_claims: false,
      serializer_can_renew_claims: false,
      serializer_can_release_claims: false,
      serializer_can_complete_claims: false,
      serializer_can_block_claims: false,
      serializer_can_fail_claims: false,
      serializer_can_recover_claims: false,
      serializer_can_transfer_claims: false
    },
    shared_git_mutation_allow_list: requiredSharedGitMutationAllowList(),
    single_writer_guard: {
      strategy: "exclusive_repo_lock",
      lock_path: ".git/bandit-git-mutation.lock",
      required_for_release_authorized_paths: true,
      max_concurrent_holders: 1,
      contention_behavior: "wait_then_timeout",
      timeout_behavior: "fail_closed",
      stale_lock_behavior: "recover_only_with_evidence"
    },
    contention_scenarios: [
      {
        name: "two worktree adds contend",
        operations: [
          {
            operation_id: "op-a",
            operation: "worktree_add",
            writer_owner: "repo-pm-coordinator",
            starts_at_ms: 0,
            completes_at_ms: 100,
            acquired_guard: true
          },
          {
            operation_id: "op-b",
            operation: "worktree_add",
            writer_owner: "repo-pm-coordinator",
            starts_at_ms: 10,
            waits_for_operation_id: "op-a",
            acquired_guard_after_operation_id: "op-a"
          }
        ],
        expected_result: {
          max_concurrent_holders: 1,
          contention_waits: 1,
          concurrent_holder_refusals: 1
        }
      }
    ],
    release_authorized_path_checks: [
      {
        path: "src/commands/worktree-lifecycle.ts",
        operation: "worktree_add",
        release_authorized: true,
        uses_serializer: true
      },
      {
        path: "src/commands/git-maintenance.ts",
        operation: "packed_refs_maintenance",
        release_authorized: true,
        uses_serializer: true
      }
    ],
    claim_owned_worktree_locks: {
      lock_immediately_after_create: true,
      required_reason_fields: ["claim_id", "work_item", "stage"],
      forbidden_reason_fields: ["fencing_token"],
      unlock_authority: "repo_pm_coordinator_only",
      worker_owned_unlock: "refused",
      requires_handoff_verification_or_cleanup_evidence: true
    },
    failure_cleanup: {
      worktree_lock_failure_behavior:
        "record_failure_and_route_claim_cleanup",
      allowed_claim_cleanup_routes: [
        "release",
        "fail",
        "block",
        "recovery_required"
      ],
      false_active_claim_allowed: false,
      cleanup_evidence_fields: [
        "operation",
        "work_item",
        "claim_id",
        "stage",
        "failure",
        "cleanup_route",
        "source_artifacts"
      ]
    },
    timeout_and_stale_lock: {
      timeout_behavior: "fail_closed",
      stale_lock_recovery_requires: [
        "stale_lock_evidence",
        "owner_liveness_check",
        "pm_repair_or_recovery_event"
      ],
      ambiguous_stale_lock_behavior: "fail_closed"
    },
    trace_fields: requiredSerializerEvidenceFields(),
    parallel_write_authorization: {
      status: "blocked_until_full_gate",
      missing_gates: ["BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT"]
    },
    evidence_paths: [
      gitMutationPolicyPath,
      gitMutationTemplatePath,
      gitMutationEvidencePath(workItemId),
      `docs/work/${workItemId}/red-evidence.md`
    ]
  };
}

function requiredSharedGitMutationAllowList() {
  return [
    "worktree_add",
    "worktree_remove",
    "worktree_prune",
    "worktree_lock",
    "worktree_unlock",
    "branch_ref_maintenance_outside_claim_cas",
    "packed_refs_maintenance"
  ];
}

function requiredSerializerEvidenceFields() {
  return [
    "operation_id",
    "operation",
    "work_item",
    "stage",
    "claim_id",
    "writer_owner",
    "started_at",
    "completed_at",
    "result",
    "contention_status",
    "stale_lock_status",
    "diagnostics",
    "source_artifacts"
  ];
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeGitMutationTemplate(repo) {
  await writeFileAt(
    repo,
    gitMutationTemplatePath,
    `# Git Mutation Serializer Template

work_item:
source_artifacts:
serializer_boundary:
shared_git_mutation_allow_list:
single_writer_guard:
contention_scenarios:
release_authorized_path_checks:
claim_owned_worktree_locks:
failure_cleanup:
timeout_and_stale_lock:
trace_fields:
parallel_write_authorization:
evidence_paths:
`
  );
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
