"use client";

import { useState } from "react";
import { formatTime } from "@/lib/transforms";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CPLEstimatorProps {
  totalMinutes: number;
  picMinutes: number;
  picXCountryMinutes: number;
}

export function CPLEstimator({
  totalMinutes,
  picMinutes,
  picXCountryMinutes,
}: CPLEstimatorProps) {
  const [hoursPerMonth, setHoursPerMonth] = useState(1);
  const [costPerHour, setCostPerHour] = useState(240);

  const monthlyMinutes = hoursPerMonth * 60;
  const picMonthlyMinutes = monthlyMinutes;

  const targets = [
    { label: "200h Total", required: 200 * 60, current: totalMinutes, monthlyGain: monthlyMinutes },
    { label: "100h PIC", required: 100 * 60, current: picMinutes, monthlyGain: picMonthlyMinutes },
    { label: "20h PIC X-Cty", required: 20 * 60, current: picXCountryMinutes, monthlyGain: picMonthlyMinutes * 0.5 },
  ];

  const monthsPerTarget = targets.map((t) => {
    const remaining = Math.max(0, t.required - t.current);
    const months = t.monthlyGain > 0 ? Math.ceil(remaining / t.monthlyGain) : 999;
    return { ...t, remaining, months };
  });

  const bottleneck = monthsPerTarget.reduce((max, t) => (t.months > max.months ? t : max));
  const totalMonthsToGo = bottleneck.months;

  const estimatedDate = new Date();
  estimatedDate.setMonth(estimatedDate.getMonth() + totalMonthsToGo);

  const totalCost = Math.ceil((bottleneck.remaining / 60) * costPerHour);

  // Projection chart
  const chartData = [];
  for (let m = 0; m <= Math.min(totalMonthsToGo + 3, 120); m++) {
    const date = new Date();
    date.setMonth(date.getMonth() + m);
    const label = date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
    chartData.push({
      month: label,
      total: Math.min(200, (totalMinutes + monthlyMinutes * m) / 60),
      pic: Math.min(100, (picMinutes + picMonthlyMinutes * m) / 60),
    });
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white">
        🎯 Planificador CPL
      </h3>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-slate-300 flex justify-between">
            <span>Horas / mes</span>
            <span className="text-accent font-medium">{hoursPerMonth}h</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={hoursPerMonth}
            onChange={(e) => setHoursPerMonth(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300 flex justify-between">
            <span>Costo / hora</span>
            <span className="text-accent font-medium">€{costPerHour}</span>
          </label>
          <input
            type="range"
            min={150}
            max={300}
            step={10}
            value={costPerHour}
            onChange={(e) => setCostPerHour(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-navy-900/50 rounded-lg text-center">
          <p className="text-slate-400 text-xs mb-1">Horas restantes</p>
          <p className="text-2xl font-bold text-white">{formatTime(bottleneck.remaining)}</p>
          <p className="text-slate-500 text-xs mt-1">{bottleneck.label}</p>
        </div>
        <div className="p-4 bg-navy-900/50 rounded-lg text-center">
          <p className="text-slate-400 text-xs mb-1">Meses restantes</p>
          <p className="text-2xl font-bold text-white">{totalMonthsToGo}</p>
          <p className="text-slate-500 text-xs mt-1">
            {totalMonthsToGo < 999
              ? estimatedDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
              : "—"}
          </p>
        </div>
        <div className="p-4 bg-navy-900/50 rounded-lg text-center">
          <p className="text-slate-400 text-xs mb-1">Costo total</p>
          <p className="text-2xl font-bold text-white">€{totalCost.toLocaleString()}</p>
          <p className="text-slate-500 text-xs mt-1">A €{costPerHour}/h</p>
        </div>
        <div className="p-4 bg-navy-900/50 rounded-lg text-center">
          <p className="text-slate-400 text-xs mb-1">Costo mensual</p>
          <p className="text-2xl font-bold text-white">€{(hoursPerMonth * costPerHour).toLocaleString()}</p>
          <p className="text-slate-500 text-xs mt-1">{hoursPerMonth}h × €{costPerHour}</p>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="space-y-2">
        <p className="text-sm text-slate-400">Proyección hacia mínimos CPL</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "#475569" }}
                interval={Math.max(0, Math.floor(chartData.length / 8))}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "#475569" }}
                domain={[0, 220]}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }}
                formatter={(value: number) => `${value.toFixed(1)}h`}
              />
              <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "200h", fill: "#ef4444", fontSize: 10 }} />
              <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "100h PIC", fill: "#f59e0b", fontSize: 10 }} />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} name="Total" />
              <Area type="monotone" dataKey="pic" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="PIC" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {monthsPerTarget.map((t, i) => {
          const percent = Math.min(100, (t.current / t.required) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{t.label}</span>
                <span className="text-slate-400">
                  {formatTime(t.current)} / {formatTime(t.required)}
                  {t.remaining > 0 && ` — ${t.months} meses`}
                </span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-1.5">
                <div className="bg-accent rounded-full h-1.5 transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
