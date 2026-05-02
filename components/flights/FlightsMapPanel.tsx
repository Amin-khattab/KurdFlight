"use client";

import dynamic from "next/dynamic";
import type { AirportOption } from "@/lib/mock-airports";

const FlightsMap = dynamic(() => import("./FlightsMap"), {
  ssr: false,
});

type FlightsMapPanelProps = {
  origin: AirportOption | null;
  destination: AirportOption | null;
};

export function FlightsMapPanel({ origin, destination }: FlightsMapPanelProps) {
  return <FlightsMap origin={origin} destination={destination} />;
}
