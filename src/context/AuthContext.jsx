import { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "../services/apiClient";
import { checkOAuthSession } from "../features/auth/services/authService";

const AuthContext = createContext();

const USER_KEY = "authUser";

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (data) => {
    setUserState(data);
    if (data) {
      localStorage.setItem(USER_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const clearUser = () => setUser(null);

  useEffect(() => {
    if (user || getToken()) return;

    checkOAuthSession()
      .then((data) => {
        if (data) {
          setUser({ name: data.name, email: data.email, provider: data.provider });
        }
      })
      .catch(() => {
        // Caso normal: no hay sesión OAuth2 activa.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
