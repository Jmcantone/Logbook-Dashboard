"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, Navigation, Plane, ArrowDownToLine } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { ProgressRating } from "@/components/ProgressRating";
import { MonthlyChart } from "@/components/MonthlyChart";
import { FunctionChart } from "@/components/FunctionChart";
import { RecentFlights } from "@/components/RecentFlights";
import { ValidityPanel } from "@/components/ValidityPanel";
import { excelToMinutes, formatTime, excelDateToJS, formatDate } from "@/lib/transforms";

interface DashboardData {
  statistics: {
    totalFlightTime: number;
    singleEngine: number;
    multiEngine: number;
    crossCountry: number;
    night: number;
    ifr: number;
    pic: number;
    coPilot: number;
    dual: number;
    instructor: number;
    last28Days: { hours: number; sectors: number };
    last90Days: { hours: number; sectors: number };
    last12Months: { hours: number; sectors: number };
    totalSectors: number;
  };
  monthly: {
    year: number;
    month: string;
    total: number;
    se: number;
    me: number;
    pic: number;
    dual: number;
    xCountry: number;
    night: number;
    ifr: number;
  }[];
  flights: {
    date: number;
    depPlace: string;
    arrPlace: string;
    aircraftModel: string;
    registration: string;
    totalTime: number;
    picName: string;
    picTime: number;
    dualTime: number;
    remarks: string;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/sheets")
        .then((res) => res.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="flex flex-col items-center gap-4">
          <Plane className="w-10 h-10 text-accent animate-pulse" />
          <p className="text-slate-400">Loading flight data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <p className="text-red-400">Failed to load data. Please try again.</p>
      </div>
    );
  }

  const { statistics, monthly, flights } = data;

  // Convert Excel decimals to minutes
  const totalMinutes = excelToMinutes(statistics.totalFlightTime);
  const picMinutes = excelToMinutes(statistics.pic);
  const dualMinutes = excelToMinutes(statistics.dual);
  const coPilotMinutes = excelToMinutes(statistics.coPilot);
  const xCountryMinutes = excelToMinutes(statistics.crossCountry);
  const nightMinutes = excelToMinutes(statistics.night);

  // Monthly chart data
  const monthlyChartData = monthly.map((m) => ({
    label: `${m.month.substring(0, 3)} ${m.year.toString().slice(-2)}`,
    pic: excelToMinutes(m.pic),
    dual: excelToMinutes(m.dual),
    total: excelToMinutes(m.total),
  }));

  // Recent flights (last 10)
  const recentFlights = [...flights]
    .reverse()
    .slice(0, 10)
    .map((f) => {
      const flightFunc = f.picTime > 0 ? "PIC" : "Dual";
      const dateObj = excelDateToJS(f.date);
      return {
        date: formatDate(dateObj),
        route: `${f.depPlace} → ${f.arrPlace}`,
        aircraft: `${f.aircraftModel} ${f.registration}`,
        duration: formatTime(excelToMinutes(f.totalTime)),
        function: flightFunc,
        remarks: f.remarks || "",
      };
    });

  // Total takeoffs & landings from statistics
  const totalTakeoffs = statistics.totalSectors;

  // Validity items
  const validityItems = [
    {
      label: "PPL(A)",
      detail: "Issued 19/06/2025 — ESP.FCL.00114944",
      expiryDate: null,
    },
    {
      label: "SEP (land)/SP Rating",
      detail: "Valid until 31/05/2027",
      expiryDate: new Date(2027, 4, 31),
    },
    {
      label: "Medical Class 2",
      detail: "E-10117794 — Valid until 20/01/2027",
      expiryDate: new Date(2027, 0, 20),
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Plane className="w-6 h-6 text-accent" />
              Flight Logbook
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Juan Manuel Cantone Guzman · PPL(A) · ESP.FCL.00114944
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Last updated: {new Date().toLocaleDateString("es-ES")}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Flight Hours"
            value={formatTime(totalMinutes)}
            icon={Clock}
            subtitle="All time"
          />
          <KPICard
            title="PIC Hours"
            value={formatTime(picMinutes)}
            icon={Plane}
            subtitle="Pilot in Command"
          />
          <KPICard
            title="Cross-Country"
            value={formatTime(xCountryMinutes)}
            icon={Navigation}
            subtitle="Dep ≠ Arr"
          />
          <KPICard
            title="Takeoffs & Landings"
            value={totalTakeoffs.toString()}
            icon={ArrowDownToLine}
            subtitle="Total sectors"
          />
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProgressRating
            title="Night Rating"
            emoji="🌙"
            items={[
              { label: "Total flight time (pre-req)", current: totalMinutes, required: 45 * 60 },
              { label: "Night training hours", current: nightMinutes, required: 5 * 60 },
            ]}
          />
          <ProgressRating
            title="IR(A) — Instrument Rating"
            emoji="📡"
            items={[
              { label: "Total flight time", current: totalMinutes, required: 50 * 60 },
              { label: "PIC Cross-Country", current: excelToMinutes(statistics.crossCountry), required: 50 * 60 },
            ]}
          />
          <ProgressRating
            title="CPL(A) — Commercial Pilot"
            emoji="🏆"
            items={[
              { label: "Total flight time", current: totalMinutes, required: 200 * 60 },
              { label: "PIC time", current: picMinutes, required: 100 * 60 },
              { label: "PIC Cross-Country", current: excelToMinutes(statistics.crossCountry), required: 20 * 60 },
              { label: "Night time", current: nightMinutes, required: 5 * 60 },
            ]}
          />
          <ProgressRating
            title="ATPL — Airline Transport"
            emoji="🌐"
            items={[
              { label: "Total flight time", current: totalMinutes, required: 1500 * 60 },
              { label: "PIC time", current: picMinutes, required: 500 * 60 },
            ]}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MonthlyChart data={monthlyChartData} />
          </div>
          <FunctionChart pic={picMinutes} dual={dualMinutes} coPilot={coPilotMinutes} />
        </div>

        {/* Recent Flights */}
        <RecentFlights flights={recentFlights} />

        {/* Validity Panel */}
        <ValidityPanel items={validityItems} />
      </div>
    </div>
  );
}
