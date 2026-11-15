# Upstream Baseline

## Repository identity (verified by `git ls-remote`)

| Field | Value |
| --- | --- |
| URL | `https://github.com/agentes-chat/agentes-chat.git` |
| Owner | Codari Global, LLC (`agentes-chat`) |
| Default branch | `main` (`refs/heads/main` — confirmed via `git ls-remote --symref ... HEAD`) |
| Baseline commit | `50ca784dd4c83efbc7ca916a6f07faa8accfe7f6` |
| Baseline date | 2026-11-15 |
| Baseline subject | `Merge pull request #574 from agentes-chat/fix/device-who-people` |
| Total commits in history | 9050 |
| First commit | `fb0e8f43be22305818f3315090738c969c5ba7bb` (2026-10-14) — *Initial commit: backend slice, design system and planning* |
| Tags | 22 |
| Remote branches at clone time | 42 |
| Clone depth | full history (no `.git/shallow`) |

`main` is not assumed to be the default branch by convention — it was read from the remote HEAD
symref before any branch work.

## Tags present

Release-style tags observed: `v0.1.0`, `v0.1.1`, `setup-v0.1.0`, `setup-v0.1.1`, and
`desktop-v0.8.2` … `desktop-v0.8.8`.

## Version strings in the baseline

| Location | Version |
| --- | --- |
| `apps/desktop/package.json` | `0.8.9` |
| `apps/desktop/src-tauri/tauri.conf.json` | `0.8.9` |
| `apps/server/package.json` | `0.1.1` |
| `apps/web/package.json` | `0.0.0` |
| `apps/mobile/package.json` / `app.config.ts` | `0.0.0` / `0.1.0` |
| `packageManager` | `bun@1.4.4` |

## Local Git layout

```
D:\AulacBot\aulacbot
├── upstream  https://github.com/agentes-chat/agentes-chat.git   (fetch + push URL as cloned)
├── origin    — not configured yet (awaiting owner decision)
├── main      local, tracks upstream/main, untouched
└── develop   local, created from main at the baseline commit
```

Verified with `git remote -v` and `git status --short --branch`.

## Rules that protect the baseline

- No force push, no history rewrite, no upstream tag deletion.
- Upstream sync always merges (never squashes, never rebases) so the shared history stays linear in
  ancestry.
- `main` only receives reviewed releases; upstream lands in `develop` through a sync branch.

## Re-verification commands

```powershell
git -C D:\AulacBot\aulacbot fetch upstream --prune --tags
git -C D:\AulacBot\aulacbot log --oneline -1 upstream/main
git -C D:\AulacBot\aulacbot log --oneline HEAD..upstream/main
git -C D:\AulacBot\aulacbot rev-list --count HEAD
git -C D:\AulacBot\aulacbot remote -v
```

