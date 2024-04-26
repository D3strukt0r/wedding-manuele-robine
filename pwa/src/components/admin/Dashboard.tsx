import {
  faChair,
  faEnvelope,
  faHouse,
  faPerson,
} from '@fortawesome/free-solid-svg-icons';
import { Suspense, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import BigSpinner from '#/layout/BigSpinner';
import AuthenticationContext from '#/context/AuthenticationContext';
import AdminLayout, { AdminLayoutProps } from '#/components/common/admin/AdminLayout';

export default function Dashboard() {
  const { t } = useTranslation('app');
  const [authentication, updateAuthentication] = useContext(AuthenticationContext);

  const navigation = useMemo(() => ([
    {
      name: t('admin.menu.dashboard'),
      href: '/admin',
      icon: faHouse,
      current: false,
    },
    {
      name: t('admin.menu.invitees'),
      href: '/admin/invitees',
      icon: faPerson,
      current: false,
    },
    {
      name: t('admin.menu.cards'),
      href: '/admin/cards',
      icon: faEnvelope,
      current: false,
    },
    {
      name: t('admin.menu.tables'),
      href: '/admin/tables',
      icon: faChair,
      current: false,
    },
    {
      name: t('admin.menu.users'),
      href: '/admin/users',
      icon: faUser,
      current: false,
    },
  ] satisfies AdminLayoutProps['navigation']), [t]);
  const userNavigation = useMemo(() => ([
    {
      name: t('menu.logout'),
      onClick: () => {
        updateAuthentication(null);
      },
    },
  ] satisfies AdminLayoutProps['userNavigation']), [t, updateAuthentication]);

  return (
    <AdminLayout
      navigation={navigation}
      userNavigation={userNavigation}
      user={authentication?.username}
    >
      <Suspense fallback={<BigSpinner />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  );
}
