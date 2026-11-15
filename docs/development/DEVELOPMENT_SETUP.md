# Development Setup (Windows 11)

Everything here was verified on this machine unless marked otherwise.

## Verified environment

| Tool | Version found | Notes |
| --- | --- | --- |
| Windows | 11 | Primary development OS |
| Bun | 1.4.4 | Matches upstream `packageManager` |
| Node | 24.22.1 | Only needed by tooling that shells out to `node` |
| Git | 2.55.0.windows.3 | `core.autocrlf=true` system-wide — see below |
| Rust / cargo | installed | Required only to build the Tauri desktop app |
| Docker | **not installed** | Blocks `docker compose` and the containerised server |
| PostgreSQL client (`psql`) | **not on PATH** | The built-in PGlite path works without it |
| GitHub CLI | 2.102.0 | Authentication is currently **invalid** — see "Waiting on you" |

## 1. Clone (already done here)

The working copy is `D:\AulacBot\aulacbot`, cloned from
`https://github.com/agentes-chat/agentes-chat.git` with full history (9050 commits, 22 tags,
42 remote branches). `origin` was renamed to `upstream`; a local `develop` branch exists.

## 2. Line endings — required, or every check fails

Git for Windows installs with `core.autocrlf=true`, which converts every checkout to CRLF. Upstream
is LF-only, and Biome then reports a formatting error in every `package.json` and `tsconfig.json`
("Formatter would have printed the following content", showing a stray `␍`). Worse,
`.gitattributes` forces LF for `packages/db/migrations/*.sql` because migrations are identified by
the sha256 of their file content — a CRLF checkout would make a build's migration hashes differ from
every other build's.

Set it once, per repository:

```powershell
cd D:\AulacBot\aulacbot
git config core.autocrlf false
git config core.eol lf
git checkout-index -a -f     # rewrite the working tree with LF
```

`git status` must stay empty afterwards. Verified: `package.json` had 55 CR bytes before, 0 after.

## 3. Install dependencies — needs `--linker=hoisted` on Windows

Upstream's `bunfig.toml` uses `linker = "isolated"`. With isolated linking, some `react-native`
files land at 262 characters, past the 260-character Windows `MAX_PATH` limit, so the install fails:

```
ENOENT: No such file or directory: failed to link package: react-native@0.88.0 (copyfile)
```

`LongPathsEnabled` is `0` on this machine and enabling it is a machine-wide change requiring
administrator rights, so use the hoisted linker instead:

```powershell
bun install --frozen-lockfile --linker=hoisted
```

This is a local workaround only. It does **not** modify `bunfig.toml` or `bun.lock` — both stay
upstream's. Result: 987 packages installed.

Alternative, if you prefer the upstream linker: enable long paths machine-wide (admin) with
`New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name LongPathsEnabled
-Value 1 -PropertyType DWord -Force`, then re-run a plain `bun install --frozen-lockfile`.

## 4. Configuration

```powershell
Copy-Item .env.example .env
```

Required in `.env` before the server starts:

| Variable | What to put |
| --- | --- |
| `DATABASE_URL` | `postgres://…` for a real PostgreSQL 15+ with `vector`, **or** `pglite:///<folder>` for the built-in database (one process, no Docker) |
| `AGENTES_SECRET` | `openssl rand -base64 48` (or any 48-byte base64 secret) — changing it later makes stored provider keys unreadable |
| `SOURCE_URL` | AULACBOT's public source URL, required by AGPL §13 once you deploy a modified server |

Never commit `.env`. `.env.example` is generated from `packages/config/src/schema.ts` by
`bun run docs:env` — do not hand-edit it.

Without Docker, the fastest local path is PGlite:

```
DATABASE_URL=pglite:///./.data/pglite
```

## 5. Run

```powershell
bun run dev      # server :3000 (watch) + web :5173
```

Open http://localhost:5173. The first account to sign up owns the installation unless
`OWNER_CLAIM_SHA256` or `ALLOW_SIGNUP` says otherwise.

## 6. Checks

```powershell
bun run typecheck        # bun run --filter '*' typecheck
bun run lint             # biome check .
bun run check:boundaries # no ee/ import, no private paths, no internal notes
bun run check:licenses
bun test                 # bun test (PGlite in memory, no Docker, no network)
```

`bun test` is long on Windows — one full run took over an hour here. While iterating, run one file:

```powershell
bun test apps/server/test/channel-permissions.test.ts
```

### How CI actually runs the suite (and why you should copy it)

Upstream's CI splits the suite in two jobs, and they must not be mixed:

