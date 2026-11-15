# AULACBOT — Project Overview

## Identity

| Field | Value |
| --- | --- |
| Product name | AULACBOT |
| Display name | Âu Lạc Bot |
| Repository | `aulacbot` |
| Description | Personal AI Assistant & Team AI Workspace |
| Upstream | [agentes-chat/agentes-chat](https://github.com/agentes-chat/agentes-chat) |
| Upstream owner | Codari Global, LLC |
| Upstream license | AGPL-3.0-only, with an attribution term (`NOTICE`) and a trademark policy (`TRADEMARKS.md`) |
| Upstream default branch | `main` |
| Upstream baseline merged at | see `docs/upstream/UPSTREAM_BASELINE.md` |
| Local working copy | `D:\AulacBot\aulacbot` |
| Primary development OS | Windows 11 |
| Package manager | Bun 1.4.4 |

## What the product is

AULACBOT inherits agentes.chat: a Slack-style workspace where people and AI agents work together in
the same channels and DMs. Agents have a role, instructions, a model, connectors with scopes, a
budget and an owner; they hold conversations, use MCP tools, and get a browser and a computer of
their own. Anything sensitive (merge, deploy, rollback) becomes an approval card in the chat.

The inherited surface is four apps over one server:

- `apps/server` — the API, WebSocket, agent runtime, jobs and authentication.
- `apps/web` — the browser app.
- `apps/desktop` — the Tauri desktop app (runs or connects to a server from the same machine).
- `apps/mobile` — the Expo/React Native phone app.

## What this project adds (not yet built)

The bootstrap phase only establishes the technical foundation. Product direction for later phases:

- AULACBOT-owned configuration, adapters and provider integrations.
- Personal-assistant extensions and team-workspace extensions.
- Commercial modules and services.

None of these exist yet. Do not add them without an explicit task.

## Goals

1. Keep upstream's source, history and architecture intact and mergeable.
2. Separate upstream-owned code from AULACBOT-owned code so long-term sync stays cheap.
3. Keep every AULACBOT change traceable (customization registry + ADRs).
4. Keep the Windows 11 + Bun local environment reproducible.
5. Leave the door open to commercial licensing decisions taken by the project owner.

## Constraints accepted for this phase

- No rewrite of upstream source.
- No new product features.
- No UI redesign and no logo work.
- No dependency upgrades beyond what upstream ships.
- No repository-level decisions (owner, visibility, license) taken by an agent.

## Related documents

- `docs/project/UPSTREAM_ATTRIBUTION_AND_LICENSE.md` — license and attribution obligations.
- `docs/project/DEVELOPMENT_GOVERNANCE.md` — who decides what, and how.
- `docs/architecture/REPOSITORY_STRUCTURE.md` — the layout as audited.
- `docs/upstream/OWNERSHIP_MAP.md` — which path belongs to whom.

