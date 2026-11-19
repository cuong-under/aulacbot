/**
 * Shared by the three brand scripts, so the manifest and the check can never disagree about what
 * "unchanged" means.
 */
import { createHash } from "node:crypto";

/** Files whose bytes are text: the only ones a `agentes.chat` → `AULACBOT` rename can apply to. */
export const TEXT =
  /\.(ts|tsx|rs|js|mjs|cjs|json|md|css|html|svg|sh|yml|yaml|toml|txt|xml|plist|entitlements|example|gitignore)$/i;

/**
 * Content hash, line endings normalised for text.
 *
 * A Windows checkout is CRLF while the git blob is LF. Hashing the blob and hashing the working copy
 * would then disagree on every text file, which is exactly the kind of false alarm that teaches
 * people to ignore the check. Binaries are hashed as they are.
 */
export function contentHash(path: string, bytes: Buffer): string {
  const body = TEXT.test(path) ? Buffer.from(bytes.toString("utf8").replaceAll("\r\n", "\n"), "utf8") : bytes;
  return createHash("sha256").update(body).digest("hex");
}
