"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { queryConfig } from "@/lib/tanstack-query";
import { MSWProvider } from "@/lib/msw";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({
  children,
}: AppProviderProps): React.ReactElement => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <MSWProvider>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </MSWProvider>
  );
};
