import assert from "node:assert/strict";
import test from "node:test";
import {
  completeClaimAuthorityEvidence,
  createInitializedClaimRepo,
  writeCompleteClaimAuthorityFixture
} from "./helpers/claim-authority-fixture.mjs";
import { runBandit } from "./helpers/bandit-cli.mjs";

test("work-surface validation rejects pairwise-only overlap without a wait-for graph", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.work_surface_wait_for_graph.strategy = "pairwise_overlap_only";
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /claimability must build a Work-Surface Wait-For Graph; pairwise-only overlap checks are insufficient/
  );
});

test("work-surface validation rejects missing wait-for edge for overlapping declared surfaces", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.work_surface_wait_for_graph.active_claims[0].declared_work_surfaces = [
    "src/state/claim-authority.ts"
  ];
  authority.work_surface_wait_for_graph.candidate_claims[0].declared_work_surfaces = [
    "src/state/claim-authority.ts"
  ];
  authority.work_surface_wait_for_graph.wait_for_edges = [];
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /declared work surface conflict src\/state\/claim-authority\.ts is missing a wait-for edge/
  );
});

test("work-surface validation rejects wait-for graph cycles with cycle diagnostics", async () => {
  const repo = await createInitializedClaimRepo();
  const authority = completeClaimAuthorityEvidence();
  authority.work_surface_wait_for_graph.wait_for_edges = [
    {
      from_claim: "claim-alpha",
      to_claim: "claim-beta",
      surfaces: ["src/state/claim-authority.ts"]
    },
    {
      from_claim: "claim-beta",
      to_claim: "claim-alpha",
      surfaces: ["test/claim-authority.test.mjs"]
    }
  ];
  authority.work_surface_wait_for_graph.cycle_paths = [
    ["claim-alpha", "claim-beta", "claim-alpha"]
  ];
  await writeCompleteClaimAuthorityFixture(repo, { authority });

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Work-Surface Wait-For Graph cycle: claim-alpha -> claim-beta -> claim-alpha/
  );
});

test("work-surface validation accepts acyclic non-overlapping claims", async () => {
  const repo = await createInitializedClaimRepo();
  await writeCompleteClaimAuthorityFixture(repo);

  const result = await runBandit(repo, ["claim", "validate", "--json"]);

  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.work_surface_wait_for_graph, {
    active_claims: 1,
    candidate_claims: 1,
    wait_for_edges: 0,
    cycle_paths: []
  });
});
