import { CLOUD_SERVER } from "@agenteschat/client/lib/server";

/**
 * The "new version" check (ADR 0036 §9): AULACBOT's own releases, read at start and every 6 hours.
 * A newer version shows the notes and "Update and reopen" (the Tauri updater, `update_install`);
 * the download link and the manual steps are the fallback.
 */

/**
 * AULACBOT's own releases, never upstream's: an AULACBOT app that took upstream's update would
 * replace itself with agentes.chat.
 *
 * The check reads GitHub's REST API, the one GitHub address that answers a web view (release
 * assets send no CORS header, so a `fetch` of them from the app would be refused). No domain and no
 * server of our own are involved: the app is independent the day a `desktop-v*` release exists.
 */
export const RELEASES_REPO = "cuong-under/aulacbot";
export const UPDATES_SITE = `https://github.com/${RELEASES_REPO}`;
export const RELEASES_API = `https://api.github.com/repos/${RELEASES_REPO}/releases?per_page=30`;
/** The desktop app's tags (the server's own `v*` releases carry the native packages). */
export const DESKTOP_TAG = "desktop-v";

/** The server the app opens before one is chosen (the cover): AULACBOT Cloud. */
export const SITE_URL = CLOUD_SERVER;
export const CHECK_EVERY_MS = 6 * 60 * 60 * 1000;

/** The release's target for Rust's OS name (`std::env::consts::OS`), as the updater names it too. */
export function targetParam(os: string): string {
  if (os === "macos" || os === "darwin") return "darwin";
  return os;
}

export interface LatestRelease {
  version: string;
  url: string;
  sha256?: string;
  notes?: string;
  publishedAt?: string;
  minVersion?: string;
}

/** Our arch names in the URL: Node's (`arm64`, `x64`), from Rust's (`aarch64`, `x86_64`). */
export function archParam(rustArch: string): string {
  if (rustArch === "aarch64" || rustArch === "arm64") return "arm64";
  if (rustArch === "x86_64" || rustArch === "x64") return "x64";
  return rustArch;
}

export const latestUrl = (): string => RELEASES_API;

/** This computer's download in a release, named as the desktop CI names it. */
export function downloadName(version: string, os: string, rustArch: string): string {
  const target = targetParam(os);
  const arch = archParam(rustArch);
  if (target === "darwin") return `agentes_${version}_universal.dmg`;
  if (target === "windows") return `agentes_${version}_${arch === "arm64" ? "arm64" : "x64"}-setup.exe`;
  return `agentes_${version}_${arch === "arm64" ? "arm64" : "amd64"}.deb`;
}

interface Parsed {
  nums: number[];
  pre: string[];
}

function parse(v: string): Parsed | null {
  const m = /^v?(\d+(?:\.\d+)*)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(v.trim());
  if (!m?.[1]) return null;
  return { nums: m[1].split(".").map(Number), pre: m[2] ? m[2].split(".") : [] };
}

