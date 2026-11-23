"use client";

import { useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "traceweave-theme";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMode(saved);
        applyTheme(saved);
      }
    } catch {
      // Ignore storage access errors in restricted browsing contexts.
    }
  }, []);

  function cycleTheme() {
    const next: ThemeMode =
      mode === "system" ? "light" : mode === "light" ? "dark" : "system";
    setMode(next);
    applyTheme(next);
    try {
      if (next === "system") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Ignore storage write errors.
    }
  }

  const label =
    mode === "system"
      ? "Theme: System"
      : mode === "light"
        ? "Theme: Light"
        : "Theme: Dark";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="header-btn"
      aria-label={`${label}. Activate to switch theme.`}
      title={label}
    >
      <span className="theme-dot" aria-hidden="true" data-mode={mode} />
      <span className="header-btn-text">{mode}</span>
    </button>
  );
}
