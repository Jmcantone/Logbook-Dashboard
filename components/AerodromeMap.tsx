"use client";

import dynamic from "next/dynamic";

interface Aerodrome {
  code: string;
  name: string;
  lat: number;
  lng: number;
  visits: number;
}

const AERODROME_COORDS: Record<string, { name: string; lat: number; lng: number }> = {
  LECH: { name: "Castellón", lat: 40.2138, lng: 0.0733 },
  LEVC: { name: "Valencia", lat: 39.4893, lng: -0.4816 },
  LETL: { name: "Teruel", lat: 40.4033, lng: -1.2183 },
  LERS: { name: "Reus", lat: 41.1474, lng: 1.1672 },
  LERE: { name: "Requeña", lat: 39.4833, lng: -1.0333 },
};

interface AerodromeMapProps {
  visits: Record<string, number>;
}

// Leaflet must be loaded client-side only
const MapContent = dynamic(() => import("./MapContent"), { ssr: false });

export function AerodromeMap({ visits }: AerodromeMapProps) {
  const aerodromes: Aerodrome[] = Object.entries(visits)
    .map(([code, count]) => {
      const coords = AERODROME_COORDS[code];
      if (!coords) return null;
      return { code, name: coords.name, lat: coords.lat, lng: coords.lng, visits: count };
    })
    .filter(Boolean) as Aerodrome[];

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        🗺️ Aeródromos Visitados
      </h3>
      <div className="relative w-full h-80 rounded-lg overflow-hidden">
        <MapContent aerodromes={aerodromes} />
      </div>
      {/* List below */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {aerodromes
          .sort((a, b) => b.visits - a.visits)
          .map((ad) => (
            <div key={ad.code} className="flex items-center gap-2 p-2 bg-navy-900/50 rounded">
              <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="text-accent font-mono font-medium">{ad.code}</span>
              <span className="text-slate-400 truncate">{ad.name}</span>
              <span className="text-slate-500 ml-auto">{ad.visits}×</span>
            </div>
          ))}
      </div>
    </div>
  );
}
