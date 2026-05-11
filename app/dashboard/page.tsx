"use client";

import { useEffect, useState } from "react";
import { Clock, Navigation, Plane, ArrowDownToLine } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { ProgressRating } from "@/components/ProgressRating";
import { MonthlyChart } from "@/components/MonthlyChart";
import { FunctionChart } from "@/components/FunctionChart";
import { RecentFlights } from "@/components/RecentFlights";
import { ValidityPanel } from "@/components/ValidityPanel";
import { CurrencyTracker } from "@/components/CurrencyTracker";
import { AerodromeMap } from "@/components/AerodromeMap";
import { AircraftTable } from "@/components/AircraftTable";
import { ATPLTheory } from "@/components/ATPLTheory";
import { CPLEstimator } from "@/components/CPLEstimator";
import { TabNav } from "@/components/TabNav";
import { FlightHeatmap } from "@/components/FlightHeatmap";
import { FlightStats } from "@/components/FlightStats";
import { Achievements } from "@/components/Achievements";
import { MonthlyGoal } from "@/components/MonthlyGoal";
import { WeatherWidget } from "@/components/WeatherWidget";
import { excelToMinutes, formatTime } from "@/lib/transforms";

interface FlightData {
  date: string;
  depPlace: string;
  arrPlace: string;
  aircraftModel: string;
  registration: string;
  totalTime: number;
  picName: string;
  picTime: number;
  dualTime: number;
  toDay: number;
  remarks: string;
}

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
    picXCountry: number;
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
  flights: FlightData[];
}

