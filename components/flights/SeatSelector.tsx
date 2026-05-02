"use client";

import { seatOptions } from "@/lib/mock-flight-options";
import { OptionSelector } from "./OptionSelector";

type SeatSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SeatSelector({ value, onChange }: SeatSelectorProps) {
  return <OptionSelector title="Seats" value={value} options={seatOptions} onChange={onChange} />;
}
