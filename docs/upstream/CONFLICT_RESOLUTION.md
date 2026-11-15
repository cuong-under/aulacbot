# Conflict Resolution

## Never

- `git checkout --theirs .` / `--ours .`
- `git merge -X ours` / `-X theirs` as a blanket strategy
- Deleting an upstream feature so the build passes
- Deleting an AULACBOT customization because re-applying it is inconvenient
- Force-pushing a rewritten history to make the conflict disappear

## Procedure for each conflicted hunk

1. **Identify ownership.** Look the path up in `OWNERSHIP_MAP.md`.
2. **Read the upstream change** — `git log -p upstream/main -- <file>` and the ADR or commit that
   motivated it. Understand the intent, not just the diff.
3. **Read the AULACBOT change** — `docs/upstream/CUSTOMIZATION_REGISTRY.md` entry, its commit, and
   the ADR behind it.
4. **Ask whether the customization is still needed.** Upstream may have added the exact seam
   AULACBOT was emulating. If so, drop the customization and record the removal in the registry —
   that is a win, not a loss.
5. **Keep the behaviour, not the text.** The goal is AULACBOT's behaviour on top of upstream's new
   structure, not the old lines.
6. **Prefer the seam.** If the conflict shows AULACBOT edited upstream internals, look for a config
   value, adapter or module override that removes the edit entirely.
7. **Test.** Add or run the regression test named in the registry entry.
8. **Record.** Update the registry entry with the new commit SHA, the new line range, and the new
   sync risk.

## Escalate instead of guessing

Stop and report when:

- The upstream change alters a database migration already applied anywhere.
- The conflict is in `packages/engine` auth, permissions, or the Model Gateway.
- Resolving requires choosing between two incompatible product behaviours.
- Resolving would delete an upstream feature.
- The upstream change adds a license, trademark or telemetry obligation AULACBOT does not meet.

An unresolved conflict parked on its own branch is far cheaper than a wrong resolution shipped to
`main`.

## Post-merge verification

Checks that catch silent semantic drift even without a text conflict:

- `bun run typecheck` — interface changes surface here.
- `bun test` — behaviour changes surface here.
- `bun run check:migrations` — migration integrity.
- `bun run check:boundaries` / `check:licenses` — layering and license metadata.
- A read of the registry: every entry still describes reality.

