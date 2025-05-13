import { View, Text, TextInput } from 'react-native';
import useAuthForm from './useAuthForm';
import { InputProps } from '~/types/input';
import { Controller } from 'react-hook-form';
import Button from '~/ui/button';
import { useNavigation } from '@react-navigation/native';

export default function AuthForm({ route }: { route: any }) {
  const { formType } = route?.params;
  const { formInputs, onSubmit, control } = useAuthForm(formType);
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
            className="flex-1 rounded-xl bg-red-300 px-5 py-3">
            <Text className="text-center text-xl text-white">Cancel</Text>
          </Button>
          <Button className="flex-1 rounded-xl bg-green-500 px-5 py-3" onPress={onSubmit}>
            <Text className="text-center text-xl text-white">Submit</Text>
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
        render={({ formState: { errors }, field: { value, onChange } }) => (
          <TextInput
            secureTextEntry={keyboardType == 'visible-password'}
            keyboardType={keyboardType == 'visible-password' ? 'default' : keyboardType}
            onChangeText={onChange}
            value={value}
            className="rounded-xl border-2 border-indigo-200 px-3 text-lg  text-indigo-100 caret-white"
          />
        )}
        name={name}
      />
    </View>
  );
}
