import { View, Text } from 'react-native';
import useGameSocket, { GamePhase, GameSocketProps } from './useGameSocket';
import Button from '~/ui/button';
import Feather from '@expo/vector-icons/Feather';

interface Props {
  route: {
    params: GameSocketProps;
  };
}

export default function ({ route: { params: props } }: Props) {
  const { socket, copyToClipboard, isConnected, gamePhase, gameRoomId } = useGameSocket(props);
  return (
    <View className="w-full flex-1 items-center justify-center">
      {!isConnected ? (
        <Text className="text-center text-3xl text-white">Connecting to server...</Text>
      ) : (
        <View className="gap-8">
          {props.type == 'create' || props.type == 'search' ? (
            <>
              <Text className="text-center text-3xl text-white">Waiting for opponent...</Text>
              {props.type == 'create' && gameRoomId != null && (
                <Button
                  onPress={copyToClipboard}
                  className="flex flex-row items-center justify-center gap-2">
                  <Text className="text-2xl text-white">Game Code: {gameRoomId}</Text>
                  <Feather name="copy" size={24} color={'white'} />
                </Button>
              )}
            </>
          ) : (
            <Text className="text-center text-3xl text-white">Connecting to game...</Text>
          )}
        </View>
      )}
      {/* <Text className="text-center text-3xl text-white">Waiting for opponent...</Text> */}
    </View>
  );
}
