"use client";

import { useEffect, useState } from "react";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { FlightLegSection } from "./FlightLegSection";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { BookingConfirmationCard } from "./BookingConfirmationCard";
import { getStoredAuthUser } from "@/lib/auth-storage";
import type { MockFlight } from "@/lib/mock-flights";
import { saveBookingToLocalStorage, type StoredBooking } from "@/lib/local-bookings";

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
  isAuthenticated?: boolean;
};

type LegSelection = {
  fare: string;
  bags: string;
  seat: string;
};

type QuoteResponse = {
  pricing?: {
    baseSubtotal?: number;
    fareSubtotal?: number;
    bagSubtotal?: number;
    seatSubtotal?: number;
    total?: number;
  };
};

type BookingNormalizationFallbacks = {
  adults: number;
  children: number;
  infants: number;
  cabin: string;
  selections: Record<string, LegSelection>;
  quoteTotalPrice: number;
};

function normalizeConfirmedBooking(
  data: any,
  fallbacks: BookingNormalizationFallbacks,
): StoredBooking | null {
  const raw = data?.booking ?? data;

  if (!raw?.bookingId) return null;

  return {
    bookingId: raw.bookingId,
    status: raw.status ?? "confirmed",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    outboundFlight: raw.outboundFlight ?? null,
    returnFlight: raw.returnFlight ?? null,
    outboundFlightId: raw.outboundFlightId ?? raw.outboundFlight?.id ?? "",
    returnFlightId: raw.returnFlightId ?? raw.returnFlight?.id ?? null,
    tripType: raw.tripType === "round-trip" ? "round-trip" : "one-way",
    passengers: {
      adults: Number(raw.passengers?.adults ?? fallbacks.adults),
      children: Number(raw.passengers?.children ?? fallbacks.children),
      infants: Number(raw.passengers?.infants ?? fallbacks.infants),
    },
    cabin: raw.cabin ?? fallbacks.cabin.toLowerCase(),
    selections: {
      outbound: raw.selections?.outbound ?? {
        fare: fallbacks.selections.outbound.fare,
        bag: fallbacks.selections.outbound.bags,
        seat: fallbacks.selections.outbound.seat,
      },
      ...(raw.selections?.return || fallbacks.selections.return
        ? {
            return: raw.selections?.return ?? {
              fare: fallbacks.selections.return?.fare ?? "light",
              bag: fallbacks.selections.return?.bags ?? "personal-item",
              seat: fallbacks.selections.return?.seat ?? "no-seat",
            },
          }
        : {}),
    },
    total: Number(raw.total ?? fallbacks.quoteTotalPrice),
  };
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
  isAuthenticated = false,
}: FlightCustomizationPanelProps) {
  const [selections, setSelections] = useState<Record<string, LegSelection>>(() => buildDefaultSelections(legs));
  const [quotes, setQuotes] = useState<Record<string, QuoteResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<StoredBooking | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchQuotes() {
      const entries = await Promise.all(
        legs.map(async (leg) => {
          const selection = selections[leg.key];
          const response = await fetch("/api/bookings/quote", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              flightId: leg.flight.id,
              fare: selection.fare,
              bag: selection.bags,
              seat: selection.seat,
              adults,
              children,
              infants,
            }),
          });
          const data = await response.json();
          return [leg.key, data] as const;
        })
      );
      setQuotes(Object.fromEntries(entries));
    }
    fetchQuotes();
  }, [legs, selections, adults, children, infants]);

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

  const quoteBaseItems = legs.map((leg) =>{
    const quote = quotes[leg.key];

    return {
      label:`${leg.title} ticket`,
      value:`${leg.flight.airline}  ${leg.flight.flightNumber}`,
      total: quote?.pricing?.baseSubtotal ?? leg.flight.price * chargeablePassengers    
    }
  })

  const quoteExtras = legs.flatMap((leg) => {
    const quote = quotes[leg.key];
    const selection = selections[leg.key]

    return [
      {
        label:`${leg.title} fare`,
        value: selection.fare,
        totalDelta: quote?.pricing?.fareSubtotal ?? 0
      },
      {
        label:`${leg.title} bags`,
        value: selection.bags,
        totalDelta: quote?.pricing?.bagSubtotal ?? 0
      },
      {
        label:`${leg.title} seats`,
        value: selection.seat,
        totalDelta: quote?.pricing?.seatSubtotal ?? 0
      }
    ]
  })

  const quoteTotalPrice = legs.reduce((sum,leg) => {
    const quote = quotes[leg.key];
    return sum + (quote?.pricing?.total ?? 0)
  }, 0)

  async function submitBooking() {
    if (!isAuthenticated && !getStoredAuthUser()) {
      setIsAuthDialogOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const tripType = legs.length > 1 ? "round-trip" : "one-way";
      const payload = {
        outboundFlightId: legs[0]?.flight.id,
        returnFlightId: legs.find((leg) => leg.key === "return")?.flight.id ?? null,
        tripType,
        passengers: {
          adults,
          children,
          infants,
        },
        cabin: cabin.toLowerCase(),
        selections: {
          outbound: {
            fare: selections.outbound.fare,
            bag: selections.outbound.bags,
            seat: selections.outbound.seat,
          },
          ...(selections.return
            ? {
                return: {
                  fare: selections.return.fare,
                  bag: selections.return.bags,
                  seat: selections.return.seat,
                },
              }
            : {}),
        },
        total: quoteTotalPrice,
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "We couldn't confirm the booking right now.");
      }

      const normalizedBooking = normalizeConfirmedBooking(data, {
        adults,
        children,
        infants,
        cabin,
        selections,
        quoteTotalPrice,
      });

      if (!normalizedBooking) {
        throw new Error("The booking confirmation response was incomplete.");
      }

      saveBookingToLocalStorage(normalizedBooking);
      setConfirmedBooking(normalizedBooking);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't confirm the booking right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmedBooking) {
    return (
      <>
        <section className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_18.5rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
          <BookingConfirmationCard
            booking={confirmedBooking}
            passengersLabel={passengersLabel}
            cabin={cabin}
          />

          <div className="space-y-3 md:sticky md:top-6">
            <PriceSummaryCard
              passengers={`${passengersLabel} · ${cabin}`}
              baseItems={quoteBaseItems}
              chargeablePassengers={chargeablePassengers}
              extras={quoteExtras}
              totalPrice={quoteTotalPrice}
            />

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Next step</p>
              <h3 className="mt-2 text-base font-semibold text-slate-900">Booking saved successfully</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This is a mock confirmation flow, so no payment was charged. Your saved booking can be
                reused later from local storage.
              </p>
            </div>
          </div>
        </section>

        <AuthRequiredDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
          redirectTo={typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/"}
          title="Sign in to confirm your booking"
          description="Create an account or sign in to continue to booking confirmation and keep your trip saved in one place."
        />
      </>
    );
  }

  return (
    <>
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
            baseItems={quoteBaseItems}
            chargeablePassengers={chargeablePassengers}
            extras={quoteExtras}
            totalPrice={quoteTotalPrice}
            actionLabel="Confirm booking"
            onAction={submitBooking}
            actionLoading={isSubmitting}
            actionDisabled={quoteTotalPrice <= 0}
            errorMessage={submitError}
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

      <AuthRequiredDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        redirectTo={typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/"}
        title="Sign in to confirm your booking"
        description="Create an account or sign in to continue to booking confirmation and keep your trip saved in one place."
      />
    </>
  );
}
