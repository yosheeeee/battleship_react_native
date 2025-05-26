import { View, Text } from 'react-native';

interface Props {
  gameCode?: string;
  private?: boolean;
  type: 'join' | 'create' | 'search';
}

export default function (props: Props) {
  return (
    <View className="w-full flex-1 items-center justify-center">
      <Text className="text-center text-3xl text-white">Waiting for opponent...</Text>
    </View>
  );
}
