import { createContext, useState } from "react";
import storage from "./index";

const authTokenKey = "AuthToken";
const isLoggedKey = "isLogged";

export const authContext = createContext<
  {
    login: (token: string) => boolean;
    logout: () => boolean;
    isLogged: boolean;
    getToken: () => string;
  }
>({});

export default function () {
  const [isLogged, setIsLogged] = useState<boolean>(checkLogin());

  function getToken() {
    let token = "";
    storage.load({ key: "auth_token" })
      .then((data) => token = data);
    return token;
  }

  function login(token: string) {
    storage.save({
      key: authTokenKey,
      data: token,
    })
      .then(() => {
        storage.save({
          key: isLoggedKey,
          data: true,
        })
          .then(() => {
            setIsLogged(true);
            return true;
          });
      })
      .catch((e) => {
        console.error("error:", e);
        return false;
      });
  }

  function logout() {
    let result = false;
    storage.remove({ key: authTokenKey })
      .then(() => storage.save({ key: isLoggedKey, data: false }))
      .then(() => {
        setIsLogged(false);
        return true;
      });
  }

  function checkLogin() {
    let result = false;
    storage.load({ key: isLoggedKey })
      .then((data) => {
        return data ?? false;
      });
  }

  return {
    getToken,
    isLogged,
    logout,
    login,
    context: authContext,
  };
}
