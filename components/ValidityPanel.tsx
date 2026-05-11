"use client";

import { Shield } from "lucide-react";

interface ValidityItem {
  label: string;
  detail: string;
  expiryDate: Date | null;
}

interface ValidityPanelProps {
  items: ValidityItem[];
}

function getDaysRemaining(date: Date | null): number | null {
  if (!date) return null;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusColor(days: number | null): string {
  if (days === null) return "text-slate-400";
  if (days > 180) return "text-green-400";
  if (days > 90) return "text-yellow-400";
  return "text-red-400";
}

function getBadgeColor(days: number | null): string {
  if (days === null) return "bg-slate-500/20 text-slate-400";
  if (days > 180) return "bg-green-500/20 text-green-400";
  if (days > 90) return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}

export function ValidityPanel({ items }: ValidityPanelProps) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-white">
          Licence & Medical Validity
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => {
          const days = getDaysRemaining(item.expiryDate);
          const statusColor = getStatusColor(days);
          const badgeColor = getBadgeColor(days);

          return (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg"
            >
              <div>
                <p className="text-white font-medium text-sm">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.detail}</p>
              </div>
              <div className="text-right">
                {days !== null ? (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${badgeColor}`}>
                    {days} days
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-500/20 text-slate-400">
                    No expiry
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
