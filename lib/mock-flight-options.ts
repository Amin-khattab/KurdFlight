export type FlightDealOption = {
  id: string;
  label: string;
  description: string;
  priceDelta: number;
};

export const fareOptions: FlightDealOption[] = [
  {
    id: "light",
    label: "Light",
    description: "Basic fare with standard airline rules and no flexible changes.",
    priceDelta: 0,
  },
  {
    id: "standard",
    label: "Standard",
    description: "Adds a more comfortable booking bundle with improved change flexibility.",
    priceDelta: 25,
  },
  {
    id: "flex",
    label: "Flex",
    description: "Best for travelers who want easier changes and stronger booking flexibility.",
    priceDelta: 60,
  },
];

export const bagOptions: FlightDealOption[] = [
  {
    id: "personal-item",
    label: "Personal item only",
    description: "Travel light with one small under-seat personal item.",
    priceDelta: 0,
  },
  {
    id: "cabin-bag",
    label: "Cabin bag",
    description: "Add one cabin bag for a more practical short-trip setup.",
    priceDelta: 18,
  },
  {
    id: "checked-bag",
    label: "Checked bag",
    description: "Add one checked bag for longer stays and heavier packing needs.",
    priceDelta: 42,
  },
];

export const seatOptions: FlightDealOption[] = [
  {
    id: "no-seat",
    label: "No seat selected",
    description: "Seat will be assigned later by the airline or during a later step.",
    priceDelta: 0,
  },
  {
    id: "standard-seat",
    label: "Standard seat",
    description: "Choose a standard seat location before final confirmation.",
    priceDelta: 14,
  },
  {
    id: "extra-legroom",
    label: "Extra legroom",
    description: "More space and comfort for longer regional and international flights.",
    priceDelta: 36,
  },
];
