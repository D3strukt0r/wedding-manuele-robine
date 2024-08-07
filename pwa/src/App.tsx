import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { APIProvider } from '@vis.gl/react-google-maps';
import { RootErrorBoundary } from './layout/RootErrorBoundary';
import BigSpinner from './layout/BigSpinner';
import ErrorBoundary from './layout/ErrorBoundary';
import NotFound from './layout/NotFound';
import { AuthenticationProvider } from './utils/authentication';
import adminRoutes from './pages/admin/routes';

const Homepage = lazy(() => import('./pages/Homepage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      adminRoutes(),
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
        <APIProvider apiKey={document.documentElement.dataset.googleMapsApiKey ?? ''}>
          <AuthenticationProvider>
            <Suspense fallback={<BigSpinner />}>
              <RouterProvider
                router={router}
                fallbackElement={<BigSpinner />}
              />
            </Suspense>
          </AuthenticationProvider>
        </APIProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RootErrorBoundary>
  );
}

export default App;
