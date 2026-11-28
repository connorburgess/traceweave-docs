"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function DocsMotion() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Always enhance <pre> blocks with accessible Copy buttons if not already present.
    const addedCopyWraps: Array<{ wrap: HTMLElement; pre: HTMLPreElement }> = [];
    document.querySelectorAll<HTMLPreElement>("main pre").forEach((pre) => {
      if (
        pre.parentElement?.classList.contains("code-block-wrap") ||
        pre.querySelector("button")
      ) {
        return;
      }
      const code = pre.querySelector("code");
      if (!code) return;

      const wrap = document.createElement("div");
      wrap.className = "code-block-wrap";
      pre.parentNode?.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code block to clipboard");

      const live = document.createElement("span");
      live.className = "sr-only";
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");

      let timer: ReturnType<typeof setTimeout> | null = null;
      btn.addEventListener("click", async () => {
        const text = code.textContent?.trim() ?? "";
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Copied";
          btn.dataset.copied = "true";
          wrap.dataset.copied = "true";
          live.textContent = "Code copied to clipboard.";
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            btn.textContent = "Copy";
            delete btn.dataset.copied;
            delete wrap.dataset.copied;
          }, 2200);
        } catch {
          live.textContent = "Select and copy the code block above.";
        }
      });

      wrap.append(btn, live);
      addedCopyWraps.push({ wrap, pre });
    });

    // Reset scroll position to top on route navigation unless a hash target is present.
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const updateProgress = (progress: number) => {
      if (!bar) return;
      const clamped = Math.max(0, Math.min(1, progress));
      bar.style.transform = `scaleX(${clamped})`;
      bar.style.opacity = clamped > 0.004 ? "1" : "0";
    };

    // Active TOC scrollspy
    const tocLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".toc-link[href^='#']"),
    );
    const tocTargets = tocLinks
      .map((link) => {
        const id = decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "");
        const el = id ? document.getElementById(id) : null;
        return el ? { link, el } : null;
      })
      .filter((item): item is { link: HTMLAnchorElement; el: HTMLElement } =>
        Boolean(item),
      );

    const updateToc = () => {
      if (!tocTargets.length) return;
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 24;
      let active = atBottom
        ? tocTargets[tocTargets.length - 1]
        : tocTargets[0];
      if (!atBottom) {
        const probe = window.scrollY + 120;
        for (const item of tocTargets) {
          const top = item.el.getBoundingClientRect().top + window.scrollY;
          if (probe >= top) active = item;
        }
      }
      for (const item of tocTargets) {
        if (item === active) {
          item.link.setAttribute("data-active", "true");
          item.link.setAttribute("aria-current", "location");
        } else {
          item.link.removeAttribute("data-active");
          item.link.removeAttribute("aria-current");
        }
      }
    };

    if (reducedQuery.matches) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        updateProgress(max > 0 ? window.scrollY / max : 0);
        updateToc();
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        addedCopyWraps.forEach(({ wrap, pre }) => {
          if (wrap.isConnected) {
            wrap.parentNode?.insertBefore(pre, wrap);
            wrap.remove();
          }
        });
      };
    }

    let cancelled = false;
    root.classList.add("has-motion");
    root.classList.remove("hero-entered");

    let lenis: Lenis | null = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false,
      prevent: (node) =>
        Boolean(
          node.closest(
            ".sidebar, .toc-column, .search-backdrop, .search-dialog, .search-results, pre, .table-wrap",
          ),
        ),
    });

    if (!window.location.hash) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    root.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", ({ progress }) => {
      updateProgress(progress);
      updateToc();
    });

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link =
        event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const samePath =
        url.pathname.replace(/\/$/, "") ===
        window.location.pathname.replace(/\/$/, "");
      if (!samePath || !url.hash) return;
      const dest = document.querySelector<HTMLElement>(url.hash);
      if (!dest) return;
      event.preventDefault();
      lenis?.scrollTo(dest, {
        offset: -84,
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", handleAnchorClick);

    // Fluid outer-mask wave + subcopy cadence on docs homepage hero
    // (inner /docs/* articles stay 100% instant for Read mode)
    const homeH1 = document.querySelector<HTMLElement>(".home-hero h1");
    const homeRevealEls: HTMLElement[] = [];
    const homeHero = document.querySelector<HTMLElement>(".home-hero");
    if (homeHero) {
      let stepIdx = 2;
      homeHero
        .querySelectorAll<HTMLElement>(".home-lead, .home-lead-follow, .home-actions")
        .forEach((el) => {
          el.setAttribute("data-hero-reveal", String(Math.min(stepIdx, 5)));
          homeRevealEls.push(el);
          stepIdx++;
        });
      const statusBlock = document.querySelector<HTMLElement>(".home-status-block");
      if (statusBlock) {
        statusBlock.setAttribute("data-hero-reveal", "5");
        homeRevealEls.push(statusBlock);
      }
    }
    let originalH1: string | null = null;

    const splitHomeH1 = (el: HTMLElement) => {
      if (el.children.length > 0) return;
      const original = (el.textContent || "").trim();
      if (!original) return;
      originalH1 = original;
      const words = original.split(/\s+/);
      el.textContent = "";
      const probes = words.map((word, idx) => {
        const span = document.createElement("span");
        span.style.display = "inline";
        span.textContent = word;
        el.appendChild(span);
        if (idx < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
        }
        return span;
      });
      const lines: string[][] = [];
      let current: string[] = [];
      let lastTop: number | null = null;
      probes.forEach((span, idx) => {
        const top = Math.round(span.getBoundingClientRect().top / 4);
        if (lastTop !== null && top !== lastTop && current.length > 0) {
          lines.push(current);
          current = [];
        }
        current.push(words[idx]);
        lastTop = top;
      });
      if (current.length > 0) lines.push(current);

      el.textContent = "";
      lines.forEach((lineWords, lineIdx) => {
        const mask = document.createElement("span");
        mask.className = "reveal-line-mask";
        const inner = document.createElement("span");
        inner.className = "reveal-line";
        inner.style.setProperty("--line-delay", `${20 + lineIdx * 75}ms`);
        inner.textContent =
          lineWords.join(" ") + (lineIdx < lines.length - 1 ? " " : "");
        mask.appendChild(inner);
        el.appendChild(mask);
      });
    };

    const fontsReady =
      document.fonts && document.fonts.ready
        ? Promise.race([
            document.fonts.ready,
            new Promise<void>((resolve) => setTimeout(resolve, 200)),
          ])
        : Promise.resolve();

    void fontsReady.then(() => {
      if (cancelled) return;
      if (!window.location.hash) {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true, force: true });
      }
      if (homeH1) {
        splitHomeH1(homeH1);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) root.classList.add("hero-entered");
        });
      });
    });

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 24) return;
      lastWidth = window.innerWidth;
      if (homeH1 && originalH1 !== null) {
        homeH1.textContent = originalH1;
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const onReducedChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        lenis?.destroy();
        lenis = null;
        root.classList.remove("has-motion", "hero-entered", "lenis", "lenis-smooth");
        if (homeH1 && originalH1 !== null && homeH1.isConnected) {
          homeH1.textContent = originalH1;
        }
      }
    };
    reducedQuery.addEventListener("change", onReducedChange);

    updateProgress(0);
    updateToc();

    return () => {
      cancelled = true;
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("resize", handleResize);
      reducedQuery.removeEventListener("change", onReducedChange);
      lenis?.destroy();
      lenis = null;
      root.classList.remove("lenis", "lenis-smooth");
      if (homeH1 && originalH1 !== null && homeH1.isConnected) {
        homeH1.textContent = originalH1;
      }
      homeRevealEls.forEach((el) => {
        if (el.isConnected) el.removeAttribute("data-hero-reveal");
      });
      addedCopyWraps.forEach(({ wrap, pre }) => {
        if (wrap.isConnected) {
          wrap.parentNode?.insertBefore(pre, wrap);
          wrap.remove();
        }
      });
    };
  }, [pathname]);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
