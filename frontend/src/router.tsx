// AppNavigator.jsx
import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';

// Экраны
import Main from './pages/main';

// Контекст авторизации
import { authContext } from './store/auth';
import AuthPage from './pages/auth';
import AuthForm from './pages/auth/authForm';
import { View } from 'react-native';
import LoadingPage from './pages/loading';
import Waiting from './pages/game/waiting';
import createGameWithFrieds from './pages/game/createGame/createGameWithFrieds';
import ShipPlacement from './pages/game/shipPlacement';
import Game from './pages/game/game';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLogged } = useContext(authContext);

  if (isLogged === null) {
    return <LoadingPage />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isLogged ? 'Main' : 'Auth'}
      screenOptions={{ headerShown: false }}>
      {isLogged ? (
        <>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="WaitGame" component={Waiting} />
          <Stack.Screen name="CreateGameWithFrieds" component={createGameWithFrieds} />
          <Stack.Screen name="ShipPlacement" component={ShipPlacement} />
          <Stack.Screen name="Game" component={Game} />
        </>
      ) : (
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
        colors: { ...DefaultTheme.colors, background: 'transparent' },
      }}>
      <AppNavigator />
    </NavigationContainer>
  );
}
