/**
 * Guards the AULACBOT identity that the owner approved on 2026-11-18, so a rebrand is never lost by
 * accident — least of all by a merge from upstream.
 *
 * It fails on the things that must never come back:
 *
 * - a palette token, the wordmark or the font drifting back to upstream's;
 * - the agents' desktop look losing the Jade ink;
 * - a generated asset that no longer matches the picture it is built from. The `.b64` files are the
 *   case that bit us once: the PNG was rebranded, the base64 the code actually imports was not, and
 *   every agent desktop kept painting the old sky.
 *
 *   bun run check:brand
 *   bun run check:derived   # only the generated assets
 *
 * Which handcrafted files a merge touched is a different question, asked right after a sync:
 * `bun run brand:drift`.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CYBER_LAC_COLORS } from "../../packages/ui/src/brand/cyber-lac";
import { contentHash } from "./files";

const ROOT = resolve(import.meta.dir, "../..");
const MANIFEST = join(import.meta.dir, "manifest.json");

export interface Finding {
  file: string;
  message: string;
}

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

/** The palette the owner picked: Jade, Deep Jade, Mint, Gold, Cream, Bronze. */
const PALETTE: Record<string, string> = {
  ".": "none",
  o: "#04110d",
  "0": "#010605",
  j: "#0f6a59",
  d: "#0a3d33",
  m: "#2fd3b2",
  n: "#6af2d2",
  g: "#f2bf61",
  a: "#b0742c",
  w: "#ffffff",
  c: "#eafff9",
};

export function identityFindings(): Finding[] {
  const out: Finding[] = [];

  for (const [key, value] of Object.entries(PALETTE)) {
    if (CYBER_LAC_COLORS[key] !== value) {
      out.push({
        file: "packages/ui/src/brand/cyber-lac.ts",
        message: `CYBER_LAC_COLORS["${key}"] is ${CYBER_LAC_COLORS[key] ?? "missing"}, the identity says ${value}`,
      });
    }
  }

  const tokens = read("packages/ui/src/styles/tokens.css");
  for (const expected of ["--agent: #0f6a59;", "--agent: #6af2d2;", "--agent2: #2fd3b2;"]) {
    if (!tokens.includes(expected)) {
      out.push({ file: "packages/ui/src/styles/tokens.css", message: `missing \`${expected}\`` });
    }
  }
  const sans = /--font-sans:\s*([^;]+);/.exec(tokens)?.[1] ?? "";
  if (!sans.trimStart().startsWith("Onest")) {
    out.push({ file: "packages/ui/src/styles/tokens.css", message: `--font-sans does not start with Onest: ${sans}` });
  }
  if (/Funnel|Doto/.test(sans)) {
    out.push({
      file: "packages/ui/src/styles/tokens.css",
      message: `--font-sans falls back to upstream's lockup: ${sans}`,
    });
  }

  const logo = read("packages/ui/src/components/Logo.tsx");
  if (!logo.includes('const NAME = "AULACBOT";')) {
    out.push({ file: "packages/ui/src/components/Logo.tsx", message: "the wordmark is no longer AULACBOT" });
  }

  const look = read("apps/server/runner/desktop-look.ts");
  if (!/LOOK_VERSION = (\d+)/.test(look)) {
    out.push({ file: "apps/server/runner/desktop-look.ts", message: "LOOK_VERSION is gone" });
  }
  if (!look.includes('const INK = "4, 17, 13";')) {
    out.push({ file: "apps/server/runner/desktop-look.ts", message: "the desktop ink is no longer Jade #04110D" });
  }

  return out;
}

/** The generated pictures, checked against the sources they are built from. */
export function derivedFindings(): Finding[] {
  const out: Finding[] = [];
  const assets = "apps/server/runner/assets";

  for (const name of ["desktop-wallpaper.png", "desktop-mark.png"]) {
    const png = join(ROOT, assets, name);
    const b64 = `${png}.b64`;
    if (!existsSync(png) || !existsSync(b64)) {
      out.push({ file: b64, message: "missing: run docs/design/desktop/render.sh" });
      continue;
    }
    const picture = readFileSync(png);
    const embedded = Buffer.from(readFileSync(b64, "utf8").trim(), "base64");
    if (!picture.equals(embedded)) {
      out.push({
        file: b64,
        message: `does not decode to ${name} (png ${contentHash(name, picture).slice(0, 12)}, b64 ${contentHash(name, embedded).slice(0, 12)})`,
      });
    }
  }

  const icons = "apps/desktop/src-tauri/icons";
  for (const name of ["icon.png", "32x32.png", "128x128.png", "icon.ico", "icon.icns"]) {
    const path = join(ROOT, icons, name);
    if (!existsSync(path) || readFileSync(path).length === 0) {
      out.push({ file: `${icons}/${name}`, message: "missing or empty" });
    }
  }
  const tray = join(ROOT, icons, "tray");
  if (!existsSync(tray) || readdirSync(tray).filter((name) => name.endsWith(".png")).length === 0) {
    out.push({ file: `${icons}/tray`, message: "no tray templates" });
  }

  if (!existsSync(join(ROOT, "apps/web/public/favicon.svg"))) {
    out.push({ file: "apps/web/public/favicon.svg", message: "missing" });
  }

  return out;
}

/** Crafted files whose bytes no longer match the baseline the owner approved. */
export function driftFindings(): Finding[] {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as { crafted: Record<string, string> };
  const out: Finding[] = [];
  for (const [path, expected] of Object.entries(manifest.crafted)) {
    const full = join(ROOT, path);
    if (!existsSync(full)) {
      out.push({ file: path, message: "removed since the baseline was recorded" });
      continue;
    }
    if (contentHash(path, readFileSync(full)) !== expected) {
      out.push({ file: path, message: "changed since the baseline; re-run `bun run brand:manifest` once reviewed" });
    }
  }
  return out;
}

if (import.meta.main) {
  const only = process.argv.find((arg) => arg.startsWith("--only="))?.slice("--only=".length);
  if (only === "drift") {
    const drifted = driftFindings();
    for (const finding of drifted) console.log(`changed ${finding.file}: ${finding.message}`);
    console.log(
      drifted.length === 0
        ? "no handcrafted brand file changed since the baseline"
        : `${drifted.length} handcrafted brand file(s) changed — read each one, then \`bun run brand:manifest\``,
    );
    process.exit(0);
  }
  const errors = [
    ...(only && only !== "identity" ? [] : identityFindings()),
    ...(only && only !== "derived" ? [] : derivedFindings()),
  ];

  for (const finding of errors) console.error(`error ${finding.file}: ${finding.message}`);

  if (errors.length > 0) {
    console.error(`\nbrand identity broken: ${errors.length} error(s). The owner approved this look; restore it.`);
    process.exit(1);
  }
  console.log("brand ok (identity, derived assets)");
}
