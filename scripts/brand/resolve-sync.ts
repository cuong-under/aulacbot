/**
 * Resolves the conflicts a `git merge upstream/main` raises that are not disagreements at all: the
 * file differs from upstream only because of the `agentes.chat` → `AULACBOT` rename, so the right
 * answer is upstream's new content with that rename applied on top.
 *
 * It only touches files listed as `mechanical` in `scripts/brand/manifest.json`. A handcrafted file
 * never gets resolved here: those two sides say different things, and picking one of them by rule is
 * how a rebrand is lost.
 *
 *   bun run sync:resolve            # resolve, then re-apply the rename
 *   bun run sync:resolve --check    # report what it would do
 *   bun run sync:resolve --normalize # resolve a real edit that only collides on the rename
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "../..");
const MANIFEST = join(import.meta.dir, "manifest.json");

interface Manifest {
  word: string;
  brand: string;
  mechanical: string[];
  exempt: string[];
  renames: Record<string, string>;
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest;
const apply = !process.argv.includes("--check");
const normalize = process.argv.includes("--normalize");

/** Replaces whole lines using the recorded pairs, leaving every other occurrence alone. */
function renameKnownLines(text: string): string {
  const table = manifest.renames ?? {};
  return text
    .split("\n")
    .map((line) => table[line] ?? line)
    .join("\n");
}

function git(...args: string[]): Buffer {
  return execFileSync("git", ["-c", `safe.directory=${ROOT}`, "-C", ROOT, ...args], { maxBuffer: 1 << 30 });
}

const conflicted = git("diff", "--name-only", "--diff-filter=U").toString("utf8").split("\n").filter(Boolean);
const mechanical = new Set(manifest.mechanical);

const resolvable = conflicted.filter((path) => mechanical.has(path));
const handcrafted = conflicted.filter((path) => !mechanical.has(path));

for (const path of resolvable) {
  if (!apply) {
    console.log(`would resolve ${path}: upstream's content, then ${manifest.word} -> ${manifest.brand}`);
    continue;
  }
  // `--theirs` fails when the path was deleted on that side; a deletion is left for a human.
  try {
    git("checkout", "--theirs", "--", path);
  } catch {
    console.warn(`skipped ${path}: no upstream version (deleted?)`);
    continue;
  }
  const full = join(ROOT, path);
  const text = readFileSync(full, "utf8");
  if (text.includes(manifest.word)) writeFileSync(full, text.replaceAll(manifest.word, manifest.brand));
  git("add", "--", path);
  console.log(`resolved ${path}`);
}

if (handcrafted.length > 0) {
  console.log(`\n${handcrafted.length} handcrafted file(s) still conflict, each needs a decision:`);
  for (const path of handcrafted) console.log(`  ${path}`);
}
if (apply && resolvable.length > 0) {
  console.log(`\n${resolvable.length} mechanical conflict(s) resolved`);
}

/**
 * The second pass, for a file AULACBOT also edited by hand.
 *
 * Git conflicts because the two sides touch the same lines — but often the only reason they look
 * different is the rename, not a disagreement. So upstream's side and the base are renamed **the same
 * way AULACBOT renamed them** and the three-way merge runs again; what survives is a real
 * disagreement, and only that is left for a human.
 *
 * The subtle part is the shape of the rename. AULACBOT did not blanket-replace: `agentes.chat` still
 * appears in the About attribution, the install command and every host name, and those must stay. So
 * the rename is derived from the tree instead of guessed — every line the identity pass changed is
 * recorded as a pair, and a lookup by (original line, brand line) reproduces exactly the same edit on
 * upstream's new content. A line that is not in the table is left untouched.
 */
if (normalize) {
  const remaining = git("diff", "--name-only", "--diff-filter=U").toString("utf8").split("\n").filter(Boolean);
  const dir = mkdtempSync(join(tmpdir(), "aulac-sync-"));
  let merged = 0;
  const still: string[] = [];

  for (const path of remaining) {
    if (mechanical.has(path)) continue;
    let ours: Buffer;
    let base: Buffer;
    let theirs: Buffer;
    try {
      base = git("show", `:1:${path}`);
      ours = git("show", `:2:${path}`);
      theirs = git("show", `:3:${path}`);
    } catch {
      still.push(path);
      continue;
    }
    // A binary side has no lines to merge; leave it for a human.
    if ([ours, base, theirs].some((bytes) => bytes.includes(0))) {
      still.push(path);
      continue;
    }
    // Upstream's new lines have never been seen, so the table cannot rename them. Renaming only the
    // lines it does know, then merging, is what keeps the two sides comparable.
    const rename = (bytes: Buffer): Buffer => Buffer.from(renameKnownLines(bytes.toString("utf8")), "utf8");
    const files = ["ours", "base", "theirs"].map((name) => join(dir, name));
    writeFileSync(files[0] as string, ours);
    writeFileSync(files[1] as string, rename(base));
    writeFileSync(files[2] as string, rename(theirs));

    let result: Buffer;
    let code: number;
    try {
      result = execFileSync(
        "git",
        ["-c", `safe.directory=${ROOT}`, "merge-file", "-p", files[0], files[1], files[2]],
        { maxBuffer: 1 << 30 },
      );
      code = 0;
    } catch (error) {
      const failure = error as { status?: number; stdout?: Buffer };
      result = failure.stdout ?? Buffer.alloc(0);
      code = failure.status ?? 1;
    }
    if (code !== 0 || result.length === 0) {
      still.push(path);
      continue;
    }
    if (!apply) {
      console.log(`would merge ${path}: renamed base and upstream, no real disagreement left`);
      merged++;
      continue;
    }
    writeFileSync(join(ROOT, path), result);
    git("add", "--", path);
    console.log(`merged ${path}`);
    merged++;
  }
  rmSync(dir, { recursive: true, force: true });

  console.log(`\n${merged} file(s) ${apply ? "merged" : "mergeable"} after the rename was normalised`);
  if (still.length > 0) {
    console.log(`${still.length} file(s) keep a real conflict:`);
    for (const path of still) console.log(`  ${path}`);
  }
}
