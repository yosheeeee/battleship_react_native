import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Button from '~/ui/button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useShipPlacement, { CeelState as CellState } from './useShipPlacement';

const alph = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const textClassname = 'flex-1 text-m text-white text-center';

const avatarClassName = 'aspect-square rounded-full w-[60px] h-[60px]';

export default function ShipPlacement() {
  const { battleField, changePlacement } = useShipPlacement();
  return (
    <View className={'flex h-full w-full gap-[20px]'}>
      <View className="mt-[80px] w-full flex-row items-center justify-between px-[20px]">
        <View>
          <Image className={avatarClassName} source={require('../../main/test-avatar.png')} />
          <Text className={textClassname}>yoshee</Text>
        </View>
        <Text className="text-5xl text-white">VS</Text>
        <View>
          <Image className={avatarClassName} source={require('../../main/test-avatar.png')} />
          <Text className={textClassname}>yoshee</Text>
        </View>
      </View>
      <View className="flex h-full flex-1 items-center justify-center gap-[30px] px-[20px]">
        <Text className="text-center text-4xl text-white">Ship Placement</Text>
        <View id="table" className="h-max flex-col items-center gap-1">
          <View className="w-full flex-row items-center gap-1">
            <Text className="flex-1"></Text>
            {[...Array(10)].map((_, i) => (
              <Text className={textClassname}>{alph[i]}</Text>
            ))}
          </View>
          {battleField.map((row, i) => (
            <View className="w-full flex-row items-center gap-1">
              <Text className={textClassname}>{i + 1}</Text>
              {row.map((state, j) => (
                <TableCell state={state} i={i} j={j} />
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
          <Button className="flex min-w-max flex-row items-center gap-[5px] rounded-xl bg-green-500 px-5 py-2">
            <FontAwesome name="check" size={24} color={'white'} />
            <Text className="text-center text-xl text-white">Ready</Text>
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
