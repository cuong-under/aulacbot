# Customization Registry

Every AULACBOT change to an upstream-owned file is recorded here, in the same commit.

## Status right now

**No upstream file has been modified.** The bootstrap commit adds new files only
(`AGENTS.md` and `docs/**`). Every AULACBOT obligation so far is satisfiable by configuration.

## Registry entries

### AULACBOT-CUSTOM-001 — Instance identity through configuration (no code edit)

**Files:** none modified. Set at deploy time via env.

| Field | Value |
| --- | --- |
| Owner | Shared (config values only) |
| Upstream behavior | `SOURCE_URL` defaults to `https://github.com/agentes-chat/agentes-chat`; `EMAIL_FROM`, `TERMS_URL`, `PRIVACY_URL` derive from the instance host |
| AULACBOT behavior | Set `SOURCE_URL` to AULACBOT's published repository; set `TERMS_URL`/`PRIVACY_URL`/`EMAIL_FROM` to AULACBOT's own |
| Why | AGPL §13 requires a modified running server to point at its own source |
| Commit | n/a (no code change) |
| ADR | ADR-001 |
| Sync risk | None — pure configuration |
| If upstream changes | Nothing to resolve; re-read `.env.example` after each sync for renamed or new identity variables |
| Regression test | Manual: About screen shows AULACBOT's source URL |

### AULACBOT-CUSTOM-002 — Attribution must stay in About (constraint, not an edit)

**Files:** `apps/web/src/components/AboutSettings.tsx` (read-only), translation key
`settings.about.basedOn`.

| Field | Value |
| --- | --- |
| Owner | Upstream |
| Upstream behavior | Shows "Based on agentes.chat by Codari Global, LLC" plus version and source link |
| AULACBOT behavior | Identical. AULACBOT branding is added *next to* it, never replacing it |
| Why | `NOTICE` §7(b) term of AGPL-3.0 |
| Commit | n/a |
| ADR | ADR-001 |
| Sync risk | Medium — upstream may restructure this screen; the attribution must survive the sync |
| If upstream changes | Verify the new screen still shows the notice; if it moved, follow it, do not restore the old layout |
| Regression test | Manual: Settings › About in web, desktop and mobile |

### AULACBOT-CUSTOM-003 — Upstream identity leaks still on upstream defaults (open decision)

**Files:** none modified — these are `.env.example` defaults that a deployment inherits when unset.

| Setting | Upstream default | Why it matters |
| --- | --- | --- |
| `TELEMETRY_URL` + `TELEMETRY=on` | `https://telemetry.agentes.chat/v1/report` | AULACBOT installs send anonymous daily usage to agentes.chat |
| `FEEDBACK_URL` + `FEEDBACK_RELAY=true` | `https://app.agentes.chat/api/feedback/inbox` | In-app feedback is relayed to the agentes.chat team |
| `PUSH_RELAY_URL` | `https://app.agentes.chat/api/push-relay/v1` | Phone pushes route through agentes.chat unless direct credentials are set |
| `DESKTOP_RELEASES_REPO` | `agentes-chat/agentes-chat` | Desktop/native update endpoints read releases from upstream's repo |
| `LANDING_URL` | unset | Waiting-list features off unless set |

| Field | Value |
| --- | --- |
| Owner | Shared — a deployment-time decision, no code edit needed |
| Why | These send AULACBOT user data or updates through upstream infrastructure |
| Commit | n/a |
| ADR | ADR-001 (open question) |
| Sync risk | Low |
| If upstream changes | Re-read `.env.example` after each sync for new outbound defaults |
| Regression test | Manual: check a deployment's outbound calls with these unset |

**Decision needed:** whether AULACBOT sets `TELEMETRY=off`, `FEEDBACK_RELAY=false` and its own
`DESKTOP_RELEASES_REPO`. This is an owner decision, not an agent one.

### AULACBOT-CUSTOM-004 — Product identity (pending branding phase)

Verified while running the server: the product name is **hardcoded**, not configurable. `GET
/api/instance` answered `{"name":"agentes.chat"}` even with AULACBOT's `SOURCE_URL` set.

**Files that would change:**

| File | Line | Hardcoded value |
| --- | --- | --- |
| `apps/server/src/routes/instance.ts` | 16 | `name: z.literal("agentes.chat")` |
| `apps/server/src/routes/instance.ts` | 62 | `name: "agentes.chat" as const` |
| `apps/server/src/auth.ts` | 153 | `appName: "agentes.chat"` |
| `apps/server/src/oauth.ts` | 94 | `resource_name: "agentes.chat"` |
| `apps/server/src/native.ts` | 401 | `description: "agentes.chat"` |
| `apps/server/src/routes/desktop.ts` | 162 | `"user-agent": "agentes.chat"` |
| `apps/desktop/src-tauri/tauri.conf.json` | — | `productName`, `identifier: chat.agentes.desktop`, window titles, updater endpoints |
| `apps/mobile/app.config.ts` | — | `name: "agentes"`, `slug`, `scheme: agenteschat`, bundle ids `chat.agentes.app*` |
| `README.md` | — | AULACBOT needs its own front page |

| Field | Value |
| --- | --- |
| Owner | Shared, and AULACBOT decides the values |
| Status | **Not started.** Blocked on the owner's branding decision |
| Why | A public fork needs its own name, logo, icons, bundle ids and store listing (`TRADEMARKS.md`); `z.literal("agentes.chat")` makes the client's instance contract reject any other name |
| Sync risk | **High** — `instance.ts` is a contract file (client + OpenAPI + tests), `auth.ts` is auth |
| Plan | One minimal edit per file, each its own commit and registry entry. Consider a single AULACBOT-owned constant module that these files import, so the diff stays one line per site |
| Regression test | `bun run typecheck` covers the `z.literal` contract; re-run `GET /api/instance` and check the About screen in all three apps |

### AULACBOT-CUSTOM-005 — Root README replaced with AULACBOT's own

**Files:** `README.md`

| Field | Value |
| --- | --- |
| Owner | Shared |
| Upstream behavior | Marketing and quick-start front page for agentes.chat, with badges, screenshots and a features table |
| AULACBOT behavior | AULACBOT front page: what this repository is, that it is a fork, its attribution and license obligations, setup pointer, and the rule that upstream documentation is read-only |
| Why | `README.md` is the first thing anyone reads; leaving upstream's would present AULACBOT as agentes.chat. `TRADEMARKS.md` also asks a public fork to have its own identity |
| Commit | see the bootstrap commit |
| ADR | ADR-001 |
| Sync risk | **Low** — upstream edits `README.md` often, but a conflict here is cheap and self-evident |
| If upstream changes | Keep AULACBOT's text; cherry-pick only genuinely useful neutral content such as a corrected command |
| Regression test | none; review by reading |

## Entry template

```
### AULACBOT-CUSTOM-NNN — <title>

**Files:** <real paths>

| Field | Value |
| --- | --- |
| Owner | Upstream / AULACBOT / Shared |
| Upstream behavior | ... |
| AULACBOT behavior | ... |
| Why | ... |
| Commit | <sha> |
| ADR | ADR-NNN |
| Sync risk | Low / Medium / High |
| If upstream changes | ... |
| Regression test | <command or manual step> |
```

## Rule

No upstream-owned file is edited without a registry entry in the same commit. A registry entry that
no longer matches the code is worse than none — update or delete it during every sync.

