import { google } from "googleapis";

function getAuth() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getSheetData(range: string): Promise<any[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  return (response.data.values as any[][]) || [];
}

export async function getFormattedSheetData(range: string): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range,
    valueRenderOption: "FORMATTED_VALUE",
  });

  return (response.data.values as string[][]) || [];
}

export interface StatisticsData {
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
}

export interface MonthlyRow {
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
}

export interface FlightRow {
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

export async function getStatistics(): Promise<StatisticsData> {
  const rows = await getSheetData("Statistics!A1:C30");

  function findValue(label: string): number {
    for (const row of rows) {
      const cellA = row[0]?.toString() || "";
      if (cellA.includes(label)) {
        const val = parseFloat(row[1]?.toString() || "0");
        return isNaN(val) ? 0 : val;
      }
    }
    return 0;
  }

  // TOTALS row has T/O Day in column B (index 1)
  let totalTakeoffs = 0;
  for (const row of rows) {
    if (row[0]?.toString() === "TOTALS") {
      totalTakeoffs = parseInt(row[1]?.toString() || "0");
      break;
    }
  }

  return {
    totalFlightTime: findValue("Total Flight Time"),
    singleEngine: findValue("Single Engine"),
    multiEngine: findValue("Multi Engine"),
    crossCountry: findValue("Cross-Country (auto)") || findValue("X-Country TOTAL"),
    night: findValue("Night"),
    ifr: findValue("IFR"),
    pic: findValue("PIC (Pilot in Command)"),
    coPilot: findValue("Co-Pilot"),
    dual: findValue("Dual (under instruction)") || findValue("Dual"),
    instructor: findValue("Instructor"),
    picXCountry: findValue("X-Country as PIC"),
    totalSectors: totalTakeoffs,
  };
}

export async function getMonthlyData(): Promise<MonthlyRow[]> {
  // Row 4 is the header (AÑO, MES, ...), data starts at row 5
  const rows = await getSheetData("Monthly Summary!A5:J60");

  const data: MonthlyRow[] = [];
  for (const row of rows) {
    if (!row[0] || !row[1]) continue;
    const year = parseInt(row[0]?.toString());
    if (isNaN(year)) continue;

    const total = parseFloat(row[2]?.toString() || "0");
    if (total === 0) continue;

    data.push({
      year,
      month: row[1]?.toString() || "",
      total,
      se: parseFloat(row[3]?.toString() || "0"),
      me: parseFloat(row[4]?.toString() || "0"),
      pic: parseFloat(row[5]?.toString() || "0"),
      dual: parseFloat(row[6]?.toString() || "0"),
      xCountry: parseFloat(row[7]?.toString() || "0"),
      night: parseFloat(row[8]?.toString() || "0"),
      ifr: parseFloat(row[9]?.toString() || "0"),
    });
  }

  return data;
}

export async function getFlightLog(): Promise<FlightRow[]> {
  // Flight log: row 5 is first empty row, actual data starts at row 6
  // Column A is empty, data is in B onwards (index 1+)
  const [formattedRows, rawRows] = await Promise.all([
    getFormattedSheetData("Flight Log!A6:Y100"),
    getSheetData("Flight Log!A6:Y100"),
  ]);

  const data: FlightRow[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const fRow = formattedRows[i];
    if (!row || !row[1]) continue;

    // Stop at TOTAL rows
    const col1 = row[1]?.toString() || "";
    if (col1.includes("TOTAL") || col1.includes("certify")) break;

    // Col indices (0-based, col A=0 is empty):
    // 1=Date, 2=DepPlace, 3=DepTime, 4=ArrPlace, 5=ArrTime
    // 6=Model, 7=Reg, 8=SE, 9=ME, 10=MultiPilot, 11=TotalTime
    // 12=PICName, 13=TODay, 14=TONight, 15=LdgDay, 16=LdgNight
    // 17=Night, 18=IFR, 19=XCountry, 20=PICTime, 21=CoPilot, 22=Dual, 23=Instr

    const dateFormatted = fRow?.[1]?.toString() || "";
    const depPlace = (row[2]?.toString() || "").trim();
    const arrPlace = (row[4]?.toString() || "").trim();
    const model = (row[6]?.toString() || "").trim();
    const reg = (row[7]?.toString() || "").trim();
    const totalTime = parseFloat(row[11]?.toString() || "0");
    const picName = (row[12]?.toString() || "").trim();
    const toDay = parseInt(row[13]?.toString() || "0");
    const picTime = parseFloat(row[20]?.toString() || "0");
    const dualTime = parseFloat(row[22]?.toString() || "0");
    const remarks = (row[23]?.toString() || "").trim();

    if (isNaN(totalTime) || totalTime === 0) continue;

    data.push({
      date: dateFormatted,
      depPlace,
      arrPlace,
      aircraftModel: model,
      registration: reg,
      totalTime,
      picName,
      picTime,
      dualTime,
      toDay: isNaN(toDay) ? 0 : toDay,
      remarks,
    });
  }

  return data;
}
