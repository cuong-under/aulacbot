# Monorepo Architecture

## Shape

One Bun workspace root (`bunfig.toml` sets `[install] linker = "isolated"`) with two workspace
globs: `apps/*` and `packages/*`. Each workspace sees only its own dependencies, which is what keeps
package boundaries honest — there is no hoisting to hide a missing declaration.

**Windows note.** `linker = "isolated"` produces paths that exceed the 260-character Windows limit
for `react-native` (262 characters), so `bun install` fails with
`ENOENT ... failed to link package: react-native@0.88.0 (copyfile)`. Installing with
`--linker=hoisted` works and leaves `bunfig.toml` and `bun.lock` untouched. See
`docs/development/DEVELOPMENT_SETUP.md`.

## Runtime topology

```
web (Vite :5173)  ─┐
desktop (Tauri)   ─┼──▶  server (:3000)  ──▶  PostgreSQL 15+ with vector
mobile (Expo)     ─┘      HTTP /api/*              (the only required dependency)
                          WS   /api/ws
                          auth /api/auth/*
                          operator :3001 (opt-in)
```

In production one server process serves the API, the WebSocket **and** the built web app
(`WEB_DIR`). In development Vite serves the app and proxies `/api` (WebSocket included) to the
server.

Jobs are a Postgres outbox drained by in-process workers — no Redis, no external queue (ADR 0005).
`SERVER_ROLE=worker` splits job-only processes from app processes.

## Layering

| Layer | May import |
| --- | --- |
| `apps/server` | any `packages/*` |
| `apps/web`, `apps/desktop`, `apps/mobile` | `packages/client`, `ui`, `i18n`, `tokens`, `adapters` |
| `packages/client` | `tokens`, `i18n`, pure types |
| `packages/engine` | `db`, `adapters`, `providers`, `config`, `tokens` |
| `packages/ui` | `tokens` |
| any upstream package | **never** an AULACBOT package |

When AULACBOT extension packages exist, the rule is one-way:

```
packages/aulacbot-*   ---depends on--->  upstream packages
upstream packages     ---never------->   packages/aulacbot-*
```

## Extension points to prefer over edits

1. **Configuration** — `packages/config/src/schema.ts` holds every env var; `.env.example` is
   generated from it (`bun run docs:env`). Identity-adjacent defaults such as `SOURCE_URL`,
   `TERMS_URL`, `PRIVACY_URL` and `EMAIL_FROM` are env-driven.
2. **Adapters** — `packages/adapters` is the swappable seam for external services.
3. **Modules** — `packages/modules` exposes `AgentesModule`; Cloud-only behaviour is switched on by
   env var rather than a private in-process package (ADR 0002 §5).
4. **Providers** — `packages/providers` is where a model provider is added.
5. **Own packages** — anything else lands in `packages/aulacbot-*`.

