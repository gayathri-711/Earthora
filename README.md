# AGRIVA — From Farm to Home – Naturally Organic

Full-stack organic agriculture platform connecting verified regenerative farmers directly with households, chefs, and administrators.

## Architecture
- **Frontend (`client/`)**: React 18, Vite, Tailwind CSS, React Router, Axios, Recharts, QRCode.react
- **Backend (`server/`)**: Node.js, Express.js, Mongoose (MongoDB), JWT Auth, bcryptjs, Multer, Helmet, Rate Limiting
- **Legacy Archive (`Main files/agriva/`)**: Original static HTML template preserved for reference

## Quick Start
1. Install dependencies:
   ```bash
   npm run install:all
   ```
2. Optional environment configuration (`server/.env` based on `server/.env.example`):
   - Set `MONGO_URI` for MongoDB Atlas or local MongoDB Community.
   - Leave `MONGO_URI` blank to run automatically with an embedded in-memory MongoDB seeded with demo accounts and produce.
3. Run development servers (Frontend `:5173` + API `:5000`):
   ```bash
   npm run dev
   ```
4. Run automated backend integration tests:
   ```bash
   npm run test:server
   ```
5. Build production frontend:
   ```bash
   npm run build
   ```

## Demo Accounts (Auto-Seeded)
- **Customer:** `customer@agriva.com` / `Agriva123!`
- **Farmer:** `farmer@agriva.com` / `Agriva123!`
- **Admin:** `admin@agriva.com` / `Agriva123!`
- **Sample Tracking Code:** `AGR-2026-1001`

