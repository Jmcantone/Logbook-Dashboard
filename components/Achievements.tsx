"use client";

import { excelToMinutes } from "@/lib/transforms";

interface AchievementsProps {
  totalMinutes: number;
  picMinutes: number;
  totalFlights: number;
  aerodromeCount: number;
  xCountryFlights: number;
  hasSolo: boolean;
  hasXCountrySolo: boolean;
  hasPPL: boolean;
}

interface Badge {
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export function Achievements({
  totalMinutes,
  picMinutes,
  totalFlights,
  aerodromeCount,
  xCountryFlights,
  hasSolo,
  hasXCountrySolo,
  hasPPL,
}: AchievementsProps) {
  const totalHours = totalMinutes / 60;
  const picHours = picMinutes / 60;

  const badges: Badge[] = [
    { emoji: "🐣", title: "First Flight", description: "Complete your first flight", unlocked: totalFlights >= 1 },
    { emoji: "🎓", title: "First Solo", description: "Fly solo for the first time", unlocked: hasSolo },
    { emoji: "🗺️", title: "Navigator", description: "Complete first cross-country", unlocked: xCountryFlights >= 1 },
    { emoji: "🧭", title: "Solo Navigator", description: "Solo cross-country flight", unlocked: hasXCountrySolo },
    { emoji: "🪪", title: "Licensed Pilot", description: "Obtain PPL(A)", unlocked: hasPPL },
    { emoji: "⏱️", title: "10 Hours", description: "Log 10 total hours", unlocked: totalHours >= 10 },
    { emoji: "🕐", title: "25 Hours", description: "Log 25 total hours", unlocked: totalHours >= 25 },
    { emoji: "✈️", title: "50 Hours", description: "Log 50 total hours", unlocked: totalHours >= 50 },
    { emoji: "🏅", title: "10h PIC", description: "10 hours as Pilot in Command", unlocked: picHours >= 10 },
    { emoji: "🎖️", title: "25h PIC", description: "25 hours as Pilot in Command", unlocked: picHours >= 25 },
    { emoji: "📍", title: "3 Aerodromes", description: "Visit 3 different aerodromes", unlocked: aerodromeCount >= 3 },
    { emoji: "🌍", title: "5 Aerodromes", description: "Visit 5 different aerodromes", unlocked: aerodromeCount >= 5 },
    { emoji: "🔟", title: "10 Flights", description: "Complete 10 flights", unlocked: totalFlights >= 10 },
    { emoji: "💯", title: "25 Flights", description: "Complete 25 flights", unlocked: totalFlights >= 25 },
    { emoji: "🏆", title: "50 Flights", description: "Complete 50 flights", unlocked: totalFlights >= 50 },
    { emoji: "🌙", title: "Night Owl", description: "Complete a night flight", unlocked: false },
    { emoji: "🌦️", title: "IFR Pilot", description: "Log instrument time", unlocked: false },
    { emoji: "💎", title: "100 Hours", description: "Log 100 total hours", unlocked: totalHours >= 100 },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">🏆 Achievements</h3>
        <span className="text-sm text-slate-400">{unlockedCount} / {badges.length} unlocked</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-navy-700 rounded-full h-2">
        <div
          className="bg-accent rounded-full h-2 transition-all"
          style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {badges.map((badge, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border text-center transition-all ${
              badge.unlocked
                ? "bg-navy-900/50 border-accent/30"
                : "bg-navy-900/30 border-navy-700 opacity-40 grayscale"
            }`}
          >
            <div className="text-2xl mb-1">{badge.emoji}</div>
            <p className={`text-xs font-medium ${badge.unlocked ? "text-white" : "text-slate-500"}`}>
              {badge.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
