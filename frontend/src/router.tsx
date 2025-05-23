import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { authContext } from "./store/useAuth";
import Main from "./pages/main";
import AuthPage from "./pages/auth";
import AuthForm from "./pages/auth/authForm";
import { createStaticNavigation } from "@react-navigation/native";

function useIsSignedIn() {
  const { isLogged } = useContext(authContext);
  return isLogged;
}
function useIsNotSignedIn() {
  const { isLogged } = useContext(authContext);
  return !isLogged;
}

const Stack = createNativeStackNavigator({
  screens: {
    Main: {
      if: useIsSignedIn,
      screen: Main,
    },
    Auth: {
      if: useIsNotSignedIn,
      screen: AuthPage,
    },
    AuthForm: {
      if: useIsNotSignedIn,
      screen: AuthForm,
    },
  },
  screenOptions: {
    headerShown: false,
  },
});

export default createStaticNavigation(Stack);
