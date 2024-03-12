import {lazy, Suspense} from 'react'
import {RootErrorBoundary} from "./layout/RootErrorBoundary.tsx";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import BigSpinner from "./layout/BigSpinner.tsx";
import ErrorBoundary from "./layout/ErrorBoundary.tsx";
import NotFound from "./layout/NotFound.tsx";

const Homepage = lazy(() => import('./pages/Homepage.tsx'));

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
      <Suspense>
        <RouterProvider router={router} fallbackElement={<BigSpinner />} />
      </Suspense>
    </RootErrorBoundary>
  )
}

export default App
