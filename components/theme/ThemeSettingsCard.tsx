"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  getSavedTheme,
  saveTheme,
  THEME_CHANGE_EVENT,
  type Theme,
} from "@/components/theme/theme-state";

const themeOptions: Array<{
  value: Theme;
  label: string;
  description: string;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Keep the classic bright KurdFlight interface.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use deeper surfaces for lower-light browsing.",
  },
];

export function ThemeSettingsCard() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = getSavedTheme();

    setTheme(savedTheme);
    applyTheme(savedTheme);

    function handleThemeChange(event: Event) {
      const nextTheme = (event as CustomEvent<Theme>).detail;

      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
      }
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Appearance
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Theme preference
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Light stays the default. Switch to dark mode when you want a calmer, lower-glare
            browsing experience.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Saved on this device
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {themeOptions.map((option) => {
          const isSelected = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value);
                saveTheme(option.value);
              }}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                isSelected
                  ? "border-blue-300 bg-blue-50/80 shadow-sm dark:border-blue-500/70 dark:bg-blue-950/45"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
              }`}
              aria-pressed={isSelected}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900">{option.label} mode</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-blue-700 bg-blue-700 dark:border-blue-400 dark:bg-blue-500"
                      : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950"
                  }`}
                  aria-hidden="true"
                >
                  {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
