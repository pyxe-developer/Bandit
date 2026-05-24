# Fresh Harness Repo Decision

**Date:** 2026-05-24
**Status:** Accepted
**Participants:** Matt Flebbe, Codex

## Decision

Build the next coding harness in a fresh repository. Use sourmash as the source-of-truth spec, glossary, evidence archive, and contract library.

## Rationale

The harness evaluation spike deprecated sourmash's subprocess-first architecture while preserving the trust-layer principles: role separation, mechanical permission contracts, durable evidence, lifecycle gates, external review, and continuous improvement.

Continuing inside the existing sourmash runtime risks carrying forward Claude-era subprocess assumptions, heavy slice ceremony, and vendor-specific routing. A fresh repository creates a clean implementation boundary while allowing selected sourmash assets to be ported deliberately.

## Consequences

- Sourmash remains useful as research, terminology, prior evidence, and source material.
- The next harness starts with a narrow trusted coding workflow instead of a generic agent platform.
- Existing sourmash code is not assumed to be portable unless it earns its way through a new PRD and engineering review.
- The first implementation should prove local provider support, mechanical denials, durable evidence, cross-check review, CodeRabbit integration, and UAT handoff before expanding scope.

## Not Decided

- Fresh repository name.
- Runtime language and storage stack.
- Whether the UI lives in the same repo as the CLI or as a separate app.
- Exact definition of cross-modal degraded mode when only local Qwen-family models are available.
