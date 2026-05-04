import { BagSelector } from "./BagSelector";
import { FareSelector } from "./FareSelector";
import { FlightTimeline } from "./FlightTimeline";
import { SeatSelector } from "./SeatSelector";
import type { MockFlight } from "@/lib/mock-flights";

type LegSelection = {
  fare: string;
  bags: string;
  seat: string;
};

type FlightLegSectionProps = {
  legLabel: string;
  flight: MockFlight;
  originName: string;
  destinationName: string;
  originCode: string;
  destinationCode: string;
  dateLabel: string;
  selection: LegSelection;
  onFareChange: (value: string) => void;
  onBagsChange: (value: string) => void;
  onSeatChange: (value: string) => void;
};

export function FlightLegSection({
  legLabel,
  flight,
  originName,
  destinationName,
  originCode,
  destinationCode,
  dateLabel,
  selection,
  onFareChange,
  onBagsChange,
  onSeatChange,
}: FlightLegSectionProps) {
  return (
    <section className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
      <FlightTimeline
        legLabel={legLabel}
        flight={flight}
        originName={originName}
        destinationName={destinationName}
        originCode={originCode}
        destinationCode={destinationCode}
        dateLabel={dateLabel}
      />

      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{legLabel}</p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{flight.airline}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {flight.flightNumber} · {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            ${flight.price} base
          </div>
        </div>

        <div className="mt-3 grid gap-2.5 md:grid-cols-3">
          <FareSelector value={selection.fare} onChange={onFareChange} />
          <BagSelector value={selection.bags} onChange={onBagsChange} />
          <SeatSelector value={selection.seat} onChange={onSeatChange} />
        </div>
      </div>
    </section>
  );
}
