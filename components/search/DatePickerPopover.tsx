"use client";

import { AnimatePresence, motion } from "framer-motion";

type TripType = "round-trip" | "one-way";
type ActiveField = "departure" | "return";

type DatePickerPopoverProps = {
  isOpen: boolean;
  activeField: ActiveField;
  month: Date;
  tripType: TripType;
  departureDate: Date | null;
  returnDate: Date | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
};

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
}

function isBetween(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const startValue = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endValue = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return value > startValue && value < endValue;
}

function formatDisplay(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(date)
    : "Select date";
}

function buildCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    if (dayNumber <= 0) {
      return {
        date: new Date(year, monthIndex - 1, daysInPrevMonth + dayNumber),
        currentMonth: false,
      };
    }

    if (dayNumber > daysInMonth) {
      return {
        date: new Date(year, monthIndex + 1, dayNumber - daysInMonth),
        currentMonth: false,
      };
    }

    return {
      date: new Date(year, monthIndex, dayNumber),
      currentMonth: true,
    };
  });
}

export function DatePickerPopover({
  isOpen,
  activeField,
  month,
  tripType,
  departureDate,
  returnDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: DatePickerPopoverProps) {
  const calendarDays = buildCalendarDays(month);
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(month);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16 }}
          className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 w-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:left-0 sm:right-auto sm:w-[min(34rem,calc(100vw-2rem))] sm:max-w-none sm:p-5"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Choose your travel dates</p>
              <p className="mt-1 text-sm text-slate-500">
                {tripType === "round-trip" ? "Select departure and return dates" : "Select a departure date"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  activeField === "departure" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {formatDisplay(departureDate)}
              </div>
              {tripType === "round-trip" ? (
                <div
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    activeField === "return" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {formatDisplay(returnDate)}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onPrevMonth}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Prev
            </button>
            <p className="text-center text-sm font-semibold text-slate-900">{monthLabel}</p>
            <button
              type="button"
              onClick={onNextMonth}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Next
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
            {weekDays.map((day) => (
              <span key={day} className="py-1.5">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, currentMonth }) => {
              const selected = isSameDay(date, departureDate) || isSameDay(date, returnDate);
              const inRange = tripType === "round-trip" && isBetween(date, departureDate, returnDate);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`rounded-xl px-1.5 py-2 text-sm transition sm:px-2 sm:py-3 ${
                    selected
                      ? "bg-blue-700 font-semibold text-white"
                      : inRange
                        ? "bg-blue-50 text-blue-700"
                        : currentMonth
                          ? "text-slate-900 hover:bg-slate-50"
                          : "text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
