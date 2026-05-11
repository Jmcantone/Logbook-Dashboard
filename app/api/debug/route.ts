import { NextResponse } from "next/server";
import { getSheetData, getFormattedSheetData } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getSheetData("Statistics!A1:C30");
    const monthly = await getSheetData("Monthly Summary!A4:J10");
    const flights = await getFormattedSheetData("Flight Log!A5:Y8");
    const flightsRaw = await getSheetData("Flight Log!A5:Y8");

    return NextResponse.json({ stats, monthly, flights, flightsRaw });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
