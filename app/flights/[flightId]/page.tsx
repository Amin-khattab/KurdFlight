import Link from "next/link";
import { notFound } from "next/navigation";
import { FlightCustomizationPanel } from "@/components/flights/FlightCustomizationPanel";
import { FlightDealSummary } from "@/components/flights/FlightDealSummary";
import { FlightTimeline } from "@/components/flights/FlightTimeline";
import { mockAirports } from "@/lib/mock-airports";
import { mockFlights } from "@/lib/mock-flights";
import { mockReturnFlightByOutboundId } from "@/lib/mock-round-trip";

type SearchParams = {
  from?: string;
  to?: string;
  departure?: string;
  return?: string;
  adults?: string;
  children?: string;
  infants?: string;
  cabin?: string;
  tripType?: string;
};

function findAirportByCode(code: string | undefined) {
  return mockAirports.find((airport) => airport.code === code) ?? null;
}

function formatDate(value: string | undefined) {
  if (!value) return "Flexible date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPassengers(adults: number, children: number, infants: number) {
  const total = adults + children + infants;
  return `${total} traveler${total === 1 ? "" : "s"}`;
}

function buildLegTitle(type: "outbound" | "return") {
  return type === "outbound" ? "Outbound" : "Return";
}

export default async function FlightDealPage({
  params,
  searchParams,
}: {
  params: Promise<{ flightId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { flightId } = await params;
  const query = await searchParams;
  const flight = mockFlights.find((item) => item.id === flightId);

  if (!flight) {
    notFound();
  }

  const originAirport = findAirportByCode(flight.origin);
  const destinationAirport = findAirportByCode(flight.destination);
  const adults = Number(query.adults ?? "1");
  const children = Number(query.children ?? "0");
  const infants = Number(query.infants ?? "0");
  const passengers = formatPassengers(adults, children, infants);
  const cabin = titleCase(query.cabin ?? "economy");
  const departureLabel = formatDate(query.departure);
  const tripType = query.tripType ?? (query.return ? "round-trip" : "one-way");
  const returnFlightId = mockReturnFlightByOutboundId[flight.id];
  const returnFlight = tripType === "round-trip" ? mockFlights.find((item) => item.id === returnFlightId) ?? null : null;
  const returnOriginAirport = returnFlight ? findAirportByCode(returnFlight.origin) : null;
  const returnDestinationAirport = returnFlight ? findAirportByCode(returnFlight.destination) : null;
  const returnLabel = formatDate(query.return);
  const backHref = `/flights?${new URLSearchParams({
    from: query.from ?? flight.origin,
    to: query.to ?? flight.destination,
    departure: query.departure ?? "",
    return: query.return ?? "",
    adults: String(adults),
    children: String(children),
    infants: String(infants),
    cabin: query.cabin ?? "economy",
    tripType,
  }).toString()}`;

  const legs = [
    {
      key: "outbound" as const,
      title: buildLegTitle("outbound"),
      flight,
    },
    ...(returnFlight
      ? [
          {
            key: "return" as const,
            title: buildLegTitle("return"),
            flight: returnFlight,
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to results
          </Link>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {tripType === "round-trip" ? "Round trip" : "Outbound"}
          </div>
        </div>

        <FlightDealSummary
          title={`${originAirport?.city ?? flight.origin} to ${destinationAirport?.city ?? flight.destination}`}
          subtitle={`${flight.airline} · ${flight.flightNumber} · ${flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`}`}
          meta={`${departureLabel} · ${flight.departureTime} - ${flight.arrivalTime} · ${flight.duration}`}
        />

        <section className="space-y-6">
          <div className="space-y-6">
            <FlightTimeline
              legLabel="Outbound"
              flight={flight}
              originName={originAirport?.name ?? flight.origin}
              destinationName={destinationAirport?.name ?? flight.destination}
              originCode={originAirport?.code ?? flight.origin}
              destinationCode={destinationAirport?.code ?? flight.destination}
              dateLabel={departureLabel}
            />

            {returnFlight ? (
              <FlightTimeline
                legLabel="Return"
                flight={returnFlight}
                originName={returnOriginAirport?.name ?? returnFlight.origin}
                destinationName={returnDestinationAirport?.name ?? returnFlight.destination}
                originCode={returnOriginAirport?.code ?? returnFlight.origin}
                destinationCode={returnDestinationAirport?.code ?? returnFlight.destination}
                dateLabel={returnLabel}
              />
            ) : null}
          </div>
        </section>

        <FlightCustomizationPanel
          legs={legs}
          passengersLabel={passengers}
          cabin={cabin}
          adults={adults}
          children={children}
          infants={infants}
        />
      </div>
    </main>
  );
}
