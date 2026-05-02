"use client";

import { fareOptions } from "@/lib/mock-flight-options";
import { OptionSelector } from "./OptionSelector";

type FareSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FareSelector({ value, onChange }: FareSelectorProps) {
  return <OptionSelector title="Fare" value={value} options={fareOptions} onChange={onChange} />;
}
