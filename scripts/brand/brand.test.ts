import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { derivedFindings, driftFindings, identityFindings } from "./check";
import { contentHash, TEXT } from "./files";

const ROOT = resolve(import.meta.dir, "../..");
const manifest = JSON.parse(readFileSync(join(import.meta.dir, "manifest.json"), "utf8")) as {
  base: string;
  word: string;
  brand: string;
  mechanical: string[];
  crafted: Record<string, string>;
  exempt: string[];
};

describe("the recorded baseline", () => {
  test("names the upstream commit the fork started from", () => {
    expect(manifest.base).toMatch(/^[0-9a-f]{40}$/);
  });

  test("no file is in two classes at once", () => {
    const mechanical = new Set(manifest.mechanical);
    for (const path of Object.keys(manifest.crafted)) expect(mechanical.has(path)).toBe(false);
    for (const path of manifest.exempt) expect(mechanical.has(path)).toBe(false);
  });

  test("every mechanical file is a text file that exists", () => {
    for (const path of manifest.mechanical) {
      expect(TEXT.test(path)).toBe(true);
      expect(existsSync(join(ROOT, path))).toBe(true);
    }
  });

  test("every crafted file still hashes to what was recorded", () => {
    const drifted = driftFindings();
    expect(drifted.map((finding) => finding.file)).toEqual([]);
  });
});

describe("the identity the owner approved", () => {
  test("palette, tokens, wordmark and desktop ink hold", () => {
    expect(identityFindings()).toEqual([]);
  });

  test("the embedded pictures decode to the shipped ones", () => {
    expect(derivedFindings()).toEqual([]);
  });
});

describe("contentHash", () => {
  test("ignores the line endings a Windows checkout rewrites", () => {
    const lf = Buffer.from("a\nb\n");
    const crlf = Buffer.from("a\r\nb\r\n");
    expect(contentHash("x.ts", lf)).toBe(contentHash("x.ts", crlf));
  });

  test("does not rewrite a binary", () => {
    const bytes = Buffer.from([0x0d, 0x0a, 0x0d, 0x0a]);
    expect(contentHash("x.png", bytes)).not.toBe(contentHash("x.ts", bytes));
  });
});
