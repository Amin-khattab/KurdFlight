"use client";

import { useMemo, useState } from "react";
import { BagSelector } from "./BagSelector";
import { FareSelector } from "./FareSelector";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { SeatSelector } from "./SeatSelector";
import { bagOptions, fareOptions, seatOptions } from "@/lib/mock-flight-options";
import type { MockFlight } from "@/lib/mock-flights";

type FlightLegConfig = {
  key: "outbound" | "return";
  title: string;
  flight: MockFlight;
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
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        {legs.map((leg) => {
          const selection = selections[leg.key];

          return (
            <div key={leg.key} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{leg.title}</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">{leg.flight.airline}</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  ${leg.flight.price} base
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FareSelector value={selection.fare} onChange={(value) => updateSelection(leg.key, "fare", value)} />
                <BagSelector value={selection.bags} onChange={(value) => updateSelection(leg.key, "bags", value)} />
                <SeatSelector value={selection.seat} onChange={(value) => updateSelection(leg.key, "seat", value)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <PriceSummaryCard
          passengers={`${passengersLabel} · ${cabin}`}
          baseItems={baseItems}
          chargeablePassengers={chargeablePassengers}
          extras={extras}
          totalPrice={totalPrice}
        />

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Trip help</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Before you continue</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Outbound and return are customized separately but summarized together.</li>
            <li>Fare, bags, and seats update the round-trip estimate immediately.</li>
            <li>Final airline pricing rules and checkout flow come in the next step.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
