"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface CurrencyTrackerProps {
  lastFlightDate: string;
  hoursLast12Months: number;
  picHoursLast12Months: number;
  takeoffsLast12Months: number;
}

function daysSince(dateStr: string): number {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return 999;
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);
  const flightDate = new Date(year, month, day);
  const now = new Date();
  return Math.floor((now.getTime() - flightDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function CurrencyTracker({
  lastFlightDate,
  hoursLast12Months,
  picHoursLast12Months,
  takeoffsLast12Months,
}: CurrencyTrackerProps) {
  const days = daysSince(lastFlightDate);

  const sepHoursOk = hoursLast12Months >= 12;
  const sepPicOk = picHoursLast12Months >= 6;
  const sepTOOk = takeoffsLast12Months >= 12;

  const items = [
    {
      label: "Días sin volar",
      value: `${days} días`,
      status: days <= 30 ? "good" : days <= 60 ? "warn" : "bad",
      detail: `Último vuelo: ${lastFlightDate}`,
    },
    {
      label: "SEP — Horas totales (12 meses)",
      value: `${hoursLast12Months.toFixed(1)}h / 12h`,
      status: sepHoursOk ? "good" : "bad",
      detail: "12h totales en últimos 12 meses para revalidación",
    },
    {
      label: "SEP — Horas PIC (12 meses)",
      value: `${picHoursLast12Months.toFixed(1)}h / 6h`,
      status: sepPicOk ? "good" : "bad",
      detail: "6h PIC en últimos 12 meses para revalidación",
    },
    {
      label: "SEP — Despegues y aterrizajes (12 meses)",
      value: `${takeoffsLast12Months} / 12`,
      status: sepTOOk ? "good" : "bad",
      detail: "12 T/O y aterrizajes en últimos 12 meses",
    },
  ];

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 sm:p-6 space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-white">
        ⏱️ Vigencia y Recencia
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon =
            item.status === "good"
              ? CheckCircle
              : item.status === "warn"
              ? AlertTriangle
              : XCircle;
          const color =
            item.status === "good"
              ? "text-green-400"
              : item.status === "warn"
              ? "text-yellow-400"
              : "text-red-400";

          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-navy-900/50 rounded-lg gap-2"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color} shrink-0`} />
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-slate-500 text-xs">{item.detail}</p>
                </div>
              </div>
              <span className={`text-sm font-mono font-medium ${color} sm:text-right pl-8 sm:pl-0`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