const TABS = [
  { id: "overview", label: "Resumen", emoji: "📊" },
  { id: "planner", label: "Planificación", emoji: "🎯" },
  { id: "flights", label: "Vuelos", emoji: "🛫" },
  { id: "map", label: "Mapa & Aeronaves", emoji: "🗺️" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("/api/sheets")
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((d) => {
        if (d.statistics) setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="flex flex-col items-center gap-4">
          <Plane className="w-10 h-10 text-accent animate-pulse" />
          <p className="text-slate-400">Cargando datos de vuelo...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <p className="text-red-400">Error al cargar datos. Intentá de nuevo.</p>
      </div>
    );
  }

  const { statistics, monthly, flights } = data;

  // Conversions
  const totalMinutes = excelToMinutes(statistics.totalFlightTime);
  const picMinutes = excelToMinutes(statistics.pic);
  const dualMinutes = excelToMinutes(statistics.dual);
  const coPilotMinutes = excelToMinutes(statistics.coPilot);
  const xCountryMinutes = excelToMinutes(statistics.crossCountry);
  const picXCountryMinutes = excelToMinutes(statistics.picXCountry);
  const nightMinutes = excelToMinutes(statistics.night);
  const totalTakeoffs = flights.reduce((sum, f) => sum + (f.toDay || 0), 0);

  // Monthly chart
  const monthlyChartData = monthly.map((m) => ({
    label: `${m.month.substring(0, 3)} ${m.year.toString().slice(-2)}`,
    pic: excelToMinutes(m.pic),
    dual: excelToMinutes(m.dual),
    total: excelToMinutes(m.total),
  }));

  // All flights table
  const allFlights = [...flights].reverse().map((f) => ({
    date: f.date,
    route: `${f.depPlace} → ${f.arrPlace}`,
    aircraft: `${f.aircraftModel} ${f.registration}`,
    duration: formatTime(excelToMinutes(f.totalTime)),
    function: f.picTime > 0 ? "PIC" : "Dual",
    remarks: f.remarks || "",
  }));

  // Currency
  const now = new Date();
  function parseFlightDate(dateStr: string): Date | null {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }

  let hoursLast12m = 0, picHoursLast12m = 0, takeoffsLast12m = 0;
  for (const f of flights) {
    const d = parseFlightDate(f.date);
    if (!d) continue;
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 365) {
      hoursLast12m += excelToMinutes(f.totalTime) / 60;
      picHoursLast12m += excelToMinutes(f.picTime) / 60;
      takeoffsLast12m += f.toDay || 0;
    }
  }

  // Aerodrome visits
  const aerodromeVisits: Record<string, number> = {};
  for (const f of flights) {
    if (f.depPlace) aerodromeVisits[f.depPlace] = (aerodromeVisits[f.depPlace] || 0) + 1;
    if (f.arrPlace && f.arrPlace !== f.depPlace)
      aerodromeVisits[f.arrPlace] = (aerodromeVisits[f.arrPlace] || 0) + 1;
  }

  // Aircraft
  const aircraftMap: Record<string, { model: string; minutes: number; flights: number; lastFlown: string }> = {};
  for (const f of flights) {
    if (!f.registration) continue;
    if (!aircraftMap[f.registration])
      aircraftMap[f.registration] = { model: f.aircraftModel, minutes: 0, flights: 0, lastFlown: "" };
    aircraftMap[f.registration].minutes += excelToMinutes(f.totalTime);
    aircraftMap[f.registration].flights += 1;
    aircraftMap[f.registration].lastFlown = f.date;
  }
  const aircraftStats = Object.entries(aircraftMap)
    .map(([reg, d]) => ({ registration: reg, model: d.model, totalMinutes: d.minutes, flights: d.flights, lastFlown: d.lastFlown }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);

  // Flights this month
  const flightsThisMonth = flights.filter((f) => {
    const d = parseFlightDate(f.date);
    if (!d) return false;
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Validity
  const validityItems = [
    { label: "PPL(A)", detail: "Emitida 19/06/2025 — ESP.FCL.00114944", expiryDate: null },
    { label: "Habilitación SEP (land)/SP", detail: "Válida hasta 31/05/2027", expiryDate: new Date(2027, 4, 31) },
    { label: "Certificado Médico Clase 2", detail: "E-10117794 — Válido hasta 20/01/2027", expiryDate: new Date(2027, 0, 20) },
  ];

  const lastFlightDate = flights[flights.length - 1]?.date || "—";

  return (
    <div className="min-h-screen bg-navy-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
        </div>

        {/* Tabs */}
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Horas Totales" value={formatTime(totalMinutes)} icon={Clock} subtitle="Tiempo total de vuelo" />
              <KPICard title="Horas PIC" value={formatTime(picMinutes)} icon={Plane} subtitle="Piloto al Mando" />
              <KPICard title="Cross-Country" value={formatTime(xCountryMinutes)} icon={Navigation} subtitle="Dep ≠ Arr" />
              <KPICard title="Despegues y Aterrizajes" value={totalTakeoffs.toString()} icon={ArrowDownToLine} subtitle="Total sectores" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CurrencyTracker
                lastFlightDate={lastFlightDate}
                hoursLast12Months={hoursLast12m}
                picHoursLast12Months={picHoursLast12m}
                takeoffsLast12Months={takeoffsLast12m}
              />
              <ValidityPanel items={validityItems} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProgressRating title="Night Rating" emoji="🌙" items={[
                { label: "Tiempo total de vuelo (pre-req)", current: totalMinutes, required: 45 * 60 },
                { label: "Horas nocturnas", current: nightMinutes, required: 5 * 60 },
              ]} />
              <ProgressRating title="IR(A) — Instrument Rating" emoji="📡" items={[
                { label: "Tiempo total de vuelo", current: totalMinutes, required: 50 * 60 },
                { label: "PIC Cross-Country", current: picXCountryMinutes, required: 50 * 60 },
              ]} />
              <ProgressRating title="CPL(A) — Piloto Comercial" emoji="🏆" items={[
                { label: "Tiempo total de vuelo", current: totalMinutes, required: 200 * 60 },
                { label: "Tiempo PIC", current: picMinutes, required: 100 * 60 },
                { label: "PIC Cross-Country", current: picXCountryMinutes, required: 20 * 60 },
                { label: "Tiempo nocturno", current: nightMinutes, required: 5 * 60 },
              ]} />
              <ProgressRating title="ATPL — Transporte de Línea Aérea" emoji="🌐" items={[
                { label: "Tiempo total de vuelo", current: totalMinutes, required: 1500 * 60 },
                { label: "Tiempo PIC", current: picMinutes, required: 500 * 60 },
              ]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <MonthlyChart data={monthlyChartData} />
              </div>
              <FunctionChart pic={picMinutes} dual={dualMinutes} coPilot={coPilotMinutes} />
            </div>
          </div>
        )}

        {/* TAB: Planner */}
        {activeTab === "planner" && (
          <div className="space-y-6">
            <CPLEstimator
              totalMinutes={totalMinutes}
              picMinutes={picMinutes}
              picXCountryMinutes={picXCountryMinutes}
            />
            <ATPLTheory subjects={[]} />
          </div>
        )}

        {/* TAB: Flights */}
        {activeTab === "flights" && (
          <div className="space-y-6">
            <FlightHeatmap flightDates={flights.map((f) => f.date)} />
            <FlightStats flights={flights} />
            <RecentFlights flights={allFlights} />
          </div>
        )}

        {/* TAB: Map & Aircraft */}
        {activeTab === "map" && (
          <div className="space-y-6">
            <AerodromeMap visits={aerodromeVisits} />
            <AircraftTable aircraft={aircraftStats} />
          </div>
        )}
      </div>
    </div>
  );
}
