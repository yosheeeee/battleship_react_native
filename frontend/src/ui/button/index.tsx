import { ReactNode } from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

interface IButtonProps extends React.PropsWithChildren {
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
  textClassName?: string;
}

export default function Button({ children, className, onPress }: IButtonProps) {
  function onPressWithHaptic(event: GestureResponderEvent) {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };

    Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (onPress) {
      onPress(event);
    }
  }
  return (
    <TouchableOpacity onPress={onPressWithHaptic} className={className}>
      {children}
    </TouchableOpacity>
  );
}
