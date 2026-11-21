# Cyber Lạc — where it goes in the repo

Audit for the identity pass approved in `docs/project/PROJECT_OVERVIEW.md` (logo, app icons and
product metadata only, no layout changes). **Applied on 2026-11-17:** the six `SAFE` files in §1
(back-ups in `outputs/brand-v4/backup-cyber-lac-20261117-033325`), the icon generator in §2, and
the code-coupled surfaces in §3 — in-app logo, favicon, metadata, desktop tray and product name,
phone name and notification colour. What is deliberately still upstream is listed at the end of §3.

Legend:

| Tag | Meaning |
| --- | --- |
| **SAFE** | An asset-only swap: no code change, no generator rewrites it |
| **GEN** | Written by a generator or build script; a raw copy is undone on the next run |
| **CODE** | The behaviour or text lives in code; an asset swap alone is not enough |
| **KEEP** | Deliberately left alone |

## 1. Safe asset swaps

These six files were replaced on 2026-11-17 with a back-up; nothing in the build regenerates them.

| From the kit | To the repo | Why |
| --- | --- | --- |
| `assets/cyber-lac-og-1200x630.png` | `apps/web/public/og.png` | `og:image` and `twitter:image`; 1200 × 630 |
| `assets/email/logo-ink.png` | `apps/web/public/email/logo-ink.png` | 346 × 72; the fallback for already-sent emails |
| `assets/email/logo-bone.png` | `apps/web/public/email/logo-bone.png` | 346 × 72; dark mail clients |
| `assets/email/logo-ink-tile.png` | `apps/web/public/email/logo-ink-tile.png` | 346 × 72; the current header (`packages/engine/src/email/layout.ts:115,484`) |
| `assets/email/mark.png` | `apps/web/public/email/mark.png` | 104 × 104; the push icon (`apps/web/public/sw.js:7`) |
| `assets/cyber-lac-notification-96.png` | `apps/mobile/assets/images/notification-icon.png` | 96 × 96; `expo-notifications` (`apps/mobile/app.config.ts:215`) |

Companion text in these surfaces, all done on 2026-11-17:

- `apps/web/index.html:20` — `og:image:alt` names Cyber Lạc.
- `apps/web/public/sw.js` — header note and default notification title `"AULACBOT"`.
- `packages/engine/src/email/layout.ts:122` — `LOGO.alt` is `"AULACBOT"`; the email snapshot was
  regenerated with it (108 `alt` replacements, same markup and classes).

## 2. Generator-owned icons — the app icon now comes from here

These are the places the board's "CHƯA GHI ĐÈ ICON APP" note referred to. A direct copy works until
the next generator run, and some files are not committed at all.

| Owner | Writes | Notes |
| --- | --- | --- |
| `packages/ui/scripts/app-icons.mjs` | `apps/web/public/favicon.ico`, `apple-touch-icon.png`, `icon-512.png`, `app-icons/<id>.ico/.png`, `app-icons/night-sky.png`; `apps/mobile/assets/app-icons/<id>/*`, `assets/images/splash-icon.png`; `app-icons/made/*` | The first id in `APP_ICON_IDS` is the shipped icon, and its rounded picture is the splash |
| `packages/ui/scripts/favicon.mjs` | `apps/web/public/favicon.svg` | Drawn from `packages/ui/src/agent/engine.js` |
| `apps/desktop/scripts/icons.ts` | `apps/desktop/app-icon.png`, `src-tauri/icons/app/<id>.png`, `<id>-tile.png`, `src-tauri/icons/tray/*.png` | Runs before `tauri icon` and `cargo test`; all outputs are git-ignored |
| `apps/mobile/plugins/with-app-icons.js` | iOS alternate icon sets and Android `activity-alias` resources at prebuild | Reads the same ids and file names |

