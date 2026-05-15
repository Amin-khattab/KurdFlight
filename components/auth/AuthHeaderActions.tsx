"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearAuthUser } from "@/lib/auth-storage";

type AuthHeaderActionsProps = {
  user: {
    name: string;
    email: string;
  } | null;
};

export function AuthHeaderActions({ user }: AuthHeaderActionsProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/sign_out", {
        method: "POST",
      });
    } finally {
      clearAuthUser();
      router.refresh();
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <Link
        href="/my-bookings"
        className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:inline-flex"
      >
        My Bookings
      </Link>

      {user ? (
        <>
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">Signed in</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </>
      ) : (
        <Link
          href="/sign-in?next=%2F"
          className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:inline-flex"
        >
          Sign in
        </Link>
      )}
    </>
  );
}
