"use client";

import { formatTime } from "@/lib/transforms";

interface AircraftStats {
  registration: string;
  model: string;
  totalMinutes: number;
  flights: number;
  lastFlown: string;
}

interface AircraftTableProps {
  aircraft: AircraftStats[];
}

export function AircraftTable({ aircraft }: AircraftTableProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          ✈️ Aeronaves Voladas
        </h3>
        <span className="text-xs text-slate-500">{aircraft.length} aeronaves</span>
      </div>
      <div className="overflow-y-auto max-h-80 rounded-lg">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-navy-800 z-10">
            <tr className="border-b border-navy-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Matrícula</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Modelo</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Horas</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Vuelos</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Último vuelo</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((ac, i) => (
              <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                <td className="py-3 px-2 text-white font-mono font-medium">{ac.registration}</td>
                <td className="py-3 px-2 text-slate-300">{ac.model}</td>
                <td className="py-3 px-2 text-slate-300">{formatTime(ac.totalMinutes)}</td>
                <td className="py-3 px-2 text-slate-300">{ac.flights}</td>
                <td className="py-3 px-2 text-slate-400 text-xs">{ac.lastFlown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
