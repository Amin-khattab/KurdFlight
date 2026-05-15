import Link from "next/link";
import { FlightsResultsPanel } from "@/components/flights/FlightsResultsPanel";
import { FlightsSearchBar } from "@/components/flights/FlightsSearchBar";
import { mockAirports } from "@/lib/mock-airports";
import { mockFlights } from "@/lib/mock-flights";

type SearchParams = {
  from?: string;
  to?: string;
  departure?: string;
  return?: string;
  adults?: string;
  children?: string;
  infants?: string;
  cabin?: string;
  sort?: string;
};

function titleCase(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function findAirportByCode(code: string | null) {
  return mockAirports.find((airport) => airport.code === code);
}

function resolveAirportCodes(code: string | null) {
  const selected = findAirportByCode(code);
  if (!selected) return [];

  if (selected.type === "city") {
    return mockAirports
      .filter((airport) => airport.city === selected.city)
      .map((airport) => airport.code);
  }

  return [selected.code];
}

function resolveMapAirport(code: string | null) {
  const selected = findAirportByCode(code);
  if (!selected) return null;

  if (selected.type === "airport") {
    return selected;
  }

  return (
    mockAirports.find((airport) => airport.city === selected.city && airport.type === "airport") ?? selected
  );
}

function resolveSearchResults(from: string, to: string) {
  const originCodes = resolveAirportCodes(from);
  const destinationCodes = resolveAirportCodes(to);

  const matchingFlights = mockFlights.filter((flight) => {
    return originCodes.includes(flight.origin) && destinationCodes.includes(flight.destination);
  });

  const fallbackFlights = mockFlights
    .filter((flight) => destinationCodes.includes(flight.destination))
    .slice(0, 4);

  return matchingFlights.length > 0 ? matchingFlights : fallbackFlights;
}

function formatRouteLabel(code: string | null) {
  const airport = findAirportByCode(code);
  if (!airport) return "Any route";
  return `${airport.city}, ${airport.country}`;
}

function formatPassengers(adults: number, children: number, infants: number) {
  const total = adults + children + infants;
  return `${total} traveler${total === 1 ? "" : "s"}`;
}

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const from = params.from ?? "EBL";
  const to = params.to ?? "IST";
  const departure = params.departure ?? null;
  const returnDate = params.return ?? null;
  const adults = Number(params.adults ?? "1");
  const children = Number(params.children ?? "0");
  const infants = Number(params.infants ?? "0");
  const cabin = titleCase(params.cabin ?? "economy");
  const sortBy = titleCase(params.sort ?? "recommended");
  const tripType = returnDate ? "round-trip" : "one-way";

  const flights = resolveSearchResults(from, to);

  const fromLabel = formatRouteLabel(from);
  const toLabel = formatRouteLabel(to);
  const originAirport = resolveMapAirport(from);
  const destinationAirport = resolveMapAirport(to);
  const detailQuery = {
    from,
    to,
    departure: departure ?? "",
    return: returnDate ?? "",
    adults: String(adults),
    children: String(children),
    infants: String(infants),
    cabin: params.cabin ?? "economy",
    tripType,
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>

        <FlightsSearchBar
          fromCode={from}
          toCode={to}
          departure={departure}
          returnDate={returnDate}
          adults={adults}
          children={children}
          infants={infants}
          cabin={params.cabin ?? "economy"}
          tripType={tripType}
        />

        <FlightsResultsPanel
          initialFlights={flights}
          originLabel={fromLabel}
          destinationLabel={toLabel}
          cabin={cabin}
          initialSortBy={sortBy}
          originAirport={originAirport}
          destinationAirport={destinationAirport}
          detailQuery={detailQuery}
        />
      </div>
    </main>
  );
}
