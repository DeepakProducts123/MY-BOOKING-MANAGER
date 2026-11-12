# BOOKING DATA MANAGER

### Daily Booking Data Automation & Google Sheets Management Platform

A high-performance, enterprise SaaS platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Google Sheets API v4**.

Designed in a **Black & Electric Blue** theme, this platform automates daily hotel booking report uploads from channels like Booking.com, Agoda, and Expedia, maps column headers intelligently, validates and rejects duplicates, appends new records strictly below existing data in Master Google Spreadsheets, and provides dynamic data filtering and custom column export.

---

## 1. Key Capabilities & Architecture

### A. Daily Booking Ingestion Engine (5-Step Automated Workflow)
1. **Template Selection**: Choose from reusable templates (Standard Master, Booking.com Partner, Agoda YCS, or custom). Templates persist column mappings, alias dictionary, and mandatory constraints.
2. **Spreadsheet & Worksheet Destination**: Select from connected Master Google Spreadsheets (e.g., UAE, UK, International) and specific worksheet tabs.
3. **Drag-and-Drop File Ingestion**: Supports `.xlsx`, `.xls`, and `.csv` files up to 25 MB with client-side buffer parsing and sample quick-load buttons.
4. **Heading-Based Smart Column Mapping**:
   - Matches columns by semantic header names rather than positional indexes.
   - Comprehensive alias dictionary (`"Booking ID"`, `"Confirmation No"`, `"Res #"` &rarr; `"Booking Reference"`).
   - Halts and warns if mandatory destination columns are missing.
   - Configurable handling for additional unmapped source columns (ignore, warn, or append).
5. **Multi-Stage Validation & Duplicate Detection**:
   - Cross-checks uploaded booking references against the destination Google Sheet worksheet in real-time.
   - Identifies internal duplicate references within the uploaded file.
   - Validates date formats (YYYY-MM-DD, DD/MM/YYYY, Excel serial numbers), numeric amounts, mandatory fields, and empty rows.
   - Classifies records: `Valid New`, `Sheet Duplicate`, `File Duplicate`, `Invalid`.
6. **Non-Destructive Safe Bottom-Append**:
   - Appends strictly below the last occupied row via Google Sheets API v4 (`INSERT_ROWS`, `valueInputOption: 'USER_ENTERED'`).
   - Concurrency & idempotency protection: Historical booking data and existing header rows are guaranteed never to be modified or overwritten.
   - Generates full audit logs, line-by-line processing receipts, and downloadable error reports.

### B. Dynamic Download Data & Advanced Filtering Module
1. **Dynamic Schema & Type Inference**:
   - Reads any connected Google Spreadsheet and worksheet tab dynamically.
   - Infers column data types: `Text`, `Number`, `Date`, and `Categorical` (with distinct value discovery).
2. **Advanced Multi-Condition Filtering (AND / OR Logic)**:
   - **Text**: Equals, Does Not Equal, Contains, Does Not Contain, Starts With, Ends With, Is Empty, Is Not Empty.
   - **Date**: Equals, Before, After, Between (Start / End Date pickers), Is Empty, Is Not Empty.
   - **Number**: Equals, Does Not Equal, Greater Than (&gt;), Greater Than or Equal (&ge;), Less Than (&lt;), Less Than or Equal (&le;), Between (Min / Max), Is Empty, Is Not Empty.
   - **Categorical**: Multi-select pills with dynamic distinct values from the sheet, Select All, Clear All, In, Not In.
   - **Compound Logic**: Toggle between `AND` (all conditions must match) and `OR` (at least one condition must match).
3. **Independent Dynamic Column Selection**:
   - Filter criteria and export columns work completely independently. You can filter by fields (e.g. `Supplier = Derby`) without including them in the exported file.
   - Checkbox grid for every worksheet header with Select All / Clear All controls.
4. **Live Export Preview**:
   - Paginated preview table showing strictly matching records and chosen columns before downloading.
   - KPI metrics: Total in Sheet, Matching Records, Excluded by Filters, Selected Columns.
