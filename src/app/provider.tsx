'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { AuthProvider } from '@/lib/auth/authProvider';
import { MSWProvider } from '@/lib/msw';
import { queryConfig } from '@/lib/tanstack-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps): React.ReactElement => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <MSWProvider>
      <AuthProvider>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
            {children}
          </QueryClientProvider>
        </ErrorBoundary>
      </AuthProvider>
    </MSWProvider>
  );
};
