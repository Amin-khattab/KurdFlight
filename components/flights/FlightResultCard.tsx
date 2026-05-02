import Link from "next/link";
import type { MockFlight } from "@/lib/mock-flights";

type FlightResultCardProps = {
  flight: MockFlight;
  originLabel: string;
  destinationLabel: string;
  cabin: string;
  detailHref: string;
};

function airlineInitials(airline: string) {
  return airline
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function badgeStyles(badge: MockFlight["badge"]) {
  switch (badge) {
    case "Best":
      return "bg-blue-50 text-blue-700";
    case "Cheapest":
      return "bg-emerald-50 text-emerald-700";
    case "Fastest":
      return "bg-amber-50 text-amber-700";
    default:
      return "";
  }
}

export function FlightResultCard({
  flight,
  originLabel,
  destinationLabel,
  cabin,
  detailHref,
}: FlightResultCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-300 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">
            {airlineInitials(flight.airline)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">{flight.airline}</h3>
              {flight.badge ? (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles(flight.badge)}`}>
                  {flight.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {flight.flightNumber} · {cabin}
            </p>
          </div>
        </div>

        <div className="grid flex-1 gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center lg:max-w-2xl">
          <div>
            <p className="text-[1.75rem] font-semibold tracking-tight text-slate-900">{flight.departureTime}</p>
            <p className="mt-1 text-sm text-slate-500">{originLabel}</p>
          </div>

          <div className="min-w-[9rem] text-center">
            <p className="text-sm font-medium text-slate-500">{flight.duration}</p>
            <div className="my-2 h-px w-full bg-slate-200" />
            <p className="text-sm text-slate-500">{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`}</p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[1.75rem] font-semibold tracking-tight text-slate-900">{flight.arrivalTime}</p>
            <p className="mt-1 text-sm text-slate-500">{destinationLabel}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[9rem] lg:items-end">
          <div>
            <p className="text-sm text-slate-500">Total from</p>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">${flight.price}</p>
          </div>
          <Link
            href={detailHref}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            View deal
          </Link>
        </div>
      </div>
    </article>
  );
}
