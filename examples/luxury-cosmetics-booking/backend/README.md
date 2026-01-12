# L'Oréal Luxury Cosmetics - Backend API

Express + TypeScript backend showcasing **Polaris modules** integration.

## 🔧 Polaris Modules Used

- **@polaris/authentication** - Zero-config Google IAP authentication
- **@polaris/logger** - Structured logging with Winston

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build
npm run build

# Production
npm start
```

## 📡 API Endpoints

### Public Routes
- `GET /health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Filter by category

### Protected Routes (require IAP authentication)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🔐 Authentication

Uses **Google Identity-Aware Proxy (IAP)** authentication with zero configuration. The audience is automatically extracted from the JWT token.

In development, you can use a test JWT token (see parent directory).

## 📦 Tech Stack

- Express.js
- TypeScript
- @polaris/authentication (IAP)
- @polaris/logger (Winston + Cloud Logging)
