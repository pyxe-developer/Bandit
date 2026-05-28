import assert from "node:assert/strict";
import test from "node:test";
import {
  claimAuthorityEvidencePath,
  completeClaimAuthorityEvidence,
  requiredClaimSafetyInvariants,
  createInitializedClaimRepo,
  writeCompleteClaimAuthorityFixture
} from "./helpers/claim-authority-fixture.mjs";
import { runBandit } from "./helpers/bandit-cli.mjs";

test("claim safety simulation proves concurrent duplicate claims cannot both succeed", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo);

  const result = await runBandit(repo, [
    "claim",
    "simulate",
    claimAuthorityEvidencePath("BANDIT-970"),
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "pass");
  assert.deepEqual(report.scenarios["concurrent duplicate claim"], {
    accepted_claims: 1,
    refused_claims: 1,
    invariant: "duplicate_active_claim_refused"
  });
});

test("claim safety simulation rejects stale fencing tokens after renewal", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo);

  const result = await runBandit(repo, [
    "claim",
    "simulate",
    claimAuthorityEvidencePath("BANDIT-970"),
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.scenarios["stale fencing token after renewal"], {
    stale_token_refusals: 1,
    duplicate_side_effects: 0,
    invariant: "stale_fencing_token_refused"
  });
});

test("claim safety simulation proves idempotent replay and conflicting-key refusal", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.simulation_plan.scenarios.push({
    name: "idempotency replay and conflict",
    operations: [
      {
        actor: "agent-a",
        operation: "complete",
        claim_id: "claim-a",
        expected_current_state: "active",
        fencing_token: 2,
        idempotency_key: "complete-1",
        side_effect_payload: "write-review-evidence"
      },
      {
        actor: "agent-a",
        operation: "complete",
        claim_id: "claim-a",
        expected_current_state: "active",
        fencing_token: 2,
        idempotency_key: "complete-1",
        side_effect_payload: "write-review-evidence"
      },
      {
        actor: "agent-a",
        operation: "complete",
        claim_id: "claim-a",
        expected_current_state: "active",
        fencing_token: 2,
        idempotency_key: "complete-1",
        side_effect_payload: "write-different-evidence"
      }
    ],
    expected_result: {
      same_key_same_input_replays: 1,
      same_key_different_input_refusals: 1,
      duplicate_side_effects: 0
    }
  });
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, [
    "claim",
    "simulate",
    claimAuthorityEvidencePath("BANDIT-970"),
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.scenarios["idempotency replay and conflict"], {
    same_key_same_input_replays: 1,
    same_key_different_input_refusals: 1,
    duplicate_side_effects: 0,
    invariant: "idempotency_same_key_different_input_refused"
  });
});

test("claim safety simulation treats failed worktree lock cleanup as recovery-required", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.simulation_plan.scenarios.push({
    name: "worktree lock failure cleanup",
    operations: [
      {
        actor: "repo-pm-coordinator",
        operation: "claim",
        claim_id: "claim-a",
        expected_current_state: "claimable",
        idempotency_key: "claim-a-create"
      },
      {
        actor: "repo-pm-coordinator",
        operation: "worktree_lock_failed",
        claim_id: "claim-a",
        expected_current_state: "active",
        fencing_token: 1,
        idempotency_key: "claim-a-worktree-lock"
      }
    ],
    expected_result: {
      final_status: "recovery_required",
      false_active_claim: false
    }
  });
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, [
    "claim",
    "simulate",
    claimAuthorityEvidencePath("BANDIT-970"),
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.scenarios["worktree lock failure cleanup"], {
    final_status: "recovery_required",
    false_active_claim: false,
    invariant: "failed_worktree_lock_cleanup_preserves_recovery_state"
  });
});

test("claim safety simulation refuses incomplete invariant coverage", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.claim_safety_invariants = authority.claim_safety_invariants.filter(
    (invariant) => invariant !== "work_surface_wait_for_cycle_refused"
  );
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, [
    "claim",
    "simulate",
    claimAuthorityEvidencePath("BANDIT-970"),
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /claim safety invariants must include work_surface_wait_for_cycle_refused/
  );
});

test("claim safety simulation reports required invariant coverage", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo);

  const result = await runBandit(repo, [
    "claim",
    "simulate",
    claimAuthorityEvidencePath("BANDIT-970"),
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.invariants, requiredClaimSafetyInvariants());
});