5. **Instant Excel & CSV Export**:
   - Downloads as formatted `.xlsx` or `.csv` with clean naming convention (`Booking_Export_Worksheet_YYYY-MM-DD.xlsx`).
   - Audit trail logged in `Export History` tracking export timestamp, applied filters, matching rows, and format.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS (Black & Electric Blue palette)
- **Icons**: Lucide React
- **File Parsing & Generation**:
  - `xlsx` (SheetJS) for Excel read/write
  - `papaparse` for CSV streaming and parsing
  - `date-fns` for robust date normalization
- **External APIs**:
  - Google Sheets API v4 (`googleapis`)
  - Google Drive API v3
  - Google OAuth 2.0
- **Database Support**:
  - Dual-mode database architecture:
    - **PostgreSQL / Supabase**: Production schema in `prisma/schema.prisma` & `scripts/schema.sql`
    - **Fast JSON Store (`data/bdm_store.json`)**: Zero-dependency local persistence for instant development and evaluation

---

## 3. UI Color Palette

The application strictly implements the requested enterprise Black & Electric Blue design:

| Element | Color Code | Tailwind / Token |
|---|---|---|
| Main Background | `#090D16` | `bg-bdm-bg` |
| Sidebar Background | `#0D1421` | `bg-bdm-sidebar` |
| Card Background | `#151E2E` | `bg-bdm-card` |
| Secondary Card | `#1B2638` | `bg-bdm-cardSecondary` |
| Card Hover | `#202D42` | `bg-bdm-cardHover` |
| Primary Blue | `#1677FF` | `text-bdm-primary` / `bg-bdm-primary` |
| Electric Blue | `#38BDF8` | `text-bdm-electric` / `border-bdm-electric` |
| Primary Text | `#F8FAFC` | `text-bdm-textPrimary` |
| Secondary Text | `#AAB5C8` | `text-bdm-textSecondary` |
| Border | `#29364A` | `border-bdm-border` |
| Success | `#22C55E` | `text-bdm-success` |
| Warning | `#F59E0B` | `text-bdm-warning` |
| Error | `#EF4444` | `text-bdm-error` |

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
# Application
NEXT_PUBLIC_APP_NAME="Booking Data Manager"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PORT=3000

# Google Cloud OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Optional Google API Key & Service Account
GOOGLE_API_KEY=""
GOOGLE_SERVICE_ACCOUNT_JSON=""

# Production Database (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:password@localhost:5432/booking_data_manager"

# Ingestion Policies
MAX_UPLOAD_SIZE_MB=25
DEFAULT_DATE_FORMAT="YYYY-MM-DD"
```

---

## 5. Google Cloud Configuration Guide

To enable live Google Sheets API synchronization:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Click **Create Project** and name it `Booking Data Manager`.

2. **Enable Required APIs**:
   - Navigate to **APIs & Services** &rarr; **Library**.
   - Search for and enable:
     - **Google Sheets API**
     - **Google Drive API**

3. **Configure OAuth Consent Screen**:
   - Select **External** (or Internal for Google Workspace domain users).
   - Fill in the App Name, User Support Email, and Developer Contact.
   - Add the following scopes:
     - `https://www.googleapis.com/auth/spreadsheets`
     - `https://www.googleapis.com/auth/drive.readonly`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`

4. **Create OAuth 2.0 Client Credentials**:
   - Go to **APIs & Services** &rarr; **Credentials** &rarr; **Create Credentials** &rarr; **OAuth client ID**.
   - Application type: **Web application**.
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://your-production-domain.com/api/auth/google/callback`
   - Copy the Client ID and Client Secret into your `.env.local` or the in-app **Settings** page.

5. **Service Account Alternative (Server-to-Server Automation)**:
   - Go to **Credentials** &rarr; **Create Credentials** &rarr; **Service Account**.
   - Generate a JSON key.
   - Paste the JSON key into **Google Sheets Integration** page (`/google-integration`) or your `.env.local`.
   - In Google Sheets, share the Master Spreadsheet with the service account email (`xxx@project.iam.gserviceaccount.com`) as **Editor**.

---

## 6. Database Setup & Migration

### Option A: Local Sandbox Mode (Default)
The application is preconfigured with a local persistent JSON store (`data/bdm_store.json`) with preloaded spreadsheets, templates, and records so you can run the app immediately with zero database dependencies.

