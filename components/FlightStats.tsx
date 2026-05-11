"use client";

import { excelToMinutes, formatTime } from "@/lib/transforms";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FlightStatsProps {
  flights: {
    date: string;
    totalTime: number;
    depPlace: string;
  }[];
}

function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

export function FlightStats({ flights }: FlightStatsProps) {
  const totalMinutes = flights.reduce((sum, f) => sum + excelToMinutes(f.totalTime), 0);
  const avgMinutes = flights.length > 0 ? Math.round(totalMinutes / flights.length) : 0;

  const durations = flights.map((f) => excelToMinutes(f.totalTime)).filter((d) => d > 0);
  const longest = durations.length > 0 ? Math.max(...durations) : 0;
  const shortest = durations.length > 0 ? Math.min(...durations) : 0;

  // Flights by day of week
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const dayCount = [0, 0, 0, 0, 0, 0, 0];
  for (const f of flights) {
    const d = parseDate(f.date);
    if (!d) continue;
    const dow = d.getDay();
    const idx = dow === 0 ? 6 : dow - 1;
    dayCount[idx]++;
  }
  const dayData = dayNames.map((name, i) => ({ day: name, vuelos: dayCount[i] }));

  // Longest gap
  const sortedDates = flights
    .map((f) => parseDate(f.date))
    .filter(Boolean)
    .sort((a, b) => a!.getTime() - b!.getTime()) as Date[];

  let longestGap = 0;
  for (let i = 1; i < sortedDates.length; i++) {
    const gap = Math.floor((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
    if (gap > longestGap) longestGap = gap;
  }

  // Most active month
  const monthMap: Record<string, number> = {};
  for (const f of flights) {
    const d = parseDate(f.date);
    if (!d) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthMap[key] = (monthMap[key] || 0) + 1;
  }
  const mostActiveMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0];
  const monthLabels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const mostActiveLabel = mostActiveMonth
    ? `${monthLabels[parseInt(mostActiveMonth[0].split("-")[1])]} ${mostActiveMonth[0].split("-")[0]}`
    : "—";

  return (
    <div className="space-y-4">
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">📊 Estadísticas de Vuelo</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-navy-900/50 rounded-lg text-center">
            <p className="text-slate-400 text-xs">Duración promedio</p>
            <p className="text-xl font-bold text-white">{formatTime(avgMinutes)}</p>
          </div>
          <div className="p-3 bg-navy-900/50 rounded-lg text-center">
            <p className="text-slate-400 text-xs">Vuelo más largo</p>
            <p className="text-xl font-bold text-white">{formatTime(longest)}</p>
          </div>
          <div className="p-3 bg-navy-900/50 rounded-lg text-center">
            <p className="text-slate-400 text-xs">Vuelo más corto</p>
            <p className="text-xl font-bold text-white">{formatTime(shortest)}</p>
          </div>
          <div className="p-3 bg-navy-900/50 rounded-lg text-center">
            <p className="text-slate-400 text-xs">Mayor inactividad</p>
            <p className="text-xl font-bold text-white">{longestGap}d</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-navy-900/50 rounded-lg text-center">
            <p className="text-slate-400 text-xs">Total vuelos</p>
            <p className="text-xl font-bold text-white">{flights.length}</p>
          </div>
          <div className="p-3 bg-navy-900/50 rounded-lg text-center">
            <p className="text-slate-400 text-xs">Mes más activo</p>
            <p className="text-xl font-bold text-white">{mostActiveLabel}</p>
            <p className="text-slate-500 text-xs">{mostActiveMonth ? `${mostActiveMonth[1]} vuelos` : ""}</p>
          </div>
        </div>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">📆 Vuelos por Día de la Semana</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#475569" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }}
              />
              <Bar dataKey="vuelos" name="Vuelos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
