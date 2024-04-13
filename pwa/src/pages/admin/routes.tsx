import {lazy} from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';

const LoginOrDashboard = lazy(() => import('./LoginOrDashboard.tsx'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function adminRoutes() {
  return ({
    path: '/admin',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <LoginOrDashboard />,
      },
    ],
  }) satisfies Routes;
}
