import {lazy} from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';

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
            index: true,
            element: <HomepageAdmin />,
          }
        ],
      },
    ],
  }) satisfies Routes;
}
