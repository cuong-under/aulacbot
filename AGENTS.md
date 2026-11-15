# AULACBOT — Âu Lạc Bot

Instructions for every AI coding agent working in this repository.

**Read this first, then `docs/upstream/OWNERSHIP_MAP.md` and `docs/upstream/CUSTOMIZATION_REGISTRY.md`
before touching any file.**

## What this repository is

AULACBOT (`Âu Lạc Bot`) is a **downstream fork** of
[agentes.chat](https://github.com/agentes-chat/agentes-chat) by Codari Global, LLC.

- The upstream codebase is a Slack-style workspace where people and AI agents work together.
- The git history is upstream's history. Do not rewrite it, squash it, or start over.
- The fork keeps a permanent `upstream` remote and must stay able to merge upstream `main`.
- Upstream is **AGPL-3.0-only** with an attribution term and a trademark policy. Both are binding.

## Non-negotiables

1. **Never rewrite history.** No `rebase` of published branches, no `push --force`, no deleting
   upstream tags. Upstream sync merges keep their merge commits.
2. **Never remove the attribution.** Every interactive UI keeps, in its About screen, the notice
   required by `NOTICE` §7(b): `Based on agentes.chat by Codari Global, LLC (https://agentes.chat)`.
   AULACBOT branding may appear next to it — never instead of it.
3. **Never remove license files.** `LICENSE`, `NOTICE`, `TRADEMARKS.md`, `COMMERCIAL.md`, `CLA.md`,
   and third-party license folders stay. Do not edit them without an explicit owner decision.
4. **Never touch `agentes` / `agentes.chat` trademarks.** Product name, logo and app icons of the
   original stay theirs. A fork has its own name, logo, bundle id and store listing.
5. **Upstream files are read-mostly.** If a change is unavoidable in an upstream-owned file, it must
   be recorded in `docs/upstream/CUSTOMIZATION_REGISTRY.md` in the same commit.
6. **No unsanctioned dependencies.** Do not add or upgrade dependencies to "make something work".
   The lockfile is upstream's; treat `bun.lock` as owned by upstream.
7. **No scope creep.** No new product features, no UI redesign, no backend rewrite, no database or
   framework swap, no new AI runtime, unless the task says so explicitly.
8. **Never auto-resolve an upstream conflict** by taking one side wholesale. Read both sides first
   (`docs/upstream/CONFLICT_RESOLUTION.md`).

## Stack (verified from source, not from marketing pages)

| Layer | Technology |
| --- | --- |
| Package manager / runtime | Bun 1.4.4 (`packageManager` pinned) |
| Language | TypeScript 7.0.x |
| Server | Hono 4 + Bun native WebSocket, Better Auth |
| Database | PostgreSQL 15+ with `vector` (pgvector); Drizzle ORM + committed SQL migrations |
| Web | Vite 8 + React 19 + TanStack Router/Query |
| Desktop | Tauri 2 (Rust) + Vite/React |
| Mobile | Expo SDK 58 / React Native 0.88 (expo-router) |
| Lint / format | Biome 2.5 |
| Tests | `bun test` on in-memory PGlite, no Docker, no network |

## Monorepo layout

```
apps/        server · web · desktop · mobile        (upstream-owned)
packages/    engine · db · adapters · providers · config · client · ui · i18n · tokens · modules · setup
deploy/      docker-compose, deploy.sh, backup, speech   (upstream-owned)
docs/adr/    upstream architecture decisions        (upstream-owned, 185 ADRs)
docs/{project,architecture,development,decisions,upstream}/   AULACBOT-owned
scripts/     upstream checks (boundaries, licenses, migrations, geometry)
patches/     bun `patchedDependencies` patches
```

Full detail: `docs/architecture/REPOSITORY_STRUCTURE.md`.

## Where code belongs

- **Upstream-owned** — inherit, do not rewrite. Prefer a config value, an env var, an adapter or
  module override over an edit.
- **AULACBOT-owned** — new `packages/aulacbot-*` packages and the `docs/` trees above. Free to
  change.
- **Shared / modified upstream** — root `package.json`, workspace config, app metadata, entry
  points, branding config. Minimal diff, separate commit, registry entry.

**Dependency direction is one-way:** upstream code must never import AULACBOT code. An AULACBOT
package may depend on upstream packages, never the reverse.

## Commands (PowerShell, Windows 11)

```powershell
bun install --frozen-lockfile --linker=hoisted   # see docs/development/DEVELOPMENT_SETUP.md
bun run typecheck        # 15/15 workspaces
bun run lint             # biome check .
bun run check:boundaries # upstream: no ee/ import, no private paths, no internal notes
bun run check:licenses
bun test                 # long (~1h on Windows); run one file while iterating
bun run dev              # server :3000 + web :5173 (Vite proxies /api)
bun run build            # web then server
```

Run `typecheck`, `lint` and the tests for the files you touched before declaring work done.

## Git workflow

```
upstream/main  --(merge on a sync branch)-->  develop  --(release PR)-->  main
```

- `main` — released AULACBOT builds. No direct commits. Never merge upstream into it directly.
- `develop` — integration branch; the target of every pull request.
- `upstream-sync/YYYY-MM-DD` — one branch per upstream sync. Merges upstream, never squashes it.
- `feature/*`, `fix/*`, `docs/*` — short-lived, branched from `develop`.

Commit messages: `type(scope): summary` (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`).
Upstream sync commits say so explicitly, e.g. `chore(upstream): sync agentes.chat 2026-11-16`.

## Upstream synchronization

Never do it silently. The procedure is `docs/upstream/UPSTREAM_SYNC.md`; the risk classes are
`docs/upstream/reports/`. Every sync produces an impact report under `docs/upstream/reports/` and a
new row in `docs/upstream/SYNC_HISTORY.md`.

## Security

- Never commit secrets. `.env` is local only; `.env.example` is generated from
  `packages/config/src/schema.ts` (`bun run docs:env`) — never hand-edit it.
- Provider keys are encrypted per organization and never leave the backend. Do not add a code path
  that returns a key to a client.
- Every model call goes through the engine's Model Gateway (budget checked, usage recorded).
- Every tenant-owned table carries `org_id`; a test enforces it.

## Documentation

- A new architecture decision, or a change to one, gets an ADR. Upstream's live in `docs/adr/`;
  AULACBOT's live in `docs/decisions/`.
- A change to an upstream-owned file gets a `CUSTOMIZATION_REGISTRY.md` entry with its commit SHA.
- Docs must describe the repository as it actually is. No invented packages, no imagined modules.

