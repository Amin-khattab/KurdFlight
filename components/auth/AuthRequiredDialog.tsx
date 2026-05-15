"use client";

import Link from "next/link";

type AuthRequiredDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  redirectTo?: string;
};

export function AuthRequiredDialog({
  isOpen,
  title = "Sign in to continue",
  description = "Create an account or sign in to continue with this step and keep your travel details in one place.",
  onClose,
  redirectTo = "/",
}: AuthRequiredDialogProps) {
  if (!isOpen) return null;

  const signInHref = `/sign-in?next=${encodeURIComponent(redirectTo)}`;
  const signUpHref = `/sign-up?next=${encodeURIComponent(redirectTo)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close sign in dialog"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.25)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Account required
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Why we ask you to sign in</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Save your searches and bookings in one place.</li>
              <li>Continue your travel flow without losing details.</li>
              <li>Get a smoother booking and confirmation experience.</li>
            </ul>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href={signInHref}
              className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Sign in
            </Link>
            <Link
              href={signUpHref}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Create account
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
