import type { MockFlight } from "@/lib/mock-flights";

type FlightTimelineProps = {
  legLabel: string;
  flight: MockFlight;
  originName: string;
  destinationName: string;
  originCode: string;
  destinationCode: string;
  dateLabel: string;
};

export function FlightTimeline({
  legLabel,
  flight,
  originName,
  destinationName,
  originCode,
  destinationCode,
  dateLabel,
}: FlightTimelineProps) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{legLabel}</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">{dateLabel}</h2>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] md:items-center">
        <div>
          <p className="text-[1.55rem] font-semibold tracking-tight text-slate-900">{flight.departureTime}</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">{originName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{originCode}</p>
        </div>

        <div className="min-w-[9rem] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{flight.airline}</p>
          <p className="mt-1 text-sm text-slate-500">{flight.flightNumber}</p>
          <div className="my-2 h-px w-full bg-slate-200" />
          <p className="text-sm font-medium text-slate-500">{flight.duration}</p>
        </div>

        <div className="md:text-right">
          <p className="text-[1.55rem] font-semibold tracking-tight text-slate-900">{flight.arrivalTime}</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">{destinationName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{destinationCode}</p>
        </div>
      </div>
    </section>
  );
}
