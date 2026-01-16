import { AuthProvider } from '@polaris/authentication/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider apiUrl="http://localhost:3001/api">
      <App />
    </AuthProvider>
  </StrictMode>
);
