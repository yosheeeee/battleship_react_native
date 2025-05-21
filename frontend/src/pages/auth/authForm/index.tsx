import { Text, TextInput, View } from "react-native";
import useAuthForm from "./useAuthForm";
import { InputProps } from "~/types/input";
import { Controller } from "react-hook-form";
import Button from "~/ui/button";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function AuthForm({ route }: { route: any }) {
  const { formType } = route?.params;
  const { formInputs, loading, onSubmit, control } = useAuthForm(formType);
  const navigate = useNavigation();
  return (
    <View className="w-full flex-1 items-center justify-center gap-6 px-10 py-28">
      <Text className="text-5xl text-indigo-100">{formType.toUpperCase()}</Text>
      <View className="w-full flex-1 gap-5">
        {formInputs.map((inp) => (
          <Input {...inp} control={control} key={inp.name} />
        ))}
        <View className="flex-row gap-5">
          <Button
            onPress={() => navigate.goBack()}
            className="flex-1 rounded-xl bg-red-300 px-5 py-3"
          >
            <Text className="text-center text-xl text-white">Cancel</Text>
          </Button>
          <Button
            className="flex-1 rounded-xl bg-green-500 px-5 py-3"
            onPress={onSubmit}
          >
            <View className="flex-row w-full items-center justify-center gap-2">
              {loading && (
                <FontAwesome6
                  name="spinner"
                  size={24}
                  color="white"
                  className="animate-spin"
                />
              )}
              <Text className="text-center text-xl text-white">Submit</Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
}

function Input({ title, control, keyboardType, name }: InputProps) {
  return (
    <View className="gap-1">
      <Text className="text-xl text-white">{title}</Text>
      <Controller
        control={control}
        render={(
          {
            formState: { errors },
            field: { value, onChange },
            fieldState: { error },
          },
        ) => (
          <View className="gap-1">
            <TextInput
              secureTextEntry={keyboardType == "visible-password"}
              keyboardType={keyboardType == "visible-password"
                ? "default"
                : keyboardType}
              onChangeText={onChange}
              value={value}
              className="rounded-xl border-2 border-indigo-200 px-3 text-lg  text-indigo-100 caret-white"
            />
            {<Text className="text-red-600">{error && error.message}</Text>}
          </View>
        )}
        name={name}
      />
    </View>
  );
}