The ids live in four lists that tests keep equal. **Decided 2026-11-17: `lac` first.** The Cyber Lạc
scene is `packages/ui/scripts/app-icons/cyber-lac.mjs` (a `Scene` of mask/color layers in the
generator's own format): the bird's head alone, front on and with no neck — a mint block with the
crest's three fins, a dark visor with the two white pill eyes and the gold bill — filled with the
engine's Bayer dither on a 32-cell grid over a jade sky, and no instrument tile, so every size reads
like the original icons. It also exposes `android()`, which shrinks the bird into Android's 72 dp
safe zone so a round launcher mask never cuts the crest; `app-icons.mjs` uses it for the three
Android layers.

- `packages/client/src/lib/app-icons.ts:8` — `APP_ICONS = ["lac", "night", "moon", "sky", "peekNight", "peekSky"]`
- `packages/ui/scripts/app-icons/scenes.mjs` — `APP_ICON_IDS`, `SCENES`
- `packages/ui/scripts/app-icons/scenes.d.mts` — the declaration's `AppIconId` and `Scene`
- `apps/mobile/plugins/with-app-icons.js:25` — `ICONS`
- `apps/desktop/src-tauri/src/app_icon.rs:35` — `ICONS`

Generated from it (all committed except the desktop's, which is git-ignored):

- `apps/mobile/assets/app-icons/lac/` — `ios`, `ios-dark`, `ios-tinted`, `android-foreground`,
  `android-background`, `android-monochrome`, `preview`, `preview-dark`
- `apps/mobile/assets/app-icons/night/android-legacy.png` — Night is no longer the shipped icon, so
  Android 7 needs its own 192 px file
- `apps/web/public/favicon.ico`, `apple-touch-icon.png`, `icon-512.png` — the shipped icon
- `apps/web/public/app-icons/lac.ico` and `lac.png` — the picker's favicon and picture
- `apps/desktop/app-icon.png`, `src-tauri/icons/app/lac.png`, `lac-tile.png` — written by
  `apps/desktop/scripts/icons.ts` before `tauri icon`

`app-icons/night-sky.png` deliberately stays the **Night** sky, whichever id ships: the web draws a
workspace's agent over it (`apps/web/src/lib/agent-app-icon.ts`), and that agent is the pixel engine
one, not the Lạc mark.

The phone's icon paths (`apps/mobile/app.config.ts:110,117-121,135-139`) now point at `lac`, with
`backgroundColor: "#04110D"`; the picker pictures are in
`apps/mobile/src/features/me/app-icon.ts`, and the name label `Cyber Lạc` is in the shared i18n
(`appIcon.names.lac`, identical in every language).

## 3. Code-coupled brand surfaces

### In-app logo and wordmark

Done on 2026-11-17, flat SVG rather than the dithered scene (it has to stay crisp at 16 px and needs
no engine import):

| File | Now |
| --- | --- |
| `packages/ui/src/components/Logo.tsx` | No engine import, no dither URL: a flat Cyber Lạc head (jade tile `rx 8`, mint head, three crest fins, visor, two eyes, gold bill, deep bill, seam), `NAME = "AULACBOT"`, `TLD = ".app"`, aria labels updated |
| `packages/ui/src/styles/components.css` (`.ac-logo`) | Onest 700, `letter-spacing: 0.05em`, gap `0.22em`, mark `1.2em`; new `.ac-logo__tile/head/crest-mint/crest-gold/bill/bill-deep/seam/visor`; the mono variant cuts the bird out of an ink tile |
| `apps/mobile/src/ui/LogoMark.tsx` | The same head in `react-native-svg` (`Rect`/`Path`/`Polygon`) |
| `packages/ui/scripts/favicon.mjs` | Emits the same flat head; `apps/web/public/favicon.svg` is now Cyber Lạc |
| Consumers (`OrgAvatar`, `ImportAgents`, `ProfilePhoto`, `NotMember`, `Work`, `desktop/src/ui/bits.tsx`) | Unchanged; sizes were re-checked at 16, 24, 48 and 96 px |

The command-line logo, done on 2026-11-17 — a dedicated 12 × 12 Cyber Lạc glyph rather than the
agent, so an install greets people with the same bird as the icon:

- `packages/setup/src/term.ts` — `LOGO_MARK` (the head front on: mint crest tips, gold middle fin,
  mint head, jade visor with the two eyes, gold bill), the `aulacbot` pixel alphabet, and the jade
  palette in 24-bit, 256 and 16 colors; `logoLines` sets `AULACBOT` beside it with `.app` muted
- `packages/setup/src/term-sh.ts` — the shell's copy, escape for escape; the logo shows from 67 columns
- `packages/ui/test/logo-mark.test.ts` — the grid's shape, its symmetry, its parts top to bottom, and
  that both the web's `LogoMark` and the terminal keep the crest, head, visor, two eyes and bill. It
  renders the SVG in happy-dom (`setupDom` from `packages/ui/testing/dom`), so it checks the element
  tree and its names, not the component's return value

The accent (`#0F7A66`, 5.3:1 on white) and the badge's deep jade (`#0F6A59`, 6.5:1 with white text)
replace the agent blue everywhere the terminal draws them.

### Web metadata and boot

| File / line | Now |
| --- | --- |
| `apps/web/index.html` | `<title>` and `og:site_name` are `AULACBOT`; `og:image:alt` names Cyber Lạc; `/favicon.ico`, `/apple-touch-icon.png`, `/icon-512.png` come from the generator |
| `apps/web/index.html` (boot) | `<img src="/favicon.svg">`, now the flat Cyber Lạc head |
| `apps/web/public/sw.js` | Push icon **SAFE**; default notification title and header note `AULACBOT` |
| `apps/web/src/lib/import-flow.ts:19` | `/favicon.svg`, unchanged path, new content |
| `apps/web/index.html:31,42,81-84,117,131` | **KEEP** — localStorage keys and `window.__agentesDesktop` are protocol, not copy |
| `apps/web/test/i18n-locale.test.ts`, `packages/i18n/src/{en,pt-BR}.ts`, the 12 locale JSONs | `app.name` and the `tabTitle` prefix are `AULACBOT` |

### Phone metadata and icon

`apps/mobile/app.config.ts`:

| Line | Now |
| --- | --- |
| 102-104 | `name: "AULACBOT"` (`AULACBOT <variant>` off production); **KEEP** `slug: "agentes"`, `scheme: "agenteschat"` and the bundle ids — they are link and install identity |
| 110, 117-121 | Shipped id `lac`: iOS light/dark/tinted from `.../lac/*` |
| 135-139 | Android adaptive layers from `.../lac/*`, `backgroundColor: "#04110D"` |
| 201-205 | Splash image written by the generator from the shipped icon; backgrounds unchanged |
| 215-216 | Notification icon **SAFE**; `color: "#2FD3B2"` (mint) |
| 251 | `iosShareExtensionName` is `AULACBOT` |

Also: `apps/mobile/src/features/me/app-icon-names.ts`, `apps/mobile/src/features/me/app-icon.ts`,
`apps/web/src/lib/app-icon.ts:52`, `packages/client/src/lib/app-icons.ts:8,13` and
`apps/desktop/src-tauri/src/app_icon.rs:35` all follow the id decision in §2.

### Desktop metadata, tray and icons

| File | Now |
| --- | --- |
| `apps/desktop/src-tauri/tauri.conf.json` | `productName` and `shortDescription` `AULACBOT`; the three window titles `AULACBOT`; the updater endpoint `https://aulac.app/api/desktop/update` (CUSTOM-015 — upstream's endpoint would install agentes.chat over AULACBOT); identifier, scheme and copyright **KEEP** |
| `apps/desktop/src-tauri/Cargo.toml`, `src/main.rs` | Package `aulacbot-desktop`, lib `aulacbot_desktop_lib`, so the process and About name match |
| `apps/desktop/scripts/icons.ts` | The master and the seven tray templates come from Cyber Lạc: the head plus crest as one silhouette, the visor a slot, the eyes the only solid part (paused = dashes, working = shifted right), offline dimmed, update/browsing/needs badges beside the head |
| `apps/desktop/src-tauri/src/{main_window,cover,tray,notch,menus,local_server,lib,servers}.rs` | Window titles, cover details, tray tooltips, `window_title`, `window_details`, `.env` header, capability warning and the Cloud name are `AULACBOT`; URLs and the About attribution are **KEEP** |
| `apps/web/src/components/install/guide.tsx` | The Mac quarantine fix names `/Applications/AULACBOT.app`, the product name the bundle uses; the release asset file names stay upstream's (`agentes_*`) until the desktop CI renames them |
| `apps/desktop/cover.html`, `src/cover/cover.css` | Wordmark `AULACBOT` + `.app`, Onest 700 at `0.05em`, matching the in-app lockup |
| `apps/desktop/src/i18n/keys.{en,pt-BR}.ts` and `src/i18n/locales/*` | Every prose reference is `AULACBOT`; "agentes.chat Cloud" became `AULACBOT Cloud`; the update download sentence names the product |
| `apps/desktop/src-tauri/installer/installer.nsi` | Tauri substitutes `{{product_name}}` and `{{main_binary_name}}`, so the installer picks up `AULACBOT`; the `; agentes.chat:` markers are comments and stay |

The desktop's `app-icon.png` and `src-tauri/icons/` are git-ignored: run
`bun apps/desktop/scripts/icons.ts` before `tauri icon app-icon.png`. The desktop kit mirrors the
generated pixel Cyber Lạc master, Dock/window sizes, installer icon and tray templates; the detailed
vector mark remains a separate store, print and social asset.

### Old brand kit and docs

- The earlier "Lạc bird as A" kit moved to `docs/branding/legacy/` (generator, board script, PNGs and
  its own README kept for history); `docs/branding/README.md` is now an index that points here.
- `README.md:5` embeds this kit's OG card.
- `docs/project/PROJECT_OVERVIEW.md` Identity row describes Cyber Lạc.
- `docs/design/icons/logo-mark*.svg` are upstream's blue agent marks; leave them for upstream sync
  unless a doc page shows them as AULACBOT's logo.

### Deliberately still upstream

- The server software a workspace runs still announces `agentes.chat` in `GET /api/instance`, and
  `packages/client/src/lib/server.ts` accepts only that name: the app is a client of those servers
  until the fork ships its own server identity.
- **Kept as protocol or as honest references**, after the copy pass of 2026-11-17: `https://agentes.chat/*`
  URLs (installer, docs, plans, billing, feedback relay, push relay, telemetry, telemetry inbox), the
  `agenteschat://` scheme and `chat.agentes.*` bundle ids, `agentes.chat.app` deep-link paths,
  `AGENTES_*` env names, the `agenteschat` import source key, `@agentes.chat` addresses (email CIDs,
  `noreply@`, `ping@`, `help@`, `legal@`, `privacy@`), `~/.agentes` folders, `git/signature.ts`'s
  `SIGNATURE_MARK`, user-agent strings and host checks (`sky/workspace.ts`, `server.ts`,
  `HostingScene`'s cloud check), and the About line `Based on agentes.chat by Codari Global, LLC`.
- The terminal `LOGO_MARK` (`packages/setup/src/term.ts`, `term-sh.ts`) is the 12 × 12 Cyber Lạc bird
  since 2026-11-17; it is the one place the mark is drawn by hand for half-blocks, not from the icon scene.
- The setup installer's own output (`packages/setup/src/{cli,lib,term,term-sh}.ts`) is `AULACBOT` prose
  as of 2026-11-17: terminal output and README. Only what must stay upstream does: `INSTALL_URL`
  (and the `IMAGE` it pulls) plus the Tailscale hostname, because the installer it downloads is still
  upstream's.

## 4. Tests and snapshots

Update with the code, not after it:

- `packages/ui/test/logo-mark.test.ts` — the 12 × 12 grid, its symmetry, and both marks
- `packages/ui/test/app-icons.test.ts` — first id, generated files, favicon sizes
- `apps/mobile/test/app-icons.test.ts` — ids, plugin lists, iOS/Android sets
- `apps/web/test/app-icon.test.ts:21-44` — `faviconOf("lac") === "/favicon.ico"`, and Night now has
  its own `/app-icons/night.ico`
- `apps/mobile/test/app-icons.test.ts` — the alias list gains `.AppIconLac` second, and the made
  icons' indices shift by one
- `apps/web/test/import-flow.test.tsx:209,225` — `/favicon.svg`
- `apps/web/test/boot-fallback.test.ts:137` — `/favicon.svg`
- `packages/engine/test/__snapshots__/email.test.ts.snap` — logo paths, `alt="agentes.chat"`, dark-mode
  classes

## 5. Keep untouched

- `packages/ui/src/agent/engine.js` and the agent avatar/personalization art. The pixel agent is the
  product's *agent* identity (faces, colours, accessories), not the AULACBOT brand; ADR 0179 depends
  on it.
- `packages/ui/scripts/app-icons/scenes.mjs` icons `moon`, `sky`, `peekNight`, `peekSky`, and every
  `made-*` icon.
- `apps/web/public/brands/*` (third-party provider logos).
- `NOTICE`, `TRADEMARKS.md`, `COMMERCIAL.md`, `CLA.md`, and the About screen's upstream attribution.
- Bundle identifiers, deep-link scheme, package names and localStorage keys until a separate product
  decision.

## 6. Done, and what is next

1. `lac` first in the four id lists, generator and committed phone/web icons, tests — done.
2. The seven **SAFE** files, OG alt, service-worker title, email alt and snapshot — done.
3. `Logo`/`LogoMark` on web, phone and desktop, `.ac-logo` for the uppercase wordmark, sizes checked
   at 16/24/48/96 px — done.
4. Desktop tray and master from Cyber Lạc in `apps/desktop/scripts/icons.ts`; run it before
   `tauri icon app-icon.png` — done.
5. Desktop and phone product metadata — done; upstream attribution still visible in About.
6. Verify — done. On 2026-11-17: `bun run typecheck` (12 packages, 0 errors), `bun run lint` (exit
   0; 19 warnings and 3 infos, all "file size > 1 MiB" in `packages/i18n/src/locales/*.json`),
   `bun run check:boundaries` (ok), the icon suites (18 tests) and
   `bun test packages/setup/test/term.test.ts packages/ui/test/logo-mark.test.ts` (42 tests). On
   2026-11-18, with registry access and the two sidecars stubbed into `src-tauri/binaries/` (both
   git-ignored, removed again afterwards): `cargo check --no-default-features --bin
   aulacbot-desktop` finished with one dead-code warning in `menus.rs`, and `cargo test
   --no-default-features --bin aulacbot-desktop` passed. The terminal suite needs `sh` on `PATH`;
   on this machine that is `C:\Program Files\Git\usr\bin`, and without it three tests fail with
   `undefined` rather than a real defect.

7. The web and phone copy pass — done on 2026-11-17: `packages/i18n/src/{en,pt-BR}.ts`, the 12 shared
   locale `.json`/`.source.json` pairs, the 14 help pages, the 14 email and 14 push word files, the
   phone's own `apps/mobile/src/{i18n,features/i18n}` keys and locale files, and the prose in
   `apps/web/src`, `apps/mobile/src`, `apps/desktop/src`, `packages/engine/src`, `packages/client/src`
   and `packages/ui/src`. In all, 337 files under `apps/` and `packages/` now carry `AULACBOT` (7,901
   occurrences, tests included); every `https://agentes.chat/*` URL, attribution and protocol constant
   kept (see "Deliberately still upstream").
8. The setup installer's prose pass — done on 2026-11-17: `packages/setup` (`cli`, `lib`, `term`,
   `term-sh`, README, `package.json` description) now says `AULACBOT`, with `INSTALL_URL`, `IMAGE`,
   the Tailscale hostname and `TERM_SH`'s copy in `install.sh` kept in step (tests included).
9. The stragglers the first copy pass left in the shared dictionary — done on 2026-11-17: the
   "agentes app" lines (`auth.desktop.doneLead`, `openOnPhone.qr`, `openOnPhone.stepApp`,
   `auth.server.appTooOld`), the app's own name in menus and toasts (`agentPage.work.steps.menuOpen`,
   `agentPage.access.builtin` and its `_female` twin, `routines.event.issue.created`,
   `aiAccounts.connect.needs.keys`, `agentComputer.state.outdated` and its `_female` twin,
   `taskManager.program.agentes`, `mail.step.2`), and the "go to the app" links (`connect.home`,
   `apps.consent.goHome`, `linkErrors.action.open`). `apps/mobile`'s copy of `auth.server.appTooOld`
   moved with them. The product's own name is now `AULACBOT` everywhere it is *the product*,
   including `agent.builtinName` and `taskManager.program.agentes`, in all 13 translated files.
   What still says `agentes` on purpose is only what an identifier, not a name: `agentes.example.com`,
   `agentes-chat ({{version}})` in the install scene, the `agentes/{agent}/…` branch prefix,
   `X-Agentes-Signature`, the `agentes_leitura` database user, the `agentes/` storage prefix, the
   `agentes-…` Wi-Fi SSID, `.agentes/mission.md`, `/mcp` server names, `@agenteschat/ui`, and the
   About credit `agentes.chat by Codari Global, LLC`.

## 7. Open decisions

| # | Decision | Recommendation |
| --- | --- | --- |
| 1 | Shipped icon: repaint `night` or add `lac` | **Settled:** `lac` first; the four agent icons stay as choices |
| 2 | In-app wordmark: `AULACBOT` caps or `Âu Lạc Bot` display | **Settled:** `AULACBOT` caps, Onest 700, `+0.05em`; the display name is prose only |
| 3 | Terminal logo | **Settled (2026-11-17):** a 12 × 12 Cyber Lạc head, jade palette, `AULACBOT` beside it |
| 4 | Desktop tray | **Settled:** the seven states are drawn from Cyber Lạc |
| 5 | Product metadata | **Settled for names:** `AULACBOT`; slug, scheme and bundle ids stay until a release decision |
| 6 | Web UI copy in 12 languages | **Settled:** the product names itself `AULACBOT` in prose in all 14 languages; URLs, plans, billing and the About attribution stay truthful to upstream |
