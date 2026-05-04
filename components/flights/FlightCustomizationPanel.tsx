"use client";

import { useMemo, useState } from "react";
import { FlightLegSection } from "./FlightLegSection";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { bagOptions, fareOptions, seatOptions } from "@/lib/mock-flight-options";
import type { MockFlight } from "@/lib/mock-flights";

type FlightLegConfig = {
  key: "outbound" | "return";
  title: string;
  flight: MockFlight;
  dateLabel: string;
  originName: string;
  destinationName: string;
  originCode: string;
  destinationCode: string;
};

type FlightCustomizationPanelProps = {
  legs: FlightLegConfig[];
  passengersLabel: string;
  cabin: string;
  adults: number;
  children: number;
  infants: number;
};

type LegSelection = {
  fare: string;
  bags: string;
  seat: string;
};

function findOptionById<T extends { id: string; label: string; priceDelta: number }>(options: T[], id: string) {
  return options.find((option) => option.id === id) ?? options[0];
}

function buildDefaultSelections(legs: FlightLegConfig[]) {
  return legs.reduce<Record<string, LegSelection>>((acc, leg) => {
    acc[leg.key] = {
      fare: "light",
      bags: "personal-item",
      seat: "no-seat",
    };
    return acc;
  }, {});
}

export function FlightCustomizationPanel({
  legs,
  passengersLabel,
  cabin,
  adults,
  children,
  infants,
}: FlightCustomizationPanelProps) {
  const [selections, setSelections] = useState<Record<string, LegSelection>>(() => buildDefaultSelections(legs));

  const chargeablePassengers = Math.max(1, adults + children);

  function updateSelection(legKey: string, field: keyof LegSelection, value: string) {
    setSelections((current) => ({
      ...current,
      [legKey]: {
        ...current[legKey],
        [field]: value,
      },
    }));
  }

  const baseItems = useMemo(
    () =>
      legs.map((leg) => ({
        label: `${leg.title} ticket`,
        value: `${leg.flight.airline} · ${leg.flight.flightNumber}`,
        total: leg.flight.price * chargeablePassengers,
      })),
    [chargeablePassengers, legs],
  );

  const extras = useMemo(() => {
    return legs.flatMap((leg) => {
      const selection = selections[leg.key];
      const fareOption = findOptionById(fareOptions, selection.fare);
      const bagOption = findOptionById(bagOptions, selection.bags);
      const seatOption = findOptionById(seatOptions, selection.seat);

      return [
        {
          label: `${leg.title} fare`,
          value: fareOption.label,
          totalDelta: fareOption.priceDelta * chargeablePassengers,
        },
        {
          label: `${leg.title} bags`,
          value: bagOption.label,
          totalDelta: bagOption.priceDelta * chargeablePassengers,
        },
        {
          label: `${leg.title} seats`,
          value: seatOption.label,
          totalDelta: seatOption.priceDelta * chargeablePassengers,
        },
      ];
    });
  }, [chargeablePassengers, legs, selections]);

  const totalPrice = useMemo(() => {
    const baseTotal = baseItems.reduce((sum, item) => sum + item.total, 0);
    const extrasTotal = extras.reduce((sum, item) => sum + item.totalDelta, 0);
    return baseTotal + extrasTotal;
  }, [baseItems, extras]);

  return (
    <section className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_18.5rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-3">
        {legs.map((leg) => {
          const selection = selections[leg.key];

          return (
            <FlightLegSection
              key={leg.key}
              legLabel={leg.title}
              flight={leg.flight}
              originName={leg.originName}
              destinationName={leg.destinationName}
              originCode={leg.originCode}
              destinationCode={leg.destinationCode}
              dateLabel={leg.dateLabel}
              selection={selection}
              onFareChange={(value) => updateSelection(leg.key, "fare", value)}
              onBagsChange={(value) => updateSelection(leg.key, "bags", value)}
              onSeatChange={(value) => updateSelection(leg.key, "seat", value)}
            />
          );
        })}
      </div>

      <div className="space-y-3 md:sticky md:top-6">
        <PriceSummaryCard
          passengers={`${passengersLabel} · ${cabin}`}
          baseItems={baseItems}
          chargeablePassengers={chargeablePassengers}
          extras={extras}
          totalPrice={totalPrice}
        />

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Trip help</p>
          <h3 className="mt-2 text-base font-semibold text-slate-900">Before you continue</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>Outbound and return are customized separately but summarized together.</li>
            <li>Fare, bags, and seats update the round-trip estimate immediately.</li>
            <li>Final airline pricing rules and checkout flow come in the next step.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
