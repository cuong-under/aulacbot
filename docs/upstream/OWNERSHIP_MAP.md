# Ownership Map

Three classes, using **real paths** from this repository.

- **Upstream** — inherit. Prefer configuration, adapters or module overrides over edits. Any edit is
  recorded in `CUSTOMIZATION_REGISTRY.md`.
- **AULACBOT** — ours; change freely.
- **Shared** — an upstream file AULACBOT must modify. Minimal diff, own commit, registry entry.

## Applications

| Path | Owner | Edit policy | Sync risk |
| --- | --- | --- | --- |
| `apps/server/**` | Upstream | Do not edit; use config, adapters, `packages/modules` | High |
| `apps/server/src/{start,app,auth}.ts` | Upstream | Entry points; any edit is Shared | High |
| `apps/web/**` | Upstream | Do not edit; theme via `packages/tokens`, `packages/ui` | High |
| `apps/web/src/components/AboutSettings.tsx` | Upstream | Holds the §7(b) attribution — never remove it | High |
| `apps/desktop/**` | Upstream | Do not edit | High |
| `apps/desktop/src-tauri/tauri.conf.json` | Shared (when branding) | Identity fields are AULACBOT decisions | High |
| `apps/mobile/**` | Upstream | Do not edit | High |
| `apps/mobile/app.config.ts` | Shared (when branding) | Bundle ids, scheme, name | High |

## Packages

| Path | Owner | Edit policy | Sync risk |
| --- | --- | --- | --- |
| `packages/engine/**` | Upstream | The agent runtime. Never rewrite | High |
| `packages/engine/src/gateway.ts` | Upstream | Every model call goes through it | High |
| `packages/db/**` (schema, migrations) | Upstream | Committed migrations are immutable; add new ones only | High |
| `packages/adapters/**` | Upstream | Extend by adding an adapter, not editing ones in use | Medium |
| `packages/providers/**` | Upstream | Add providers here; do not fork existing ones | Medium |
| `packages/config/**` | Upstream | `schema.ts` is the source of every env var | Medium |
| `packages/modules/**` | Upstream | `AgentesModule` seam for env-switched behaviour | Medium |
| `packages/client/**` | Upstream | Shared client; do not fork per app | Medium |
| `packages/ui/**` | Upstream | The design system; reuse, do not restyle | Medium |
| `packages/i18n/**` | Upstream | Add locales per upstream conventions | Low |
| `packages/tokens/**` | Upstream | Theme values live here | Low |
| `packages/setup/**` | Upstream (MIT) | The one MIT package; keep its license header | Low |
| `packages/aulacbot-*` | **AULACBOT** | New packages only; never imported by upstream | Low |

## Root and infrastructure

| Path | Owner | Edit policy | Sync risk |
| --- | --- | --- | --- |
| `package.json` | Shared | Workspace globs and scripts; minimal diff | High |
| `bun.lock` | Upstream | Treat as upstream's; do not upgrade wholesale | High |
| `bunfig.toml` | Upstream | `linker`, test preloads — do not change casually | Medium |
| `tsconfig.base.json`, `tsconfig.json` | Upstream | Do not edit | Medium |
| `biome.json` | Upstream | Do not edit; fix the code instead | Medium |
| `.gitattributes` | Upstream | Migration LF rule is load-bearing | Medium |
| `.gitignore` | Upstream | Do not edit | Low |
| `.env.example` | Upstream (generated) | Regenerate with `bun run docs:env` | Low |
| `docker-compose.yml`, `Dockerfile`, `install.sh` | Upstream | Deployment; changes are Shared | Medium |
| `deploy/**` | Upstream | Linux deploy scripts; tests need bash | Medium |
| `patches/**` | Upstream | One `patchedDependencies` patch | Low |
| `scripts/**` | Upstream | Check scripts; `check:boundaries` guards the tree | Medium |
| `.github/**` | Upstream | CI, templates, dependabot | Low |

## Legal and identity (never AULACBOT-owned)

| Path | Owner | Edit policy |
| --- | --- | --- |
| `LICENSE`, `NOTICE`, `TRADEMARKS.md`, `COMMERCIAL.md`, `CLA.md` | Upstream | Read-only. Never edit or delete. |
| `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md` | Upstream | Read-only |
| `README.md` | Shared | AULACBOT needs its own front page — see the open decision in `CUSTOMIZATION_REGISTRY.md` |
| `CLAUDE.md` | Upstream | Upstream's agent guide; AULACBOT's is `AGENTS.md` |
| `docs/adr/**`, `docs/design/**`, `docs/media/**` | Upstream | Read-only |

## AULACBOT-owned

| Path | Contents |
| --- | --- |
| `AGENTS.md` | Agent instructions for this repository |
| `docs/project/**` | Overview, license/attribution, governance |
| `docs/architecture/**` | Repository structure, monorepo architecture |
| `docs/development/**` | Setup, environment variables |
| `docs/decisions/**` | AULACBOT ADRs |
| `docs/upstream/**` | Baseline, ownership, sync, registry, conflicts, history, reports |

Reserved for later phases, not created yet: `packages/aulacbot-*`.

## Boundary rule

Upstream must never import AULACBOT. `bun run check:boundaries` already forbids `ee/` and Cloud
imports; the AULACBOT direction is a review-time rule because no AULACBOT package exists yet.

