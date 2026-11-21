import { describe, expect, test } from "bun:test";
import {
  archParam,
  autoUpdateOn,
  compareVersions,
  DESKTOP_TAG,
  downloadName,
  installNight,
  isNewer,
  latestFromReleases,
  latestUrl,
  noteLines,
  parseReleaseBody,
  parseSha256,
  targetParam,
  UPDATES_SITE,
  updateStateOf,
} from "../src/control/version";

describe("compareVersions", () => {
  test("numeric order, not text order", () => {
    expect(compareVersions("0.10.0", "0.9.3")).toBe(1);
    expect(compareVersions("0.9.3", "0.10.0")).toBe(-1);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("v1.2", "1.2.0")).toBe(0);
  });
  test("a prerelease comes before its release", () => {
    expect(compareVersions("1.0.0-beta.2", "1.0.0")).toBe(-1);
    expect(compareVersions("1.0.0-beta.10", "1.0.0-beta.2")).toBe(1);
    expect(compareVersions("1.0.0", "1.0.0-rc.1")).toBe(1);
  });
  test("isNewer", () => {
    expect(isNewer("0.2.0", "0.1.9")).toBe(true);
    expect(isNewer("0.1.0", "0.1.0")).toBe(false);
    expect(isNewer("garbage", "0.1.0")).toBe(false);
  });
});

describe("latest release", () => {
  test("the platform and the architecture are named as the builds are", () => {
    expect(archParam("aarch64")).toBe("arm64");
    expect(archParam("x86_64")).toBe("x64");
    expect(targetParam("macos")).toBe("darwin");
    expect(targetParam("windows")).toBe("windows");
    expect(targetParam("linux")).toBe("linux");
    expect(downloadName("0.2.0", "macos", "aarch64")).toBe("agentes_0.2.0_universal.dmg");
    expect(downloadName("0.2.0", "windows", "x86_64")).toBe("agentes_0.2.0_x64-setup.exe");
    expect(downloadName("0.2.0", "windows", "aarch64")).toBe("agentes_0.2.0_arm64-setup.exe");
    expect(downloadName("0.2.0", "linux", "x86_64")).toBe("agentes_0.2.0_amd64.deb");
    expect(downloadName("0.2.0", "linux", "aarch64")).toBe("agentes_0.2.0_arm64.deb");
  });

  test("the check reads GitHub's release list, the one GitHub address a web view may read", () => {
    expect(latestUrl()).toBe("https://api.github.com/repos/cuong-under/aulacbot/releases?per_page=30");
  });

  const release = (version: string, extra: Record<string, unknown> = {}) => ({
    tag_name: `${DESKTOP_TAG}${version}`,
    draft: false,
    prerelease: false,
    body: `- Pastas\n- Pedidos\n\nmin-version: 0.1.0`,
    published_at: "2026-11-20T10:00:00Z",
    assets: [
      {
        name: `agentes_${version}_universal.dmg`,
        browser_download_url: `${UPDATES_SITE}/releases/download/${DESKTOP_TAG}${version}/agentes_${version}_universal.dmg`,
      },
    ],
    ...extra,
  });

  test("picks the newest desktop build this computer has a file for", () => {
    const list = [release("0.2.0"), release("0.10.0"), release("0.9.0")];
    expect(latestFromReleases(list, "macos", "aarch64")?.version).toBe("0.10.0");
    expect(latestFromReleases(list, "macos", "x86_64")?.url).toContain("agentes_0.10.0_universal.dmg");
    // A Windows build is not this Mac's, and there is none in the list.
    expect(latestFromReleases(list, "windows", "x86_64")).toBeNull();
  });

  test("the notes come from the body, and min-version with them", () => {
    const found = latestFromReleases([release("0.2.0")], "macos", "aarch64");
    expect(found?.notes).toBe("- Pastas\n- Pedidos");
    expect(found?.minVersion).toBe("0.1.0");
    expect(parseReleaseBody("- A\n<!-- install -->\n## Installing\n- B")).toEqual({ notes: "- A" });
    expect(parseReleaseBody(undefined)).toEqual({ notes: "" });
  });

  test("drafts, prereleases and the server's own tags are never offered", () => {
    expect(latestFromReleases([release("0.2.0", { draft: true })], "macos", "aarch64")).toBeNull();
    expect(latestFromReleases([release("0.2.0", { prerelease: true })], "macos", "aarch64")).toBeNull();
    expect(latestFromReleases([{ ...release("0.2.0"), tag_name: "v0.2.0" }], "macos", "aarch64")).toBeNull();
    expect(latestFromReleases([], "macos", "aarch64")).toBeNull();
    expect(latestFromReleases(null, "macos", "aarch64")).toBeNull();
  });

  test("a download off our own releases is refused, so upstream can never replace the app", () => {
    const elsewhere = release("0.2.0", {
      assets: [
        {
          name: "agentes_0.2.0_universal.dmg",
          browser_download_url: "https://app.agentes.chat/api/desktop/download/0.2.0/agentes_0.2.0_universal.dmg",
        },
      ],
    });
    expect(latestFromReleases([elsewhere], "macos", "aarch64")).toBeNull();
  });

  test("a .sha256 file's hash, and nothing else", () => {
    const hash = "a".repeat(64);
    expect(parseSha256(`${hash}  agentes_0.2.0_universal.dmg`)).toBe(hash);
    expect(parseSha256("no hash here")).toBeNull();
  });

  test("available and required", () => {
    const latest = { version: "0.3.0", url: `${UPDATES_SITE}/x`, minVersion: "0.2.0" };
    expect(updateStateOf("0.1.0", latest)).toMatchObject({ available: true, required: true });
    expect(updateStateOf("0.2.5", latest)).toMatchObject({ available: true, required: false });
    expect(updateStateOf("0.3.0", latest)).toMatchObject({ available: false, required: false });
    expect(updateStateOf("0.1.0", null)).toMatchObject({ available: false, required: false });
  });

  test("notes become list lines", () => {
    expect(noteLines("## 0.2.0\n- Pastas\n* Pedidos\n\nTarefas longas")).toEqual([
      "Pastas",
      "Pedidos",
      "Tarefas longas",
    ]);
  });
});
describe("night install", () => {
  test("only from 03:00 until 05:00, one key per night", () => {
    expect(installNight(new Date(2026, 10, 12, 2, 59))).toBeNull();
    expect(installNight(new Date(2026, 10, 12, 3, 0))).toBe("2026-11-12");
    expect(installNight(new Date(2026, 10, 12, 4, 59))).toBe("2026-11-12");
    expect(installNight(new Date(2026, 10, 12, 5, 0))).toBeNull();
  });
  test("unset is on, a choice wins", () => {
    expect(autoUpdateOn(null)).toBe(true);
    expect(autoUpdateOn(false)).toBe(false);
    expect(autoUpdateOn(true)).toBe(true);
  });
});
