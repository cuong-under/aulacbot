# Customization Registry

Every AULACBOT change to an upstream-owned file is recorded here, in the same commit.

## Status right now

**The identity pass is committed as `01c1e7a23` (2026-11-19).** Entries 006 onwards record it:
product name, logo, icons, desktop/mobile metadata, email identity and the copy pass. Everything else
in upstream remains as it arrived.

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
| Upstream behavior | Shows "Based on agentes.chat by AGENTESCHAT, LLC" plus version and source link |
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

### AULACBOT-CUSTOM-004 — Product identity (names and icons done; server identity still upstream)

Verified while running the server: the product name is **hardcoded**, not configurable. `GET
/api/instance` answered `{"name":"agentes.chat"}` even with AULACBOT's `SOURCE_URL` set. That is
still true, on purpose: the app is a client of upstream servers, so the instance contract, the OAuth
resource name and the client's accepted name stay `agentes.chat` until AULACBOT ships its own server
software. Everything a person sees as the product's identity now says `AULACBOT`.

| Done on 2026-11-17 | Now |
| --- | --- |
| `apps/desktop/src-tauri/tauri.conf.json` | `productName: "AULACBOT"`, `shortDescription: "AULACBOT"`, the three window titles `AULACBOT`; `identifier: chat.agentes.desktop`, the `agenteschat` scheme, the updater endpoint and `copyright` are **KEEP** |
| `apps/mobile/app.config.ts` | `name: "AULACBOT"` (`AULACBOT <variant>` off production), `iosShareExtensionName` likewise; `slug: "agentes"`, `scheme: "agenteschat"` and the `chat.agentes.app*` bundle ids are **KEEP** |
| `README.md` | AULACBOT's own front page (see `-005`) |
| The mark, icons, palette and copy | `docs/branding/cyber-lac/REPLACEMENT-MAP.md` §1–§3; the entries `-006` to `-009` below |

