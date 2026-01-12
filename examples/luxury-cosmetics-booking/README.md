# 🌟 L'Oréal Luxury Cosmetics Booking

> Full-stack TypeScript application showcasing **Polaris modules** in action

Demo application for booking luxury cosmetics from L'Oréal's premium catalog. Built with React, TypeScript, Express, and Polaris modules.

## ⚡ Quick Start

**Option 1 : Lancer frontend + backend ensemble (recommandé)**

```bash
npm install
npm run dev    # Lance backend (3001) + frontend (5173) en parallèle
```

**Option 2 : Lancer séparément**

```bash
# Backend
cd backend
npm install
npm run dev    # Runs on http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev    # Runs on http://localhost:5173
```

**🔐 Mock Authentication** : Un utilisateur fictif est automatiquement connecté en développement.  
Configurez via `backend/.env` : `DEV_USER_EMAIL`, `DEV_USER_NAME`

---

## 🏗️ Architecture

```
luxury-cosmetics-booking/
├── backend/          # Express + TypeScript API
│   ├── src/
│   │   ├── server.ts
│   │   └── routes/
│   │       ├── products.ts
│   │       └── bookings.ts
│   └── package.json
└── frontend/         # React + TypeScript SPA
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   ├── services/
    │   └── types.ts
    └── package.json
```

## 🚀 Features

### Backend (Polaris Modules Demo)

- ✅ **@polaris/authentication** - Google IAP zero-config auth
- ✅ **@polaris/logger** - Structured logging with Winston
- 📦 Products API (public routes)
- 🔐 Bookings API (protected routes with IAP)

### Frontend

- 💄 Luxury cosmetics catalog (Lancôme, YSL, Dior, L'Oréal Paris)
- 📅 Appointment booking system
- 👤 User bookings management
- 🎨 Modern responsive UI

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express + TypeScript
- **Polaris Modules**: @polaris/authentication, @polaris/logger
- **Styling**: CSS3 with CSS Variables

## 📦 Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎯 Usage

1. Start the backend server (port 3001)
2. Start the frontend dev server (port 5173)
3. Open http://localhost:5173 in your browser
4. Browse the catalog, click on products to book appointments
5. View your bookings in the "Mes Réservations" section

## 🔐 Authentication

The app uses **@polaris/authentication** with Google IAP provider (zero-config mode).

In development, a mock token is used. In production, the middleware automatically:

- Validates JWT tokens from IAP
- Extracts audience from the token (no manual config!)
- Provides user info in `req.user`

## 📝 Logging

The app uses **@polaris/logger** for structured logging:

```typescript
import { log } from '@polaris/logger';

log.info('User booked appointment', { productId, userEmail });
log.error('Booking failed', error);
```

Logs include:

- Timestamp
- Log level (info, warn, error)
- Contextual metadata
- User actions

## 🧪 API Endpoints

### Public Routes

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Filter by category

### Protected Routes (require IAP auth)

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

## 📸 Screenshots

### Catalog View

Premium products from Lancôme, YSL, Dior with filtering by category.

### Booking Modal

Simple appointment booking with quantity and date selection.

### My Bookings

View and manage all your reservations.

## 🌟 Polaris Integration

This app demonstrates real-world usage of Polaris modules:

1. **Zero-config authentication**: Just add the middleware, no manual setup
2. **Structured logging**: Track all user actions and errors
3. **TypeScript-first**: Full type safety across the stack
4. **Production-ready**: Can be deployed to GCP with IAP

## 📄 License

Internal L'Oréal use only
