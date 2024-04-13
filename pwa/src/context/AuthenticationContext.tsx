import {createContext, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {api} from "../components/api.ts";
import axios from "axios";

interface DecodedJwtPayload extends JwtPayload {
  roles: string[];
  username: string;
}

interface MyJwtPayload extends Omit<DecodedJwtPayload, 'exp' | 'iat'> {
  jwt: string;
  exp: Date | null;
  iat: Date | null;
}

const AuthenticationContext = createContext<[MyJwtPayload | null, (token: string | null) => void]>([null, () => null]);

export default AuthenticationContext;

export function AuthenticationContextLoader({children}: {children: ReactNode}) {
  const [loading, setLoading] = useState(true);
  const [authentication, setAuthentication] = useState<MyJwtPayload | null>(null);

  const updateAuthentication = useCallback((token: string | null) => {
    if (token) {
      const jwt = jwtDecode<DecodedJwtPayload>(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authentication', token);
      setAuthentication({
        ...jwt,
        jwt: token,
        exp: jwt.exp ? new Date(jwt.exp * 1000) : null,
        iat: jwt.iat ? new Date(jwt.iat * 1000) : null,
      });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authentication');
      setAuthentication(null);
    }
  }, [setAuthentication]);

  useEffect(() => {
    (async () => {
      const urlParam = new URLSearchParams(window.location.search);
      const username = urlParam.get('username');
      const password = urlParam.get('password');
      if (username && password) {
        try {
          const response = await api.common.login({ username, password });
          updateAuthentication(response.token);
          // TODO: Uncomment before release
          // window.history.pushState({}, document.title, window.location.pathname);
          return;
        } catch (e) {
          // Ignore
        } finally {
          setLoading(false);
        }
      }

      const storedAuthentication = localStorage.getItem('authentication');
      if (storedAuthentication) {
        const jwt = jwtDecode<DecodedJwtPayload>(storedAuthentication);
        const expiresAt = jwt.exp ? new Date(jwt.exp * 1000) : null;
        if (expiresAt && expiresAt > new Date()) {
          // only use stored authentication if it is still valid
          updateAuthentication(storedAuthentication);
          setLoading(false);
          return;
        } else if (expiresAt && expiresAt < new Date()) {
          // remove expired stored authentication
          localStorage.removeItem('authentication');
        }
      }

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          updateAuthentication(null);
        }

        return Promise.reject(error);
      },
    );
  }, []);

  const providedData = useMemo(() => {
    return [authentication, updateAuthentication];
  }, [authentication, updateAuthentication]);

  if (loading) {
    return null;
  }

  return (
    <AuthenticationContext.Provider value={providedData}>
      {children}
    </AuthenticationContext.Provider>
  )
}
