import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SPEC_BLOB_PREFIX =
  "https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/";

const FORBIDDEN_PHRASES = [
  ["proves", "ownership"].join(" "),
  ["proof of", "ownership"].join(" "),
  ["detects", "plagiarism"].join(" "),
  ["protect", "your", "work"].join(" "),
  ["guaran", "tee"].join(""),
  ["tamper", "proof"].join("-"),
  ["military", "grade"].join("-"),
];

const EXPECTED_OPENING =
  "Traceweave is an open specification for recognising your own work when it turns up somewhere else, and for producing evidence of the match that anyone can re-run and check.";

const EXPECTED_FOLLOW =
  "It is designed to cover any kind of work: source code, writing, images and audio. One shared evidence format sits underneath, with a profile for each medium. Your content never leaves your machine; only fingerprints are compared.";

const EXPECTED_STATUS =
  "Where it stands today: source code is working end to end, with Go and Rust as the first two case studies. TypeScript, JavaScript and plain text are specified. Images have been measured in two studies. More languages, audio, and signed, timestamped registration records are planned. It is experimental and not yet evaluated on real-world data.";

const REQUIRED_TEXT_CHECKS = [
  {
    file: "src/app/page.tsx",
    phrases: [
      EXPECTED_OPENING,
      EXPECTED_FOLLOW,
      EXPECTED_STATUS,
      "34 of 47 core gates met, including all 6/6 M4 gates; 27 of 55 later-profile gates met",
    ],
  },
  {
    file: "src/app/layout.tsx",
    phrases: [
      EXPECTED_OPENING,
      "openGraph:",
      'import "@fontsource/ibm-plex-sans/400.css";',
      'import "@fontsource/ibm-plex-mono/400.css";',
      'import "@fontsource/archivo/800.css";',
    ],
  },
  {
    file: "src/lib/docs.ts",
    phrases: [EXPECTED_OPENING, EXPECTED_FOLLOW, EXPECTED_STATUS],
  },
  {
    file: "content/docs/concepts.md",
    phrases: [EXPECTED_OPENING, EXPECTED_FOLLOW, EXPECTED_STATUS],
  },
  {
    file: "content/docs/governance.md",
    phrases: ["open, non-commercial, independent"],
  },
  {
    file: "content/docs/how-it-works.md",
    phrases: ["deterministic, byte-identical reports"],
  },
  {
    file: "content/docs/profiles.md",
    phrases: ["py-tokens", "107 vectors", "1,847/1,847", "b5d981c"],
  },
  {
    file: "content/docs/roadmap.md",
    phrases: ["34", "13", "M5.1", "M5.5", "M2E.0", "code-embedding-decision.md", "27", "26", "55", "m3-eval-draft-10", "py-tokens", "b5d981c", "a6066d3", "c3c17a8", "51f29d7", "5b9a881", "e-txt-1", "C2PA.3", "M4.3", "M4.4", "M4.5", "M4.6", "PY.1", "PY.2", "TXT.7", "TXT.8", "RES.1", "SK.1", "SK.2", "WEB.0", "WEB.1", "WEB.2", "d66e4b9"],
  },
  {
    file: "content/docs/evidence-and-provenance.md",
    phrases: ["traceweave-registration-draft-5", "OpenTimestamps", "tw1-", "a6066d3", "org.traceweave.registration-link", "trust-policy.md", "commitment-disclosure-review.md"],
  },
  {
    file: "content/docs/research/evaluation-protocol.md",
    phrases: ["m3-eval-draft-10"],
  },
  {
    file: "content/docs/research/image-mark-study.md",
    phrases: ["6d87d2cc", "100 / 100 (pass)", "reembed"],
  },
  {
    file: "README.md",
    phrases: [EXPECTED_OPENING],
  },
  {
    file: "src/components/SeatbeltLabsLink.tsx",
    phrases: [
      'href="https://seatbeltlabs.com"',
      'rel="noopener noreferrer"',
      "SEATBELT LABS",
    ],
  },
  {
    file: "src/components/DocsShell.tsx",
    phrases: ["<SeatbeltLabsLink", "© 2026 Seatbelt Labs"],
  },
  {
    file: "src/app/docs/[[...slug]]/page.tsx",
    phrases: ["<SeatbeltLabsLink"],
  },
  {
    file: "src/app/globals.css",
    phrases: [
      "--tw-bg: #F9F9F7;",
      "--tw-accent: #096B56;",
      "--tw-bg: #0D1014;",
      "--tw-accent: #34E5BC;",
      ".brand-wordmark-link",
      "font-weight: 800;",
      "letter-spacing: 0.075em;",
    ],
  },
  {
    file: "src/components/TraceweaveLockup.tsx",
    phrases: ["Traceweave", "currentColor", "var(--tw-accent)"],
  },
];

