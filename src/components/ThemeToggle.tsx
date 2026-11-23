"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "traceweave-theme";

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMode(saved);
        applyTheme(saved);
      }
    } catch {
      // Ignore storage access errors in restricted browsing contexts.
    }
  }, []);

  function toggleTheme() {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors.
    }
  }

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="header-btn"
      aria-label="Dark theme"
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="theme-dot" aria-hidden="true" data-mode={mode} />
      <span className="header-btn-text" aria-hidden="true">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
