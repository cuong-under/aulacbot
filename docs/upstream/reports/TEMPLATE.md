# Upstream Impact Report — YYYY-MM-DD

Copy this file to `docs/upstream/reports/YYYY-MM-DD-sync.md` and fill it in. Delete nothing: an
empty section is a finding ("nothing in this class changed").

## A. Upstream update summary

| Field | Value |
| --- | --- |
| Previous sync SHA | `<sha>` |
| New upstream SHA | `<sha>` |
| Commits merged | N |
| Files added | N |
| Files modified | N |
| Files deleted | N |
| Merge commit | `<sha>` |
| Sync branch | `upstream-sync/YYYY-MM-DD` |

Notable commits (security, breaking, migrations):

- `...`

## B. AULACBOT impact

| Class | Affected |
| --- | --- |
| Upstream-owned files touched by AULACBOT | list, or "none" |
| AULACBOT-owned files affected | list, or "none" |
| Shared files affected | list, or "none" |
| Customizations affected | registry IDs, or "none" |
| Dependency changes | `bun.lock` diff summary |
| API contract changes | routes, OpenAPI, client types |
| Database migration changes | new migrations, altered tables |
| Build configuration changes | workspace, tsconfig, biome, CI |
| Security-sensitive changes | auth, permissions, gateway, crypto |

## C. Risk classification

**Predicted risk:** LOW / MEDIUM / HIGH / CRITICAL

Reasoning:

- ...

**Confirmed conflicts:** N — list each with its file and how it was resolved.

State clearly whether "no conflict" came from Git or from reading the code. They are not the same
claim.

## D. Resolution decisions

For each conflict or customization meeting point:

| File | Upstream intent | AULACBOT intent | Decision | Registry updated |
| --- | --- | --- | --- | --- |

## E. Validation

| Check | Command | Result |
| --- | --- | --- |
| Install | `bun install --frozen-lockfile --linker=hoisted` | pass / fail |
| Typecheck | `bun run typecheck` | pass / fail (N workspaces) |
| Lint | `bun run lint` | pass / fail |
| Boundaries | `bun run check:boundaries` | pass / fail |
| Licenses | `bun run check:licenses` | pass / fail |
| Migrations | `bun run check:migrations` | pass / fail |
| Tests | `bun test` | pass / fail (N pass, N fail) |
| Build | `bun run build` | pass / fail |

Known-failing tests and why they are unrelated to this sync:

- ...

## F. Follow-ups

- [ ] ...

