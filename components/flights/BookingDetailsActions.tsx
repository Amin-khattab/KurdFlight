"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BookingDetailsActionsProps = {
  bookingId: string;
  initialStatus: string;
};

export function BookingDetailsActions({
  bookingId,
  initialStatus,
}: BookingDetailsActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const actionType = status === "cancelled" ? "remove" : "cancel";

  useEffect(() => {
    if (!feedbackMessage) return;

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [feedbackMessage]);

  async function handleConfirm() {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      if (actionType === "cancel") {
        const response = await fetch(`/api/booking/${encodeURIComponent(bookingId)}/cancel`, {
          method: "POST",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error ?? "We couldn't cancel this booking right now.");
        }

        setStatus("cancelled");
        setIsConfirming(false);
        setFeedbackMessage(`Booking ${bookingId} is now marked as cancelled.`);
        router.refresh();
        return;
      }

      const response = await fetch(`/api/booking/${encodeURIComponent(bookingId)}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error ?? "We couldn't remove this booking right now.");
      }

      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "We couldn't update this booking right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Booking actions
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {status === "cancelled"
              ? "This booking is cancelled and can be removed from your history view."
              : "Need to stop this trip? You can cancel the booking here."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsConfirming(true);
            setErrorMessage(null);
            setFeedbackMessage(null);
          }}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          {actionType === "cancel" ? "Cancel booking" : "Remove booking"}
        </button>
      </div>

      {feedbackMessage ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
          <p className="text-sm font-semibold text-emerald-900">Booking updated</p>
          <p className="mt-1 text-sm text-emerald-800">{feedbackMessage}</p>
        </div>
      ) : null}

      {isConfirming ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {actionType === "cancel" ? "Cancel this booking?" : "Remove this booking?"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {actionType === "cancel"
              ? `Booking ${bookingId} will stay in your history with a cancelled status.`
              : `Booking ${bookingId} will be removed from your saved bookings list.`}
          </p>

          {errorMessage ? (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2">
              <p className="text-sm text-rose-700">{errorMessage}</p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (isSubmitting) return;
                setIsConfirming(false);
                setErrorMessage(null);
              }}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Keep booking
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? actionType === "cancel"
                  ? "Cancelling..."
                  : "Removing..."
                : actionType === "cancel"
                  ? "Confirm cancellation"
                  : "Confirm removal"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