**Still upstream, and why:** `apps/server/src/routes/instance.ts:16,62` (`z.literal("agentes.chat")`
and the route's `name`), `apps/server/src/oauth.ts:94` (`resource_name`),
`apps/server/src/native.ts:401` (`description`) and
`apps/server/src/routes/desktop.ts:162` (the user agent). A fork that renamed these would answer a
name its own client rejects and would break sign-in against every workspace already running.
The Better Auth `appName` is a user-facing label and is `AULACBOT` under AULACBOT-CUSTOM-014; it
does not change the instance or OAuth identity.

| Field | Value |
| --- | --- |
| Owner | Shared, and AULACBOT decides the values |
| Status | **Partly done.** Names, icons, metadata and copy: done 2026-11-17. Server-side instance identity: open, waits for AULACBOT's own server release |
| Why | A public fork needs its own name, logo, icons and store listing (`TRADEMARKS.md`); `z.literal("agentes.chat")` makes the client's instance contract reject any other name |
| Sync risk | **High** — `instance.ts` is a contract file (client + OpenAPI + tests), `auth.ts` is auth |
| If upstream changes | Take upstream's server files as they are. Change the instance name only together with the client's accepted names, the OAuth resource and the About/`z.literal` tests, never before |
| Plan for the rest | Give the server its own constant module, one line per site, then widen `packages/client/src/lib/server.ts` to accept both names during the transition |
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

### AULACBOT-CUSTOM-006 — Product name in UI copy (web, phone, desktop, engine, client, ui)

**Files:** `packages/i18n/src/{en,pt-BR}.ts`, the 12 shared locale `.json`/`.source.json` pairs,
`packages/i18n/src/locales/vi.json`, `packages/i18n/src/help/pages.*.ts` (14 upstream languages, plus
the AULACBOT-owned `pages.vi.ts`), `packages/engine/src/email/words/*.ts` and
`packages/engine/src/push/messages/*.ts` (14 each), `apps/mobile/src/i18n/**` and
`apps/mobile/src/features/i18n/**` (26 files each), and prose in `apps/web/src`, `apps/mobile/src`,
`apps/desktop/src`, `packages/engine/src`, `packages/client/src` and `packages/ui/src`

| Field | Value |
| --- | --- |
| Owner | Shared — upstream owns the files, AULACBOT owns the name |
| Upstream behavior | Every sentence names the product `agentes.chat` |
| AULACBOT behavior | Every prose reference names it `AULACBOT`; `https://agentes.chat/*` URLs, `*@agentes.chat` addresses, `agenteschat`/`agenteschat://` protocol keys, `AGENTES_*` env names, `~/.agentes`, user-agent strings, `SIGNATURE_MARK`, deep-link paths and the About attribution stay exactly as upstream |
| Why | A public fork must present its own name; `TRADEMARKS.md` forbids presenting the fork as upstream |
| Commit | `01c1e7a23` |
| ADR | ADR-001 |
| Sync risk | **High** — 390 files carry copy, so any upstream copy change conflicts. Resolve by taking upstream's wording and re-applying only the name, never by reverting AULACBOT |
| If upstream changes | Re-run the same name substitution over the changed files; keep URLs, attribution, protocol keys and the setup installer's own output on upstream's name |
| Regression test | `bun run typecheck`; `bun test packages/i18n`; `bun test apps/mobile/test/i18n-guard.test.ts apps/mobile/test/i18n-keys.test.ts`; `bun test packages/engine/test/email.test.ts` (snapshot); `packages/i18n/test/glossary.test.ts` keeps `AULACBOT` and `agentes.chat` both in `keep` |

### AULACBOT-CUSTOM-007 — Email sender name follows the product

**Files:** `packages/engine/src/email.ts` (`SENDER_NAME`), `packages/setup/src/lib.ts` (`SENDER_NAME`)

| Field | Value |
| --- | --- |
| Owner | Shared |
| Upstream behavior | `SENDER_NAME = "agentes.chat"` in both files, which their own comments require to match |
| AULACBOT behavior | Both are `"AULACBOT"`, so a self-hosted server's default `From:` reads `AULACBOT <ping@host>`; the `ping@` mailbox stays |
| Why | The sender line is the first thing a recipient reads; it must name the product |
| Commit | `01c1e7a23` |
| ADR | ADR-001 |
| Sync risk | Low — two constants, but they must change together or the setup's offered sender stops matching the engine's |
| If upstream changes | Change both to AULACBOT again and update `packages/setup/test/lib.test.ts` plus the email snapshot |
| Regression test | `bun test packages/setup/test/lib.test.ts packages/engine/test/email.test.ts` |

### AULACBOT-CUSTOM-008 — Product name in agent-facing text (engine prompts and tool replies)

**Files:** `packages/engine/src/{capabilities,context,machines,machine-hub,machine-accounts,setup-tools,no-ai,credentials,feedback-tools,mission-sync,pdf,storage,runner-update}.ts`, `packages/engine/src/git/*`, `packages/engine/src/browser/*`, `packages/ui/src/components/HostingScene.tsx`, `packages/ui/src/sky/team.ts`

| Field | Value |
| --- | --- |
| Owner | Shared |
| Upstream behavior | Agents read `agentes.chat`, the computer it runs on is named after it, and GitHub signatures/PDF producers say `agentes.chat` |
| AULACBOT behavior | Those sentences say `AULACBOT`; the computer's own name, e-mail trailers and `SIGNATURE_MARK` stay upstream (`<!-- agentes.chat -->`, `noreply@agentes.chat`) so older clients still recognise a signed body |
| Why | An agent that names a different product than the one people use confuses both |
| Commit | `01c1e7a23` |
| ADR | ADR-001 |
| Sync risk | Medium — prompts are large and change often; a conflict here can silently reintroduce the old name |
| If upstream changes | Re-apply the name to prose only; never touch `SIGNATURE_MARK`, `AGENT_CO_AUTHOR_EMAIL` or the signature regexes |
| Regression test | `bun test packages/engine/test` (the git, signature, machines, setup-tools and context suites cover it) |

### AULACBOT-CUSTOM-009 — The terminal's logo is the Lạc bird, in the brand's jade palette

**Files:** `packages/setup/src/term.ts` (`LOGO_MARK`, `GLYPHS`, `TONE_*`, `ACCENT`, `BADGE`, `logoLines`,
`LOGO_WIDTH`), `packages/setup/src/term-sh.ts` (`t_logo`, `t_cell`, `t_tone`, `t_intro`), `packages/ui/test/logo-mark.test.ts`

| Field | Value |
| --- | --- |
| Owner | Shared — upstream owns the files, AULACBOT owns the mark |
| Upstream behavior | The logo is the pixel agent of `packages/ui/src/agent/engine.js` on a 12 × 12 grid, the wordmark reads `agentes` with `.chat` beside it, and every mark is drawn in the agent's sky blue |
| AULACBOT behavior | The mark is the Cyber Lạc head (mint crest and head, jade visor, two eyes, gold bill) on the same 12 × 12 grid; the wordmark reads `AULACBOT` with `.app` muted on the baseline; the palette is jade `#0F7A66` for links and `#0F6A59` for the badge; the logo shows from 67 columns and both the TypeScript and the POSIX `sh` copy draw it escape for escape |
| Why | An install is the first thing anyone sees; if it greets people with a different brand than the icon and the app, the fork reads as half-finished |
| Commit | `01c1e7a23` |
| ADR | ADR-001 |
| Sync risk | Medium — `term.ts` and `term-sh.ts` are a matched pair (one test compares them escape for escape), and the palette's tone numbers are shared between them |
| If upstream changes | Re-apply the mark, the `aulacbot` glyphs and the jade tones to both files together; keep `AGENTES_FRAME`, the `agentes-log` temp name and upstream's `https://agentes.chat/install` URL |
| Regression test | `bun test packages/setup/test/term.test.ts packages/ui/test/logo-mark.test.ts` |

### AULACBOT-CUSTOM-010 — Desktop and mobile brand positions use the pixel Cyber Lạc mark

**Files:** `packages/ui/src/brand/logo-mark.ts`, `packages/ui/src/components/Logo.tsx`,
`packages/ui/src/components/HostingScene.tsx`, `packages/ui/src/styles/components.css`,
`packages/ui/package.json`, `packages/ui/test/logo-mark.test.ts`, `packages/ui/test/components.test.tsx`,
`apps/desktop/src/ui/bits.tsx`, `apps/desktop/src/styles.css`,
`apps/desktop/test/first-run-here.test.tsx`, `apps/mobile/src/ui/LogoMark.tsx`,
`apps/mobile/app/_layout.tsx`, `apps/mobile/src/features/launch/LaunchSplash.tsx`,
`apps/mobile/src/features/launch/logic.ts`,
`apps/mobile/test/features/launch.test.ts`

| Field | Value |
| --- | --- |
| Owner | Shared — upstream owns the UI files, AULACBOT owns its mark |
| Upstream behavior | The welcome illustration and desktop brand face use the blue agent avatar as the product logo |
| AULACBOT behavior | Desktop and mobile brand positions use the shared sharp 12 × 12 Cyber Lạc pixel grid, including the native and animated mobile launch splash with an AULACBOT wordmark; the three small desktop faces and the hosting-scene cast remain agent avatars |
| Why | The product logo must not be confused with the upstream agent avatar |
| Commit | `01c1e7a23` |
| ADR | ADR-001 |
| Sync risk | Medium — shared UI components are reused across the desktop's first-run and popover windows |
| If upstream changes | Preserve upstream agent avatars for agents; keep the AULACBOT brand mark on the shared 12 × 12 pixel grid |
| Regression test | `bun test packages/ui/test/logo-mark.test.ts packages/ui/test/components.test.tsx apps/desktop/test/first-run-here.test.tsx` |

### AULACBOT-CUSTOM-011 — The agents' sky, accent and splash use the Cyber Lạc palette

**Files:** `packages/ui/src/sky/math.ts`, `packages/ui/src/sky/workspace.ts`,
`packages/ui/src/sky/selection.ts`, `packages/ui/src/agent/engine.js`,
`packages/ui/src/computer/portrait.js`, `packages/ui/src/components/SearchPixels.tsx`,
`packages/ui/src/styles/tokens.css`, `docs/design/design-system/tokens.css`,
`packages/tokens/src/index.ts`, `packages/client/src/lib/purpose-scene.ts`,
`apps/web/src/layout.css`, `apps/web/src/components/welcome.css`, `apps/web/src/pages/onboarding.css`,
`apps/web/src/pages/new-agent.css`, `apps/web/src/components/Sky.tsx`, `apps/web/index.html`,
`apps/web/public/unavailable.html`, `apps/desktop/src/cover/cover.css`, `apps/desktop/src/cover/main.ts`,
`apps/desktop/src-tauri/src/cover.rs`, `apps/mobile/src/ui/presence-badge.ts`,
`apps/server/runner/assets/start/start.css.txt`

| Field | Value |
| --- | --- |
| Owner | Shared — upstream owns the sky engine and tokens, AULACBOT owns its palette |
| Upstream behavior | The agents' world is upstream's blue: `#0063d1` accent, `SKY_TONES` from `#0a3f9c` to `#eef7ff`, navy pixel bodies, the boot sky `#0a3f9c` |
| AULACBOT behavior | The same engine and the same components, in Cyber Lạc's jade: accent `#0f6a59` (`#6af2d2` in dark), `SKY_TONES` deep jade to `#e8fcf7`, pixel bodies `#03150f`, the boot/cover splash `#04110d`; the onboarding purpose scene casts gold, jade and mint agents over jade and mint horizons; the desktop cover's agent is the jade prime |
| Why | The product's own identity must not be upstream's blue; the illustration keeps upstream's shapes, casts and motion |
| Commit | `01c1e7a23` |
| ADR | ADR-001 |
| Sync risk | Medium — `SKY_TONES`, `AGENT_GRADIENTS.sky` and `spriteBody` are read by the web, the phone, the desktop cover, the terminal start page and the icon generator |
| If upstream changes | Take upstream's sky engine, casts and scene numbers; re-apply only the tone tables, the accent tokens and the splash colours. Never copy upstream's blue back in |
| Regression test | `bun test packages/ui/test/agent-engine.test.ts packages/ui/test/sky.test.tsx packages/ui/test/computer-portrait.test.tsx apps/web/test/computer-sky.test.tsx packages/tokens/test/tokens.test.ts apps/server/test/runner/start-page.test.ts` |

### AULACBOT-CUSTOM-012 — The agent desktop's look ships the Cyber Lạc wallpaper and mark

**Files:** `apps/server/runner/assets/desktop-mark.png.b64`,
`apps/server/runner/assets/desktop-wallpaper.png.b64`, `apps/server/runner/desktop-look.ts`,
`apps/server/test/runner/desktop-look.test.ts`

| Field | Value |
| --- | --- |
| Owner | Shared — upstream owns the runner and its look; AULACBOT owns the images |
| Upstream behavior | The embedded base64 text was upstream's blue sky wallpaper with an `agentes.chat` wordmark and its navy pixel agent as the dock's mark; the dock's ink was upstream's navy `4, 32, 63` and the keeper's autostart entry said `Name=agentes.chat` |
| AULACBOT behavior | The `.b64` text is regenerated from the committed jade wallpaper and Cyber Lạc mark (`docs/design/desktop/render.sh`), the dock ink is the wallpaper's own jade ink `4, 17, 13` (its hairline follows), and the keeper's entry reads `Name=AULACBOT`; `LOOK_VERSION` is 9 so a desktop that already has the old look is written again |
| Why | These bytes are what an agent's XFCE desktop actually shows: the earlier pass replaced the PNGs but left the embedded base64, so every desktop still painted the blue sky and the old wordmark |
| Commit | `pending` |
| ADR | ADR-001 |
| Sync risk | Low — the two `.b64` files are generated, not hand-edited; only `desktop-look.ts`'s ink constant and the keeper's `Name=` are hand-written |
| If upstream changes | Take upstream's runner code and re-run `render.sh` over the AULACBOT images; never copy upstream's `.png`/`.b64` pair back in |
| Regression test | `bun test apps/server/test/runner/desktop-look.test.ts` (the "images ship as committed" and `LOOK_VERSION` tests) |

### AULACBOT-CUSTOM-013 — The brand is checkable, so a sync cannot flatten it

**Files:** `scripts/brand/{files,check,rebrand,generate-manifest}.ts`,
`scripts/brand/brand.test.ts`, `scripts/brand/manifest.json`, `package.json` (six scripts),
`.github/workflows/ci.yml`

| Field | Value |
| --- | --- |
| Owner | Shared — `scripts/**` and `.github/**` are upstream's; the additions are ours and nothing upstream imports them |
| Upstream behavior | No such check exists. A rebrand is a one-off edit, and the next `git merge upstream/main` can quietly restore upstream's palette, wordmark or generated picture |
| AULACBOT behavior | `check:brand` asserts the Cyber Lạc palette, the `--agent` tokens, Onest, the `AULACBOT` wordmark and the desktop's jade ink. `check:derived` asserts each `.b64` still decodes to its PNG. `rebrand:check` / `rebrand` re-apply `agentes.chat` → `AULACBOT` **only** to the 263 files where that substitution is the entire diff. `brand:drift` names the handcrafted files a merge touched. `brand:manifest` re-records the baseline. Both `generate-manifest` and `rebrand` skip `manifest.json` itself: it stores the word it renames, so hashing or scanning it made the two checks fail forever (fixed 2026-11-21) |
| Why | The identity pass is 726 changed files: 263 are pure renames a machine can redo, but 465 are hand-made, so a blanket search-and-replace would erase the look the owner approved. The `.b64` bug proved the reverse failure too — the picture was rebranded, the bytes the runner imports were not, and every agent desktop kept the old sky |
| Commit | `pending` |
| ADR | ADR-001 |
| Sync risk | Low — nothing here is imported by application code; the steps run in `UPSTREAM_SYNC.md` §5 and in CI |
| If upstream changes | `scripts/` and `.github/workflows/ci.yml` conflicts are resolved by keeping upstream's code and re-adding the `Brand identity` step. After the merge, `rebrand:check` names any file whose class changed; add new paths to `manifest.json` with `brand:manifest <upstream-sha>` |
| Regression test | `bun test scripts/brand` (8 tests), `bun run check:brand`, `bun run rebrand:check`, `bun run brand:drift` |

### AULACBOT-CUSTOM-014 — Product-facing labels and desktop diagnostics

**Files:** `apps/web/index.html`, `apps/server/src/auth.ts`, `apps/desktop/src/i18n/keys.en.ts`,
`apps/desktop/src/i18n/keys.pt-BR.ts`, `apps/desktop/src/i18n/keys.vi.ts`,
`apps/desktop/src/i18n/locales/{de,es,fr,id,it,ja,ko,nl,pl,ru,tr,zh-Hans}.json`,
`apps/desktop/src/host/fake.ts`, `apps/desktop/src-tauri/src/graphics.rs`,
`apps/desktop/src-tauri/src/local_server.rs`, `packages/i18n/src/{en,pt-BR}.ts`,
`packages/i18n/src/locales/*.json`, `packages/i18n/src/help/pages.*.ts`,
`packages/engine/src/email/words/*.ts`, `packages/engine/src/office/*.ts`,
`packages/engine/src/surfaces/turn.ts`, `packages/client/src/lib/import/computer.ts`,
`apps/server/src/surface/app.ts`, `apps/server/runner/migrate/*`,
`apps/server/runner/migrate-script.ts`, `packages/setup/src/lib.ts`, `docs/adr/README.md`

`packages/i18n/src/help/pages.vi.ts` is a file upstream has no counterpart of: the Vietnamese edition
of all 11 help pages, written 2026-11-21 and wired in `packages/i18n/src/help/index.ts`. It is ours,
not a rename, so a sync never restores it — but a new upstream page or section must be carried into
it by hand (`packages/i18n/test/help.test.ts` fails until the shape matches `pages.en.ts`).

| Field | Value |
| --- | --- |
| Owner | Shared — upstream owns the app surfaces; AULACBOT owns the product name |
| Upstream behavior | Auth and desktop product labels, the iOS home-screen shortcut, server erase/reopen prompts and copied desktop diagnostics identify the product as `agentes.chat`; desktop problem reports are sent to upstream's report service |
| AULACBOT behavior | Product-facing labels identify the app as `AULACBOT`; report-recipient labels continue to identify `agentes.chat` where reports are sent upstream. URLs, instance identity, protocol, bundle id and legacy data-folder names remain upstream. Covers help pages, transactional email words (reset and chat-surface mail), Office document metadata, the import prompt, the migrate runner's copy (command text and the copy-paste scripts it serves), the `npx @agenteschat/setup` Jev line, the surface bridge's OpenAPI summary and ADR 0179's summary row |
| Why | AULACBOT's own app surfaces must not present the fork as the upstream product |
| Commit | pending |
| ADR | ADR-001 |
| Sync risk | Medium — web metadata, desktop strings and native diagnostics may be updated by upstream independently |
| If upstream changes | Take upstream behavior and wording, then reapply only AULACBOT's product label; keep the explicit upstream report recipient and infrastructure unchanged |
| Regression test | `bun test apps/web/test/home-screen-icon.test.ts apps/desktop/test/prefs-hints.test.tsx apps/desktop/test/i18n.test.ts apps/desktop/test/help-own-data.test.ts apps/server/test/email.test.ts packages/i18n/test/help.test.ts`; server auth tests; Rust `graphics::tests` |

### AULACBOT-CUSTOM-015 — Updates come from AULACBOT's own releases, never upstream's

**Files:** `apps/desktop/src-tauri/tauri.conf.json`, `apps/desktop/src/control/version.ts`,
`apps/desktop/src/hooks.ts`, `apps/desktop/src-tauri/src/lib.rs`, `apps/desktop/test/version.test.ts`,
`scripts/desktop-channel.ts`, `scripts/desktop-channel.test.ts`, `.github/workflows/desktop.yml`

| Field | Value |
| --- | --- |
| Owner | AULACBOT |
| Upstream behavior | `plugins.updater.endpoints` is `https://app.agentes.chat/api/desktop/update`, and the app's own "new version" check reads the same host |
| AULACBOT behavior | Two paths, both on `github.com/cuong-under/aulacbot` (nothing on `aulac.app`, which does not resolve): the Tauri updater reads `releases/download/desktop-latest/latest.json`, rewritten on every desktop release by `scripts/desktop-channel.ts` into the rolling `desktop-latest` prerelease; the app's own check reads GitHub's REST API (`RELEASES_API`) and accepts a download only when its URL starts with `https://github.com/cuong-under/aulacbot/releases/download/`. `is_app_download` in `lib.rs` adds the same prefix so "Download version" opens the browser |
| Why | With upstream's endpoint an AULACBOT install would download upstream's signed `.app`/`.exe`/`.AppImage` and **replace itself with agentes.chat** — the one sync hazard that destroys the product rather than the branding. The check reads GitHub's REST API and not the release page because a web view gets no CORS header on a release asset; the Rust updater has no such limit, so it can read `latest.json` directly. `desktop-latest` stays a prerelease so `releases/latest` remains the newest real release |
| Commit | pending |
| ADR | ADR-001, ADR 0036 §9 |
| Sync risk | Medium — upstream edits this block whenever the release flow moves; a merge takes upstream's endpoint back |
| If upstream changes | Take upstream's structure and query string, then reapply `cuong-under/aulacbot`. `bun run brand:drift` names the file after a merge; `apps/desktop/test/version.test.ts` fails if the check starts accepting upstream's host or an asset off it |
| Regression test | `bun test apps/desktop/test/version.test.ts` (the "refuses a download off our site" case asserts upstream's own download URL is rejected), `bun test scripts/desktop-channel.test.ts` |

### AULACBOT-CUSTOM-016 — The installer is served from a rolling tag, not `releases/latest`

**Files:** `install.sh`, `packages/setup/src/lib.ts`, `packages/setup/README.md`,
`packages/i18n/src/help/pages.*.ts`, `SELF_HOSTING.md`, `.github/workflows/ci.yml`

| Field | Value |
| --- | --- |
| Owner | AULACBOT |
| Upstream behavior | `https://github.com/agentes-chat/agentes-chat/releases/latest/download/{install.sh,docker-compose.yml}` |
| AULACBOT behavior | The same files under `releases/download/installer-latest/`, a prerelease the `release-install` job rolls on every `v*` tag (it also builds `setup.mjs` there) |
| Why | `releases/latest` follows the newest non-prerelease release, and a `desktop-v*` release carries no installer: the first desktop release would break `curl … \\| sh` for every new self-hoster. A dedicated rolling tag keeps the URL stable whatever else ships |
| Commit | pending |
| ADR | ADR-001 |
| Sync risk | Medium — upstream edits the install URL in 21 files whenever the release flow moves |
| If upstream changes | Reapply `installer-latest` to the same files; `packages/i18n/test/help.test.ts` and `packages/setup/test/lib.test.ts` assert the URL |
| Regression test | `bun test packages/i18n/test/help.test.ts packages/setup/test/lib.test.ts apps/server/test/install.test.ts` |

### AULACBOT-CUSTOM-017 — CI runs on the fork's working branch; two upstream-only workflows are gone

**Files:** `.github/workflows/ci.yml` (deleted: `.github/workflows/cla.yml`, `.github/workflows/release-setup.yml`)

| Field | Value |
| --- | --- |
| Owner | Shared — `.github/**` is upstream's, but these two files act only inside upstream's repository |
| Upstream behavior | `ci.yml` pushes run on `main` only; `cla.yml` asks every contributor to sign `agentes-chat/agentes-chat`'s CLA and records it on a `cla-signatures` branch; `release-setup.yml` publishes `@agenteschat/setup` to npm through upstream's Trusted Publisher |
| AULACBOT behavior | `ci.yml` pushes run on `main` and `develop` (the fork's default branch is `develop`), and the image `build` job is narrowed to `main` and tags. `cla.yml` and `release-setup.yml` are deleted; `CLA.md` and ADR 0180 stay as upstream history |
| Why | On the fork, `develop` was the branch every change went to and CI never ran there — a push showed green because nothing ran. The two workflows cannot work off upstream's repo: the CLA bot writes to a branch this repository does not have, and npm's Trusted Publisher is bound to `agentes-chat/agentes-chat`, so both would fail on every pull request and tag |
| Commit | pending |
| ADR | ADR 0180 (kept as history) |
| Sync risk | Medium — upstream adds jobs to `ci.yml` and may rewrite either deleted file; a merge brings `cla.yml`/`release-setup.yml` back as new files |
| If upstream changes | Keep `branches: [main, develop]` and the `build` job's `github.ref_name == 'main'` guard; delete the two files again if a merge restores them. `git status` after a merge is the check |
| Regression test | `bun -e "require('yaml').parse(require('fs').readFileSync('.github/workflows/ci.yml','utf8'))"` parses; a push to `develop` shows a CI run |

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

