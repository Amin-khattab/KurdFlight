"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type AuthHeaderActionsProps = {
  user: {
    name: string;
    email: string;
  } | null;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function AuthHeaderActions({ user }: AuthHeaderActionsProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const initials = useMemo(
    () => (user?.name ? getInitials(user.name) : "KF"),
    [user?.name]
  );

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/sign_out", {
        method: "POST",
      });
    } finally {
      setIsMenuOpen(false);
      router.replace("/");
      router.refresh();
      setIsSigningOut(false);
    }
  }

  return (
    <>
      {user ? (
        <>
          <div ref={menuRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white pl-2 pr-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                {initials}
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-sky-400" />
              </span>
              <span className="hidden text-left lg:block">
                <span className="block max-w-[8.5rem] truncate text-sm font-semibold leading-4 text-slate-900">
                  {user.name}
                </span>
              </span>
              <svg
                className={`h-4 w-4 text-slate-400 transition ${isMenuOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[18.5rem] overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white shadow-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/my-bookings"
                    className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>My Bookings</span>
                    <span className="text-slate-400">Trips</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Settings</span>
                    <span className="text-slate-400">Account</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                    <span className="text-slate-400">Exit</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Link
            href="/sign-in?next=%2F"
            className="hidden h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
          >
            Sign in
          </Link>
        </>
      )}
    </>
  );
}
