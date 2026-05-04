"use client";

import Link from "next/link";
import { FeaturedDestinationsSection } from "@/components/home/FeaturedDestinationsSection";
import { SearchBar } from "@/components/search/SearchBar";

const routes = [
  {
    from: "Erbil",
    fromCode: "EBL-CITY",
    to: "Istanbul",
    toCode: "IST-CITY",
    price: "$149",
    type: "Direct flights",
  },
  {
    from: "Erbil",
    fromCode: "EBL-CITY",
    to: "Dubai",
    toCode: "DXB-CITY",
    price: "$189",
    type: "Popular this week",
  },
  {
    from: "Sulaymaniyah",
    fromCode: "ISU",
    to: "Antalya",
    toCode: "AYT-CITY",
    price: "$172",
    type: "Summer route",
  },
  {
    from: "Duhok",
    fromCode: "DUH",
    to: "Berlin",
    toCode: "BER-CITY",
    price: "$265",
    type: "1 stop options",
  },
];

const benefits = [
  {
    title: "Easy booking",
    description: "Search, compare, and secure your trip with a simple flow that keeps key details clear.",
  },
  {
    title: "Transparent pricing",
    description: "See sample fares, route details, and booking information without clutter or hidden surprises.",
  },
  {
    title: "Regional and international routes",
    description: "Plan travel across Kurdistan, Türkiye, the Gulf, and major European destinations.",
  },
  {
    title: "Reliable support",
    description: "Get help with itinerary questions, baggage needs, and booking updates when you need it.",
  },
];

const destinations = [
  {
    name: "Istanbul",
    toCode: "IST-CITY",
    description: "A strong choice for city breaks, connections, and business travel from the Kurdistan Region.",
    tag: "City + connections",
    imageUrl:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Dubai",
    toCode: "DXB-CITY",
    description: "Fast access to shopping, events, and onward international travel with frequent demand.",
    tag: "Business + leisure",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Antalya",
    toCode: "AYT-CITY",
    description: "A warm-weather favorite for holiday travel, family trips, and coastal getaways.",
    tag: "Seasonal favorite",
    imageUrl:
      "https://images.pexels.com/photos/2347334/pexels-photo-2347334.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Berlin",
    toCode: "BER-CITY",
    description: "A favorite for longer city stays, creative neighborhoods, and practical European connections.",
    tag: "Culture + long stay",
    imageUrl:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Erbil",
    toCode: "EBL-CITY",
    description: "A polished gateway to the region with business travel demand, modern hotels, and strong local access.",
    tag: "Regional hub",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sulaymaniyah",
    toCode: "ISU",
    description: "A refined city break with mountain surroundings, local culture, and a calmer regional pace.",
    tag: "Local favorite",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
];

function buildFlightsHref(params: Record<string, string>) {
  return `/flights?${new URLSearchParams(params).toString()}`;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default function Home() {
  const destinationCards = destinations.map((destination) => ({
    ...destination,
    href: buildFlightsHref({
      from: "EBL-CITY",
      to: destination.toCode,
      departure: "2026-05-14",
      return: "2026-05-21",
      adults: "1",
      children: "0",
      infants: "0",
      cabin: "economy",
      tripType: "round-trip",
    }),
  }));

  return (
    <main className="bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">
              KF
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-900">KurdFlight</p>
              <p className="text-xs text-slate-500">Flights across Kurdistan and beyond</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#routes" className="transition hover:text-blue-700">
              Popular routes
            </a>
            <a href="#why-kurdflight" className="transition hover:text-blue-700">
              Why KurdFlight
            </a>
            <a href="#destinations" className="transition hover:text-blue-700">
              Destinations
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#support"
              className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:inline-flex"
            >
              Help
            </a>
            <a
              href="#search"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Search flights
            </a>
          </div>
        </div>
      </header>

      <section id="search" className="border-b border-slate-200 bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 xl:grid-cols-[1.1fr_0.9fr] xl:items-center lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
              Trusted flight booking from the Kurdistan Region
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Book flights quickly, compare routes clearly, and travel with confidence.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              KurdFlight helps travelers search regional and international flights with transparent
              pricing, practical route options, and a booking experience built for real trips.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Live route availability
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Clear fare overview
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Support when plans change
              </div>
            </div>
          </div>

          <div>
            <SearchBar />
          </div>
        </div>
      </section>

      <section
        id="routes"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="Popular routes"
          title="Start with routes travelers search most"
          description="Quick route shortcuts help returning users move faster from browsing to booking."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {routes.map((route) => (
            <Link
              key={`${route.from}-${route.to}`}
              href={buildFlightsHref({
                from: route.fromCode,
                to: route.toCode,
                departure: "2026-05-14",
                return: "2026-05-21",
                adults: "1",
                children: "0",
                infants: "0",
                cabin: "economy",
                tripType: "round-trip",
              })}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-sm font-medium text-slate-500">{route.type}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                {route.from} to {route.to}
              </h3>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">Starting from</p>
                  <p className="text-2xl font-semibold text-blue-700">{route.price}</p>
                </div>
                <span className="text-sm font-medium text-slate-700">View deal</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="why-kurdflight"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why KurdFlight"
            title="Built to feel dependable from first search to final confirmation"
            description="The product direction focuses on clarity, route confidence, and reducing booking friction for everyday travelers."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                  KF
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="destinations"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="Featured destinations"
          title="Useful inspiration for where to go next"
          description="Each destination card highlights a practical reason people book it, keeping the section helpful rather than decorative."
        />

        <FeaturedDestinationsSection destinations={destinationCards} />
      </section>

      <footer id="support" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">KurdFlight</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
              A flight-booking experience designed for travelers across Kurdistan, with clearer
              search, practical route discovery, and a more trustworthy way to plan trips.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Company</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <a className="block transition hover:text-blue-700" href="#why-kurdflight">
                About
              </a>
              <a className="block transition hover:text-blue-700" href="#routes">
                Routes
              </a>
              <a className="block transition hover:text-blue-700" href="#destinations">
                Destinations
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Support</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <a className="block transition hover:text-blue-700" href="#support">
                Help center
              </a>
              <Link className="block transition hover:text-blue-700" href="/#search">
                Manage booking
              </Link>
              <a className="block transition hover:text-blue-700" href="mailto:support@kurdflight.com">
                Contact us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
