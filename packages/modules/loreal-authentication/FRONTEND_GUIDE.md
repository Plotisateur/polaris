# 🎨 Frontend Integration Guide

This guide shows how to integrate `@polaris/authentication` with your React frontend.

---

## 📦 Installation

```bash
npm install @polaris/authentication react react-dom
```

---

## 🚀 Quick Start

### 1. Backend Setup

First, set up your Express backend with authentication:

```typescript
import express from 'express';
import { createAuthMiddleware, createAuthRouter, corsMiddleware } from '@polaris/authentication';

const app = express();

// Enable CORS for your frontend
app.use(corsMiddleware(['http://localhost:5173', 'http://localhost:3000']));

// Configure authentication
const authMiddleware = createAuthMiddleware({
  provider: 'iap',
  projectNumber: process.env.IAP_PROJECT_NUMBER,
  backendServiceId: process.env.IAP_BACKEND_SERVICE_ID,
});

// Add authentication routes for frontend
app.use(
  '/api/auth',
  createAuthRouter({
    loginUrl: '/auth/login',
    logoutUrl: '/auth/logout',
  })
);

// Protect your API routes
app.use('/api', authMiddleware);

// Your API routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. Frontend Setup (React)

Wrap your app with the `AuthProvider`:

```tsx
import { AuthProvider } from '@polaris/authentication/react';
import { App } from './App';

function Root() {
  return (
    <AuthProvider apiUrl="http://localhost:3000/api">
      <App />
    </AuthProvider>
  );
}

export default Root;
```

### 3. Use Authentication in Components

```tsx
import { useAuth, ProtectedRoute } from '@polaris/authentication/react';

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Welcome</h1>
        <button onClick={login}>Sign In</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Sign Out</button>

      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
}
```

---

## 🎯 API Reference

### `AuthProvider`

React context provider for authentication.

**Props:**

- `children`: ReactNode - Your app components
- `apiUrl?`: string - Backend API URL (default: '/api')
- `loginUrl?`: string - Login redirect URL (default: '/auth/login')
- `logoutUrl?`: string - Logout redirect URL (default: '/auth/logout')
- `onAuthError?`: (error: Error) => void - Error callback

**Example:**

```tsx
<AuthProvider
  apiUrl="http://localhost:3000/api"
  onAuthError={(error) => console.error('Auth error:', error)}
>
  <App />
</AuthProvider>
```

---

### `useAuth()`

Hook to access authentication state.

**Returns:**

- `user`: UserClaims | null - Current user or null
- `isAuthenticated`: boolean - True if user is logged in
- `isLoading`: boolean - True while checking authentication
- `error`: Error | null - Authentication error if any
- `login()`: void - Redirect to login page
- `logout()`: void - Redirect to logout page
- `refreshToken()`: Promise<void> - Refresh user data

**Example:**

```tsx
function Profile() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Sign In</button>;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

---

### `useRequireAuth()`

Hook that requires authentication or redirects to login.

**Returns:** `UserClaims` - Always returns authenticated user

**Example:**

```tsx
function Dashboard() {
  const user = useRequireAuth();

  return <h1>Welcome {user.name}</h1>;
}
```

---

### `<ProtectedRoute>`

Component that renders children only if authenticated.

**Props:**

- `children`: ReactNode - Protected content
- `fallback?`: ReactNode - Loading state (default: "Loading...")
- `redirectTo?`: string - Login URL (default: '/auth/login')

**Example:**

```tsx
<ProtectedRoute fallback={<Spinner />}>
  <Dashboard />
</ProtectedRoute>
```

---

## 🔧 Backend Routes

The `createAuthRouter()` function creates these routes:

### `GET /api/auth/me`

Get current authenticated user.

**Response:**

```json
{
  "sub": "user-id",
  "email": "user@loreal.com",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://...",
  "roles": ["user", "admin"],
  "permissions": ["read", "write"]
}
```

### `POST /api/auth/refresh`

Refresh authentication token.

### `GET /api/auth/login`

Redirect to login page.

### `GET /api/auth/logout`

Redirect to logout page.

---

## 🌐 CORS Configuration

Use `corsMiddleware()` to enable CORS for your frontend:

```typescript
import { corsMiddleware } from '@polaris/authentication';

// Allow specific origins
app.use(
  corsMiddleware([
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
    'https://your-app.loreal.com',
  ])
);
```

---

## 📝 Complete Example

See the [luxury-cosmetics-booking example](../../../examples/luxury-cosmetics-booking) for a full working implementation.

---

## 🔒 Security Best Practices

1. **Always use HTTPS in production**
2. **Configure CORS properly** - Only allow trusted origins
3. **Use httpOnly cookies** for tokens when possible
4. **Implement token refresh** to maintain sessions
5. **Validate roles/permissions** on the backend as well
6. **Handle authentication errors** gracefully

---

## 🐛 Troubleshooting

### "useAuth must be used within an AuthProvider"

Make sure your component is wrapped with `<AuthProvider>`.

### CORS errors

Add your frontend URL to `corsMiddleware()` allowedOrigins.

### User is null but I'm logged in

Check that your backend routes are under `/api` and authentication middleware is applied correctly.

### Infinite redirect loops

Ensure your login/logout URLs don't conflict with protected routes.

---

_Built with ❤️ by L'Oréal Engineering_
