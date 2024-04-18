import {lazy} from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';

const ListTables = lazy(() => import('./ListTables.tsx'));
const ShowTable = lazy(() => import('./ShowTable.tsx'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function tableRoutes() {
  return {
    path: '/admin/tables',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ListTables />,
      },
      {
        path: '/admin/tables/:id',
        element: <ShowTable />,
      },
    ]
  } satisfies Routes;
}
