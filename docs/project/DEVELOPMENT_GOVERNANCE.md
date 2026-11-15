# Development Governance

## Roles

| Role | Holds |
| --- | --- |
| Project owner | Repository ownership, visibility, license path, branding decisions, release approval |
| Maintainer | Merge rights on `develop` and `main`, upstream sync approval |
| AI coding agent | Audits, configuration, documentation, tests, implementation inside an approved scope |

An AI coding agent never takes a decision that belongs to the owner (see `AGENTS.md`) and never
performs a destructive git or data operation on its own initiative.

## Decision authority

**Owner decides**

- GitHub account/organisation and repository visibility.
- Fork strategy (official GitHub fork vs. independent repository).
- License path and any commercial agreement.
- Product identity: name, display name, logo, bundle identifiers.
- What ships in a release.

**Maintainer decides**

- Branching, merge order, release tagging.
- Accepting an upstream sync after its impact report.

**Agent decides within an approved task**

- Audits, local configuration, documentation, test additions, refactors inside the task scope.
- Anything already covered by a decision recorded in `docs/decisions/`.

**Agent must ask**

- Anything touching repository ownership, visibility, license or branding.
- Any change to an upstream-owned file that a config value or adapter cannot avoid.
- Any destructive operation (deleting branches or tags, rewriting history, dropping data).

## Change classes

| Class | Examples | Requirements |
| --- | --- | --- |
| Upstream-owned | `apps/*`, `packages/*`, `deploy/*`, upstream docs | Prefer config/adapter; if edited, registry entry + sync-risk note |
| AULACBOT-owned | `packages/aulacbot-*`, `docs/project`, `docs/architecture`, `docs/development`, `docs/decisions`, `docs/upstream` | Normal review |
| Shared | root `package.json`, workspace config, app metadata, entry points, branding config | Minimal diff, own commit, registry entry, impact analysis |

## Required checks before "done"

1. `bun run typecheck` — all 15 workspaces.
2. `bun run lint` — Biome clean (warnings reviewed).
3. Tests for the touched files; the full suite for anything reaching server or engine.
4. `bun run check:boundaries` when touching `apps/` or `packages/`.
5. `docs/upstream/CUSTOMIZATION_REGISTRY.md` updated if an upstream file changed.

## Documentation duties

- New architecture decision → new ADR in `docs/decisions/` (AULACBOT) or `docs/adr/` (upstream
  conventions, only when upstream would have written it).
- Upstream file edited → registry row with commit SHA, reason, sync risk, resolution plan.
- Upstream sync → impact report in `docs/upstream/reports/` + row in `SYNC_HISTORY.md`.

## Reporting

Every phase ends with a factual report that separates:

- **Done** — executed and verified, with the command that proves it.
- **Checked, not passing** — executed, failed, with the cause.
- **Not verifiable here** — blocked by missing environment, with what is missing.
- **Awaiting owner decision** — with the options and their consequences.

No PASS without execution. No invented results.

