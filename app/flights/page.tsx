import { FlightsResultsPanel } from "@/components/flights/FlightsResultsPanel";
import { FlightsSearchBar } from "@/components/flights/FlightsSearchBar";
import { mockAirports } from "@/lib/mock-airports";

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

  const query = new URLSearchParams({
    from,
    to,
    departure:departure ?? "",
    adults:String(adults),
    children:String(children),
    infants:String(infants),
    cabin:params.cabin ?? "economy"
  })

  if(returnDate){
    query.set("return",returnDate)
  }

  const response = await fetch(
    `http://localhost:3000/api/flights/search?${query.toString()}`,
    {cache:"no-store"}
  )

  if(!response.ok){
    throw new Error("Failed to fetch flight search results")
  }

  const data = await response.json()

  const flights = data.results ?? []

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
