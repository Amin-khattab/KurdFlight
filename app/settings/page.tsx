import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettingsForms } from "@/components/auth/AccountSettingsForms";
import { ThemeSettingsCard } from "@/components/theme/ThemeSettingsCard";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?next=/settings");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
          >
            Back to home
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Account settings</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">Manage your KurdFlight account</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              This is the first version of your account area. Profile, preferences, and security controls can
              be expanded here next.
            </p>
          </div>

          <Link
            href="/my-bookings"
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
          >
            View My Bookings
          </Link>
        </div>

        <AccountSettingsForms
          user={{
            name: user.name,
            email: user.email,
          }}
        />
        <ThemeSettingsCard />
      </div>
    </main>
  );
}
