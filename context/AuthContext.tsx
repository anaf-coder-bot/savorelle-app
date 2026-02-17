import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  getAccessToken,
  getRefreshToken,
  getUser,
  setRefreshToken,
  setAccessToken,
  setUser as setUserSS,
  clearToken,
} from "@/utils/tokenStorage";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLogged: boolean;
  loading: boolean;

  login: (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => Promise<void>;

  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [user, setUser] = useState<User | null>(null);

  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);

  const [refreshTokenState, setRefreshTokenState] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // ✅ Load auth from SecureStore on startup
  const refreshAuth = async (): Promise<void> => {
    try {

      const access = await getAccessToken();
      const refresh = await getRefreshToken();
      const storedUser = await getUser();

      setAccessTokenState(access);
      setRefreshTokenState(refresh);

      if (storedUser?.username && storedUser?.role) {
        setUser({
          username: storedUser.username,
          role: storedUser.role,
        });
      } else {
        setUser(null);
      }

    } catch (error) {
      console.log("Auth refresh error:", error);
      setUser(null);
      setAccessTokenState(null);
      setRefreshTokenState(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once on startup
  useEffect(() => {
    refreshAuth();
  }, []);

  // ✅ Login
  const login = async (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }): Promise<void> => {

    try {

      // save to secure storage
      await setAccessToken(data.accessToken);
      await setRefreshToken(data.refreshToken);
      await setUserSS(data.user);

      // update state immediately
      setAccessTokenState(data.accessToken);
      setRefreshTokenState(data.refreshToken);
      setUser(data.user);

    } catch (error) {
      console.log("Login error:", error);
    }
  };

  // ✅ Logout
  const logout = async (): Promise<void> => {

    try {

      await clearToken();

      setAccessTokenState(null);
      setRefreshTokenState(null);
      setUser(null);

    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        refreshToken: refreshTokenState,
        isLogged: !!accessTokenState,
        loading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
