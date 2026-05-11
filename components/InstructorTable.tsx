"use client";

import { formatTime } from "@/lib/transforms";

interface InstructorStats {
  name: string;
  totalMinutes: number;
  flights: number;
  lastFlown: string;
}

interface InstructorTableProps {
  instructors: InstructorStats[];
}

export function InstructorTable({ instructors }: InstructorTableProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        👨‍✈️ Instructors
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Instructor</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Hours</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Flights</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Last Flight</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst, i) => (
              <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                <td className="py-3 px-2 text-white font-medium">{inst.name}</td>
                <td className="py-3 px-2 text-slate-300">{formatTime(inst.totalMinutes)}</td>
                <td className="py-3 px-2 text-slate-300">{inst.flights}</td>
                <td className="py-3 px-2 text-slate-400 text-xs">{inst.lastFlown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
