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
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && (
        <p className="text-slate-500 text-xs">{subtitle}</p>
      )}
    </div>
  );
}
