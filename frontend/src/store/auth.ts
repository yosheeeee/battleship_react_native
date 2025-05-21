import storage from "./index";

const authTokenKey = "AuthToken";
const isLoggedKey = "isLogged";

export default {
  getToken: () =>
    storage.load({ key: "auth_token" })
      .then((data) => data),
  login: (token: string) =>
    storage.save({
      key: authTokenKey,
      data: token,
    })
      .then((ret) => {
        storage.save({
          key: isLoggedKey,
          data: true,
        })
          .then((res) => true);
      })
      .then(() => true)
      .catch((e) => false),
  logout: () =>
    storage.remove({ key: authTokenKey })
      .then(() => storage.save({ key: isLoggedKey, data: false }))
      .then(() => true),
  isLogged: () =>
    storage.load({ key: isLoggedKey }).then((data) => data ?? false),
};
