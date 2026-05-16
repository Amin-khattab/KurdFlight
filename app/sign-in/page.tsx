"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";

export default function SignInPage() {
  const [next, setNext] = useState("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get("next") || "/");
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "We couldn't sign you in right now.");
      }

      if (!data?.user?.email || !data?.user?.name) {
        throw new Error("The sign-in response was incomplete.");
      }

      window.location.assign(next);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't sign you in right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_26rem]">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              KurdFlight account
            </p>
            <h2 className="mt-4 max-w-xl text-5xl font-semibold tracking-tight text-slate-900">
              Sign in and continue your trip without losing momentum.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Keep your routes, traveler preferences, and bookings in one calm, polished place.
            </p>
          </div>

          <AuthCard
            eyebrow="Welcome back"
            title="Sign in"
            description="Continue to search, book, and manage your KurdFlight trips."
            footer={
              <p className="text-sm text-slate-600">
                New to KurdFlight?{" "}
                <Link
                  href={`/sign-up?next=${encodeURIComponent(next)}`}
                  className="font-semibold text-blue-700 transition hover:text-blue-800"
                >
                  Create an account
                </Link>
              </p>
            }
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <AuthFormField
                id="email"
                label="Email"
                type="email"
                value={email}
                placeholder="you@example.com"
                autoComplete="email"
                onChange={setEmail}
              />
              <AuthFormField
                id="password"
                label="Password"
                type="password"
                value={password}
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={setPassword}
              />

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </AuthCard>
        </div>
      </div>
    </main>
  );
}
