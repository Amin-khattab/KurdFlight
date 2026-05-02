"use client";

import { useMemo, useState } from "react";

export type SortOption = "recommended" | "cheapest" | "fastest" | "earliest";
export type StopsFilter = "any" | "nonstop" | "1-stop" | "2-plus";
export type DepartureBucket = "morning" | "afternoon" | "evening" | "night";
export type DurationFilter = "any" | "under-180" | "under-240" | "under-360";
export type PriceFilter = "any" | "under-150" | "under-200" | "under-250" | "under-300";

type FlightsFiltersProps = {
  resultCount: number;
  sortBy: SortOption;
  stops: StopsFilter;
  airlines: string[];
  selectedAirlines: string[];
  departureBuckets: DepartureBucket[];
  durationFilter: DurationFilter;
  priceFilter: PriceFilter;
  onSortChange: (value: SortOption) => void;
  onStopsChange: (value: StopsFilter) => void;
  onToggleAirline: (airline: string) => void;
  onToggleDepartureBucket: (bucket: DepartureBucket) => void;
  onDurationChange: (value: DurationFilter) => void;
  onPriceChange: (value: PriceFilter) => void;
  onClearFilters: () => void;
};

const stopsOptions: Array<{ value: StopsFilter; label: string }> = [
  { value: "any", label: "Any stops" },
  { value: "nonstop", label: "Nonstop" },
  { value: "1-stop", label: "1 stop" },
  { value: "2-plus", label: "2+ stops" },
];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "cheapest", label: "Cheapest" },
  { value: "fastest", label: "Fastest" },
  { value: "earliest", label: "Earliest departure" },
];

const departureOptions: Array<{ value: DepartureBucket; label: string }> = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
];

const durationOptions: Array<{ value: DurationFilter; label: string }> = [
  { value: "any", label: "Any duration" },
  { value: "under-180", label: "Under 3 hours" },
  { value: "under-240", label: "Under 4 hours" },
  { value: "under-360", label: "Under 6 hours" },
];

const priceOptions: Array<{ value: PriceFilter; label: string }> = [
  { value: "any", label: "Any price" },
  { value: "under-150", label: "Under $150" },
  { value: "under-200", label: "Under $200" },
  { value: "under-250", label: "Under $250" },
  { value: "under-300", label: "Under $300" },
];

function chipClasses(active: boolean) {
  return active
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300";
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${chipClasses(active)}`}
    >
      {label}
    </button>
  );
}

function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300">
      <span className="mr-2 text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-medium text-slate-900 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FlightsFilters({
  resultCount,
  sortBy,
  stops,
  airlines,
  selectedAirlines,
  departureBuckets,
  durationFilter,
  priceFilter,
  onSortChange,
  onStopsChange,
  onToggleAirline,
  onToggleDepartureBucket,
  onDurationChange,
  onPriceChange,
  onClearFilters,
}: FlightsFiltersProps) {
  const [showAllFilters, setShowAllFilters] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (stops !== "any") count += 1;
    if (selectedAirlines.length > 0) count += selectedAirlines.length;
    if (departureBuckets.length > 0) count += departureBuckets.length;
    if (durationFilter !== "any") count += 1;
    if (priceFilter !== "any") count += 1;
    return count;
  }, [departureBuckets, durationFilter, priceFilter, selectedAirlines.length, stops]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Select outbound</h2>
          <p className="mt-1 text-sm text-slate-500">
            {resultCount} matching flight{resultCount === 1 ? "" : "s"} available
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SelectControl
            label="Sort"
            value={sortBy}
            onChange={(value) => onSortChange(value as SortOption)}
            options={sortOptions}
          />
          <button
            type="button"
            onClick={() => setShowAllFilters((current) => !current)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {showAllFilters ? "Hide filters" : "Show all filters"}
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {stopsOptions.map((option) => (
          <FilterChip
            key={option.value}
            active={stops === option.value}
            label={option.label}
            onClick={() => onStopsChange(option.value)}
          />
        ))}

        <SelectControl
          label="Duration"
          value={durationFilter}
          onChange={(value) => onDurationChange(value as DurationFilter)}
          options={durationOptions}
        />

        <SelectControl
          label="Price"
          value={priceFilter}
          onChange={(value) => onPriceChange(value as PriceFilter)}
          options={priceOptions}
        />
      </div>

      {showAllFilters ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Airline</p>
              <div className="flex flex-wrap gap-2">
                {airlines.map((airline) => (
                  <FilterChip
                    key={airline}
                    active={selectedAirlines.includes(airline)}
                    label={airline}
                    onClick={() => onToggleAirline(airline)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Departure time
              </p>
              <div className="flex flex-wrap gap-2">
                {departureOptions.map((option) => (
                  <FilterChip
                    key={option.value}
                    active={departureBuckets.includes(option.value)}
                    label={option.label}
                    onClick={() => onToggleDepartureBucket(option.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
