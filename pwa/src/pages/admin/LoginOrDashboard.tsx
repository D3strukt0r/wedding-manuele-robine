import { useAuthenticationContext } from '#/utils/authentication';
import Login from '#/components/admin/Login';
import Dashboard from '#/components/admin/Dashboard';

export default function LoginOrDashboard() {
  const [authentication] = useAuthenticationContext();

  if (authentication) {
    return <Dashboard />;
  }
  return <Login />;
}
