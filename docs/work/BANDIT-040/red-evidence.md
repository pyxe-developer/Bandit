# BANDIT-040 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the Input Quarantine Gate before production implementation. They fail because Bandit does not yet require input-quarantine policy or templates during validation, and the input-quarantine validation command does not exist.

## Test Command

```sh
node --test test/input-quarantine-gate.test.mjs
```

## Observed Output

```text
tests 10
pass 0
fail 10
validate fails closed when the input quarantine policy is missing failed: expected exit code 1, received 0
validate fails closed when the input quarantine template is missing failed: expected exit code 1, received 0
input quarantine validation rejects release paths without source classification failed: Unknown command: input-quarantine
input quarantine validation rejects external input without data-only handling failed: Unknown command: input-quarantine
input quarantine validation rejects paths without quarantine boundary evidence failed: Unknown command: input-quarantine
input quarantine validation rejects instruction-bearing use without a trusted-source gate failed: Unknown command: input-quarantine
input quarantine validation rejects malformed trusted-source gate metadata failed: Unknown command: input-quarantine
input quarantine validation rejects Trusted Local Repo Mode overreach failed: Unknown command: input-quarantine
input quarantine validation rejects unknown source classes failed: Unknown command: input-quarantine
input quarantine validation accepts a complete bounded contract failed: Unknown command: input-quarantine
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| An Input Quarantine Gate template or policy artifact names required fields for source identity, source class, data-only handling, quarantine boundary evidence, admitted fields, stripped or ignored fields, allowed extraction uses, forbidden instruction-bearing uses, owning stage, trusted-source gate references, freshness or expiry, owner, and revocation path. | The new tests expect docs/templates/input-quarantine-gate.md, docs/templates/trusted-source-gate.md, .bandit/policy/input-quarantine.json, and named quarantine/trusted-source evidence artifacts to become required repo-native surfaces. |
| Validation fails closed when a release-authorized agent path processes external contributor text, issue or PR metadata, review comments, dependency documentation, fetched third-party content, generated instructions, or fetched prompts without source classification. | The source-classification rejection test deletes source_class from the Stage 4 review-comment ingest path and expects input-quarantine validation to fail before trusted status. |
| Validation fails closed when external or third-party content is not explicitly handled as data-only before it enters release-authorized agent context. | The data-only rejection test changes review-comment handling to instruction_bearing and expects validation to reject the path before release-authorized context. |
| Validation fails closed when untrusted content can affect agent instructions, tool permissions, routing decisions, landing authority, auto-landing eligibility, policy authority, or gate satisfaction without a bounded Trusted Source Gate. | The instruction-bearing-use rejection test marks untrusted review-comment input as instruction bearing with no trusted-source gate and expects fail-closed validation. |
| Validation fails closed when a Trusted Source Gate omits source identity, scope, allowed uses, owner, freshness or expiry rule, revocation path, trust rationale, or evidence artifact. | The malformed trusted-source gate test removes owner metadata and expects validation to reject the gate before it can upgrade any source. |
| Validation fails closed for blanket trust, permanent trust upgrades, source-reputation-only trust, trusted-by-default PR or issue text, raw context dumps, hidden instruction-bearing fields, and unknown source classes without explicit refusal. | The Trusted Local Repo Mode overreach and unknown-source-class tests reject external contributor trust in local-repo mode and refuse an unsupported chat_transcript source class. |
| Trusted Local Repo Mode is represented as a scoped local-repo posture that ends at the boundary where external contributor input, fetched third-party content, generated instructions, or fetched prompts enter a release-authorized path. | The complete policy fixture scopes Trusted Local Repo Mode to trusted_local_repo only and records terminators for external contributor, PR metadata, review comment, dependency documentation, fetched third-party, generated instruction, and fetched prompt sources. |
| Focused tests prove invalid quarantine contracts are rejected before writes or trusted status, and prove a complete bounded input quarantine contract is accepted. | The focused test file covers missing policy, missing template, missing source classification, missing data-only handling, missing quarantine boundary evidence, missing trusted-source gate, malformed gate metadata, local-repo overreach, unknown source class refusal, and complete bounded acceptance output. |
| The implementation does not implement the later Layered Risk Classification Gate, Supply-Chain Gate, coordination authority, operator fail-closed boundary, claim authority, Git mutation serializer, worktree bootstrap contract, scheduler, observability traces, Stage Capability Scope, Token-Cost Failsafe, Evidence Freshness SLOs, or cockpit UI gaps. | This RED step adds only focused tests, the Stage 2 evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation, live routing, paid reviewer route, dependency, lockfile, scheduler, claim, worktree, supply-chain, risk-classification, or cockpit UI surface. |

## Next Action

Implement the narrow Input Quarantine Gate repair: add repo-native input quarantine and trusted-source gate templates, .bandit/policy/input-quarantine.json, quarantine/trusted-source validation, input-quarantine validate --json command wiring, validate/init integration, source-classification checks, data-only handling checks, quarantine boundary evidence checks, bounded Trusted Source Gate checks, Trusted Local Repo Mode limit checks, and focused acceptance output needed to make the RED tests pass without broadening into layered risk classification, supply-chain policy, scheduler, claim/worktree authority, live routing, paid reviewer routing, dependency or lockfile changes, external service integration, or cockpit UI scope.
