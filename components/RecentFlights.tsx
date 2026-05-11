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
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        🛫 Recent Flights
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Date</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Route</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Aircraft</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Duration</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Function</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, i) => (
              <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                <td className="py-3 px-2 text-slate-300">{flight.date}</td>
                <td className="py-3 px-2 text-white font-medium">{flight.route}</td>
                <td className="py-3 px-2 text-slate-300">{flight.aircraft}</td>
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
  );
}
