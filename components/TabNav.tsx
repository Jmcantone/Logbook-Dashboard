"use client";

interface Tab {
  id: string;
  label: string;
  emoji: string;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex gap-1 p-1 bg-navy-800 border border-navy-700 rounded-xl overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? "bg-accent text-white shadow-lg shadow-accent/20"
              : "text-slate-400 hover:text-white hover:bg-navy-700"
          }`}
        >
          <span>{tab.emoji}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
