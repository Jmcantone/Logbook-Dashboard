# ✈️ Pilot Flight Logbook Dashboard

A private pilot flight logbook dashboard built with Next.js 14 (App Router), deployed on Vercel. Reads flight data from a Google Sheet and displays it in a clean, aviation-themed UI.

## Features

- **KPI Cards**: Total hours, PIC hours, cross-country, takeoffs & landings
- **Progress Tracking**: Visual progress toward Night Rating, IR(A), CPL(A), ATPL
- **Monthly Activity Chart**: Bar chart with PIC vs Dual breakdown
- **Pilot Function Distribution**: Donut chart (PIC / Dual / Co-Pilot)
- **Recent Flights Table**: Last 10 flights with route, aircraft, duration
- **Licence & Medical Validity**: Color-coded expiry tracking
- **Authentication**: Google OAuth, restricted to a single authorized user

## Setup Instructions

### 1. Google Cloud Service Account (for Sheets API)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts**
5. Create a service account, download the JSON key
6. Note the `client_email` and `private_key` from the JSON

### 2. Share the Google Sheet

1. Open your flight logbook Google Sheet
2. Click **Share** → paste the service account email (e.g., `my-sa@project.iam.gserviceaccount.com`)
3. Give it **Viewer** access
4. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 3. Google OAuth Credentials (for user login)

1. In Google Cloud Console → **APIs & Services → Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
4. Note the Client ID and Client Secret

### 4. Environment Variables

Create a `.env.local` file (or set in Vercel dashboard):

```env
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
ALLOWED_EMAIL=your.email@gmail.com
```

Generate `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### 5. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Set `NEXTAUTH_URL` to your production URL
5. Deploy

## Google Sheet Structure

The spreadsheet must have these sheets with the following columns:

### Statistics
Key-value pairs with labels in column A and values in column B:
- Total Flight Time, Single Engine, Multi Engine, Cross-Country, Night, IFR
- PIC (Pilot in Command), Co-Pilot, Dual, Instructor
- Últimos 28 días, Últimos 90 días, Últimos 12 meses (hours in B, sectors in C)

### Monthly Summary
Starting from row 3: Year | Month | Total | SE | ME | PIC | Dual | X-Country | Night | IFR

### Flight Log
Starting from row 3: Date | Dep Place | Dep Time | Arr Place | Arr Time | Aircraft Model | Registration | SE | ME | Multi-Pilot | Total Time | PIC Name | T/O Day | T/O Night | Ldg Day | Ldg Night | Night | IFR | X-Country | PIC | Co-Pilot | Dual | Instructor | Remarks

**All time values are stored as Excel decimal fractions of a day** (e.g., 0.0833 = 2h). The app multiplies by 24 automatically.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js with Google OAuth
- **Data**: Google Sheets API v4 (service account)
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## License

Private project — not for redistribution.
