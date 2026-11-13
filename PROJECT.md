# AGRIVA — From Farm to Home – Naturally Organic

## 1. Project Overview

AGRIVA is a full-stack organic agriculture marketplace and farm-to-home platform connecting certified organic farmers, households, and platform administrators.

## 2. Architecture & Technology Stack

- **Frontend (`client/`)**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React, Recharts, QRCode.react
- **Backend (`server/`)**: Node.js, Express.js, Mongoose, JWT Authentication, bcryptjs, Multer, Helmet, Express Rate Limit
- **Database**: MongoDB (external `MONGO_URI` or automatic embedded `mongodb-memory-server` fallback for local dev/testing)
- **Legacy Template Archive (`Main files/agriva/`)**: Original static HTML/SCSS/JS template preserved for reference; visual assets reused in `client/public/assets/img/`.

## 3. Core Platform Modules

- **Customer Storefront**: Homepage (12 sections), About, Services, Farmers, Gallery, Blog & Article Details, FAQ, Contact, Catalog with search/category/price/sort/stock filters, Product Details with Origin QR Passport & Reviews, Cart with coupons (`ORGANIC10`, `FARMFRESH15`), Wishlist, Checkout, Order Confirmation, and Live Order Tracking.
- **Customer Portal (`/customer`)**: Order history, delivery tracking links, wishlist, and profile/shipping address management.
- **Farmer Portal (`/farmer`)**: Farm profile management, product creation with image upload, stock & harvest date updates, and farmer-scoped order fulfillment.
- **Admin Command Center (`/admin`)**: Revenue & KPI analytics, low-stock alerts, revenue chart, order management, user & farmer verification management, product/blog/review moderation, and contact inquiry inbox.

## 4. Database Models (`server/src/models/`)

`User`, `Farmer`, `Category`, `Product`, `Order`, `OrderItem`, `Cart`, `Wishlist`, `Review`, `Payment`, `Blog`, `Inventory`, `ContactMessage`, `NewsletterSubscriber`.

## 5. Setup & Running

1. Install dependencies: `npm run install:all`
2. Configure optional `server/.env` from `server/.env.example`
3. Start frontend + backend together: `npm run dev`
4. Run integration tests: `npm run test:server`
5. Build frontend bundle: `npm run build`
