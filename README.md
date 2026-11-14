# EARTHORA – Smart Agriculture & Sustainable Farming Ecosystem

> **Tagline:** *Rooted in Nature. Driven by Innovation.*
> 
> **GitHub Repository:** [https://github.com/gayathri-711/Earthora](https://github.com/gayathri-711/Earthora)

**EARTHORA** is an enterprise-grade digital agriculture ecosystem connecting regenerative farmers, accredited agronomists, precision equipment suppliers, and conscious consumers.

The platform combines autonomous field IoT telemetry, living soil analysis (NPK, pH, organic carbon, microbial active ratios), phenological crop stage management, micro-climatic agro-weather intelligence, a 5-category agricultural marketplace with Indian Rupee (`₹` INR) currency, and a built-in 24/7 AI Doubt-Clearing Copilot.

---

## 1. Key Highlights & Features

- **📱 100% Mobile Responsive for All Models**: Engineered with dynamic viewport heights (`100dvh`), iOS Safari auto-zoom prevention (`16px` inputs), 44px minimum touch targets, and a categorized slide-over mobile drawer.
- **🌱 Living Soil & Crop Phenology**: Real-time rhizosphere telemetry (N-P-K macronutrients, pH balance, organic carbon %) and biological maturity tracking across 5 growth stages.
- **🛒 Agricultural Marketplace (₹ INR)**: 5 core sectors (Non-GMO Seeds, Biological Amendments, Precision Drip Hardware, Tools, Fresh Harvest) with OMRI/USDA certification filters and cold-chain tracking.
- **🤖 24/7 AI Doubt-Clearing Copilot**: Instant contextual assistant available on all pages to clarify platform features, agronomy questions, and role workflows.
- **🔒 Secure Role-Based Access**: Role portals for **Admin**, **Farmer**, **Expert**, and **Customer** with protected credentials and zero public disclosure.
- **☁️ Cloud & Mobile Deployment Ready**: Automatic host binding on `0.0.0.0` with embedded MongoDB in-memory fallback and single-process static serving.

---

## 2. Technology Stack

- **Frontend (`client/`)**:
  - React 18, Vite 6, Tailwind CSS 3.4, React Router 6, Axios, Recharts, Lucide Icons, QRCode.react.
  - Bespoke design system: Deep Forest Green (`#0D2B1D`), Earthy Olive (`#3E5C3B`), Soft Sage (`#7E9F83`), Fresh Light Green Ivory (`#E4F2E7`), and Emerald Mint (`#10B981`).
  - Strict typography pairing: Outfit / Fraunces headings with Plus Jakarta Sans body.

- **Backend (`server/`)**:
  - Node.js, Express.js REST API, Mongoose ODM.
  - Zero-configuration embedded MongoDB memory server fallback with automatic data seeding.
  - Single-process production deployment capability (`client/dist` static serving).
  - Security suite: Helmet, CORS, Rate Limiting, bcrypt password hashing, and role-based JWT authentication.

---

## 3. Platform Modules & Pages

1. **Home (`/`)**: 12-section editorial showcase, live field telemetry ticker, ecosystem pillars, verified partner farms, harvest highlights, and interactive reviews.
2. **About Earthora (`/about`)**: The Earthora Standard, 4 scientific pillars (Living Soil, Micro-Hydrology, Phenology Telemetry, Direct-Trade Parity).
3. **Smart Agriculture (`/smart-agriculture`)**: Precision IoT architecture, LoRaWAN soil moisture probes, automated solenoid actuators, and drone NDVI mapping.
4. **Farmer Hub (`/farmer-hub`)**: Regional farm directory, land acreage metrics, soil classifications, and interactive "Register Farm" modal.
5. **Crop Management (`/crop-management`)**: Biological crop phenology tracker across 5 stages (Seedling, Vegetative, Flowering, Maturing, Harvested), growth progress bars, and root-zone irrigation/fertilizer ledgers.
6. **Agricultural Marketplace (`/marketplace`)**: 5-sector catalog with live search, price slider, and organic certification filters (All prices in ₹ INR).
7. **Weather Intelligence (`/weather-intelligence`)**: Regional agro-climatic stations (Sonoma, Willamette, Hudson, Lancaster), 10cm depth soil temperature probes, evapotranspiration (ET₀) tracking, and spray window advisories.
8. **Soil Insights (`/soil-insights`)**: Rhizosphere NPK macronutrient availability bars (N, P, K), pH equilibrium spectrum gauge, organic carbon %, and historical test archive.
9. **Expert Connect (`/expert-connect`)**: Directory of accredited agronomists, 45-minute virtual telemetry consultation booking modal, and community Q&A forum.
10. **Knowledge Hub (`/knowledge-hub` & `/knowledge-hub/:slug`)**: Science-backed regenerative field guides, research whitepapers, and author bylines.
11. **Contact (`/contact`)**: Regional hubs directory and dispatch inquiry form.
12. **Auth & Access (`/login`, `/register`)**: Role-based access with secure credential handling and role pickers.

---

## 4. Dedicated Role Portals

- **Ecosystem Smart Dashboard (`/dashboard/smart` & `/dashboard`)**: Live agro-station telemetry feed, sector volume distribution, and activity audit trail.
- **Farmer Portal (`/dashboard/farmer`)**: Land profile management, active crop cycles, produce listing form, and customer fulfillment status updates.
- **Agriculture Expert Portal (`/dashboard/expert`)**: Booked virtual consultations, tele-session launcher, pending community questions queue, and advisory rate settings.
- **Customer Portal (`/dashboard/customer`)**: Order history, cold-chain tracking links, booked consultations, wishlist items, and delivery coordinates.
- **Platform Admin Dashboard (`/dashboard/admin`)**: Ecosystem KPIs, Recharts volume analytics, partner grower verification queue, marketplace inventory management, and article publishing.

---

## 5. Quick Start & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Option A: Production Run (Recommended — Single Server)
```bash
# 1. Install dependencies
npm run install:all

# 2. Build React client bundle
npm run build

# 3. Start EARTHORA server (binds to 0.0.0.0:5000)
npm start
```
> Direct alternative: `node server/src/server.js`

Open your browser at:
👉 **[http://localhost:5000](http://localhost:5000)**

---

### Option B: Local Mobile Phone Testing (Same Wi-Fi)
1. Ensure your mobile phone is connected to the same Wi-Fi network as your computer.
2. Run `npm start` on your computer.
3. Find your computer's local IPv4 address (e.g. `192.168.x.x` via `ipconfig` or terminal logs).
4. Open your phone's browser (Safari/Chrome) and enter:
   👉 **`http://<YOUR_COMPUTER_IP>:5000`**

---

### Option C: Concurrent Development (Hot-Reloading)
```bash
# Terminal 1: Backend API
cd server
npm run dev

# Terminal 2: Vite Dev Server with HMR
cd client
npm run dev
```

---

## 6. Cloud Deployment Guide

EARTHORA is pre-configured for one-click deployment on platforms such as **Render**, **Railway**, **Heroku**, or **Docker**:

1. **Build Command:** `npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables (Optional):**
   - `PORT`: Automatically set by cloud host (defaults to `5000`).
   - `HOST`: Set to `0.0.0.0` (default).
   - `MONGO_URI`: Optional. If omitted, embedded in-memory MongoDB automatically starts and self-seeds.
   - `JWT_SECRET`: Secret key for authentication tokens.

---

## 7. Pre-Configured Demo Accounts (Auto-Seeded)

| Role | Email | Password | Dedicated Portal |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@earthora.io` | `Earthora123!` | `/dashboard/admin` |
| **Farmer** | `farmer@earthora.io` | `Earthora123!` | `/dashboard/farmer` |
| **Agriculture Expert** | `expert@earthora.io` | `Earthora123!` | `/dashboard/expert` |
| **Customer** | `customer@earthora.io` | `Earthora123!` | `/dashboard/customer` |

*Sample Tracking Code:* `ETH-2026-1001` · *Promo Code:* `ORGANIC10` (10% off)
