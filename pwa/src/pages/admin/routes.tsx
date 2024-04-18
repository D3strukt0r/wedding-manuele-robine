import {lazy} from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import ErrorBoundary from '../../layout/ErrorBoundary.tsx';
import cardRoutes from './cards/routes.tsx';
import inviteeRoutes from './invitees/routes.tsx';
import tableRoutes from './tables/routes.tsx';
import userRoutes from './users/routes.tsx';

const LoginOrDashboard = lazy(() => import('./LoginOrDashboard.tsx'));
const HomepageAdmin = lazy(() => import('./HomepageAdmin.tsx'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function adminRoutes() {
  return ({
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
  }) satisfies Routes;
}
