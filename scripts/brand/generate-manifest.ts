/**
 * Records the AULACBOT brand baseline in `scripts/brand/manifest.json`.
 *
 * Every file that differs from upstream falls in one of three classes, and the class decides what a
 * future sync may touch:
 *
 * - `mechanical` — the diff is exactly `agentes.chat` → `AULACBOT` and nothing else. A machine can
 *   re-apply that after a merge, so the invariant is "no `agentes.chat` left in these files".
 * - `crafted` — hand-made branding (Cyber Lạc art, the palette, the copy). Never rewritten
 *   automatically; the hash is recorded so a merge that silently reverts one is reported.
 * - `exempt` — untouched upstream files that mention `agentes.chat` on purpose (tests, legal text,
 *   infrastructure URLs, the About attribution). Left alone.
 * - `renames` — the actual line pairs the identity pass produced: an original line and the line
 *   AULACBOT replaced it with. Upstream's new text is renamed by looking its lines up here, which is
 *   how a sync re-applies the same edits instead of a blanket replacement that would also rewrite the
 *   attribution, the install command and every host name.
 *
 * Run after an intentional branding change and commit the result:
 *
 *   bun run brand:manifest
 *
 * The optional argument is the upstream commit to compare against. Pass the new upstream tip after a
 * sync; without it the recorded base is reused, and on the very first run the baseline named in
 * `docs/upstream/UPSTREAM_BASELINE.md`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { contentHash, TEXT } from "./files";

const ROOT = resolve(import.meta.dir, "../..");
const MANIFEST = join(import.meta.dir, "manifest.json");
/** The manifest itself is not branded content: hashing it would make `brand:drift` report it forever. */
const SELF = relative(ROOT, MANIFEST).split(sep).join("/");
const WORD = "agentes.chat";
const BRAND = "AULACBOT";
function git(...args: string[]): Buffer {
  return execFileSync("git", ["-c", `safe.directory=${ROOT}`, "-C", ROOT, ...args], { maxBuffer: 1 << 30 });
}

/** Reads many blobs in one `git cat-file --batch` call, keyed by blob sha. */
function blobs(shas: string[]): Map<string, Buffer> {
  const out = new Map<string, Buffer>();
  if (shas.length === 0) return out;
  const raw = execFileSync("git", ["-c", `safe.directory=${ROOT}`, "-C", ROOT, "cat-file", "--batch"], {
    input: shas.map((sha) => `${sha}\n`).join(""),
    maxBuffer: 1 << 30,
  });
  let at = 0;
  while (at < raw.length) {
    const eol = raw.indexOf(0x0a, at);
    if (eol < 0) break;
    const header = raw.subarray(at, eol).toString("utf8");
    at = eol + 1;
    const parts = header.split(" ");
    // A sha git does not have answers "<sha> missing": no type, no size, no body to skip.
    if (parts.length < 3) continue;
    const size = Number(parts[2]);
    if (!Number.isFinite(size)) continue;
    out.set(parts[0] as string, raw.subarray(at, at + size));
    at += size + 1;
  }
  return out;
}

/** The upstream commit this fork started from, as recorded in `docs/upstream/UPSTREAM_BASELINE.md`. */
const FIRST_BASE = "50ca784dd4c83efbc7ca916a6f07faa8accfe7f6";

const recorded = existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")).base as string) : FIRST_BASE;
const base = process.argv[2] ?? recorded;
if (!/^[0-9a-f]{7,40}$/.test(base)) {
  console.error(`not a commit: ${base}`);
  process.exit(1);
}

/** Path → blob sha at a commit. */
function tree(rev: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const row of git("ls-tree", "-r", rev).toString("utf8").split("\n")) {
    const tab = row.indexOf("\t");
    if (tab < 0) continue;
    // `100644 blob <sha>\t<path>`: the sha ends where the tab starts, never at the next space.
    out.set(row.slice(tab + 1), row.slice(0, tab).split(" ")[2] as string);
  }
  return out;
}

const baseShas = tree(base);

/**
 * The working tree, not `HEAD`: the manifest is written before the sync commit exists, so recording
 * what is committed would record the previous state and immediately report drift.
 */
