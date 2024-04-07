import {lazy, Suspense} from 'react'
import {RootErrorBoundary} from "./layout/RootErrorBoundary.tsx";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import BigSpinner from "./layout/BigSpinner.tsx";
import ErrorBoundary from "./layout/ErrorBoundary.tsx";
import NotFound from "./layout/NotFound.tsx";
import {AuthenticationContextLoader} from "./context/AuthenticationContext.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Homepage = lazy(() => import('./pages/Homepage.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => router.dispose());
  }

  return (
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthenticationContextLoader>
          <Suspense>
            <RouterProvider router={router} fallbackElement={<BigSpinner />} />
          </Suspense>
        </AuthenticationContextLoader>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RootErrorBoundary>
  )
}

export default App
