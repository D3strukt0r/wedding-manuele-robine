import {useContext} from "react";
import AuthenticationContext from "../../context/AuthenticationContext.tsx";
import Login from "../../components/admin/Login.tsx";
import Dashboard from "../../components/admin/Dashboard.tsx";

export default function LoginOrDashboard() {
  const [authentication] = useContext(AuthenticationContext);

  if (authentication) {
    return <Dashboard />;
  } else {
    return <Login />;
  }
}
