import { lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import cardRoutes from './cards/routes';
import inviteeRoutes from './invitees/routes';
import tableRoutes from './tables/routes';
import userRoutes from './users/routes';
import ErrorBoundary from '../../layout/ErrorBoundary';

const LoginOrDashboard = lazy(() => import('./LoginOrDashboard.tsx'));
const HomepageAdmin = lazy(() => import('./HomepageAdmin.tsx'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function adminRoutes() {
  return {
    path: '/admin',
    element: (
      <div className="h-full bg-white">
        <Outlet />
      </div>
    ),
    children: [
      {
        path: '',
        element: <LoginOrDashboard />,
        children: [
          {
            path: '',
            element: <Outlet />,
            errorElement: <ErrorBoundary />,
            children: [
              {
                index: true,
                element: <HomepageAdmin />,
              },
              inviteeRoutes(),
              cardRoutes(),
              tableRoutes(),
              userRoutes(),
            ],
          },
        ],
      },
    ],
  } satisfies Routes;
}
