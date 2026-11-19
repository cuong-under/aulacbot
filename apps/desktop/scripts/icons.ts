/**
 * Draws the desktop app's icons from the app icons' own generator (packages/ui/scripts/app-icons),
 * so the tray and the app icon are the same symbol as everywhere else: the Cyber Lạc head, front
 * on, with the two pill eyes cut out. Run by CI before `tauri build`
 * (`bun apps/desktop/scripts/icons.ts`), then `tauri icon app-icon.png` makes the .icns and the
 * PNG sizes from the 1024 px master.
 *
 * Outputs (all ignored by git):
 *   src-tauri/icons/tray/{idle,working,paused,offline,update,browsing,needs}.png  36×36 template images (18 pt @2x)
 *   app-icon.png                                                   1024×1024 app icon master (ADR 0179)
 *   src-tauri/icons/app/<id>.png, <id>-tile.png                    the icons a person may pick, Dock and window
 *
 * No dependencies: a tiny PNG encoder over node:zlib.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { LAC_MARKS } from "../../../packages/ui/scripts/app-icons/cyber-lac.mjs";
import { png, render, resize } from "../../../packages/ui/scripts/app-icons/raster.mjs";
import { APP_ICON_IDS, macLayers, SCENES, tiled } from "../../../packages/ui/scripts/app-icons/scenes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- PNG ---------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = (CRC_TABLE[(c ^ b) & 0xff] as number) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

/** RGBA pixels (width × height × 4) to a PNG file. */
export function encodePng(width: number, height: number, rgba: Uint8Array): Uint8Array {
  const header = new Uint8Array(13);
  const hv = new DataView(header.buffer);
  hv.setUint32(0, width);
  hv.setUint32(4, height);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const raw = new Uint8Array(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * (width * 4 + 1) + 1);
  }
  const parts = [
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", new Uint8Array(deflateSync(raw, { level: 9 }))),
    chunk("IEND", new Uint8Array(0)),
  ];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/* ---------- Shapes (the mark's own scene coordinates, from cyber-lac.mjs) ---------- */

function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/* ---------- Tray: 36×36 template images (only alpha counts; macOS tints them) ---------- */

type TrayState = "idle" | "working" | "paused" | "offline" | "update" | "browsing" | "needs";
const TRAY_PX = 36;
/** The mark inside the 36 px canvas: as tall as it goes, centred across. */
const TB = 22;
const [MARK_X0, MARK_Y0, MARK_X1, MARK_Y1] = LAC_MARKS.box;
const MARK_SCALE = TB / (MARK_Y1 - MARK_Y0);
const MARK_LEFT = (TRAY_PX - (MARK_X1 - MARK_X0) * MARK_SCALE) / 2;
const SS = 4; // supersampling per axis

/** The head, its crest and its bill as one shape (scene coordinates). */
function inMark(x: number, y: number): boolean {
  return LAC_MARKS.head(x, y) || LAC_MARKS.bill(x, y) || LAC_MARKS.crest.some((fin) => fin(x, y));
}

function trayCoverage(state: TrayState, px: number, py: number): boolean {
  // The badges first: they sit beside the head, in the canvas's own pixels.
  if (state === "browsing" || state === "needs") {
    // A badge cut out of the bottom-right corner: a ring while an agent is in its browser, a
    // filled dot when one needs a person. Same place and gap as the update badge.
    const bx = 28.5;
    const by = 28.5;
    const d = Math.hypot(px - bx, py - by);
    if (d <= 6.6) {
      if (d > 5.6) return false; // the gap around the badge
      return state === "needs" ? true : d >= 3;
    }
  }
  if (state === "update") {
    // A round badge cut out of the bottom-right corner, with a down arrow in it.
    const bx = 28.5;
    const by = 28.5;
    const d = Math.hypot(px - bx, py - by);
    if (d <= 7) {
      if (d > 6) return false; // the gap around the badge
      const half = 1.15;
      return (
        distToSegment(px, py, bx, by - 4, bx, by + 3.2) <= half ||
        distToSegment(px, py, bx - 3, by + 0.4, bx, by + 3.4) <= half ||
        distToSegment(px, py, bx + 3, by + 0.4, bx, by + 3.4) <= half
      );
    }
  }
  const x = MARK_X0 + (px - MARK_LEFT) / MARK_SCALE;
  const y = MARK_Y0 + (py - 2) / MARK_SCALE;
  if (!inMark(x, y)) return false;
  // The visor is a slot through the head, its two eyes the only solid part of it (the icon's dark visor and white
  // eyes, seen as one color).
  if (LAC_MARKS.visor(x, y)) {
    if (state === "paused")
      return (x >= 409 && x <= 471 && y >= 574 && y <= 604) || (x >= 553 && x <= 615 && y >= 574 && y <= 604);
    return LAC_MARKS.eyes(state === "working" ? x - 26 : x, y);
  }
  return true;
}

function trayPng(state: TrayState): Uint8Array {
  const rgba = new Uint8Array(TRAY_PX * TRAY_PX * 4);
  for (let y = 0; y < TRAY_PX; y++)
    for (let x = 0; x < TRAY_PX; x++) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) if (trayCoverage(state, x + (sx + 0.5) / SS, y + (sy + 0.5) / SS)) hits++;
      const i = (y * TRAY_PX + x) * 4;
      rgba[i] = 0;
      rgba[i + 1] = 0;
      rgba[i + 2] = 0;
      // Offline is the same head, dimmed.
      rgba[i + 3] = Math.round((hits / (SS * SS)) * 255 * (state === "offline" ? 0.45 : 1));
    }
  return encodePng(TRAY_PX, TRAY_PX, rgba);
}

/* ---------- App icon (ADR 0179): from the app icons' generator (packages/ui/scripts/app-icons) ---------- */

/**
 * The bundle's master (1024, macOS's shape and shadow: `tauri icon` makes the .icns, .ico and PNGs from it) is the
 * shipped icon; every icon's Dock picture (512) and window picture (256, a rounded square) are what the person may pick
 * while the app runs (src/app_icon.rs embeds them).
 */
function appIcons(): { master: Uint8Array; dock: Map<string, Uint8Array>; window: Map<string, Uint8Array> } {
  const dock = new Map<string, Uint8Array>();
  const window = new Map<string, Uint8Array>();
  let master: Uint8Array | null = null;
  for (const id of APP_ICON_IDS) {
    const scene = SCENES[id];
    const mac = render(1024, macLayers(scene.light()));
    if (id === APP_ICON_IDS[0]) master = png(mac);
    dock.set(id, png(resize(mac, 512)));
    window.set(id, png(resize(render(1024, tiled(scene.light())), 256)));
  }
  if (!master) throw new Error("icons: no app icons");
  return { master, dock, window };
}

/* ---------- Write ---------- */

const trayDir = join(root, "src-tauri", "icons", "tray");
mkdirSync(trayDir, { recursive: true });
for (const state of ["idle", "working", "paused", "offline", "update", "browsing", "needs"] as const) {
  writeFileSync(join(trayDir, `${state}.png`), trayPng(state));
}
const icons = appIcons();
writeFileSync(join(root, "app-icon.png"), icons.master);
const appDir = join(root, "src-tauri", "icons", "app");
mkdirSync(appDir, { recursive: true });
for (const [id, bytes] of icons.dock) writeFileSync(join(appDir, `${id}.png`), bytes);
for (const [id, bytes] of icons.window) writeFileSync(join(appDir, `${id}-tile.png`), bytes);
console.log(`icons: tray (7 states), app-icon.png and ${icons.dock.size} app icons written`);
