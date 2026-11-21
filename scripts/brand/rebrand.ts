/**
 * Re-applies the one rename that upstream sync would otherwise make us do by hand again:
 * `agentes.chat` → `AULACBOT` in the files where that substitution is the whole diff.
 *
 * It never touches a handcrafted file. The Cyber Lạc art, the palette, the Vietnamese copy and every
 * other deliberate edit are listed as `crafted` in `manifest.json` and are out of reach here — a
 * blanket rewrite is exactly how a rebrand gets flattened, so the scope is proven per file rather
 * than assumed.
 *
 *   bun run rebrand:check   # report only; non-zero when a mechanical file still says agentes.chat
 *   bun run rebrand         # rewrite those files
 *
 * Files that say `agentes.chat` and are neither mechanical nor exempt are listed as unclassified:
 * upstream added them, and a human decides which class they belong to.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { TEXT } from "./files";

const ROOT = resolve(import.meta.dir, "../..");
const MANIFEST = join(import.meta.dir, "manifest.json");
/** The manifest records the rename (`word` and `brand`), so it never counts as a file the rename missed. */
const SELF = relative(ROOT, MANIFEST).split(sep).join("/");

interface Manifest {
  word: string;
  brand: string;
  mechanical: string[];
  exempt: string[];
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest;
const { word, brand } = manifest;
const apply = !process.argv.includes("--check");

function tracked(): string[] {
  const raw = execFileSync("git", ["-c", `safe.directory=${ROOT}`, "-C", ROOT, "ls-files", "-z"], {
    maxBuffer: 1 << 30,
  });
  return raw.toString("utf8").split("\0").filter(Boolean);
}

const rewritten: string[] = [];
for (const path of manifest.mechanical) {
  const full = join(ROOT, path);
  const before = readFileSync(full, "utf8");
  if (!before.includes(word)) continue;
  rewritten.push(path);
  if (apply) writeFileSync(full, before.replaceAll(word, brand));
}

const known = new Set([...manifest.mechanical, ...manifest.exempt]);
const unclassified: string[] = [];
for (const path of tracked()) {
  if (path === SELF || known.has(path) || !TEXT.test(path)) continue;
  let text: string;
  try {
    text = readFileSync(join(ROOT, path), "utf8");
  } catch {
    continue;
  }
  if (text.includes(word)) unclassified.push(path);
}

for (const path of rewritten) console.log(`${apply ? "rewrote" : "needs rewrite"} ${path}`);
for (const path of unclassified)
  console.warn(`unclassified ${path}: says ${word}, not in the manifest — decide its class`);

if (apply) {
  console.log(`rebrand done: ${rewritten.length} file(s) rewritten, ${unclassified.length} unclassified`);
} else if (rewritten.length > 0) {
  console.error(`rebrand needed: ${rewritten.length} mechanical file(s) say ${word} again`);
  process.exit(1);
} else {
  console.log(
    `rebrand ok: ${manifest.mechanical.length} mechanical file(s) clean, ${unclassified.length} unclassified`,
  );
}
