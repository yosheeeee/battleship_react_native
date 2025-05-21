import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import Button from "~/ui/button";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function AuthPage() {
  return (
    <View className="h-full w-full items-center justify-center gap-5">
      <Text className="text-5xl leading-relaxed text-indigo-200">Hello!</Text>
      <View className="gap-2">
        <BaseButton text="Login" formType="login" />
        <BaseButton text="Registration" formType="registration" />
      </View>
    </View>
  );
}

function BaseButton(
  { text, formType, loading }: {
    text: string;
    formType: string;
    loading?: boolean;
  },
) {
  const navigate = useNavigation();
  return (
    <Button
      onPress={() =>
        navigate.navigate("auth-form", {
          formType,
        })}
      className="flex rounded-xl bg-sky-500 px-7 py-4 text-center"
    >
      {loading && (
        <View className="animate-spin">
          <EvilIcons name="spinner-2" size={24} color="black" />
        </View>
      )}
      <Text className="text-center text-2xl text-sky-100">{text}</Text>
    </Button>
  );
}
