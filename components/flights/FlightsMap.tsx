"use client";

import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

type MapAirport = {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type FlightsMapProps = {
  origin: MapAirport | null;
  destination: MapAirport | null;
};

const markerIcon = (label: string, accent: "origin" | "destination") =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:42px;
        height:42px;
        border-radius:9999px;
        background:${accent === "origin" ? "#1d4ed8" : "#0f172a"};
        color:white;
        font:700 12px system-ui;
        border:3px solid white;
        box-shadow:0 10px 25px rgba(15,23,42,.18);
      ">${label}</div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -18],
  });

function haversineDistance(origin: MapAirport, destination: MapAirport) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(destination.latitude - origin.latitude);
  const dLon = toRadians(destination.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusKm * c);
}

function FitBounds({
  origin,
  destination,
}: {
  origin: MapAirport | null;
  destination: MapAirport | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) return;

    map.fitBounds(
      [
        [origin.latitude, origin.longitude],
        [destination.latitude, destination.longitude],
      ],
      {
        padding: [90, 90],
        maxZoom: 4,
      },
    );
  }, [destination, map, origin]);

  return null;
}

function EnsureMapSize() {
  const map = useMap();

  useEffect(() => {
    const refresh = () => {
      map.invalidateSize({ animate: false });
    };

    const frame = window.requestAnimationFrame(refresh);
    const timeout = window.setTimeout(refresh, 220);

    const container = map.getContainer();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    observer?.observe(container);

    const handleWindowResize = () => refresh();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer?.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [map]);

  return null;
}

function RecenterOnMove({
  origin,
  destination,
}: {
  origin: MapAirport | null;
  destination: MapAirport | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) return;

    const timeout = window.setTimeout(() => {
      map.invalidateSize({ animate: false });
      map.fitBounds(
        [
          [origin.latitude, origin.longitude],
          [destination.latitude, destination.longitude],
        ],
        {
          padding: [90, 90],
          maxZoom: 4,
        },
      );
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [destination, map, origin]);

  return null;
}

export default function FlightsMap({ origin, destination }: FlightsMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (origin && destination) {
      return [
        (origin.latitude + destination.latitude) / 2,
        (origin.longitude + destination.longitude) / 2,
      ];
    }

    if (origin) return [origin.latitude, origin.longitude];
    if (destination) return [destination.latitude, destination.longitude];
    return [36.1911, 44.0092];
  }, [destination, origin]);

  const routeLine = origin && destination
    ? ([
        [origin.latitude, origin.longitude],
        [destination.latitude, destination.longitude],
      ] as [number, number][])
    : [];
  const routeDistance = origin && destination ? haversineDistance(origin, destination) : null;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Route map</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              {origin?.city ?? "Origin"} to {destination?.city ?? "Destination"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {origin?.code ?? "---"} to {destination?.code ?? "---"}
            </p>
          </div>

          {routeDistance ? (
            <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              Approx. {routeDistance} km
            </div>
          ) : null}
        </div>
      </div>

      <div className="h-[22rem] sm:h-[24rem] xl:h-[26rem]">
        <MapContainer
          center={center}
          zoom={4}
          scrollWheelZoom
          touchZoom
          dragging
          doubleClickZoom
          className="h-full w-full touch-none bg-slate-100"
          zoomControl={false}
        >
          <EnsureMapSize />
          <RecenterOnMove origin={origin} destination={destination} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <FitBounds origin={origin} destination={destination} />

          {routeLine.length === 2 ? (
            <Polyline positions={routeLine} pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.82 }} />
          ) : null}

          {origin ? (
            <Marker position={[origin.latitude, origin.longitude]} icon={markerIcon(origin.code, "origin")}>
              <Popup>
                {origin.city}, {origin.country} ({origin.code})
              </Popup>
            </Marker>
          ) : null}

          {destination ? (
            <Marker
              position={[destination.latitude, destination.longitude]}
              icon={markerIcon(destination.code, "destination")}
            >
              <Popup>
                {destination.city}, {destination.country} ({destination.code})
              </Popup>
            </Marker>
          ) : null}
        </MapContainer>
      </div>

      <div className="grid gap-3 border-t border-slate-200 px-5 py-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Origin</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {origin ? `${origin.name} (${origin.code})` : "Not selected"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {origin ? `${origin.city}, ${origin.country}` : ""}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Destination</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {destination ? `${destination.name} (${destination.code})` : "Not selected"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {destination ? `${destination.city}, ${destination.country}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
