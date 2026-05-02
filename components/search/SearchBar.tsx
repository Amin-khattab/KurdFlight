"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockAirports, type AirportOption } from "@/lib/mock-airports";
import { DatePickerPopover } from "./DatePickerPopover";
import { LocationDropdown } from "./LocationDropdown";
import { PassengerPopover, type PassengerCounts } from "./PassengerPopover";

type OpenPanel = "from" | "to" | "departure" | "return" | "passengers" | null;
type TripType = "round-trip" | "one-way";
type SearchBarVariant = "hero" | "results";

type SearchBarInitialState = {
  fromCode?: string;
  toCode?: string;
  departure?: string | null;
  returnDate?: string | null;
  adults?: number;
  children?: number;
  infants?: number;
  cabin?: string;
  tripType?: TripType;
};

type SearchBarProps = {
  initialState?: SearchBarInitialState;
  submitPath?: string;
  variant?: SearchBarVariant;
};

const defaultFrom = mockAirports[0];
const defaultTo = mockAirports[4];

function findAirportByCode(code?: string | null) {
  return mockAirports.find((airport) => airport.code === code) ?? null;
}

function resolveAirport(code: string | undefined, fallback: AirportOption) {
  return findAirportByCode(code) ?? fallback;
}

function formatAirportMeta(airport: AirportOption) {
  if (airport.type === "city") {
    return `${airport.city}, ${airport.country}`;
  }

  return `${airport.city}, ${airport.country} · ${airport.code}`;
}

