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

export async function getSheetData(range: string): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
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
  last28Days: { hours: number; sectors: number };
  last90Days: { hours: number; sectors: number };
  last12Months: { hours: number; sectors: number };
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
  date: number;
  depPlace: string;
  depTime: string;
  arrPlace: string;
  arrTime: string;
  aircraftModel: string;
  registration: string;
  seTime: number;
  meTime: number;
  multiPilotTime: number;
  totalTime: number;
  picName: string;
  toDay: number;
  toNight: number;
  ldgDay: number;
  ldgNight: number;
  nightTime: number;
  ifrTime: number;
  xCountryTime: number;
  picTime: number;
  coPilotTime: number;
  dualTime: number;
  instructorTime: number;
  remarks: string;
}

export async function getStatistics(): Promise<StatisticsData> {
  // Read the Statistics sheet — values are in specific cells
  const rows = await getSheetData("Statistics!A1:Z50");

  // Helper to find a value by label
  function findValue(label: string): number {
    for (const row of rows) {
      if (row[0] && row[0].toString().includes(label)) {
        const val = parseFloat(row[1]?.toString() || "0");
        return isNaN(val) ? 0 : val;
      }
    }
    return 0;
  }

  function findSectors(label: string): number {
    for (const row of rows) {
      if (row[0] && row[0].toString().includes(label)) {
        // Sectors are in column 3 (index 2) for the temporal metrics
        const val = parseInt(row[2]?.toString() || "0");
        return isNaN(val) ? 0 : val;
      }
    }
    return 0;
  }

  return {
    totalFlightTime: findValue("Total Flight Time"),
    singleEngine: findValue("Single Engine"),
    multiEngine: findValue("Multi Engine"),
    crossCountry: findValue("Cross-Country"),
    night: findValue("Night"),
    ifr: findValue("IFR"),
    pic: findValue("PIC (Pilot in Command)"),
    coPilot: findValue("Co-Pilot"),
    dual: findValue("Dual"),
    instructor: findValue("Instructor"),
    last28Days: { hours: findValue("Últimos 28 días"), sectors: findSectors("Últimos 28 días") },
    last90Days: { hours: findValue("Últimos 90 días"), sectors: findSectors("Últimos 90 días") },
    last12Months: { hours: findValue("Últimos 12 meses"), sectors: findSectors("Últimos 12 meses") },
    totalSectors: findSectors("Total sectores"),
  };
}

export async function getMonthlyData(): Promise<MonthlyRow[]> {
  const rows = await getSheetData("Monthly Summary!A3:J100");

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
      total: parseFloat(row[2]?.toString() || "0"),
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
  const rows = await getSheetData("Flight Log!A3:X100");

  const data: FlightRow[] = [];
  for (const row of rows) {
    if (!row[0] || !row[1]) continue;
    const dateVal = parseFloat(row[0]?.toString() || "0");
    if (isNaN(dateVal) || dateVal === 0) continue;

    data.push({
      date: dateVal,
      depPlace: row[1]?.toString() || "",
      depTime: row[2]?.toString() || "",
      arrPlace: row[3]?.toString() || "",
      arrTime: row[4]?.toString() || "",
      aircraftModel: row[5]?.toString() || "",
      registration: row[6]?.toString() || "",
      seTime: parseFloat(row[7]?.toString() || "0"),
      meTime: parseFloat(row[8]?.toString() || "0"),
      multiPilotTime: parseFloat(row[9]?.toString() || "0"),
      totalTime: parseFloat(row[10]?.toString() || "0"),
      picName: row[11]?.toString() || "",
      toDay: parseInt(row[12]?.toString() || "0"),
      toNight: parseInt(row[13]?.toString() || "0"),
      ldgDay: parseInt(row[14]?.toString() || "0"),
      ldgNight: parseInt(row[15]?.toString() || "0"),
      nightTime: parseFloat(row[16]?.toString() || "0"),
      ifrTime: parseFloat(row[17]?.toString() || "0"),
      xCountryTime: parseFloat(row[18]?.toString() || "0"),
      picTime: parseFloat(row[19]?.toString() || "0"),
      coPilotTime: parseFloat(row[20]?.toString() || "0"),
      dualTime: parseFloat(row[21]?.toString() || "0"),
      instructorTime: parseFloat(row[22]?.toString() || "0"),
      remarks: row[23]?.toString() || "",
    });
  }

  return data;
}
