import { mockFlights } from "@/lib/mock-flights";
import Link from "next/link";
import { mockAirports } from "@/lib/mock-airports";
import { prisma } from "@/lib/prisma";
import { MyBookingsList, type BookingCardData } from "@/components/flights/MyBookingsList";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

function normalizePassengers(value: unknown) {
  const passengers = (value ?? {}) as {
    adults?: number;
    children?: number;
    infants?: number;
  };

  return {
    adults: Number(passengers.adults ?? 0),
    children: Number(passengers.children ?? 0),
    infants: Number(passengers.infants ?? 0),
  };
}

function buildLegSummary(
  flight: {
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
  } | null
) {
  if (!flight) return null;

  const origin = mockAirports.find((airport) => airport.code === flight.origin);
  const destination = mockAirports.find((airport) => airport.code === flight.destination);

  return {
    route: `${origin?.city ?? flight.origin} to ${destination?.city ?? flight.destination}`,
    airports: `${origin?.name ?? flight.origin} · ${destination?.name ?? flight.destination}`,
    flight: `${flight.airline} · ${flight.flightNumber}`,
    meta: `${flight.departureTime} - ${flight.arrivalTime} · ${flight.duration} · ${
      flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`
    }`,
  };
}

export default async function MyBookingsPage() {

  const currentUser = await getCurrentUser()

  if(!currentUser){
    redirect("/sign-in?next=/my-bookings")
  }

  const bookings = await prisma.booking.findMany({
    where:{
      userId : currentUser.id
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const displayBookings = bookings.map((booking) => {
    const outboundFlight = mockFlights.find((flight) => flight.id === booking.outboundFlightId) ?? null;

    const returnFlight = mockFlights.find((flight) => flight.id === booking.returnFlightId) ?? null;

    return { ...booking, outboundFlight, returnFlight };
  });

  const clientBookings: BookingCardData[] = displayBookings.map((booking) => ({
    bookingId: booking.bookingId,
    status: booking.status,
    tripType: booking.tripType,
    createdAt:
      booking.createdAt instanceof Date
        ? booking.createdAt.toISOString()
        : String(booking.createdAt),
    cabin: booking.cabin,
    total: String(booking.total),
    passengers: normalizePassengers(booking.passengers),
    outbound: buildLegSummary(booking.outboundFlight),
    returnLeg: buildLegSummary(booking.returnFlight),
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
          >
            Back to home
          </Link>
          <Link
            href="/flights"
            className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
          >
            Explore flights
          </Link>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">My Bookings</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Your saved trips
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review your recently confirmed KurdFlight trips, now loaded from your saved booking
                records.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Search flights
            </Link>
          </div>
        </div>
        <MyBookingsList initialBookings={clientBookings} />
      </div>
    </main>
  );
}
