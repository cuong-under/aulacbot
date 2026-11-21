# Sync History

One row per upstream sync. Newest first.

| Date | Branch | From SHA | To SHA | Commits | Risk | Report | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-11-21 | `upstream-sync/2026-11-19` | `50ca784dd` | `df4b9610c` | 1385 | MEDIUM | `reports/2026-11-19-sync.md` | First real sync. No unmerged paths, no conflict markers in the tree. Rebrand pass applied on top: help pages (Vietnamese edition added), email words, migrate copy and scripts, Office metadata, `setup/lib.ts` Jev line, ADR 0179 summary, the two static HTML fallbacks; `Logo.tsx` union conflict resolved by hand. `brand:manifest` re-baselined on the new upstream tip (262 mechanical / 509 crafted / 534 exempt). Updates and the installer both come from AULACBOT's own GitHub releases, never upstream's: the Tauri updater reads the rolling `desktop-latest` channel (CUSTOM-015) and `install.sh` reads `installer-latest` (CUSTOM-016). `check:brand`, `rebrand:check`, `brand:drift`, `check:boundaries`, `check:licenses`, `check:migrations`, `typecheck` and `build` pass. Desktop 272 pass / 13 fail (all Windows-path baseline); `packages/i18n` 115 pass / 0 fail; `scripts/desktop-channel.test.ts` 3/3. |
| 2026-11-15 | `develop` (baseline) | — | `50ca784dd` | 9050 (history) | — | — | Baseline established. `upstream` remote set, `develop` created from `main`. No upstream code changed. |

## Baseline detail

The project starts **at** upstream `main`, not behind it: the local `main` and the working copy both
sit on `50ca784dd4c83efbc7ca916a6f07faa8accfe7f6`, the tip of upstream `main` on 2026-11-15. There is
therefore no first sync to perform — the first row will be the first pull after this date.

## Template

| Date | Branch | From SHA | To SHA | Commits | Risk | Report | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | `upstream-sync/YYYY-MM-DD` | `<old>` | `<new>` | N | LOW/MEDIUM/HIGH/CRITICAL | `reports/YYYY-MM-DD-sync.md` | conflicts, decisions, follow-ups |

