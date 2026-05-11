"use client";

interface Flight {
  date: string;
  route: string;
  aircraft: string;
  duration: string;
  function: string;
  remarks: string;
}

interface RecentFlightsProps {
  flights: Flight[];
}

export function RecentFlights({ flights }: RecentFlightsProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          🛫 Vuelos
        </h3>
        <span className="text-xs text-slate-500">{flights.length} vuelos</span>
      </div>
      <div className="overflow-y-auto max-h-96 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="sticky top-0 bg-navy-800 z-10">
            <tr className="border-b border-navy-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Fecha</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Ruta</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Aeronave</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Duración</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Función</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, i) => (
              <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                <td className="py-3 px-2 text-slate-300 whitespace-nowrap">{flight.date}</td>
                <td className="py-3 px-2 text-white font-medium whitespace-nowrap">{flight.route}</td>
                <td className="py-3 px-2 text-slate-300 whitespace-nowrap">{flight.aircraft}</td>
                <td className="py-3 px-2 text-slate-300">{flight.duration}</td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      flight.function === "PIC"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {flight.function}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-500 text-xs max-w-[150px] truncate">
                  {flight.remarks}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
