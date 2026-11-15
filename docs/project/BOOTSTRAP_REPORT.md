# Bootstrap Acceptance Report

Date: 2026-11-16
Scope: Project Bootstrap phases 1–7, stopping before any product development.

Every claim below was executed on this machine unless marked otherwise.

## 1. Fork status

Not created. The working copy is a full-history clone of upstream; `origin` is intentionally not
configured because repository owner, name and visibility are owner decisions that were not yet
given. See "Owner actions".

## 2–4. Repository, visibility, remotes

| Field | Value |
| --- | --- |
| Local path | `D:\AulacBot\aulacbot` |
| Remote repository | not created yet |
| Visibility | undecided |
| `upstream` | `https://github.com/agentes-chat/agentes-chat.git` |
| `origin` | not set |

Verified with `git remote -v`.

## 5. Upstream baseline

| Field | Value |
| --- | --- |
| Baseline SHA (local `main`, `develop` parent) | `50ca784dd4c83efbc7ca916a6f07faa8accfe7f6` |
| History | 9050 commits, first commit 2026-10-14 |
| Tags at clone | 22 |
| Current `upstream/main` after fetch | `ba36df842c02bb376337487bf4724026a5caf56e` (+103 commits, +2 tags) |
| Clone depth | full (no `.git/shallow`) |

## 6. Branch structure

| Branch | Commit | State |
| --- | --- | --- |
| `main` | `50ca784dd` | tracks `upstream/main`, behind 103, untouched |
| `develop` | `321ada74f` | bootstrap commit, integration branch |
| `upstream-sync/2026-11-16` | `cd7f99a58` | merge of 103 upstream commits + sync report, validated, **not merged** |

## 7–9. Monorepo, apps and packages

4 apps (`server`, `web`, `desktop`, `mobile`), 11 packages (`engine`, `db`, `adapters`, `providers`,
`config`, `client`, `ui`, `i18n`, `tokens`, `modules`, `setup`), 5875 tracked files, 273 committed
migrations, 185 upstream ADRs. Detail in `docs/architecture/REPOSITORY_STRUCTURE.md`.

## 10. Ownership classification

Done: `docs/upstream/OWNERSHIP_MAP.md` classifies every real path as Upstream, AULACBOT or Shared,
with edit policy and sync risk.

## 11. Customization registry

`docs/upstream/CUSTOMIZATION_REGISTRY.md` holds five entries:

| ID | Subject | Code changed |
| --- | --- | --- |
| 001 | Instance identity via env | no |
| 002 | Attribution must survive syncs | no |
| 003 | Upstream data defaults still on upstream (`TELEMETRY`, `FEEDBACK_RELAY`, `PUSH_RELAY_URL`, `DESKTOP_RELEASES_REPO`) — **open decision** | no |
| 004 | Product identity is hardcoded in 6 server files + Tauri/Expo config — **pending branding** | no |
| 005 | Root `README.md` replaced with AULACBOT's | yes |

Only one upstream file was modified in the whole bootstrap: `README.md`.

## 12–13. Upstream sync and conflict strategy

`docs/upstream/UPSTREAM_SYNC.md` and `CONFLICT_RESOLUTION.md`. The procedure was exercised for real:
103 upstream commits merged on `upstream-sync/2026-11-16` with **zero conflicts**, fully validated,
reported in `docs/upstream/reports/2026-11-16-sync.md`, and left unmerged for review.

