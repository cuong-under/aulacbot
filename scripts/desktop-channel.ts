/**
 * The desktop app's update channel (`.github/workflows/desktop.yml`, after a build's release exists).
 *
 *   VERSION=0.8.14 TAG=desktop-v0.8.14 REPO=cuong-under/aulacbot bun scripts/desktop-channel.ts
 *
 * Reads the build files in `out/` and writes `latest.json`, the file Tauri's own updater reads
 * (`plugins.updater.endpoints` in `apps/desktop/src-tauri/tauri.conf.json`): one entry per platform,
 * naming the bundle, its signature and its URL in this version's release.
 *
 * It is published to the rolling `desktop-latest` release, a prerelease, so `releases/latest` stays
 * the newest real release. Rust reads it, never a web view, so a release asset is fine here: GitHub's
 * release assets send no CORS header, which is why the app's own "new version" check reads GitHub's
 * REST API instead (`apps/desktop/src/control/version.ts`).
 *
 * Environment: VERSION, TAG, REPO; ROLLING (default `desktop-latest`). Needs `out/notes.txt`.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VERSION = process.env.VERSION;
const TAG = process.env.TAG;
const REPO = process.env.REPO;
const ROLLING = process.env.ROLLING ?? "desktop-latest";
if (!VERSION || !TAG || !REPO) throw new Error("VERSION, TAG and REPO are required");

const BASE = `https://github.com/${REPO}/releases/download/${TAG}`;

/** A signature file's text, or null when this run built no such platform. */
const signature = (name: string): string | null => {
  const path = join("out", `${name}.sig`);
  return existsSync(path) ? readFileSync(path, "utf8").trim() : null;
};

/** The platform keys Tauri asks for, each with its bundle; a Mac build is one universal bundle. */
const builds = [
  { key: "darwin-aarch64", bundle: `agentes_${VERSION}_universal.app.tar.gz` },
  { key: "darwin-x86_64", bundle: `agentes_${VERSION}_universal.app.tar.gz` },
  { key: "windows-x86_64", bundle: `agentes_${VERSION}_x64-setup.exe` },
  { key: "windows-aarch64", bundle: `agentes_${VERSION}_arm64-setup.exe` },
  { key: "linux-x86_64", bundle: `agentes_${VERSION}_amd64.AppImage` },
  { key: "linux-aarch64", bundle: `agentes_${VERSION}_arm64.AppImage` },
];

/** Only the platforms this run built: a missing signature leaves its entry out, never a null one. */
const platforms: Record<string, { signature: string; url: string }> = {};
for (const b of builds) {
  const sig = signature(b.bundle);
  if (sig) platforms[b.key] = { signature: sig, url: `${BASE}/${b.bundle}` };
}

// A channel with no platform in it would leave every app on its version: fail loudly instead.
if (Object.keys(platforms).length === 0) throw new Error(`no signed build in out/ for ${VERSION}`);

const notesPath = join("out", "notes.txt");
const channel = {
  version: VERSION,
  notes: existsSync(notesPath) ? readFileSync(notesPath, "utf8") : "",
  pub_date: new Date().toISOString(),
  platforms,
};
writeFileSync("latest.json", `${JSON.stringify(channel, null, 2)}\n`);
console.log(JSON.stringify(channel, null, 2));

/** Publish it, and keep the rolling release a prerelease so `releases/latest` stays the newest release. */
function publish(): void {
  const gh = (...args: string[]) => spawnSync("gh", args, { stdio: "inherit" }).status ?? 1;
  if (gh("release", "view", ROLLING) !== 0) {
    const created = gh(
      "release",
      "create",
      ROLLING,
      "--prerelease",
      "--latest=false",
      "--title",
      "AULACBOT desktop (update channel)",
      "--notes",
      "The desktop app's update channel. Rewritten on every desktop release; the builds are in that version's own release.",
    );
    if (created !== 0) throw new Error(`could not create the ${ROLLING} release`);
  }
  if (gh("release", "edit", ROLLING, "--prerelease", "--latest=false") !== 0) {
    throw new Error(`could not keep ${ROLLING} a prerelease`);
  }
  if (gh("release", "upload", ROLLING, "latest.json", "--clobber") !== 0) {
    throw new Error(`could not upload latest.json to ${ROLLING}`);
  }
}

// `--no-publish` writes the file and stops, for a test or a dry run.
if (!process.argv.includes("--no-publish")) publish();
