# BANDIT-024 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Repository evidence proves the cockpit boundary contract is missing before implementation. The expected durable artifact docs/design/workflow-cockpit-boundary.md does not exist, while cockpit authority, repo-native state, index, UAT, coordination, and improvement-health expectations are currently scattered across roadmap, architecture, PRD, and decision prose.

## Test Command

```sh
test -f docs/design/workflow-cockpit-boundary.md
```

## Observed Output

```text
exit status 1
docs/design/workflow-cockpit-boundary.md exists: 1
find docs/design -maxdepth 1 -type f -print returned no files.
rg found cockpit and authority requirements in README.md, docs/architecture/founding-architecture.md, docs/plans/V0_PLAN.md, docs/roadmap/CURRENT_CONTEXT.md, docs/roadmap/ROADMAP.md, docs/prds/BANDIT-PRD-001-founding-product.md, and docs/decisions/*.md instead of one cockpit boundary artifact.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| The chore brief exists at docs/work/BANDIT-024/brief.md and links to BANDIT-GAP-WORKFLOW-COCKPIT. | docs/work/BANDIT-024/brief.md exists and .bandit/bootstrap-gaps.json links BANDIT-GAP-WORKFLOW-COCKPIT to active chore BANDIT-024. |
| A cockpit boundary artifact defines CLI Authority, repo-native source of truth, rebuildable index limits, and the rule that cockpit storage is never canonical. | RED probe shows docs/design/workflow-cockpit-boundary.md is absent; README.md, docs/architecture/founding-architecture.md, docs/decisions/2026-05-24-cli-authority-workflow-cockpit.md, and docs/decisions/2026-05-24-repo-native-state-index.md contain scattered source material but no durable boundary artifact. |
| The boundary artifact maps each planned cockpit view to repo-native source artifacts or records a defer/no-action decision when the source does not exist yet. | Roadmap and PRD mention status, next actions, gates, UAT, coordination state, improvement health, and safe trigger points, but no artifact maps those views to current sources or later Phase 6 and Phase 7 dependencies. |
| The boundary artifact maps each allowed cockpit action to an approved CLI command family or records it as out of scope until a later policy artifact exists. | Architecture and decision docs say the cockpit may trigger approved CLI commands, but no single artifact lists allowed actions or blocks product UAT inference, merge, push, deploy, gate bypass, and operator-owned policy decisions. |
| The scope distinguishes boundary scoping from Phase 8 web implementation and blocks any UI implementation until the boundary artifact is reviewed through Bandit gates. | CURRENT_CONTEXT.md and ROADMAP.md already block Phase 8 implementation during BANDIT-024; the missing boundary artifact is the RED condition that implementation must resolve before UI work. |
| RED evidence demonstrates the current repository lacks a durable cockpit boundary contract and would otherwise force future agents to infer UI authority from scattered roadmap prose. | Missing-file probe plus rg evidence show there is no docs/design/workflow-cockpit-boundary.md and future agents would need to reconstruct authority from scattered PRD, roadmap, architecture, and decision references. |
| No product UAT approval, automatic merge/push/deploy behavior, cross-repo coordination, full coordination primitive, improvement evaluation engine, or web cockpit implementation is introduced by this chore. | This RED artifact records only the absent contract and source-material mapping gap; it creates no UI, command behavior, UAT approval, merge, push, deploy, coordination primitive, or improvement engine implementation. |

## Next Action

Implement the narrow cockpit boundary artifact at docs/design/workflow-cockpit-boundary.md from existing repo sources. Keep the implementation to artifact contract and any minimal validation/reporting support needed by the brief; do not broaden into Phase 8 web UI, Phase 6 coordination primitive, Phase 7 improvement engine, product UAT approval, automatic merge, push, or deploy behavior.
