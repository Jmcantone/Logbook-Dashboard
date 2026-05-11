import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStatistics, getMonthlyData, getFlightLog } from "@/lib/sheets";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [statistics, monthly, flights] = await Promise.all([
      getStatistics(),
      getMonthlyData(),
      getFlightLog(),
    ]);

    return NextResponse.json({ statistics, monthly, flights });
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