### Option B: PostgreSQL / Supabase
Run the migration script:

```bash
# Using psql
psql -U postgres -d booking_data_manager -f scripts/schema.sql

# Or using Prisma
npx prisma db push
```

The migration script creates:
- `users`: Administrator and operator profiles.
- `google_accounts`: Secure token and delegation references.
- `spreadsheets`: Regional Master Spreadsheets metadata.
- `worksheets`: Worksheet tabs, row counters, and column headers.
- `templates`: Column mapping configurations and alias dictionaries.
- `upload_history`: Ingestion receipts, duplicate metrics, and audit logs.
- `booking_records`: Mirror of Google Sheets Master hotel bookings with compound indexes.
- `export_history`: Audit trail of dynamic exports, applied filters, and downloaded files.

---

## 7. Running the Application

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch
```bash
npm run build
npm start
```

---

## 8. Application Navigation Sitemap

1. **Dashboard (`/`)**:
   - 6 KPI metric cards: Total Records, Total Uploads, Today's Uploads, Added Today, Duplicates Skipped, Failed Records.
   - Booking activity trend charts (Daily, Weekly, Monthly).
   - Google Sheets Master live connection status card.
   - Recent upload activity table with status badges.
   - 5 Quick Action shortcuts including "Download Booking Data".

2. **Upload Booking Data (`/upload`)**:
   - Step 1: Select or create mapping template.
   - Step 2: Select destination spreadsheet & worksheet tab.
   - Step 3: Drag & drop daily Excel/CSV file with sample quick-load buttons.
   - Step 4: Smart mapping inspection, validation badges, duplicate checks, and missing mandatory column alerts.
   - Step 5: Safe append confirmation and real-time processing receipts.

3. **Download Data (`/download`)**:
   - Step 1: Choose connected Master Google Spreadsheet.
   - Step 2: Choose worksheet tab with dynamic schema detection.
   - Step 3: Configure multi-condition filters with AND/OR logic and data type inference.
   - Step 4: Checkbox column selection with Select All / Clear All.
   - Step 5: Paginated live preview, format selection (Excel `.xlsx` or CSV `.csv`), and download trigger.
   - Export History modal with previous download receipts.

4. **Master Spreadsheets (`/spreadsheets`)**:
   - Multi-sheet management (UAE, UK, International, Corporate).
   - Add new sheets by Google Drive URL or Spreadsheet ID.
   - Set default spreadsheet.
   - Direct shortcuts to "View Records" and "Download Data".

5. **Template Management (`/templates`)**:
   - Create, edit, delete, duplicate, and set default templates.
   - Configure mandatory columns, destination mappings, and alias dictionaries.

6. **Booking Records (`/records`)**:
   - Search across Reference, Hotel, Guest, and Room Type.
   - Filter by date range, spreadsheet, hotel, and status.
   - Export filtered views directly to Excel or CSV.

7. **Upload History (`/history`)**:
   - Audit trail of all upload jobs with start/end row positions.
   - Filter by filename, date, or status.
   - Download CSV error reports and inspect audit logs.

8. **Google Sheets Integration (`/google-integration`)**:
   - Switch between Local Simulator, OAuth 2.0, and Service Account Key modes.
   - Authorize Google account and test real-time connection.
   - Browse Google Drive spreadsheets.

9. **Settings (`/settings`)**:
   - Organization profile, default sheets/worksheets, duplicate detection rules, date formats, file size limits, export retention policies, and database reset option.

---

## 9. Verification & Automated Testing

All endpoints and engines have been verified with automated end-to-end tests:
- **Build**: `next build` generates 21 static and dynamic pages with 0 TypeScript errors.
- **Smart Mapping**: Validated with Booking.com extranet headers and Agoda YCS channel exports.
- **Duplicate Detection**: Verified to detect both internal file duplicates and sheet duplicates.
- **Safe Append**: Verified to append below existing rows without modifying historical records.
- **Dynamic Filter**: Verified against text, number, date, and categorical multi-select filters.
- **File Generation**: Verified generating valid `.xlsx` and `.csv` files matching user-selected columns.
