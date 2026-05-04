"use client";

import { AnimatePresence, motion } from "framer-motion";

export type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
};

type PassengerPopoverProps = {
  isOpen: boolean;
  passengers: PassengerCounts;
  cabin: string;
  onChangePassenger: (type: keyof PassengerCounts, delta: number) => void;
  onCabinChange: (value: string) => void;
};

const passengerRows: Array<{ key: keyof PassengerCounts; label: string; hint: string }> = [
  { key: "adults", label: "Adults", hint: "Ages 12+" },
  { key: "children", label: "Children", hint: "Ages 2-11" },
  { key: "infants", label: "Infants", hint: "Under 2" },
];

export function PassengerPopover({
  isOpen,
  passengers,
  cabin,
  onChangePassenger,
  onCabinChange,
}: PassengerPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16 }}
          className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:left-auto sm:right-0 sm:w-[26rem] sm:p-5"
        >
          <div className="border-b border-slate-100 pb-4">
            <p className="text-sm font-semibold text-slate-900">Passengers and cabin class</p>
            <p className="mt-1 text-sm text-slate-500">Update traveler counts and seat preference.</p>
          </div>

          <div className="space-y-4 py-4">
            {passengerRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{row.label}</p>
                  <p className="text-sm text-slate-500">{row.hint}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangePassenger(row.key, -1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-700 transition hover:bg-slate-50"
                    aria-label={`Decrease ${row.label}`}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-slate-900">
                    {passengers[row.key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChangePassenger(row.key, 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-700 transition hover:bg-slate-50"
                    aria-label={`Increase ${row.label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="block text-sm font-semibold text-slate-900">Cabin class</label>
            <select
              value={cabin}
              onChange={(event) => onCabinChange(event.target.value)}
              className="mt-2 min-h-[3rem] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400"
            >
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
            </select>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
