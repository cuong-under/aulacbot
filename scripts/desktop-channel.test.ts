import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "desktop-channel.ts");
const dirs: string[] = [];

/** A build's `out/`, with the files named, and the channel script run in it. */
function channel(version: string, files: string[], notes = "- Pastas\n- Pedidos") {
  const dir = mkdtempSync(join(tmpdir(), "aulac-channel-"));
  dirs.push(dir);
  mkdirSync(join(dir, "out"), { recursive: true });
  writeFileSync(join(dir, "out", "notes.txt"), notes);
  for (const f of files) writeFileSync(join(dir, "out", f), f.endsWith(".sig") ? "SIG" : "x");
  const run = Bun.spawnSync(["bun", SCRIPT, "--no-publish"], {
    cwd: dir,
    env: { ...process.env, VERSION: version, TAG: `desktop-v${version}`, REPO: "cuong-under/aulacbot", GH: "false" },
  });
  return { dir, status: run.exitCode, out: run.stdout.toString() + run.stderr.toString() };
}

afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe("the desktop update channel", () => {
  test("every platform this run built, with its signature and its URL in the release", () => {
    const v = "0.8.14";
    const mac = `agentes_${v}_universal.app.tar.gz`;
    const win = `agentes_${v}_x64-setup.exe`;
    const lin = `agentes_${v}_amd64.AppImage`;
    const { dir, status } = channel(v, [mac, `${mac}.sig`, win, `${win}.sig`, lin, `${lin}.sig`]);
    expect(status).toBe(0);
    const json = JSON.parse(readFileSync(join(dir, "latest.json"), "utf8"));
    expect(json.version).toBe(v);
    expect(json.notes).toBe("- Pastas\n- Pedidos");
    expect(Object.keys(json.platforms).sort()).toEqual([
      "darwin-aarch64",
      "darwin-x86_64",
      "linux-x86_64",
      "windows-x86_64",
    ]);
    expect(json.platforms["darwin-aarch64"]).toEqual({
      signature: "SIG",
      url: `https://github.com/cuong-under/aulacbot/releases/download/desktop-v${v}/${mac}`,
    });
    // The same Mac bundle serves both architectures: one universal build.
    expect(json.platforms["darwin-x86_64"]).toEqual(json.platforms["darwin-aarch64"]);
  });

  test("a platform this run did not build is left out, never published with no signature", () => {
    const v = "0.8.14";
    const mac = `agentes_${v}_universal.app.tar.gz`;
    const { dir, status } = channel(v, [mac, `${mac}.sig`]);
    expect(status).toBe(0);
    const json = JSON.parse(readFileSync(join(dir, "latest.json"), "utf8"));
    expect(Object.keys(json.platforms).sort()).toEqual(["darwin-aarch64", "darwin-x86_64"]);
  });

  test("a build with nothing signed fails loudly instead of publishing an empty channel", () => {
    const { status, out } = channel("0.8.14", []);
    expect(status).not.toBe(0);
    expect(out).toContain("no signed build");
  });
});
