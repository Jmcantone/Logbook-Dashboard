"use client";

import { CheckCircle, Clock } from "lucide-react";

interface Subject {
  code: string;
  name: string;
  status: "passed" | "pending";
  date?: string;
  grade?: number;
}

interface ATPLTheoryProps {
  subjects: Subject[];
  firstExamDate?: string;
}

const ATPL_SUBJECTS: { code: string; name: string }[] = [
  { code: "010", name: "Air Law" },
  { code: "021", name: "Airframe, Systems & Powerplant" },
  { code: "022", name: "Instrumentation" },
  { code: "031", name: "Mass and Balance" },
  { code: "032", name: "Performance" },
  { code: "033", name: "Flight Planning and Monitoring" },
  { code: "040", name: "Human Performance" },
  { code: "050", name: "Meteorology" },
  { code: "061", name: "General Navigation" },
  { code: "062", name: "Radio Navigation" },
  { code: "070", name: "Operational Procedures" },
  { code: "081", name: "Principles of Flight" },
  { code: "091", name: "VFR Communications" },
  { code: "092", name: "IFR Communications" },
];

export function ATPLTheory({ subjects, firstExamDate }: ATPLTheoryProps) {
  const passed = subjects.filter((s) => s.status === "passed").length;
  const total = ATPL_SUBJECTS.length;
  const percent = Math.round((passed / total) * 100);

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          📚 Teoría ATPL
        </h3>
        <span className="text-sm text-slate-400">
          {passed} / {total} aprobadas ({percent}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-navy-700 rounded-full h-3">
        <div
          className="bg-accent rounded-full h-3 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Rules */}
      <div className="p-3 bg-navy-900/50 rounded-lg text-xs text-slate-400 space-y-1">
        <p>⚠️ <strong>18 meses</strong> desde el 1er examen para aprobar los 14 módulos</p>
        <p>⚠️ <strong>36 meses</strong> de validez de créditos desde el último examen</p>
        {firstExamDate && (
          <p>📅 Primer examen: <span className="text-white">{firstExamDate}</span></p>
        )}
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ATPL_SUBJECTS.map((subj) => {
          const result = subjects.find((s) => s.code === subj.code);
          const isPassed = result?.status === "passed";

          return (
            <div
              key={subj.code}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                isPassed ? "bg-green-500/10" : "bg-navy-900/50"
              }`}
            >
              {isPassed ? (
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className="text-slate-400 font-mono text-xs">{subj.code}</span>
              <span className={`truncate ${isPassed ? "text-green-300" : "text-slate-300"}`}>
                {subj.name}
              </span>
              {result?.grade && (
                <span className="ml-auto text-xs text-green-400 font-medium">
                  {result.grade}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
