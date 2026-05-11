"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyChartData {
  label: string;
  pic: number;
  dual: number;
  total: number;
}

interface MonthlyChartProps {
  data: MonthlyChartData[];
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        📈 Actividad Mensual
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
              tickFormatter={(val) => formatHours(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              formatter={(value: number) => formatHours(value)}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="pic" name="PIC" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="dual" name="Dual" fill="#64748b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
