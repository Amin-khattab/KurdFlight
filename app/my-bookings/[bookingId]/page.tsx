import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { mockAirports } from "@/lib/mock-airports";
import { mockFlights, type MockFlight } from "@/lib/mock-flights";
import { bagOptions, fareOptions, seatOptions } from "@/lib/mock-flight-options";
import { BookingDetailsActions } from "@/components/flights/BookingDetailsActions";

type BookingApiResponse = {
  booking?: {
    bookingId: string;
    status: string;
    tripType: string;
    createdAt: string;
    outboundFlightId: string;
    returnFlightId?: string | null;
    passengers?: {
      adults?: number;
      children?: number;
      infants?: number;
    } | null;
    cabin: string;
    selections?: Record<string, { fare?: string; bag?: string; bags?: string; seat?: string }> | null;
    total: string | number;
    userId?: string;
  };
};

type BookingRecord = NonNullable<BookingApiResponse["booking"]>;

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

function normalizePassengers(value: BookingRecord["passengers"]) {
  return {
    adults: Number(value?.adults ?? 0),
    children: Number(value?.children ?? 0),
    infants: Number(value?.infants ?? 0),
  };
}

function getAirport(code: string) {
  return mockAirports.find((airport) => airport.code === code) ?? null;
}

function describeStops(stops: number) {
  return stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`;
}

function getSelectionLabel(kind: "fare" | "bag" | "seat", value?: string | null) {
  const options = kind === "fare" ? fareOptions : kind === "bag" ? bagOptions : seatOptions;
  const match = options.find((option) => option.id === value);
  return match?.label ?? "Not selected";
}

function buildLegDetails(flight: MockFlight | null, label: string) {
  if (!flight) return null;

  const origin = getAirport(flight.origin);
  const destination = getAirport(flight.destination);

  return {
    label,
    route: `${origin?.city ?? flight.origin} to ${destination?.city ?? flight.destination}`,
    flight: `${flight.airline} · ${flight.flightNumber}`,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    duration: flight.duration,
    stopsLabel: describeStops(flight.stops),
    originName: origin?.name ?? flight.origin,
    destinationName: destination?.name ?? flight.destination,
    originCode: flight.origin,
    destinationCode: flight.destination,
  };
}

function buildOrigin(requestHeaders: Headers) {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  if (!host) return null;
  return `${protocol}://${host}`;
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const currentUser = await getCurrentUser();
  const { bookingId } = await params;

  if (!currentUser) {
    redirect(`/sign-in?next=/my-bookings/${bookingId}`);
  }

  if (!bookingId) notFound();

  const requestHeaders = await headers();
  const origin = buildOrigin(requestHeaders);
  if (!origin) notFound();

  const response = await fetch(`${origin}/api/booking/${encodeURIComponent(bookingId)}`, {
    cache: "no-store",
    headers: {
      cookie: requestHeaders.get("cookie") ?? "",
    },
  });

  if (!response.ok) notFound();

  const data = (await response.json()) as BookingApiResponse;
  const booking = data.booking;

  if (!booking || (booking.userId && booking.userId !== currentUser.id)) {
    notFound();
  }

  const passengers = normalizePassengers(booking.passengers);
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const outboundFlight = mockFlights.find((flight) => flight.id === booking.outboundFlightId) ?? null;
  const returnFlight = booking.returnFlightId
    ? mockFlights.find((flight) => flight.id === booking.returnFlightId) ?? null
    : null;

  const outbound = buildLegDetails(outboundFlight, "Outbound");
  const returnLeg = buildLegDetails(returnFlight, "Return");
  const outboundSelections = booking.selections?.outbound;
  const returnSelections = booking.selections?.return;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/my-bookings"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to My Bookings
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
          >
            Back to home
          </Link>
        </div>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
                Booking details
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {booking.bookingId}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                View your saved itinerary, traveler summary, selected booking options, and total.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {titleCase(booking.status)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {titleCase(booking.tripType)}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Created
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
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
        </section>

        <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            {[outbound, returnLeg].filter(Boolean).map((leg) => {
              if (!leg) return null;
              const legSelections = leg.label === "Outbound" ? outboundSelections : returnSelections;

              return (
                <article
                  key={leg.label}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {leg.label}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                        {leg.route}
                      </h2>
                      <p className="mt-2 text-sm font-medium text-slate-700">{leg.flight}</p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {leg.stopsLabel}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] md:items-center">
                    <div>
                      <p className="text-[1.6rem] font-semibold tracking-tight text-slate-900">
                        {leg.departureTime}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{leg.originName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{leg.originCode}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Duration
                      </p>
                      <div className="my-2 h-px w-full bg-slate-200" />
                      <p className="text-sm font-medium text-slate-600">{leg.duration}</p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-[1.6rem] font-semibold tracking-tight text-slate-900">
                        {leg.arrivalTime}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{leg.destinationName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{leg.destinationCode}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Fare
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {getSelectionLabel("fare", legSelections?.fare)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Bags
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {getSelectionLabel("bag", legSelections?.bag ?? legSelections?.bags)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Seats
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {getSelectionLabel("seat", legSelections?.seat)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Booking summary
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-600">Booking ID</span>
                  <span className="text-right font-medium text-slate-900">{booking.bookingId}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-600">Trip type</span>
                  <span className="font-medium text-slate-900">{titleCase(booking.tripType)}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-600">Passengers</span>
                  <span className="text-right font-medium text-slate-900">
                    {passengers.adults} adult{passengers.adults === 1 ? "" : "s"}
                    {passengers.children > 0
                      ? `, ${passengers.children} child${passengers.children === 1 ? "" : "ren"}`
                      : ""}
                    {passengers.infants > 0
                      ? `, ${passengers.infants} infant${passengers.infants === 1 ? "" : "s"}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-600">Cabin</span>
                  <span className="font-medium text-slate-900">{titleCase(booking.cabin)}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="font-semibold text-slate-900">Total paid</span>
                  <span className="text-xl font-semibold tracking-tight text-slate-900">
                    ${booking.total}
                  </span>
                </div>
              </div>
            </section>

            <BookingDetailsActions
              bookingId={booking.bookingId}
              initialStatus={booking.status}
            />

            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Continue with KurdFlight
              </p>
              <h3 className="mt-2 text-base font-semibold text-slate-900">
                Need another route?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Head back to your bookings or start a new search from the homepage.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/my-bookings"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Back to My Bookings
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Search flights
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
