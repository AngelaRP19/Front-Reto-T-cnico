import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getToken, isLoggedOut } from "../services/apiClient";
import { checkOAuthSession, fetchCurrentUser } from "../features/auth/services/authService";
import { getCartScopeId, switchCartScope } from "../store/cartStore";

const AuthContext = createContext();

const USER_KEY = "authUser";

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // Rastrea de qué cuenta es el carrito actualmente cargado, para
  // rehidratarlo solo cuando cambia el usuario real (no en updates
  // como el toggle de beta tester, que reutiliza el mismo id).
  const cartScopeRef = useRef(getCartScopeId(user));

  const setUser = (data) => {
    const nextScope = getCartScopeId(data);
    const scopeChanged = nextScope !== cartScopeRef.current;

    setUserState(data);
    if (data) {
      localStorage.setItem(USER_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    if (scopeChanged) {
      cartScopeRef.current = nextScope;
      switchCartScope();
    }
  };

  const clearUser = () => setUser(null);

  useEffect(() => {
    if (user || getToken() || isLoggedOut()) return;

    checkOAuthSession()
      .then(async (data) => {
        if (data) {
          const me = await fetchCurrentUser();
          setUser({ name: data.name, email: data.email, provider: data.provider, ...me });
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
