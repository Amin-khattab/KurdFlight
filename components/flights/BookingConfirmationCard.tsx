"use client";

import Link from "next/link";
import { mockAirports } from "@/lib/mock-airports";
import type { StoredBooking } from "@/lib/local-bookings";

type BookingConfirmationCardProps = {
  booking: StoredBooking;
  passengersLabel: string;
  cabin: string;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function titleCase(value?: string | null) {
  if (!value) return "Pending";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildLegSummary(flight: StoredBooking["outboundFlight"]) {
  if (!flight) return null;

  const origin = mockAirports.find((airport) => airport.code === flight.origin);
  const destination = mockAirports.find((airport) => airport.code === flight.destination);

  return {
    route: `${origin?.city ?? flight.origin} to ${destination?.city ?? flight.destination}`,
    meta: `${flight.departureTime} - ${flight.arrivalTime} · ${flight.duration} · ${
      flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`
    }`,
    flight: `${flight.airline} · ${flight.flightNumber}`,
  };
}

export function BookingConfirmationCard({
  booking,
  passengersLabel,
  cabin,
}: BookingConfirmationCardProps) {
  const outbound = buildLegSummary(booking.outboundFlight);
  const returnLeg = buildLegSummary(booking.returnFlight);

  return (
    <section className="rounded-[1.25rem] border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Booking confirmed
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Your trip is reserved
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We saved this confirmation locally in your browser so you can come back to it later.
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {titleCase(booking.status)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Booking ID</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{booking.bookingId}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Created</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{formatDateTime(booking.createdAt)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Passengers</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{passengersLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Estimated total</p>
          <p className="mt-2 text-base font-semibold text-slate-900">${booking.total}</p>
          <p className="mt-1 text-sm text-slate-500">{cabin}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {outbound ? (
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Outbound</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{outbound.route}</h3>
            <p className="mt-2 text-sm font-medium text-slate-700">{outbound.flight}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{outbound.meta}</p>
          </div>
        ) : null}

        {returnLeg ? (
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Return</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{returnLeg.route}</h3>
            <p className="mt-2 text-sm font-medium text-slate-700">{returnLeg.flight}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{returnLeg.meta}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Saved locally for later</p>
          <p className="mt-1 text-sm text-slate-500">
            A future My Bookings page can load this confirmation from your browser.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/my-bookings"
            className="inline-flex items-center justify-center rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            View My Bookings
          </Link>
          <Link
            href="/flights"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            View flights again
          </Link>
        </div>
      </div>
    </section>
  );
}
