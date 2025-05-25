// AppNavigator.jsx
import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";

// Экраны
import Main from "./pages/main";

// Контекст авторизации
import { authContext } from "./store/auth";
import AuthPage from "./pages/auth";
import AuthForm from "./pages/auth/authForm";
import { View } from "react-native";
import LoadingPage from "./pages/loading";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLogged } = useContext(authContext);

  if (isLogged === null) {
    return <LoadingPage />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isLogged ? "Main" : "Auth"}
      screenOptions={{ headerShown: false }}
    >
      {isLogged ? <Stack.Screen name="Main" component={Main} /> : (
        <>
          <Stack.Screen name="Auth" component={AuthPage} />
          <Stack.Screen name="AuthForm" component={AuthForm} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function () {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: "transparent" },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
