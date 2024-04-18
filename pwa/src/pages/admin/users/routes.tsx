import {lazy} from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';

const ListUsers = lazy(() => import('./ListUsers.tsx'));
const ShowUser = lazy(() => import('./ShowUser.tsx'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function userRoutes() {
  return {
    path: '/admin/users',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ListUsers />,
      },
      {
        path: '/admin/users/:id',
        element: <ShowUser />,
      },
    ]
  } satisfies Routes;
}
