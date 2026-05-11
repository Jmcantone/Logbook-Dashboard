"use client";

interface ProgressItem {
  label: string;
  current: number;
  required: number;
}

interface ProgressRatingProps {
  title: string;
  emoji: string;
  items: ProgressItem[];
}

function getStatusBadge(percent: number) {
  if (percent >= 100) return { text: "COMPLETADO", color: "bg-green-500/20 text-green-400" };
  if (percent >= 75) return { text: "AVANZADO", color: "bg-yellow-500/20 text-yellow-400" };
  return { text: "PENDIENTE", color: "bg-red-500/20 text-red-400" };
}

function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0:00";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function ProgressRating({ title, emoji, items }: ProgressRatingProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        {emoji} {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => {
          const percent = Math.min(100, (item.current / item.required) * 100);
          const status = getStatusBadge(percent);
          const remaining = Math.max(0, item.required - item.current);

          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {formatMinutes(item.current)} / {formatMinutes(item.required)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-2">
                <div
                  className="bg-accent rounded-full h-2 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              {remaining > 0 && (
                <p className="text-xs text-slate-500">
                  Faltan: {formatMinutes(remaining)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
