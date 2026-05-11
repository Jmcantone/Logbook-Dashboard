"use client";

import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="grid grid-cols-4 gap-1 p-1 bg-navy-800 border border-navy-700 rounded-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 sm:px-4 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-slate-400 hover:text-white hover:bg-navy-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
