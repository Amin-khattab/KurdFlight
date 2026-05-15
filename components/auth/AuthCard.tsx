"use client";

import type { ReactNode } from "react";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthCard({ eyebrow, title, description, footer, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-6 border-t border-slate-200 pt-5">{footer}</div> : null}
    </div>
  );
}
