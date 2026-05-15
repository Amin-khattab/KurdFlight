import type { MockFlight } from "@/lib/mock-flights";

export const LOCAL_BOOKINGS_KEY = "kurdflight-bookings";

export type BookingLegSelections = {
  fare: string;
  bag: string;
  seat: string;
};

export type StoredBooking = {
  bookingId: string;
  status: string;
  createdAt: string;
  outboundFlight: MockFlight | null;
  returnFlight: MockFlight | null;
  outboundFlightId: string;
  returnFlightId?: string | null;
  tripType: "one-way" | "round-trip";
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabin: string;
  selections: {
    outbound: BookingLegSelections;
    return?: BookingLegSelections;
  };
  total: number;
};

export function getStoredBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBookingToLocalStorage(booking: StoredBooking) {
  if (typeof window === "undefined") return;

  const existing = getStoredBookings();
  window.localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify([booking, ...existing]));
}
