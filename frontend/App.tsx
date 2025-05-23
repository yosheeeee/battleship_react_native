import "./global.css";
import AppRouter from "~/router";
import { ImageBackground, View } from "react-native";
import useAuth from "~/store/useAuth";
import { DefaultTheme } from "@react-navigation/native";

export default function App() {
  const { context, ...state } = useAuth();
  return (
    <context.Provider value={state}>
      <View className="flex-1">
        <ImageBackground
          source={require("./assets/background/bg.png")}
          className="flex-1 justify-center"
          blurRadius={6}
          resizeMode="cover"
        >
          <AppRouter
            theme={{
              ...DefaultTheme,
              colors: { ...DefaultTheme.colors, background: "transparent" },
            }}
          />
        </ImageBackground>
      </View>
    </context.Provider>
  );
}
