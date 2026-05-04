"use client";

import type { FlightDealOption } from "@/lib/mock-flight-options";

type OptionSelectorProps = {
  title: string;
  value: string;
  options: FlightDealOption[];
  onChange: (value: string) => void;
};

function formatDelta(priceDelta: number) {
  if (priceDelta === 0) return "Included";
  return `+$${priceDelta}`;
}

export function OptionSelector({ title, value, options, onChange }: OptionSelectorProps) {
  return (
    <section className="rounded-[1.1rem] border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          Select one
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {options.map((option) => {
          const active = option.id === value;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                active
                  ? "border-blue-300 bg-blue-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                  <p className="mt-1 text-xs leading-4 text-slate-600">{option.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-xs font-semibold ${active ? "text-blue-700" : "text-slate-700"}`}>
                    {formatDelta(option.priceDelta)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
