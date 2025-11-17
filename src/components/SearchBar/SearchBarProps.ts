import type {TextInput} from 'react-native';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  testID?: string;
  disabled?: boolean;
}

export type SearchBarRef = TextInput;

