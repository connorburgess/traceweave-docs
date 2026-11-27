import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import hljs from "highlight.js";
import { FLAT_NAV_ITEMS } from "./navigation";

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocPage {
  slug: string;
  href: string;
  title: string;
  description: string;
  section: string;
  status?: string;
  showWinnowingDiagram?: boolean;
  showMaintainerLine?: boolean;
  html: string;
  headings: TocHeading[];
  plainText: string;
}

export interface SearchEntry {
  href: string;
  title: string;
  section: string;
  description: string;
  headings: string[];
  body: string;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z0-9#]+;/gi, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripMarkdownToPlain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?(\[![A-Z]+\])?/gm, "")
    .replace(/[*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderMarkdown(markdown: string): {
  html: string;
  headings: TocHeading[];
} {
  const headings: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const rendered = this.parser.parseInline(tokens);
        const plain = rendered.replace(/<[^>]+>/g, "").trim();
        let id = slugifyHeading(plain) || "section";
        const count = usedIds.get(id) ?? 0;
        usedIds.set(id, count + 1);
        if (count > 0) {
          id = `${id}-${count + 1}`;
        }

        if (depth === 2 || depth === 3) {
          headings.push({ id, text: plain, level: depth });
        }

        if (depth >= 2 && depth <= 4) {
          return `<h${depth} id="${id}" class="doc-heading">${rendered}<a class="heading-anchor" href="#${id}" aria-label="Anchor link to ${escapeHtml(plain)}">#</a></h${depth}>\n`;
        }
        return `<h${depth} id="${id}">${rendered}</h${depth}>\n`;
      },

      code({ text, lang }: Tokens.Code) {
        const cleanLang = (lang || "").trim().toLowerCase();
        let highlighted: string;
        let displayLang = cleanLang || "text";

        if (cleanLang && hljs.getLanguage(cleanLang)) {
          highlighted = hljs.highlight(text, { language: cleanLang }).value;
        } else {
          highlighted = escapeHtml(text);
          if (!cleanLang) displayLang = "text";
        }

        return `<div class="code-block"><div class="code-header"><span class="code-lang">${escapeHtml(displayLang)}</span></div><pre><code class="hljs language-${escapeHtml(displayLang)}">${highlighted}</code></pre></div>\n`;
      },

      table(token: Tokens.Table) {
        const headerCells = token.header
          .map((cell, idx) => {
            const align = token.align[idx];
            const style = align ? ` style="text-align:${align}"` : "";
            return `<th${style}>${this.parser.parseInline(cell.tokens)}</th>`;
          })
          .join("");
        const bodyRows = token.rows
          .map((row) => {
            const cells = row
              .map((cell, idx) => {
                const align = token.align[idx];
                const style = align ? ` style="text-align:${align}"` : "";
                return `<td${style}>${this.parser.parseInline(cell.tokens)}</td>`;
              })
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("\n");

        return `<div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable table"><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n`;
      },

      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const safeHref = href || "";
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        const isExternal =
          safeHref.startsWith("http://") || safeHref.startsWith("https://");
        if (isExternal) {
          return `<a href="${escapeHtml(safeHref)}"${titleAttr} target="_blank" rel="noopener noreferrer" class="external-link">${text}</a>`;
        }
        return `<a href="${escapeHtml(safeHref)}"${titleAttr}>${text}</a>`;
      },

      blockquote({ tokens }: Tokens.Blockquote) {
        const inner = this.parser.parse(tokens);
        const calloutMatch = inner.match(
          /^<p>\[!(NOTE|IMPORTANT|WARNING|CAUTION)\]\s*/
        );
        if (calloutMatch) {
          const kind = calloutMatch[1].toLowerCase();
          const labelMap: Record<string, string> = {
            note: "Note",
            important: "Important",
            warning: "Limit",
            caution: "Negative result",
          };
          const cleaned = inner.replace(calloutMatch[0], "<p>");
          return `<div class="callout callout-${kind}" role="note"><div class="callout-title">${labelMap[kind]}</div>${cleaned}</div>\n`;
        }
        return `<blockquote>${inner}</blockquote>\n`;
      },
    },
  });

  const html = marked.parse(markdown) as string;
  return { html, headings };
}

function resolveDocFile(slug: string): string | null {
  const direct = path.join(CONTENT_DIR, `${slug}.md`);
  if (fs.existsSync(direct)) return direct;
  const index = path.join(CONTENT_DIR, slug, "index.md");
  if (fs.existsSync(index)) return index;
  return null;
}

export function getAllDocSlugs(): string[][] {
  return FLAT_NAV_ITEMS.filter((item) => item.slug.length > 0).map((item) =>
    item.slug.split("/")
  );
}

export function getDocBySlug(slugParts: string[]): DocPage | null {
  const slug = slugParts.join("/");
  const filePath = resolveDocFile(slug);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as {
    title?: string;
    description?: string;
    section?: string;
    status?: string;
    showWinnowingDiagram?: boolean;
    showMaintainerLine?: boolean;
  };

  const navItem = FLAT_NAV_ITEMS.find((i) => i.slug === slug);
  const { html, headings } = renderMarkdown(parsed.content);
  const plainText = stripMarkdownToPlain(parsed.content);

  return {
    slug,
    href: `/docs/${slug}`,
    title: data.title || navItem?.title || slug,
    description: data.description || "",
    section: data.section || navItem?.section || "Documentation",
    status: data.status,
    showWinnowingDiagram: Boolean(data.showWinnowingDiagram),
    showMaintainerLine: Boolean(data.showMaintainerLine),
    html,
    headings,
    plainText,
  };
}

let cachedSearchIndex: SearchEntry[] | null = null;

export function getSearchIndex(): SearchEntry[] {
  if (cachedSearchIndex) return cachedSearchIndex;

  const entries: SearchEntry[] = [
    {
      href: "/",
      title: "Traceweave — Home",
      section: "Overview",
      description:
        "Traceweave is an open specification for recognising your own work when it turns up somewhere else, and for producing evidence of the match that anyone can re-run and check.",
      headings: [
        "Where it stands today",
        "How the token-fingerprint flow works",
        "What a report records — and what stays out of scope",
        "Measured limits and findings",
      ],
      body: "Traceweave is an open specification for recognising your own work when it turns up somewhere else, and for producing evidence of the match that anyone can re-run and check. It is designed to cover any kind of work: source code, writing, images and audio. One shared evidence format sits underneath, with a profile for each medium. Your content never leaves your machine; only fingerprints are compared. Where it stands today: Go, Rust, TypeScript, JavaScript, Python and plain-text draft profiles have native implementation evidence. Offline-first registration is implemented in a private repository. Shelf publishes browser fingerprinting, comparison, report replay and a testing page; WEB.3 acceptance is bounded and WEB.4–WEB.6 remain planned in the published roadmap. Audio and external timestamp acquisition remain planned or gated. It is experimental and not yet evaluated on real-world data.",
    },
  ];

  for (const item of FLAT_NAV_ITEMS) {
    if (!item.slug) continue;
    const doc = getDocBySlug(item.slug.split("/"));
    if (!doc) continue;
    entries.push({
      href: doc.href,
      title: doc.title,
      section: doc.section,
      description: doc.description,
      headings: doc.headings.map((h) => h.text),
      body: doc.plainText.slice(0, 6000),
    });
  }

  cachedSearchIndex = entries;
  return entries;
}
