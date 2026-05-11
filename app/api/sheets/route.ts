import { NextResponse } from "next/server";
import { getStatistics, getMonthlyData, getFlightLog } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [statistics, monthly, flights] = await Promise.all([
      getStatistics(),
      getMonthlyData(),
      getFlightLog(),
    ]);

    return NextResponse.json({ statistics, monthly, flights });
  } catch (error: any) {
    console.error("Error fetching sheet data:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
