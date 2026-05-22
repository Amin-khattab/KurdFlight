"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BookingLegSummary = {
  route: string;
  airports: string;
  flight: string;
  meta: string;
};

export type BookingCardData = {
  bookingId: string;
  status: string;
  tripType: string;
  createdAt: string;
  cabin: string;
  total: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  outbound: BookingLegSummary | null;
  returnLeg: BookingLegSummary | null;
};

type MyBookingsListProps = {
  initialBookings: BookingCardData[];
};

type BookingActionState =
  | { type: "cancel" | "remove"; bookingId: string }
  | null;

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClasses(status: string) {
  if (status === "cancelled") {
    return "bg-rose-50 text-rose-700";
  }

  if (status === "confirmed") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-slate-100 text-slate-700";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${month} ${day}, ${year} at ${hours}:${minutes} ${meridiem}`;
}

function EmptyState() {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl font-semibold text-blue-700">
        KF
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">No bookings left</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
        Once you confirm a trip, it will appear here with its route, traveler details, and total
        price summary.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Book a flight
        </Link>
        <Link
          href="/flights"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Explore routes
        </Link>
      </div>
    </section>
  );
}

export function MyBookingsList({ initialBookings }: MyBookingsListProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [actionState, setActionState] = useState<BookingActionState>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookingCountLabel = useMemo(() => {
    return `${bookings.length} booking${bookings.length === 1 ? "" : "s"} saved`;
  }, [bookings.length]);

  useEffect(() => {
    if (!feedbackMessage) return;

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [feedbackMessage]);

  async function handleDelete(bookingId: string) {
    setSubmittingId(bookingId);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`/api/booking/${encodeURIComponent(bookingId)}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error ?? "We couldn't remove this booking right now.");
      }

      setBookings((current) => current.filter((booking) => booking.bookingId !== bookingId));
      setActionState(null);
      setFeedbackMessage(`Booking ${bookingId} was removed from My Bookings.`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "We couldn't remove this booking right now.",
      );
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleCancel(bookingId: string) {
    setSubmittingId(bookingId);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`/api/booking/${encodeURIComponent(bookingId)}/cancel`, {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error ?? "We couldn't cancel this booking right now.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: "cancelled" } : booking,
        ),
      );
      setActionState(null);
      setFeedbackMessage(`Booking ${bookingId} is now marked as cancelled.`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "We couldn't cancel this booking right now.",
      );
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-sm text-slate-600">{bookingCountLabel}</p>
        <Link
          href="/"
          className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
        >
          Book another trip
        </Link>
      </div>

      {feedbackMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold text-emerald-900">Booking updated</p>
          <p className="mt-1 text-sm text-emerald-800">{feedbackMessage}</p>
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const totalPassengers =
              booking.passengers.adults + booking.passengers.children + booking.passengers.infants;
            const actionType = booking.status === "cancelled" ? "remove" : "cancel";
            const isConfirming =
              actionState?.bookingId === booking.bookingId && actionState.type === actionType;

            return (
              <article
                key={booking.bookingId}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-slate-900">{booking.bookingId}</p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(booking.status)}`}
                      >
                        {titleCase(booking.status)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {titleCase(booking.tripType)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Created {formatDateTime(booking.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch gap-3 sm:grid sm:grid-cols-3 lg:w-[30rem]">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Travelers
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {totalPassengers} traveler{totalPassengers === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Cabin
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {titleCase(booking.cabin)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Total
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">${booking.total}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
                  <div className="grid gap-3 md:grid-cols-2">
                    {booking.outbound ? (
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Outbound
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                          {booking.outbound.route}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {booking.outbound.flight}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {booking.outbound.meta}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {booking.outbound.airports}
                        </p>
                      </div>
                    ) : null}

                    {booking.returnLeg ? (
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Return
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                          {booking.returnLeg.route}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {booking.returnLeg.flight}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {booking.returnLeg.meta}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {booking.returnLeg.airports}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Booking summary
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Manage this reservation</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/my-bookings/${encodeURIComponent(booking.bookingId)}`}
                          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                        >
                          View details
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null);
                            setFeedbackMessage(null);
                            setActionState((current) =>
                              current?.bookingId === booking.bookingId && current.type === actionType
                                ? null
                                : { bookingId: booking.bookingId, type: actionType },
                            );
                          }}
                          aria-expanded={isConfirming}
                          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                        >
                          {actionType === "cancel" ? "Cancel booking" : "Remove"}
                        </button>
                      </div>
                    </div>

                    <dl className="mt-3 space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-slate-600">Passengers</dt>
                        <dd className="text-right font-medium text-slate-900">
                          {booking.passengers.adults} adult
                          {booking.passengers.adults === 1 ? "" : "s"}
                          {booking.passengers.children > 0
                            ? `, ${booking.passengers.children} child${
                                booking.passengers.children === 1 ? "" : "ren"
                              }`
                            : ""}
                          {booking.passengers.infants > 0
                            ? `, ${booking.passengers.infants} infant${
                                booking.passengers.infants === 1 ? "" : "s"
                              }`
                            : ""}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-slate-600">Cabin</dt>
                        <dd className="font-medium text-slate-900">{titleCase(booking.cabin)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-t border-slate-200 pt-3">
                        <dt className="font-semibold text-slate-900">Estimated total</dt>
                        <dd className="text-lg font-semibold tracking-tight text-slate-900">
                          ${booking.total}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {actionState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close booking action dialog"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => {
              if (!submittingId) {
                setActionState(null);
                setErrorMessage(null);
              }
            }}
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
            <div className="border-b border-slate-200 bg-slate-50/90 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700">
                  !
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {actionState.type === "cancel" ? "Cancel this booking?" : "Remove this booking?"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {actionState.bookingId}{" "}
                    {actionState.type === "cancel"
                      ? "will remain in your trip history with a cancelled status."
                      : "will be removed from My Bookings."}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm leading-6 text-slate-600">
                {actionState.type === "cancel"
                  ? "This keeps a realistic booking history while making it clear that the trip will no longer be used."
                  : "This action can’t be undone, but you can always create a new booking later."}
              </p>

              {errorMessage ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActionState(null);
                    setErrorMessage(null);
                  }}
                  disabled={Boolean(submittingId)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Keep booking
                </button>
                <button
                  type="button"
                  onClick={() =>
                    actionState.type === "cancel"
                      ? handleCancel(actionState.bookingId)
                      : handleDelete(actionState.bookingId)
                  }
                  disabled={Boolean(submittingId)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingId
                    ? actionState.type === "cancel"
                      ? "Cancelling..."
                      : "Removing..."
                    : actionState.type === "cancel"
                      ? "Cancel booking"
                      : "Remove booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
