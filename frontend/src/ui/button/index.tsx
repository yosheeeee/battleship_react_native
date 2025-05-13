import { ReactNode } from 'react';
import { Text, GestureResponderEvent, TouchableOpacity } from 'react-native';

interface IButtonProps extends React.PropsWithChildren {
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
  textClassName?: string;
}

export default function Button({ children, ...props }: IButtonProps) {
  return <TouchableOpacity {...props}>{children}</TouchableOpacity>;
}
