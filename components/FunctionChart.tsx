"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FunctionChartProps {
  pic: number;
  dual: number;
  coPilot: number;
}

const COLORS = ["#3b82f6", "#64748b", "#10b981"];

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function FunctionChart({ pic, dual, coPilot }: FunctionChartProps) {
  const data = [
    { name: "PIC", value: pic },
    { name: "Dual", value: dual },
    { name: "Co-Pilot", value: coPilot },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        🧑‍✈️ Distribución de Función
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              formatter={(value: number) => formatHours(value)}
            />
            <Legend
              wrapperStyle={{ color: "#94a3b8" }}
              formatter={(value, entry) => {
                const item = data.find((d) => d.name === value);
                return `${value}: ${item ? formatHours(item.value) : "0:00"}`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
