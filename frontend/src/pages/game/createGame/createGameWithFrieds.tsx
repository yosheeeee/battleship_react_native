import { View, Text } from 'react-native';
import Button from '~/ui/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '~/pages/auth/authForm';
import { useNavigation } from '@react-navigation/native';

export default function () {
  const [enterCode, setEnterCode] = useState(false);
  const navigation = useNavigation();
  return (
    <View className="w-full flex-1 items-center justify-center">
      {enterCode ? (
        <EnterCodeView cancel={() => setEnterCode(false)} />
      ) : (
        <View className="gap-4">
          <Button
            onPress={() =>
              navigation.navigate('WaitGame', {
                type: 'create',
                private: true,
              })
            }
            className="flex min-w-max items-center rounded-xl bg-white px-7 py-4">
            <View className="flex-row items-center justify-between gap-2">
              <Ionicons name="create-outline" size={25} />
              <Text className="flex-1 text-center text-xl">Create Game</Text>
            </View>
          </Button>
          <Button
            onPress={() => setEnterCode(true)}
            className="flex min-w-max items-center rounded-xl bg-white px-7 py-4">
            <View className="flex-row items-center justify-between gap-2">
              <FontAwesome6 name="paste" size={24} />
              <Text className="text-center text-xl">Enter game code</Text>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
}

function EnterCodeView({ cancel }: { cancel: () => void }) {
  const navigation = useNavigation();
  const { setError, handleSubmit, ...props } = useForm();

  const onSubmit = handleSubmit((data) => {
    if (!data.gameCode || data.gameCode.length == '') {
      setError('gameCode', { message: 'Game code is required' });
      return;
    }
    console.log('navigating');
    navigation.navigate('WaitGame', {
      type: 'join',
      gameCode: data.gameCode,
    });
  });

  return (
    <View className="w-full gap-2 px-10">
      <Input title={'Game Code'} keyboardType={'number-pad'} name={'gameCode'} {...props} />
      <View className="min-w-max flex-row gap-5">
        <Button onPress={cancel} className="min-w-max flex-1 rounded-xl bg-red-300 px-5 py-3">
          <Text className="text-center text-xl text-white">Cancel</Text>
        </Button>
        <Button onPress={onSubmit} className="flex-1 rounded-xl bg-green-500 px-5 py-3">
          <View className="w-full flex-row items-center justify-center gap-2">
            <Text className="text-center text-xl text-white">Submit</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
