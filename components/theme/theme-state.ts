export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "kurdflight-theme";
export const THEME_CHANGE_EVENT = "kurdflight-theme-change";

export function getSavedTheme(): Theme {
  if (typeof window === "undefined") return "light";

  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    return;
  }

  root.classList.remove("dark");
  root.style.colorScheme = "light";
}

export function saveTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}
