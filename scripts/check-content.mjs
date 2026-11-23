import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SPEC_BLOB_PREFIX =
  "https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/";

const FORBIDDEN_PHRASES = [
  ["proves", "ownership"].join(" "),
  ["proof of", "ownership"].join(" "),
  ["detects", "plagiarism"].join(" "),
  ["guaran", "tee"].join(""),
  ["tamper", "proof"].join("-"),
  ["military", "grade"].join("-"),
];

const HOME_PATH_PATTERNS = [
  /(?<![A-Za-z0-9_])\/(?:Users|home)\/[A-Za-z0-9._-]+\//g,
  /[A-Za-z]:\\Users\\[A-Za-z0-9._-]+\\/g,
];

function parseArgs(argv) {
  let specDir = process.env.SPEC_CHECKOUT_DIR || null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--spec-dir" && argv[i + 1]) {
      specDir = argv[i + 1];
      i += 1;
    }
  }
  return { specDir };
}

function walkFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function rel(filePath) {
  return path.relative(ROOT, filePath);
}

function main() {
  const { specDir } = parseArgs(process.argv.slice(2));
  const errors = [];

  const manifestPath = path.join(ROOT, "content", "spec-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error("Missing content/spec-manifest.json");
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const manifestSet = new Set(manifest.files);

  if (specDir) {
    if (!fs.existsSync(specDir)) {
      console.error(`SPEC_CHECKOUT_DIR does not exist: ${specDir}`);
      process.exit(1);
    }
  }

  const contentDir = path.join(ROOT, "content");
  const srcDir = path.join(ROOT, "src");
  const mdFiles = walkFiles(contentDir, [".md"]);
  const srcFiles = walkFiles(srcDir, [".ts", ".tsx"]);
  const scanFiles = [...mdFiles, ...srcFiles];
  const readmePath = path.join(ROOT, "README.md");
  if (fs.existsSync(readmePath)) {
    scanFiles.push(readmePath);
  }

  // Collect valid internal routes from content/docs/**/*.md
  const validRoutes = new Set(["/", "/docs"]);
  for (const md of mdFiles) {
    const relative = path.relative(path.join(contentDir, "docs"), md);
    if (!relative.startsWith("..")) {
      const slug = relative.replace(/\.md$/, "").replace(/\/index$/, "");
      validRoutes.add(`/docs/${slug}`);
    }
  }

  const citedSpecPaths = new Set();
  const sourcesPagePath = path.join(contentDir, "docs", "sources.md");
  const sourcesPageCitedPaths = new Set();

  for (const filePath of scanFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split(/\r?\n/);

    // 1. Forbidden phrases & home paths
    for (let idx = 0; idx < lines.length; idx += 1) {
      const line = lines[idx];
      const lower = line.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        if (lower.includes(phrase)) {
          errors.push(
            `${rel(filePath)}:${idx + 1}: forbidden phrase "${phrase}"`
          );
        }
      }
      for (const pattern of HOME_PATH_PATTERNS) {
        pattern.lastIndex = 0;
        const match = pattern.exec(line);
        if (match) {
          errors.push(
            `${rel(filePath)}:${idx + 1}: absolute home-directory path "${match[0]}"`
          );
        }
      }
    }

    // 2. Check markdown links & bare URLs in markdown files, and hrefs in TSX
    const linkMatches = [];
    if (filePath.endsWith(".md")) {
      // Standard markdown links: [text](target)
      const mdLinkRe = /\[[^\]]*\]\(([^)\s]+(?:\s+[^)]*)?)\)/g;
      let m;
      while ((m = mdLinkRe.exec(raw)) !== null) {
        const target = m[1].trim();
        const lineNum = raw.slice(0, m.index).split(/\r?\n/).length;
        linkMatches.push({ target, lineNum });
      }
      // Autolinks: <https://...>
      const autoRe = /<(https?:\/\/[^>]+)>/g;
      while ((m = autoRe.exec(raw)) !== null) {
        const target = m[1].trim();
        const lineNum = raw.slice(0, m.index).split(/\r?\n/).length;
        linkMatches.push({ target, lineNum });
      }
    } else {
      const hrefRe = /href=["']([^"']+)["']/g;
      let m;
      while ((m = hrefRe.exec(raw)) !== null) {
        const target = m[1].trim();
        const lineNum = raw.slice(0, m.index).split(/\r?\n/).length;
        linkMatches.push({ target, lineNum });
      }
    }

    for (const { target, lineNum } of linkMatches) {
      if (target.startsWith("#") || target.includes("${")) continue;

      if (target.startsWith("http://") || target.startsWith("https://")) {
        // Malformed URL checks
        if (/\s/.test(target) || target.includes("<") || target.includes(">")) {
          errors.push(
            `${rel(filePath)}:${lineNum}: malformed external URL "${target}"`
          );
          continue;
        }
        let parsed;
        try {
          parsed = new URL(target);
        } catch {
          errors.push(
            `${rel(filePath)}:${lineNum}: unparseable external URL "${target}"`
          );
          continue;
        }
        if (
          !parsed.hostname ||
          !parsed.hostname.includes(".") ||
          parsed.hostname === "localhost"
        ) {
          errors.push(
            `${rel(filePath)}:${lineNum}: invalid hostname in URL "${target}"`
          );
          continue;
        }
        if (target.startsWith(SPEC_BLOB_PREFIX)) {
          const rest = target.slice(SPEC_BLOB_PREFIX.length);
          const specRelPath = rest.split("#")[0];
          if (!specRelPath) {
            errors.push(
              `${rel(filePath)}:${lineNum}: empty spec path in "${target}"`
            );
            continue;
          }
          if (!manifestSet.has(specRelPath)) {
            errors.push(
              `${rel(filePath)}:${lineNum}: cited spec path "${specRelPath}" not found in roadmap-v2 manifest`
            );
          }
          if (specDir) {
            const fullSpecPath = path.join(specDir, specRelPath);
            if (!fs.existsSync(fullSpecPath)) {
              errors.push(
                `${rel(filePath)}:${lineNum}: cited spec path "${specRelPath}" does not exist in SPEC_CHECKOUT_DIR`
              );
            }
          }
          citedSpecPaths.add(specRelPath);
          if (filePath === sourcesPagePath) {
            sourcesPageCitedPaths.add(specRelPath);
          }
        }
      } else if (target.startsWith("/docs")) {
        const routePath = target.split("#")[0].replace(/\/$/, "") || "/";
        if (!validRoutes.has(routePath)) {
          errors.push(
            `${rel(filePath)}:${lineNum}: broken internal docs link "${target}"`
          );
        }
      } else if (
        filePath !== readmePath &&
        !target.startsWith("/") &&
        !target.startsWith("LICENSES/") &&
        !target.endsWith(".md") &&
        !target.endsWith(".txt")
      ) {
        errors.push(
          `${rel(filePath)}:${lineNum}: unexpected relative link "${target}"`
        );
      }
    }
  }

  // 3. Ensure every cited spec file across the site is listed on /docs/sources
  if (fs.existsSync(sourcesPagePath)) {
    for (const p of citedSpecPaths) {
      if (!sourcesPageCitedPaths.has(p)) {
        errors.push(
          `content/docs/sources.md: missing cited source file "${p}"`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error(`Content check failed with ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `PASS content check: ${scanFiles.length} files scanned, ${citedSpecPaths.size} unique spec paths verified` +
      (specDir ? ` (verified against checkout and manifest)` : ` (verified against manifest)`)
  );
}

main();
