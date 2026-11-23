"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NAV_SECTIONS,
  getBreadcrumbs,
  getPrevNext,
} from "@/lib/navigation";
import type { SearchEntry, TocHeading } from "@/lib/docs";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";

const SPEC_REPO_URL = "https://github.com/connorburgess/traceweave-spec";
const PROJECT_HOME_URL = "https://traceweave.org";

interface DocsShellProps {
  children: React.ReactNode;
  headings?: TocHeading[];
  searchIndex: SearchEntry[];
  isHome?: boolean;
}

export function DocsShell({
  children,
  headings = [],
  searchIndex,
  isHome = false,
}: DocsShellProps) {
  const pathname = usePathname() || "/";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const breadcrumbs = getBreadcrumbs(pathname);
  const { prev, next } = getPrevNext(pathname);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prevOpen) => !prevOpen);
      } else if (
        event.key === "/" &&
        !searchOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, drawerOpen]);

  return (
    <div className="site-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setDrawerOpen((o) => !o)}
              aria-expanded={drawerOpen}
              aria-controls="docs-sidebar"
              aria-label="Toggle navigation menu"
            >
              <span className="menu-bars" aria-hidden="true" />
              <span>Menu</span>
            </button>

            <Link href="/" className="wordmark" aria-label="Traceweave home">
              traceweave
            </Link>

            <span className="header-status" role="note">
              Experimental draft (0.1.0-draft.1) — not a standard, not production software
            </span>
          </div>

          <div className="header-right">
            <button
              type="button"
              className="header-btn search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Search documentation (keyboard shortcut slash or Command K)"
            >
              <span>Search</span>
              <kbd className="kbd-hint" aria-hidden="true">
                /
              </kbd>
            </button>

            <ThemeToggle />

            <a
              href={PROJECT_HOME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="header-btn header-repo-link"
            >
              traceweave.org
            </a>

            <a
              href={SPEC_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="header-btn header-repo-link"
            >
              Spec repo
            </a>
          </div>
        </div>
      </header>

      <div
        className={`docs-grid${isHome ? " docs-grid-home" : ""}${headings.length === 0 ? " no-toc" : ""}`}
      >
        {drawerOpen && (
          <div
            className="drawer-backdrop"
            role="presentation"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <aside
          id="docs-sidebar"
          className={`sidebar${drawerOpen ? " is-open" : ""}`}
          aria-label="Documentation navigation"
        >
          <nav className="sidebar-nav">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="sidebar-section">
                <div className="sidebar-section-title">{section.title}</div>
                <ul className="sidebar-list">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`sidebar-link${active ? " is-active" : ""}`}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main id="main-content" className="main-column" tabIndex={-1}>
          {!isHome && breadcrumbs.length > 1 && (
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <ol>
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <li key={`${crumb.href}-${idx}`}>
                      {isLast ? (
                        <span aria-current="page">{crumb.label}</span>
                      ) : (
                        <Link href={crumb.href}>{crumb.label}</Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {children}

          {!isHome && (prev || next) && (
            <nav className="prev-next" aria-label="Page pagination">
              <div className="prev-next-slot">
                {prev && (
                  <Link href={prev.href} className="prev-next-link">
                    <span className="prev-next-label">Previous</span>
                    <span className="prev-next-title">{prev.title}</span>
                  </Link>
                )}
              </div>
              <div className="prev-next-slot prev-next-right">
                {next && (
                  <Link href={next.href} className="prev-next-link">
                    <span className="prev-next-label">Next</span>
                    <span className="prev-next-title">{next.title}</span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </main>

        {!isHome && headings.length > 0 && (
          <aside className="toc-column" aria-label="On this page">
            <div className="toc-inner">
              <div className="toc-title">On this page</div>
              <ul className="toc-list">
                {headings.map((h) => (
                  <li
                    key={h.id}
                    className={h.level === 3 ? "toc-item-sub" : "toc-item"}
                  >
                    <a href={`#${h.id}`} className="toc-link">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-status">
            <strong>Status:</strong> Experimental design draft (0.1.0-draft.1) —
            an open, non-commercial, independent specification. Not a standard,
            not production software. No detection accuracy or false-alarm rate
            has been measured yet.
          </div>
          <div className="footer-meta">
            <span>
              © 2026 Seatbelt Labs · Documentation prose:{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC BY 4.0
              </a>
              . Site code &amp; examples:{" "}
              <a
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apache-2.0
              </a>
              .
            </span>
            <span className="footer-links">
              <a
                href={PROJECT_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                traceweave.org
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={SPEC_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Specification repository
              </a>
              <span aria-hidden="true">·</span>
              <Link href="/docs/governance">Governance</Link>
              <span aria-hidden="true">·</span>
              <Link href="/docs/contributing">Licences &amp; contributing</Link>
              <span aria-hidden="true">·</span>
              <Link href="/docs/sources">Source index</Link>
            </span>
          </div>
        </div>
      </footer>

      <SearchModal
        entries={searchIndex}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
