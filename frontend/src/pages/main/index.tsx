import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Image, Text, View } from 'react-native';
import Button from '~/ui/button';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import useMainPage from './useMainPage';
import LoadingPage from '../loading';
import { useNavigation } from '@react-navigation/native';

export default function () {
  const { logout, userInfo, loading, image, pickImage } = useMainPage();

  const navigate = useNavigation();

  if (loading || userInfo == null) {
    return <LoadingPage />;
  }

  return (
    <MenuProvider>
      <View className="flex h-full flex-1 items-center justify-center">
        <Menu
          style={{
            position: 'absolute',
            top: 70,
            right: 30,
            width: 'auto',
          }}>
          <MenuTrigger>
            <View className="rounded-lg bg-blue-400 px-2 py-1">
              <Entypo size={24} color="white" name="dots-three-horizontal" />
            </View>
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                marginTop: 40,
                borderRadius: 10,
                width: 'auto',
                paddingInline: 5,
              },
            }}>
            <MenuOption
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
              }}
              onSelect={pickImage}>
              <MaterialCommunityIcons name="face-man-profile" size={24} />
              <Text className="text-lg">Change Avatar</Text>
            </MenuOption>
            <MenuOption
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
              }}
              onSelect={logout}>
              <MaterialIcons name="exit-to-app" color="red" size={24} />
              <Text className="text-lg">Logout</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <View className="items-stretch">
          <View className="mb-[40px] flex-row items-center gap-[10px]">
            <Image
              className="h-[100px] w-[100px] rounded-full"
              source={
                image == null
                  ? userInfo.avatarUrl == null
                    ? require('./test-avatar.png')
                    : {
                        uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}${userInfo.avatarUrl}`,
                      }
                  : { uri: image }
              }
            />
            <View className="gap-1">
              <Text className="text-2xl text-white">{userInfo.nickname}</Text>
              <View className="mx-auto flex w-max flex-row items-center gap-2 rounded-full bg-blue-400 px-3 py-1 text-white">
                <View className="flex-row items-center gap-1">
                  <FontAwesome6 name="medal" size={15} color="gold" />
                  <Text className="text-[16px] text-white">{userInfo.winGamesCount}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name="close-circle" size={20} color="red" />
                  <Text className="text-[16px] text-white">{userInfo.loseGamesCount}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="gap-[20px]">
            <Button
              onPress={() =>
                navigate.navigate('WaitGame', {
                  type: 'search',
                })
              }
              className="flex items-center rounded-xl bg-white px-7 py-4">
              <View className="flex-row items-center gap-2">
                <FontAwesome6 name="gamepad" size={24} />
                <Text className="flex-1 text-center text-xl">Fast play</Text>
              </View>
            </Button>
            <Button
              onPress={() => navigate.navigate('CreateGameWithFrieds')}
              className="flex min-w-max items-center rounded-xl bg-blue-400 px-7 py-4">
              <View className="flex-row items-center gap-2">
                <FontAwesome6 name="user-group" size={24} color="white" />
                <Text className="min-w-max text-center  text-xl text-white">Play with friend</Text>
              </View>
            </Button>
            <Button
              onPress={() => navigate.navigate('ShipPlacement')}
              className="flex min-w-max items-center rounded-xl bg-blue-400 px-7 py-4">
              <View className="flex-row items-center gap-2">
                <FontAwesome6 name="user-group" size={24} color="white" />
                <Text className="min-w-max text-center  text-xl text-white">Play with friend</Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </MenuProvider>
  );
}
