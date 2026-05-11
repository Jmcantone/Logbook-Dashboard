"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlightHeatmapProps {
  flightDates: string[]; // dd/mm/yyyy format
}

type ViewMode = "year" | "month" | "week";

function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function getColor(count: number): string {
  if (count === 0) return "#1e293b";
  if (count === 1) return "#1d4ed8";
  if (count === 2) return "#2563eb";
  return "#3b82f6";
}

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function FlightHeatmap({ flightDates }: FlightHeatmapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("year");
  const [offset, setOffset] = useState(0); // 0 = current period, -1 = previous, etc.

  // Build date -> count map
  const dateMap: Record<string, number> = {};
  for (const d of flightDates) {
    const parsed = parseDate(d);
    if (!parsed) continue;
    const key = parsed.toISOString().split("T")[0];
    dateMap[key] = (dateMap[key] || 0) + 1;
  }

  const now = new Date();

  function getLabel(): string {
    if (viewMode === "year") {
      const year = now.getFullYear() + offset;
      return `${year}`;
    } else if (viewMode === "month") {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    } else {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} — ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}/${endOfWeek.getFullYear()}`;
    }
  }

  function getDays(): { date: Date; count: number; key: string }[] {
    const days: { date: Date; count: number; key: string }[] = [];

    if (viewMode === "year") {
      const year = now.getFullYear() + offset;
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split("T")[0];
        days.push({ date: new Date(d), count: dateMap[key] || 0, key });
      }
    } else if (viewMode === "month") {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const key = date.toISOString().split("T")[0];
        days.push({ date, count: dateMap[key] || 0, key });
      }
    } else {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const key = date.toISOString().split("T")[0];
        days.push({ date, count: dateMap[key] || 0, key });
      }
    }

    return days;
  }

  const days = getDays();

  function renderYear() {
    // Group into weeks (Mon-Sun)
    const weeks: { date: Date; count: number; key: string }[][] = [];
    let currentWeek: typeof days = [];

    // Pad first week with empty days
    const firstDow = (days[0].date.getDay() + 6) % 7; // Mon=0
    for (let i = 0; i < firstDow; i++) {
      currentWeek.push({ date: new Date(0), count: -1, key: `pad-${i}` });
    }

    for (const day of days) {
      currentWeek.push(day);
      const dow = (day.date.getDay() + 6) % 7; // Mon=0, Sun=6
      if (dow === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      // Pad end
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(0), count: -1, key: `pad-end-${currentWeek.length}` });
      }
      weeks.push(currentWeek);
    }

    return (
      <div className="overflow-x-auto">
        <div className="flex gap-[2px] min-w-[680px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1">
            {DAY_LABELS.map((l, i) => (
              <div key={i} className="w-3 h-3 flex items-center justify-center text-[8px] text-slate-500">
                {i % 2 === 0 ? l : ""}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                <div
                  key={day.key || `${wi}-${di}`}
                  className="w-3 h-3 rounded-[2px] border border-navy-700/30"
                  style={{ backgroundColor: day.count < 0 ? "transparent" : getColor(day.count) }}
                  title={
                    day.count >= 0
                      ? `${day.date.toLocaleDateString("es-ES")}${day.count > 0 ? ` — ${day.count} vuelo${day.count > 1 ? "s" : ""}` : ""}`
                      : ""
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderMonth() {
    // Calendar grid for the month
    const firstDow = (days[0].date.getDay() + 6) % 7; // Mon=0
    const cells: { date: Date; count: number; key: string; isDay: boolean }[] = [];

    // Pad start
    for (let i = 0; i < firstDow; i++) {
      cells.push({ date: new Date(0), count: -1, key: `pad-${i}`, isDay: false });
    }
    for (const day of days) {
      cells.push({ ...day, isDay: true });
    }
    // Pad end to fill last row
    while (cells.length % 7 !== 0) {
      cells.push({ date: new Date(0), count: -1, key: `pad-end-${cells.length}`, isDay: false });
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return (
      <div className="space-y-1">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {DAY_LABELS.map((l) => (
            <div key={l} className="text-center text-xs text-slate-500 py-1">{l}</div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((cell, ci) => (
              <div
                key={cell.key}
                className={`aspect-square rounded-md flex items-center justify-center text-xs border ${
                  !cell.isDay
                    ? "border-transparent"
                    : cell.count > 0
                    ? "border-accent/40 bg-accent/20 text-white font-medium"
                    : "border-navy-700/50 bg-navy-900/50 text-slate-500"
                }`}
                title={cell.isDay ? `${cell.date.toLocaleDateString("es-ES")}${cell.count > 0 ? ` — ${cell.count} vuelo${cell.count > 1 ? "s" : ""}` : ""}` : ""}
              >
                {cell.isDay ? cell.date.getDate() : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  function renderWeek() {
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isToday = day.date.toDateString() === now.toDateString();
          return (
            <div
              key={day.key}
              className={`p-3 rounded-lg text-center border ${
                day.count > 0
                  ? "border-accent/40 bg-accent/20"
                  : isToday
                  ? "border-accent/20 bg-navy-800"
                  : "border-navy-700/50 bg-navy-900/50"
              }`}
            >
              <p className="text-xs text-slate-500">{DAY_LABELS[i]}</p>
              <p className={`text-lg font-bold ${day.count > 0 ? "text-accent" : "text-slate-400"}`}>
                {day.date.getDate()}
              </p>
              {day.count > 0 && (
                <p className="text-xs text-accent mt-1">{day.count} ✈️</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white">📅 Actividad de Vuelo</h3>
        <div className="flex items-center gap-2">
          {/* View mode buttons */}
          <div className="flex gap-1 p-0.5 bg-navy-900 rounded-lg">
            {(["year", "month", "week"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); setOffset(0); }}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === mode
                    ? "bg-accent text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "year" ? "Año" : mode === "month" ? "Mes" : "Semana"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOffset(offset - 1)}
          className="p-1.5 rounded-lg bg-navy-900 border border-navy-700 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-white">{getLabel()}</span>
        <button
          onClick={() => setOffset(Math.min(0, offset + 1))}
          disabled={offset >= 0}
          className="p-1.5 rounded-lg bg-navy-900 border border-navy-700 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {viewMode === "year" && renderYear()}
      {viewMode === "month" && renderMonth()}
      {viewMode === "week" && renderWeek()}

      {/* Legend (year view only) */}
      {viewMode === "year" && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Menos</span>
          <div className="w-3 h-3 rounded-[2px] border border-navy-700/30" style={{ backgroundColor: "#1e293b" }} />
          <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "#1d4ed8" }} />
          <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "#2563eb" }} />
          <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "#3b82f6" }} />
          <span>Más</span>
        </div>
      )}
    </div>
  );
}
