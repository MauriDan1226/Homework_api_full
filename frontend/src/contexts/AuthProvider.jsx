import { useCallback, useEffect, useMemo, useState } from 'react';

import * as api from '../utils/api';
import { TOKEN_STORAGE_KEY } from '../utils/constants';
import { AuthContext } from './AuthContext';

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(null);
  // Arranca en true si hay token guardado: hay que validarlo antes de decidir
  // si el usuario esta dentro o fuera.
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(readStoredToken()));
  const [authError, setAuthError] = useState('');

  const persistSession = useCallback((nextToken, nextUser) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    } catch {
      // Si el almacenamiento esta bloqueado la sesion dura lo que dure la pestana
    }
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Nada que limpiar
    }
    setToken(null);
    setUser(null);
    setAuthError('');
  }, []);

  // Al cargar la app se valida el token guardado contra /users/me
  useEffect(() => {
    if (!token) {
      setIsCheckingSession(false);
      return undefined;
    }

    let cancelled = false;
    setIsCheckingSession(true);

    api
      .getCurrentUser(token)
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) signOut();
      })
      .finally(() => {
        if (!cancelled) setIsCheckingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, signOut]);

  const signIn = useCallback(
    async (credentials) => {
      setAuthError('');
      const data = await api.signin(credentials);
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const signUp = useCallback(
    async (credentials) => {
      setAuthError('');
      const data = await api.signup(credentials);
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isCheckingSession,
      authError,
      setAuthError,
      signIn,
      signUp,
      signOut,
    }),
    [token, user, isCheckingSession, authError, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
