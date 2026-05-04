"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AirportOption } from "@/lib/mock-airports";

type LocationDropdownProps = {
  label: string;
  inputValue: string;
  helperText: string;
  isOpen: boolean;
  suggestions: AirportOption[];
  onOpen: () => void;
  onInputChange: (value: string) => void;
  onSelect: (airport: AirportOption) => void;
};

export function LocationDropdown({
  label,
  inputValue,
  helperText,
  isOpen,
  suggestions,
  onOpen,
  onInputChange,
  onSelect,
}: LocationDropdownProps) {
  const safeInputValue = inputValue ?? "";
  const safeHelperText = helperText ?? "";
  const handleInputChange = onInputChange ?? (() => {});

  return (
    <div className="relative min-w-0">
      <label className="flex min-h-[5.75rem] flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-400 hover:border-blue-300 sm:min-h-[6.25rem]">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </span>
        <input
          value={safeInputValue}
          onFocus={onOpen}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder="Type a city or airport"
          className="mt-2 h-6 w-full min-w-0 border-0 p-0 text-[15px] font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
          aria-label={label}
          autoComplete="off"
        />
        <p className="mt-1 truncate text-[13px] text-slate-500">{safeHelperText}</p>
      </label>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] max-sm:max-h-[70vh]"
          >
            <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Suggested places
            </div>
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((airport) => (
                <li key={airport.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(airport)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      {airport.type === "airport" ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <path d="m3 11 18-8-5 8 5 8-18-8Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.1 7 13 7 13s7-7.9 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {airport.type === "airport" ? airport.name : `${airport.city}, ${airport.country}`}
                      </span>
                      <span className="block text-sm text-slate-500">
                        {airport.type === "airport"
                          ? `${airport.city}, ${airport.country} · ${airport.code}`
                          : "City destination"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {suggestions.length === 0 ? (
                <li className="px-4 py-6 text-sm text-slate-500">No matches found.</li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
