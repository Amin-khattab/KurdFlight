"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { saveAuthUser } from "@/lib/auth-storage";

export default function SignUpPage() {
  const [next, setNext] = useState("/");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get("next") || "/");
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Complete all fields to create your account.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords need to match before you continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/sign_up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "We couldn't create your account right now.");
      }

      if (!data?.user?.email || !data?.user?.name) {
        throw new Error("The sign-up response was incomplete.");
      }

      saveAuthUser({
        name: data.user.name,
        email: data.user.email,
        createdAt: new Date().toISOString(),
      });

      window.location.href = next;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't create your account right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_26rem]">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Join KurdFlight
            </p>
            <h2 className="mt-4 max-w-xl text-5xl font-semibold tracking-tight text-slate-900">
              Create your account once, then move through search and booking with ease.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Save your preferences, keep your trips together, and unlock a smoother booking flow
              across KurdFlight.
            </p>
          </div>

          <AuthCard
            eyebrow="Create account"
            title="Sign up"
            description="Start saving searches, managing trips, and booking with a calmer flow."
            footer={
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href={`/sign-in?next=${encodeURIComponent(next)}`}
                  className="font-semibold text-blue-700 transition hover:text-blue-800"
                >
                  Sign in
                </Link>
              </p>
            }
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <AuthFormField
                id="name"
                label="Full name"
                value={name}
                placeholder="Amin Khattab"
                autoComplete="name"
                onChange={setName}
              />
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
                placeholder="Create a password"
                autoComplete="new-password"
                onChange={setPassword}
              />
              <AuthFormField
                id="confirm-password"
                label="Confirm password"
                type="password"
                value={confirmPassword}
                placeholder="Repeat your password"
                autoComplete="new-password"
                onChange={setConfirmPassword}
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
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          </AuthCard>
        </div>
      </div>
    </main>
  );
}
