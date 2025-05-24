import { createContext, useEffect, useState } from "react";
import storage from "./index"; // Твой AsyncStorage / MMKV / SecureStore

const authTokenKey = "AuthToken";
const isLoggedKey = "isLogged";

export const authContext = createContext<{
  login: (token: string) => void;
  logout: () => void;
  isLogged: boolean | null;
  getToken: () => Promise<string | null>;
}>({
  login: () => {},
  logout: () => {},
  isLogged: null,
  getToken: async () => null,
});

export default function AuthProvider(
  { children }: { children: React.ReactNode },
) {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    checkLogin();
  }, []);

  async function getToken(): Promise<string | null> {
    try {
      const token = await storage.load({ key: authTokenKey });
      return token || null;
    } catch (e) {
      console.error("Ошибка получения токена:", e);
      return null;
    }
  }

  function login(token: string) {
    storage
      .save({
        key: authTokenKey,
        data: token,
      })
      .then(() =>
        storage.save({
          key: isLoggedKey,
          data: true,
        })
      )
      .then(() => {
        setIsLogged(true);
      })
      .catch((e) => {
        console.error("Ошибка сохранения токена:", e);
      });
  }

  function logout() {
    storage
      .remove({ key: authTokenKey })
      .then(() => storage.save({ key: isLoggedKey, data: false }))
      .then(() => {
        setIsLogged(false);
      })
      .catch((e) => {
        console.error("Ошибка выхода:", e);
      });
  }

  async function checkLogin() {
    try {
      const result = await storage.load({ key: isLoggedKey });
      setIsLogged(Boolean(result));
    } catch (e) {
      setIsLogged(false);
    }
  }

  const value = {
    getToken,
    isLogged,
    login,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
