import { Control } from 'react-hook-form';
import { NativeSyntheticEvent, TextInputChangeEventData, KeyboardTypeOptions } from 'react-native';

export interface InputProps extends InputDefinition {
  control: Control;
}

export interface InputDefinition {
  title: string;
  keyboardType: KeyboardTypeOptions;
  name: string;
}
