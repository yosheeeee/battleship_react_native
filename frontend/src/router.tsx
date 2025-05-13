import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthPage from "./pages/auth";

const Stack = createNativeStackNavigator()

export default function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
