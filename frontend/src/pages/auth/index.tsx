import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import Button from '~/ui/button';

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

function BaseButton({ text, formType }: { text: string; formType: string }) {
  const navigate = useNavigation();
  return (
    <Button
      onPress={() =>
        navigate.navigate('auth-form', {
          formType,
        })
      }
      className="flex rounded-xl bg-sky-500 px-7 py-4 text-center">
      <Text className="text-center text-2xl text-sky-100">{text}</Text>
    </Button>
  );
}
