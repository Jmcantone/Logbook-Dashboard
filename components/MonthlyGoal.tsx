"use client";

import { useState } from "react";
import { excelToMinutes, formatTime } from "@/lib/transforms";

interface MonthlyGoalProps {
  flightsThisMonth: { totalTime: number; toDay: number }[];
}

export function MonthlyGoal({ flightsThisMonth }: MonthlyGoalProps) {
  const [goalHours, setGoalHours] = useState(5);

  const hoursThisMonth = flightsThisMonth.reduce(
    (sum, f) => sum + excelToMinutes(f.totalTime),
    0
  );
  const flightsCount = flightsThisMonth.length;
  const goalMinutes = goalHours * 60;
  const percent = Math.min(100, (hoursThisMonth / goalMinutes) * 100);
  const remaining = Math.max(0, goalMinutes - hoursThisMonth);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">🎯 Monthly Goal</h3>
        <span className="text-xs text-slate-400">
          {now.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Goal selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-300">Goal:</label>
        <input
          type="range"
          min={1}
          max={20}
          value={goalHours}
          onChange={(e) => setGoalHours(parseInt(e.target.value))}
          className="flex-1 accent-blue-500"
        />
        <span className="text-accent font-medium text-sm w-8">{goalHours}h</span>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">{formatTime(hoursThisMonth)} / {goalHours}:00</span>
          <span className={`font-medium ${percent >= 100 ? "text-green-400" : "text-slate-400"}`}>
            {Math.round(percent)}%
          </span>
        </div>
        <div className="w-full bg-navy-700 rounded-full h-3">
          <div
            className={`rounded-full h-3 transition-all ${percent >= 100 ? "bg-green-500" : "bg-accent"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 bg-navy-900/50 rounded-lg">
          <p className="text-slate-400 text-xs">Flights</p>
          <p className="text-lg font-bold text-white">{flightsCount}</p>
        </div>
        <div className="p-2 bg-navy-900/50 rounded-lg">
          <p className="text-slate-400 text-xs">Remaining</p>
          <p className="text-lg font-bold text-white">{formatTime(remaining)}</p>
        </div>
        <div className="p-2 bg-navy-900/50 rounded-lg">
          <p className="text-slate-400 text-xs">Days left</p>
          <p className="text-lg font-bold text-white">{daysLeft}</p>
        </div>
      </div>
    </div>
  );
}
