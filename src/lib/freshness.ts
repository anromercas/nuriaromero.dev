import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface FreshnessOptions {
  cwd?: string;
}

const cache = new Map<string, string | undefined>();

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function lookup(paths: readonly string[], cwd: string): string | undefined {
  try {
    const out = git(["log", "-1", "--format=%H %cI", "--", ...paths], cwd);
    if (!out) return undefined;
    const [hash, date] = out.split(" ");
    if (!hash || !date) return undefined;

    // A commit on the shallow boundary only proves "this or earlier".
    const shallowFile = resolve(
      cwd,
      git(["rev-parse", "--git-path", "shallow"], cwd),
    );
    if (existsSync(shallowFile)) {
      const boundary = readFileSync(shallowFile, "utf8")
        .split("\n")
        .map((l) => l.trim());
      if (boundary.includes(hash)) return undefined;
    }
    return date;
  } catch {
    return undefined;
  }
}

/**
 * ISO 8601 committer date (with offset) of the newest commit touching any path.
 * Returns undefined when the history cannot prove it. Memoized per cwd + paths.
 */
export function getLastModified(
  paths: readonly string[],
  options: FreshnessOptions = {},
): string | undefined {
  const cwd = options.cwd ?? process.cwd();
  const key = `${cwd}\0${paths.join("\0")}`;
  if (!cache.has(key)) cache.set(key, lookup(paths, cwd));
  return cache.get(key);
}

/** "noviembre de 2026" (es-ES, Europe/Madrid). */
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(new Date(iso));
}
