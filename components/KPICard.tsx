"use client";

import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
}

export function KPICard({ title, value, icon: Icon, subtitle }: KPICardProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 sm:p-6 space-y-1 sm:space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs sm:text-sm font-medium">{title}</span>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
      {subtitle && (
        <p className="text-slate-500 text-xs">{subtitle}</p>
      )}
    </div>
  );
}
