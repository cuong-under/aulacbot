# ADR-001 — Initial Architecture

Status: Accepted (bootstrap phase)
Date: 2026-11-15

## Context

AULACBOT (`Âu Lạc Bot`) is a new product built on the open-source agentes.chat codebase by Codari
Global, LLC. The project must be able to ship independently for years and still take upstream
updates, without forking again from scratch and without losing what makes AULACBOT its own product.

The codebase audited at `50ca784dd` is a Bun workspace monorepo: four apps (`server`, `web`,
`desktop`, `mobile`) and eleven `@agenteschat/*` packages, AGPL-3.0-only, with an attribution term
and a trademark policy, 9050 commits of history, 273 committed migrations, and three existing seam
packages: configuration (`packages/config/src/schema.ts`), adapters (`packages/adapters`) and
modules (`packages/modules`).

## Decision

1. Fork by history, not by copy. AULACBOT is a git clone with the full upstream history; `origin`
   will be AULACBOT's repository and `upstream` the permanent agentes.chat remote. No ZIP download,
   no fresh `git init`, no history rewrite.
2. Keep upstream's architecture. No directory moves, no package renames, no framework or database
   change, no dependency upgrades during bootstrap.
3. Three ownership classes (see `docs/upstream/OWNERSHIP_MAP.md`): upstream-owned (inherit),
   AULACBOT-owned (new and isolated), shared/modified (minimal diff, registered).
4. Configuration before code. Where upstream exposes an env var, adapter or module, AULACBOT uses
   it instead of editing source. Verified seams: identity (`SOURCE_URL`, `TERMS_URL`,
   `PRIVACY_URL`, `EMAIL_FROM`), adapters, `AgentesModule`, providers.
5. Separate packages for AULACBOT code. Future AULACBOT work lands in `packages/aulacbot-*` and the
   `docs/` trees AULACBOT owns. Upstream code never imports AULACBOT code.
6. Branch model: `upstream/main` to `upstream-sync/YYYY-MM-DD` to `develop`, then a release pull
   request into `main`. Sync merges are real merge commits.
7. Attribution is permanent. The `NOTICE` §7(b) line stays in every About screen. AULACBOT branding
   is additive.

## Consequences

Good:

- Upstream bug fixes, security patches and features remain reachable indefinitely.
- Conflicts stay proportional to AULACBOT's actual customizations, which start at zero.
- Upstream's own guards (`check:boundaries`, `check:licenses`, the migration guard, 185 ADRs) keep
  working unchanged.
- Any developer who knows agentes.chat can work in this repository immediately.

Costs:

- AULACBOT cannot simply restructure the tree; genuine architectural divergence needs its own
  package and its own ADR.
- Every upstream-owned edit carries an ongoing sync cost, so edits must be justified.
- The Windows environment needs specific workarounds (`--linker=hoisted`, LF line endings).
- AGPL obligations apply to any deployed instance until a commercial license is obtained.

## Open decisions for the owner

1. Repository owner and visibility: which GitHub account or organisation, public or private.
2. Fork strategy: official GitHub fork (keeps the fork-network relationship and an easy sync
   button) versus an independent repository with upstream history (no fork-network tie, full
   control). Either satisfies the technical requirements. The recommendation is the official fork
   while the project is young, because it makes the upstream relationship visible and cheap.
3. License path: AGPL-only (publish modifications, keep the attribution) or a commercial contract
   with Codari Global, LLC.
4. Branding scope for this phase: metadata only (recommended, and what this bootstrap does) or full
   visual identity.
5. Upstream data defaults: whether AULACBOT keeps telemetry, the feedback relay, the push relay and
   the desktop release repo pointed at upstream. See `CUSTOMIZATION_REGISTRY.md`
   AULACBOT-CUSTOM-003.

None of these block local development; the first two block creating the remote repository.

## Alternatives considered

- Fresh repository from a ZIP snapshot: loses history and the merge base, turning future upstream
  syncs into a manual three-way diff. Rejected.
- Vendoring upstream as a dependency: impossible for an application monorepo of this shape, and it
  would break the bundling of desktop and mobile assets. Rejected.
- Renaming the `@agenteschat/*` scope at bootstrap: a large conflict surface across every file for
  cosmetic gain. Rejected for this phase; an AULACBOT scope belongs to a future branding ADR.

