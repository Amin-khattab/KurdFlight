"use client";

export const AUTH_USER_STORAGE_KEY = "kurdflight-auth-user";

export type AuthUser = {
  name: string;
  email: string;
  createdAt: string;
};

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser> | null;

    if (!parsed?.email || !parsed?.name) return null;

    return {
      name: parsed.name,
      email: parsed.email,
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("kurdflight-auth-change"));
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  window.dispatchEvent(new Event("kurdflight-auth-change"));
}

export function isAuthenticated() {
  return Boolean(getStoredAuthUser());
}
