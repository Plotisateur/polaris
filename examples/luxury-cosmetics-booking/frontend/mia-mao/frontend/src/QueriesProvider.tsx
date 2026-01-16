import React from 'react';
import { QueryClientProvider, QueryClient, QueryCache } from '@tanstack/react-query';
import axios, { baseUrlApi } from './api/axios';
import { getHeaders } from './api/utils/headers';
import { useAuthCookies } from './hooks/useAuthCookies';

const queryCache = new QueryCache();

function QueriesProvider({ children }: { children: React.ReactNode }) {
  const { isExist, getCookie } = useAuthCookies();

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            enabled: isExist('access_token') && isExist('refresh_token') && isExist('expiry_at'),
            queryFn: async ({ queryKey, pageParam }) => {
              const params =
                typeof queryKey[1] === 'object'
                  ? { ...queryKey[1], cursor: pageParam }
                  : { cursor: pageParam };

              const { data } = await axios.get(`${baseUrlApi}/api/${queryKey[0]}`, {
                headers: getHeaders(),
                params,
              });
              return data;
            },
          },
        },
        queryCache,
      }),
    [baseUrlApi, getCookie('access_token'), getCookie('refresh_token'), getCookie('expiry_at')]
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueriesProvider;
