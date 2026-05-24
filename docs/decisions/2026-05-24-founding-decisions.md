# Founding Decisions

## Date

2026-05-24

## Decisions

1. Create a fresh repository named Bandit.
2. Use sourmash as source material, not as architecture authority.
3. Build a CLI-authoritative workflow system with a lean web cockpit.
4. Keep workflow state repo-native; SQLite is only a rebuildable index.
5. Split Feature PRDs into slices and chores.
6. Allow chores and feature slices to use different workflows.
7. Support a Heartbeat Chore Agent for approved low-risk maintenance and due improvement evaluations.
8. Add a Landing Agent that owns code-safety verdicts so the operator does not judge warnings manually.
9. Auto-land chores and feature slices, but feature slices require Approved UAT.
10. Record Approved UAT as a CLI-owned repo-native artifact.
11. Treat any post-UAT branch code change as Stale UAT for v0.
12. Require CodeRabbit and adversarial review before landing.
13. Use local Qwen as the baseline adversarial reviewer on every PR.
14. Make adversarial reviewer profiles configurable and swappable.
15. Escalate to stronger or second reviewers based on policy smells.
16. Codex PM owns routine technical routing decisions.
17. Prefer specialized agents and skills over broad generalists.
18. Track cross-model tension as a durable artifact.
19. Treat the Workflow Improvement Engine as the product differentiator.
20. Convert retrospective lessons and cross-model tension into tagged improvement chores or explicit no-action decisions.
21. Evaluate improvement chores with metrics, baselines, windows, and outcomes.
22. Treat `CLEAN_CODE.md` as mandatory reading before every slice and a mandatory pre-landing compliance rubric.
23. Use spec-driven development, test-driven development, and rubric-driven verification together.

## Operator Input Boundaries

Ask the operator for:

- Product direction.
- UAT.
- Business tradeoffs.
- Policy changes.
- Explicit cost or risk overrides.
- Ambiguous scope.

Do not ask the operator for routine technical routing, reviewer selection, code-safety warning interpretation, or merge judgment when policy and evidence are sufficient.

## Open Implementation Details

- Exact command names.
- Exact artifact schemas.
- Exact Qwen model/runtime.
- Exact CodeRabbit CLI integration.
- Exact cockpit stack.
- Exact v0 metric catalog.
