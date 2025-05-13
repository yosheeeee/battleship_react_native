import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthPage from './pages/auth';

const Stack = createNativeStackNavigator();

export default function AppRouter() {
  return (
    <NavigationContainer
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } }}>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
