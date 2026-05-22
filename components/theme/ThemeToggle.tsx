"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  getSavedTheme,
  saveTheme,
  THEME_CHANGE_EVENT,
  type Theme,
} from "@/components/theme/theme-state";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = getSavedTheme();

    setTheme(savedTheme);
    applyTheme(savedTheme);
    setMounted(true);

    function handleThemeChange(event: Event) {
      const nextTheme = (event as CustomEvent<Theme>).detail;

      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
      }
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    saveTheme(nextTheme);
  }

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 right-5 z-[90] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)] dark:hover:border-blue-500 dark:hover:text-blue-300 dark:focus:ring-blue-950"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
        {isDark ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M12 4V2M12 22v-2M4.93 4.93 3.52 3.52M20.48 20.48l-1.41-1.41M4 12H2M22 12h-2M4.93 19.07l-1.41 1.41M20.48 3.52l-1.41 1.41"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M20 15.31A8 8 0 0 1 8.69 4 8.5 8.5 0 1 0 20 15.31Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </span>
      <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
