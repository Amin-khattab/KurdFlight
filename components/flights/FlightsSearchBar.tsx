import { SearchBar } from "@/components/search/SearchBar";

type FlightsSearchBarProps = {
  fromCode: string;
  toCode: string;
  departure: string | null;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  cabin: string;
  tripType: "round-trip" | "one-way";
};

export function FlightsSearchBar({
  fromCode,
  toCode,
  departure,
  returnDate,
  adults,
  children,
  infants,
  cabin,
  tripType,
}: FlightsSearchBarProps) {
  return (
    <SearchBar
      variant="results"
      submitPath="/flights"
      initialState={{
        fromCode,
        toCode,
        departure,
        returnDate,
        adults,
        children,
        infants,
        cabin: cabin.toLowerCase().replace(/\s+/g, "-"),
        tripType,
      }}
    />
  );
}
