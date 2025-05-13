import { StatusBar } from 'expo-status-bar';
import './global.css';
import AppRouter from '~/router';
import { ImageBackground, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require('./assets/background/bg.png')}
        className="flex-1 justify-center"
        blurRadius={6}
        resizeMode="cover">
        <AppRouter></AppRouter>
      </ImageBackground>
    </View>
  );
}