- **Backend** — `bun test --parallel <paths>` over `packages/*` and `apps/server`.
- **Web/design system/phone/desktop** — `bun test --parallel="<75% of cores>" apps/web packages/ui`.

Running everything in a single `bun test` process makes DOM tests fail in bulk on this machine:
`members-column.test.tsx` reported 28 failures inside a combined run and **29 passes, 0 failures**
when run alone; `mcp.test.ts` reported 328 failures combined and **26 passes, 0 failures** alone.
The CI comment states the reason — a first PGlite database after DOM files can fail to come up, and a
React update left over from a DOM file can land after its DOM is detached. Use the two-job split.

### Verified results on this machine

| Check | Command | Result |
| --- | --- | --- |
| Install | `bun install --frozen-lockfile --linker=hoisted` | 987 packages, lockfile unchanged |
| Typecheck | `bun run typecheck` | **15/15 workspaces, exit 0** |
| Lint | `bun run lint` | 4755 files checked, 0 errors, 19 warnings (i18n locale files exceed Biome's 1 MiB size limit — upstream config) |
| Boundaries | `bun run check:boundaries` | `boundaries ok` |
| Licenses | `bun run check:licenses` | `licenses ok (1027 packages)` |
| Migrations | `bun run check:migrations` | `migrations ok` |
| Build | `bun run build` | web + server, both exit 0 |
| Server boot | `bun run --filter '@agenteschat/server' start` with PGlite | migrations applied, `listening on :3000` |
| HTTP | `GET /api/health` | `{"status":"ok","version":"0.1.1","database":"ok"}` |
| HTTP | `GET /api/instance` | answered, `sourceUrl` reflected AULACBOT's `SOURCE_URL` |
| Backend tests | `bun test --parallel <backend paths>` | 4165 pass, 520 skip, 330 fail, 5015 tests — see below |
| Runner tests | `bun test apps/server/test/runner` | 634 pass, 287 fail, 1440 tests |
| Web tests | `bun test --parallel=9 apps/web packages/ui` | 4645 pass / 182 fail before the run stalled in `live-real-server.test.tsx`; that file alone: 16 pass, 0 fail |

### Windows-specific test failures (not code defects)

Three separate causes, all reproduced and identified:

1. **POSIX paths hardcoded in tests.** `apps/server/test/runner/phones.test.ts:1393` sets
   `workspaceReal: "/tmp"`, which `agentWorkspace` then compares against a real Windows path
   (`apps/server/runner/paths.ts:363` throws `outside_workspace`). 99 occurrences in the runner suite.
2. **Unix ownership checks.** `apps/server/runner` refuses a runner home whose `uid` is not the
   process owner or whose mode is group/world-writable — Windows has neither. 42 occurrences of
   `The runner home is not owned securely`.
3. **`new URL(..., import.meta.url).pathname`** yields `/D:/AulacBot/...` on Windows, so file-reading
   CSS/geometry tests hit `ENOENT`. 27 occurrences in the first full run.

Also failing and unrelated to Windows: `deploy/deploy.test.ts` and `deploy/backup/backup.sh` tests
require `bash` and a Linux host.

None of these are caused by AULACBOT — the working tree has no modifications to upstream source.

## 7. Desktop (optional)

```powershell
cd apps\desktop
bun run tauri dev
```

Needs WebView2 (ships with current Windows 11) and the Rust toolchain. The first build compiles the
Rust side and downloads the bundled `agentes-runner` / `agent-browser` binaries.

## 8. Mobile (optional)

```powershell
cd apps\mobile
bun run start     # expo start --dev-client
```

Native projects are generated by `expo prebuild` and are not committed. Building an APK requires the
Android SDK and, for the store profiles, EAS credentials — neither is configured here. Do not treat
"source exists" as "an app is published".

## Known Windows limitations

- **Long paths**: see step 3. Without the hoisted linker or long-path support, `react-native` cannot
  be linked.
- **`deploy/deploy.sh` and `deploy/backup/backup.sh` tests fail here**: they require `bash` and are
  written for Linux hosts. This is an environment limitation, not a code defect.
- **Some upstream tests read files through `new URL(..., import.meta.url).pathname`**, which yields
  `/D:/AulacBot/...` on Windows and produces `ENOENT`. Those tests fail on Windows only.
- **WSL** is not accessible from this sandbox (`Access is denied`), so no Linux-side validation was
  possible.

## Waiting on you

`gh auth status` reports the stored token for `cuong-under` is invalid. Creating or pushing the
AULACBOT repository needs a working GitHub session:

```powershell
gh auth login -h github.com
```

