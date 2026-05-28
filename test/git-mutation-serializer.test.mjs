import assert from "node:assert/strict";
import test from "node:test";
import {
  completeGitMutationEvidence,
  createInitializedGitMutationRepo,
  gitMutationEvidencePath,
  gitMutationPolicyPath,
  gitMutationTemplatePath,
  writeCompleteGitMutationFixture
} from "./helpers/git-mutation-fixture.mjs";
import { runBandit } from "./helpers/bandit-cli.mjs";

test("validate fails closed when the git mutation policy is missing", async () => {
  const repo = await createInitializedGitMutationRepo();
  await writeCompleteGitMutationFixture(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/git-mutations\.json/
  );
});

test("validate fails closed when the git mutation template is missing", async () => {
  const repo = await createInitializedGitMutationRepo();
  await writeCompleteGitMutationFixture(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/git-mutation-serializer\.md/
  );
});

test("git mutation validation rejects registered decisions without evidence", async () => {
  const repo = await createInitializedGitMutationRepo();
  await writeCompleteGitMutationFixture(repo, { omitEvidence: true });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required git mutation serializer evidence: docs\/git-mutations\/BANDIT-980-git-mutation-serializer\.json/
  );
});

test("git mutation validation rejects incomplete shared git mutation allow-list", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.shared_git_mutation_allow_list =
    evidence.shared_git_mutation_allow_list.filter(
      (operation) => operation !== "worktree_lock"
    );
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /shared \.git mutation allow-list must include worktree_lock/
  );
});

test("git mutation validation rejects release-authorized bypass paths", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.release_authorized_path_checks[0].uses_serializer = false;
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /release-authorized shared git mutation worktree_add must use Git Mutation Serializer/
  );
});

test("git mutation validation rejects non-exclusive writer guard semantics", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.single_writer_guard.max_concurrent_holders = 2;
  evidence.contention_scenarios[0].expected_result.max_concurrent_holders = 2;
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /single-writer guard must allow at most one concurrent shared \.git mutation holder/
  );
});

test("git mutation validation rejects serializer claim authority", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.serializer_boundary.serializer_can_grant_claims = true;
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Git Mutation Serializer cannot grant, renew, release, complete, block, fail, recover, or transfer claims/
  );
});

test("git mutation validation rejects fencing tokens in worktree lock reasons", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.claim_owned_worktree_locks.required_reason_fields.push("fencing_token");
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /claim-owned worktree lock reason must not include fencing_token/
  );
});

test("git mutation validation rejects lock failure cleanup that leaves false active claims", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.failure_cleanup.false_active_claim_allowed = true;
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /worktree lock failure cleanup must not leave a false active claim/
  );
});

test("git mutation validation rejects worker-owned unlock", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.claim_owned_worktree_locks.worker_owned_unlock = "allowed";
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /worker-owned unlock of claim-owned worktree must be refused/
  );
});

test("git mutation validation rejects non-fail-closed timeout behavior", async () => {
  const repo = await createInitializedGitMutationRepo();
  const evidence = completeGitMutationEvidence();
  evidence.timeout_and_stale_lock.timeout_behavior = "continue_without_serializer";
  await writeCompleteGitMutationFixture(repo, { evidence });

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /serializer timeout behavior must fail closed/);
});

test("git mutation validation accepts a complete serializer contract", async () => {
  const repo = await createInitializedGitMutationRepo();
  await writeCompleteGitMutationFixture(repo);

  const result = await runBandit(repo, [
    "git-mutation",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: gitMutationPolicyPath,
    template: gitMutationTemplatePath,
    decisions: ["BANDIT-980"],
    evidence: [gitMutationEvidencePath("BANDIT-980")],
    allow_list: [
      "worktree_add",
      "worktree_remove",
      "worktree_prune",
      "worktree_lock",
      "worktree_unlock",
      "branch_ref_maintenance_outside_claim_cas",
      "packed_refs_maintenance"
    ],
    guard: {
      strategy: "exclusive_repo_lock",
      max_concurrent_holders: 1,
      timeout_behavior: "fail_closed",
      stale_lock_behavior: "recover_only_with_evidence"
    },
    claim_authority: "refs/bandit/*:git update-ref --stdin",
    worktree_locks: {
      immediate_after_create: true,
      unlock_authority: "repo_pm_coordinator_only"
    },
    parallel_write_authorization: "blocked_until_full_gate"
  });
});
