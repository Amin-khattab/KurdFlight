"use client";

import { bagOptions } from "@/lib/mock-flight-options";
import { OptionSelector } from "./OptionSelector";

type BagSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BagSelector({ value, onChange }: BagSelectorProps) {
  return <OptionSelector title="Bags" value={value} options={bagOptions} onChange={onChange} />;
}
