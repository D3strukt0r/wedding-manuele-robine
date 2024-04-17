import AdminLayout, {AdminLayoutProps} from '../common/admin/AdminLayout.tsx';
import {faHouse} from '@fortawesome/free-solid-svg-icons';
import {useContext} from 'react';
import AuthenticationContext from '../../context/AuthenticationContext.tsx';
import {useTranslation} from 'react-i18next';

export default function Dashboard() {
  const {t} = useTranslation("app");
  const [authentication, updateAuthentication] = useContext(AuthenticationContext);

  const navigation = [
    {
      name: t('admin.menu.dashboard'),
      href: '#',
      icon: faHouse,
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
    />
  );
}
