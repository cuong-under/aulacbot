# ADR-002 — Upstream Synchronization

Status: Accepted (bootstrap phase)
Date: 2026-11-15

## Context

The value of AULACBOT depends on staying current with agentes.chat. The risk is the classic fork
failure: a sync becomes so painful that it stops happening, and the fork drifts permanently.

Upstream moves fast: 9050 commits since 2026-10-14, 42 remote branches, frequent merges into `main`.
Any process that assumes a low rate of change will fail.

## Decision

1. `upstream` is a permanent remote. It is never removed, renamed or repointed.
2. Sync merges, never rebase or squash. The merge commit preserves the record of what came in and
   keeps a clean merge base for the next sync.
3. One branch per sync: `upstream-sync/YYYY-MM-DD`, cut from `develop`, merged from `upstream/main`,
   validated, reported, then a pull request into `develop`.
4. An impact report every time, even for a trivial sync:
   `docs/upstream/reports/YYYY-MM-DD-sync.md`, plus a row in `SYNC_HISTORY.md`.
5. Risk is classified before merging (LOW, MEDIUM, HIGH, CRITICAL) by comparing changed paths
   against the Ownership Map and the Customization Registry. A path in both is a predicted conflict.
6. "No Git conflict" is not "no conflict". Semantic drift is caught by typecheck, tests and a read
   of the changed upstream code, not by the merge tool.
7. Never auto-merge upstream. No workflow, script or agent resolves a sync without a human
   reviewing the report.
8. Cadence: fetch weekly, sync at least monthly, sync immediately for a CRITICAL security fix, and
   always before cutting a release.

## Consequences

Good:

- The merge base stays recent, so conflicts stay small and attributable.
- Every sync leaves an auditable trail: SHA pair, risk class, files, decisions, validation results.
- A bad sync can be reverted as a single merge commit.
- Security fixes can be taken quickly, with a documented and low-friction path.

Costs:

- Merge commits instead of a linear history. Accepted deliberately; the sync model requires them.
- A sync costs real validation time on Windows; a full `bun test` run exceeded an hour here.
- Someone must do it on a schedule. The process only works if it is habitual.

## Definition of done for a sync

- The merge completes with no unresolved conflicts.
- `bun run typecheck`, `lint`, `check:boundaries`, `check:licenses` and `check:migrations` pass.
- Tests pass, or every failure is explained as pre-existing or environment-specific.
- The impact report is written and `SYNC_HISTORY.md` is updated.
- `CUSTOMIZATION_REGISTRY.md` reflects reality after the merge.