function formatLocationInputValue(airport: AirportOption) {
  return `${airport.city}, ${airport.country}`;
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatShortDate(date: Date | null) {
  if (!date) return "Select date";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatPassengerSummary(passengers: PassengerCounts, cabin: string) {
  const total = passengers.adults + passengers.children + passengers.infants;
  const cabinLabel = cabin
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return `${total} traveler${total > 1 ? "s" : ""}, ${cabinLabel}`;
}

function formatCabinLabel(cabin: string) {
  return cabin
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function addMonths(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function isDatePanel(panel: OpenPanel) {
  return panel === "departure" || panel === "return";
}

function buildInitialState(initialState?: SearchBarInitialState) {
  const from = resolveAirport(initialState?.fromCode, defaultFrom);
  const to = resolveAirport(initialState?.toCode, defaultTo);
  const departureDate = parseDate(initialState?.departure) ?? new Date(2026, 4, 14);
  const returnDate = parseDate(initialState?.returnDate) ?? new Date(2026, 4, 21);
  const tripType = initialState?.tripType ?? (initialState?.returnDate ? "round-trip" : "round-trip");

  return {
    from,
    to,
    fromInput: formatLocationInputValue(from),
    toInput: formatLocationInputValue(to),
    departureDate,
    returnDate,
    passengers: {
      adults: initialState?.adults ?? 1,
      children: initialState?.children ?? 0,
      infants: initialState?.infants ?? 0,
    },
    cabin: initialState?.cabin ?? "economy",
    tripType,
    dateMonth: new Date(departureDate.getFullYear(), departureDate.getMonth(), 1),
  };
}

function Header({
  tripType,
  setTripType,
  variant,
}: {
  tripType: TripType;
  setTripType: (value: TripType) => void;
  variant: SearchBarVariant;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {variant === "results" ? "Update search" : "Search flights"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {variant === "results"
            ? "Edit route, dates, and travelers without leaving the results page"
            : "Compare routes, dates, and traveler details"}
        </p>
      </div>

      <div className="inline-flex rounded-full bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setTripType("round-trip")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            tripType === "round-trip"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Round trip
        </button>
        <button
          type="button"
          onClick={() => setTripType("one-way")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            tripType === "one-way"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          One way
        </button>
      </div>
    </div>
  );
}

export function SearchBar({
  initialState,
  submitPath = "/flights",
  variant = "hero",
}: SearchBarProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const seededState = useMemo(() => buildInitialState(initialState), [initialState]);

  const [tripType, setTripType] = useState<TripType>(seededState.tripType);
  const [from, setFrom] = useState<AirportOption>(seededState.from);
  const [to, setTo] = useState<AirportOption>(seededState.to);
  const [fromInput, setFromInput] = useState(seededState.fromInput);
  const [toInput, setToInput] = useState(seededState.toInput);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [dateMonth, setDateMonth] = useState(seededState.dateMonth);
  const [dateField, setDateField] = useState<"departure" | "return">("departure");
  const [departureDate, setDepartureDate] = useState<Date | null>(seededState.departureDate);
  const [returnDate, setReturnDate] = useState<Date | null>(seededState.returnDate);
  const [passengers, setPassengers] = useState<PassengerCounts>(seededState.passengers);
  const [cabin, setCabin] = useState(seededState.cabin);

  useEffect(() => {
    setTripType(seededState.tripType);
    setFrom(seededState.from);
    setTo(seededState.to);
    setFromInput(seededState.fromInput);
    setToInput(seededState.toInput);
    setDateMonth(seededState.dateMonth);
    setDepartureDate(seededState.departureDate);
    setReturnDate(seededState.returnDate);
    setPassengers(seededState.passengers);
    setCabin(seededState.cabin);
    setOpenPanel(null);
  }, [seededState]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFrom = useMemo(() => {
    const term = fromInput.trim().toLowerCase();
    if (!term) return mockAirports.slice(0, 6);
    return mockAirports.filter((airport) =>
      [airport.name, airport.city, airport.code, airport.country].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [fromInput]);

  const filteredTo = useMemo(() => {
    const term = toInput.trim().toLowerCase();
    if (!term) return mockAirports.slice(0, 6);
    return mockAirports.filter((airport) =>
      [airport.name, airport.city, airport.code, airport.country].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [toInput]);

  function handleSelectLocation(type: "from" | "to", airport: AirportOption) {
    if (type === "from") {
      setFrom(airport);
      setFromInput(formatLocationInputValue(airport));
    } else {
      setTo(airport);
      setToInput(formatLocationInputValue(airport));
    }
    setOpenPanel(null);
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    setFromInput(formatLocationInputValue(to));
    setToInput(formatLocationInputValue(from));
  }

  function handleSelectDate(date: Date) {
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (tripType === "one-way" || dateField === "departure") {
      setDepartureDate(selectedDate);
      if (returnDate && selectedDate > returnDate) {
        setReturnDate(selectedDate);
      }
      if (tripType === "round-trip") {
        setDateField("return");
      } else {
        setOpenPanel(null);
      }
      return;
    }

    if (departureDate && selectedDate < departureDate) {
      setReturnDate(departureDate);
    } else {
      setReturnDate(selectedDate);
    }
    setOpenPanel(null);
  }

  function handleChangePassenger(type: keyof PassengerCounts, delta: number) {
    setPassengers((current) => {
      const nextValue = current[type] + delta;
      const min = type === "adults" ? 1 : 0;
      return {
        ...current,
        [type]: Math.max(min, nextValue),
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams({
      from: from.code,
      to: to.code,
      departure: departureDate ? departureDate.toISOString().slice(0, 10) : "",
      return: tripType === "round-trip" && returnDate ? returnDate.toISOString().slice(0, 10) : "",
      adults: String(passengers.adults),
      children: String(passengers.children),
      infants: String(passengers.infants),
      cabin,
      tripType,
    });

    router.push(`${submitPath}?${params.toString()}`);
  }

  function handleHoverOpen(panel: OpenPanel) {
    if (panel) setOpenPanel(panel);
  }

  function handleHoverClose(panel: OpenPanel) {
    setOpenPanel((current) => {
      if (panel === "departure" || panel === "return") {
        return isDatePanel(current) ? null : current;
      }
      return current === panel ? null : current;
    });
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] ${
        variant === "results" ? "p-4 sm:p-5" : "p-5 sm:p-6"
      }`}
    >
      <Header tripType={tripType} setTripType={setTripType} variant={variant} />

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div onMouseEnter={() => handleHoverOpen("from")} onMouseLeave={() => handleHoverClose("from")}>
            <LocationDropdown
              label="From"
              inputValue={fromInput}
              helperText={formatAirportMeta(from)}
              isOpen={openPanel === "from"}
              suggestions={filteredFrom}
              onOpen={() => setOpenPanel("from")}
              onInputChange={(value) => {
                setFromInput(value);
                setOpenPanel("from");
              }}
              onSelect={(airport) => handleSelectLocation("from", airport)}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              aria-label="Swap origin and destination"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 7h10m0 0-3-3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 17H7m0 0 3 3m-3-3 3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div onMouseEnter={() => handleHoverOpen("to")} onMouseLeave={() => handleHoverClose("to")}>
            <LocationDropdown
              label="To"
              inputValue={toInput}
              helperText={formatAirportMeta(to)}
              isOpen={openPanel === "to"}
              suggestions={filteredTo}
              onOpen={() => setOpenPanel("to")}
              onInputChange={(value) => {
                setToInput(value);
                setOpenPanel("to");
              }}
              onSelect={(airport) => handleSelectLocation("to", airport)}
            />
          </div>
        </div>

        <div className={`grid gap-4 ${variant === "results" ? "xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]" : "xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]"}`}>
          <div
            className="relative grid gap-4 md:grid-cols-2 xl:col-span-2"
            onMouseLeave={() => handleHoverClose("departure")}
          >
            <button
              type="button"
              onMouseEnter={() => {
                setDateField("departure");
                setOpenPanel("departure");
              }}
              onClick={() => {
                setDateField("departure");
                setOpenPanel("departure");
              }}
              className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Departure</span>
              <span className="mt-2 block text-base font-medium text-slate-900">{formatShortDate(departureDate)}</span>
            </button>
            <button
              type="button"
              onMouseEnter={() => {
                if (tripType === "one-way") return;
                setDateField("return");
                setOpenPanel("return");
              }}
              onClick={() => {
                if (tripType === "one-way") return;
                setDateField("return");
                setOpenPanel("return");
              }}
              disabled={tripType === "one-way"}
              className={`block w-full rounded-2xl border p-4 text-left transition ${
                tripType === "one-way"
                  ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Return</span>
              <span className="mt-2 block text-base font-medium">
                {tripType === "one-way" ? "Not needed" : formatShortDate(returnDate)}
              </span>
            </button>
            <DatePickerPopover
              isOpen={openPanel === "departure" || openPanel === "return"}
              activeField={dateField}
              month={dateMonth}
              tripType={tripType}
              departureDate={departureDate}
              returnDate={tripType === "round-trip" ? returnDate : null}
              onPrevMonth={() => setDateMonth((current) => addMonths(current, -1))}
              onNextMonth={() => setDateMonth((current) => addMonths(current, 1))}
              onSelectDate={handleSelectDate}
            />
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleHoverOpen("passengers")}
            onMouseLeave={() => handleHoverClose("passengers")}
          >
            <button
              type="button"
              onClick={() => setOpenPanel("passengers")}
              className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Passengers and cabin
              </span>
              <span className="mt-2 block text-base font-medium text-slate-900">
                {formatPassengerSummary(passengers, cabin)}
              </span>
              <span className="mt-1 block text-sm text-slate-500">{formatCabinLabel(cabin)}</span>
            </button>
            <PassengerPopover
              isOpen={openPanel === "passengers"}
              passengers={passengers}
              cabin={cabin}
              onChangePassenger={handleChangePassenger}
              onCabinChange={setCabin}
            />
          </div>
        </div>

        {variant === "hero" ? (
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">Ready to search</p>
              <p className="mt-1 text-base font-medium leading-7 text-slate-900">
                {from.code} to {to.code} with {formatPassengerSummary(passengers, cabin)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Mock search
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  No backend required
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Search flights
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">Editing results search</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {from.code} to {to.code} · {formatPassengerSummary(passengers, cabin)}
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Search
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