/** Semver order: -1, 0 or 1. Unparseable versions sort first. A prerelease sorts before its release. */
export function compareVersions(a: string, b: string): number {
  const pa = parse(a);
  const pb = parse(b);
  if (!pa || !pb) return pa ? 1 : pb ? -1 : 0;
  const n = Math.max(pa.nums.length, pb.nums.length, 3);
  for (let i = 0; i < n; i++) {
    const x = pa.nums[i] ?? 0;
    const y = pb.nums[i] ?? 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  if (!pa.pre.length || !pb.pre.length) return pa.pre.length === pb.pre.length ? 0 : pa.pre.length ? -1 : 1;
  for (let i = 0; i < Math.max(pa.pre.length, pb.pre.length); i++) {
    const x = pa.pre[i];
    const y = pb.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xn = /^\d+$/.test(x);
    const yn = /^\d+$/.test(y);
    if (xn && yn) {
      if (Number(x) !== Number(y)) return Number(x) < Number(y) ? -1 : 1;
    } else if (xn !== yn) return xn ? -1 : 1;
    else if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

export const isNewer = (latest: string, current: string) => compareVersions(latest, current) > 0;

interface GitHubAsset {
  name?: unknown;
  browser_download_url?: unknown;
}

interface GitHubRelease {
  tag_name?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  body?: unknown;
  published_at?: unknown;
  created_at?: unknown;
  assets?: unknown;
}

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

/** The first 64-hex word of a `.sha256` file (`shasum -a 256` writes `<hash>  <file>`). */
export function parseSha256(text: string): string | null {
  return text.match(/\b([0-9a-f]{64})\b/i)?.[1]?.toLowerCase() ?? null;
}

/**
 * The release notes the app shows, out of a release body: everything before the first-open steps
 * (`.github/desktop-install.md`), without a `min-version:` line, which becomes the minimum instead.
 */
export function parseReleaseBody(body: string | undefined): { notes: string; minVersion?: string } {
  let minVersion: string | undefined;
  const text = body ?? "";
  const cut = text.indexOf("<!-- install -->");
  const lines = (cut < 0 ? text : text.slice(0, cut)).split(/\r?\n/).filter((line) => {
    const m = line.match(/^\s*min-version:\s*v?(\S+)\s*$/i);
    if (!m) return true;
    if (m[1] && parse(m[1])) minVersion = m[1];
    return false;
  });
  return { notes: lines.join("\n").trim(), ...(minVersion ? { minVersion } : {}) };
}

/**
 * The newest desktop build for this computer out of GitHub's release list, or null when there is
 * none (no release yet, or none with this computer's file). Only AULACBOT's own `desktop-v*`
 * tags: upstream's releases are never read, so an AULACBOT app cannot be offered agentes.chat.
 */
export function latestFromReleases(json: unknown, os: string, rustArch: string): LatestRelease | null {
  if (!Array.isArray(json)) return null;
  let best: LatestRelease | null = null;
  for (const item of json as GitHubRelease[]) {
    if (!item || typeof item !== "object" || item.draft === true || item.prerelease === true) continue;
    const tag = str(item.tag_name);
    if (!tag?.startsWith(DESKTOP_TAG)) continue;
    const version = tag.slice(DESKTOP_TAG.length);
    if (!parse(version)) continue;
    const assets = Array.isArray(item.assets) ? (item.assets as GitHubAsset[]) : [];
    const want = downloadName(version, os, rustArch);
    const file = assets.find((a) => a && str(a.name) === want);
    const url = file ? str(file.browser_download_url) : undefined;
    if (!url || !url.startsWith(`${UPDATES_SITE}/releases/download/`)) continue;
    const { notes, minVersion } = parseReleaseBody(str(item.body));
    const found: LatestRelease = {
      version,
      url,
      notes,
      publishedAt: str(item.published_at) ?? str(item.created_at) ?? "",
      ...(minVersion ? { minVersion } : {}),
    };
    if (!best || compareVersions(found.version, best.version) > 0) best = found;
  }
  return best;
}

export interface UpdateState {
  latest: LatestRelease | null;
  /** A newer version exists. */
  available: boolean;
  /** Below `minVersion`: the app must be updated to keep working. */
  required: boolean;
}

export function updateStateOf(current: string, latest: LatestRelease | null): UpdateState {
  if (!latest) return { latest: null, available: false, required: false };
  const available = isNewer(latest.version, current);
  const required = !!latest.minVersion && compareVersions(current, latest.minVersion) < 0;
  return { latest, available, required };
}

/** The notes as list items: one per non-empty line, without a leading "-" or "*". */
export function noteLines(notes: string | undefined): string[] {
  return (notes ?? "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
}

/**
 * Preferences › Updates › "Install updates by itself, at night": unset, on in every desktop app. Headless runners and
 * servers (CLI, VPS) have no such setting: they update when their owner does.
 */
export const AUTO_UPDATE_PREF = "autoUpdate";

export const autoUpdateOn = (pref: boolean | null) => pref ?? true;

/** The night's install window, local time: from 03:00 until 05:00. */
const NIGHT_FROM = 3;
const NIGHT_UNTIL = 5;

/**
 * The night `now` falls in, while it is inside the install window ("2026-11-12"), else null: one try per night.
 */
export function installNight(now: Date): string | null {
  const hour = now.getHours();
  if (hour < NIGHT_FROM || hour >= NIGHT_UNTIL) return null;
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
