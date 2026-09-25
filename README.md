# 🍕 Zestora — Food Delivery Web & Mobile App (Client-Ready MVP)

A commercial-grade, responsive food delivery platform built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Supabase**, **PWA**, and **Capacitor for Android/iOS**.

---

## 🚀 Architecture Overview

```text
               ┌───────────────────────────────┐
               │    ZESTORA FOOD DELIVERY      │
               └──────────────┬────────────────┘
                              │
               ┌──────────────┴───────────────┐
               │                              │
       ▼ Web / PWA Browser           ▼ Mobile Native
    (Responsive 375px–1440px)     (Capacitor for Android & iOS)
               │                              │
               └──────────────┬───────────────┘
                              │
                    React + Vite + Tailwind
                              │
               ┌──────────────┴───────────────┐
               │     SUPABASE BACKEND CLOUD   │
               ├──────────────────────────────┤
               │ • Auth: Login/Signup/Session │
               │ • DB: PostgreSQL with RLS    │
               │ • Tables: Profiles, Carts,   │
               │   Orders, Menu Items, etc.   │
               └──────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Unified Cross-Platform Codebase
* **Responsive Web**: Mobile (375px, 390px, 430px), Tablet (768px), Desktop (1024px, 1280px, 1440px) with dedicated mobile bottom-navigation and desktop sticky navbar.
* **Progressive Web App (PWA)**: Web App Manifest, Service Worker offline caching via `vite-plugin-pwa`, app icons, theme configuration (`#ff4d2e`), and installable prompt.
* **Native Mobile via Capacitor**: Unified React application powering Android and iOS via `@capacitor/core` and `@capacitor/android`.
* **Capacitor Geolocation**: Automatic GPS location detection with native Capacitor API and browser HTML5 fallback.

### 2. Complete Customer Journey
1. **Browse Restaurants & Cuisines**: Explore 10 realistic restaurants and 9 food categories (Biryani, Pizza, Burgers, South Indian, North Indian, Chinese, Healthy Bowls, Desserts, Beverages).
2. **Dynamic Filtering**: Filter by Pure Veg, Rating 4.5+, Fast Delivery (<25m), and Top Rated.
3. **Menu Item Customization**: Veg/Non-Veg indicators, chef special badges, price breakdown, and smooth quantity stepper.
4. **Cart & Conflict Management**: Intelligent cart conflict dialog when switching between restaurants (*"Your cart contains items from another restaurant. Would you like to clear your cart and add this item?"*).
5. **Secure Checkout**: Delivery address management (Home, Work, Other), GPS prefill, and demo payment selection.
6. **Live Order Tracking**: Interactive multi-stage timeline (`Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`) with rider information and simulated demo status controller.
7. **Order History**: Real-time past order listings with itemized details and re-order shortcuts.
8. **Profile & Address Book**: Edit profile name, phone number, avatar URL, and manage multiple saved delivery addresses.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 + TypeScript
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS (Tailored color palette with custom brand corals, shadows & keyframe micro-animations)
* **Icons**: Lucide React
* **Routing**: React Router v7
* **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Auth triggers)
* **Native Runtime**: Capacitor v8 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/geolocation`)
* **PWA**: `vite-plugin-pwa` with Workbox caching

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note on Client Demo Mode**: If Supabase credentials are not provided immediately, Zestora automatically runs in **Client Demo Mode** out of the box with zero runtime errors, using full persistent local storage for cart, orders, addresses, and profiles!

### 3. Supabase Database Setup
1. Go to your [Supabase Dashboard](https://app.supabase.com) → SQL Editor.
2. Run the SQL schema script in [`supabase/schema.sql`](./supabase/schema.sql) to create tables, indexes, and Row Level Security (RLS) policies.
3. Run the SQL seed script in [`supabase/seed.sql`](./supabase/seed.sql) to populate 10 authentic restaurants, 9 categories, and 41+ menu items with high-resolution food photography.

---

## 💻 Web & PWA Development

### Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build Production Bundle & PWA
```bash
npm run build
npm run preview
```

---

## 📱 Mobile App with Capacitor (Android / iOS)

### 1. Build Web Assets
```bash
npm run build
```

### 2. Sync Web Assets to Native Capacitor
```bash
npx cap sync
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Run directly on an Android Device or Emulator
```bash
npx cap run android
```

---

## 📁 Project Directory Structure

```text
food-delivery/
│
├── android/                         # Capacitor Native Android project
│   ├── app/src/main/AndroidManifest.xml
│   └── ...
│
├── public/                          # Static assets and icons
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   └── icons/                       # 192x192 & 512x512 PWA icons
│
├── src/
│   ├── components/
│   │   ├── cart/                    # CartItemRow, BillDetails
│   │   ├── checkout/                # AddressSelector, AddAddressModal, PaymentSelector
│   │   ├── common/                  # Button, Input, Modal, Badge, Rating, LoadingSkeleton, EmptyState
│   │   ├── home/                    # HeroBanner, CategoryList, RestaurantCard, FoodCard, LocationModal
│   │   ├── layout/                  # Navbar, BottomNavigation, Footer, Layout
│   │   ├── order/                   # OrderTimeline, OrderCard, OrderStatusDemoController
│   │   └── restaurant/              # RestaurantHeader, MenuItemCard, CartConflictModal
│   │
│   ├── contexts/                    # AuthContext, CartContext, LocationContext
│   ├── hooks/                       # useAuth, useCart, useLocation
│   ├── lib/                         # supabase.ts, mockData.ts
│   ├── pages/                       # HomePage, RestaurantDetailPage, SearchPage, CartPage, etc.
│   ├── services/                    # restaurantService, orderService, addressService, profileService
│   ├── types/                       # TypeScript interfaces (Restaurant, Order, Cart, MenuItem, etc.)
│   └── utils/                       # cn (tailwind merge), formatters (currency ₹, date)
│
├── supabase/
│   ├── schema.sql                   # 9 tables + RLS policies + new user auth trigger
│   └── seed.sql                     # 10 restaurants, 9 categories, 41+ menu items
│
├── capacitor.config.ts              # Capacitor configuration
├── vite.config.ts                   # Vite + PWA Workbox config
├── tailwind.config.js               # Tailwind design system tokens
└── README.md
```

---

## 🛡️ Security Best Practices Followed

* **No Service Role Keys in Client**: Only `VITE_SUPABASE_ANON_KEY` is exposed in frontend code.
* **Server-Side Price Verification**: Orders independently calculate line totals and subtotals against verified item catalog prices before storing orders.
* **Row Level Security (RLS)**: Public tables (`restaurants`, `categories`, `menu_items`) are read-only to guests; user tables (`profiles`, `addresses`, `carts`, `orders`) enforce `auth.uid() = user_id`.
* **Graceful Permissions**: Capacitor Geolocation degrades safely to browser geolocation or simulated coordinates when permissions are declined.
