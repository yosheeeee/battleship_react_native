import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Button from '~/ui/button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useShipPlacement, { CeelState as CellState } from './useShipPlacement';
import { useRoute } from '@react-navigation/native';
import { Socket } from 'socket.io-client';

const alph = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const textClassname = 'flex-1 text-m text-white text-center';

const avatarClassName = 'aspect-square rounded-full w-[60px] h-[60px]';

export default function ShipPlacement() {
  const route = useRoute();
  const socket = (route.params as { socket: Socket })?.socket;
  const { battleField, changePlacement, isReady, otherPlayerReady, toggleReady } = useShipPlacement(socket);

  return (
      <View className={'flex h-full w-full gap-[20px]'}>
        <View className="mt-[80px] w-full flex-row items-center justify-between px-[20px]">
          <View className="relative">
            <Image className={avatarClassName} source={require('../../main/test-avatar.png')} />
            {isReady && (
              <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <FontAwesome name="check" size={16} color="white" />
              </View>
            )}
            <Text className={textClassname}>yoshee</Text>
          </View>
          <Text className="text-5xl text-white">VS</Text>
          <View className="relative">
            <Image className={avatarClassName} source={require('../../main/test-avatar.png')} />
            {otherPlayerReady && (
              <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <FontAwesome name="check" size={16} color="white" />
              </View>
            )}
            <Text className={textClassname}>yoshee</Text>
          </View>
        </View>
        <View className="flex h-full flex-1 items-center justify-center gap-[30px] px-[20px]">
          <Text className="text-center text-4xl text-white">Ship Placement</Text>
          <View id="table" className="h-max flex-col items-center gap-1">
            <View className="w-full flex-row items-center gap-1">
              <Text className="flex-1"></Text>
              {[...Array(10)].map((_, i) => (
                  <Text key={`alph-${i}`} className={textClassname}>{alph[i]}</Text>
              ))}
            </View>
            {battleField.map((row, i) => (
                <View key={`row-${i}`} className="w-full flex-row items-center gap-1">
                  <Text className={textClassname}>{i + 1}</Text>
                  {row.map((state, j) => (
                      <TableCell key={`cell-${i}-${j}`} state={state} i={i} j={j} />
                  ))}
                </View>
            ))}
          </View>
          <View className="flex-row gap-[20px]">
            <Button
                onPress={changePlacement}
                className="flex min-w-max flex-row items-center gap-[5px] rounded-xl bg-blue-500 px-5 py-2">
              <FontAwesome name="random" size={24} color={'white'} />
              <Text className="text-center text-xl text-white">Change Placement</Text>
            </Button>
            <Button 
              onPress={toggleReady}
              className={`flex min-w-max flex-row items-center gap-[5px] rounded-xl ${isReady ? 'bg-red-500' : 'bg-green-500'} px-5 py-2`}>
              <FontAwesome name={isReady ? "times" : "check"} size={24} color={'white'} />
              <Text className="text-center text-xl text-white">{isReady ? 'Cancel' : 'Ready'}</Text>
            </Button>
          </View>
        </View>
      </View>
  );
}

interface TableCellProps {
  i: number;
  j: number;
  state: CellState;
}

function TableCell({ i, j, state }: TableCellProps) {
  return (
      <Button
          className={`aspect-square flex-1 items-center justify-center rounded-md
    ${(function () {
            switch (state) {
              case CellState.EMPTY:
              case CellState.GREEN_ZONE:
                return 'bg-blue-300';
              case CellState.SHIP:
                return 'bg-pink-400';
            }
          })()}
    `}></Button>
  );
}
