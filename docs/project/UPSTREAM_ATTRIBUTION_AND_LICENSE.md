# Upstream Attribution and License

This document records what the upstream repository actually says. It is not legal advice; it is a
faithful summary of files in this repository so that nobody has to guess.

## The license

- `LICENSE` — GNU Affero General Public License, version 3 **only** (SPDX `AGPL-3.0-only`).
- Root `package.json` declares `"license": "AGPL-3.0-only"`.
- Every workspace package declares `AGPL-3.0-only` **except** `packages/setup`
  (`@agenteschat/setup`), which is **MIT** and is not `private`.

## The attribution term (NOTICE)

`NOTICE` adds a term under AGPL-3.0 §7(b):

    Based on agentes.chat by Codari Global, LLC (https://agentes.chat)

It must appear in the **Appropriate Legal Notices** of every copy and every modified version that has
an interactive user interface, where users — including remote network users — can find it from the
settings or menus (for example an About screen). It may be translated, and AULACBOT's own name and
branding may sit next to it. It may **not** be removed, hidden, reworded in meaning, or replaced by
a claim that AULACBOT alone made the work.

In the code this lands in Settings › About: `apps/web/src/components/AboutSettings.tsx`, which reads
`PUBLIC_SOURCE_URL` / the instance's `sourceUrl` and the translation key
`settings.about.basedOn`. `SOURCE_URL` in `packages/config/src/schema.ts` is the env var that points
a deployment at **AULACBOT's own** source (AGPL §13 obligation when running a modified server).

## The additional permission (app stores)

`NOTICE` grants an AGPL-3.0 §7 additional permission to convey object code of `apps/mobile` and
`apps/desktop` through an application store or marketplace with restrictive terms, provided the
Corresponding Source is still offered under the AGPL at no charge outside those terms.

## The trademarks

`TRADEMARKS.md` keeps "agentes", "agentes.chat", the agentes logo and the app icons as trademarks of
Codari Global, LLC. The code licenses grant no rights to them.

For a public fork this means:

- AULACBOT needs its own name and logo.
- Its apps need their own store listings, icons and bundle identifiers — not `chat.agentes.*`.
- Saying "a fork of agentes.chat" is allowed.
- Using the agentes logo in AULACBOT branding is not.

## The commercial license

`COMMERCIAL.md` states the code is dual-licensed: AGPL-3.0-only free of charge, or a commercial
contract with Codari Global, LLC for those who want to distribute changes without publishing them,
sell under their own brand without the attribution, build it into a closed product, or work where
AGPL is not allowed. There is no license key; the code is identical.

## Contributions

`CLA.md` — outside contributions come in under a Contributor License Agreement, which is what lets
upstream offer the dual license. This matters if AULACBOT ever upstreams a patch.

## Third-party components

`NOTICE` enumerates them and their licenses, including:

- Bun (MIT) statically linking JavaScriptCore/WebCore (LGPL-2.0+) and tinycc (LGPL-2.1) in the
  desktop runner — sources and rebuild instructions in `apps/desktop/src-tauri/licenses/bun`.
- `agent-browser` (Apache-2.0) and axe-core (MPL-2.0) in the desktop app.
- Fonts (SIL OFL 1.1) in `apps/web/src/fonts`, `apps/web/public/email`, `apps/desktop/src/fonts`,
  `apps/mobile/assets/fonts`, `packages/engine/assets/fonts`.
- Tauri's NSIS installer template (Apache-2.0 OR MIT), modified.
- Simple Icons (CC0 1.0), and provider/brand marks used only to name their products.

`bun run check:licenses` is the upstream guard for license metadata; `bun run check:boundaries` is
the guard that no Cloud-only package is imported from the open-source tree.

## Obligations this project accepts

1. Keep `LICENSE`, `NOTICE`, `TRADEMARKS.md`, `COMMERCIAL.md`, `CLA.md` and third-party license
   folders byte-faithful unless the owner decides otherwise.
2. Keep the §7(b) attribution visible in the About screen of every shipped app.
3. Point `SOURCE_URL` at AULACBOT's published source for any deployed instance.
4. Publish AULACBOT's modifications under the AGPL **unless** the owner obtains a commercial
   license from Codari Global, LLC.
5. Do not present AULACBOT as official or endorsed by agentes.chat.

## Open question for the owner

Which licensing path AULACBOT takes — AGPL-only (publish modifications, keep the attribution) or a
commercial contract with Codari Global, LLC (closed distribution, attribution removed under
contract) — is a business decision. Until it is taken, assume the AGPL path and keep every
obligation satisfied. See `docs/decisions/ADR-001-INITIAL-ARCHITECTURE.md`.

