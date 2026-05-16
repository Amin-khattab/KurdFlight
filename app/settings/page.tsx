import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

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
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
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
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            View My Bookings
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profile</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.name}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Coming next</p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              <li>Saved traveler preferences</li>
              <li>Password and security controls</li>
              <li>Notification settings</li>
              <li>Travel profile management</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