const ALLOWED_ENTITY_NAMES = ["Seatbelt Labs"];

const ALLOWED_EMAILS = new Set(["connor@seatbeltlabs.com"]);

const ALLOWED_EMAIL_FILES = new Set([
  "content/docs/contributing.md",
  "content/docs/governance.md",
  "src/components/DocsShell.tsx",
]);

const ALLOWED_EXTERNAL_HOSTS = new Set([
  "github.com",
  "traceweave.org",
  "docs.traceweave.org",
  "shelf.traceweave.org",
  "seatbeltlabs.com",
  "creativecommons.org",
  "www.apache.org",
]);

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

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
      EMAIL_PATTERN.lastIndex = 0;
      let emailMatch;
      while ((emailMatch = EMAIL_PATTERN.exec(line)) !== null) {
        const email = emailMatch[0].toLowerCase();
        if (!ALLOWED_EMAILS.has(email)) {
          errors.push(
            `${rel(filePath)}:${idx + 1}: email address "${emailMatch[0]}" is not permitted`
          );
        } else if (!ALLOWED_EMAIL_FILES.has(rel(filePath))) {
          errors.push(
            `${rel(filePath)}:${idx + 1}: permitted email "${emailMatch[0]}" may only appear in Contributing, Governance, and footer`
          );
        }
      }
      if (line.includes("©") && !line.includes("Unicode, Inc.")) {
        const snippet = lines.slice(idx, idx + 16).join(" ");
        const hasAllowed = ALLOWED_ENTITY_NAMES.some((name) =>
          snippet.includes(name)
        );
        if (!hasAllowed) {
          errors.push(
            `${rel(filePath)}:${idx + 1}: copyright notice names an entity outside ALLOWED_ENTITY_NAMES`
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

      if (target.startsWith("mailto:")) {
        const addr = target.slice("mailto:".length).toLowerCase();
        if (!ALLOWED_EMAILS.has(addr)) {
          errors.push(
            `${rel(filePath)}:${lineNum}: mailto target "${target}" is not in ALLOWED_EMAILS`
          );
        } else if (!ALLOWED_EMAIL_FILES.has(rel(filePath))) {
          errors.push(
            `${rel(filePath)}:${lineNum}: mailto link "${target}" is not permitted in this file`
          );
        }
        continue;
      }

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
        if (!ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname)) {
          errors.push(
            `${rel(filePath)}:${lineNum}: external host "${parsed.hostname}" is not in ALLOWED_EXTERNAL_HOSTS`
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

  // 4. Verify required intro, status, governance, and how-it-works expectations
  for (const check of REQUIRED_TEXT_CHECKS) {
    const fullPath = path.join(ROOT, check.file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`${check.file}: required file missing`);
      continue;
    }
    const raw = fs.readFileSync(fullPath, "utf8");
    const normalized = raw
      .replace(/<\/?(?:strong|em|code)>/g, "")
      .replace(/\*\*/g, "")
      .replace(/\s+/g, " ");
    for (const phrase of check.phrases) {
      if (!normalized.includes(phrase)) {
        errors.push(
          `${check.file}: missing expected statement "${phrase.slice(0, 80)}..."`
        );
      }
    }
  }

  // 5. Ensure prefers-color-scheme is never read and no amber status banner/badge exists
  const styleFiles = walkFiles(srcDir, [".css", ".ts", ".tsx"]);
  for (const filePath of styleFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    if (raw.includes("prefers-color-scheme")) {
      errors.push(
        `${rel(filePath)}: must not read prefers-color-scheme (light is always the default)`
      );
    }
    if (raw.includes("status-banner") || raw.includes("header-status")) {
      errors.push(
        `${rel(filePath)}: amber status banner/badge must not be present; keep experimental status in the Where it stands today block and footer`
      );
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
