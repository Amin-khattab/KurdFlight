import { FlightResultCard } from "./FlightResultCard";
import type { MockFlight } from "@/lib/mock-flights";

type FlightResultsListProps = {
  flights: MockFlight[];
  originLabel: string;
  destinationLabel: string;
  cabin: string;
  buildDetailHref: (flightId: string) => string;
};

export function FlightResultsList({
  flights,
  originLabel,
  destinationLabel,
  cabin,
  buildDetailHref,
}: FlightResultsListProps) {
  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightResultCard
          key={flight.id}
          flight={flight}
          originLabel={originLabel}
          destinationLabel={destinationLabel}
          cabin={cabin}
          detailHref={buildDetailHref(flight.id)}
        />
      ))}
    </div>
  );
}
