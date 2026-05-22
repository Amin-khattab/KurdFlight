"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFormField } from "@/components/auth/AuthFormField";

type AccountSettingsFormsProps = {
  user: {
    name: string;
    email: string;
  };
};

type FormStatus = {
  success: string | null;
  error: string | null;
};

async function readApiMessage(response: Response) {
  const data = await response.json().catch(() => ({}));
  return {
    data,
    message:
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : null,
  };
}

export function AccountSettingsForms({ user }: AccountSettingsFormsProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileStatus, setProfileStatus] = useState<FormStatus>({ success: null, error: null });
  const [passwordStatus, setPasswordStatus] = useState<FormStatus>({ success: null, error: null });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordPanelOpen, setIsPasswordPanelOpen] = useState(false);

  useEffect(() => {
    if (!profileStatus.success && !profileStatus.error) return;

    const timeoutId = window.setTimeout(() => {
      setProfileStatus({ success: null, error: null });
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [profileStatus.success, profileStatus.error]);

  useEffect(() => {
    if (!passwordStatus.success && !passwordStatus.error) return;

    const timeoutId = window.setTimeout(() => {
      setPasswordStatus({ success: null, error: null });
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [passwordStatus.success, passwordStatus.error]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUpdatingProfile(true);
    setProfileStatus({ success: null, error: null });

    try {
      const response = await fetch("/api/auth/settings/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      const { data, message } = await readApiMessage(response);

      if (!response.ok) {
        throw new Error(message ?? "We couldn't update your profile right now.");
      }

      if (data?.user?.name) setName(data.user.name);
      if (data?.user?.email) setEmail(data.user.email);
      setProfileStatus({ success: message ?? "Profile updated.", error: null });
      router.refresh();
    } catch (error) {
      setProfileStatus({
        success: null,
        error: error instanceof Error ? error.message : "We couldn't update your profile right now.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsChangingPassword(true);
    setPasswordStatus({ success: null, error: null });

    try {
      const response = await fetch("/api/auth/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const { message } = await readApiMessage(response);

      if (!response.ok) {
        throw new Error(message ?? "We couldn't change your password right now.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setPasswordStatus({ success: message ?? "Password changed.", error: null });
      setIsPasswordPanelOpen(false);
    } catch (error) {
      setPasswordStatus({
        success: null,
        error:
          error instanceof Error ? error.message : "We couldn't change your password right now.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleProfileSubmit}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Profile
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
              Personal details
            </h2>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Account
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <AuthFormField
            id="settings-name"
            label="Name"
            value={name}
            autoComplete="name"
            onChange={setName}
          />
          <AuthFormField
            id="settings-email"
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={setEmail}
          />
        </div>

        {profileStatus.error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {profileStatus.error}
          </p>
        ) : null}
        {profileStatus.success ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {profileStatus.success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Security
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Change password
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Update your password only when you need to. Your current password is required before a
            new one can be saved.
          </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Private
          </span>
        </div>

        {passwordStatus.error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {passwordStatus.error}
          </p>
        ) : null}
        {passwordStatus.success ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {passwordStatus.success}
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Password
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">Last changed password is hidden.</p>
            <button
              type="button"
              onClick={() => {
                setIsPasswordPanelOpen(true);
                setPasswordStatus({ success: null, error: null });
              }}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-blue-700"
            >
              Change password
            </button>
          </div>
        </div>
      </form>

      {isPasswordPanelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={handlePasswordSubmit}
            className="w-full max-w-lg rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Security
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  Change password
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Enter your current password, then choose a new password with at least 8
                  characters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isChangingPassword) return;
                  setIsPasswordPanelOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setPasswordStatus({ success: null, error: null });
                }}
                disabled={isChangingPassword}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg leading-none text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
                aria-label="Close password form"
              >
                x
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <AuthFormField
                id="settings-current-password"
                label="Current password"
                type="password"
                value={currentPassword}
                autoComplete="current-password"
                onChange={setCurrentPassword}
              />
              <AuthFormField
                id="settings-new-password"
                label="New password"
                type="password"
                value={newPassword}
                autoComplete="new-password"
                onChange={setNewPassword}
              />
            </div>

            {passwordStatus.error ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {passwordStatus.error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (isChangingPassword) return;
                  setIsPasswordPanelOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setPasswordStatus({ success: null, error: null });
                }}
                disabled={isChangingPassword}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
