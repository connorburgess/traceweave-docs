"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/docs";

interface SearchResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

function buildSnippet(body: string, queryTerms: string[]): string {
  if (!body) return "";
  const lower = body.toLowerCase();
  let firstIdx = -1;
  for (const term of queryTerms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
    }
  }
  if (firstIdx === -1) {
    return body.slice(0, 150) + (body.length > 150 ? "..." : "");
  }
  const start = Math.max(0, firstIdx - 50);
  const end = Math.min(body.length, firstIdx + 120);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < body.length ? "..." : "";
  return `${prefix}${body.slice(start, end).trim()}${suffix}`;
}

function searchEntries(entries: SearchEntry[], rawQuery: string): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const entry of entries) {
    const titleLower = entry.title.toLowerCase();
    const descLower = entry.description.toLowerCase();
    const headingsLower = entry.headings.join(" ").toLowerCase();
    const bodyLower = entry.body.toLowerCase();
    const combined = `${titleLower} ${descLower} ${headingsLower} ${bodyLower}`;

    if (!terms.every((t) => combined.includes(t))) continue;

    let score = 0;
    if (titleLower.includes(query)) score += 100;
    if (headingsLower.includes(query)) score += 45;
    if (descLower.includes(query)) score += 30;
    for (const term of terms) {
      if (titleLower.includes(term)) score += 25;
      if (headingsLower.includes(term)) score += 12;
      if (descLower.includes(term)) score += 8;
      if (bodyLower.includes(term)) score += 3;
    }

    results.push({
      entry,
      score,
      snippet: buildSnippet(entry.body || entry.description, terms),
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 12);
}

export function SearchModal({
  entries,
  open,
  onClose,
}: {
  entries: SearchEntry[];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => searchEntries(entries, query),
    [entries, query]
  );

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(0);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) =>
          results.length === 0 ? 0 : (prev + 1) % results.length
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          results.length === 0
            ? 0
            : (prev - 1 + results.length) % results.length
        );
      } else if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        const target = results[activeIndex].entry.href;
        onClose();
        router.push(target);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, activeIndex, onClose, router]);

  if (!open) return null;

  return (
    <div
      className="search-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div className="search-input-row">
          <label htmlFor="docs-search-input" className="sr-only">
            Search Traceweave documentation
          </label>
          <input
            ref={inputRef}
            id="docs-search-input"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search pages, gates (M2.10, IMGF.4), profiles, limits..."
            className="search-input"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="search-close-btn"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        <div className="search-results" role="listbox" aria-label="Search results">
          {!query.trim() ? (
            <p className="search-empty">
              Type to search all {entries.length} pages locally. No data leaves
              your browser.
            </p>
          ) : results.length === 0 ? (
            <p className="search-empty">
              No matching pages found for &ldquo;{query}&rdquo;.
            </p>
          ) : (
            results.map((result, idx) => (
              <button
                key={result.entry.href}
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                className={`search-result-item${idx === activeIndex ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  onClose();
                  router.push(result.entry.href);
                }}
              >
                <div className="search-result-top">
                  <span className="search-result-title">
                    {result.entry.title}
                  </span>
                  <span className="search-result-section">
                    {result.entry.section}
                  </span>
                </div>
                <p className="search-result-snippet">{result.snippet}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
