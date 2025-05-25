import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Image, Text, View } from "react-native";
import Button from "~/ui/button";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import useMainPage from "./useMainPage";
import LoadingPage from "../loading";

export default function () {
  const { logout, userInfo, loading, image, pickImage } = useMainPage();

  if (loading || userInfo == null) {
    return <LoadingPage />;
  }

  return (
    <MenuProvider>
      <View className="flex flex-1 h-full items-center justify-center">
        <Menu
          style={{
            position: "absolute",
            top: 70,
            right: 30,
            width: "auto",
          }}
        >
          <MenuTrigger>
            <View className="bg-blue-400 py-1 px-2 rounded-lg">
              <Entypo size={24} color="white" name="dots-three-horizontal" />
            </View>
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                marginTop: 40,
                borderRadius: 10,
                width: "auto",
                paddingInline: 5,
              },
            }}
          >
            <MenuOption
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
              onSelect={pickImage}
            >
              <MaterialCommunityIcons
                name="face-man-profile"
                size={24}
              />
              <Text className="text-lg">Change Avatar</Text>
            </MenuOption>
            <MenuOption
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
              onSelect={logout}
            >
              <MaterialIcons name="exit-to-app" color="red" size={24} />
              <Text className="text-lg">Logout</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <View className="items-stretch">
          <View className="flex-row gap-[10px] mb-[40px] items-center">
            <Image
              className="w-[100px] h-[100px] rounded-full"
              source={image == null
                ? userInfo.avatarUrl == null ? require("./test-avatar.png") : {
                  uri:
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}${userInfo.avatarUrl}`,
                }
                : { uri: image }}
            />
            <View className="gap-1">
              <Text className="text-white text-2xl">{userInfo.nickname}</Text>
              <View className="flex w-max mx-auto flex-row items-center gap-2 text-white bg-blue-400 px-3 py-1 rounded-full">
                <View className="flex-row items-center gap-1">
                  <FontAwesome6 name="medal" size={15} color="gold" />
                  <Text className="text-[16px] text-white">
                    {userInfo.winGamesCount}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={20}
                    color="red"
                  />
                  <Text className="text-[16px] text-white">
                    {userInfo.loseGamesCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="gap-[20px]">
            <Button className="rounded-xl px-7 items-center flex py-4 bg-white">
              <View className="flex-row gap-2 items-center">
                <FontAwesome6 name="gamepad" size={24} />
                <Text className="text-center flex-1 text-xl">Fast play</Text>
              </View>
            </Button>
            <Button className="rounded-xl px-7 py-4 min-w-max flex items-center bg-blue-400">
              <View className="flex-row gap-2 items-center">
                <FontAwesome6
                  name="user-group"
                  size={24}
                  color="white"
                />
                <Text className="text-center min-w-max  text-xl text-white">
                  Play with friend
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </MenuProvider>
  );
}
