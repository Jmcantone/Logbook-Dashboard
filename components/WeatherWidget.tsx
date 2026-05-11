"use client";

import { useEffect, useState } from "react";
import { Cloud, Wind, Eye, Thermometer } from "lucide-react";

interface WeatherWidgetProps {
  icao?: string;
}

interface MetarData {
  raw: string;
  station: string;
  time: string;
  wind: string;
  visibility: string;
  clouds: string;
  temperature: string;
}

export function WeatherWidget({ icao = "LECH" }: WeatherWidgetProps) {
  const [metar, setMetar] = useState<MetarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch METAR from AVWX or similar free API
    fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const raw = data[0].rawOb || data[0].rawReport || "";
          setMetar({
            raw,
            station: icao,
            time: data[0].reportTime || "",
            wind: data[0].wdir && data[0].wspd ? `${data[0].wdir}°/${data[0].wspd}kt` : "Calm",
            visibility: data[0].visib ? `${data[0].visib} SM` : "—",
            clouds: data[0].clouds?.[0]?.cover || "CLR",
            temperature: data[0].temp != null ? `${data[0].temp}°C` : "—",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [icao]);

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          🌤️ Weather — {icao}
        </h3>
        {metar && (
          <span className="text-xs text-slate-500">{metar.time}</span>
        )}
      </div>

      {loading && <p className="text-slate-400 text-sm">Loading METAR...</p>}
      {error && (
        <p className="text-slate-500 text-sm">
          Weather data unavailable. Check{" "}
          <a
            href={`https://aviationweather.gov/metar?id=${icao}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            aviationweather.gov
          </a>
        </p>
      )}

      {metar && (
        <>
          {/* Raw METAR */}
          <div className="p-3 bg-navy-900/50 rounded-lg font-mono text-xs text-green-400 break-all">
            {metar.raw}
          </div>

          {/* Decoded */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-2 bg-navy-900/50 rounded-lg">
              <Wind className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-slate-400">Wind</p>
                <p className="text-sm text-white">{metar.wind}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-navy-900/50 rounded-lg">
              <Eye className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-slate-400">Visibility</p>
                <p className="text-sm text-white">{metar.visibility}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-navy-900/50 rounded-lg">
              <Cloud className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-slate-400">Clouds</p>
                <p className="text-sm text-white">{metar.clouds}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-navy-900/50 rounded-lg">
              <Thermometer className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-slate-400">Temp</p>
                <p className="text-sm text-white">{metar.temperature}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
