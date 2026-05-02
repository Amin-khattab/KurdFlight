"use client";

import { useMemo, useState } from "react";
import { FlightResultsList } from "./FlightResultsList";
import {
  FlightsFilters,
  type DepartureBucket,
  type DurationFilter,
  type PriceFilter,
  type SortOption,
  type StopsFilter,
} from "./FlightsFilters";
import { FlightsMapPanel } from "./FlightsMapPanel";
import type { MockFlight } from "@/lib/mock-flights";
import type { AirportOption } from "@/lib/mock-airports";

type FlightsResultsPanelProps = {
  initialFlights: MockFlight[];
  originLabel: string;
  destinationLabel: string;
  cabin: string;
  initialSortBy: string;
  originAirport: AirportOption | null;
  destinationAirport: AirportOption | null;
  detailQuery: Record<string, string>;
};

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getDepartureBucket(time: string): DepartureBucket {
  const minutes = toMinutes(time);
  if (minutes >= 300 && minutes < 720) return "morning";
  if (minutes >= 720 && minutes < 1020) return "afternoon";
  if (minutes >= 1020 && minutes < 1320) return "evening";
  return "night";
}

function normalizeSort(value: string): SortOption {
  switch (value.toLowerCase()) {
    case "cheapest":
      return "cheapest";
    case "fastest":
      return "fastest";
    case "earliest departure":
    case "earliest":
      return "earliest";
    default:
      return "recommended";
  }
}

function applySorting(flights: MockFlight[], sortBy: SortOption) {
  const sorted = [...flights];

  switch (sortBy) {
    case "cheapest":
      return sorted.sort((a, b) => a.price - b.price);
    case "fastest":
      return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case "earliest":
      return sorted.sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime));
    case "recommended":
    default:
      return sorted.sort((a, b) => {
        const badgeScore = (flight: MockFlight) =>
          flight.badge === "Best" ? 0 : flight.badge === "Cheapest" ? 1 : flight.badge === "Fastest" ? 2 : 3;
        return badgeScore(a) - badgeScore(b) || a.price - b.price;
      });
  }
}

export function FlightsResultsPanel({
  initialFlights,
  originLabel,
  destinationLabel,
  cabin,
  initialSortBy,
  originAirport,
  destinationAirport,
  detailQuery,
}: FlightsResultsPanelProps) {
  const [sortBy, setSortBy] = useState<SortOption>(normalizeSort(initialSortBy));
  const [stops, setStops] = useState<StopsFilter>("any");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureBuckets, setDepartureBuckets] = useState<DepartureBucket[]>([]);
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("any");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("any");

  const airlines = useMemo(
    () => Array.from(new Set(initialFlights.map((flight) => flight.airline))).sort(),
    [initialFlights],
  );

  const filteredFlights = useMemo(() => {
    let flights = [...initialFlights];

    if (stops === "nonstop") {
      flights = flights.filter((flight) => flight.stops === 0);
    } else if (stops === "1-stop") {
      flights = flights.filter((flight) => flight.stops === 1);
    } else if (stops === "2-plus") {
      flights = flights.filter((flight) => flight.stops >= 2);
    }

    if (selectedAirlines.length > 0) {
      flights = flights.filter((flight) => selectedAirlines.includes(flight.airline));
    }

    if (departureBuckets.length > 0) {
      flights = flights.filter((flight) => departureBuckets.includes(getDepartureBucket(flight.departureTime)));
    }

    if (durationFilter === "under-180") {
      flights = flights.filter((flight) => flight.durationMinutes < 180);
    } else if (durationFilter === "under-240") {
      flights = flights.filter((flight) => flight.durationMinutes < 240);
    } else if (durationFilter === "under-360") {
      flights = flights.filter((flight) => flight.durationMinutes < 360);
    }

    if (priceFilter === "under-150") {
      flights = flights.filter((flight) => flight.price < 150);
    } else if (priceFilter === "under-200") {
      flights = flights.filter((flight) => flight.price < 200);
    } else if (priceFilter === "under-250") {
      flights = flights.filter((flight) => flight.price < 250);
    } else if (priceFilter === "under-300") {
      flights = flights.filter((flight) => flight.price < 300);
    }

    return applySorting(flights, sortBy);
  }, [departureBuckets, durationFilter, initialFlights, priceFilter, selectedAirlines, sortBy, stops]);

  function toggleAirline(airline: string) {
    setSelectedAirlines((current) =>
      current.includes(airline) ? current.filter((item) => item !== airline) : [...current, airline],
    );
  }

  function toggleDepartureBucket(bucket: DepartureBucket) {
    setDepartureBuckets((current) =>
      current.includes(bucket) ? current.filter((item) => item !== bucket) : [...current, bucket],
    );
  }

  function clearFilters() {
    setSortBy(normalizeSort(initialSortBy));
    setStops("any");
    setSelectedAirlines([]);
    setDepartureBuckets([]);
    setDurationFilter("any");
    setPriceFilter("any");
  }

  function buildDetailHref(flightId: string) {
    const params = new URLSearchParams(detailQuery);
    return `/flights/${flightId}?${params.toString()}`;
  }

  return (
    <>
      <FlightsFilters
        resultCount={filteredFlights.length}
        sortBy={sortBy}
        stops={stops}
        airlines={airlines}
        selectedAirlines={selectedAirlines}
        departureBuckets={departureBuckets}
        durationFilter={durationFilter}
        priceFilter={priceFilter}
        onSortChange={setSortBy}
        onStopsChange={setStops}
        onToggleAirline={toggleAirline}
        onToggleDepartureBucket={toggleDepartureBucket}
        onDurationChange={setDurationFilter}
        onPriceChange={setPriceFilter}
        onClearFilters={clearFilters}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem] 2xl:grid-cols-[minmax(0,1fr)_31rem] xl:items-start">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Flights from {originLabel} to {destinationLabel}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredFlights.length} result{filteredFlights.length === 1 ? "" : "s"} · Sorted by{" "}
                {sortBy === "earliest" ? "earliest departure" : sortBy}
              </p>
            </div>
          </div>

          {filteredFlights.length > 0 ? (
            <FlightResultsList
              flights={filteredFlights}
              originLabel={originLabel}
              destinationLabel={destinationLabel}
              cabin={cabin}
              buildDetailHref={buildDetailHref}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No flights match these filters</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Try removing some filters or switching the sort option to see more mock KurdFlight results.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center xl:grid-cols-1">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-3xl font-bold text-blue-700">
                KF
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Travel smarter with KurdFlight</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>Clear mock pricing and realistic route comparison</li>
                  <li>Quick filters for nonstop, airline, time, and budget</li>
                  <li>Route map to visualize your selected journey</li>
                </ul>
              </div>
            </div>
          </div>

          <FlightsMapPanel origin={originAirport} destination={destinationAirport} />

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Booking insight</p>
            <h3 className="mt-2 text-base font-semibold text-slate-900">Best time to book</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Morning departures and nonstop routes are currently the strongest mock options for this search.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
