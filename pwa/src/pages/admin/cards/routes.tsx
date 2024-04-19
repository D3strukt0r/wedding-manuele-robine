import { lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

const ListCards = lazy(() => import('./ListCards.tsx'));
const ShowCard = lazy(() => import('./ShowCard.tsx'));

type Routes = Parameters<typeof createBrowserRouter>[0][number];
export default function cardRoutes() {
  return {
    path: '/admin/cards',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ListCards />,
      },
      {
        path: '/admin/cards/:id',
        element: <ShowCard />,
      },
    ],
  } satisfies Routes;
}
