import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { View } from "react-native";

export default function LoadingPage() {
  return (
    <View className="flew-1 h-full items-center justify-center">
      <View>
        <FontAwesome6
          name="spinner"
          size={60}
          color="white"
          className={"animate-spin"}
        />
      </View>
    </View>
  );
}
