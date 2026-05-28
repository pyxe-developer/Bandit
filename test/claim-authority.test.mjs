import assert from "node:assert/strict";
import test from "node:test";
import {
  claimAuthorityEvidencePath,
  claimPolicyPath,
  claimTemplatePath,
  completeClaimAuthorityEvidence,
  createInitializedClaimRepo,
  writeCompleteClaimAuthorityFixture
} from "./helpers/claim-authority-fixture.mjs";
import { runBandit } from "./helpers/bandit-cli.mjs";

test("validate fails closed when the claim authority policy is missing", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/claim-authority\.json/
  );
});

test("validate fails closed when the claim authority template is missing", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/claim-authority\.md/
  );
});

test("claim authority validation rejects registered decisions without evidence", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo, { omitEvidence: true });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required claim authority evidence: docs\/claim-authority\/BANDIT-970-claim-authority\.json/
  );
});

test("claim authority validation rejects non-Git-ref writable authority", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.claim_authority_backend.authority = ".bandit_file";
  authority.claim_authority_backend.ref_namespace = ".bandit/claims";
  authority.claim_authority_backend.transaction_primitive = "check-then-write-json";
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /active writable claim authority must use refs\/bandit\/\* with git update-ref --stdin CAS transactions/
  );
});

test("claim authority validation rejects state changes without expected state, fencing token, and idempotency key", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.operations[2] = {
    name: "release",
    authority: "git_update_ref_cas",
    requires_expected_current_state: false,
    requires_current_fencing_token_after_issuance: false,
    requires_idempotency_key_after_issuance: false
  };
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /release requires expected current state, current fencing token after issuance, and idempotency key after issuance/
  );
});

test("claim authority validation rejects projection edits that grant claims", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.projection_artifacts[0].manual_edits_may_grant_claims = true;
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /\.bandit claim projections cannot grant, renew, release, complete, block, fail, or recover writable claims/
  );
});

test("claim authority validation rejects claim authority projection history disagreement", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.reconciliation.projection_state = "released";
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /claim authority, projection, and coordination history disagree for BANDIT-970/
  );
});

test("claim authority validation accepts a complete Git refs CAS claim authority record", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo);

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: claimPolicyPath,
    template: claimTemplatePath,
    decisions: ["BANDIT-970"],
    evidence: [claimAuthorityEvidencePath("BANDIT-970")],
    backends: ["BANDIT-970:refs/bandit/*:git update-ref --stdin"],
    projections: ["BANDIT-970:.bandit/claims/active.json:projection"],
    fencing: ["BANDIT-970:monotonic"],
    idempotency: ["BANDIT-970:required_after_token_issuance"],
    parallel_write_authorization: ["BANDIT-970:blocked_until_full_gate"]
  });
});
