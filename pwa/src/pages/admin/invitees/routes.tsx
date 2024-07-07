import { lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

const ListInvitees = lazy(() => import('./ListInvitees'));
const ShowInvitee = lazy(() => import('./ShowInvitee'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function inviteeRoutes() {
  return {
    path: '/admin/invitees',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ListInvitees />,
      },
      {
        path: '/admin/invitees/:id',
        element: <ShowInvitee />,
      },
    ],
  } satisfies Routes;
}
