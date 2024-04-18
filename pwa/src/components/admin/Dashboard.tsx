import AdminLayout, {AdminLayoutProps} from '../common/admin/AdminLayout.tsx';
import {faChair, faEnvelope, faHouse, faPerson} from '@fortawesome/free-solid-svg-icons';
import {Suspense, useContext} from 'react';
import AuthenticationContext from '../../context/AuthenticationContext.tsx';
import {useTranslation} from 'react-i18next';
import {Outlet} from 'react-router-dom';
import BigSpinner from '../../layout/BigSpinner.tsx';
import {faUser} from '@fortawesome/free-regular-svg-icons';

export default function Dashboard() {
  const {t} = useTranslation("app");
  const [authentication, updateAuthentication] = useContext(AuthenticationContext);

  const navigation = [
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
  ] satisfies AdminLayoutProps['navigation'];
  const userNavigation = [
    {
      name: t('menu.logout'),
      onClick: () => {
        updateAuthentication(null);
      },
    },
  ] satisfies AdminLayoutProps['userNavigation'];

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
