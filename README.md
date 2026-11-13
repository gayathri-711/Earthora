# EARTHORA – Smart Agriculture & Sustainable Farming Ecosystem

> **Tagline:** *Rooted in Nature. Driven by Innovation.*

**EARTHORA** is a full-stack, enterprise-grade digital agriculture ecosystem connecting regenerative farmers, accredited agronomists, precision equipment suppliers, and conscious consumers.

The platform combines autonomous field IoT telemetry, living soil analysis (NPK, pH, organic carbon, microbial active ratios), phenological crop stage management, micro-climatic agro-weather intelligence, and a 5-category agricultural marketplace with cold-chain fulfillment tracking.

---

## 1. Ecosystem Architecture

- **Frontend (`client/`)**:
  - React 18, Vite 6, Tailwind CSS 3.4, React Router 6, Recharts, Lucide Icons, QRCode.react.
  - Bespoke international startup visual identity: Deep Forest Green (`#0D2B1D`), Earthy Olive (`#3E5C3B`), Soft Sage (`#7E9F83`), Warm Ivory (`#FAF8F2`), Natural Beige (`#EDE8DC`), Charcoal (`#18201B`), and Emerald Mint (`#10B981`).
  - Strict typography pairing: Outfit / Fraunces headings with Plus Jakarta Sans body.

- **Backend (`server/`)**:
  - Node.js, Express.js REST API, Mongoose ODM.
  - Zero-configuration embedded MongoDB memory server fallback with auto-seeding.
  - Production static bundle delivery from `client/dist`.
  - Security hardening: Helmet, CORS, Express Rate Limiting, bcrypt password hashing, and role-based JWT authentication.

- **Legacy Template Archive (`client/`)**:
  - Original static template files preserved intact for historical reference.

---

## 2. 12 Main Website Pages & Modules

1. **Home (`/`)**: 12-section editorial showcase, live field telemetry ticker, ecosystem pillars, verified partner farms, harvest highlights, and interactive customer reviews.
2. **About Earthora (`/about`)**: The Earthora Standard, 4 scientific pillars (Living Soil, Micro-Hydrology, Phenology Telemetry, Direct-Trade Parity), and founder journey.
3. **Smart Agriculture (`/smart-agriculture`)**: Precision IoT architecture, LoRaWAN soil moisture probes, automated solenoid actuators, and drone NDVI mapping.
4. **Farmer Hub (`/farmer-hub`)**: Regional farm directory, land acreage metrics, soil classifications, primary harvest rotations, and interactive "Register Farm" application modal.
5. **Crop Management (`/crop-management`)**: Biological crop phenology tracker across 5 stages (Seedling, Vegetative, Flowering, Maturing, Harvested), growth progress bars, and root-zone irrigation/fertilizer ledgers.
6. **Agricultural Marketplace (`/marketplace`)**: 5-sector catalog (Seeds, Organic Fertilizers, Farming Equipment, Smart Irrigation, Fresh Produce) with live search, price slider, and organic certification filters.
7. **Weather Intelligence (`/weather-intelligence`)**: Regional agro-climatic stations (Sonoma, Willamette, Hudson, Lancaster), 10cm depth soil temperature probes, evapotranspiration (ET₀) tracking, and spray window advisories.
8. **Soil Insights (`/soil-insights`)**: Rhizosphere NPK macronutrient availability bars (N, P, K), pH equilibrium spectrum gauge, organic carbon %, and historical test archive.
9. **Expert Connect (`/expert-connect`)**: Directory of accredited agronomists and soil microbiologists, interactive 45-minute consultation booking modal with time slots, and community Q&A forum with upvotes.
10. **Knowledge Hub (`/knowledge-hub` & `/knowledge-hub/:slug`)**: Science-backed regenerative field guides, research whitepapers, author bylines, and weekly dispatch subscription.
11. **Contact (`/contact`)**: Regional hubs directory (Sonoma Campus, Willamette Station, Lancaster Vault) and functional dispatch inquiry form.
12. **Auth & Access (`/login`, `/register`)**: Role-based access with 1-click quick demo login buttons for all 4 roles.

---

## 3. Dedicated Role Portals

- **Ecosystem Smart Dashboard (`/dashboard/smart` & `/dashboard`)**:
  - Live agro-station telemetry feed, revenue distribution chart across sectors, active crop phenology roster, and WebSocket-synced activity audit trail.
- **Farmer Portal (`/dashboard/farmer`)**:
  - Land profile management, active crop cycles, produce listing form, and customer fulfillment status updates.
- **Agriculture Expert Portal (`/dashboard/expert`)**:
  - Booked virtual consultations, tele-session room launcher, pending community questions queue, and advisory rate settings.
- **Customer Portal (`/dashboard/customer`)**:
  - Order history, cold-chain tracking links, booked consultations, wishlist items, and delivery coordinates.
- **Platform Admin Dashboard (`/dashboard/admin`)**:
  - Ecosystem KPIs, Recharts volume analytics, partner grower verification queue, marketplace inventory management, and article publishing.

---

## 4. Quick Start & Execution

### Option A: Single-Process Execution (Recommended)
Build the frontend and start the integrated server (serves both API and UI):
```bash
# 1. Build React client
npm --prefix client run build

# 2. Run backend (runs embedded MongoDB, seeds data, and serves UI at http://localhost:5000)
node server/src/server.js
```

### Option B: Concurrent Development
```bash
# Terminal 1: API Server
npm --prefix server run dev

# Terminal 2: Vite Dev Server
npm --prefix client run dev
```

### Option C: Run Automated Tests
```bash
npm --prefix server test
```

---

## 5. Demo Accounts (Auto-Seeded)

| Role | Email | Password | Access Path |
|------|-------|----------|-------------|
| **Admin** | `admin@earthora.io` | `Earthora123!` | `/dashboard/admin` |
| **Farmer** | `farmer@earthora.io` | `Earthora123!` | `/dashboard/farmer` |
| **Agriculture Expert** | `expert@earthora.io` | `Earthora123!` | `/dashboard/expert` |
| **Customer** | `customer@earthora.io` | `Earthora123!` | `/dashboard/customer` |

*Sample Tracking Code:* `ETH-2026-1001`
