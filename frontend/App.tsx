import { StatusBar } from 'expo-status-bar';

import './global.css';
import AppRouter from '~/router';
import { View } from 'react-native';

export default function App() {
  return (
    <View className='w-full h-full'>
      <StatusBar style="auto" />
      <AppRouter></AppRouter>
    </View>
  );
}
