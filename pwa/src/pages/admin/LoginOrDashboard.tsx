import { useContext } from 'react';
import AuthenticationContext from '#/context/AuthenticationContext';
import Login from '#/components/admin/Login';
import Dashboard from '#/components/admin/Dashboard';

export default function LoginOrDashboard() {
  const [authentication] = useContext(AuthenticationContext);

  if (authentication) {
    return <Dashboard />;
  }
  return <Login />;
}
