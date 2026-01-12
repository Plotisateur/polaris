# 🔐 @polaris/authentication

Zero-config authentication for L'Oréal applications with support for Google IAP, OIDC, and Microsoft Entra ID.

**Seamless integration for both Backend (Express) and Frontend (React) applications.**

---

## 📦 Installation

```bash
npm install @polaris/authentication
```

For React support:

```bash
npm install @polaris/authentication react react-dom
```

---

## 🚀 Quick Start

### Backend (Express)

```typescript
import express from 'express';
import { createAuthMiddleware, createAuthRouter, corsMiddleware } from '@polaris/authentication';

const app = express();

// Enable CORS for your frontend
app.use(corsMiddleware(['http://localhost:5173']));

// Configure authentication
const authMiddleware = createAuthMiddleware({
  provider: 'iap',
  projectNumber: process.env.IAP_PROJECT_NUMBER,
  backendServiceId: process.env.IAP_BACKEND_SERVICE_ID,
});

// Add authentication routes for frontend
app.use('/api/auth', authMiddleware, createAuthRouter());

// Protect your API routes
app.use('/api', authMiddleware);

app.listen(3000);
```

### Frontend (React)

```tsx
import { AuthProvider, useAuth, ProtectedRoute } from '@polaris/authentication/react';

// 1. Wrap your app
function Root() {
  return (
    <AuthProvider apiUrl="http://localhost:3000/api">
      <App />
    </AuthProvider>
  );
}

// 2. Use authentication in components
function App() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Sign In</button>;
  }

  return (
    <div>
      <h1>Hello, {user?.name}!</h1>
      <button onClick={logout}>Sign Out</button>

      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
}
```

---

## 📚 Documentation

- **[Backend Guide](./IMPLEMENTATION_GUIDE.md)** - Express middleware setup
- **[Frontend Guide](./FRONTEND_GUIDE.md)** - React hooks and components
- **[Examples](../../examples/luxury-cosmetics-booking)** - Complete working example

---

## ✨ Features

### Backend

- ✅ Zero-config Google IAP authentication
- ✅ OIDC provider support
- ✅ Microsoft Entra ID (Azure AD) support
- ✅ Express middleware
- ✅ API routes for frontend integration
- ✅ CORS support

### Frontend

- ✅ React hooks (`useAuth`, `useRequireAuth`)
- ✅ Protected route components
- ✅ Loading states
- ✅ Error handling
- ✅ TypeScript support

---

## 🎯 Supported Providers

| Provider   | Backend | Frontend | Status |
| ---------- | ------- | -------- | ------ |
| Google IAP | ✅      | ✅       | Stable |
| OIDC       | ✅      | ✅       | Stable |
| Entra ID   | ✅      | ✅       | Stable |

---

## 🔧 API Overview

### Backend

```typescript
// Middleware
createAuthMiddleware(config);
requireAuth();
optionalAuth();

// Routes
createAuthRouter(options);
corsMiddleware(allowedOrigins);

// Utilities
getUser(req);
isAuthenticated(req);
```

### Frontend (React)

```typescript
// Hooks
useAuth()
useRequireAuth()

// Components
<AuthProvider>
<ProtectedRoute>
```

---

## 📖 Usage Examples

### Backend: Protect specific routes

```typescript
import { requireAuth } from '@polaris/authentication';

// Require authentication
app.get('/api/profile', requireAuth(), (req, res) => {
  res.json({ user: req.user });
});
```

### Frontend: Protected components

```tsx
import { ProtectedRoute } from '@polaris/authentication/react';

function App() {
  return (
    <ProtectedRoute fallback={<Loading />}>
      <UserDashboard />
    </ProtectedRoute>
  );
}
```

---

## 🌐 Environment Variables

```bash
# Google IAP
IAP_PROJECT_NUMBER=123456789
IAP_BACKEND_SERVICE_ID=abc123

# OIDC
OIDC_ISSUER=https://accounts.google.com
OIDC_CLIENT_ID=your-client-id

# Entra ID
ENTRA_TENANT_ID=your-tenant-id
ENTRA_CLIENT_ID=your-client-id
```

---

## 🔒 Security

- Always use HTTPS in production
- Configure CORS properly
- Validate roles/permissions on backend
- Use httpOnly cookies for tokens
- Implement token refresh

---

## 📦 Exports

```typescript
// Main exports
import {
  createAuthMiddleware,
  createAuthRouter,
  corsMiddleware,
  requireAuth,
} from '@polaris/authentication';

// React exports
import {
  AuthProvider,
  useAuth,
  useRequireAuth,
  ProtectedRoute,
} from '@polaris/authentication/react';
```

---

## 🤝 Contributing

This is an internal L'Oréal module. For questions or contributions, contact the Polaris team.

---

## 📝 License

PROPRIETARY - Internal L'Oréal use only

---

_Built with ❤️ by L'Oréal Engineering_