const current = new Map<string, Buffer>();
for (const path of git("ls-files", "-z", "--cached", "--others", "--exclude-standard").toString("utf8").split("\0")) {
  if (!path) continue;
  try {
    current.set(path, readFileSync(join(ROOT, path)));
  } catch {
    // A file deleted but not yet staged; it is not part of the tree being recorded.
  }
}

const status = new Map<string, string>();
for (const row of git("diff", "--name-status", "--no-renames", base).toString("utf8").split("\n")) {
  const [kind, ...rest] = row.split("\t");
  if (kind && rest[0]) status.set(rest.join("\t"), kind);
}

/** Every blob the comparison needs — both sides — in one pass. */
const wanted = new Set<string>();
for (const [path, kind] of status) {
  if (kind !== "M" && kind !== "A") continue;
  const before = baseShas.get(path);
  if (before) wanted.add(before);
}
const content = blobs([...wanted]);

const mechanical: string[] = [];
const crafted: Record<string, string> = {};
const renames = new Map<string, string>();
let added = 0;
let removed = 0;

for (const [path, kind] of status) {
  if (path === SELF) continue;
  if (kind === "D") {
    removed++;
    continue;
  }
  if (kind === "A") {
    added++;
    crafted[path] = contentHash(path, current.get(path) as Buffer);
    continue;
  }
  const head = current.get(path);
  const before = content.get(baseShas.get(path) as string);
  if (
    TEXT.test(path) &&
    head &&
    before &&
    before.toString("utf8").replaceAll(WORD, BRAND) === head.toString("utf8").replaceAll("\r\n", "\n")
  ) {
    mechanical.push(path);
    // A mechanical file is the substitution end to end, so each changed line is a pair as well.
    const beforeLines = before.toString("utf8").replaceAll("\r\n", "\n").split("\n");
    const headLines = head.toString("utf8").replaceAll("\r\n", "\n").split("\n");
    if (beforeLines.length === headLines.length) {
      for (let i = 0; i < beforeLines.length; i++) {
        const from = beforeLines[i] as string;
        const to = headLines[i] as string;
        if (from !== to && from.includes(WORD) && !to.includes(WORD)) renames.set(from, to);
      }
    }
    continue;
  }
  if (head) crafted[path] = contentHash(path, head);
}

/**
 * Handcrafted files rename lines too, and those pairs matter most: they are the ones a sync collides
 * with. Collected from a line diff against the base, so a pair exists only where AULACBOT really did
 * replace something.
 */
for (const [path, kind] of status) {
  if (kind !== "M" || !TEXT.test(path) || mechanical.includes(path)) continue;
  const before = content.get(baseShas.get(path) as string);
  const head = current.get(path);
  if (!before || !head) continue;
  const beforeLines = before.toString("utf8").replaceAll("\r\n", "\n").split("\n");
  const headLines = head.toString("utf8").replaceAll("\r\n", "\n").split("\n");
  const headSet = new Set(headLines);
  for (const line of beforeLines) {
    if (!line.includes(WORD) || headSet.has(line)) continue;
    const renamed = line.replaceAll(WORD, BRAND);
    if (headSet.has(renamed) && renamed !== line) renames.set(line, renamed);
  }
}

/**
 * Files that keep `agentes.chat` on purpose: any file outside the mechanical set that still says it.
 * Crafted files belong here too — a hand-made page may quote the upstream name in its copy and must
 * not be swept up by a later rebrand run.
 */
const mechanicalSet = new Set(mechanical);
const exempt: string[] = [];
for (const [path, bytes] of current) {
  if (path === SELF) continue;
  if (mechanicalSet.has(path) || !TEXT.test(path)) continue;
  if (bytes.includes(WORD)) exempt.push(path);
}

const manifest = {
  base,
  word: WORD,
  brand: BRAND,
  mechanical: mechanical.sort(),
  crafted: Object.fromEntries(Object.entries(crafted).sort(([a], [b]) => a.localeCompare(b))),
  exempt: exempt.sort(),
  renames: Object.fromEntries([...renames].sort(([a], [b]) => a.localeCompare(b))),
};
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `manifest written: ${mechanical.length} mechanical, ${Object.keys(crafted).length} crafted ` +
    `(${added} added, ${removed} removed), ${exempt.length} exempt, ${renames.size} renamed line(s)`,
);
