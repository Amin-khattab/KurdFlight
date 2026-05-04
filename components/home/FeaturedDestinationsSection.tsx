"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Destination = {
  name: string;
  description: string;
  tag: string;
  imageUrl: string;
  href: string;
};

type FeaturedDestinationsSectionProps = {
  destinations: Destination[];
};

const VISIBLE_CARDS = 3;
const ROTATION_INTERVAL_MS = 5200;
const FADE_DURATION_MS = 450;

export function FeaturedDestinationsSection({
  destinations,
}: FeaturedDestinationsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [windowStart, setWindowStart] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || destinations.length <= VISIBLE_CARDS) {
      return;
    }

    const interval = window.setInterval(() => {
      setIsFading(true);

      window.setTimeout(() => {
        setWindowStart((current) => (current + 1) % destinations.length);
        setIsFading(false);
      }, FADE_DURATION_MS);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [destinations.length, prefersReducedMotion]);

  const visibleDestinations = useMemo(() => {
    const count = Math.min(VISIBLE_CARDS, destinations.length);
    return Array.from({ length: count }, (_, index) => destinations[(windowStart + index) % destinations.length]);
  }, [destinations, windowStart]);

  return (
    <div className="mt-8 min-h-0 lg:min-h-[35rem]">
      <div
        className={`grid gap-5 transition-opacity duration-500 lg:grid-cols-3 ${
          prefersReducedMotion ? "opacity-100" : isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {visibleDestinations.map((destination) => (
          <article
            key={`${destination.name}-${windowStart}`}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
              <div
                className="relative h-48 bg-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${destination.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-sm font-medium text-white/85">Featured escape</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{destination.name}</p>
                </div>
              </div>
              <div className="flex min-h-[13.5rem] flex-col p-6">
                <div className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {destination.tag}
                </div>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{destination.description}</p>
                <Link
                  href={destination.href}
                  className="mt-5 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800"
                >
                  Explore flights
                </Link>
              </div>
          </article>
        ))}
      </div>
    </div>
  );
}
