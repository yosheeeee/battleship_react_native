import "./global.css";
import AppRouter from "~/router";
import { ImageBackground, Text, View } from "react-native";
import AuthProvider from "~/store/auth";
import LoadingPage from "~/pages/loading";

export default function App() {
  return (
    <AuthProvider>
      <View className="flex-1">
        <ImageBackground
          source={require("./assets/background/bg.png")}
          className="flex-1 justify-center"
          blurRadius={6}
          resizeMode="cover"
        >
          <AppRouter />
        </ImageBackground>
      </View>
    </AuthProvider>
  );
}
