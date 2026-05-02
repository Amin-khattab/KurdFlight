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
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{legLabel}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{dateLabel}</h2>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-900">{flight.departureTime}</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{originName}</p>
          <p className="mt-1 text-sm text-slate-500">{originCode}</p>
        </div>

        <div className="min-w-[11rem] text-center">
          <p className="text-sm font-semibold text-slate-500">{flight.airline}</p>
          <p className="mt-1 text-sm text-slate-500">{flight.flightNumber}</p>
          <div className="my-3 h-px w-full bg-slate-200" />
          <p className="text-sm font-medium text-slate-500">{flight.duration}</p>
        </div>

        <div className="md:text-right">
          <p className="text-3xl font-semibold tracking-tight text-slate-900">{flight.arrivalTime}</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{destinationName}</p>
          <p className="mt-1 text-sm text-slate-500">{destinationCode}</p>
        </div>
      </div>
    </section>
  );
}
