import { View, Text } from 'react-native';
import useAuthForm from './useAuthForm';

export default function AuthForm({ route }: { route: any }) {
  const { formType } = route?.params;
  const {} = useAuthForm(formType);
  return (
    <View className="w-full flex-1 items-center justify-center">
      <Text className="text-5xl text-indigo-200">Auth Form</Text>
    </View>
  );
}
