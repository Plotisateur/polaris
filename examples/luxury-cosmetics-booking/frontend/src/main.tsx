import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@polaris/authentication/react';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider apiUrl="http://localhost:3001/api">
      <App />
    </AuthProvider>
  </StrictMode>
);
