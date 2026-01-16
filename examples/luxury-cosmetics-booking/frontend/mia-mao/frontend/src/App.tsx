import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { CurrentUserProvider } from './context/CurrentUserContext';
import QueriesProvider from './QueriesProvider';
import Routes from './routes';
import TagManager from 'react-gtm-module';
import React from 'react';
import config from './config';

function ErrorFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>Something went wrong</h1>
        <p className='text-muted-foreground'>Please try again later</p>
      </div>
    </div>
  );
}

export default function App() {
  React.useEffect(() => {
    const gtmId = config.gtmContainerId;
    if (gtmId) {
      TagManager.initialize({
        gtmId,
      });
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CurrentUserProvider>
            <QueriesProvider>
              <Routes />
              <ToastContainer position='top-right' />
            </QueriesProvider>
          </CurrentUserProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
