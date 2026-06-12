# CodeRabbit Formation Review - BANDIT-098

contract_version: 1
work_item: BANDIT-098
stage: Stage 1 formation
reviewer: coderabbit
review_type: uncommitted
timestamp: 2026-06-11T23:55:31Z
verdict: bootstrap_gap
findings_status: resolved
findings_disposition: provider_timeout_with_emitted_findings_dispositioned

## Scope

CodeRabbit formation review was requested for the uncommitted Stage 1 package
and the existing public-distribution working-tree changes related to
`BANDIT-098`.

## Command Evidence

```sh
timeout 600 coderabbit review --agent --type uncommitted
```

Provider output before timeout:

```json
{"type":"review_context","reviewType":"uncommitted","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
{"type":"status","phase":"connecting","status":"connecting_to_review_service"}
{"type":"status","phase":"setup","status":"setting_up"}
{"type":"status","phase":"setup","status":"preparing_sandbox"}
{"type":"status","phase":"analyzing","status":"summarizing"}
{"type":"status","phase":"analyzing","status":"reviewing"}
{"type":"heartbeat","status":"reviewing"}
{"type":"heartbeat","status":"reviewing"}
{"type":"finding","severity":"trivial","fileName":"docs/decisions/2026-06-11-open-source-public-distribution.md","codegenInstructions":"The decision document lacks an explicit decision-maker and approval record; add an Approved By section."}
{"type":"finding","severity":"major","fileName":"package.json","codegenInstructions":"The package metadata contains invalid/inaccessible links; update repository.url, bugs.url, and homepage or adjust public publish posture."}
{"type":"finding","severity":"critical","fileName":"README.md","codegenInstructions":"The README references a non-existent GitHub dependency github:pyxe-developer/Bandit#main; update the install line or document private access."}
```

The command exited with status `124` after the required 600-second timeout. No
terminal CodeRabbit `review_completed` payload or clean pass verdict was
returned.

## Verdict

`bootstrap_gap`

No CodeRabbit pass is claimed.

## Findings And PM Disposition

| Severity | Finding | Disposition |
| --- | --- | --- |
| trivial | `docs/decisions/2026-06-11-open-source-public-distribution.md` lacked an explicit decision-maker and approval record. | accepted_repaired - added `## Approved By` naming Operator Matthew Flebbe and Repo PM Codex with 2026-06-11 decision recording. |
| major | `package.json` metadata links are invalid or inaccessible while `publishConfig.access` is public. | rejected_after_verification - `git remote -v` points at `https://github.com/pyxe-developer/Bandit.git`; `git ls-remote --heads https://github.com/pyxe-developer/Bandit.git main` returned `105f231cbe96bbc1ce4ae371ad4b37a279bcf910 refs/heads/main`; package metadata URLs match that repository. |
| critical | README GitHub install target `github:pyxe-developer/Bandit#main` is non-existent and will fail. | rejected_after_verification - `git ls-remote --heads https://github.com/pyxe-developer/Bandit.git main` succeeded, and `npm view github:pyxe-developer/Bandit#main name version bin --json` returned `bandit-workflow`, version `0.0.0`, and bin `bandit`. The README command still requires the broader `BANDIT-098` day-1 quickstart hardening before landing, but the specific non-existent-target claim is false. |

## PM Disposition

The timeout is accepted as Stage 1 formation replacement evidence only because:

- Local Qwen formation review returned `pass` with `findings_status:
  no_findings` after brief repairs.
- The emitted CodeRabbit finding that was valid was repaired immediately.
- The emitted link/install findings were independently checked and rejected
  with live command evidence.
- No CodeRabbit pass is claimed.
- Future stages still require normal review gates or honest timeout/refusal
  evidence before landing.
