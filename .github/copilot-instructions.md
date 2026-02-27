# Copilot Instructions for Hydro Data Charts

This is a full-stack hydrological data visualization project with a Node.js/Express + Sequelize backend and Next.js frontend.

## Build, Test, and Lint Commands

### Backend (Server)
```bash
# Start server (from project root)
node server.js

# Start with auto-reload
nodemon server.js

# No test suite configured
```

### Frontend (Client)
```bash
cd client

# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Architecture Overview

### Backend Structure
- **Entry point:** `server.js` — Express app, CORS whitelist, route registration
- **Models:** `app/models/` — Sequelize models for `hydro_monthly` and `stations` tables
  - `index.js` initializes Sequelize connection using `app/config/db.config.js` (not in repo)
- **Controllers:** `app/controllers/` — business logic for monthly/yearly records and stations
- **Routes:** `app/routes/` — REST API endpoint definitions

### Frontend Structure (Next.js)
- **App directory:** `client/app/` — Next.js 15 App Router structure
- **Services:** `client/app/services/` — Axios-based API calls
- **Components:** `client/app/components/` — React components for charts and UI
- **State management:** Zustand (installed) + react-query for data fetching
- **UI library:** Mantine v7 for components and charts (via `@mantine/charts`)
- **Charts:** Recharts (Mantine wrapper)

### Database Configuration
- **Not in repo:** `app/config/db.config.js` must be created manually
- Required structure:
  ```javascript
  module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "your_db_password",
    DB: "your_db_name",
    dialect: "mysql",
    PORT: 3306,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  };
  ```

## Key Conventions

### Data Processing & Year Correction
**Critical:** November and December (months 11–12) are **assigned to the previous calendar year** for hydrological calculations. This correction is applied consistently:
- In `monthlyRecords.controller.js`: `if (r.month === 11 || r.month === 12) { r.year -= 1; }`
- In `yearlyRecords.controller.js`: via SQL `CASE WHEN month IN (11,12) THEN year - 1 ELSE year END`

When working with date ranges or aggregations, always account for this correction logic.

### Sentinel Value Handling
Invalid/missing data is marked with sentinel values that must be nullified:
- **Water level:** `9999` → `null`
- **Temperature:** `> 50°C` → `null` (sentinel for invalid data)

These are cleaned in both monthly and yearly controllers.

### API Endpoint Patterns
All endpoints use the `/api` prefix:
- **Stations:** `/api/stations`
- **Monthly records:**
  - `/api/records/monthly/:stationId` — all records (with year correction)
  - `/api/records/monthly/:stationId?from=YYYY&to=YYYY` — filtered by corrected year range
  - `/api/records/monthly/:stationId/:year` — legacy endpoint
- **Yearly aggregates:**
  - `/api/records/yearly/:stationId` — all years
  - `/api/records/yearly/:stationId?from=YYYY&to=YYYY` — filtered by corrected year range
  - `/api/records/yearly/withTemperature` — stations with temperature data in year 2000

### CORS Configuration
The server whitelist is hardcoded in `server.js`:
```javascript
const whitelist = ["http://localhost:3000", "http://localhost:8081", "http://localhost:5173"]
```
Update this array when adding new frontend origins.

### Frontend Environment Variables
The client expects `NEXT_PUBLIC_VITE_BASE_URL` (e.g., `http://localhost:8080`) in `.env` to point to the backend API.

### Database Sync
`db.sequelize.sync()` runs on server startup to auto-create/update tables based on models. For production or schema migrations, consider switching to explicit migrations.

## Data Import
The project uses hydrological data from IMGW (Polish Institute of Meteorology and Water Management). Example CSV files are in `example_data/` for testing. Import using MySQL tools or custom scripts.

## Code Style
- Use ES6+ syntax (e.g., `const`, `let`, arrow functions)
- Follow standard JavaScript conventions (camelCase, semicolons, etc.)
- For React components, use functional components and hooks
- do not write comments, but ensure code is self-explanatory and maintainable
- for styling use Mantine's theming and styling solutions, use css modules if really necessary, but prefer inline styles or Mantine's `sx` prop for simplicity