## 14. Documentation created

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Rules for AI coding agents |
| `README.md` | AULACBOT front page (replaces upstream's) |
| `docs/README.md` | Documentation index |
| `docs/project/PROJECT_OVERVIEW.md` | Identity, goals, constraints |
| `docs/project/UPSTREAM_ATTRIBUTION_AND_LICENSE.md` | License, §7(b) attribution, trademarks, commercial option, third-party licenses |
| `docs/project/DEVELOPMENT_GOVERNANCE.md` | Roles, decision authority, change classes, required checks |
| `docs/project/BOOTSTRAP_REPORT.md` | This report |
| `docs/architecture/REPOSITORY_STRUCTURE.md` | Audited layout |
| `docs/architecture/MONOREPO_ARCHITECTURE.md` | Workspaces, topology, layering, extension points |
| `docs/development/DEVELOPMENT_SETUP.md` | Windows setup + verified results |
| `docs/development/ENVIRONMENT_VARIABLES.md` | Required and AULACBOT-relevant env vars |
| `docs/decisions/ADR-001-INITIAL-ARCHITECTURE.md` | Fork-by-history decision |
| `docs/decisions/ADR-002-UPSTREAM-SYNCHRONIZATION.md` | Sync process decision |
| `docs/upstream/UPSTREAM_BASELINE.md` | SHAs, tags, branches, remotes |
| `docs/upstream/OWNERSHIP_MAP.md` | Three-class ownership |
| `docs/upstream/UPSTREAM_SYNC.md` | Sync procedure |
| `docs/upstream/CONFLICT_RESOLUTION.md` | Conflict rules |
| `docs/upstream/CUSTOMIZATION_REGISTRY.md` | Customization log |
| `docs/upstream/SYNC_HISTORY.md` | Sync log |
| `docs/upstream/reports/TEMPLATE.md` | Impact report template |
| `docs/upstream/reports/2026-11-16-sync.md` | First sync impact report |

## 15. Files modified

`README.md` only. No upstream source file, config file, lockfile or legal file was changed.

## 16. Dependencies

Installed, not changed. `bun.lock` hash identical before and after
(`C7CAE905B56A9ECEF202250C344E65677E6B4CB04F8B99A89DCE0C33E9F6A60A`).

## 17. Build

| Target | Result |
| --- | --- |
| `@agenteschat/web` | pass, exit 0 |
| `@agenteschat/server` | pass, exit 0, 39.37 MB bundle |
| Desktop (Tauri) | not built — needs a Rust release build; `cargo` is present |
| Mobile | not built — no Android SDK / EAS credentials; explicitly out of scope this phase |

## 18. Tests

| Suite | Result |
| --- | --- |
| Backend (`--parallel`, CI split) | 4165 pass, 520 skip, 330 fail of 5015 (baseline); 4214 pass, 522 skip, 334 fail of 5070 (after sync) — **same failing file set** |
| Web/UI (`--parallel=9`) | 4645 pass, 182 fail before stalling in `live-real-server.test.tsx`; that file alone 16 pass / 0 fail |
| Guard scripts | `check-boundaries` 12 tests pass; scripts themselves: boundaries ok, licenses ok (1027 packages), migrations ok |

Failures are environment-caused and enumerated in `docs/development/DEVELOPMENT_SETUP.md`:
hardcoded POSIX paths in runner tests, Unix ownership checks, `new URL(...).pathname` on Windows, and
`deploy/*` tests that need `bash`. None is caused by AULACBOT.

## 19. Windows status

Two blocking issues found and solved, both documented:

1. `core.autocrlf=true` (Git for Windows default) forced CRLF and made Biome fail on every
   `package.json`/`tsconfig.json`. Fixed per-repository with `core.autocrlf=false` + `core.eol=lf` +
   a re-checkout.
2. Isolated linking produced a 262-character path for `react-native`, past the 260-character
   `MAX_PATH`, so `bun install` failed. Worked around with `--linker=hoisted`; `bunfig.toml` and
   `bun.lock` untouched.

Docker is not installed, `psql` is not on PATH, WSL is inaccessible from the sandbox. None blocks
local development: the server runs on the built-in PGlite database.

## 20. Mobile audit

Source exists (`apps/mobile`, Expo SDK 58 / RN 0.88, `app.config.ts`, `eas.json`, 1149 files).
It typechecks. **No APK, no store listing, no published build.** Bundle ids are still
`chat.agentes.app*` and the scheme is `agenteschat`.

## 21. License and attribution

`AGPL-3.0-only` with the `NOTICE` §7(b) attribution term and `TRADEMARKS.md`. Legal files untouched.
Attribution still renders from `apps/web/src/components/AboutSettings.tsx`. A deployment must set
`SOURCE_URL` to AULACBOT's own repository (verified: the running server returned AULACBOT's URL from
`GET /api/instance`).

## 22. Unresolved items

1. No `origin`, so nothing is pushed anywhere.
2. The first sync branch awaits review before merging into `develop`.
3. Upstream data defaults still point at agentes.chat (`TELEMETRY`, `FEEDBACK_RELAY`,
   `PUSH_RELAY_URL`, `DESKTOP_RELEASES_REPO`) — deployment-time decision.
4. Product name is hardcoded (`z.literal("agentes.chat")`) — branding phase.
5. `main` is 103 commits behind `upstream/main` by design.

## 23. Owner actions

1. Decide the GitHub account/organisation and visibility.
2. Decide the fork strategy (official GitHub fork vs. independent repository).
3. Decide the license path (AGPL-only vs. commercial contract with Codari Global, LLC).
4. Decide the branding scope and whether identity work starts now.
5. Restore GitHub CLI authentication (`gh auth login -h github.com`) — the stored token is invalid.
6. Review and merge `upstream-sync/2026-11-16` into `develop` when satisfied.

